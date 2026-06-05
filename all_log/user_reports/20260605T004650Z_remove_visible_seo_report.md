# AIBOUX Shop visible SEO explanation removal

## Status
DEPLOYED_NOT_FINAL

## Summary
- 公開ストアの購入者向け本文から、SEOチェック、SEO site map、canonical、robots、sitemap、noindex、Product/Offer、可視H1などの運用者向け説明を削除しました。
- 実SEOとして必要なhead/meta、JSON-LD、BreadcrumbList、Product構造化データ、robots.txt、sitemap.xml、crawlable linksは残しています。
- 未使用だったSEOチェック/SEOサイトマップ用コンポーネントと共有builderも削除し、再表示事故を防ぎました。
- Worker Version ID: 35ea0eb8-3f79-4e3b-9c01-e155769f8eda。WIP evidence commit: decdf25。Bark progress: delivered=true。

## Verification
- npm run check:control-chars: PASS
- npm run check:mojibake: PASS
- npm run astro -- check: PASS, 0 errors
- ESBUILD_WORKER_THREADS=0 npm run build: PASS
- PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl: PASS, 9 tests
- PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail: PASS, 3 tests
- PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality: PASS
- 公開 /g/m68 /g/l68 /g/d68: HTTP 200 / text/markdown; charset=utf-8
- Shop TOP body check: 対象SEO説明語はすべて ABSENT

## Bark
- notification: progress sent
- reason: Bark progress notification delivered; this is not final acceptance.

## Notes
- public/g/*.md と /g/* のsha256は一致しません。理由は /g/* route が __WORKER_VERSION_ID__ を実Worker Version IDへ runtime 置換するためです。本文先頭とステータスは公開反映済みです。
- 定期購入D1/provider laneは別件で not FINAL のままです。FINAL_ACCEPTEDはまだ禁止です。

## URLs
- マスター: https://mail.aiboux.com/g/m68
- ログ: https://mail.aiboux.com/g/l68
- 画面: https://mail.aiboux.com/g/d68
