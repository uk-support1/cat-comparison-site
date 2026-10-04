(() => {
  if (location.hostname === 'cat.kurashi-partner-ku.com') { location.replace(`https://kurashi-partner-ku.com${location.pathname}${location.search}${location.hash}`); return; }
  const data = window.SecurityPortal;
  if (!data) return;
  const root = document.body.dataset.root || '/';
  const cityPath = slug => `${root}security/tokyo/${slug}/`;
  const status = m => `<span class="s-status ${m.status === 'caution' ? 'caution' : m.status === 'closed' ? 'closed' : ''}">${m.status === 'active' ? '●' : m.status === 'caution' ? '●' : '●'} ${m.statusLabel}</span><span class="s-update">最終確認：${data.checked.replaceAll('-','年').replace(/年(\d\d)$/, '年$1日')}</span>`;
  const link = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span></a>`;
  const cityLinks = () => Object.values(data.municipalities).map(m => `<a class="s-city-link" href="${cityPath(m.slug)}"><span>${m.name}</span><span>${m.maxLabel}</span></a>`).join('');
  document.querySelectorAll('[data-city-links]').forEach(el => el.innerHTML = cityLinks());
  const menu = document.querySelector('.s-menu'), nav = document.querySelector('.s-nav');
  if (menu && nav) menu.addEventListener('click', () => { const on = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(on)); });
  document.querySelector('.s-page-hero')?.classList.add('visual-head');
  const reveal = document.querySelectorAll('.s-reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) { const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold:.15}); reveal.forEach(el => observer.observe(el)); } else reveal.forEach(el => el.classList.add('is-visible'));
  const animateNumber = el => { const target = Number(el.dataset.odometer || 0); if (!target || matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = target.toLocaleString('ja-JP'); return; } const start = performance.now(), duration = 1400; const tick = now => { const p = Math.min(1,(now-start)/duration), value = Math.round(target * (1-Math.pow(1-p,3))); el.textContent = value.toLocaleString('ja-JP'); if(p<1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
  const odometers = document.querySelectorAll('[data-odometer]');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) { const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){animateNumber(entry.target);observer.unobserve(entry.target);} }), {threshold:.65}); odometers.forEach(el=>observer.observe(el)); } else odometers.forEach(animateNumber);

  const table = document.querySelector('[data-city-table]');
  if (table) table.innerHTML = Object.values(data.municipalities).map(m => `<tr><td><a href="${cityPath(m.slug)}">${m.name}</a></td><td>${m.rateLabel}</td><td>${m.maxLabel}</td><td>${m.eligible.split('、').slice(0,4).join('・')} など</td><td>${m.onlineShort}</td><td>${status(m)}</td><td>${link(m.official,'公式詳細')}</td></tr>`).join('');

  const slug = document.body.dataset.municipality;
  if (slug && data.municipalities[slug]) {
    const m = data.municipalities[slug];
    const auto = document.querySelector('[data-muni-auto]');
    if (auto) {
      const amazon = slug === 'ota' ? `<section class="s-section"><div class="s-shell"><div class="s-amazon-box"><p class="s-eyebrow">OTA / AMAZON PURCHASE</p><h2>Amazonで買う前に、<br>書類を残せるか確認。</h2><p>大田区はAmazon購入の例外的な書類運用を公式に案内しています。Amazonで購入すれば必ず対象になるわけではありません。商品・設置・申請要件は必ず区公式で確認してください。</p><div class="s-amazon-steps"><div><b>購入前</b>屋外を写す・外部から存在が確認できる・安易に移動できない等、家庭用防犯カメラの要件と取付方法を確認します。</div><div><b>購入後に保存</b>「領収書・注文概要・注文の詳細」のいずれか1点 ＋ 「適格請求書・支払明細書」のいずれか1点。書式変更により追加書類を求められる場合があります。</div></div></div></div></section>` : '';
      auto.innerHTML = `<div class="s-shell s-crumb"><a href="${root}security/">防犯対策・補助金ポータル</a> / <a href="${root}security/tokyo/">東京都</a> / ${m.name}</div><section class="s-page-hero"><div class="s-shell s-page-title"><p class="s-eyebrow">OFFICIAL SUBSIDY GUIDE</p><h1>${m.name}の<br>防犯カメラ補助金</h1><p>${m.name}で自宅の防犯対策を検討する方向けに、公式情報で確認できた補助制度を整理しています。${m.feature}</p><p class="s-source">公式情報確認日：2026年10月05日（公式ページ更新日：${m.officialUpdated}）</p></div></section><section class="s-section"><div class="s-shell s-muni-lead"><div class="s-amount"><span>補助額（公式制度）</span><strong>${m.rateLabel}<br>上限 ${m.maxLabel}</strong><small>対象経費・条件・端数処理は公式案内でご確認ください。</small></div><div class="s-status-card">${status(m)}<h2>まず確認すること</h2><p>${m.feature}</p><p style="margin-top:12px"><a class="s-button outline" href="${m.official}" target="_blank" rel="noopener noreferrer">${m.name}公式サイトで最新情報を確認</a></p></div></div></section><section class="s-section tint"><div class="s-shell"><div class="s-heading"><div><p class="s-eyebrow">APPLICATION DETAILS</p><h2 class="s-h2">対象・手続きの要点</h2></div><p>購入・設置後の申請を想定する制度です。ただし、集合住宅・賃貸住宅・工事内容には追加確認が必要な場合があります。</p></div><div class="s-details"><article class="s-detail"><h3>対象者</h3><p>区内に住民登録があり、対象住宅に居住している世帯。世帯ごとの回数制限や過年度受給の条件を公式案内で確認してください。</p></article><article class="s-detail"><h3>対象機器</h3><p>${m.eligible}</p></article><article class="s-detail"><h3>ネット・通販購入</h3><p>${m.online}</p></article><article class="s-detail"><h3>購入日・設置条件</h3><p>${m.purchasedFrom}</p></article><article class="s-detail"><h3>必要書類</h3><p>${m.documents}</p></article><article class="s-detail"><h3>申請方法・期限</h3><p>${m.method}<br><strong>${m.deadline}</strong></p></article></div><div class="s-alert" style="margin-top:20px"><strong>この自治体で重要なポイント</strong><br>${m.unique}<br>${m.caution}</div></div></section>${amazon}<section class="s-section"><div class="s-shell"><div class="s-heading"><div><p class="s-eyebrow">CAMERA CANDIDATES</p><h2 class="s-h2">補助要件を満たしやすい<br>防犯カメラ候補</h2></div><p>屋外用・録画・固定設置・耐候性・購入証明を確認しやすいことを基準にした候補です。対象を保証するものではありません。</p></div><div class="s-product-mini">${data.products.slice(0,3).map(p=>`<article><span class="s-product-badge">${p.badge}</span><h3>${p.name}</h3><p>${p.note}</p><p class="s-stars">補助制度との相性 ${'★'.repeat(p.fit)}${'☆'.repeat(5-p.fit)}</p><a class="s-button outline" href="${root}security/camera/">補助後の目安を見る</a></article>`).join('')}</div></div></section><section class="s-section tint"><div class="s-shell"><div class="s-sim"><p class="s-eyebrow">COST SIMULATION</p><h2>${m.name}での補助後価格イメージ</h2><div class="s-sim-grid"><div><span>防犯カメラの価格例</span><strong>${data.yen(49800)}</strong></div><div><span>${m.name}の補助額目安</span><strong>−${data.yen(data.grant(49800,m))}</strong></div><div><span>自己負担の目安</span><strong>${data.yen(49800-data.grant(49800,m))}</strong></div></div><p class="s-source">制度要件を満たし、申請が認められた場合の試算です。販売価格・補助対象経費・端数処理等により実際の自己負担は変わります。</p></div></div></section><section class="s-section"><div class="s-shell s-official"><div><strong>申請前に、${m.name}公式サイトで最終確認</strong><p>予算・受付期間・対象機器・必要書類は変更される場合があります。</p></div><a class="s-button alt" href="${m.official}" target="_blank" rel="noopener noreferrer">公式情報を確認</a></div><p class="s-source">本ページは各自治体等の公式情報をもとに作成しています。購入前・申請前に必ず自治体公式ページをご確認ください。</p></div></section>`;
    }
    document.querySelectorAll('[data-muni-name]').forEach(e => e.textContent = m.name);
    document.querySelectorAll('[data-muni-rate]').forEach(e => e.textContent = m.rateLabel);
    document.querySelectorAll('[data-muni-max]').forEach(e => e.textContent = m.maxLabel);
    document.querySelectorAll('[data-muni-status]').forEach(e => e.innerHTML = status(m));
    const fields = { feature:'feature', eligible:'eligible', online:'online', purchasedFrom:'purchasedFrom', documents:'documents', method:'method', deadline:'deadline', unique:'unique', caution:'caution' };
    Object.entries(fields).forEach(([key, prop]) => document.querySelectorAll(`[data-muni-${key}]`).forEach(e => e.textContent = m[prop]));
    document.querySelectorAll('[data-muni-official]').forEach(e => { e.href = m.official; e.textContent = `${m.name}公式サイトで最新情報を確認`; });
    document.querySelectorAll('[data-muni-updated]').forEach(e => e.textContent = `公式情報確認日：${data.checked.replaceAll('-','年').replace(/年(\d\d)$/, '年$1日')}（公式ページ更新日：${m.officialUpdated.replaceAll('-','年').replace(/年(\d\d)$/, '年$1日')}）`);
    const sim = document.querySelector('[data-muni-simulation]');
    if (sim) { const amount = 49800, grant = data.grant(amount,m); sim.innerHTML = `<div><span>防犯カメラの価格例</span><strong>${data.yen(amount)}</strong></div><div><span>${m.name}の補助額目安</span><strong>−${data.yen(grant)}</strong></div><div><span>自己負担の目安</span><strong>${data.yen(Math.max(0,amount-grant))}</strong></div>`; }
    const products = document.querySelector('[data-muni-products]');
    if (products) products.innerHTML = data.products.slice(0,3).map(p => `<article><div class="s-product-image"><img src="${root}assets/security/camera-forms.png" alt="屋外防犯カメラの設置イメージ" loading="lazy"><small>設置イメージ</small></div><span class="s-product-badge">${p.badge}</span><h3>${p.name}</h3><p>${p.note}</p><p class="s-stars">補助制度との相性 ${'★'.repeat(p.fit)}${'☆'.repeat(5-p.fit)}</p><a class="s-button outline" href="${root}security/camera/">補助後の目安を見る</a></article>`).join('');
    if (auto) auto.querySelectorAll('.s-product-mini article').forEach(card => card.insertAdjacentHTML('afterbegin', `<div class="s-product-image"><img src="${root}assets/security/camera-forms.png" alt="屋外防犯カメラの設置イメージ" loading="lazy"><small>設置イメージ</small></div>`));
    if (slug === 'setagaya' && !document.querySelector('[data-setagaya-chart]')) { const chart = document.createElement('section'); chart.className='s-section'; chart.dataset.setagayaChart=''; chart.innerHTML=`<div class="s-shell"><div class="s-donut-layout"><div class="s-donut"><strong>1,914<small>8月末受付件数</small></strong></div><div class="s-donut-copy"><p class="s-eyebrow">SETAGAYA / OFFICIAL UPDATE</p><h3>概算1万件に対し、<br>約2割を受付。</h3><p>世田谷区が公表する令和8年度の受付件数と受付可能件数（概算）を可視化しました。予算・審査状況で数値は変動します。</p><p class="s-source">出典：世田谷区「住まいの防犯対策サポート事業」（2026年8月31日現在の受付状況）</p></div></div></div></section>`; document.querySelector('main')?.append(chart); }
    const faq = [
      {q:`${m.name}でAmazon・通販購入した防犯カメラは補助対象ですか？`,a:`通販購入の可否や必要書類は${m.name}の制度条件によります。領収書、商品名・型番、支払い事実、設置後写真等が求められる場合があります。購入前に公式ページで確認してください。`},
      {q:`補助金は必ず受け取れますか？`,a:'いいえ。対象品目、設置場所、申請者、購入日、書類、予算等の要件を満たし、申請が認められた場合に交付されます。'},
      {q:`防犯カメラ以外もまとめて申請できますか？`,a:'複数品目を申請できる制度がありますが、世帯あたりの申請回数・上限・対象経費は自治体によって異なります。公式案内で確認してください。'}
    ];
    const faqBlock = document.createElement('section'); faqBlock.className = 's-section tint'; faqBlock.innerHTML = `<div class="s-shell"><p class="s-eyebrow">FAQ</p><h2 class="s-h2">よくある質問</h2>${faq.map(item=>`<details class="s-detail" style="margin-top:12px"><summary style="cursor:pointer;font-weight:800">${item.q}</summary><p style="margin-top:10px">${item.a}</p></details>`).join('')}</div>`; document.querySelector('main')?.append(faqBlock);
    const schema = document.createElement('script'); schema.type = 'application/ld+json'; schema.textContent = JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq.map(item=>({'@type':'Question',name:item.q,acceptedAnswer:{'@type':'Answer',text:item.a}}))}); document.head.append(schema);
  }

  const productRoot = document.querySelector('[data-product-root]');
  if (productRoot) {
    productRoot.classList.add('s-featured-products');
    const selector = document.querySelector('[data-city-select]');
    selector.innerHTML = Object.values(data.municipalities).map(m => `<option value="${m.slug}">${m.name}（${m.rateLabel}・上限${m.maxLabel}）</option>`).join('');
    const render = () => {
      const m = data.municipalities[selector.value];
      document.querySelector('[data-selected-city]').textContent = m.name;
      document.querySelector('[data-selected-rule]').textContent = `${m.rateLabel}・上限${m.maxLabel}として試算`;
      productRoot.innerHTML = data.products.map(p => {
        const grant = data.grant(p.price,m), self = Math.max(0,p.price-grant);
        return `<article class="s-product"><div class="s-product-image"><img src="${root}assets/security/camera-forms.png" alt="${p.name}を検討する際の屋外防犯カメラ設置イメージ" loading="lazy"><small>設置イメージ（商品そのものではありません）</small></div><div class="s-product-top"><span class="s-product-badge">${p.badge}</span><h2>${p.name}</h2><p class="s-maker">${p.maker}</p><p class="s-fit">補助制度との相性　${'★'.repeat(p.fit)}${'☆'.repeat(5-p.fit)}</p></div><div class="s-product-body"><p>${p.note}</p><dl><div><dt>価格の扱い</dt><dd>${p.priceLabel}</dd></div><div><dt>画質</dt><dd>${p.resolution}</dd></div><div><dt>夜間撮影</dt><dd>${p.night}</dd></div><div><dt>パン/チルト</dt><dd>${p.ptz}</dd></div><div><dt>検知</dt><dd>${p.person}</dd></div><div><dt>防水・防塵</dt><dd>${p.weather}</dd></div><div><dt>電源 / 通信</dt><dd>${p.power}<br>${p.wifi}</dd></div><div><dt>録画</dt><dd>${p.local}<br>${p.cloud}</dd></div><div><dt>固定方法</dt><dd>${p.mount}</dd></div></dl><div class="s-product-actions">${link(p.official,'公式仕様を確認')}</div></div><div class="s-savings"><span>通常価格の目安（試算用）</span><strong>${data.yen(p.price)}</strong><span>${m.name}で要件を満たし、交付された場合の自己負担目安</span><strong>${data.yen(self)}</strong><small>補助額 ${data.yen(grant)}。対象経費・固定設置・申請書類などの要件を満たし、申請が認められた場合の試算です。</small></div></article>`;
      }).join('');
      const comparison = document.querySelector('[data-comparison]');
      if (comparison) comparison.innerHTML = data.products.map(p => `<tr><td>${p.name}</td><td>${p.resolution}</td><td>${p.night}</td><td>${p.field}</td><td>${p.ptz}</td><td>${p.person}</td><td>${p.weather}</td><td>${p.power}</td><td>${p.local}</td><td>${'★'.repeat(p.fit)}${'☆'.repeat(5-p.fit)}</td></tr>`).join('');
    };
    selector.addEventListener('change', render); render();
  }
})();
