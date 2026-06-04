# Dirty Tree Cleanup After Subscription Blocker

Status: `SHOP_5H_SALES_QUALITY_SPRINT_WIP`

## Reason

The previous public subscription gate intentionally exposed the remote D1 subscription-schema blocker:

- `npm run gate:shop-subscriptions`: FAIL
- API: `/shop/api/subscription-plans?tenant=aiboux&productId=...`
- HTTP status: `503`
- Classification: `D1_PERMISSION_BLOCKED_NOT_FINAL`

The generated Playwright failure artifacts were not left as loose `test-results` files.

## Preserved Evidence

Subscription blocker artifacts were copied to:

- `all_log/shop-5h-sprint/subscription-blocker-20260604T102500Z/error-context.md`
- `all_log/shop-5h-sprint/subscription-blocker-20260604T102500Z/test-failed-1.png`
- `all_log/shop-5h-sprint/subscription-blocker-20260604T102500Z/trace.zip`
- `all_log/shop-5h-sprint/subscription-blocker-20260604T102500Z/video.webm`

## Cleanup

- Removed untracked `test-results/shop-subscriptions-public--c7da3-se-honest-subscription-flow/` after preserving evidence.
- Removed local duplicate `output/playwright/shop-*` sprint screenshot directories after screenshots were already copied to `public/g/screens/`.
- Did not run `git clean`.
- Did not run `git reset`.
- Did not use force push.
- Did not delete committed public evidence.
