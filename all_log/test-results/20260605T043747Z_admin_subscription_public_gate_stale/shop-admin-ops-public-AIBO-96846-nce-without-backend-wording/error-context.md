# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-admin-ops-public.spec.ts >> AIBOUX Shop admin operations public quality >> admin subscriptions page exposes operational guidance without backend wording
- Location: tests/shop-admin-ops-public.spec.ts:46:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="admin-subscription-operation-cards"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-testid="admin-subscription-operation-cards"]')

```

```yaml
- link "AIBOUX SHOP Home":
  - /url: /s/aiboux/admin
  - img "aiboux"
  - text: SHOP
- link "ストアを開く":
  - /url: /s/aiboux/
- list:
  - listitem:
    - button "ダッシュボード"
  - listitem:
    - button "注文管理"
  - listitem:
    - button "定期購入"
  - listitem:
    - button "商品管理"
  - listitem:
    - button "在庫"
  - listitem:
    - button "カテゴリ管理"
  - listitem:
    - button "顧客"
  - listitem:
    - button "コンテンツ"
  - listitem:
    - button "分析"
  - listitem:
    - button "アプリ"
  - listitem:
    - button "ストアデザイン"
  - listitem:
    - button "設定"
- text: AIBOUX STORE shop.aiboux.com
- main:
  - text: Shop / 定期購入
  - button "ストア検索を開く": ストア内を検索（注文、商品、顧客など） ⌘ K
  - button "今月"
  - button "フィルター"
  - button "アプリ切替"
  - button "通知"
  - button "ヘルプ"
  - button "管 ストア管理者 管理画面"
  - heading "Command Palette" [level=2]
  - paragraph: Search for a command to run...
  - main:
    - heading "定期購入" [level=1]
    - paragraph: 定期購入契約、次回請求日、次回配送日、停止・再開・スキップ・解約を確認します。
    - button "再読込"
    - text: 定期購入の受付状態を確認してください。受付開始後にお申し込みいただけます。 定期購入はまだありません。商品詳細から定期購入を選ぶと、決済設定確認後にここへ表示します。
- region "Notifications alt+T"
- region "AIBOUX Global AI Assistant":
  - text: AI Assistant Shop 待機中
  - button "AI Assistantを閉じる"
  - text: 永続状態 この会話と入力中テキストはブラウザに保存され、MailからCoreなどへ移動しても復帰します。 AIBOUX OS全体を横断して支援します。Mail、Core、Shop、Fileの作業状態を保ったまま相談できます。 初期
  - textbox "AIに依頼する（例：取引先へ明日の会議は10時からとメール）"
  - button "音声入力"
  - button "添付"
  - button "音声テスト"
  - button "送信"
