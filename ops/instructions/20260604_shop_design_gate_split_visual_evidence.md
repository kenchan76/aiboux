# AIBOUX Shop Design Gate Split And Visual Evidence

## Status

`ACTIVE_WIP`

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Reason

`npm run gate:design` is currently a legacy Core delivery-detail gate. It still checks an old Core temporary preview URL and must not block AIBOUX Shop store-design-editor WIP implementation.

## Current Target

- Storefront: `https://shop.aiboux.com/s/aiboux/`
- Design editor: `https://shop.aiboux.com/s/aiboux/admin/design`
- Product detail: `https://shop.aiboux.com/s/aiboux/product/{id}`

## Required Change

Create a Shop-specific design gate:

```text
npm run gate:shop-design
```

This gate must validate only the Shop design editor and public storefront URLs.

## Visual Evidence Required

Capture 1980px screenshots:

- editor TOP page
- editor product detail page
- public storefront TOP
- public product detail

Local artifact path:

```text
output/playwright/shop-design-editor/
```

Public artifact path:

```text
public/g/screens/
```

## Acceptance For This WIP Cycle

- `gate:shop-design` exists.
- `gate:shop-design` runs against public `https://shop.aiboux.com`.
- normal Shop admin sidebar is absent from `/s/aiboux/admin/design`.
- only `TOPページ` and `商品詳細ページ` appear as editable page targets.
- category navigation does not vertically wrap at 1980px.
- hero side previews use real images.
- public TOP hero and recommended products are visible.
- public product detail uses image/info/purchase-box layout.
- screenshots are saved under both output and public evidence folders.

## Non-Final

This is still WIP. Do not report `FINAL_ACCEPTED`.
