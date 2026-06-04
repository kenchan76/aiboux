# AIBOUX Shop Design Editor Fullscreen Repair Evidence

Status: `WIP_DESIGN_EDITOR_FULLSCREEN_REPAIR_DEPLOYED_NOT_FINAL`

## Public URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Rejection Addressed

The previous `/s/aiboux/admin/design` screen was rejected because the store design editor was embedded inside the normal Shop admin sidebar/header, which compressed the preview and broke the Amazon-style navigation/hero layout.

## Implemented Repair

- `/s/aiboux/admin/design` now renders a dedicated fullscreen editor document.
- The normal Shop admin sidebar is not rendered on the design editor route.
- The normal Shop admin header is not rendered on the design editor route.
- A dedicated editor top bar is rendered with page switching, undo/redo, public-site link, viewport controls, and save.
- The editor uses a three-column layout: left editor pane, central live preview, right setting pane.
- At 1980px viewport width, Playwright verifies the central preview is at least 1100px wide.
- The category navigation uses nowrap horizontal items so category labels do not vertically fold.
- Hero side previews use actual slide images from `/shop/design/hero-*.svg`, not gray placeholders.
- The editor continues to expose only `TOPページ` and `商品詳細ページ` as editable pages.
- Product list, category, cart, checkout, contact, legal, privacy, shipping, returns, mypage, orders, FAQ, and 404 remain outside page-level editing.

## Changed Files In This Repair

- `src/pages/shop/settings/design.astro`
- `src/components/shop/StorefrontDesignBuilder.tsx`
- `src/lib/shopStorefrontLayout.ts`
- `tests/shop-functional-public.spec.ts`
- `public/shop/design/hero-lifestyle.svg`
- `public/shop/design/hero-daily.svg`
- `public/shop/design/hero-season.svg`
- `ops/instructions/20260604_shop_store_design_editor_top_product_only.md`
- `ops/instructions/current.md`
- `public/g/l68.md`
- `public/g/d68.md`
- `public/g/m68.md`

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npx playwright test tests/shop-functional-public.spec.ts`: PASS, 5 passed
- Public design editor URL under test: `https://shop.aiboux.com/s/aiboux/admin/design`
- Screenshot: `output/playwright/shop-functional/design-editor-1980.png`

## Visual Assertions Covered By Playwright

- The normal admin sidebar texts are not present in the design editor view.
- The dedicated editor shell, left pane, preview pane, and right pane are visible.
- The preview pane width is at least 1100px on a 1980px viewport.
- The store preview frame width is at least 1100px on a 1980px viewport.
- Left pane width is within the intended editor range.
- Right pane width is within the intended setting-panel range.
- Navigation labels do not vertically wrap.
- Two side hero preview images are visible and use `/shop/design/hero-*.svg`.
- `TOPページ` and `商品詳細ページ` are present.
- Non-editable pages such as cart and checkout are not exposed as editable page targets.

## Current Status

This is WIP repair evidence.
This is not `FINAL_ACCEPTED`.

Remaining broader Shop work still includes production persistence checks for design settings, logo upload persistence, product/settings/cart/checkout/contact hardening, and final strict acceptance gates.
