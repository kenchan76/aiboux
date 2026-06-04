import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const outputDir = "output/playwright/shop-product-detail";
const publicDir = "public/g/screens";
const fallbackProduct = "/s/aiboux/product/shopprod_tenant_001_4580000232621";

async function saveScreenshot(page: Page, filename: string) {
  const outputPath = path.join(outputDir, filename);
  const publicPath = path.join(publicDir, filename);
  await page.screenshot({ path: outputPath, fullPage: true });
  copyFileSync(outputPath, publicPath);
}

async function findProductPath(page: Page, request: APIRequestContext) {
  const fallback = await request.get(fallbackProduct);
  if (fallback.status() === 200) return fallbackProduct;

  await page.goto("/s/aiboux/products", { waitUntil: "networkidle" });
  const href = await page.locator("a[href*='/s/aiboux/product/']").first().getAttribute("href");
  expect(href, "product detail URL should be discoverable").toBeTruthy();
  return href!;
}

test.describe("AIBOUX Shop product detail public quality", () => {
  test.beforeAll(() => {
    mkdirSync(outputDir, { recursive: true });
    mkdirSync(publicDir, { recursive: true });
  });

  for (const viewport of [
    { width: 1365, height: 1200, file: "shop-product-detail-1365.png" },
    { width: 1980, height: 1080, file: "shop-product-detail-1980.png" },
    { width: 390, height: 1200, file: "shop-product-detail-mobile.png" },
  ]) {
    test(`product detail renders purchase-ready layout at ${viewport.width}px`, async ({ page, request }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const productPath = await findProductPath(page, request);
      await page.goto(`${productPath}?detailGate=${Date.now()}`, { waitUntil: "networkidle" });

      await expect(page.getByTestId("public-product-detail")).toBeVisible();
      await expect(page.getByTestId("public-product-gallery")).toBeVisible();
      await expect(page.getByTestId("public-product-info")).toBeVisible();
      await expect(page.getByTestId("public-product-purchase-box")).toBeVisible();
      await expect(page.locator("[data-cart-add]").first()).toBeVisible();
      await expect(page.getByText(/在庫あり|在庫確認/)).toBeVisible();
      await expect(page.getByText("商品説明")).toBeVisible();
      await expect(page.getByText(/AIBOUX公開検証商品|公開検証商品|検証商品/)).toHaveCount(0);
      await expect(page.getByTestId("product-main-image")).toBeVisible();
      expect(await page.getByTestId("product-thumbnail").count(), "thumbnail gallery should use real image thumbnails").toBeGreaterThanOrEqual(5);
      const thumbnailImages = page.locator("[data-testid='product-thumbnail'] img");
      expect(await thumbnailImages.count(), "thumbnail images should be visible instead of numbered boxes").toBeGreaterThanOrEqual(5);
      await expect(page.getByTestId("public-product-info").getByText("返品条件")).toBeVisible();
      await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
      await expect(page.getByTestId("storefront-breadcrumb")).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);

      const jsonLdText = await page.locator('script[type="application/ld+json"]').first().textContent();
      expect(jsonLdText ?? "", "product detail should include BreadcrumbList JSON-LD").toContain("BreadcrumbList");
      expect(jsonLdText ?? "", "product detail should include Product JSON-LD").toContain("Product");
      expect(jsonLdText ?? "", "product detail should include Offer JSON-LD").toContain("Offer");
      expect(jsonLdText ?? "", "product detail should include Organization return policy JSON-LD").toContain("MerchantReturnPolicy");
      expect(jsonLdText ?? "", "product detail should include shipping details for merchant listing").toContain("OfferShippingDetails");

      const purchaseBox = await page.getByTestId("public-product-purchase-box").boundingBox();
      expect(purchaseBox?.height ?? 0, "purchase box should not be collapsed").toBeGreaterThan(260);
      await saveScreenshot(page, viewport.file);
    });
  }
});
