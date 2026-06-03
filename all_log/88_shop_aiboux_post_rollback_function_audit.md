# Shop Aiboux Post-Rollback Function Audit

## Status

BLOCKED_METHOD

## Scope

This audit verifies the public Shop state after rollback.
No design changes, CSS changes, layout changes, DB writes, migrations, deploy, Bark send, reset, clean, force push, or secret display were performed.

## Reason For Method Change

The previous Shop production-tenant implementation degraded the public UI and behavior.
The user confirmed the rollback is visible and instructed that the design must not be touched.
The current method is verification-only first.

## Public Worker

- Public admin URL: `https://shop.aiboux.com/s/aiboux/admin`
- Public rollback Worker Version ID header: `e4d53580-8a17-4de9-98f4-f64e4b1178e6`
- Previous degraded deployment is not the current public response.

## Public Route Results

| HTTP | URL | Finding |
| --- | --- | --- |
| 200 | `https://shop.aiboux.com/` | Shop service site is reachable. |
| 200 | `https://shop.aiboux.com/s/aiboux/` | Storefront top is reachable. |
| 200 | `https://shop.aiboux.com/s/aiboux/admin` | Admin dashboard is reachable. |
| 200 | `https://shop.aiboux.com/s/aiboux/admin/orders` | Admin orders page is reachable. |
| 200 | `https://shop.aiboux.com/s/aiboux/admin/products` | Admin products page is reachable. |
| 200 | `https://shop.aiboux.com/s/aiboux/admin/inventory` | Admin inventory page is reachable. |
| 200 | `https://shop.aiboux.com/s/aiboux/admin/categories` | Admin categories page is reachable. |
| 200 | `https://shop.aiboux.com/s/aiboux/admin/customers` | Admin customers page is reachable. |
| 200 | `https://shop.aiboux.com/s/aiboux/admin/content` | Admin content page is reachable. |
| 200 | `https://shop.aiboux.com/s/aiboux/admin/analytics` | Admin analytics page is reachable. |
| 200 | `https://shop.aiboux.com/s/aiboux/admin/apps` | Admin apps page is reachable. |
| 200 | `https://shop.aiboux.com/s/aiboux/admin/design` | NG: route is reachable but renders dashboard title/H1, not the design screen. |
| 200 | `https://shop.aiboux.com/s/aiboux/admin/settings` | Admin settings page is reachable. |
| 404 | `https://shop.aiboux.com/s/aiboux/products` | NG: storefront product-list route is missing. |
| 404 | `https://shop.aiboux.com/s/aiboux/categories` | NG: storefront category route is missing. |
| 404 | `https://shop.aiboux.com/s/aiboux/cart` | NG: storefront cart route is missing. |
| 404 | `https://shop.aiboux.com/s/aiboux/checkout` | NG: storefront checkout route is missing. |
| 404 | `https://shop.aiboux.com/s/aiboux/contact` | NG: storefront contact route is missing. |
| 404 | `https://shop.aiboux.com/s/aiboux/legal` | NG: storefront legal route is missing. |
| 404 | `https://shop.aiboux.com/s/aiboux/privacy` | NG: storefront privacy route is missing. |
| 404 | `https://shop.aiboux.com/s/aiboux/shipping` | NG: storefront shipping route is missing. |
| 404 | `https://shop.aiboux.com/s/aiboux/returns` | NG: storefront returns route is missing. |
| 200 | `https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4580000232621` | Product detail is reachable. |
| 200 | `https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4901234567895` | Product detail is reachable. |
| 200 | `https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4901234567818` | Product detail is reachable. |
| 200 | `https://mail.aiboux.com/g/m68` | Existing public master is reachable. |
| 200 | `https://mail.aiboux.com/g/l68` | Existing public log is reachable, but not updated by this audit. |
| 200 | `https://mail.aiboux.com/g/d68` | Existing public screen artifact is reachable, but not updated by this audit. |

## Asset Results

| HTTP | Asset |
| --- | --- |
| 200 | `/_astro/global.Btdp548K.css` |
| 200 | `/_astro/client.Dh7gFNIG.js` |
| 200 | `/_astro/ShopClientShell.BdM_QXTf.js` |
| 200 | `/_astro/GlobalAIAssistant.CvuP8XaP.js` |

## Link Findings

- `shop.aboux.com` was not found in the checked public root, storefront, or admin HTML.
- `href="#"` appears on the storefront top through the visible `AIBOUX STORE` link.
- Admin HTML contains old route link `href="/shop/products"` through `商品別売上を開く`.
- Admin shell contains `SHOP` links to `/shop`, which is a non-tenant route and should not be mixed into tenant admin without an explicit reason.

## Sample And Demo Dependency Findings

