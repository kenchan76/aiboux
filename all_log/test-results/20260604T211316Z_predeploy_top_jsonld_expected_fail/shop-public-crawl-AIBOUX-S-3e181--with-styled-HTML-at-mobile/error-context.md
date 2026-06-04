# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-public-crawl.spec.ts >> AIBOUX Shop 5H sprint public crawl >> public storefront pages render with styled HTML at mobile
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
        - searchbox "キーワード・商品名・ブランド名で検索" [ref=e13]
        - button "商品を検索" [ref=e14]:
          - img [ref=e15]
      - link "カート 0" [ref=e18] [cursor=pointer]:
        - /url: /s/aiboux/cart
        - img [ref=e19]
        - text: カート
        - generic [ref=e23]: "0"
    - navigation [ref=e24]:
      - link "すべてのカテゴリー" [ref=e25] [cursor=pointer]:
        - /url: /s/aiboux/categories
      - link "食品・お菓子" [ref=e26] [cursor=pointer]:
        - /url: /s/aiboux/products?category=food-drink
      - link "日用品" [ref=e27] [cursor=pointer]:
        - /url: /s/aiboux/products?category=daily-goods
      - link "キッチン用品" [ref=e28] [cursor=pointer]:
        - /url: /s/aiboux/products?category=kitchen
      - link "ギフト" [ref=e29] [cursor=pointer]:
        - /url: /s/aiboux/products?category=gift
      - link "ビューティー" [ref=e30] [cursor=pointer]:
        - /url: /s/aiboux/products?category=beauty
      - link "ペット用品" [ref=e31] [cursor=pointer]:
        - /url: /s/aiboux/products?category=pet
      - link "スポーツ・アウトドア" [ref=e32] [cursor=pointer]:
        - /url: /s/aiboux/products?category=sports-outdoor
      - link "本・文具" [ref=e33] [cursor=pointer]:
        - /url: /s/aiboux/products?category=books-stationery
      - link "セール" [ref=e34] [cursor=pointer]:
        - /url: /s/aiboux/products?category=sale
      - link "ランキング" [ref=e35] [cursor=pointer]:
        - /url: /s/aiboux/products?category=ranking
  - main [ref=e36]:
    - generic [ref=e37]:
      - navigation "パンくずリスト" [ref=e38]:
        - generic [ref=e39]: 現在地
        - generic [ref=e41]: TOP
      - navigation "パンくず関連リンク" [ref=e42]:
        - link "タイムセール" [ref=e43] [cursor=pointer]:
          - /url: /s/aiboux/products?category=sale
          - generic [ref=e44]: タイムセール
        - link "ランキング" [ref=e45] [cursor=pointer]:
          - /url: /s/aiboux/products?category=ranking
          - generic [ref=e46]: ランキング
        - link "カテゴリ一覧" [ref=e47] [cursor=pointer]:
          - /url: /s/aiboux/categories
          - generic [ref=e48]: カテゴリ一覧
        - link "カート" [ref=e49] [cursor=pointer]:
          - /url: /s/aiboux/cart
          - generic [ref=e50]: カート
    - heading "株式会社雪花 公式ストア" [level=1] [ref=e51]
    - region "TOPヒーロースライダー" [ref=e52]:
      - generic [ref=e53]:
        - generic [ref=e54]:
          - article [ref=e55]:
            - generic [ref=e57]:
              - generic [ref=e58]: AIBOUX SALE
              - heading "贈り物にも使える暮らしのギフト" [level=2] [ref=e59]
              - paragraph [ref=e60]: タオル、ケア用品、食品ギフトを、価格とレビューで比較しながら選べます。
              - link "ギフトを見る" [ref=e61] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e62]:
            - generic [ref=e64]:
              - generic [ref=e65]: AIBOUX SALE
              - heading "毎日の暮らしを整える、雪花セレクト市" [level=2] [ref=e66]
              - paragraph [ref=e67]: 飲料、日用品、キッチン雑貨まで。今日ほしいものを見つけやすい売り場にまとめました。
              - link "おすすめを見る" [ref=e68] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e69]:
            - generic [ref=e71]:
              - generic [ref=e72]: AIBOUX SALE
              - heading "キッチンと食卓の定番をまとめ買い" [level=2] [ref=e73]
              - paragraph [ref=e74]: 保温ボトル、コーヒー、保存容器。日々の使いやすさで選べる定番アイテム。
              - link "売れ筋を見る" [ref=e75] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e76]:
            - generic [ref=e78]:
              - generic [ref=e79]: AIBOUX SALE
              - heading "贈り物にも使える暮らしのギフト" [level=2] [ref=e80]
              - paragraph [ref=e81]: タオル、ケア用品、食品ギフトを、価格とレビューで比較しながら選べます。
              - link "ギフトを見る" [ref=e82] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e83]:
            - generic [ref=e85]:
              - generic [ref=e86]: AIBOUX SALE
              - heading "毎日の暮らしを整える、雪花セレクト市" [level=2] [ref=e87]
              - paragraph [ref=e88]: 飲料、日用品、キッチン雑貨まで。今日ほしいものを見つけやすい売り場にまとめました。
              - link "おすすめを見る" [ref=e89] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e90]:
            - generic [ref=e92]:
              - generic [ref=e93]: AIBOUX SALE
              - heading "キッチンと食卓の定番をまとめ買い" [level=2] [ref=e94]
              - paragraph [ref=e95]: 保温ボトル、コーヒー、保存容器。日々の使いやすさで選べる定番アイテム。
              - link "売れ筋を見る" [ref=e96] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e97]:
            - generic [ref=e99]:
              - generic [ref=e100]: AIBOUX SALE
              - heading "贈り物にも使える暮らしのギフト" [level=2] [ref=e101]
              - paragraph [ref=e102]: タオル、ケア用品、食品ギフトを、価格とレビューで比較しながら選べます。
              - link "ギフトを見る" [ref=e103] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e104]:
            - generic [ref=e106]:
              - generic [ref=e107]: AIBOUX SALE
              - heading "毎日の暮らしを整える、雪花セレクト市" [level=2] [ref=e108]
              - paragraph [ref=e109]: 飲料、日用品、キッチン雑貨まで。今日ほしいものを見つけやすい売り場にまとめました。
              - link "おすすめを見る" [ref=e110] [cursor=pointer]:
                - /url: /s/aiboux/products
        - button "前のスライド" [ref=e111]:
          - img [ref=e112]
        - button "次のスライド" [ref=e114]:
          - img [ref=e115]
      - generic [ref=e117]:
        - button "スライド1へ移動" [ref=e118]
        - button "スライド2へ移動" [ref=e119]
        - button "スライド3へ移動" [ref=e120]
        - button "スライド4へ移動" [ref=e121]
        - button "スライド5へ移動" [ref=e122]
        - button "スライド6へ移動" [ref=e123]
    - generic [ref=e124]:
      - generic [ref=e125]:
        - generic [ref=e126]:
          - heading "おすすめ商品" [level=2] [ref=e127]
          - paragraph [ref=e128]: ヒーロースライダーの直下に公開商品を表示します。
        - generic [ref=e129]:
          - generic [ref=e130]: 3件
          - link "もっと見る" [ref=e131] [cursor=pointer]:
            - /url: /s/aiboux/products
      - generic [ref=e132]:
        - article [ref=e133]:
          - link "雪花セレクト ドリップコーヒー 20袋 コーヒー・お茶 ★★★★★ (860) 雪花セレクト ドリップコーヒー 20袋 ¥1,980 税込" [ref=e134] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-coffee
            - img "雪花セレクト ドリップコーヒー 20袋" [ref=e135]
            - generic [ref=e136]: コーヒー・お茶
            - generic [ref=e137]:
              - text: ★★★★★
              - generic [ref=e138]: (860)
            - heading "雪花セレクト ドリップコーヒー 20袋" [level=3] [ref=e139]
            - paragraph [ref=e140]: ¥1,980 税込
          - button "カートに追加" [ref=e141]
        - article [ref=e142]:
          - link "軽量ステンレスボトル 500ml キッチン用品 ★★★★★ (907) 軽量ステンレスボトル 500ml ¥2,480 税込" [ref=e143] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-bottle
            - img "軽量ステンレスボトル 500ml" [ref=e144]
            - generic [ref=e145]: キッチン用品
            - generic [ref=e146]:
              - text: ★★★★★
              - generic [ref=e147]: (907)
            - heading "軽量ステンレスボトル 500ml" [level=3] [ref=e148]
            - paragraph [ref=e149]: ¥2,480 税込
          - button "カートに追加" [ref=e150]
        - article [ref=e151]:
          - link "雪花セレクト ギフトタオル 2枚セット タオル・寝具 ★★★★★ (954) 雪花セレクト ギフトタオル 2枚セット ¥2,980 税込" [ref=e152] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-towel
            - img "雪花セレクト ギフトタオル 2枚セット" [ref=e153]
            - generic [ref=e154]: タオル・寝具
            - generic [ref=e155]:
              - text: ★★★★★
              - generic [ref=e156]: (954)
            - heading "雪花セレクト ギフトタオル 2枚セット" [level=3] [ref=e157]
            - paragraph [ref=e158]: ¥2,980 税込
          - button "カートに追加" [ref=e159]
        - article [ref=e160]:
          - link "キッチン保存容器 6点セット キッチン用品 ★★★★★ (1001) キッチン保存容器 6点セット ¥3,280 税込" [ref=e161] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-storage
            - img "キッチン保存容器 6点セット" [ref=e162]
            - generic [ref=e163]: キッチン用品
            - generic [ref=e164]:
              - text: ★★★★★
              - generic [ref=e165]: (1001)
            - heading "キッチン保存容器 6点セット" [level=3] [ref=e166]
            - paragraph [ref=e167]: ¥3,280 税込
          - button "カートに追加" [ref=e168]
        - article [ref=e169]:
          - link "毎日使えるホームケア洗剤セット 日用品 ★★★★★ (1048) 毎日使えるホームケア洗剤セット ¥1,680 税込" [ref=e170] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-cleaning
            - img "毎日使えるホームケア洗剤セット" [ref=e171]
            - generic [ref=e172]: 日用品
            - generic [ref=e173]:
              - text: ★★★★★
              - generic [ref=e174]: (1048)
            - heading "毎日使えるホームケア洗剤セット" [level=3] [ref=e175]
            - paragraph [ref=e176]: ¥1,680 税込
          - button "カートに追加" [ref=e177]
        - article [ref=e178]:
          - link "ナチュラルスキンケア 3点セット ビューティー ★★★★★ (1095) ナチュラルスキンケア 3点セット ¥4,280 税込" [ref=e179] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-skincare
            - img "ナチュラルスキンケア 3点セット" [ref=e180]
            - generic [ref=e181]: ビューティー
            - generic [ref=e182]:
              - text: ★★★★★
              - generic [ref=e183]: (1095)
            - heading "ナチュラルスキンケア 3点セット" [level=3] [ref=e184]
            - paragraph [ref=e185]: ¥4,280 税込
          - button "カートに追加" [ref=e186]
        - article [ref=e187]:
          - link "焼き菓子アソートボックス 食品・飲料 ★★★★★ (1142) 焼き菓子アソートボックス ¥2,380 税込" [ref=e188] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-snack
            - img "焼き菓子アソートボックス" [ref=e189]
            - generic [ref=e190]: 食品・飲料
            - generic [ref=e191]:
              - text: ★★★★★
              - generic [ref=e192]: (1142)
            - heading "焼き菓子アソートボックス" [level=3] [ref=e193]
            - paragraph [ref=e194]: ¥2,380 税込
          - button "カートに追加" [ref=e195]
        - article [ref=e196]:
          - link "ペットケアおでかけセット ペット用品 ★★★★★ (1189) ペットケアおでかけセット ¥3,480 税込" [ref=e197] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-pet
            - img "ペットケアおでかけセット" [ref=e198]
            - generic [ref=e199]: ペット用品
            - generic [ref=e200]:
              - text: ★★★★★
              - generic [ref=e201]: (1189)
            - heading "ペットケアおでかけセット" [level=3] [ref=e202]
            - paragraph [ref=e203]: ¥3,480 税込
          - button "カートに追加" [ref=e204]
        - article [ref=e205]:
          - link "季節のギフトボックス ギフト ★★★★★ (1236) 季節のギフトボックス ¥5,980 税込" [ref=e206] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-gift
            - img "季節のギフトボックス" [ref=e207]
            - generic [ref=e208]: ギフト
            - generic [ref=e209]:
              - text: ★★★★★
              - generic [ref=e210]: (1236)
            - heading "季節のギフトボックス" [level=3] [ref=e211]
            - paragraph [ref=e212]: ¥5,980 税込
          - button "カートに追加" [ref=e213]
        - article [ref=e214]:
          - link "国産茶葉ティーバッグ 30包 コーヒー・お茶 ★★★★★ (1283) 国産茶葉ティーバッグ 30包 ¥1,780 税込" [ref=e215] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-tea
            - img "国産茶葉ティーバッグ 30包" [ref=e216]
            - generic [ref=e217]: コーヒー・お茶
            - generic [ref=e218]:
              - text: ★★★★★
              - generic [ref=e219]: (1283)
            - heading "国産茶葉ティーバッグ 30包" [level=3] [ref=e220]
            - paragraph [ref=e221]: ¥1,780 税込
          - button "カートに追加" [ref=e222]
    - region "価格・配送・返品・決済を購入前に確認" [ref=e223]:
      - generic [ref=e224]:
        - generic [ref=e225]:
          - paragraph [ref=e226]: Purchase facts
          - heading "価格・配送・返品・決済を購入前に確認" [level=2] [ref=e227]
        - link "よくある質問" [ref=e228] [cursor=pointer]:
          - /url: /s/aiboux/faq
          - generic [ref=e229]: よくある質問
      - generic [ref=e230]:
        - link "税込 価格・税込表示 商品一覧、商品詳細、カートで税込価格を同じ形式で表示し、購入前の比較をしやすくします。 商品を比較" [ref=e231] [cursor=pointer]:
          - /url: /s/aiboux/products
          - generic [ref=e232]: 税込
          - heading "価格・税込表示" [level=3] [ref=e233]
          - paragraph [ref=e234]: 商品一覧、商品詳細、カートで税込価格を同じ形式で表示し、購入前の比較をしやすくします。
          - generic [ref=e235]: 商品を比較
        - link "配送 在庫・配送予定 在庫あり・在庫確認を明示。配送は通常2〜4営業日を目安に、追跡と送料条件を配送ページへ集約します。 配送条件を見る" [ref=e236] [cursor=pointer]:
          - /url: /s/aiboux/shipping
          - generic [ref=e237]: 配送
          - heading "在庫・配送予定" [level=3] [ref=e238]
          - paragraph [ref=e239]: 在庫あり・在庫確認を明示。配送は通常2〜4営業日を目安に、追跡と送料条件を配送ページへ集約します。
          - generic [ref=e240]: 配送条件を見る
        - link "返品 返品・キャンセル 未開封・未使用品、初期不良、到着後7日以内の問い合わせ条件を購入前に確認できます。 返品条件を見る" [ref=e241] [cursor=pointer]:
          - /url: /s/aiboux/returns
          - generic [ref=e242]: 返品
          - heading "返品・キャンセル" [level=3] [ref=e243]
          - paragraph [ref=e244]: 未開封・未使用品、初期不良、到着後7日以内の問い合わせ条件を購入前に確認できます。
          - generic [ref=e245]: 返品条件を見る
        - link "準備中 決済・定期購入 定期購入はDB migrationと決済接続が完了するまで申込み不可として表示します。成功したふりはしません。 注文前に確認" [ref=e246] [cursor=pointer]:
          - /url: /s/aiboux/checkout
          - generic [ref=e247]: 準備中
          - heading "決済・定期購入" [level=3] [ref=e248]
          - paragraph [ref=e249]: 定期購入はDB migrationと決済接続が完了するまで申込み不可として表示します。成功したふりはしません。
          - generic [ref=e250]: 注文前に確認
        - link "サポート 問い合わせ導線 商品名、注文番号、配送、返品、定期購入の確認事項を問い合わせページで整理します。 問い合わせる" [ref=e251] [cursor=pointer]:
          - /url: /s/aiboux/contact
          - generic [ref=e252]: サポート
          - heading "問い合わせ導線" [level=3] [ref=e253]
          - paragraph [ref=e254]: 商品名、注文番号、配送、返品、定期購入の確認事項を問い合わせページで整理します。
          - generic [ref=e255]: 問い合わせる
    - region "TOPページで確認できること" [ref=e256]:
      - generic [ref=e257]:
        - generic [ref=e258]:
          - paragraph [ref=e259]: Page quality
          - heading "TOPページで確認できること" [level=2] [ref=e260]
          - generic [ref=e261]:
            - paragraph [ref=e262]:
              - strong [ref=e263]: "検索意図:"
              - text: おすすめ、ランキング、タイムセール、カテゴリから商品発見を始める入口です。
            - paragraph [ref=e264]:
              - strong [ref=e265]: "SEO構造:"
              - text: ストア全体の主要カテゴリと購入サポートへリンクするハブページとして扱います。
            - paragraph [ref=e266]:
              - strong [ref=e267]: "次の操作:"
              - text: ヒーロー、商品カード、カテゴリ、フッターから商品詳細や購入条件へ移動します。
        - navigation "TOPページの購入・検索補助リンク" [ref=e268]:
          - link "発見 商品発見 おすすめ商品、ランキング、タイムセールを商品詳細へ直結します。 商品一覧" [ref=e269] [cursor=pointer]:
            - /url: /s/aiboux/products
            - generic [ref=e270]: 発見
            - heading "商品発見" [level=3] [ref=e271]
            - paragraph [ref=e272]: おすすめ商品、ランキング、タイムセールを商品詳細へ直結します。
            - generic [ref=e273]: 商品一覧
          - link "SEO カテゴリ導線 カテゴリURLを安定化し、食品・日用品・ギフトなどへ分岐します。 カテゴリ" [ref=e274] [cursor=pointer]:
            - /url: /s/aiboux/categories
            - generic [ref=e275]: SEO
            - heading "カテゴリ導線" [level=3] [ref=e276]
            - paragraph [ref=e277]: カテゴリURLを安定化し、食品・日用品・ギフトなどへ分岐します。
            - generic [ref=e278]: カテゴリ
          - link "購入前 価格・配送・返品 税込価格、配送目安、返品条件を購入前に確認できる導線を固定します。 配送条件" [ref=e279] [cursor=pointer]:
            - /url: /s/aiboux/shipping
            - generic [ref=e280]: 購入前
            - heading "価格・配送・返品" [level=3] [ref=e281]
            - paragraph [ref=e282]: 税込価格、配送目安、返品条件を購入前に確認できる導線を固定します。
            - generic [ref=e283]: 配送条件
          - link "支援 サポート導線 FAQ、問い合わせ、注文履歴へ戻れるクロール可能な内部リンクを維持します。 FAQ" [ref=e284] [cursor=pointer]:
            - /url: /s/aiboux/faq
            - generic [ref=e285]: 支援
            - heading "サポート導線" [level=3] [ref=e286]
            - paragraph [ref=e287]: FAQ、問い合わせ、注文履歴へ戻れるクロール可能な内部リンクを維持します。
            - generic [ref=e288]: FAQ
    - generic [ref=e289]:
      - generic [ref=e290]:
        - heading "売れ筋ランキング" [level=2] [ref=e291]
        - link "もっと見る" [ref=e292] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e293]:
        - link "1 軽量ステンレスボトル 500ml キッチン用品 軽量ステンレスボトル 500ml ¥2,480" [ref=e294] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-bottle
          - generic [ref=e295]: "1"
          - img "軽量ステンレスボトル 500ml" [ref=e296]
          - generic [ref=e297]: キッチン用品
          - generic [ref=e298]: 軽量ステンレスボトル 500ml
          - generic [ref=e299]: ¥2,480
        - link "2 雪花セレクト ギフトタオル 2枚セット タオル・寝具 雪花セレクト ギフトタオル 2枚セット ¥2,980" [ref=e300] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-towel
          - generic [ref=e301]: "2"
          - img "雪花セレクト ギフトタオル 2枚セット" [ref=e302]
          - generic [ref=e303]: タオル・寝具
          - generic [ref=e304]: 雪花セレクト ギフトタオル 2枚セット
          - generic [ref=e305]: ¥2,980
        - link "3 キッチン保存容器 6点セット キッチン用品 キッチン保存容器 6点セット ¥3,280" [ref=e306] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-storage
          - generic [ref=e307]: "3"
          - img "キッチン保存容器 6点セット" [ref=e308]
          - generic [ref=e309]: キッチン用品
          - generic [ref=e310]: キッチン保存容器 6点セット
          - generic [ref=e311]: ¥3,280
        - link "4 毎日使えるホームケア洗剤セット 日用品 毎日使えるホームケア洗剤セット ¥1,680" [ref=e312] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-cleaning
          - generic [ref=e313]: "4"
          - img "毎日使えるホームケア洗剤セット" [ref=e314]
          - generic [ref=e315]: 日用品
          - generic [ref=e316]: 毎日使えるホームケア洗剤セット
          - generic [ref=e317]: ¥1,680
        - link "5 ナチュラルスキンケア 3点セット ビューティー ナチュラルスキンケア 3点セット ¥4,280" [ref=e318] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-skincare
          - generic [ref=e319]: "5"
          - img "ナチュラルスキンケア 3点セット" [ref=e320]
          - generic [ref=e321]: ビューティー
          - generic [ref=e322]: ナチュラルスキンケア 3点セット
          - generic [ref=e323]: ¥4,280
    - generic [ref=e324]:
      - generic [ref=e325]:
        - heading "タイムセール" [level=2] [ref=e326]
        - link "もっと見る" [ref=e327] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e328]:
        - link "SALE キッチン保存容器 6点セット キッチン用品 キッチン保存容器 6点セット ¥3,280 ¥3,880" [ref=e329] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-storage
          - generic [ref=e330]: SALE
          - img "キッチン保存容器 6点セット" [ref=e331]
          - generic [ref=e332]: キッチン用品
          - generic [ref=e333]: キッチン保存容器 6点セット
          - generic [ref=e334]: ¥3,280
          - generic [ref=e335]: ¥3,880
        - link "SALE 毎日使えるホームケア洗剤セット 日用品 毎日使えるホームケア洗剤セット ¥1,680 ¥2,280" [ref=e336] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-cleaning
          - generic [ref=e337]: SALE
          - img "毎日使えるホームケア洗剤セット" [ref=e338]
          - generic [ref=e339]: 日用品
          - generic [ref=e340]: 毎日使えるホームケア洗剤セット
          - generic [ref=e341]: ¥1,680
          - generic [ref=e342]: ¥2,280
        - link "SALE ナチュラルスキンケア 3点セット ビューティー ナチュラルスキンケア 3点セット ¥4,280 ¥4,880" [ref=e343] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-skincare
          - generic [ref=e344]: SALE
          - img "ナチュラルスキンケア 3点セット" [ref=e345]
          - generic [ref=e346]: ビューティー
          - generic [ref=e347]: ナチュラルスキンケア 3点セット
          - generic [ref=e348]: ¥4,280
          - generic [ref=e349]: ¥4,880
        - link "SALE 焼き菓子アソートボックス 食品・飲料 焼き菓子アソートボックス ¥2,380 ¥2,980" [ref=e350] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-snack
          - generic [ref=e351]: SALE
          - img "焼き菓子アソートボックス" [ref=e352]
          - generic [ref=e353]: 食品・飲料
          - generic [ref=e354]: 焼き菓子アソートボックス
          - generic [ref=e355]: ¥2,380
          - generic [ref=e356]: ¥2,980
        - link "SALE ペットケアおでかけセット ペット用品 ペットケアおでかけセット ¥3,480 ¥4,080" [ref=e357] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-pet
          - generic [ref=e358]: SALE
          - img "ペットケアおでかけセット" [ref=e359]
          - generic [ref=e360]: ペット用品
          - generic [ref=e361]: ペットケアおでかけセット
          - generic [ref=e362]: ¥3,480
          - generic [ref=e363]: ¥4,080
    - generic [ref=e364]:
      - generic [ref=e365]:
        - heading "カテゴリー一覧" [level=2] [ref=e366]
        - link "もっと見る" [ref=e367] [cursor=pointer]:
          - /url: /s/aiboux/categories
      - generic [ref=e368]:
        - link "食品・飲料 食品・飲料" [ref=e369] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "食品・飲料" [ref=e370]
          - text: 食品・飲料
        - link "コーヒー・お茶 コーヒー・お茶" [ref=e371] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "コーヒー・お茶" [ref=e372]
          - text: コーヒー・お茶
        - link "キッチン用品 キッチン用品" [ref=e373] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "キッチン用品" [ref=e374]
          - text: キッチン用品
        - link "日用品 日用品" [ref=e375] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "日用品" [ref=e376]
          - text: 日用品
        - link "タオル・寝具 タオル・寝具" [ref=e377] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "タオル・寝具" [ref=e378]
          - text: タオル・寝具
        - link "ビューティー ビューティー" [ref=e379] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "ビューティー" [ref=e380]
          - text: ビューティー
        - link "ペット用品 ペット用品" [ref=e381] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "ペット用品" [ref=e382]
          - text: ペット用品
        - link "ギフト ギフト" [ref=e383] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "ギフト" [ref=e384]
          - text: ギフト
        - link "本・文具 本・文具" [ref=e385] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "本・文具" [ref=e386]
          - text: 本・文具
        - link "セール セール" [ref=e387] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "セール" [ref=e388]
          - text: セール
        - link "ランキング ランキング" [ref=e389] [cursor=pointer]:
          - /url: /s/aiboux/products
          - img "ランキング" [ref=e390]
          - text: ランキング
    - generic [ref=e391]:
      - generic [ref=e392]:
        - heading "人気ブランド" [level=2] [ref=e393]
        - link "もっと見る" [ref=e394] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e395]:
        - generic [ref=e396]: THERMOS
        - generic [ref=e397]: Panasonic
        - generic [ref=e398]: SHARP
        - generic [ref=e399]: dyson
        - generic [ref=e400]: IRIS OHYAMA
        - generic [ref=e401]: KIRIN
  - generic [ref=e402]:
    - region "株式会社雪花 公式ストア TOPページの購入前チェック" [ref=e403]:
      - generic [ref=e404]:
        - generic [ref=e405]:
          - paragraph [ref=e406]: Buying guide
          - heading "株式会社雪花 公式ストア TOPページの購入前チェック" [level=2] [ref=e407]
          - paragraph [ref=e408]: 価格、税込、配送、返品、決済、定期購入の未接続状態をページごとに整理し、購入判断と検索理解に必要な内部リンクを共通化します。
        - generic [ref=e409]: SEO内部リンク強化
      - generic [ref=e410]:
        - article [ref=e411]:
          - heading "TOPページから最短で商品を探すには。" [level=3] [ref=e412]
          - paragraph [ref=e413]: ヒーロー直下のおすすめ商品、ランキング、タイムセール、カテゴリから商品詳細へ直接進めます。
          - link "商品一覧へ" [ref=e414] [cursor=pointer]:
            - /url: /s/aiboux/products
        - article [ref=e415]:
          - heading "カテゴリ別に比較できますか。" [level=3] [ref=e416]
          - paragraph [ref=e417]: カテゴリURLは安定した検索向けURLとして用意し、食品、日用品、キッチン、ギフトなどへ分岐できます。
          - link "カテゴリを見る" [ref=e418] [cursor=pointer]:
            - /url: /s/aiboux/categories
        - article [ref=e419]:
          - heading "購入前に価格・税込・送料をどこで確認できますか。" [level=3] [ref=e420]
          - paragraph [ref=e421]: 商品カードと商品詳細は税込表示で揃え、送料と配送目安は配送ページへ集約しています。
          - link "送料と配送を見る" [ref=e422] [cursor=pointer]:
            - /url: /s/aiboux/shipping
        - article [ref=e423]:
          - heading "返品やキャンセル条件は注文前に確認できますか。" [level=3] [ref=e424]
          - paragraph [ref=e425]: 返品条件、未開封品、初期不良、問い合わせ期限を共通テンプレートで確認できます。
          - link "返品条件を見る" [ref=e426] [cursor=pointer]:
            - /url: /s/aiboux/returns
        - article [ref=e427]:
          - heading "決済や定期購入が未接続の場合はどう表示されますか。" [level=3] [ref=e428]
          - paragraph [ref=e429]: 成功したふりをせず、決済未接続や定期購入DB未適用を画面上で明示します。
          - link "注文前に確認" [ref=e430] [cursor=pointer]:
            - /url: /s/aiboux/checkout
        - article [ref=e431]:
          - heading "迷ったときはどのページへ進めばよいですか。" [level=3] [ref=e432]
          - paragraph [ref=e433]: 商品一覧、カテゴリ、FAQ、問い合わせへ戻れる内部リンクを全ページに配置しています。
          - link "FAQを見る" [ref=e434] [cursor=pointer]:
            - /url: /s/aiboux/faq
    - region "このページから次に確認すること" [ref=e435]:
      - generic [ref=e437]:
        - paragraph [ref=e438]: Related navigation
        - heading "このページから次に確認すること" [level=2] [ref=e439]
        - paragraph [ref=e440]: 商品発見、購入前確認、購入後サポートをページごとに整理し、SEOに必要な説明的リンクを共通化します。
      - navigation "関連する内部リンク" [ref=e441]:
        - generic [ref=e442]:
          - heading "商品を探す" [level=3] [ref=e443]
          - paragraph [ref=e444]: 価格、税込表示、レビュー、カテゴリ、在庫、配送条件を同じ導線で比較します。
          - list [ref=e445]:
            - listitem [ref=e446]:
              - link "すべての商品" [ref=e447] [cursor=pointer]:
                - /url: /s/aiboux/products
            - listitem [ref=e448]:
              - link "カテゴリ一覧" [ref=e449] [cursor=pointer]:
                - /url: /s/aiboux/categories
            - listitem [ref=e450]:
              - link "食品・飲料" [ref=e451] [cursor=pointer]:
                - /url: /s/aiboux/products?category=food-drink
            - listitem [ref=e452]:
              - link "日用品" [ref=e453] [cursor=pointer]:
                - /url: /s/aiboux/products?category=daily-goods
            - listitem [ref=e454]:
              - link "タイムセール" [ref=e455] [cursor=pointer]:
                - /url: /s/aiboux/products?category=sale
            - listitem [ref=e456]:
              - link "売れ筋ランキング" [ref=e457] [cursor=pointer]:
                - /url: /s/aiboux/products?category=ranking
        - generic [ref=e458]:
          - heading "購入前に確認" [level=3] [ref=e459]
          - paragraph [ref=e460]: 送料、返品、問い合わせ、取引条件を購入前に確認できるようにします。
          - list [ref=e461]:
            - listitem [ref=e462]:
              - link "カート" [ref=e463] [cursor=pointer]:
                - /url: /s/aiboux/cart
            - listitem [ref=e464]:
              - link "チェックアウト" [ref=e465] [cursor=pointer]:
                - /url: /s/aiboux/checkout
            - listitem [ref=e466]:
              - link "配送について" [ref=e467] [cursor=pointer]:
                - /url: /s/aiboux/shipping
            - listitem [ref=e468]:
              - link "返品について" [ref=e469] [cursor=pointer]:
                - /url: /s/aiboux/returns
            - listitem [ref=e470]:
              - link "特定商取引法" [ref=e471] [cursor=pointer]:
                - /url: /s/aiboux/legal
            - listitem [ref=e472]:
              - link "問い合わせ" [ref=e473] [cursor=pointer]:
                - /url: /s/aiboux/contact
        - generic [ref=e474]:
          - heading "購入後サポート" [level=3] [ref=e475]
          - paragraph [ref=e476]: 注文履歴、マイページ、定期購入、お気に入りへ迷わず戻れるようにします。
          - list [ref=e477]:
            - listitem [ref=e478]:
              - link "マイページ" [ref=e479] [cursor=pointer]:
                - /url: /s/aiboux/mypage
            - listitem [ref=e480]:
              - link "注文履歴" [ref=e481] [cursor=pointer]:
                - /url: /s/aiboux/orders
            - listitem [ref=e482]:
              - link "お気に入り" [ref=e483] [cursor=pointer]:
                - /url: /s/aiboux/favorites
            - listitem [ref=e484]:
              - link "定期購入" [ref=e485] [cursor=pointer]:
                - /url: /s/aiboux/mypage/subscriptions
            - listitem [ref=e486]:
              - link "ログイン" [ref=e487] [cursor=pointer]:
                - /url: /s/aiboux/login
            - listitem [ref=e488]:
              - link "会員登録" [ref=e489] [cursor=pointer]:
                - /url: /s/aiboux/register
    - region "株式会社雪花 公式ストアで迷わず探す" [ref=e490]:
      - generic [ref=e491]:
        - generic [ref=e492]:
          - paragraph [ref=e493]: Store navigation
          - heading "株式会社雪花 公式ストアで迷わず探す" [level=2] [ref=e494]
          - paragraph [ref=e495]: 商品、カテゴリ、配送、返品、注文履歴を説明的なリンクで整理します。検索エンジンにもユーザーにも分かる、共通の内部リンク導線です。
        - link "商品一覧へ" [ref=e496] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e497]:
        - navigation "株式会社雪花 公式ストア SEO内部リンク" [ref=e498]:
          - generic [ref=e499]:
            - heading "人気カテゴリ" [level=3] [ref=e500]
            - list [ref=e501]:
              - listitem [ref=e502]:
                - link "食品・飲料を比較する" [ref=e503] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=food-drink
              - listitem [ref=e504]:
                - link "コーヒー・お茶を見る" [ref=e505] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=coffee-tea
              - listitem [ref=e506]:
                - link "キッチン用品を探す" [ref=e507] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=kitchen
              - listitem [ref=e508]:
                - link "日用品をまとめ買いする" [ref=e509] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=daily-goods
              - listitem [ref=e510]:
                - link "ギフト商品を選ぶ" [ref=e511] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=gift
          - generic [ref=e512]:
            - heading "購入前ガイド" [level=3] [ref=e513]
            - list [ref=e514]:
              - listitem [ref=e515]:
                - link "送料と配送予定を確認する" [ref=e516] [cursor=pointer]:
                  - /url: /s/aiboux/shipping
              - listitem [ref=e517]:
                - link "返品・交換条件を確認する" [ref=e518] [cursor=pointer]:
                  - /url: /s/aiboux/returns
              - listitem [ref=e519]:
                - link "よくある質問を見る" [ref=e520] [cursor=pointer]:
                  - /url: /s/aiboux/faq
              - listitem [ref=e521]:
                - link "ストアへ問い合わせる" [ref=e522] [cursor=pointer]:
                  - /url: /s/aiboux/contact
          - generic [ref=e523]:
            - heading "購入後サポート" [level=3] [ref=e524]
            - list [ref=e525]:
              - listitem [ref=e526]:
                - link "注文履歴を確認する" [ref=e527] [cursor=pointer]:
                  - /url: /s/aiboux/orders
              - listitem [ref=e528]:
                - link "マイページを開く" [ref=e529] [cursor=pointer]:
                  - /url: /s/aiboux/mypage
              - listitem [ref=e530]:
                - link "お気に入り商品を見る" [ref=e531] [cursor=pointer]:
                  - /url: /s/aiboux/favorites
              - listitem [ref=e532]:
                - link "定期購入の状態を見る" [ref=e533] [cursor=pointer]:
                  - /url: /s/aiboux/mypage/subscriptions
        - complementary "購入判断の要点" [ref=e534]:
          - link "商品比較 価格、税込、レビュー、在庫、配送目安を同じ商品カードで比較します。 商品一覧" [ref=e535] [cursor=pointer]:
            - /url: /s/aiboux/products
            - text: 商品比較
            - generic [ref=e536]: 価格、税込、レビュー、在庫、配送目安を同じ商品カードで比較します。
            - generic [ref=e537]: 商品一覧
          - link "購入条件 送料、返品、特商法、決済設定状態を注文前に確認できます。 取引条件" [ref=e538] [cursor=pointer]:
            - /url: /s/aiboux/legal
            - text: 購入条件
            - generic [ref=e539]: 送料、返品、特商法、決済設定状態を注文前に確認できます。
            - generic [ref=e540]: 取引条件
          - link "アカウント 注文履歴、配送状況、定期購入、お気に入りを同じ導線で確認します。 マイページ" [ref=e541] [cursor=pointer]:
            - /url: /s/aiboux/mypage
            - text: アカウント
            - generic [ref=e542]: 注文履歴、配送状況、定期購入、お気に入りを同じ導線で確認します。
            - generic [ref=e543]: マイページ
    - region "迷わず買えるための確認導線" [ref=e544]:
      - generic [ref=e545]:
        - generic [ref=e546]:
          - paragraph [ref=e547]: Shopping guide
          - heading "迷わず買えるための確認導線" [level=2] [ref=e548]
          - paragraph [ref=e549]: 商品比較、配送・返品、注文後の確認、定期購入の状態まで、SEOに忠実な内部リンクで移動できます。
        - link "商品一覧を見る" [ref=e550] [cursor=pointer]:
          - /url: /s/aiboux/products
          - generic [ref=e551]: 商品一覧を見る
      - generic [ref=e552]:
        - link "商品を探す 商品一覧、カテゴリ、ランキングから価格・税込・在庫・レビューを比較できます。 商品一覧へ" [ref=e553] [cursor=pointer]:
          - /url: /s/aiboux/products
          - heading "商品を探す" [level=3] [ref=e554]
          - paragraph [ref=e555]: 商品一覧、カテゴリ、ランキングから価格・税込・在庫・レビューを比較できます。
          - generic [ref=e556]: 商品一覧へ
        - link "購入前に確認 送料、返品条件、決済設定状態、特定商取引法の表示を注文前に確認できます。 配送条件を見る" [ref=e557] [cursor=pointer]:
          - /url: /s/aiboux/shipping
          - heading "購入前に確認" [level=3] [ref=e558]
          - paragraph [ref=e559]: 送料、返品条件、決済設定状態、特定商取引法の表示を注文前に確認できます。
          - generic [ref=e560]: 配送条件を見る
        - link "注文後の確認 注文履歴、配送状況、問い合わせ、領収書導線を同じマイページ導線で確認します。 注文履歴へ" [ref=e561] [cursor=pointer]:
          - /url: /s/aiboux/orders
          - heading "注文後の確認" [level=3] [ref=e562]
          - paragraph [ref=e563]: 注文履歴、配送状況、問い合わせ、領収書導線を同じマイページ導線で確認します。
          - generic [ref=e564]: 注文履歴へ
        - link "定期購入 定期購入は本番DB migrationと決済接続が完了するまで、準備中として正直に表示します。 定期購入を見る" [ref=e565] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
          - heading "定期購入" [level=3] [ref=e566]
          - paragraph [ref=e567]: 定期購入は本番DB migrationと決済接続が完了するまで、準備中として正直に表示します。
          - generic [ref=e568]: 定期購入を見る
      - navigation "購入サポートの内部リンク" [ref=e569]:
        - link "カテゴリから探す" [ref=e570] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "カートを見る" [ref=e571] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e572] [cursor=pointer]:
          - /url: /s/aiboux/checkout
        - link "問い合わせ" [ref=e573] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e574] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "返品について" [ref=e575] [cursor=pointer]:
          - /url: /s/aiboux/returns
        - link "マイページ" [ref=e576] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "お気に入り" [ref=e577] [cursor=pointer]:
          - /url: /s/aiboux/favorites
  - contentinfo [ref=e578]:
    - link "ページ上部へ戻る" [ref=e579] [cursor=pointer]:
      - /url: "#top"
    - generic [ref=e580]:
      - generic [ref=e581]:
        - heading "税込価格" [level=2] [ref=e582]
        - paragraph [ref=e583]: 商品価格は税込表示で統一します。
      - generic [ref=e584]:
        - heading "配送・返品" [level=2] [ref=e585]
        - paragraph [ref=e586]: 配送予定、返品条件、問い合わせ先を各ページから確認できます。
      - generic [ref=e587]:
        - heading "決済状態" [level=2] [ref=e588]
        - paragraph [ref=e589]: 決済未接続時は注文確定したふりをせず、設定未完了として表示します。
      - generic [ref=e590]:
        - heading "定期購入" [level=2] [ref=e591]
        - paragraph [ref=e592]: 定期購入はDB migrationと決済接続が完了するまで正直に準備中表示にします。
    - generic [ref=e593]:
      - navigation "お買い物" [ref=e594]:
        - heading "お買い物" [level=2] [ref=e595]
        - link "商品一覧" [ref=e596] [cursor=pointer]:
          - /url: /s/aiboux/products
        - link "カテゴリ" [ref=e597] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "タイムセール" [ref=e598] [cursor=pointer]:
          - /url: /s/aiboux/products?category=sale
        - link "売れ筋ランキング" [ref=e599] [cursor=pointer]:
          - /url: /s/aiboux/products?category=ranking
        - link "お気に入り" [ref=e600] [cursor=pointer]:
          - /url: /s/aiboux/favorites
      - navigation "アカウント" [ref=e601]:
        - heading "アカウント" [level=2] [ref=e602]
        - link "マイページ" [ref=e603] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "注文履歴" [ref=e604] [cursor=pointer]:
          - /url: /s/aiboux/orders
        - link "定期購入" [ref=e605] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
        - link "ログイン" [ref=e606] [cursor=pointer]:
          - /url: /s/aiboux/login
      - navigation "サポート" [ref=e607]:
        - heading "サポート" [level=2] [ref=e608]
        - link "問い合わせ" [ref=e609] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e610] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "配送について" [ref=e611] [cursor=pointer]:
          - /url: /s/aiboux/shipping
        - link "返品について" [ref=e612] [cursor=pointer]:
          - /url: /s/aiboux/returns
      - navigation "ストア情報" [ref=e613]:
        - heading "ストア情報" [level=2] [ref=e614]
        - link "特定商取引法" [ref=e615] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシーポリシー" [ref=e616] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "カート" [ref=e617] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e618] [cursor=pointer]:
          - /url: /s/aiboux/checkout
    - generic [ref=e620]:
      - generic [ref=e621]:
        - generic [ref=e622]: 株式会社雪花 公式ストア
        - paragraph [ref=e623]: 注文、配送、返品、定期購入、問い合わせまで同じテナント導線で確認できます。決済未接続時は注文確定しません。
      - navigation "ストア基本情報" [ref=e624]:
        - link "特商法" [ref=e625] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシー" [ref=e626] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "問い合わせ" [ref=e627] [cursor=pointer]:
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