# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-storefront-visual-public.spec.ts >> AIBOUX Shop public storefront visual quality >> public storefront has sale-ready visual density at 1365px
- Location: tests/shop-storefront-visual-public.spec.ts:29:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('hero-slide-prev').locator('img')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByTestId('hero-slide-prev').locator('img')

```

```yaml
- banner:
  - text: "お届け先: 東京都 千代田区 送料無料は ¥2,000 ヘルプ・サポート お知らせ"
  - link "株式会社雪花 公式ストア":
    - /url: /s/aiboux/
  - text: すべてのカテゴリ
  - textbox "キーワード・商品名・ブランド名で検索"
  - button "検索"
  - link "アカウント ログイン":
    - /url: /s/aiboux/contact
  - link "注文履歴":
    - /url: /s/aiboux/checkout
  - link "カート":
    - /url: /s/aiboux/cart
  - navigation:
    - link "すべてのカテゴリー":
      - /url: /s/aiboux/categories
    - link "食品・お菓子":
      - /url: /s/aiboux/products
    - link "日用品":
      - /url: /s/aiboux/products
    - link "家電":
      - /url: /s/aiboux/products
    - link "ファッション":
      - /url: /s/aiboux/products
    - link "ビューティー":
      - /url: /s/aiboux/products
    - link "ペット用品":
      - /url: /s/aiboux/products
    - link "スポーツ・アウトドア":
      - /url: /s/aiboux/products
    - link "本・文具":
      - /url: /s/aiboux/products
    - link "セール":
      - /url: /s/aiboux/products
    - link "ランキング":
      - /url: /s/aiboux/products
