# AIBOUX Shop Shared Product Card SEO/UI Hardening

Status: WIP

## Objective

Every public storefront product surface must use one shared, crawlable, Amazon-like product card pattern instead of copied markup.

## Sources Checked

- Google Search Central SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Google Search Central crawlable links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`
- Google Search Central product structured data: `https://developers.google.com/search/docs/appearance/structured-data/product-snippet`
- Google Search Central breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Google Search Central ecommerce structured data: `https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce`

## Required Implementation

- Add a shared storefront product card component.
- Use real `<a href>` links for product detail and category navigation.
- Keep visible blue link affordance for SEO-relevant text links.
- Add Product and Offer microdata to every shared card.
- Keep image `alt` text tied to the product name.
- Keep product card image ratio, title height, rating, review count, price, tax label, and CTA placement consistent.
- Keep cart buttons using `data-cart-add` and product data attributes.
- Replace duplicated product-card markup in public storefront subpages where safe.
- Add public Playwright checks for the shared product card pattern.

## Scope

- `/s/aiboux/products`
- `/s/aiboux/cart`
- `/s/aiboux/orders`
- `/s/aiboux/favorites`
- `/s/aiboux/mypage/subscriptions`
- `/s/aiboux/login`
- `/s/aiboux/register`
- product detail related products

## Non-Final Conditions

- `FINAL_ACCEPTED` is still prohibited.
- Remote D1 subscription migration remains a separate subscription-lane blocker until applied and verified.
- Provider-backed recurring billing remains unverified.

