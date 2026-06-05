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
    await expect(page.getByText("カートは空です")).toBeVisible();

    await page.goto("/s/aiboux/checkout");
    await expect(page.getByText("支払い方法を確認してください")).toBeVisible();
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
    await expect(page.getByText("入力内容を確認しました。")).toBeVisible();
  });

  test("legal pages render configured or generated policy text", async ({ page }) => {
    await page.goto("/s/aiboux/legal");
    await expect(page.getByText("販売業者:")).toBeVisible();
    await page.goto("/s/aiboux/privacy");
    await expect(page.getByTestId("storefront-policy-page").getByText("個人情報")).toBeVisible();
    await page.goto("/s/aiboux/shipping");
    await expect(page.getByTestId("storefront-policy-page").getByText("配送方法と送料")).toBeVisible();
    await page.goto("/s/aiboux/returns");
    await expect(page.getByTestId("storefront-policy-page").getByText("返品・交換")).toBeVisible();
  });

  test("store design editor exposes only top and product detail page editing", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/s/aiboux/admin/design");
    await expect(page.getByText("AIBOUX SHOP ストアデザインエディタ")).toBeVisible();
    await expect(page.getByText("注文管理")).toHaveCount(0);
    await expect(page.getByText("商品管理")).toHaveCount(0);
    await expect(page.getByText("在庫", { exact: true })).toHaveCount(0);
    await expect(page.getByText("TOPページ").first()).toBeVisible();
    await expect(page.getByText("商品詳細ページ").first()).toBeVisible();
    await expect(page.getByText("編集できるのは「TOPページ」と「商品詳細ページ」のみです。")).toBeVisible();
    await expect(page.getByText("ヒーロースライダー").first()).toBeVisible();
    await expect(page.getByText("ロゴ").first()).toBeVisible();
    await expect(page.getByText("商品一覧ページ")).toHaveCount(0);
    await expect(page.getByText("カートページ")).toHaveCount(0);
    await expect(page.getByText("チェックアウトページ")).toHaveCount(0);
    await expect(page.getByText("404ページ")).toHaveCount(0);

    const shell = page.locator("[data-shop-design-editor-shell]");
    const preview = page.locator("[data-shop-design-preview]");
    const previewFrame = page.locator("[data-store-preview-frame]");
    const leftPane = page.locator("[data-shop-design-left-pane]");
    const rightPane = page.locator("[data-shop-design-right-pane]");
    await expect(shell).toBeVisible();
    await expect(leftPane).toBeVisible();
    await expect(preview).toBeVisible();
    await expect(rightPane).toBeVisible();

    const previewBox = await preview.boundingBox();
    const frameBox = await previewFrame.boundingBox();
    const leftBox = await leftPane.boundingBox();
    const rightBox = await rightPane.boundingBox();
    expect(previewBox?.width ?? 0, "center preview column should be at least 1100px at 1980px viewport").toBeGreaterThanOrEqual(1100);
    expect(frameBox?.width ?? 0, "store preview frame should be at least 1100px at 1980px viewport").toBeGreaterThanOrEqual(1100);
    expect(leftBox?.width ?? 0, "left editor pane width").toBeGreaterThanOrEqual(300);
    expect(leftBox?.width ?? 0, "left editor pane width").toBeLessThanOrEqual(340);
    expect(rightBox?.width ?? 0, "right editor pane width").toBeGreaterThanOrEqual(340);
    expect(rightBox?.width ?? 0, "right editor pane width").toBeLessThanOrEqual(380);

    const navItems = page.locator("[data-shop-nav-item]");
    await expect(navItems.first()).toBeVisible();
    const navCount = await navItems.count();
    expect(navCount, "category nav items should exist").toBeGreaterThanOrEqual(8);
    for (let index = 0; index < Math.min(navCount, 8); index += 1) {
      const box = await navItems.nth(index).boundingBox();
      expect(box?.height ?? 999, `category nav item ${index} should not wrap vertically`).toBeLessThanOrEqual(24);
    }

    const sideImages = page.locator("[data-hero-side-image]");
    await expect(sideImages).toHaveCount(2);
    for (let index = 0; index < 2; index += 1) {
      const src = await sideImages.nth(index).getAttribute("src");
      expect(src ?? "", `side hero ${index} should use a real preview image`).toContain("/shop/design/hero-");
    }

    await page.screenshot({ path: "output/playwright/shop-functional/design-editor-1980.png", fullPage: true });
  });

  test("store design editor saves top hero changes and restores original layout", async ({ page, request }) => {
    const originalResponse = await request.get("/shop/api/storefront/layout", {
      headers: {
        "cache-control": "no-cache",
        pragma: "no-cache",
      },
    });
    expect(originalResponse.ok(), "layout GET before persistence test").toBeTruthy();
    const originalData = await originalResponse.json();
    expect(originalData.success, "layout GET success before persistence test").toBeTruthy();
    const originalLayout = originalData.layout;
    const marker = `Playwright保存検証 ${Date.now()}`;

    try {
      await page.setViewportSize({ width: 1980, height: 1080 });
      await page.goto(`/s/aiboux/admin/design?persistence=${encodeURIComponent(marker)}`);
      await expect(page.getByText("AIBOUX SHOP ストアデザインエディタ")).toBeVisible();
      await expect(page.getByText("読み込み中")).toHaveCount(0);

      const heroTitle = page.getByLabel("タイトル").first();
      await expect(heroTitle).toBeVisible();
      await expect(heroTitle).not.toHaveValue("");
      await heroTitle.fill(marker);
      await expect(heroTitle).toHaveValue(marker);

      const saveResponsePromise = page.waitForResponse((response) =>
        response.url().includes("/shop/api/storefront/layout") && response.request().method() === "POST",
      );
      await page.getByRole("button", { name: "保存", exact: true }).click();
      const saveResponse = await saveResponsePromise;
      expect(saveResponse.ok(), "layout POST from design editor save").toBeTruthy();

      const savedResponse = await request.get("/shop/api/storefront/layout", {
        headers: {
          "cache-control": "no-cache",
          pragma: "no-cache",
        },
      });
      expect(savedResponse.ok(), "layout GET after design editor save").toBeTruthy();
      const savedData = await savedResponse.json();
      expect(savedData.layout?.pages?.top?.heroSlider?.slides?.[0]?.title).toBe(marker);

      await page.goto(`/s/aiboux/?layoutVerify=${encodeURIComponent(marker)}`);
      await expect(page.getByRole("heading", { name: marker })).toBeVisible();
      await page.reload();
      await expect(page.getByRole("heading", { name: marker })).toBeVisible();
    } finally {
      const restoreResponse = await request.post("/shop/api/storefront/layout", {
        data: {
          layout: originalLayout,
          actorId: "playwright-layout-restore",
        },
      });
      expect(restoreResponse.ok(), "layout restore POST after persistence test").toBeTruthy();

      await page.goto(`/s/aiboux/?layoutRestoreVerify=${Date.now()}`);
      await expect(page.getByText(marker)).toHaveCount(0);
    }
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
