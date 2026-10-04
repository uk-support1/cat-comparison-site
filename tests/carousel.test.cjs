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

// Integration-test the real initialization, controls and reduced-motion branch.
function buildGallery(reduced){
  const style=()=>({properties:{},setProperty(key,value){this.properties[key]=value}}),button=()=>({listeners:{},addEventListener(type,fn){this.listeners[type]=fn}});
  const buttons={previous:button(),next:button(),toggle:button()},counter={},announcement={};
  const controls={querySelector(selector){if(selector==='.carousel-counter')return counter;if(selector==='.carousel-announcement')return announcement;return buttons[selector.match(/"([^"]+)"/)[1]]}};
  const cards=Array.from({length:19},()=>({style:style(),attributes:{},setAttribute(key,value){this.attributes[key]=value},getBoundingClientRect(){throw Error('animation must not read projected boxes or cull cards')}}));
  const track={style:style()};
  const carousel={style:style(),dataset:{},nextElementSibling:controls,querySelector:()=>track,querySelectorAll:()=>cards,insertAdjacentHTML(){},addEventListener(){},getBoundingClientRect(){throw Error('animation must not force layout')}};
  const motion={matches:reduced,addEventListener(type,fn){this.changed=fn}};
  let requested=0,cancelled=0,nextFrame=null;
  const context={window:{addEventListener(){}},document:{getElementById:id=>id==='breedCarousel'?carousel:null,hidden:false,addEventListener(){}},matchMedia:()=>motion,getComputedStyle:()=>({getPropertyValue:key=>({'--card-size':'240','--card-gap':'64','--screen-gap':'18','--tilt-x':'-15'}[key])}),requestAnimationFrame:callback=>{nextFrame=callback;return ++requested},cancelAnimationFrame:()=>++cancelled,IntersectionObserver:class{constructor(callback){this.callback=callback}observe(){this.callback([{isIntersecting:true}])}},ResizeObserver:class{constructor(callback){this.callback=callback}observe(){this.callback()}}};
  vm.createContext(context);vm.runInContext(read('breeds/data.js'),context);context.BREEDS=context.window.BREEDS;vm.runInContext(js,context);
  return {carousel,track,cards,buttons,motion,counter,announcement,requested:()=>requested,cancelled:()=>cancelled,tick:time=>nextFrame(time)};
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
  assert.ok(stopped.cards.every(card=>card.style.visibility===undefined&&card.attributes['aria-hidden']===undefined),'no manual-step visibility switching');
  assert.equal(stopped.cards.filter(card=>card.tabIndex===0).length,1);
}
stopped.motion.matches=false;stopped.motion.changed();assert.equal(stopped.requested(),1);
stopped.buttons.toggle.listeners.click();assert.equal(stopped.carousel.dataset.paused,'true');assert.ok(stopped.cancelled()>0);
const moving=buildGallery(false);
assert.equal(moving.requested(),1,'normal mode schedules rotation');
const fixedTransforms=moving.cards.map(card=>card.style.transform);
// A full 72-second circuit: the ring moves as one object, every card retains its
// fixed seat, and no card ever becomes display/visibility/opacity zero.
const seen=new Set();
for(let frame=1;frame<=4501;frame++){
  moving.tick(frame*16);
  seen.add(moving.carousel.dataset.frontBreed);
  assert.deepEqual(moving.cards.map(card=>card.style.transform),fixedTransforms);
  assert.ok(moving.cards.every(card=>card.style.visibility===undefined&&card.style.display===undefined&&card.attributes['aria-hidden']===undefined));
  assert.ok(moving.cards.every(card=>Number(card.style.properties['--depth-opacity'])>=.75));
  if(frame===2251)assert.ok(Math.abs(parseFloat(moving.track.style.properties['--rotation'])+180)<.01, 'half the previous speed: only half a turn in 36 seconds');
}
assert.equal(seen.size,19);
assert.ok(Math.abs(parseFloat(moving.track.style.properties['--rotation'])+360)<.01);
assert.ok(stopped.cards.every(card=>card.style.visibility!== 'hidden'),'reduced-motion orbit includes every card');

assert.ok(css.includes('aspect-ratio:1 / 1'));
assert.ok(css.includes('.carousel-photo-main')&&css.includes('object-fit:contain'));
assert.ok(css.includes('blur(12px) brightness(1.08) saturate(.85)'));
assert.ok(!css.includes('carousel-spin'));
assert.ok(js.includes('if(!inView||paused||focused||document.hidden)'));
assert.ok(js.includes('card.tabIndex=index===frontIndex?0:-1'));
assert.ok(css.includes('.carousel-card-back{transform:rotateY(180deg) translateZ(.1px);'));
const backFace=css.match(/\.carousel-card-back\{([^}]+)\}/)[1];
assert.ok(backFace.includes('grayscale(1) contrast(.82) brightness(1.08)'), 'back faces alone are monochrome with subdued contrast');
assert.ok(backFace.includes('opacity:calc(var(--depth-opacity,1) * .78)'), 'backs stay visible but less prominent');
assert.ok(!css.match(/\.carousel-card-front\{[^}]*grayscale/), 'front face photographs retain their color');
assert.ok(css.includes('.carousel-card-back .carousel-photo-main{transform:scaleX(-1)}'));
assert.ok(!js.includes('Math.abs(item.angle)<66'),'no front-only orbit restriction');
assert.ok(!js.includes('card.style.filter='),'do not flatten two-sided 3D cards');
assert.ok(!js.includes('card.style.visibility=')&&!js.includes('carouselBoxesOverlap')&&!js.slice(js.indexOf('if(carousel){')).includes('getBoundingClientRect()'),'no hard card culling');
assert.ok(css.includes('visibility:visible')&&css.includes('rotateY(var(--rotation,0deg))')&&css.includes('overflow:clip'));
assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length);

// Strip only carousel rules; the remaining hero styles must match the baseline.
const splitRules=text=>{const out=[];let start=0,depth=0;for(let i=0;i<text.length;i++){if(text[i]==='{')depth++;if(text[i]==='}'&&!--depth){out.push(text.slice(start,i+1));start=i+1;}}return out;};
const nonCarousel=text=>splitRules(text.replace(/\/\*[\s\S]*?\*\//g,'')).map(rule=>{const p=rule.indexOf('{'),header=rule.slice(0,p).trim(),body=rule.slice(p+1,-1);if(header.startsWith('@keyframes carousel-'))return '';if(header.startsWith('@media')){const inside=nonCarousel(body);return inside?header+'{'+inside+'}':'';}const selectors=header.split(',').filter(s=>!s.includes('.carousel-')&&!s.includes('.breed-carousel'));return selectors.length?selectors.join(',')+'{'+body+'}':'';}).filter(Boolean).join('\n');
assert.equal(crypto.createHash('sha256').update(nonCarousel(css)).digest('hex'),'b59ac92d0eaee5450c891c404d104c46d7f2692d76ef7e6baea4acbefd67d87f');
console.log('PASS: count-derived spacing, 19 stable two-sided cards, subdued monochrome mirrored backs, color fronts, full photos, complete 72-second shared-ring rotation without culling/layout reads, reduced motion, manual controls and unchanged hero CSS.');
