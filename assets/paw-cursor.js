(()=>{
  const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion:reduce)');
  if(!finePointer.matches||reducedMotion.matches)return;

  const style=document.createElement('style');
  style.textContent=`
    body.has-paw-cursor,body.has-paw-cursor *{cursor:none!important}
    .global-paw-cursor{position:fixed;z-index:9999;top:0;left:0;width:32px;height:32px;margin:-16px 0 0 -16px;pointer-events:none;opacity:0;transform:translate3d(var(--paw-x,0),var(--paw-y,0),0) scale(.88) rotate(var(--paw-tilt,0deg));transition:opacity .14s ease,transform .13s ease,filter .16s ease;filter:drop-shadow(0 5px 5px rgba(78,49,58,.22))}
    .global-paw-cursor::before{content:"";position:absolute;inset:-5px;border-radius:50%;background:rgba(255,255,255,.56);transform:scale(.72);transition:background .16s ease,transform .16s ease}
    .global-paw-cursor img{position:relative;width:100%;height:100%;object-fit:contain}
    body.has-paw-cursor .global-paw-cursor{opacity:1}
    .global-paw-cursor.is-action{filter:drop-shadow(0 7px 7px rgba(58,125,122,.3));transform:translate3d(var(--paw-x,0),var(--paw-y,0),0) scale(1.08) rotate(var(--paw-tilt,0deg))}
    .global-paw-cursor.is-action::before{background:rgba(137,218,207,.62);transform:scale(1)}
    .global-paw-cursor.is-action img{filter:hue-rotate(130deg) saturate(1.25)}
    .global-paw-cursor.is-pressing{transform:translate3d(var(--paw-x,0),var(--paw-y,0),0) scale(.72) rotate(var(--paw-tilt,0deg))}
    .global-paw-cursor.is-pressing::before{background:rgba(255,211,111,.78);transform:scale(1.18)}
  `;
  document.head.append(style);

  const cursor=document.createElement('span');
  cursor.className='global-paw-cursor';
  cursor.setAttribute('aria-hidden','true');
  cursor.innerHTML='<img src="'+new URL('pink-paw.png',document.currentScript.src).href+'" alt="">';
  document.addEventListener('DOMContentLoaded',()=>document.body.append(cursor),{once:true});

  const isAction=target=>Boolean(target?.closest('a,button,input,select,textarea,summary,label,[role="button"],[role="link"]'));
  let pressTimer;
  document.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse')return;
    document.body.classList.add('has-paw-cursor');
    cursor.style.setProperty('--paw-x',`${event.clientX}px`);
    cursor.style.setProperty('--paw-y',`${event.clientY}px`);
    cursor.style.setProperty('--paw-tilt',`${Math.max(-12,Math.min(12,event.movementX*.45))}deg`);
    cursor.classList.toggle('is-action',isAction(event.target));
  },{passive:true});
  document.addEventListener('pointerdown',event=>{
    if(event.pointerType!=='mouse')return;
    cursor.classList.add('is-pressing');
    clearTimeout(pressTimer);
    pressTimer=setTimeout(()=>cursor.classList.remove('is-pressing'),150);
  },{passive:true});
  document.addEventListener('pointerleave',()=>document.body.classList.remove('has-paw-cursor'));
  window.addEventListener('blur',()=>document.body.classList.remove('has-paw-cursor'));
})();
