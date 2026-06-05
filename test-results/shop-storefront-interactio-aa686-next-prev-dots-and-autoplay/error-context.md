# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-storefront-interaction-public.spec.ts >> AIBOUX Shop public storefront interactions >> public hero carousel changes slides by next, prev, dots, and autoplay
- Location: tests/shop-storefront-interaction-public.spec.ts:21:3

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByTestId('hero-slide-main')
Expected: "slide-main"
Received: "setsuka-hero-market"
Timeout:  10000ms

Call log:
  - Expect "toHaveAttribute" with timeout 10000ms
  - waiting for getByTestId('hero-slide-main')
    11 × locator resolved to <article data-real-index="1" data-track-index="2" data-hero-slide="true" data-slide-id="slide-daily" data-testid="hero-slide-main" class="relative min-h-[330px] shrink-0 basis-[72%] overflow-hidden rounded-md bg-neutral-950 text-white shadow-sm transition-[filter,opacity,transform] duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] opacity-100 scale-100">…</article>
       - unexpected value "slide-daily"
    10 × locator resolved to <article data-real-index="2" data-track-index="3" data-hero-slide="true" data-slide-id="slide-season" data-testid="hero-slide-main" class="relative min-h-[330px] shrink-0 basis-[72%] overflow-hidden rounded-md bg-neutral-950 text-white shadow-sm transition-[filter,opacity,transform] duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] opacity-100 scale-100">…</article>
       - unexpected value "slide-season"
    3 × locator resolved to <article data-real-index="3" data-track-index="4" data-hero-slide="true" data-testid="hero-slide-main" data-slide-id="setsuka-hero-market" class="relative min-h-[330px] shrink-0 basis-[72%] overflow-hidden rounded-md bg-neutral-950 text-white shadow-sm transition-[filter,opacity,transform] duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] opacity-100 scale-100">…</article>
      - unexpected value "setsuka-hero-market"

```

```yaml
- article:
  - text: AIBOUX SALE
  - heading "毎日の暮らしを整える、雪花セレクト市" [level=2]
  - paragraph: 飲料、日用品、キッチン雑貨まで。今日ほしいものを見つけやすい売り場にまとめました。
  - link "おすすめを見る":
    - /url: /s/aiboux/products
