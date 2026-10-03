// Shared Google tag: initialize once, even if the shared script is included twice.
(() => {
  const measurementId = 'G-XNJBENZKBD';
  if (!document.head || window.nekoAnalyticsInitialized) return;
  window.nekoAnalyticsInitialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);
  if (!document.querySelector('script[src="https://www.googletagmanager.com/gtag/js?id=' + measurementId + '"]')) {
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.append(tag);
  }
})();

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
  const pawGameName='肉球バブルであそぶ';
  const navActions = [
    {name:pawGameName,href:'breeds/paw-pop.html',action:'paw'},
    {name:'猫種図鑑',href:'breeds/',action:'breeds'}
  ];
  const navigation = [{name:'TOP',href:'index.html'}, ...categories, {name:'運営情報',href:'about.html'}];
  const makeNavigation = (items, extraClass='') => items.map(item=>{
    const element=document.createElement(item.href?'a':'span');
    element.textContent=item.name;
    if(extraClass || item.className) element.className=[extraClass,item.className].filter(Boolean).join(' ');
    if(item.id)element.dataset.categoryNav=item.id;
    if(item.action)element.dataset.navAction=item.action;
    if(item.href)element.href=url(item.href);
    else{
      element.className=[element.className,'np-pending'].filter(Boolean).join(' ');
      const status=document.createElement('small');status.textContent='準備中';element.append(status);
    }
    return element;
  });
  let navActionsRoot=document.querySelector('.np-nav-actions');
  if(!navActionsRoot){
    const headerInner=document.querySelector('.np-header-inner');
    const navigationRoot=headerInner?.querySelector('.np-navigation');
    if(headerInner&&navigationRoot){
      navActionsRoot=document.createElement('nav');
      navActionsRoot.className='np-nav-actions';
      navActionsRoot.setAttribute('aria-label','楽しむコンテンツ');
      headerInner.insertBefore(navActionsRoot,headerInner.querySelector('.np-menu-toggle')||navigationRoot);
    }
  }
  if(navActionsRoot) navActionsRoot.replaceChildren(...makeNavigation(navActions));
  const navigationRoot=document.querySelector('.np-navigation');
  if(navigationRoot){
    const items=navActionsRoot
      ? [...navActions.map(item=>({...item,className:'np-nav-action-copy'})),...navigation]
      : [{name:'TOP',href:'index.html'},...categories,{name:'猫種図鑑',href:'breeds/'},{name:pawGameName,href:'breeds/paw-pop.html'},{name:'運営情報',href:'about.html'}];
    navigationRoot.replaceChildren(...makeNavigation(items));
  }
  document.querySelectorAll('footer.np-footer a[href*="breeds/paw-pop.html"]').forEach(link=>{link.textContent=pawGameName;});
  document.querySelectorAll('.np-play-card h3').forEach(title=>{title.textContent=pawGameName;});
  document.querySelectorAll('.np-play-card .np-text-link').forEach(link=>{link.textContent=`${pawGameName} →`;});
  // Keep the specialist site visibly connected to its parent brand without changing its own navigation.
  const footerBrand=document.querySelector('.np-footer-top > div');
  if(footerBrand && !footerBrand.querySelector('.np-parent-link')){
    const parentLink=document.createElement('a');
    parentLink.className='np-parent-link'; parentLink.href='https://kurashi-partner-ku.com/';
    parentLink.textContent='くらしパートナー'; parentLink.setAttribute('rel','home');
    parentLink.setAttribute('aria-label','親ブランド「くらしパートナー」へ');
    footerBrand.append(parentLink);
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
