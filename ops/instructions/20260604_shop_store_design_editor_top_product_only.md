# AIBOUX Shop Store Design Editor: TOP And Product Detail Only

## Status

WIP_IMPLEMENTATION

## Public URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Fixed Scope

The Shop store design editor may edit only:

1. TOP page: `/s/aiboux/`
2. Product detail page: `/s/aiboux/product/{id}`

All other storefront pages are fixed tenant-wide templates and must not appear as page-level edit targets:

- `/s/aiboux/products`
- `/s/aiboux/categories`
- `/s/aiboux/cart`
- `/s/aiboux/checkout`
- `/s/aiboux/contact`
- `/s/aiboux/legal`
- `/s/aiboux/privacy`
- `/s/aiboux/shipping`
- `/s/aiboux/returns`
- FAQ, mypage, orders, favorites, 404

## Reference

Reference image:

- `https://tadaup.jp/6ivZDgjK.png`

The image shows a 3-column editor:

- left page/section pane
- center Amazon-like live preview
- right selected-section settings pane

## Required UI

`/s/aiboux/admin/design` must be a dedicated full-screen editor.
It must not be rendered inside the normal Shop admin sidebar/header layout.

Forbidden structure:

- normal Shop admin sidebar
- normal Shop admin header
- store design editor nested inside the regular admin shell

Required structure:

- top editor bar
- left editor pane
- center live preview
- right settings pane

At 1980px viewport:

- left pane: 300px to 340px
- center preview column: at least 1100px
- right pane: 340px to 380px

Left pane:

- TOPページ
- 商品詳細ページ
- 共通設定
  - ヘッダー
  - ロゴ
  - ナビゲーション
  - カラー
  - フォント
  - ボタン
  - 商品カード

Center preview:

- Amazon-like TOP preview with delivery bar, logo, search, account, order history, cart, category navigation, center-large hero carousel with side previews, recommended products directly below hero.
- Amazon-like product detail preview with image gallery left, product information center, purchase box right.
- Category navigation must not wrap into vertical Japanese text.
- Hero side previews must show previous/next slide images, not gray placeholders.

Right pane:

- Edit only the selected section.
- Hero slider supports slide title/subtitle/image/CTA, autoplay, interval, arrows, dots, side preview ratio.
- Logo settings support upload, replace, delete, alt, display mode, desktop/mobile width, alignment, link type, custom URL, light/dark logo URL.

## Data Shape

Use existing `shop_storefront_layouts.layout_json`.

Allowed saved shape:

- `global.*`
- `pages.top`
- `pages.productDetail`

Do not save page-level configs for products, categories, cart, checkout, contact, legal, privacy, shipping, returns, mypage, orders, faq, 404.

## Routing

- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Tenant admin: `https://shop.aiboux.com/s/aiboux/admin`
- Design editor: `https://shop.aiboux.com/s/aiboux/admin/design`

Do not make `https://shop.aiboux.com/` the tenant storefront.
Do not use `shop.aboux.com`.

## Verification

Run:

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run check:shop-ui-protection`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- public Playwright or targeted public URL checks
- visual layout check: no normal admin sidebar, preview width >= 1100px, nav items do not wrap vertically, hero side images are visible

Before reporting:

- update `public/g/l68.md`
- update `public/g/d68.md`
- deploy
- curl `https://mail.aiboux.com/g/m68`
- curl `https://mail.aiboux.com/g/l68`
- curl `https://mail.aiboux.com/g/d68`

## Status Rule

This is WIP. Do not report FINAL_ACCEPTED.
