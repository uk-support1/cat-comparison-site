const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8').replace(/\r\n/g,'\n');
const digest=s=>crypto.createHash('sha256').update(s).digest('hex');
const home=read('index.html');
const explore=home.match(/<section class="np-explore np-shell"[\s\S]*?<\/section>/)[0];
assert.equal(digest(explore),'36b9ddb5620226ace5665a0a2f67e9f27ce605725c7947ec21ba2e8dbcc4c4f8','Existing two-card explore section must remain unchanged.');
const guides=home.match(/<section class="np-life-guides np-shell"[\s\S]*?<\/section>/)[0];
assert.ok(home.indexOf(explore)<home.indexOf(guides)&&home.indexOf(guides)<home.indexOf('<section class="np-home-promise'));
assert.equal((guides.match(/class="np-life-card/g)||[]).length,4);
assert.equal((guides.match(/np-life-featured/g)||[]).length,1);
for(const name of ['cat-allergy.html','cat-allergy-deep-guide.html','kitten-guide.html','multi-cat-guide.html'])assert.ok(guides.includes('href="articles/'+name+'"'));
assert.ok(guides.includes('猫との暮らしの記事をもっと見る'));
assert.ok(guides.includes('href="articles/"'));
const mainHashes={
 'articles/cat-allergy.html':'14e9c0f7ed9967800a19ec80f6164b23df28c2763171c8ebcbb93420914c4dd2',
 'articles/cat-allergy-deep-guide.html':'385a85613036ebd3dcd28cc885b728551d3026c9805b1af8d8008da1c5eee9e6',
 'articles/index.html':'ac32ed109999470c94d41d66093ead95339bd847f203463e300ce66ba01ff611'
};
for(const [file,expected] of Object.entries(mainHashes))assert.equal(digest(read(file).match(/<main\b[^>]*>[\s\S]*?<\/main>/)[0]),expected,file+' article content unchanged');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.name.startsWith('.')||e.name==='node_modules'?[]:e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
for(const file of walk(root).filter(f=>f.endsWith('.html')&&path.basename(f)!=='cat-home.html')){
 const html=fs.readFileSync(file,'utf8');
 const header=html.match(/<header class="np-header">[\s\S]*?<\/header>/)[0];
 assert.ok(header.includes('>猫との暮らし</a>'));
 assert.ok(header.indexOf('>肉球')<header.indexOf('>猫との暮らし</a>'));
 assert.ok(header.indexOf('>猫との暮らし</a>')<header.indexOf('>運営情報</a>'));
 const footer=html.match(/<footer class="np-footer">[\s\S]*?<\/footer>/)[0];
 assert.ok(footer.includes('>猫との暮らし・お役立ちガイド</a>'));
 assert.ok(!footer.includes('猫砂の選び方ガイド'));
}
// The existing icon/action group remains untouched; guides is a new ordinary link.
const code=read('assets/site.js');
for(const base of ['https://cat.kurashi-partner-ku.com/','https://example.test/cat-comparison-site/']){
 const group={children:[],replaceChildren(...c){this.children=c;}};
 const nav={children:[],replaceChildren(...c){this.children=c;}};
 const doc={currentScript:{src:base+'assets/site.js?v=20261004-2'},
  querySelector(s){return s==='.np-nav-actions'?group:s==='.np-navigation'?nav:null;},
  querySelectorAll(s){return s==='.np-navigation a'?nav.children.filter(e=>e.href):[];},
  createElement(){return {dataset:{},setAttribute(){},append(){}};}};
 vm.runInNewContext(code,{URL,window:{},document:doc,location:{pathname:new URL(base+'articles/').pathname,hash:'',search:''}});
 assert.deepEqual(group.children.map(e=>e.dataset.navAction),['paw','breeds']);
 assert.equal(nav.children.length,8);
 assert.equal(nav.children[6].textContent,'猫との暮らし');
 assert.equal(nav.children[6].href,base+'articles/');
 assert.equal(nav.children[7].textContent,'運営情報');
}
const css=read('assets/home.css');
assert.ok(css.includes('.np-life-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))'));
assert.ok(css.includes('.np-life-grid{grid-template-columns:1fr;gap:16px}'));
assert.ok(css.includes('@media(prefers-reduced-motion:reduce){.np-life-card{transition:none}}'));
console.log('PASS: preserved explore cards and article content; four independent home cards, responsive grids, all-page fallback navigation/footer and unchanged icon group.');
