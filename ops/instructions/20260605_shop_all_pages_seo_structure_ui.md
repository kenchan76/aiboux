# AIBOUX Shop All Pages SEO Structure And UI Commonization

Status: WIP

## Objective

Continue the AIBOUX Shop sales-quality sprint by auditing every public tenant storefront page for shared SEO structure, visible link affordance, and common reusable storefront parts.

Tenant storefront:

- `https://shop.aiboux.com/s/aiboux/`

Do not change `https://shop.aiboux.com/` into a tenant storefront.

## Current SEO References Checked

Use Google Search Central guidance as the baseline:

- SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Ecommerce URL structure: `https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites`
- Ecommerce site structure: `https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure`
- Crawlable links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`
- Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Product structured data: `https://developers.google.com/search/docs/appearance/structured-data/product-snippet`

## Active Requirements

- Every public storefront page must use real `<a href>` links for SEO-critical navigation.
- SEO-critical links must be visibly identifiable with blue link color and hover underline.
- Every public storefront page must include visible breadcrumb navigation.
- Breadcrumb JSON-LD must come from the same breadcrumb model as the visible breadcrumb.
- Every public storefront page must include:
  - self canonical URL;
  - robots meta;
  - Open Graph metadata;
  - Twitter Card metadata;
  - `WebSite`;
  - `Organization` / `OnlineStore`;
  - `WebPage` or page-specific entity;
  - `SiteNavigationElement`;
  - `ItemList` when the page exposes related product/account/support links.
- Product detail must keep one visible product `h1`.
- Product detail must not show a duplicated product title above the gallery.
- Transactional/account pages remain `noindex,follow,noarchive`.
- Discovery/content pages remain `index,follow,max-image-preview:large`.

## This Work Unit

- Add a shared contextual internal-link component for every public storefront page.
- Generate contextual links from `shopStorefrontShared.ts` rather than hardcoding per page.
- Include contextual links in shared navigation JSON-LD.
- Use contextual links as `ItemList` fallback for pages that do not have products/categories/accounts/policy cards.
- Add public Playwright checks for:
  - contextual link component;
  - visible blue link affordance;
  - `SiteNavigationElement` microdata;
  - `ItemList` on every public storefront page.
- Keep `FINAL_ACCEPTED` prohibited until remote D1 subscription migration and provider-backed recurring billing are verified.

## Required Verification

- `npm run check:control-chars`
- `npm run check:mojibake`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`
- WIP deploy
- Public `/g/m68`, `/g/l68`, `/g/d68` update and curl verification
- Bark progress notification if configured

## Reporting

Before user-facing report, publish:

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

No local-only report is valid.
