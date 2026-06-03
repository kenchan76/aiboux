# Core Delivery Detail Design Fix v4 Visual Test BLOCKED_DESIGN Log

作成日時: 2026-05-31 00:02 JST

## Status

BLOCKED_DESIGN

このログは `CODE_READY`、`DEPLOYED`、`FINAL_ACCEPTED`、`COMPLETED` ではありません。

## 2026-05-31 追記: 参照画像基準による差し戻し

ユーザー指定の参照画像 `output/reference/core-delivery-detail-final-reference.png` を基準にした結果、v4は `BLOCKED_DESIGN` へ差し戻します。

理由:
- 参照画像を基準にしていない。
- 上段3カードを廃止し、1つのsummary stripへ統合していた。
- 参照画像の「基本情報 / 納品先 / 配送情報」独立カード構造と違う。
- public style checkやPlaywright寸法検査はPASSしていたが、参照画像準拠を保証していなかった。
- ユーザー実画面確認で不合格。

## v3差し戻し

`all_log/63_core_delivery_detail_design_v3_code_ready_log.md` は `BLOCKED_DESIGN` へ差し戻しました。

理由:
- ユーザー実画面でv3のデザインが不合格だった。
- public style checkや従来の寸法検査はPASSしていたが、デザイン合格を意味していなかった。
- 右上アクション、上段情報密度、明細表示量、固定フッター周辺の総合レイアウトがまだ不十分だった。
- 1650px前後の実ブラウザ内幅検査とスクリーンショット差分が不足していた。

## v4修正内容

- 納品書詳細画面を4領域へ再設計しました。
  - fixed-height toolbar
  - compact summary strip
  - flexible lines area
  - fixed amount footer
- 上段3カード構造を廃止し、1つの `delivery-detail-summary-strip` に統合しました。
- 基本情報、納品先、配送情報を同一枠内の3セクションに分け、カード単位の間延びをなくしました。
- 右上アクション群を圧縮し、低頻度の削除操作をMoreメニューへ移しました。
- 保存ボタンとアクション群がviewport右端で切れないようにしました。
- 明細一覧をsummary strip直下へ寄せ、表示開始位置を上げました。
- 明細列幅を再調整し、商品名列を広げ、単位・入数・数量・税率・操作列を圧縮しました。
- 1980/1650幅で5行以上、1366幅で3行以上の明細が実viewport内に見えるよう検査しました。
- 固定フッターを64pxに圧縮し、本文側paddingを確保しました。
- 納品書詳細画面では右下Global AI FABを非表示にしました。
- Playwright `toHaveScreenshot()` による視覚ベースラインを導入しました。
- Playwright失敗時にTrace Viewerで追跡できるよう、trace、screenshot、videoを保持する設定にしました。

## Public Preview

- 画面プレビューURL: `https://incentives-scale-uri-clocks.trycloudflare.com/core/deliveries`
- `/core/deliveries`: HTTP 200
- `/_astro/global.C4cwdBOz.css`: HTTP 200, `content-type: text/css; charset=utf-8`
- `/_astro/CoreShell.Bh5fYKMG.js`: HTTP 200, `content-type: text/javascript; charset=utf-8`
- `/_astro/client.Dh7gFNIG.js`: HTTP 200, `content-type: text/javascript; charset=utf-8`
- `/_astro/GlobalAIAssistant.CvuP8XaP.js`: HTTP 200, `content-type: text/javascript; charset=utf-8`
- public style check: PASS
- public delivery detail visual/print test: PASS

旧URLはv4の有効証跡ではありません。

無効扱い:
- `https://working-economies-edmonton-kai.trycloudflare.com/core/deliveries`
- `https://genres-variations-get-grocery.trycloudflare.com/core/deliveries`

## Visual Test Results

Playwright viewport:
- `1980x1080`: PASS
- `1650x900`: PASS
- `1366x768`: PASS

主な検査:
- header actions right edge: PASS
- 保存ボタン見切れなし: PASS
- summary strip height: PASS
- lines card y position: PASS
- visible line count: PASS
- unit header no split: PASS
- document horizontal overflow <= 2px: PASS
- operation column visible: PASS
- footer overlap absent: PASS
- Global AI FAB hidden on delivery detail: PASS
- Playwright `toHaveScreenshot()`: PASS

公開プレビュー監査値:
- `stylesheets`: 6
- `documentOverflow`: 0
- `visibleRows`: 5
- `summaryHeight`: 142
- `linesY`: 270
- `actionsRight`: 1630

## DevTools/CSS/Grid/Flex診断

Chrome DevTools相当の診断をPlaywrightから実行しました。

確認:
- summary strip grid: computed
- header actions width/right edge: computed
- lines area position: computed
- footer position/height: computed
- CSS/JS assets: HTTP 200
- document horizontal overflow: 0

結果:
- `output/playwright/core-documents-redesign/delivery-detail-design-v4-devtools-audit.json`

## Verification

- `npm run check:mojibake`: PASS (`MOJIBAKE_CHECK_OK files=205`)
- `npm run astro check`: PASS (`0 errors`, `28 hints`)
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- local Playwright: PASS
  - `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-delivery-detail-print.spec.ts --reporter=line`
