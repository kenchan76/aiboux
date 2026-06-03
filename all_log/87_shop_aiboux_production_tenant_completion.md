# AIBOUX Shop aiboux Production Tenant Completion Evidence

## Status

DEPLOYED_WITH_PUBLIC_EVIDENCE

## Scope

AIBOUX Shop の `aiboux` テナントについて、公開adminとstorefrontがサンプル固定値に依存せず、D1実データを読む販売用テナントとして動くように修正した。

正しいURL:

- Service site: `https://shop.aiboux.com/`
- Storefront: `https://shop.aiboux.com/s/aiboux/`
- Admin: `https://shop.aiboux.com/s/aiboux/admin`

誤記 `shop.aboux.com` は使用しない。

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Worker

- Worker name: `aiboux`
- Worker Version ID: `51417201-5383-45b6-8393-a9c5c55611cf`
- Previous evidence publication Worker Version ID: `b9156463-a63c-4fc5-917c-f1a3ef53f235`
- Previous functional verification Worker Version ID: `6f9bca52-3b61-47ef-80dd-61c3b4022d0a`
- Deploy result: PASS
- Deploy target: `shop.aiboux.com`

## Root Cause

公開adminは `ShopClientShell` と `src/data/shop-sample-data.ts` 系のサンプル表示に依存しており、固定期間 `2024/05/13 - 2024/05/19`、固定人物名、固定売上・注文・在庫値が表示されていた。

また、storefront側には `products`、`categories`、`cart`、`checkout`、`contact`、`legal`、`privacy`、`shipping`、`returns` のテナント配下ページが不足していた。

## Changes

### Production admin

- `src/pages/shop/_ShopPage.astro`
  - production admin entryを `ShopProductionShell` に差し替え。
- `src/components/shop/ShopProductionShell.tsx`
  - D1-backed admin shellを追加。
  - dashboard / orders / products / inventory / categories / customers / content / analytics / apps / design / settings をD1 stateで表示。
  - サンプル固定値を本番admin表示から排除。
- `src/lib/shop/productionTypes.ts`
  - production admin用の型、ナビ、表示変換を追加。
- `src/pages/shop/api/admin/state.ts`
  - D1から商品、在庫、注文、顧客、カテゴリ、設定、公開ページを読み込むadmin state APIを追加。

### Storefront

- `src/pages/shop/storefront/[tenant].astro`
  - storefront topをD1商品データに接続。
  - `shop.aiboux.com` を独自ドメイン扱いせず、canonicalを `/s/{tenant}/` に固定。
- `src/components/shop/storefront/ShadcnStorefront.tsx`
  - tenant URL配下の正規リンクへ統一。
  - `href="#"` を排除。
- `src/pages/shop/[tenant]/products.astro`
- `src/pages/shop/[tenant]/categories.astro`
- `src/pages/shop/[tenant]/cart.astro`
- `src/pages/shop/[tenant]/checkout.astro`
- `src/pages/shop/[tenant]/contact.astro`
- `src/pages/shop/[tenant]/legal.astro`
- `src/pages/shop/[tenant]/privacy.astro`
- `src/pages/shop/[tenant]/shipping.astro`
- `src/pages/shop/[tenant]/returns.astro`
- `src/pages/shop/[tenant]/policy.astro`
  - storefront必須ページを追加。
- `src/pages/shop/[tenant]/product/[id].astro`
  - 商品詳細のcanonicalとJSON-LD URLを `/s/{tenant}/product/{id}` に固定。
  - 独自ドメインの場合だけ `/product/{id}` を使う。

### APIs / DB

- `src/pages/shop/api/contact.ts`
  - 問い合わせ保存APIを追加。
- `src/pages/shop/api/checkout/create-order.ts`
  - checkoutから注文・注文明細・顧客を作成するAPIを追加。
  - 決済未接続は `paymentConfigured=false` として正直に返す。
- `src/lib/server/shopStorefrontData.ts`
  - storefront用D1 loaderを追加。
- `src/lib/server/shopProductionSchema.ts`
  - D1 CLI migration権限不足時にも不足テーブル/列で500にならないよう、`CREATE TABLE IF NOT EXISTS` と不足列追加ガードを追加。
- `migrations/0020_shop_production_tenant_tables.sql`
  - production Shopに必要なテーブル定義を追加。

### Tests

- `tests/shop-production-public.spec.ts`
  - 公開URL 22本の200確認。
  - 固定サンプル文字列不在確認。
  - admin stateが実商品を返す確認。
  - storefront商品詳細、カート追加、checkout遷移確認。
  - legal/privacyの設定反映確認。

## Public URL Status

All checked URLs returned HTTP 200 after deploy.

