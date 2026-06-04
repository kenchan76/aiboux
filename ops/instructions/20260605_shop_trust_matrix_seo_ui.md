# AIBOUX Shop Trust Matrix SEO/UI Commonization

Status: WIP

## Objective

Continue the active AIBOUX Shop sales-quality sprint by adding a shared, visible trust and proof matrix to every public tenant storefront page.

The target tenant storefront remains:

- `https://shop.aiboux.com/s/aiboux/`

The service site remains:

- `https://shop.aiboux.com/`

Do not move the tenant storefront to the service root.

## Current Source Of Truth

- `AIBOUX_MASTER_DOCUMENT.md`
- `ops/instructions/current.md`

## Google Search Central References Checked

- SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Crawlable links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`
- Product structured data: `https://developers.google.com/search/docs/appearance/structured-data/product`
- Merchant listing structured data: `https://developers.google.com/search/docs/appearance/structured-data/merchant-listing`
- Ecommerce structured data: `https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce`
- Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`

## Required Implementation

Add a shared trust matrix model and component:

- Data builder in `src/lib/shopStorefrontShared.ts`
- Component in `src/components/shop/storefront/StorefrontTrustMatrix.tsx`
- Render on TOP page
- Render on product detail page
- Render on every public storefront subpage
- Include crawlable visible links
- Use visible blue link affordance
- Expose visible `ItemList` / `ListItem` microdata
- Include trust-matrix links in `SiteNavigationElement` JSON-LD link sources

The matrix must cover:

- Seller / legal identity
- Shipping and delivery
- Returns and cancellation
- Payment honesty
- Subscription transparency
- Privacy and support

## UI Rules

- Do not add a separate visual style per page.
- Use one shared component and page-specific builder output.
- Do not create thin text-only policy pages.
- Do not hide payment or subscription incomplete states.
- Do not add `href="#"` or `javascript:void`.
- Use clear blue crawlable links.

## SEO Rules

- Keep one H1 on product detail.
- Keep Product/Offer JSON-LD on product pages.
- Keep BreadcrumbList visible and in JSON-LD.
- Keep links as real `<a href="">`.
- Keep top-level structured data as a connected `@graph`.

## Verification

Update public Playwright checks:

- Every public page has `data-testid="storefront-trust-matrix"`.
- Trust matrix has `itemtype="https://schema.org/ItemList"`.
- It contains `購入前の信頼` or equivalent trust label.
- It declares `meta[itemprop="numberOfItems"]`.
- It has at least 4 visible `ListItem` entries.
- It has at least 4 crawlable links.
- First link uses visible blue link styling.
- Product detail trust matrix includes payment, returns, subscription, and seller/support context.

## Status Rules

This is WIP.

Do not report `FINAL_ACCEPTED`.

`FINAL_ACCEPTED` remains prohibited until remote D1 subscription migration and provider-backed recurring billing are verified.
