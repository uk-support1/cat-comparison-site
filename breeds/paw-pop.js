const stage=document.getElementById('pawStage');
const startButton=document.getElementById('startButton');
const resetButton=document.getElementById('resetButton');
const resultButton=document.getElementById('resultButton');
const resultOverlay=document.getElementById('resultOverlay');
const scoreValue=document.getElementById('scoreValue');
const popsValue=document.getElementById('popsValue');
const timeValue=document.getElementById('timeValue');
const stageMessage=document.getElementById('stageMessage');
const catComment=document.getElementById('catComment');
const resultTitle=document.getElementById('resultTitle');
const resultDescription=document.getElementById('resultDescription');
const reactions=['みつけた！','いい肉球センス。','ぽんっ、正解！','もうひとつあるかも。','猫パンチ、成功！','ふわっと消えたね。'];
const GAME_SECONDS=10;
let score=0;
let pops=0;
let bonusPaws=0;
let secondsLeft=GAME_SECONDS;
let running=false;
let gameTimer;
let spawnTimer;
let countdownTimer;
let audioContext;

const setComment=text=>{catComment.textContent=text;catComment.classList.remove('is-reacting');requestAnimationFrame(()=>catComment.classList.add('is-reacting'));};
const updateStats=()=>{scoreValue.textContent=score;popsValue.textContent=pops;timeValue.textContent=secondsLeft;timeValue.closest('.stat').classList.toggle('is-urgent',running&&secondsLeft<=3);};
const removeBubbles=()=>stage.querySelectorAll('.paw-bubble,.paw-spark').forEach(node=>node.remove());
const clearTimers=()=>{clearInterval(gameTimer);clearInterval(spawnTimer);clearTimeout(countdownTimer);};
const playChime=notes=>{
  try{
    audioContext??=new(window.AudioContext||window.webkitAudioContext)();
    if(audioContext.state==='suspended')audioContext.resume();
    const now=audioContext.currentTime;
    notes.forEach(([frequency,delay=.0,duration=.075])=>{
      const oscillator=audioContext.createOscillator();
      const gain=audioContext.createGain();
      oscillator.type='sine';
      oscillator.frequency.value=frequency;
      gain.gain.setValueAtTime(.0001,now+delay);
      gain.gain.exponentialRampToValueAtTime(.085,now+delay+.01);
      gain.gain.exponentialRampToValueAtTime(.0001,now+delay+duration);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(now+delay);
      oscillator.stop(now+delay+duration+.02);
    });
  }catch(error){/* The visual cue remains available when a browser blocks sound. */}
};
const popSpark=(x,y,bonus=false)=>{for(let i=0;i<10;i+=1){const spark=document.createElement('i');const angle=(Math.PI*2/10)*i;const distance=32+Math.random()*36;spark.className='paw-spark';spark.style.left=`${x}px`;spark.style.top=`${y}px`;spark.style.setProperty('--x',`${Math.cos(angle)*distance}px`);spark.style.setProperty('--y',`${Math.sin(angle)*distance}px`);spark.style.setProperty('--spark',bonus?['#ff7392','#fff4c9','#fff'][i%3]:['#ef7a65','#e9b94f','#7c9b82'][i%3]);stage.append(spark);spark.addEventListener('animationend',()=>spark.remove(),{once:true});}};
const addBubble=()=>{
  if(!running||stage.querySelectorAll('.paw-bubble').length>=7)return;
  const bubble=document.createElement('button');
  const bonus=Math.random()<.1;
  const left=5+Math.random()*80;
  const top=15+Math.random()*65;
  bubble.className=`paw-bubble${bonus?' is-bonus':''}`;
  bubble.type='button';
  bubble.setAttribute('aria-label',bonus?'レア肉球バブル。ポップすると2ポイント':'肉球バブルをポップする');
  bubble.style.left=`${left}%`;
  bubble.style.top=`${top}%`;
  bubble.style.setProperty('--float-duration',`${1.6+Math.random()*1.4}s`);
  bubble.style.setProperty('--float-delay',`${-Math.random()*1.4}s`);
  if(bonus){const image=document.createElement('img');image.src='../assets/pink-paw.png';image.alt='';bubble.append(image);}else bubble.innerHTML='<span aria-hidden="true">🐾</span>';
  bubble.addEventListener('click',()=>{
    if(!running)return;
    const rect=bubble.getBoundingClientRect();
    const stageRect=stage.getBoundingClientRect();
    popSpark(rect.left-stageRect.left+rect.width/2,rect.top-stageRect.top+rect.height/2,bonus);
    bubble.classList.add('is-popped');
    pops+=1;
    score+=bonus?2:1;
    if(bonus){bonusPaws+=1;setComment('レア肉球！ +2ポイント！');stageMessage.textContent='きらん！ レア肉球をゲット。';playChime([[880,0,.06],[1320,.09,.1]]);}else{setComment(reactions[pops%reactions.length]);stageMessage.textContent=pops>20?'その調子、神の手さばき！':'肉球を見つけて、ぽんっとタップ。';}
    updateStats();
    setTimeout(()=>bubble.remove(),360);
    setTimeout(addBubble,110);
  });
  stage.append(bubble);
};
const getRank=count=>{
  if(count>30)return{title:'神！肉球の守護神',body:'30個超え。もはや肉球に導かれています。'};
  if(count>20)return{title:'すごい！肉球マスター',body:'20個超え。目と指の連携が見事です。'};
  if(count>=10)return{title:'肉球名人！',body:'10個以上。次は「すごい！」を目指そう。'};
  return{title:'はじめての肉球ハンター',body:'最初の一歩から、かわいい肉球探しは始まります。'};
};
const finishGame=()=>{
  if(!running)return;
  running=false;
  clearInterval(gameTimer);clearInterval(spawnTimer);
  secondsLeft=0;updateStats();removeBubbles();
  const rank=getRank(pops);
  stageMessage.textContent='ぴっぴー！ 10秒チャレンジ終了。';
  setComment(pops>30?'神の手さばき…！':pops>20?'すごい！ たくさん見つけたね。':'また一緒に遊ぼうね。');
  resultTitle.textContent=rank.title;
  resultDescription.textContent=`割ったバブル ${pops}個 ／ ${score}ポイント${bonusPaws?`（レア肉球 ${bonusPaws}個）`:''}。${rank.body}`;
  resultOverlay.hidden=false;
  resetButton.hidden=false;
  playChime([[880,0,.08],[1320,.14,.14]]);
};
const beginGame=()=>{
  running=true;
  secondsLeft=GAME_SECONDS;
  updateStats();
  stageMessage.textContent='スタート！ 10秒間で肉球を探そう。';
  setComment('スタート！ いそいで、いそいで。');
  playChime([[660,0,.08]]);
  for(let i=0;i<4;i+=1)setTimeout(addBubble,i*100);
  spawnTimer=setInterval(addBubble,460);
  gameTimer=setInterval(()=>{secondsLeft-=1;updateStats();if(secondsLeft<=0)finishGame();},1000);
};
const runCountdown=steps=>{
  const next=index=>{
    stageMessage.textContent=steps[index];
    setComment(index===0?'準備はいい？':'');
    if(index===steps.length-1){countdownTimer=setTimeout(beginGame,520);return;}
    countdownTimer=setTimeout(()=>next(index+1),620);
  };
  next(0);
};
const startGame=()=>{
  clearTimers();removeBubbles();
  score=0;pops=0;bonusPaws=0;secondsLeft=GAME_SECONDS;running=false;
  updateStats();resultOverlay.hidden=true;startButton.hidden=true;resetButton.hidden=true;
  runCountdown(['よーい…','3','2','1','スタート！']);
};
const resetGame=()=>{
  clearTimers();running=false;removeBubbles();
  score=0;pops=0;bonusPaws=0;secondsLeft=GAME_SECONDS;
  updateStats();resultOverlay.hidden=true;startButton.hidden=false;resetButton.hidden=true;
  stageMessage.textContent='スタートを押すと肉球が現れます。';
  setComment('今日は何個見つけられるかな？');
};
startButton.addEventListener('click',startGame);
resetButton.addEventListener('click',resetGame);
resultButton.addEventListener('click',startGame);
