# SHOP_10H_ENTITY_GRAPH_SEO_UI_WIP

Timestamp: 2026-06-04T16:55:00Z
Status: WIP_DEPLOYED_NOT_FINAL

## Objective

Strengthen AIBOUX Shop public storefront SEO by connecting the shared store entity, website entity, page entity, product entity, offer seller, shipping details, and return policy in JSON-LD.

## Changed Files

- `src/lib/shopSeo.ts`
- `src/pages/shop/[tenant]/[...path].astro`
- `src/pages/shop/storefront/[tenant].astro`
- `tests/shop-public-crawl.spec.ts`
- `tests/shop-product-detail-public.spec.ts`
- `ops/instructions/20260605_shop_entity_graph_seo_ui.md`
- `ops/instructions/current.md`
- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `public/g/l68.md`
- `public/g/d68.md`

## Implementation

- Added stable JSON-LD entity IDs: `#store`, `#website`, `#webpage`, `#product`, and `#offer`.
- Kept `Organization` while adding `OnlineStore`.
- Added WebPage `isPartOf`, `publisher`, and `about`.
- Added Product `mainEntityOfPage`.
- Added Offer `seller`.
- Kept `OfferShippingDetails` and `MerchantReturnPolicy`.

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro -- check`: PASS with existing hints only
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`: PASS
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail`: PASS
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS

## Public HTML Evidence

Summary:

- `all_log/public-checks/20260604T164843Z_entity_graph_summary.txt`

Checked public paths:

- `/s/aiboux/`
- `/s/aiboux/products`
- `/s/aiboux/contact`
- `/s/aiboux/faq`
- `/s/aiboux/shipping`
- `/s/aiboux/returns`
- `/s/aiboux/product/shopprod_tenant_001_4580000232621`

Confirmed markers:

- `OnlineStore`
- `#store`
- `#website`
- `isPartOf`
- `publisher`
- `about`
- `MerchantReturnPolicy`
- product detail: `OfferShippingDetails`
- product detail: `mainEntityOfPage`
- product detail: `seller`

## Deploy

- WIP commit: `b6ba295`
- Worker Version ID: `d7617383-347a-43b5-ab4d-dc54ddab17d7`
- Deploy log: `all_log/deploys/20260604T164621Z_entity_graph_seo_wrangler_deploy.txt`

## Not Final

- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- FINAL_ACCEPTED remains prohibited.
