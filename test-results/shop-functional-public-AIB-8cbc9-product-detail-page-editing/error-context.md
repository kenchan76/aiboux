# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-functional-public.spec.ts >> AIBOUX Shop public functional hardening >> store design editor exposes only top and product detail page editing
- Location: tests/shop-functional-public.spec.ts:112:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('AIBOUX SHOP ストアデザインエディタ')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('AIBOUX SHOP ストアデザインエディタ')

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
    - heading "ダッシュボード" [level=1]
    - paragraph: ストアの最新状況を確認しましょう。
    - button "商品を追加"
    - button "在庫を更新"
    - text: 今日やること 発送待ちの注文 0件
    - paragraph: 発送待ちはありません。
    - button "注文を見る"
    - text: 在庫が少ない商品 0件
    - paragraph: 在庫不足の注意はありません。
    - button "在庫を見る"
    - text: 商品ページの見直し 0件
    - paragraph: 見直しが必要な商品はありません。
    - button "商品を見る"
    - text: 集客とSEOの設定状態
    - paragraph: 商品データと連携設定が揃うと、画像最適化、Google/Bing向け同期、在庫状態の反映を確認できます。未設定の項目は「設定」から有効化します。
    - text: "AI画像最適化 未設定 Google/Bing同期 未設定 在庫状態を自動反映 未設定 現在の自動送信: 同期中 0件 / 送信済み 0件"
    - button "商品の同期状態を見る"
    - button "自動化設定"
    - text: 売上 ¥0 注文データ未連携 注文数 0件 注文はまだありません コンバージョン率 未集計 計測設定が必要です 平均注文単価 未集計 注文確定後に集計します リピーター率 未集計 顧客データ連携後に表示します 売上の動き ¥0 ▲ 0.0% 日別表示
    - application
    - text: ベストセラー商品
    - combobox: 今週
    - text: 商品別売上はまだありません。商品を登録し、注文が入ると集計します。
    - link "商品別売上を開く":
      - /url: /s/aiboux/admin/products
    - text: 最近の注文
    - button "すべて見る"
    - table:
      - rowgroup:
        - row "注文番号 日時 お客様 合計金額 支払い 発送準備":
          - columnheader "注文番号"
          - columnheader "日時"
          - columnheader "お客様"
          - columnheader "合計金額"
          - columnheader "支払い"
          - columnheader "発送準備"
      - rowgroup:
        - row "注文はまだありません。注文が入ると、支払い状態・発送状態・帳票操作がここに表示されます。":
          - cell "注文はまだありません。注文が入ると、支払い状態・発送状態・帳票操作がここに表示されます。"
    - text: 在庫アラート
    - button "すべて見る"
    - text: 在庫アラートはありません。商品と在庫を登録すると注意が必要なSKUを表示します。
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
  15  |   "/s/aiboux/admin/apps",
  16  |   "/s/aiboux/admin/design",
  17  |   "/s/aiboux/admin/settings",
  18  |   "/s/aiboux/products",
  19  |   "/s/aiboux/categories",
  20  |   "/s/aiboux/cart",
  21  |   "/s/aiboux/checkout",
  22  |   "/s/aiboux/contact",
  23  |   "/s/aiboux/legal",
  24  |   "/s/aiboux/privacy",
  25  |   "/s/aiboux/shipping",
  26  |   "/s/aiboux/returns",
  27  | ];
  28  | 
  29  | const forbiddenDemoTexts = [
  30  |   "2024/05",
  31  |   "山田 太郎",
  32  |   "¥2,340,000",
  33  |   "245件",
  34  |   "2.35%",
  35  |   "¥9,551",
  36  |   "28.7%",
  37  |   "TSH-001",
  38  |   "BAG-001",
  39  |   "BTL-500",
  40  |   "#10085",
  41  |   "#10084",
  42  |   "#10083",
  43  |   "shop.aboux.com",
  44  | ];
  45  | 
  46  | test.describe("AIBOUX Shop public functional hardening", () => {
  47  |   test.beforeAll(() => {
  48  |     mkdirSync("output/playwright/shop-functional", { recursive: true });
  49  |   });
  50  | 
  51  |   test("all target public URLs return usable HTML", async ({ page, request }) => {
  52  |     for (const url of shopUrls) {
  53  |       const response = await request.get(url);
  54  |       expect(response.status(), url).toBe(200);
  55  |       const contentType = response.headers()["content-type"] ?? "";
  56  |       expect(contentType, url).toContain("text/html");
  57  |     }
  58  | 
  59  |     await page.goto("/s/aiboux/admin");
  60  |     const bodyText = await page.locator("body").innerText();
  61  |     for (const text of forbiddenDemoTexts) {
  62  |       expect(bodyText, `demo text should be absent: ${text}`).not.toContain(text);
  63  |     }
  64  |     await page.screenshot({ path: "output/playwright/shop-functional/admin-demo-free-1980.png", fullPage: true });
  65  |   });
  66  | 
  67  |   test("storefront cart, checkout, and contact behave honestly", async ({ page }) => {
  68  |     await page.goto("/s/aiboux/cart");
  69  |     await page.evaluate(() => {
  70  |       localStorage.setItem(
  71  |         "aiboux:shop:aiboux:cart",
  72  |         JSON.stringify([{ id: "playwright-product", name: "Playwright検証商品", price: 1200, image: "", quantity: 1 }]),
  73  |       );
  74  |       window.location.reload();
  75  |     });
  76  |     await expect(page.getByText("Playwright検証商品")).toBeVisible();
  77  |     const quantity = page.locator("[data-cart-qty]").first();
  78  |     await quantity.fill("3");
  79  |     await expect(page.getByText("¥3,600")).toBeVisible();
  80  |     await page.locator("[data-cart-remove]").first().click();
  81  |     await expect(page.getByText("カートは空です。商品を追加するとここに表示されます。")).toBeVisible();
  82  | 
  83  |     await page.goto("/s/aiboux/checkout");
  84  |     await expect(page.getByText("決済設定が必要です")).toBeVisible();
  85  |     await expect(page.getByText("注文が確定しました")).toHaveCount(0);
  86  |     await expect(page.getByText("支払いが完了しました")).toHaveCount(0);
  87  | 
  88  |     await page.goto("/s/aiboux/contact");
  89  |     await page.getByRole("button", { name: "入力内容を確認" }).click();
  90  |     await expect(page.getByText("お名前を入力してください。")).toBeVisible();
  91  |     await page.locator("input[name='name']").fill("検証 太郎");
  92  |     await page.locator("input[name='email']").fill("invalid-email");
  93  |     await page.locator("textarea[name='message']").fill("問い合わせ検証です。");
  94  |     await page.getByRole("button", { name: "入力内容を確認" }).click();
  95  |     await expect(page.getByText("正しいメールアドレスを入力してください。")).toBeVisible();
  96  |     await page.locator("input[name='email']").fill("tester@example.com");
  97  |     await page.getByRole("button", { name: "入力内容を確認" }).click();
  98  |     await expect(page.getByText("送信完了扱いにはしません。")).toBeVisible();
  99  |   });
  100 | 
  101 |   test("legal pages render configured or generated policy text", async ({ page }) => {
  102 |     await page.goto("/s/aiboux/legal");
  103 |     await expect(page.getByText("販売業者:")).toBeVisible();
  104 |     await page.goto("/s/aiboux/privacy");
  105 |     await expect(page.locator("pre").getByText("個人情報")).toBeVisible();
  106 |     await page.goto("/s/aiboux/shipping");
  107 |     await expect(page.locator("pre").getByText("配送方法と送料")).toBeVisible();
  108 |     await page.goto("/s/aiboux/returns");
  109 |     await expect(page.locator("pre").getByText("返品・交換")).toBeVisible();
  110 |   });
  111 | 
  112 |   test("store design editor exposes only top and product detail page editing", async ({ page }) => {
  113 |     await page.setViewportSize({ width: 1980, height: 1080 });
  114 |     await page.goto("/s/aiboux/admin/design");
> 115 |     await expect(page.getByText("AIBOUX SHOP ストアデザインエディタ")).toBeVisible();
      |                                                             ^ Error: expect(locator).toBeVisible() failed
  116 |     await expect(page.getByText("TOPページ").first()).toBeVisible();
  117 |     await expect(page.getByText("商品詳細ページ").first()).toBeVisible();
  118 |     await expect(page.getByText("編集できるのは「TOPページ」と「商品詳細ページ」のみです。")).toBeVisible();
  119 |     await expect(page.getByText("ヒーロースライダー").first()).toBeVisible();
  120 |     await expect(page.getByText("ロゴ").first()).toBeVisible();
  121 |     await expect(page.getByText("商品一覧ページ")).toHaveCount(0);
  122 |     await expect(page.getByText("カートページ")).toHaveCount(0);
  123 |     await expect(page.getByText("チェックアウトページ")).toHaveCount(0);
  124 |     await expect(page.getByText("404ページ")).toHaveCount(0);
  125 |     await page.screenshot({ path: "output/playwright/shop-functional/design-editor-1980.png", fullPage: true });
  126 |   });
  127 | 
  128 |   test("published product add-to-cart works when published products exist", async ({ page }) => {
  129 |     await page.goto("/s/aiboux/products");
  130 |     const addButtons = page.locator("[data-cart-add]");
  131 |     const count = await addButtons.count();
  132 |     if (count === 0) {
  133 |       await expect(page.getByText("公開商品はまだありません。")).toBeVisible();
  134 |       return;
  135 |     }
  136 | 
  137 |     await addButtons.first().click();
  138 |     await expect(page).toHaveURL(/\/s\/aiboux\/cart$/);
  139 |     await expect(page.locator("[data-cart-list]")).toBeVisible();
  140 |   });
  141 | });
  142 | 
```