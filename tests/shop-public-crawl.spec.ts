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
  test.setTimeout(120000);

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
        await expect(page.locator("body")).not.toContainText("SEO / UI checklist");
        await expect(page.locator("body")).not.toContainText("SEO site map");
        await expect(page.locator("body")).not.toContainText("Crawl map");
        await expect(page.locator("body")).not.toContainText("SEO構造");
        await expect(page.locator("body")).not.toContainText("canonical");
        await expect(page.locator("body")).not.toContainText("robots");
        await expect(page.locator("body")).not.toContainText("sitemap");
        await expect(page.locator("body")).not.toContainText("共通SEO部品");
        await expect(page.locator("body")).not.toContainText("SEO内部リンク");
        await expect(page.locator("body")).not.toContainText("クロール可能");
        await expect(page.locator("body")).not.toContainText("内部リンク");
        await expect(page.locator("body")).not.toContainText("Page guide");
        await expect(page.locator("body")).not.toContainText("Trust / proof matrix");
        await expect(page.locator("body")).not.toContainText("AIBOUX Shop 共通テンプレート");
        await expect(page.locator("body")).not.toContainText("表示確認日");
        await expect(page.locator("body")).not.toContainText("D1 migration");
        await expect(page.locator("body")).not.toContainText("DB migration");
        await expect(page.locator("body")).not.toContainText("SUBSCRIPTION_SCHEMA_PENDING");
        await expect(page.locator("body")).not.toContainText("ログイン基盤");
        await expect(page.locator("body")).not.toContainText("本番認証");
        await expect(page.locator("body")).not.toContainText("成功したふり");
        await expect(page.locator("body")).not.toContainText("準備中");
        await expect(page.locator("body")).not.toContainText("未完了");
        await expect(page.locator("body")).not.toContainText("未接続");
        await expect(page.locator("body")).not.toContainText("Provider subscription");
        const html = await page.content();
        expect(html, `${target.path} should not expose internal implementation wording in rendered HTML`).not.toContain("クロール可能");
        expect(html, `${target.path} should not expose internal implementation wording in rendered HTML`).not.toContain("内部リンク");
        expect(html, `${target.path} should not expose internal implementation wording in rendered HTML`).not.toContain("Page guide");
        expect(html, `${target.path} should not expose internal implementation wording in rendered HTML`).not.toContain("Trust / proof matrix");
        expect(html, `${target.path} should not expose internal implementation wording in rendered HTML`).not.toContain("準備中");
        expect(html, `${target.path} should not expose internal implementation wording in rendered HTML`).not.toContain("未完了");
        expect(html, `${target.path} should not expose internal implementation wording in rendered HTML`).not.toContain("未接続");
        expect(html, `${target.path} should not expose internal implementation wording in rendered HTML`).not.toContain("Provider subscription");
        const skipLinks = page.getByTestId("storefront-skip-links");
        await expect(skipLinks, `${target.path} should expose shared skip links for SEO/page experience`).toHaveCount(1);
        await expect(skipLinks.locator('a[href="#storefront-main"]'), `${target.path} should allow direct jump to main content`).toHaveCount(1);
        await expect(skipLinks.locator('a[href="#storefront-search"]'), `${target.path} should allow direct jump to product search`).toHaveCount(1);
        await expect(skipLinks.locator('a[href="#storefront-footer"]'), `${target.path} should allow direct jump to footer navigation`).toHaveCount(1);
        await skipLinks.getByRole("link", { name: "本文へスキップ" }).focus();
        await expect(skipLinks.getByRole("link", { name: "本文へスキップ" }), `${target.path} skip link should become visible on focus`).toBeVisible();
        await expect(page.locator("main#storefront-main"), `${target.path} should expose a single main landmark target`).toHaveCount(1);
        await expect(page.locator("#storefront-search"), `${target.path} should expose a product-search landmark target`).toHaveCount(1);
        await expect(page.locator("footer#storefront-footer"), `${target.path} should expose a footer landmark target`).toHaveCount(1);
        await expect(page.locator('header[aria-label="ストアヘッダー"]'), `${target.path} should label the shared storefront header`).toHaveCount(1);
        await expect(page.locator('nav[aria-label="ストアカテゴリナビ"]'), `${target.path} should label the shared category navigation`).toHaveCount(1);
        const searchForm = page.getByTestId("storefront-search-form").first();
        await expect(searchForm, `${target.path} should expose a crawlable store search form`).toBeVisible();
        await expect(searchForm, `${target.path} search form should submit as GET`).toHaveAttribute("method", /get/i);
        await expect(searchForm, `${target.path} search form should target products discovery page`).toHaveAttribute("action", /\/s\/aiboux\/products$/);
        await expect(searchForm.locator('input[name="q"]'), `${target.path} search input should use q query parameter`).toHaveCount(1);
        const footer = page.getByTestId("storefront-footer");
        await expect(footer, `${target.path} should include Amazon-like storefront footer`).toBeVisible();
        await expect(footer, `${target.path} footer should include shopping continuation actions`).toContainText("買い物を続ける");
        await expect(footer.getByLabel("フッタークイックリンク").getByRole("link", { name: "商品一覧" })).toHaveAttribute("href", "/s/aiboux/products");
        await expect(footer.getByLabel("フッタークイックリンク").getByRole("link", { name: "カート" })).toHaveAttribute("href", "/s/aiboux/cart");
        await expect(footer.getByLabel("フッタークイックリンク").getByRole("link", { name: "注文履歴" })).toHaveAttribute("href", "/s/aiboux/orders");
        await expect(footer.getByLabel("フッタークイックリンク").getByRole("link", { name: "問い合わせ" })).toHaveAttribute("href", "/s/aiboux/contact");
        expect(await footer.locator('[itemtype="https://schema.org/SiteNavigationElement"]').count(), `${target.path} footer should expose shared SiteNavigationElement microdata`).toBeGreaterThanOrEqual(4);
        expect(await footer.locator("a").count(), `${target.path} footer should expose dense internal link coverage`).toBeGreaterThanOrEqual(34);
        await expect(footer, `${target.path} footer should include payment/subscription honesty assurance`).toContainText("支払い方法の選択が必要な場合は、注文前に分かりやすく案内します");
        const footerLinkDirectory = page.getByTestId("storefront-footer-link-directory");
        await expect(footerLinkDirectory, `${target.path} should include shared footer link directory`).toBeVisible();
        await expect(footerLinkDirectory, `${target.path} footer link directory should expose ItemList microdata`).toHaveAttribute(
          "itemtype",
          "https://schema.org/ItemList",
        );
        await expect(footerLinkDirectory, `${target.path} footer link directory should use customer-facing copy`).toContainText("ストア主要リンク");
        await expect(footerLinkDirectory.locator('meta[itemprop="numberOfItems"]'), `${target.path} footer link directory should declare numberOfItems`).toHaveCount(1);
        expect(await footerLinkDirectory.locator('[itemtype="https://schema.org/ListItem"]').count(), `${target.path} footer link directory should expose ListItem microdata`).toBeGreaterThanOrEqual(20);
        expect(await footerLinkDirectory.locator("a").count(), `${target.path} footer link directory should expose dense internal links`).toBeGreaterThanOrEqual(20);
        expect(await footerLinkDirectory.locator("a").first().getAttribute("class"), `${target.path} footer link directory links should be visibly blue or sky colored`).toContain("text-sky-200");
        await expect(footerLinkDirectory, `${target.path} footer link directory should include account, purchase, and policy routes`).toContainText(/商品一覧|注文履歴|特定商取引法|定期購入/);
        await expect(page.getByTestId("storefront-support-rail"), `${target.path} should not show a separate support explanation rail in the shopper flow`).toHaveCount(0);
        await expect(page.getByTestId("storefront-commerce-facts"), `${target.path} should not show purchase fact explanation panels before the main task`).toHaveCount(0);
        await expect(page.getByTestId("storefront-trust-matrix"), `${target.path} should not show trust/proof explanation matrix as visible retail content`).toHaveCount(0);
        await expect(page.getByTestId("storefront-page-quality-summary"), `${target.path} should not show page quality explanations to shoppers`).toHaveCount(0);
        await expect(page.getByTestId("storefront-page-action-map"), `${target.path} should not show next-action explanation panels to shoppers`).toHaveCount(0);
        await expect(page.locator("body"), `${target.path} should not expose internal page-guide copy`).not.toContainText("探せること");
        await expect(page.locator("body"), `${target.path} should not expose internal next-action copy`).not.toContainText("次にできること");
        await expect(page.getByTestId("storefront-seo-checklist"), `${target.path} should not show SEO checklist to shoppers`).toHaveCount(0);
        await expect(page.getByTestId("storefront-seo-sitemap-panel"), `${target.path} should not show technical SEO sitemap panel to shoppers`).toHaveCount(0);
        await expect(page.getByTestId("storefront-buying-guide"), `${target.path} should not show separate buying-guide explanation panels`).toHaveCount(0);
        await expect(page.getByTestId("storefront-context-links"), `${target.path} should not show separate context-link explanation panels`).toHaveCount(0);
        await expect(page.getByTestId("storefront-seo-hub"), `${target.path} should not show SEO hub panels to shoppers`).toHaveCount(0);
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
        const breadcrumbShell = page.getByTestId("storefront-breadcrumb-shell");
        await expect(breadcrumbShell, `${target.path} should render the shared breadcrumb shell`).toBeVisible();
        await expect(breadcrumbShell, `${target.path} breadcrumb shell should label the current location`).toContainText("現在地");
        const breadcrumbSupport = page.getByTestId("storefront-breadcrumb-support-links");
        await expect(breadcrumbSupport, `${target.path} should include breadcrumb-adjacent support links`).toBeVisible();
        await expect(breadcrumbSupport, `${target.path} support links should expose SiteNavigationElement microdata`).toHaveAttribute(
          "itemtype",
          "https://schema.org/SiteNavigationElement",
        );
        expect(await breadcrumbSupport.locator("a").count(), `${target.path} should expose multiple breadcrumb support links`).toBeGreaterThanOrEqual(3);
        expect(await breadcrumbSupport.locator("a").first().getAttribute("class"), `${target.path} breadcrumb support links should be visibly blue`).toContain("text-blue-700");
        if ("expectedTestId" in target && target.expectedTestId) {
          await expect(page.locator(`[data-testid="${target.expectedTestId}"]`), target.path).toBeVisible();
        }
        if (["shop-mypage", "shop-account"].includes(target.name)) {
          const commandCenter = page.getByTestId("storefront-account-command-center");
          await expect(commandCenter, `${target.path} should expose account command center`).toBeVisible();
          await expect(commandCenter, `${target.path} should link to orders, subscriptions, and contact`).toContainText(/注文を探す|定期購入|問い合わせ/);
          expect(await commandCenter.locator("a").count(), `${target.path} command center should expose dense account links`).toBeGreaterThanOrEqual(4);
        }
        if (target.name === "shop-orders") {
          await expect(page.getByTestId("storefront-order-action-panel"), `${target.path} should expose order lookup and support panel`).toBeVisible();
          await expect(page.getByTestId("storefront-order-status-cards"), `${target.path} should expose order status action cards`).toBeVisible();
          await expect(page.getByTestId("storefront-order-status-cards"), `${target.path} order status cards should include delivery and returns`).toContainText(/配送状況|返品・交換/);
          await expect(page.locator("[data-order-search-form]"), `${target.path} should expose an order lookup form instead of disabled placeholders`).toBeVisible();
          await expect(page.locator("[data-order-search-form] input[name='orderNumber']")).toBeEnabled();
          await expect(page.locator("[data-order-search-form] input[name='orderEmail']")).toBeEnabled();
          await expect(page.locator("[data-order-search-form] select[name='orderPeriod']")).toBeEnabled();
        }
        if (target.name === "shop-favorites") {
          const favoriteAssist = page.getByTestId("storefront-favorite-assist-grid");
          await expect(favoriteAssist, `${target.path} should expose favorite comparison actions`).toBeVisible();
          await expect(favoriteAssist, `${target.path} should include price, stock, cart, and policy actions`).toContainText(/価格を見る|在庫を確認|まとめて買う|条件を見る/);
        }
        if (target.name === "shop-mypage-subscriptions") {
          const subscriptionPanel = page.getByTestId("storefront-subscription-control-panel");
          await expect(subscriptionPanel, `${target.path} should expose subscription operation guide`).toBeVisible();
          await expect(subscriptionPanel, `${target.path} should include delivery, frequency, skip, and cancellation guidance`).toContainText(/次回配送|頻度変更|スキップ|解約条件/);
        }
        if (["shop-login", "shop-register"].includes(target.name)) {
          const authAssist = page.getByTestId("storefront-auth-assist-grid");
          await expect(authAssist, `${target.path} should expose account assist links`).toBeVisible();
          await expect(authAssist, `${target.path} should include account value routes`).toContainText(/注文を追跡|お気に入り保存|定期購入管理|個人情報の扱い/);
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
          expect(jsonLdText ?? "", `${target.path} TOP navigation graph should include sale discovery links`).toContain("タイムセール");
          expect(jsonLdText ?? "", `${target.path} TOP navigation graph should include product discovery links`).toContain("商品一覧");
          expect(jsonLdText ?? "", `${target.path} TOP navigation graph should include purchase flow links`).toContain("カート");
          expect(jsonLdText ?? "", `${target.path} TOP navigation graph should include support links`).toContain("問い合わせ");
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

  test("login and register forms validate without fake account completion", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 1000 });
    for (const path of ["/s/aiboux/login", "/s/aiboux/register"]) {
      await page.goto(`${path}?authCheck=${Date.now()}`, { waitUntil: "networkidle" });
      await page.locator("[data-auth-form]").getByRole("button").first().click();
      await expect(page.getByText("正しいメールアドレスを入力してください。")).toBeVisible();
      await page.locator('[data-auth-form] input[name="email"]').fill("buyer@example.com");
      await page.locator('[data-auth-form] input[name="password"]').fill("password123");
      await page.locator("[data-auth-form]").getByRole("button").first().click();
      await expect(page.getByText("入力内容を確認しました。")).toBeVisible();
      await expect(page.locator("[data-auth-status]").getByRole("link", { name: "マイページへ" })).toHaveAttribute("href", "/s/aiboux/mypage");
      await expect(page.locator("[data-auth-status]").getByRole("link", { name: "注文履歴へ" })).toHaveAttribute("href", "/s/aiboux/orders");
      await expect(page.locator("[data-auth-status]").getByRole("link", { name: "お気に入りへ" })).toHaveAttribute("href", "/s/aiboux/favorites");
      await expect(page.locator("body")).not.toContainText("ログインしました");
      await expect(page.locator("body")).not.toContainText("登録が完了しました");
    }
  });

  test("order lookup form validates and returns support links without fake order completion", async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 1000 });
    await page.goto(`/s/aiboux/orders?orderLookup=${Date.now()}`, { waitUntil: "networkidle" });

    const form = page.locator("[data-order-search-form]");
    await expect(form).toBeVisible();
    await form.getByRole("button", { name: "注文を確認" }).click();
    await expect(page.locator("[data-order-search-status]")).toContainText("注文番号またはメールアドレスを入力してください。");

    await form.locator("input[name='orderNumber']").fill("#AIBOUX-1001");
    await form.locator("input[name='orderEmail']").fill("buyer@example.com");
    await form.getByRole("button", { name: "注文を確認" }).click();
    await expect(page.locator("[data-order-search-status]")).toContainText("入力内容を確認しました。");
    await expect(page.locator("[data-order-search-status]").getByRole("link", { name: "問い合わせへ進む" })).toHaveAttribute("href", "/s/aiboux/contact");
    await expect(page.locator("[data-order-search-status]").getByRole("link", { name: "配送条件を見る" })).toHaveAttribute("href", "/s/aiboux/shipping");
    await expect(page.locator("[data-order-search-status]").getByRole("link", { name: "返品条件を見る" })).toHaveAttribute("href", "/s/aiboux/returns");
    await expect(page.locator("body")).not.toContainText("注文が確定しました");
    await expect(page.locator("body")).not.toContainText("発送しました");
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
    const footerShoppingColumn = footer.getByLabel("お買い物");
    await expect(footerShoppingColumn.getByRole("link", { name: "タイムセール" })).toHaveAttribute("href", "/s/aiboux/products?category=sale");
    await expect(footerShoppingColumn.getByRole("link", { name: "売れ筋ランキング" })).toHaveAttribute("href", "/s/aiboux/products?category=ranking");
    const footerLinkDirectory = page.getByTestId("storefront-footer-link-directory");
    await expect(footerLinkDirectory.getByRole("link", { name: "タイムセール" })).toHaveAttribute("href", "/s/aiboux/products?category=sale");
    await expect(footerLinkDirectory.getByRole("link", { name: "売れ筋ランキング" })).toHaveAttribute("href", "/s/aiboux/products?category=ranking");

    await page.goto("/s/aiboux/product/setsuka-coffee", { waitUntil: "networkidle" });
    const breadcrumb = page.getByTestId("storefront-breadcrumb");
    await expect(breadcrumb.getByRole("link", { name: "コーヒー・お茶" })).toHaveAttribute(
      "href",
      "/s/aiboux/products?category=coffee-tea",
    );
  });
});
