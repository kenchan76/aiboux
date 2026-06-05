# AIBOUX Shop Visible SEO Explanation Removal

<!-- MASTER_BLOCK_START -->
## Current Active Operating Override: AIBOUX Shop Visible SEO Explanation Removal

Status: `SHOP_REMOVE_VISIBLE_SEO_EXPLANATIONS_WIP_DEPLOYED_NOT_FINAL`

The tenant storefront remains `https://shop.aiboux.com/s/aiboux/`.
`https://shop.aiboux.com/` remains the Shop service site.

This override supersedes prior visible SEO checklist / SEO sitemap UI work for the public shopper-facing storefront. The implementation keeps technical SEO in the page head and structured data, but removes shopper-visible implementation explanations from public storefront pages.

Current public WIP evidence:

- WIP implementation commit: `a24ea1588b75bd8f7ebecf3c72818b919874d644`.
- WIP deploy Worker Version ID before this log-publication deploy: `f028349e-5dba-40f0-9fd7-2b83702e8a74`.
- Removed visible SEO checklist panels and visible SEO sitemap panels from TOP, product detail, and all shared storefront subpages.
- Deleted the unused storefront SEO checklist and SEO sitemap panel components.
- Removed unused shared builders that could reintroduce visible SEO operation copy.
- Reworded shopper-facing page guide, buying guide, support rail, context links, action map, and footer link directory so they no longer expose `canonical`, `robots`, `sitemap`, `noindex`, `Product/Offer`, `可視H1`, or visible SEO operation language in the rendered body.
- Preserved backend SEO: canonical link tags, robots meta, Open Graph, Twitter Card, JSON-LD, BreadcrumbList, Product structured data, robots.txt, and sitemap.xml remain active and covered by public gates.

Verification:

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS with 0 errors and existing hints only.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`: PASS, 9 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail`: PASS, 3 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS across public crawl, smooth carousel, storefront interaction, storefront visual, product detail, cart/checkout, contact/legal, and admin ops.

Important distinction:

- Removed from visible shopper UI: SEO explanation panels and operation words.
- Kept for real SEO: metadata, structured data, breadcrumbs, stable URLs, crawlable links, robots.txt, and sitemap.xml.

Not final:

- This is WIP / deployed evidence, not `FINAL_ACCEPTED`.
- The subscription lane remains separate and not final until D1/provider-backed recurring billing is fully verified.
- `FINAL_ACCEPTED` remains prohibited.
<!-- MASTER_BLOCK_END -->

<!-- LOG_BLOCK_START -->
## 2026-06-05T00:39:37Z Visible SEO Explanation Removal From Public Shopper Pages

Status: `SHOP_REMOVE_VISIBLE_SEO_EXPLANATIONS_WIP_DEPLOYED_NOT_FINAL`

This is a WIP deployed evidence entry, not `FINAL_ACCEPTED`.

### Purpose

The user rejected shopper-facing pages that visibly explained SEO implementation details. This work removes public-facing SEO operation explanations from the AIBOUX Shop storefront while preserving actual technical SEO behind the scenes.

### Implementation Commit And Worker

- WIP implementation commit: `a24ea1588b75bd8f7ebecf3c72818b919874d644`.
- Worker Version ID before this log-publication deploy: `f028349e-5dba-40f0-9fd7-2b83702e8a74`.

### Changed Files / Areas

- Removed visible rendering of `StorefrontSeoChecklist` and `StorefrontSeoSiteMapPanel`.
- Deleted `src/components/shop/storefront/StorefrontSeoChecklist.tsx`.
- Deleted `src/components/shop/storefront/StorefrontSeoSiteMapPanel.tsx`.
- Removed unused shared SEO checklist and SEO sitemap builder exports from `src/lib/shopStorefrontShared.ts`.
- Updated public storefront TOP, product detail, products, categories, cart, checkout, contact, legal, privacy, shipping, returns, FAQ, account, mypage, and related tenant pages through shared components/tests.
- Reworded visible shared UI copy in footer, page guide, buying guide, action map, context links, support rail, and navigation surfaces so the rendered body is shopper-facing.

### Removed From Visible Shopper UI

