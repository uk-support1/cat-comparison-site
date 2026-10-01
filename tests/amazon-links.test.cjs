const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const context={URL,window:{},document:{readyState:'loading',addEventListener(){}}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'assets/amazon-links.js'),'utf8'),context);
const amazon=context.window.NekoAmazon;
const expected={
  'tofukasu-k':'B06J5TPxI','lion-okara':'B0hGBAMdj','tofukasu-tab':'B0audirSY',
  'tofukasu-sand':'B0bE9OeBM','tofukasu-ree':'B0bL1deJI','tofukasu-pee':'B036p8v5q',
  'tofukasu-shine':'B02WY2XxV','tofukasu-w':'B0jhZsioA','tofukasu-large':'B097m7oUX',
  'tea-okara':'B08xOjFM3','soap-okara':'B07NB2p0q'
};
assert.equal(amazon.products.filter(p=>p.url).length,11);
for(const [id,token] of Object.entries(expected)){
  const product=amazon.find(id);
  assert.equal(product.url,'https://link.amazon/'+token);
  assert.equal(amazon.find(product.name),product);
  for(const alias of product.aliases||[])assert.equal(amazon.find(alias),product);
  const html=amazon.button(id);
  assert.ok(html.includes(`href="${product.url}"`));
  assert.ok(html.includes('target="_blank"'));
  assert.ok(html.includes('rel="sponsored noopener noreferrer"'));
  assert.ok(html.includes('Amazonで価格を見る'));
  assert.ok(html.includes('>広告</span>'));
  if(product.offer){assert.ok(html.includes(product.offer));assert.ok(!amazon.button(id,true).includes(product.offer));}
}
assert.equal(amazon.button('pidan-mix'),'');
assert.equal(amazon.button('unknown-product'),'');
const originalUrl=amazon.find('tofukasu-k').url;
for(const invalid of ['not-a-url','javascript:alert(1)','https://example.com/amazon']){
  amazon.find('tofukasu-k').url=invalid;
  assert.equal(amazon.button('tofukasu-k'),'');
}
amazon.find('tofukasu-k').url=originalUrl;
assert.equal(amazon.button('トフカスサンドK 6L'),'');
assert.notEqual(amazon.find('トフカスサンドK 7L'),amazon.find('トフカスサンド 7L'));
assert.equal(amazon.find('トフカスＲｅｅ　７Ｌ').id,'tofukasu-ree');
const index=fs.readFileSync(path.join(root,'compare/okara-litter.html'),'utf8');
const catalog=vm.runInNewContext(index.match(/const products=(\[[\s\S]*?\]);/)[1]);
assert.equal(catalog.length,12);
assert.deepEqual(Array.from(catalog).filter(p=>!amazon.find(p.name)?.url).map(p=>p.name),['pidan おからベントナイトミックス']);
for(const file of ['compare/okara-litter.html','articles/tofukasu-k-guide.html','articles/lion-okara-guide.html','articles/tofukasu-tab-guide.html']){
  const html=fs.readFileSync(path.join(root,file),'utf8');
  assert.ok(html.includes('amazon-links.js'));
  assert.ok(html.includes('amazon-links.css'));
  assert.ok(html.includes('Amazonのアソシエイトとして、ねこパートナーは適格販売により収入を得ています。'));
  for(const [,id] of html.matchAll(/data-amazon-product="([^"]+)"/g))assert.ok(amazon.find(id)?.url,'Missing URL: '+id);
}
for(const file of ['index.html','editorial-policy.html','privacy.html'])assert.ok(!fs.readFileSync(path.join(root,file),'utf8').includes('申請準備中'));
console.log('PASS: 11 original URLs, product/alias matching, safe CTAs, 12 catalog products, disclosures and article placements.');
