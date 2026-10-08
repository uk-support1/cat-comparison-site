// Run after `npm install --no-save sharp@0.34.5`.
// Derive square ranking portraits without modifying any original photograph.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const sharp=require('sharp');
const root=path.resolve(__dirname,'..');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'breeds/data.js'),'utf8'),context);
const breeds=context.window.BREEDS;
const output=path.join(root,'assets/breeds/ranking-thumbs');
const config=JSON.parse(fs.readFileSync(path.join(__dirname,'ranking-thumb-crops.json'),'utf8'));
async function build(){
  fs.mkdirSync(output,{recursive:true});
  const previews=[];
  for(const breed of breeds){
    const media=breed.entryMedia||breed.profileMedia||breed.media;
    const source=path.resolve(root,'breeds',media.url);
    const image=sharp(source);
    const {width,height}=await image.metadata();
    const {center,side}=config[breed.id];
    const size=Math.round(width*side/100);
    const left=Math.round(width*center[0]/100-size/2);
    const top=Math.round(height*center[1]/100-size/2);
    const pad={left:Math.max(0,-left),top:Math.max(0,-top),right:Math.max(0,left+size-width),bottom:Math.max(0,top+size-height)};
    // Some supplied photos have very little background above the ears. Extend
    // only the background edge when needed to preserve breathing room in a circle.
    const padded=await image.extend({...pad,extendWith:'copy'}).toBuffer();
    await sharp(padded).extract({left:left+pad.left,top:top+pad.top,width:size,height:size}).resize(600,600).webp({quality:90,effort:6}).toFile(path.join(output,`${breed.id}.webp`));
    if(process.argv.includes('--preview')){
      const mask=Buffer.from('<svg width="260" height="260" xmlns="http://www.w3.org/2000/svg"><circle cx="130" cy="130" r="126" fill="white"/></svg>');
      const thumb=await sharp(path.join(output,`${breed.id}.webp`)).resize(260,260).composite([{input:mask,blend:'dest-in'}]).png().toBuffer();
      const label=Buffer.from(`<svg width="280" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f9f5ee"/><text x="8" y="22" font-family="Arial" font-size="15" fill="#332b25">${breed.en}</text></svg>`);
      previews.push(await sharp({create:{width:280,height:300,channels:4,background:'#f9f5ee'}}).composite([{input:thumb,left:10,top:4},{input:label,left:0,top:268}]).png().toBuffer());
    }
    console.log(`${breed.id}: ${path.relative(root,source)} -> ${left},${top},${size}`);
  }
  if(previews.length)await sharp({create:{width:1400,height:1200,channels:4,background:'#f9f5ee'}}).composite(previews.map((input,i)=>({input,left:i%5*280,top:Math.floor(i/5)*300}))).png().toFile(path.join(root,'ranking-thumbs-preview.png'));
}
build().catch(error=>{console.error(error);process.exitCode=1});
