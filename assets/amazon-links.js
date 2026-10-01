/* Product IDs and the owner's original Amazon URLs are managed only here.
 * Never replace these short URLs with resolved URLs or strip affiliate parameters.
 * To add a placement: <div data-amazon-product="tofukasu-k"></div>
 */
(() => {
  'use strict';
  const products = [
    {id:'tofukasu-k',name:'トフカスサンドK 7L',url:'https://link.amazon/B06J5TPxI'},
    {id:'lion-okara',name:'ライオン ニオイをとるおから砂',url:'https://link.amazon/B0hGBAMdj'},
    {id:'pidan-mix',name:'pidan おからベントナイトミックス',url:null},
    {id:'tofukasu-tab',name:'トフカスタブ 7L',url:'https://link.amazon/B0audirSY',offer:'リンク先：7L×4個セット'},
    {id:'tofukasu-sand',name:'トフカスサンド 7L',url:'https://link.amazon/B0bE9OeBM'},
    {id:'tofukasu-ree',name:'トフカスRee 7L青りんごの香り',aliases:['トフカスRee 7L'],url:'https://link.amazon/B0bL1deJI',offer:'リンク先：7L×4個セット'},
    {id:'tofukasu-pee',name:'トフカスPee 7Lピーチの香り',aliases:['トフカスPee 7L'],url:'https://link.amazon/B036p8v5q',offer:'リンク先：7L×4袋セット'},
    {id:'tofukasu-shine',name:'トフカスシャイン 7Lシャインマスカットの香り',aliases:['トフカスシャイン 7L'],url:'https://link.amazon/B02WY2XxV',offer:'リンク先：7L×4個セット'},
    {id:'tofukasu-w',name:'トフカスW 7L森林の香り',aliases:['トフカスW 7L'],url:'https://link.amazon/B0jhZsioA',offer:'リンク先：7L×6個セット'},
    {id:'tofukasu-large',name:'トフカス大粒 7L',url:'https://link.amazon/B097m7oUX'},
    {id:'tea-okara',name:'お茶とおからの猫砂 6L',url:'https://link.amazon/B08xOjFM3',offer:'リンク先：6L×4袋セット'},
    {id:'soap-okara',name:'おからの猫砂 せっけんの香り 6L',url:'https://link.amazon/B07NB2p0q',offer:'リンク先：6L×4袋セット'}
  ];
  const normalize=value=>String(value).normalize('NFKC').replace(/\s+/g,'').toLowerCase();
  const names=new Map();
  products.forEach(product=>[product.id,product.name,...(product.aliases||[])].forEach(name=>names.set(normalize(name),product)));
  const find=value=>names.get(normalize(value));
  const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const button=(value,compact=false)=>{
    const product=find(value);
    if(!product?.url)return '';
    let url;
    try{url=new URL(product.url);}catch{return '';}
    if(url.protocol!=='https:'||!['link.amazon','amzn.to','www.amazon.co.jp','amazon.co.jp'].includes(url.hostname))return '';
    return `<div class="amazon-action"><span class="affiliate-label">広告</span><a class="amazon-cta" href="${escape(product.url)}" target="_blank" rel="sponsored noopener noreferrer" aria-label="${escape(product.name)}の価格をAmazonで見る（広告・新しいタブ）">Amazonで価格を見る <span aria-hidden="true">↗</span></a>${!compact&&product.offer?`<small class="amazon-offer-note">${escape(product.offer)}</small>`:''}</div>`;
  };
  const mount=(root=document)=>root.querySelectorAll('[data-amazon-product]').forEach(slot=>{
    slot.innerHTML=button(slot.dataset.amazonProduct,slot.hasAttribute('data-amazon-compact'));
  });
  window.NekoAmazon={products,find,button,mount};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mount());
  else mount();
})();