The public admin still displays sample/fixed data from the rollback baseline.
This is not a production-complete sales tenant.

Observed public fixed values:

- `2024/05/13 - 2024/05/19`
- `山田 太郎`
- `#10085`, `#10084`, `#10083`, `#10082`, `#10081`
- `佐藤 花子`, `鈴木 一郎`, `田中 美咲`, `高橋 大輔`, `伊藤 優子`
- `TSH-001-WHT`, `BAG-001-BLK`, `BTL-500-SLV`, `PKR-002-GRY`, `CAP-001-NVY`

Source scan confirms the Shop admin is still backed by `src/data/shop-sample-data.ts` and components importing it.

Important source references:

- `src/data/shop-sample-data.ts`
- `src/components/shop/ShopClientShell.tsx`
- `src/components/shop/ShopDashboard.tsx`
- `src/components/shop/ShopRecentOrders.tsx`
- `src/components/shop/ProductsTable.tsx`
- `src/components/shop/InventoryTable.tsx`
- `src/components/shop/CustomersTable.tsx`
- `src/components/shop/ShopAnalytics.tsx`
- `src/components/shop/ShopAppsPanel.tsx`
- `src/components/shop/ShopTopbar.tsx`
- `src/components/shop/ShopSidebar.tsx`
- `src/components/shop/storefront/ShopStorefrontHome.tsx`

## Button And Interaction Findings

Read-only Playwright verification was run on public URLs.
No save, delete, migration, deployment, or DB-writing action was submitted.

Observed NG:

- On `https://shop.aiboux.com/s/aiboux/admin/products`, normal user-style click on `商品を追加` timed out because `GlobalAIAssistant` overlay intercepted pointer events.
- This means at least one primary admin action is not proven usable in the public rollback state.
- `https://shop.aiboux.com/s/aiboux/admin/design` shows dashboard content rather than a design/settings screen.
- `CSV取り込み` on inventory is disabled.
- `コンテンツを作成` on content is disabled.

Unverified because destructive writes were intentionally not performed:

- Product create save persistence.
- Product edit persistence.
- Inventory save persistence.
- Category save persistence.
- Settings save persistence.
- Checkout order creation.
- Contact submission.
- Payment connection.
- DB reflection.

## Current Honest Conclusion

The public UI has been rolled back to the earlier visual baseline, but the Shop tenant is not functionally complete.
The current state has reachable admin pages and a reachable storefront top/product detail pages, but it still has missing storefront routes, old non-tenant links, sample data, disabled actions, a design route fallback issue, and at least one click interception issue.

This audit does not claim `CODE_READY`, `PREVIEW_READY`, `DEPLOYED`, `FINAL_ACCEPTED`, or `COMPLETED`.

## Check Results

| Command | Result | Note |
| --- | --- | --- |
| `npm run check:control-chars` | PASS | `CONTROL_CHAR_CHECK_OK` |
| `npm run check:mojibake` | PASS | `MOJIBAKE_CHECK_OK files=289` |
| `npm run gate:aiboux` | PASS | `AIBOUX_GATE_PASS`; this confirms project gates, not Shop feature completion. |

`npm run gate:aiboux` internally reported astro check and build PASS.
No separate deploy was run.

## Safe Next Method

Future implementation must preserve the current visual baseline and change only behavior in small slices:

1. Fix route/link correctness without changing layout or CSS.
2. Fix click interception without redesigning the UI.
3. Add missing storefront pages using the existing visual language only.
4. Replace sample data with honest empty states or real D1 data without changing component appearance.
5. Add persistence tests before any deployment.
6. Publish `/g/l68` only through a safe log-only deployment or after the protected implementation passes public verification.

## Commands Run

```bash
curl -sS -L -D ... https://shop.aiboux.com/ ...
curl -sS -L -D ... https://shop.aiboux.com/s/aiboux/ ...
curl -sS -L -D ... https://shop.aiboux.com/s/aiboux/admin ...
curl -sS -L -D ... route matrix ...
node Playwright public DOM read-only audit
rg "shop-sample-data|sample|mock|demo|dummy|山田|佐藤|鈴木|田中|高橋|伊藤|2024/05|#10085|#10084|#10083|TSH-001|BAG-001|BTL-500|PKR-002|CAP-001|GlobalAIAssistant" src/pages src/components src/data
rg "href=\"#\"|javascript:void|/shop/products|shop\\.aboux\\.com|shop\\.aiboux\\.com" src/pages src/components src/data
```

## Prohibited Actions Confirmation

- No design change.
- No CSS change.
- No layout change.
- No DB write.
- No migration apply.
- No deploy.
- No Bark send.
- No reset.
- No clean.
- No force push.
- No secret display.
