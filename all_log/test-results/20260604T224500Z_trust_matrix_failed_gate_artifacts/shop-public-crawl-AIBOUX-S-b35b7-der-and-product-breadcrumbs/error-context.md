# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-public-crawl.spec.ts >> AIBOUX Shop 5H sprint public crawl >> shared category links use stable slug URLs across header and product breadcrumbs
- Location: tests/shop-public-crawl.spec.ts:502:3

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator: getByTestId('storefront-breadcrumb').getByRole('link', { name: 'コーヒー・お茶' })
Expected: "/s/aiboux/products?category=coffee-tea"
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toHaveAttribute" with timeout 10000ms
  - waiting for getByTestId('storefront-breadcrumb').getByRole('link', { name: 'コーヒー・お茶' })

```

```yaml
- 'heading "Error 1102 Ray ID: a06a734a8c2fc713 • 2026-06-04 22:42:22 UTC" [level=1]'
- heading "Worker exceeded resource limits" [level=2]
- heading "What happened?" [level=2]
- paragraph:
  - text: You've requested a page on a website (shop.aiboux.com) that is on the
  - link "Cloudflare":
    - /url: https://www.cloudflare.com/5xx-error-landing?utm_source=error_100x
  - text: network. An unknown error occurred while rendering the page.
- heading "What can I do?" [level=2]
- paragraph:
  - strong: "If you are the owner of this website:"
  - text: refer to
  - link "Workers - Errors and Exceptions":
    - /url: https://developers.cloudflare.com/workers/observability/errors/
  - text: and check Workers Logs for shop.aiboux.com.
- paragraph:
  - text: "Cloudflare Ray ID:"
  - strong: a06a734a8c2fc713
  - text: "• Your IP:"
  - button "Click to reveal"
  - text: • Performance & security by
  - link "Cloudflare":
    - /url: https://www.cloudflare.com/5xx-error-landing