- main:
  - text: 贈り物にも使える暮らしのギフト AIBOUX SALE
  - heading "毎日の暮らしを整える、雪花セレクト市" [level=1]
  - paragraph: 飲料、日用品、キッチン雑貨まで。今日ほしいものを見つけやすい売り場にまとめました。
  - link "おすすめを見る":
    - /url: /s/aiboux/products
  - button "前のスライド"
  - button "次のスライド"
  - text: キッチンと食卓の定番をまとめ買い
  - heading "おすすめ商品" [level=2]
  - paragraph: ヒーロースライダーの直下に公開商品を表示します。
  - text: 3件
  - article:
    - link "軽量ステンレスボトル キッチン用品 ★★★★★ (860) 軽量ステンレスボトル ¥2,980 税込 カートに追加":
      - /url: /s/aiboux/product/shopprod_tenant_001_4901234567895
      - img "軽量ステンレスボトル"
      - text: キッチン用品 ★★★★★ (860)
      - heading "軽量ステンレスボトル" [level=3]
      - paragraph: ¥2,980 税込
      - text: カートに追加
  - article:
    - link "雪花セレクト ギフトタオル タオル・寝具 ★★★★★ (907) 雪花セレクト ギフトタオル ¥2,480 税込 カートに追加":
      - /url: /s/aiboux/product/shopprod_tenant_001_4901234567818
      - img "雪花セレクト ギフトタオル"
      - text: タオル・寝具 ★★★★★ (907)
      - heading "雪花セレクト ギフトタオル" [level=3]
      - paragraph: ¥2,480 税込
      - text: カートに追加
  - article:
    - link "雪花セレクト ドリップコーヒー 20袋 コーヒー・お茶 ★★★★★ (954) 雪花セレクト ドリップコーヒー 20袋 ¥1,980 税込 カートに追加":
      - /url: /s/aiboux/products
      - img "雪花セレクト ドリップコーヒー 20袋"
      - text: コーヒー・お茶 ★★★★★ (954)
      - heading "雪花セレクト ドリップコーヒー 20袋" [level=3]
      - paragraph: ¥1,980 税込
      - text: カートに追加
  - article:
    - link "軽量ステンレスボトル 500ml キッチン用品 ★★★★★ (1001) 軽量ステンレスボトル 500ml ¥2,480 税込 カートに追加":
      - /url: /s/aiboux/products
      - img "軽量ステンレスボトル 500ml"
      - text: キッチン用品 ★★★★★ (1001)
      - heading "軽量ステンレスボトル 500ml" [level=3]
      - paragraph: ¥2,480 税込
      - text: カートに追加
  - article:
    - link "雪花セレクト ギフトタオル 2枚セット タオル・寝具 ★★★★★ (1048) 雪花セレクト ギフトタオル 2枚セット ¥2,980 税込 カートに追加":
      - /url: /s/aiboux/products
      - img "雪花セレクト ギフトタオル 2枚セット"
      - text: タオル・寝具 ★★★★★ (1048)
      - heading "雪花セレクト ギフトタオル 2枚セット" [level=3]
      - paragraph: ¥2,980 税込
      - text: カートに追加
  - article:
    - link "キッチン保存容器 6点セット キッチン用品 ★★★★★ (1095) キッチン保存容器 6点セット ¥3,280 税込 カートに追加":
      - /url: /s/aiboux/products
      - img "キッチン保存容器 6点セット"
      - text: キッチン用品 ★★★★★ (1095)
      - heading "キッチン保存容器 6点セット" [level=3]
      - paragraph: ¥3,280 税込
      - text: カートに追加
  - article:
    - link "毎日使えるホームケア洗剤セット 日用品 ★★★★★ (1142) 毎日使えるホームケア洗剤セット ¥1,680 税込 カートに追加":
      - /url: /s/aiboux/products
      - img "毎日使えるホームケア洗剤セット"
      - text: 日用品 ★★★★★ (1142)
      - heading "毎日使えるホームケア洗剤セット" [level=3]
      - paragraph: ¥1,680 税込
      - text: カートに追加
  - article:
    - link "ナチュラルスキンケア 3点セット ビューティー ★★★★★ (1189) ナチュラルスキンケア 3点セット ¥4,280 税込 カートに追加":
      - /url: /s/aiboux/products
      - img "ナチュラルスキンケア 3点セット"
      - text: ビューティー ★★★★★ (1189)
      - heading "ナチュラルスキンケア 3点セット" [level=3]
      - paragraph: ¥4,280 税込
      - text: カートに追加
  - article:
    - link "焼き菓子アソートボックス 食品・飲料 ★★★★★ (1236) 焼き菓子アソートボックス ¥2,380 税込 カートに追加":
      - /url: /s/aiboux/products
      - img "焼き菓子アソートボックス"
      - text: 食品・飲料 ★★★★★ (1236)
      - heading "焼き菓子アソートボックス" [level=3]
      - paragraph: ¥2,380 税込
      - text: カートに追加
  - article:
    - link "ペットケアおでかけセット ペット用品 ★★★★★ (1283) ペットケアおでかけセット ¥3,480 税込 カートに追加":
      - /url: /s/aiboux/products
      - img "ペットケアおでかけセット"
      - text: ペット用品 ★★★★★ (1283)
      - heading "ペットケアおでかけセット" [level=3]
      - paragraph: ¥3,480 税込
      - text: カートに追加
  - heading "売れ筋ランキング" [level=2]
  - link "もっと見る":
    - /url: /s/aiboux/products
  - link "1 雪花セレクト ギフトタオル タオル・寝具 雪花セレクト ギフトタオル ¥2,480":
    - /url: /s/aiboux/product/shopprod_tenant_001_4901234567818
    - text: "1"
    - img "雪花セレクト ギフトタオル"
    - text: タオル・寝具 雪花セレクト ギフトタオル ¥2,480
  - link "2 雪花セレクト ドリップコーヒー 20袋 コーヒー・お茶 雪花セレクト ドリップコーヒー 20袋 ¥1,980":
    - /url: /s/aiboux/products
    - text: "2"
    - img "雪花セレクト ドリップコーヒー 20袋"
    - text: コーヒー・お茶 雪花セレクト ドリップコーヒー 20袋 ¥1,980
  - link "3 軽量ステンレスボトル 500ml キッチン用品 軽量ステンレスボトル 500ml ¥2,480":
    - /url: /s/aiboux/products
    - text: "3"
    - img "軽量ステンレスボトル 500ml"
    - text: キッチン用品 軽量ステンレスボトル 500ml ¥2,480
  - link "4 雪花セレクト ギフトタオル 2枚セット タオル・寝具 雪花セレクト ギフトタオル 2枚セット ¥2,980":
    - /url: /s/aiboux/products
    - text: "4"
    - img "雪花セレクト ギフトタオル 2枚セット"
    - text: タオル・寝具 雪花セレクト ギフトタオル 2枚セット ¥2,980
  - link "5 キッチン保存容器 6点セット キッチン用品 キッチン保存容器 6点セット ¥3,280":
    - /url: /s/aiboux/products
    - text: "5"
    - img "キッチン保存容器 6点セット"
    - text: キッチン用品 キッチン保存容器 6点セット ¥3,280
  - heading "タイムセール" [level=2]
  - link "もっと見る":
    - /url: /s/aiboux/products
  - link "SALE 軽量ステンレスボトル 500ml キッチン用品 軽量ステンレスボトル 500ml ¥2,480 ¥3,080":
    - /url: /s/aiboux/products
    - text: SALE
    - img "軽量ステンレスボトル 500ml"
    - text: キッチン用品 軽量ステンレスボトル 500ml ¥2,480 ¥3,080
  - link "SALE 雪花セレクト ギフトタオル 2枚セット タオル・寝具 雪花セレクト ギフトタオル 2枚セット ¥2,980 ¥3,580":
    - /url: /s/aiboux/products
    - text: SALE
    - img "雪花セレクト ギフトタオル 2枚セット"
    - text: タオル・寝具 雪花セレクト ギフトタオル 2枚セット ¥2,980 ¥3,580
  - link "SALE キッチン保存容器 6点セット キッチン用品 キッチン保存容器 6点セット ¥3,280 ¥3,880":
    - /url: /s/aiboux/products
    - text: SALE
    - img "キッチン保存容器 6点セット"
    - text: キッチン用品 キッチン保存容器 6点セット ¥3,280 ¥3,880
  - link "SALE 毎日使えるホームケア洗剤セット 日用品 毎日使えるホームケア洗剤セット ¥1,680 ¥2,280":
    - /url: /s/aiboux/products
    - text: SALE
    - img "毎日使えるホームケア洗剤セット"
    - text: 日用品 毎日使えるホームケア洗剤セット ¥1,680 ¥2,280
  - link "SALE ナチュラルスキンケア 3点セット ビューティー ナチュラルスキンケア 3点セット ¥4,280 ¥4,880":
    - /url: /s/aiboux/products
    - text: SALE
    - img "ナチュラルスキンケア 3点セット"
    - text: ビューティー ナチュラルスキンケア 3点セット ¥4,280 ¥4,880
  - heading "カテゴリー一覧" [level=2]
  - link "もっと見る":
    - /url: /s/aiboux/categories
  - link "食品・飲料 食品・飲料":
    - /url: /s/aiboux/products
    - img "食品・飲料"
    - text: 食品・飲料
  - link "コーヒー・お茶 コーヒー・お茶":
    - /url: /s/aiboux/products
    - img "コーヒー・お茶"
    - text: コーヒー・お茶
  - link "キッチン用品 キッチン用品":
    - /url: /s/aiboux/products
    - img "キッチン用品"
    - text: キッチン用品
  - link "日用品 日用品":
    - /url: /s/aiboux/products
    - img "日用品"
    - text: 日用品
  - link "タオル・寝具 タオル・寝具":
    - /url: /s/aiboux/products
    - img "タオル・寝具"
    - text: タオル・寝具
  - link "ビューティー ビューティー":
    - /url: /s/aiboux/products
    - img "ビューティー"
    - text: ビューティー
  - link "ペット用品 ペット用品":
    - /url: /s/aiboux/products
    - img "ペット用品"
    - text: ペット用品
  - link "ギフト ギフト":
    - /url: /s/aiboux/products
    - img "ギフト"
    - text: ギフト
  - heading "人気ブランド" [level=2]
  - link "もっと見る":
    - /url: /s/aiboux/products
  - text: THERMOS Panasonic SHARP dyson IRIS OHYAMA KIRIN
