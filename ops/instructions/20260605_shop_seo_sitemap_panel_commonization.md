# AIBOUX Shop SEO Sitemap Panel Commonization

Status: WIP

## Objective

Continue the AIBOUX Shop 5-hour sales-quality sprint by strengthening every public tenant storefront page with a shared visible SEO sitemap panel.

The tenant storefront remains:

- `https://shop.aiboux.com/s/aiboux/`

The Shop service site remains:

- `https://shop.aiboux.com/`

## Official References Checked

- Google Search Central Ecommerce Website Navigation Structure
- Google Search Central Crawlable Links
- Google Search Central Ecommerce URL Structure
- Google Search Central Product structured data
- Google Search Central Breadcrumb structured data

## Requirements

- Add one shared SEO sitemap panel model in `src/lib/shopStorefrontShared.ts`.
- Add one shared UI component in `src/components/shop/storefront/`.
- Render it on TOP, product detail, and every public storefront subpage.
- Show the page role, canonical target, robots/indexing policy, sitemap inclusion status, and key crawlable next links.
- Use visible blue links with real `<a href>` values.
- Expose visible `ItemList` / `ListItem` microdata and `numberOfItems`.
- Add sitemap panel links into the `SiteNavigationElement` JSON-LD source links for TOP and subpages.
- Keep product detail single-H1. Do not reintroduce the duplicate product title above the image gallery.
- Keep `FINAL_ACCEPTED` prohibited until remote D1 subscription migration and provider-backed recurring billing are verified.

## Verification

- `npm run check:control-chars`
- `npm run check:mojibake`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-subscriptions || true`
- WIP deploy
- `/g/m68`, `/g/l68`, `/g/d68` public verification

