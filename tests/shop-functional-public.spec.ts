import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";

const shopUrls = [
  "/",
  "/s/aiboux/",
  "/s/aiboux/admin",
  "/s/aiboux/admin/products",
  "/s/aiboux/admin/orders",
  "/s/aiboux/admin/inventory",
  "/s/aiboux/admin/categories",
  "/s/aiboux/admin/customers",
  "/s/aiboux/admin/content",
  "/s/aiboux/admin/analytics",
  "/s/aiboux/admin/apps",
  "/s/aiboux/admin/design",
  "/s/aiboux/admin/settings",
  "/s/aiboux/products",
  "/s/aiboux/categories",
  "/s/aiboux/cart",
  "/s/aiboux/checkout",
  "/s/aiboux/contact",
  "/s/aiboux/legal",
  "/s/aiboux/privacy",
  "/s/aiboux/shipping",
  "/s/aiboux/returns",
];

const forbiddenDemoTexts = [
  "2024/05",
  "山田 太郎",
  "¥2,340,000",
  "245件",
  "2.35%",
  "¥9,551",
  "28.7%",
  "TSH-001",
  "BAG-001",
  "BTL-500",
  "#10085",
  "#10084",
  "#10083",
  "shop.aboux.com",
];

test.describe("AIBOUX Shop public functional hardening", () => {
  test.beforeAll(() => {
    mkdirSync("output/playwright/shop-functional", { recursive: true });
  });

  test("all target public URLs return usable HTML", async ({ page, request }) => {
    for (const url of shopUrls) {
      const response = await request.get(url);
      expect(response.status(), url).toBe(200);
      const contentType = response.headers()["content-type"] ?? "";
      expect(contentType, url).toContain("text/html");
    }

    await page.goto("/s/aiboux/admin");
    const bodyText = await page.locator("body").innerText();
    for (const text of forbiddenDemoTexts) {
      expect(bodyText, `demo text should be absent: ${text}`).not.toContain(text);
    }
    await page.screenshot({ path: "output/playwright/shop-functional/admin-demo-free-1980.png", fullPage: true });
  });

  test("storefront cart, checkout, and contact behave honestly", async ({ page }) => {
    await page.goto("/s/aiboux/cart");
    await page.evaluate(() => {
      localStorage.setItem(
        "aiboux:shop:aiboux:cart",
        JSON.stringify([{ id: "playwright-product", name: "Playwright検証商品", price: 1200, image: "", quantity: 1 }]),
      );
      window.location.reload();
    });
    await expect(page.getByText("Playwright検証商品")).toBeVisible();
    const quantity = page.locator("[data-cart-qty]").first();
    await quantity.fill("3");
    await expect(page.getByText("¥3,600")).toBeVisible();
    await page.locator("[data-cart-remove]").first().click();
    await expect(page.getByText("カートは空です。商品を追加するとここに表示されます。")).toBeVisible();

    await page.goto("/s/aiboux/checkout");
    await expect(page.getByText("決済設定が必要です")).toBeVisible();
    await expect(page.getByText("注文が確定しました")).toHaveCount(0);
    await expect(page.getByText("支払いが完了しました")).toHaveCount(0);

    await page.goto("/s/aiboux/contact");
    await page.getByRole("button", { name: "入力内容を確認" }).click();
    await expect(page.getByText("お名前を入力してください。")).toBeVisible();
    await page.locator("input[name='name']").fill("検証 太郎");
    await page.locator("input[name='email']").fill("invalid-email");
    await page.locator("textarea[name='message']").fill("問い合わせ検証です。");
    await page.getByRole("button", { name: "入力内容を確認" }).click();
    await expect(page.getByText("正しいメールアドレスを入力してください。")).toBeVisible();
    await page.locator("input[name='email']").fill("tester@example.com");
    await page.getByRole("button", { name: "入力内容を確認" }).click();
    await expect(page.getByText("送信完了扱いにはしません。")).toBeVisible();
  });

  test("legal pages render configured or generated policy text", async ({ page }) => {
    await page.goto("/s/aiboux/legal");
    await expect(page.getByText("販売業者:")).toBeVisible();
    await page.goto("/s/aiboux/privacy");
    await expect(page.locator("pre").getByText("個人情報")).toBeVisible();
    await page.goto("/s/aiboux/shipping");
    await expect(page.locator("pre").getByText("配送方法と送料")).toBeVisible();
    await page.goto("/s/aiboux/returns");
    await expect(page.locator("pre").getByText("返品・交換")).toBeVisible();
  });

  test("published product add-to-cart works when published products exist", async ({ page }) => {
    await page.goto("/s/aiboux/products");
    const addButtons = page.locator("[data-cart-add]");
    const count = await addButtons.count();
    if (count === 0) {
      await expect(page.getByText("公開商品はまだありません。")).toBeVisible();
      return;
    }

    await addButtons.first().click();
    await expect(page).toHaveURL(/\/s\/aiboux\/cart$/);
    await expect(page.locator("[data-cart-list]")).toBeVisible();
  });
});
