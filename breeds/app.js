const dots=score=>`<span class="score-dots" aria-label="5段階中${score}">${[1,2,3,4,5].map(n=>`<i class="${n<=score?'on':''}"></i>`).join('')}</span>`;
const profileHref=id=>`profile.html?breed=${encodeURIComponent(id)}`;
const rankTabs=document.getElementById('rankTabs');
const rankCopy=document.getElementById('rankCopy');
const rankList=document.getElementById('rankList');
const breedGrid=document.getElementById('breedGrid');
const breedSearch=document.getElementById('breedSearch');
const mediaUrl=media=>media.url||`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(media.file)}?width=900`;
const entryMedia=breed=>breed.entryMedia||breed.profileMedia||breed.media;
const popularGrid=document.getElementById('popularBreedGrid');
if(popularGrid){
  popularGrid.innerHTML=POPULAR_BREEDS.map((id,index)=>{
    const breed=BREEDS.find(item=>item.id===id);
    const [zoom,origin]=ENTRY_MOBILE_CROPS[id]||[1,'center'];
    return `<li class="popular-breed-item"><a class="popular-breed-link" href="${profileHref(id)}"><span class="popular-breed-photo"><img src="${mediaUrl(entryMedia(breed))}" alt="${breed.name}の親猫" style="object-position:${ENTRY_PHOTO_POSITIONS[id]||'center 25%'};--mobile-photo-zoom:${zoom};--mobile-photo-origin:${origin}" loading="lazy" decoding="async"></span><span class="popular-breed-rank" aria-label="紹介順${index+1}">${index+1}</span><span class="popular-breed-name">${breed.name}</span></a></li>`;
  }).join('');
}
function renderRanking(id){
  const category=RANKINGS.find(item=>item.id===id)||RANKINGS[0];
  document.querySelectorAll('.rank-tab').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.id===category.id)));
  rankCopy.innerHTML=`<div class="eyebrow">${category.label.toUpperCase()}</div><h3>${category.title}</h3><p>${category.description}</p><div class="rank-scale">5段階の編集評価。順位差より、暮らし方との相性をご覧ください。</div>`;
  const ordered=BREEDS.filter(breed=>!breed.individualProfile).sort((a,b)=>b.stats[category.id]-a.stats[category.id]||a.name.localeCompare(b.name,'ja')).slice(0,6);
  rankList.innerHTML=ordered.map((breed,index)=>`<a class="rank-row" href="${profileHref(breed.id)}"><span class="rank-number">${index+1}</span><span class="mini-mark" style="--breed:${breed.color}">${breed.mark}</span><span class="rank-name"><b>${breed.name}</b><span>${breed.en}</span></span>${dots(breed.stats[category.id])}</a>`).join('');
}
rankTabs.innerHTML=RANKINGS.map((category,index)=>`<button class="rank-tab" type="button" role="tab" data-id="${category.id}" aria-selected="${index===0}">${category.label}</button>`).join('');
rankTabs.addEventListener('click',event=>{const button=event.target.closest('.rank-tab');if(button)renderRanking(button.dataset.id)});
function renderBreeds(query=''){
  const normalized=query.trim().toLowerCase();
  const list=BREEDS.filter(breed=>!normalized||`${breed.name} ${breed.en}`.toLowerCase().includes(normalized));
  breedGrid.innerHTML=list.map(breed=>`<a class="breed-card" href="${profileHref(breed.id)}"><span class="breed-card-photo"><img src="${mediaUrl(entryMedia(breed))}" alt="${breed.individualProfile?breed.name+'の写真':breed.name+'の親猫'}" loading="lazy" decoding="async"></span><div class="breed-card-top"><span class="breed-mark" style="--breed:${breed.color}">${breed.mark}</span><span class="coat">${breed.coat}</span></div><h3>${breed.name}</h3><span class="en">${breed.en}</span><p>${breed.summary}</p><span class="chips">${breed.traits.map(trait=>`<span class="chip">${trait}</span>`).join('')}</span><span class="read">プロフィールを見る →</span></a>`).join('')||'<p>該当する猫種が見つかりませんでした。</p>';
}
breedSearch.addEventListener('input',event=>renderBreeds(event.target.value));
renderRanking(RANKINGS[0].id);renderBreeds();
