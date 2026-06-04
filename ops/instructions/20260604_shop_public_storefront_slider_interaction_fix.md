# AIBOUX Shop Public Storefront Slider And Interaction Fix

## Status

`ACTIVE_WIP`

## Fixed URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Target URLs

- Storefront TOP: `https://shop.aiboux.com/s/aiboux/`
- Design editor: `https://shop.aiboux.com/s/aiboux/admin/design`

## User Rejection

The storefront TOP is still rejected because the hero area looks like static images, not a working slider.

## Required Fix

1. Implement a real public hero carousel on `/s/aiboux/`.
2. `next`, `prev`, dot click, loop, and autoplay must update:
   - main slide `data-slide-id`;
   - main image source;
   - main title;
   - prev preview image;
   - next preview image;
   - active dot.
3. Autoplay must advance the slide when enabled.
4. Hover/focus should pause autoplay.
5. Left/right keyboard navigation should work when the carousel has focus.
6. Product card image/name click must open product detail when a real product detail href exists.
7. Product card add-to-cart must update cart state on the public TOP.
8. More links must route to `/s/aiboux/products` or `/s/aiboux/categories`.
9. Add `gate:shop-storefront-interaction`.
10. Publish operation screenshots and logs to `/g/l68` and `/g/d68`.

## Do Not

- Do not report `FINAL_ACCEPTED`.
- Do not use `shop.aiboux.com/` as the tenant storefront.
- Do not use `shop.aboux.com`.
- Do not block this visual/interaction fix on remote D1 subscription migration.
- Do not rely on HTTP 200 or static screenshots alone.
