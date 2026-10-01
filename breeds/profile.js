const params=new URLSearchParams(location.search);const breed=BREEDS.find(item=>item.id===params.get('breed'));const root=document.getElementById('profileRoot');
const labels={affection:'甘えん坊',cuddle:'抱っこ・密着',independence:'マイペース',play:'遊び好き',quiet:'静かめ',talk:'おしゃべり',care:'お手入れ軽め'};
const escapeHtml=value=>String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
if(!breed){document.title='プロフィールが見つかりません｜猫好きのための比較サイト';root.innerHTML='<div class="wrap error"><h1>猫種が見つかりませんでした。</h1><p><a class="read" href="index.html">猫種図鑑へ戻る →</a></p></div>'}else{
document.title=`${breed.name}の性格・特徴｜猫種図鑑`;
document.querySelector('meta[name="description"]').setAttribute('content',`${breed.name}の一般的な性格、体格、被毛、お手入れ、暮らしとの相性を紹介します。`);
const distance=item=>Object.keys(labels).reduce((total,key)=>total+Math.abs(item.stats[key]-breed.stats[key]),0);
const related=[...BREEDS].filter(item=>item.id!==breed.id).sort((a,b)=>distance(a)-distance(b)).slice(0,4);
const assetUrl=media=>media.url||`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(media.file)}?width=1200`;
const featured=breed.profileMedia||FEATURED_MEDIA[breed.id]||breed.media;
const mediaUrl=assetUrl(featured);
const kitten=KITTEN_MEDIA[breed.id];
const kittenUrl=assetUrl(kitten);
root.innerHTML=`<div class="wrap breadcrumb"><a href="index.html">猫種図鑑</a> ／ ${escapeHtml(breed.name)}</div><section class="profile-hero"><div class="wrap profile-head"><span class="breed-mark" style="--breed:${breed.color}">${breed.mark}</span><div><div class="eyebrow">BREED PROFILE</div><h1>${escapeHtml(breed.name)}</h1><div class="profile-en">${escapeHtml(breed.en)}</div></div><figure class="profile-photo"><img src="${mediaUrl}" alt="${escapeHtml(breed.name)}の写真" fetchpriority="high"><figcaption><a href="${featured.page}" target="_blank" rel="noopener">写真：${escapeHtml(featured.author)}／${escapeHtml(featured.license)} ↗</a></figcaption></figure><p class="profile-summary">${escapeHtml(breed.summary)}</p></div></section><div class="wrap profile-main"><div><section class="profile-card"><h2>基本プロフィール</h2><div class="facts"><div class="fact"><span>SIZE</span><b>${escapeHtml(breed.size)}</b></div><div class="fact"><span>COAT</span><b>${escapeHtml(breed.coat)}</b></div><div class="fact"><span>ORIGIN</span><b>${escapeHtml(breed.origin)}</b></div></div><h3>性格の距離感</h3><p>${escapeHtml(breed.character)}</p><h3>一緒に暮らすイメージ</h3><p>${escapeHtml(breed.living)}</p></section><section class="profile-card kitten-card"><div class="kitten-copy"><div class="eyebrow">KITTEN MOMENT</div><h2>${escapeHtml(breed.name)}の子猫</h2><p>子猫期の表情や被毛の見え方にも個体差があります。成長後の暮らしを想像するための、かわいらしい一枚です。</p></div><figure class="kitten-photo"><img src="${kittenUrl}" alt="${escapeHtml(breed.name)}の子猫" loading="lazy" decoding="async"><figcaption><a href="${kitten.page}" target="_blank" rel="noopener">写真：${escapeHtml(kitten.author)}／${escapeHtml(kitten.license)} ↗</a></figcaption></figure></section><section class="profile-card"><h2>向きやすい暮らし</h2><ul class="profile-list">${breed.goodFor.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul><h3>日々のお手入れと環境</h3><ul class="profile-list">${breed.carePoints.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul></section><section class="profile-card"><h2>猫砂選びのヒント</h2><p>${escapeHtml(breed.litter)}</p><a class="back-guide" href="../index.html#cats">猫タイプ別の猫砂比較を見る<small>長毛・大型・子猫・多頭飼いなどから比較</small></a></section></div><aside><section class="profile-card"><h2>7つの傾向</h2><div class="trait-chart">${Object.entries(labels).map(([key,label])=>`<div class="trait-row"><span>${label}</span><span class="bar"><i style="--value:${breed.stats[key]*20}%"></i></span><b>${breed.stats[key]}</b></div>`).join('')}</div><p class="disclaimer">5段階の編集目安です。性格を保証するものではありません。</p></section><section class="profile-card"><h2>似た距離感の猫種</h2><div class="related-grid">${related.map(item=>`<a class="related-card" href="profile.html?breed=${item.id}"><b>${escapeHtml(item.name)}</b><br><span class="profile-en">${escapeHtml(item.en)}</span></a>`).join('')}</div></section><section class="profile-card"><h2>参照情報</h2><div class="source-list"><a href="${breed.source}" target="_blank" rel="noopener">猫種団体のプロフィール ↗</a><a href="media-credits.html">写真・動画素材のクレジット</a><a href="../editorial-policy.html">当サイトの編集方針</a></div><p class="disclaimer">最終確認日：2026年10月1日。猫種の傾向には大きな個体差があります。</p></section></aside></div>`;
// Reuse the completed Ragdoll presentation without changing the other breed pages.
// When an American Shorthair video is ready, set its videoUrl to the local asset path.
const portraitProfile={
  ragdoll:{kittenUrl:'../assets/breeds/ragdoll-kitten-related-v2.png',kittenAlt:'青い目とふわふわの被毛のラグドールの子猫',width:1086,height:1448,videoUrl:'../assets/breeds/ragdoll-motion.mp4'},
  'american-shorthair':{kittenUrl,kittenAlt:'茶色の縞模様のアメリカンショートヘアの子猫',width:768,height:1024,videoUrl:null}
}[breed.id];
if(portraitProfile){
  const hero=root.querySelector('.profile-hero');
  const heroPhoto=root.querySelector('.profile-photo');
  hero.classList.add('ragdoll-profile-hero');
  if(breed.id==='american-shorthair'){
    hero.classList.add('american-profile-hero');
    hero.querySelector('h1').innerHTML='<span>アメリカン</span><span>ショートヘア</span>';
  }
  hero.insertAdjacentHTML('afterbegin',`<div class="ragdoll-hero-backdrop" aria-hidden="true"><img class="ragdoll-hero-backdrop-fill" src="${mediaUrl}" alt=""><img class="ragdoll-hero-backdrop-fill-right" src="${mediaUrl}" alt=""><img class="ragdoll-hero-backdrop-main" src="${mediaUrl}" alt=""></div><a class="ragdoll-backdrop-credit" href="${featured.page}" target="_blank" rel="noopener">背景写真：${escapeHtml(featured.author)}／${escapeHtml(featured.license)} ↗</a>`);
  heroPhoto.remove();
  root.querySelector('.kitten-card')?.remove();
  const lifestyleCard=[...root.querySelectorAll('.profile-main .profile-card')].find(card=>card.querySelector('h2')?.textContent==='向きやすい暮らし');
  lifestyleCard.classList.add('ragdoll-lifestyle-card');
  const lifestyleCopy=document.createElement('div');
  lifestyleCopy.className='ragdoll-lifestyle-copy';
  while(lifestyleCard.firstChild)lifestyleCopy.append(lifestyleCard.firstChild);
  lifestyleCard.insertAdjacentHTML('afterbegin',`<figure class="ragdoll-lifestyle-photo"><div class="ragdoll-lifestyle-image"><img src="${portraitProfile.kittenUrl}" alt="${escapeHtml(portraitProfile.kittenAlt)}" width="${portraitProfile.width}" height="${portraitProfile.height}" loading="lazy" decoding="async"></div><figcaption>${escapeHtml(breed.name)}の子猫ちゃん</figcaption></figure>`);
  if(breed.id==='american-shorthair')lifestyleCard.classList.add('american-lifestyle-card');
  lifestyleCard.append(lifestyleCopy);
  const basicProfile=root.querySelector('.profile-main .profile-card');
  basicProfile.classList.add('ragdoll-basic-profile');
  const details=document.createElement('div');
  details.className='ragdoll-profile-details';
  const copy=document.createElement('div');
  copy.className='ragdoll-profile-copy';
  copy.append(basicProfile.querySelector('.facts'));
  const description=document.createElement('div');
  description.className='ragdoll-profile-description';
  while(basicProfile.children.length>1)description.append(basicProfile.children[1]);
  copy.append(description);
  details.append(copy);
  const videoContent=portraitProfile.videoUrl
    ? `<video autoplay muted loop playsinline preload="metadata" aria-label="${escapeHtml(breed.name)}の動画"><source src="${portraitProfile.videoUrl}" type="video/mp4"></video>`
    : '<div class="profile-video-placeholder"><span class="profile-video-placeholder-icon" aria-hidden="true">▷</span><span>動画準備中</span></div>';
  details.insertAdjacentHTML('beforeend',`<figure class="ragdoll-profile-video"${portraitProfile.videoUrl?'':' aria-label="アメリカンショートヘアの動画用スペース（準備中）"'}><div class="ragdoll-profile-video-screen">${videoContent}</div><img class="ragdoll-profile-video-frame" src="../assets/iphone-15-frame.png" alt="" aria-hidden="true"></figure>`);
  basicProfile.append(details);
}
}
if(breed?.individualProfile)root.querySelector('.kitten-card')?.remove();
