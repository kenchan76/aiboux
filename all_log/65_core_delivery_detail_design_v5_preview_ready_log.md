# Core Delivery Detail Design Fix v5 Preview Ready Log

作成日時: 2026-05-31 06:51 JST

## Status

BLOCKED_PREVIEW

このログは `DEPLOYED`、`FINAL_ACCEPTED`、`COMPLETED` ではありません。

## Instruction File

- `ops/instructions/20260531_codex_execution_contract_and_delivery_v5.md`
- `ops/instructions/20260531_core_delivery_detail_design_v5.md`

## 目的

納品書詳細画面で、右端アクション、summary strip、明細一覧、固定フッターの見た目破綻を修正し、公開プレビューでユーザーが確認できる状態にする。

## 修正内容

- AIBOUXのCodex運用をMarkdown指示書必須化へ変更。
- `ops/instructions/current.md` を作成し、作業状態をMarkdownで管理。
- `aiboux-instruction-compliance` skillを追加。
- `check:control-chars` を追加し、NUL/制御文字混入を検査。
- `gate:code`、`gate:preview`、`gate:deploy`、`gate:final` を分離。
- 納品書詳細画面の右上アクションを圧縮し、保存ボタンが右端で切れないよう修正。
- 上段情報を3カードから横長summary stripへ整理。
- summary stripを150px以下へ圧縮。
- 1440px viewportを追加し、実ブラウザ幅に近い検査を追加。
- 明細一覧を上へ寄せ、行表示量を増やした。
- 右下FABは納品書詳細画面で非表示。
- フッターは本文に被らないよう検査。

## Invalidated Preview URLs

- マスター更新プレビューURL: https://mainly-fighters-cruise-screens.trycloudflare.com/m65.html
- 実行ログプレビューURL: https://mainly-fighters-cruise-screens.trycloudflare.com/l65.html
- 画面プレビューURL: https://mainly-fighters-cruise-screens.trycloudflare.com/d65.html

直接画面URL:

- https://incentives-scale-uri-clocks.trycloudflare.com/core/deliveries

## BLOCKED_PREVIEW reason

- The screen preview did not directly open `納品書詳細`.
- The direct screen URL opened the delivery list and required a row click.
- A delivery list URL is not valid evidence for the delivery detail design fix.
- This log is invalid as PREVIEW_READY evidence.

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro check`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- local Playwright: PASS
- public Playwright style check: PASS
- public delivery detail Playwright: PASS
- `npm run gate:code`: PASS
- `npm run gate:preview`: PASS

## Visual Evidence

- `output/playwright/core-documents-redesign/delivery-detail-design-v5-1980.png`
- `output/playwright/core-documents-redesign/delivery-detail-design-v5-1650.png`
- `output/playwright/core-documents-redesign/delivery-detail-design-v5-1440.png`
- `output/playwright/core-documents-redesign/delivery-detail-design-v5-1366.png`
- `output/playwright/core-documents-redesign/delivery-detail-design-v5-public.png`

## Public Preview Audit

- stylesheets: 6
- raw browser default UI: not detected
- horizontal overflow: 0
- summary height at 1650px: 146
- lines y at 1650px: 274
- action group right edge: within viewport
- save button right edge: within viewport

## Bark

- status: sent
- title: `AIBOUX CODE_READY`
- body includes all 3 URLs: true
- secretLogged: false
- result: `ok=true, delivered=true, skipped=false, endpointHost=api.day.app, mode=push-json, userReceiptConfirmed=false`

注記: これはCODE_READY通知です。`userReceiptConfirmed=false` のため、FINAL_ACCEPTED / COMPLETED のBark Gate達成ではありません。

## Notes

- This is `BLOCKED_PREVIEW`.
- This is not `DEPLOYED`.
- This is not `FINAL_ACCEPTED`.
- This is not `COMPLETED`.
- Production `/g/cdeliv9` is not used as this evidence URL.
