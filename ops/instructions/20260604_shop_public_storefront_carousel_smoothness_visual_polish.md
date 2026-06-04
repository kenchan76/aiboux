# Shop Public Storefront Carousel Smoothness And Visual Polish

Status: `ACTIVE_WIP`

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Target URLs

- Storefront: `https://shop.aiboux.com/s/aiboux/`
- Design editor: `https://shop.aiboux.com/s/aiboux/admin/design`

## User Rejection

The public storefront hero is functional but not smooth. It still reads as a static image swap rather than a polished storefront carousel.

## Required Changes

1. Convert the public TOP hero from state replacement to a real sliding carousel.
2. Use a carousel track with transform transition.
3. Use `translate3d` during next, previous, dot click, and autoplay transitions.
4. Keep duration between 480ms and 650ms.
5. Use non-linear easing such as `cubic-bezier(0.22, 1, 0.36, 1)`.
6. Keep side previews synchronized with the main slide.
7. Pause autoplay on hover/focus.
8. Support swipe/drag.
9. Support keyboard ArrowLeft/ArrowRight.
10. Keep product cards and section density sale-ready.
11. Preserve TOP/product detail design editor scope only.
12. Do not touch `shop.aiboux.com/` service-site routing.

## Required Data Attributes

- `data-testid="hero-carousel"`
- `data-current-slide-id`
- `data-testid="hero-carousel-track"`
- `data-testid="hero-slide-prev"`
- `data-testid="hero-slide-main"`
- `data-testid="hero-slide-next"`
- `data-testid="hero-prev-button"`
- `data-testid="hero-next-button"`
- `data-testid="hero-dot-0"`
- `data-testid="hero-dot-1"`
- `data-testid="hero-dot-2"`

## Required Gates

- `npm run gate:shop-storefront-carousel`
- `npm run gate:shop-storefront-interaction`
- `npm run gate:shop-storefront-visual`

## Evidence

Publish to `/g/d68`:

- `/g/screens/shop-hero-before-click-1365.png`
- `/g/screens/shop-hero-during-animation-1365.png`
- `/g/screens/shop-hero-after-next-smooth-1365.png`
- `/g/screens/shop-hero-after-dot-smooth-1365.png`
- `/g/screens/shop-hero-after-autoplay-smooth-1365.png`

## Completion Status

This is WIP only. Do not report `FINAL_ACCEPTED`.
