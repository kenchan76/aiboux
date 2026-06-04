# AIBOUX Shop Page Action Map SEO/UI Continuation

Status: `SHOP_5H_PAGE_ACTION_MAP_SEO_UI_WIP`

## Objective

Continue the AIBOUX Shop 5-hour sales-quality sprint.

Strengthen every public tenant storefront page by adding a shared page-specific action map. The action map must make each page less thin, improve crawlable internal links, and give users clear next actions without inventing implementation status.

## Fixed URLs

- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Shop service site: `https://shop.aiboux.com/`
- Shop admin: `https://shop.aiboux.com/s/aiboux/admin`

Do not move the tenant storefront to `shop.aiboux.com/`.

## Current Official References Checked

- Google Search Central Ecommerce structured data: `https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce`
- Google Search Central Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Google Search Central Ecommerce URL structure: `https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites`
- Google Search Central JavaScript SEO basics: `https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics`
- Google Search Central Pagination and incremental page loading for ecommerce: `https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading`

## Requirements

- Add a shared storefront action-map model in `src/lib/shopStorefrontShared.ts`.
- Add a shared visible component under `src/components/shop/storefront/`.
- Render the component on TOP, product detail, and every public storefront subpage.
- Use real crawlable `<a href>` links, not click-only controls.
- Use visible link-color affordance.
- Expose visible `ItemList` microdata for action steps.
- Include action-map links in TOP and subpage `SiteNavigationElement` JSON-LD sources.
- Add a shared storefront SEO/UI checklist model in `src/lib/shopStorefrontShared.ts`.
- Add a shared visible SEO checklist component under `src/components/shop/storefront/`.
- Render the SEO checklist on TOP, product detail, and every public storefront subpage.
- Use visible `ItemList` / `ListItem` microdata for SEO checklist items.
- Include SEO checklist links in subpage `SiteNavigationElement` JSON-LD sources.
- Do not add duplicate product title above the gallery.
- Do not claim `FINAL_ACCEPTED`.
- Keep subscription lane as `BLOCKED_NOT_FINAL` until remote D1 migration and provider-backed recurring billing pass.

## Verification

- `npm run check:control-chars`
- `npm run check:mojibake`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npx playwright test tests/shop-public-crawl.spec.ts tests/shop-product-detail-public.spec.ts`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`

## Public Evidence

Update:

- `public/g/m68.md`
- `public/g/l68.md`
- `public/g/d68.md`

Deploy WIP and verify:

- `https://mail.aiboux.com/g/m68`
- `https://mail.aiboux.com/g/l68`
- `https://mail.aiboux.com/g/d68`
- `https://shop.aiboux.com/s/aiboux/`
