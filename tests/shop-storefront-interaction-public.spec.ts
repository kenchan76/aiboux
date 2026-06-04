import { expect, test, type Page } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const outputDir = "output/playwright/shop-storefront-interaction";
const publicDir = "public/g/screens";

async function saveScreenshot(page: Page, filename: string) {
  const outputPath = path.join(outputDir, filename);
  const publicPath = path.join(publicDir, filename);
  await page.screenshot({ path: outputPath, fullPage: true });
  copyFileSync(outputPath, publicPath);
}

test.describe("AIBOUX Shop public storefront interactions", () => {
  test.beforeAll(() => {
    mkdirSync(outputDir, { recursive: true });
    mkdirSync(publicDir, { recursive: true });
  });

  test("public hero carousel changes slides by next, prev, dots, and autoplay", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 1200 });
    await page.goto("/s/aiboux/", { waitUntil: "networkidle" });

    const carousel = page.getByTestId("hero-carousel");
    const main = page.getByTestId("hero-slide-main");
    const prev = page.getByTestId("hero-slide-prev");
    const next = page.getByTestId("hero-slide-next");

    await expect(carousel).toBeVisible();
    await expect(main.locator("img")).toBeVisible();
    await expect(prev.locator("img")).toBeVisible();
    await expect(next.locator("img")).toBeVisible();
    await expect(page.getByTestId("hero-dot-0")).toHaveAttribute("aria-current", "true");
    await saveScreenshot(page, "shop-hero-initial-1365.png");

    const initialMainId = await main.getAttribute("data-slide-id");
    const initialPrevId = await prev.getAttribute("data-slide-id");
    const initialNextId = await next.getAttribute("data-slide-id");
    const initialTitle = await main.locator("[data-hero-title]").innerText();
    const initialSrc = await main.locator("[data-hero-main-img]").getAttribute("src");

    await page.getByTestId("hero-next-button").click();
    await expect(main).not.toHaveAttribute("data-slide-id", initialMainId ?? "");
    await expect(page.getByTestId("hero-dot-1")).toHaveAttribute("aria-current", "true");
    expect(await main.locator("[data-hero-title]").innerText()).not.toBe(initialTitle);
    expect(await main.locator("[data-hero-main-img]").getAttribute("src")).not.toBe(initialSrc);
    expect(await prev.getAttribute("data-slide-id")).not.toBe(initialPrevId);
    expect(await next.getAttribute("data-slide-id")).not.toBe(initialNextId);
    await saveScreenshot(page, "shop-hero-after-next-1365.png");

    await page.getByTestId("hero-prev-button").click();
    await expect(main).toHaveAttribute("data-slide-id", initialMainId ?? "");
    await expect(page.getByTestId("hero-dot-0")).toHaveAttribute("aria-current", "true");

    await page.getByTestId("hero-dot-2").click();
    await expect(page.getByTestId("hero-dot-2")).toHaveAttribute("aria-current", "true");
    const dotMainId = await main.getAttribute("data-slide-id");
    await saveScreenshot(page, "shop-hero-after-dot-1365.png");

    await page.getByTestId("hero-next-button").click();
    await expect(main).not.toHaveAttribute("data-slide-id", dotMainId ?? "");

    const beforeAutoplay = await main.getAttribute("data-slide-id");
    await page.waitForTimeout(6200);
    await expect(main).not.toHaveAttribute("data-slide-id", beforeAutoplay ?? "");
    await saveScreenshot(page, "shop-hero-after-autoplay-1365.png");
  });

  test("public product card, add-to-cart, and more links work", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 1200 });
    await page.goto("/s/aiboux/", { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.removeItem("aiboux:shop:aiboux:cart"));
    await page.reload({ waitUntil: "networkidle" });

    const detailLink = page.locator('[data-testid="recommended-products"] [data-testid="product-card"] a[href*="/s/aiboux/product/"]').first();
    await expect(detailLink, "at least one public TOP product card should link to product detail").toBeVisible();
    await detailLink.click();
    await expect(page).toHaveURL(/\/s\/aiboux\/product\//);
    await expect(page.locator("body")).toContainText(/カートに|商品|購入/);
    await saveScreenshot(page, "shop-product-card-click-result.png");

    await page.goto("/s/aiboux/", { waitUntil: "networkidle" });
    const cartCount = page.getByTestId("storefront-cart-count").first();
    await expect(cartCount).toHaveText("0");
    await page.getByTestId("storefront-product-add-to-cart").first().click();
    await expect(cartCount).toHaveText("1");
    await expect(page.getByTestId("storefront-product-add-to-cart").first()).toHaveAttribute("data-cart-added", "true");
    await saveScreenshot(page, "shop-cart-add-result.png");

    await page.getByTestId("recommended-products").getByRole("link", { name: "もっと見る" }).click();
    await expect(page).toHaveURL(/\/s\/aiboux\/products$/);

    await page.goto("/s/aiboux/", { waitUntil: "networkidle" });
    await page.getByTestId("category-showcase").getByRole("link", { name: "もっと見る" }).click();
    await expect(page).toHaveURL(/\/s\/aiboux\/categories$/);

    await page.goto("/s/aiboux/", { waitUntil: "networkidle" });
    await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  });
});
