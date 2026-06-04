# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-public-crawl.spec.ts >> AIBOUX Shop 5H sprint public crawl >> public storefront internal links resolve to implemented tenant pages
- Location: tests/shop-public-crawl.spec.ts:378:3

# Error details

```
Error: /s/aiboux/product/setsuka-coffee-related

expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 503
```

# Test source

```ts
  309 |         expect(jsonLdText ?? "", `${target.path} ItemList should link back to the WebPage entity`).toContain("mainEntityOfPage");
  310 | 
  311 |         const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  312 |         expect(canonical, `${target.path} should include a self-referencing canonical URL`).toBeTruthy();
  313 |         expect(canonical ?? "", `${target.path} canonical should point at shop.aiboux.com tenant URL`).toContain(`https://shop.aiboux.com${target.path}`);
  314 | 
  315 |         const titleText = await page.title();
  316 |         expect(titleText.length, `${target.path} should expose a useful SEO title`).toBeGreaterThanOrEqual(12);
  317 |         expect(titleText.length, `${target.path} SEO title should not be overly long`).toBeLessThanOrEqual(78);
  318 |         expect(titleText, `${target.path} title should not use thin placeholder copy`).not.toMatch(/公開中の商品を表示|AIBOUX Storeの公開ページ|ストアページ/);
  319 | 
  320 |         const metaDescription = await page.locator('meta[name="description"]').getAttribute("content");
  321 |         expect(metaDescription, `${target.path} should include meta description`).toBeTruthy();
  322 |         expect(metaDescription?.length ?? 0, `${target.path} meta description should explain purchase/search/support intent`).toBeGreaterThanOrEqual(45);
  323 |         expect(metaDescription?.length ?? 0, `${target.path} meta description should remain snippet-safe`).toBeLessThanOrEqual(155);
  324 |         expect(metaDescription ?? "", `${target.path} description should not use thin placeholder copy`).not.toMatch(/公開中の商品を表示|AIBOUX Storeの公開ページ|ストアへの問い合わせを受け付けます/);
  325 | 
  326 |         const robots = await page.locator('meta[name="robots"]').getAttribute("content");
  327 |         if (noIndexPublicPageNames.has(target.name)) {
  328 |           expect(robots ?? "", `${target.path} transactional/account page should not be indexed`).toContain("noindex");
  329 |           expect(robots ?? "", `${target.path} should still allow link following`).toContain("follow");
  330 |         } else {
  331 |           expect(robots ?? "", `${target.path} discovery/content page should be indexable`).toContain("index");
  332 |           expect(robots ?? "", `${target.path} should allow large image previews`).toContain("max-image-preview:large");
  333 |         }
  334 | 
  335 |         await expect(page.locator('meta[property="og:title"]'), `${target.path} should include Open Graph title`).toHaveCount(1);
  336 |         await expect(page.locator('meta[property="og:description"]'), `${target.path} should include Open Graph description`).toHaveCount(1);
  337 |         await expect(page.locator('meta[property="og:url"]'), `${target.path} should include Open Graph URL`).toHaveCount(1);
  338 |         await expect(page.locator('meta[property="og:image"]'), `${target.path} should include Open Graph image`).toHaveCount(1);
  339 |         await expect(page.locator('meta[property="og:url"]'), `${target.path} Open Graph URL should match canonical`).toHaveAttribute("content", canonical ?? "");
  340 |         const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  341 |         expect(ogImage ?? "", `${target.path} Open Graph image should be absolute`).toMatch(/^https:\/\/.+/);
  342 |         await expect(page.locator('meta[name="twitter:card"]'), `${target.path} should include Twitter Card metadata`).toHaveCount(1);
  343 |         await expect(page.locator('meta[name="twitter:card"]'), `${target.path} should use large image Twitter Card`).toHaveAttribute("content", "summary_large_image");
  344 |         await expect(page.locator('meta[name="twitter:description"]'), `${target.path} Twitter description should match meta description`).toHaveAttribute("content", metaDescription ?? "");
  345 |         await expect(page.locator('link[rel="alternate"][hreflang="ja-JP"]'), `${target.path} should include ja-JP alternate link`).toHaveCount(1);
  346 |         await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'), `${target.path} should include x-default alternate link`).toHaveCount(1);
  347 |         await expect(page.locator("h1"), `${target.path} should expose one primary heading`).toHaveCount(1);
  348 | 
  349 |         const bodyBox = await page.locator("body").boundingBox();
  350 |         expect(bodyBox?.width ?? 0, `${target.path} should render a styled page body`).toBeGreaterThan(300);
  351 | 
  352 |         if (target.name === "shop-top" || viewport.suffix === "1980") {
  353 |           await saveScreenshot(page, `${target.name}-${viewport.suffix}.png`);
  354 |         }
  355 |       }
  356 |     });
  357 |   }
  358 | 
  359 |   test("admin pages render and keep demo values absent", async ({ page, request }) => {
  360 |     await page.setViewportSize({ width: 1980, height: 1080 });
  361 |     for (const target of adminUrls) {
  362 |       const response = await request.get(target.path, { headers: { "cache-control": "no-cache" } });
  363 |       expect(response.status(), target.path).toBe(200);
  364 |       expect(response.headers()["content-type"] ?? "", target.path).toContain("text/html");
  365 | 
  366 |       await page.goto(`${target.path}?adminCrawl=${Date.now()}`, { waitUntil: "networkidle" });
  367 |       await expect(page.locator("body")).not.toContainText("2024/05");
  368 |       await expect(page.locator("body")).not.toContainText("山田 太郎");
  369 |       await expect(page.locator("body")).not.toContainText("#10085");
  370 |       await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  371 | 
  372 |       if (target.name === "shop-admin-design" || target.name === "shop-admin-subscriptions") {
  373 |         await saveScreenshot(page, `${target.name}.png`);
  374 |       }
  375 |     }
  376 |   });
  377 | 
  378 |   test("public storefront internal links resolve to implemented tenant pages", async ({ request }) => {
  379 |     const discovered = new Set<string>();
  380 | 
  381 |     for (const target of publicUrls) {
  382 |       const response = await request.get(target.path, { headers: { "cache-control": "no-cache" } });
  383 |       expect(response.status(), target.path).toBe(200);
  384 |       const html = await response.text();
  385 | 
  386 |       for (const match of html.matchAll(/href="([^"]+)"/g)) {
  387 |         const href = match[1];
  388 |         if (
  389 |           !href ||
  390 |           href.startsWith("#") ||
  391 |           href.startsWith("javascript:") ||
  392 |           href.startsWith("mailto:") ||
  393 |           href.startsWith("tel:")
  394 |         ) {
  395 |           continue;
  396 |         }
  397 | 
  398 |         const url = new URL(href, "https://shop.aiboux.com");
  399 |         if (url.hostname === "shop.aiboux.com" && url.pathname.startsWith("/s/aiboux")) {
  400 |           discovered.add(url.pathname);
  401 |         }
  402 |       }
  403 |     }
  404 | 
  405 |     expect(discovered.size, "tenant storefront should expose internal links for account, commerce, and policy pages").toBeGreaterThan(12);
  406 | 
  407 |     for (const pathname of [...discovered].sort()) {
  408 |       const linked = await request.get(pathname, { headers: { "cache-control": "no-cache" } });
> 409 |       expect(linked.status(), pathname).toBe(200);
      |                                         ^ Error: /s/aiboux/product/setsuka-coffee-related
  410 |       const body = await linked.text();
  411 |       expect(body, pathname).not.toContain("ページが見つかりません");
  412 |       expect(body, pathname).not.toContain("Not Found");
  413 |     }
  414 |   });
  415 | 
  416 |   test("shop robots and sitemap expose only indexable tenant discovery pages", async ({ request }) => {
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
```