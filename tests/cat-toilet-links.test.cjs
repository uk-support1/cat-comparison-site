const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8').replace(/\r\n/g,'\n');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const html=read('compare/cat-toilets.html');
const expected={
 'deot-wide':'B09ydMyiw','iris-top':'B0i7A2BaL','amazon-hooded':'B0244Bhc8',
 'deot-kitten':'B03RxbALT','deot-simple':'B03k6uFyk','deot-fan':'B0hWjJwDM',
 'iris-half':'B0jhEuuJO','iris-full':'B0fjELKPZ','iris-large':'B02lO8p6W',
 'rakurin-open':'B02muESjf','rakurin-top':'B0b9qgjbW'
};
const slots=[...html.matchAll(/<div[^>]*data-toilet-product="([^"]+)"([^>]*)><\/div>/g)].map(([,id,attrs])=>({dataset:{toiletProduct:id},hasAttribute:name=>name==='data-toilet-compact'&&attrs.includes(name),innerHTML:''}));
assert.equal(slots.length,9);
const container={innerHTML:''};
let ready;
const document={readyState:'loading',querySelectorAll:selector=>selector==='[data-toilet-product]'?slots:selector==='[data-toilet-other-products]'?[container]:[],addEventListener(event,callback){assert.equal(event,'DOMContentLoaded');ready=callback;}};
const context={window:{},document};
const code=read('assets/cat-toilet-products.js');
vm.runInNewContext(code,context);
assert.equal(container.innerHTML,'');
ready();
assert.equal(context.window.catToiletMainProducts.length,3);
assert.equal(context.window.catToiletProducts.length,8);
const products=[...context.window.catToiletMainProducts,...context.window.catToiletProducts];
assert.equal(new Set(products.map(p=>p.id)).size,11);
for(const product of products){
 assert.equal(product.amazonUrl,'https://link.amazon/'+expected[product.id],product.name);
 assert.ok(product.variant,product.name+' must identify the linked variant');
}
const find=id=>products.find(p=>p.id===id);
for(const [id,model]of [['iris-top','PUNT-530'],['iris-half','P-NE-500-H'],['iris-full','P-NE-500-F'],['iris-large','PON-750'],['rakurin-open','RSTO-50'],['rakurin-top','RSTU-43']])assert.ok(find(id).name.includes(model),id);
assert.ok(find('amazon-hooded').variant.includes('Lサイズ／61×46×43cm'));
assert.ok(find('deot-kitten').name.includes('子猫〜5kg'));
const rendered=slots.map(s=>s.innerHTML).join('')+container.innerHTML;
const purchaseAnchors=[...rendered.matchAll(/<a\b([^>]*data-toilet-purchase="([^"]+)"[^>]*)>/g)];
assert.equal(purchaseAnchors.length,25);
for(const [,attrs,id]of purchaseAnchors){
 assert.ok(attrs.includes('href="https://link.amazon/'+expected[id]+'"'),id);
 assert.ok(attrs.includes('target="_blank"'),id);
 assert.ok(attrs.includes('rel="sponsored noopener noreferrer"'),id);
}
for(const product of products)assert.equal(purchaseAnchors.filter(([,attrs,id])=>id===product.id).length,context.window.catToiletMainProducts.includes(product)?3:2,product.id);
assert.equal((container.innerHTML.match(/class="other-product-source"/g)||[]).length,8);
assert.equal((rendered.match(/Amazonで価格を見る<span/g)||[]).length,17);
assert.equal((html.match(/class="toilet-pick-detail"/g)||[]).length,3);
const mainCard=html.match(/<article class="toilet-pick pick-system">[\s\S]*?<\/article>/)[0];
assert.equal((mainCard.match(/<a\b/g)||[]).length,1);
assert.ok(mainCard.includes('</a><div class="toilet-purchase"'));
assert.ok(!code.includes('preventDefault')&&!code.includes("gtag('config'"));
const table=html.match(/<table class="toilet-table">[\s\S]*?<\/table>/)[0].replace(/<tr class="toilet-purchase-row">[\s\S]*?<\/tr>\n/,'');
assert.equal(sha(table),'459d6d1bfaad006e0bdc858b12491c9015a22ba8b3d645fb79f198da957375ac','Existing comparison rows, evaluations and pictures remain unchanged.');
assert.equal(sha(html.match(/<article class="detail-card" id="richell">[\s\S]*?<\/article>/)[0]),'32f874f83a108c2fedad3c7ad27dc1d8220aed15636f565a9ff0877d6bebc950','Richell remains unchanged.');
assert.ok(html.includes('<a class="toilet-pick pick-open" href="#richell">'));
assert.equal(sha(html.match(/<!-- Google tag \(gtag.js\) -->[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>/)[0]),'f6e618775e57b34e8f3743a52befb7878da538eed60e19eee25d09b9811729a7','Existing GA4 setup is unchanged.');
assert.ok(html.includes('Amazonのアソシエイトとして、ねこパートナーは適格販売により収入を得ています。'));
const css=read('assets/cat-toilets.css');
assert.ok(css.includes('article.toilet-pick{height:auto;min-height:0}'));
assert.ok(css.includes('.other-product-body .other-product-link{display:flex;align-items:center;justify-content:center;min-height:46px}'));
console.log('PASS: 11 exact URLs/variants, 25 purchase links, safe attributes, 8 official source links, unchanged comparison evaluations/Richell/GA4 and no click interception.');
