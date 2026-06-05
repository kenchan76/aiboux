# AIBOUX Shop 5時間販売品質スプリント継続

Status: `SHOP_5H_SALES_QUALITY_SPRINT_CONTINUE_WIP`

Active instruction file:

- `ops/instructions/20260605_shop_5h_sales_quality_sprint_continue.md`

## Objective

AIBOUX Shopの5時間販売品質スプリントを継続し、公開ストア、商品詳細、カート、checkout、contact、legal/privacy/shipping/returns、FAQ、mypage系、admin系の見た目、動作、導線、SEO実装をWIP deployと公開ログ更新まで回し続ける。

## Fixed URL Rules

- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Shop service site: `https://shop.aiboux.com/`
- Shop admin: `https://shop.aiboux.com/s/aiboux/admin`
- Design editor: `https://shop.aiboux.com/s/aiboux/admin/design`

`shop.aiboux.com/` をテナントストアに戻さない。
`shop.aboux.com` と書かない。

## Current Focus

- 可視SEO説明削除は維持する。
- 裏側SEOは維持する。
- 購入者向けページ本文に、SEO内部語、migration、DB、schema、認証基盤、成功したふり、共通テンプレート、表示確認日などの実装説明を出さない。
- SEOメタ説明、管理UIの補足、APIのユーザー向けmessageにも、購入者や運用者に不要な内部実装語を出さない。
- API互換のため機械コードが必要な場合でも、表示messageは商用運用向けの自然な文にする。
- legal/privacy/shipping/returns/FAQ/mypage/login/register/subscriptions は、内部状態説明ではなく購入者向けのお買い物ガイド、販売条件、配送返品、会員機能準備中の自然な文言へ整える。
- 全公開ページの見た目と導線を購入者向けに磨く。
- TOPと商品詳細のAmazon風売り場密度、リンク色、CTA、フッター、パンくず、商品カード、購入ボックスを改善する。
- cart/checkout/contact/legal/privacy/shipping/returns/FAQ/mypage/account/orders/favorites/login/register/mypage/subscriptions を薄い説明ページにしない。
- adminページはデモ値なし、導線が正しいことを維持する。
- 共通化できるパーツは共通化する。

## Verification

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run astro -- check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`

`gate:shop-subscriptions` remains a separate blocked lane until D1/subscription persistence is accepted.

## Reporting

Before reporting, publish and verify:

- `https://mail.aiboux.com/g/m68`
- `https://mail.aiboux.com/g/l68`
- `https://mail.aiboux.com/g/d68`

`FINAL_ACCEPTED` remains prohibited.
