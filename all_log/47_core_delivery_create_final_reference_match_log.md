# AIBOUX Core 納品書作成画面 参照画像寄せ 最終ログ

作成日: 2026-05-30
対象: `/core/deliveries` の `納品書を作成`
参照画像: `https://tadaup.jp/5HYfNaVM.png`

## 実装概要

- 納品書作成画面を参照画像の高密度レイアウトへ寄せた。
- 左サイドバーは維持し、COREバッジを表示したまま、作成ワークスペース表示時の背景オーバーレイ/ぼかしを出さないようにした。
- タイトル行は左に `納品書作成` と状態ドロップダウン、右に `B2 CSV` / `飛伝CSV` / `メール送信` / `FAX送信` / `コピー` / `キャンセル` / `保存` を集約した。
- 上段カードは固定高さ、`h-full`、`items-stretch`、`min-h-*` を使わず、内容量に応じる自然高さにした。
- `配送情報` から `配送備考` を完全削除した。
- `備考・メモ` は単一入力欄へ統合し、`社外向け文面` / `社内メモ` / `納品時メモ` ラベルを出さない。
- 明細一覧を参照画像仕様へ再設計した。
  - 商品コード列を分離し、13桁コードを想定。
  - `商品名 / 規格` を最大幅の主列にした。
  - `No.`、`税率`、`操作` を狭くした。
  - 差し戻し対応後のDOM実測は `drag 20px / No. 20px / 商品コード 116px / 商品名 1213px / 税率 44px / 操作 40px`。
  - 商品コード13桁 `4901234567890` は `scrollWidth <= clientWidth` で切れないことを確認した。
  - `備考` 通常列を削除した。
  - `税率` は `10%` / `8%` のみ。`8%軽減` は表示しない。
  - 備考行を通常行とは別行にし、ドラッグハンドル、No.、操作アイコンを持たせた。
  - 備考行は商品コードから金額までを横断し、途中セル罫線を入れない。
- 初期明細金額を `1,200 x 10 = 12,000` へ修正し、フッター合計は `小計 177,040 / 消費税10% 17,200 / 消費税8% 403 / 合計 194,643 / 内消費税 17,603` にした。
- 合計金額フッターは画面下部に固定し、半透明背景で `小計` / `消費税 10%` / `消費税 8%` / `合計金額` / `内消費税` を表示した。
- `合計金額` を最も強く表示した。

## 参照画像との差分と対応

- 左サイドバーがSheet overlayでぼけていたため、納品書作成Sheetでは overlay を無効化した。
- フォーム全体の上下余白、カード内余白、明細外側余白を削り、画像に近い詰まった密度にした。
- 明細の旧 `商品コード / 商品名 / 規格` 一体列をやめ、`商品コード` と `商品名 / 規格` に分離した。
- 通常行の `備考` 列を削除し、備考行として独立させた。
- 備考行はNo.付き、ドラッグ可能、操作アイコン付きにした。
- `社外向け文面` / `納品時メモ` の2入力から、`備考・メモ` 配下の単一入力へ変更した。
- 下部金額サマリーを5項目にし、8%税額も分けて表示した。
- 商品コード13桁がセル内で切れていたため、商品コード列を116pxに固定し、商品コード入力のみ `10px` 表示と最小paddingにした。
- `No.`、`税率`、`操作` 列が太く見えていたため、それぞれ20px、44px、40pxへ詰めた。
- 税率/単位Selectのアイコンが文字を圧迫していたため、明細セル内のSelectアイコンを非表示にし、`10%` / `8%` / `枚` が読める状態にした。
- 通常状態のInput枠が強かったため、明細セル入力は透明境界にし、hover/focus時だけ入力欄として見えるようにした。

## 変更ファイル

- `src/components/core/forms/DocumentEntryForm.tsx`
- `src/components/ui/sheet.tsx`
- `src/lib/coreDocumentFormSchema.ts`
- `tests/core-full-ui-redesign.spec.ts`
- `tests/core-document-entry.spec.ts`
- `all_log/core_delivery_create_final_grok_review.md`
- `all_log/core_delivery_create_final_cloudflare_ai_audit.json`
- `output/playwright/core-documents-redesign/reference-delivery-create-final.png`
- `output/playwright/core-documents-redesign/reference-delivery-create-latest.png`
- `output/playwright/core-documents-redesign/delivery-create-final.png`
- `output/playwright/core-documents-redesign/delivery-create-final-dom-audit.json`
- `all_log/47_core_delivery_create_final_reference_match_log.md`

## Grok Buildレビュー

- ログ: `all_log/core_delivery_create_final_grok_review.md`
- 結果: PASS
- 備考: `/tmp/grok-aiboux-review` に参照画像、実画面スクショ、DOM実測JSONを分離配置して監査した。

## Cloudflare AI監査

- ログ: `all_log/core_delivery_create_final_cloudflare_ai_audit.json`
- 結果: PASS
- 判定: `{"verdict":"PASS","findings":[]}`

## 検証

- `npm run astro check`: 0 errors, 0 warnings, 27 hints
- `ESBUILD_WORKER_THREADS=0 npm run build`: success
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-full-ui-redesign.spec.ts --reporter=line`: 6 passed
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-document-entry.spec.ts --reporter=line`: 1 passed
- `PLAYWRIGHT_BASE_URL=https://core.aiboux.com npx playwright test tests/core-full-ui-redesign.spec.ts --reporter=line`: 6 passed
- `PLAYWRIGHT_BASE_URL=https://core.aiboux.com npx playwright test tests/core-document-entry.spec.ts --reporter=line`: 1 passed

## 本番確認

- 対象URL: `https://core.aiboux.com/core/deliveries`
- 確認結果: HTTP 200
- 24時間URL: `https://core.aiboux.com/api/temp/log/core-delivery-create-final-reference-match-20260530?token=d273a9dc6e9d58c9bbcd7f9b07f289d79b965fd80b6eab31`
- 短縮URL: `https://core.aiboux.com/g/cdeliv6`
- 確認結果: 24時間URL / 短縮URL ともに HTTP 200

## スクリーンショット

- 参照画像保存: `output/playwright/core-documents-redesign/reference-delivery-create-final.png`
- 実画面保存: `output/playwright/core-documents-redesign/delivery-create-final.png`
- DOM監査JSON: `output/playwright/core-documents-redesign/delivery-create-final-dom-audit.json`

## 引継ぎ

- 今後もAIBOUX Core UI修正では、完了前にPlaywrightスクリーンショット、Grok Build、Cloudflare AI監査を通す。
- GrokタイムアウトはPASS扱いしない。長い画像比較プロンプトがタイムアウトする場合は、焦点を分けた短縮プロンプトで再実行する。
- 配送備考は配送情報カードへ戻さない。備考・メモへ統合する。
- 備考行は通常明細列の備考ではなく、独立した横断行として扱う。
- メール/FAX/CSVは準備導線であり、外部送信は人間承認後に限定する。
