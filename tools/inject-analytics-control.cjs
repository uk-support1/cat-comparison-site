const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const measurementId = 'G-XNJBFNZKBD';
const walk = directory => fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
  if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'security') return [];
  const item = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(item) : [item];
});
const pages = walk(root).filter(file => file.endsWith('.html'));
let changed = 0;
for (const file of pages) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes(measurementId)) continue;
  const assetPath = path.relative(path.dirname(file), path.join(root, 'assets', 'analytics-control.js')).replaceAll('\\', '/');
  const control = `<script src="${assetPath}?v=20261013-analytics-control2" data-analytics-control></script>\n`;
  if (html.includes('data-analytics-control')) {
    const corrected = html
      .replace(/<script src="[^\"]*analytics-control\.js[^\"]*" data-analytics-control>(?:\s*<\/script>)?\s*/, control)
      .replace(/(<script src="[^\"]*analytics-control\.js[^\"]*" data-analytics-control><\/script>)\s*<\/script>\s*(?=<script async src="https:\/\/www\.googletagmanager\.com)/g, '$1\n');
    if (corrected !== html) {
      fs.writeFileSync(file, corrected);
      changed++;
    }
    continue;
  }
  const marker = `<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}">`;
  if (!html.includes(marker)) throw new Error(`Could not find Google tag marker in ${path.relative(root, file)}`);
  fs.writeFileSync(file, html.replace(marker, control + marker));
  changed++;
}
console.log(`Added analytics opt-out bootstrap to ${changed} pages.`);
