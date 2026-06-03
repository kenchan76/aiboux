# Core Delivery Detail Reference Image Match

## Status

BLOCKED_DESIGN

## 2026-05-31 JST Correction

The previous CODE_READY status for m72/l72/d72/c72 is withdrawn.

Reasons:
- c72 only compared structure presence and did not judge visual geometry against the reference image.
- Actual top cards were too short compared with the reference image.
- Actual lines card started too high compared with the reference image.
- Memo/history and fixed footer visual positions did not match the reference image closely enough.
- User visual inspection rejected c72.

m72/l72/d72/c72 are blocked evidence, not completion evidence.

## Reference Image

- source URL: `https://tadaup.jp/5kC9aM31.png`
- saved path: `output/reference/core-delivery-detail/reference.png`
- metadata path: `output/reference/core-delivery-detail/reference.meta.json`
- width: `1672`
- height: `941`
- sha256: `600494072f69a9f0ad9ff03f672573357d730a2770d1e92ab285b4b00a3243e1`

## Prior Status Correction

Previous v3/v4 and CSS-recovery CODE_READY logs are not final design acceptance.

Reasons:
- they did not use the provided reference image as the implementation baseline;
- public style check PASS only proved CSS/JS loading, not design conformity;
- dimensional checks did not prove reference-image structure match;
- user visual inspection rejected the design.

The current evidence is based on the saved reference image, direct detail URL, reference-structure Playwright checks, screenshots, and comparison HTML.

## Fixed

- Loaded and persisted the reference image before implementation verification.
- Reconfirmed the delivery detail screen uses top three independent cards: 基本情報, 納品先, 配送情報.
- Adjusted the top three cards to use a closer shared height impression matching the reference image.
- Reduced delivery line vertical padding so the memo/history cards remain visible above the fixed footer.
- Confirmed the horizontal summary strip is absent.
- Confirmed 明細一覧 remains an independent card.
- Confirmed 備考・メモ and 履歴 remain two bottom cards.
- Confirmed the fixed footer remains visible and does not replace the bottom cards.
- Confirmed top actions match the reference structure: B2 CSV, 商品CSV, メール送信, FAX送信, コピー, 印刷, 保存.
- Confirmed 削除 is not an always-visible top action.
- Confirmed Global AI FAB is hidden on the delivery detail screen.

## Evidence

- reference image: `output/reference/core-delivery-detail/reference.png`
- reference metadata: `output/reference/core-delivery-detail/reference.meta.json`
- screenshot 1672: `output/playwright/core-documents-redesign/delivery-detail-reference-match-1672.png`
- screenshot 1980: `output/playwright/core-documents-redesign/delivery-detail-reference-match-1980.png`
- screenshot 1650: `output/playwright/core-documents-redesign/delivery-detail-reference-match-1650.png`
- screenshot 1366: `output/playwright/core-documents-redesign/delivery-detail-reference-match-1366.png`
- comparison HTML: `output/playwright/core-documents-redesign/delivery-detail-reference-compare.html`

## 4 Required URLs

- Master update preview URL: `https://mainly-fighters-cruise-screens.trycloudflare.com/m72.html`
- Execution log preview URL: `https://mainly-fighters-cruise-screens.trycloudflare.com/l72.html`
- Screen preview URL: `https://mainly-fighters-cruise-screens.trycloudflare.com/d72.html`
- Reference comparison HTML URL: `https://mainly-fighters-cruise-screens.trycloudflare.com/c72.html`

## Verification

- reference image loaded: PASS
- reference metadata written: PASS
- local reference structure Playwright: PASS
- public style check: PASS
- public reference structure Playwright: PASS
- delivery detail print test: PASS
- 4URL HTTP 200 / charset=utf-8 / no-store: PASS
- screen short URL includes direct detail evidence: PASS
- check:control-chars: PASS
- check:mojibake: PASS
- check:bark-policy: PASS
- check:report-policy: PASS
- astro check: PASS
- build: PASS
- gate:code: PASS

## Bark

### Progress Notification

- purpose: progress
- sent: true
- delivered: true
- skipped: false
- secretLogged: false
- userReceiptConfirmed: false
- finalGate: false
- result: `{"provider":"bark","secretLogged":false,"ok":true,"delivered":true,"skipped":false,"purpose":"progress","finalGate":false,"endpointHost":"api.day.app","mode":"push-json","status":200,"responseCode":200,"responseMessage":"success","responseType":"json","probeAuth":false,"userReceiptConfirmed":false}`

### Final Acceptance Notification

- required: false
- reason: current status is CODE_READY

## Notes

- Not DEPLOYED.
- Not FINAL_ACCEPTED.
- Not COMPLETED.
