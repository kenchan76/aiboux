# Shop Amazon Quality All Pages Cycle 3

Status: `SHOP_AMAZON_QUALITY_ALL_PAGES_CYCLE3_WIP`

Timestamp: `2026-06-04T11:03:50Z`

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## WIP Evidence

- Commit: `1b681098a868629bf52a2c1ccd58aef65c6b44f4`
- Worker Version ID: `9d20ebd3-bb07-493e-b3e7-56d85d742d10`

## Added Public Destinations

- `/s/aiboux/mypage`
- `/s/aiboux/account`
- `/s/aiboux/orders`
- `/s/aiboux/favorites`
- `/s/aiboux/login`
- `/s/aiboux/register`
- `/s/aiboux/mypage/subscriptions`

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro check`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `npm run gate:shop-public-crawl`: PASS, 4 passed
- `npm run gate:shop-public-crawl` after internal-link gate expansion: PASS, 5 passed
- `npm run gate:shop-sales-quality`: PASS
- `npm run gate:shop-subscriptions`: FAIL as expected with `SUBSCRIPTION_SCHEMA_PENDING`
- Legacy `/shop/collections` and `/shop/collections/new` redirect target normalized to `/s/aiboux/admin/categories`.

## Public URL Status

- `/s/aiboux/mypage`: HTTP 200
- `/s/aiboux/account`: HTTP 200
- `/s/aiboux/orders`: HTTP 200
- `/s/aiboux/favorites`: HTTP 200
- `/s/aiboux/login`: HTTP 200
- `/s/aiboux/register`: HTTP 200
- `/s/aiboux/mypage/subscriptions`: HTTP 200

## Screens

- `https://mail.aiboux.com/g/screens/shop-mypage-1980.png`
- `https://mail.aiboux.com/g/screens/shop-account-1980.png`
- `https://mail.aiboux.com/g/screens/shop-orders-1980.png`
- `https://mail.aiboux.com/g/screens/shop-favorites-1980.png`
- `https://mail.aiboux.com/g/screens/shop-login-1980.png`
- `https://mail.aiboux.com/g/screens/shop-register-1980.png`
- `https://mail.aiboux.com/g/screens/shop-mypage-subscriptions-1980.png`

## Unresolved

- This is not `FINAL_ACCEPTED`.
- Remote D1 subscription migration is not applied.
- Provider-backed recurring billing is not verified.
- Internal storefront links under `/s/aiboux` are now extracted by Playwright and verified to return HTTP 200.
- Legacy collections redirects no longer point at old `/shop/categories`.
