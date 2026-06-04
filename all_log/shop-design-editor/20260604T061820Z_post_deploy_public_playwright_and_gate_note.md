# AIBOUX Shop Design Editor Post Deploy Public Verification

Status: `WIP_DEPLOYED_NOT_FINAL_ACCEPTED`

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Worker

- WIP deploy Worker Version ID: `6da8ad44-6180-42a4-9957-7ff4e9297235`
- WIP commit: `2c5c5eeaac2aeffc65224ab41bcc3dd8613dc450`

## Public Design Editor Route

- URL: `https://shop.aiboux.com/s/aiboux/admin/design?verify=20260604T061436Z`
- HTTP status: `200`
- `x-aiboux-rewritten-path`: `/shop/settings/design`
- `x-aiboux-worker-version`: `6da8ad44-6180-42a4-9957-7ff4e9297235`
- Cache policy: `no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0`

## Public Playwright

Command:

```bash
PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npx playwright test tests/shop-functional-public.spec.ts --reporter=line
```

Result:

```text
6 passed
```

Covered:

- all target public URLs return usable HTML
- storefront cart, checkout, and contact behave honestly
- legal pages render configured or generated policy text
- store design editor exposes only top and product detail page editing
- store design editor saves top hero changes and restores original layout
- published product add-to-cart works when published products exist

## Persistence Evidence

The public design editor save test changed the TOP hero title to a temporary marker, confirmed the marker was saved through `POST /shop/api/storefront/layout`, verified the public storefront rendered it, then restored the original layout in `finally`.

Restore check:

- `GET /shop/api/storefront/layout?tenant=aiboux`
- restored title: `雪花セレクトを、わかりやすく。`

## Design Gate Note

`npm run gate:design -- --help` was executed as a smoke check.

Result:

```text
AIBOUX_DESIGN_GATE_BLOCKED failures=5
```

Reason:

- the current `gate:design` script is still configured for an older Core delivery-detail preview URL;
- it tries to fetch a stale `trycloudflare.com/core/deliveries` preview and fails before checking this Shop design editor;
- this is logged as a gate-target mismatch, not as evidence that the public Shop design editor failed.

Next required improvement:

- split `gate:design` by product area or add a Shop-specific design editor gate that checks `https://shop.aiboux.com/s/aiboux/admin/design`.

## Final Status

This is WIP public evidence only.

Do not report `FINAL_ACCEPTED`.
