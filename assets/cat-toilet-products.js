/*
 * 猫トイレの購入先はこのファイルで一元管理します。
 * amazonUrl は提供されたURLを大文字・小文字も含めてそのまま使用します。
 * 未設定時はメーカー・正規販売ページを案内します。
 */
(() => {
  const mainProducts = [
    {
      id: 'deot-wide',
      name: 'デオトイレ 快適ワイド リラックス+ 本体セット',
      variant: 'シルキーホワイト／猫砂・シート約1か月分付き',
      amazonUrl: 'https://link.amazon/B09ydMyiw',
    },
    {
      id: 'iris-top',
      name: 'アイリスオーヤマ 上から猫トイレ PUNT-530',
      variant: 'レギュラー／アイボリー',
      amazonUrl: 'https://link.amazon/B0i7A2BaL',
    },
    {
      id: 'amazon-hooded',
      name: 'Amazonベーシック フード付き猫用トイレ',
      variant: 'Lサイズ／61×46×43cm／マルチカラー',
      amazonUrl: 'https://link.amazon/B0244Bhc8',
    },
    {
      id: 'richell-m',
      name: 'リッチェル ラプレ シームレスネコトイレ',
      variant: 'M／ホワイト／36×48×12cm／156682',
      amazonUrl: 'https://link.amazon/B02F3yNF6',
    },
  ];
  const products = [
    {
      id: 'deot-kitten',
      name: 'デオトイレ 子猫〜5kgの成猫用 本体セット',
      variant: 'ナチュラルアイボリー／猫砂・シート約1か月分付き',
      type: 'システムトイレ / コンパクト',
      imageUrl: 'https://jp.unicharmpet.com/content/dam/sites/jp_unicharmpet_com/deotoilet/top/lineup_set_image_01.png',
      imageSource: 'ユニ・チャーム ペット公式',
      officialUrl: 'https://jp.unicharmpet.com/ja/brand/deotoilet-c.html',
      amazonUrl: 'https://link.amazon/B03RxbALT',
      price: '○ 標準',
      description: 'はじめてシステムトイレを試すときに選びやすい、基本サイズの本体セットです。',
      forWhom: '掃除の負担を減らしたい1頭飼いの人',
    },
    {
      id: 'deot-simple',
      name: 'デオトイレ らくらくシンプル本体セット',
      variant: 'シルキーホワイト／猫砂・シート約1か月分付き',
      type: 'システムトイレ / シンプル',
      imageUrl: 'https://jp.unicharmpet.com/content/dam/sites/jp_unicharmpet_com/deotoilet/top/lineup_set_image_02.png',
      imageSource: 'ユニ・チャーム ペット公式',
      officialUrl: 'https://jp.unicharmpet.com/ja/brand/deotoilet-c.html',
      amazonUrl: 'https://link.amazon/B03k6uFyk',
      price: '◎ 比較的手に取りやすい',
      description: '専用シートとチップを使う、システムトイレのシンプルな選択肢です。',
      forWhom: '初期費用も抑えながら始めたい人',
    },
    {
      id: 'deot-fan',
      name: 'デオトイレ 脱臭ファン＋本体セット',
      variant: 'ホワイトグレー',
      type: 'システムトイレ / ニオイ対策',
      imageUrl: 'https://jp.unicharmpet.com/content/dam/sites/jp_unicharmpet_com/deotoilet/top/lineup_set_image_06.png',
      imageSource: 'ユニ・チャーム ペット公式',
      officialUrl: 'https://jp.unicharmpet.com/ja/brand/deotoilet-c.html',
      amazonUrl: 'https://link.amazon/B0hWjJwDM',
      price: '△ 高め',
      description: '脱臭機能を備えたモデル。設置場所のニオイが気になる家庭で検討しやすい一台です。',
      forWhom: 'リビング置きでニオイ対策を重視する人',
    },
    {
      id: 'iris-half',
      name: 'アイリスオーヤマ 猫のトイレ ハーフカバー P-NE-500-H',
      variant: 'シンプル ハーフカバー／P-NE-500-H',
      type: 'ハーフカバー / 低価格',
      imageUrl: 'https://www.irisplaza.co.jp/IMAGE/PET/PRODUCT/207009.jpg?iup=2025033&imformat=chrome&im=Resize,width=800',
      imageSource: 'アイリスプラザ公式',
      officialUrl: 'https://www.irisplaza.co.jp/index.php?KB=SHOSAI&SID=207009&target=shohin',
      amazonUrl: 'https://link.amazon/B0jhEuuJO',
      price: '◎ 安い',
      description: '高さのあるカバーで、オープン型より猫砂の飛び散りを抑えやすい定番モデルです。',
      forWhom: '価格を抑えてカバー付きを選びたい人',
    },
    {
      id: 'iris-full',
      name: 'アイリスオーヤマ 猫のトイレ フルカバー P-NE-500-F',
      variant: 'シンプル フルカバー／P-NE-500-F',
      type: 'フルカバー / 砂の飛び散り対策',
      imageUrl: 'https://www.irisplaza.co.jp/IMAGE/PET/PRODUCT/207010.jpg?iup=2025033&imformat=chrome&im=Resize,width=800',
      imageSource: 'アイリスプラザ公式',
      officialUrl: 'https://www.irisplaza.co.jp/index.php?KB=SHOSAI&SID=207010',
      amazonUrl: 'https://link.amazon/B0fjELKPZ',
      price: '○ 標準',
      description: '扉付きのフルカバー型。砂の飛び散りと視線をしっかり抑えたいときの候補です。',
      forWhom: '囲われた形を選びたい人',
    },
    {
      id: 'iris-large',
      name: 'アイリスオーヤマ 大型猫トイレ PON-750',
      variant: 'PON-750',
      type: '大型 / 多頭飼い向け',
      imageUrl: 'https://www.irisplaza.co.jp/IMAGE/PET/PRODUCT/212042.jpg?iup=2025033&imformat=chrome&im=Resize,width=800',
      imageSource: 'アイリスプラザ公式',
      officialUrl: 'https://www.irisplaza.co.jp/index.php?KB=SHOSAI&SID=212042',
      amazonUrl: 'https://link.amazon/B02lO8p6W',
      price: '○ 標準',
      description: '幅約75cmのゆったりした大型サイズ。キャスター付きで動かしやすい設計です。',
      forWhom: '大型猫・多頭飼いで広さを優先したい人',
    },
    {
      id: 'rakurin-open',
      name: 'アイリスオーヤマ ラクリーン 消臭システムトイレ オープンタイプ RSTO-50',
      variant: 'スターターセット／オープンタイプ／消臭シート・サンド付き',
      type: 'システムトイレ / オープン',
      imageUrl: 'https://www.irisplaza.co.jp/IMAGE/PET/PRODUCT/206677.jpg?iup=2025033&imformat=chrome&im=Resize,width=800',
      imageSource: 'アイリスプラザ公式',
      officialUrl: 'https://www.irisplaza.co.jp/index.php?KB=SHOSAI&SID=206677',
      amazonUrl: 'https://link.amazon/B02muESjf',
      price: '○ 標準',
      description: 'サンドとシートを含むスターターセット。オープンな出入り口で子猫やシニア猫にも配慮しやすいタイプです。',
      forWhom: 'はじめてシステムトイレを使う人',
    },
    {
      id: 'rakurin-top',
      name: 'アイリスオーヤマ ラクリーン 消臭システムトイレ 上からタイプ RSTU-43',
      variant: '上からタイプ／RSTU-43',
      type: 'システムトイレ / 上から入る',
      imageUrl: 'https://www.irisplaza.co.jp/IMAGE/PET/PRODUCT/206676.jpg?iup=2025033&imformat=chrome&im=Resize,width=800',
      imageSource: 'アイリスプラザ公式',
      officialUrl: 'https://www.irisplaza.co.jp/index.php?KB=SHOSAI&SID=206676',
      amazonUrl: 'https://link.amazon/B0b9qgjbW',
      price: '△ 高め',
      description: '上から入る形とシステム型を組み合わせ、猫砂の飛び散りと日々の手入れに配慮したセットです。',
      forWhom: '飛び散りとニオイ対策を両立したい人',
    },
  ];

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character]));

  const byId = new Map([...mainProducts, ...products].map(product => [product.id, product]));
  const purchaseLink = (product, className) => {
    const targetUrl = product.amazonUrl || product.officialUrl;
    const text = product.amazonUrl ? 'Amazonで価格を見る' : '公式・販売ページを見る';
    const rel = product.amazonUrl ? 'sponsored noopener noreferrer' : 'noopener noreferrer';
    return `<a class="${className}" data-toilet-purchase="${escapeHtml(product.id)}" href="${escapeHtml(targetUrl)}" target="_blank" rel="${rel}" aria-label="${escapeHtml(product.name + ' ' + product.variant)}：${text}（新しいタブ）">${text}<span aria-hidden="true"> ↗</span></a>`;
  };

  const render = () => {
    document.querySelectorAll('[data-toilet-image]').forEach(link => {
      const product = byId.get(link.dataset.toiletImage);
      if (!product?.amazonUrl) return;
      link.setAttribute('href', product.amazonUrl);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'sponsored noopener noreferrer');
      link.setAttribute('data-toilet-purchase', product.id);
      link.setAttribute('aria-label', product.name + ' ' + product.variant + '：Amazonで見る（新しいタブ）');
    });
    document.querySelectorAll('[data-toilet-product]').forEach(slot => {
      const product = byId.get(slot.dataset.toiletProduct);
      if (!product?.amazonUrl) return;
      slot.innerHTML = purchaseLink(product, 'toilet-amazon-cta') +
        (slot.hasAttribute('data-toilet-compact') ? '' : `<small class="toilet-offer-note">リンク先：${escapeHtml(product.variant)}</small>`);
    });
    document.querySelectorAll('[data-toilet-other-products]').forEach((container) => {
      container.innerHTML = products.map((product) => {
        const targetUrl = product.amazonUrl || product.officialUrl;
        const buttonRel = product.amazonUrl ? 'sponsored noopener noreferrer' : 'noopener noreferrer';
        return `
          <article class="other-product-card">
            <a class="other-product-image" data-toilet-purchase="${escapeHtml(product.id)}" href="${escapeHtml(targetUrl)}" target="_blank" rel="${buttonRel}">
              <img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}" loading="lazy">
            </a>
            <div class="other-product-body">
              <p class="other-product-type">${escapeHtml(product.type)}</p>
              <h3>${escapeHtml(product.name)}</h3>
              <p class="other-product-price">${escapeHtml(product.price)}</p>
              <p>${escapeHtml(product.description)}</p>
              <p class="other-product-fit"><b>向いている人</b>${escapeHtml(product.forWhom)}</p>
              ${purchaseLink(product, 'other-product-link')}
              <small class="toilet-offer-note">リンク先：${escapeHtml(product.variant)}</small>
              <a class="other-product-source" href="${escapeHtml(product.officialUrl)}" target="_blank" rel="noopener noreferrer">画像・商品情報：${escapeHtml(product.imageSource)} ↗</a>
            </div>
          </article>`;
      }).join('');
    });
  };

  window.catToiletProducts = products;
  window.catToiletMainProducts = mainProducts;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render, { once: true });
  else render();
})();
