# Core Delivery Detail Design Fix v3 BLOCKED_DESIGN Log

作成日時: 2026-05-30 23:31 JST

## Status

BLOCKED_DESIGN

このログは `CODE_READY`、`DEPLOYED`、`FINAL_ACCEPTED`、`COMPLETED` ではありません。

## 2026-05-31 追記: 参照画像基準による差し戻し

ユーザー指定の参照画像 `output/reference/core-delivery-detail-final-reference.png` を基準にした結果、v3は引き続き `BLOCKED_DESIGN` です。

理由:
- 参照画像を基準にしていない。
- 横長summary strip方向へ寄っており、参照画像の上段3カード構造と違う。
- ユーザー実画面確認で不合格。
- 寸法検査やpublic style checkは、参照画像との構造一致を保証していない。

## 2026-05-30 追記: v4差し戻し

ユーザー実画面確認で、v3はデザイン不合格として差し戻されました。

理由:
- public style checkやPlaywright寸法検査はPASSしていたが、実画面のデザイン合格を意味していなかった。
- 右上アクションがまだ切れ気味。
- 上段情報が詰まり切っていない。
- 明細一覧と固定フッター周辺の圧迫感が残っている。
- Playwrightの寸法検査が甘く、1650px前後の実ブラウザ内幅検査とスクリーンショット差分が不足していた。
- public style check PASS はCSS/JS読込確認であり、デザイン合格ではない。

次の有効ログは `all_log/64_core_delivery_detail_design_v4_visual_test_code_ready_log.md` とします。

## 差し戻し理由

前回の `CODE_READY` は、公開プレビューのCSS/JS読込は復旧していたものの、ユーザー実画面確認でデザイン密度が不十分でした。

主な指摘:
- 上段カードがまだ大きく、情報密度が低い。
- 明細一覧が下に落ちており、1980x1080でも見える明細量が少ない。
- 右上アクションが詰まり、保存ボタンが右端で見切れ気味。
- `単位` ヘッダーや明細列が業務画面として最適化されていない。
- 固定フッターが本文に近く、下部エリアを圧迫している。
- 右下のGlobal AI FABが納品書詳細画面では邪魔になる。

`all_log/62_core_delivery_detail_preview_css_recovery_code_ready_log.md` は `BLOCKED_DESIGN` へ差し戻しました。

## 修正内容

- 上段3カード構造を廃止し、1つの横長コンパクト情報パネル `delivery-detail-summary-panel` に統合しました。
- 基本情報、納品先、配送情報を同一パネル内の3セクションとして表示し、カード高さのばらつきと下余白を削減しました。
- 上段情報エリアを160px以下に圧縮しました。
- 明細一覧カードを上段パネル直下へ移動し、上段パネルとの距離を8px以下にしました。
- 右上アクション群を折り返し可能にし、保存ボタンがviewport右端で切れないようにしました。
- 明細一覧の列幅を再調整し、`単位` ヘッダーの縦割れを禁止しました。
- 明細行のpaddingと行高を圧縮しました。
- 操作列の右端見切れをPlaywright寸法検査で防止しました。
- 固定フッターを64pxへ圧縮し、本文側paddingを確保しました。
- 納品書詳細画面では右下Global AI FABを非表示にしました。
- preview起動時に `--assets ./dist/client` を明示し、CSS/JS assetが公開URLでHTTP 200になることを確認しました。

## Verification

- `npm run check:mojibake`: PASS (`MOJIBAKE_CHECK_OK files=204`)
- `npm run astro check`: PASS (`0 errors`, `28 hints`)
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- local Playwright: PASS
  - `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-delivery-detail-print.spec.ts --reporter=line`
- public Playwright: PASS
  - `PLAYWRIGHT_BASE_URL=https://genres-variations-get-grocery.trycloudflare.com npx playwright test tests/core-preview-style.spec.ts tests/core-delivery-detail-print.spec.ts --reporter=line`
- `npm run gate:code`: PASS (`AIBOUX_GATE_CODE_READY`)

## Public Preview Asset Checks

- Screen URL: `https://genres-variations-get-grocery.trycloudflare.com/core/deliveries`
- `/core/deliveries`: HTTP 200
- `/_astro/global.C7d-4UAs.css`: HTTP 200, `content-type: text/css; charset=utf-8`
- `/_astro/CoreShell.CZBG2CRK.js`: HTTP 200, `content-type: text/javascript; charset=utf-8`
- public style check: PASS
- public delivery detail visual dimensions: PASS

## Playwright Visual Dimension Checks

- header actions right edge: PASS
- save button visible and not clipped: PASS
- summary panel height <= 160px: PASS
- shipping section height <= 150px: PASS
- lines card y <= 430px: PASS
- summary panel to lines gap <= 8px: PASS
- unit header not split: PASS
- document horizontal overflow absent: PASS
- action column visible: PASS
- included tax visible: PASS
- footer does not overlap last line: PASS
- Global AI FAB hidden on delivery detail: PASS

## Evidence

- `output/playwright/core-documents-redesign/delivery-detail-design-v3-1980.png`
- `output/playwright/core-documents-redesign/delivery-detail-design-v3-1366.png`
- `output/playwright/core-documents-redesign/delivery-detail-design-v3-public.png`
- `output/playwright/core-documents-redesign/delivery-print-preview-open-fixed.png`
- `output/playwright/core-documents-redesign/delivery-print-window-fixed.png`
- `output/playwright/core-documents-redesign/delivery-note-download.pdf`
- `output/playwright/core-documents-redesign/delivery-detail-fixed-dom-audit.json`

## 3URL Bundle

- マスター更新プレビューURL: `https://mainly-fighters-cruise-screens.trycloudflare.com/master-update-design-v3-20260530-2331.html`
- 実行ログプレビューURL: `https://mainly-fighters-cruise-screens.trycloudflare.com/delivery-detail-design-v3-code-ready-log-20260530-2331.html`
- 画面プレビューURL: `https://genres-variations-get-grocery.trycloudflare.com/core/deliveries`

## Bark

Bark CODE_READY通知を3URL Bundle作成後に送信しました。

通知本文に含めたURL:
- マスター更新プレビューURL
- 実行ログプレビューURL
- 画面プレビューURL

結果:

```json
{"provider":"bark","secretLogged":false,"ok":true,"delivered":true,"skipped":false,"endpointHost":"api.day.app","mode":"push-json","status":200,"responseCode":200,"responseMessage":"success","responseType":"json","probeAuth":false,"userReceiptConfirmed":false}
```

注記:
- CODE_READY通知として送信済みです。
- `secretLogged=false` です。
- `userReceiptConfirmed=false` のため、FINAL_ACCEPTED / COMPLETED のBark完了ゲートではありません。

## Notes

- This is `CODE_READY`.
- Not `DEPLOYED`.
- Not `FINAL_ACCEPTED`.
- Not `COMPLETED`.
- Production `/g/cdeliv9` はこのCODE_READY証跡ではありません。
- Worker Version IDは未発行です。
- Barkの最終完了ゲートは `userReceiptConfirmed=true` が必要です。
- Grok / Cloudflare AI は今回の主判定に使っていません。
