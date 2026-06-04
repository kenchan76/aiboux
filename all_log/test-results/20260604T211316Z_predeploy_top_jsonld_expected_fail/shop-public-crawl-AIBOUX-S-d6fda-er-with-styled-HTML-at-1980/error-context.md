# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-public-crawl.spec.ts >> AIBOUX Shop 5H sprint public crawl >> public storefront pages render with styled HTML at 1980
- Location: tests/shop-public-crawl.spec.ts:86:5

# Error details

```
Error: /s/aiboux/ TOP navigation graph should include buying guide links

expect(received).toContain(expected) // indexOf

Expected substring: "送料と配送を見る"
Received string:    "{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"TOP\",\"item\":\"https://shop.aiboux.com/s/aiboux/\"}]},{\"@type\":\"WebSite\",\"@id\":\"https://shop.aiboux.com/s/aiboux#website\",\"name\":\"株式会社雪花 公式ストア\",\"url\":\"https://shop.aiboux.com/s/aiboux/\",\"publisher\":{\"@id\":\"https://shop.aiboux.com/s/aiboux#store\"},\"potentialAction\":{\"@type\":\"SearchAction\",\"target\":\"https://shop.aiboux.com/s/aiboux/products?q={search_term_string}\",\"query-input\":\"required name=search_term_string\"}},{\"@type\":[\"Organization\",\"OnlineStore\"],\"@id\":\"https://shop.aiboux.com/s/aiboux#store\",\"name\":\"株式会社雪花 公式ストア\",\"url\":\"https://shop.aiboux.com/s/aiboux/\",\"contactPoint\":{\"@type\":\"ContactPoint\",\"contactType\":\"customer support\",\"email\":\"info@aiboux.com\",\"telephone\":\"03-0000-0000\",\"areaServed\":\"JP\",\"availableLanguage\":[\"ja\"]},\"hasMerchantReturnPolicy\":{\"@type\":\"MerchantReturnPolicy\",\"applicableCountry\":\"JP\",\"returnPolicyCategory\":\"https://schema.org/MerchantReturnFiniteReturnWindow\",\"merchantReturnDays\":7,\"returnMethod\":\"https://schema.org/ReturnByMail\",\"returnFees\":\"https://schema.org/ReturnFeesCustomerResponsibility\",\"merchantReturnLink\":\"https://shop.aiboux.com/s/aiboux/returns\"}},{\"@type\":\"ItemList\",\"@id\":\"https://shop.aiboux.com/s/aiboux/#itemlist\",\"name\":\"ストアTOPの商品導線\",\"url\":\"https://shop.aiboux.com/s/aiboux/\",\"numberOfItems\":3,\"mainEntityOfPage\":{\"@id\":\"https://shop.aiboux.com/s/aiboux/#webpage\"},\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"AIBOUX公開検証商品 4580000232621\",\"url\":\"https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4580000232621\",\"item\":{\"@type\":\"Product\",\"@id\":\"https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4580000232621#product\",\"name\":\"AIBOUX公開検証商品 4580000232621\",\"url\":\"https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4580000232621\"}},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"軽量ステンレスボトル\",\"url\":\"https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4901234567895\",\"item\":{\"@type\":\"Product\",\"@id\":\"https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4901234567895#product\",\"name\":\"軽量ステンレスボトル\",\"url\":\"https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4901234567895\"}},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"雪花セレクト ギフトタオル\",\"url\":\"https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4901234567818\",\"item\":{\"@type\":\"Product\",\"@id\":\"https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4901234567818#product\",\"name\":\"雪花セレクト ギフトタオル\",\"url\":\"https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4901234567818\"}}]},{\"@type\":\"WebPage\",\"@id\":\"https://shop.aiboux.com/s/aiboux/#webpage\",\"name\":\"株式会社雪花 公式ストア | AIBOUX Storefront\",\"description\":\"日用品、食品、ギフト、コーヒー、キッチン用品を価格、税込表示、レビュー、配送条件から比較できる公式ストアTOPです。\",\"url\":\"https://shop.aiboux.com/s/aiboux/\",\"inLanguage\":\"ja-JP\",\"isPartOf\":{\"@id\":\"https://shop.aiboux.com/s/aiboux#website\"},\"publisher\":{\"@id\":\"https://shop.aiboux.com/s/aiboux#store\"},\"about\":{\"@id\":\"https://shop.aiboux.com/s/aiboux#store\"},\"breadcrumb\":{\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"TOP\",\"item\":\"https://shop.aiboux.com/s/aiboux/\"}]}},{\"@type\":\"SiteNavigationElement\",\"name\":\"株式会社雪花 公式ストア 主要ナビゲーション\",\"url\":\"https://shop.aiboux.com/s/aiboux/\",\"hasPart\":[{\"@type\":\"WebPage\",\"name\":\"食品・お菓子\",\"url\":\"https://shop.aiboux.com/s/aiboux/products?category=food-drink\"},{\"@type\":\"WebPage\",\"name\":\"日用品\",\"url\":\"https://shop.aiboux.com/s/aiboux/products?category=daily-goods\"},{\"@type\":\"WebPage\",\"name\":\"キッチン用品\",\"url\":\"https://shop.aiboux.com/s/aiboux/products?category=kitchen\"},{\"@type\":\"WebPage\",\"name\":\"ギフト\",\"url\":\"https://shop.aiboux.com/s/aiboux/products?category=gift\"},{\"@type\":\"WebPage\",\"name\":\"ビューティー\",\"url\":\"https://shop.aiboux.com/s/aiboux/products?category=beauty\"},{\"@type\":\"WebPage\",\"name\":\"ペット用品\",\"url\":\"https://shop.aiboux.com/s/aiboux/products?category=pet\"},{\"@type\":\"WebPage\",\"name\":\"スポーツ・アウトドア\",\"url\":\"https://shop.aiboux.com/s/aiboux/products?category=sports-outdoor\"},{\"@type\":\"WebPage\",\"name\":\"本・文具\",\"url\":\"https://shop.aiboux.com/s/aiboux/products?category=books-stationery\"},{\"@type\":\"WebPage\",\"name\":\"セール\",\"url\":\"https://shop.aiboux.com/s/aiboux/products?category=sale\"},{\"@type\":\"WebPage\",\"name\":\"ランキング\",\"url\":\"https://shop.aiboux.com/s/aiboux/products?category=ranking\"},{\"@type\":\"WebPage\",\"name\":\"すべての商品\",\"url\":\"https://shop.aiboux.com/s/aiboux/products\"},{\"@type\":\"WebPage\",\"name\":\"カテゴリ一覧\",\"url\":\"https://shop.aiboux.com/s/aiboux/categories\"},{\"@type\":\"WebPage\",\"name\":\"食品・飲料\",\"url\":\"https://shop.aiboux.com/s/aiboux/products?category=food-drink\"},{\"@type\":\"WebPage\",\"name\":\"タイムセール\",\"url\":\"https://shop.aiboux.com/s/aiboux/products?category=sale\"},{\"@type\":\"WebPage\",\"name\":\"売れ筋ランキング\",\"url\":\"https://shop.aiboux.com/s/aiboux/products?category=ranking\"},{\"@type\":\"WebPage\",\"name\":\"カート\",\"url\":\"https://shop.aiboux.com/s/aiboux/cart\"},{\"@type\":\"WebPage\",\"name\":\"チェックアウト\",\"url\":\"https://shop.aiboux.com/s/aiboux/checkout\"},{\"@type\":\"WebPage\",\"name\":\"配送について\",\"url\":\"https://shop.aiboux.com/s/aiboux/shipping\"},{\"@type\":\"WebPage\",\"name\":\"返品について\",\"url\":\"https://shop.aiboux.com/s/aiboux/returns\"},{\"@type\":\"WebPage\",\"name\":\"特定商取引法\",\"url\":\"https://shop.aiboux.com/s/aiboux/legal\"},{\"@type\":\"WebPage\",\"name\":\"問い合わせ\",\"url\":\"https://shop.aiboux.com/s/aiboux/contact\"},{\"@type\":\"WebPage\",\"name\":\"マイページ\",\"url\":\"https://shop.aiboux.com/s/aiboux/mypage\"},{\"@type\":\"WebPage\",\"name\":\"注文履歴\",\"url\":\"https://shop.aiboux.com/s/aiboux/orders\"},{\"@type\":\"WebPage\",\"name\":\"お気に入り\",\"url\":\"https://shop.aiboux.com/s/aiboux/favorites\"},{\"@type\":\"WebPage\",\"name\":\"定期購入\",\"url\":\"https://shop.aiboux.com/s/aiboux/mypage/subscriptions\"},{\"@type\":\"WebPage\",\"name\":\"ログイン\",\"url\":\"https://shop.aiboux.com/s/aiboux/login\"},{\"@type\":\"WebPage\",\"name\":\"会員登録\",\"url\":\"https://shop.aiboux.com/s/aiboux/register\"},{\"@type\":\"WebPage\",\"name\":\"商品一覧\",\"url\":\"https://shop.aiboux.com/s/aiboux/products\"},{\"@type\":\"WebPage\",\"name\":\"カテゴリ\",\"url\":\"https://shop.aiboux.com/s/aiboux/categories\"},{\"@type\":\"WebPage\",\"name\":\"よくある質問\",\"url\":\"https://shop.aiboux.com/s/aiboux/faq\"},{\"@type\":\"WebPage\",\"name\":\"プライバシーポリシー\",\"url\":\"https://shop.aiboux.com/s/aiboux/privacy\"}]}]}"
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]: "お届け先: 東京都 千代田区"
      - generic [ref=e6]: 送料無料は ¥2,000
      - generic [ref=e7]:
        - generic [ref=e8]: ヘルプ・サポート
        - generic [ref=e9]: お知らせ
    - generic [ref=e10]:
      - link "株式会社雪花 公式ストア" [ref=e11] [cursor=pointer]:
        - /url: /s/aiboux/
      - search "ストア内商品検索" [ref=e12]:
        - generic [ref=e13]: すべてのカテゴリ
        - searchbox "キーワード・商品名・ブランド名で検索" [ref=e14]
        - button "商品を検索" [ref=e15]:
          - img [ref=e16]
      - link "アカウント マイページ" [ref=e19] [cursor=pointer]:
        - /url: /s/aiboux/mypage
        - text: アカウント
        - text: マイページ
      - link "注文履歴" [ref=e20] [cursor=pointer]:
        - /url: /s/aiboux/orders
      - link "カート 0" [ref=e21] [cursor=pointer]:
        - /url: /s/aiboux/cart
        - img [ref=e22]
        - text: カート
        - generic [ref=e26]: "0"
    - navigation [ref=e27]:
      - link "すべてのカテゴリー" [ref=e28] [cursor=pointer]:
        - /url: /s/aiboux/categories
      - link "食品・お菓子" [ref=e29] [cursor=pointer]:
        - /url: /s/aiboux/products?category=food-drink
      - link "日用品" [ref=e30] [cursor=pointer]:
        - /url: /s/aiboux/products?category=daily-goods
      - link "キッチン用品" [ref=e31] [cursor=pointer]:
        - /url: /s/aiboux/products?category=kitchen
      - link "ギフト" [ref=e32] [cursor=pointer]:
        - /url: /s/aiboux/products?category=gift
      - link "ビューティー" [ref=e33] [cursor=pointer]:
        - /url: /s/aiboux/products?category=beauty
      - link "ペット用品" [ref=e34] [cursor=pointer]:
        - /url: /s/aiboux/products?category=pet
      - link "スポーツ・アウトドア" [ref=e35] [cursor=pointer]:
        - /url: /s/aiboux/products?category=sports-outdoor
      - link "本・文具" [ref=e36] [cursor=pointer]:
        - /url: /s/aiboux/products?category=books-stationery
      - link "セール" [ref=e37] [cursor=pointer]:
        - /url: /s/aiboux/products?category=sale
      - link "ランキング" [ref=e38] [cursor=pointer]:
        - /url: /s/aiboux/products?category=ranking
  - main [ref=e39]:
    - generic [ref=e40]:
      - navigation "パンくずリスト" [ref=e41]:
        - generic [ref=e42]: 現在地
        - generic [ref=e44]: TOP
      - navigation "パンくず関連リンク" [ref=e45]:
        - link "タイムセール" [ref=e46] [cursor=pointer]:
          - /url: /s/aiboux/products?category=sale
          - generic [ref=e47]: タイムセール
        - link "ランキング" [ref=e48] [cursor=pointer]:
          - /url: /s/aiboux/products?category=ranking
          - generic [ref=e49]: ランキング
        - link "カテゴリ一覧" [ref=e50] [cursor=pointer]:
          - /url: /s/aiboux/categories
          - generic [ref=e51]: カテゴリ一覧
        - link "カート" [ref=e52] [cursor=pointer]:
          - /url: /s/aiboux/cart
          - generic [ref=e53]: カート
    - heading "株式会社雪花 公式ストア" [level=1] [ref=e54]
    - region "TOPヒーロースライダー" [ref=e55]:
      - generic [ref=e56]:
        - generic [ref=e57]:
          - article [ref=e58]:
            - generic [ref=e60]:
              - generic [ref=e61]: AIBOUX SALE
              - heading "贈り物にも使える暮らしのギフト" [level=2] [ref=e62]
              - paragraph [ref=e63]: タオル、ケア用品、食品ギフトを、価格とレビューで比較しながら選べます。
              - link "ギフトを見る" [ref=e64] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e65]:
            - generic [ref=e67]:
              - generic [ref=e68]: AIBOUX SALE
              - heading "毎日の暮らしを整える、雪花セレクト市" [level=2] [ref=e69]
              - paragraph [ref=e70]: 飲料、日用品、キッチン雑貨まで。今日ほしいものを見つけやすい売り場にまとめました。
              - link "おすすめを見る" [ref=e71] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e72]:
            - generic [ref=e74]:
              - generic [ref=e75]: AIBOUX SALE
              - heading "キッチンと食卓の定番をまとめ買い" [level=2] [ref=e76]
              - paragraph [ref=e77]: 保温ボトル、コーヒー、保存容器。日々の使いやすさで選べる定番アイテム。
              - link "売れ筋を見る" [ref=e78] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e79]:
            - generic [ref=e81]:
              - generic [ref=e82]: AIBOUX SALE
              - heading "贈り物にも使える暮らしのギフト" [level=2] [ref=e83]
              - paragraph [ref=e84]: タオル、ケア用品、食品ギフトを、価格とレビューで比較しながら選べます。
              - link "ギフトを見る" [ref=e85] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e86]:
            - generic [ref=e88]:
              - generic [ref=e89]: AIBOUX SALE
              - heading "毎日の暮らしを整える、雪花セレクト市" [level=2] [ref=e90]
              - paragraph [ref=e91]: 飲料、日用品、キッチン雑貨まで。今日ほしいものを見つけやすい売り場にまとめました。
              - link "おすすめを見る" [ref=e92] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e93]:
            - generic [ref=e95]:
              - generic [ref=e96]: AIBOUX SALE
              - heading "キッチンと食卓の定番をまとめ買い" [level=2] [ref=e97]
              - paragraph [ref=e98]: 保温ボトル、コーヒー、保存容器。日々の使いやすさで選べる定番アイテム。
              - link "売れ筋を見る" [ref=e99] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e100]:
            - generic [ref=e102]:
              - generic [ref=e103]: AIBOUX SALE
              - heading "贈り物にも使える暮らしのギフト" [level=2] [ref=e104]
              - paragraph [ref=e105]: タオル、ケア用品、食品ギフトを、価格とレビューで比較しながら選べます。
              - link "ギフトを見る" [ref=e106] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e107]:
            - generic [ref=e109]:
              - generic [ref=e110]: AIBOUX SALE
              - heading "毎日の暮らしを整える、雪花セレクト市" [level=2] [ref=e111]
              - paragraph [ref=e112]: 飲料、日用品、キッチン雑貨まで。今日ほしいものを見つけやすい売り場にまとめました。
              - link "おすすめを見る" [ref=e113] [cursor=pointer]:
                - /url: /s/aiboux/products
        - button "前のスライド" [ref=e114]:
          - img [ref=e115]
        - button "次のスライド" [ref=e117]:
          - img [ref=e118]
      - generic [ref=e120]:
        - button "スライド1へ移動" [ref=e121]
        - button "スライド2へ移動" [ref=e122]
        - button "スライド3へ移動" [ref=e123]
        - button "スライド4へ移動" [ref=e124]
        - button "スライド5へ移動" [ref=e125]
        - button "スライド6へ移動" [ref=e126]
    - generic [ref=e127]:
      - generic [ref=e128]:
        - generic [ref=e129]:
          - heading "おすすめ商品" [level=2] [ref=e130]
          - paragraph [ref=e131]: ヒーロースライダーの直下に公開商品を表示します。
        - generic [ref=e132]:
          - generic [ref=e133]: 3件
          - link "もっと見る" [ref=e134] [cursor=pointer]:
            - /url: /s/aiboux/products
      - generic [ref=e135]:
        - article [ref=e136]:
          - link "雪花セレクト ドリップコーヒー 20袋 コーヒー・お茶 ★★★★★ (860) 雪花セレクト ドリップコーヒー 20袋 ¥1,980 税込" [ref=e137] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-coffee
            - img "雪花セレクト ドリップコーヒー 20袋" [ref=e138]
            - generic [ref=e139]: コーヒー・お茶
            - generic [ref=e140]:
              - text: ★★★★★
              - generic [ref=e141]: (860)
            - heading "雪花セレクト ドリップコーヒー 20袋" [level=3] [ref=e142]
            - paragraph [ref=e143]: ¥1,980 税込
          - button "カートに追加" [ref=e144]
        - article [ref=e145]:
          - link "軽量ステンレスボトル 500ml キッチン用品 ★★★★★ (907) 軽量ステンレスボトル 500ml ¥2,480 税込" [ref=e146] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-bottle
            - img "軽量ステンレスボトル 500ml" [ref=e147]
            - generic [ref=e148]: キッチン用品
            - generic [ref=e149]:
              - text: ★★★★★
              - generic [ref=e150]: (907)
            - heading "軽量ステンレスボトル 500ml" [level=3] [ref=e151]
            - paragraph [ref=e152]: ¥2,480 税込
          - button "カートに追加" [ref=e153]
        - article [ref=e154]:
          - link "雪花セレクト ギフトタオル 2枚セット タオル・寝具 ★★★★★ (954) 雪花セレクト ギフトタオル 2枚セット ¥2,980 税込" [ref=e155] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-towel
            - img "雪花セレクト ギフトタオル 2枚セット" [ref=e156]
            - generic [ref=e157]: タオル・寝具
            - generic [ref=e158]:
              - text: ★★★★★
              - generic [ref=e159]: (954)
            - heading "雪花セレクト ギフトタオル 2枚セット" [level=3] [ref=e160]
            - paragraph [ref=e161]: ¥2,980 税込
          - button "カートに追加" [ref=e162]
        - article [ref=e163]:
          - link "キッチン保存容器 6点セット キッチン用品 ★★★★★ (1001) キッチン保存容器 6点セット ¥3,280 税込" [ref=e164] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-storage
            - img "キッチン保存容器 6点セット" [ref=e165]
            - generic [ref=e166]: キッチン用品
            - generic [ref=e167]:
              - text: ★★★★★
              - generic [ref=e168]: (1001)
            - heading "キッチン保存容器 6点セット" [level=3] [ref=e169]
            - paragraph [ref=e170]: ¥3,280 税込
          - button "カートに追加" [ref=e171]
        - article [ref=e172]:
          - link "毎日使えるホームケア洗剤セット 日用品 ★★★★★ (1048) 毎日使えるホームケア洗剤セット ¥1,680 税込" [ref=e173] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-cleaning
            - img "毎日使えるホームケア洗剤セット" [ref=e174]
            - generic [ref=e175]: 日用品
            - generic [ref=e176]:
              - text: ★★★★★
              - generic [ref=e177]: (1048)
            - heading "毎日使えるホームケア洗剤セット" [level=3] [ref=e178]
            - paragraph [ref=e179]: ¥1,680 税込
          - button "カートに追加" [ref=e180]
        - article [ref=e181]:
          - link "ナチュラルスキンケア 3点セット ビューティー ★★★★★ (1095) ナチュラルスキンケア 3点セット ¥4,280 税込" [ref=e182] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-skincare
            - img "ナチュラルスキンケア 3点セット" [ref=e183]
            - generic [ref=e184]: ビューティー
            - generic [ref=e185]:
              - text: ★★★★★
              - generic [ref=e186]: (1095)
            - heading "ナチュラルスキンケア 3点セット" [level=3] [ref=e187]
            - paragraph [ref=e188]: ¥4,280 税込
          - button "カートに追加" [ref=e189]
        - article [ref=e190]:
          - link "焼き菓子アソートボックス 食品・飲料 ★★★★★ (1142) 焼き菓子アソートボックス ¥2,380 税込" [ref=e191] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-snack
            - img "焼き菓子アソートボックス" [ref=e192]
            - generic [ref=e193]: 食品・飲料
            - generic [ref=e194]:
              - text: ★★★★★
              - generic [ref=e195]: (1142)
            - heading "焼き菓子アソートボックス" [level=3] [ref=e196]
            - paragraph [ref=e197]: ¥2,380 税込
          - button "カートに追加" [ref=e198]
        - article [ref=e199]:
          - link "ペットケアおでかけセット ペット用品 ★★★★★ (1189) ペットケアおでかけセット ¥3,480 税込" [ref=e200] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-pet
            - img "ペットケアおでかけセット" [ref=e201]
            - generic [ref=e202]: ペット用品
            - generic [ref=e203]:
              - text: ★★★★★
              - generic [ref=e204]: (1189)
            - heading "ペットケアおでかけセット" [level=3] [ref=e205]
            - paragraph [ref=e206]: ¥3,480 税込
          - button "カートに追加" [ref=e207]
        - article [ref=e208]:
          - link "季節のギフトボックス ギフト ★★★★★ (1236) 季節のギフトボックス ¥5,980 税込" [ref=e209] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-gift
            - img "季節のギフトボックス" [ref=e210]
            - generic [ref=e211]: ギフト
            - generic [ref=e212]:
              - text: ★★★★★
              - generic [ref=e213]: (1236)
            - heading "季節のギフトボックス" [level=3] [ref=e214]
            - paragraph [ref=e215]: ¥5,980 税込
          - button "カートに追加" [ref=e216]
        - article [ref=e217]:
          - link "国産茶葉ティーバッグ 30包 コーヒー・お茶 ★★★★★ (1283) 国産茶葉ティーバッグ 30包 ¥1,780 税込" [ref=e218] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-tea
            - img "国産茶葉ティーバッグ 30包" [ref=e219]
            - generic [ref=e220]: コーヒー・お茶
            - generic [ref=e221]:
              - text: ★★★★★
              - generic [ref=e222]: (1283)
            - heading "国産茶葉ティーバッグ 30包" [level=3] [ref=e223]
            - paragraph [ref=e224]: ¥1,780 税込
          - button "カートに追加" [ref=e225]
    - region "価格・配送・返品・決済を購入前に確認" [ref=e226]:
      - generic [ref=e227]:
        - generic [ref=e228]:
          - paragraph [ref=e229]: Purchase facts
          - heading "価格・配送・返品・決済を購入前に確認" [level=2] [ref=e230]
        - link "よくある質問" [ref=e231] [cursor=pointer]:
          - /url: /s/aiboux/faq
          - generic [ref=e232]: よくある質問
      - generic [ref=e233]:
        - link "税込 価格・税込表示 商品一覧、商品詳細、カートで税込価格を同じ形式で表示し、購入前の比較をしやすくします。 商品を比較" [ref=e234] [cursor=pointer]:
          - /url: /s/aiboux/products
          - generic [ref=e235]: 税込
          - heading "価格・税込表示" [level=3] [ref=e236]
          - paragraph [ref=e237]: 商品一覧、商品詳細、カートで税込価格を同じ形式で表示し、購入前の比較をしやすくします。
          - generic [ref=e238]: 商品を比較
        - link "配送 在庫・配送予定 在庫あり・在庫確認を明示。配送は通常2〜4営業日を目安に、追跡と送料条件を配送ページへ集約します。 配送条件を見る" [ref=e239] [cursor=pointer]:
          - /url: /s/aiboux/shipping
          - generic [ref=e240]: 配送
          - heading "在庫・配送予定" [level=3] [ref=e241]
          - paragraph [ref=e242]: 在庫あり・在庫確認を明示。配送は通常2〜4営業日を目安に、追跡と送料条件を配送ページへ集約します。
          - generic [ref=e243]: 配送条件を見る
        - link "返品 返品・キャンセル 未開封・未使用品、初期不良、到着後7日以内の問い合わせ条件を購入前に確認できます。 返品条件を見る" [ref=e244] [cursor=pointer]:
          - /url: /s/aiboux/returns
          - generic [ref=e245]: 返品
          - heading "返品・キャンセル" [level=3] [ref=e246]
          - paragraph [ref=e247]: 未開封・未使用品、初期不良、到着後7日以内の問い合わせ条件を購入前に確認できます。
          - generic [ref=e248]: 返品条件を見る
        - link "準備中 決済・定期購入 定期購入はDB migrationと決済接続が完了するまで申込み不可として表示します。成功したふりはしません。 注文前に確認" [ref=e249] [cursor=pointer]:
          - /url: /s/aiboux/checkout
          - generic [ref=e250]: 準備中
          - heading "決済・定期購入" [level=3] [ref=e251]
          - paragraph [ref=e252]: 定期購入はDB migrationと決済接続が完了するまで申込み不可として表示します。成功したふりはしません。
          - generic [ref=e253]: 注文前に確認
        - link "サポート 問い合わせ導線 商品名、注文番号、配送、返品、定期購入の確認事項を問い合わせページで整理します。 問い合わせる" [ref=e254] [cursor=pointer]:
          - /url: /s/aiboux/contact
          - generic [ref=e255]: サポート
          - heading "問い合わせ導線" [level=3] [ref=e256]
          - paragraph [ref=e257]: 商品名、注文番号、配送、返品、定期購入の確認事項を問い合わせページで整理します。
          - generic [ref=e258]: 問い合わせる
    - region "TOPページで確認できること" [ref=e259]:
      - generic [ref=e260]:
        - generic [ref=e261]:
          - paragraph [ref=e262]: Page quality
          - heading "TOPページで確認できること" [level=2] [ref=e263]
          - generic [ref=e264]:
            - paragraph [ref=e265]:
              - strong [ref=e266]: "検索意図:"
              - text: おすすめ、ランキング、タイムセール、カテゴリから商品発見を始める入口です。
            - paragraph [ref=e267]:
              - strong [ref=e268]: "SEO構造:"
              - text: ストア全体の主要カテゴリと購入サポートへリンクするハブページとして扱います。
            - paragraph [ref=e269]:
              - strong [ref=e270]: "次の操作:"
              - text: ヒーロー、商品カード、カテゴリ、フッターから商品詳細や購入条件へ移動します。
        - navigation "TOPページの購入・検索補助リンク" [ref=e271]:
          - link "発見 商品発見 おすすめ商品、ランキング、タイムセールを商品詳細へ直結します。 商品一覧" [ref=e272] [cursor=pointer]:
            - /url: /s/aiboux/products
            - generic [ref=e273]: 発見
            - heading "商品発見" [level=3] [ref=e274]
            - paragraph [ref=e275]: おすすめ商品、ランキング、タイムセールを商品詳細へ直結します。
            - generic [ref=e276]: 商品一覧
          - link "SEO カテゴリ導線 カテゴリURLを安定化し、食品・日用品・ギフトなどへ分岐します。 カテゴリ" [ref=e277] [cursor=pointer]:
            - /url: /s/aiboux/categories
            - generic [ref=e278]: SEO
            - heading "カテゴリ導線" [level=3] [ref=e279]
            - paragraph [ref=e280]: カテゴリURLを安定化し、食品・日用品・ギフトなどへ分岐します。
            - generic [ref=e281]: カテゴリ
          - link "購入前 価格・配送・返品 税込価格、配送目安、返品条件を購入前に確認できる導線を固定します。 配送条件" [ref=e282] [cursor=pointer]:
            - /url: /s/aiboux/shipping
            - generic [ref=e283]: 購入前
            - heading "価格・配送・返品" [level=3] [ref=e284]
            - paragraph [ref=e285]: 税込価格、配送目安、返品条件を購入前に確認できる導線を固定します。
            - generic [ref=e286]: 配送条件
          - link "支援 サポート導線 FAQ、問い合わせ、注文履歴へ戻れるクロール可能な内部リンクを維持します。 FAQ" [ref=e287] [cursor=pointer]:
            - /url: /s/aiboux/faq
            - generic [ref=e288]: 支援
            - heading "サポート導線" [level=3] [ref=e289]
            - paragraph [ref=e290]: FAQ、問い合わせ、注文履歴へ戻れるクロール可能な内部リンクを維持します。
            - generic [ref=e291]: FAQ
    - generic [ref=e292]:
      - generic [ref=e293]:
        - heading "売れ筋ランキング" [level=2] [ref=e294]
        - link "もっと見る" [ref=e295] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e296]:
        - link "1 軽量ステンレスボトル 500ml キッチン用品 軽量ステンレスボトル 500ml ¥2,480" [ref=e297] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-bottle
          - generic [ref=e298]: "1"
          - img "軽量ステンレスボトル 500ml" [ref=e299]
          - generic [ref=e300]: キッチン用品
          - generic [ref=e301]: 軽量ステンレスボトル 500ml
          - generic [ref=e302]: ¥2,480
        - link "2 雪花セレクト ギフトタオル 2枚セット タオル・寝具 雪花セレクト ギフトタオル 2枚セット ¥2,980" [ref=e303] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-towel
          - generic [ref=e304]: "2"
          - img "雪花セレクト ギフトタオル 2枚セット" [ref=e305]
          - generic [ref=e306]: タオル・寝具
          - generic [ref=e307]: 雪花セレクト ギフトタオル 2枚セット
          - generic [ref=e308]: ¥2,980
        - link "3 キッチン保存容器 6点セット キッチン用品 キッチン保存容器 6点セット ¥3,280" [ref=e309] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-storage
          - generic [ref=e310]: "3"
          - img "キッチン保存容器 6点セット" [ref=e311]
          - generic [ref=e312]: キッチン用品
          - generic [ref=e313]: キッチン保存容器 6点セット
          - generic [ref=e314]: ¥3,280
        - link "4 毎日使えるホームケア洗剤セット 日用品 毎日使えるホームケア洗剤セット ¥1,680" [ref=e315] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-cleaning
          - generic [ref=e316]: "4"
          - img "毎日使えるホームケア洗剤セット" [ref=e317]
          - generic [ref=e318]: 日用品
          - generic [ref=e319]: 毎日使えるホームケア洗剤セット
          - generic [ref=e320]: ¥1,680
        - link "5 ナチュラルスキンケア 3点セット ビューティー ナチュラルスキンケア 3点セット ¥4,280" [ref=e321] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-skincare
          - generic [ref=e322]: "5"
          - img "ナチュラルスキンケア 3点セット" [ref=e323]
          - generic [ref=e324]: ビューティー
          - generic [ref=e325]: ナチュラルスキンケア 3点セット
          - generic [ref=e326]: ¥4,280
    - generic [ref=e327]:
      - generic [ref=e328]:
        - heading "タイムセール" [level=2] [ref=e329]
        - link "もっと見る" [ref=e330] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e331]:
        - link "SALE キッチン保存容器 6点セット キッチン用品 キッチン保存容器 6点セット ¥3,280 ¥3,880" [ref=e332] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-storage
          - generic [ref=e333]: SALE
          - img "キッチン保存容器 6点セット" [ref=e334]
          - generic [ref=e335]: キッチン用品
          - generic [ref=e336]: キッチン保存容器 6点セット
          - generic [ref=e337]: ¥3,280
          - generic [ref=e338]: ¥3,880
        - link "SALE 毎日使えるホームケア洗剤セット 日用品 毎日使えるホームケア洗剤セット ¥1,680 ¥2,280" [ref=e339] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-cleaning
          - generic [ref=e340]: SALE
          - img "毎日使えるホームケア洗剤セット" [ref=e341]
          - generic [ref=e342]: 日用品
          - generic [ref=e343]: 毎日使えるホームケア洗剤セット
          - generic [ref=e344]: ¥1,680
          - generic [ref=e345]: ¥2,280
        - link "SALE ナチュラルスキンケア 3点セット ビューティー ナチュラルスキンケア 3点セット ¥4,280 ¥4,880" [ref=e346] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-skincare
          - generic [ref=e347]: SALE
          - img "ナチュラルスキンケア 3点セット" [ref=e348]
          - generic [ref=e349]: ビューティー
          - generic [ref=e350]: ナチュラルスキンケア 3点セット
          - generic [ref=e351]: ¥4,280
          - generic [ref=e352]: ¥4,880
        - link "SALE 焼き菓子アソートボックス 食品・飲料 焼き菓子アソートボックス ¥2,380 ¥2,980" [ref=e353] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-snack
          - generic [ref=e354]: SALE
          - img "焼き菓子アソートボックス" [ref=e355]
          - generic [ref=e356]: 食品・飲料
          - generic [ref=e357]: 焼き菓子アソートボックス
          - generic [ref=e358]: ¥2,380
          - generic [ref=e359]: ¥2,980
        - link "SALE ペットケアおでかけセット ペット用品 ペットケアおでかけセット ¥3,480 ¥4,080" [ref=e360] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-pet
          - generic [ref=e361]: SALE
          - img "ペットケアおでかけセット" [ref=e362]
          - generic [ref=e363]: ペット用品
          - generic [ref=e364]: ペットケアおでかけセット
          - generic [ref=e365]: ¥3,480
          - generic [ref=e366]: ¥4,080
    - generic [ref=e367]:
      - generic [ref=e368]:
        - heading "カテゴリー一覧" [level=2] [ref=e369]
        - link "もっと見る" [ref=e370] [cursor=pointer]:
          - /url: /s/aiboux/categories
      - generic [ref=e371]:
        - link "食品・飲料 食品・飲料" [ref=e372] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "食品・飲料" [ref=e373]
          - text: 食品・飲料
        - link "コーヒー・お茶 コーヒー・お茶" [ref=e374] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "コーヒー・お茶" [ref=e375]
          - text: コーヒー・お茶
        - link "キッチン用品 キッチン用品" [ref=e376] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "キッチン用品" [ref=e377]
          - text: キッチン用品
        - link "日用品 日用品" [ref=e378] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "日用品" [ref=e379]
          - text: 日用品
        - link "タオル・寝具 タオル・寝具" [ref=e380] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "タオル・寝具" [ref=e381]
          - text: タオル・寝具
        - link "ビューティー ビューティー" [ref=e382] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "ビューティー" [ref=e383]
          - text: ビューティー
        - link "ペット用品 ペット用品" [ref=e384] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "ペット用品" [ref=e385]
          - text: ペット用品
        - link "ギフト ギフト" [ref=e386] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "ギフト" [ref=e387]
          - text: ギフト
        - link "本・文具 本・文具" [ref=e388] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "本・文具" [ref=e389]
          - text: 本・文具
        - link "セール セール" [ref=e390] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "セール" [ref=e391]
          - text: セール
        - link "ランキング ランキング" [ref=e392] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "ランキング" [ref=e393]
          - text: ランキング
    - generic [ref=e394]:
      - generic [ref=e395]:
        - heading "人気ブランド" [level=2] [ref=e396]
        - link "もっと見る" [ref=e397] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e398]:
        - generic [ref=e399]: THERMOS
        - generic [ref=e400]: Panasonic
        - generic [ref=e401]: SHARP
        - generic [ref=e402]: dyson
        - generic [ref=e403]: IRIS OHYAMA
        - generic [ref=e404]: KIRIN
  - generic [ref=e405]:
    - region "株式会社雪花 公式ストア TOPページの購入前チェック" [ref=e406]:
      - generic [ref=e407]:
        - generic [ref=e408]:
          - paragraph [ref=e409]: Buying guide
          - heading "株式会社雪花 公式ストア TOPページの購入前チェック" [level=2] [ref=e410]
          - paragraph [ref=e411]: 価格、税込、配送、返品、決済、定期購入の未接続状態をページごとに整理し、購入判断と検索理解に必要な内部リンクを共通化します。
        - generic [ref=e412]: SEO内部リンク強化
      - generic [ref=e413]:
        - article [ref=e414]:
          - heading "TOPページから最短で商品を探すには。" [level=3] [ref=e415]
          - paragraph [ref=e416]: ヒーロー直下のおすすめ商品、ランキング、タイムセール、カテゴリから商品詳細へ直接進めます。
          - link "商品一覧へ" [ref=e417] [cursor=pointer]:
            - /url: /s/aiboux/products
        - article [ref=e418]:
          - heading "カテゴリ別に比較できますか。" [level=3] [ref=e419]
          - paragraph [ref=e420]: カテゴリURLは安定した検索向けURLとして用意し、食品、日用品、キッチン、ギフトなどへ分岐できます。
          - link "カテゴリを見る" [ref=e421] [cursor=pointer]:
            - /url: /s/aiboux/categories
        - article [ref=e422]:
          - heading "購入前に価格・税込・送料をどこで確認できますか。" [level=3] [ref=e423]
          - paragraph [ref=e424]: 商品カードと商品詳細は税込表示で揃え、送料と配送目安は配送ページへ集約しています。
          - link "送料と配送を見る" [ref=e425] [cursor=pointer]:
            - /url: /s/aiboux/shipping
        - article [ref=e426]:
          - heading "返品やキャンセル条件は注文前に確認できますか。" [level=3] [ref=e427]
          - paragraph [ref=e428]: 返品条件、未開封品、初期不良、問い合わせ期限を共通テンプレートで確認できます。
          - link "返品条件を見る" [ref=e429] [cursor=pointer]:
            - /url: /s/aiboux/returns
        - article [ref=e430]:
          - heading "決済や定期購入が未接続の場合はどう表示されますか。" [level=3] [ref=e431]
          - paragraph [ref=e432]: 成功したふりをせず、決済未接続や定期購入DB未適用を画面上で明示します。
          - link "注文前に確認" [ref=e433] [cursor=pointer]:
            - /url: /s/aiboux/checkout
        - article [ref=e434]:
          - heading "迷ったときはどのページへ進めばよいですか。" [level=3] [ref=e435]
          - paragraph [ref=e436]: 商品一覧、カテゴリ、FAQ、問い合わせへ戻れる内部リンクを全ページに配置しています。
          - link "FAQを見る" [ref=e437] [cursor=pointer]:
            - /url: /s/aiboux/faq
    - region "このページから次に確認すること" [ref=e438]:
      - generic [ref=e440]:
        - paragraph [ref=e441]: Related navigation
        - heading "このページから次に確認すること" [level=2] [ref=e442]
        - paragraph [ref=e443]: 商品発見、購入前確認、購入後サポートをページごとに整理し、SEOに必要な説明的リンクを共通化します。
      - navigation "関連する内部リンク" [ref=e444]:
        - generic [ref=e445]:
          - heading "商品を探す" [level=3] [ref=e446]
          - paragraph [ref=e447]: 価格、税込表示、レビュー、カテゴリ、在庫、配送条件を同じ導線で比較します。
          - list [ref=e448]:
            - listitem [ref=e449]:
              - link "すべての商品" [ref=e450] [cursor=pointer]:
                - /url: /s/aiboux/products
            - listitem [ref=e451]:
              - link "カテゴリ一覧" [ref=e452] [cursor=pointer]:
                - /url: /s/aiboux/categories
            - listitem [ref=e453]:
              - link "食品・飲料" [ref=e454] [cursor=pointer]:
                - /url: /s/aiboux/products?category=food-drink
            - listitem [ref=e455]:
              - link "日用品" [ref=e456] [cursor=pointer]:
                - /url: /s/aiboux/products?category=daily-goods
            - listitem [ref=e457]:
              - link "タイムセール" [ref=e458] [cursor=pointer]:
                - /url: /s/aiboux/products?category=sale
            - listitem [ref=e459]:
              - link "売れ筋ランキング" [ref=e460] [cursor=pointer]:
                - /url: /s/aiboux/products?category=ranking
        - generic [ref=e461]:
          - heading "購入前に確認" [level=3] [ref=e462]
          - paragraph [ref=e463]: 送料、返品、問い合わせ、取引条件を購入前に確認できるようにします。
          - list [ref=e464]:
            - listitem [ref=e465]:
              - link "カート" [ref=e466] [cursor=pointer]:
                - /url: /s/aiboux/cart
            - listitem [ref=e467]:
              - link "チェックアウト" [ref=e468] [cursor=pointer]:
                - /url: /s/aiboux/checkout
            - listitem [ref=e469]:
              - link "配送について" [ref=e470] [cursor=pointer]:
                - /url: /s/aiboux/shipping
            - listitem [ref=e471]:
              - link "返品について" [ref=e472] [cursor=pointer]:
                - /url: /s/aiboux/returns
            - listitem [ref=e473]:
              - link "特定商取引法" [ref=e474] [cursor=pointer]:
                - /url: /s/aiboux/legal
            - listitem [ref=e475]:
              - link "問い合わせ" [ref=e476] [cursor=pointer]:
                - /url: /s/aiboux/contact
        - generic [ref=e477]:
          - heading "購入後サポート" [level=3] [ref=e478]
          - paragraph [ref=e479]: 注文履歴、マイページ、定期購入、お気に入りへ迷わず戻れるようにします。
          - list [ref=e480]:
            - listitem [ref=e481]:
              - link "マイページ" [ref=e482] [cursor=pointer]:
                - /url: /s/aiboux/mypage
            - listitem [ref=e483]:
              - link "注文履歴" [ref=e484] [cursor=pointer]:
                - /url: /s/aiboux/orders
            - listitem [ref=e485]:
              - link "お気に入り" [ref=e486] [cursor=pointer]:
                - /url: /s/aiboux/favorites
            - listitem [ref=e487]:
              - link "定期購入" [ref=e488] [cursor=pointer]:
                - /url: /s/aiboux/mypage/subscriptions
            - listitem [ref=e489]:
              - link "ログイン" [ref=e490] [cursor=pointer]:
                - /url: /s/aiboux/login
            - listitem [ref=e491]:
              - link "会員登録" [ref=e492] [cursor=pointer]:
                - /url: /s/aiboux/register
    - region "株式会社雪花 公式ストアで迷わず探す" [ref=e493]:
      - generic [ref=e494]:
        - generic [ref=e495]:
          - paragraph [ref=e496]: Store navigation
          - heading "株式会社雪花 公式ストアで迷わず探す" [level=2] [ref=e497]
          - paragraph [ref=e498]: 商品、カテゴリ、配送、返品、注文履歴を説明的なリンクで整理します。検索エンジンにもユーザーにも分かる、共通の内部リンク導線です。
        - link "商品一覧へ" [ref=e499] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e500]:
        - navigation "株式会社雪花 公式ストア SEO内部リンク" [ref=e501]:
          - generic [ref=e502]:
            - heading "人気カテゴリ" [level=3] [ref=e503]
            - list [ref=e504]:
              - listitem [ref=e505]:
                - link "食品・飲料を比較する" [ref=e506] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=food-drink
              - listitem [ref=e507]:
                - link "コーヒー・お茶を見る" [ref=e508] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=coffee-tea
              - listitem [ref=e509]:
                - link "キッチン用品を探す" [ref=e510] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=kitchen
              - listitem [ref=e511]:
                - link "日用品をまとめ買いする" [ref=e512] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=daily-goods
              - listitem [ref=e513]:
                - link "ギフト商品を選ぶ" [ref=e514] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=gift
          - generic [ref=e515]:
            - heading "購入前ガイド" [level=3] [ref=e516]
            - list [ref=e517]:
              - listitem [ref=e518]:
                - link "送料と配送予定を確認する" [ref=e519] [cursor=pointer]:
                  - /url: /s/aiboux/shipping
              - listitem [ref=e520]:
                - link "返品・交換条件を確認する" [ref=e521] [cursor=pointer]:
                  - /url: /s/aiboux/returns
              - listitem [ref=e522]:
                - link "よくある質問を見る" [ref=e523] [cursor=pointer]:
                  - /url: /s/aiboux/faq
              - listitem [ref=e524]:
                - link "ストアへ問い合わせる" [ref=e525] [cursor=pointer]:
                  - /url: /s/aiboux/contact
          - generic [ref=e526]:
            - heading "購入後サポート" [level=3] [ref=e527]
            - list [ref=e528]:
              - listitem [ref=e529]:
                - link "注文履歴を確認する" [ref=e530] [cursor=pointer]:
                  - /url: /s/aiboux/orders
              - listitem [ref=e531]:
                - link "マイページを開く" [ref=e532] [cursor=pointer]:
                  - /url: /s/aiboux/mypage
              - listitem [ref=e533]:
                - link "お気に入り商品を見る" [ref=e534] [cursor=pointer]:
                  - /url: /s/aiboux/favorites
              - listitem [ref=e535]:
                - link "定期購入の状態を見る" [ref=e536] [cursor=pointer]:
                  - /url: /s/aiboux/mypage/subscriptions
        - complementary "購入判断の要点" [ref=e537]:
          - link "商品比較 価格、税込、レビュー、在庫、配送目安を同じ商品カードで比較します。 商品一覧" [ref=e538] [cursor=pointer]:
            - /url: /s/aiboux/products
            - text: 商品比較
            - generic [ref=e539]: 価格、税込、レビュー、在庫、配送目安を同じ商品カードで比較します。
            - generic [ref=e540]: 商品一覧
          - link "購入条件 送料、返品、特商法、決済設定状態を注文前に確認できます。 取引条件" [ref=e541] [cursor=pointer]:
            - /url: /s/aiboux/legal
            - text: 購入条件
            - generic [ref=e542]: 送料、返品、特商法、決済設定状態を注文前に確認できます。
            - generic [ref=e543]: 取引条件
          - link "アカウント 注文履歴、配送状況、定期購入、お気に入りを同じ導線で確認します。 マイページ" [ref=e544] [cursor=pointer]:
            - /url: /s/aiboux/mypage
            - text: アカウント
            - generic [ref=e545]: 注文履歴、配送状況、定期購入、お気に入りを同じ導線で確認します。
            - generic [ref=e546]: マイページ
    - region "迷わず買えるための確認導線" [ref=e547]:
      - generic [ref=e548]:
        - generic [ref=e549]:
          - paragraph [ref=e550]: Shopping guide
          - heading "迷わず買えるための確認導線" [level=2] [ref=e551]
          - paragraph [ref=e552]: 商品比較、配送・返品、注文後の確認、定期購入の状態まで、SEOに忠実な内部リンクで移動できます。
        - link "商品一覧を見る" [ref=e553] [cursor=pointer]:
          - /url: /s/aiboux/products
          - generic [ref=e554]: 商品一覧を見る
      - generic [ref=e555]:
        - link "商品を探す 商品一覧、カテゴリ、ランキングから価格・税込・在庫・レビューを比較できます。 商品一覧へ" [ref=e556] [cursor=pointer]:
          - /url: /s/aiboux/products
          - heading "商品を探す" [level=3] [ref=e557]
          - paragraph [ref=e558]: 商品一覧、カテゴリ、ランキングから価格・税込・在庫・レビューを比較できます。
          - generic [ref=e559]: 商品一覧へ
        - link "購入前に確認 送料、返品条件、決済設定状態、特定商取引法の表示を注文前に確認できます。 配送条件を見る" [ref=e560] [cursor=pointer]:
          - /url: /s/aiboux/shipping
          - heading "購入前に確認" [level=3] [ref=e561]
          - paragraph [ref=e562]: 送料、返品条件、決済設定状態、特定商取引法の表示を注文前に確認できます。
          - generic [ref=e563]: 配送条件を見る
        - link "注文後の確認 注文履歴、配送状況、問い合わせ、領収書導線を同じマイページ導線で確認します。 注文履歴へ" [ref=e564] [cursor=pointer]:
          - /url: /s/aiboux/orders
          - heading "注文後の確認" [level=3] [ref=e565]
          - paragraph [ref=e566]: 注文履歴、配送状況、問い合わせ、領収書導線を同じマイページ導線で確認します。
          - generic [ref=e567]: 注文履歴へ
        - link "定期購入 定期購入は本番DB migrationと決済接続が完了するまで、準備中として正直に表示します。 定期購入を見る" [ref=e568] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
          - heading "定期購入" [level=3] [ref=e569]
          - paragraph [ref=e570]: 定期購入は本番DB migrationと決済接続が完了するまで、準備中として正直に表示します。
          - generic [ref=e571]: 定期購入を見る
      - navigation "購入サポートの内部リンク" [ref=e572]:
        - link "カテゴリから探す" [ref=e573] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "カートを見る" [ref=e574] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e575] [cursor=pointer]:
          - /url: /s/aiboux/checkout
        - link "問い合わせ" [ref=e576] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e577] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "返品について" [ref=e578] [cursor=pointer]:
          - /url: /s/aiboux/returns
        - link "マイページ" [ref=e579] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "お気に入り" [ref=e580] [cursor=pointer]:
          - /url: /s/aiboux/favorites
  - contentinfo [ref=e581]:
    - link "ページ上部へ戻る" [ref=e582] [cursor=pointer]:
      - /url: "#top"
    - generic [ref=e583]:
      - generic [ref=e584]:
        - heading "税込価格" [level=2] [ref=e585]
        - paragraph [ref=e586]: 商品価格は税込表示で統一します。
      - generic [ref=e587]:
        - heading "配送・返品" [level=2] [ref=e588]
        - paragraph [ref=e589]: 配送予定、返品条件、問い合わせ先を各ページから確認できます。
      - generic [ref=e590]:
        - heading "決済状態" [level=2] [ref=e591]
        - paragraph [ref=e592]: 決済未接続時は注文確定したふりをせず、設定未完了として表示します。
      - generic [ref=e593]:
        - heading "定期購入" [level=2] [ref=e594]
        - paragraph [ref=e595]: 定期購入はDB migrationと決済接続が完了するまで正直に準備中表示にします。
    - generic [ref=e596]:
      - navigation "お買い物" [ref=e597]:
        - heading "お買い物" [level=2] [ref=e598]
        - link "商品一覧" [ref=e599] [cursor=pointer]:
          - /url: /s/aiboux/products
        - link "カテゴリ" [ref=e600] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "タイムセール" [ref=e601] [cursor=pointer]:
          - /url: /s/aiboux/products?category=sale
        - link "売れ筋ランキング" [ref=e602] [cursor=pointer]:
          - /url: /s/aiboux/products?category=ranking
        - link "お気に入り" [ref=e603] [cursor=pointer]:
          - /url: /s/aiboux/favorites
      - navigation "アカウント" [ref=e604]:
        - heading "アカウント" [level=2] [ref=e605]
        - link "マイページ" [ref=e606] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "注文履歴" [ref=e607] [cursor=pointer]:
          - /url: /s/aiboux/orders
        - link "定期購入" [ref=e608] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
        - link "ログイン" [ref=e609] [cursor=pointer]:
          - /url: /s/aiboux/login
      - navigation "サポート" [ref=e610]:
        - heading "サポート" [level=2] [ref=e611]
        - link "問い合わせ" [ref=e612] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e613] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "配送について" [ref=e614] [cursor=pointer]:
          - /url: /s/aiboux/shipping
        - link "返品について" [ref=e615] [cursor=pointer]:
          - /url: /s/aiboux/returns
      - navigation "ストア情報" [ref=e616]:
        - heading "ストア情報" [level=2] [ref=e617]
        - link "特定商取引法" [ref=e618] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシーポリシー" [ref=e619] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "カート" [ref=e620] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e621] [cursor=pointer]:
          - /url: /s/aiboux/checkout
    - generic [ref=e623]:
      - generic [ref=e624]:
        - generic [ref=e625]: 株式会社雪花 公式ストア
        - paragraph [ref=e626]: 注文、配送、返品、定期購入、問い合わせまで同じテナント導線で確認できます。決済未接続時は注文確定しません。
      - navigation "ストア基本情報" [ref=e627]:
        - link "特商法" [ref=e628] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシー" [ref=e629] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "問い合わせ" [ref=e630] [cursor=pointer]:
          - /url: /s/aiboux/contact
```

