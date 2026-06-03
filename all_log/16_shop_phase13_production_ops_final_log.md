# AIBOUX Shop Production Integration / Operational Dashboard 最終完了ログ

作業日: 2026-05-28

## 実装内容

### Stripe実事業者データ同期

- Stripe Connectオンボーディング時に、Phase 12のテスト事業者情報ではなくShop設定の実データを使うよう変更しました。
- 取得優先順位:
  1. `shop_document_settings` の事業者名、郵便番号、住所、電話番号、メール
  2. `shop_settings` の法人名、店名、住所、連絡先
  3. 未設定時はStripe実APIを呼ばず、mock pending状態へ安全退避
- 未設定時に「株式会社雪花」など実在しそうなプレースホルダーを表示しないよう修正しました。
- 実データ未設定時は「先に帳票・書類設定を保存してください」と表示し、Stripe実連携を開始しません。

### メール通知履歴ダッシュボード

- 新APIを追加しました。
  - `GET /shop/api/notifications/email-logs?limit=50`
- `/shop/settings` の「通知・外部連携」タブに、最新50件のメール通知履歴テーブルを追加しました。
- 表示項目:
  - 状態
  - 件名/内容
  - 宛先
  - provider
  - 送信日時
  - 試行回数
- UI改善:
  - `すべて / 対応中 / 送信済み / 要確認` フィルタ
  - `送信待ち / 再試行中 / 送信済み / 要確認` バッジ
  - `N/5回` の試行回数表示
  - 年付き日時表示
  - 未知の技術エラーは日本語の安全な説明へ変換
- SNS/LINE設定カードは実接続前に誤操作されないよう、`準備中`バッジとdisabledボタンに変更しました。

### メールログ自動削除

- migrationを追加しました。
  - `migrations/0009_shop_phase13_email_log_cleanup.sql`
- `shop_email_notification_logs(created_at)` にindexを追加しました。
- `runShopEmailQueue()` に30日超ログの自動削除を追加しました。
- 削除仕様:
  - 30日より古いログを対象
  - 1回あたり最大500件
  - 単一のbounded DELETE文で実行
  - 結果は `deletedOldLogs` として返却

## Tripartite AI Workflow

### Codex

- 実装、D1 migration、UI接続、ローカル検証、引継書更新を実施しました。

### Cloudflare AI Architecture Audit

- 監査ログ: `all_log/16_phase13_cloudflare_ai_audit.json`
- 結果: approved with recommendations
- 確認内容:
  - 通知履歴APIはtenant-scopedな最新50件を単一D1クエリで取得し、N+1リスクがないこと
  - cleanupは`LIMIT 500`でD1負荷が bounded であること
  - `created_at` indexにより古いログ削除の探索負荷を抑えること
- 指摘:
  - cleanupのトランザクション安全性を意識すること
- 対応:
  - D1上で単一SQL文のDELETEとして原子性を確保し、削除件数も500件に制限しました。

### Grok UX/UI Review

- 初回レビュー: `all_log/16_phase13_grok_review.md`
  - 初回は承認不可。
  - 理由: 実在しそうなプレースホルダー情報、生メールエラー露出、通知履歴の操作性不足。
- 修正後レビュー: `all_log/16_phase13_grok_final_review.md`
  - 結果: 承認可。
  - 雪花プレースホルダー排除、未知エラー隠蔽、フィルタ/日時/試行回数、SNS/LINE準備中表示が確認されました。

## 検証結果

- D1 migration:
  - local適用: 成功
  - remote適用: 成功
- `npm run astro check`:
  - 0 errors
  - 0 warnings
  - 31 hints
- `npm run build`:
  - 成功
- Local smoke:
  - 帳票・書類設定保存APIが成功
  - Stripe onboard APIが`businessData.dataSource='shop_settings'`を返却
  - 通知履歴APIがtenant-scoped logsを返却
  - 31日超ログのcleanup smokeで`deletedOldLogs=1`を確認
- Production smoke:
  - `https://mail.aiboux.com/g/s13`: `200 OK`
  - `https://mail.aiboux.com/g/m13`: `200 OK`
  - `GET /shop/api/notifications/email-logs?limit=5`: `200 OK`
  - `GET /shop/api/stripe/status`: `200 OK`、`businessData.dataSource='shop_settings'`
  - `POST /shop/api/stripe/onboard`: `200 OK`。現環境のStripe設定では実API作成に失敗するため、要件どおりmock pendingへ安全退避。

## 本番APIキー設定手順

AIは本番APIキーを保持しないため、管理者が以下を実行してください。

### ローカル `.dev.vars`

```bash
cat >> .dev.vars <<'EOF_KEYS'
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EOF_KEYS
```

### Cloudflare本番Secret

```bash
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put RESEND_API_KEY
```

入力プロンプトが出たら、それぞれの実キーを貼り付けます。キーはチャットやログに残さないでください。

### Stripe Webhook設定

- Webhook URL:
  - `https://shop.aiboux.com/shop/api/stripe/webhook`
- 受け取るイベント:
  - `account.updated`
- Stripe DashboardでWebhookを作成後、発行された`whsec_...`を`STRIPE_WEBHOOK_SECRET`へ設定してください。

### 設定後の確認

```bash
npm run astro check
npm run build
npx wrangler deploy --keep-vars
curl -sS https://shop.aiboux.com/shop/api/stripe/status -H 'x-tenant-id: tenant_001'
```

Resend実送信確認は、まずテスト宛先で1件だけ実行してください。

## 残タスク提案

- 通知履歴からの手動再送APIを追加する。
- 失敗詳細のモーダル表示とコピー機能を追加する。
- メールログのCSV exportを追加する。
- Stripe連携完了後、実Stripe accountから会社名や要件ステータスをUIへ同期する。
