# AIBOUX Core 帳票管理UI 差し戻し修正 完了ログ

Date: 2026-05-30

## 対象

- 見積書
- 注文書
- 納品書
- 請求書
- 入金伝票
- 発注書

## 修正内容

- 帳票一覧から右側プレビュー/詳細パネルを削除し、一覧テーブルを横幅いっぱいに統一。
- 帳票一覧列を `書類番号 / 取引先 / 納品先 / 納品日 / 金額 / 担当 / 状態 / アクション` に統一。
- 納品書一覧は `Core / 納品書` パンくず、一覧内重複検索バー、タイトル下説明文を出さない。
- 納品書一覧のKPIを `今月の件数`、`今月の下書き`、`今月の発行済`、`今月の対象金額` に限定。
- 一覧は当月分のみ表示し、`表示期間: 2026/05/01 - 2026/05/31` を明示。
- 行クリックで作成画面と同じ詳細/編集ワークスペースを開くように変更。
- 納品書詳細/編集から `発行日` 表示を削除し、納品日表示へ統一。
- 納品書作成画面は実際に `納品書を作成` をクリックして開き、A4プレビューなし、状態はタイトル行のみ、金額サマリーは下部フッター、明細テーブルは右端まで表示されることを確認。
- 明細行はドラッグハンドル付き、商品名列を広くし、単位/入数/数量/単価/操作列を狭くした構成を維持。
- メール送信/FAX送信は実送信せず、送信前確認の準備導線に留める。

## 変更ファイル

- `src/components/core/CoreShell.tsx`
- `src/components/core/CoreDataTable.tsx`
- `tests/core-full-ui-redesign.spec.ts`
- `tests/core-document-entry.spec.ts`
- `AIBOUX_MASTER_DOCUMENT.md`
- `src/lib/server/tempLogShares.ts`
- `src/pages/g/[id].ts`
- `all_log/42_core_document_management_rejection_fix_final_log.md`

## 検証

- `npm run astro check`
  - Result: 0 errors, 0 warnings, 27 existing hints.
- `ESBUILD_WORKER_THREADS=0 npm run build`
  - Result: success.
  - Note: existing Vite chunk-size warning only.
- Local Playwright 1980x1080:
  - `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-full-ui-redesign.spec.ts --grep "Core全主要ページ|帳票一覧|納品書作成UI|納品書詳細画面" --reporter=line`
  - Result: 4 passed.
  - `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-document-entry.spec.ts --reporter=line`
  - Result: 1 passed.
- Production Playwright 1980x1080:
  - `PLAYWRIGHT_BASE_URL=https://core.aiboux.com npx playwright test tests/core-full-ui-redesign.spec.ts --grep "Core全主要ページ|帳票一覧|納品書作成UI|納品書詳細画面" --reporter=line`
  - Result: 4 passed.
- Production HTTP status:
  - `https://core.aiboux.com/core`: 200
  - `https://core.aiboux.com/core/estimates`: 200
  - `https://core.aiboux.com/core/orders`: 200
  - `https://core.aiboux.com/core/deliveries`: 200
  - `https://core.aiboux.com/core/invoices`: 200
  - `https://core.aiboux.com/core/payments`: 200
  - `https://core.aiboux.com/core/purchase-orders`: 200

## スクリーンショット

- 納品書一覧: `output/playwright/core-ui-redesign/05_deliveries.png`
- 納品書作成: `output/playwright/core-ui-redesign/20_delivery_create_no_a4.png`
- 納品書詳細/編集: `output/playwright/core-ui-redesign/19_delivery_detail.png`
- 見積書一覧: `output/playwright/core-ui-redesign/02_estimates.png`
- 注文書一覧: `output/playwright/core-ui-redesign/04_orders.png`
- 請求書一覧: `output/playwright/core-ui-redesign/06_invoices.png`
- 入金伝票一覧: `output/playwright/core-ui-redesign/07_payments.png`
- 発注書一覧: `output/playwright/core-ui-redesign/08_purchase_orders.png`

## デプロイ

- Production deploy command: `npx wrangler deploy --keep-vars`
- Public UI verification deploy Worker Version ID: `5d0f3f49-71a4-4885-977a-629870b6e042`
- Final log/share deploy Worker Version ID is reported in the completion response.

## 24時間URL

- Temporary URL: `https://mail.aiboux.com/api/temp/log/core-document-management-rejection-fix-final-20260530?token=67f925d29bc926b278b2521752505165c603f9759606ec60`
- Short URL: `https://mail.aiboux.com/g/cdocui2?token=67f925d29bc926b278b2521752505165c603f9759606ec60`
- Expires: `2026-05-30T15:33:56Z`

## TBD / 未解決

- 納品先、配送情報、明細の追加 UI 項目は既存帳票保存 API との互換を優先し、専用 DB カラム永続化は未実装。
- B2 CSV / 飛伝CSV の実 CSV 仕様と項目マッピングはTBD。
- メール/FAXは準備導線のみで、外部送信は人間承認後の別実装。
