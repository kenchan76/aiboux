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

## Additional Improvement

For ecommerce SEO/UI work, each public page should expose a visible page-specific action map built from a shared model. The same action links should be crawlable in rendered HTML and included in structured navigation sources where appropriate, so thin account, policy, support, cart, and checkout pages still provide clear user actions and internal-link context.

## Additional Improvement 2

Every public ecommerce page should expose a shared trust matrix that makes seller identity, shipping, returns, payment state, subscription state, privacy, and support crawlable and visible. This prevents policy/support pages from becoming thin content and gives product, cart, checkout, and account pages the same purchase-confidence model.
## 2026-06-05 Shop SEO Sitemap Panel Improvement

Add a visible, shared SEO sitemap panel for every public storefront page. This makes page role, canonical target, robots policy, sitemap inclusion, and crawlable next links testable in public Playwright instead of relying only on hidden head tags or XML files.

## 2026-06-05 Shop Footer SEO Sitemap Improvement

For ecommerce pages, the footer must be treated as a shared SEO/UI surface, not a decorative afterthought. Public gates should verify that the footer exposes dense crawlable links, visible link styling, `SiteNavigationElement` columns, and an `ItemList` footer sitemap across every public storefront page.
