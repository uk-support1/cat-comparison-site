const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const measurementId = 'G-XNJBFNZKBD';
const walk = directory => fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
  if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'security') return [];
  const item = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(item) : [item];
});
const pages = walk(root).filter(file => file.endsWith('.html') && fs.readFileSync(file, 'utf8').includes(measurementId));
assert.equal(pages.length, 43, 'Every GA4 page should be covered');
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const optOut = html.indexOf('data-analytics-control');
  const googleTag = html.indexOf(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`);
  assert.ok(optOut >= 0 && optOut < googleTag, `${path.relative(root, file)} must load opt-out control before GA4`);
}
const control = fs.readFileSync(path.join(root, 'assets', 'analytics-control.js'), 'utf8');
for (const required of [
  'ga-disable-${measurementId}', 'np_analytics_opt_out', "request === 'off'", "request === 'on'",
  'history.replaceState', 'SameSite=Lax', 'Max-Age=', 'DOMContentLoaded', 'analyticsOptOut'
]) assert.ok(control.includes(required), required);
assert.ok(!control.includes('Domain='), 'The opt-out cookie must remain host-only for cat.kurashi-partner-ku.com');
console.log(`PASS: ${pages.length} GA4 pages bootstrap the persistent browser-local analytics opt-out before Google tag loading.`);
