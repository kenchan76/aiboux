# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-contact-legal-public.spec.ts >> AIBOUX Shop contact and shared legal templates >> legal, privacy, shipping, returns, and FAQ pages render shared templates
- Location: tests/shop-contact-legal-public.spec.ts:44:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('AIBOUX Shop お買い物ガイド')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('AIBOUX Shop お買い物ガイド')

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
  - heading "税込価格" [level=2]
  - paragraph: 商品価格は税込表示で統一します。
  - heading "配送・返品" [level=2]
  - paragraph: 配送予定、返品条件、問い合わせ先を各ページから確認できます。
  - heading "決済状態" [level=2]
  - paragraph: オンライン決済準備中は注文確定表示を出さず、準備中として表示します。
  - heading "定期購入" [level=2]
  - paragraph: 定期購入は受付開始まで準備中として表示します。
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
    - heading "ストア内リンクをまとめて確認" [level=2]
    - paragraph: 商品、カテゴリ、注文、配送、返品、定期購入、問い合わせまで、必要なページへすぐ移動できます。
    - text: ストア主要リンク
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
  - paragraph: 注文、配送、返品、定期購入、問い合わせまで同じストア導線で確認できます。オンライン決済準備中は注文確定しません。
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
  1  | import { expect, test, type Page } from "@playwright/test";
  2  | import { copyFileSync, mkdirSync } from "node:fs";
  3  | import path from "node:path";
  4  | 
  5  | const outputDir = "output/playwright/shop-contact-legal";
  6  | const publicDir = "public/g/screens";
  7  | 
  8  | async function saveScreenshot(page: Page, filename: string) {
  9  |   const outputPath = path.join(outputDir, filename);
  10 |   const publicPath = path.join(publicDir, filename);
  11 |   await page.screenshot({ path: outputPath, fullPage: true });
  12 |   copyFileSync(outputPath, publicPath);
  13 | }
  14 | 
  15 | test.describe("AIBOUX Shop contact and shared legal templates", () => {
  16 |   test.beforeAll(() => {
  17 |     mkdirSync(outputDir, { recursive: true });
  18 |     mkdirSync(publicDir, { recursive: true });
  19 |   });
  20 | 
  21 |   test("contact validation is honest and does not fake successful delivery", async ({ page }) => {
  22 |     await page.setViewportSize({ width: 1365, height: 1200 });
  23 |     await page.goto("/s/aiboux/contact", { waitUntil: "networkidle" });
  24 |     await page.getByRole("button", { name: "入力内容を確認" }).click();
  25 |     await expect(page.getByText("お名前を入力してください。")).toBeVisible();
  26 |     await expect(page.getByText("正しいメールアドレスを入力してください。")).toBeVisible();
  27 |     await expect(page.getByText("内容を入力してください。")).toBeVisible();
  28 | 
  29 |     await page.locator("input[name='name']").fill("検証 太郎");
  30 |     await page.locator("input[name='email']").fill("invalid-email");
  31 |     await page.locator("input[name='orderNumber']").fill("#AIBOUX-1001");
  32 |     await page.locator("textarea[name='message']").fill("問い合わせ検証です。");
  33 |     await page.getByRole("button", { name: "入力内容を確認" }).click();
  34 |     await expect(page.getByText("正しいメールアドレスを入力してください。")).toBeVisible();
  35 | 
  36 |     await page.locator("input[name='email']").fill("tester@example.com");
  37 |     await page.getByRole("button", { name: "入力内容を確認" }).click();
  38 |     await expect(page.getByText("送信完了扱いにはしません。")).toBeVisible();
  39 |     await expect(page.getByTestId("storefront-buying-guide")).toHaveCount(0);
  40 |     await expect(page.getByTestId("storefront-footer")).toBeVisible();
  41 |     await saveScreenshot(page, "shop-contact-page.png");
  42 |   });
  43 | 
  44 |   test("legal, privacy, shipping, returns, and FAQ pages render shared templates", async ({ page }) => {
  45 |     await page.setViewportSize({ width: 1365, height: 1200 });
  46 |     const expectations = [
  47 |       { path: "/s/aiboux/legal", text: "販売業者", file: "shop-legal-page.png" },
  48 |       { path: "/s/aiboux/privacy", text: "個人情報", file: "shop-privacy-page.png" },
  49 |       { path: "/s/aiboux/shipping", text: "配送方法と送料", file: "shop-shipping-page.png" },
  50 |       { path: "/s/aiboux/returns", text: "返品・交換", file: "shop-returns-page.png" },
  51 |       { path: "/s/aiboux/faq", text: "よくある質問", file: "shop-faq-page.png" },
  52 |     ];
  53 | 
  54 |     for (const item of expectations) {
  55 |       await page.goto(item.path, { waitUntil: "networkidle" });
  56 |       await expect(page.locator("body")).toContainText(item.text);
  57 |       await expect(page.locator("body")).not.toContainText("ページが見つかりません");
  58 |       if (item.path !== "/s/aiboux/faq") {
  59 |         await expect(page.getByTestId("storefront-policy-page")).toBeVisible();
> 60 |         await expect(page.getByText("AIBOUX Shop お買い物ガイド")).toBeVisible();
     |                                                             ^ Error: expect(locator).toBeVisible() failed
  61 |         await expect(page.getByText("最終更新日")).toBeVisible();
  62 |         await expect(page.locator("body")).not.toContainText("AIBOUX Shop 共通テンプレート");
  63 |         await expect(page.locator("body")).not.toContainText("表示確認日");
  64 |         await expect(page.locator("body")).not.toContainText("D1 migration");
  65 |         await expect(page.locator("body")).not.toContainText("DB migration");
  66 |         await expect(page.locator("body")).not.toContainText("管理画面");
  67 |       }
  68 |       await expect(page.getByTestId("storefront-buying-guide")).toHaveCount(0);
  69 |       await expect(page.getByTestId("storefront-footer")).toBeVisible();
  70 |       await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  71 |       await saveScreenshot(page, item.file);
  72 |     }
  73 |   });
  74 | });
  75 | 
```