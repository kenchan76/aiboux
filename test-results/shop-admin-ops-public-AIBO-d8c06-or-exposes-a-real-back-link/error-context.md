# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-admin-ops-public.spec.ts >> AIBOUX Shop admin operations public quality >> admin product editor exposes a real back link
- Location: tests/shop-admin-ops-public.spec.ts:70:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: '商品を追加' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('heading', { name: '商品を追加' })

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
  - text: Shop / ダッシュボード
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
    - heading "AI商品登録" [level=1]
    - paragraph: JAN、画像、価格を整えて、利益を確認してから公開します。
    - text: 商品登録ウィザード
    - progressbar
    - button "1. JAN/画像"
    - button "2. 価格"
    - button "3. 公開"
    - textbox "JANコード": "4901234567894"
    - button "AIで商品情報を自動生成"
    - textbox "商品タイトル"
    - textbox "商品の魅力と使い方が伝わる説明文"
    - textbox "検索キーワード（カンマ区切り）"
    - textbox "カテゴリID"
    - textbox "Googleショッピング対応カテゴリ"
    - text: 商品画像をドラッグ＆ドロップ 画像を選択
    - button "画像を選択"
    - button "AIで白背景化とalt生成" [disabled]
    - paragraph: 先に画像を追加すると、AI画像処理を実行できます。
    - text: "登録内容 JAN: 4901234567894 商品タイトル未生成 カテゴリ未設定 画像未追加"
    - button "戻る" [disabled]
    - button "次へ"
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
  1   | import { expect, test, type Page } from "@playwright/test";
  2   | import { copyFileSync, mkdirSync } from "node:fs";
  3   | import path from "node:path";
  4   | 
  5   | const outputDir = "output/playwright/shop-admin-ops";
  6   | const publicDir = "public/g/screens";
  7   | 
  8   | async function saveScreenshot(page: Page, filename: string) {
  9   |   const outputPath = path.join(outputDir, filename);
  10  |   const publicPath = path.join(publicDir, filename);
  11  |   await page.screenshot({ path: outputPath, fullPage: true });
  12  |   copyFileSync(outputPath, publicPath);
  13  | }
  14  | 
  15  | test.describe("AIBOUX Shop admin operations public quality", () => {
  16  |   test.beforeAll(() => {
  17  |     mkdirSync(outputDir, { recursive: true });
  18  |     mkdirSync(publicDir, { recursive: true });
  19  |   });
  20  | 
  21  |   test("admin product, order, settings, design, and subscription pages are operational shells", async ({ page }) => {
  22  |     await page.setViewportSize({ width: 1980, height: 1080 });
  23  |     const pages = [
  24  |       { path: "/s/aiboux/admin/products", text: /商品|Product/i, file: "shop-admin-products.png" },
  25  |       { path: "/s/aiboux/admin/orders", text: /注文|Order/i, file: "shop-admin-orders.png" },
  26  |       { path: "/s/aiboux/admin/inventory", text: "在庫", file: "shop-admin-inventory.png" },
  27  |       { path: "/s/aiboux/admin/settings", text: /設定|Settings/i, file: "shop-admin-settings.png" },
  28  |       { path: "/s/aiboux/admin/design", text: "AIBOUX SHOP ストアデザインエディタ", file: "shop-admin-design.png" },
  29  |       { path: "/s/aiboux/admin/subscriptions", text: "定期購入", file: "shop-admin-subscriptions.png" },
  30  |     ];
  31  | 
  32  |     for (const target of pages) {
  33  |       await page.goto(`${target.path}?adminOps=${Date.now()}`, { waitUntil: "networkidle" });
  34  |       await expect(page.locator("body")).toContainText(target.text);
  35  |       await expect(page.locator("body")).not.toContainText("2024/05");
  36  |       await expect(page.locator("body")).not.toContainText("山田 太郎");
  37  |       await expect(page.locator("body")).not.toContainText("#10085");
  38  |       await expect(page.locator("body")).not.toContainText("SUBSCRIPTION_SCHEMA_PENDING");
  39  |       await expect(page.locator("body")).not.toContainText("D1 migration");
  40  |       await expect(page.locator("body")).not.toContainText("DB migration");
  41  |       await expect(page.locator("body")).not.toContainText("Provider subscription");
  42  |       await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  43  |       await saveScreenshot(page, target.file);
  44  |     }
  45  |   });
  46  | 
  47  |   test("admin subscriptions page exposes operational guidance without backend wording", async ({ page }) => {
  48  |     await page.setViewportSize({ width: 1980, height: 1080 });
  49  |     await page.goto("/s/aiboux/admin/subscriptions", { waitUntil: "networkidle" });
  50  | 
  51  |     await expect(page.getByRole("heading", { name: "定期購入" })).toBeVisible();
  52  |     await expect(page.locator('[data-testid="admin-subscription-operation-cards"]')).toBeVisible();
  53  |     const hasEmptyState = await page.locator('[data-testid="admin-subscription-empty-state"]').isVisible().catch(() => false);
  54  |     const hasTable = await page.getByRole("table").isVisible().catch(() => false);
  55  |     expect(hasEmptyState || hasTable, "subscriptions page should show either an empty state or a real table").toBe(true);
  56  |     if (hasEmptyState) {
  57  |       await expect(page.getByRole("link", { name: "商品設定を開く" })).toHaveAttribute("href", "/s/aiboux/admin/products");
  58  |       await expect(page.getByRole("link", { name: "支払い設定を確認" })).toHaveAttribute("href", "/s/aiboux/admin/settings");
  59  |     }
  60  | 
  61  |     await expect(page.locator("body")).not.toContainText("SUBSCRIPTION_SCHEMA_PENDING");
  62  |     await expect(page.locator("body")).not.toContainText("D1 migration");
  63  |     await expect(page.locator("body")).not.toContainText("DB migration");
  64  |     await expect(page.locator("body")).not.toContainText("schema");
  65  |     await expect(page.locator("body")).not.toContainText("Provider subscription");
  66  | 
  67  |     await saveScreenshot(page, "shop-admin-subscriptions-operational.png");
  68  |   });
  69  | 
  70  |   test("admin product editor exposes a real back link", async ({ page }) => {
  71  |     await page.setViewportSize({ width: 1980, height: 1080 });
  72  |     await page.goto("/s/aiboux/admin/products/new", { waitUntil: "networkidle" });
  73  | 
> 74  |     await expect(page.getByRole("heading", { name: "商品を追加" })).toBeVisible();
      |                                                                ^ Error: expect(locator).toBeVisible() failed
  75  |     await expect(page.getByRole("link", { name: "商品一覧へ戻る" })).toHaveAttribute("href", "/s/aiboux/admin/products");
  76  |     await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  77  |   });
  78  | 
  79  |   test("admin content page links to editable store wording settings", async ({ page }) => {
  80  |     await page.setViewportSize({ width: 1980, height: 1080 });
  81  |     await page.goto("/s/aiboux/admin/content", { waitUntil: "networkidle" });
  82  | 
  83  |     await expect(page.getByRole("heading", { name: "コンテンツ" })).toBeVisible();
  84  |     await expect(page.getByRole("link", { name: "ストア文言を編集" })).toHaveAttribute("href", "/s/aiboux/admin/settings");
  85  |     await expect(page.locator("body")).not.toContainText("コンテンツ保存API接続後");
  86  |     await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  87  |   });
  88  | 
  89  |   test("admin inventory CSV actions are usable controls", async ({ page }) => {
  90  |     await page.setViewportSize({ width: 1980, height: 1080 });
  91  |     await page.goto("/s/aiboux/admin/inventory", { waitUntil: "networkidle" });
  92  | 
  93  |     await expect(page.getByRole("heading", { name: "在庫" })).toBeVisible();
  94  |     await expect(page.getByRole("button", { name: "CSV取り込み" })).toBeEnabled();
  95  |     await expect(page.getByRole("button", { name: "CSV書き出し" })).toBeEnabled();
  96  |     await expect(page.locator("body")).not.toContainText("CSV取り込みAPI接続後");
  97  |     await expect(page.locator("body")).not.toContainText("CSV書き出しAPI接続後");
  98  |   });
  99  | 
  100 |   test("admin product row menu exposes real edit and duplicate actions", async ({ page }) => {
  101 |     await page.setViewportSize({ width: 1980, height: 1080 });
  102 |     await page.goto("/s/aiboux/admin/products", { waitUntil: "networkidle" });
  103 | 
  104 |     await page.getByRole("button", { name: "商品操作" }).first().click();
  105 |     await expect(page.getByRole("menuitem", { name: "編集" })).toBeVisible();
  106 |     await expect(page.getByRole("menuitem", { name: "複製して編集" })).toBeVisible();
  107 |     await expect(page.getByRole("menuitem", { name: "販売状態を編集" })).toBeVisible();
  108 |     await expect(page.getByRole("menuitem", { name: "複製" })).toHaveCount(0);
  109 |     await expect(page.getByRole("menuitem", { name: "販売状態は編集画面で変更" })).toHaveCount(0);
  110 |   });
  111 | 
  112 |   test("admin customer row menu opens detail, segment, and memo actions", async ({ page }) => {
  113 |     await page.setViewportSize({ width: 1980, height: 1080 });
  114 |     await page.goto("/s/aiboux/admin/customers", { waitUntil: "networkidle" });
  115 | 
  116 |     await page.getByRole("button", { name: /の操作/ }).first().click();
  117 |     await page.getByRole("menuitem", { name: "詳細を開く" }).click();
  118 |     await expect(page.locator('[data-testid="admin-customer-detail-panel"]')).toBeVisible();
  119 | 
  120 |     await page.getByRole("button", { name: /の操作/ }).first().click();
  121 |     await page.getByRole("menuitem", { name: "セグメントへ追加" }).click();
  122 |     await expect(page.getByText("確認対象").first()).toBeVisible();
  123 | 
  124 |     await page.getByRole("button", { name: /の操作/ }).first().click();
  125 |     await page.getByRole("menuitem", { name: "メモを編集" }).click();
  126 |     await expect(page.getByLabel(/のメモ/).first()).toBeVisible();
  127 |     await expect(page.getByRole("button", { name: "保存" }).first()).toBeEnabled();
  128 |   });
  129 | 
  130 |   test("admin account menu does not expose a disabled logout item", async ({ page }) => {
  131 |     await page.setViewportSize({ width: 1980, height: 1080 });
  132 |     await page.goto("/s/aiboux/admin", { waitUntil: "networkidle" });
  133 | 
  134 |     await page.getByRole("button", { name: /ストア管理者|管理画面/ }).click();
  135 |     await expect(page.getByRole("menuitem", { name: "管理者設定" })).toBeVisible();
  136 |     await expect(page.getByRole("menuitem", { name: "ログアウト" })).toHaveCount(0);
  137 |   });
  138 | 
  139 |   test("design editor remains a focused two-page editor", async ({ page }) => {
  140 |     await page.setViewportSize({ width: 1980, height: 1080 });
  141 |     await page.goto("/s/aiboux/admin/design", { waitUntil: "networkidle" });
  142 |     expect(new URL(page.url()).pathname).toBe("/s/aiboux/admin/design");
  143 |     await expect(page.locator("[data-shop-design-editor-shell]")).toBeVisible();
  144 |     await expect(page.getByText("TOPページ").first()).toBeVisible();
  145 |     await expect(page.getByText("商品詳細ページ").first()).toBeVisible();
  146 |     await expect(page.getByText("商品一覧ページ")).toHaveCount(0);
  147 |     await expect(page.getByText("カートページ")).toHaveCount(0);
  148 |     await expect(page.getByText("チェックアウトページ")).toHaveCount(0);
  149 |     await expect(page.getByText("編集できるのは「TOPページ」と「商品詳細ページ」のみです。")).toBeVisible();
  150 |   });
  151 | 
  152 |   test("design editor undo redo and preview device controls are usable", async ({ page }) => {
  153 |     await page.setViewportSize({ width: 1980, height: 1080 });
  154 |     await page.goto("/s/aiboux/admin/design", { waitUntil: "networkidle" });
  155 | 
  156 |     const titleInput = page.getByLabel("タイトル").first();
  157 |     await expect(titleInput).toBeVisible();
  158 |     const before = await titleInput.inputValue();
  159 | 
  160 |     await expect(page.getByRole("button", { name: "undo" })).toBeDisabled();
  161 |     await titleInput.fill(`${before} 更新`);
  162 |     await expect(page.getByRole("button", { name: "undo" })).toBeEnabled();
  163 |     await page.getByRole("button", { name: "undo" }).click();
  164 |     await expect(titleInput).toHaveValue(before);
  165 |     await expect(page.getByRole("button", { name: "redo" })).toBeEnabled();
  166 |     await page.getByRole("button", { name: "redo" }).click();
  167 |     await expect(titleInput).toHaveValue(`${before} 更新`);
  168 | 
  169 |     await page.getByRole("button", { name: "mobile preview" }).click();
  170 |     await expect(page.locator('[data-testid="store-preview-frame"]')).toHaveAttribute("data-preview-device", "mobile");
  171 |     await page.getByRole("button", { name: "desktop preview" }).click();
  172 |     await expect(page.locator('[data-testid="store-preview-frame"]')).toHaveAttribute("data-preview-device", "desktop");
  173 |   });
  174 | 
```