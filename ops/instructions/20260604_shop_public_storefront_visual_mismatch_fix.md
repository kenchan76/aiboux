# AIBOUX Shop Public Storefront Visual Mismatch Fix

## Status

ACTIVE_WIP

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Target

- Public tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Store design editor: `https://shop.aiboux.com/s/aiboux/admin/design`
- Product detail: `https://shop.aiboux.com/s/aiboux/product/{id}`

## Problem

The public tenant storefront is still visually incomplete:

- hero imagery does not look like a finished Amazon-style sales storefront;
- hero side previews are too dominant or not clearly real slides;
- recommended products, ranking, time sale, and categories show gray placeholders;
- the public storefront looks like an editor dummy preview instead of a sales site.

## Required Fix

1. Prioritize `/s/aiboux/` public storefront visual repair before remote D1 subscription migration.
2. Remove gray image placeholders from the public storefront.
3. Make hero slider use real AIBOUX sales-oriented imagery with center main slide and smaller side previews.
4. Render recommended products, ranking, time sale, and categories with real image assets or AIBOUX sales-oriented default images.
5. Product cards must show image, product name, rating, review count, price, tax label, and CTA.
6. Editor preview and public `/s/aiboux/` must use the same visual language and section order.
7. If product DB/R2 image is missing, use category-aware AIBOUX default product imagery, never a gray square.
8. Capture public screenshots and publish evidence to `/g/d68`.
9. Update `/g/l68` and `/g/d68`, WIP deploy, and verify public URLs.

## Do Not

- Do not set `shop.aiboux.com/` as tenant storefront.
- Do not use `shop.aboux.com`.
- Do not report `FINAL_ACCEPTED`.
- Do not stop because remote D1 migration is blocked.
- Do not leave gray placeholders, skeleton image blocks, or empty image cards in public storefront.

## Verification

- `/s/aiboux/`: HTTP 200
- hero main image: visible
- hero prev image: visible
- hero next image: visible
- recommended product images: at least 5
- placeholder/skeleton image blocks: 0
- product price: visible
- rating/review count: visible
- time sale: visible
- category images: visible
- public screenshots at 1365px and 1980px
- `/g/l68`, `/g/d68`, `/g/m68`: HTTP 200 text/markdown

## Status Vocabulary

Use `PUBLIC_STOREFRONT_DESIGN_MISMATCH_FIXED_WIP` only after WIP deploy and public evidence.

Do not use `FINAL_ACCEPTED`.
