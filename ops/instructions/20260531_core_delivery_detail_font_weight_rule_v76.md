# Core Delivery Detail Font Weight Rule v76

## Status

BLOCKED_DESIGN

## Target

- AIBOUX Core
- `/core/deliveries`
- 納品書詳細画面

## Problem

c75 is rejected because titles and labels are not the only bold text. Values, product names, and amount values still use heavier font weight than allowed.

## Goal

Only titles, labels, and table headers may use bold or semibold font weight.

## Allowed Bold

- Page title.
- Card titles.
- Field labels.
- Table headers.
- Footer aggregate labels.

## Must Be Normal Weight

- Document number values.
- Date values.
- Customer and destination values.
- Shipping values.
- Product names and specs.
- Product codes.
- Unit, quantity, unit price, tax, and amount values.
- Memo body.
- History body.
- Footer amount values.

## Required Fixes

- Replace value-side `font-semibold`, `font-bold`, and `font-medium` with `font-normal`.
- Keep product name/spec one line and `font-normal`.
- Add `data-testid` hooks for value, label, title, product, and amount font-weight audit.
- Add Playwright computed `fontWeight` checks.
- Generate `delivery-detail-font-weight-audit.json`.
- Add Font Weight Difference to c76 comparison HTML.
- Create `output/review-packs/core-delivery-detail-v76/`.
- Run Grok and Cloudflare AI reviews with the same instruction and artifacts.

## Required URLs

- `m76.html`
- `l76.html`
- `d76.html`
- `c76.html`

## Bark

Send Bark progress notification after the 4URL bundle is ready.

## CODE_READY Forbidden If

- Any value, product name, or amount value has computed font-weight >= 500.
- Font weight audit is missing.
- Font weight audit has violations.
- Review pack is missing the font-weight rule.
- Grok / Cloudflare AI did not load instruction and images.
