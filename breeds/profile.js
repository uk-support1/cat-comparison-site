const params=new URLSearchParams(location.search);const breed=BREEDS.find(item=>item.id===params.get('breed'));const root=document.getElementById('profileRoot');
const labels={affection:'甘えん坊',cuddle:'抱っこ・密着',independence:'マイペース',play:'遊び好き',quiet:'静かめ',talk:'おしゃべり',care:'お手入れ軽め'};
const escapeHtml=value=>String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
if(!breed){document.title='プロフィールが見つかりません｜猫好きのための比較サイト';root.innerHTML='<div class="wrap error"><h1>猫種が見つかりませんでした。</h1><p><a class="read" href="index.html">猫種図鑑へ戻る →</a></p></div>'}else{
document.title=`${breed.name}の性格・特徴｜猫種図鑑`;
root.dataset.breed=breed.id;
document.querySelector('meta[name="description"]').setAttribute('content',`${breed.name}の一般的な性格、体格、被毛、お手入れ、暮らしとの相性を紹介します。`);
const distance=item=>Object.keys(labels).reduce((total,key)=>total+Math.abs(item.stats[key]-breed.stats[key]),0);
const related=[...BREEDS].filter(item=>item.id!==breed.id).sort((a,b)=>distance(a)-distance(b)).slice(0,4);
const assetUrl=media=>media.url||`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(media.file)}?width=1200`;
const featured=breed.profileMedia||FEATURED_MEDIA[breed.id]||breed.media;
const mediaUrl=assetUrl(featured);
const kitten=KITTEN_MEDIA[breed.id];
const kittenUrl=assetUrl(kitten);
root.innerHTML=`<div class="wrap breadcrumb"><a href="index.html">猫種図鑑</a> ／ ${escapeHtml(breed.name)}</div><section class="profile-hero"><div class="wrap profile-head"><span class="breed-mark" style="--breed:${breed.color}">${breed.mark}</span><div><div class="eyebrow">BREED PROFILE</div><h1>${escapeHtml(breed.name)}</h1><div class="profile-en">${escapeHtml(breed.en)}</div></div><figure class="profile-photo"><img src="${mediaUrl}" alt="${escapeHtml(breed.name)}の写真" fetchpriority="high"><figcaption><a href="${featured.page}" target="_blank" rel="noopener">写真：${escapeHtml(featured.author)}／${escapeHtml(featured.license)} ↗</a></figcaption></figure><p class="profile-summary">${escapeHtml(breed.summary)}</p></div></section><div class="wrap profile-main"><div><section class="profile-card"><h2>基本プロフィール</h2><div class="facts"><div class="fact"><span>SIZE</span><b>${escapeHtml(breed.size)}</b></div><div class="fact"><span>COAT</span><b>${escapeHtml(breed.coat)}</b></div><div class="fact"><span>ORIGIN</span><b>${escapeHtml(breed.origin)}</b></div></div><h3>性格の距離感</h3><p>${escapeHtml(breed.character)}</p><h3>一緒に暮らすイメージ</h3><p>${escapeHtml(breed.living)}</p></section><section class="profile-card kitten-card"><div class="kitten-copy"><div class="eyebrow">KITTEN MOMENT</div><h2>${escapeHtml(breed.name)}の子猫</h2><p>子猫期の表情や被毛の見え方にも個体差があります。成長後の暮らしを想像するための、かわいらしい一枚です。</p></div><figure class="kitten-photo"><img src="${kittenUrl}" alt="${escapeHtml(breed.name)}の子猫" loading="lazy" decoding="async"><figcaption><a href="${kitten.page}" target="_blank" rel="noopener">写真：${escapeHtml(kitten.author)}／${escapeHtml(kitten.license)} ↗</a></figcaption></figure></section><section class="profile-card"><h2>向きやすい暮らし</h2><ul class="profile-list">${breed.goodFor.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul><h3>日々のお手入れと環境</h3><ul class="profile-list">${breed.carePoints.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul></section><section class="profile-card"><h2>猫砂選びのヒント</h2><p>${escapeHtml(breed.litter)}</p><a class="back-guide" href="../compare/okara-litter.html#cats">猫タイプ別の猫砂比較を見る<small>長毛・大型・子猫・多頭飼いなどから比較</small></a></section></div><aside><section class="profile-card"><h2>似た距離感の猫種</h2><div class="related-grid">${related.map(item=>`<a class="related-card" href="profile.html?breed=${item.id}"><b>${escapeHtml(item.name)}</b><br><span class="profile-en">${escapeHtml(item.en)}</span></a>`).join('')}</div></section><section class="profile-card"><h2>参照情報</h2><div class="source-list"><a href="${breed.source}" target="_blank" rel="noopener">猫種団体のプロフィール ↗</a><a href="media-credits.html">写真・動画素材のクレジット</a><a href="../editorial-policy.html">当サイトの編集方針</a></div><p class="disclaimer">最終確認日：${escapeHtml(breed.reviewed||'2026年10月1日')}。猫種の傾向には大きな個体差があります。</p></section></aside></div>`;
// Only the supplied/generated clips are enabled; other breeds keep their placeholder.
const profileVideos=window.PROFILE_VIDEOS||{};
const portraitProfile={
  kittenUrl:breed.id==='ragdoll'?'../assets/breeds/ragdoll-kitten-related-v2.png':kittenUrl,
  kittenAlt:breed.individualProfile?featured.label:`${breed.name}の子猫`,
  caption:breed.individualProfile?`${breed.name}猫`:`${breed.name}の子猫ちゃん`,
  videoUrl:profileVideos[breed.id]||null
};
const titleParts={
  'scottish-fold':['スコティッシュ','フォールド'],
  'british-shorthair':['ブリティッシュ','ショートヘア'],
  'american-shorthair':['アメリカン','ショートヘア'],
  'norwegian-forest':['ノルウェージャン','フォレストキャット'],
  'american-curl':['アメリカン','カール']
};
if(portraitProfile){
  const hero=root.querySelector('.profile-hero');
  const heroPhoto=root.querySelector('.profile-photo');
  hero.classList.add('ragdoll-profile-hero');
  const photoPositions={persian:{adult:'68% top',kitten:'45% 20%'},munchkin:{adult:'right top',kitten:'85% 20%'},siamese:{kitten:'60% 20%'},somali:{kitten:'center 40%'},abyssinian:{kitten:'center 36%'}}[breed.id];
  if(photoPositions?.adult)hero.style.setProperty('--profile-adult-position',photoPositions.adult);
  if(breed.id!=='ragdoll'){
    hero.classList.add('portrait-profile-hero');
    if(breed.id==='norwegian-forest')hero.classList.add('long-name-profile-hero');
    hero.querySelector('h1').innerHTML=(titleParts[breed.id]||[breed.name]).map(part=>`<span>${escapeHtml(part)}</span>`).join('');
  }
  hero.insertAdjacentHTML('afterbegin',`<div class="ragdoll-hero-backdrop" aria-hidden="true"><img class="ragdoll-hero-backdrop-fill" src="${mediaUrl}" alt=""><img class="ragdoll-hero-backdrop-fill-right" src="${mediaUrl}" alt=""><img class="ragdoll-hero-backdrop-main" src="${mediaUrl}" alt=""></div><a class="ragdoll-backdrop-credit" href="${featured.page}" target="_blank" rel="noopener">背景写真：${escapeHtml(featured.author)}／${escapeHtml(featured.license)} ↗</a>`);
  heroPhoto.remove();
  root.querySelector('.kitten-card')?.remove();
  const lifestyleCard=[...root.querySelectorAll('.profile-main .profile-card')].find(card=>card.querySelector('h2')?.textContent==='向きやすい暮らし');
  lifestyleCard.classList.add('ragdoll-lifestyle-card');
  if(photoPositions?.kitten)lifestyleCard.style.setProperty('--profile-kitten-position',photoPositions.kitten);
  const lifestyleCopy=document.createElement('div');
  lifestyleCopy.className='ragdoll-lifestyle-copy';
  while(lifestyleCard.firstChild)lifestyleCopy.append(lifestyleCard.firstChild);
  lifestyleCard.insertAdjacentHTML('afterbegin',`<figure class="ragdoll-lifestyle-photo"><div class="ragdoll-lifestyle-image" style="--profile-kitten-image:url('${portraitProfile.kittenUrl}')"><img src="${portraitProfile.kittenUrl}" alt="${escapeHtml(portraitProfile.kittenAlt)}" loading="lazy" decoding="async"></div><figcaption>${escapeHtml(portraitProfile.caption)}</figcaption></figure>`);
  if(breed.id!=='ragdoll')lifestyleCard.classList.add('portrait-lifestyle-card');
  lifestyleCard.append(lifestyleCopy);
  const basicProfile=root.querySelector('.profile-main .profile-card');
  basicProfile.classList.add('ragdoll-basic-profile');
  basicProfile.id='basic-profile';
  const videoTrial=breed.id==='british-shorthair'&&!!portraitProfile.videoUrl;
  if(videoTrial)basicProfile.classList.add('profile-video-trial');
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
    ? `<video autoplay muted loop playsinline preload="metadata" poster="${mediaUrl}" aria-label="${escapeHtml(breed.name)}の生成動画"><source src="${portraitProfile.videoUrl}" type="video/mp4"></video>`
    : '<div class="profile-video-placeholder"><span class="profile-video-placeholder-icon" aria-hidden="true">▷</span><span>動画準備中</span></div>';
  const videoScreen=`<div class="ragdoll-profile-video-screen">${videoContent}</div>`;
  const deviceContent=videoTrial
    ? `<div class="profile-video-device">${videoScreen}</div>`
    : `${videoScreen}<img class="ragdoll-profile-video-frame" src="../assets/iphone-15-frame.png" alt="" aria-hidden="true">`;
  details.insertAdjacentHTML('beforeend',`<figure class="ragdoll-profile-video"${videoTrial?' data-video-view="landscape"':''}${portraitProfile.videoUrl?'':` aria-label="${escapeHtml(breed.name)}の動画用スペース（準備中）"`}>${deviceContent}</figure>`);
  basicProfile.append(details);
  if(portraitProfile.videoUrl){
    const player=basicProfile.querySelector('video');
    // Fill the portrait screen, keeping the main cat in view when cropping wide clips.
    const videoPosition={abyssinian:'36%',exotic:'40%',himalayan:'33%','american-shorthair':'40%','scottish-fold':'36%',munchkin:'64%',ragamuffin:'29%','maine-coon':'40%'}[breed.id]||'50%';
    player.style.objectPosition=`${videoPosition} center`;
    basicProfile.querySelector('.ragdoll-profile-video').classList.add('has-video');
    basicProfile.querySelector('.ragdoll-profile-video').insertAdjacentHTML('beforeend','<figcaption class="profile-video-caption"><span>無音ループ・生成映像</span><div class="profile-video-actions"><button class="profile-video-toggle" type="button" aria-label="動画を一時停止">一時停止</button><button class="profile-video-expand" type="button" aria-haspopup="dialog">動画を拡大</button></div></figcaption>');
    if(videoTrial){
      const figure=basicProfile.querySelector('.ragdoll-profile-video');
      figure.querySelector('.profile-video-caption').insertAdjacentHTML('afterbegin',`<p class="profile-video-trial-note">画面の形を選んで、映像全体を見比べる</p><div class="profile-video-views" role="group" aria-label="動画フレームの表示方式">${[['landscape','横向きスマホ'],['monitor','PCモニター'],['portrait','縦向きスマホ']].map(([view,label])=>`<button type="button" data-video-view-button="${view}" aria-pressed="${view==='landscape'}">${label}</button>`).join('')}</div>`);
      figure.querySelectorAll('[data-video-view-button]').forEach(button=>button.addEventListener('click',()=>{
        figure.dataset.videoView=button.dataset.videoViewButton;
        figure.querySelectorAll('[data-video-view-button]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
      }));
      // Match the frame to the actual source; never crop or rescale the footage itself.
      const setVideoRatio=()=>{if(player.videoWidth&&player.videoHeight)figure.style.setProperty('--trial-video-ratio',player.videoWidth/player.videoHeight)};
      player.addEventListener('loadedmetadata',setVideoRatio);
      setVideoRatio();
    }
    const toggle=basicProfile.querySelector('.profile-video-toggle');
    const syncPlayback=()=>{toggle.textContent=player.paused?'再生':'一時停止';toggle.setAttribute('aria-label',player.paused?'動画を再生':'動画を一時停止')};
    player.addEventListener('play',syncPlayback);
    player.addEventListener('pause',syncPlayback);
    toggle.addEventListener('click',()=>{if(player.paused)player.play().catch(syncPlayback);else player.pause()});
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){player.autoplay=false;player.pause()}
    syncPlayback();
    root.insertAdjacentHTML('beforeend',`<dialog class="profile-video-dialog" aria-labelledby="profileVideoTitle"><div class="profile-video-dialog-head"><h2 id="profileVideoTitle">${escapeHtml(breed.name)}の動画</h2><button class="profile-video-close" type="button">閉じる</button></div><video controls muted loop playsinline preload="none" poster="${mediaUrl}" aria-label="${escapeHtml(breed.name)}の生成動画（拡大）"></video><p>ねこパートナー提供の生成映像です。</p></dialog>`);
    const dialog=root.querySelector('.profile-video-dialog');
    if(videoTrial)dialog.classList.add('profile-video-trial-dialog');
    const expandedPlayer=dialog.querySelector('video');
    let resumePreview=false;
    basicProfile.querySelector('.profile-video-expand').addEventListener('click',()=>{
      resumePreview=!player.paused;player.pause();
      if(!expandedPlayer.src)expandedPlayer.src=portraitProfile.videoUrl;
      dialog.showModal();expandedPlayer.play().catch(()=>{});
    });
    dialog.querySelector('.profile-video-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('close',()=>{expandedPlayer.pause();if(resumePreview)player.play().catch(syncPlayback)});
  }
  // Keep narrow-screen photos below the actual copy, including long names/summaries.
  {
    const summary=hero.querySelector('.profile-summary');
    const adultPhoto=hero.querySelector('.ragdoll-hero-backdrop-main');
    const updatePortraitTop=()=>{
      hero.style.setProperty('--profile-portrait-top',`${Math.ceil(summary.getBoundingClientRect().bottom-hero.getBoundingClientRect().top+24)}px`);
      const ratio=adultPhoto.naturalWidth/adultPhoto.naturalHeight||.75;
      hero.style.setProperty('--profile-mobile-photo-height',`${Math.round(Math.min(hero.clientWidth<=620?430:600,Math.max(270,(hero.clientWidth-24)/ratio)))}px`);
    };
    adultPhoto.addEventListener('load',updatePortraitTop);
    updatePortraitTop();
    const portraitObserver=new ResizeObserver(updatePortraitTop);
    portraitObserver.observe(hero.querySelector('.profile-head'));
    portraitObserver.observe(summary);
  }
}
}
if(breed?.individualProfile)root.querySelector('.kitten-card')?.remove();
// Shared rating UI is inserted after the existing media/layout setup so it cannot
// change which card receives the basic-profile video or the kitten photograph.
if(breed){
  const stars=score=>`<span class="rating-stars" aria-hidden="true"><span>${'★'.repeat(score)}</span><span class="rating-stars-empty">${'☆'.repeat(5-score)}</span></span><b>${score}<small>/5</small></b>`;
  const row=(key,label,score)=>`<div class="rating-row" data-rating="${key}"><span>${escapeHtml(label)}</span><span class="rating-score" aria-label="5段階中${score}">${stars(score)}</span></div>`;
  const sourceLink=source=>`<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)} ↗</a>`;
  const references=[...breed.ratingSources,...['hairball','allergy',...breed.health.sources,...(breed.livingStats.allergy===3?['siberianAllergy']:breed.livingStats.allergy===2?['allergyMention']:[])].map(key=>window.RATING_REFERENCES[key])];
  const uniqueSources=references.filter((source,index,list)=>list.findIndex(item=>item.url===source.url)===index);
  const ratingMarkup=`<div class="profile-ratings" id="profile-ratings" aria-label="猫種の評価目安">
    <section class="profile-card rating-card" aria-labelledby="personality-title"><div class="eyebrow">PERSONALITY</div><h2 id="personality-title">性格・傾向</h2><p class="rating-intro">その猫らしい距離感を、7つの目安で。</p><div class="rating-chart">${Object.entries(labels).map(([key,label])=>row(key,label,breed.stats[key])).join('')}</div><p class="rating-note">5段階の編集目安です。高得点が「良い性格」を意味するわけではなく、性格を保証するものでもありません。</p><details class="rating-help"><summary>項目の意味を見る</summary><dl>${window.RANKINGS.map(item=>`<dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.description)}</dd>`).join('')}</dl></details>${breed.individualProfile?'<p class="rating-note rating-emphasis">ミックスは両親の猫種や個体によって特徴の幅が大きくなります。点数は中立的な参考値で、実際の性格や被毛を表すものではありません。</p>':''}</section>
    <section class="profile-card rating-card rating-living" aria-labelledby="living-title"><div class="eyebrow">LIVING TOGETHER</div><h2 id="living-title">暮らしやすさ</h2><p class="rating-intro">お手入れや暮らしとの相性を考える目安。</p><div class="rating-chart">${window.LIVING_RATING_ITEMS.map(item=>row(item.key,item.label,breed.livingStats[item.key])).join('')}</div><p class="rating-note">毛玉を吐きにくさは、被毛と飲み込む毛量から考える配慮目安です。嘔吐の発生率ではありません。繰り返す嘔吐は獣医師へ相談してください。</p><details class="rating-help"><summary>？ 評価の意味・5と1の違い</summary><dl>${window.LIVING_RATING_ITEMS.map(item=>`<dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.help)}</dd>`).join('')}</dl></details><div class="rating-allergy"><p>猫種だけでは猫アレルギーの有無を判断できません</p><p class="rating-note">アレルギー配慮度は低アレルゲン候補としての言及・研究の目安で、安全性や発症しない確率ではありません。すべての猫がアレルゲンを持ち、短毛・無毛でも安全とはいえません。個体差もあります。</p><a class="read" href="../articles/cat-allergy.html">猫アレルギーについて詳しく見る →</a></div></section>
    <section class="profile-card rating-card rating-health" aria-labelledby="health-title"><div class="eyebrow">HEALTH &amp; CARE</div><h2 id="health-title">健康</h2><div class="rating-health-layout"><div><h3>健康上の注意度</h3><div class="rating-score rating-health-score" aria-label="健康上の注意度：5段階中${breed.health.caution}">${stars(breed.health.caution)}</div><p class="rating-direction">★が多いほど健康面で知っておきたい事項が多い</p></div><div><h3>主に知っておきたい健康ポイント</h3><ul class="profile-list">${breed.health.points.map(point=>`<li>${escapeHtml(point)}</li>`).join('')}</ul></div></div><p class="rating-note">猫種に報告されている遺伝性疾患、体型に関連する疾患、診療統計などを参考にした一般的な目安です。個々の猫が病気になる確率を示すものではありません。低い点数でも病気にならないという意味ではなく、診断や検査の要否は獣医師へご相談ください。</p><details class="rating-help rating-sources"><summary>評価の参照資料・確認日</summary><p class="rating-note">確認日：${escapeHtml(breed.ratingReviewed)}。点数は資料の記述を共通基準で整理した編集値で、医学的に検証された尺度ではありません。</p><div class="source-list">${uniqueSources.map(sourceLink).join('')}</div></details></section>
  </div>`;
  // Preserve the hero and all existing content; only replace the status area.
  root.querySelector('.profile-main').insertAdjacentHTML('afterbegin',ratingMarkup);
}
