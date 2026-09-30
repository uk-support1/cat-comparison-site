const imagePath=file=>`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=900`;
const heroGallery=document.getElementById('heroGallery');
const carousel=document.getElementById('breedCarousel');
if(heroGallery){
  const photoSet=Array.from({length:4},()=>BREEDS).flat();
  heroGallery.innerHTML=`<div class="pan-wall">${photoSet.map(breed=>`<span class="pan-tile"><img src="${imagePath(breed.media.file)}" alt="" decoding="async"></span>`).join('')}</div>`;
  const wall=heroGallery.querySelector('.pan-wall');
  let active=false,startX=0,startY=0,offsetX=0,offsetY=0;
  const finish=()=>{if(!active)return;active=false;heroGallery.classList.remove('is-dragging');};
  heroGallery.addEventListener('pointerdown',event=>{active=true;startX=event.clientX;startY=event.clientY;heroGallery.classList.add('is-dragging');heroGallery.setPointerCapture(event.pointerId)});
  heroGallery.addEventListener('pointermove',event=>{if(!active)return;wall.style.translate=`${offsetX+event.clientX-startX}px ${offsetY+event.clientY-startY}px`;});
  heroGallery.addEventListener('pointerup',event=>{if(!active)return;offsetX+=event.clientX-startX;offsetY+=event.clientY-startY;finish();});
  heroGallery.addEventListener('pointercancel',finish);
}
if(carousel){
  carousel.innerHTML=`<div class="carousel-track" style="--count:${BREEDS.length}">${BREEDS.map((breed,index)=>`<a class="carousel-card" href="profile.html?breed=${encodeURIComponent(breed.id)}" style="--i:${index}"><span class="carousel-card-face carousel-card-front"><img src="${imagePath(breed.media.file)}" alt=""><span class="carousel-label">${breed.name}<small>${breed.en}</small></span></span><span class="carousel-card-face carousel-card-back" aria-hidden="true"><img src="${imagePath(breed.media.file)}" alt=""><span class="carousel-label">${breed.name}<small>${breed.en}</small></span></span></a>`).join('')}</div>`;
}
