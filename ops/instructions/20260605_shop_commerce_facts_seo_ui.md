# AIBOUX Shop Commerce Facts SEO/UI Commonization

Status: WIP

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Objective

全公開ストアページのSEO構造とUIをさらに共通化する。
価格、税込、在庫、配送、返品、決済未接続、定期購入準備中の購入判断情報を、ページごとの手書き表示だけにせず、共有パーツとして揃える。

## Google Search Central References Checked

- SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Ecommerce URL Structure: `https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites`
- Product structured data: `https://developers.google.com/search/docs/appearance/structured-data/product`
- Merchant listing structured data: `https://developers.google.com/search/docs/appearance/structured-data/merchant-listing`
- Ecommerce structured data: `https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce`
- Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
- Crawlable links: `https://developers.google.com/search/docs/crawling-indexing/links-crawlable`

## Required Changes

- Add shared commerce facts data builder.
- Add shared visible commerce facts component.
- Use the component on TOP, all public subpages, and product detail.
- Keep links crawlable with real `href`.
- Keep link affordance visible.
- Keep product detail single `h1`; do not duplicate product title above the gallery.
- Keep checkout/payment/subscription status honest; no fake success.
- Strengthen Playwright public checks so every public page must expose the shared purchase facts.
- Keep `/s/aiboux/` as tenant storefront and keep `shop.aiboux.com/` as service site.

## Verification

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run astro check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`

## Completion Status Rules

This work may reach `DEPLOYED` as WIP.
Do not write `FINAL_ACCEPTED`.

`FINAL_ACCEPTED` remains prohibited until:

- Remote D1 subscription migration is applied.
- Provider-backed subscription creation is verified.
- Bark final acceptance is delivered and user receipt is confirmed when required.

