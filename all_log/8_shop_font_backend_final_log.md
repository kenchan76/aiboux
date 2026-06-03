# AIBOUX Shop Font And Backend Connection Final Log

実行日時: 2026-05-27 22:09 JST

## 実装概要

- プロジェクト全体のUIフォントを `Noto Sans JP` 優先に統一しました。
- Google Fontsの `Noto Sans JP` 400/500/700 を読み込む共通headコンポーネントを追加しました。
- shadcn/ui と Starwind UI の双方で `font-sans` が `Noto Sans JP` を最優先に参照するよう、Tailwind v4の `@theme` 設定を更新しました。
- カテゴリー管理をブラウザローカル保存からD1永続化へ移行しました。
- SNS投稿下書きの承認APIを追加しました。

## 主な変更ファイル

- `src/components/common/NotoSansJpHead.astro`
- `src/styles/global.css`
- `src/styles/starwind.css`
- `src/layouts/*.astro`
- `src/pages/index.astro`
- `src/pages/docs/index.astro`
- `src/pages/docs/product-master.astro`
- `migrations/0004_shop_phase5.sql`
- `src/pages/shop/api/categories/list.ts`
- `src/pages/shop/api/categories/save.ts`
- `src/components/shop/categories/ShopCategoryManager.tsx`
- `src/pages/shop/api/social/approve.ts`
- `AIBOUX_MASTER_DOCUMENT.md`
- `src/lib/server/tempLogShares.ts`
- `src/pages/g/[id].ts`

## D1変更

`migrations/0004_shop_phase5.sql` を作成し、ローカル・リモートの `aiboux-b2b-db` に適用しました。

追加カラム:

- `shop_categories.google_category_id`
- `shop_categories.google_category_name`
- `shop_categories.feed_enabled`

追加インデックス:

- `idx_shop_categories_tenant_google`

## API追加

- `GET /shop/api/categories/list`
  - テナント単位のカテゴリー一覧を返します。
- `POST /shop/api/categories/save`
  - カテゴリー名、スラッグ、Google Shopping Category ID、Googleカテゴリー名、フィード有効状態をD1へUPSERTします。
- `POST /shop/api/social/approve`
  - SNS投稿下書きの `status` を `pending` から `approved` へ更新します。
  - 外部SNSへの投稿は行いません。

## 検証

- `npx wrangler d1 execute aiboux-b2b-db --local --file=migrations/0004_shop_phase5.sql`: 成功
- `npx wrangler d1 execute aiboux-b2b-db --remote --file=migrations/0004_shop_phase5.sql`: 成功
- `npm run astro check`: エラー0
- `npm run build`: 成功
- `npx wrangler deploy --keep-vars`: 成功
- `https://shop.aiboux.com/shop/categories`: `200 OK`
- `GET https://shop.aiboux.com/shop/api/categories/list`: `200 OK`
- `POST https://shop.aiboux.com/shop/api/categories/save`: `200 OK`
- `POST https://shop.aiboux.com/shop/api/social/approve`: `200 OK`
- `https://mail.aiboux.com/g/sfb`: `200 OK`
- 本番HTMLで `Noto Sans JP` の読み込みを確認済み
- リモートD1でSNS下書きが `approved` へ更新されたことを確認済み

## 自己レビュー

- UIはLight mode only、白背景、高密度、細い罫線の方針を維持しています。
- SNS承認APIは承認状態の更新のみで、外部送信は行いません。
- Tailwind設定は現在 `tailwind.config.mjs` ではなくTailwind v4の `@theme` で管理されています。そのため `--font-sans` を `Noto Sans JP` 最優先に更新しました。

## AIからの自発的改善提案 (Proactive Proposals)

- カテゴリー管理に「Google Category ID候補検索」APIを追加し、数字IDを手入力しなくても候補選択できるようにする。
- `shop_social_post_drafts` に `approved_by` と `approved_at` を追加し、承認履歴をD1上で明確に追跡できるようにする。
- SNS承認APIの次に、Cloudflare Cron Triggerで承認済み下書きを実送信キューへ渡すワーカーを設計する。
- フォント読み込み失敗時の表示差を減らすため、主要レイアウトで `font-display: swap` の実効確認をPlaywrightで自動化する。
