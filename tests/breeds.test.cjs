const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const context={window:{}};
vm.runInNewContext(read('breeds/data.js'),context);
const data=context.window;
const added=['american-curl','somali','abyssinian','exotic','himalayan'];
assert.equal(data.BREEDS.length,18);
assert.equal(new Set(data.BREEDS.map(b=>b.id)).size,18);
const manifest=JSON.parse(read('breeds/photo-sources.json'));
for(const photo of manifest.photos){
  const bytes=fs.readFileSync(path.join(root,'assets/breeds',photo.file));
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),photo.sha256,photo.file);
}
for(const breed of data.BREEDS.filter(b=>!b.individualProfile)){
  const adult=manifest.photos.find(p=>p.breed===breed.id&&p.role==='adult');
  assert.ok(adult,breed.id+' adult provenance');
  assert.equal(breed.entryMedia.file,adult.file);
  assert.equal(breed.carouselMedia.file,adult.file);
}
for(const id of added){
  const breed=data.BREEDS.find(b=>b.id===id);
  for(const field of ['name','en','summary','size','coat','origin','character','living','litter','source'])assert.ok(breed[field],id+' '+field);
  assert.equal(breed.goodFor.length,3);
  assert.equal(breed.carePoints.length,3);
  assert.equal(Object.keys(breed.stats).length,7);
  for(const score of Object.values(breed.stats))assert.ok(score>=1&&score<=5);
  assert.ok(breed.profileMedia.url.endsWith(id+'-adult.png'));
  assert.ok(data.KITTEN_MEDIA[id].url.endsWith(id+'-kitten.png'));
  assert.ok(read('sitemap.xml').includes('profile.html?breed='+id));
}
assert.equal(data.POPULAR_BREEDS.length,10);
for(const id of data.POPULAR_BREEDS)assert.ok(data.BREEDS.some(b=>b.id===id));
const css=read('breeds/popular.css');
assert.ok(css.includes('repeat(5,minmax(0,1fr))'));
assert.ok(css.includes('repeat(3,minmax(0,1fr))'));
assert.ok(css.includes('.popular-breed-item:nth-child(n+10){display:none}'));
assert.ok(css.includes('border-radius:50%'));
assert.ok(css.includes('object-fit:cover'));
const html=read('breeds/index.html');
assert.ok(html.includes('17猫種＋ミックス'));
assert.ok(html.includes('href="#encyclopedia"'));
assert.ok(html.includes('販売・登録数に基づく人気順位ではありません'));
assert.ok(read('breeds/profile.js').includes('動画準備中'));
console.log('PASS: 17 breeds + mix, 5 new shared-template profiles, 23 supplied photo hashes, adult-only entries and 10/9 responsive ranking.');
