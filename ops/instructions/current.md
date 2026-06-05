# AIBOUX Shop 可視SEO説明削除

Status: `SHOP_REMOVE_VISIBLE_SEO_EXPLANATIONS_WIP`

Active instruction file:

- `ops/instructions/20260605_shop_remove_visible_seo_explanations.md`

## Current User Correction

公開ストア全ページに表示していたSEO説明、SEOチェック、canonical、robots、sitemap、Product/Offer、可視H1、noindexなどの運用者向け説明を削除する。

## Fixed URL Rules

- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Shop service site: `https://shop.aiboux.com/`
- Shop admin: `https://shop.aiboux.com/s/aiboux/admin`
- Design editor: `https://shop.aiboux.com/s/aiboux/admin/design`

`shop.aiboux.com/` をテナントストアに戻さない。
`shop.aboux.com` と書かない。

## Required Visible UI Result

公開ページにSEO作業説明を出さない。

Visible text must not contain:

- `SEO / UI checklist`
- `SEO site map`
- `Crawl map`
- `SEO構造`
- `共通SEO部品`
- `SEO内部リンク`
- `canonical`
- `robots`
- `sitemap`
- `Product/Offer`
- `可視H1`
- `検索エンジン向け`
- `noindex`

## Keep Behind-The-Scenes SEO

The following remain required, but must not be explained as UI copy:

- canonical link
- robots meta
- JSON-LD
- BreadcrumbList
- Product / Offer structured data
- SearchAction
- robots.txt
- sitemap.xml
- crawlable normal links
- breadcrumbs
- search form
- footer link directory

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

