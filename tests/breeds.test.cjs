const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const context={window:{}};
vm.runInNewContext(read('breeds/data.js'),context);
const data=context.window;
const added=['american-curl','somali','abyssinian','exotic','himalayan','siberian'];
assert.equal(data.BREEDS.length,19);
assert.equal(new Set(data.BREEDS.map(b=>b.id)).size,19);
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
  const extension=id==='somali'?'jpg':'png';
  assert.ok(breed.profileMedia.url.endsWith(id+'-adult.'+extension));
  assert.ok(data.KITTEN_MEDIA[id].url.endsWith(id+'-kitten.'+extension));
  assert.ok(read('sitemap.xml').includes('profile.html?breed='+id));
}
assert.equal(data.POPULAR_BREEDS.length,10);
assert.equal(Array.from(data.POPULAR_BREEDS).join(','),'american-shorthair,ragamuffin,british-shorthair,siberian,ragdoll,scottish-fold,munchkin,maine-coon,norwegian-forest,persian');
for(const id of data.POPULAR_BREEDS)assert.ok(data.BREEDS.some(b=>b.id===id));
const css=read('breeds/popular.css');
assert.ok(css.includes('repeat(5,minmax(0,1fr))'));
assert.ok(css.includes('repeat(3,minmax(0,1fr))'));
assert.ok(css.includes('.popular-breed-item:nth-child(n+10){display:none}'));
assert.ok(css.includes('border-radius:50%'));
assert.ok(css.includes('object-fit:cover'));
const html=read('breeds/index.html');
assert.ok(html.includes('18猫種＋ミックス'));
assert.ok(html.includes('<h2 id="popular-breeds-title">人気の猫種ランキング</h2>'));
assert.ok(!html.includes('ランキングから子猫を探す'));
assert.ok(html.includes('href="#encyclopedia"'));
assert.ok(html.includes('販売・登録数に基づく人気順位ではありません'));
assert.ok(read('breeds/profile.js').includes('動画準備中'));
const clips=JSON.parse(read('breeds/video-sources.json')).videos;
assert.equal(clips.length,11);
assert.equal(Object.keys(data.PROFILE_VIDEOS).length,11);
for(const clip of clips){
  assert.ok(data.BREEDS.some(b=>b.id===clip.breed));
  assert.equal(data.PROFILE_VIDEOS[clip.breed],'../assets/breeds/'+clip.file);
  const bytes=fs.readFileSync(path.join(root,'assets/breeds',clip.file));
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),clip.sha256,clip.file);
}
assert.ok(read('breeds/profile.js').includes('autoplay muted loop playsinline'));
assert.ok(read('breeds/profile.js').includes('prefers-reduced-motion'));
assert.ok(read('breeds/app.js').includes('index<3?podiumCrown'));
assert.ok(css.includes('.popular-podium .popular-breed-photo'));
assert.ok(read('breeds/style.css').includes('object-fit:contain!important;object-position:center!important'));
assert.equal(data.ENTRY_MOBILE_CROPS['scottish-fold'][0],1.3);
assert.equal(data.ENTRY_MOBILE_CROPS['scottish-fold'][1],'0% 0%');
assert.ok(read('breeds/style.css').includes('.ragdoll-basic-profile .ragdoll-profile-video-screen video{display:block;width:100%;height:100%;object-fit:cover}'));
assert.ok(!read('breeds/style.css').includes('.ragdoll-profile-video-screen::before'));
assert.ok(!read('breeds/profile.js').includes('--profile-video-poster'));
assert.ok(data.PROFILE_MEDIA.munchkin.url.endsWith('munchkin-adult-v2.jpg'));
assert.ok(data.KITTEN_MEDIA['maine-coon'].url.endsWith('maine-coon-kitten-v2.jpg'));
assert.ok(read('breeds/profile.js').includes("breed.id==='british-shorthair'&&!!portraitProfile.videoUrl"),'frame trial is British-only');
assert.ok(read('breeds/profile.js').includes("if(videoBackground)basicProfile.classList.add('profile-video-background')"));
assert.ok(read('breeds/profile.js').includes('class="profile-background-media" aria-hidden="true"'));
assert.ok(read('breeds/profile.js').includes('if(portraitProfile.videoUrl&&!videoBackground)'),'background gets no caption, controls or enlargement dialog');
assert.ok(read('breeds/profile.js').includes('reducedMotion.matches||document.hidden'),'respect reduced motion and hidden tabs');
assert.ok(!read('breeds/profile.js').includes('profile-video-landscape-frame'));
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'assets/iphone-15-frame.png'))).digest('hex'),'ba4d44d3d94a0b5f4afb0a66907f8ffb7dd6d8bd35c4f3387774f5574b8e3da4','reuse the original transparent iPhone frame without editing it');
assert.ok(!read('breeds/profile.js').includes('data-video-view-button'));
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'assets/angled-laptop-frame-v1.png'))).digest('hex'),'fe328e329013e868ca1786358efc22d7fd12a078a91bda67858328ac6adf444a');
assert.ok(!read('breeds/profile.js').includes('projectLaptopScreen'));
assert.ok(read('breeds/style.css').includes('.profile-video-background.ragdoll-basic-profile{position:relative;isolation:isolate;overflow:hidden;'));
assert.ok(read('breeds/style.css').includes('filter:blur(3px) saturate(.7)'));
assert.ok(read('breeds/style.css').includes('.profile-video-background .ragdoll-profile-description p{color:#423a33}'));
assert.ok(!read('breeds/style.css').includes('.profile-video-device::after'));
console.log('PASS: 18 breeds + mix, 6 shared-template additions, supplied photo/clip hashes, requested ranking order, podium crowns and responsive ranking/photos.');
