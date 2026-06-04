# AIBOUX Shop Schema Graph SEO/UI Hardening

Status: `SHOP_5H_SCHEMA_GRAPH_SEO_UI_WIP`

## Objective

Continue the AIBOUX Shop 5-hour sales-quality sprint by strengthening every public storefront page's SEO entity structure.

The current public storefront already has shared breadcrumb, footer, context links, SEO hub, support rail, page header, and product card parts. The next concrete improvement is to make structured data output a single connected Schema.org `@graph` instead of a loose page-local array.

## Fixed URLs

- Shop service site: `https://shop.aiboux.com/`
- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Tenant admin: `https://shop.aiboux.com/s/aiboux/admin`
- Public log: `https://mail.aiboux.com/g/l68`
- Screen evidence: `https://mail.aiboux.com/g/d68`
- Master: `https://mail.aiboux.com/g/m68`

## References Checked

- Google Search Central SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Google Search Central ecommerce URL structure: `https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites`
- Google Search Central ecommerce site structure: `https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure`
- Google Search Central crawlable links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`
- Google Search Central breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Google Search Central product structured data: `https://developers.google.com/search/docs/appearance/structured-data/product-snippet`

## Required Work

1. Add a shared `buildShopStructuredDataGraph` helper in `src/lib/shopSeo.ts`.
2. The helper must output:
   - top-level `@context: https://schema.org`;
   - top-level `@graph`;
   - graph nodes without repeated top-level `@context`;
   - deduplication by `@id` where possible.
3. Use the helper from:
   - `src/pages/shop/storefront/[tenant].astro`
   - `src/pages/shop/[tenant]/[...path].astro`
4. Add public Playwright checks that every public storefront page emits:
   - top-level `@graph`;
   - `WebSite`;
   - `OnlineStore` / `Organization`;
   - `BreadcrumbList`;
   - `SiteNavigationElement`;
   - page entity with `#webpage`;
   - `ItemList` where expected.
5. Keep visible links as real crawlable `<a href>` links.
6. Keep `FINAL_ACCEPTED` prohibited until remote D1 subscription migration and provider-backed recurring subscription flow are verified.

## Non-Goals

- Do not change `shop.aiboux.com/` into a tenant storefront.
- Do not fake subscription or payment success.
- Do not expose secrets.
- Do not run destructive cleanup.

