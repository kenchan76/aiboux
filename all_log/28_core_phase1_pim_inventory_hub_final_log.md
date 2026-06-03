# AIBOUX Core Phase 1 Final Log

実行日: 2026-05-28

## 実装概要

AIBOUX CoreをPIMハブとして再起動し、Shop在庫更新をCore在庫同期エンジンへ集約した。

## 変更ファイル

- `migrations/0018_core_phase1_pim_inventory_hub.sql`
  - `core_product_skus`
  - `core_channel_listings`
  - `core_inventory_logs`
  - 既存Core商品からSKUをbackfill
  - 既存Shop商品からShopチャネル配信状態をbackfill
- `src/lib/server/coreInventorySync.ts`
  - テナント分離つきCore在庫同期ヘルパー
  - 楽観ロック、非負在庫ガード、idempotency、在庫履歴作成
- `src/pages/core/api/inventory/sync.ts`
  - `POST /core/api/inventory/sync`
  - バッチ在庫増減API
- `src/pages/core/api/products/hub.ts`
  - `GET /core/api/products/hub`
  - Core商品、SKU、Shop配信状態、在庫ログを一覧取得
- `src/components/core/CorePimHubDashboard.tsx`
  - shadcn/uiベースのCore PIM管理画面
- `src/components/core/CoreShell.tsx`
  - `/core/products` を新しいPIMハブ画面へ差し替え
- `src/pages/shop/api/inventory/update-stock.ts`
  - Shop手動在庫更新をCore同期ヘルパー経由へ変更
- `src/pages/shop/api/orders/cancel-refund.ts`
  - キャンセル/返金時の在庫戻しをCore同期ヘルパー経由へ変更
- `AIBOUX_MASTER_DOCUMENT.md`
  - Core Phase 1の実装内容、DB変更、検証結果を追記

## D1適用

- Local: `npx wrangler d1 execute aiboux-b2b-db --local --file=migrations/0018_core_phase1_pim_inventory_hub.sql`
  - 12 commands executed successfully
- Remote: `npx wrangler d1 execute aiboux-b2b-db --remote --file=migrations/0018_core_phase1_pim_inventory_hub.sql`
  - 14 queries executed
  - Rows read: 52
  - Rows written: 60
  - Bookmark: `0000027c-00000032-00005079-da3ef8450428f786ed95202b85539444`

## 動作確認

- `npm run astro check`
  - 0 errors
  - 既存のunused/deprecated系ヒントのみ
- `npm run build`
  - success
- Local Worker smoke:
  - `GET /core/api/products/hub?limit=3`: 200
  - `POST /core/api/inventory/sync` delta `-1`: 200、在庫履歴ID返却
  - `POST /core/api/inventory/sync` delta `+1`: 200、在庫を戻して履歴ID返却

## Tripartite AI Workflow

### Codex

- スキーマ、API、同期ヘルパー、Core UI、Shop接続変更を実装。
- 在庫更新は `tenant_id` 条件、非負制約、楽観ロック、idempotency key、在庫ログを必須化した。

### Cloudflare AI

- `/api/ai/health?run=1` をローカルWorkerから実行し、Workers AI bindingが有効であることを確認。
- 監査ログ: `all_log/28_core_phase1_cloudflare_ai_audit.json`

### Grok

- Grok CLIを90秒タイムアウト付きで実行したが、標準出力が返らなかった。
- タイムアウト事実とCodexのUX補完レビューを `all_log/28_core_phase1_grok_ui_review.md` に記録。
- 補完レビューに基づき、Core商品ハブの検索/状態フィルタをサーバーAPI連動へ修正した。

## 未完了・次の改善候補

- SKU単位の詳細ドロワー、在庫ログ詳細ドロワー、ページング/ソート/CSVエクスポートは次フェーズ候補。
- 本番のShop注文確定WebhookからCore同期APIを呼び出す部分は、注文確定イベント設計の確定後に接続する。
