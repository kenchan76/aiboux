# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-subscriptions-public.spec.ts >> AIBOUX Shop subscription public gate >> product detail, cart, checkout, and admin subscriptions expose honest subscription flow
- Location: tests/shop-subscriptions-public.spec.ts:73:3

# Error details

```
Error: subscription plan GET should succeed

expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 503
```

# Test source

```ts
  1   | import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
  2   | import { copyFileSync, mkdirSync } from "node:fs";
  3   | import path from "node:path";
  4   | 
  5   | const outputDir = "output/playwright/shop-subscriptions";
  6   | const publicDir = "public/g/screens";
  7   | const productFallback = "/s/aiboux/product/shopprod_tenant_001_4580000232621";
  8   | const testPlanId = "subplan_playwright_subscription_gate";
  9   | 
  10  | async function saveScreenshot(page: Page, filename: string) {
  11  |   const outputPath = path.join(outputDir, filename);
  12  |   const publicPath = path.join(publicDir, filename);
  13  |   await page.screenshot({ path: outputPath, fullPage: true });
  14  |   copyFileSync(outputPath, publicPath);
  15  | }
  16  | 
  17  | async function findProductPath(page: Page, request: APIRequestContext) {
  18  |   const fallbackResponse = await request.get(productFallback);
  19  |   if (fallbackResponse.status() === 200) return productFallback;
  20  | 
  21  |   await page.goto("/s/aiboux/products", { waitUntil: "networkidle" });
  22  |   const href = await page.locator("a[href*='/s/aiboux/product/']").first().getAttribute("href");
  23  |   expect(href, "at least one public product detail URL should exist for subscription evidence").toBeTruthy();
  24  |   return href!;
  25  | }
  26  | 
  27  | function productIdFromPath(productPath: string): string {
  28  |   const match = productPath.match(/\/product\/([^/?#]+)/);
  29  |   expect(match?.[1], "product id should be present in product URL").toBeTruthy();
  30  |   return decodeURIComponent(match![1]);
  31  | }
  32  | 
  33  | async function seedSubscriptionPlan(request: APIRequestContext, productId: string) {
  34  |   const getResponse = await request.get(`/shop/api/subscription-plans?tenant=aiboux&productId=${encodeURIComponent(productId)}`);
> 35  |   expect(getResponse.status(), "subscription plan GET should succeed").toBe(200);
      |                                                                        ^ Error: subscription plan GET should succeed
  36  |   const current = await getResponse.json() as { plans?: Array<Record<string, unknown>> };
  37  |   const plans = (current.plans ?? []).filter((plan) => plan.id !== testPlanId);
  38  |   plans.push({
  39  |     id: testPlanId,
  40  |     name: "Playwright毎月便",
  41  |     intervalUnit: "month",
  42  |     intervalCount: 1,
  43  |     price: 3582,
  44  |     discountRate: 10,
  45  |     firstOrderPrice: null,
  46  |     minimumCycles: 0,
  47  |     canSkip: true,
  48  |     canPause: true,
  49  |     canCancel: true,
  50  |     status: "active",
  51  |     noticeText: "いつでもスキップ・停止できます。",
  52  |     cancellationPolicy: "解約は次回請求前までに管理画面で確認します。",
  53  |   });
  54  | 
  55  |   const postResponse = await request.post("/shop/api/subscription-plans?tenant=aiboux", {
  56  |     data: {
  57  |       productId,
  58  |       plans,
  59  |       actorId: "playwright-shop-subscription-gate",
  60  |     },
  61  |   });
  62  |   expect(postResponse.status(), "subscription plan POST should save").toBe(200);
  63  |   const saved = await postResponse.json() as { plans?: Array<Record<string, unknown>> };
  64  |   expect(saved.plans?.some((plan) => plan.id === testPlanId && plan.status === "active")).toBe(true);
  65  | }
  66  | 
  67  | test.describe("AIBOUX Shop subscription public gate", () => {
  68  |   test.beforeAll(() => {
  69  |     mkdirSync(outputDir, { recursive: true });
  70  |     mkdirSync(publicDir, { recursive: true });
  71  |   });
  72  | 
  73  |   test("product detail, cart, checkout, and admin subscriptions expose honest subscription flow", async ({ page, request }) => {
  74  |     await page.setViewportSize({ width: 1980, height: 1080 });
  75  |     const productPath = await findProductPath(page, request);
  76  |     const productId = productIdFromPath(productPath);
  77  |     await seedSubscriptionPlan(request, productId);
  78  | 
  79  |     await page.goto(`${productPath}?subscriptionGate=${Date.now()}`, { waitUntil: "networkidle" });
  80  |     await expect(page.getByTestId("public-product-detail")).toBeVisible();
  81  |     await expect(page.getByTestId("subscription-purchase-options")).toBeVisible();
  82  |     await expect(page.getByText("購入方法")).toBeVisible();
  83  |     await expect(page.getByText("Playwright毎月便").first()).toBeVisible();
  84  |     await page.locator("input[name='purchase_mode'][value='subscription']").first().check({ force: true });
  85  |     await saveScreenshot(page, "shop-subscription-product-1980.png");
  86  | 
  87  |     await page.locator("[data-cart-add]").first().click();
  88  |     await page.waitForURL("**/s/aiboux/cart");
  89  |     await expect(page.getByText("定期購入:")).toBeVisible();
  90  |     await expect(page.getByText("次回以降合計")).toBeVisible();
  91  |     await saveScreenshot(page, "shop-subscription-cart-1980.png");
  92  | 
  93  |     await page.getByRole("link", { name: "チェックアウトへ進む" }).click();
  94  |     await expect(page).toHaveURL(/\/s\/aiboux\/checkout/);
  95  |     await expect(page.getByText("定期決済設定が未完了です")).toBeVisible();
  96  |     await expect(page.getByText("定期購入規約、解約ポリシー、次回配送予定を確認しました。")).toBeVisible();
  97  |     await page.locator("[data-subscription-submit]").click();
  98  |     await expect(page.locator("[data-subscription-result]")).toContainText(/定期決済設定が未完了です|Provider subscription creation is not implemented/);
  99  |     await saveScreenshot(page, "shop-subscription-checkout-1980.png");
  100 | 
  101 |     await page.goto("/s/aiboux/admin/subscriptions", { waitUntil: "networkidle" });
  102 |     await expect(page.getByTestId("admin-subscriptions-page")).toBeVisible();
  103 |     await expect(page.getByText("定期購入", { exact: true }).first()).toBeVisible();
  104 |     await expect(page.getByText("公開チェックアウト確認").first()).toBeVisible();
  105 |     await expect(page.getByText("Playwright毎月便").first()).toBeVisible();
  106 |     await expect(page.getByRole("button", { name: /一時停止|再開/ }).first()).toBeVisible();
  107 |     await expect(page.getByRole("button", { name: "スキップ" }).first()).toBeVisible();
  108 |     await expect(page.getByRole("button", { name: "解約" }).first()).toBeVisible();
  109 |     await saveScreenshot(page, "shop-subscription-admin-1980.png");
  110 |   });
  111 | });
  112 | 
```