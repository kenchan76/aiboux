# AIBOUX Shop Breadcrumb Support SEO/UI WIP

Status: SHOP_5H_BREADCRUMB_SUPPORT_SEO_UI_WIP

## Objective

Continue the AIBOUX Shop 5-hour sales-quality sprint. Strengthen every public storefront page with a richer shared breadcrumb component and breadcrumb-adjacent crawlable support links.

## Fixed URL Rules

- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Product detail: `https://shop.aiboux.com/s/aiboux/product/{id}`
- Admin: `https://shop.aiboux.com/s/aiboux/admin`
- Shop service site: `https://shop.aiboux.com/`
- Do not use `shop.aboux.com`.
- Do not move tenant storefront to `shop.aiboux.com/`.

## Current References Checked

- Google Search Central Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Google Search Central ecommerce structured data: `https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce`
- Google Search Central ecommerce site structure: `https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure`
- Google Search Central ecommerce URL structure: `https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites`
- Google Search Central crawlable links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`

## Required Implementation

- Keep the existing visible `BreadcrumbList` microdata.
- Keep product detail as one visible product `h1`; do not reintroduce duplicate product title above the gallery.
- Add breadcrumb support links generated from shared code, not hardcoded per page.
- The breadcrumb support links must be crawlable `<a href>` anchors.
- The breadcrumb support links must use visible blue link affordance.
- The breadcrumb support links must expose visible `SiteNavigationElement` microdata.
- Render the richer breadcrumb shell on TOP, product detail, and every public subpage.
- Use stable category URLs from the shared category helper where category links are needed.

## Required Tests

- Public crawl must assert the breadcrumb shell on every public storefront page.
- Public crawl must assert breadcrumb support links are visible and crawlable on every public storefront page.
- Product detail must assert the breadcrumb support links include related category/product/cart support while still keeping current label `商品詳細` and one H1.
- Keep `gate:shop-sales-quality` passing.
- Keep `gate:shop-subscriptions` as a separate non-final lane if it remains blocked.

## Reporting

- Update `AIBOUX_MASTER_DOCUMENT.md` and `public/g/m68.md`.
- Update `public/g/l68.md` and `public/g/d68.md`.
- WIP deploy.
- Verify public `/g/*` and `https://shop.aiboux.com/s/aiboux/`.
- Send Bark progress notification if configured.

## Non-Final Condition

`FINAL_ACCEPTED` remains prohibited until remote D1 subscription migration and provider-backed recurring subscription creation are verified.
