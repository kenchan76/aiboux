# AIBOUX Core 納品書作成UI 差し戻し対応 最終ログ

実行日時: 2026-05-29T10:05:49Z  
担当AI: Codex  
対象URL: `https://core.aiboux.com/core/deliveries`

## 実装概要

前回の納品書UI改善が「納品書を作成」から開く実体コンポーネントへ反映されていなかったため、起動経路を再確認し、`/core/deliveries` の主要CTAが開く `DocumentEntryForm` の納品書モードを差し替えました。

`defaultType === "delivery"` / `type === "delivery"` の場合、旧来の右側A4ライブプレビューを表示せず、納品書専用の業務入力ワークスペースを表示します。見積書作成側のA4プレビューは既存仕様として維持しています。

## 特定した実体コンポーネント

- 起動元: `src/components/core/CoreShell.tsx`
  - `/core/deliveries` の `納品書を作成` クリックで `setDocumentFormType("delivery")` と `setDocumentFormOpen(true)` を実行。
- 実体: `src/components/core/forms/DocumentEntryForm.tsx`
  - 納品書モードでは `DeliveryEntryWorkspace` を表示。
  - A4プレビュー / ライブプレビューのボタンと右プレビュー列を出さない。

## 変更ファイル

- `src/components/core/forms/DocumentEntryForm.tsx`
- `src/components/core/CoreShell.tsx`
- `tests/core-phase5-layout.spec.ts`
- `tests/core-full-ui-redesign.spec.ts`
- `AIBOUX_MASTER_DOCUMENT.md`
- `src/lib/server/tempLogShares.ts`
- `src/pages/g/[id].ts`
- `all_log/37_core_delivery_create_ui_rework_final_log.md`

## 実装内容

### 納品書作成 / 編集UI

- A4プレビュー / ライブプレビューを納品書モードから削除。
- 上段に以下を配置:
  - 基本情報
  - 納品先
  - 配送情報
- 中段に以下を配置:
  - 明細一覧
  - 金額サマリー
- 下段に以下を配置:
  - 備考・メモ
  - 履歴
  - アクション
- 必須表示:
  - 納品先
  - 配送業者
  - お問い合わせ番号
  - メール送信
  - FAX送信
  - コピー
- メール送信 / FAX送信はUIラベルとして表示しつつ、実送信は行わず送信前確認の準備導線に留めています。

### `/core/deliveries` 一覧右詳細パネル

- 右詳細パネルに以下を追加:
  - 納品先カード
  - 配送情報カード
  - 配送業者
  - お問い合わせ番号
  - 配送状況
  - メール送信
  - FAX送信
  - コピー

## 検証結果

- `npx astro check`
  - 0 errors
  - 0 warnings
  - 27 hints
- `ESBUILD_WORKER_THREADS=0 npm run build`
  - success
  - 既存のVite chunk-size warningのみ
- Playwright 1980x1080:
  - `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-phase5-layout.spec.ts tests/core-document-entry.spec.ts tests/core-full-ui-redesign.spec.ts --reporter=line`
  - 8 passed
- 本番デプロイ:
  - `npx wrangler deploy --keep-vars`
  - success
  - Worker Version ID: `7b764fa7-5ab0-4c49-80d8-89fa8f4f354a`
- 本番Playwright確認:
  - `PLAYWRIGHT_BASE_URL=https://core.aiboux.com npx playwright test tests/core-full-ui-redesign.spec.ts --grep "納品書作成UI|納品書詳細画面" --reporter=line`
  - 2 passed

## Playwrightで追加・確認したexpect

- `/core/deliveries` の `納品書を作成` クリック後:
  - `A4プレビュー` が存在しない
  - `ライブプレビュー` が存在しない
  - `delivery-entry-workspace` が表示される
  - `納品先` が表示される
  - `配送業者` が表示される
  - `お問い合わせ番号` が表示される
  - `メール送信` が表示される
  - `FAX送信` が表示される
  - `コピー` が表示される
- `/core/deliveries` 一覧右詳細パネル:
  - `配送情報` が表示される
  - `お問い合わせ番号` が表示される
  - `メール送信` / `FAX送信` / `コピー` が表示される

## スクリーンショット

- 納品書作成UI（A4プレビューなし）:
  - `output/playwright/core-ui-redesign/20_delivery_create_no_a4.png`
  - `test-results/core-phase5-document-form-1980.png`
- 納品書一覧右詳細パネル:
  - `output/playwright/core-ui-redesign/05_deliveries.png`
- 納品書詳細ワークスペース:
  - `output/playwright/core-ui-redesign/19_delivery_detail.png`

## 未完了 / TBD

- 配送業者、お問い合わせ番号、配送日時、配送状況のD1永続化は今回の範囲外。現状はUI状態と既存帳票保存APIの範囲に留めています。
- メール/FAXの実送信は人間承認が必要なため、今回も外部送信は実行していません。

## 一時公開URL

標準URL:
`https://mail.aiboux.com/api/temp/log/core-delivery-create-ui-rework-final-20260529/?token=f43fc7a840091845ce9fc848594e3246c50ecaa058c52f66`

短縮URL:
`https://mail.aiboux.com/g/cdeliv2?token=f43fc7a840091845ce9fc848594e3246c50ecaa058c52f66`

引継書短縮URL:
`https://mail.aiboux.com/g/mcdeliv2?token=f1404fe68a47770cf046c3fb3aae0534b0ba5dfd7369219c`

有効期限: 2026-05-30T10:05:49Z