```

# Test source

```ts
  1   | import { expect, test, type Page } from "@playwright/test";
  2   | import { copyFileSync, mkdirSync } from "node:fs";
  3   | import path from "node:path";
  4   | 
  5   | const outputDir = "output/playwright/shop-storefront-interaction";
  6   | const publicDir = "public/g/screens";
  7   | 
  8   | async function saveScreenshot(page: Page, filename: string) {
  9   |   const outputPath = path.join(outputDir, filename);
  10  |   const publicPath = path.join(publicDir, filename);
  11  |   await page.screenshot({ path: outputPath, fullPage: true });
  12  |   copyFileSync(outputPath, publicPath);
  13  | }
  14  | 
  15  | test.describe("AIBOUX Shop public storefront interactions", () => {
  16  |   test.beforeAll(() => {
  17  |     mkdirSync(outputDir, { recursive: true });
  18  |     mkdirSync(publicDir, { recursive: true });
  19  |   });
  20  | 
  21  |   test("public hero carousel changes slides by next, prev, dots, and autoplay", async ({ page }) => {
  22  |     await page.setViewportSize({ width: 1365, height: 1200 });
  23  |     await page.goto("/s/aiboux/", { waitUntil: "networkidle" });
  24  | 
  25  |     const carousel = page.getByTestId("hero-carousel");
  26  |     const main = page.getByTestId("hero-slide-main");
  27  |     const prev = page.getByTestId("hero-slide-prev");
  28  |     const next = page.getByTestId("hero-slide-next");
  29  | 
  30  |     await expect(carousel).toBeVisible();
  31  |     await expect(main.locator("img")).toBeVisible();
  32  |     await expect(prev.locator("img")).toBeVisible();
  33  |     await expect(next.locator("img")).toBeVisible();
  34  |     await expect(page.getByTestId("hero-dot-0")).toHaveAttribute("aria-current", "true");
  35  |     await saveScreenshot(page, "shop-hero-initial-1365.png");
  36  | 
  37  |     const initialMainId = await main.getAttribute("data-slide-id");
  38  |     const initialPrevId = await prev.getAttribute("data-slide-id");
  39  |     const initialNextId = await next.getAttribute("data-slide-id");
  40  |     const initialTitle = await main.locator("[data-hero-title]").innerText();
  41  |     const initialSrc = await main.locator("[data-hero-main-img]").getAttribute("src");
  42  | 
  43  |     await page.getByTestId("hero-next-button").click();
  44  |     await expect(main).not.toHaveAttribute("data-slide-id", initialMainId ?? "");
  45  |     await expect(page.getByTestId("hero-dot-1")).toHaveAttribute("aria-current", "true");
  46  |     expect(await main.locator("[data-hero-title]").innerText()).not.toBe(initialTitle);
  47  |     expect(await main.locator("[data-hero-main-img]").getAttribute("src")).not.toBe(initialSrc);
  48  |     expect(await prev.getAttribute("data-slide-id")).not.toBe(initialPrevId);
  49  |     expect(await next.getAttribute("data-slide-id")).not.toBe(initialNextId);
  50  |     await saveScreenshot(page, "shop-hero-after-next-1365.png");
  51  | 
  52  |     await page.getByTestId("hero-prev-button").click();
> 53  |     await expect(main).toHaveAttribute("data-slide-id", initialMainId ?? "");
      |                        ^ Error: expect(locator).toHaveAttribute(expected) failed
  54  |     await expect(page.getByTestId("hero-dot-0")).toHaveAttribute("aria-current", "true");
  55  | 
  56  |     await page.getByTestId("hero-dot-2").click();
  57  |     await expect(page.getByTestId("hero-dot-2")).toHaveAttribute("aria-current", "true");
  58  |     const dotMainId = await main.getAttribute("data-slide-id");
  59  |     await saveScreenshot(page, "shop-hero-after-dot-1365.png");
  60  | 
  61  |     await page.getByTestId("hero-next-button").click();
  62  |     await expect(main).not.toHaveAttribute("data-slide-id", dotMainId ?? "");
  63  | 
  64  |     const beforeAutoplay = await main.getAttribute("data-slide-id");
  65  |     await page.locator("body").click({ position: { x: 12, y: 12 } });
  66  |     await page.waitForTimeout(6200);
  67  |     await expect(main).not.toHaveAttribute("data-slide-id", beforeAutoplay ?? "");
  68  |     await saveScreenshot(page, "shop-hero-after-autoplay-1365.png");
  69  |   });
  70  | 
  71  |   test("public product card, add-to-cart, and more links work", async ({ page }) => {
  72  |     await page.setViewportSize({ width: 1365, height: 1200 });
  73  |     await page.goto("/s/aiboux/", { waitUntil: "networkidle" });
  74  |     await page.evaluate(() => localStorage.removeItem("aiboux:shop:aiboux:cart"));
  75  |     await page.reload({ waitUntil: "networkidle" });
  76  | 
  77  |     const detailLink = page.locator('[data-testid="recommended-products"] [data-testid="product-card"] a[href*="/s/aiboux/product/"]').first();
  78  |     await expect(detailLink, "at least one public TOP product card should link to product detail").toBeVisible();
  79  |     await detailLink.click();
  80  |     await expect(page).toHaveURL(/\/s\/aiboux\/product\//);
  81  |     await expect(page.locator("body")).toContainText(/カートに|商品|購入/);
  82  |     await saveScreenshot(page, "shop-product-card-click-result.png");
  83  | 
  84  |     await page.goto("/s/aiboux/", { waitUntil: "networkidle" });
  85  |     const cartCount = page.getByTestId("storefront-cart-count").first();
  86  |     await expect(cartCount).toHaveText("0");
  87  |     await page.getByTestId("storefront-product-add-to-cart").first().click();
  88  |     await expect(cartCount).toHaveText("1");
  89  |     await expect(page.getByTestId("storefront-product-add-to-cart").first()).toHaveAttribute("data-cart-added", "true");
  90  |     await saveScreenshot(page, "shop-cart-add-result.png");
  91  | 
  92  |     await page.getByTestId("recommended-products").getByRole("link", { name: "もっと見る" }).click();
  93  |     await expect(page).toHaveURL(/\/s\/aiboux\/products$/);
  94  | 
  95  |     await page.goto("/s/aiboux/", { waitUntil: "networkidle" });
  96  |     await expect(page.getByTestId("bestseller-ranking").getByRole("link", { name: "もっと見る" })).toHaveAttribute("href", "/s/aiboux/products?category=ranking");
  97  |     await expect(page.getByTestId("time-sale-products").getByRole("link", { name: "もっと見る" })).toHaveAttribute("href", "/s/aiboux/products?category=sale");
  98  |     await expect(page.getByTestId("category-showcase").getByRole("link", { name: "コーヒー・お茶" })).toHaveAttribute("href", "/s/aiboux/products?category=coffee-tea");
  99  |     await expect(page.getByTestId("category-showcase").getByRole("link", { name: "キッチン用品" })).toHaveAttribute("href", "/s/aiboux/products?category=kitchen");
  100 |     await page.getByTestId("category-showcase").getByRole("link", { name: "コーヒー・お茶" }).click();
  101 |     await expect(page).toHaveURL(/\/s\/aiboux\/products\?category=coffee-tea$/);
  102 | 
  103 |     await page.goto("/s/aiboux/", { waitUntil: "networkidle" });
  104 |     await page.getByTestId("category-showcase").getByRole("link", { name: "もっと見る" }).click();
  105 |     await expect(page).toHaveURL(/\/s\/aiboux\/categories$/);
  106 | 
  107 |     await page.goto("/s/aiboux/", { waitUntil: "networkidle" });
  108 |     await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  109 |   });
  110 | });
  111 | 
```