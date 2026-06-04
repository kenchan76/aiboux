# AIBOUX Shop Page-Type SEO/UI Sprint

Status: `SHOP_10H_PAGE_TYPE_SEO_UI_WIP`
Date: 2026-06-05

## Objective

Continue the AIBOUX Shop sales-quality sprint by strengthening page-type-specific SEO structure across all public tenant pages.

## Scope

Target public tenant URL:

- `https://shop.aiboux.com/s/aiboux/`

Relevant page groups:

- TOP page
- products page
- categories page
- product detail page
- contact page
- FAQ page
- policy/support pages
- cart/checkout/account pages that remain noindex/follow

## Requirements

- Do not change the tenant URL structure.
- Do not change `shop.aiboux.com/` into a tenant storefront.
- Keep visible UI stable unless required by SEO/UI quality.
- Add page-specific structured-data types where appropriate.
- Products and categories discovery pages must be `CollectionPage`.
- Contact must stay `ContactPage`.
- FAQ must stay `FAQPage`.
- Product detail must stay `ItemPage` plus `Product`.
- Transactional/account pages may stay noindex/follow.
- `ItemList` must expose stable `@id`, `numberOfItems`, and `mainEntityOfPage`.
- Product listing `ItemList` entries should point at Product entity IDs where possible.
- Page JSON-LD must keep `isPartOf`, `publisher`, and `about`.
- Public Playwright gates must verify these page-type markers on `https://shop.aiboux.com`.

## Not Final

- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- `FINAL_ACCEPTED` remains prohibited.
