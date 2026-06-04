# 2026-06-05 AIBOUX Shop Entity Graph SEO/UI

## Status

`SHOP_10H_ENTITY_GRAPH_SEO_UI_WIP`

## Objective

Continue the AIBOUX Shop sales-quality sprint by strengthening structured data across the public tenant storefront.

The next improvement is to connect the public storefront pages, store entity, website entity, product entity, shipping details, and return policy as a reusable entity graph instead of isolated JSON-LD fragments.

## Scope

Target public URLs:

- `https://shop.aiboux.com/s/aiboux/`
- `https://shop.aiboux.com/s/aiboux/products`
- `https://shop.aiboux.com/s/aiboux/categories`
- `https://shop.aiboux.com/s/aiboux/contact`
- `https://shop.aiboux.com/s/aiboux/legal`
- `https://shop.aiboux.com/s/aiboux/privacy`
- `https://shop.aiboux.com/s/aiboux/shipping`
- `https://shop.aiboux.com/s/aiboux/returns`
- `https://shop.aiboux.com/s/aiboux/faq`
- `https://shop.aiboux.com/s/aiboux/product/{id}`

## Requirements

- Use a shared SEO helper, not page-specific ad hoc JSON.
- Organization markup should use the ecommerce-appropriate `OnlineStore` subtype.
- Organization markup must keep `hasMerchantReturnPolicy`.
- WebPage markup must link to the shared WebSite and OnlineStore entities with `isPartOf`, `publisher`, and `about`.
- Product markup must link seller/brand/offer back to the same store entity.
- Product Offer must keep `OfferShippingDetails` and `MerchantReturnPolicy`.
- Tests must verify these structures on public `https://shop.aiboux.com` URLs.
- Do not add duplicate visible headings or change storefront URLs.
- This is WIP only; do not claim `FINAL_ACCEPTED`.

## Reference Basis

- Google Search Central ecommerce structured data guidance.
- Google Search Central Product structured data guidance.
- Google Search Central MerchantReturnPolicy guidance.
- Google Search Central Organization structured data guidance.
- Schema.org `Offer`, `OfferShippingDetails`, `MerchantReturnPolicy`, `OnlineStore`, and `WebPage`.

## Verification

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run astro -- check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`

## Reporting

Update:

- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `public/g/l68.md`
- `public/g/d68.md`

Then WIP deploy and verify:

- `https://mail.aiboux.com/g/m68`
- `https://mail.aiboux.com/g/l68`
- `https://mail.aiboux.com/g/d68`

## Not Final

- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- `FINAL_ACCEPTED` remains prohibited.