- region "Notifications alt+T"
```

# Test source

```ts
  1  | import { expect, test, type Page } from "@playwright/test";
  2  | import { copyFileSync, mkdirSync } from "node:fs";
  3  | import path from "node:path";
  4  | 
  5  | const outputDir = "output/playwright/shop-admin-ops";
  6  | const publicDir = "public/g/screens";
  7  | 
  8  | async function saveScreenshot(page: Page, filename: string) {
  9  |   const outputPath = path.join(outputDir, filename);
  10 |   const publicPath = path.join(publicDir, filename);
  11 |   await page.screenshot({ path: outputPath, fullPage: true });
  12 |   copyFileSync(outputPath, publicPath);
  13 | }
  14 | 
  15 | test.describe("AIBOUX Shop admin operations public quality", () => {
  16 |   test.beforeAll(() => {
  17 |     mkdirSync(outputDir, { recursive: true });
  18 |     mkdirSync(publicDir, { recursive: true });
  19 |   });
  20 | 
  21 |   test("admin product, order, settings, design, and subscription pages are operational shells", async ({ page }) => {
  22 |     await page.setViewportSize({ width: 1980, height: 1080 });
  23 |     const pages = [
  24 |       { path: "/s/aiboux/admin/products", text: /商品|Product/i, file: "shop-admin-products.png" },
  25 |       { path: "/s/aiboux/admin/orders", text: /注文|Order/i, file: "shop-admin-orders.png" },
  26 |       { path: "/s/aiboux/admin/settings", text: /設定|Settings/i, file: "shop-admin-settings.png" },
  27 |       { path: "/s/aiboux/admin/design", text: "AIBOUX SHOP ストアデザインエディタ", file: "shop-admin-design.png" },
  28 |       { path: "/s/aiboux/admin/subscriptions", text: "定期購入", file: "shop-admin-subscriptions.png" },
  29 |     ];
  30 | 
  31 |     for (const target of pages) {
  32 |       await page.goto(`${target.path}?adminOps=${Date.now()}`, { waitUntil: "networkidle" });
  33 |       await expect(page.locator("body")).toContainText(target.text);
  34 |       await expect(page.locator("body")).not.toContainText("2024/05");
  35 |       await expect(page.locator("body")).not.toContainText("山田 太郎");
  36 |       await expect(page.locator("body")).not.toContainText("#10085");
  37 |       await expect(page.locator("body")).not.toContainText("SUBSCRIPTION_SCHEMA_PENDING");
  38 |       await expect(page.locator("body")).not.toContainText("D1 migration");
  39 |       await expect(page.locator("body")).not.toContainText("DB migration");
  40 |       await expect(page.locator("body")).not.toContainText("Provider subscription");
  41 |       await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  42 |       await saveScreenshot(page, target.file);
  43 |     }
  44 |   });
  45 | 
  46 |   test("admin subscriptions page exposes operational guidance without backend wording", async ({ page }) => {
  47 |     await page.setViewportSize({ width: 1980, height: 1080 });
  48 |     await page.goto("/s/aiboux/admin/subscriptions", { waitUntil: "networkidle" });
  49 | 
  50 |     await expect(page.getByRole("heading", { name: "定期購入" })).toBeVisible();
> 51 |     await expect(page.locator('[data-testid="admin-subscription-operation-cards"]')).toBeVisible();
     |                                                                                      ^ Error: expect(locator).toBeVisible() failed
  52 |     const hasEmptyState = await page.locator('[data-testid="admin-subscription-empty-state"]').isVisible().catch(() => false);
  53 |     const hasTable = await page.getByRole("table").isVisible().catch(() => false);
  54 |     expect(hasEmptyState || hasTable, "subscriptions page should show either an empty state or a real table").toBe(true);
  55 |     if (hasEmptyState) {
  56 |       await expect(page.getByRole("link", { name: "商品設定を開く" })).toHaveAttribute("href", "/s/aiboux/admin/products");
  57 |       await expect(page.getByRole("link", { name: "支払い設定を確認" })).toHaveAttribute("href", "/s/aiboux/admin/settings");
  58 |     }
  59 | 
  60 |     await expect(page.locator("body")).not.toContainText("SUBSCRIPTION_SCHEMA_PENDING");
  61 |     await expect(page.locator("body")).not.toContainText("D1 migration");
  62 |     await expect(page.locator("body")).not.toContainText("DB migration");
  63 |     await expect(page.locator("body")).not.toContainText("schema");
  64 |     await expect(page.locator("body")).not.toContainText("Provider subscription");
  65 | 
  66 |     await saveScreenshot(page, "shop-admin-subscriptions-operational.png");
  67 |   });
  68 | 
  69 |   test("design editor remains a focused two-page editor", async ({ page }) => {
  70 |     await page.setViewportSize({ width: 1980, height: 1080 });
  71 |     await page.goto("/s/aiboux/admin/design", { waitUntil: "networkidle" });
  72 |     expect(new URL(page.url()).pathname).toBe("/s/aiboux/admin/design");
  73 |     await expect(page.locator("[data-shop-design-editor-shell]")).toBeVisible();
  74 |     await expect(page.getByText("TOPページ").first()).toBeVisible();
  75 |     await expect(page.getByText("商品詳細ページ").first()).toBeVisible();
  76 |     await expect(page.getByText("商品一覧ページ")).toHaveCount(0);
  77 |     await expect(page.getByText("カートページ")).toHaveCount(0);
  78 |     await expect(page.getByText("チェックアウトページ")).toHaveCount(0);
  79 |     await expect(page.getByText("編集できるのは「TOPページ」と「商品詳細ページ」のみです。")).toBeVisible();
  80 |   });
  81 | });
  82 | 
```