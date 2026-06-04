# AIBOUX Shop SEO/UI Common SEO Hub WIP

Status: WIP

## Objective

Continue the AIBOUX Shop sales-quality sprint by strengthening every tenant storefront page with a shared SEO/internal-link hub.

## Fixed URLs

- Shop service site: `https://shop.aiboux.com/`
- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Tenant admin: `https://shop.aiboux.com/s/aiboux/admin`
- Public log bundle:
  - Master: `https://mail.aiboux.com/g/m68`
  - Log: `https://mail.aiboux.com/g/l68`
  - Screen: `https://mail.aiboux.com/g/d68`

## Current SEO Baseline

Google Search Central references checked for this continuation:

- SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Product structured data: `https://developers.google.com/search/docs/appearance/structured-data/product`
- Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Crawlable links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`
- Ecommerce structured data: `https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce`

## Required Work Unit

- Add a reusable storefront SEO hub component.
- Use crawlable `<a href>` internal links, not JavaScript-only navigation.
- Use descriptive link text and visible blue link affordance.
- Expose visible `SiteNavigationElement` microdata from the SEO hub.
- Render the SEO hub on TOP and every public tenant storefront subpage.
- Strengthen public Playwright coverage so every public page requires the SEO hub.
- Keep `FINAL_ACCEPTED` prohibited until remote D1 subscription migration and provider-backed recurring billing are verified.

## Non-goals

- Do not change `shop.aiboux.com/` into a tenant storefront.
- Do not copy Amazon text, templates, or content.
- Do not fake payment or subscription success.
- Do not run destructive git or cleanup commands.