- public Playwright: PASS
  - `PLAYWRIGHT_BASE_URL=https://incentives-scale-uri-clocks.trycloudflare.com npx playwright test tests/core-preview-style.spec.ts tests/core-delivery-detail-print.spec.ts --reporter=line`
- `npm run gate:code`: PASS (`AIBOUX_GATE_CODE_READY`)

Grok / Cloudflare AI は今回の主判定に使っていません。

## Evidence

- `output/playwright/core-documents-redesign/delivery-detail-design-v4-1980.png`
- `output/playwright/core-documents-redesign/delivery-detail-design-v4-1650.png`
- `output/playwright/core-documents-redesign/delivery-detail-design-v4-1366.png`
- `output/playwright/core-documents-redesign/delivery-detail-design-v4-public.png`
- `output/playwright/core-documents-redesign/delivery-detail-design-v4-devtools-audit.json`
- `tests/core-delivery-detail-print.spec.ts-snapshots/delivery-detail-1980-linux.png`
- `tests/core-delivery-detail-print.spec.ts-snapshots/delivery-detail-1650-linux.png`
- `tests/core-delivery-detail-print.spec.ts-snapshots/delivery-detail-1366-linux.png`
- `output/playwright/core-documents-redesign/delivery-print-preview-open-fixed.png`
- `output/playwright/core-documents-redesign/delivery-print-window-fixed.png`
- `output/playwright/core-documents-redesign/delivery-note-download.pdf`

## 3URL Bundle

- マスター更新プレビューURL: `https://mainly-fighters-cruise-screens.trycloudflare.com/m64.html`
- 実行ログプレビューURL: `https://mainly-fighters-cruise-screens.trycloudflare.com/l64.html`
- 画面プレビューURL: `https://mainly-fighters-cruise-screens.trycloudflare.com/d64.html`

短縮HTML:
- `m64.html`: マスター更新プレビュー
- `l64.html`: 実行ログプレビュー
- `d64.html`: 画面プレビューURLへの短縮入口

実画面の直接URL:
- `https://incentives-scale-uri-clocks.trycloudflare.com/core/deliveries`

## 2026-05-31 00:10 JST 追記: URL Bundle制御文字対策

ユーザー報告上の3URL提示に、NUL相当の制御文字が混入した可能性があるため、前回のURL提示文は無効扱いにしました。

対応:
- `scripts/check-control-chars.mjs` を追加しました。
- `package.json` に `check:control-chars` を追加しました。
- `scripts/notify-bark.mjs` の `--title` / `--body` / `--url` / `--group` 入力から禁止制御文字を除去するようにしました。
- 公開HTMLの短縮URLを `m64.html` / `l64.html` / `d64.html` に変更しました。
- 長いURLファイル名をユーザー向けの3URL Bundleとして使わないようにしました。

制御文字検査対象:
- `all_log`
- `AIBOUX_MASTER_DOCUMENT.md`
- `AGENTS.md`
- `AGENT_RULES.md`
- `docs`
- `src/lib/server/tempLogShares.ts`
- `src/pages/g/[id].ts`
- `/tmp/aiboux-log-share`

検出対象:
- NUL `0x00`
- `0x01-0x08`
- `0x0B`
- `0x0C`
- `0x0E-0x1F`
- `0x7F`

許可:
- 改行
- 復帰
- タブ

検証:
- `npm run check:control-chars`: PASS

## Bark

3URL Bundle作成後にCODE_READY通知を送信しました。

通知:
- title: `AIBOUX CODE_READY`
- status: CODE_READY
- 3URLを本文に含める
- secret値はログに書かない

結果:

```json
{"provider":"bark","secretLogged":false,"ok":true,"delivered":true,"skipped":false,"endpointHost":"api.day.app","mode":"push-json","status":200,"responseCode":200,"responseMessage":"success","responseType":"json","probeAuth":false,"userReceiptConfirmed":false}
```

注記:
- これはCODE_READY通知です。
- `secretLogged=false` です。
- `userReceiptConfirmed=false` のため、FINAL_ACCEPTED / COMPLETED のBark完了ゲートではありません。

制御文字対策後、短縮3URLでCODE_READY通知を再送します。

再送結果:

```json
{"provider":"bark","secretLogged":false,"ok":true,"delivered":true,"skipped":false,"endpointHost":"api.day.app","mode":"push-json","status":200,"responseCode":200,"responseMessage":"success","responseType":"json","probeAuth":false,"userReceiptConfirmed":false}
```

再送本文に含めたURL:
- `https://mainly-fighters-cruise-screens.trycloudflare.com/m64.html`
- `https://mainly-fighters-cruise-screens.trycloudflare.com/l64.html`
- `https://mainly-fighters-cruise-screens.trycloudflare.com/d64.html`

## Notes

- This is `CODE_READY`.
- Not `DEPLOYED`.
- Not `FINAL_ACCEPTED`.
- Not `COMPLETED`.
- 本番 `/g/cdeliv9` はこのCODE_READY証跡ではありません。
- Worker Version IDは未発行です。
- Barkの最終完了ゲートは `userReceiptConfirmed=true` が必要です。
