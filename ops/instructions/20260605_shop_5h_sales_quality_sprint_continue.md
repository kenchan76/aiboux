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
