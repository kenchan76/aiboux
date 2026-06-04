# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-design-editor-public.spec.ts >> AIBOUX Shop design editor public visual gate >> public product detail uses gallery information and purchase-box columns
- Location: tests/shop-design-editor-public.spec.ts:121:3

# Error details

```
Error: public product info column

expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 500
Received:    412
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]: "お届け先: 東京都 千代田区"
      - generic [ref=e5]: 送料無料は ¥2,000
      - generic [ref=e6]:
        - generic [ref=e7]: ヘルプ・サポート
        - generic [ref=e8]: お知らせ
    - generic [ref=e9]:
      - link "株式会社雪花 公式ストア" [ref=e10] [cursor=pointer]:
        - /url: /s/aiboux/
      - generic [ref=e11]:
        - generic [ref=e12]: すべてのカテゴリ
        - textbox "キーワード・商品名・ブランド名で検索" [ref=e13]
        - generic [ref=e14]: 検索
      - link "アカウント ログイン" [ref=e15] [cursor=pointer]:
        - /url: /s/aiboux/contact
        - text: アカウント
        - text: ログイン
      - link "注文履歴" [ref=e16] [cursor=pointer]:
        - /url: /s/aiboux/checkout
      - link "カート" [ref=e17] [cursor=pointer]:
        - /url: /s/aiboux/cart
    - navigation [ref=e18]:
      - link "すべてのカテゴリー" [ref=e19] [cursor=pointer]:
        - /url: /s/aiboux/categories
      - link "食品・お菓子" [ref=e20] [cursor=pointer]:
        - /url: /s/aiboux/products
      - link "日用品" [ref=e21] [cursor=pointer]:
        - /url: /s/aiboux/products
      - link "家電" [ref=e22] [cursor=pointer]:
        - /url: /s/aiboux/products
      - link "ファッション" [ref=e23] [cursor=pointer]:
        - /url: /s/aiboux/products
      - link "ビューティー" [ref=e24] [cursor=pointer]:
        - /url: /s/aiboux/products
      - link "ペット用品" [ref=e25] [cursor=pointer]:
        - /url: /s/aiboux/products
      - link "スポーツ・アウトドア" [ref=e26] [cursor=pointer]:
        - /url: /s/aiboux/products
      - link "本・文具" [ref=e27] [cursor=pointer]:
        - /url: /s/aiboux/products
      - link "セール" [ref=e28] [cursor=pointer]:
        - /url: /s/aiboux/products
      - link "ランキング" [ref=e29] [cursor=pointer]:
        - /url: /s/aiboux/products
  - main [ref=e30]:
    - generic [ref=e31]:
      - paragraph [ref=e32]: 株式会社雪花 公式ストア
      - heading "AIBOUX公開検証商品 4580000232621" [level=1] [ref=e33]
      - paragraph [ref=e34]: AIBOUX公開検証商品 4580000232621 の商品詳細です。
    - generic [ref=e35]:
      - generic [ref=e37]:
        - generic [ref=e38]:
          - generic [ref=e39]: "1"
          - generic [ref=e40]: "2"
          - generic [ref=e41]: "3"
          - generic [ref=e42]: "4"
          - generic [ref=e43]: "5"
        - generic [ref=e45]: 画像未登録
      - generic [ref=e46]:
        - paragraph [ref=e47]: "166"
        - heading "AIBOUX公開検証商品 4580000232621" [level=1] [ref=e48]
        - paragraph [ref=e49]:
          - text: ★★★★★
          - link "(レビューを確認)" [ref=e50] [cursor=pointer]:
            - /url: "#reviews"
        - generic [ref=e51]: ¥2,980
        - paragraph [ref=e52]: ポイント付与対象商品です。
        - generic [ref=e53]:
          - heading "バリエーション" [level=2] [ref=e54]
          - generic [ref=e55]:
            - generic [ref=e56]: 標準
            - generic [ref=e57]: ギフト対応
        - generic [ref=e58]:
          - heading "商品説明" [level=2] [ref=e59]
          - paragraph [ref=e60]: 公開ストア反映確認用の商品です。
        - generic [ref=e61]:
          - heading "商品仕様" [level=2] [ref=e62]
          - generic [ref=e63]:
            - generic [ref=e64]:
              - term [ref=e65]: SKU
              - definition [ref=e66]: "4580000232621"
            - generic [ref=e67]:
              - term [ref=e68]: カテゴリ
              - definition [ref=e69]: "166"
      - complementary [ref=e70]:
        - generic [ref=e71]: ¥2,980
        - paragraph [ref=e72]: 配送予定はチェックアウト画面で確認します。
        - paragraph [ref=e73]: 在庫あり
        - generic [ref=e74]:
          - text: 数量
          - textbox "数量" [ref=e75]: "1"
        - generic [ref=e76]:
          - button "カートに入れる" [ref=e77]
          - link "今すぐ購入" [ref=e78] [cursor=pointer]:
            - /url: /s/aiboux/checkout
          - link "カートを見る" [ref=e79] [cursor=pointer]:
            - /url: /s/aiboux/cart
      - generic [ref=e80]:
        - heading "関連商品" [level=2] [ref=e81]
        - generic [ref=e82]:
          - link "画像未登録 軽量ステンレスボトル ¥2,980" [ref=e83] [cursor=pointer]:
            - /url: /s/aiboux/product/shopprod_tenant_001_4901234567895
            - generic [ref=e85]: 画像未登録
            - generic [ref=e86]: 軽量ステンレスボトル
            - generic [ref=e87]: ¥2,980
          - link "画像未登録 雪花セレクト ギフトタオル ¥2,480" [ref=e88] [cursor=pointer]:
            - /url: /s/aiboux/product/shopprod_tenant_001_4901234567818
            - generic [ref=e90]: 画像未登録
            - generic [ref=e91]: 雪花セレクト ギフトタオル
            - generic [ref=e92]: ¥2,480
```

