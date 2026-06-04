# AIBOUX Shop All Pages SEO Common Parts Continuation

Status: SHOP_5H_ALL_PAGES_SEO_COMMON_PARTS_WIP

## Objective

Continue the AIBOUX Shop sales-quality sprint. Audit and strengthen all public storefront page structure so shared SEO/UI parts are reused consistently and crawlable links remain visible.

## References Checked

- Google Search Central Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Google Search Central ecommerce site structure: `https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure`
- Google Search Central ecommerce URL structure: `https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites`
- Google Search Central crawlable links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`
- Google Search Central Product/Merchant structured data: `https://developers.google.com/search/docs/appearance/structured-data/product-snippet`

## Required Implementation

- Keep using shared storefront parts instead of page-specific duplicated SEO blocks.
- Keep visible blue crawlable links for internal navigation.
- Keep `BreadcrumbList`, `SiteNavigationElement`, `ItemList`, `WebSite`, `WebPage`, `Organization`, and product/offer structured data connected through the shared graph.
- Strengthen TOP page JSON-LD so its structured navigation includes the same shared breadcrumb support, page-quality, buying-guide, contextual, header, and footer links visible on the page.
- Keep product detail as one visible product `h1`; do not add duplicate product title above the image gallery.
- Keep `shop.aiboux.com/` as the service site and `/s/aiboux/` as the tenant storefront.

## Required Tests

- `npm run check:control-chars`
- `npm run check:mojibake`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- Public `tests/shop-public-crawl.spec.ts`
- Public `tests/shop-product-detail-public.spec.ts`
- Public `gate:shop-sales-quality`
- Keep `gate:shop-subscriptions` as a separate `BLOCKED_NOT_FINAL` lane if remote D1/provider subscription creation is still unavailable.

## Reporting

- Update `AIBOUX_MASTER_DOCUMENT.md` and `public/g/m68.md`.
- Update `public/g/l68.md` and `public/g/d68.md`.
- WIP deploy and verify public `/g/*`.
- Send Bark progress notification if configured.
- Do not report `FINAL_ACCEPTED`.
