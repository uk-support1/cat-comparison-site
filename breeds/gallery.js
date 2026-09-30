const imagePath=media=>media.url||`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(media.file)}?width=900`;
const heroGallery=document.getElementById('heroGallery');
const carousel=document.getElementById('breedCarousel');
if(heroGallery){
  const scatteredTiles=[
    [4,7,15,1.34],[23,-2,20,1.38],[47,8,14,1.16],[67,2,18,1.42],[86,8,16,1.28],
    [10,34,12,1.62],[28,30,20,1.24],[51,25,15,1.55],[74,34,18,1.3],[91,28,13,1.62],
    [1,66,17,1.17],[20,61,12,1.58],[38,66,22,1.3],[64,60,16,1.5],[84,68,20,1.22],
    [12,91,18,1.28],[35,88,14,1.52],[55,94,20,1.2],[78,88,14,1.66]
  ];
  const photoSet=[-1,0,1].flatMap(cycle=>scatteredTiles.map((tile,index)=>({breed:BREEDS[index%BREEDS.length],tile,cycle})));
  heroGallery.innerHTML=`<div class="pan-wall">${photoSet.map(({breed,tile,cycle})=>`<span class="pan-tile" style="--x:${tile[0]+(cycle+1)*100};--y:${tile[1]};--w:${tile[2]};--ratio:${tile[3]}"><img src="${imagePath(breed.media)}" alt="" decoding="async"></span>`).join('')}</div>`;
  const wall=heroGallery.querySelector('.pan-wall');
  let active=false,startX=0,startY=0,offsetX=0,offsetY=0;
  const finish=()=>{if(!active)return;active=false;heroGallery.classList.remove('is-dragging');};
  heroGallery.addEventListener('pointerdown',event=>{active=true;startX=event.clientX;startY=event.clientY;heroGallery.classList.add('is-dragging');heroGallery.setPointerCapture(event.pointerId)});
  heroGallery.addEventListener('pointermove',event=>{if(!active)return;wall.style.translate=`${offsetX+event.clientX-startX}px ${offsetY+event.clientY-startY}px`;});
  heroGallery.addEventListener('pointerup',event=>{if(!active)return;offsetX+=event.clientX-startX;offsetY+=event.clientY-startY;finish();});
  heroGallery.addEventListener('pointercancel',finish);
  const heroScene=heroGallery.closest('.breed-hero');
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(heroScene&&!reduceMotion){
    let queued=false;
    const updateParallax=()=>{const rect=heroScene.getBoundingClientRect();const distance=Math.max(heroScene.offsetHeight-window.innerHeight,1);const progress=Math.min(1,Math.max(0,-rect.top/distance));heroGallery.style.setProperty('--parallax-y',`${-42*progress}px`);queued=false;};
    const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(updateParallax);}};
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    updateParallax();
  }
}
if(carousel){
  carousel.innerHTML=`<div class="carousel-track" style="--count:${BREEDS.length}">${BREEDS.map((breed,index)=>`<a class="carousel-card" href="profile.html?breed=${encodeURIComponent(breed.id)}" style="--i:${index}"><span class="carousel-card-face carousel-card-front"><img src="${imagePath(breed.media)}" alt=""><span class="carousel-label">${breed.name}<small>${breed.en}</small></span></span><span class="carousel-card-face carousel-card-back" aria-hidden="true"><img src="${imagePath(breed.media)}" alt=""><span class="carousel-label">${breed.name}<small>${breed.en}</small></span></span></a>`).join('')}</div>`;
}
