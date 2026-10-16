const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'breeds', 'data.js'), 'utf8'), context);

const baseUrl = 'https://cat.kurashi-partner-ku.com';
const { BREEDS, PROFILE_VIDEOS } = context.window;

for (const breed of BREEDS) {
  const page = fs.readFileSync(path.join(root, 'breeds', breed.id, 'index.html'), 'utf8');
  const json = page.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
  assert.ok(json, `${breed.id}: JSON-LD is present`);
  const graph = JSON.parse(json[1])['@graph'];
  const video = graph.find(item => item['@type'] === 'VideoObject');
  assert.ok(video, `${breed.id}: VideoObject is present`);
  assert.equal(video.name, `${breed.name}の動画｜ねこパートナー`, `${breed.id}: unique video name`);
  assert.ok(video.thumbnailUrl.startsWith(`${baseUrl}/assets/`), `${breed.id}: local absolute thumbnail URL`);
  assert.match(video.thumbnailUrl, /\.webp$/, `${breed.id}: thumbnail uses optimized image`);
  assert.match(video.uploadDate, /^\d{4}-\d{2}-\d{2}T/, `${breed.id}: ISO 8601 upload date`);
  assert.equal(video.contentUrl, `${baseUrl}/${PROFILE_VIDEOS[breed.id].replace(/^\.\.\//, '')}`, `${breed.id}: exact video content URL`);
}

for (const [pagePath, expectedPoster] of [
  ['compare/cat-toilets.html', '../assets/home/cat-toilet-1200.webp'],
  ['compare/okara-litter.html', '../assets/breeds/ragdoll-adult.webp']
]) {
  const page = fs.readFileSync(path.join(root, pagePath), 'utf8');
  assert.ok(page.includes(`poster="${expectedPoster}"`), `${pagePath}: video poster is present`);
}

const profileScript = fs.readFileSync(path.join(root, 'breeds', 'profile.js'), 'utf8');
assert.match(profileScript, /poster="\$\{mediaUrl\}"/, 'dynamic profile video uses its breed image as a poster');

console.log(`PASS: ${BREEDS.length} breed VideoObject entries include thumbnail, date and content URL; all previously posterless videos have a local poster.`);
