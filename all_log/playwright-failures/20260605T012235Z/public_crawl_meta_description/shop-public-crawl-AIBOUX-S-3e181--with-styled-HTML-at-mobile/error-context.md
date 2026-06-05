# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-public-crawl.spec.ts >> AIBOUX Shop 5H sprint public crawl >> public storefront pages render with styled HTML at mobile
- Location: tests/shop-public-crawl.spec.ts:88:5

# Error details

```
Error: /s/aiboux/mypage/subscriptions meta description should explain purchase/search/support intent

expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 45
Received:    41
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - navigation "ページ内ショートカット" [ref=e2]:
    - link "本文へスキップ" [active] [ref=e3] [cursor=pointer]:
      - /url: "#storefront-main"
    - link "商品検索へ移動" [ref=e4] [cursor=pointer]:
      - /url: "#storefront-search"
    - link "フッターの主要リンクへ移動" [ref=e5] [cursor=pointer]:
      - /url: "#storefront-footer"
  - banner "ストアヘッダー" [ref=e6]:
    - generic [ref=e7]:
      - generic [ref=e8]: "お届け先: 東京都 千代田区"
      - generic [ref=e9]: 送料無料は ¥2,000
      - generic [ref=e10]:
        - generic [ref=e11]: ヘルプ・サポート
        - generic [ref=e12]: お知らせ
    - generic [ref=e13]:
      - link "株式会社雪花 公式ストア" [ref=e14] [cursor=pointer]:
        - /url: /s/aiboux/
      - search "ストア内商品検索" [ref=e15]:
        - searchbox "キーワード・商品名・ブランド名で検索" [ref=e16]
        - button "商品を検索" [ref=e17]:
          - img [ref=e18]
      - link "カート" [ref=e21] [cursor=pointer]:
        - /url: /s/aiboux/cart
    - navigation "ストアカテゴリナビ" [ref=e22]:
      - link "すべてのカテゴリー" [ref=e23] [cursor=pointer]:
        - /url: /s/aiboux/categories
      - link "食品・お菓子" [ref=e24] [cursor=pointer]:
        - /url: /s/aiboux/products?category=food-drink
      - link "日用品" [ref=e25] [cursor=pointer]:
        - /url: /s/aiboux/products?category=daily-goods
      - link "キッチン用品" [ref=e26] [cursor=pointer]:
        - /url: /s/aiboux/products?category=kitchen
      - link "ギフト" [ref=e27] [cursor=pointer]:
        - /url: /s/aiboux/products?category=gift
      - link "ビューティー" [ref=e28] [cursor=pointer]:
        - /url: /s/aiboux/products?category=beauty
      - link "ペット用品" [ref=e29] [cursor=pointer]:
        - /url: /s/aiboux/products?category=pet
      - link "スポーツ・アウトドア" [ref=e30] [cursor=pointer]:
        - /url: /s/aiboux/products?category=sports-outdoor
      - link "本・文具" [ref=e31] [cursor=pointer]:
        - /url: /s/aiboux/products?category=books-stationery
      - link "セール" [ref=e32] [cursor=pointer]:
        - /url: /s/aiboux/products?category=sale
      - link "ランキング" [ref=e33] [cursor=pointer]:
        - /url: /s/aiboux/products?category=ranking
  - main [ref=e34]:
    - generic [ref=e35]:
      - navigation "パンくずリスト" [ref=e36]:
        - generic [ref=e37]: 現在地
        - link "TOP" [ref=e39] [cursor=pointer]:
          - /url: /s/aiboux/
        - generic [ref=e40]:
          - generic [ref=e41]: /
          - generic [ref=e42]: 定期購入
      - navigation "パンくず関連リンク" [ref=e43]:
        - link "マイページ" [ref=e44] [cursor=pointer]:
          - /url: /s/aiboux/mypage
          - generic [ref=e45]: マイページ
        - link "商品一覧" [ref=e46] [cursor=pointer]:
          - /url: /s/aiboux/products
          - generic [ref=e47]: 商品一覧
        - link "FAQ" [ref=e48] [cursor=pointer]:
          - /url: /s/aiboux/faq
          - generic [ref=e49]: FAQ
        - link "問い合わせ" [ref=e50] [cursor=pointer]:
          - /url: /s/aiboux/contact
          - generic [ref=e51]: 問い合わせ
    - region "定期購入" [ref=e52]:
      - generic [ref=e53]:
        - generic [ref=e54]:
          - paragraph [ref=e55]: 株式会社雪花 公式ストア
          - heading "定期購入" [level=1] [ref=e56]
          - paragraph [ref=e57]: 定期購入、次回配送予定、一時停止、スキップ、解約の状態と手続き導線を確認できます。
        - navigation "定期購入 の主要導線" [ref=e58]:
          - link "マイページ" [ref=e59] [cursor=pointer]:
            - /url: /s/aiboux/mypage
            - generic [ref=e60]: マイページ
          - link "商品一覧" [ref=e61] [cursor=pointer]:
            - /url: /s/aiboux/products
            - generic [ref=e62]: 商品一覧
          - link "問い合わせ" [ref=e63] [cursor=pointer]:
            - /url: /s/aiboux/contact
            - generic [ref=e64]: 問い合わせ
    - generic [ref=e65]:
      - generic [ref=e66]:
        - heading "定期購入" [level=2] [ref=e67]
        - paragraph [ref=e68]: 次回配送、スキップ、一時停止、解約条件を確認するページです。定期購入の申込み受付は現在準備中です。
      - generic [ref=e69]:
        - generic [ref=e70]: 定期購入は準備中です
        - paragraph [ref=e71]: 現在は定期購入の申込み受付前です。通常購入の閲覧とカート操作は利用できます。
        - generic [ref=e72]:
          - generic [ref=e73]:
            - text: スキップ
            - text: 契約作成後に次回配送をスキップできます。
          - generic [ref=e74]:
            - text: 一時停止
            - text: 契約状態がactiveの場合に停止できます。
          - generic [ref=e75]:
            - text: 解約
            - text: 最低継続回数などの条件を確認して解約します。
      - generic [ref=e76]:
        - generic [ref=e77]:
          - heading "定期購入に向く商品候補" [level=3] [ref=e78]
          - link "すべて見る" [ref=e79] [cursor=pointer]:
            - /url: /s/aiboux/products
        - generic [ref=e80]:
          - article [ref=e81]:
            - link "雪花セレクト ドリップコーヒー 20袋の商品詳細を見る" [ref=e82] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-coffee
              - img "雪花セレクト ドリップコーヒー 20袋 商品画像" [ref=e83]
            - link "コーヒー・お茶" [ref=e84] [cursor=pointer]:
              - /url: /s/aiboux/products?category=coffee-tea
            - link "雪花セレクト ドリップコーヒー 20袋" [ref=e85] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-coffee
            - generic "評価 4.4、レビュー 128件" [ref=e86]:
              - generic [ref=e87]: ★★★★★
              - generic [ref=e88]: (128)
            - generic [ref=e89]: ¥1,980 税込
            - link "商品詳細で確認" [ref=e90] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-coffee
          - article [ref=e91]:
            - link "軽量ステンレスボトル 500mlの商品詳細を見る" [ref=e92] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-bottle
              - img "軽量ステンレスボトル 500ml 商品画像" [ref=e93]
            - link "キッチン用品" [ref=e94] [cursor=pointer]:
              - /url: /s/aiboux/products?category=kitchen
            - link "軽量ステンレスボトル 500ml" [ref=e95] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-bottle
            - generic "評価 4.5、レビュー 159件" [ref=e96]:
              - generic [ref=e97]: ★★★★★
              - generic [ref=e98]: (159)
            - generic [ref=e99]: ¥2,480 税込
            - link "商品詳細で確認" [ref=e100] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-bottle
          - article [ref=e101]:
            - link "雪花セレクト ギフトタオル 2枚セットの商品詳細を見る" [ref=e102] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-towel
              - img "雪花セレクト ギフトタオル 2枚セット 商品画像" [ref=e103]
            - link "タオル・寝具" [ref=e104] [cursor=pointer]:
              - /url: /s/aiboux/products?category=towels
            - link "雪花セレクト ギフトタオル 2枚セット" [ref=e105] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-towel
            - generic "評価 4.6、レビュー 190件" [ref=e106]:
              - generic [ref=e107]: ★★★★★
              - generic [ref=e108]: (190)
            - generic [ref=e109]: ¥2,980 税込
            - link "商品詳細で確認" [ref=e110] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-towel
          - article [ref=e111]:
            - link "季節のギフトボックスの商品詳細を見る" [ref=e112] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-gift
              - img "季節のギフトボックス 商品画像" [ref=e113]
            - link "ギフト" [ref=e114] [cursor=pointer]:
              - /url: /s/aiboux/products?category=gift
            - link "季節のギフトボックス" [ref=e115] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-gift
            - generic "評価 4.7、レビュー 221件" [ref=e116]:
              - generic [ref=e117]: ★★★★★
              - generic [ref=e118]: (221)
            - generic [ref=e119]: ¥5,980 税込
            - link "商品詳細で確認" [ref=e120] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-gift
          - article [ref=e121]:
            - link "キッチン保存容器 6点セットの商品詳細を見る" [ref=e122] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-storage
              - img "キッチン保存容器 6点セット 商品画像" [ref=e123]
            - link "キッチン用品" [ref=e124] [cursor=pointer]:
              - /url: /s/aiboux/products?category=kitchen
            - link "キッチン保存容器 6点セット" [ref=e125] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-storage
            - generic "評価 4.8、レビュー 252件" [ref=e126]:
              - generic [ref=e127]: ★★★★★
              - generic [ref=e128]: (252)
            - generic [ref=e129]: ¥3,280 税込
            - link "商品詳細で確認" [ref=e130] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-storage
  - contentinfo [ref=e131]:
    - link "ページ上部へ戻る" [ref=e132] [cursor=pointer]:
      - /url: "#top"
    - generic [ref=e133]:
      - generic [ref=e134]:
        - heading "税込価格" [level=2] [ref=e135]
        - paragraph [ref=e136]: 商品価格は税込表示で統一します。
      - generic [ref=e137]:
        - heading "配送・返品" [level=2] [ref=e138]
        - paragraph [ref=e139]: 配送予定、返品条件、問い合わせ先を各ページから確認できます。
      - generic [ref=e140]:
        - heading "決済状態" [level=2] [ref=e141]
        - paragraph [ref=e142]: オンライン決済準備中は注文確定表示を出さず、準備中として表示します。
      - generic [ref=e143]:
        - heading "定期購入" [level=2] [ref=e144]
        - paragraph [ref=e145]: 定期購入は受付開始まで準備中として表示します。
    - generic [ref=e146]:
      - navigation "お買い物" [ref=e147]:
        - heading "お買い物" [level=2] [ref=e148]
        - link "商品一覧" [ref=e149] [cursor=pointer]:
          - /url: /s/aiboux/products
        - link "カテゴリ" [ref=e150] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "タイムセール" [ref=e151] [cursor=pointer]:
          - /url: /s/aiboux/products?category=sale
        - link "売れ筋ランキング" [ref=e152] [cursor=pointer]:
          - /url: /s/aiboux/products?category=ranking
        - link "お気に入り" [ref=e153] [cursor=pointer]:
          - /url: /s/aiboux/favorites
      - navigation "アカウント" [ref=e154]:
        - heading "アカウント" [level=2] [ref=e155]
        - link "マイページ" [ref=e156] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "注文履歴" [ref=e157] [cursor=pointer]:
          - /url: /s/aiboux/orders
        - link "定期購入" [ref=e158] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
        - link "ログイン" [ref=e159] [cursor=pointer]:
          - /url: /s/aiboux/login
      - navigation "サポート" [ref=e160]:
        - heading "サポート" [level=2] [ref=e161]
        - link "問い合わせ" [ref=e162] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e163] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "配送について" [ref=e164] [cursor=pointer]:
          - /url: /s/aiboux/shipping
        - link "返品について" [ref=e165] [cursor=pointer]:
          - /url: /s/aiboux/returns
      - navigation "ストア情報" [ref=e166]:
        - heading "ストア情報" [level=2] [ref=e167]
        - link "特定商取引法" [ref=e168] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシーポリシー" [ref=e169] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "カート" [ref=e170] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e171] [cursor=pointer]:
          - /url: /s/aiboux/checkout
    - region "フッター主要リンク" [ref=e172]:
      - generic [ref=e173]:
        - generic [ref=e174]:
          - generic [ref=e175]:
            - heading "ストア内リンクをまとめて確認" [level=2] [ref=e176]
            - paragraph [ref=e177]: 商品、カテゴリ、注文、配送、返品、定期購入、問い合わせまで、必要なページへすぐ移動できます。
          - generic [ref=e178]: ストア主要リンク
        - generic [ref=e179]:
          - link "TOPページ" [ref=e180] [cursor=pointer]:
            - /url: /s/aiboux/
          - link "商品一覧" [ref=e181] [cursor=pointer]:
            - /url: /s/aiboux/products
          - link "カテゴリ一覧" [ref=e182] [cursor=pointer]:
            - /url: /s/aiboux/categories
          - link "食品・飲料" [ref=e183] [cursor=pointer]:
            - /url: /s/aiboux/products?category=food-drink
          - link "コーヒー・お茶" [ref=e184] [cursor=pointer]:
            - /url: /s/aiboux/products?category=coffee-tea
          - link "キッチン用品" [ref=e185] [cursor=pointer]:
            - /url: /s/aiboux/products?category=kitchen
          - link "日用品" [ref=e186] [cursor=pointer]:
            - /url: /s/aiboux/products?category=daily-goods
          - link "ギフト" [ref=e187] [cursor=pointer]:
            - /url: /s/aiboux/products?category=gift
          - link "タイムセール" [ref=e188] [cursor=pointer]:
            - /url: /s/aiboux/products?category=sale
          - link "売れ筋ランキング" [ref=e189] [cursor=pointer]:
            - /url: /s/aiboux/products?category=ranking
          - link "カート" [ref=e190] [cursor=pointer]:
            - /url: /s/aiboux/cart
          - link "チェックアウト" [ref=e191] [cursor=pointer]:
            - /url: /s/aiboux/checkout
          - link "マイページ" [ref=e192] [cursor=pointer]:
            - /url: /s/aiboux/mypage
          - link "注文履歴" [ref=e193] [cursor=pointer]:
            - /url: /s/aiboux/orders
          - link "お気に入り" [ref=e194] [cursor=pointer]:
            - /url: /s/aiboux/favorites
          - link "定期購入" [ref=e195] [cursor=pointer]:
            - /url: /s/aiboux/mypage/subscriptions
          - link "問い合わせ" [ref=e196] [cursor=pointer]:
            - /url: /s/aiboux/contact
          - link "よくある質問" [ref=e197] [cursor=pointer]:
            - /url: /s/aiboux/faq
          - link "配送について" [ref=e198] [cursor=pointer]:
            - /url: /s/aiboux/shipping
          - link "返品について" [ref=e199] [cursor=pointer]:
            - /url: /s/aiboux/returns
          - link "特定商取引法" [ref=e200] [cursor=pointer]:
            - /url: /s/aiboux/legal
          - link "プライバシーポリシー" [ref=e201] [cursor=pointer]:
            - /url: /s/aiboux/privacy
    - generic [ref=e203]:
      - generic [ref=e204]:
        - generic [ref=e205]: 株式会社雪花 公式ストア
        - paragraph [ref=e206]: 注文、配送、返品、定期購入、問い合わせまで同じストア導線で確認できます。オンライン決済準備中は注文確定しません。
      - navigation "ストア基本情報" [ref=e207]:
        - link "特商法" [ref=e208] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシー" [ref=e209] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "問い合わせ" [ref=e210] [cursor=pointer]:
          - /url: /s/aiboux/contact
```

