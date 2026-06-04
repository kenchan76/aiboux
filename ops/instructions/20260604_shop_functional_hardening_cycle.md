# Shop Functional Hardening Cycle

## Status

WIP_FIXING

## Public URL Bundle

- Execution log URL: `https://mail.aiboux.com/g/l68`
- Screen evidence URL: `https://mail.aiboux.com/g/d68`
- Master URL: `https://mail.aiboux.com/g/m68`

## Accepted Previous Gate

The public admin fixed demo value zero gate is accepted.

The public admin no longer shows:

- `2024/05`
- `山田 太郎`
- `¥2,340,000`
- `245件`
- `2.35%`
- `#10085`
- sample SKUs

## Goal

Harden the Shop tenant functional paths without broad UI redesign.

This cycle covers:

1. Product create/edit/save/public storefront reflection.
2. Settings save and legal/privacy/shipping/returns reflection.
3. Cart add, quantity update, delete.
4. Checkout transition and honest payment-not-configured state.
5. Contact validation and honest submit state.
6. Admin and storefront public URL status checks.
7. Dead link and old route checks.

## Target URLs

- `https://shop.aiboux.com/`
- `https://shop.aiboux.com/s/aiboux/`
- `https://shop.aiboux.com/s/aiboux/admin`
- `https://shop.aiboux.com/s/aiboux/admin/products`
- `https://shop.aiboux.com/s/aiboux/admin/orders`
- `https://shop.aiboux.com/s/aiboux/admin/inventory`
- `https://shop.aiboux.com/s/aiboux/admin/categories`
- `https://shop.aiboux.com/s/aiboux/admin/customers`
- `https://shop.aiboux.com/s/aiboux/admin/content`
- `https://shop.aiboux.com/s/aiboux/admin/analytics`
- `https://shop.aiboux.com/s/aiboux/admin/apps`
- `https://shop.aiboux.com/s/aiboux/admin/design`
- `https://shop.aiboux.com/s/aiboux/admin/settings`
- `https://shop.aiboux.com/s/aiboux/products`
- `https://shop.aiboux.com/s/aiboux/categories`
- `https://shop.aiboux.com/s/aiboux/cart`
- `https://shop.aiboux.com/s/aiboux/checkout`
- `https://shop.aiboux.com/s/aiboux/contact`
- `https://shop.aiboux.com/s/aiboux/legal`
- `https://shop.aiboux.com/s/aiboux/privacy`
- `https://shop.aiboux.com/s/aiboux/shipping`
- `https://shop.aiboux.com/s/aiboux/returns`

## Required Verification

- Public URL status list.
- Product create/edit/list/storefront reflection.
- Settings save/legal page reflection.
- Cart add/quantity/delete.
- Checkout shows payment setup required when payment is not configured.
- Contact required-field validation and honest submit behavior.
- Dead link scan for `href="#"`, `javascript:void`, old `/shop/...`, `shop.aboux.com`, `Coming soon`, `未実装`, `準備中`.
- Playwright must use `BASE_URL=https://shop.aiboux.com`.

## Prohibited

- Broad visual redesign.
- UI degradation.
- `shop.aiboux.com/` as storefront direct URL.
- `shop.aboux.com`.
- DB destructive migration.
- `git reset --hard`.
- `git clean -fd`.
- force push.
- secret output.
- Bark.
- FINAL_ACCEPTED unless every final gate passes.

## Report Rule

Before reporting, publish:

- `https://mail.aiboux.com/g/l68`
- `https://mail.aiboux.com/g/d68`
- `https://mail.aiboux.com/g/m68`

Include HTTP status, content-type, sha256, and public evidence excerpts.
