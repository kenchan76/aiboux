import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const outputDir = "output/playwright/shop-subscriptions";
const publicDir = "public/g/screens";
const productFallback = "/s/aiboux/product/shopprod_tenant_001_4580000232621";
const testPlanId = "subplan_playwright_subscription_gate";

async function saveScreenshot(page: Page, filename: string) {
  const outputPath = path.join(outputDir, filename);
  const publicPath = path.join(publicDir, filename);
  await page.screenshot({ path: outputPath, fullPage: true });
  copyFileSync(outputPath, publicPath);
}

async function findProductPath(page: Page, request: APIRequestContext) {
  const fallbackResponse = await request.get(productFallback);
  if (fallbackResponse.status() === 200) return productFallback;

  await page.goto("/s/aiboux/products", { waitUntil: "networkidle" });
  const href = await page.locator("a[href*='/s/aiboux/product/']").first().getAttribute("href");
  expect(href, "at least one public product detail URL should exist for subscription evidence").toBeTruthy();
  return href!;
}

function productIdFromPath(productPath: string): string {
  const match = productPath.match(/\/product\/([^/?#]+)/);
  expect(match?.[1], "product id should be present in product URL").toBeTruthy();
  return decodeURIComponent(match![1]);
}

async function seedSubscriptionPlan(request: APIRequestContext, productId: string) {
  const getResponse = await request.get(`/shop/api/subscription-plans?tenant=aiboux&productId=${encodeURIComponent(productId)}`);
  expect(getResponse.status(), "subscription plan GET should succeed").toBe(200);
  const current = await getResponse.json() as { plans?: Array<Record<string, unknown>> };
  const plans = (current.plans ?? []).filter((plan) => plan.id !== testPlanId);
  plans.push({
    id: testPlanId,
    name: "Playwright毎月便",
    intervalUnit: "month",
    intervalCount: 1,
    price: 3582,
    discountRate: 10,
    firstOrderPrice: null,
    minimumCycles: 0,
    canSkip: true,
    canPause: true,
    canCancel: true,
    status: "active",
    noticeText: "いつでもスキップ・停止できます。",
    cancellationPolicy: "解約は次回請求前までに管理画面で確認します。",
  });

  const postResponse = await request.post("/shop/api/subscription-plans?tenant=aiboux", {
    data: {
      productId,
      plans,
      actorId: "playwright-shop-subscription-gate",
    },
  });
  expect(postResponse.status(), "subscription plan POST should save").toBe(200);
  const saved = await postResponse.json() as { plans?: Array<Record<string, unknown>> };
  expect(saved.plans?.some((plan) => plan.id === testPlanId && plan.status === "active")).toBe(true);
}

test.describe("AIBOUX Shop subscription public gate", () => {
  test.beforeAll(() => {
    mkdirSync(outputDir, { recursive: true });
    mkdirSync(publicDir, { recursive: true });
  });

  test("product detail, cart, checkout, and admin subscriptions expose honest subscription flow", async ({ page, request }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    const productPath = await findProductPath(page, request);
    const productId = productIdFromPath(productPath);
    await seedSubscriptionPlan(request, productId);

    await page.goto(`${productPath}?subscriptionGate=${Date.now()}`, { waitUntil: "networkidle" });
    await expect(page.getByTestId("public-product-detail")).toBeVisible();
    await expect(page.getByTestId("subscription-purchase-options")).toBeVisible();
    await expect(page.getByText("購入方法")).toBeVisible();
    await expect(page.getByText("Playwright毎月便").first()).toBeVisible();
    await page.locator("input[name='purchase_mode'][value='subscription']").first().check({ force: true });
    await saveScreenshot(page, "shop-subscription-product-1980.png");

    await page.locator("[data-cart-add]").first().click();
    await page.waitForURL("**/s/aiboux/cart");
    await expect(page.getByText("定期購入:")).toBeVisible();
    await expect(page.getByText("次回以降合計")).toBeVisible();
    await saveScreenshot(page, "shop-subscription-cart-1980.png");

    await page.getByRole("link", { name: "チェックアウトへ進む" }).click();
    await expect(page).toHaveURL(/\/s\/aiboux\/checkout/);
    await expect(page.getByText("定期決済設定が未完了です")).toBeVisible();
    await expect(page.getByText("定期購入規約、解約ポリシー、次回配送予定を確認しました。")).toBeVisible();
    await page.locator("[data-subscription-submit]").click();
    await expect(page.locator("[data-subscription-result]")).toContainText(/定期決済設定が未完了です|Provider subscription creation is not implemented/);
    await saveScreenshot(page, "shop-subscription-checkout-1980.png");

    await page.goto("/s/aiboux/admin/subscriptions", { waitUntil: "networkidle" });
    await expect(page.getByTestId("admin-subscriptions-page")).toBeVisible();
    await expect(page.getByText("定期購入", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("公開チェックアウト確認").first()).toBeVisible();
    await expect(page.getByText("Playwright毎月便").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /一時停止|再開/ }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "スキップ" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "解約" }).first()).toBeVisible();
    await saveScreenshot(page, "shop-subscription-admin-1980.png");
  });
});
