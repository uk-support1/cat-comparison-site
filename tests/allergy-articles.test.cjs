const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const plain=h=>h.replace(/<[^>]+>/g,'').replace(/\s+/g,'');
const pages=['cat-allergy.html','cat-allergy-deep-guide.html'];
const titles=[
 '猫アレルギーでも猫と暮らせる？アレルギーが少ないとされる猫種と暮らし方のコツ',
 '猫アレルギーはなぜ起こる？Fel d 1・猫種差・個体差を詳しく解説'
];
const template=read('articles/okara-basics.html');
for(const [i,name] of pages.entries()){
 const html=read('articles/'+name);
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.equal(plain(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]),titles[i].replace(/\s/g,''));
 assert.ok(html.includes('<title>'+titles[i]+'｜ねこパートナー</title>'));
 const url='https://cat.kurashi-partner-ku.com/articles/'+name;
 assert.ok(html.includes('rel="canonical" href="'+url+'"'));
 assert.ok(html.includes('property="og:url" content="'+url+'"'));
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 assert.deepEqual(schema['@graph'].map(x=>x['@type']),['Article','BreadcrumbList']);
 assert.equal(schema['@graph'][0].headline,titles[i]);
 assert.equal(schema['@graph'][0].mainEntityOfPage,url);
 assert.equal(schema['@graph'][0].datePublished,'2026-10-04');
 assert.equal(schema['@graph'][0].dateModified,'2026-10-04');
 assert.ok(!html.includes('FAQPage')); // Google retired FAQ rich results in May 2026.
 assert.equal((html.match(/gtag\/js\?id=G-XNJBFNZKBD/g)||[]).length,1);
 assert.equal((html.match(/gtag\('config', 'G-XNJBFNZKBD'\)/g)||[]).length,1);
 for(const tag of ['header','footer'])assert.equal(html.match(new RegExp('<'+tag+' class="np-'+tag+'">[\\s\\S]*?</'+tag+'>'))[0],template.match(new RegExp('<'+tag+' class="np-'+tag+'">[\\s\\S]*?</'+tag+'>'))[0]);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(ids.length,new Set(ids).size);
 assert.ok(read('sitemap.xml').includes('<loc>'+url+'</loc>'));
 assert.ok(html.includes('医療上の注意')&&html.includes('119番'));
 for(const link of html.matchAll(/<a[^>]*href="(https?:[^" ]+)"[^>]*>/g)){
  if(link[0].includes('target="_blank"'))assert.ok(link[0].includes('rel="noopener noreferrer"'));
 }
}
const general=read('articles/'+pages[0]),deep=read('articles/'+pages[1]);
const main=general.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1].split(/<section class="allergy-references"/)[0];
const length=plain(main).length;
console.log('General guide body (excluding references): '+length+' characters.');
assert.ok(length>=3000&&length<=4500,'General guide must remain around 3,000–4,500 characters');
assert.equal((general.match(/class="allergy-rank"/g)||[]).length,7);
assert.equal((general.match(/class="allergy-tip"/g)||[]).length,7);
assert.equal((general.match(/class="allergy-before"/g)||[]).length,3);
assert.equal((general.match(/class="allergy-faq"/g)||[]).length,5);
assert.ok(general.indexOf('id="breeds"')<general.indexOf('id="cause"'));
assert.ok(general.includes('数字は当サイトの紹介順です'));
assert.ok(general.includes('科学的に「アレルギーが出にくい順」を決めたランキングではありません'));
assert.ok(general.includes('href="cat-allergy-deep-guide.html"'));
assert.ok(deep.includes('href="cat-allergy.html"'));
for(const id of ['what-is-allergy','fel-d-1','other-allergens','individual-differences','coat-length','breed-evidence','sphynx','washing','environment','igy-food','asthma','known-unknown'])assert.ok(deep.includes('id="'+id+'"'));
for(const name of ['Fel d 2','Fel d 3','Fel d 4','Fel d 7','Fel d 8'])assert.ok(deep.includes(name));
assert.ok(deep.includes('対照群のない非盲検研究')&&deep.includes('メーカー')&&deep.includes('47%'));
const context={window:{}};vm.runInNewContext(read('breeds/data.js'),context);
const links=[...general.matchAll(/profile\.html\?breed=([a-z-]+)/g)].map(x=>x[1]);
assert.deepEqual(links,['russian-blue','bengal']);
for(const id of links)assert.ok(context.window.BREEDS.some(b=>b.id===id));
const index=read('articles/index.html');
assert.ok(index.indexOf('href="cat-allergy.html"')<index.indexOf('href="cat-allergy-deep-guide.html"'));
assert.ok(index.includes('card allergy-entry'));
const css=read('articles/allergy.css');
assert.ok(css.includes('@media(max-width:620px)')&&css.includes('grid-template-columns:1fr'));
assert.ok(css.includes('overflow-x:auto'));
console.log('PASS: two linked allergy guides, short general article, 7 breeds/7 tips/3 checks/5 FAQs, 12 research sections, sources, shared chrome, GA4 and metadata.');