# Test source

```ts
  188 |         }
  189 |         if (target.name !== "shop-top") {
  190 |           const pageHeader = page.getByTestId("storefront-page-header");
  191 |           await expect(pageHeader, `${target.path} should include the shared page header`).toBeVisible();
  192 |           await expect(pageHeader.locator("h1"), `${target.path} shared page header should own the page h1`).toHaveCount(1);
  193 |           expect(await pageHeader.locator("a").count(), `${target.path} shared page header should expose crawlable action links`).toBeGreaterThanOrEqual(2);
  194 |           expect(await pageHeader.locator('[itemtype="https://schema.org/SiteNavigationElement"]').count(), `${target.path} page header should expose SiteNavigationElement microdata`).toBeGreaterThanOrEqual(1);
  195 |           const secondaryLinkClass = await pageHeader.locator("a").last().getAttribute("class");
  196 |           expect(secondaryLinkClass ?? "", `${target.path} page header secondary links should be visibly blue`).toContain("text-blue-700");
  197 |         }
  198 | 
  199 |         if (sharedProductCardPageNames.has(target.name)) {
  200 |           const cards = page.getByTestId("storefront-product-card");
  201 |           expect(await cards.count(), `${target.path} should use the shared storefront product card component`).toBeGreaterThanOrEqual(
  202 |             target.name === "shop-favorites" ? 10 : 5,
  203 |           );
  204 |           const firstCard = cards.first();
  205 |           await expect(firstCard, `${target.path} shared product card should expose Product microdata`).toHaveAttribute(
  206 |             "itemtype",
  207 |             "https://schema.org/Product",
  208 |           );
  209 |           await expect(
  210 |             firstCard.locator('[itemtype="https://schema.org/Offer"]'),
  211 |             `${target.path} shared product card should expose Offer microdata`,
  212 |           ).toHaveCount(1);
  213 |           await expect(
  214 |             firstCard.getByTestId("storefront-product-card-link"),
  215 |             `${target.path} shared product card should link to product detail`,
  216 |           ).toHaveAttribute("href", /\/s\/aiboux\/product\//);
  217 |           await expect(
  218 |             firstCard.getByTestId("storefront-product-card-category"),
  219 |             `${target.path} shared product card category should be crawlable`,
  220 |           ).toHaveAttribute("href", /\/s\/aiboux\/products\?category=/);
  221 |           expect(
  222 |             (await firstCard.getByTestId("storefront-product-card-title").getAttribute("class")) ?? "",
  223 |             `${target.path} shared product card title should be visibly link-colored`,
  224 |           ).toContain("text-blue-800");
  225 |           expect(
  226 |             (await firstCard.getByTestId("storefront-product-card-image").getAttribute("alt")) ?? "",
  227 |             `${target.path} shared product card image alt should describe the product`,
  228 |           ).toMatch(/商品画像/);
  229 |         }
  230 | 
  231 |         const jsonLdText = await page.locator('script[type="application/ld+json"]').first().textContent();
  232 |         const jsonLd = JSON.parse(jsonLdText || "{}");
  233 |         expect(jsonLd["@context"], `${target.path} structured data should use a single top-level schema.org context`).toBe("https://schema.org");
  234 |         expect(Array.isArray(jsonLd["@graph"]), `${target.path} structured data should be emitted as a connected @graph`).toBe(true);
  235 |         expect(jsonLd["@graph"].length, `${target.path} @graph should contain several connected storefront entities`).toBeGreaterThanOrEqual(5);
  236 |         expect((jsonLdText?.match(/"@context"/g) ?? []).length, `${target.path} should not repeat @context inside graph nodes`).toBe(1);
  237 |         expect(jsonLdText ?? "", `${target.path} should include BreadcrumbList JSON-LD`).toContain("BreadcrumbList");
  238 |         expect(jsonLdText ?? "", `${target.path} should include WebSite JSON-LD`).toContain("WebSite");
  239 |         expect(jsonLdText ?? "", `${target.path} should include Organization JSON-LD`).toContain("Organization");
  240 |         expect(jsonLdText ?? "", `${target.path} should identify the storefront as OnlineStore JSON-LD`).toContain("OnlineStore");
  241 |         expect(jsonLdText ?? "", `${target.path} should expose a stable store entity id`).toContain("#store");
  242 |         expect(jsonLdText ?? "", `${target.path} should expose a stable website entity id`).toContain("#website");
  243 |         expect(jsonLdText ?? "", `${target.path} WebPage should be linked to the WebSite entity`).toContain("isPartOf");
  244 |         expect(jsonLdText ?? "", `${target.path} WebPage should declare the storefront publisher`).toContain("publisher");
  245 |         expect(jsonLdText ?? "", `${target.path} WebPage should describe the storefront entity it is about`).toContain("about");
  246 |         expect(jsonLdText ?? "", `${target.path} should include merchant return policy JSON-LD`).toContain("MerchantReturnPolicy");
  247 |         expect(jsonLdText ?? "", `${target.path} should include shared site navigation JSON-LD`).toContain("SiteNavigationElement");
  248 |         expect(jsonLdText ?? "", `${target.path} should expose WebSite SearchAction matching storefront search`).toContain("SearchAction");
  249 |         expect(jsonLdText ?? "", `${target.path} SearchAction should target the products query URL`).toContain("products?q={search_term_string}");
  250 |         expect(jsonLdText ?? "", `${target.path} should expose a page entity JSON-LD`).toMatch(/WebPage|ContactPage|FAQPage|ItemPage|CollectionPage/);
  251 |         if (["shop-products-page", "shop-categories-page", "shop-favorites"].includes(target.name)) {
  252 |           expect(jsonLdText ?? "", `${target.path} discovery page should expose CollectionPage JSON-LD`).toContain("CollectionPage");
  253 |         }
  254 |         if (target.name === "shop-top") {
  255 |           expect(jsonLdText ?? "", `${target.path} should expose TOP product discovery ItemList JSON-LD`).toContain("ItemList");
  256 |           expect(jsonLdText ?? "", `${target.path} TOP ItemList should expose a stable entity id`).toContain("#itemlist");
  257 |           expect(jsonLdText ?? "", `${target.path} TOP ItemList should declare numberOfItems`).toContain("numberOfItems");
  258 |           expect(jsonLdText ?? "", `${target.path} TOP ItemList should link back to the WebPage entity`).toContain("mainEntityOfPage");
  259 |           expect(jsonLdText ?? "", `${target.path} TOP navigation graph should include breadcrumb support links`).toContain("タイムセール");
  260 |           expect(jsonLdText ?? "", `${target.path} TOP navigation graph should include page quality links`).toContain("配送条件");
  261 |           expect(jsonLdText ?? "", `${target.path} TOP navigation graph should include buying guide links`).toContain("送料と配送を見る");
  262 |           expect(jsonLdText ?? "", `${target.path} TOP navigation graph should include action map links`).toContain("おすすめ商品へ");
  263 |         }
  264 |         if (target.name === "shop-faq-page") {
  265 |           expect(jsonLdText ?? "", `${target.path} should expose FAQPage JSON-LD`).toContain("FAQPage");
  266 |           expect(jsonLdText ?? "", `${target.path} should expose FAQ question entities`).toContain("Question");
  267 |           expect(jsonLdText ?? "", `${target.path} should expose FAQ accepted answers`).toContain("acceptedAnswer");
  268 |         }
  269 |         if (target.name === "shop-contact-page") {
  270 |           expect(jsonLdText ?? "", `${target.path} should expose ContactPage JSON-LD`).toContain("ContactPage");
  271 |         }
  272 |         expect(jsonLdText ?? "", `${target.path} should include page-specific ItemList JSON-LD`).toContain("ItemList");
  273 |         expect(jsonLdText ?? "", `${target.path} ItemList should expose a stable entity id`).toContain("#itemlist");
  274 |         expect(jsonLdText ?? "", `${target.path} ItemList should declare numberOfItems`).toContain("numberOfItems");
  275 |         expect(jsonLdText ?? "", `${target.path} ItemList should link back to the WebPage entity`).toContain("mainEntityOfPage");
  276 | 
  277 |         const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  278 |         expect(canonical, `${target.path} should include a self-referencing canonical URL`).toBeTruthy();
  279 |         expect(canonical ?? "", `${target.path} canonical should point at shop.aiboux.com tenant URL`).toContain(`https://shop.aiboux.com${target.path}`);
  280 | 
  281 |         const titleText = await page.title();
  282 |         expect(titleText.length, `${target.path} should expose a useful SEO title`).toBeGreaterThanOrEqual(12);
  283 |         expect(titleText.length, `${target.path} SEO title should not be overly long`).toBeLessThanOrEqual(78);
  284 |         expect(titleText, `${target.path} title should not use thin placeholder copy`).not.toMatch(/公開中の商品を表示|AIBOUX Storeの公開ページ|ストアページ/);
  285 | 
  286 |         const metaDescription = await page.locator('meta[name="description"]').getAttribute("content");
  287 |         expect(metaDescription, `${target.path} should include meta description`).toBeTruthy();
