const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const context={window:{}};vm.runInNewContext(read('breeds/data.js'),context);const data=context.window;
const traits=['affection','cuddle','independence','play','quiet','talk','care'];
const living=['lowShedding','lowHairball','alone','children','multiPet','beginner','allergy'];
const prescribed={'american-curl':[5,4,3,5,4,2,4],somali:[4,3,3,5,4,2,4],abyssinian:[4,2,3,5,4,2,5],exotic:[5,5,3,3,5,1,4],himalayan:[4,5,4,3,5,2,1]};
const health=[5,3,3,4,4,3,3,2,3,5,4,3,2,3,3,4,5,4,3];
assert.equal(data.BREEDS.length,19);
assert.deepEqual(Array.from(data.LIVING_RATING_ITEMS,item=>item.key),living);
for(const [index,breed] of data.BREEDS.entries()){
  for(const [field,keys] of [['stats',traits],['livingStats',living]]){
    assert.deepEqual(Object.keys(breed[field]),keys,breed.id+' '+field);
    for(const key of keys)assert.ok(Number.isInteger(breed[field][key])&&breed[field][key]>=1&&breed[field][key]<=5,breed.id+' '+key);
  }
  if(prescribed[breed.id])assert.deepEqual(traits.map(k=>breed.stats[k]),prescribed[breed.id]);
  assert.equal(breed.health.caution,health[index],breed.id+' health');
  assert.ok(breed.health.points.length>=2&&breed.health.points.length<=4);
  assert.ok(breed.health.points.every(p=>typeof p==='string'&&p.length>0));
  assert.ok(breed.ratingSources.length>=2);
  for(const ref of breed.health.sources)assert.ok(data.RATING_REFERENCES[ref],ref);
}
const mix=data.BREEDS.find(b=>b.id==='mix');
assert.ok(traits.every(key=>mix.stats[key]===3));
assert.ok(living.filter(k=>k!=='allergy').every(key=>mix.livingStats[key]===3));
// Locked projection of all pre-existing prose, photos and profile fields at 9dcdb17.
const fields=['id','name','en','summary','size','coat','origin','character','living','litter','goodFor','carePoints','profileMedia','entryMedia','carouselMedia','media'];
const projection=data.BREEDS.map(b=>Object.fromEntries(fields.map(k=>[k,b[k]])));
assert.equal(crypto.createHash('sha256').update(JSON.stringify(projection)).digest('hex'),'1de61fe339ba32ae5a909fade194326afc48d330d52cb00180280d9d6a533b8d');
const js=read('breeds/profile.js');
for(const heading of ['性格・傾向','暮らしやすさ','健康'])assert.ok(js.includes('>'+heading+'</h2>'));
for(const note of ['猫種だけでは猫アレルギーの有無を判断できません','★が多いほど健康面で知っておきたい事項が多い','個々の猫が病気になる確率を示すものではありません','ミックスは両親の猫種や個体によって特徴の幅が大きくなります'])assert.ok(js.includes(note));
assert.ok(js.includes('href="../articles/cat-allergy.html"'));
assert.ok(read('articles/cat-allergy.html').includes('cat-allergy-deep-guide.html'));
assert.ok(!js.includes('<h2>7つの傾向</h2>'));
assert.ok(read('breeds/style.css').includes('grid-template-columns:repeat(2,minmax(0,1fr))'));
assert.ok(read('breeds/style.css').includes('@media(max-width:900px){.profile-ratings{grid-template-columns:1fr}'));
const css=read('breeds/style.css');
assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length,'CSS media blocks close before the shared ratings');
assert.ok(read('breeds/breed-rating-sources.md').includes('全19プロフィール'));
for(const file of ['breeds/index.html','breeds/profile.html','breeds/media-credits.html'])assert.ok(read(file).includes('data.js?v=20261004-5'));
console.log('PASS: all 19 profiles, 7+7 ratings, exact requested scores, health points/direction, allergy links, mixed-cat neutrality, unchanged existing prose/media.');