- `SEO / UI checklist`
- `SEO site map`
- `canonical`
- `robots`
- `sitemap`
- `noindex`
- `Product/Offer`
- `可視H1`
- `共通SEO部品`
- `SEO内部リンク`

### Preserved Behind The Scenes

- Canonical link tags.
- Robots meta.
- Open Graph and Twitter Card metadata.
- JSON-LD and BreadcrumbList.
- Product structured data.
- Crawlable internal links.
- `robots.txt`.
- `sitemap.xml`.

### Verification

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS, 0 errors, existing hints only.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`: PASS, 9 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail`: PASS, 3 tests.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`: PASS.

### Public URL Scope Verified

- `https://shop.aiboux.com/s/aiboux/`
- `https://shop.aiboux.com/s/aiboux/products`
- `https://shop.aiboux.com/s/aiboux/categories`
- `https://shop.aiboux.com/s/aiboux/cart`
- `https://shop.aiboux.com/s/aiboux/checkout`
- `https://shop.aiboux.com/s/aiboux/contact`
- `https://shop.aiboux.com/s/aiboux/legal`
- `https://shop.aiboux.com/s/aiboux/privacy`
- `https://shop.aiboux.com/s/aiboux/shipping`
- `https://shop.aiboux.com/s/aiboux/returns`
- `https://shop.aiboux.com/s/aiboux/faq`
- `https://shop.aiboux.com/s/aiboux/product/setsuka-coffee`

### Not Final

- Subscription lane remains separate / not final.
- `FINAL_ACCEPTED` remains prohibited.
<!-- LOG_BLOCK_END -->

<!-- SCREEN_BLOCK_START -->
## 2026-06-05T00:39:37Z Visible SEO Explanation Removal Screen Evidence

Status: `SHOP_REMOVE_VISIBLE_SEO_EXPLANATIONS_WIP_DEPLOYED_NOT_FINAL`

This is WIP screen and DOM evidence, not `FINAL_ACCEPTED`.

### Public Gate Evidence

- WIP implementation commit: `a24ea1588b75bd8f7ebecf3c72818b919874d644`.
- Worker Version ID before this log-publication deploy: `f028349e-5dba-40f0-9fd7-2b83702e8a74`.
- `gate:shop-public-crawl`: PASS, 9 tests.
- `gate:shop-storefront-carousel`: PASS, 2 tests.
- `gate:shop-storefront-interaction`: PASS, 2 tests.
- `gate:shop-storefront-visual`: PASS, 3 tests.
- `gate:shop-product-detail`: PASS, 3 tests.
- `gate:shop-cart-checkout`: PASS, 1 test.
- `gate:shop-contact-legal`: PASS, 2 tests.
- `gate:shop-admin-ops`: PASS, 2 tests.

### Visible UI Absence Checks

The public body text gates now require these operation terms to be absent from shopper-facing pages:

- `SEO / UI checklist`
- `SEO site map`
- `canonical`
- `robots`
- `sitemap`
- `noindex`
- `Product/Offer`
- `可視H1`
- `共通SEO部品`
- `SEO内部リンク`

### Screen Evidence

Updated public screen artifacts:

- `/g/screens/shop-top-1365.png`
- `/g/screens/shop-top-1980.png`
- `/g/screens/shop-top-mobile.png`
- `/g/screens/shop-product-detail-1365.png`
- `/g/screens/shop-product-detail-1980.png`
- `/g/screens/shop-product-detail-mobile.png`
- `/g/screens/shop-products-page-1980.png`
- `/g/screens/shop-categories-page-1980.png`
- `/g/screens/shop-cart-page-1980.png`
- `/g/screens/shop-checkout-page-1980.png`
- `/g/screens/shop-contact-page-1980.png`
- `/g/screens/shop-legal-page-1980.png`
- `/g/screens/shop-privacy-page-1980.png`
- `/g/screens/shop-shipping-page-1980.png`
- `/g/screens/shop-returns-page-1980.png`
- `/g/screens/shop-faq-page-1980.png`

### Not Final

- Subscription lane remains not final.
- `FINAL_ACCEPTED` remains prohibited.
<!-- SCREEN_BLOCK_END -->
