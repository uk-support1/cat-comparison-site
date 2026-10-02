/*
 * 猫トイレ比較ページの「主力以外の候補」をここだけで管理します。
 * amazonUrl にアソシエイトURLを設定すると、購入ボタンの遷移先だけを
 * 差し替えられます。未設定時はメーカー・正規販売ページを案内します。
 */
(() => {
  const products = [
    {
      name: 'デオトイレ 子猫〜5kgの成猫用 本体セット',
      type: 'システムトイレ / コンパクト',
      imageUrl: 'https://jp.unicharmpet.com/content/dam/sites/jp_unicharmpet_com/pet/products-cat/deotoilet_c/4520699635544.png',
      imageSource: 'ユニ・チャーム ペット公式',
      officialUrl: 'https://jp.unicharmpet.com/ja/brand/deotoilet-c.html',
      amazonUrl: '',
      price: '○ 標準',
      description: 'はじめてシステムトイレを試すときに選びやすい、基本サイズの本体セットです。',
      forWhom: '掃除の負担を減らしたい1頭飼いの人',
    },
    {
      name: 'デオトイレ らくらくシンプル本体セット',
      type: 'システムトイレ / シンプル',
      imageUrl: 'https://jp.unicharmpet.com/content/dam/sites/jp_unicharmpet_com/pet/products-cat/deotoilet_c/4520699614068.png',
      imageSource: 'ユニ・チャーム ペット公式',
      officialUrl: 'https://jp.unicharmpet.com/ja/brand/deotoilet-c.html',
      amazonUrl: '',
      price: '◎ 比較的手に取りやすい',
      description: '専用シートとチップを使う、システムトイレのシンプルな選択肢です。',
      forWhom: '初期費用も抑えながら始めたい人',
    },
    {
      name: 'デオトイレ 脱臭ファン＋本体セット',
      type: 'システムトイレ / ニオイ対策',
      imageUrl: 'https://jp.unicharmpet.com/content/dam/sites/jp_unicharmpet_com/pet/products-cat/deotoilet_c/4520699678749.png',
      imageSource: 'ユニ・チャーム ペット公式',
      officialUrl: 'https://jp.unicharmpet.com/ja/brand/deotoilet-c.html',
      amazonUrl: '',
      price: '△ 高め',
      description: '脱臭機能を備えたモデル。設置場所のニオイが気になる家庭で検討しやすい一台です。',
      forWhom: 'リビング置きでニオイ対策を重視する人',
    },
    {
      name: 'アイリスオーヤマ 猫のトイレ ハーフカバー P-NE-500-H',
      type: 'ハーフカバー / 低価格',
      imageUrl: 'https://www.irisplaza.co.jp/IMAGE/PET/PRODUCT/207009.jpg?iup=2025033&imformat=chrome&im=Resize,width=800',
      imageSource: 'アイリスプラザ公式',
      officialUrl: 'https://www.irisplaza.co.jp/index.php?KB=SHOSAI&SID=207009&target=shohin',
      amazonUrl: '',
      price: '◎ 安い',
      description: '高さのあるカバーで、オープン型より猫砂の飛び散りを抑えやすい定番モデルです。',
      forWhom: '価格を抑えてカバー付きを選びたい人',
    },
    {
      name: 'アイリスオーヤマ 猫のトイレ フルカバー P-NE-500-F',
      type: 'フルカバー / 砂の飛び散り対策',
      imageUrl: 'https://www.irisplaza.co.jp/IMAGE/PET/PRODUCT/207010.jpg?iup=2025033&imformat=chrome&im=Resize,width=800',
      imageSource: 'アイリスプラザ公式',
      officialUrl: 'https://www.irisplaza.co.jp/index.php?KB=SHOSAI&SID=207010',
      amazonUrl: '',
      price: '○ 標準',
      description: '扉付きのフルカバー型。砂の飛び散りと視線をしっかり抑えたいときの候補です。',
      forWhom: '囲われた形を選びたい人',
    },
    {
      name: 'アイリスオーヤマ 大型猫トイレ PON-750',
      type: '大型 / 多頭飼い向け',
      imageUrl: 'https://www.irisplaza.co.jp/IMAGE/PET/PRODUCT/212042.jpg?iup=2025033&imformat=chrome&im=Resize,width=800',
      imageSource: 'アイリスプラザ公式',
      officialUrl: 'https://www.irisplaza.co.jp/index.php?KB=SHOSAI&SID=212042',
      amazonUrl: '',
      price: '○ 標準',
      description: '幅約75cmのゆったりした大型サイズ。キャスター付きで動かしやすい設計です。',
      forWhom: '大型猫・多頭飼いで広さを優先したい人',
    },
    {
      name: 'アイリスオーヤマ ラクリーン 消臭システムトイレ オープンタイプ RSTO-50',
      type: 'システムトイレ / オープン',
      imageUrl: 'https://www.irisplaza.co.jp/IMAGE/PET/PRODUCT/206677.jpg?iup=2025033&imformat=chrome&im=Resize,width=800',
      imageSource: 'アイリスプラザ公式',
      officialUrl: 'https://www.irisplaza.co.jp/index.php?KB=SHOSAI&SID=206677',
      amazonUrl: '',
      price: '○ 標準',
      description: 'サンドとシートを含むスターターセット。オープンな出入り口で子猫やシニア猫にも配慮しやすいタイプです。',
      forWhom: 'はじめてシステムトイレを使う人',
    },
    {
      name: 'アイリスオーヤマ ラクリーン 消臭システムトイレ 上からタイプ RSTU-43',
      type: 'システムトイレ / 上から入る',
      imageUrl: 'https://www.irisplaza.co.jp/IMAGE/PET/PRODUCT/206676.jpg?iup=2025033&imformat=chrome&im=Resize,width=800',
      imageSource: 'アイリスプラザ公式',
      officialUrl: 'https://www.irisplaza.co.jp/index.php?KB=SHOSAI&SID=206676',
      amazonUrl: '',
      price: '△ 高め',
      description: '上から入る形とシステム型を組み合わせ、猫砂の飛び散りと日々の手入れに配慮したセットです。',
      forWhom: '飛び散りとニオイ対策を両立したい人',
    },
  ];

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character]));

  const render = () => {
    document.querySelectorAll('[data-toilet-other-products]').forEach((container) => {
      container.innerHTML = products.map((product) => {
        const targetUrl = product.amazonUrl || product.officialUrl;
        const buttonText = product.amazonUrl ? 'Amazonで価格を見る' : '公式・販売ページを見る';
        const buttonRel = product.amazonUrl ? 'sponsored noopener noreferrer' : 'noopener noreferrer';
        return `
          <article class="other-product-card">
            <a class="other-product-image" href="${escapeHtml(targetUrl)}" target="_blank" rel="${buttonRel}">
              <img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}" loading="lazy">
            </a>
            <div class="other-product-body">
              <p class="other-product-type">${escapeHtml(product.type)}</p>
              <h3>${escapeHtml(product.name)}</h3>
              <p class="other-product-price">${escapeHtml(product.price)}</p>
              <p>${escapeHtml(product.description)}</p>
              <p class="other-product-fit"><b>向いている人</b>${escapeHtml(product.forWhom)}</p>
              <a class="other-product-link" href="${escapeHtml(targetUrl)}" target="_blank" rel="${buttonRel}">${buttonText}<span aria-hidden="true"> ↗</span></a>
              <a class="other-product-source" href="${escapeHtml(product.officialUrl)}" target="_blank" rel="noopener noreferrer">画像・商品情報：${escapeHtml(product.imageSource)} ↗</a>
            </div>
          </article>`;
      }).join('');
    });
  };

  window.catToiletProducts = products;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render, { once: true });
  else render();
})();
