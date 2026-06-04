# AIBOUX Shop Store Design Editor WIP Evidence

Status: WIP_STORE_DESIGN_EDITOR_DEPLOYED_NOT_FINAL

Timestamp: 20260604T052958Z

## Scope

This cycle implements the focused AIBOUX Shop store design editor.

Editable page targets are limited to:

- TOP page: `/s/aiboux/`
- Product detail page: `/s/aiboux/product/{id}`

Non-editable pages remain fixed tenant-wide templates:

- products
- categories
- cart
- checkout
- contact
- legal
- privacy
- shipping
- returns
- mypage
- orders
- FAQ
- 404

## Reference

User reference image:

- `https://tadaup.jp/6ivZDgjK.png`

The image was fetched locally and used as the three-column editor direction:

- left pane
- center preview
- right settings pane

## Implementation Summary

- Added typed storefront layout schema.
- Limited saved design config to `global.*`, `pages.top`, and `pages.productDetail`.
- Rebuilt the editor as a three-column screen.
- Added TOP page Amazon-like live preview.
- Added product detail Amazon-like live preview.
- Added common logo settings.
- Reflected layout config in public storefront and product detail.
- Fixed `/s/aiboux/admin/design` route rewrite to `/shop/settings/design`.

## Verification

Commands:

```bash
npm run check:control-chars
npm run check:mojibake
npm run astro check
ESBUILD_WORKER_THREADS=0 npm run build
npm run check:shop-ui-protection
PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npx playwright test tests/shop-functional-public.spec.ts
```

Results:

- control characters: PASS
- mojibake: PASS
- astro check: PASS
- build: PASS
- shop UI protection: PASS in warn mode
- public Playwright: 5 passed

## Public Route Evidence

Worker Version ID:

- `42ebe1ab-db4d-4152-8462-4dc26e97d7f1`

Checked URLs:

- `https://shop.aiboux.com/s/aiboux/admin/design`: HTTP 200
- `https://shop.aiboux.com/s/aiboux/`: HTTP 200
- `https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4580000232621`: HTTP 200

Route headers:

- design editor rewritten path: `/shop/settings/design`
- storefront rewritten path: `/shop/storefront/aiboux`
- product detail rewritten path: `/shop/aiboux/product/shopprod_tenant_001_4580000232621`

## Screenshot Evidence

- `output/playwright/shop-functional/design-editor-1980.png`

## Non-Final Items

- This is not FINAL_ACCEPTED.
- Production DB save from the public design editor was not executed in this cycle.
- Logo upload persistence was not exercised against production storage in this cycle.
- The broader Shop sales tenant final criteria remain open.
