# AIBOUX Shop Design Gate Split Visual Evidence

Status: `WIP_DEPLOYED_NOT_FINAL_ACCEPTED`

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Worker

- Public Worker Version ID: `b6b84074-9619-40b0-8ed5-bea1b5019251`
- Checked route: `https://shop.aiboux.com/s/aiboux/admin/design?versionCheck=20260604T0650`
- `x-aiboux-rewritten-path`: `/shop/settings/design`

## Gate Split

Added Shop-specific design gate:

```bash
npm run gate:shop-design
```

This gate runs:

```bash
PLAYWRIGHT_BASE_URL=https://shop.aiboux.com playwright test tests/shop-design-editor-public.spec.ts
```

Legacy `npm run gate:design` remains as `gate:design:legacy` and is not used as the Shop design-editor WIP blocker.

## Result

```text
gate:shop-design: PASS, 4 passed
```

Initial run caught a real issue:

- public product detail center information column was only `412px`;
- the public product detail container was widened from `max-w-6xl` to `max-w-screen-xl`;
- rerun passed.

## Screenshots

Local:

- `output/playwright/shop-design-editor/shop-design-editor-top-1980.png`
- `output/playwright/shop-design-editor/shop-design-editor-product-1980.png`
- `output/playwright/shop-design-editor/shop-storefront-top-1980.png`
- `output/playwright/shop-design-editor/shop-product-detail-1980.png`

Public:

- `https://mail.aiboux.com/g/screens/shop-design-editor-top-1980.png`
- `https://mail.aiboux.com/g/screens/shop-design-editor-product-1980.png`
- `https://mail.aiboux.com/g/screens/shop-storefront-top-1980.png`
- `https://mail.aiboux.com/g/screens/shop-product-detail-1980.png`

## Visual Checks

- normal Shop admin sidebar absent from design editor: PASS
- dedicated design editor top bar: PASS
- only TOP page and product detail page are editable: PASS
- category navigation does not vertically wrap at 1980px: PASS
- hero side previews use real images: PASS
- public TOP hero and recommended products visible: PASS
- public product detail gallery/info/purchase-box columns visible: PASS

## Non-final

This is WIP evidence only. Do not report `FINAL_ACCEPTED`.
