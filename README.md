# くらしパートナー / ねこパートナー

Amazonアソシエイト向けの商品比較メディアの初期デモです。

## 現在の構成
- 子猫動画を使ったヒーロー
- おすすめ4商品の比較
- 猫砂の選び方
- 猫タイプ別の相性表
- おから系猫砂12商品の紹介
- FAQ
- 独自ガイド記事10本（`articles/`）
- 12猫種の相性ランキング・猫種図鑑（`breeds/`、ライセンスを明記したフリー写真・動画素材を掲載）
- 編集・広告ポリシー、プライバシーポリシー、運営者情報

## 公開URL

- 親ブランド（くらしパートナー）：https://kurashi-partner-ku.com/
- 猫の専門メディア（ねこパートナー）：https://uk-support1.github.io/cat-comparison-site/

同一のGitHub Pages配信元で両サイトを共存させています。独自ドメインのトップは親ブランドのポータル、従来のGitHub Pages URLは `cat-home.html` のねこパートナーへ案内します。独自ドメイン・GitHub Pagesの設定およびCNAMEの管理はGitHub側で維持してください。

## アソシエイト申請前の確認

Amazonアソシエイトへの申請前に、`about.html` の運営者情報と `contact.html` の問い合わせ先が現在の運営体制と一致していることを確認してください。お問い合わせはFormspreeフォーム（`https://formspree.io/f/xvkgynqy`）で受け付けます。受信用メールアドレスや運営責任者の個人名はサイトに掲載しません。Amazonの購入リンクと参加者表示は実装済みです。掲載する特別リンクがご自身のアソシエイトアカウント・登録サイトに対応していることを確認してください。

## エントリーポイント
`index.html`

## Amazonリンクの管理

- 商品ID・商品名・表記ゆれ・提供URL・セット数量注記は `assets/amazon-links.js` の `products` に一元管理しています。
- URLは提供された短縮URLのまま保持してください。展開先への置換やタグの削除はしません。
- 既存ページの任意の購入位置に `<div data-amazon-product="tofukasu-k"></div>` を置き、共通JS/CSSを読み込みます。比較表などは `data-amazon-compact` を追加できます。
- 動的カードは `NekoAmazon.button(商品IDまたは商品名)` を使用します。照合は登録名・別名の完全一致のみで、別商品への曖昧な紐付けを防ぎます。
- URL未提供のpidanは `url:null` として管理しています。正しいURLが届くまではAmazonのCTAを表示しません。
- 現在の導線：おすすめ3商品、比較表3商品、全商品カードのうち11商品、3本の商品解説記事。既存の解説・選び方ガイドへのリンクは維持しています。
- 参加者表記の根拠：[Amazonの開示についてのヘルプ](https://affiliate.amazon.co.jp/help/node/topic/GPXFHVYZMTGPUMPE)。リンク周辺の広告表示と、トップ・対象記事・編集広告ポリシーの参加者表示を併用しています。
- 変更後の確認：`node tests/amazon-links.test.cjs` でURL保持・照合・未提供商品の非表示・記事導線・広告表記を検証します。

## 親サイトと比較カテゴリ

確認コマンド：`node tests/site-structure.test.cjs` と `node tests/amazon-links.test.cjs`。内部リンク・アンカー、共通ナビ、GitHub Pagesのベースパス、旧URL引き継ぎ、商品リンクを確認します。

- `index.html`: くらしパートナーTOP。専門メディアの入口と今後の展開を紹介。
- `cat-home.html`: ねこパートナーTOP。比較ジャンルの入口と猫種図鑑・肉球ゲームへの入口。
- `compare/okara-litter.html`: 既存のおから猫砂比較。商品・比較表・Amazon導線は維持。
- `assets/site.css` / `assets/site.js`: 全ページ共通のヘッダー、スマホメニュー、フッター用スタイルとカテゴリ設定。
- `assets/home.css`: TOP専用のレイアウト。

### 猫トイレ／キャリーバッグを公開するには

1. `compare/cat-toilets.html`（または `compare/carriers.html`）を作り、猫砂比較と同じ共通ヘッダー・フッター、`../assets/site.css` と `../assets/site.js` を使います。相対パスは親ディレクトリを基準にします。
2. `assets/site.js` の `categories` 内の該当 `href: null` を `'compare/cat-toilets.html'` に変更します。TOPカードと全ページのヘッダーがリンクに切り替わります。必要なら `cta` も変更します。
3. ページの title / description / canonical と `sitemap.xml` を更新します。
4. JavaScript無効時の表示も公開済みにする場合は、各HTMLの同じ `data-category-nav` とTOPの `data-category-card` をアンカーに変更します。

新ジャンルは `categories` へ追加すると全ページのナビに追加されます。TOPのカードに同じ `data-category-card` IDを持つ要素を追加してください。JavaScript無効時用の静的ナビも必要に応じて更新します。将来プルダウンにする場合は `assets/site.js` の `navigation` と共通CSSを変更します。商品データは各比較ページ、Amazonリンクは従来通り `assets/amazon-links.js` で管理します。旧TOPの `#top4` / `#howto` / `#cats` / `#products` は新しい猫砂比較URLへ引き継ぎます。
