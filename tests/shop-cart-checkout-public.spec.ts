import { expect, test, type Page } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const outputDir = "output/playwright/shop-cart-checkout";
const publicDir = "public/g/screens";
const fallbackProductPath = "/s/aiboux/product/shopprod_tenant_001_4580000232621";

async function saveScreenshot(page: Page, filename: string) {
  const outputPath = path.join(outputDir, filename);
  const publicPath = path.join(publicDir, filename);
  await page.screenshot({ path: outputPath, fullPage: true });
  copyFileSync(outputPath, publicPath);
}

test.describe("AIBOUX Shop cart and checkout public quality", () => {
  test.beforeAll(() => {
    mkdirSync(outputDir, { recursive: true });
    mkdirSync(publicDir, { recursive: true });
  });

  test("checkout empty state recovers shoppers to products, cart, and shipping without pretending payment is ready", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 1200 });
    await page.goto(`/s/aiboux/checkout?emptyCheckoutGate=${Date.now()}`, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.removeItem("aiboux:shop:aiboux:cart"));
    await page.reload({ waitUntil: "networkidle" });

    const guide = page.getByTestId("storefront-checkout-empty-guide");
    await expect(guide).toBeVisible();
    await expect(guide).toContainText("カートに商品がありません");
    await expect(page.locator("[data-checkout-step-index='0']")).toHaveAttribute("data-current", "true");
    await expect(page.locator("[data-checkout-step-index='1']")).toHaveAttribute("data-current", "false");
    await expect(guide).toContainText("配送・返品条件");
    await expect(guide.getByRole("link", { name: "商品一覧へ戻る" })).toHaveAttribute("href", "/s/aiboux/products");
    await expect(guide.getByRole("link", { name: "カートを確認" })).toHaveAttribute("href", "/s/aiboux/cart");
    await expect(guide.getByRole("link", { name: "配送条件を見る" })).toHaveAttribute("href", "/s/aiboux/shipping");
    await expect(page.getByText("注文が確定しました")).toHaveCount(0);
    await expect(page.getByText("支払いが完了しました")).toHaveCount(0);
    await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
    await saveScreenshot(page, "shop-checkout-empty-guide.png");
  });

  test("cart supports quantity, remove, and checkout shows honest payment blocker", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 1200 });
    await page.goto("/s/aiboux/cart", { waitUntil: "networkidle" });
    await expect(page.getByTestId("storefront-cart-recovery-panel")).toBeVisible();
    await expect(page.getByTestId("storefront-cart-recovery-panel")).toContainText("配送予定を確認");
    await expect(page.getByTestId("storefront-cart-recovery-panel")).toContainText("返品条件を確認");
    await expect(page.getByTestId("storefront-cart-purchase-check")).not.toBeVisible();
    await page.evaluate(() => {
      localStorage.setItem(
        "aiboux:shop:aiboux:cart",
        JSON.stringify([
          { id: "sprint-normal", name: "雪花セレクト ドリップコーヒー 20袋", price: 1980, image: "", quantity: 1, purchaseMode: "normal" },
          { id: "sprint-subscription", name: "軽量ステンレスボトル 500ml", price: 2232, image: "", quantity: 1, purchaseMode: "subscription", subscriptionPlanName: "毎月便", subscriptionInterval: "毎月" },
        ]),
      );
    });
    await page.goto(`/s/aiboux/cart?cartGate=${Date.now()}`, { waitUntil: "networkidle" });

    const cartList = page.locator("[data-cart-list]");
    await expect(cartList.getByText("雪花セレクト ドリップコーヒー 20袋")).toBeVisible();
    await expect(cartList.getByText("お届け目安 2〜4営業日")).toHaveCount(2);
    await expect(cartList.getByRole("link", { name: "配送条件" }).first()).toHaveAttribute("href", "/s/aiboux/shipping");
    await expect(page.getByTestId("storefront-cart-purchase-check")).toBeVisible();
    await expect(page.getByTestId("storefront-cart-purchase-check")).toContainText("通常購入と定期購入を分けて表示");
    await expect(page.getByText("定期購入:")).toBeVisible();
    await expect(page.getByText("次回以降合計")).toBeVisible();
    await expect(page.locator("[data-cart-total-items]")).toHaveText("2点");
    await expect(page.locator("[data-cart-grand-total]")).toHaveText("¥4,212");
    await expect(page.locator("[data-cart-quantity-control]")).toHaveCount(2);
    await expect(page.locator("[data-cart-qty-decrease]").first()).toBeVisible();
    await expect(page.locator("[data-cart-qty-increase]").first()).toBeVisible();
    await saveScreenshot(page, "shop-cart-page.png");

    await page.locator("[data-cart-qty-increase]").first().click();
    await expect(page.locator("[data-cart-subtotal]")).toHaveText("¥6,192");
    await expect(page.locator("[data-cart-total-items]")).toHaveText("3点");
    await expect(page.locator("[data-cart-grand-total]")).toHaveText("¥6,192");
    await page.locator("[data-cart-qty-decrease]").first().click();
    await expect(page.locator("[data-cart-subtotal]")).toHaveText("¥4,212");
    await expect(page.locator("[data-cart-total-items]")).toHaveText("2点");
    await page.locator("[data-cart-qty]").first().fill("2");
    await expect(page.locator("[data-cart-subtotal]")).toHaveText("¥6,192");
    await expect(page.locator("[data-cart-total-items]")).toHaveText("3点");
    await page.locator("[data-cart-remove]").first().click();
    await expect(cartList.getByText("雪花セレクト ドリップコーヒー 20袋")).toHaveCount(0);
    await expect(page.locator("[data-cart-total-items]")).toHaveText("1点");
    await expect(page.locator("[data-cart-grand-total]")).toHaveText("¥2,232");

    await page.getByRole("link", { name: "チェックアウトへ進む" }).click();
    await expect(page).toHaveURL(/\/s\/aiboux\/checkout/);
    await expect(page.getByTestId("storefront-checkout-stepper")).toBeVisible();
    await expect(page.locator("[data-checkout-step-index='0']")).toHaveAttribute("data-current", "false");
    await expect(page.locator("[data-checkout-step-index='1']")).toHaveAttribute("data-current", "true");
    await expect(page.getByTestId("storefront-checkout-order-guard")).toBeVisible();
    await expect(page.getByTestId("storefront-checkout-payment-panel")).toBeVisible();
    await expect(page.getByTestId("storefront-checkout-live-summary")).toBeVisible();
    await expect(page.getByTestId("storefront-checkout-payment-panel")).toContainText("通常購入");
    await expect(page.getByTestId("storefront-checkout-payment-panel")).toContainText("サポート");
    await expect(page.locator("[data-checkout-total-items]")).toHaveText("1点");
    await expect(page.locator("[data-checkout-grand-total]")).toHaveText("¥2,232");
    await expect(page.locator("[data-checkout-side-total-items]")).toHaveText("1点");
    await expect(page.locator("[data-checkout-side-grand-total]")).toHaveText("¥2,232");
    await expect(page.locator("[data-checkout-side-mode]")).toHaveText("定期購入");
    await expect(page.locator("[data-checkout-side-items]")).toContainText("軽量ステンレスボトル 500ml");
    await expect(page.getByTestId("storefront-checkout-order-guard")).toContainText("税込価格");
    await expect(page.getByTestId("storefront-checkout-order-guard")).toContainText("定期購入");
    await expect(page.getByText("支払い方法を確認してください")).toBeVisible();
    await expect(page.getByText("定期購入の支払い方法を確認してください")).toBeVisible();
    await expect(page.locator("[data-subscription-terms-checkbox]")).toBeEnabled();
    await expect(page.locator("[data-checkout-customer-form]")).toBeVisible();
    await expect(page.locator("[data-checkout-customer-form] input[name='customerName']")).toBeEnabled();
    await expect(page.locator("[data-checkout-customer-form] input[name='customerEmail']")).toBeEnabled();
    await expect(page.locator("[data-checkout-customer-form] input[name='shippingAddress']")).toBeEnabled();
    await page.locator("[data-checkout-customer-form] input[name='customerName']").fill("山田 花子");
    await page.locator("[data-checkout-customer-form] input[name='customerEmail']").fill("hanako@example.com");
    await page.locator("[data-checkout-customer-form] input[name='shippingAddress']").fill("東京都千代田区丸の内1-1-1");
    await page.locator("[data-checkout-customer-form]").getByRole("button", { name: "配送先を確認" }).click();
    await expect(page.locator("[data-checkout-customer-status]")).toContainText("配送先と連絡先を確認しました");
    await expect(page.locator("body")).not.toContainText("決済設定");
    await expect(page.getByText("注文が確定しました")).toHaveCount(0);
    await expect(page.getByText("支払いが完了しました")).toHaveCount(0);
    await saveScreenshot(page, "shop-checkout-page.png");
  });

  test("product detail buy-now carries selected item into checkout", async ({ page, request }) => {
    await page.setViewportSize({ width: 1365, height: 1200 });
    const fallback = await request.get(fallbackProductPath);
    expect(fallback.status(), "fallback product detail should be available for buy-now flow").toBe(200);

    await page.goto(fallbackProductPath, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.removeItem("aiboux:shop:aiboux:cart"));
    const title = (await page.locator("h1").innerText()).trim();

    await expect(page.getByTestId("product-quantity-stepper")).toBeVisible();
    await page.locator("[data-product-quantity-increase]").click();
    await expect(page.locator("[data-product-quantity]")).toHaveValue("2");
    await page.getByRole("button", { name: /今すぐ購入|今すぐ申し込む/ }).click();
    await expect(page).toHaveURL(/\/s\/aiboux\/checkout/);
    await expect(page.locator("[data-checkout-items]")).toContainText(title);
    await expect(page.locator("[data-checkout-total-items]")).toHaveText("2点");
    await expect(page.locator("[data-checkout-grand-total]")).toContainText("¥");
    await expect(page.getByTestId("storefront-checkout-payment-panel")).toContainText("支払い方法");
    await saveScreenshot(page, "shop-checkout-buy-now-result.png");
  });
});
