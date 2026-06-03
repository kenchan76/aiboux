# Core Delivery Detail Typography Rule Fix

## Status

BLOCKED_REVIEW

## Instruction

- `ops/instructions/20260531_core_delivery_detail_typography_rule_v77.md`

## Prior Evidence Rejected

- `m76/l76/d76/c76` are rejected evidence.

Reason:
- c76 corrected font-weight only.
- c76 did not enforce font-size / line-height / color as a design contract.
- c76 did not include Typography Difference in the comparison HTML.
- User visual inspection rejected c76.

## Fixed

- Added `src/components/core/documents/detail/deliveryDetailTypography.ts`.
- Added a delivery detail Typography Contract for page title, section title, label, value, input text, table header, table cell, product name, muted text, buttons, and footer amounts.
- Converted delivery detail labels, values, table headers, product names, memo/history body, and footer amounts to use the Typography Contract.
- Values, product names, dates, addresses, phone numbers, table cells, memo/history text, and footer amount values are normal weight.
- Labels and titles keep the allowed medium/semibold treatment.
- Added Playwright typography contract checks for font-size, line-height, font-weight, color, and product one-line behavior.
- Added `delivery-detail-typography-audit.json`.
- Added Typography Difference to c77 comparison HTML.
- Created reviewer pack: `output/review-packs/core-delivery-detail-v77/`.

## Typography Audit

```json
{
  "verdict": "PASS",
  "rules": {
    "pageTitle": {
      "fontSize": "20px",
      "lineHeight": "28px",
      "fontWeight": ">=600",
      "color": "slate-900"
    },
    "sectionTitle": {
      "fontSize": "15px",
      "lineHeight": "22px",
      "fontWeight": ">=600",
      "color": "slate-900"
    },
    "label": {
      "fontSize": "13px",
      "lineHeight": "20px",
      "fontWeight": "500-600",
      "color": "slate-500"
    },
    "value": {
      "fontSize": "13px",
      "lineHeight": "20px",
      "fontWeight": "<=400",
      "color": [
        "slate-700",
        "blue-600"
      ]
    },
    "tableHeader": {
      "fontSize": "12px",
      "lineHeight": "16px",
      "fontWeight": "500-600",
      "color": "slate-500"
    },
    "productName": {
      "fontSize": "13px",
      "lineHeight": "20px",
      "fontWeight": "<=400",
      "color": "slate-800",
      "whiteSpace": "nowrap"
    },
    "amountValues": {
      "fontWeight": "<=400"
    }
  },
  "violations": []
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
  "typographyPass": true,
  "diffPass": true,
  "diffRatio": 0.12418517915889134,
  "textMismatch": {
    "missingExpectedTexts": [],
    "forbiddenTextsFound": []
  },
  "productRow": {
    "productNameSingleLine": true,
    "productNameSecondLineFound": false,
    "productNameCellHeight": 20,
    "lineRowHeight": 33,
    "productNameWhiteSpace": "nowrap"
  },
  "typography": {
    "verdict": "PASS",
    "fontSize": "PASS",
    "lineHeight": "PASS",
    "fontColor": "PASS",
    "fontWeight": "PASS",
    "violations": []
  },
  "visualBlockers": []
}
```

## Review Pack

- path: `output/review-packs/core-delivery-detail-v77/`

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
- `typography-audit.json`
- `playwright-result.txt`
- `changed-files.txt`
- `grok-review.md`
- `cloudflare-vision-review.json`

## Independent Reviews

### Grok

```json
{
  "loadedInstruction": false,
  "loadedReferenceImage": false,
  "loadedActualImage": false,
  "checkedProductNameSingleLine": false,
  "checkedReferenceMatch": false,
  "checkedTypography": false,
  "typographyVerdict": "NG",
  "verdict": "NG",
  "blockers": [
    "Grok review command did not return usable output.",
    "A non-response or unread image state is not approval under the user instruction."
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
  "checkedTypography": false,
  "typographyVerdict": "NG",
  "verdict": "BLOCKED_IMAGE_INPUT",
  "blockers": [
    "The available AIBOUX Cloudflare Workers AI integration is text-only via @cf/meta/llama-3.1-8b-instruct-fp8.",
    "No image-capable Cloudflare AI review path was available in the current repo/runtime.",
    "Because the reference and actual images were not loaded by Cloudflare AI, this cannot be treated as PASS."
  ]
}
```

## 4 Required URLs

- マスター: `https://mainly-fighters-cruise-screens.trycloudflare.com/m77.html`
- ログ: `https://mainly-fighters-cruise-screens.trycloudflare.com/l77.html`
- 画面: `https://mainly-fighters-cruise-screens.trycloudflare.com/d77.html`
- 比較: `https://mainly-fighters-cruise-screens.trycloudflare.com/c77.html`

## Verification

- typographyAudit: PASS
- fontSize: PASS
- lineHeight: PASS
- fontColor: PASS
- fontWeight: PASS
- productNameSingleLine: PASS
- local reference/product-row/font-weight/typography checks: PASS
- local delivery detail print checks: PASS
- reference comparison: PASS
- `npm run check:mojibake`: PASS
- `npm run check:control-chars`: PASS
- `npm run check:bark-policy`: PASS
- `npm run check:report-policy`: PASS
- `npm run astro check`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- public d77 style/direct detail check: PASS
- `npm run gate:code`: PASS
- short URL HTTP checks: PASS

## Bark

### Progress Notification

```json
{"provider":"bark","secretLogged":false,"ok":true,"delivered":true,"skipped":false,"purpose":"progress","finalGate":false,"endpointHost":"api.day.app","mode":"push-json","status":200,"responseCode":200,"responseMessage":"success","responseType":"json","probeAuth":false,"userReceiptConfirmed":false}
```

## Notes

- Not DEPLOYED
- Not FINAL_ACCEPTED
- Not COMPLETED
- CODE_READY is blocked because Grok/Cloudflare AI did not load the instruction and visual artifacts.
