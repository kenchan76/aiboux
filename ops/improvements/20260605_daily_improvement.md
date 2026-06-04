# 2026-06-05 Daily Improvement

## Checked Current References

- Google Search Central SEO Starter Guide
- Google Search Central ecommerce structured data guide
- Google Search Central Breadcrumb structured data guide
- Google Search Central Product structured data guide
- Google Search Central crawlable link best practices

## Practical Improvement

For AIBOUX Shop storefront work, SEO-critical support and account links should be centralized as reusable components instead of duplicated per page.

This makes the following easier to enforce with Playwright:

- Every public storefront page has visible support/account/store links.
- Links are crawlable `<a href>` anchors with descriptive text.
- Link affordance remains visible.
- Breadcrumb, footer, support navigation, and SEO hub navigation remain consistent across TOP, product detail, cart, checkout, contact, legal, account, and subscription pages.

## Applied To Current Sprint

- Added a shared storefront support rail and required it in public crawl gates.
- Added a shared storefront SEO hub and required it in public crawl gates.
- For each new shared SEO/UI part, require public DOM evidence, visible link affordance, and `/g/l68` publication before user reporting.

## Additional Improvement: Shared Page Header Gate

After checking the same Google Search Central ecommerce and structured-data references again during the Shop sales-quality sprint, the practical process improvement is:

- Treat page-level heading, description, and internal action links as a shared SEO/UI component.
- Require non-product public tenant pages to render one reusable page header with one `h1`, a short description, store context, crawlable internal links, and visible blue link affordance.
- Keep product detail separate so it has exactly one visible product `h1` and no duplicate product title above the image gallery.
- Add public Playwright checks for the shared header, link count, `SiteNavigationElement` microdata, and visible link color.

Applied file targets:

- `src/components/shop/storefront/StorefrontPageHeader.tsx`
- `src/lib/shopStorefrontShared.ts`
- `src/pages/shop/[tenant]/[...path].astro`
- `tests/shop-public-crawl.spec.ts`

## Additional Improvement: Stable Category URL Treatment

After checking Google Search Central ecommerce URL structure guidance, category links should not be emitted as meaningless query URLs.

Practical process improvement:

- Stable curated category URLs may be indexable if they are used consistently in internal links, canonical tags, sitemap entries, and visible page content.
- Arbitrary free-text search URLs remain `noindex,follow,noarchive`.
- Tests should distinguish stable category discovery pages from arbitrary search pages.

Applied target:

- `/s/aiboux/products?category={slug}` must filter products, show category context, emit a self canonical, remain indexable, and expose an `ItemList` for the visible products.

## Additional Improvement: Shared Commerce Facts Gate

After checking Google Search Central product, merchant listing, return policy, breadcrumb, ecommerce URL, and crawlable link guidance again, purchase-critical facts should not be scattered across page-local templates.

Practical process improvement:

- Every public storefront page must show a shared purchase facts block with price/tax, stock/shipping, return policy, payment state, support, and subscription readiness.
- The block must use crawlable `<a href>` links with visible affordance.
- The block must expose visible `SiteNavigationElement` microdata.
- Product detail must include product-specific price and stock context while keeping only one visible product `h1`.

Applied target:

- `StorefrontCommerceFacts` is required by public crawl and product detail gates.

## Additional Improvement: Shared Page Quality Summary Gate

After checking Google Search Central ecommerce site structure, crawlable link, product, merchant listing, return policy, and breadcrumb guidance again, page intent should be visible and testable instead of only implied by meta tags.

Practical process improvement:

- Every public storefront page must render a shared page-quality summary.
- The summary must state visible search intent, SEO role, and next user action.
- The summary must use crawlable `<a href>` links with visible blue link affordance.
- The summary must expose visible `SiteNavigationElement` microdata.
- Product detail must keep exactly one visible product `h1` and use the summary as supporting context, not as a duplicate product title.

Applied targets:

- `src/lib/shopStorefrontShared.ts`
- `src/components/shop/storefront/StorefrontPageQualitySummary.tsx`
- `src/components/shop/storefront/ShadcnStorefront.tsx`
- `src/pages/shop/[tenant]/[...path].astro`
- `tests/shop-public-crawl.spec.ts`
- `tests/shop-product-detail-public.spec.ts`
