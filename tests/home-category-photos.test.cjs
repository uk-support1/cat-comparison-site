const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/home.css'), 'utf8');
const grid = home.match(/<div class="np-category-grid">([\s\S]*?)\n<\/div>/)[1];
const cards = [...grid.matchAll(/<a class="np-category-card"[\s\S]*?<\/a>/g)].map(match => match[0]);
assert.equal(cards.length, 2);
assert.ok(!grid.includes('<svg'));
assert.ok(!css.includes('.np-category-art'));

for (const [index, [category, file, href, title, copy]] of [
  ['litter', 'cat-litter', 'compare/okara-litter.html', '猫砂', '毎日使う一袋を、条件で比較。'],
  ['toilets', 'cat-toilet', 'compare/cat-toilets.html', '猫トイレ', '猫にも人にも使いやすいものを。']
].entries()) {
  const card = cards[index];
  assert.ok(card.includes(`data-category-card="${category}"`));
  assert.ok(card.includes(`href="${href}"`));
  assert.ok(card.includes(`<h3>${title}</h3>`));
  assert.ok(card.includes(copy));
  assert.ok(card.includes('data-category-cta'));
  assert.equal((card.match(/<img\b/g) || []).length, 1);
  assert.ok(card.indexOf('<img') < card.indexOf('class="np-category-body"'));
  assert.match(card, /width="1200" height="900" alt="[^"]+" loading="lazy" decoding="async"/);
  assert.match(card, /sizes="\(max-width:600px\) 92vw, \(max-width:1280px\) 45vw, 580px"/);
  for (const width of [600, 1200]) {
    const asset = `assets/home/${file}-${width}.webp`;
    assert.ok(card.includes(asset));
    const image = fs.readFileSync(path.join(root, asset));
    assert.equal(image.toString('ascii', 0, 4), 'RIFF');
    assert.equal(image.toString('ascii', 8, 12), 'WEBP');
    assert.ok(image.length < 150000, `${asset} must stay lightweight`);
  }
  assert.ok(fs.existsSync(path.join(root, href)));
}
assert.match(css, /\.np-category-photo\{[^}]*aspect-ratio:3\/2;object-fit:cover/);
assert.match(css, /\.np-category-grid\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.match(css, /\.np-category-grid\{grid-template-columns:1fr;gap:20px\}/);
assert.ok(!/\.np-category-photo[^}]*\{[^}]*position:absolute/.test(css));
console.log('Home category photos: two responsive, lightweight photos; text and comparison links preserved.');
