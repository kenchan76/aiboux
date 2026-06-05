# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-admin-ops-public.spec.ts >> AIBOUX Shop admin operations public quality >> admin product row menu exposes real edit and duplicate actions
- Location: tests/shop-admin-ops-public.spec.ts:100:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('menuitem', { name: '編集' })
Expected: visible
Error: strict mode violation: getByRole('menuitem', { name: '編集' }) resolved to 3 elements:
    1) <div tabindex="-1" role="menuitem" data-variant="default" data-orientation="vertical" data-radix-collection-item="" data-slot="dropdown-menu-item" class="group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/…>編集</div> aka getByRole('menuitem', { name: '編集', exact: true })
    2) <div tabindex="-1" role="menuitem" data-variant="default" data-orientation="vertical" data-radix-collection-item="" data-slot="dropdown-menu-item" class="group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/…>複製して編集</div> aka getByRole('menuitem', { name: '複製して編集' })
    3) <div tabindex="-1" role="menuitem" data-variant="default" data-orientation="vertical" data-radix-collection-item="" data-slot="dropdown-menu-item" class="group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/…>販売状態を編集</div> aka getByRole('menuitem', { name: '販売状態を編集' })

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('menuitem', { name: '編集' })

```

# Page snapshot

```yaml
- generic:
  - generic:
    - generic:
      - generic:
        - generic:
          - generic:
            - generic:
              - generic:
                - link:
                  - /url: /s/aiboux/admin
                  - img
                  - generic: SHOP
                - link:
                  - /url: /s/aiboux/
                  - img
            - generic:
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - list:
                          - listitem:
                            - button:
                              - img
                              - generic: ダッシュボード
                          - listitem:
                            - button:
                              - img
                              - generic: 注文管理
                          - listitem:
                            - button:
                              - img
                              - generic: 定期購入
                          - listitem:
                            - button:
                              - img
                              - generic: 商品管理
                          - listitem:
                            - button:
                              - img
                              - generic: 在庫
                          - listitem:
                            - button:
                              - img
                              - generic: カテゴリ管理
                          - listitem:
                            - button:
                              - img
                              - generic: 顧客
                          - listitem:
                            - button:
                              - img
                              - generic: コンテンツ
                          - listitem:
                            - button:
                              - img
                              - generic: 分析
                          - listitem:
                            - button:
                              - img
                              - generic: アプリ
                          - listitem:
                            - button:
                              - img
                              - generic: ストアデザイン
                          - listitem:
                            - button:
                              - img
                              - generic: 設定
            - generic:
              - generic:
                - generic: AIBOUX STORE
                - generic:
                  - generic: shop.aiboux.com
                  - img
      - main:
        - generic:
          - generic:
            - generic: Shop
            - generic: /
            - generic: 商品管理
          - button:
            - img
            - generic: ストア内を検索（注文、商品、顧客など）
            - generic: ⌘ K
          - button:
            - img
            - text: 今月
          - button:
            - img
          - button:
            - img
          - button:
            - img
          - button:
            - img
          - button:
            - generic:
              - generic: 管
            - generic:
              - generic: ストア管理者
              - generic: 管理画面
          - generic:
            - heading [level=2]: Command Palette
            - paragraph: Search for a command to run...
        - main:
          - generic:
            - generic:
              - generic:
                - generic:
                  - heading [level=1]: 商品管理
                  - paragraph: 商品名、商品番号、価格、販売状態を管理します。
                - button: 商品を追加
              - generic:
                - generic:
                  - generic:
                    - generic: Google/Bingへの送信状態
                    - paragraph: 商品保存後に自動で送信します。テスト環境では実送信せず、状態だけ記録します。
                  - button: 最新状態を確認
                - generic:
                  - table:
                    - rowgroup:
                      - row:
                        - columnheader:
                          - checkbox
                        - columnheader: 商品
                        - columnheader: 商品番号
                        - columnheader: カテゴリ
                        - columnheader: 価格
                        - columnheader: 在庫
                        - columnheader: 販売状態
                        - columnheader: 自動集客
                        - columnheader: 売上
                        - columnheader
                    - rowgroup:
                      - row:
                        - cell:
                          - checkbox
                        - cell:
                          - generic:
                            - generic: 画像
                            - generic:
                              - generic: AIBOUX公開検証商品 4580000232621
                              - generic: 検証 / AIBOUX
                        - cell: "4580000232621"
                        - cell: "166"
                        - cell: ¥2,980
                        - cell: "12"
                        - cell:
                          - generic: 公開中
                        - cell:
                          - generic:
                            - generic:
                              - generic:
                                - generic: Google
                                - generic: 要確認
                              - generic:
                                - generic: Bing
                                - generic: 要確認
                            - generic: 2026/6/3 23:26:28
                        - cell: ¥0
                        - cell:
                          - button [expanded]:
                            - img
                      - row:
                        - cell:
                          - checkbox
                        - cell:
                          - generic:
                            - generic: 画像
                            - generic:
                              - generic: 雪花セレクト ギフトタオル
                              - generic: ギフトタオル / フェイスタオル / 贈り物
                        - cell: "4901234567818"
                        - cell: Home & Garden > Linens & Bedding > Towels
                        - cell: ¥2,480
                        - cell: "18"
                        - cell:
                          - generic: 公開中
                        - cell:
                          - generic:
                            - generic:
                              - generic:
                                - generic: Google
                                - generic: 未同期
                              - generic:
                                - generic: Bing
                                - generic: 未同期
                            - generic: 保存すると自動で送信
                        - cell: ¥0
                        - cell:
                          - button:
                            - img
                      - row:
                        - cell:
                          - checkbox
                        - cell:
                          - generic:
                            - generic: 画像
                            - generic:
                              - generic: 軽量ステンレスボトル
                              - generic: ステンレスボトル / 保温 / 保冷 / 軽量
                        - cell: "4901234567895"
                        - cell: Home & Garden > Kitchen & Dining > Drinkware
                        - cell: ¥2,980
                        - cell: "24"
                        - cell:
                          - generic: 公開中
                        - cell:
                          - generic:
                            - generic:
                              - generic:
                                - generic: Google
                                - generic: 未同期
                              - generic:
                                - generic: Bing
                                - generic: 未同期
                            - generic: 保存すると自動で送信
                        - cell: ¥0
                        - cell:
                          - button:
                            - img
                      - row:
                        - cell:
                          - checkbox
                        - cell:
                          - generic:
                            - img
                            - generic:
                              - generic: 利益確認用テスト商品
                              - generic: テスト / 利益計算
                        - cell: "4901234567897"
                        - cell: Test Category
                        - cell: ¥3,000
                        - cell: "0"
                        - cell:
                          - generic: 下書き
                        - cell:
                          - generic:
                            - generic:
                              - generic:
                                - generic: Google
                                - generic: 未同期
                              - generic:
                                - generic: Bing
                                - generic: 未同期
                            - generic: 保存すると自動で送信
                        - cell: ¥0
                        - cell:
                          - button:
                            - img
                - generic:
                  - button:
                    - img
                    - text: 商品を追加
    - region "Notifications alt+T"
  - generic:
    - region:
      - generic:
        - generic:
          - generic:
            - img
            - text: AI Assistant
            - generic: Shop
          - generic: 待機中
        - button:
          - img
      - generic:
        - generic:
          - generic:
            - generic:
              - generic:
                - generic: 永続状態
                - text: この会話と入力中テキストはブラウザに保存され、MailからCoreなどへ移動しても復帰します。
              - generic:
                - generic:
                  - generic: AIBOUX OS全体を横断して支援します。Mail、Core、Shop、Fileの作業状態を保ったまま相談できます。
                  - generic: 初期
      - generic:
        - textbox:
          - /placeholder: AIに依頼する（例：取引先へ明日の会議は10時からとメール）
        - generic:
          - generic:
            - button:
              - img
            - button:
              - img
            - button: 音声テスト
          - button:
            - img
            - text: 送信
    - region "Notifications alt+T"
  - menu "商品操作" [active] [ref=e1]:
    - menuitem "編集" [ref=e2]
    - menuitem "複製して編集" [ref=e3]
    - menuitem "販売状態を編集" [ref=e4]
