# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-admin-ops-public.spec.ts >> AIBOUX Shop admin operations public quality >> core product integration controls are not dead buttons
- Location: tests/shop-admin-ops-public.spec.ts:175:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: '下書きを保存' })
    - locator resolved to <button data-slot="button" data-size="default" data-variant="default" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-d…>下書きを保存</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <header class="flex h-12 shrink-0 items-center justify-between border-b border-neutral-200 px-3">…</header> from <astro-island prefix="r5" uid="1V6D9n" client="load" props="{"service":[0,"Shop"]}" component-export="GlobalAIAssistant" renderer-url="/_astro/client.Dh7gFNIG.js" opts="{"name":"GlobalAIAssistant","value":true}" component-url="/_astro/GlobalAIAssistant.Bcg-k2li.js">…</astro-island> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <header class="flex h-12 shrink-0 items-center justify-between border-b border-neutral-200 px-3">…</header> from <astro-island prefix="r5" uid="1V6D9n" client="load" props="{"service":[0,"Shop"]}" component-export="GlobalAIAssistant" renderer-url="/_astro/client.Dh7gFNIG.js" opts="{"name":"GlobalAIAssistant","value":true}" component-url="/_astro/GlobalAIAssistant.Bcg-k2li.js">…</astro-island> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    120 × waiting for element to be visible, enabled and stable
        - element is visible, enabled and stable
        - scrolling into view if needed
        - done scrolling
        - <header class="flex h-12 shrink-0 items-center justify-between border-b border-neutral-200 px-3">…</header> from <astro-island prefix="r5" uid="1V6D9n" client="load" props="{"service":[0,"Shop"]}" component-export="GlobalAIAssistant" renderer-url="/_astro/client.Dh7gFNIG.js" opts="{"name":"GlobalAIAssistant","value":true}" component-url="/_astro/GlobalAIAssistant.Bcg-k2li.js">…</astro-island> subtree intercepts pointer events
      - retrying click action
        - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - heading "Core商品連携" [level=1] [ref=e6]
        - paragraph [ref=e7]: Core正本からShop親商品、SKUバリエーション、3大モール下書きまでを承認付きで管理します。
      - generic [ref=e8]:
        - combobox [ref=e9]:
          - generic: ミネラルウォーター 500ml
          - img
        - button "正本同期" [ref=e10]:
          - img
          - text: 正本同期
        - button "承認へ送る" [active] [ref=e11]:
          - img
          - text: 承認へ送る
    - generic [ref=e12]:
      - generic [ref=e13]:
        - tablist [ref=e14]:
          - tab "Core正本" [selected] [ref=e15]
          - tab "SKUバリエーション" [ref=e16]
          - tab "3大モール下書き" [ref=e17]
          - tab "AI補完確認" [ref=e18]
        - tabpanel "Core正本" [ref=e19]:
          - generic [ref=e20]:
            - generic [ref=e21]:
              - generic [ref=e22]: ミネラルウォーター 500ml
              - generic [ref=e23]: 4900000000000 / 入数 24 / 500ml / ラベルレス / 軟水
            - generic [ref=e24]:
              - generic [ref=e25]:
                - generic [ref=e26]: 標準価格
                - generic [ref=e27]: ￥120
              - generic [ref=e28]:
                - generic [ref=e29]: 現在庫
                - generic [ref=e30]: 864 本
              - generic [ref=e31]:
                - generic [ref=e32]: Shop連携
                - generic [ref=e33]: 連携済み
              - generic [ref=e34]: 日常備蓄とイベント販売に使える500mlペットボトル飲料。ケース販売とセット販売に対応。
      - generic [ref=e35]:
        - generic [ref=e36]:
          - generic [ref=e37]: 連携状態
          - generic [ref=e38]: Shop/Mall/Mail/File/Docsに流れる文脈
        - generic [ref=e39]:
          - generic [ref=e40]:
            - generic [ref=e41]:
              - img [ref=e42]
              - text: Core商品正本
            - generic [ref=e47]: 同期済み
          - generic [ref=e48]:
            - generic [ref=e49]:
              - img [ref=e50]
              - text: Shop親商品
            - generic [ref=e54]: published
          - generic [ref=e55]:
            - generic [ref=e56]:
              - img [ref=e57]
              - text: SKU数
            - generic [ref=e61]: 3 件
          - generic [ref=e62]:
            - generic [ref=e63]:
              - img [ref=e64]
              - text: モール下書き
            - generic [ref=e68]: 2 件
          - generic [ref=e69]:
            - generic [ref=e70]:
              - img [ref=e71]
              - text: 承認状態
            - generic [ref=e74]: 承認待ち
          - button "下書きを保存" [ref=e75]
  - generic:
    - region "Notifications alt+T"
  - generic [ref=e76]:
    - region "AIBOUX Global AI Assistant" [ref=e77]:
      - generic [ref=e78]:
        - generic [ref=e79]:
          - generic [ref=e80]:
            - img [ref=e81]
            - text: AI Assistant
            - generic [ref=e84]: Shop
          - generic [ref=e85]: 待機中
        - button "AI Assistantを閉じる" [ref=e86]:
          - img
      - generic [ref=e90]:
        - generic [ref=e91]:
          - generic [ref=e92]: 永続状態
          - text: この会話と入力中テキストはブラウザに保存され、MailからCoreなどへ移動しても復帰します。
        - generic [ref=e94]:
          - generic [ref=e95]: AIBOUX OS全体を横断して支援します。Mail、Core、Shop、Fileの作業状態を保ったまま相談できます。
          - generic [ref=e96]: 初期
      - generic [ref=e97]:
        - textbox "AIに依頼する（例：取引先へ明日の会議は10時からとメール）" [ref=e98]
        - generic [ref=e99]:
          - generic [ref=e100]:
            - button "音声入力" [ref=e101]:
              - img
            - button "添付" [ref=e102]:
              - img
            - button "音声テスト" [ref=e103]
          - button "送信" [ref=e104]:
            - img
            - text: 送信
    - region "Notifications alt+T"
```

# Test source

```ts
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
> 186 |     await page.getByRole("button", { name: "下書きを保存" }).click();
      |                                                        ^ Error: locator.click: Test timeout of 60000ms exceeded.
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