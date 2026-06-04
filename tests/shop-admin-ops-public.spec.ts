import { expect, test, type Page } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const outputDir = "output/playwright/shop-admin-ops";
const publicDir = "public/g/screens";

async function saveScreenshot(page: Page, filename: string) {
  const outputPath = path.join(outputDir, filename);
  const publicPath = path.join(publicDir, filename);
  await page.screenshot({ path: outputPath, fullPage: true });
  copyFileSync(outputPath, publicPath);
}

test.describe("AIBOUX Shop admin operations public quality", () => {
  test.beforeAll(() => {
    mkdirSync(outputDir, { recursive: true });
    mkdirSync(publicDir, { recursive: true });
  });

  test("admin product, order, settings, design, and subscription pages are operational shells", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    const pages = [
      { path: "/s/aiboux/admin/products", text: /商品|Product/i, file: "shop-admin-products.png" },
      { path: "/s/aiboux/admin/orders", text: /注文|Order/i, file: "shop-admin-orders.png" },
      { path: "/s/aiboux/admin/settings", text: /設定|Settings/i, file: "shop-admin-settings.png" },
      { path: "/s/aiboux/admin/design", text: "AIBOUX SHOP ストアデザインエディタ", file: "shop-admin-design.png" },
      { path: "/s/aiboux/admin/subscriptions", text: "定期購入", file: "shop-admin-subscriptions.png" },
    ];

    for (const target of pages) {
      await page.goto(`${target.path}?adminOps=${Date.now()}`, { waitUntil: "networkidle" });
      await expect(page.locator("body")).toContainText(target.text);
      await expect(page.locator("body")).not.toContainText("2024/05");
      await expect(page.locator("body")).not.toContainText("山田 太郎");
      await expect(page.locator("body")).not.toContainText("#10085");
      await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
      await saveScreenshot(page, target.file);
    }
  });

  test("design editor remains a focused two-page editor", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/s/aiboux/admin/design", { waitUntil: "networkidle" });
    await expect(page.locator("[data-shop-design-editor-shell]")).toBeVisible();
    await expect(page.getByText("TOPページ").first()).toBeVisible();
    await expect(page.getByText("商品詳細ページ").first()).toBeVisible();
    await expect(page.getByText("商品一覧ページ")).toHaveCount(0);
    await expect(page.getByText("カートページ")).toHaveCount(0);
    await expect(page.getByText("チェックアウトページ")).toHaveCount(0);
    await expect(page.getByText("編集できるのは「TOPページ」と「商品詳細ページ」のみです。")).toBeVisible();
  });
});
