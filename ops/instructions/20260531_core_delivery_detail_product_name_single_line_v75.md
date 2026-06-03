# Core Delivery Detail Product Name Single Line v75

## Status

BLOCKED_DESIGN

## Target

- AIBOUX Core
- `/core/deliveries`
- Delivery detail preview: `/core/deliveries?preview=delivery-detail&document=N20260530-01`

## Rejected Evidence

- `m74/l74/d74/c74` are rejected evidence.
- c74 did not check that product name/spec is rendered in a single line.
- c74 did not include Grok / Cloudflare AI post-Codex review using the same instruction and visual artifacts.

## Required Fixes

- Render delivery line product name and spec in one line.
- Do not render spec as a second subtitle line.
- Use `data-testid="delivery-line-product-name"` on the one-line product text.
- Use `white-space: nowrap`.
- Allow truncation only on the single combined line and provide `title` with full text.
- Expand product-name column for 1672/1980/1650 viewports.
- Keep right-top More hidden.
- Keep right-top delete hidden.
- Keep `2026/05/29`; forbid `05/29/2026`.

## Required Product Row Evidence

The comparison report must include:

```json
{
  "productNameSingleLine": true,
  "productNameSecondLineFound": false,
  "productNameCellHeight": 24,
  "lineRowHeight": 44,
  "productNameWhiteSpace": "nowrap"
}
```

## Required Reviewer Pack

Create:

`output/review-packs/core-delivery-detail-v75/`

Required files:

- `instruction.md`
- `reference.png`
- `actual-1672.png`
- `actual-1980.png`
- `actual-1650.png`
- `actual-1366.png`
- `compare.html`
- `dom-audit.json`
- `playwright-result.txt`
- `changed-files.txt`
- `log.md`

## Required Independent Reviews

Run Grok and Cloudflare AI against the same reviewer pack.

Required reviewer response fields:

- `loadedInstruction`
- `loadedReferenceImage`
- `loadedActualImage`
- `checkedProductNameSingleLine`
- `checkedReferenceMatch`
- `verdict`
- `blockers`

If the instruction or images are not loaded, the review verdict is not a PASS.

## CODE_READY Conditions

- Playwright product-name one-line DOM check PASS.
- Reference comparison and product row comparison PASS.
- Grok review PASS with loaded instruction and images.
- Cloudflare AI review PASS with loaded instruction and images.
- 4URL Bundle exists.
- Bark progress notification sent.

## BLOCKED_REVIEW Conditions

- Grok cannot load instruction/reference/actual images.
- Cloudflare AI cannot load instruction/reference/actual images.
- Either reviewer is unavailable, times out, or returns no explicit PASS.

## Required URLs

- `m75.html`: master update preview.
- `l75.html`: execution log preview.
- `d75.html`: direct screen preview.
- `c75.html`: comparison HTML.

## Bark

Send progress Bark when the work unit stops.

Do not claim FINAL_ACCEPTED or COMPLETED.
