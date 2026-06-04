# SHOP_10H_SHARED_SEO_META_MODEL_WIP

Timestamp: 2026-06-04T18:50:00Z
Status: WIP_DEPLOYED_NOT_FINAL

## Objective

Continue the AIBOUX Shop all-pages Amazon-quality sprint by centralizing public storefront SEO metadata and strengthening public Playwright gates.

This work unit does not claim `FINAL_ACCEPTED`.

## Changed Implementation

- Added shared SEO metadata builder in `src/lib/shopSeo.ts`.
- Replaced inline metadata construction in `src/pages/shop/[tenant]/[...path].astro`.
- Replaced TOP page metadata construction in `src/pages/shop/storefront/[tenant].astro`.
- Strengthened `tests/shop-public-crawl.spec.ts` to verify:
  - useful title length;
  - useful meta description length;
  - no thin placeholder SEO text;
  - canonical URL;
  - Open Graph URL/image;
  - Twitter Card description consistency;
  - robots policy.
- Strengthened `tests/shop-product-detail-public.spec.ts` to verify:
  - product title is present in the SEO title;
  - product meta description includes purchase-decision terms;
  - product OG URL matches canonical;
  - Twitter description matches meta description.
- Added `gate:shop-seo-meta` to `package.json`.

## WIP Deployments

- Worker Version ID after first shared-meta deploy: `b27e2fab-0144-48a9-a216-076c830f7914`
- Worker Version ID after product description correction: `3a7200ff-fa1c-4dff-b7e4-7edb5fcdda12`
- Worker Version ID after all-page description correction: `62c71267-70d0-428d-a124-ab06a3f3938a`
- Current WIP checkpoint commit: `b647f213a07a556e448b9832d99c3ab3722ffaba`

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro check`: PASS with existing hints only
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-seo-meta`: PASS, 6 passed
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS
  - `gate:shop-public-crawl`: PASS, 9 passed
  - `gate:shop-storefront-carousel`: PASS, 2 passed
  - `gate:shop-storefront-interaction`: PASS, 2 passed
  - `gate:shop-storefront-visual`: PASS, 3 passed
  - `gate:shop-product-detail`: PASS, 3 passed
  - `gate:shop-cart-checkout`: PASS, 1 passed
  - `gate:shop-contact-legal`: PASS, 2 passed
  - `gate:shop-admin-ops`: PASS, 2 passed

## Public Screen Evidence

- TOP 1365: `https://mail.aiboux.com/g/screens/shop-top-1365.png`
- TOP 1980: `https://mail.aiboux.com/g/screens/shop-top-1980.png`
- TOP mobile: `https://mail.aiboux.com/g/screens/shop-top-mobile.png`
- Product detail 1365: `https://mail.aiboux.com/g/screens/shop-product-detail-1365.png`
- Product detail 1980: `https://mail.aiboux.com/g/screens/shop-product-detail-1980.png`
- Product detail mobile: `https://mail.aiboux.com/g/screens/shop-product-detail-mobile.png`
- Cart: `https://mail.aiboux.com/g/screens/shop-cart-page.png`
- Checkout: `https://mail.aiboux.com/g/screens/shop-checkout-page.png`
- Contact: `https://mail.aiboux.com/g/screens/shop-contact-page.png`
- Legal: `https://mail.aiboux.com/g/screens/shop-legal-page.png`
- Privacy: `https://mail.aiboux.com/g/screens/shop-privacy-page.png`
- Shipping: `https://mail.aiboux.com/g/screens/shop-shipping-page.png`
- Returns: `https://mail.aiboux.com/g/screens/shop-returns-page.png`

## SEO Basis

The shared metadata model follows the sprint references from Google Search Central:

- SEO Starter Guide: clear page titles and helpful descriptions.
- Ecommerce URL structure: stable crawlable storefront URLs.
- Ecommerce site structure: discoverable product/category/account/policy paths.
- Crawlable links: real `<a href>` links with descriptive text.
- Breadcrumb structured data: shared breadcrumb model.
- Product structured data: product pages expose Product, Offer, seller, return, and shipping facts.

## Not Final

- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- `gate:shop-subscriptions` remains non-final until remote schema and provider behavior are verified.
- This is not `FINAL_ACCEPTED`.

## Public Evidence Publication

Timestamp: 2026-06-04T18:56:35Z

- Public evidence Worker Version ID: `dda0942c-aa3d-4fa4-bd15-67b7ad7f2263`
- Evidence commit before publication: `352d358`
- Public `/g/m68`: HTTP 200 / `text/markdown; charset=utf-8`
- Public `/g/l68`: HTTP 200 / `text/markdown; charset=utf-8`
- Public `/g/d68`: HTTP 200 / `text/markdown; charset=utf-8`
- Public marker check: `SHOP_10H_SHARED_SEO_META_MODEL_WIP` present in m68, l68, and d68.
- Verification file: `all_log/public-g/20260604T185635Z_shared_seo_meta_public_g_verification.txt`

SHA note:
- Source and fetched `/g/*` body SHA values differ because public Markdown responses substitute runtime Worker Version ID values such as `__WORKER_VERSION_ID__`.
- The public bodies show runtime Worker Version ID `dda0942c-aa3d-4fa4-bd15-67b7ad7f2263`.

Not final:
- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- This is not `FINAL_ACCEPTED`.
