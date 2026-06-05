# 2026-06-05 Daily Improvement: Shopper UI Text Must Not Expose SEO/Internal Implementation

## 2026-06-05 Addition: Stop SEO-Work Drift And Fix The Sales UI Directly

Checked current Google Search Central ecommerce guidance again for this sprint:

- Ecommerce site structure and crawler-friendly navigation.
- Ecommerce URL structure.
- Breadcrumb structured data.
- Ecommerce structured data.

Process improvement:

- Stop adding SEO explanation panels, checklist panels, sitemap panels, trust matrices, support rails, action maps, or context-link panels to shopper pages.
- Do not spend a WIP cycle on schema-only or gate-only changes when the user asked for sales quality.
- Keep existing technical SEO working in head metadata, canonical, robots, JSON-LD, breadcrumbs, sitemap.xml, and robots.txt, but do not surface implementation explanations in shopper UI.
- Treat visible improvements as valid only when they make TOP, product detail, cart, checkout, contact/legal, or admin operations more usable for buyers or operators.
- Use fewer, broader gates: core flow and visual critical checks should prove buying behavior and screen quality rather than proving that more SEO components exist.

## Checked References

- Google Search Central SEO Starter Guide
- Google Search Central breadcrumb structured data
- Google Search Central ecommerce structured data
- Google Search Central ecommerce URL structure guidance

## Process Improvement

For AIBOUX Shop SEO/UI tasks, do not add visible shopper-facing panels that explain SEO internals, implementation state, schema names, migration state, canonical/robots/sitemap, or operational test status.

Use this separation:

- Visible UI: buyer actions, product comparison, delivery, return, payment preparation, account entry, and support.
- Invisible/technical SEO: canonical tags, robots meta, JSON-LD, BreadcrumbList, Product/Offer data, sitemap.xml, robots.txt, crawlable links, stable tenant URLs.

## Added Gate Direction

Public storefront crawl should fail if buyer-facing body text contains internal implementation labels such as:

- `AIBOUX Shop 共通テンプレート`
- `表示確認日`
- `D1 migration`
- `DB migration`
- `SUBSCRIPTION_SCHEMA_PENDING`
- `ログイン基盤`
- `本番認証`
- `成功したふり`

These terms may remain in source comments/tests only when they are not rendered to users and are necessary for gate assertions.

## Earlier 2026-06-05 Improvement: Shared Link Source Consistency

For AIBOUX Shop SEO/UI work, public page tests must check that visible shared navigation components and JSON-LD navigation are generated from the same shared link sources.

Google Search Central emphasizes crawlable links, clear ecommerce site structure, breadcrumb structured data, and product/merchant structured data. A page can look linked while its structured navigation omits the same destinations, so the gate verifies both rendered links and JSON-LD navigation coverage.

Applied process:

- Keep shared link sources in `shopStorefrontShared.ts`.
- Render shared breadcrumb support, page quality, buying guide, contextual links, SEO hub, support rail, and footer visibly when they are appropriate for shoppers.
- Include the same shared sources in `SiteNavigationElement` JSON-LD where applicable.
- Strengthen public Playwright checks instead of relying on HTTP 200 or screenshot-only evidence.

## Earlier 2026-06-05 Improvement: Page Action Map

For ecommerce SEO/UI work, each public page should expose clear page-specific actions built from a shared model. The same action links should be crawlable in rendered HTML and included in structured navigation sources where appropriate, so account, policy, support, cart, and checkout pages provide clear user actions and internal-link context without becoming implementation-explanation pages.

## Earlier 2026-06-05 Improvement: Trust Matrix

Every public ecommerce page should expose purchase-confidence information where useful: seller identity, shipping, returns, payment state, subscription state, privacy, and support. This prevents policy/support pages from becoming thin content and gives product, cart, checkout, and account pages the same purchase-confidence model.

## Earlier 2026-06-05 Improvement: Footer SEO Sitemap

For ecommerce pages, the footer must be treated as a shared SEO/UI surface, not a decorative afterthought. Public gates should verify that the footer exposes dense crawlable links, visible link styling, `SiteNavigationElement` columns, and an `ItemList` footer link directory across every public storefront page.

## Earlier 2026-06-05 Improvement: Landmark / Skip Link

Every public storefront page should expose stable page-experience landmarks, not only visible link blocks. Public gates should verify a shared skip-link nav, `main#storefront-main`, `#storefront-search`, `footer#storefront-footer`, and labeled header/category navigation so keyboard users, crawlers, and automated audits see the same predictable structure on every page.
