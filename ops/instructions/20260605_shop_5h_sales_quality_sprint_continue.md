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