# Test source

```ts
  35  | 
  36  |     await expect(page.getByText("AIBOUX SHOP ストアデザインエディタ")).toBeVisible();
  37  |     await expect(page.getByText("TOPページ").first()).toBeVisible();
  38  |     await expect(page.getByText("商品詳細ページ").first()).toBeVisible();
  39  |     await expect(page.getByText("編集できるのは「TOPページ」と「商品詳細ページ」のみです。")).toBeVisible();
  40  |     await expect(page.getByText("ヒーロースライダー").first()).toBeVisible();
  41  | 
  42  |     await expect(page.getByText("注文管理", { exact: true })).toHaveCount(0);
  43  |     await expect(page.getByText("商品管理", { exact: true })).toHaveCount(0);
  44  |     await expect(page.getByText("在庫", { exact: true })).toHaveCount(0);
  45  |     await expect(page.getByText("商品一覧ページ", { exact: true })).toHaveCount(0);
  46  |     await expect(page.getByText("カートページ", { exact: true })).toHaveCount(0);
  47  |     await expect(page.getByText("チェックアウトページ", { exact: true })).toHaveCount(0);
  48  | 
  49  |     const leftPane = page.getByTestId("shop-design-left-pane");
  50  |     const preview = page.getByTestId("shop-design-editor-preview");
  51  |     const frame = page.getByTestId("store-preview-frame");
  52  |     const rightPane = page.getByTestId("shop-design-right-pane");
  53  |     await expect(leftPane).toBeVisible();
  54  |     await expect(preview).toBeVisible();
  55  |     await expect(frame).toBeVisible();
  56  |     await expect(rightPane).toBeVisible();
  57  | 
  58  |     const leftBox = await leftPane.boundingBox();
  59  |     const previewBox = await preview.boundingBox();
  60  |     const frameBox = await frame.boundingBox();
  61  |     const rightBox = await rightPane.boundingBox();
  62  |     expect(leftBox?.width ?? 0, "left pane width").toBeGreaterThanOrEqual(300);
  63  |     expect(leftBox?.width ?? 0, "left pane width").toBeLessThanOrEqual(340);
  64  |     expect(previewBox?.width ?? 0, "center preview column width").toBeGreaterThanOrEqual(1100);
  65  |     expect(frameBox?.width ?? 0, "store preview frame width").toBeGreaterThanOrEqual(1100);
  66  |     expect(rightBox?.width ?? 0, "right pane width").toBeGreaterThanOrEqual(340);
  67  |     expect(rightBox?.width ?? 0, "right pane width").toBeLessThanOrEqual(380);
  68  | 
  69  |     const navItems = page.locator("[data-shop-nav-item]");
  70  |     const navCount = await navItems.count();
  71  |     expect(navCount, "category nav items").toBeGreaterThanOrEqual(8);
  72  |     for (let index = 0; index < Math.min(navCount, 8); index += 1) {
  73  |       const box = await navItems.nth(index).boundingBox();
  74  |       expect(box?.height ?? 999, `category nav item ${index} should not wrap vertically`).toBeLessThanOrEqual(24);
  75  |     }
  76  | 
  77  |     const sideImages = page.locator("[data-hero-side-image]");
  78  |     await expect(sideImages).toHaveCount(2);
  79  |     for (let index = 0; index < 2; index += 1) {
  80  |       const src = await sideImages.nth(index).getAttribute("src");
  81  |       expect(src ?? "", `side hero ${index} should use a real slide image`).toContain("/shop/design/hero-");
  82  |     }
  83  | 
  84  |     await saveScreenshot(page, "shop-design-editor-top-1980.png");
  85  |   });
  86  | 
  87  |   test("editor product detail page is available without exposing other editable pages", async ({ page }) => {
  88  |     await page.setViewportSize({ width: 1980, height: 1080 });
  89  |     await page.goto("/s/aiboux/admin/design?page=productDetail", { waitUntil: "networkidle" });
  90  | 
  91  |     await expect(page.getByText("AIBOUX SHOP ストアデザインエディタ")).toBeVisible();
  92  |     await expect(page.getByText("商品詳細ページ").first()).toBeVisible();
  93  |     await expect(page.getByTestId("product-detail-editor-preview")).toBeVisible();
  94  |     await expect(page.getByTestId("product-detail-gallery")).toBeVisible();
  95  |     await expect(page.getByTestId("product-detail-purchase-box")).toBeVisible();
  96  |     await expect(page.getByText("商品一覧ページ", { exact: true })).toHaveCount(0);
  97  |     await expect(page.getByText("カートページ", { exact: true })).toHaveCount(0);
  98  |     await expect(page.getByText("チェックアウトページ", { exact: true })).toHaveCount(0);
  99  | 
  100 |     await saveScreenshot(page, "shop-design-editor-product-1980.png");
  101 |   });
  102 | 
  103 |   test("public storefront top reflects design with hero and recommended products", async ({ page }) => {
  104 |     await page.setViewportSize({ width: 1980, height: 1080 });
  105 |     await page.goto("/s/aiboux/", { waitUntil: "networkidle" });
  106 | 
  107 |     await expect(page.getByTestId("storefront-hero-slider")).toBeVisible();
  108 |     await expect(page.getByTestId("hero-slide-main")).toBeVisible();
  109 |     await expect(page.getByTestId("recommended-products")).toBeVisible();
  110 | 
  111 |     const sideImages = page.locator("[data-hero-side-image]");
  112 |     await expect(sideImages).toHaveCount(2);
  113 |     for (let index = 0; index < 2; index += 1) {
  114 |       const src = await sideImages.nth(index).getAttribute("src");
  115 |       expect(src ?? "", `public side hero ${index} should use a real slide image`).toContain("/shop/design/hero-");
  116 |     }
  117 | 
  118 |     await saveScreenshot(page, "shop-storefront-top-1980.png");
  119 |   });
  120 | 
  121 |   test("public product detail uses gallery information and purchase-box columns", async ({ page, request }) => {
  122 |     await page.setViewportSize({ width: 1980, height: 1080 });
  123 |     const productPath = await findProductPath(page, request);
  124 |     await page.goto(productPath, { waitUntil: "networkidle" });
  125 | 
  126 |     await expect(page.getByTestId("public-product-detail")).toBeVisible();
  127 |     await expect(page.getByTestId("public-product-gallery")).toBeVisible();
  128 |     await expect(page.getByTestId("public-product-info")).toBeVisible();
  129 |     await expect(page.getByTestId("public-product-purchase-box")).toBeVisible();
  130 | 
  131 |     const galleryBox = await page.getByTestId("public-product-gallery").boundingBox();
  132 |     const infoBox = await page.getByTestId("public-product-info").boundingBox();
  133 |     const purchaseBox = await page.getByTestId("public-product-purchase-box").boundingBox();
  134 |     expect(galleryBox?.width ?? 0, "public product gallery column").toBeGreaterThanOrEqual(300);
> 135 |     expect(infoBox?.width ?? 0, "public product info column").toBeGreaterThanOrEqual(500);
      |                                                               ^ Error: public product info column
  136 |     expect(purchaseBox?.width ?? 0, "public product purchase column").toBeGreaterThanOrEqual(260);
  137 | 
  138 |     await saveScreenshot(page, "shop-product-detail-1980.png");
  139 |   });
  140 | });
  141 | 
```