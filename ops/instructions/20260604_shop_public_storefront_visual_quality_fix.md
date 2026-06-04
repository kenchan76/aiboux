# AIBOUX Shop Public Storefront Visual Quality Fix

Status: `ACTIVE_WIP`

This instruction supersedes the previous placeholder-only visual check for the current work unit.

## Target URLs

- Public tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Design editor: `https://shop.aiboux.com/s/aiboux/admin/design`
- Product detail: `https://shop.aiboux.com/s/aiboux/product/{id}`

## Rejection Summary

The public storefront is still not good enough as a sales TOP page.

Placeholder removal and Playwright HTTP/DOM checks are insufficient.

The next method must verify visual quality, product-image relevance, duplicate-image rate, storefront density, and absence of test product names.

## Required Fix

1. Make product names and product images coherent.
2. Avoid excessive reuse of the same image.
3. Remove public test product names from storefront TOP.
4. Fill recommended products with at least 10 sales-ready cards where possible.
5. Fill ranking and time-sale sections with at least 5 items each.
6. Fill category section with at least 8 image-backed categories.
7. Keep the hero as center main slide plus smaller real side previews.
8. Use a consistent hero theme.
9. Remove large blank space in the TOP page.
10. Align design editor preview and public `/s/aiboux/` storefront.

## Public Storefront Product Rules

Forbidden on `/s/aiboux/`:

- gray placeholders;
- skeleton image blocks;
- repeated generic image for multiple unrelated products;
- image/product mismatch;
- `AIBOUX公開検証商品`;
- `公開検証商品`;
- raw test-only product names;
- product cards without image, price, tax label, rating, review count, category, and CTA.

Allowed data priority:

1. D1/R2 product image if the image exists and is product-relevant.
2. Product-master image if available and product-relevant.
3. Category-matched AIBOUX sales fallback image.
4. If the product cannot be displayed coherently, omit it from public TOP and fill with a curated sales-ready showcase item.

## Visual Density Targets

- `main` max width around 1360px.
- section spacing: 16 to 24px.
- section background: white.
- product card border: thin neutral.
- product grid: 5 columns on desktop.
- product image height: 180 to 210px.
- recommended products: at least 5, target 10.
- ranking: at least 5.
- time sale: at least 5.
- categories: at least 8.

## New Gate

Add:

```json
{
  "scripts": {
    "gate:shop-storefront-visual": "playwright test tests/shop-storefront-visual-public.spec.ts"
  }
}
```

The gate must check:

- public `/s/aiboux/` is HTTP 200;
- hero main/prev/next images exist;
- weak image URLs are absent;
- recommended product cards count is at least 5;
- recommended product image count is at least 5;
- image URL duplication is not excessive;
- public test product names are absent;
- ranking count is at least 5;
- time sale count is at least 5;
- category count is at least 8;
- screenshots at 1980px, 1365px, and mobile are captured.

## Evidence

Update and publish:

- `public/g/m68.md`
- `public/g/l68.md`
- `public/g/d68.md`
- screenshots under `public/g/screens/`

`d68` must include:

- before/after public storefront evidence if available;
- after 1980px screenshot;
- after 1365px screenshot;
- after mobile screenshot;
- design editor after screenshot;
- product detail after screenshot;
- product image duplicate check result;
- placeholder zero result;
- public test product name zero result;
- section counts.

## Non-Final

This is WIP.

Do not report `FINAL_ACCEPTED`.

Remote D1 subscription migration remains a separate blocked item and must not stop this storefront visual quality work.