```text
200 https://shop.aiboux.com/
200 https://shop.aiboux.com/s/aiboux/
200 https://shop.aiboux.com/s/aiboux/admin
200 https://shop.aiboux.com/s/aiboux/admin/orders
200 https://shop.aiboux.com/s/aiboux/admin/products
200 https://shop.aiboux.com/s/aiboux/admin/inventory
200 https://shop.aiboux.com/s/aiboux/admin/categories
200 https://shop.aiboux.com/s/aiboux/admin/customers
200 https://shop.aiboux.com/s/aiboux/admin/content
200 https://shop.aiboux.com/s/aiboux/admin/analytics
200 https://shop.aiboux.com/s/aiboux/admin/apps
200 https://shop.aiboux.com/s/aiboux/admin/design
200 https://shop.aiboux.com/s/aiboux/admin/settings
200 https://shop.aiboux.com/s/aiboux/products
200 https://shop.aiboux.com/s/aiboux/categories
200 https://shop.aiboux.com/s/aiboux/cart
200 https://shop.aiboux.com/s/aiboux/checkout
200 https://shop.aiboux.com/s/aiboux/contact
200 https://shop.aiboux.com/s/aiboux/legal
200 https://shop.aiboux.com/s/aiboux/privacy
200 https://shop.aiboux.com/s/aiboux/shipping
200 https://shop.aiboux.com/s/aiboux/returns
```

## Sample String Scan

Public HTML scan result: PASS

Forbidden strings checked:

- `shop.aboux.com`
- `2024/05`
- `#10085`
- `#10084`
- `#10083`
- `山田 太郎`
- `href="#"`
- `TSH-001`
- `BAG-001`
- `BTL-500`
- `PKR-002`
- `CAP-001`

## Functional Evidence

### Product create

Endpoint:

```text
POST https://shop.aiboux.com/shop/api/products/save?tenant=aiboux
```

Result:

```text
HTTP 200
success=true
productId=shopprod_tenant_001_4580000232621
publishState=published
```

### Inventory update

Endpoint:

```text
POST https://shop.aiboux.com/shop/api/inventory/update-stock?tenant=aiboux
```

Result:

```text
HTTP 200
success=true
stock=12
```

### Storefront reflection

Checked:

```text
https://shop.aiboux.com/s/aiboux/products
https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4580000232621
```

Evidence:

- product title appeared.
- price `¥2,980` appeared.
- JAN `4580000232621` appeared.
- `カートに追加` appeared.

### Checkout/order creation

Endpoint:

```text
POST https://shop.aiboux.com/shop/api/checkout/create-order?tenant=aiboux
```

Result:

```text
HTTP 200
success=true
orderNumber=SO-20260603-43171
paymentStatus=unpaid
paymentConfigured=false
```

Admin state after checkout:

- order `SO-20260603-43171` appeared.
- customer `公開検証 顧客` appeared.
- product reserved count changed to `1`.

### Settings save and policy reflection

Endpoint:

```text
POST https://shop.aiboux.com/shop/api/settings/profile?tenant=aiboux
```

Result:

```text
HTTP 200
success=true
storeName=株式会社雪花 公式ストア
businessName=株式会社雪花
email=info@aiboux.com
```

Public reflection:

- `https://shop.aiboux.com/s/aiboux/legal` includes `株式会社雪花`, `東京都千代田区`, `info@aiboux.com`.
- `https://shop.aiboux.com/s/aiboux/privacy` includes `株式会社雪花`, `info@aiboux.com`.

## Verification Commands

```text
npm run check:control-chars
npm run check:mojibake
npm run gate:aiboux
npm run astro check
ESBUILD_WORKER_THREADS=0 npm run build
npm run test || true
SHOP_PUBLIC_BASE=https://shop.aiboux.com npx playwright test tests/shop-production-public.spec.ts
npx wrangler deploy
```

Results:

```text
CONTROL_CHAR_CHECK_OK
MOJIBAKE_CHECK_OK files=287
npm run gate:aiboux: AIBOUX_GATE_PASS
astro check: 0 errors
build: PASS
npm run test || true: no npm test script exists
Playwright: 4 passed
deploy: PASS
```

## Final Public Header Evidence

After publishing `/g/l68` and `/g/d68`, public Shop responses returned:

```text
x-aiboux-worker-version: 51417201-5383-45b6-8393-a9c5c55611cf
```

Checked URLs:

```text
https://shop.aiboux.com/
https://shop.aiboux.com/s/aiboux/admin
https://shop.aiboux.com/s/aiboux/products
https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4580000232621
```

Product detail canonical and JSON-LD URL after final deploy:

```text
https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4580000232621
```

## D1 Migration Note

CLI command attempted:

```text
npx wrangler d1 migrations apply aiboux-b2b-db --remote
```

Result:

```text
Cloudflare API D1 permission failed.
```

No secret was printed.

Mitigation:

- runtime-safe schema guard added in `src/lib/server/shopProductionSchema.ts`.
- first public storefront/admin API request can create missing production Shop tables and add missing safe columns using `IF NOT EXISTS` / duplicate-column-safe logic.
- Public verification after deploy confirmed the runtime guard resolved the earlier 500s.

## Payment State

Payment is not falsely represented as connected.

Current checkout/order response:

```text
paymentConfigured=false
paymentStatus=unpaid
```

This is an honest not-configured state, not a fake production payment UI.

## Safety

- Bark was not sent.
- `git reset --hard` was not run.
- `git clean -fd` was not run.
- force push was not run.
- secrets were not printed.
- `shop.aiboux.com/` remains service site.
- storefront remains under `/s/aiboux/`.
- admin remains under `/s/aiboux/admin`.

## Remaining Risk

This evidence proves public routing, DB-backed admin state, product create/update reflection, cart/checkout navigation, order creation, settings reflection, and no fixed sample strings in fetched public HTML.

Payment provider activation remains not configured and is explicitly surfaced as not configured.