> 288 |         expect(metaDescription?.length ?? 0, `${target.path} meta description should explain purchase/search/support intent`).toBeGreaterThanOrEqual(45);
      |                                                                                                                               ^ Error: /s/aiboux/mypage/subscriptions meta description should explain purchase/search/support intent
  289 |         expect(metaDescription?.length ?? 0, `${target.path} meta description should remain snippet-safe`).toBeLessThanOrEqual(155);
  290 |         expect(metaDescription ?? "", `${target.path} description should not use thin placeholder copy`).not.toMatch(/公開中の商品を表示|AIBOUX Storeの公開ページ|ストアへの問い合わせを受け付けます/);
  291 | 
  292 |         const robots = await page.locator('meta[name="robots"]').getAttribute("content");
  293 |         if (noIndexPublicPageNames.has(target.name)) {
  294 |           expect(robots ?? "", `${target.path} transactional/account page should not be indexed`).toContain("noindex");
  295 |           expect(robots ?? "", `${target.path} should still allow link following`).toContain("follow");
  296 |         } else {
  297 |           expect(robots ?? "", `${target.path} discovery/content page should be indexable`).toContain("index");
  298 |           expect(robots ?? "", `${target.path} should allow large image previews`).toContain("max-image-preview:large");
  299 |         }
  300 | 
  301 |         await expect(page.locator('meta[property="og:title"]'), `${target.path} should include Open Graph title`).toHaveCount(1);
  302 |         await expect(page.locator('meta[property="og:description"]'), `${target.path} should include Open Graph description`).toHaveCount(1);
  303 |         await expect(page.locator('meta[property="og:url"]'), `${target.path} should include Open Graph URL`).toHaveCount(1);
  304 |         await expect(page.locator('meta[property="og:image"]'), `${target.path} should include Open Graph image`).toHaveCount(1);
  305 |         await expect(page.locator('meta[property="og:url"]'), `${target.path} Open Graph URL should match canonical`).toHaveAttribute("content", canonical ?? "");
  306 |         const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  307 |         expect(ogImage ?? "", `${target.path} Open Graph image should be absolute`).toMatch(/^https:\/\/.+/);
  308 |         await expect(page.locator('meta[name="twitter:card"]'), `${target.path} should include Twitter Card metadata`).toHaveCount(1);
  309 |         await expect(page.locator('meta[name="twitter:card"]'), `${target.path} should use large image Twitter Card`).toHaveAttribute("content", "summary_large_image");
  310 |         await expect(page.locator('meta[name="twitter:description"]'), `${target.path} Twitter description should match meta description`).toHaveAttribute("content", metaDescription ?? "");
  311 |         await expect(page.locator('link[rel="alternate"][hreflang="ja-JP"]'), `${target.path} should include ja-JP alternate link`).toHaveCount(1);
  312 |         await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'), `${target.path} should include x-default alternate link`).toHaveCount(1);
  313 |         await expect(page.locator("h1"), `${target.path} should expose one primary heading`).toHaveCount(1);
  314 | 
  315 |         const bodyBox = await page.locator("body").boundingBox();
  316 |         expect(bodyBox?.width ?? 0, `${target.path} should render a styled page body`).toBeGreaterThan(300);
  317 | 
  318 |         if (target.name === "shop-top" || viewport.suffix === "1980") {
  319 |           await saveScreenshot(page, `${target.name}-${viewport.suffix}.png`);
  320 |         }
  321 |       }
  322 |     });
  323 |   }
  324 | 
  325 |   test("admin pages render and keep demo values absent", async ({ page, request }) => {
  326 |     await page.setViewportSize({ width: 1980, height: 1080 });
  327 |     for (const target of adminUrls) {
  328 |       const response = await request.get(target.path, { headers: { "cache-control": "no-cache" } });
  329 |       expect(response.status(), target.path).toBe(200);
  330 |       expect(response.headers()["content-type"] ?? "", target.path).toContain("text/html");
  331 | 
  332 |       await page.goto(`${target.path}?adminCrawl=${Date.now()}`, { waitUntil: "networkidle" });
  333 |       await expect(page.locator("body")).not.toContainText("2024/05");
  334 |       await expect(page.locator("body")).not.toContainText("山田 太郎");
  335 |       await expect(page.locator("body")).not.toContainText("#10085");
  336 |       await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  337 | 
  338 |       if (target.name === "shop-admin-design" || target.name === "shop-admin-subscriptions") {
  339 |         await saveScreenshot(page, `${target.name}.png`);
  340 |       }
  341 |     }
  342 |   });
  343 | 
  344 |   test("public storefront internal links resolve to implemented tenant pages", async ({ request }) => {
  345 |     const discovered = new Set<string>();
  346 | 
  347 |     for (const target of publicUrls) {
  348 |       const response = await request.get(target.path, { headers: { "cache-control": "no-cache" } });
  349 |       expect(response.status(), target.path).toBe(200);
  350 |       const html = await response.text();
  351 | 
  352 |       for (const match of html.matchAll(/href="([^"]+)"/g)) {
  353 |         const href = match[1];
  354 |         if (
  355 |           !href ||
  356 |           href.startsWith("#") ||
  357 |           href.startsWith("javascript:") ||
  358 |           href.startsWith("mailto:") ||
  359 |           href.startsWith("tel:")
  360 |         ) {
  361 |           continue;
  362 |         }
  363 | 
  364 |         const url = new URL(href, "https://shop.aiboux.com");
  365 |         if (url.hostname === "shop.aiboux.com" && url.pathname.startsWith("/s/aiboux")) {
  366 |           discovered.add(url.pathname);
  367 |         }
  368 |       }
  369 |     }
  370 | 
  371 |     expect(discovered.size, "tenant storefront should expose internal links for account, commerce, and policy pages").toBeGreaterThan(12);
  372 | 
  373 |     for (const pathname of [...discovered].sort()) {
  374 |       const linked = await request.get(pathname, { headers: { "cache-control": "no-cache" } });
  375 |       expect(linked.status(), pathname).toBe(200);
  376 |       const body = await linked.text();
  377 |       expect(body, pathname).not.toContain("ページが見つかりません");
  378 |       expect(body, pathname).not.toContain("Not Found");
  379 |     }
  380 |   });
  381 | 
  382 |   test("shop robots and sitemap expose only indexable tenant discovery pages", async ({ request }) => {
  383 |     const robots = await request.get("/robots.txt", { headers: { host: "shop.aiboux.com", "cache-control": "no-cache" } });
  384 |     expect(robots.status(), "robots.txt should be public").toBe(200);
  385 |     const robotsText = await robots.text();
  386 |     expect(robotsText).toContain("Sitemap: https://shop.aiboux.com/sitemap.xml");
  387 |     expect(robotsText).toContain("Disallow: /s/aiboux/cart");
  388 |     expect(robotsText).toContain("Disallow: /s/aiboux/checkout");
```