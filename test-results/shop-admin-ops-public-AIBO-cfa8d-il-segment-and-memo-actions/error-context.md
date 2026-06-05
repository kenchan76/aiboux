# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-admin-ops-public.spec.ts >> AIBOUX Shop admin operations public quality >> admin customer row menu opens detail, segment, and memo actions
- Location: tests/shop-admin-ops-public.spec.ts:112:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.goto: Test timeout of 60000ms exceeded.
Call log:
  - navigating to "https://shop.aiboux.com/s/aiboux/admin/customers", waiting until "networkidle"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e6]:
        - generic [ref=e8]:
          - link "AIBOUX SHOP Home" [ref=e9] [cursor=pointer]:
            - /url: /s/aiboux/admin
            - img "aiboux" [ref=e10]
            - generic [ref=e11]: SHOP
          - link "ストアを開く" [ref=e12] [cursor=pointer]:
            - /url: /s/aiboux/
            - img
        - list [ref=e19]:
          - listitem [ref=e20]:
            - button "ダッシュボード" [ref=e21]:
              - img [ref=e22]
              - generic [ref=e25]: ダッシュボード
          - listitem [ref=e26]:
            - button "注文管理" [ref=e27]:
              - img [ref=e28]
              - generic [ref=e32]: 注文管理
          - listitem [ref=e33]:
            - button "定期購入" [ref=e34]:
              - img [ref=e35]
              - generic [ref=e38]: 定期購入
          - listitem [ref=e39]:
            - button "商品管理" [ref=e40]:
              - img [ref=e41]
              - generic [ref=e45]: 商品管理
          - listitem [ref=e46]:
            - button "在庫" [ref=e47]:
              - img [ref=e48]
              - generic [ref=e58]: 在庫
          - listitem [ref=e59]:
            - button "カテゴリ管理" [ref=e60]:
              - img [ref=e61]
              - generic [ref=e65]: カテゴリ管理
          - listitem [ref=e66]:
            - button "顧客" [ref=e67]:
              - img [ref=e68]
              - generic [ref=e73]: 顧客
          - listitem [ref=e74]:
            - button "コンテンツ" [ref=e75]:
              - img [ref=e76]
              - generic [ref=e79]: コンテンツ
          - listitem [ref=e80]:
            - button "分析" [ref=e81]:
              - img [ref=e82]
              - generic [ref=e84]: 分析
          - listitem [ref=e85]:
            - button "アプリ" [ref=e86]:
              - img [ref=e87]
              - generic [ref=e89]: アプリ
          - listitem [ref=e90]:
            - button "ストアデザイン" [ref=e91]:
              - img [ref=e92]
              - generic [ref=e96]: ストアデザイン
          - listitem [ref=e97]:
            - button "設定" [ref=e98]:
              - img [ref=e99]
              - generic [ref=e102]: 設定
        - generic [ref=e104]:
          - generic [ref=e105]: AIBOUX STORE
          - generic [ref=e106]:
            - generic [ref=e107]: shop.aiboux.com
            - img [ref=e108]
      - main [ref=e112]:
        - generic [ref=e113]:
          - generic [ref=e114]:
            - generic [ref=e115]: Shop
            - generic [ref=e116]: /
            - generic [ref=e117]: 顧客
          - button "ストア検索を開く" [ref=e118]:
            - img [ref=e119]
            - generic [ref=e122]: ストア内を検索（注文、商品、顧客など）
            - generic [ref=e123]: ⌘ K
          - button "今月" [ref=e124]:
            - img
            - text: 今月
          - button "フィルター" [ref=e125]:
            - img
          - button "アプリ切替" [ref=e126]:
            - img
          - button "通知" [ref=e127]:
            - img
          - button "ヘルプ" [ref=e128]:
            - img
          - button "管 ストア管理者 管理画面" [ref=e129]:
            - generic [ref=e131]: 管
            - generic [ref=e132]:
              - generic [ref=e133]: ストア管理者
              - generic [ref=e134]: 管理画面
          - generic [ref=e135]:
            - heading "Command Palette" [level=2] [ref=e136]
            - paragraph [ref=e137]: Search for a command to run...
        - main [ref=e138]:
          - generic [ref=e140]:
            - generic [ref=e141]:
              - generic [ref=e142]:
                - heading "顧客" [level=1] [ref=e143]
                - paragraph [ref=e144]: 購入履歴、タグ、メモ、セグメントを管理します。
              - generic [ref=e145]:
                - img
                - textbox "顧客名・メールで検索" [ref=e146]
            - generic [ref=e147]:
              - generic [ref=e149]: 顧客一覧
              - table [ref=e152]:
                - rowgroup [ref=e153]:
                  - row "顧客 注文回数 合計購入額 最終注文日 タグ メモ" [ref=e154]:
                    - columnheader "顧客" [ref=e155]
                    - columnheader "注文回数" [ref=e156]
                    - columnheader "合計購入額" [ref=e157]
                    - columnheader "最終注文日" [ref=e158]
                    - columnheader "タグ" [ref=e159]
                    - columnheader "メモ" [ref=e160]
                    - columnheader [ref=e161]
                - rowgroup [ref=e162]:
                  - row "顧客データはまだありません。購入が発生すると注文履歴と一緒に表示されます。" [ref=e163]:
                    - cell "顧客データはまだありません。購入が発生すると注文履歴と一緒に表示されます。" [ref=e164]
    - region "Notifications alt+T"
  - generic [ref=e165]:
    - region "AIBOUX Global AI Assistant" [ref=e166]:
      - generic [ref=e167]:
        - generic [ref=e168]:
          - generic [ref=e169]:
            - img [ref=e170]
            - text: AI Assistant
            - generic [ref=e173]: Shop
          - generic [ref=e174]: 待機中
        - button "AI Assistantを閉じる" [ref=e175]:
          - img
      - generic [ref=e179]:
        - generic [ref=e180]:
          - generic [ref=e181]: 永続状態
          - text: この会話と入力中テキストはブラウザに保存され、MailからCoreなどへ移動しても復帰します。
        - generic [ref=e183]:
          - generic [ref=e184]: AIBOUX OS全体を横断して支援します。Mail、Core、Shop、Fileの作業状態を保ったまま相談できます。
          - generic [ref=e185]: 初期
      - generic [ref=e186]:
        - textbox "AIに依頼する（例：取引先へ明日の会議は10時からとメール）" [ref=e187]
        - generic [ref=e188]:
          - generic [ref=e189]:
            - button "音声入力" [ref=e190]:
              - img
            - button "添付" [ref=e191]:
              - img
            - button "音声テスト" [ref=e192]
          - button "送信" [ref=e193]:
            - img
            - text: 送信
    - region "Notifications alt+T"
```

# Test source

```ts
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
  105 |     await expect(page.getByRole("menuitem", { name: "編集" })).toBeVisible();
  106 |     await expect(page.getByRole("menuitem", { name: "複製して編集" })).toBeVisible();
  107 |     await expect(page.getByRole("menuitem", { name: "販売状態を編集" })).toBeVisible();
  108 |     await expect(page.getByRole("menuitem", { name: "複製" })).toHaveCount(0);
  109 |     await expect(page.getByRole("menuitem", { name: "販売状態は編集画面で変更" })).toHaveCount(0);
  110 |   });
  111 | 
  112 |   test("admin customer row menu opens detail, segment, and memo actions", async ({ page }) => {
  113 |     await page.setViewportSize({ width: 1980, height: 1080 });
> 114 |     await page.goto("/s/aiboux/admin/customers", { waitUntil: "networkidle" });
      |                ^ Error: page.goto: Test timeout of 60000ms exceeded.
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