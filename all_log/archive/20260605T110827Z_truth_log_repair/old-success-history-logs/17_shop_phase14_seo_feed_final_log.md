# AIBOUX Shop SEO/画像・フィード同期基盤 完了ログ

作成日時: 2026-05-28 12:31 JST  
対象: AIBOUX Shop  
状態: 実装完了 / Tripartite AI Workflow確認済み / ビルド確認済み

## 実装内容

### 1. 画像SEOパイプライン

- `src/lib/server/shopImageSeo.ts` を追加。
- `POST /shop/api/upload` を改修し、商品名・alt・キーワード・元ファイル名から検索向けの英数字ファイル名を生成。
- R2保存キーを `tenant/shop/{purpose}/seo/{date}/...` 形式へ変更。
- 500x500以上の推奨サイズ判定、検出サイズ、推奨配信形式、元ファイル名、SEOファイル名をR2 metadataとAPIレスポンスへ付与。
- Cloudflare Workersのメモリ制約を考慮し、画像全体を `ArrayBuffer` 化せず、先頭512KBだけを寸法解析に使い、R2へは `file.stream()` で保存。
- 商品登録UIでは、画像保存後に「保存名: 元画像名から検索向けファイル名へ自動調整済み」と表示するよう改善。

### 2. 公開商品ページのProduct JSON-LD

- `src/pages/shop/[tenant]/product/[id].astro` を公開商品ページとして実装。
- admin用 `ShopLayout` の noindex 影響を避けるため、公開ページとして独立表示。
- D1の公開済み `shop_products` と `core_products` から以下をJSON-LDへマッピング。
  - name
  - description
  - image
  - sku
  - gtin
  - category
  - brand
  - JPY Offer
  - availability
  - seller
- canonicalとJSON-LD内URLは、tenantの `host_name` があればそれを使い、なければ `https://shop.aiboux.com` にフォールバック。

### 3. フィード同期Queue基盤

- `wrangler.toml` に `SHOP_FEED_SYNC_QUEUE` producer と `shop-feed-sync-queue` consumer を追加。
- `src/env.d.ts` にQueue bindingを追加。
- `src/lib/server/shopFeedSyncQueue.ts` を追加。
- `migrations/0010_shop_phase14_feed_sync_jobs.sql` を追加し、`shop_feed_sync_jobs` を作成。
- `src/pages/shop/api/products/save.ts` で商品保存・公開時にGoogle/Bing向けfeed sync jobをD1へ記録し、Cloudflare Queuesへ送信。
- `src/worker.ts` のqueue handlerで受信したfeed sync messageを `received` に更新し、attemptsを加算。

## Tripartite AI Workflow

### Codex

- 画像SEOキー生成、R2 stream保存、公開Product JSON-LD、Queue producer/consumer、D1 job trackingを実装。

### Cloudflare AI監査

- 出力: `all_log/17_phase14_cloudflare_ai_audit.json`
- 指摘:
  - R2アップロード時の全ファイルメモリ展開リスク。
  - Queue処理のretry/tracking強化。
  - 将来的なD1公開ページキャッシュ戦略。
- 反映:
  - `file.slice(0, 512KB)` + `file.stream()` に修正。
  - `shop_feed_sync_jobs` でQueue前後を永続追跡。
  - consumer側で `received` と attempts を記録。

### Grok UX/UIレビュー

- 初回出力: `all_log/17_phase14_grok_review.md`
- 最終出力: `all_log/17_phase14_grok_final_review.md`
- 最終判定: `APPROVED`
- 反映:
  - 画像保存後に検索向けファイル名が分かるUI文言へ改善。
  - Product JSON-LDへ `seller` を追加。
  - 公開ページのcanonical/JSON-LD URLを `shop.aiboux.com` 基準に修正。
  - Queue jobをD1で追跡。

## 検証結果

- `npx wrangler queues create shop-feed-sync-queue`: 作成済み。
- `npx wrangler d1 execute aiboux-b2b-db --local --file=migrations/0010_shop_phase14_feed_sync_jobs.sql`: 成功。
- `npx wrangler d1 execute aiboux-b2b-db --remote --file=migrations/0010_shop_phase14_feed_sync_jobs.sql`: 成功。
- `npm run astro check`: 0 errors。
- `npm run build`: 成功。
- ローカルアップロードAPI:
  - `POST /shop/api/upload` が `success=true` を返却。
  - `black-leather-wallet-front...png` 形式のSEOファイル名生成を確認。
  - 500x500 metadataを確認。
- ローカル商品保存API:
  - `POST /shop/api/products/save` が `success=true` を返却。
  - `feedSync.queued=true` を確認。
- ローカルQueue:
  - `shop_feed_sync_jobs.status='received'`
  - `attempts=1`
- ローカル公開商品ページ:
  - `/shop/yukihana-test/product/shopprod_tenant_001_4901234567818` が表示成功。
  - `application/ld+json`、`Product`、`seller`、`gtin`、JPY Offerを確認。
  - canonicalが `https://shop.aiboux.com/...` になることを確認。

## 変更ファイル

- `src/lib/server/shopImageSeo.ts`
- `src/pages/shop/api/upload.ts`
- `src/components/shop/products/ShopProductWizard.tsx`
- `src/pages/shop/[tenant]/product/[id].astro`
- `src/lib/server/shopFeedSyncQueue.ts`
- `src/pages/shop/api/products/save.ts`
- `src/worker.ts`
- `src/env.d.ts`
- `wrangler.toml`
- `migrations/0010_shop_phase14_feed_sync_jobs.sql`
- `AIBOUX_MASTER_DOCUMENT.md`

## AIからの自発的改善提案

- 次フェーズでGoogle/Bing Merchant Center APIの本番consumerを実装し、`received` から `succeeded` / `failed` までの完全な状態遷移を作る。
- `shop_feed_sync_jobs` に provider別レスポンス、外部item id、最終同期日時を追加し、運用画面で同期状態を見える化する。
- Cloudflare ImagesまたはImage Resizingの本番設定後、実WebP変換・サムネイル生成・破損画像検出をAPIに接続する。
- 公開商品ページの在庫数・販売停止状態とJSON-LD `availability` を連動させる。
- 商品更新時の公開ページキャッシュ方針を決め、stale JSON-LDが検索クローラへ残らないようにする。

## 一時公開URL

- 最終ログ短縮URL: `https://mail.aiboux.com/g/s14`
- 引継書短縮URL: `https://mail.aiboux.com/g/m14`
- 有効期限: 2026-05-29 12:31 JST
