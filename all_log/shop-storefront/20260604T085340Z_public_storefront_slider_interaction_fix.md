# Public Storefront Slider And Interaction Fix

Status: `PUBLIC_STOREFRONT_SLIDER_AND_INTERACTION_FIX_WIP`

## URLs

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`
- Target storefront: `https://shop.aiboux.com/s/aiboux/`

## Version

- WIP commit: `53c1fee`
- Code WIP Worker Version ID: `4c77ab87-dffa-46b3-a764-10545da399e9`

## Changes

- Implemented public TOP hero carousel state updates for next, previous, dot click, loop, and autoplay.
- Updated side preview cards when the main slide changes.
- Raised hero arrow buttons above the hero text layer so they can be clicked.
- Added a real recommended-products `もっと見る` link.
- Verified product detail navigation and local cart add behavior.

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro check`: PASS, 0 errors
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `npm run gate:shop-storefront-visual`: PASS, 3 passed
- `npm run gate:shop-storefront-interaction`: PASS, 2 passed

## Screen Evidence

- `/g/screens/shop-hero-initial-1365.png`
- `/g/screens/shop-hero-after-next-1365.png`
- `/g/screens/shop-hero-after-dot-1365.png`
- `/g/screens/shop-hero-after-autoplay-1365.png`
- `/g/screens/shop-product-card-click-result.png`
- `/g/screens/shop-cart-add-result.png`

## Not Final

This is not `FINAL_ACCEPTED`.
Remote D1 subscription migration remains permission-blocked, and the full Shop sales flow remains WIP.
