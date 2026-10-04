const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const js=read('breeds/gallery.js'),css=read('breeds/motion.css');
const mathContext={document:{getElementById:()=>null}};vm.createContext(mathContext);vm.runInContext(js,mathContext);
for(const [size,gap,expected] of [[240,64,924],[200,52,766],[132,32,499]]){
  assert.equal(vm.runInContext(`carouselRadius(19,${size},${gap})`,mathContext),expected);
  for(const count of [3,12,19,20,30,50]){
    const radius=vm.runInContext(`carouselRadius(${count},${size},${gap})`,mathContext);
    assert.ok(2*radius*Math.sin(Math.PI/count)>=size+gap,'adjacent centre clearance');
  }
}
assert.equal(vm.runInContext('carouselBoxesOverlap({left:0,right:100,top:0,bottom:100},{left:115,right:215,top:0,bottom:100},18)',mathContext),true);
assert.equal(vm.runInContext('carouselBoxesOverlap({left:0,right:100,top:0,bottom:100},{left:118,right:218,top:0,bottom:100},18)',mathContext),false);

// Integration-test the real initialization, controls and reduced-motion branch.
function buildGallery(reduced,rearOnly=false){
  const style=()=>({setProperty(){}}),button=()=>({listeners:{},addEventListener(type,fn){this.listeners[type]=fn}});
  const buttons={previous:button(),next:button(),toggle:button()},counter={},announcement={};
  const controls={querySelector(selector){if(selector==='.carousel-counter')return counter;if(selector==='.carousel-announcement')return announcement;return buttons[selector.match(/"([^"]+)"/)[1]]}};
  const cards=Array.from({length:19},(_,index)=>({style:style(),setAttribute(){},getBoundingClientRect:()=>rearOnly&&index!==9?({left:-500,right:-260,top:160,bottom:400}):({left:480,right:720,top:160,bottom:400})}));
  const carousel={style:style(),dataset:{},nextElementSibling:controls,querySelectorAll:()=>cards,insertAdjacentHTML(){},addEventListener(){},getBoundingClientRect:()=>({left:0,right:1200,top:0,bottom:600})};
  const motion={matches:reduced,addEventListener(type,fn){this.changed=fn}};
  let requested=0,cancelled=0,nextFrame=null;
  const context={window:{addEventListener(){}},document:{getElementById:id=>id==='breedCarousel'?carousel:null,hidden:false,addEventListener(){}},matchMedia:()=>motion,getComputedStyle:()=>({getPropertyValue:key=>({'--card-size':'240','--card-gap':'64','--screen-gap':'18','--tilt-x':'-15'}[key])}),requestAnimationFrame:callback=>{nextFrame=callback;return ++requested},cancelAnimationFrame:()=>++cancelled,IntersectionObserver:class{constructor(callback){this.callback=callback}observe(){this.callback([{isIntersecting:true}])}},ResizeObserver:class{constructor(callback){this.callback=callback}observe(){this.callback()}}};
  vm.createContext(context);vm.runInContext(read('breeds/data.js'),context);context.BREEDS=context.window.BREEDS;vm.runInContext(js,context);
  return {carousel,cards,buttons,motion,counter,announcement,requested:()=>requested,cancelled:()=>cancelled,tick:time=>nextFrame(time)};
}
const stopped=buildGallery(true);
assert.equal(stopped.requested(),0,'reduced motion does not start the ring');
assert.equal(stopped.carousel.dataset.paused,'true');
assert.equal(stopped.carousel.dataset.radius,'924');
assert.equal(stopped.carousel.dataset.count,'19');
assert.equal(stopped.buttons.toggle.textContent,'回転を再開');
assert.equal((stopped.carousel.innerHTML.match(/class="carousel-photo-main"/g)||[]).length,38);
assert.equal((stopped.carousel.innerHTML.match(/class="carousel-photo-bg"/g)||[]).length,38);
assert.equal((stopped.carousel.innerHTML.match(/carousel-card-back" aria-hidden="true"/g)||[]).length,19);
assert.equal((stopped.carousel.innerHTML.match(/data-photo-layout="portrait"/g)||[]).length,2);
for(let index=1;index<=19;index++){
  stopped.buttons.next.listeners.click();
  assert.equal(stopped.requested(),0);
  assert.equal(stopped.counter.textContent,`${index%19+1} / 19`);
  assert.equal(stopped.cards.filter(card=>card.style.visibility==='visible').length,1,'overlapping projected mock boxes are not shown together');
}
stopped.motion.matches=false;stopped.motion.changed();assert.equal(stopped.requested(),1);
stopped.buttons.toggle.listeners.click();assert.equal(stopped.carousel.dataset.paused,'true');assert.ok(stopped.cancelled()>0);
const moving=buildGallery(false);
assert.equal(moving.requested(),1,'normal mode schedules rotation');
const initialTransform=moving.cards[0].style.transform;
moving.tick(100);moving.tick(132);
assert.notEqual(moving.cards[0].style.transform,initialTransform,'automatic frames really move the orbit');
assert.equal(buildGallery(true,true).cards[9].style.visibility,'visible','rear-half cards stay visible, even with reduced motion');

assert.ok(css.includes('aspect-ratio:1 / 1'));
assert.ok(css.includes('.carousel-photo-main')&&css.includes('object-fit:contain'));
assert.ok(css.includes('blur(12px) brightness(1.08) saturate(.85)'));
assert.ok(!css.includes('carousel-spin'));
assert.ok(js.includes('if(!inView||paused||focused||document.hidden)'));
assert.ok(js.includes('card.tabIndex=visible?0:-1'));
assert.ok(css.includes('.carousel-card-back{transform:rotateY(180deg) translateZ(.1px)}'));
assert.ok(css.includes('.carousel-card-back .carousel-photo-main{transform:scaleX(-1)}'));
assert.ok(!js.includes('Math.abs(item.angle)<66'),'no front-only orbit restriction');
assert.ok(!js.includes('card.style.filter='),'do not flatten two-sided 3D cards');
assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length);

// Strip only carousel rules; the remaining hero styles must match the baseline.
const splitRules=text=>{const out=[];let start=0,depth=0;for(let i=0;i<text.length;i++){if(text[i]==='{')depth++;if(text[i]==='}'&&!--depth){out.push(text.slice(start,i+1));start=i+1;}}return out;};
const nonCarousel=text=>splitRules(text.replace(/\/\*[\s\S]*?\*\//g,'')).map(rule=>{const p=rule.indexOf('{'),header=rule.slice(0,p).trim(),body=rule.slice(p+1,-1);if(header.startsWith('@keyframes carousel-'))return '';if(header.startsWith('@media')){const inside=nonCarousel(body);return inside?header+'{'+inside+'}':'';}const selectors=header.split(',').filter(s=>!s.includes('.carousel-')&&!s.includes('.breed-carousel'));return selectors.length?selectors.join(',')+'{'+body+'}':'';}).filter(Boolean).join('\n');
assert.equal(crypto.createHash('sha256').update(nonCarousel(css)).digest('hex'),'b59ac92d0eaee5450c891c404d104c46d7f2692d76ef7e6baea4acbefd67d87f');
console.log('PASS: count-derived spacing, 19 two-sided full-photo cards, mirrored backs, uncropped portrait backdrop, reduced motion with rear cards, real animation frames, full manual circuit, collision filtering and unchanged hero CSS.');
