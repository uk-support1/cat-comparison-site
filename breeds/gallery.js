const imagePath=media=>media.url||`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(media.file)}?width=900`;
const galleryAdult=breed=>breed.entryMedia||breed.profileMedia||breed.media;
const heroGallery=document.getElementById('heroGallery');
const carousel=document.getElementById('breedCarousel');
// Adjacent centres are at least one card width plus the requested gap apart.
// Derive the radius from the actual breed count, not a hard-coded 19-card ring.
const carouselRadius=(count,size,gap)=>Math.ceil((size+gap)/(2*Math.sin(Math.PI/Math.max(3,count))));
if(heroGallery){
  const scatteredTiles=[
    [4,7,15,1.34],[23,-2,20,1.38],[47,8,14,1.16],[67,2,18,1.42],[86,8,16,1.28],
    [10,34,12,1.62],[28,30,20,1.24],[51,25,15,1.55],[74,34,18,1.3],[91,28,13,1.62],
    [1,66,17,1.17],[20,61,12,1.58],[38,66,22,1.3],[64,60,16,1.5],[84,68,20,1.22],
    [12,91,18,1.28],[35,88,14,1.52],[55,94,20,1.2],[78,88,14,1.66]
  ];
  const photoSet=[-1,0,1].flatMap(cycle=>scatteredTiles.map((tile,index)=>({breed:BREEDS[index%BREEDS.length],tile,cycle})));
  heroGallery.innerHTML=`<div class="pan-wall">${photoSet.map(({breed,tile,cycle})=>`<span class="pan-tile" style="--x:${tile[0]+(cycle+1)*100};--y:${tile[1]};--w:${tile[2]};--ratio:${tile[3]}"><img src="${imagePath(galleryAdult(breed))}" alt="" decoding="async"></span>`).join('')}</div>`;
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
  const escapeGallery=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  carousel.innerHTML=`<div class="carousel-track">${BREEDS.map(breed=>{
    const url=escapeGallery(imagePath(breed.carouselMedia||breed.media));
    const face=back=>`<span class="carousel-card-face carousel-card-${back?'back':'front'}"${back?' aria-hidden="true"':''}><img class="carousel-photo-bg" src="${url}" alt="" aria-hidden="true" decoding="async"><img class="carousel-photo-main" src="${url}" alt="${back?'':escapeGallery(breed.name)+'の写真'}" decoding="async"><span class="carousel-label">${escapeGallery(breed.name)}<small>${escapeGallery(breed.en)}</small></span></span>`;
    return `<a class="carousel-card" data-breed="${breed.id}" data-photo-layout="${['somali','abyssinian'].includes(breed.id)?'portrait':'standard'}" href="profile.html?breed=${encodeURIComponent(breed.id)}" aria-label="${escapeGallery(breed.name)}のプロフィール">${face(false)}${face(true)}</a>`;
  }).join('')}</div>`;
  const track=carousel.querySelector('.carousel-track');
  carousel.insertAdjacentHTML('afterend','<div class="carousel-controls" role="group" aria-label="3Dカルーセルの操作"><button type="button" data-carousel-action="previous" aria-label="前の猫種を正面に表示">←</button><button type="button" data-carousel-action="toggle">回転を一時停止</button><button type="button" data-carousel-action="next" aria-label="次の猫種を正面に表示">→</button><span class="carousel-counter" aria-live="off"></span><span class="carousel-announcement" role="status"></span></div>');
  const cards=[...carousel.querySelectorAll('.carousel-card')];
  const controls=carousel.nextElementSibling;
  const toggle=controls.querySelector('[data-carousel-action="toggle"]');
  const counter=controls.querySelector('.carousel-counter');
  const announcement=controls.querySelector('.carousel-announcement');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const step=360/cards.length;
  let rotation=0,paused=motion.matches,inView=false,focused=false,lastTime=0,frame=0;
  let radius=0,frontIndex=0;
  const syncToggle=()=>{toggle.textContent=paused?'回転を再開':'回転を一時停止';carousel.dataset.paused=String(paused)};
  const measure=()=>{
    const style=getComputedStyle(carousel);
    const size=parseFloat(style.getPropertyValue('--card-size'));
    radius=carouselRadius(cards.length,size,parseFloat(style.getPropertyValue('--card-gap')));
    const tilt=parseFloat(style.getPropertyValue('--tilt-x'));
    carousel.style.setProperty('--radius',`${radius}px`);
    carousel.style.setProperty('--perspective',`${Math.max(1100,radius*2.8)}px`);
    carousel.style.setProperty('--orbit-offset-y',`${radius*Math.sin(-tilt*Math.PI/180)}px`);
    carousel.dataset.radius=String(radius);
    carousel.dataset.count=String(cards.length);
    cards.forEach((card,index)=>{card.style.transform=`rotateY(${index*step}deg) translateZ(${radius}px)`});
  };
  const render=()=>{
    // Rotate one rigid ring. Never hide individual cards to resolve projected
    // overlaps: that made them pop in/out whenever the selection changed.
    // Real 3D depth handles occlusion, while the stage clips edges continuously.
    track.style.setProperty('--rotation',`${rotation}deg`);
    const angles=cards.map((card,index)=>((index*step+rotation+180)%360+360)%360-180);
    frontIndex=angles.reduce((nearest,angle,index)=>Math.abs(angle)<Math.abs(angles[nearest])?index:nearest,0);
    cards.forEach((card,index)=>{
      const depth=(1-Math.cos(angles[index]*Math.PI/180))/2;
      // Apply depth treatment to each face, not the preserve-3d parent: opacity
      // and filter on the parent flatten its two faces and hide the reverse.
      card.style.setProperty('--depth-opacity',String(1-depth*.25));
      card.style.setProperty('--depth-blur',`${depth*.35}px`);
      card.style.setProperty('--depth-saturation',String(1-depth*.12));
      // Only the front card enters the Tab sequence. All 19 links remain
      // available to assistive technology and pointer users throughout rotation.
      card.tabIndex=index===frontIndex?0:-1;
    });
    carousel.dataset.frontBreed=BREEDS[frontIndex].id;
    counter.textContent=`${frontIndex+1} / ${cards.length}`;
  };
  const tick=time=>{
    frame=0;
    if(!inView||paused||focused||document.hidden){lastTime=0;return}
    if(lastTime)rotation-=Math.min(time-lastTime,64)*360/72000;
    lastTime=time;
    render();
    frame=requestAnimationFrame(tick);
  };
  const resume=()=>{if(!frame&&inView&&!paused&&!focused&&!document.hidden)frame=requestAnimationFrame(tick)};
  const stop=()=>{cancelAnimationFrame(frame);frame=0;lastTime=0};
  const showBreed=direction=>{
    paused=true;stop();syncToggle();
    const next=(frontIndex+direction+cards.length)%cards.length;
    rotation=-next*step;
    render();
    announcement.textContent=`${BREEDS[next].name}、${next+1} / ${cards.length}`;
  };
  controls.querySelector('[data-carousel-action="previous"]').addEventListener('click',()=>showBreed(-1));
  controls.querySelector('[data-carousel-action="next"]').addEventListener('click',()=>showBreed(1));
  toggle.addEventListener('click',()=>{paused=!paused;stop();syncToggle();resume()});
  carousel.addEventListener('focusin',()=>{focused=true;stop()});
  carousel.addEventListener('focusout',event=>{if(!carousel.contains(event.relatedTarget)){focused=false;resume()}});
  carousel.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();showBreed(event.key==='ArrowRight'?1:-1);cards[frontIndex].focus()}});
  document.addEventListener('visibilitychange',()=>{stop();resume()});
  motion.addEventListener('change',()=>{paused=motion.matches;stop();syncToggle();render();resume()});
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView){measure();render();resume()}else stop()},{threshold:.05}).observe(carousel);
  new ResizeObserver(()=>{measure();render()}).observe(carousel);
  // Recompute ring geometry after layout changes or browser zoom, even paused.
  window.addEventListener('resize',()=>{measure();render()});
  syncToggle();measure();render();
}
