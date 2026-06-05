# AIBOUX Shop Page-Type SEO/UI WIP Report

## Status
WIP_DEPLOYED_NOT_FINAL

## Summary
- Shop全ページSEO/UI強化の継続として、公開テナントページのページ種別JSON-LDを強化しました。
- products/categories/favorites は CollectionPage、contact は ContactPage、faq は FAQPage、商品詳細は ItemPage + Product + Offer として公開HTMLへ出しています。
- ItemList に stable #itemlist、numberOfItems、mainEntityOfPage、商品/カテゴリ entity 参照を追加しました。
- WIP commit は abafb5ef9ec266610b311c96d19c05b0c902ce66、最終公開確認後の Worker Version ID は 4579f268-31fa-4c3f-98b3-313c87e01fa3 です。

## Verification
- npm run check:control-chars: PASS
- npm run check:mojibake: PASS
- npm run astro -- check: PASS with existing warnings/hints only
- ESBUILD_WORKER_THREADS=0 npm run build: PASS
- PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl: PASS, 6 passed
- PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail: PASS, 3 passed
- PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality: PASS
- Direct public HTML checks: top/products/categories/favorites/contact/faq/product detail all HTTP 200 with expected page-type SEO markers.
- Public /g/m68, /g/l68, /g/d68: HTTP 200 / text/markdown; charset=utf-8 / SHOP_10H_PAGE_TYPE_SEO markers present.

## Bark
- notification: progress sent
- reason: Bark progress notification delivered=true, skipped=false, secretLogged=false. Final acceptance Bark is not applicable because FINAL_ACCEPTED is prohibited.

## Notes
- FINAL_ACCEPTEDではありません。
- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- Google Search Central ecommerce/product/breadcrumb guidance and Schema.org page/list/product entity references were checked before this SEO work.

## URLs
- マスター: https://mail.aiboux.com/g/m68
- ログ: https://mail.aiboux.com/g/l68
- 画面: https://mail.aiboux.com/g/d68
