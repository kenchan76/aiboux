# AIBOUX Shop 5時間販売品質スプリント継続

Status: `SHOP_5H_SALES_QUALITY_SPRINT_CONTINUE_WIP`

## Objective

AIBOUX Shopの5時間販売品質スプリントを継続し、公開ストア、商品詳細、カート、checkout、contact、legal/privacy/shipping/returns、FAQ、mypage系、admin系の見た目、動作、導線、SEO実装をWIP deployと公開ログ更新まで回し続ける。

## Fixed URL Rules

- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Shop service site: `https://shop.aiboux.com/`
- Shop admin: `https://shop.aiboux.com/s/aiboux/admin`
- Design editor: `https://shop.aiboux.com/s/aiboux/admin/design`

禁止:

- `shop.aiboux.com/` をテナントストアへ戻すこと。
- `shop.aboux.com` と書くこと。
- 未実装ページを「完成」と報告すること。
- SEOの実装説明を購入者向けUIに出すこと。

## Current Continuation Focus

直近で可視SEO説明は削除済み。次は販売品質スプリントに戻り、以下を継続改善する。

- 全公開ページの見た目を購入者向けに磨く。
- TOPと商品詳細のAmazon風売り場密度、リンク色、CTA、フッター、パンくず、商品カード、購入ボックスを改善する。
- cart/checkout/contact/legal/privacy/shipping/returns/FAQ/mypage/account/orders/favorites/login/register/mypage/subscriptions を薄い説明ページにしない。
- adminページはデモ値なし、導線が正しいことを維持する。
- 共通化できるパーツは共通化する。
- 裏側SEOは維持するが、購入者向けUIにSEO運用語を出さない。
- 購入者向けページ本文に、SEO内部語、migration、DB、schema、認証基盤、成功したふり、共通テンプレート、表示確認日などの実装説明を出さない。
- メタ説明、管理UI、APIのユーザー向けmessageにも、購入者や運用者に不要な内部実装語を出さない。
- 機械コードは互換維持のため残してよいが、画面とmessageは商用品質の文言にする。
- legal/privacy/shipping/returns/FAQ/mypage/login/register/subscriptions は、内部状態説明ではなく購入者向けのお買い物ガイド、販売条件、配送返品、会員機能の自然な文言へ整える。
- 公開HTML本文には `準備中`、`未完了`、`未接続`、`Provider subscription creation is not implemented` を出さない。状態説明は `受付条件`、`注文前確認`、`支払い方法の確認` に置き換える。
- `クロール可能`、`内部リンク`、`Page guide`、`Trust / proof matrix` などの監査・SEO・実装者向け語は、本文だけでなく `aria-label` などの公開HTML属性にも出さない。
- SEOの実装は head、JSON-LD、robots、sitemap、canonical で維持する。購入者向け画面では、お買い物ガイド、関連ページ、購入サポート、販売条件として自然に見せる。

## Current Cycle Focus: Cart / Checkout / Contact Retail Quality

- カート空状態でも、商品一覧、配送条件、返品条件、問い合わせへすぐ戻れる販売導線を表示する。
- checkoutは注文内容、配送・返品、支払い方法、定期購入の確認ステップを購入前チェックとして見せる。
- 問い合わせはフォームだけにせず、商品、配送、返品、注文履歴の確認導線を同じ画面で出す。
- これらは購入者向けの文言にし、SEO・DB・migration・schemaなどの内部説明は出さない。
- Playwrightで `storefront-cart-recovery-panel`、`storefront-checkout-stepper`、`storefront-checkout-order-guard`、`storefront-contact-topic-grid` を公開URLで検証する。

## Current Cycle Focus: Account / Orders / Favorites Retail Quality

