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
      await expect(page.locator("body")).not.toContainText("SEO / UI checklist");
      await expect(page.locator("body")).not.toContainText("SEO site map");
      await expect(page.locator("body")).not.toContainText("Crawl map");
      await expect(page.locator("body")).not.toContainText("SEO構造");
      await expect(page.locator("body")).not.toContainText("canonical");
      await expect(page.locator("body")).not.toContainText("robots");
      await expect(page.locator("body")).not.toContainText("sitemap");
      await expect(page.locator("body")).not.toContainText("Product/Offer");
      await expect(page.locator("body")).not.toContainText("可視H1");
      await expect(page.locator("body")).not.toContainText("SEO内部リンク");
      await expect(page.locator("body")).not.toContainText("クロール可能");
      await expect(page.locator("body")).not.toContainText("内部リンク");
      await expect(page.locator("body")).not.toContainText("Page guide");
      await expect(page.locator("body")).not.toContainText("Trust / proof matrix");
      const html = await page.content();
      expect(html).not.toContain("クロール可能");
      expect(html).not.toContain("内部リンク");
      expect(html).not.toContain("Page guide");
      expect(html).not.toContain("Trust / proof matrix");
      await expect(page.getByTestId("public-product-gallery")).toBeVisible();
      await expect(page.getByTestId("public-product-info")).toBeVisible();
      await expect(page.getByTestId("public-product-purchase-box")).toBeVisible();
      await expect(page.locator("[data-cart-add]").first()).toBeVisible();
      await expect(page.getByTestId("public-product-purchase-box").getByText(/在庫あり|在庫確認/)).toBeVisible();
      await expect(page.getByText("商品説明")).toBeVisible();
      await expect(page.getByTestId("public-product-reviews"), "product detail should expose an actual review section for the review anchor").toBeVisible();
      await expect(page.getByTestId("public-product-reviews"), "review section should contain purchase-decision content").toContainText(/平均評価|配送|ギフト|問い合わせ/);
      await expect(page.locator('a[href="#reviews"]'), "review link should point to the real review section").toHaveCount(1);
      await expect(page.getByText(/AIBOUX公開検証商品|公開検証商品|検証商品/)).toHaveCount(0);
      await expect(page.getByTestId("product-main-image")).toBeVisible();
      expect(await page.getByTestId("product-thumbnail").count(), "thumbnail gallery should use real image thumbnails").toBeGreaterThanOrEqual(5);
      const thumbnailImages = page.locator("[data-testid='product-thumbnail'] img");
      expect(await thumbnailImages.count(), "thumbnail images should be visible instead of numbered boxes").toBeGreaterThanOrEqual(5);
      const mainImageBefore = await page.getByTestId("product-main-image").getAttribute("src");
      await page.getByTestId("product-thumbnail").nth(1).click();
      await expect(page.getByTestId("product-thumbnail").nth(1)).toHaveAttribute("data-active", "true");
      const mainImageAfter = await page.getByTestId("product-main-image").getAttribute("src");
      expect(mainImageAfter, "thumbnail click should update the main product image").not.toBe(mainImageBefore);
      await expect(
        page.getByTestId("public-product-info").locator("dt", { hasText: /^返品条件$/ }),
      ).toBeVisible();
      await expect(page.getByTestId("storefront-commerce-facts"), "product detail should not show purchase fact explanation panels above the product body").toHaveCount(0);
      await expect(page.getByTestId("storefront-trust-matrix"), "product detail should not show trust/proof explanation panels around the buy box").toHaveCount(0);
      await expect(page.getByTestId("storefront-page-quality-summary"), "product detail should not show page quality explanation panels to shoppers").toHaveCount(0);
      await expect(page.getByTestId("storefront-page-action-map"), "product detail should not show next-action explanation panels to shoppers").toHaveCount(0);
      await expect(page.locator("body"), "product detail should not expose internal page-guide copy").not.toContainText("商品詳細で確認できること");
      await expect(page.locator("body"), "product detail should not expose internal next-action copy").not.toContainText("次にできること");
      await expect(page.getByTestId("storefront-seo-checklist"), "product detail should not show SEO checklist to shoppers").toHaveCount(0);
      await expect(page.getByTestId("storefront-seo-sitemap-panel"), "product detail should not show technical SEO sitemap panel to shoppers").toHaveCount(0);
      await expect(page.getByTestId("storefront-buying-guide"), "product detail should not show separate buying-guide explanation panels").toHaveCount(0);
      const footer = page.getByTestId("storefront-footer");
      await expect(footer, "product detail should include shared storefront footer").toBeVisible();
      const footerLinkDirectory = page.getByTestId("storefront-footer-link-directory");
      await expect(footerLinkDirectory, "product detail should include footer link directory").toBeVisible();
      await expect(footerLinkDirectory, "product detail footer link directory should expose ItemList microdata").toHaveAttribute(
        "itemtype",
        "https://schema.org/ItemList",
      );
      await expect(footerLinkDirectory, "product detail footer link directory should use customer-facing copy").toContainText("ストア主要リンク");
      expect(await footerLinkDirectory.locator('[itemtype="https://schema.org/ListItem"]').count(), "product detail footer link directory should expose ListItem microdata").toBeGreaterThanOrEqual(20);
      expect(await footerLinkDirectory.locator("a").count(), "product detail footer link directory should expose dense internal links").toBeGreaterThanOrEqual(20);
      expect(await footerLinkDirectory.locator("a").first().getAttribute("class"), "product detail footer link directory links should be visibly sky colored").toContain("text-sky-200");
      const relatedCards = page.getByTestId("storefront-product-card");
      expect(await relatedCards.count(), "product detail related products should use the shared storefront product card").toBeGreaterThanOrEqual(4);
      await expect(relatedCards.first(), "related product card should expose Product microdata").toHaveAttribute(
        "itemtype",
        "https://schema.org/Product",
      );
      await expect(
        relatedCards.first().locator('[itemtype="https://schema.org/Offer"]'),
        "related product card should expose Offer microdata",
      ).toHaveCount(1);
      await expect(
        relatedCards.first().getByTestId("storefront-product-card-link"),
        "related product card should link to product detail",
      ).toHaveAttribute("href", /\/s\/aiboux\/product\//);
      await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
      const breadcrumb = page.getByTestId("storefront-breadcrumb");
      await expect(breadcrumb).toBeVisible();
      await expect(breadcrumb).toHaveAttribute("itemtype", "https://schema.org/BreadcrumbList");
      expect(await breadcrumb.locator('[itemtype="https://schema.org/ListItem"]').count(), "product breadcrumb should expose visible ListItem microdata").toBeGreaterThanOrEqual(3);
      expect(await breadcrumb.locator("a").first().getAttribute("class"), "product breadcrumb links should be visibly link-colored").toContain("text-blue-700");
      await expect(page.getByTestId("storefront-breadcrumb-shell"), "product detail should use the shared breadcrumb shell").toContainText("現在地");
      const breadcrumbSupport = page.getByTestId("storefront-breadcrumb-support-links");
      await expect(breadcrumbSupport, "product detail should expose breadcrumb support links").toBeVisible();
      await expect(breadcrumbSupport, "product detail breadcrumb support should use SiteNavigationElement microdata").toHaveAttribute(
        "itemtype",
        "https://schema.org/SiteNavigationElement",
      );
      expect(await breadcrumbSupport.locator("a").count(), "product detail should expose multiple breadcrumb support links").toBeGreaterThanOrEqual(4);
      expect(await breadcrumbSupport.locator("a").first().getAttribute("class"), "product detail breadcrumb support links should be visibly blue").toContain("text-blue-700");
      await expect(breadcrumbSupport, "product detail breadcrumb support should link back to cart or product comparison").toContainText(/カート|商品一覧/);
      await expect(page.locator("h1")).toHaveCount(1);
      const productTitle = (await page.locator("h1").innerText()).trim();
      await expect(page.getByTestId("storefront-breadcrumb-current"), "product breadcrumb current label should not duplicate the full product title above the gallery").toHaveText("商品詳細");
      expect(await page.getByText(productTitle, { exact: true }).count(), "product title should be visible only as the primary product h1").toBe(1);

      const jsonLdText = await page.locator('script[type="application/ld+json"]').first().textContent();
      const jsonLd = JSON.parse(jsonLdText || "{}");
      expect(jsonLd["@context"], "product detail structured data should use a single top-level schema.org context").toBe("https://schema.org");
      expect(Array.isArray(jsonLd["@graph"]), "product detail structured data should be emitted as @graph").toBe(true);
      expect(jsonLd["@graph"].length, "product detail @graph should contain connected storefront and product entities").toBeGreaterThanOrEqual(6);
      expect((jsonLdText?.match(/"@context"/g) ?? []).length, "product detail should not repeat @context inside graph nodes").toBe(1);
      expect(jsonLdText ?? "", "product detail should include BreadcrumbList JSON-LD").toContain("BreadcrumbList");
      expect(jsonLdText ?? "", "product breadcrumb JSON-LD should preserve the full product title").toContain(productTitle);
      expect(jsonLdText ?? "", "product detail should include Product JSON-LD").toContain("Product");
      expect(jsonLdText ?? "", "product detail should include Offer JSON-LD").toContain("Offer");
      expect(jsonLdText ?? "", "product detail should identify the storefront as OnlineStore JSON-LD").toContain("OnlineStore");
      expect(jsonLdText ?? "", "product detail should link Product to its canonical WebPage").toContain("mainEntityOfPage");
      expect(jsonLdText ?? "", "product detail should link offer seller to the shared store entity").toContain("seller");
      expect(jsonLdText ?? "", "product detail should expose stable store and website entity ids").toContain("#store");
      expect(jsonLdText ?? "", "product detail should expose stable website entity id").toContain("#website");
      expect(jsonLdText ?? "", "product detail WebPage should be linked to the WebSite entity").toContain("isPartOf");
      expect(jsonLdText ?? "", "product detail should include Organization return policy JSON-LD").toContain("MerchantReturnPolicy");
      expect(jsonLdText ?? "", "product detail should include shipping details for merchant listing").toContain("OfferShippingDetails");

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical ?? "", "product detail canonical should point at the product URL").toContain("https://shop.aiboux.com/s/aiboux/product/");
      const titleText = await page.title();
      expect(titleText, "product detail title should include the product name").toContain(productTitle);
      expect(titleText.length, "product detail title should remain snippet-safe").toBeLessThanOrEqual(78);
      const metaDescription = await page.locator('meta[name="description"]').getAttribute("content");
      expect(metaDescription ?? "", "product detail description should mention purchase decision information").toMatch(/価格|税込|レビュー|在庫|配送|返品|定期購入/);
      expect(metaDescription?.length ?? 0, "product detail description should be useful").toBeGreaterThanOrEqual(45);
      expect(metaDescription?.length ?? 0, "product detail description should remain snippet-safe").toBeLessThanOrEqual(155);
      expect(await page.locator('meta[name="robots"]').getAttribute("content"), "product detail should be indexable").toContain("index");
      expect(await page.locator('meta[property="og:type"]').getAttribute("content"), "product detail should use product Open Graph type").toBe("product");
      await expect(page.locator('meta[property="og:title"]'), "product detail should include Open Graph title").toHaveCount(1);
      await expect(page.locator('meta[property="og:image"]'), "product detail should include Open Graph product image").toHaveCount(1);
      await expect(page.locator('meta[property="og:url"]'), "product detail Open Graph URL should match canonical").toHaveAttribute("content", canonical ?? "");
      await expect(page.locator('meta[name="twitter:description"]'), "product detail Twitter description should match meta description").toHaveAttribute("content", metaDescription ?? "");
      await expect(page.locator('meta[property="product:price:amount"]'), "product detail should include product price Open Graph metadata").toHaveCount(1);
      await expect(page.locator('meta[property="product:price:currency"]'), "product detail should include product currency Open Graph metadata").toHaveCount(1);
      await expect(page.locator('meta[name="twitter:card"]'), "product detail should include Twitter Card metadata").toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][hreflang="ja-JP"]'), "product detail should include ja-JP alternate link").toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'), "product detail should include x-default alternate link").toHaveCount(1);

      const purchaseBox = await page.getByTestId("public-product-purchase-box").boundingBox();
      expect(purchaseBox?.height ?? 0, "purchase box should not be collapsed").toBeGreaterThan(260);
      await saveScreenshot(page, viewport.file);
    });
  }
});
