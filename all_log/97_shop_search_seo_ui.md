## SHOP_10H_SEARCH_SEO_UI_WIP

Timestamp: 2026-06-04T17:30:00Z
Status: WIP_DEPLOYED_NOT_FINAL

Objective:
- Continue the all-page Shop SEO/UI hardening sprint.
- Convert the storefront header search from decorative UI into a crawlable, reusable, GET-based search form.
- Keep arbitrary query result URLs SEO-safe while preserving useful internal product discovery.

Reference SEO basis checked:
- Google Search Central ecommerce site structure guidance: product and category pages should be reachable through links and navigation.
- Google Search Central crawlable URL/link guidance: important destinations must be reachable through real URLs and anchors.
- Google Search Central SEO starter guidance: page titles and descriptions should describe the actual page content.
- Schema.org `WebSite` / `SearchAction`, `CollectionPage`, `ItemList`, and `Product` were used to align structured data with the actual storefront search route.

Implementation:
- Added shared component `src/components/shop/storefront/StorefrontSearchForm.tsx`.
- Reused the search component in TOP storefront and public tenant subpage headers.
- Header search now submits `GET /s/{tenant}/products?q=<term>`.
- Products page reads `q`, shows search context, filters product cards, and preserves crawlable product links.
- Search result pages use canonical `/s/{tenant}/products` and `noindex,follow,noarchive`.
- `WebSite` JSON-LD `SearchAction` already targets `/s/aiboux/products?q={search_term_string}` and is now backed by the real public form.
- `ItemList` JSON-LD on products/search pages reflects the visible product discovery set.
- Mobile header now wraps so the search form remains visible and usable instead of collapsing to zero width.

Changed files:
- `ops/instructions/20260605_shop_search_seo_ui.md`
- `ops/instructions/current.md`
- `src/components/shop/storefront/StorefrontSearchForm.tsx`
- `src/components/shop/storefront/ShadcnStorefront.tsx`
- `src/pages/shop/[tenant]/[...path].astro`
- `tests/shop-public-crawl.spec.ts`

Commits:
- `30f4f07` WIP add crawlable storefront search SEO
- `23e556d` WIP keep storefront search visible on mobile

Deployment:
- First search SEO deploy Worker Version ID: `46ef9a02-a4bc-4fec-b1d8-831a235a142d`
- Mobile visibility fix deploy Worker Version ID: `dad7c13e-c940-4a25-9fd8-0f484bce01d3`

Verification:
- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro -- check`: PASS with existing warnings/hints only
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`: PASS, 7 passed
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS

Public search evidence:
- URL: `https://shop.aiboux.com/s/aiboux/products?q=%E3%82%B3%E3%83%BC%E3%83%92%E3%83%BC`
- HTTP: 200
- Worker response header `x-aiboux-worker-version`: `46ef9a02-a4bc-4fec-b1d8-831a235a142d` on initial direct check, then latest deploy `dad7c13e-c940-4a25-9fd8-0f484bce01d3`
- Confirmed markers:
  - `data-testid="storefront-search-form"`
  - `name="q"`
  - `検索語: コーヒー`
  - `noindex,follow,noarchive`
  - canonical `https://shop.aiboux.com/s/aiboux/products`
  - `SearchAction`
  - `products?q={search_term_string}`
- Evidence files:
  - `all_log/public-checks/20260604T172224Z_search_products.headers`
  - `all_log/public-checks/20260604T172224Z_search_products.html`
  - `all_log/public-checks/20260604T172224Z_search_products_summary.txt`

Public screen evidence refreshed by gates:
- TOP 1365: `https://mail.aiboux.com/g/screens/shop-top-1365.png`
- TOP 1980: `https://mail.aiboux.com/g/screens/shop-top-1980.png`
- TOP mobile: `https://mail.aiboux.com/g/screens/shop-top-mobile.png`
- Products 1980: `https://mail.aiboux.com/g/screens/shop-products-page-1980.png`
- Product detail 1365: `https://mail.aiboux.com/g/screens/shop-product-detail-1365.png`
- Product detail 1980: `https://mail.aiboux.com/g/screens/shop-product-detail-1980.png`
- Product detail mobile: `https://mail.aiboux.com/g/screens/shop-product-detail-mobile.png`

Not final:
- This is a WIP deployed SEO/UI hardening cycle, not `FINAL_ACCEPTED`.
- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- Continue improving all-page structure, SEO, UI density, and conversion flow.

## Publication update

Timestamp: 2026-06-04T17:34:56Z
Status: WIP_DEPLOYED_NOT_FINAL

Public evidence deploy:
- Worker Version ID: `18795347-7cc1-46ee-b5ca-683b7fb15d8c`
- Deploy log: `all_log/deploys/20260604T173418Z_publish_search_seo_evidence.txt`

Public `/g/*` verification:
- m68: HTTP 200 / `text/markdown; charset=utf-8`
- l68: HTTP 200 / `text/markdown; charset=utf-8`
- d68: HTTP 200 / `text/markdown; charset=utf-8`
- Markers present in public m68/l68/d68: `SHOP_10H_SEARCH_SEO_UI_WIP`
- Public verification file: `all_log/public-g/20260604T173456Z_search_seo_public_g_verification.txt`

SHA note:
- Public `/g/*` responses include runtime Worker Version ID substitution.
- SHA mismatch between `public/g/*.md` and fetched `/g/*` bodies is expected when runtime substitution changes the response body.
