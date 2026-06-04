import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const outputDir = "output/playwright/shop-design-editor";
const publicDir = "public/g/screens";
const productFallback = "/s/aiboux/product/shopprod_tenant_001_4580000232621";

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
  expect(href, "at least one public product detail URL should exist for product-detail visual evidence").toBeTruthy();
  return href!;
}

test.describe("AIBOUX Shop design editor public visual gate", () => {
  test.beforeAll(() => {
    mkdirSync(outputDir, { recursive: true });
    mkdirSync(publicDir, { recursive: true });
  });

  test("editor top layout is dedicated fullscreen and visually usable", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/s/aiboux/admin/design", { waitUntil: "networkidle" });

    await expect(page.getByText("AIBOUX SHOP ストアデザインエディタ")).toBeVisible();
    await expect(page.getByText("TOPページ").first()).toBeVisible();
    await expect(page.getByText("商品詳細ページ").first()).toBeVisible();
    await expect(page.getByText("編集できるのは「TOPページ」と「商品詳細ページ」のみです。")).toBeVisible();
    await expect(page.getByText("ヒーロースライダー").first()).toBeVisible();

    await expect(page.getByText("注文管理", { exact: true })).toHaveCount(0);
    await expect(page.getByText("商品管理", { exact: true })).toHaveCount(0);
    await expect(page.getByText("在庫", { exact: true })).toHaveCount(0);
    await expect(page.getByText("商品一覧ページ", { exact: true })).toHaveCount(0);
    await expect(page.getByText("カートページ", { exact: true })).toHaveCount(0);
    await expect(page.getByText("チェックアウトページ", { exact: true })).toHaveCount(0);

    const leftPane = page.getByTestId("shop-design-left-pane");
    const preview = page.getByTestId("shop-design-editor-preview");
    const frame = page.getByTestId("store-preview-frame");
    const rightPane = page.getByTestId("shop-design-right-pane");
    await expect(leftPane).toBeVisible();
    await expect(preview).toBeVisible();
    await expect(frame).toBeVisible();
    await expect(rightPane).toBeVisible();

    const leftBox = await leftPane.boundingBox();
    const previewBox = await preview.boundingBox();
    const frameBox = await frame.boundingBox();
    const rightBox = await rightPane.boundingBox();
    expect(leftBox?.width ?? 0, "left pane width").toBeGreaterThanOrEqual(300);
    expect(leftBox?.width ?? 0, "left pane width").toBeLessThanOrEqual(340);
    expect(previewBox?.width ?? 0, "center preview column width").toBeGreaterThanOrEqual(1100);
    expect(frameBox?.width ?? 0, "store preview frame width").toBeGreaterThanOrEqual(1100);
    expect(rightBox?.width ?? 0, "right pane width").toBeGreaterThanOrEqual(340);
    expect(rightBox?.width ?? 0, "right pane width").toBeLessThanOrEqual(380);

    const navItems = page.locator("[data-shop-nav-item]");
    const navCount = await navItems.count();
    expect(navCount, "category nav items").toBeGreaterThanOrEqual(8);
    for (let index = 0; index < Math.min(navCount, 8); index += 1) {
      const box = await navItems.nth(index).boundingBox();
      expect(box?.height ?? 999, `category nav item ${index} should not wrap vertically`).toBeLessThanOrEqual(24);
    }

    const sideImages = page.locator("[data-hero-side-image]");
    await expect(sideImages).toHaveCount(2);
    for (let index = 0; index < 2; index += 1) {
      const src = await sideImages.nth(index).getAttribute("src");
      expect(src ?? "", `side hero ${index} should use a real sales image`).toMatch(/^https:\/\/images\.unsplash\.com\//);
      expect(src ?? "", `side hero ${index} should not use weak placeholder imagery`).not.toMatch(/placeholder|skeleton|gray|grey|\/shop\/design\/hero-/i);
    }

    await saveScreenshot(page, "shop-design-editor-top-1980.png");
  });

  test("editor product detail page is available without exposing other editable pages", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/s/aiboux/admin/design?page=productDetail", { waitUntil: "networkidle" });

    await expect(page.getByText("AIBOUX SHOP ストアデザインエディタ")).toBeVisible();
    await expect(page.getByText("商品詳細ページ").first()).toBeVisible();
    await expect(page.getByTestId("product-detail-editor-preview")).toBeVisible();
    await expect(page.getByTestId("product-detail-gallery")).toBeVisible();
    await expect(page.getByTestId("product-detail-purchase-box")).toBeVisible();
    await expect(page.getByText("商品一覧ページ", { exact: true })).toHaveCount(0);
    await expect(page.getByText("カートページ", { exact: true })).toHaveCount(0);
    await expect(page.getByText("チェックアウトページ", { exact: true })).toHaveCount(0);

    await saveScreenshot(page, "shop-design-editor-product-1980.png");
  });

  test("public storefront top reflects design with hero and recommended products", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/s/aiboux/", { waitUntil: "networkidle" });

    await expect(page.getByTestId("storefront-hero-slider")).toBeVisible();
    await expect(page.getByTestId("hero-slide-main")).toBeVisible();
    await expect(page.getByTestId("recommended-products")).toBeVisible();

    const sideImages = page.locator("[data-hero-side-image]");
    await expect(sideImages).toHaveCount(2);
    for (let index = 0; index < 2; index += 1) {
      const src = await sideImages.nth(index).getAttribute("src");
      expect(src ?? "", `public side hero ${index} should use a real sales image`).toMatch(/^https:\/\/images\.unsplash\.com\//);
      expect(src ?? "", `public side hero ${index} should not use weak placeholder imagery`).not.toMatch(/placeholder|skeleton|gray|grey|\/shop\/design\/hero-/i);
    }

    const productImages = page.getByTestId("recommended-products").locator("img");
    await expect.poll(async () => productImages.count(), { message: "recommended products should show at least five images" }).toBeGreaterThanOrEqual(5);

    const weakImages = await page.locator("img").evaluateAll((images) => images.filter((image) => /placeholder|skeleton|gray|grey|no-image|画像なし|\/shop\/design\/hero-/i.test(image.getAttribute("src") || "")).length);
    expect(weakImages, "public storefront should not use gray/placeholder images").toBe(0);

    await saveScreenshot(page, "shop-storefront-top-1980.png");
  });

  test("public storefront top is dense at 1365px without placeholder images", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 1200 });
    await page.goto("/s/aiboux/", { waitUntil: "networkidle" });

    await expect(page.getByTestId("storefront-hero-slider")).toBeVisible();
    await expect(page.getByTestId("hero-slide-main").locator("img")).toBeVisible();
    await expect(page.locator("[data-hero-side-image]")).toHaveCount(2);
    await expect(page.getByTestId("recommended-products")).toBeVisible();
    await expect.poll(async () => page.getByTestId("recommended-products").locator("img").count()).toBeGreaterThanOrEqual(5);
    await expect(page.getByText("タイムセール").first()).toBeVisible();
    await expect(page.getByText("人気ブランド").first()).toBeVisible();

    const weakImages = await page.locator("img").evaluateAll((images) => images.filter((image) => /placeholder|skeleton|gray|grey|no-image|画像なし|\/shop\/design\/hero-/i.test(image.getAttribute("src") || "")).length);
    expect(weakImages, "1365px public storefront should not use placeholder images").toBe(0);

    await saveScreenshot(page, "shop-storefront-top-1365.png");
  });

  test("public product detail uses gallery information and purchase-box columns", async ({ page, request }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    const productPath = await findProductPath(page, request);
    await page.goto(productPath, { waitUntil: "networkidle" });

    await expect(page.getByTestId("public-product-detail")).toBeVisible();
    await expect(page.getByTestId("public-product-gallery")).toBeVisible();
    await expect(page.getByTestId("public-product-info")).toBeVisible();
    await expect(page.getByTestId("public-product-purchase-box")).toBeVisible();

    const galleryBox = await page.getByTestId("public-product-gallery").boundingBox();
    const infoBox = await page.getByTestId("public-product-info").boundingBox();
    const purchaseBox = await page.getByTestId("public-product-purchase-box").boundingBox();
    expect(galleryBox?.width ?? 0, "public product gallery column").toBeGreaterThanOrEqual(300);
    expect(infoBox?.width ?? 0, "public product info column").toBeGreaterThanOrEqual(500);
    expect(purchaseBox?.width ?? 0, "public product purchase column").toBeGreaterThanOrEqual(260);

    await saveScreenshot(page, "shop-product-detail-1980.png");
  });
});
