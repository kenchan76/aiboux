# Core Delivery Detail Product Name Single Line

## Status

BLOCKED_DESIGN

## 2026-05-31 JST Correction

The prior c75 evidence is rejected for design reasons.

Reason:
- Product name/spec one-line rendering was fixed, but font-weight was not governed.
- Values, product names, and amount values still used bold/semibold/medium weight in places.
- The user explicitly required: only titles and labels may be bold.
- c75 did not include font-weight DOM audit evidence.
- c75 did not include Font Weight Difference in the comparison HTML.

`m75/l75/d75/c75` remain available as rejected evidence only. They must not be treated as completion evidence.

## Instruction

- `ops/instructions/20260531_core_delivery_detail_product_name_single_line_v75.md`

## Prior Evidence Rejected

- `m74/l74/d74/c74` are rejected evidence.

Reason:
- c74 allowed the item table product name/spec cell to render as two lines.
- c74 did not include DOM evidence for `white-space: nowrap`, product-name cell height, row height, or subtitle absence.
- c74 did not include Grok / Cloudflare AI post-Codex review with the same instruction, reference image, actual screenshots, comparison HTML, and DOM audit JSON.

## Fixed

- Changed delivery line product name/spec rendering to one line.
- Removed the second-line product spec subtitle from the product-name cell.
- Added `data-testid="delivery-line-product-name"` and `data-testid="delivery-line-product-cell"` evidence hooks.
- Added `whitespace-nowrap`, `truncate`, and `title` to the product name/spec display.
- Expanded the product name/spec column for 1500px and wider viewports.
- Kept the operation column visible by making the rightmost operation column sticky inside the table scroll area.
- Added product-row DOM checks to `tests/core-delivery-detail-reference.spec.ts`.
- Added product-row verdict handling to `scripts/compare-reference-image.mjs`.
- Created reviewer pack: `output/review-packs/core-delivery-detail-v75/`.

## Product Row DOM Evidence

```json
{
  "productNameSingleLine": true,
  "productNameSecondLineFound": false,
  "productNameCellHeight": 20,
  "lineRowHeight": 33,
  "productNameWhiteSpace": "nowrap"
}
```

## Reference Comparison

```json
{
  "verdict": "PASS",
  "geometryPass": true,
  "textPass": true,
  "productRowPass": true,
  "diffPass": true,
  "diffRatio": 0.1277768738337003,
  "diffThreshold": 0.6,
  "textMismatch": {
    "missingExpectedTexts": [],
    "forbiddenTextsFound": []
  },
  "visualBlockers": []
}
```

## Review Pack

- path: `output/review-packs/core-delivery-detail-v75/`

Files:
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

## Independent Reviews

### Grok

```json
{
  "loadedInstruction": false,
  "loadedReferenceImage": false,
  "loadedActualImage": false,
  "checkedProductNameSingleLine": false,
  "checkedReferenceMatch": false,
  "verdict": "NG",
  "blockers": [
    "Grok review command did not return a response.",
    "The output file was empty before the hung process was terminated.",
    "A non-response is not approval under the user instruction."
  ]
}
```

### Cloudflare AI

```json
{
  "loadedInstruction": false,
  "loadedReferenceImage": false,
  "loadedActualImage": false,
  "checkedProductNameSingleLine": false,
  "checkedReferenceMatch": false,
  "verdict": "BLOCKED_IMAGE_INPUT",
  "blockers": [
    "The available AIBOUX Cloudflare Workers AI integration is text-only via @cf/meta/llama-3.1-8b-instruct-fp8.",
    "No image-capable Cloudflare AI review path was available in the current repo/runtime.",
    "Because the reference and actual images were not loaded by Cloudflare AI, this cannot be treated as PASS."
  ]
}
```

## 4 Required URLs

- マスター: `https://mainly-fighters-cruise-screens.trycloudflare.com/m75.html`
- ログ: `https://mainly-fighters-cruise-screens.trycloudflare.com/l75.html`
- 画面: `https://mainly-fighters-cruise-screens.trycloudflare.com/d75.html`
- 比較: `https://mainly-fighters-cruise-screens.trycloudflare.com/c75.html`

## Verification

- productNameSingleLine: PASS
- productNameSecondLineFound: false
- productNameCellHeight <= 24: PASS
- lineRowHeight <= 44: PASS
- productNameWhiteSpace = nowrap: PASS
- local reference/product-row checks: PASS
- local delivery detail print checks: PASS
- public style check: PASS
- public reference/product-row checks: PASS
- public delivery detail print checks: PASS
- reference comparison: PASS
- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro check`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `npm run gate:code`: PASS

## Bark

### Progress Notification

```json
{
  "provider": "bark",
  "secretLogged": false,
  "ok": true,
  "delivered": true,
  "skipped": false,
  "purpose": "progress",
  "finalGate": false,
  "endpointHost": "api.day.app",
  "mode": "push-json",
  "status": 200,
  "responseCode": 200,
  "responseMessage": "success",
  "responseType": "json",
  "probeAuth": false,
  "userReceiptConfirmed": false
}
```

### Final Acceptance Notification

- required: false
- reason: current status is `BLOCKED_REVIEW`

## Notes

- Not DEPLOYED.
- Not FINAL_ACCEPTED.
- Not COMPLETED.
