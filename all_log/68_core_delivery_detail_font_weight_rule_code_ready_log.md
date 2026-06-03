# Core Delivery Detail Font Weight Rule Fix

## Status

BLOCKED_DESIGN

## Instruction

- `ops/instructions/20260531_core_delivery_detail_font_weight_rule_v76.md`

## Prior Evidence Rejected

- `m75/l75/d75/c75` are rejected evidence.
- `m76/l76/d76/c76` are rejected evidence.

Reason:
- c75 fixed product name/spec one-line rendering, but did not enforce the user rule that only titles and labels may be bold.
- c75 did not include computed font-weight audit evidence.
- c75 did not include Font Weight Difference in the comparison HTML.
- c76 fixed font-weight only and did not enforce font-size, line-height, or font color.
- c76 did not include a Typography Contract or Typography Difference in the comparison HTML.
- User visual inspection rejected c76.

## Fixed

- Removed bold/semibold weight from detail values.
- Changed product name/spec to one-line normal weight.
- Changed line amount values to normal weight.
- Changed footer amount values, including total amount, to normal weight.
- Kept section titles bold.
- Kept field labels and footer aggregate labels medium weight.
- Added `data-testid` hooks for section titles, labels, values, product names, and amount values.
- Added Playwright computed `fontWeight` checks.
- Generated `delivery-detail-font-weight-audit.json`.
- Added Font Weight Difference to c76 comparison HTML.
- Created reviewer pack: `output/review-packs/core-delivery-detail-v76/`.

## Font Weight Audit

```json
{
  "verdict": "PASS",
  "rules": {
    "titlesCanBeBold": true,
    "labelsCanBeBold": true,
    "valuesMustBeNormal": true,
    "productNamesMustBeNormal": true,
    "amountValuesMustBeNormal": true
  },
  "violations": []
}
```

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
  "fontWeightPass": true,
  "diffPass": true,
  "diffRatio": 0.1270332385886947,
  "diffThreshold": 0.6,
  "textMismatch": {
    "missingExpectedTexts": [],
    "forbiddenTextsFound": []
  },
  "visualBlockers": []
}
```

## Review Pack

- path: `output/review-packs/core-delivery-detail-v76/`

Files:
- `instruction.md`
- `reference.png`
- `actual-1672.png`
- `actual-1980.png`
- `actual-1650.png`
- `actual-1366.png`
- `compare.html`
- `dom-audit.json`
- `font-weight-audit.json`
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
  "checkedFontWeightRule": false,
  "fontWeightVerdict": "NG",
  "verdict": "NG",
  "blockers": [
    "Grok review command did not return output.",
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
  "checkedFontWeightRule": false,
  "fontWeightVerdict": "NG",
  "verdict": "BLOCKED_IMAGE_INPUT",
  "blockers": [
    "The available AIBOUX Cloudflare Workers AI integration is text-only via @cf/meta/llama-3.1-8b-instruct-fp8.",
    "No image-capable Cloudflare AI review path was available in the current repo/runtime.",
    "Because the reference and actual images were not loaded by Cloudflare AI, this cannot be treated as PASS."
  ]
}
```

## 4 Required URLs

- マスター: `https://mainly-fighters-cruise-screens.trycloudflare.com/m76.html`
- ログ: `https://mainly-fighters-cruise-screens.trycloudflare.com/l76.html`
- 画面: `https://mainly-fighters-cruise-screens.trycloudflare.com/d76.html`
- 比較: `https://mainly-fighters-cruise-screens.trycloudflare.com/c76.html`

## Verification

- fontWeightAudit: PASS
- productNameSingleLine: PASS
- productNameWeightNormal: PASS
- valuesWeightNormal: PASS
- amountValuesWeightNormal: PASS
- local reference/product-row/font-weight checks: PASS
- local delivery detail print checks: PASS
- public style check: PASS
- public reference/product-row/font-weight checks: PASS
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
