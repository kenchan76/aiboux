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

const noIndexPublicPageNames = new Set([
  "shop-cart-page",
  "shop-checkout-page",
  "shop-mypage",
  "shop-account",
  "shop-orders",
  "shop-favorites",
  "shop-login",
  "shop-register",
  "shop-mypage-subscriptions",
]);

const sharedProductCardPageNames = new Set([
  "shop-products-page",
  "shop-cart-page",
  "shop-mypage",
  "shop-account",
  "shop-orders",
  "shop-favorites",
  "shop-login",
  "shop-register",
  "shop-mypage-subscriptions",
]);

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
        const searchForm = page.getByTestId("storefront-search-form").first();
        await expect(searchForm, `${target.path} should expose a crawlable store search form`).toBeVisible();
        await expect(searchForm, `${target.path} search form should submit as GET`).toHaveAttribute("method", /get/i);
        await expect(searchForm, `${target.path} search form should target products discovery page`).toHaveAttribute("action", /\/s\/aiboux\/products$/);
        await expect(searchForm.locator('input[name="q"]'), `${target.path} search input should use q query parameter`).toHaveCount(1);
        const footer = page.getByTestId("storefront-footer");
        await expect(footer, `${target.path} should include Amazon-like storefront footer`).toBeVisible();
        expect(await footer.locator('[itemtype="https://schema.org/SiteNavigationElement"]').count(), `${target.path} footer should expose shared SiteNavigationElement microdata`).toBeGreaterThanOrEqual(4);
        expect(await footer.locator("a").count(), `${target.path} footer should expose dense internal link coverage`).toBeGreaterThanOrEqual(16);
        await expect(footer, `${target.path} footer should include payment/subscription honesty assurance`).toContainText("決済未接続時は注文確定しません");
        const supportRail = page.getByTestId("storefront-support-rail");
        await expect(supportRail, `${target.path} should include shared storefront support rail`).toBeVisible();
        await expect(supportRail, `${target.path} support rail should expose purchase guidance`).toContainText("迷わず買えるための確認導線");
        await expect(supportRail, `${target.path} support rail should expose honest subscription state`).toContainText("定期購入");
        expect(await supportRail.locator("a").count(), `${target.path} support rail should expose crawlable support links`).toBeGreaterThanOrEqual(9);
        expect(await supportRail.locator("a").first().getAttribute("class"), `${target.path} support rail links should have visible link affordance`).toMatch(/text-|bg-amber/);
        const commerceFacts = page.getByTestId("storefront-commerce-facts");
        await expect(commerceFacts, `${target.path} should include shared purchase fact structure`).toBeVisible();
        await expect(commerceFacts, `${target.path} purchase facts should expose price/shipping/return/payment information`).toContainText("価格・配送・返品・決済");
        await expect(commerceFacts, `${target.path} purchase facts should expose honest subscription state`).toContainText("定期購入");
        await expect(commerceFacts, `${target.path} purchase facts should expose SiteNavigationElement microdata`).toHaveAttribute(
          "itemtype",
          "https://schema.org/SiteNavigationElement",
        );
        expect(await commerceFacts.locator("a").count(), `${target.path} purchase facts should have crawlable internal links`).toBeGreaterThanOrEqual(5);
        expect(await commerceFacts.locator("a").first().getAttribute("class"), `${target.path} purchase fact links should be visibly styled`).toMatch(/border-|bg-/);
        const contextLinks = page.getByTestId("storefront-context-links");
        await expect(contextLinks, `${target.path} should include page-context internal links`).toBeVisible();
        await expect(contextLinks, `${target.path} contextual links should explain next actions`).toContainText("このページから次に確認すること");
        expect(await contextLinks.locator('[itemtype="https://schema.org/SiteNavigationElement"]').count(), `${target.path} contextual links should expose visible SiteNavigationElement microdata`).toBeGreaterThanOrEqual(1);
        expect(await contextLinks.locator("a").count(), `${target.path} contextual links should expose dense internal links`).toBeGreaterThanOrEqual(16);
        expect(await contextLinks.locator("a").first().getAttribute("class"), `${target.path} contextual links should use visible blue link affordance`).toContain("text-blue-700");
        const seoHub = page.getByTestId("storefront-seo-hub");
        await expect(seoHub, `${target.path} should include shared SEO hub`).toBeVisible();
        await expect(seoHub, `${target.path} SEO hub should explain internal navigation`).toContainText("迷わず探す");
        await expect(seoHub, `${target.path} SEO hub should expose product discovery`).toContainText("商品一覧へ");
        await expect(seoHub, `${target.path} SEO hub should expose support/account links`).toContainText("定期購入の状態を見る");
        expect(await seoHub.locator('[itemtype="https://schema.org/SiteNavigationElement"]').count(), `${target.path} SEO hub should expose visible SiteNavigationElement microdata`).toBeGreaterThanOrEqual(1);
        expect(await seoHub.locator("a").count(), `${target.path} SEO hub should expose dense crawlable links`).toBeGreaterThanOrEqual(14);
        expect(await seoHub.locator("a").nth(1).getAttribute("class"), `${target.path} SEO hub links should be visibly link-colored`).toContain("text-blue-700");
        const breadcrumb = page.getByTestId("storefront-breadcrumb");
        await expect(breadcrumb, `${target.path} should include visible breadcrumb navigation`).toBeVisible();
        await expect(breadcrumb, `${target.path} breadcrumb should expose BreadcrumbList microdata`).toHaveAttribute(
          "itemtype",
          "https://schema.org/BreadcrumbList",
        );
        expect(await breadcrumb.locator('[itemtype="https://schema.org/ListItem"]').count(), `${target.path} should expose visible breadcrumb ListItem microdata`).toBeGreaterThanOrEqual(1);
        const breadcrumbLinkCount = await breadcrumb.locator("a").count();
        if (breadcrumbLinkCount > 0) {
          expect(await breadcrumb.locator("a").first().getAttribute("class"), `${target.path} breadcrumb links should be visibly link-colored`).toContain("text-blue-700");
        }
        if ("expectedTestId" in target && target.expectedTestId) {
          await expect(page.locator(`[data-testid="${target.expectedTestId}"]`), target.path).toBeVisible();
        }
        if (target.name !== "shop-top") {
          const pageHeader = page.getByTestId("storefront-page-header");
          await expect(pageHeader, `${target.path} should include the shared page header`).toBeVisible();
          await expect(pageHeader.locator("h1"), `${target.path} shared page header should own the page h1`).toHaveCount(1);
          expect(await pageHeader.locator("a").count(), `${target.path} shared page header should expose crawlable action links`).toBeGreaterThanOrEqual(2);
          expect(await pageHeader.locator('[itemtype="https://schema.org/SiteNavigationElement"]').count(), `${target.path} page header should expose SiteNavigationElement microdata`).toBeGreaterThanOrEqual(1);
          const secondaryLinkClass = await pageHeader.locator("a").last().getAttribute("class");
          expect(secondaryLinkClass ?? "", `${target.path} page header secondary links should be visibly blue`).toContain("text-blue-700");
        }

        if (sharedProductCardPageNames.has(target.name)) {
          const cards = page.getByTestId("storefront-product-card");
          expect(await cards.count(), `${target.path} should use the shared storefront product card component`).toBeGreaterThanOrEqual(
            target.name === "shop-favorites" ? 10 : 5,
          );
          const firstCard = cards.first();
          await expect(firstCard, `${target.path} shared product card should expose Product microdata`).toHaveAttribute(
            "itemtype",
            "https://schema.org/Product",
          );
          await expect(
            firstCard.locator('[itemtype="https://schema.org/Offer"]'),
            `${target.path} shared product card should expose Offer microdata`,
          ).toHaveCount(1);
          await expect(
            firstCard.getByTestId("storefront-product-card-link"),
            `${target.path} shared product card should link to product detail`,
          ).toHaveAttribute("href", /\/s\/aiboux\/product\//);
          await expect(
            firstCard.getByTestId("storefront-product-card-category"),
            `${target.path} shared product card category should be crawlable`,
          ).toHaveAttribute("href", /\/s\/aiboux\/products\?category=/);
          expect(
            (await firstCard.getByTestId("storefront-product-card-title").getAttribute("class")) ?? "",
            `${target.path} shared product card title should be visibly link-colored`,
          ).toContain("text-blue-800");
          expect(
            (await firstCard.getByTestId("storefront-product-card-image").getAttribute("alt")) ?? "",
            `${target.path} shared product card image alt should describe the product`,
          ).toMatch(/商品画像/);
        }

        const jsonLdText = await page.locator('script[type="application/ld+json"]').first().textContent();
        const jsonLd = JSON.parse(jsonLdText || "{}");
        expect(jsonLd["@context"], `${target.path} structured data should use a single top-level schema.org context`).toBe("https://schema.org");
        expect(Array.isArray(jsonLd["@graph"]), `${target.path} structured data should be emitted as a connected @graph`).toBe(true);
        expect(jsonLd["@graph"].length, `${target.path} @graph should contain several connected storefront entities`).toBeGreaterThanOrEqual(5);
        expect((jsonLdText?.match(/"@context"/g) ?? []).length, `${target.path} should not repeat @context inside graph nodes`).toBe(1);
        expect(jsonLdText ?? "", `${target.path} should include BreadcrumbList JSON-LD`).toContain("BreadcrumbList");
        expect(jsonLdText ?? "", `${target.path} should include WebSite JSON-LD`).toContain("WebSite");
        expect(jsonLdText ?? "", `${target.path} should include Organization JSON-LD`).toContain("Organization");
        expect(jsonLdText ?? "", `${target.path} should identify the storefront as OnlineStore JSON-LD`).toContain("OnlineStore");
        expect(jsonLdText ?? "", `${target.path} should expose a stable store entity id`).toContain("#store");
        expect(jsonLdText ?? "", `${target.path} should expose a stable website entity id`).toContain("#website");
        expect(jsonLdText ?? "", `${target.path} WebPage should be linked to the WebSite entity`).toContain("isPartOf");
        expect(jsonLdText ?? "", `${target.path} WebPage should declare the storefront publisher`).toContain("publisher");
        expect(jsonLdText ?? "", `${target.path} WebPage should describe the storefront entity it is about`).toContain("about");
        expect(jsonLdText ?? "", `${target.path} should include merchant return policy JSON-LD`).toContain("MerchantReturnPolicy");
        expect(jsonLdText ?? "", `${target.path} should include shared site navigation JSON-LD`).toContain("SiteNavigationElement");
        expect(jsonLdText ?? "", `${target.path} should expose WebSite SearchAction matching storefront search`).toContain("SearchAction");
        expect(jsonLdText ?? "", `${target.path} SearchAction should target the products query URL`).toContain("products?q={search_term_string}");
        expect(jsonLdText ?? "", `${target.path} should expose a page entity JSON-LD`).toMatch(/WebPage|ContactPage|FAQPage|ItemPage|CollectionPage/);
        if (["shop-products-page", "shop-categories-page", "shop-favorites"].includes(target.name)) {
          expect(jsonLdText ?? "", `${target.path} discovery page should expose CollectionPage JSON-LD`).toContain("CollectionPage");
        }
        if (target.name === "shop-top") {
          expect(jsonLdText ?? "", `${target.path} should expose TOP product discovery ItemList JSON-LD`).toContain("ItemList");
          expect(jsonLdText ?? "", `${target.path} TOP ItemList should expose a stable entity id`).toContain("#itemlist");
          expect(jsonLdText ?? "", `${target.path} TOP ItemList should declare numberOfItems`).toContain("numberOfItems");
          expect(jsonLdText ?? "", `${target.path} TOP ItemList should link back to the WebPage entity`).toContain("mainEntityOfPage");
        }
        if (target.name === "shop-faq-page") {
          expect(jsonLdText ?? "", `${target.path} should expose FAQPage JSON-LD`).toContain("FAQPage");
          expect(jsonLdText ?? "", `${target.path} should expose FAQ question entities`).toContain("Question");
          expect(jsonLdText ?? "", `${target.path} should expose FAQ accepted answers`).toContain("acceptedAnswer");
        }
        if (target.name === "shop-contact-page") {
          expect(jsonLdText ?? "", `${target.path} should expose ContactPage JSON-LD`).toContain("ContactPage");
        }
        expect(jsonLdText ?? "", `${target.path} should include page-specific ItemList JSON-LD`).toContain("ItemList");
        expect(jsonLdText ?? "", `${target.path} ItemList should expose a stable entity id`).toContain("#itemlist");
        expect(jsonLdText ?? "", `${target.path} ItemList should declare numberOfItems`).toContain("numberOfItems");
        expect(jsonLdText ?? "", `${target.path} ItemList should link back to the WebPage entity`).toContain("mainEntityOfPage");

        const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
        expect(canonical, `${target.path} should include a self-referencing canonical URL`).toBeTruthy();
        expect(canonical ?? "", `${target.path} canonical should point at shop.aiboux.com tenant URL`).toContain(`https://shop.aiboux.com${target.path}`);

        const titleText = await page.title();
        expect(titleText.length, `${target.path} should expose a useful SEO title`).toBeGreaterThanOrEqual(12);
        expect(titleText.length, `${target.path} SEO title should not be overly long`).toBeLessThanOrEqual(78);
        expect(titleText, `${target.path} title should not use thin placeholder copy`).not.toMatch(/公開中の商品を表示|AIBOUX Storeの公開ページ|ストアページ/);

        const metaDescription = await page.locator('meta[name="description"]').getAttribute("content");
        expect(metaDescription, `${target.path} should include meta description`).toBeTruthy();
        expect(metaDescription?.length ?? 0, `${target.path} meta description should explain purchase/search/support intent`).toBeGreaterThanOrEqual(45);
        expect(metaDescription?.length ?? 0, `${target.path} meta description should remain snippet-safe`).toBeLessThanOrEqual(155);
        expect(metaDescription ?? "", `${target.path} description should not use thin placeholder copy`).not.toMatch(/公開中の商品を表示|AIBOUX Storeの公開ページ|ストアへの問い合わせを受け付けます/);

        const robots = await page.locator('meta[name="robots"]').getAttribute("content");
        if (noIndexPublicPageNames.has(target.name)) {
          expect(robots ?? "", `${target.path} transactional/account page should not be indexed`).toContain("noindex");
          expect(robots ?? "", `${target.path} should still allow link following`).toContain("follow");
        } else {
          expect(robots ?? "", `${target.path} discovery/content page should be indexable`).toContain("index");
          expect(robots ?? "", `${target.path} should allow large image previews`).toContain("max-image-preview:large");
        }

        await expect(page.locator('meta[property="og:title"]'), `${target.path} should include Open Graph title`).toHaveCount(1);
        await expect(page.locator('meta[property="og:description"]'), `${target.path} should include Open Graph description`).toHaveCount(1);
        await expect(page.locator('meta[property="og:url"]'), `${target.path} should include Open Graph URL`).toHaveCount(1);
        await expect(page.locator('meta[property="og:image"]'), `${target.path} should include Open Graph image`).toHaveCount(1);
        await expect(page.locator('meta[property="og:url"]'), `${target.path} Open Graph URL should match canonical`).toHaveAttribute("content", canonical ?? "");
        const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
        expect(ogImage ?? "", `${target.path} Open Graph image should be absolute`).toMatch(/^https:\/\/.+/);
        await expect(page.locator('meta[name="twitter:card"]'), `${target.path} should include Twitter Card metadata`).toHaveCount(1);
        await expect(page.locator('meta[name="twitter:card"]'), `${target.path} should use large image Twitter Card`).toHaveAttribute("content", "summary_large_image");
        await expect(page.locator('meta[name="twitter:description"]'), `${target.path} Twitter description should match meta description`).toHaveAttribute("content", metaDescription ?? "");
        await expect(page.locator('link[rel="alternate"][hreflang="ja-JP"]'), `${target.path} should include ja-JP alternate link`).toHaveCount(1);
        await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'), `${target.path} should include x-default alternate link`).toHaveCount(1);
        await expect(page.locator("h1"), `${target.path} should expose one primary heading`).toHaveCount(1);

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

  test("shop robots and sitemap expose only indexable tenant discovery pages", async ({ request }) => {
    const robots = await request.get("/robots.txt", { headers: { host: "shop.aiboux.com", "cache-control": "no-cache" } });
    expect(robots.status(), "robots.txt should be public").toBe(200);
    const robotsText = await robots.text();
    expect(robotsText).toContain("Sitemap: https://shop.aiboux.com/sitemap.xml");
    expect(robotsText).toContain("Disallow: /s/aiboux/cart");
    expect(robotsText).toContain("Disallow: /s/aiboux/checkout");
    expect(robotsText).toContain("Disallow: /s/aiboux/admin");

    const sitemap = await request.get("/sitemap.xml", { headers: { host: "shop.aiboux.com", "cache-control": "no-cache" } });
    expect(sitemap.status(), "sitemap.xml should be public").toBe(200);
    const sitemapXml = await sitemap.text();
    expect(sitemapXml).toContain("<loc>https://shop.aiboux.com/s/aiboux/</loc>");
    expect(sitemapXml).toContain("<loc>https://shop.aiboux.com/s/aiboux/products</loc>");
    expect(sitemapXml).toContain("<loc>https://shop.aiboux.com/s/aiboux/products?category=coffee-tea</loc>");
    expect(sitemapXml).toContain("<loc>https://shop.aiboux.com/s/aiboux/products?category=kitchen</loc>");
    expect(sitemapXml).toContain("<loc>https://shop.aiboux.com/s/aiboux/products?category=daily-goods</loc>");
    expect(sitemapXml).toContain("<loc>https://shop.aiboux.com/s/aiboux/categories</loc>");
    expect(sitemapXml).toContain("<loc>https://shop.aiboux.com/s/aiboux/product/setsuka-coffee</loc>");
    expect(sitemapXml).toContain("<loc>https://shop.aiboux.com/s/aiboux/returns</loc>");
    expect(sitemapXml).not.toContain("<loc>https://shop.aiboux.com/s/aiboux/cart</loc>");
    expect(sitemapXml).not.toContain("<loc>https://shop.aiboux.com/s/aiboux/checkout</loc>");
    expect(sitemapXml).not.toContain("<loc>https://shop.aiboux.com/s/aiboux/mypage</loc>");
    expect(sitemapXml).not.toContain("<loc>https://shop.aiboux.com/s/aiboux/admin");
  });

  test("storefront search uses crawlable GET URL and keeps query pages noindex", async ({ page, request }) => {
    await page.setViewportSize({ width: 1365, height: 1200 });
    await page.goto("/s/aiboux/", { waitUntil: "networkidle" });

    const searchForm = page.getByTestId("storefront-search-form").first();
    await expect(searchForm).toBeVisible();
    await expect(searchForm).toHaveAttribute("action", /\/s\/aiboux\/products$/);
    await searchForm.locator('input[name="q"]').fill("コーヒー");
    await searchForm.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/s\/aiboux\/products\?q=/);
    await expect(page.getByTestId("storefront-search-query")).toContainText("コーヒー");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("コーヒー");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://shop.aiboux.com/s/aiboux/products");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('[data-testid="storefront-products"] a[href*="/s/aiboux/product/"]')).not.toHaveCount(0);

    const response = await request.get("/s/aiboux/products?q=%E3%82%B3%E3%83%BC%E3%83%92%E3%83%BC", {
      headers: { "cache-control": "no-cache" },
    });
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('name="q"');
    expect(html).toContain("検索語:");
    expect(html).toContain("noindex,follow");
  });

  test("stable category product URLs are meaningful indexable discovery pages", async ({ page, request }) => {
    await page.setViewportSize({ width: 1365, height: 1200 });
    await page.goto("/s/aiboux/products?category=coffee-tea", { waitUntil: "networkidle" });

    await expect(page.getByTestId("storefront-category-query")).toContainText("コーヒー・お茶");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("コーヒー・お茶");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://shop.aiboux.com/s/aiboux/products?category=coffee-tea",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index,follow/);
    await expect(page.locator('[data-testid="storefront-products"] a[href*="/s/aiboux/product/"]')).not.toHaveCount(0);
    await expect(page.locator('[data-testid="storefront-products"]')).toContainText("コーヒー");

    const jsonLdText = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(jsonLdText ?? "").toContain("CollectionPage");
    expect(jsonLdText ?? "").toContain("ItemList");
    expect(jsonLdText ?? "").toContain("#itemlist");
    expect(jsonLdText ?? "").toContain("numberOfItems");

    const response = await request.get("/s/aiboux/products?category=coffee-tea", {
      headers: { "cache-control": "no-cache" },
    });
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain("カテゴリ: コーヒー・お茶");
    expect(html).toContain("index,follow,max-image-preview:large");
    expect(html).toContain("https://shop.aiboux.com/s/aiboux/products?category=coffee-tea");
    expect(html).not.toContain("noindex,follow,noarchive");
  });

  test("shared category links use stable slug URLs across header and product breadcrumbs", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 1200 });
    await page.goto("/s/aiboux/", { waitUntil: "networkidle" });

    const header = page.locator("header").first();
    await expect(header.getByRole("link", { name: "日用品" })).toHaveAttribute("href", "/s/aiboux/products?category=daily-goods");
    await expect(header.getByRole("link", { name: "セール" })).toHaveAttribute("href", "/s/aiboux/products?category=sale");
    await expect(header.getByRole("link", { name: "ランキング" })).toHaveAttribute("href", "/s/aiboux/products?category=ranking");

    const footer = page.getByTestId("storefront-footer");
    await expect(footer.getByRole("link", { name: "タイムセール" })).toHaveAttribute("href", "/s/aiboux/products?category=sale");
    await expect(footer.getByRole("link", { name: "売れ筋ランキング" })).toHaveAttribute("href", "/s/aiboux/products?category=ranking");

    await page.goto("/s/aiboux/product/setsuka-coffee", { waitUntil: "networkidle" });
    const breadcrumb = page.getByTestId("storefront-breadcrumb");
    await expect(breadcrumb.getByRole("link", { name: "コーヒー・お茶" })).toHaveAttribute(
      "href",
      "/s/aiboux/products?category=coffee-tea",
    );
  });
});
