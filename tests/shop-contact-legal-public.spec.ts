import { expect, test, type Page } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const outputDir = "output/playwright/shop-contact-legal";
const publicDir = "public/g/screens";

async function saveScreenshot(page: Page, filename: string) {
  const outputPath = path.join(outputDir, filename);
  const publicPath = path.join(publicDir, filename);
  await page.screenshot({ path: outputPath, fullPage: true });
  copyFileSync(outputPath, publicPath);
}

test.describe("AIBOUX Shop contact and shared legal templates", () => {
  test.beforeAll(() => {
    mkdirSync(outputDir, { recursive: true });
    mkdirSync(publicDir, { recursive: true });
  });

  test("contact validation is honest and does not fake successful delivery", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 1200 });
    await page.goto("/s/aiboux/contact", { waitUntil: "networkidle" });
    await expect(page.getByTestId("storefront-contact-topic-grid")).toBeVisible();
    await expect(page.getByTestId("storefront-contact-topic-grid")).toContainText("商品について");
    await expect(page.getByTestId("storefront-contact-topic-grid")).toContainText("注文履歴");
    await page.getByRole("button", { name: "入力内容を確認" }).click();
    await expect(page.getByText("お名前を入力してください。")).toBeVisible();
    await expect(page.getByText("正しいメールアドレスを入力してください。")).toBeVisible();
    await expect(page.getByText("内容を入力してください。")).toBeVisible();

    await page.locator("input[name='name']").fill("検証 太郎");
    await page.locator("input[name='email']").fill("invalid-email");
    await page.locator("input[name='orderNumber']").fill("#AIBOUX-1001");
    await page.locator("textarea[name='message']").fill("問い合わせ検証です。");
    await page.getByRole("button", { name: "入力内容を確認" }).click();
    await expect(page.getByText("正しいメールアドレスを入力してください。")).toBeVisible();

    await page.locator("input[name='email']").fill("tester@example.com");
    await page.getByRole("button", { name: "入力内容を確認" }).click();
    await expect(page.getByText("送信完了扱いにはしません。")).toBeVisible();
    await expect(page.getByTestId("storefront-buying-guide")).toHaveCount(0);
    await expect(page.getByTestId("storefront-footer")).toBeVisible();
    await saveScreenshot(page, "shop-contact-page.png");
  });

  test("legal, privacy, shipping, returns, and FAQ pages render shared templates", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 1200 });
    const expectations = [
      { path: "/s/aiboux/legal", text: "販売業者", file: "shop-legal-page.png" },
      { path: "/s/aiboux/privacy", text: "個人情報", file: "shop-privacy-page.png" },
      { path: "/s/aiboux/shipping", text: "配送方法と送料", file: "shop-shipping-page.png" },
      { path: "/s/aiboux/returns", text: "返品・交換", file: "shop-returns-page.png" },
      { path: "/s/aiboux/faq", text: "よくある質問", file: "shop-faq-page.png" },
    ];

    for (const item of expectations) {
      await page.goto(item.path, { waitUntil: "networkidle" });
      await expect(page.locator("body")).toContainText(item.text);
      await expect(page.locator("body")).not.toContainText("ページが見つかりません");
      if (item.path !== "/s/aiboux/faq") {
        await expect(page.getByTestId("storefront-policy-page")).toBeVisible();
        await expect(page.getByText("お買い物ガイド")).toBeVisible();
        await expect(page.getByText("最終更新日")).toBeVisible();
        await expect(page.locator("body")).not.toContainText("AIBOUX Shop 共通テンプレート");
        await expect(page.locator("body")).not.toContainText("表示確認日");
        await expect(page.locator("body")).not.toContainText("D1 migration");
        await expect(page.locator("body")).not.toContainText("DB migration");
        await expect(page.locator("body")).not.toContainText("クロール可能");
        await expect(page.locator("body")).not.toContainText("内部リンク");
        await expect(page.locator("body")).not.toContainText("Page guide");
        await expect(page.locator("body")).not.toContainText("Trust / proof matrix");
        const html = await page.content();
        expect(html).not.toContain("クロール可能");
        expect(html).not.toContain("内部リンク");
        expect(html).not.toContain("Page guide");
        expect(html).not.toContain("Trust / proof matrix");
        await expect(page.locator("body")).not.toContainText("管理画面");
      }
      await expect(page.getByTestId("storefront-buying-guide")).toHaveCount(0);
      await expect(page.getByTestId("storefront-footer")).toBeVisible();
      await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
      await saveScreenshot(page, item.file);
    }
  });
});
