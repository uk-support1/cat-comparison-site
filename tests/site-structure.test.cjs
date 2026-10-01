const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.name.startsWith('.')||e.name==='node_modules'?[]:e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(root).filter(f=>f.endsWith('.html'));
let count=0;
for(const file of files){
 const html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/class="np-header"/g)||[]).length,1,file);
 assert.equal((html.match(/class="np-footer"/g)||[]).length,1,file);
 assert.ok(html.includes('site.css')&&html.includes('site.js'),file);
 const markup=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
 for(const [,value]of markup.matchAll(/(?:href|src)=["']([^"']+)["']/g)){
  if(/^(?:https?:|mailto:|tel:|data:|javascript:)/.test(value))continue;
  const u=new URL(value,'https://local.test/'+path.relative(root,file).replaceAll('\\','/'));
  let target=path.join(root,decodeURIComponent(u.pathname));
  if(u.pathname.endsWith('/'))target=path.join(target,'index.html');
  assert.ok(fs.existsSync(target),path.relative(root,file)+': missing '+value);
  if(u.hash && target.endsWith('.html')){
    const id=decodeURIComponent(u.hash.slice(1)), destination=fs.readFileSync(target,'utf8');
    assert.ok(destination.includes('id="'+id+'"')||destination.includes("id='"+id+"'"),'Missing anchor '+value+' from '+file);
  }
  count++;
 }
}
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.equal((home.match(/<h1\b/g)||[]).length,1);
assert.ok(!home.includes('const products='));
for(const category of ['litter','toilets','carriers'])assert.ok(home.includes('data-category-card="'+category+'"'));
assert.ok(home.includes('<article class="np-category-card np-category-soon" data-category-card="toilets">'));
const contact=fs.readFileSync(path.join(root,'contact.html'),'utf8');
assert.ok(contact.includes('https://formspree.io/f/xvkgynqy'));
assert.ok(!contact.includes('mailto:'));
assert.ok(!fs.readFileSync(path.join(root,'about.html'),'utf8').includes('上原'));
console.log('PASS: '+files.length+' pages share navigation/footer; '+count+' local links/assets/anchors resolve; portal categories and contact preserved.');

// Verify the central nav and legacy redirects under GitHub Pages' subdirectory.
const vm=require('node:vm');
const code=fs.readFileSync(path.join(root,'assets/site.js'),'utf8');
for(const hash of ['', '#top4', '#howto', '#cats', '#products']){
 let redirect=null;
 const nav={children:[],replaceChildren(...children){this.children=children;}};
 const doc={
  currentScript:{src:'https://example.test/cat-comparison-site/assets/site.js'},
  querySelector(selector){return selector==='.np-navigation'?nav:null;},
  querySelectorAll(){return nav.children.filter(e=>e.href);},
  createElement(){return {dataset:{},setAttribute(){},append(){}};}
 };
 const context={URL,window:{},document:doc,location:{pathname:'/cat-comparison-site/index.html',search:'?v=test',hash,replace(value){redirect=value;}}};
 vm.runInNewContext(code,context);
 assert.equal(nav.children.length,7);
 assert.equal(nav.children[1].href,'https://example.test/cat-comparison-site/compare/okara-litter.html');
 assert.equal(context.window.NekoSite.categories.length,3);
 assert.equal(context.window.NekoSite.categories[1].href,null);
 assert.equal(redirect,hash?'https://example.test/cat-comparison-site/compare/okara-litter.html?v=test'+hash:null);
}
console.log('PASS: centralized seven-item navigation, pending categories, GitHub Pages base path and four legacy anchors.');
