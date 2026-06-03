# Service Subdomain Tenant URL Migration Screen Artifact

## Status

DEPLOYED

## Public Screen Evidence

The public Playwright route verification saved 20 screenshots under:

`output/playwright/service-url-routing/`

## Screenshot Set

- `mail-service-1980.png`
- `mail-service-1650.png`
- `mail-service-1440.png`
- `mail-service-1366.png`
- `mail-tenant-1980.png`
- `mail-tenant-1650.png`
- `mail-tenant-1440.png`
- `mail-tenant-1366.png`
- `shop-service-1980.png`
- `shop-service-1650.png`
- `shop-service-1440.png`
- `shop-service-1366.png`
- `shop-storefront-1980.png`
- `shop-storefront-1650.png`
- `shop-storefront-1440.png`
- `shop-storefront-1366.png`
- `shop-admin-1980.png`
- `shop-admin-1650.png`
- `shop-admin-1440.png`
- `shop-admin-1366.png`

## Public Route Assertions

- Each route returned HTTP 200.
- No route contained `Internal Error`.
- CSS/JS asset failures were not observed by Playwright.
- Browser-default unstyled UI was not observed by the stylesheet/font checks.
- Expected title and key screen text were verified for each route.

## Verified Routes

- `https://mail.aiboux.com/`
- `https://mail.aiboux.com/s/aiboux/`
- `https://shop.aiboux.com/`
- `https://shop.aiboux.com/s/aiboux/`
- `https://shop.aiboux.com/s/aiboux/admin`