- マイページとアカウントページに、注文、配送返品、定期購入、問い合わせへ進む購入者アクションセンターを表示する。
- 注文履歴は空状態だけで終わらせず、注文検索、配送状況、返品交換、問い合わせへ進める操作導線を表示する。
- お気に入りは商品一覧だけで終わらせず、価格、在庫、カート、配送返品条件を比較できる導線を表示する。
- 定期購入マイページは、次回配送、頻度変更、スキップ、解約条件の確認導線を表示する。
- ログイン/会員登録ページは、無効ボタンだけで終わらせず、入力確認と注文追跡、お気に入り、定期購入、個人情報ページへの導線を表示する。
- これらも購入者向けの文言にし、SEO・DB・migration・schema・未実装説明を公開本文へ出さない。
- Playwrightで `storefront-account-command-center`、`storefront-order-action-panel`、`storefront-order-status-cards`、`storefront-favorite-assist-grid`、`storefront-subscription-control-panel`、`storefront-auth-assist-grid` を公開URLで検証する。

## Current Cycle Focus: CLEANUP_AND_REFOCUS_CYCLE_0

方針変更:

- 販売画面を直接直す作業に集中する。
- SEO説明コンポーネント、SEO checklist、SEO sitemap panel、trust matrix、support rail、action map、context links、page quality summary の追加は禁止する。
- すでに使っていない可視SEO/説明パネル系コンポーネントは削除または非表示にする。
- gate追加だけ、Barkだけ、`/g/*` 更新だけ、D1権限不足の長文反復は禁止する。
- D1定期購入DB laneは `D1_PERMISSION_BLOCKED_NOT_FINAL` として一行で分離し、TOP/商品詳細/カート/checkout/contact/legal/admin改善を止めない。
- BarkはCycle完了時、deploy失敗時、D1権限復旧時、FINAL候補時だけ送る。小修正ごとの乱発は禁止する。

今後の作業レーン:

- Lane A: 公開TOP。スライダー、商品画像/商品名一致、商品カード、カート追加、もっと見る、売り場密度。
- Lane B: 商品詳細。画像ギャラリー、Amazon風3カラム、購入ボックス、カート追加、定期購入UIの安全停止。
- Lane C: 購入フロー。cart、checkout、contact、legal/privacy/shipping/returns。
- Lane D: 管理・永続化。admin/products、admin/settings、admin/design、admin/subscriptions。

実行サイクル:

- Cycle 1: TOP + 商品詳細。
- Cycle 2: カート + checkout + 問い合わせ + 法務。
- Cycle 3: 管理 + 保存 + 回帰確認。

ログ方針:

- `/g/l68` は最新状況だけを短く出す。
- `/g/d68` は最新画面証跡だけを短く出す。
- 旧長文履歴は必要に応じて `all_log/archive/` に退避する。

## Current Local Progress: Product Review Anchor Completion

- 商品詳細の `レビューを確認` リンクが、実体のないアンカーにならないよう `public-product-reviews` セクションを追加する。
- レビュー領域には平均評価、配送、ギフト、問い合わせ導線を含め、購入判断に使える内容として表示する。
- Playwrightで `#reviews` リンクと `public-product-reviews` の表示を検証する。

## Current Local Progress: Checkout And Order Lookup Inputs

- checkoutの配送先・連絡先欄をdisabled表示から、入力内容を確認できるフォームへ変更する。
- 注文履歴の注文検索欄をdisabled表示から、注文番号またはメールで入力確認できるフォームへ変更する。
- Playwrightでcheckout customer formとorder lookup formがenabledであることを検証する。

## Verification

最低限:

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run astro -- check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`

必要に応じて:

- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-storefront-carousel`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-storefront-interaction`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-storefront-visual`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-cart-checkout`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-contact-legal`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-admin-ops`

`gate:shop-subscriptions` はD1/provider-backed recurring billingが受け入れ済みになるまで別lane。

## Public Log Rule

報告前に必ず公開反映し、次をcurl確認する。

- `https://mail.aiboux.com/g/m68`
- `https://mail.aiboux.com/g/l68`
- `https://mail.aiboux.com/g/d68`

`FINAL_ACCEPTED` はまだ禁止。
