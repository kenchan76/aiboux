# AIBOUX MCP / API Spec

> Archive note: This file is retained for historical traceability only. The active Source of Truth is `/home/pkkatsu/aiboux/AIBOUX_MASTER_DOCUMENT.md`.
> Any old deployment-approval wording in this archived snapshot is superseded by the current Production Deployment Rule: normal code/UI/API production deployment may run after required verification passes; `git push`, destructive operations, secret exposure/transfer, real external sending, pricing/billing changes, marketplace publication, customer/personal-data external transfer, and high-risk legal/pricing/contract/refund decisions still require human approval.

AIBOUX は将来的に API / MCP 連携可能な設計にします。ただしAIや外部ツールが勝手に本番反映・削除・価格変更・公開を行わないことを最優先にします。

## Confirmed Decisions

- APIは TypeScript型、JSON schema、統一エラー形式、audit log を考慮する。
- MCPは draft 作成や検索を中心にする。
- destructive operation、publish、price change、marketplace publish、email send、file delete は人間承認必須。
- Mail音声APIは返信下書きと分類artifact作成まで。email send APIとは分離し、人間承認を必須にする。
- Codex向けローカルMCPは `tools/codex-aiboux-mcp/server.mjs` に置く。初期toolsは `aiboux_ai_health` と `aiboux_cloudflare_ai_ping`。
- Codex MCPは本番 `https://mail.aiboux.com/api/ai/health` を呼び、実推論時はローカル秘密ファイルの `ADMIN_API_TOKEN` を `x-aiboux-admin-token` として送る。
- Dev Monitor API/Webhookはエラー要約と修正提案起票まで。デプロイ承認は別操作にする。
- Officeはファイル本体サーバー送信なしが原則のため、MCP/APIでファイル本体を扱う設計は初期対象外。
- 履歴書は個人情報を扱うため、ユーザー同意・削除機能・配信停止・privacy policy が必須。

## Assumptions

- APIはCloudflare Workersで提供する。
- 認証、tenant isolation、role/permission、audit logs は共通基盤にする。
- MCPリソースは読み取りとdraft作成を中心にする。

## TBD

- Codex以外へ配布するMCPサーバーの実装方式。
- OAuth/SSOの最終方式。
- 各APIの正式パス。
- 外部AIが扱えるデータ範囲。
- Dev Monitor Webhook署名、nonce、VPS常駐エージェント方式。

## Do Not Invent

- AIに公開、削除、価格変更、外部送信を自動実行させない。
- 音声返信下書きAPIをメール送信APIとして扱わない。
- Dev Monitor Webhookに顧客本文、メール本文、ファイル本文、秘密情報を含めない。
- Officeファイル本文を無断送信しない。
- 履歴書内容や顔写真を無断送信しない。
- tenant_id を省略したAPIを作らない。

## Common API Principles

- tenant_id必須。
- created_at / updated_at を持つ。
- created_by / updated_by を持つ。
- soft delete を検討する。
- status を持つ。
- audit_logs に操作記録を残す。
- 破壊的操作は確認必須。
- エラー形式を統一する。

## MCP Resources Candidates

- products
- product_divisions
- customers
- delivery_destinations
- price_schedules
- shop_products
- sku_variants
- marketplace_listings
- files
- templates
- documents
- mail_threads
- office_history_metadata
- resume_documents

## MCP Tools Candidates

- search_products
- create_product_draft
- update_product_price_schedule_draft
- calculate_customer_wholesale_price
- create_shop_sku_variant_draft
- generate_marketplace_listing_draft
- import_product_csv_draft
- suggest_bundle_skus
- search_templates
- create_document_draft
- export_document
- search_files
- create_transfer_link
- search_office_history_metadata
- create_resume_draft
- analyze_job_posting_with_consent
- classify_mail_privacy
- create_mail_voice_reply_draft
- create_dev_fix_proposal
- aiboux_ai_health
- aiboux_cloudflare_ai_ping

## Office MCP/API Rules

許可:

- 履歴メタデータ。
- ツール利用履歴。
- エラー統計。
- 会員設定。

禁止:

- ユーザーOfficeファイル本文の無断送信。
- PDF/Excel/Wordファイル本体の無断送信。
- 編集内容の無断ログ送信。

## 履歴書 MCP/API Rules

禁止:

- 履歴書内容の無断外部送信。
- 顔写真の無断送信。
- 求人票解析結果の無断第三者提供。
- メルマガ同意なし配信。

必須:

- ユーザー同意。
- 削除機能。
- 配信停止。
- privacy policy。
- audit logs。
