# AIBOUX Shop 5H Sales Quality Sprint Cycle 2 Polish

## Status

ACTIVE_WIP

## Source URLs

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Current User Rejection

The previous cycle stopped after gates and did not continue improving the public storefront. The user requires the work to continue as a 5-hour sales quality sprint, not as a short gate-only pass.

## Scope For This Cycle

Improve the parts still visibly weak in public screenshots:

- Product detail page
- Product image/name consistency
- Product thumbnail gallery
- Purchase box sales density
- Related products image consistency
- Checkout shared template
- Contact shared template
- Legal/privacy/shipping/returns shared templates
- Existing gates must be strengthened so thin pages cannot pass as final quality

## Fixed URL Rules

- `https://shop.aiboux.com/` is the Shop service site.
- `https://shop.aiboux.com/s/aiboux/` is the tenant storefront.
- `https://shop.aiboux.com/s/aiboux/admin` is the tenant admin.
- `https://shop.aiboux.com/s/aiboux/admin/design` is the design editor.
- Do not use `shop.aboux.com`.

## Required Implementation

1. Remove public test product names from the product detail UI.
2. Replace numbered thumbnails with image thumbnails.
3. Use category-matched fallback images when DB/R2 product images are weak or mismatched.
4. Make the product detail purchase box feel like a real sales page with delivery, stock, quantity, returns, and subscription status.
5. Make related products use coherent names/images and avoid repeated PC-operation photos.
6. Replace thin legal `<pre>` pages with structured shared templates.
7. Expand contact page with optional order number, guidance, and honest non-delivery status.
8. Expand checkout page with customer/shipping/payment sections and honest payment blocker.
9. Update Playwright gates to check these improvements.
10. Continue WIP deploy and public `/g/*` evidence update before reporting.

## Blocked Lane

Remote D1 subscription migration may remain `D1_PERMISSION_BLOCKED_NOT_FINAL`. That blocker must not stop this UI and shared-template polish cycle.

## Reporting

Do not report `FINAL_ACCEPTED`. Use WIP status only.
