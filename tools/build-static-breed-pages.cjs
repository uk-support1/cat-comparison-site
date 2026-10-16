// Generate indexable, progressive-enhancement breed pages from the shared data.
// The browser keeps using the existing profile.js UI; the generated HTML provides
// each breed's unique metadata, canonical URL and meaningful first-response text.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'breeds/data.js'), 'utf8'), context);
const { BREEDS, PROFILE_VIDEOS } = context.window;
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const baseUrl = 'https://cat.kurashi-partner-ku.com';
const videoPublishedAt = '2026-10-04T15:38:50+09:00';

const jsonLd = value => JSON.stringify(value).replace(/</g, '\\u003c');

const profileHtml = breed => {
  const canonical = `${baseUrl}/breeds/${breed.id}/`;
  const description = `${breed.name}の一般的な性格、体格、被毛、お手入れ、暮らしとの相性を紹介します。`;
  const featured = breed.profileMedia || breed.media;
  const imagePath = featured.url ? featured.url.replace(/^\.\.\//, '') : 'assets/neko-partner-logo.png';
  const videoPath = PROFILE_VIDEOS[breed.id] ? PROFILE_VIDEOS[breed.id].replace(/^\.\.\//, '') : null;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: `${breed.name}の性格・特徴｜猫種図鑑`,
        description,
        inLanguage: 'ja'
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'TOP', item: `${baseUrl}/` },
          { '@type': 'ListItem', position: 2, name: '猫種図鑑', item: `${baseUrl}/breeds/` },
          { '@type': 'ListItem', position: 3, name: breed.name, item: canonical }
        ]
      }
    ]
  };
  if (videoPath) {
    structuredData['@graph'].push({
      '@type': 'VideoObject',
      name: `${breed.name}の動画｜ねこパートナー`,
      description: `${breed.name}と暮らす雰囲気を伝える短い無音映像です。実際の個体の行動を示すものではありません。`,
      thumbnailUrl: `${baseUrl}/${imagePath}`,
      uploadDate: videoPublishedAt,
      contentUrl: `${baseUrl}/${videoPath}`,
      mainEntityOfPage: canonical,
      creator: { '@type': 'Organization', name: 'ねこパートナー', url: `${baseUrl}/` },
      inLanguage: 'ja'
    });
  }
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(breed.name)}の性格・特徴｜猫種図鑑｜ねこパートナー</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/png" sizes="192x192" href="${baseUrl}/assets/neko-partner-favicon.png">
  <meta property="og:locale" content="ja_JP">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="ねこパートナー">
  <meta property="og:title" content="${escapeHtml(breed.name)}の性格・特徴｜猫種図鑑">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${baseUrl}/${escapeHtml(imagePath)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(breed.name)}の性格・特徴｜猫種図鑑">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${baseUrl}/${escapeHtml(imagePath)}">
  <script type="application/ld+json">${jsonLd(structuredData)}</script>
  <link rel="stylesheet" href="../style.css?v=20261010-3">
  <link rel="stylesheet" href="../../assets/site.css?v=20261010-nav">
  <script defer src="../../assets/site.js?v=20261010-nav"></script>
  <script defer src="../../assets/paw-cursor.js?v=20261001-1"></script>
  <script src="../../assets/analytics-control.js?v=20261013-analytics-control2" data-analytics-control></script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XNJBFNZKBD"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-XNJBFNZKBD');</script>
</head>
<body data-breed="${escapeHtml(breed.id)}">
<header class="np-header"><div class="np-shell np-header-inner"><a class="np-brand" href="../../"><img src="../../assets/neko-partner-logo.png" alt="ねこパートナー"><span>猫用品を比べて、暮らしに合う選択を。</span></a><nav class="np-nav-actions" aria-label="楽しむコンテンツ"><a data-nav-action="breeds" href="../">猫種図鑑</a></nav><button class="np-menu-toggle" type="button" aria-expanded="false" aria-controls="np-navigation" aria-label="メニューを開く"><span aria-hidden="true">☰</span><span>メニュー</span></button><nav class="np-navigation" id="np-navigation" aria-label="メインナビゲーション"><a class="np-nav-action-copy" data-nav-action="breeds" href="../">猫種図鑑</a><a href="../../">TOP</a><a data-category-nav="litter" href="../../compare/okara-litter.html">猫砂</a><a data-category-nav="toilets" href="../../compare/cat-toilets.html">猫トイレ</a><a href="../../articles/">猫との暮らし</a><a href="../../about.html">運営情報</a><a data-nav-action="paw" href="../../breeds/paw-pop.html">肉球バブルであそぶ</a></nav></div></header>
<main id="profileRoot"><div class="wrap breadcrumb"><a href="../">猫種図鑑</a> ／ ${escapeHtml(breed.name)}</div><section class="profile-hero"><div class="wrap profile-head"><div><div class="eyebrow">BREED PROFILE</div><h1>${escapeHtml(breed.name)}</h1><div class="profile-en">${escapeHtml(breed.en)}</div><p class="profile-summary">${escapeHtml(breed.summary)}</p></div></div></section><div class="wrap profile-main"><section class="profile-card"><h2>基本プロフィール</h2><p>体格：${escapeHtml(breed.size)}／被毛：${escapeHtml(breed.coat)}／原産：${escapeHtml(breed.origin)}</p><h2>性格の距離感</h2><p>${escapeHtml(breed.character)}</p><h2>一緒に暮らすイメージ</h2><p>${escapeHtml(breed.living)}</p></section></div></main>
<footer class="np-footer"><div class="np-shell"><div class="np-footer-top"><div><a class="np-footer-brand" href="../../">ねこパートナー</a><p>くらしパートナーが運営する、猫用品比較サイト。</p></div><nav aria-label="フッターナビゲーション"><a href="../../compare/okara-litter.html">猫砂比較</a><a href="../../compare/cat-toilets.html">猫トイレ比較</a><a href="../../articles/">猫との暮らし・お役立ちガイド</a><a href="../">猫種図鑑</a><a href="../paw-pop.html">肉球バブルであそぶ</a><a href="../../about.html">運営者情報</a><a href="../../privacy.html">プライバシーポリシー</a><a href="../../editorial-policy.html">編集・広告ポリシー</a><a href="../../contact.html">お問い合わせ</a></nav></div><p class="np-footer-disclosure">Amazonのアソシエイトとして、ねこパートナーは適格販売により収入を得ています。</p><small>© ねこパートナー</small></div></footer>
<script src="../data.js?v=20261010-5"></script><script src="../profile.js?v=20261013-seo2"></script>
</body></html>`;
};

for (const breed of BREEDS) {
  const directory = path.join(root, 'breeds', breed.id);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), profileHtml(breed));
}
console.log(`Generated ${BREEDS.length} static breed pages.`);