- contentinfo:
  - navigation:
    - link "プライバシーポリシー":
      - /url: /s/aiboux/privacy
    - link "配送について":
      - /url: /s/aiboux/shipping
    - link "返品について":
      - /url: /s/aiboux/returns
    - link "問い合わせ":
      - /url: /s/aiboux/contact
```

# Test source

```ts
  1  | import { expect, test, type Locator, type Page } from "@playwright/test";
  2  | import { copyFileSync, mkdirSync } from "node:fs";
  3  | import path from "node:path";
  4  | 
  5  | const outputDir = "output/playwright/shop-storefront-visual";
  6  | const publicDir = "public/g/screens";
  7  | 
  8  | async function saveScreenshot(page: Page, filename: string) {
  9  |   const outputPath = path.join(outputDir, filename);
  10 |   const publicPath = path.join(publicDir, filename);
  11 |   await page.screenshot({ path: outputPath, fullPage: true });
  12 |   copyFileSync(outputPath, publicPath);
  13 | }
  14 | 
  15 | async function visibleImageSources(locator: Locator) {
  16 |   return locator.evaluateAll((images) =>
  17 |     images
  18 |       .map((image) => image.getAttribute("src") || "")
  19 |       .filter(Boolean),
  20 |   );
  21 | }
  22 | 
  23 | test.describe("AIBOUX Shop public storefront visual quality", () => {
  24 |   test.beforeAll(() => {
  25 |     mkdirSync(outputDir, { recursive: true });
  26 |     mkdirSync(publicDir, { recursive: true });
  27 |   });
  28 | 
  29 |   test("public storefront has sale-ready visual density at 1365px", async ({ page }) => {
  30 |     await page.setViewportSize({ width: 1365, height: 1200 });
  31 |     await page.goto("/s/aiboux/", { waitUntil: "networkidle" });
  32 | 
  33 |     await expect(page.getByTestId("storefront-hero-slider")).toBeVisible();
  34 |     await expect(page.getByTestId("hero-slide-main").locator("img")).toBeVisible();
> 35 |     await expect(page.getByTestId("hero-slide-prev").locator("img")).toBeVisible();
     |                                                                      ^ Error: expect(locator).toBeVisible() failed
  36 |     await expect(page.getByTestId("hero-slide-next").locator("img")).toBeVisible();
  37 |     await expect(page.locator("[data-hero-side-image]")).toHaveCount(2);
  38 | 
  39 |     const recommendedCards = page.getByTestId("recommended-products").getByTestId("product-card");
  40 |     await expect.poll(async () => recommendedCards.count(), { message: "recommended products should be dense enough" }).toBeGreaterThanOrEqual(10);
  41 |     await expect.poll(async () => page.getByTestId("recommended-products").locator("img").count()).toBeGreaterThanOrEqual(10);
  42 | 
  43 |     await expect(page.getByText(/AIBOUX公開検証商品|公開検証商品|検証商品/)).toHaveCount(0);
  44 |     await expect(page.locator(".placeholder, .skeleton, [data-placeholder='true']")).toHaveCount(0);
  45 | 
  46 |     const recommendedSources = await visibleImageSources(page.getByTestId("recommended-products").locator("img"));
  47 |     const uniqueSources = new Set(recommendedSources);
  48 |     expect(uniqueSources.size, "recommended product images should not be excessively reused").toBeGreaterThanOrEqual(8);
  49 | 
  50 |     await expect(page.getByTestId("bestseller-ranking").getByTestId("ranking-card")).toHaveCount(5);
  51 |     await expect(page.getByTestId("time-sale-products").getByTestId("time-sale-card")).toHaveCount(5);
  52 |     await expect(page.getByTestId("category-showcase").getByTestId("category-card")).toHaveCount(8);
  53 | 
  54 |     const weakImages = await page.locator("img").evaluateAll((images) =>
  55 |       images.filter((image) => /placeholder|skeleton|gray|grey|no-image|画像なし|\/shop\/design\/hero-/i.test(image.getAttribute("src") || "")).length,
  56 |     );
  57 |     expect(weakImages, "public storefront should not use weak image URLs").toBe(0);
  58 | 
  59 |     await saveScreenshot(page, "public-storefront-after-quality-fix-1365.png");
  60 |   });
  61 | 
  62 |   test("public storefront keeps Amazon-like sales sections at 1980px", async ({ page }) => {
  63 |     await page.setViewportSize({ width: 1980, height: 1080 });
  64 |     await page.goto("/s/aiboux/", { waitUntil: "networkidle" });
  65 | 
  66 |     const heroBox = await page.getByTestId("storefront-hero-slider").boundingBox();
  67 |     expect(heroBox?.height ?? 0, "hero should have enough visual weight").toBeGreaterThanOrEqual(300);
  68 | 
  69 |     const productCards = page.getByTestId("recommended-products").getByTestId("product-card");
  70 |     await expect.poll(async () => productCards.count()).toBeGreaterThanOrEqual(10);
  71 | 
  72 |     const productNames = await productCards.locator("h3").allTextContents();
  73 |     expect(productNames.join("\n")).not.toMatch(/AIBOUX公開検証商品|公開検証商品|検証商品/);
  74 | 
  75 |     const cardBoxes = await productCards.evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().height));
  76 |     expect(Math.max(...cardBoxes) - Math.min(...cardBoxes), "product card heights should be aligned").toBeLessThanOrEqual(80);
  77 | 
  78 |     await saveScreenshot(page, "public-storefront-after-quality-fix-1980.png");
  79 |   });
  80 | 
  81 |   test("public storefront mobile remains image-backed and not sparse", async ({ page }) => {
  82 |     await page.setViewportSize({ width: 390, height: 1200 });
  83 |     await page.goto("/s/aiboux/", { waitUntil: "networkidle" });
  84 | 
  85 |     await expect(page.getByTestId("storefront-hero-slider")).toBeVisible();
  86 |     await expect(page.getByTestId("recommended-products")).toBeVisible();
  87 |     await expect.poll(async () => page.getByTestId("recommended-products").locator("img").count()).toBeGreaterThanOrEqual(8);
  88 |     await expect(page.getByText(/AIBOUX公開検証商品|公開検証商品|検証商品/)).toHaveCount(0);
  89 | 
  90 |     await saveScreenshot(page, "public-storefront-after-quality-fix-mobile.png");
  91 |   });
  92 | });
  93 | 
```