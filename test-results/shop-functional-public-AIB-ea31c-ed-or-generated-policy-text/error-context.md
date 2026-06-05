# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-functional-public.spec.ts >> AIBOUX Shop public functional hardening >> legal pages render configured or generated policy text
- Location: tests/shop-functional-public.spec.ts:105:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('販売業者:')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('販売業者:')

```

```yaml
- navigation "ページ内ショートカット":
  - link "本文へスキップ":
    - /url: "#storefront-main"
  - link "商品検索へ移動":
    - /url: "#storefront-search"
  - link "フッターの主要リンクへ移動":
    - /url: "#storefront-footer"
- banner "ストアヘッダー":
  - text: "お届け先: 東京都 千代田区 送料無料は ¥2,000 ヘルプ・サポート お知らせ"
  - link "株式会社雪花 公式ストア":
    - /url: /s/aiboux/
  - search "ストア内商品検索":
    - text: すべてのカテゴリ
    - searchbox "キーワード・商品名・ブランド名で検索"
    - button "商品を検索"
  - link "アカウント マイページ":
    - /url: /s/aiboux/mypage
  - link "注文履歴":
    - /url: /s/aiboux/orders
  - link "カート":
    - /url: /s/aiboux/cart
  - navigation "ストアカテゴリナビ":
    - link "すべてのカテゴリー":
      - /url: /s/aiboux/categories
    - link "食品・お菓子":
      - /url: /s/aiboux/products?category=food-drink
    - link "日用品":
      - /url: /s/aiboux/products?category=daily-goods
    - link "キッチン用品":
      - /url: /s/aiboux/products?category=kitchen
    - link "ギフト":
      - /url: /s/aiboux/products?category=gift
    - link "ビューティー":
      - /url: /s/aiboux/products?category=beauty
    - link "ペット用品":
      - /url: /s/aiboux/products?category=pet
    - link "スポーツ・アウトドア":
      - /url: /s/aiboux/products?category=sports-outdoor
    - link "本・文具":
      - /url: /s/aiboux/products?category=books-stationery
    - link "セール":
      - /url: /s/aiboux/products?category=sale
    - link "ランキング":
      - /url: /s/aiboux/products?category=ranking
