import { expect, test } from "@playwright/test";

const viewports = [
  { width: 1980, height: 1080, name: "1980" },
  { width: 1650, height: 900, name: "1650" },
  { width: 1440, height: 900, name: "1440" },
  { width: 1366, height: 768, name: "1366" },
];

const routes = [
  {
    name: "mail-service",
    url: "https://mail.aiboux.com/",
    title: /AIBOUX Mail \| サービスサイト/,
    requiredText: ["AIBOUX Mail", "サービス入口", "mail.aiboux.com/s/aiboux/"],
    forbiddenText: ["Internal Error"],
  },
  {
    name: "mail-tenant",
    url: "https://mail.aiboux.com/s/aiboux/",
    title: /AIBOUX Mail - 受信トレイ/,
    requiredText: ["メールボックス", "受信トレイ"],
    forbiddenText: ["Internal Error"],
  },
  {
    name: "shop-service",
    url: "https://shop.aiboux.com/",
    title: /AIBOUX SHOP \| サービスサイト/,
    requiredText: ["AIBOUX SHOP", "shop.aiboux.com/s/aiboux/"],
    forbiddenText: ["Internal Error"],
  },
  {
    name: "shop-storefront",
    url: "https://shop.aiboux.com/s/aiboux/",
    title: /公式ストア \| AIBOUX Storefront/,
    requiredText: ["公式ストア"],
    forbiddenText: ["Internal Error", "注文管理", "商品管理"],
  },
  {
    name: "shop-admin",
    url: "https://shop.aiboux.com/s/aiboux/admin",
    title: /AIBOUX SHOP Dashboard/,
    requiredText: ["注文管理", "商品管理"],
    forbiddenText: ["Internal Error"],
  },
];

for (const viewport of viewports) {
  test.describe(`service tenant public routing ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of routes) {
      test(`${route.name} resolves with styled public UI`, async ({ page }) => {
        const failedAssets: string[] = [];
        const badAssetResponses: string[] = [];

        page.on("requestfailed", (request) => {
          const url = request.url();
          if (url.includes("/_astro/") || url.endsWith(".css") || url.endsWith(".js")) {
            failedAssets.push(url);
          }
        });

        page.on("response", (response) => {
          const url = response.url();
          if ((url.includes("/_astro/") || url.endsWith(".css") || url.endsWith(".js")) && response.status() >= 400) {
            badAssetResponses.push(`${response.status()} ${url}`);
          }
        });

        const response = await page.goto(route.url, { waitUntil: "networkidle" });
        expect(response?.status(), `${route.url} HTTP status`).toBe(200);
        await expect(page).toHaveTitle(route.title);

        for (const text of route.requiredText) {
          await expect(page.getByText(text).first(), `${route.url} should contain ${text}`).toBeVisible();
        }

        for (const text of route.forbiddenText) {
          await expect(page.getByText(text).first(), `${route.url} should not contain ${text}`).toHaveCount(0);
        }

        expect(failedAssets, `failed assets for ${route.url}: ${failedAssets.join("\n")}`).toEqual([]);
        expect(badAssetResponses, `bad asset responses for ${route.url}: ${badAssetResponses.join("\n")}`).toEqual([]);

        const styleState = await page.evaluate(() => {
          const body = getComputedStyle(document.body);
          return {
            fontFamily: body.fontFamily,
            styleSheets: Array.from(document.styleSheets).length,
            backgroundColor: body.backgroundColor,
          };
        });

        expect(styleState.styleSheets, `${route.url} stylesheet count`).toBeGreaterThan(0);
        expect(styleState.fontFamily, `${route.url} font family`).not.toMatch(/Times New Roman/i);

        await page.screenshot({
          path: `output/playwright/service-url-routing/${route.name}-${viewport.name}.png`,
          fullPage: true,
        });
      });
    }
  });
}
