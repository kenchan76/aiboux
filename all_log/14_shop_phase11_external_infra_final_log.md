# AIBOUX Shop 外部インフラ連携 完了ログ

実行日時: 2026-05-28 08:20 JST

## 実装概要

- 商品画像・帳票ロゴ画像の保存先をCloudflare R2へ接続しました。
- `SHOP_STORAGE` R2バケットバインディングを追加し、`aiboux-shop-assets` を作成しました。
- 汎用アップロードAPI `/shop/api/upload` を追加し、画像のMIMEタイプ・サイズ検証、テナント別R2キー生成、保存、配信用URL返却まで実装しました。
- R2配信API `/shop/api/assets/[...key]` を追加しました。
- 商品登録ウィザードと帳票設定の画像選択UIを実アップロードAPIへ接続しました。
- 帳票設定保存時・商品公開時にCloudflare Email bindingで `info@aiboux.com` へ通知する基盤を追加しました。
- Cloudflare Email providerが本番で内部エラーを返す場合に備え、D1の `shop_email_notification_logs` へ通知をキューイングするフェイルセーフを追加しました。
- SNS承認済み下書きを15分間隔で処理するCron TriggerとWorker runnerを追加しました。

## UX修正

Grokレビューで「R2」や内部ストレージキーをショップ運営者へ見せることが重大なUX阻害として指摘されました。

反映済み修正:

- 商品画像・帳票ロゴUIからユーザー向けの `R2` 文言を削除。
- 内部ストレージキーの表示を削除。
- 商品画像アップロード後に画像プレビューを表示。
- 「画像を保存しました」「ロゴ画像を保存しました」など初心者向け文言へ変更。
- AI画像処理ボタンが無効な理由を表示。
- ファイルサイズ・形式・空ファイルのエラーを日本語の具体的な案内に変更。

## Tripartite AI Workflow

### Codex

- R2、Email、Cron、UI接続、検証、引継書更新、ログ/URL登録を実装しました。

### Cloudflare AI

- 監査ログ: `all_log/14_phase11_cloudflare_ai_audit.json`
- 結果:
  - `SHOP_STORAGE`、アップロードAPI、配信API、Email通知、15分Cron構成をレビュー。
  - 通常の運用リスクとしてR2可用性とアップロード検証の継続監視を指摘。
  - アーキテクチャは承認。
- Cron runnerスモーク:
  - `scanned=1`
  - `published=1`
  - `failed=0`

### Grok

- 監査ログ: `all_log/14_phase11_grok_review.md`
- 初回レビュー: UXブロッカーあり。
- 修正後レビュー: `承認`

## 主な変更ファイル

- `wrangler.toml`
- `src/env.d.ts`
- `src/worker.ts`
- `src/workers/shop-social-cron.ts`
- `src/pages/shop/api/upload.ts`
- `src/pages/shop/api/assets/[...key].ts`
- `src/lib/server/shopNotificationEmail.ts`
- `src/pages/shop/api/settings/documents.ts`
- `src/pages/shop/api/products/save.ts`
- `src/pages/shop/api/products/process-image.ts`
- `src/components/shop/products/ShopProductWizard.tsx`
- `src/components/shop/ShopSettingsPanel.tsx`
- `src/pages/api/ai/health.ts`
- `migrations/0007_shop_phase11_notification_queue.sql`
- `AIBOUX_MASTER_DOCUMENT.md`
- `src/lib/server/tempLogShares.ts`
- `src/pages/g/[id].ts`

## 検証

- `npx wrangler r2 bucket create aiboux-shop-assets`: 作成成功。
- ローカル `/shop/api/upload`: 商品画像アップロード成功。
- ローカル `/shop/api/assets/{key}`: `200 OK` で画像配信成功。
- ローカル `/shop/api/settings/documents`: 保存成功、Email binding呼び出し成功。
- リモート `/shop/api/settings/documents`: 保存成功。Cloudflare Email providerは `internal server error` を返すため、D1通知キューへフォールバックする設計に更新。
- ローカルSNS Cron runner: `approved` のテスト行を `published` へ更新成功。
- `npm run astro check`: 0 errors。
- `npm run build`: `Complete!` まで成功、終了コード0。

補足:

- ビルド完了後にesbuildのdeadlock traceが表示される既存挙動があります。Astroのビルド成果物生成と終了コードは成功です。
- WranglerのローカルscheduledシミュレータはAstro Cloudflare adapterのredirected configと相性があり、`/cdn-cgi/handler/scheduled` が500になる場合があります。実処理は `src/workers/shop-social-cron.ts` に切り出し、同一runnerをCloudflare AI監査時に実行してD1更新まで確認しています。

## 本番反映

- `npx wrangler deploy --keep-vars`: 成功。
- Deployment completed successfully and the worker triggers were deployed with both schedules visible in Wrangler output.
- 本番確認:
  - `https://mail.aiboux.com/g/s11`: `200 OK`
  - `https://mail.aiboux.com/g/m11`: `200 OK`
  - `https://shop.aiboux.com/shop/products/new`: `200 OK`
  - `https://shop.aiboux.com/shop/settings`: `200 OK`
  - 本番 `/shop/api/upload`: R2保存成功。
  - 本番 `/shop/api/assets/{key}`: `200 OK`、`content-type: image/png`。
  - 本番 `/shop/api/settings/documents`: 保存成功。Cloudflare Email providerは `internal server error` を返したため、D1 `shop_email_notification_logs` に `queued` として保存されることを確認。
- 一時公開URL:
  - 最終ログ: `https://mail.aiboux.com/g/s11`
  - 更新済み引継書: `https://mail.aiboux.com/g/m11`
