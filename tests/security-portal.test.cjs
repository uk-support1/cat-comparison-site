const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const page=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const pages=['security/index.html','security/tokyo/index.html','security/camera/index.html','security/tokyo/setagaya/index.html','security/tokyo/taito/index.html','security/tokyo/katsushika/index.html','security/tokyo/adachi/index.html','security/tokyo/ota/index.html','security/tokyo/nerima/index.html'];
for(const rel of pages){const html=page(rel);assert.ok(html.includes('security.css'),rel+' shared CSS');assert.ok(html.includes('security-data.js'),rel+' data');assert.ok(html.includes('security.js'),rel+' UI');assert.ok(html.includes('canonical'),rel+' canonical');assert.ok(html.includes('application/ld+json'),rel+' structured data');}
const data=page('assets/security/security-data.js');
for(const key of ['setagaya','taito','katsushika','adachi','ota','nerima'])assert.ok(data.includes(key+":"),key+' municipality record');
assert.ok(data.includes("rate:1")&&data.includes('max:40000'),'Setagaya 10/10 and ¥40k');
assert.ok(data.includes("rate:.75")&&data.includes('max:60000'),'Taito 3/4 and ¥60k');
assert.ok(data.includes('Amazon購入')&&data.includes('適格請求書'),'Ota Amazon documentation note');
assert.ok(page('assets/security/security.js').includes("'FAQPage'"),'municipality FAQ structured data');
assert.ok(fs.existsSync(path.join(root,'assets/security/home-security-hero.png')),'hero image');
const sitemap=page('kurashi-sitemap.xml');for(const rel of pages)assert.ok(sitemap.includes('https://kurashi-partner-ku.com/'+rel.replace('index.html','')),rel+' sitemap');
console.log('PASS: security portal has 9 routes, six centralized municipality records, structured data, sitemap entries, and a local hero asset.');
