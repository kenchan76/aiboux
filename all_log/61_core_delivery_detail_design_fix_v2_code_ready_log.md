# Core Delivery Detail Design Fix v2

作成日時: 2026-05-30 22:38:57 JST

## Status

BLOCKED_PREVIEW

## 結論

納品書詳細画面の前回CODE_READYは、ユーザー実画面確認では不十分でした。

今回は、上段カード高さ、上段カードと明細一覧の距離、単位ヘッダー縦割れ、操作列見切れ、固定フッター干渉に絞って再修正しました。

このログは公開プレビューCSS/JS未読込の指摘により、CODE_READY証跡として撤回します。

理由:

- 公開プレビューURLでTailwind/shadcn/uiのスタイルが適用されていないとユーザーから報告があった。
- HTML 200だけではユーザー確認可能なプレビューとは扱えない。
- Playwright localがPASSでも、公開プレビューがunstyled HTML表示ならPREVIEW_READYではない。
- `https://working-economies-edmonton-kai.trycloudflare.com/core/deliveries` はこの時点で無効扱いにする。

このログはDEPLOYED、FINAL_ACCEPTED、COMPLETEDではありません。

## ユーザー指摘

- 上段カードがまだ縦に大きすぎる。
- 基本情報カードと納品先カードの下が大きく空いている。
- 配送情報カードの高さに他カードが引っ張られて見える。
- 上段カードと明細一覧の間が広すぎる。
- 1980x1080で明細行が少ししか見えない。
- `単位` ヘッダーが縦割れしている。
- 操作列が右端ギリギリで危ない。
- 固定フッターが本文に近く、右下フローティングボタンも邪魔。

## 修正内容

- 上段3カードのgridを `xl:grid-cols-[360px_minmax(560px,1fr)_420px]` に変更。
- 上段カードに `gap-0 py-0` を指定し、共通Cardの既定 `gap-4 py-4` を打ち消した。
- CardHeaderに `h-8` と `!pb-0` を指定し、共通CardHeaderの既定下paddingを打ち消した。
- 基本情報カードを150px以内に圧縮。
- 納品先カードを150px以内に圧縮し、`住所・建物名` の途中改行を防止。
- 配送情報カードを190px以内に圧縮し、配送希望時間帯の値が切れない幅を維持。
- 上段カードと明細一覧の距離を16px以内に圧縮。
- 明細一覧カードに `data-testid="delivery-detail-lines-card"` を追加。
- 明細テーブル列幅を再調整し、商品名列を広げ、単位/備考/操作列を詰めた。
- `単位` ヘッダーに `data-testid="delivery-header-unit"` を追加し、縦割れしないことを検査。
- 明細行の `data-testid` を `delivery-line-row` に統一。
- 右下AI Assistantランチャーは納品書詳細画面では非表示にし、操作列・固定フッター確認の邪魔にならないようにした。
- 印刷フローティングプレビュー、PDFダウンロード、別ウィンドウ帳票の既存動作は維持。

## 変更ファイル

- `src/components/core/CoreShell.tsx`
- `src/components/ai/GlobalAIAssistant.tsx`
- `tests/core-delivery-detail-print.spec.ts`
- `AIBOUX_MASTER_DOCUMENT.md`
- `all_log/61_core_delivery_detail_design_fix_v2_code_ready_log.md`

## Verification

- `npm run check:mojibake`: PASS
- `npm run astro check`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-delivery-detail-print.spec.ts --reporter=line`: PASS
- `npm run gate:code`: PASS

## Playwright寸法検査結果

`output/playwright/core-documents-redesign/delivery-detail-fixed-dom-audit.json` より:

- 基本情報カード高さ: 142px
- 納品先カード高さ: 130px
- 配送情報カード高さ: 190px
- 上段カードと明細一覧の距離: 6px
- 単位ヘッダー: 幅44px / 高さ31px
- 操作列右端: viewport内
- 内消費税: viewport内
- 最終明細行: 固定フッターに被っていない
- 配送希望時間帯select: viewport内
- 納品日input: 読み取り可能幅

禁止項目確認:

- 配送状況: 0件
- 通貨: 0件
- 配送備考: 0件

## Evidence

- `output/playwright/core-documents-redesign/delivery-detail-fixed-v2.png`
- `output/playwright/core-documents-redesign/delivery-detail-fixed-v2-1366.png`
- `output/playwright/core-documents-redesign/delivery-print-preview-open-fixed.png`
- `output/playwright/core-documents-redesign/delivery-print-window-fixed.png`
- `output/playwright/core-documents-redesign/delivery-note-download.pdf`
- `output/playwright/core-documents-redesign/delivery-detail-fixed-dom-audit.json`

## Not Deployed

本ログ作成時点では、本番deployは実行していません。

理由:

- 今回の指示はUI修正をCODE_READYまで進めること。
- Cloudflare / Wrangler認証、Bark受信確認、Hermesは別ゲート。
- Worker Version IDは本ログでは発行・記録していません。
- `/g/cdeliv9` は本ログ時点では最新証跡として扱いません。

## Required URL Bundle

以下3URLを公開しました。

- マスター更新プレビューURL: `https://mainly-fighters-cruise-screens.trycloudflare.com/master-update-20260530-2238.html`
- 実行ログプレビューURL: `https://mainly-fighters-cruise-screens.trycloudflare.com/delivery-detail-design-fix-v2-code-ready-log-20260530-2238.html`
- 画面プレビューURL: `https://working-economies-edmonton-kai.trycloudflare.com/core/deliveries`

URL確認:

- マスター更新プレビューURL: HTTP 200 / `text/html; charset=utf-8` / `cache-control: no-store`
- 実行ログプレビューURL: HTTP 200 / `text/html; charset=utf-8` / `cache-control: no-store`
- 画面プレビューURL: HTTP 200

## Bark

3URLを含めたCODE_READY通知を送信しました。

送信内容:

- status: `CODE_READY`
- task: `納品書詳細画面 Design Fix v2`
- included URL: マスター更新プレビューURL
- included URL: 実行ログプレビューURL
- included URL: 画面プレビューURL

結果:

```json
{"provider":"bark","secretLogged":false,"ok":true,"delivered":true,"skipped":false,"endpointHost":"api.day.app","mode":"push-json","status":200,"responseCode":200,"responseMessage":"success","responseType":"json","probeAuth":false,"userReceiptConfirmed":false}
```

注意:

- このBark通知はCODE_READY通知です。
- `COMPLETED`、`FINAL_ACCEPTED`、`DEPLOYED` とは書いていません。
- `userReceiptConfirmed=false` のため、FINAL_ACCEPTED用のBark Gate成功扱いにはしていません。

Bark secret値はログ、docs、chat、公開URLへ記録しません。
