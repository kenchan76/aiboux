# 2026-06-05 Daily Improvement

## Improvement

For AIBOUX Shop SEO/UI work, public page tests must check that visible shared navigation components and JSON-LD navigation are generated from the same shared link sources.

## Why

Google Search Central emphasizes crawlable links, clear ecommerce site structure, breadcrumb structured data, and product/merchant structured data. A page can look linked while its structured navigation omits the same destinations, so the gate now verifies both rendered links and JSON-LD navigation coverage.

## Applied Process

- Keep shared link sources in `shopStorefrontShared.ts`.
- Render shared breadcrumb support, page quality, buying guide, contextual links, SEO hub, support rail, and footer visibly.
- Include the same shared sources in `SiteNavigationElement` JSON-LD where applicable.
- Strengthen public Playwright checks instead of relying on HTTP 200 or screenshot-only evidence.
