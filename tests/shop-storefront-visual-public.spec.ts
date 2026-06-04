import { expect, test, type Locator, type Page } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const outputDir = "output/playwright/shop-storefront-visual";
const publicDir = "public/g/screens";

async function saveScreenshot(page: Page, filename: string) {
  const outputPath = path.join(outputDir, filename);
  const publicPath = path.join(publicDir, filename);
  await page.screenshot({ path: outputPath, fullPage: true });
  copyFileSync(outputPath, publicPath);
}

async function visibleImageSources(locator: Locator) {
  return locator.evaluateAll((images) =>
    images
      .map((image) => image.getAttribute("src") || "")
      .filter(Boolean),
  );
}

test.describe("AIBOUX Shop public storefront visual quality", () => {
  test.beforeAll(() => {
    mkdirSync(outputDir, { recursive: true });
    mkdirSync(publicDir, { recursive: true });
  });

  test("public storefront has sale-ready visual density at 1365px", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 1200 });
    await page.goto("/s/aiboux/", { waitUntil: "networkidle" });

    await expect(page.getByTestId("storefront-hero-slider")).toBeVisible();
    await expect(page.getByTestId("hero-slide-main").locator("img")).toBeVisible();
    await expect(page.getByTestId("hero-slide-prev").locator("img")).toBeVisible();
    await expect(page.getByTestId("hero-slide-next").locator("img")).toBeVisible();
    await expect(page.locator("[data-hero-side-image]")).toHaveCount(2);

    const recommendedCards = page.getByTestId("recommended-products").getByTestId("product-card");
    await expect.poll(async () => recommendedCards.count(), { message: "recommended products should be dense enough" }).toBeGreaterThanOrEqual(10);
    await expect.poll(async () => page.getByTestId("recommended-products").locator("img").count()).toBeGreaterThanOrEqual(10);

    await expect(page.getByText(/AIBOUX公開検証商品|公開検証商品|検証商品/)).toHaveCount(0);
    await expect(page.locator(".placeholder, .skeleton, [data-placeholder='true']")).toHaveCount(0);

    const recommendedSources = await visibleImageSources(page.getByTestId("recommended-products").locator("img"));
    const uniqueSources = new Set(recommendedSources);
    expect(uniqueSources.size, "recommended product images should not be excessively reused").toBeGreaterThanOrEqual(8);

    await expect(page.getByTestId("bestseller-ranking").getByTestId("ranking-card")).toHaveCount(5);
    await expect(page.getByTestId("time-sale-products").getByTestId("time-sale-card")).toHaveCount(5);
    await expect.poll(async () => page.getByTestId("category-showcase").getByTestId("category-card").count()).toBeGreaterThanOrEqual(8);

    const weakImages = await page.locator("img").evaluateAll((images) =>
      images.filter((image) => /placeholder|skeleton|gray|grey|no-image|画像なし|\/shop\/design\/hero-/i.test(image.getAttribute("src") || "")).length,
    );
    expect(weakImages, "public storefront should not use weak image URLs").toBe(0);

    await saveScreenshot(page, "public-storefront-after-quality-fix-1365.png");
  });

  test("public storefront keeps Amazon-like sales sections at 1980px", async ({ page }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    await page.goto("/s/aiboux/", { waitUntil: "networkidle" });

    const heroBox = await page.getByTestId("storefront-hero-slider").boundingBox();
    expect(heroBox?.height ?? 0, "hero should have enough visual weight").toBeGreaterThanOrEqual(300);

    const productCards = page.getByTestId("recommended-products").getByTestId("product-card");
    await expect.poll(async () => productCards.count()).toBeGreaterThanOrEqual(10);

    const productNames = await productCards.locator("h3").allTextContents();
    expect(productNames.join("\n")).not.toMatch(/AIBOUX公開検証商品|公開検証商品|検証商品/);

    const cardBoxes = await productCards.evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().height));
    expect(Math.max(...cardBoxes) - Math.min(...cardBoxes), "product card heights should be aligned").toBeLessThanOrEqual(80);

    await saveScreenshot(page, "public-storefront-after-quality-fix-1980.png");
  });

  test("public storefront mobile remains image-backed and not sparse", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 1200 });
    await page.goto("/s/aiboux/", { waitUntil: "networkidle" });

    await expect(page.getByTestId("storefront-hero-slider")).toBeVisible();
    await expect(page.getByTestId("recommended-products")).toBeVisible();
    await expect.poll(async () => page.getByTestId("recommended-products").locator("img").count()).toBeGreaterThanOrEqual(8);
    await expect(page.getByText(/AIBOUX公開検証商品|公開検証商品|検証商品/)).toHaveCount(0);

    await saveScreenshot(page, "public-storefront-after-quality-fix-mobile.png");
  });
});
