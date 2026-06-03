# AIBOUX Shop Structure And Data Audit Public Log

## Status

DEPLOYED

## Scope

このログは、AIBOUX / `shop.aiboux.com` 関連作業の実装前調査を公開URLで確認できるようにするための証跡である。

実装・UI修正・DB変更・デプロイ前提のコード変更は行っていない。

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## User Request

対象: AIBOUX / `shop.aboux.com` もしくは `shop.aiboux.com` 関連作業。

最初に実装・修正に入らず、リポジトリ全体のファイル構造、データ構造、現在の実装状態、ドメイン・URL混在を調査して報告する。

## Investigation Summary

### 1. ファイル構造

```text
/home/pkkatsu/aiboux
├── AIBOUX_MASTER_DOCUMENT.md
├── package.json
├── package-lock.json
├── astro.config.mjs
├── wrangler.toml
├── playwright.config.ts
├── tsconfig.json
├── schema.sql
├── db/
├── migrations/
├── public/
│   ├── brand/aiboux-logo.svg
│   └── g/
│       ├── m68.md
│       ├── l68.md
│       └── d68.md
├── src/
│   ├── middleware.ts
│   ├── worker.ts
│   ├── data/
│   │   ├── shop-sample-data.ts
│   │   └── product-master-data.ts
│   ├── layouts/
│   │   └── ShopLayout.astro
│   ├── components/shop/
│   │   ├── ShopClientShell.tsx
│   │   ├── ShopDashboard.tsx
│   │   ├── ProductsTable.tsx
│   │   ├── InventoryTable.tsx
│   │   ├── ProductEditor.tsx
│   │   └── storefront/
│   └── pages/shop/
│       ├── index.astro
│       ├── dashboard.astro
│       ├── products.astro
│       ├── orders.astro
│       ├── settings.astro
│       ├── storefront/[tenant].astro
│       ├── [tenant]/product/[id].astro
│       └── api/
```

### 2. 現在のデータ構造

- `src/data/shop-sample-data.ts` に商品、注文、在庫、顧客、売上などのサンプルデータがある。
- `src/data/product-master-data.ts` にCore / Shop連携を想定した商品マスター系データがある。
- D1前提のテーブルとして、`shop_settings`、`shop_categories`、`shop_products`、`shop_storefront_layouts`、`core_products`、`core_product_skus`、`core_channel_listings` が存在する。
- 画像はR2想定で、`SHOP_STORAGE` / `STORAGE` binding と `/shop/api/assets/[...key].ts` が存在する。
- 決済はStripe / KOMOJU系APIが存在するが、現Shopストアフロントと完全に接続済みとは判断していない。
- `src/content` やAstro content collectionsは確認できなかった。

### 3. 現在の実装状態

- Astro starterのままではない。Shopページ、管理画面、ストアフロント、API、DB migrationが多数存在する。
- Shop管理UIの多くはまだ `shop-sample-data.ts` 依存である。
- `shop.aiboux.com/` は `src/pages/shop/index.astro` のサービスサイトとして実装されている。
- `shop.aiboux.com/s/{tenant}/` は middleware / worker で `/shop/storefront/{tenant}` へ解決される。
- `shop.aiboux.com/s/{tenant}/admin` は `/shop/dashboard` 系の管理画面へ解決される。
- `src/pages/shop/storefront/[tenant].astro` はD1から `shop_products` を読む実装がある。

### 4. ドメイン・URL確認

- 実装上の正規表記は `shop.aiboux.com` である。
- `shop.aboux.com` は実装内に確認できなかった。
- `wrangler.toml`、`astro.config.mjs`、middleware / worker、Shopページ内表記はいずれも `shop.aiboux.com` 側である。
- 今後 `aboux` と書くと誤記になる。
- canonical、OGP、タイトル、本文は `shop.aiboux.com` に統一する必要がある。

### 5. 未実装・未確定箇所

- 管理画面の商品、注文、在庫一覧は、まだサンプルデータ依存が残っている。
- カートページ、チェックアウト画面、問い合わせ導線の公開ストアフロント実装は明確に確認できていない。
- 決済APIは存在するが、現ストアフロント商品データとの接続は未確定である。
- 配送、返品、特商法、プライバシー等は設定データとして存在する可能性があるが、公開ページとしての完成度は未確認である。
- Shopカテゴリページ、コレクションページも公開ストアフロントとしては未完成の可能性がある。

### 6. 触るべきファイル

- ルーティング: `src/middleware.ts`, `src/worker.ts`
- サービスサイト: `src/pages/shop/index.astro`
- ストアフロント: `src/pages/shop/storefront/[tenant].astro`, `src/components/shop/storefront/*`
- 商品詳細: `src/pages/shop/[tenant]/product/[id].astro`
- 管理画面: `src/components/shop/ShopClientShell.tsx`, `src/components/shop/ProductsTable.tsx`, `src/components/shop/InventoryTable.tsx`, `src/components/shop/ProductEditor.tsx`
- API: `src/pages/shop/api/products/*`, `src/pages/shop/api/categories/*`, `src/pages/shop/api/storefront/layout.ts`, `src/pages/shop/api/upload.ts`
- DB: `migrations/*`, `db/schema.sql`, `schema.sql`

### 7. 実装前の注意点

- `shop.aiboux.com/` をストアフロント直URLに戻してはいけない。
- テナントストアは必ず `/s/{tenant}/` に置く。
- 管理画面は必ず `/s/{tenant}/admin` に置く。
- `shop.aboux.com` 表記は使わず、`shop.aiboux.com` に統一する。
- サンプルデータとD1実データの境界を先に整理する必要がある。
- 決済、在庫、問い合わせは外部API / env依存があるため、未確認のまま本番挙動を断定しない。

### 8. 次に作るべきShop構造案

```text
shop.aiboux.com/
  Shopサービスサイト

shop.aiboux.com/s/{tenant}/
  DB-backed storefront
  - トップ
  - 商品一覧
  - 商品詳細
  - カート
  - チェックアウト
  - 特商法
  - 配送/返品
  - 問い合わせ

shop.aiboux.com/s/{tenant}/admin
  Shop管理画面
  - ダッシュボード
  - 商品管理
  - 在庫
  - 注文
  - 顧客
  - デザイン
  - 決済
  - 配送
  - 独自ドメイン
```

## Safety

- Shop実装本体は変更していない。
- UI修正は行っていない。
- DB変更は行っていない。
- Barkは送信していない。
- `git reset --hard` は実行していない。
- `git clean -fd` は実行していない。
- force pushは実行していない。
- secretは表示していない。

## Files Changed For This Log Publication

- `ops/instructions/current.md`
- `all_log/86_shop_structure_data_audit_public_log.md`
- `public/g/l68.md`

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `npx wrangler deploy`: PASS
- Worker Version ID: 最終deployごとに変わるため、最終報告で実測値を記録する。
- public `/g/l68` HTTP status: 200
- public `/g/l68` content-type: `text/markdown; charset=utf-8`
- public `/g/l68` includes `AIBOUX Shop Structure And Data Audit Public Log`: PASS
- public `/g/l68` includes `shop.aiboux.com`: PASS
- public `/g/l68` includes `shop.aboux.com`: PASS
- public `/g/l68` includes `次に作るべきShop構造案`: PASS
- `public/g/l68.md` と公開本文のsha256一致確認: PASS
