# AIBOUX Shop Phase 2 Final Log

実行日時: 2026-05-27 21:00 JST

## 実装概要

AIBOUX Shop Phase 2として、Phase 1オンボーディングのD1永続化、AI商品登録Wizard、商品AI生成モックAPI、商品保存APIを実装した。UIはLight mode only、Notionライクな白背景、高密度shadcn/ui方針を維持した。

## 変更ファイル

- `src/pages/shop/api/settings/onboarding.ts`
  - `POST`で法人情報、ショップ名、サブドメイン、特商法テキスト、プライバシーポリシー、Stripe状態を受け取り、`shop_settings` にUPSERT保存。
- `src/components/shop/onboarding/ShopOnboardingWizard.tsx`
  - Step 4の保存ボタンで永続化APIを呼び、成功後 `/shop/dashboard` へ遷移。
- `src/pages/shop/api/products/ai-generate.ts`
  - `GET ?jan=...` でAI生成風のタイトル、SEO説明文、検索キーワード、Googleショッピングカテゴリーを返すモックAPI。
- `src/pages/shop/api/products/save.ts`
  - Wizard送信データを受け取り、JANに対応する `core_products` を確保してから `shop_products` へUPSERT保存。
  - `draft` と `published` をサポート。公開は「人間が承認して公開」ボタンからのみ実行。
- `src/components/shop/products/ShopProductWizard.tsx`
  - Step 1: JANコード入力とAI生成。
  - Step 2: 仕入原価、販売価格、想定送料から粗利額/粗利率をリアルタイム計算。赤字時は警告表示。
  - Step 3: 下書き保存、または人間承認済み公開。
- `src/components/shop/ShopClientShell.tsx`
  - `/shop/products/new` にAI商品登録Wizardを統合。
- `AIBOUX_MASTER_DOCUMENT.md`
  - Phase 2の仕様・実装・D1適用・検証結果を追記。
- `src/lib/server/tempLogShares.ts`, `src/pages/g/[id].ts`
  - この最終ログを24時間限定の短縮URLとして登録。

## D1確認と適用

### Local

ローカルD1は当初、Phase 1のShopテーブルのみで `tenants` / `core_products` が不足していたため、保存APIの実DB確認用に以下を適用した。

```bash
npx wrangler d1 execute aiboux-b2b-db --local --file=db/schema.sql
npx wrangler d1 execute aiboux-b2b-db --local --file=db/update_product_master_foundation.sql
npx wrangler d1 execute aiboux-b2b-db --local --file=db/seed_test.sql
```

### Remote

本番D1は非破壊SELECTで確認したところ `tenants` は存在したが、`core_products`, `shop_products`, `shop_settings` が不足していた。デプロイ後のAPI実行時エラーを避けるため、非破壊の `CREATE TABLE IF NOT EXISTS` 系SQLを適用した。

```bash
npx wrangler d1 execute aiboux-b2b-db --remote --file=migrations/0001_shop_phase1.sql
npx wrangler d1 execute aiboux-b2b-db --remote --file=db/update_product_master_foundation.sql
```

## Verification

- `npm run astro check`
  - 結果: 0 errors。
  - 既存の未使用import等はhintとして残存。
- `npm run build`
  - 結果: 成功。
- Local smoke test
  - `GET /shop/api/products/ai-generate?jan=4901234567894`: 200 JSON。
  - `POST /shop/api/settings/onboarding`: 200 JSON、`shop_settings` 保存成功。
  - `POST /shop/api/products/save`: 200 JSON、`core_products` と `shop_products` 保存成功。
  - `HEAD /shop/products/new`: 200 OK。

## Self Review

- UIは白背景、細い罫線、コンパクトなフォーム構成で既存Shop管理画面のshadcn/ui方針に合わせた。
- 公開操作は「人間が承認して公開」と明示し、AIが勝手に公開する導線にはしていない。
- 商品保存は既存の `core_products` / `shop_products` 制約と衝突しないよう、JANでCore商品を確保してからShop商品をUPSERTする。
- Phase 2では画像アップロード、カテゴリ動的取得、Stripe本実装などの新機能は勝手に広げず、提案として分離した。

## 未実装・TBD

- `ai-generate` はモック。実AI/外部商品DB連携は未実装。
- カテゴリーIDは静的な入力/モック値。D1の `shop_categories` 動的取得は未実装。
- 商品画像アップロードとR2保存は未実装。
- `costPrice` と `shippingCost` は粗利計算・Core同期の補助値として使い、現行 `shop_products` には専用列を追加していない。
- 本番の詳細UI操作はブラウザ自動テスト環境がないため、HTTP/APIベースで確認した。

## AIからの自発的改善提案 (Proactive Proposals)

- 商品画像アップロードをStep 1またはStep 2に追加し、R2へ保存後、AIで背景除去・alt文生成・画像順序提案まで行う。
- `shop_categories` の一覧取得APIを追加し、Google ShoppingカテゴリとAIBOUX内部カテゴリをマッピングしてプルダウン化する。
- JANコードから外部商品データベースを参照するアダプタ層を作り、モック、公式API、キャッシュを切り替えられるようにする。
- 粗利計算に決済手数料、モール手数料、梱包資材費を追加し、チャネル別の実粗利を比較できるようにする。
- 公開前にSEOタイトル長、説明文長、キーワード重複、NG表現をチェックする品質ゲートを追加する。
- 商品登録完了後に「Mallへ出す」「LINE通知する」「広告用コピーを作る」など次アクションを提案するサイドパネルを追加する。
- `costPrice` / `shippingCost` / `ai_keywords_json` / `google_category_id` を正式列として持つPhase 3 migrationを設計し、分析や再編集に使える形へ拡張する。