- main:
  - navigation "パンくずリスト":
    - text: 現在地
    - link "TOP":
      - /url: /s/aiboux/
    - text: 特定商取引法に基づく表示
  - navigation "パンくず関連リンク":
    - link "配送について":
      - /url: /s/aiboux/shipping
    - link "返品について":
      - /url: /s/aiboux/returns
    - link "プライバシー":
      - /url: /s/aiboux/privacy
    - link "問い合わせ":
      - /url: /s/aiboux/contact
  - region "特定商取引法に基づく表示":
    - paragraph: 株式会社雪花 公式ストア
    - heading "特定商取引法に基づく表示" [level=1]
    - paragraph: 販売者情報、所在地、連絡先、支払方法、配送、返品、キャンセル条件、問い合わせ先を購入前に確認できます。
    - navigation "特定商取引法に基づく表示 の主要導線":
      - link "配送条件":
        - /url: /s/aiboux/shipping
      - link "返品条件":
        - /url: /s/aiboux/returns
      - link "問い合わせ":
        - /url: /s/aiboux/contact
  - paragraph: お買い物ガイド
  - heading "特定商取引法に基づく表示" [level=2]
  - paragraph: 販売者情報、所在地、連絡先、支払方法、配送、返品、キャンセル条件、問い合わせ先を購入前に確認できます。 購入前に販売者情報、問い合わせ先、配送、返品条件を確認できます。
  - link "問い合わせ":
    - /url: /s/aiboux/contact
  - article:
    - heading "販売業者" [level=3]
    - paragraph: 株式会社雪花
  - article:
    - heading "所在地" [level=3]
    - paragraph: 1000001 東京都千代田区
  - article:
    - heading "連絡先" [level=3]
    - paragraph: info@aiboux.com
  - article:
    - heading "販売価格" [level=3]
    - paragraph: 各商品ページに税込価格を表示します。
  - article:
    - heading "商品代金以外の必要料金" [level=3]
    - paragraph: 送料、決済手数料その他購入手続き画面で表示される費用。
  - article:
    - heading "支払い方法" [level=3]
    - paragraph: クレジットカードその他ストアで有効化された方法。
  - article:
    - heading "商品の引渡時期" [level=3]
    - paragraph: 決済確認後、商品ページまたは注文確認画面に記載の時期に発送します。
  - article:
    - heading "返品・交換" [level=3]
    - paragraph: 商品到着後7日以内にお問い合わせください。不良品の場合は当社負担で対応します。
  - complementary: 販売者 株式会社雪花 問い合わせ先 info@aiboux.com 最終更新日 2026-06-05
  - link "購入前チェック 価格、税込表示、送料、返品条件、支払い方法の状態を確認してから注文へ進みます。 詳しく見る":
    - /url: /s/aiboux/checkout
    - heading "購入前チェック" [level=3]
    - paragraph: 価格、税込表示、送料、返品条件、支払い方法の状態を確認してから注文へ進みます。
    - text: 詳しく見る
  - link "配送・返品 配送目安、送料、返品受付条件、不良品時の問い合わせ導線をまとめて確認できます。 詳しく見る":
    - /url: /s/aiboux/shipping
    - heading "配送・返品" [level=3]
    - paragraph: 配送目安、送料、返品受付条件、不良品時の問い合わせ導線をまとめて確認できます。
    - text: 詳しく見る
  - link "問い合わせ 注文番号、商品名、確認したい内容を添えてストアへ問い合わせできます。 詳しく見る":
    - /url: /s/aiboux/contact
    - heading "問い合わせ" [level=3]
    - paragraph: 注文番号、商品名、確認したい内容を添えてストアへ問い合わせできます。
    - text: 詳しく見る
