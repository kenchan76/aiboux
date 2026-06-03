# AIBOUX Core 帳票管理UI 公開レビュー最終ログ

Date: 2026-05-30

## 対象

- `https://core.aiboux.com/core`
- `https://core.aiboux.com/core/estimates`
- `https://core.aiboux.com/core/orders`
- `https://core.aiboux.com/core/deliveries`
- `https://core.aiboux.com/core/invoices`
- `https://core.aiboux.com/core/payments`
- `https://core.aiboux.com/core/purchase-orders`

## 画像との差分と修正

- 一覧KPIカードが参考画像より弱いテキストカード寄りだったため、左丸アイコン + タイトル/数値/補足の4枚カードへ統一した。
- 一覧タイトル下の別フィルター行と `カスタマイズ` を廃止し、タイトル右側へ `表示期間` / `状態` / `担当者` / `詳細フィルタ` / `CSV出力` / `一括送付を準備` / 作成ボタンを集約した。
- `Core / ...` パンくず、タイトル説明文、一一覧内の重複検索、右詳細パネルを出さない構造にした。
- 見積書などに納品書用の `納品先` / `納品日` が漏れる問題を、`coreDocumentUiConfig` の帳票種別別列設定で修正した。
- 発注書作成はドロップダウンを廃止し、`+ 発注書を作成` の1クリックで共通ワークスペースを開くようにした。
- 作成ワークスペース上段カードの `items-stretch` 相当の見え方を解消し、`items-start` と内容量依存の自然高さへ調整した。
- 明細一覧は商品列を主役にするため、商品列を `minmax(560px, 1fr)`、単位/入数/数量/単価/操作を狭幅に固定した。
- 作成画面の `A4プレビュー` / `ライブプレビュー` / `印刷時の配置を確認できます` は全帳票で0件を確認した。

## 実装概要

- 帳票管理一覧を共通レイアウト + 帳票種別別設定で制御。
- 作成/編集/詳細ワークスペースを `DocumentEntryForm` の共通構成へ集約。
- 一覧行クリックは右パネルではなく、同じ作成/編集ワークスペースを開く。
- 外部送信ボタンは準備導線のまま維持し、実送信は行わない。
- 監査用に上段カードと明細ヘッダーへ `data-testid` を追加し、公開DOM監査でカード高さと列幅を数値検証できるようにした。

## 変更ファイル

- `src/lib/coreDocumentUiConfig.ts`
- `src/components/core/CoreShell.tsx`
- `src/components/core/CoreDataTable.tsx`
- `src/components/core/forms/DocumentEntryForm.tsx`
- `src/pages/core/api/documents/save.ts`
- `tests/core-full-ui-redesign.spec.ts`
- `AIBOUX_MASTER_DOCUMENT.md`
- `src/lib/server/tempLogShares.ts`
- `src/pages/g/[id].ts`
- `all_log/45_core_document_ui_public_review_final_log.md`
- `all_log/45_core_document_ui_grok_review.md`
- `all_log/45_core_document_ui_cloudflare_ai_review.json`

## 検証

- `npm run astro check`
  - Result: 0 errors, 0 warnings, 27 hints.
- `ESBUILD_WORKER_THREADS=0 npm run build`
  - Result: success.
  - Note: existing Vite chunk-size warning only.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-full-ui-redesign.spec.ts --reporter=line`
  - Result: 5 passed.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-document-entry.spec.ts --reporter=line`
  - Result: 1 passed.
- `PLAYWRIGHT_BASE_URL=https://core.aiboux.com npx playwright test tests/core-full-ui-redesign.spec.ts --reporter=line`
  - Result: 5 passed.
- Public DOM audit:
  - `output/playwright/core-documents-redesign/public-dom-audit.json`
  - `カスタマイズ`: 0
  - `Core /`: 0
  - 見積書一覧の `納品先` / `納品日`: 0
  - 請求書一覧の `納品先`: 0
  - 入金伝票一覧の `納品先`: 0
  - 全作成画面の `A4プレビュー` / `ライブプレビュー` / `印刷時の配置を確認できます`: 0
  - 発注書作成ボタンの `aria-haspopup="menu"`: false

## 二重レビュー

- Grok Build:
  - Result: PASS
  - Log: `all_log/45_core_document_ui_grok_review.md`
- Cloudflare AI:
  - Result: Overall PASS
  - Log: `all_log/45_core_document_ui_cloudflare_ai_review.json`

## スクリーンショット

- `output/playwright/core-documents-redesign/reference-list.png`
- `output/playwright/core-documents-redesign/reference-create.png`
- `output/playwright/core-documents-redesign/estimate-list.png`
- `output/playwright/core-documents-redesign/estimate-create.png`
- `output/playwright/core-documents-redesign/order-list.png`
- `output/playwright/core-documents-redesign/order-create.png`
- `output/playwright/core-documents-redesign/delivery-list.png`
- `output/playwright/core-documents-redesign/delivery-create.png`
- `output/playwright/core-documents-redesign/invoice-list.png`
- `output/playwright/core-documents-redesign/invoice-create.png`
- `output/playwright/core-documents-redesign/payment-list.png`
- `output/playwright/core-documents-redesign/payment-create.png`
- `output/playwright/core-documents-redesign/purchase-order-list.png`
- `output/playwright/core-documents-redesign/purchase-order-create.png`

## 24時間URL

- Temporary URL: `https://mail.aiboux.com/api/temp/log/core-document-ui-public-review-final-20260530?token=3f7008c3197e1adbf3e571f0ac572b6e05f24689314b8d94`
- Short URL: `https://mail.aiboux.com/g/cdocui5?token=3f7008c3197e1adbf3e571f0ac572b6e05f24689314b8d94`
- Expires: `2026-05-30T17:31:00Z`

## TBD / 未解決

- 追加UI項目の専用DBカラム永続化は未実装。既存帳票保存APIとの互換を優先した。
- B2 CSV / 飛伝CSV の実CSV項目マッピングはTBD。
- メール/FAXは準備導線のみで、外部送信は人間承認後の別実装。
- 最終デプロイ後の Worker Version ID は完了報告で提示する。