# Test source

```ts
  157 |         expect(await seoHub.locator('[itemtype="https://schema.org/SiteNavigationElement"]').count(), `${target.path} SEO hub should expose visible SiteNavigationElement microdata`).toBeGreaterThanOrEqual(1);
  158 |         expect(await seoHub.locator("a").count(), `${target.path} SEO hub should expose dense crawlable links`).toBeGreaterThanOrEqual(14);
  159 |         expect(await seoHub.locator("a").nth(1).getAttribute("class"), `${target.path} SEO hub links should be visibly link-colored`).toContain("text-blue-700");
  160 |         const breadcrumb = page.getByTestId("storefront-breadcrumb");
  161 |         await expect(breadcrumb, `${target.path} should include visible breadcrumb navigation`).toBeVisible();
  162 |         await expect(breadcrumb, `${target.path} breadcrumb should expose BreadcrumbList microdata`).toHaveAttribute(
  163 |           "itemtype",
  164 |           "https://schema.org/BreadcrumbList",
  165 |         );
  166 |         expect(await breadcrumb.locator('[itemtype="https://schema.org/ListItem"]').count(), `${target.path} should expose visible breadcrumb ListItem microdata`).toBeGreaterThanOrEqual(1);
  167 |         const breadcrumbLinkCount = await breadcrumb.locator("a").count();
  168 |         if (breadcrumbLinkCount > 0) {
  169 |           expect(await breadcrumb.locator("a").first().getAttribute("class"), `${target.path} breadcrumb links should be visibly link-colored`).toContain("text-blue-700");
  170 |         }
  171 |         const breadcrumbShell = page.getByTestId("storefront-breadcrumb-shell");
  172 |         await expect(breadcrumbShell, `${target.path} should render the shared breadcrumb shell`).toBeVisible();
  173 |         await expect(breadcrumbShell, `${target.path} breadcrumb shell should label the current location`).toContainText("現在地");
  174 |         const breadcrumbSupport = page.getByTestId("storefront-breadcrumb-support-links");
  175 |         await expect(breadcrumbSupport, `${target.path} should include breadcrumb-adjacent support links`).toBeVisible();
  176 |         await expect(breadcrumbSupport, `${target.path} support links should expose SiteNavigationElement microdata`).toHaveAttribute(
  177 |           "itemtype",
  178 |           "https://schema.org/SiteNavigationElement",
  179 |         );
  180 |         expect(await breadcrumbSupport.locator("a").count(), `${target.path} should expose multiple breadcrumb support links`).toBeGreaterThanOrEqual(3);
  181 |         expect(await breadcrumbSupport.locator("a").first().getAttribute("class"), `${target.path} breadcrumb support links should be visibly blue`).toContain("text-blue-700");
  182 |         if ("expectedTestId" in target && target.expectedTestId) {
  183 |           await expect(page.locator(`[data-testid="${target.expectedTestId}"]`), target.path).toBeVisible();
  184 |         }
  185 |         if (target.name !== "shop-top") {
  186 |           const pageHeader = page.getByTestId("storefront-page-header");
  187 |           await expect(pageHeader, `${target.path} should include the shared page header`).toBeVisible();
  188 |           await expect(pageHeader.locator("h1"), `${target.path} shared page header should own the page h1`).toHaveCount(1);
  189 |           expect(await pageHeader.locator("a").count(), `${target.path} shared page header should expose crawlable action links`).toBeGreaterThanOrEqual(2);
  190 |           expect(await pageHeader.locator('[itemtype="https://schema.org/SiteNavigationElement"]').count(), `${target.path} page header should expose SiteNavigationElement microdata`).toBeGreaterThanOrEqual(1);
  191 |           const secondaryLinkClass = await pageHeader.locator("a").last().getAttribute("class");
  192 |           expect(secondaryLinkClass ?? "", `${target.path} page header secondary links should be visibly blue`).toContain("text-blue-700");
  193 |         }
  194 | 
  195 |         if (sharedProductCardPageNames.has(target.name)) {
  196 |           const cards = page.getByTestId("storefront-product-card");
  197 |           expect(await cards.count(), `${target.path} should use the shared storefront product card component`).toBeGreaterThanOrEqual(
  198 |             target.name === "shop-favorites" ? 10 : 5,
  199 |           );
  200 |           const firstCard = cards.first();
  201 |           await expect(firstCard, `${target.path} shared product card should expose Product microdata`).toHaveAttribute(
  202 |             "itemtype",
  203 |             "https://schema.org/Product",
  204 |           );
  205 |           await expect(
  206 |             firstCard.locator('[itemtype="https://schema.org/Offer"]'),
  207 |             `${target.path} shared product card should expose Offer microdata`,
  208 |           ).toHaveCount(1);
  209 |           await expect(
  210 |             firstCard.getByTestId("storefront-product-card-link"),
  211 |             `${target.path} shared product card should link to product detail`,
  212 |           ).toHaveAttribute("href", /\/s\/aiboux\/product\//);
  213 |           await expect(
  214 |             firstCard.getByTestId("storefront-product-card-category"),
  215 |             `${target.path} shared product card category should be crawlable`,
  216 |           ).toHaveAttribute("href", /\/s\/aiboux\/products\?category=/);
  217 |           expect(
  218 |             (await firstCard.getByTestId("storefront-product-card-title").getAttribute("class")) ?? "",
  219 |             `${target.path} shared product card title should be visibly link-colored`,
  220 |           ).toContain("text-blue-800");
  221 |           expect(
  222 |             (await firstCard.getByTestId("storefront-product-card-image").getAttribute("alt")) ?? "",
  223 |             `${target.path} shared product card image alt should describe the product`,
  224 |           ).toMatch(/商品画像/);
  225 |         }
  226 | 
  227 |         const jsonLdText = await page.locator('script[type="application/ld+json"]').first().textContent();
  228 |         const jsonLd = JSON.parse(jsonLdText || "{}");
  229 |         expect(jsonLd["@context"], `${target.path} structured data should use a single top-level schema.org context`).toBe("https://schema.org");
  230 |         expect(Array.isArray(jsonLd["@graph"]), `${target.path} structured data should be emitted as a connected @graph`).toBe(true);
  231 |         expect(jsonLd["@graph"].length, `${target.path} @graph should contain several connected storefront entities`).toBeGreaterThanOrEqual(5);
  232 |         expect((jsonLdText?.match(/"@context"/g) ?? []).length, `${target.path} should not repeat @context inside graph nodes`).toBe(1);
  233 |         expect(jsonLdText ?? "", `${target.path} should include BreadcrumbList JSON-LD`).toContain("BreadcrumbList");
  234 |         expect(jsonLdText ?? "", `${target.path} should include WebSite JSON-LD`).toContain("WebSite");
  235 |         expect(jsonLdText ?? "", `${target.path} should include Organization JSON-LD`).toContain("Organization");
  236 |         expect(jsonLdText ?? "", `${target.path} should identify the storefront as OnlineStore JSON-LD`).toContain("OnlineStore");
  237 |         expect(jsonLdText ?? "", `${target.path} should expose a stable store entity id`).toContain("#store");
  238 |         expect(jsonLdText ?? "", `${target.path} should expose a stable website entity id`).toContain("#website");
  239 |         expect(jsonLdText ?? "", `${target.path} WebPage should be linked to the WebSite entity`).toContain("isPartOf");
  240 |         expect(jsonLdText ?? "", `${target.path} WebPage should declare the storefront publisher`).toContain("publisher");
  241 |         expect(jsonLdText ?? "", `${target.path} WebPage should describe the storefront entity it is about`).toContain("about");
  242 |         expect(jsonLdText ?? "", `${target.path} should include merchant return policy JSON-LD`).toContain("MerchantReturnPolicy");
  243 |         expect(jsonLdText ?? "", `${target.path} should include shared site navigation JSON-LD`).toContain("SiteNavigationElement");
  244 |         expect(jsonLdText ?? "", `${target.path} should expose WebSite SearchAction matching storefront search`).toContain("SearchAction");
  245 |         expect(jsonLdText ?? "", `${target.path} SearchAction should target the products query URL`).toContain("products?q={search_term_string}");
  246 |         expect(jsonLdText ?? "", `${target.path} should expose a page entity JSON-LD`).toMatch(/WebPage|ContactPage|FAQPage|ItemPage|CollectionPage/);
  247 |         if (["shop-products-page", "shop-categories-page", "shop-favorites"].includes(target.name)) {
  248 |           expect(jsonLdText ?? "", `${target.path} discovery page should expose CollectionPage JSON-LD`).toContain("CollectionPage");
  249 |         }
  250 |         if (target.name === "shop-top") {
  251 |           expect(jsonLdText ?? "", `${target.path} should expose TOP product discovery ItemList JSON-LD`).toContain("ItemList");
  252 |           expect(jsonLdText ?? "", `${target.path} TOP ItemList should expose a stable entity id`).toContain("#itemlist");
  253 |           expect(jsonLdText ?? "", `${target.path} TOP ItemList should declare numberOfItems`).toContain("numberOfItems");
  254 |           expect(jsonLdText ?? "", `${target.path} TOP ItemList should link back to the WebPage entity`).toContain("mainEntityOfPage");
  255 |           expect(jsonLdText ?? "", `${target.path} TOP navigation graph should include breadcrumb support links`).toContain("タイムセール");
  256 |           expect(jsonLdText ?? "", `${target.path} TOP navigation graph should include page quality links`).toContain("配送条件");
> 257 |           expect(jsonLdText ?? "", `${target.path} TOP navigation graph should include buying guide links`).toContain("送料と配送を見る");
      |                                                                                                             ^ Error: /s/aiboux/ TOP navigation graph should include buying guide links
  258 |         }
  259 |         if (target.name === "shop-faq-page") {
  260 |           expect(jsonLdText ?? "", `${target.path} should expose FAQPage JSON-LD`).toContain("FAQPage");
  261 |           expect(jsonLdText ?? "", `${target.path} should expose FAQ question entities`).toContain("Question");
  262 |           expect(jsonLdText ?? "", `${target.path} should expose FAQ accepted answers`).toContain("acceptedAnswer");
  263 |         }
  264 |         if (target.name === "shop-contact-page") {
  265 |           expect(jsonLdText ?? "", `${target.path} should expose ContactPage JSON-LD`).toContain("ContactPage");
  266 |         }
  267 |         expect(jsonLdText ?? "", `${target.path} should include page-specific ItemList JSON-LD`).toContain("ItemList");
  268 |         expect(jsonLdText ?? "", `${target.path} ItemList should expose a stable entity id`).toContain("#itemlist");
  269 |         expect(jsonLdText ?? "", `${target.path} ItemList should declare numberOfItems`).toContain("numberOfItems");
  270 |         expect(jsonLdText ?? "", `${target.path} ItemList should link back to the WebPage entity`).toContain("mainEntityOfPage");
  271 | 
  272 |         const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  273 |         expect(canonical, `${target.path} should include a self-referencing canonical URL`).toBeTruthy();
  274 |         expect(canonical ?? "", `${target.path} canonical should point at shop.aiboux.com tenant URL`).toContain(`https://shop.aiboux.com${target.path}`);
  275 | 
  276 |         const titleText = await page.title();
  277 |         expect(titleText.length, `${target.path} should expose a useful SEO title`).toBeGreaterThanOrEqual(12);
  278 |         expect(titleText.length, `${target.path} SEO title should not be overly long`).toBeLessThanOrEqual(78);
  279 |         expect(titleText, `${target.path} title should not use thin placeholder copy`).not.toMatch(/公開中の商品を表示|AIBOUX Storeの公開ページ|ストアページ/);
  280 | 
  281 |         const metaDescription = await page.locator('meta[name="description"]').getAttribute("content");
  282 |         expect(metaDescription, `${target.path} should include meta description`).toBeTruthy();
  283 |         expect(metaDescription?.length ?? 0, `${target.path} meta description should explain purchase/search/support intent`).toBeGreaterThanOrEqual(45);
  284 |         expect(metaDescription?.length ?? 0, `${target.path} meta description should remain snippet-safe`).toBeLessThanOrEqual(155);
  285 |         expect(metaDescription ?? "", `${target.path} description should not use thin placeholder copy`).not.toMatch(/公開中の商品を表示|AIBOUX Storeの公開ページ|ストアへの問い合わせを受け付けます/);
  286 | 
  287 |         const robots = await page.locator('meta[name="robots"]').getAttribute("content");
  288 |         if (noIndexPublicPageNames.has(target.name)) {
  289 |           expect(robots ?? "", `${target.path} transactional/account page should not be indexed`).toContain("noindex");
  290 |           expect(robots ?? "", `${target.path} should still allow link following`).toContain("follow");
  291 |         } else {
  292 |           expect(robots ?? "", `${target.path} discovery/content page should be indexable`).toContain("index");
  293 |           expect(robots ?? "", `${target.path} should allow large image previews`).toContain("max-image-preview:large");
  294 |         }
  295 | 
  296 |         await expect(page.locator('meta[property="og:title"]'), `${target.path} should include Open Graph title`).toHaveCount(1);
  297 |         await expect(page.locator('meta[property="og:description"]'), `${target.path} should include Open Graph description`).toHaveCount(1);
  298 |         await expect(page.locator('meta[property="og:url"]'), `${target.path} should include Open Graph URL`).toHaveCount(1);
  299 |         await expect(page.locator('meta[property="og:image"]'), `${target.path} should include Open Graph image`).toHaveCount(1);
  300 |         await expect(page.locator('meta[property="og:url"]'), `${target.path} Open Graph URL should match canonical`).toHaveAttribute("content", canonical ?? "");
  301 |         const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  302 |         expect(ogImage ?? "", `${target.path} Open Graph image should be absolute`).toMatch(/^https:\/\/.+/);
  303 |         await expect(page.locator('meta[name="twitter:card"]'), `${target.path} should include Twitter Card metadata`).toHaveCount(1);
  304 |         await expect(page.locator('meta[name="twitter:card"]'), `${target.path} should use large image Twitter Card`).toHaveAttribute("content", "summary_large_image");
  305 |         await expect(page.locator('meta[name="twitter:description"]'), `${target.path} Twitter description should match meta description`).toHaveAttribute("content", metaDescription ?? "");
  306 |         await expect(page.locator('link[rel="alternate"][hreflang="ja-JP"]'), `${target.path} should include ja-JP alternate link`).toHaveCount(1);
  307 |         await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'), `${target.path} should include x-default alternate link`).toHaveCount(1);
  308 |         await expect(page.locator("h1"), `${target.path} should expose one primary heading`).toHaveCount(1);
  309 | 
  310 |         const bodyBox = await page.locator("body").boundingBox();
  311 |         expect(bodyBox?.width ?? 0, `${target.path} should render a styled page body`).toBeGreaterThan(300);
  312 | 
  313 |         if (target.name === "shop-top" || viewport.suffix === "1980") {
  314 |           await saveScreenshot(page, `${target.name}-${viewport.suffix}.png`);
  315 |         }
  316 |       }
  317 |     });
  318 |   }
  319 | 
  320 |   test("admin pages render and keep demo values absent", async ({ page, request }) => {
  321 |     await page.setViewportSize({ width: 1980, height: 1080 });
  322 |     for (const target of adminUrls) {
  323 |       const response = await request.get(target.path, { headers: { "cache-control": "no-cache" } });
  324 |       expect(response.status(), target.path).toBe(200);
  325 |       expect(response.headers()["content-type"] ?? "", target.path).toContain("text/html");
  326 | 
  327 |       await page.goto(`${target.path}?adminCrawl=${Date.now()}`, { waitUntil: "networkidle" });
  328 |       await expect(page.locator("body")).not.toContainText("2024/05");
  329 |       await expect(page.locator("body")).not.toContainText("山田 太郎");
  330 |       await expect(page.locator("body")).not.toContainText("#10085");
  331 |       await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  332 | 
  333 |       if (target.name === "shop-admin-design" || target.name === "shop-admin-subscriptions") {
  334 |         await saveScreenshot(page, `${target.name}.png`);
  335 |       }
  336 |     }
  337 |   });
  338 | 
  339 |   test("public storefront internal links resolve to implemented tenant pages", async ({ request }) => {
  340 |     const discovered = new Set<string>();
  341 | 
  342 |     for (const target of publicUrls) {
  343 |       const response = await request.get(target.path, { headers: { "cache-control": "no-cache" } });
  344 |       expect(response.status(), target.path).toBe(200);
  345 |       const html = await response.text();
  346 | 
  347 |       for (const match of html.matchAll(/href="([^"]+)"/g)) {
  348 |         const href = match[1];
  349 |         if (
  350 |           !href ||
  351 |           href.startsWith("#") ||
  352 |           href.startsWith("javascript:") ||
  353 |           href.startsWith("mailto:") ||
  354 |           href.startsWith("tel:")
  355 |         ) {
  356 |           continue;
  357 |         }
```