- contentinfo:
  - link "ページ上部へ戻る":
    - /url: "#top"
  - region "買い物を続ける":
    - heading "買い物を続ける" [level=2]
    - paragraph: 商品、カート、注文履歴、問い合わせへすぐ戻れます。
    - navigation "フッタークイックリンク":
      - link "商品一覧":
        - /url: /s/aiboux/products
      - link "カート":
        - /url: /s/aiboux/cart
      - link "注文履歴":
        - /url: /s/aiboux/orders
      - link "問い合わせ":
        - /url: /s/aiboux/contact
  - heading "税込価格" [level=2]
  - paragraph: 商品価格は税込表示で統一します。
  - link "商品を見る":
    - /url: /s/aiboux/products
  - heading "配送・返品" [level=2]
  - paragraph: 配送予定、返品条件、問い合わせ先を各ページから確認できます。
  - link "配送を見る":
    - /url: /s/aiboux/shipping
  - heading "支払い方法" [level=2]
  - paragraph: 支払い方法の確認が必要な場合は、注文前に分かりやすく案内します。
  - link "注文確認へ":
    - /url: /s/aiboux/checkout
  - heading "定期購入" [level=2]
  - paragraph: 定期購入は受付条件とお届け頻度を購入前に確認できます。
  - link "定期購入を見る":
    - /url: /s/aiboux/mypage/subscriptions
  - navigation "お買い物":
    - heading "お買い物" [level=2]
    - link "商品一覧":
      - /url: /s/aiboux/products
    - link "カテゴリ":
      - /url: /s/aiboux/categories
    - link "タイムセール":
      - /url: /s/aiboux/products?category=sale
    - link "売れ筋ランキング":
      - /url: /s/aiboux/products?category=ranking
    - link "お気に入り":
      - /url: /s/aiboux/favorites
  - navigation "アカウント":
    - heading "アカウント" [level=2]
    - link "マイページ":
      - /url: /s/aiboux/mypage
    - link "注文履歴":
      - /url: /s/aiboux/orders
    - link "定期購入":
      - /url: /s/aiboux/mypage/subscriptions
    - link "ログイン":
      - /url: /s/aiboux/login
  - navigation "サポート":
    - heading "サポート" [level=2]
    - link "問い合わせ":
      - /url: /s/aiboux/contact
    - link "よくある質問":
      - /url: /s/aiboux/faq
    - link "配送について":
      - /url: /s/aiboux/shipping
    - link "返品について":
      - /url: /s/aiboux/returns
  - navigation "ストア情報":
    - heading "ストア情報" [level=2]
    - link "特定商取引法":
      - /url: /s/aiboux/legal
    - link "プライバシーポリシー":
      - /url: /s/aiboux/privacy
    - link "カート":
      - /url: /s/aiboux/cart
    - link "チェックアウト":
      - /url: /s/aiboux/checkout
  - region "フッター主要リンク":
    - heading "ストア主要リンク" [level=2]
    - link "TOPページ":
      - /url: /s/aiboux/
    - link "商品一覧":
      - /url: /s/aiboux/products
    - link "カテゴリ一覧":
      - /url: /s/aiboux/categories
    - link "食品・飲料":
      - /url: /s/aiboux/products?category=food-drink
    - link "コーヒー・お茶":
      - /url: /s/aiboux/products?category=coffee-tea
    - link "キッチン用品":
      - /url: /s/aiboux/products?category=kitchen
    - link "日用品":
      - /url: /s/aiboux/products?category=daily-goods
    - link "ギフト":
      - /url: /s/aiboux/products?category=gift
    - link "タイムセール":
      - /url: /s/aiboux/products?category=sale
    - link "売れ筋ランキング":
      - /url: /s/aiboux/products?category=ranking
    - link "カート":
      - /url: /s/aiboux/cart
    - link "チェックアウト":
      - /url: /s/aiboux/checkout
    - link "マイページ":
      - /url: /s/aiboux/mypage
    - link "注文履歴":
      - /url: /s/aiboux/orders
    - link "お気に入り":
      - /url: /s/aiboux/favorites
    - link "定期購入":
      - /url: /s/aiboux/mypage/subscriptions
    - link "問い合わせ":
      - /url: /s/aiboux/contact
    - link "よくある質問":
      - /url: /s/aiboux/faq
    - link "配送について":
      - /url: /s/aiboux/shipping
    - link "返品について":
      - /url: /s/aiboux/returns
    - link "特定商取引法":
      - /url: /s/aiboux/legal
    - link "プライバシーポリシー":
      - /url: /s/aiboux/privacy
  - text: 株式会社雪花 公式ストア
  - paragraph: 注文、配送、返品、定期購入、問い合わせまで同じストア内で確認できます。支払い方法の選択が必要な場合は、注文前に分かりやすく案内します。
  - navigation "ストア基本情報":
    - link "特商法":
      - /url: /s/aiboux/legal
    - link "プライバシー":
      - /url: /s/aiboux/privacy
    - link "問い合わせ":
      - /url: /s/aiboux/contact
