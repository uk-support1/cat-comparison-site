// Keep canonical URLs and sitemap entries in sync for the cat subdomain.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const domain = 'https://cat.kurashi-partner-ku.com';

const canonicalPages = [
  'about.html', 'contact.html', 'editorial-policy.html', 'privacy.html',
  'breeds/media-credits.html', 'breeds/paw-pop.html',
  'articles/tofukasu-k-guide.html', 'articles/lion-okara-guide.html',
  'articles/pidan-guide.html', 'articles/tofukasu-tab-guide.html',
  'articles/okara-basics.html', 'articles/how-to-choose.html',
  'articles/odor-control.html', 'articles/clumping.html', 'articles/kitten-guide.html',
  'articles/multi-cat-guide.html'
];

for (const page of canonicalPages) {
  const file = path.join(root, page);
  let html = fs.readFileSync(file, 'utf8');
  const canonical = `${domain}/${page}`;
  if (!/rel=["']canonical["']/i.test(html)) html = html.replace(/<\/head>/i, `<link rel="canonical" href="${canonical}">\n</head>`);
  html = html.replaceAll('href="../index.html"', 'href="../"').replaceAll('href="index.html"', 'href="./"');
  fs.writeFileSync(file, html);
}

for (const page of ['index.html', 'breeds/index.html', 'breeds/profile.html', 'cat-home.html']) {
  const file = path.join(root, page);
  let html = fs.readFileSync(file, 'utf8');
  html = html.replaceAll('href="../index.html"', 'href="../"').replaceAll('href="index.html"', 'href="./"');
  fs.writeFileSync(file, html);
}

const staticProfiles = fs.readdirSync(path.join(root, 'breeds'), { withFileTypes: true })
  .filter(entry => entry.isDirectory() && fs.existsSync(path.join(root, 'breeds', entry.name, 'index.html')))
  .map(entry => entry.name)
  .filter(name => fs.readFileSync(path.join(root, 'breeds', name, 'index.html'), 'utf8').includes('data-breed='))
  .sort();

const pages = [
  ['/', '2026-10-10'],
  ['/articles/', '2026-10-04'],
  ['/articles/cat-allergy.html', '2026-10-04'],
  ['/articles/cat-allergy-deep-guide.html', '2026-10-04'],
  ['/breeds/', '2026-10-04'],
  ['/breeds/media-credits.html', '2026-10-04'],
  ...staticProfiles.map(id => [`/breeds/${id}/`, '2026-10-13']),
  ['/articles/tofukasu-k-guide.html', '2026-09-30'],
  ['/articles/lion-okara-guide.html', '2026-09-30'],
  ['/articles/pidan-guide.html', '2026-09-30'],
  ['/articles/tofukasu-tab-guide.html', '2026-09-30'],
  ['/articles/okara-basics.html', '2026-09-30'],
  ['/articles/how-to-choose.html', '2026-09-30'],
  ['/articles/odor-control.html', '2026-09-30'],
  ['/articles/clumping.html', '2026-09-30'],
  ['/articles/kitten-guide.html', '2026-09-30'],
  ['/articles/multi-cat-guide.html', '2026-09-30'],
  ['/editorial-policy.html', '2026-09-30'],
  ['/privacy.html', '2026-09-30'],
  ['/about.html', '2026-09-30'],
  ['/compare/okara-litter.html', '2026-10-01'],
  ['/compare/cat-toilets.html', '2026-10-03'],
  ['/contact.html', '2026-10-01']
];
const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...pages.map(([url, lastmod]) => `  <url><loc>${domain}${url}</loc><lastmod>${lastmod}</lastmod></url>`), '</urlset>', ''].join('\n');
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log(`Normalized ${canonicalPages.length} canonical tags and wrote ${pages.length} sitemap URLs.`);
