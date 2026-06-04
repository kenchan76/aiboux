import { expect, test, type Page } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const outputDir = "output/playwright/shop-storefront-carousel";
const publicDir = "public/g/screens";

async function saveScreenshot(page: Page, filename: string) {
  const outputPath = path.join(outputDir, filename);
  const publicPath = path.join(publicDir, filename);
  await page.screenshot({ path: outputPath, fullPage: true });
  copyFileSync(outputPath, publicPath);
}

async function ids(page: Page) {
  return {
    current: await page.getByTestId("hero-carousel").getAttribute("data-current-slide-id"),
    prev: await page.getByTestId("hero-slide-prev").getAttribute("data-slide-id"),
    main: await page.getByTestId("hero-slide-main").getAttribute("data-slide-id"),
    next: await page.getByTestId("hero-slide-next").getAttribute("data-slide-id"),
  };
}

test.describe("AIBOUX Shop public storefront smooth carousel", () => {
  test.beforeAll(() => {
    mkdirSync(outputDir, { recursive: true });
    mkdirSync(publicDir, { recursive: true });
  });

  test("hero carousel animates with transform transition on next click", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 1200 });
    await page.goto("/s/aiboux/", { waitUntil: "networkidle" });

    const carousel = page.getByTestId("hero-carousel");
    const track = page.getByTestId("hero-carousel-track");
    const main = page.getByTestId("hero-slide-main");

    await expect(carousel).toBeVisible();
    await saveScreenshot(page, "shop-hero-before-click-1365.png");

    const beforeId = await main.getAttribute("data-slide-id");
    const transition = await track.evaluate((el) => getComputedStyle(el).transition);
    const duration = await track.evaluate((el) => getComputedStyle(el).transitionDuration);
    const timing = await track.evaluate((el) => getComputedStyle(el).transitionTimingFunction);

    expect(transition).toMatch(/transform/);
    expect(duration).toMatch(/0\.56s|560ms/);
    expect(timing).toContain("cubic-bezier");

    await page.getByTestId("hero-next-button").click();
    await page.waitForTimeout(120);
    const duringTransform = await track.evaluate((el) => getComputedStyle(el).transform);
    expect(duringTransform).not.toBe("none");
    await saveScreenshot(page, "shop-hero-during-animation-1365.png");

    await page.waitForTimeout(700);
    const afterId = await main.getAttribute("data-slide-id");
    expect(afterId).not.toBe(beforeId);
    await saveScreenshot(page, "shop-hero-after-next-smooth-1365.png");
  });

  test("hero carousel updates side previews, dots, keyboard, swipe, and autoplay", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 1200 });
    await page.goto("/s/aiboux/", { waitUntil: "networkidle" });

    const before = await ids(page);

    await page.getByTestId("hero-next-button").click();
    await page.waitForTimeout(700);
    const afterNext = await ids(page);
    expect(afterNext.prev).not.toBe(before.prev);
    expect(afterNext.main).not.toBe(before.main);
    expect(afterNext.next).not.toBe(before.next);
    await expect(page.getByTestId("hero-dot-1")).toHaveAttribute("aria-current", "true");

    await page.getByTestId("hero-dot-2").click();
    await page.waitForTimeout(700);
    await expect(page.getByTestId("hero-dot-2")).toHaveAttribute("aria-current", "true");
    await saveScreenshot(page, "shop-hero-after-dot-smooth-1365.png");

    const afterDot = await ids(page);
    await page.getByTestId("hero-carousel").focus();
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(700);
    const afterKeyboard = await ids(page);
    expect(afterKeyboard.main).not.toBe(afterDot.main);

    const box = await page.getByTestId("hero-carousel").boundingBox();
    if (!box) throw new Error("hero carousel bounding box missing");
    await page.mouse.move(box.x + box.width * 0.72, box.y + box.height * 0.35);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.28, box.y + box.height * 0.35);
    await page.mouse.up();
    await page.waitForTimeout(700);
    const afterSwipe = await ids(page);
    expect(afterSwipe.main).not.toBe(afterKeyboard.main);

    await page.locator("body").click({ position: { x: 12, y: 12 } });
    const beforeAutoplay = await ids(page);
    await page.waitForTimeout(6200);
    const afterAutoplay = await ids(page);
    expect(afterAutoplay.main).not.toBe(beforeAutoplay.main);
    await saveScreenshot(page, "shop-hero-after-autoplay-smooth-1365.png");
  });
});
