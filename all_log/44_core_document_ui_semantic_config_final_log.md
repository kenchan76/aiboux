# AIBOUX Core 帳票UI意味設計修正 完了ログ

Date: 2026-05-30

## 対象

- `/core/estimates`
- `/core/orders`
- `/core/deliveries`
- `/core/invoices`
- `/core/payments`
- `/core/purchase-orders`

## 修正内容

- 帳票管理UIを「納品書UIのコピー」ではなく、`documentUiConfig` による共通レイアウト + 帳票種別別設定へ整理した。
- 一覧列名を帳票種別ごとに制御した。
  - 見積書: 書類番号 / 取引先 / 提出先 / 見積日 / 金額 / 担当 / 状態 / アクション
  - 注文書: 書類番号 / 取引先 / 納入先 / 注文日 / 金額 / 担当 / 状態 / アクション
  - 納品書: 書類番号 / 取引先 / 納品先 / 納品日 / 金額 / 担当 / 状態 / アクション
  - 請求書: 書類番号 / 取引先 / 請求先 / 請求日 / 金額 / 担当 / 状態 / アクション
  - 入金伝票: 書類番号 / 取引先 / 対象請求書 / 入金日 / 金額 / 担当 / 状態 / アクション
  - 発注書: 書類番号 / 仕入先 / 納入先 / 入荷予定日 / 金額 / 担当 / 状態 / アクション
- 見積書、請求書、入金伝票、発注書の一覧から納品書用の `納品先` / `納品日` 列が漏れないようにした。
- 作成ワークスペースのカード名、宛先名、第三カード項目を帳票種別別設定で制御した。
  - 見積書: 基本情報 / 提出先 / 管理情報
  - 注文書: 基本情報 / 納入先 / 注文情報
  - 納品書: 基本情報 / 納品先 / 配送情報
  - 請求書: 基本情報 / 請求先 / 支払情報
  - 入金伝票: 基本情報 / 入金元 / 消込情報
  - 発注書: 基本情報 / 納入先 / 発注情報
- 発注書作成はドロップダウンではなく、帳票系と同じ1クリックの作成ワークスペース起動として確認した。
- 作成画面の A4プレビュー / ライブプレビュー / 印刷時配置確認は引き続き表示しない。
- 明細テーブル幅を指定方針に合わせ、商品列を広く、単位・入数・数量・単価・操作を狭く調整した。
- API側の帳票種別ラベルと作成日ベース番号表示も同じ設定を参照する形に寄せた。

## 変更ファイル

- `src/lib/coreDocumentUiConfig.ts`
- `src/components/core/CoreDataTable.tsx`
- `src/components/core/CoreShell.tsx`
- `src/components/core/forms/DocumentEntryForm.tsx`
- `src/pages/core/api/documents/save.ts`
- `tests/core-full-ui-redesign.spec.ts`
- `AIBOUX_MASTER_DOCUMENT.md`
- `src/lib/server/tempLogShares.ts`
- `src/pages/g/[id].ts`
- `all_log/44_core_document_ui_semantic_config_final_log.md`

## 検証

- `rg "納品先|納品日|発行日|作成日|件名|A4プレビュー|ライブプレビュー|印刷時の配置|有効期限|SheetContent|DocumentEntryForm|発注書を作成" src/components src/pages src/lib src/data`
  - 帳票管理の一覧/作成ワークスペースでは、納品書以外へ納品書用列名が漏れない構成を確認。
  - 残存する `納品先` / `納品日` は納品書設定、納品先マスタ、別プロダクト文言、印刷専用導線に限定。
- `npm run astro check`
  - Result: 0 errors, 0 warnings, 27 hints.
- `ESBUILD_WORKER_THREADS=0 npm run build`
  - Result: success.
  - Note: existing Vite chunk-size warning only.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-full-ui-redesign.spec.ts --reporter=line`
  - Result: 5 passed.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-document-entry.spec.ts --reporter=line`
  - Result: 1 passed.
- 公開URL確認
  - Final result and Worker Version ID are reported in the completion response.

## スクリーンショット

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

- Temporary URL: `https://mail.aiboux.com/api/temp/log/core-document-ui-semantic-config-final-20260530?token=7e8e3f0abe7951b16f162aa589274226b0a367c4e6c3dde6`
- Short URL: `https://mail.aiboux.com/g/cdocui4?token=7e8e3f0abe7951b16f162aa589274226b0a367c4e6c3dde6`
- Expires: `2026-05-30T16:55:00Z`

## TBD / 未解決

- 追加UI項目の専用DBカラム永続化は未実装。既存帳票保存APIとの互換を優先した。
- B2 CSV / 飛伝CSV の実CSV項目マッピングはTBD。
- メール/FAXは準備導線のみで、外部送信は人間承認後の別実装。