```

# Test source

```ts
  417 |     const robots = await request.get("/robots.txt", { headers: { host: "shop.aiboux.com", "cache-control": "no-cache" } });
  418 |     expect(robots.status(), "robots.txt should be public").toBe(200);
  419 |     const robotsText = await robots.text();
  420 |     expect(robotsText).toContain("Sitemap: https://shop.aiboux.com/sitemap.xml");
  421 |     expect(robotsText).toContain("Disallow: /s/aiboux/cart");
  422 |     expect(robotsText).toContain("Disallow: /s/aiboux/checkout");
  423 |     expect(robotsText).toContain("Disallow: /s/aiboux/admin");
  424 | 
  425 |     const sitemap = await request.get("/sitemap.xml", { headers: { host: "shop.aiboux.com", "cache-control": "no-cache" } });
  426 |     expect(sitemap.status(), "sitemap.xml should be public").toBe(200);
  427 |     const sitemapXml = await sitemap.text();
  428 |     expect(sitemapXml).toContain("<loc>https://shop.aiboux.com/s/aiboux/</loc>");
  429 |     expect(sitemapXml).toContain("<loc>https://shop.aiboux.com/s/aiboux/products</loc>");
  430 |     expect(sitemapXml).toContain("<loc>https://shop.aiboux.com/s/aiboux/products?category=coffee-tea</loc>");
  431 |     expect(sitemapXml).toContain("<loc>https://shop.aiboux.com/s/aiboux/products?category=kitchen</loc>");
  432 |     expect(sitemapXml).toContain("<loc>https://shop.aiboux.com/s/aiboux/products?category=daily-goods</loc>");
  433 |     expect(sitemapXml).toContain("<loc>https://shop.aiboux.com/s/aiboux/categories</loc>");
  434 |     expect(sitemapXml).toContain("<loc>https://shop.aiboux.com/s/aiboux/product/setsuka-coffee</loc>");
  435 |     expect(sitemapXml).toContain("<loc>https://shop.aiboux.com/s/aiboux/returns</loc>");
  436 |     expect(sitemapXml).not.toContain("<loc>https://shop.aiboux.com/s/aiboux/cart</loc>");
  437 |     expect(sitemapXml).not.toContain("<loc>https://shop.aiboux.com/s/aiboux/checkout</loc>");
  438 |     expect(sitemapXml).not.toContain("<loc>https://shop.aiboux.com/s/aiboux/mypage</loc>");
  439 |     expect(sitemapXml).not.toContain("<loc>https://shop.aiboux.com/s/aiboux/admin");
  440 |   });
  441 | 
  442 |   test("storefront search uses crawlable GET URL and keeps query pages noindex", async ({ page, request }) => {
  443 |     await page.setViewportSize({ width: 1365, height: 1200 });
  444 |     await page.goto("/s/aiboux/", { waitUntil: "networkidle" });
  445 | 
  446 |     const searchForm = page.getByTestId("storefront-search-form").first();
  447 |     await expect(searchForm).toBeVisible();
  448 |     await expect(searchForm).toHaveAttribute("action", /\/s\/aiboux\/products$/);
  449 |     await searchForm.locator('input[name="q"]').fill("コーヒー");
  450 |     await searchForm.locator('button[type="submit"]').click();
  451 | 
  452 |     await expect(page).toHaveURL(/\/s\/aiboux\/products\?q=/);
  453 |     await expect(page.getByTestId("storefront-search-query")).toContainText("コーヒー");
  454 |     await expect(page.locator("h1")).toHaveCount(1);
  455 |     await expect(page.locator("h1")).toContainText("コーヒー");
  456 |     await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://shop.aiboux.com/s/aiboux/products");
  457 |     await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  458 |     await expect(page.locator('[data-testid="storefront-products"] a[href*="/s/aiboux/product/"]')).not.toHaveCount(0);
  459 | 
  460 |     const response = await request.get("/s/aiboux/products?q=%E3%82%B3%E3%83%BC%E3%83%92%E3%83%BC", {
  461 |       headers: { "cache-control": "no-cache" },
  462 |     });
  463 |     expect(response.status()).toBe(200);
  464 |     const html = await response.text();
  465 |     expect(html).toContain('name="q"');
  466 |     expect(html).toContain("検索語:");
  467 |     expect(html).toContain("noindex,follow");
  468 |   });
  469 | 
  470 |   test("stable category product URLs are meaningful indexable discovery pages", async ({ page, request }) => {
  471 |     await page.setViewportSize({ width: 1365, height: 1200 });
  472 |     await page.goto("/s/aiboux/products?category=coffee-tea", { waitUntil: "networkidle" });
  473 | 
  474 |     await expect(page.getByTestId("storefront-category-query")).toContainText("コーヒー・お茶");
  475 |     await expect(page.locator("h1")).toHaveCount(1);
  476 |     await expect(page.locator("h1")).toContainText("コーヒー・お茶");
  477 |     await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
  478 |       "href",
  479 |       "https://shop.aiboux.com/s/aiboux/products?category=coffee-tea",
  480 |     );
  481 |     await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index,follow/);
  482 |     await expect(page.locator('[data-testid="storefront-products"] a[href*="/s/aiboux/product/"]')).not.toHaveCount(0);
  483 |     await expect(page.locator('[data-testid="storefront-products"]')).toContainText("コーヒー");
  484 | 
  485 |     const jsonLdText = await page.locator('script[type="application/ld+json"]').first().textContent();
  486 |     expect(jsonLdText ?? "").toContain("CollectionPage");
  487 |     expect(jsonLdText ?? "").toContain("ItemList");
  488 |     expect(jsonLdText ?? "").toContain("#itemlist");
  489 |     expect(jsonLdText ?? "").toContain("numberOfItems");
  490 | 
  491 |     const response = await request.get("/s/aiboux/products?category=coffee-tea", {
  492 |       headers: { "cache-control": "no-cache" },
  493 |     });
  494 |     expect(response.status()).toBe(200);
  495 |     const html = await response.text();
  496 |     expect(html).toContain("カテゴリ: コーヒー・お茶");
  497 |     expect(html).toContain("index,follow,max-image-preview:large");
  498 |     expect(html).toContain("https://shop.aiboux.com/s/aiboux/products?category=coffee-tea");
  499 |     expect(html).not.toContain("noindex,follow,noarchive");
  500 |   });
  501 | 
  502 |   test("shared category links use stable slug URLs across header and product breadcrumbs", async ({ page }) => {
  503 |     await page.setViewportSize({ width: 1365, height: 1200 });
  504 |     await page.goto("/s/aiboux/", { waitUntil: "networkidle" });
  505 | 
  506 |     const header = page.locator("header").first();
  507 |     await expect(header.getByRole("link", { name: "日用品" })).toHaveAttribute("href", "/s/aiboux/products?category=daily-goods");
  508 |     await expect(header.getByRole("link", { name: "セール" })).toHaveAttribute("href", "/s/aiboux/products?category=sale");
  509 |     await expect(header.getByRole("link", { name: "ランキング" })).toHaveAttribute("href", "/s/aiboux/products?category=ranking");
  510 | 
  511 |     const footer = page.getByTestId("storefront-footer");
  512 |     await expect(footer.getByRole("link", { name: "タイムセール" })).toHaveAttribute("href", "/s/aiboux/products?category=sale");
  513 |     await expect(footer.getByRole("link", { name: "売れ筋ランキング" })).toHaveAttribute("href", "/s/aiboux/products?category=ranking");
  514 | 
  515 |     await page.goto("/s/aiboux/product/setsuka-coffee", { waitUntil: "networkidle" });
  516 |     const breadcrumb = page.getByTestId("storefront-breadcrumb");
> 517 |     await expect(breadcrumb.getByRole("link", { name: "コーヒー・お茶" })).toHaveAttribute(
      |                                                                     ^ Error: expect(locator).toHaveAttribute(expected) failed
  518 |       "href",
  519 |       "/s/aiboux/products?category=coffee-tea",
  520 |     );
  521 |   });
  522 | });
  523 | 
```