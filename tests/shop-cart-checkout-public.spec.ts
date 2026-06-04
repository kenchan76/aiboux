import { expect, test, type Page } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const outputDir = "output/playwright/shop-cart-checkout";
const publicDir = "public/g/screens";

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

  test("cart supports quantity, remove, and checkout shows honest payment blocker", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 1200 });
    await page.goto("/s/aiboux/cart", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      localStorage.setItem(
        "aiboux:shop:aiboux:cart",
        JSON.stringify([
          { id: "sprint-normal", name: "雪花セレクト ドリップコーヒー 20袋", price: 1980, image: "", quantity: 1, purchaseMode: "normal" },
          { id: "sprint-subscription", name: "軽量ステンレスボトル 500ml", price: 2232, image: "", quantity: 1, purchaseMode: "subscription", subscriptionPlanName: "毎月便", subscriptionInterval: "毎月" },
        ]),
      );
      window.location.reload();
    });

    await expect(page.getByText("雪花セレクト ドリップコーヒー 20袋")).toBeVisible();
    await expect(page.getByText("定期購入:")).toBeVisible();
    await expect(page.getByText("次回以降合計")).toBeVisible();
    await saveScreenshot(page, "shop-cart-page.png");

    await page.locator("[data-cart-qty]").first().fill("2");
    await expect(page.getByText("¥6,192")).toBeVisible();
    await page.locator("[data-cart-remove]").first().click();
    await expect(page.getByText("雪花セレクト ドリップコーヒー 20袋")).toHaveCount(0);

    await page.getByRole("link", { name: "チェックアウトへ進む" }).click();
    await expect(page).toHaveURL(/\/s\/aiboux\/checkout/);
    await expect(page.getByText("決済設定が必要です")).toBeVisible();
    await expect(page.getByText("定期決済設定が未完了です")).toBeVisible();
    await expect(page.getByText("注文が確定しました")).toHaveCount(0);
    await expect(page.getByText("支払いが完了しました")).toHaveCount(0);
    await saveScreenshot(page, "shop-checkout-page.png");
  });
});
