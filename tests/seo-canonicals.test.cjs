const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const domain='https://cat.kurashi-partner-ku.com';
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const sitemap=read('sitemap.xml');
const sitemapUrls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
assert.equal(new Set(sitemapUrls).size,sitemapUrls.length,'sitemap URL uniqueness');
assert.ok(sitemapUrls.every(url=>url.startsWith(domain+'/')),'sitemap only contains the cat domain');
assert.ok(sitemapUrls.every(url=>!url.includes('?')),'sitemap has no parameter URLs');
assert.ok(!sitemap.includes('profile.html?breed='));
for(const url of sitemapUrls){
  const relative=url.slice(domain.length).replace(/^\//,'');
  const file=relative.endsWith('/')?path.join(relative,'index.html'):relative||'index.html';
  assert.ok(fs.existsSync(path.join(root,file)),url+' has a local source');
  const html=read(file);
  assert.ok(html.includes('rel="canonical" href="'+url+'"'),file+' canonical matches sitemap URL');
  assert.ok(/<title>[^<]+<\/title>/.test(html),file+' title');
  assert.ok(/<meta name="description" content="[^"]+"\s*\/?\s*>/.test(html),file+' description');
}
for(const page of ['about.html','contact.html','editorial-policy.html','privacy.html','breeds/media-credits.html','breeds/paw-pop.html','articles/tofukasu-k-guide.html','articles/lion-okara-guide.html','articles/pidan-guide.html','articles/tofukasu-tab-guide.html','articles/okara-basics.html','articles/how-to-choose.html','articles/odor-control.html','articles/clumping.html','articles/kitten-guide.html','articles/multi-cat-guide.html']){
  assert.ok(read(page).includes('rel="canonical" href="'+domain+'/'+page+'"'),page+' own canonical');
}
const legacy=read('cat-home.html');
assert.ok(legacy.includes('name="robots" content="noindex,follow"'));
assert.ok(legacy.includes('canonical" href="'+domain+'/"'));
const legacyProfile=read('breeds/profile.html');
assert.ok(legacyProfile.includes('name="robots" content="noindex,follow"'));
assert.ok(legacyProfile.includes('canonical" href="'+domain+'/breeds/"'));
for(const file of ['breeds/app.js','breeds/gallery.js','compare/okara-litter.html','articles/cat-allergy.html'])assert.ok(!read(file).includes('profile.html?breed='),file+' has no legacy profile links');
assert.equal(read('CNAME').trim(),'cat.kurashi-partner-ku.com');
assert.ok(read('robots.txt').includes('Sitemap: '+domain+'/sitemap.xml'));
assert.ok(!sitemap.includes('uk-support1.github.io'));
console.log('PASS: canonical tags, sitemap URLs, legacy noindex pages and internal breed links are normalized.');
