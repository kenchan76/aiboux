# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-public-crawl.spec.ts >> AIBOUX Shop 5H sprint public crawl >> public storefront pages render with styled HTML at 1365
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
        - generic [ref=e16]: すべてのカテゴリ
        - searchbox "キーワード・商品名・ブランド名で検索" [ref=e17]
        - button "商品を検索" [ref=e18]:
          - img [ref=e19]
      - link "アカウント マイページ" [ref=e22] [cursor=pointer]:
        - /url: /s/aiboux/mypage
        - text: アカウント
        - text: マイページ
      - link "注文履歴" [ref=e23] [cursor=pointer]:
        - /url: /s/aiboux/orders
      - link "カート" [ref=e24] [cursor=pointer]:
        - /url: /s/aiboux/cart
    - navigation "ストアカテゴリナビ" [ref=e25]:
      - link "すべてのカテゴリー" [ref=e26] [cursor=pointer]:
        - /url: /s/aiboux/categories
      - link "食品・お菓子" [ref=e27] [cursor=pointer]:
        - /url: /s/aiboux/products?category=food-drink
      - link "日用品" [ref=e28] [cursor=pointer]:
        - /url: /s/aiboux/products?category=daily-goods
      - link "キッチン用品" [ref=e29] [cursor=pointer]:
        - /url: /s/aiboux/products?category=kitchen
      - link "ギフト" [ref=e30] [cursor=pointer]:
        - /url: /s/aiboux/products?category=gift
      - link "ビューティー" [ref=e31] [cursor=pointer]:
        - /url: /s/aiboux/products?category=beauty
      - link "ペット用品" [ref=e32] [cursor=pointer]:
        - /url: /s/aiboux/products?category=pet
      - link "スポーツ・アウトドア" [ref=e33] [cursor=pointer]:
        - /url: /s/aiboux/products?category=sports-outdoor
      - link "本・文具" [ref=e34] [cursor=pointer]:
        - /url: /s/aiboux/products?category=books-stationery
      - link "セール" [ref=e35] [cursor=pointer]:
        - /url: /s/aiboux/products?category=sale
      - link "ランキング" [ref=e36] [cursor=pointer]:
        - /url: /s/aiboux/products?category=ranking
  - main [ref=e37]:
    - generic [ref=e38]:
      - navigation "パンくずリスト" [ref=e39]:
        - generic [ref=e40]: 現在地
        - link "TOP" [ref=e42] [cursor=pointer]:
          - /url: /s/aiboux/
        - generic [ref=e43]:
          - generic [ref=e44]: /
          - generic [ref=e45]: 定期購入
      - navigation "パンくず関連リンク" [ref=e46]:
        - link "マイページ" [ref=e47] [cursor=pointer]:
          - /url: /s/aiboux/mypage
          - generic [ref=e48]: マイページ
        - link "商品一覧" [ref=e49] [cursor=pointer]:
          - /url: /s/aiboux/products
          - generic [ref=e50]: 商品一覧
        - link "FAQ" [ref=e51] [cursor=pointer]:
          - /url: /s/aiboux/faq
          - generic [ref=e52]: FAQ
        - link "問い合わせ" [ref=e53] [cursor=pointer]:
          - /url: /s/aiboux/contact
          - generic [ref=e54]: 問い合わせ
    - region "定期購入" [ref=e55]:
      - generic [ref=e56]:
        - generic [ref=e57]:
          - paragraph [ref=e58]: 株式会社雪花 公式ストア
          - heading "定期購入" [level=1] [ref=e59]
          - paragraph [ref=e60]: 定期購入、次回配送予定、一時停止、スキップ、解約の状態と手続き導線を確認できます。
        - navigation "定期購入 の主要導線" [ref=e61]:
          - link "マイページ" [ref=e62] [cursor=pointer]:
            - /url: /s/aiboux/mypage
            - generic [ref=e63]: マイページ
          - link "商品一覧" [ref=e64] [cursor=pointer]:
            - /url: /s/aiboux/products
            - generic [ref=e65]: 商品一覧
          - link "問い合わせ" [ref=e66] [cursor=pointer]:
            - /url: /s/aiboux/contact
            - generic [ref=e67]: 問い合わせ
    - generic [ref=e68]:
      - generic [ref=e69]:
        - heading "定期購入" [level=2] [ref=e70]
        - paragraph [ref=e71]: 次回配送、スキップ、一時停止、解約条件を確認するページです。定期購入の申込み受付は現在準備中です。
      - generic [ref=e72]:
        - generic [ref=e73]: 定期購入は準備中です
        - paragraph [ref=e74]: 現在は定期購入の申込み受付前です。通常購入の閲覧とカート操作は利用できます。
        - generic [ref=e75]:
          - generic [ref=e76]:
            - text: スキップ
            - text: 契約作成後に次回配送をスキップできます。
          - generic [ref=e77]:
            - text: 一時停止
            - text: 契約状態がactiveの場合に停止できます。
          - generic [ref=e78]:
            - text: 解約
            - text: 最低継続回数などの条件を確認して解約します。
      - generic [ref=e79]:
        - generic [ref=e80]:
          - heading "定期購入に向く商品候補" [level=3] [ref=e81]
          - link "すべて見る" [ref=e82] [cursor=pointer]:
            - /url: /s/aiboux/products
        - generic [ref=e83]:
          - article [ref=e84]:
            - link "雪花セレクト ドリップコーヒー 20袋の商品詳細を見る" [ref=e85] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-coffee
              - img "雪花セレクト ドリップコーヒー 20袋 商品画像" [ref=e86]
            - link "コーヒー・お茶" [ref=e87] [cursor=pointer]:
              - /url: /s/aiboux/products?category=coffee-tea
            - link "雪花セレクト ドリップコーヒー 20袋" [ref=e88] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-coffee
            - generic "評価 4.4、レビュー 128件" [ref=e89]:
              - generic [ref=e90]: ★★★★★
              - generic [ref=e91]: (128)
            - generic [ref=e92]: ¥1,980 税込
            - link "商品詳細で確認" [ref=e93] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-coffee
          - article [ref=e94]:
            - link "軽量ステンレスボトル 500mlの商品詳細を見る" [ref=e95] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-bottle
              - img "軽量ステンレスボトル 500ml 商品画像" [ref=e96]
            - link "キッチン用品" [ref=e97] [cursor=pointer]:
              - /url: /s/aiboux/products?category=kitchen
            - link "軽量ステンレスボトル 500ml" [ref=e98] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-bottle
            - generic "評価 4.5、レビュー 159件" [ref=e99]:
              - generic [ref=e100]: ★★★★★
              - generic [ref=e101]: (159)
            - generic [ref=e102]: ¥2,480 税込
            - link "商品詳細で確認" [ref=e103] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-bottle
          - article [ref=e104]:
            - link "雪花セレクト ギフトタオル 2枚セットの商品詳細を見る" [ref=e105] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-towel
              - img "雪花セレクト ギフトタオル 2枚セット 商品画像" [ref=e106]
            - link "タオル・寝具" [ref=e107] [cursor=pointer]:
              - /url: /s/aiboux/products?category=towels
            - link "雪花セレクト ギフトタオル 2枚セット" [ref=e108] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-towel
            - generic "評価 4.6、レビュー 190件" [ref=e109]:
              - generic [ref=e110]: ★★★★★
              - generic [ref=e111]: (190)
            - generic [ref=e112]: ¥2,980 税込
            - link "商品詳細で確認" [ref=e113] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-towel
          - article [ref=e114]:
            - link "季節のギフトボックスの商品詳細を見る" [ref=e115] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-gift
              - img "季節のギフトボックス 商品画像" [ref=e116]
            - link "ギフト" [ref=e117] [cursor=pointer]:
              - /url: /s/aiboux/products?category=gift
            - link "季節のギフトボックス" [ref=e118] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-gift
            - generic "評価 4.7、レビュー 221件" [ref=e119]:
              - generic [ref=e120]: ★★★★★
              - generic [ref=e121]: (221)
            - generic [ref=e122]: ¥5,980 税込
            - link "商品詳細で確認" [ref=e123] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-gift
          - article [ref=e124]:
            - link "キッチン保存容器 6点セットの商品詳細を見る" [ref=e125] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-storage
              - img "キッチン保存容器 6点セット 商品画像" [ref=e126]
            - link "キッチン用品" [ref=e127] [cursor=pointer]:
              - /url: /s/aiboux/products?category=kitchen
            - link "キッチン保存容器 6点セット" [ref=e128] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-storage
            - generic "評価 4.8、レビュー 252件" [ref=e129]:
              - generic [ref=e130]: ★★★★★
              - generic [ref=e131]: (252)
            - generic [ref=e132]: ¥3,280 税込
            - link "商品詳細で確認" [ref=e133] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-storage
  - contentinfo [ref=e134]:
    - link "ページ上部へ戻る" [ref=e135] [cursor=pointer]:
      - /url: "#top"
    - generic [ref=e136]:
      - generic [ref=e137]:
        - heading "税込価格" [level=2] [ref=e138]
        - paragraph [ref=e139]: 商品価格は税込表示で統一します。
      - generic [ref=e140]:
        - heading "配送・返品" [level=2] [ref=e141]
        - paragraph [ref=e142]: 配送予定、返品条件、問い合わせ先を各ページから確認できます。
      - generic [ref=e143]:
        - heading "決済状態" [level=2] [ref=e144]
        - paragraph [ref=e145]: オンライン決済準備中は注文確定表示を出さず、準備中として表示します。
      - generic [ref=e146]:
        - heading "定期購入" [level=2] [ref=e147]
        - paragraph [ref=e148]: 定期購入は受付開始まで準備中として表示します。
    - generic [ref=e149]:
      - navigation "お買い物" [ref=e150]:
        - heading "お買い物" [level=2] [ref=e151]
        - link "商品一覧" [ref=e152] [cursor=pointer]:
          - /url: /s/aiboux/products
        - link "カテゴリ" [ref=e153] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "タイムセール" [ref=e154] [cursor=pointer]:
          - /url: /s/aiboux/products?category=sale
        - link "売れ筋ランキング" [ref=e155] [cursor=pointer]:
          - /url: /s/aiboux/products?category=ranking
        - link "お気に入り" [ref=e156] [cursor=pointer]:
          - /url: /s/aiboux/favorites
      - navigation "アカウント" [ref=e157]:
        - heading "アカウント" [level=2] [ref=e158]
        - link "マイページ" [ref=e159] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "注文履歴" [ref=e160] [cursor=pointer]:
          - /url: /s/aiboux/orders
        - link "定期購入" [ref=e161] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
        - link "ログイン" [ref=e162] [cursor=pointer]:
          - /url: /s/aiboux/login
      - navigation "サポート" [ref=e163]:
        - heading "サポート" [level=2] [ref=e164]
        - link "問い合わせ" [ref=e165] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e166] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "配送について" [ref=e167] [cursor=pointer]:
          - /url: /s/aiboux/shipping
        - link "返品について" [ref=e168] [cursor=pointer]:
          - /url: /s/aiboux/returns
      - navigation "ストア情報" [ref=e169]:
        - heading "ストア情報" [level=2] [ref=e170]
        - link "特定商取引法" [ref=e171] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシーポリシー" [ref=e172] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "カート" [ref=e173] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e174] [cursor=pointer]:
          - /url: /s/aiboux/checkout
    - region "フッター主要リンク" [ref=e175]:
      - generic [ref=e176]:
        - generic [ref=e177]:
          - generic [ref=e178]:
            - heading "ストア内リンクをまとめて確認" [level=2] [ref=e179]
            - paragraph [ref=e180]: 商品、カテゴリ、注文、配送、返品、定期購入、問い合わせまで、必要なページへすぐ移動できます。
          - generic [ref=e181]: ストア主要リンク
        - generic [ref=e182]:
          - link "TOPページ" [ref=e183] [cursor=pointer]:
            - /url: /s/aiboux/
          - link "商品一覧" [ref=e184] [cursor=pointer]:
            - /url: /s/aiboux/products
          - link "カテゴリ一覧" [ref=e185] [cursor=pointer]:
            - /url: /s/aiboux/categories
          - link "食品・飲料" [ref=e186] [cursor=pointer]:
            - /url: /s/aiboux/products?category=food-drink
          - link "コーヒー・お茶" [ref=e187] [cursor=pointer]:
            - /url: /s/aiboux/products?category=coffee-tea
          - link "キッチン用品" [ref=e188] [cursor=pointer]:
            - /url: /s/aiboux/products?category=kitchen
          - link "日用品" [ref=e189] [cursor=pointer]:
            - /url: /s/aiboux/products?category=daily-goods
          - link "ギフト" [ref=e190] [cursor=pointer]:
            - /url: /s/aiboux/products?category=gift
          - link "タイムセール" [ref=e191] [cursor=pointer]:
            - /url: /s/aiboux/products?category=sale
          - link "売れ筋ランキング" [ref=e192] [cursor=pointer]:
            - /url: /s/aiboux/products?category=ranking
          - link "カート" [ref=e193] [cursor=pointer]:
            - /url: /s/aiboux/cart
          - link "チェックアウト" [ref=e194] [cursor=pointer]:
            - /url: /s/aiboux/checkout
          - link "マイページ" [ref=e195] [cursor=pointer]:
            - /url: /s/aiboux/mypage
          - link "注文履歴" [ref=e196] [cursor=pointer]:
            - /url: /s/aiboux/orders
          - link "お気に入り" [ref=e197] [cursor=pointer]:
            - /url: /s/aiboux/favorites
          - link "定期購入" [ref=e198] [cursor=pointer]:
            - /url: /s/aiboux/mypage/subscriptions
          - link "問い合わせ" [ref=e199] [cursor=pointer]:
            - /url: /s/aiboux/contact
          - link "よくある質問" [ref=e200] [cursor=pointer]:
            - /url: /s/aiboux/faq
          - link "配送について" [ref=e201] [cursor=pointer]:
            - /url: /s/aiboux/shipping
          - link "返品について" [ref=e202] [cursor=pointer]:
            - /url: /s/aiboux/returns
          - link "特定商取引法" [ref=e203] [cursor=pointer]:
            - /url: /s/aiboux/legal
          - link "プライバシーポリシー" [ref=e204] [cursor=pointer]:
            - /url: /s/aiboux/privacy
    - generic [ref=e206]:
      - generic [ref=e207]:
        - generic [ref=e208]: 株式会社雪花 公式ストア
        - paragraph [ref=e209]: 注文、配送、返品、定期購入、問い合わせまで同じストア導線で確認できます。オンライン決済準備中は注文確定しません。
      - navigation "ストア基本情報" [ref=e210]:
        - link "特商法" [ref=e211] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシー" [ref=e212] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "問い合わせ" [ref=e213] [cursor=pointer]:
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