```

# Test source

```ts
  7   |   "/s/aiboux/admin",
  8   |   "/s/aiboux/admin/products",
  9   |   "/s/aiboux/admin/orders",
  10  |   "/s/aiboux/admin/inventory",
  11  |   "/s/aiboux/admin/categories",
  12  |   "/s/aiboux/admin/customers",
  13  |   "/s/aiboux/admin/content",
  14  |   "/s/aiboux/admin/analytics",
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
  81  |     await expect(page.getByText("カートは空です")).toBeVisible();
  82  | 
  83  |     await page.goto("/s/aiboux/checkout");
  84  |     await expect(page.getByTestId("storefront-checkout-empty-guide")).toBeVisible();
  85  |     await expect(page.getByTestId("storefront-checkout-empty-guide").getByRole("link", { name: "商品一覧へ戻る" })).toHaveAttribute(
  86  |       "href",
  87  |       "/s/aiboux/products",
  88  |     );
  89  |     await expect(page.getByText("注文が確定しました")).toHaveCount(0);
  90  |     await expect(page.getByText("支払いが完了しました")).toHaveCount(0);
  91  | 
  92  |     await page.goto("/s/aiboux/contact");
  93  |     await page.getByRole("button", { name: "入力内容を確認" }).click();
  94  |     await expect(page.getByText("お名前を入力してください。")).toBeVisible();
  95  |     await page.locator("input[name='name']").fill("検証 太郎");
  96  |     await page.locator("input[name='email']").fill("invalid-email");
  97  |     await page.locator("textarea[name='message']").fill("問い合わせ検証です。");
  98  |     await page.getByRole("button", { name: "入力内容を確認" }).click();
  99  |     await expect(page.getByText("正しいメールアドレスを入力してください。")).toBeVisible();
  100 |     await page.locator("input[name='email']").fill("tester@example.com");
  101 |     await page.getByRole("button", { name: "入力内容を確認" }).click();
  102 |     await expect(page.getByText("入力内容を確認しました。")).toBeVisible();
  103 |   });
  104 | 
  105 |   test("legal pages render configured or generated policy text", async ({ page }) => {
  106 |     await page.goto("/s/aiboux/legal");
> 107 |     await expect(page.getByText("販売業者:")).toBeVisible();
      |                                           ^ Error: expect(locator).toBeVisible() failed
  108 |     await page.goto("/s/aiboux/privacy");
  109 |     await expect(page.getByTestId("storefront-policy-page").getByText("個人情報")).toBeVisible();
  110 |     await page.goto("/s/aiboux/shipping");
  111 |     await expect(page.getByTestId("storefront-policy-page").getByText("配送方法と送料")).toBeVisible();
  112 |     await page.goto("/s/aiboux/returns");
  113 |     await expect(page.getByTestId("storefront-policy-page").getByText("返品・交換")).toBeVisible();
  114 |   });
  115 | 
  116 |   test("store design editor exposes only top and product detail page editing", async ({ page }) => {
  117 |     await page.setViewportSize({ width: 1980, height: 1080 });
  118 |     await page.goto("/s/aiboux/admin/design");
  119 |     await expect(page.getByText("AIBOUX SHOP ストアデザインエディタ")).toBeVisible();
  120 |     await expect(page.getByText("注文管理")).toHaveCount(0);
  121 |     await expect(page.getByText("商品管理")).toHaveCount(0);
  122 |     await expect(page.getByText("在庫", { exact: true })).toHaveCount(0);
  123 |     await expect(page.getByText("TOPページ").first()).toBeVisible();
  124 |     await expect(page.getByText("商品詳細ページ").first()).toBeVisible();
  125 |     await expect(page.getByText("編集できるのは「TOPページ」と「商品詳細ページ」のみです。")).toBeVisible();
  126 |     await expect(page.getByText("ヒーロースライダー").first()).toBeVisible();
  127 |     await expect(page.getByText("ロゴ").first()).toBeVisible();
  128 |     await expect(page.getByText("商品一覧ページ")).toHaveCount(0);
  129 |     await expect(page.getByText("カートページ")).toHaveCount(0);
  130 |     await expect(page.getByText("チェックアウトページ")).toHaveCount(0);
  131 |     await expect(page.getByText("404ページ")).toHaveCount(0);
  132 | 
  133 |     const shell = page.locator("[data-shop-design-editor-shell]");
  134 |     const preview = page.locator("[data-shop-design-preview]");
  135 |     const previewFrame = page.locator("[data-store-preview-frame]");
  136 |     const leftPane = page.locator("[data-shop-design-left-pane]");
  137 |     const rightPane = page.locator("[data-shop-design-right-pane]");
  138 |     await expect(shell).toBeVisible();
  139 |     await expect(leftPane).toBeVisible();
  140 |     await expect(preview).toBeVisible();
  141 |     await expect(rightPane).toBeVisible();
  142 | 
  143 |     const previewBox = await preview.boundingBox();
  144 |     const frameBox = await previewFrame.boundingBox();
  145 |     const leftBox = await leftPane.boundingBox();
  146 |     const rightBox = await rightPane.boundingBox();
  147 |     expect(previewBox?.width ?? 0, "center preview column should be at least 1100px at 1980px viewport").toBeGreaterThanOrEqual(1100);
  148 |     expect(frameBox?.width ?? 0, "store preview frame should be at least 1100px at 1980px viewport").toBeGreaterThanOrEqual(1100);
  149 |     expect(leftBox?.width ?? 0, "left editor pane width").toBeGreaterThanOrEqual(300);
  150 |     expect(leftBox?.width ?? 0, "left editor pane width").toBeLessThanOrEqual(340);
  151 |     expect(rightBox?.width ?? 0, "right editor pane width").toBeGreaterThanOrEqual(340);
  152 |     expect(rightBox?.width ?? 0, "right editor pane width").toBeLessThanOrEqual(380);
  153 | 
  154 |     const navItems = page.locator("[data-shop-nav-item]");
  155 |     await expect(navItems.first()).toBeVisible();
  156 |     const navCount = await navItems.count();
  157 |     expect(navCount, "category nav items should exist").toBeGreaterThanOrEqual(8);
  158 |     for (let index = 0; index < Math.min(navCount, 8); index += 1) {
  159 |       const box = await navItems.nth(index).boundingBox();
  160 |       expect(box?.height ?? 999, `category nav item ${index} should not wrap vertically`).toBeLessThanOrEqual(24);
  161 |     }
  162 | 
  163 |     const sideImages = page.locator("[data-hero-side-image]");
  164 |     await expect(sideImages).toHaveCount(2);
  165 |     for (let index = 0; index < 2; index += 1) {
  166 |       const src = await sideImages.nth(index).getAttribute("src");
  167 |       expect(src ?? "", `side hero ${index} should use a real preview image`).toContain("/shop/design/hero-");
  168 |     }
  169 | 
  170 |     await page.screenshot({ path: "output/playwright/shop-functional/design-editor-1980.png", fullPage: true });
  171 |   });
  172 | 
  173 |   test("store design editor saves top hero changes and restores original layout", async ({ page, request }) => {
  174 |     const originalResponse = await request.get("/shop/api/storefront/layout", {
  175 |       headers: {
  176 |         "cache-control": "no-cache",
  177 |         pragma: "no-cache",
  178 |       },
  179 |     });
  180 |     expect(originalResponse.ok(), "layout GET before persistence test").toBeTruthy();
  181 |     const originalData = await originalResponse.json();
  182 |     expect(originalData.success, "layout GET success before persistence test").toBeTruthy();
  183 |     const originalLayout = originalData.layout;
  184 |     const marker = `Playwright保存検証 ${Date.now()}`;
  185 | 
  186 |     try {
  187 |       await page.setViewportSize({ width: 1980, height: 1080 });
  188 |       await page.goto(`/s/aiboux/admin/design?persistence=${encodeURIComponent(marker)}`);
  189 |       await expect(page.getByText("AIBOUX SHOP ストアデザインエディタ")).toBeVisible();
  190 |       await expect(page.getByText("読み込み中")).toHaveCount(0);
  191 | 
  192 |       const heroTitle = page.getByLabel("タイトル").first();
  193 |       await expect(heroTitle).toBeVisible();
  194 |       await expect(heroTitle).not.toHaveValue("");
  195 |       await heroTitle.fill(marker);
  196 |       await expect(heroTitle).toHaveValue(marker);
  197 | 
  198 |       const saveResponsePromise = page.waitForResponse((response) =>
  199 |         response.url().includes("/shop/api/storefront/layout") && response.request().method() === "POST",
  200 |       );
  201 |       await page.getByRole("button", { name: "保存", exact: true }).click();
  202 |       const saveResponse = await saveResponsePromise;
  203 |       expect(saveResponse.ok(), "layout POST from design editor save").toBeTruthy();
  204 | 
  205 |       const savedResponse = await request.get("/shop/api/storefront/layout", {
  206 |         headers: {
  207 |           "cache-control": "no-cache",
```