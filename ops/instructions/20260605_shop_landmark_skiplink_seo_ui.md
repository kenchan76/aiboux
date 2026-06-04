# AIBOUX Shop Landmark / Skip Link SEO UI Commonization

Status: WIP

## Objective

Make every public AIBOUX Shop tenant page stronger for SEO, page experience, accessibility, and UI navigation by adding shared landmarks and skip links.

Target storefront remains:

- `https://shop.aiboux.com/s/aiboux/`

Shop service site remains:

- `https://shop.aiboux.com/`

## Required Scope

- Add shared skip links to TOP, product detail, and every public storefront subpage.
- Add one stable main landmark target: `main#storefront-main`.
- Add one stable product search target: `#storefront-search`.
- Add one stable footer target: `footer#storefront-footer`.
- Label the shared header as `aria-label="ストアヘッダー"`.
- Label the shared category navigation as `aria-label="ストアカテゴリナビ"`.
- Keep links crawlable with real `<a href>` elements.
- Keep existing Amazon-quality storefront visual work intact.
- Keep product detail single visible product `h1`; duplicate title above the gallery remains prohibited.
- Keep `FINAL_ACCEPTED` prohibited until subscription lane is verified.

## References Checked

- Google Search Central SEO Starter Guide.
- Google Search Central ecommerce website navigation structure.
- Google Search Central crawlable links.
- Google Search Central ecommerce URL structure.
- Google Search Central structured data for ecommerce.
- Google Search Central Product structured data.

## Verification

Required checks:

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run astro -- check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`

Subscription lane remains separate:

- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-subscriptions || true`

## Reporting

Before reporting, update and deploy:

- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `public/g/l68.md`
- `public/g/d68.md`

Report with:

- Master URL: `https://mail.aiboux.com/g/m68`
- Log URL: `https://mail.aiboux.com/g/l68`
- Screen URL: `https://mail.aiboux.com/g/d68`

Do not report local-only logs.
