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
