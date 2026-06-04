# 2026-06-04 Daily Improvement: Shop SEO Shared Head Gate

## Source Checked

- Google Search Central: Best practices for ecommerce sites in Google Search
- Google Search Central: Link best practices for Google
- Google Search Central: Breadcrumb structured data
- Google Search Central: Ecommerce URL structure best practices

## Practical Improvement

AIBOUX Shop storefront SEO must not be page-local hand work.

The Shop code now treats the following as shared page infrastructure:

- self-referencing canonical URL;
- visible breadcrumb;
- `BreadcrumbList` JSON-LD from the same breadcrumb model;
- `WebSite` SearchAction JSON-LD;
- `Organization` JSON-LD with support/return policy;
- `Product` JSON-LD on product detail pages;
- page-specific `ItemList` JSON-LD where listing/support/account cards are rendered;
- robots policy split between indexable discovery/content pages and noindex transactional/account pages;
- Open Graph and Twitter Card metadata;
- crawlable `<a href>` links with meaningful visible text.

## Gate Strengthening

`tests/shop-public-crawl.spec.ts` must verify canonical, robots, Open Graph, Twitter Card, `ja-JP` alternate metadata, visible breadcrumbs, footer presence, direct links, and one primary `h1`.

`tests/shop-product-detail-public.spec.ts` must verify product-specific canonical, indexable robots, product Open Graph type, product image metadata, Twitter Card metadata, one product `h1`, and Product JSON-LD.

## Reason

Google Search Central emphasizes that ecommerce visibility depends on product data, site structure, crawlable links, canonical URL consistency, and structured data. AIBOUX Shop needs these as shared implementation guarantees rather than per-page reminders.
