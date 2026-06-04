# AIBOUX Shop Search SEO/UI WIP

Status: `SHOP_10H_SEARCH_SEO_UI_WIP`

## Objective

Continue the AIBOUX Shop sales-quality sprint by making storefront search a real crawlable, SEO-aligned, UI-consistent flow instead of a decorative search input.

## Requirements

- Use the current master document as source of truth.
- Keep tenant frontend at `https://shop.aiboux.com/s/aiboux/`.
- Do not use `shop.aiboux.com/` as tenant storefront.
- Add a reusable storefront search form component if possible.
- Header search must submit with GET to `/s/{tenant}/products` using `q`.
- Search must work without client-side JavaScript.
- Search link/form must use crawlable URLs and descriptive labels.
- Products page must recognize `?q=` and show search context.
- Search result page must keep canonical/robots/page-type SEO sane.
- `WebSite` SearchAction must match the actual public query URL.
- Public gates must verify search form action, input name, query result context, and no broken old routes.
- Keep existing public storefront visual quality and sales-quality gates passing.

## Reference Basis

- Google Search Central link best practices: links and navigational actions should be crawlable, descriptive, and use real URLs.
- Google Search Central SEO Starter Guide: useful titles/descriptions, relevant links, and image/text context help users and search engines understand pages.
- Google Search Central ecommerce guidance: product discovery pages should be easy for crawlers and users to traverse.

## Verification

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run astro -- check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`
- Direct public HTML checks for `/s/aiboux/` and `/s/aiboux/products?q=coffee`.

## Not Final

- Remote D1 subscription migration remains unapplied.
- Provider-backed recurring billing remains unverified.
- `FINAL_ACCEPTED` remains prohibited.
