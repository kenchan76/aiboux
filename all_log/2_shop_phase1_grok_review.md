# AIBOUX Shop Phase 1 Grok Review

実行日時: 2026-05-27 20:06 JST

## Grok実行結果

`grok --always-approve --permission-mode bypassPermissions -p ...` を180秒のタイムアウト付きで実行したが、Grok Buildは応答を返さず終了コード `124` でタイムアウトした。

## Codex代替レビュー

### バグ・仕様違反

- `migrations/0001_shop_phase1.sql` は既存の `shop_products` を壊さないよう `CREATE TABLE IF NOT EXISTS` と互換列を採用している。
- 指定名 `aiboux-d1` は `wrangler.toml` に存在しなかったため失敗したが、既存D1名 `aiboux-b2b-db` でローカル適用を完了した。
- `corporate.ts` と `zipcode.ts` は `GET` のみ、モックデータ、入力バリデーション、`no-store` ヘッダーを備えている。
- `ShopOnboardingWizard.tsx` はshadcn/uiベースで、インボイス登録、法人候補、郵便番号補完、店舗URL、HTMLタグを隠した法務プレビュー、Stripe ConnectのワンクリックUIを満たしている。
- `npm run astro check` は 0 errors。
- `npm run build` は成功。

現時点でPhase 1要件に対するブロッカーはなし。

## AIからの自発的改善提案

- Onboardingの入力内容をD1へ下書き保存する `shop/onboarding/draft` APIを追加し、途中離脱しても再開できるようにする。
- 法人番号と郵便番号APIはモックのまま本番導入しないよう、外部APIアダプタとキャッシュ層を分離する。
- サブドメインの利用可否チェックと予約処理をStep 2に追加する。
- 特商法・プライバシーポリシーはテンプレートバージョンを保存し、公開前の人間承認ログを残す。
- Stripe ConnectはOAuth開始、callback、account status pollingを明確に分け、未完了状態を管理画面に表示する。
- `line_notification_logs` は将来の通知Workerと接続し、送信レート制限と再送ポリシーを別テーブルで管理する。
