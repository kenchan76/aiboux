# SHOP_10H_PAGE_TYPE_SEO_UI_WIP

Timestamp: 2026-06-04T17:18:00Z
Status: WIP_DEPLOYED_NOT_FINAL

## Objective

Continue the Shop SEO/UI sprint by strengthening page-type structured data and reusable SEO graph parts across public tenant pages.

## Reference Basis

- Google Search Central ecommerce SEO guidance: ecommerce pages should provide explicit product/store meaning and relevant structured data.
- Google Search Central Product structured data guidance: merchant product pages should expose product facts in initial HTML where eligible.
- Google Search Central Breadcrumb structured data guidance: breadcrumbs should represent a useful user path.
- Schema.org `BreadcrumbList`, `ItemList`, `CollectionPage`, `ContactPage`, `FAQPage`, `Product`, and `Offer` references were used for entity shape.

## Changed Implementation

- `src/lib/shopSeo.ts`
  - Added stable `ItemList` entity IDs with `#itemlist`.
  - Added `numberOfItems` and `mainEntityOfPage` to `ItemList`.
  - Added product/category item entities inside `ItemList`.
  - Mapped discovery pages to `CollectionPage`.
  - Preserved `ContactPage`, `FAQPage`, `ItemPage`, `Product`, and `Offer` for the matching page types.
- `tests/shop-public-crawl.spec.ts`
  - Strengthened public crawls to verify `CollectionPage`.
  - Strengthened `ItemList` checks for `#itemlist`, `numberOfItems`, and `mainEntityOfPage`.
- `ops/instructions/20260605_shop_page_type_seo_ui.md`
  - Added active instruction for this work unit.
- `ops/instructions/current.md`
  - Reflected this work unit as the current active continuation.

## Public Deploy

- WIP commit: `6276c851b3127ec0c44a1542fde222a0267e6a74`
- Worker Version ID: `bcb4177a-3d5e-4a77-a591-60a2ddf13d55`
- Deploy log: `all_log/deploys/20260604T170422Z_page_type_seo_wrangler_deploy.txt`

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro -- check`: PASS with existing warnings/hints only
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`: PASS, 6 passed
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail`: PASS, 3 passed
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS across public crawl, carousel, interaction, visual, product detail, cart/checkout, contact/legal, and admin ops.

## Direct Public HTML Evidence

Summary file:

- `all_log/public-checks/20260604T170640Z_page_type_summary.txt`

Checked public URLs:

- `/s/aiboux/`: HTTP 200, `#itemlist`, `Product`, `mainEntityOfPage`, `numberOfItems`
- `/s/aiboux/products`: HTTP 200, `CollectionPage`, `#itemlist`, `Product`, `mainEntityOfPage`, `numberOfItems`
- `/s/aiboux/categories`: HTTP 200, `CollectionPage`, `#itemlist`, `mainEntityOfPage`, `numberOfItems`
- `/s/aiboux/favorites`: HTTP 200, `CollectionPage`, `#itemlist`, `Product`, `mainEntityOfPage`, `numberOfItems`
- `/s/aiboux/contact`: HTTP 200, `ContactPage`, `#itemlist`, `mainEntityOfPage`, `numberOfItems`
- `/s/aiboux/faq`: HTTP 200, `FAQPage`, `#itemlist`, `mainEntityOfPage`, `numberOfItems`
- `/s/aiboux/product/shopprod_tenant_001_4580000232621`: HTTP 200, `ItemPage`, `Product`, `Offer`, `mainEntityOfPage`

## Not Final

- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- This is not `FINAL_ACCEPTED`.

## Public Evidence Publication And Progress Bark

Timestamp: 2026-06-04T17:13:00Z
Status: WIP_DEPLOYED_NOT_FINAL

Public evidence deployment:
- Evidence commit: `b5eb45e5004e72c1f3683186704e4a91e9fab281`
- Public evidence Worker Version ID: `566b290d-ed0d-4211-ba8d-67fbc5bd4e5a`
- Public `/g/m68`: HTTP 200 / `text/markdown; charset=utf-8` / marker present
- Public `/g/l68`: HTTP 200 / `text/markdown; charset=utf-8` / marker present
- Public `/g/d68`: HTTP 200 / `text/markdown; charset=utf-8` / marker present
- Public verification file: `all_log/public-g/20260604T171219Z_page_type_seo_public_g_verification.txt`

SHA note:
- Public `/g/*` responses include runtime Worker Version ID substitution.
- SHA mismatch between `public/g/*.md` and fetched `/g/*` bodies is expected when runtime substitutions are present.

Progress Bark notification:
- purpose: progress
- delivered: true
- skipped: false
- secretLogged: false
- finalGate: false
- userReceiptConfirmed: false
- Worker Version ID: `566b290d-ed0d-4211-ba8d-67fbc5bd4e5a`
- Evidence file: `all_log/bark/20260604T171233Z_page_type_seo_progress_bark.json`

Not final:
- This is a progress notification only.
- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- This is not `FINAL_ACCEPTED`.