```

# Test source

```ts
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
  74  |     await expect(page.getByRole("heading", { name: "商品を追加" })).toBeVisible();
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
> 105 |     await expect(page.getByRole("menuitem", { name: "編集" })).toBeVisible();
      |                                                              ^ Error: expect(locator).toBeVisible() failed
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
  175 |   test("core product integration controls are not dead buttons", async ({ page }) => {
  176 |     await page.setViewportSize({ width: 1980, height: 1080 });
  177 |     await page.goto("/shop/products/integration", { waitUntil: "networkidle" });
  178 | 
  179 |     await expect(page.getByRole("heading", { name: "Core商品連携" })).toBeVisible();
  180 |     await page.getByRole("button", { name: "正本同期" }).click();
  181 |     await expect(page.locator("body")).toContainText("同期済み");
  182 | 
  183 |     await page.getByRole("button", { name: "承認へ送る" }).click();
  184 |     await expect(page.locator("body")).toContainText("承認待ち");
  185 | 
  186 |     await page.getByRole("button", { name: "下書きを保存" }).click();
  187 |     await expect(page.locator("body")).toContainText("下書き保存:");
  188 | 
  189 |     await page.getByRole("button", { name: "SKU追加" }).click();
  190 |     await expect(page.getByRole("dialog", { name: "SKUバリエーションを追加" })).toBeVisible();
  191 |     await page.getByRole("button", { name: "保存" }).click();
  192 |     await expect(page.getByRole("dialog", { name: "SKUバリエーションを追加" })).toHaveCount(0);
  193 | 
  194 |     await expect(page.locator("body")).not.toContainText("API接続後");
  195 |   });
  196 | });
  197 | 
```