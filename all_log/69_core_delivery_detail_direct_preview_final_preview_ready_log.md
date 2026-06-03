# Core Delivery Detail Direct Preview v6 Fix

作成日時: 2026-05-31 09:05 JST

## Status

PREVIEW_READY

このログは `DEPLOYED`、`FINAL_ACCEPTED`、`COMPLETED` ではありません。

## Instruction File

- `ops/instructions/20260531_core_delivery_detail_direct_preview_v6_bark_final_only_fix.md`

## Fixed

- m68/l68を差し戻し。
- `src/pages/core/deliveries.astro` からpreview対象の納品書番号をSSR時点で `CoreShell` へ渡すよう修正。
- `CoreShell` がURL queryだけでなく、Astroから渡された `initialPreviewDocumentId` でも初期表示から納品書詳細を開くよう修正。
- URL直開きで `納品書詳細` を表示。
- Playwrightの直開き検査を強化。
- 1980/1650/1440/1366のdirect detail screenshotを保存。
- Bark final-only policyを適用。
- 中間ステータスではBarkを送らない。

## 3 Required URLs

- マスター更新プレビューURL: https://mainly-fighters-cruise-screens.trycloudflare.com/m69.html
- 実行ログプレビューURL: https://mainly-fighters-cruise-screens.trycloudflare.com/l69.html
- 画面プレビューURL: https://incentives-scale-uri-clocks.trycloudflare.com/core/deliveries?preview=delivery-detail&document=N20260530-01

## Verification

- direct detail URL: PASS
- public direct detail URL: PASS
- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run check:bark-policy`: PASS
- `npm run astro check`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- public style check: PASS
- Playwright 1980/1650/1440/1366: PASS
- `npm run gate:design`: PASS
- `npm run gate:preview`: PASS

## Screenshots

- `output/playwright/core-documents-redesign/delivery-detail-direct-v6-1980.png`
- `output/playwright/core-documents-redesign/delivery-detail-direct-v6-1650.png`
- `output/playwright/core-documents-redesign/delivery-detail-direct-v6-1440.png`
- `output/playwright/core-documents-redesign/delivery-detail-direct-v6-1366.png`

## Bark

- notification: not sent
- reason: Bark notifications are final-only by policy.
- secretLogged: false

## Notes

- Not DEPLOYED
- Not FINAL_ACCEPTED
- Not COMPLETED
