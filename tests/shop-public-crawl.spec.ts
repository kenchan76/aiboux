import { expect, test, type Page } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const outputDir = "output/playwright/shop-5h-sprint";
const publicDir = "public/g/screens";

const publicUrls = [
  { path: "/s/aiboux/", name: "shop-top" },
  { path: "/s/aiboux/products", name: "shop-products-page" },
  { path: "/s/aiboux/categories", name: "shop-categories-page" },
  { path: "/s/aiboux/cart", name: "shop-cart-page" },
  { path: "/s/aiboux/checkout", name: "shop-checkout-page" },
  { path: "/s/aiboux/contact", name: "shop-contact-page" },
  { path: "/s/aiboux/legal", name: "shop-legal-page" },
  { path: "/s/aiboux/privacy", name: "shop-privacy-page" },
  { path: "/s/aiboux/shipping", name: "shop-shipping-page" },
  { path: "/s/aiboux/returns", name: "shop-returns-page" },
  { path: "/s/aiboux/faq", name: "shop-faq-page" },
  { path: "/s/aiboux/mypage", name: "shop-mypage", expectedTestId: "storefront-mypage" },
  { path: "/s/aiboux/account", name: "shop-account", expectedTestId: "storefront-mypage" },
  { path: "/s/aiboux/orders", name: "shop-orders", expectedTestId: "storefront-orders" },
  { path: "/s/aiboux/favorites", name: "shop-favorites", expectedTestId: "storefront-favorites" },
  { path: "/s/aiboux/login", name: "shop-login", expectedTestId: "storefront-auth" },
  { path: "/s/aiboux/register", name: "shop-register", expectedTestId: "storefront-auth" },
  { path: "/s/aiboux/mypage/subscriptions", name: "shop-mypage-subscriptions", expectedTestId: "storefront-mypage-subscriptions" },
];

const adminUrls = [
  { path: "/s/aiboux/admin", name: "shop-admin-dashboard" },
  { path: "/s/aiboux/admin/products", name: "shop-admin-products" },
  { path: "/s/aiboux/admin/orders", name: "shop-admin-orders" },
  { path: "/s/aiboux/admin/inventory", name: "shop-admin-inventory" },
  { path: "/s/aiboux/admin/categories", name: "shop-admin-categories" },
  { path: "/s/aiboux/admin/customers", name: "shop-admin-customers" },
  { path: "/s/aiboux/admin/content", name: "shop-admin-content" },
  { path: "/s/aiboux/admin/analytics", name: "shop-admin-analytics" },
  { path: "/s/aiboux/admin/apps", name: "shop-admin-apps" },
  { path: "/s/aiboux/admin/design", name: "shop-admin-design" },
  { path: "/s/aiboux/admin/settings", name: "shop-admin-settings" },
  { path: "/s/aiboux/admin/subscriptions", name: "shop-admin-subscriptions" },
];

async function saveScreenshot(page: Page, filename: string) {
  const outputPath = path.join(outputDir, filename);
  const publicPath = path.join(publicDir, filename);
  await page.screenshot({ path: outputPath, fullPage: true });
  copyFileSync(outputPath, publicPath);
}

test.describe("AIBOUX Shop 5H sprint public crawl", () => {
  test.beforeAll(() => {
    mkdirSync(outputDir, { recursive: true });
    mkdirSync(publicDir, { recursive: true });
  });

  for (const viewport of [
    { width: 1365, height: 1200, suffix: "1365" },
    { width: 1980, height: 1080, suffix: "1980" },
    { width: 390, height: 1200, suffix: "mobile" },
  ]) {
    test(`public storefront pages render with styled HTML at ${viewport.suffix}`, async ({ page, request }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const target of publicUrls) {
        const response = await request.get(target.path, { headers: { "cache-control": "no-cache" } });
        expect(response.status(), target.path).toBe(200);
        expect(response.headers()["content-type"] ?? "", target.path).toContain("text/html");

        await page.goto(`${target.path}?crawl=${Date.now()}`, { waitUntil: "networkidle" });
        await expect(page.locator("body")).not.toContainText("ページが見つかりません");
        await expect(page.locator("body")).not.toContainText("Not Found");
        await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
        await expect(page.locator("body")).not.toContainText("shop.aboux.com");
        if ("expectedTestId" in target && target.expectedTestId) {
          await expect(page.locator(`[data-testid="${target.expectedTestId}"]`), target.path).toBeVisible();
        }

        const bodyBox = await page.locator("body").boundingBox();
        expect(bodyBox?.width ?? 0, `${target.path} should render a styled page body`).toBeGreaterThan(300);

        if (target.name === "shop-top" || viewport.suffix === "1980") {
          await saveScreenshot(page, `${target.name}-${viewport.suffix}.png`);
        }
      }
    });
  }

  test("admin pages render and keep demo values absent", async ({ page, request }) => {
    await page.setViewportSize({ width: 1980, height: 1080 });
    for (const target of adminUrls) {
      const response = await request.get(target.path, { headers: { "cache-control": "no-cache" } });
      expect(response.status(), target.path).toBe(200);
      expect(response.headers()["content-type"] ?? "", target.path).toContain("text/html");

      await page.goto(`${target.path}?adminCrawl=${Date.now()}`, { waitUntil: "networkidle" });
      await expect(page.locator("body")).not.toContainText("2024/05");
      await expect(page.locator("body")).not.toContainText("山田 太郎");
      await expect(page.locator("body")).not.toContainText("#10085");
      await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);

      if (target.name === "shop-admin-design" || target.name === "shop-admin-subscriptions") {
        await saveScreenshot(page, `${target.name}.png`);
      }
    }
  });

  test("public storefront internal links resolve to implemented tenant pages", async ({ request }) => {
    const discovered = new Set<string>();

    for (const target of publicUrls) {
      const response = await request.get(target.path, { headers: { "cache-control": "no-cache" } });
      expect(response.status(), target.path).toBe(200);
      const html = await response.text();

      for (const match of html.matchAll(/href="([^"]+)"/g)) {
        const href = match[1];
        if (
          !href ||
          href.startsWith("#") ||
          href.startsWith("javascript:") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:")
        ) {
          continue;
        }

        const url = new URL(href, "https://shop.aiboux.com");
        if (url.hostname === "shop.aiboux.com" && url.pathname.startsWith("/s/aiboux")) {
          discovered.add(url.pathname);
        }
      }
    }

    expect(discovered.size, "tenant storefront should expose internal links for account, commerce, and policy pages").toBeGreaterThan(12);

    for (const pathname of [...discovered].sort()) {
      const linked = await request.get(pathname, { headers: { "cache-control": "no-cache" } });
      expect(linked.status(), pathname).toBe(200);
      const body = await linked.text();
      expect(body, pathname).not.toContain("ページが見つかりません");
      expect(body, pathname).not.toContain("Not Found");
    }
  });
});
