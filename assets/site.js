/* One category registry: set href when a new comparison is ready; paths are site-root relative. */
(() => {
  const siteRoot = new URL('../', document.currentScript.src);
  const categories = [
    {id:'litter', name:'猫砂', href:'compare/okara-litter.html', cta:'おから猫砂・全12商品を比較'},
    {id:'toilets', name:'猫トイレ', href:'compare/cat-toilets.html', cta:'おすすめ4タイプを比較'},
    {id:'carriers', name:'キャリーバッグ', href:null, cta:'キャリーバッグを比較'}
  ];
  window.NekoSite = {categories};
  const url = path => new URL(path, siteRoot).href;
  // Central navigation registry; static HTML remains a no-script fallback.
  const navActions = [
    {name:'肉球であそぶ',href:'breeds/paw-pop.html'},
    {name:'猫種図鑑',href:'breeds/'}
  ];
  const navigation = [{name:'TOP',href:'index.html'}, ...categories, {name:'運営情報',href:'about.html'}];
  const makeNavigation = (items, extraClass='') => items.map(item=>{
    const element=document.createElement(item.href?'a':'span');
    element.textContent=item.name;
    if(extraClass || item.className) element.className=[extraClass,item.className].filter(Boolean).join(' ');
    if(item.id)element.dataset.categoryNav=item.id;
    if(item.href)element.href=url(item.href);
    else{
      element.className=[element.className,'np-pending'].filter(Boolean).join(' ');
      const status=document.createElement('small');status.textContent='準備中';element.append(status);
    }
    return element;
  });
  const navActionsRoot=document.querySelector('.np-nav-actions');
  if(navActionsRoot) navActionsRoot.replaceChildren(...makeNavigation(navActions));
  const navigationRoot=document.querySelector('.np-navigation');
  if(navigationRoot){
    const items=navActionsRoot
      ? [...navActions.map(item=>({...item,className:'np-nav-action-copy'})),...navigation]
      : [{name:'TOP',href:'index.html'},...categories,{name:'猫種図鑑',href:'breeds/'},{name:'肉球で遊ぶ',href:'breeds/paw-pop.html'},{name:'運営情報',href:'about.html'}];
    navigationRoot.replaceChildren(...makeNavigation(items));
  }
  const pathname = location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.np-navigation a').forEach(a => {
    if (new URL(a.href).pathname.replace(/index\.html$/, '') === pathname) a.setAttribute('aria-current','page');
  });
  categories.forEach(category => {
    if (!category.href) return;
    const card = document.querySelector('[data-category-card="'+category.id+'"]');
    if (card) {
      const link = card.tagName === 'A' ? card : document.createElement('a');
      if (link !== card) {
        link.className = card.className;
        link.dataset.categoryCard = category.id;
        while (card.firstChild) link.append(card.firstChild);
        card.replaceWith(link);
      }
      link.classList.remove('np-category-soon'); link.href = url(category.href);
      const status=link.querySelector('.np-status');
      status.textContent='比較できます'; status.classList.remove('np-status-soon');
      link.querySelector('[data-category-cta]').textContent=category.cta;
      link.querySelector('.np-card-end>span:last-child').textContent='↗';
    }
  });
  const toggle=document.querySelector('.np-menu-toggle');
  const nav=document.querySelector('.np-navigation');
  if (toggle && nav) {
    const close = () => {nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','メニューを開く');};
    toggle.addEventListener('click', () => {
      const open=toggle.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く');
    });
    nav.addEventListener('click',event=>{if(event.target.closest('a'))close();});
    document.addEventListener('click',event=>{if(!event.target.closest('.np-header'))close();});
    document.addEventListener('keydown',event=>{if(event.key==='Escape' && toggle.getAttribute('aria-expanded')==='true'){close();toggle.focus();}});
    matchMedia('(min-width:1051px)').addEventListener('change',close);
  }
  // Keep previously shared comparison section URLs working after the TOP becomes a portal.
  if (location.pathname === siteRoot.pathname || location.pathname === new URL('index.html',siteRoot).pathname) {
    if (['#top4','#howto','#cats','#products'].includes(location.hash)) {
      location.replace(url('compare/okara-litter.html') + location.search + location.hash);
    }
  }
})();
