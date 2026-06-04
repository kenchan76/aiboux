# Public Storefront Carousel Smoothness And Visual Polish

Status: `PUBLIC_STOREFRONT_CAROUSEL_SMOOTHNESS_AND_VISUAL_POLISH_WIP`

## URLs

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`
- Target storefront: `https://shop.aiboux.com/s/aiboux/`

## Version

- WIP commit: `afb7187`
- Code WIP Worker Version ID: `dcc6bae5-b1e6-4628-af00-5d0fdc5baa92`

## Changes

- Replaced immediate hero state swapping with a transform-based carousel track.
- Added `data-testid="hero-carousel-track"` and `data-current-slide-id` for public verification.
- Added smooth transform transition at 560ms with cubic-bezier easing.
- Added swipe/drag support.
- Kept keyboard ArrowLeft/ArrowRight support.

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro check`: PASS, 0 errors
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `npm run gate:shop-storefront-carousel`: PASS, 2 passed
- `npm run gate:shop-storefront-interaction`: PASS, 2 passed
- `npm run gate:shop-storefront-visual`: PASS, 3 passed

## Screen Evidence

- `/g/screens/shop-hero-before-click-1365.png`
- `/g/screens/shop-hero-during-animation-1365.png`
- `/g/screens/shop-hero-after-next-smooth-1365.png`
- `/g/screens/shop-hero-after-dot-smooth-1365.png`
- `/g/screens/shop-hero-after-autoplay-smooth-1365.png`

## Not Final

This is not `FINAL_ACCEPTED`.
Remote D1 subscription migration remains permission-blocked, and the full Shop sales flow remains WIP.
