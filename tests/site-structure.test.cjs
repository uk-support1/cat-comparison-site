const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.name.startsWith('.')||e.name==='node_modules'?[]:e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(root).filter(f=>f.endsWith('.html')&&path.basename(f)!=='cat-home.html'&&!path.relative(root,f).startsWith('security'+path.sep));
let count=0;
for(const file of files){
 const html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/class="np-header"/g)||[]).length,1,file);
 assert.equal((html.match(/class="np-footer"/g)||[]).length,1,file);
 assert.ok(html.includes('site.css')&&html.includes('site.js'),file);
 const header=html.match(/<header class="np-header">[\s\S]*?<\/header>/)[0];
 assert.ok(!header.includes('carriers')&&!header.includes('キャリーバッグ'),file);
 assert.match(header, /data-nav-action="paw" href="[^"]*breeds\/paw-pop\.html">肉球バブルであそぶ<\/a><\/nav><\/div><\/header>$/);
 assert.match(header, /class="np-nav-actions"[^>]*><a data-nav-action="breeds"/);
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
assert.ok(home.includes('https://cat.kurashi-partner-ku.com/'));
assert.ok(home.includes('https://kurashi-partner-ku.com/'));
assert.ok(home.includes('rel="canonical" href="https://cat.kurashi-partner-ku.com/"'));
assert.ok(home.includes('property="og:url" content="https://cat.kurashi-partner-ku.com/"'));
assert.ok(home.includes('assets/neko-partner-favicon.png'));
assert.ok(home.includes('application/ld+json'));
for(const asset of ['assets/site.css','assets/home.css','assets/neko-partner-logo.png','assets/neko-partner-favicon.png','assets/mii-mix-cat.jpg'])assert.ok(fs.existsSync(path.join(root,asset)),asset);
assert.equal(fs.readFileSync(path.join(root,'CNAME'),'utf8').trim(),'cat.kurashi-partner-ku.com');
assert.ok(fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('https://cat.kurashi-partner-ku.com/sitemap.xml'));
for(const page of ['compare/okara-litter.html','compare/cat-toilets.html']){
 const html=fs.readFileSync(path.join(root,page),'utf8');
 assert.ok(html.includes('https://cat.kurashi-partner-ku.com/'+page),page+' canonical');
}
assert.ok(!fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').includes('uk-support1.github.io'));
for(const category of ['litter','toilets'])assert.ok(home.includes('data-category-card="'+category+'"'));
assert.equal((home.match(/data-category-card=/g)||[]).length,2);
assert.ok(!home.includes('carriers')&&!home.includes('キャリーバッグ'));
assert.ok(fs.readFileSync(path.join(root,'assets/home.css'),'utf8').includes('.np-category-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))'));
assert.ok(home.includes('href="compare/cat-toilets.html" data-category-card="toilets"'));
const legacyHome=fs.readFileSync(path.join(root,'cat-home.html'),'utf8');
assert.ok(legacyHome.includes('meta http-equiv="refresh"'));
assert.ok(!legacyHome.includes('<script'));
const contact=fs.readFileSync(path.join(root,'contact.html'),'utf8');
assert.ok(contact.includes('https://formspree.io/f/xvkgynqy'));
assert.ok(!contact.includes('mailto:'));
assert.ok(!fs.readFileSync(path.join(root,'about.html'),'utf8').includes('上原'));
console.log('PASS: '+files.length+' cat pages share navigation/footer; '+count+' local links/assets/anchors resolve; portal metadata and specialist-media links preserved.');

// Verify the central nav and legacy redirects under GitHub Pages' subdirectory.
const vm=require('node:vm');
const code=fs.readFileSync(path.join(root,'assets/site.js'),'utf8');
for(const withActionGroup of [false,true])for(const hash of ['', '#top4', '#howto', '#cats', '#products']){
 let redirect=null;
 const nav={children:[],replaceChildren(...children){this.children=children;}};
 const group={children:[],replaceChildren(...children){this.children=children;}};
 const doc={
  currentScript:{src:'https://example.test/cat-comparison-site/assets/site.js'},
  querySelector(selector){return selector==='.np-navigation'?nav:selector==='.np-nav-actions'&&withActionGroup?group:null;},
  querySelectorAll(selector){return selector==='.np-navigation a'?nav.children.filter(e=>e.href):[];},
  createElement(){return {dataset:{},setAttribute(){},append(){}};}
 };
 const context={URL,window:{},document:doc,location:{pathname:'/cat-comparison-site/index.html',search:'?v=test',hash,replace(value){redirect=value;}}};
 vm.runInNewContext(code,context);
 assert.equal(nav.children.length,7);
 assert.equal(nav.children[4].textContent,'猫との暮らし');
 assert.equal(nav.children[4].href,'https://example.test/cat-comparison-site/articles/');
 assert.equal(nav.children[withActionGroup?2:1].href,'https://example.test/cat-comparison-site/compare/okara-litter.html');
 assert.equal(nav.children[6].textContent,'肉球バブルであそぶ');
 assert.equal(nav.children[6].dataset.navAction,'paw');
 assert.equal(nav.children[6].href,'https://example.test/cat-comparison-site/breeds/paw-pop.html');
 if(withActionGroup)assert.deepEqual(group.children.map(e=>e.dataset.navAction),['breeds']);
 assert.equal(context.window.NekoSite.categories.length,2);
 assert.equal(context.window.NekoSite.categories[1].href,'compare/cat-toilets.html');
 assert.equal(redirect,hash?'https://example.test/cat-comparison-site/compare/okara-litter.html?v=test'+hash:null);
}
console.log('PASS: two comparison categories, breed icon on the left, paw game last, mobile menu links, GitHub Pages base path and four legacy anchors.');
