# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-functional-public.spec.ts >> AIBOUX Shop public functional hardening >> store design editor saves top hero changes and restores original layout
- Location: tests/shop-functional-public.spec.ts:173:3

# Error details

```
Error: layout POST from design editor save

expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - navigation "ページ内ショートカット":
    - link "本文へスキップ" [ref=e3] [cursor=pointer]:
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
      - link "カート 0" [ref=e24] [cursor=pointer]:
        - /url: /s/aiboux/cart
        - img [ref=e25]
        - text: カート
        - generic [ref=e29]: "0"
    - navigation "ストアカテゴリナビ" [ref=e30]:
      - link "すべてのカテゴリー" [ref=e31] [cursor=pointer]:
        - /url: /s/aiboux/categories
      - link "食品・お菓子" [ref=e32] [cursor=pointer]:
        - /url: /s/aiboux/products?category=food-drink
      - link "日用品" [ref=e33] [cursor=pointer]:
        - /url: /s/aiboux/products?category=daily-goods
      - link "キッチン用品" [ref=e34] [cursor=pointer]:
        - /url: /s/aiboux/products?category=kitchen
      - link "ギフト" [ref=e35] [cursor=pointer]:
        - /url: /s/aiboux/products?category=gift
      - link "ビューティー" [ref=e36] [cursor=pointer]:
        - /url: /s/aiboux/products?category=beauty
      - link "ペット用品" [ref=e37] [cursor=pointer]:
        - /url: /s/aiboux/products?category=pet
      - link "スポーツ・アウトドア" [ref=e38] [cursor=pointer]:
        - /url: /s/aiboux/products?category=sports-outdoor
      - link "本・文具" [ref=e39] [cursor=pointer]:
        - /url: /s/aiboux/products?category=books-stationery
      - link "セール" [ref=e40] [cursor=pointer]:
        - /url: /s/aiboux/products?category=sale
      - link "ランキング" [ref=e41] [cursor=pointer]:
        - /url: /s/aiboux/products?category=ranking
  - main [ref=e42]:
    - generic [ref=e43]:
      - navigation "パンくずリスト" [ref=e44]:
        - generic [ref=e45]: 現在地
        - generic [ref=e47]: TOP
      - navigation "パンくず関連リンク" [ref=e48]:
        - link "タイムセール" [ref=e49] [cursor=pointer]:
          - /url: /s/aiboux/products?category=sale
          - generic [ref=e50]: タイムセール
        - link "ランキング" [ref=e51] [cursor=pointer]:
          - /url: /s/aiboux/products?category=ranking
          - generic [ref=e52]: ランキング
        - link "カテゴリ一覧" [ref=e53] [cursor=pointer]:
          - /url: /s/aiboux/categories
          - generic [ref=e54]: カテゴリ一覧
        - link "カート" [ref=e55] [cursor=pointer]:
          - /url: /s/aiboux/cart
          - generic [ref=e56]: カート
    - heading "株式会社雪花 公式ストア" [level=1] [ref=e57]
    - region "TOPヒーロースライダー" [ref=e58]:
      - generic [ref=e59]:
        - generic [ref=e60]:
          - article [ref=e61]:
            - generic [ref=e63]:
              - generic [ref=e64]: AIBOUX SALE
              - heading "贈り物にも使える暮らしのギフト" [level=2] [ref=e65]
              - paragraph [ref=e66]: タオル、ケア用品、食品ギフトを、価格とレビューで比較しながら選べます。
              - link "ギフトを見る" [ref=e67] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e68]:
            - generic [ref=e70]:
              - generic [ref=e71]: AIBOUX SALE
              - heading "毎日の暮らしを整える、雪花セレクト市" [level=2] [ref=e72]
              - paragraph [ref=e73]: 飲料、日用品、キッチン雑貨まで。今日ほしいものを見つけやすい売り場にまとめました。
              - link "おすすめを見る" [ref=e74] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e75]:
            - generic [ref=e77]:
              - generic [ref=e78]: AIBOUX SALE
              - heading "キッチンと食卓の定番をまとめ買い" [level=2] [ref=e79]
              - paragraph [ref=e80]: 保温ボトル、コーヒー、保存容器。日々の使いやすさで選べる定番アイテム。
              - link "売れ筋を見る" [ref=e81] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e82]:
            - generic [ref=e84]:
              - generic [ref=e85]: AIBOUX SALE
              - heading "贈り物にも使える暮らしのギフト" [level=2] [ref=e86]
              - paragraph [ref=e87]: タオル、ケア用品、食品ギフトを、価格とレビューで比較しながら選べます。
              - link "ギフトを見る" [ref=e88] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e89]:
            - generic [ref=e91]:
              - generic [ref=e92]: AIBOUX SALE
              - heading "毎日の暮らしを整える、雪花セレクト市" [level=2] [ref=e93]
              - paragraph [ref=e94]: 飲料、日用品、キッチン雑貨まで。今日ほしいものを見つけやすい売り場にまとめました。
              - link "おすすめを見る" [ref=e95] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e96]:
            - generic [ref=e98]:
              - generic [ref=e99]: AIBOUX SALE
              - heading "キッチンと食卓の定番をまとめ買い" [level=2] [ref=e100]
              - paragraph [ref=e101]: 保温ボトル、コーヒー、保存容器。日々の使いやすさで選べる定番アイテム。
              - link "売れ筋を見る" [ref=e102] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e103]:
            - generic [ref=e105]:
              - generic [ref=e106]: AIBOUX SALE
              - heading "贈り物にも使える暮らしのギフト" [level=2] [ref=e107]
              - paragraph [ref=e108]: タオル、ケア用品、食品ギフトを、価格とレビューで比較しながら選べます。
              - link "ギフトを見る" [ref=e109] [cursor=pointer]:
                - /url: /s/aiboux/products
          - article [ref=e110]:
            - generic [ref=e112]:
              - generic [ref=e113]: AIBOUX SALE
              - heading "毎日の暮らしを整える、雪花セレクト市" [level=2] [ref=e114]
              - paragraph [ref=e115]: 飲料、日用品、キッチン雑貨まで。今日ほしいものを見つけやすい売り場にまとめました。
              - link "おすすめを見る" [ref=e116] [cursor=pointer]:
                - /url: /s/aiboux/products
        - button "前のスライド" [ref=e117]:
          - img [ref=e118]
        - button "次のスライド" [ref=e120]:
          - img [ref=e121]
      - generic [ref=e123]:
        - button "スライド1へ移動" [ref=e124]
        - button "スライド2へ移動" [ref=e125]
        - button "スライド3へ移動" [ref=e126]
        - button "スライド4へ移動" [ref=e127]
        - button "スライド5へ移動" [ref=e128]
        - button "スライド6へ移動" [ref=e129]
    - generic [ref=e130]:
      - generic [ref=e131]:
        - generic [ref=e132]:
          - heading "おすすめ商品" [level=2] [ref=e133]
          - paragraph [ref=e134]: 画像、価格、レビュー、配送目安をそろえて、今週の定番商品を選べます。
        - generic [ref=e135]:
          - generic [ref=e136]: 18件
          - link "もっと見る" [ref=e137] [cursor=pointer]:
            - /url: /s/aiboux/products
      - generic [ref=e138]:
        - article [ref=e139]:
          - link "雪花セレクト ドリップコーヒー 20袋 商品画像" [ref=e140] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-coffee
            - img "雪花セレクト ドリップコーヒー 20袋 商品画像" [ref=e141]
          - generic [ref=e142]: コーヒー・お茶
          - link "★★★★★ (860) 雪花セレクト ドリップコーヒー 20袋" [ref=e143] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-coffee
            - generic [ref=e144]:
              - text: ★★★★★
              - generic [ref=e145]: (860)
            - heading "雪花セレクト ドリップコーヒー 20袋" [level=3] [ref=e146]
          - paragraph [ref=e147]: ¥1,980 税込
          - button "カートに追加" [ref=e148]
        - article [ref=e149]:
          - link "軽量ステンレスボトル 500ml 商品画像" [ref=e150] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-bottle
            - img "軽量ステンレスボトル 500ml 商品画像" [ref=e151]
          - generic [ref=e152]: キッチン用品
          - link "★★★★★ (907) 軽量ステンレスボトル 500ml" [ref=e153] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-bottle
            - generic [ref=e154]:
              - text: ★★★★★
              - generic [ref=e155]: (907)
            - heading "軽量ステンレスボトル 500ml" [level=3] [ref=e156]
          - paragraph [ref=e157]: ¥2,480 税込
          - button "カートに追加" [ref=e158]
        - article [ref=e159]:
          - link "雪花セレクト ギフトタオル 2枚セット 商品画像" [ref=e160] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-towel
            - img "雪花セレクト ギフトタオル 2枚セット 商品画像" [ref=e161]
          - generic [ref=e162]: タオル・寝具
          - link "★★★★★ (954) 雪花セレクト ギフトタオル 2枚セット" [ref=e163] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-towel
            - generic [ref=e164]:
              - text: ★★★★★
              - generic [ref=e165]: (954)
            - heading "雪花セレクト ギフトタオル 2枚セット" [level=3] [ref=e166]
          - paragraph [ref=e167]: ¥2,980 税込
          - button "カートに追加" [ref=e168]
        - article [ref=e169]:
          - link "キッチン保存容器 6点セット 商品画像" [ref=e170] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-storage
            - img "キッチン保存容器 6点セット 商品画像" [ref=e171]
          - generic [ref=e172]: キッチン用品
          - link "★★★★★ (1001) キッチン保存容器 6点セット" [ref=e173] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-storage
            - generic [ref=e174]:
              - text: ★★★★★
              - generic [ref=e175]: (1001)
            - heading "キッチン保存容器 6点セット" [level=3] [ref=e176]
          - paragraph [ref=e177]: ¥3,280 税込
          - button "カートに追加" [ref=e178]
        - article [ref=e179]:
          - link "毎日使えるホームケア洗剤セット 商品画像" [ref=e180] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-cleaning
            - img "毎日使えるホームケア洗剤セット 商品画像" [ref=e181]
          - generic [ref=e182]: 日用品
          - link "★★★★★ (1048) 毎日使えるホームケア洗剤セット" [ref=e183] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-cleaning
            - generic [ref=e184]:
              - text: ★★★★★
              - generic [ref=e185]: (1048)
            - heading "毎日使えるホームケア洗剤セット" [level=3] [ref=e186]
          - paragraph [ref=e187]: ¥1,680 税込
          - button "カートに追加" [ref=e188]
        - article [ref=e189]:
          - link "ナチュラルスキンケア 3点セット 商品画像" [ref=e190] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-skincare
            - img "ナチュラルスキンケア 3点セット 商品画像" [ref=e191]
          - generic [ref=e192]: ビューティー
          - link "★★★★★ (1095) ナチュラルスキンケア 3点セット" [ref=e193] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-skincare
            - generic [ref=e194]:
              - text: ★★★★★
              - generic [ref=e195]: (1095)
            - heading "ナチュラルスキンケア 3点セット" [level=3] [ref=e196]
          - paragraph [ref=e197]: ¥4,280 税込
          - button "カートに追加" [ref=e198]
        - article [ref=e199]:
          - link "焼き菓子アソートボックス 商品画像" [ref=e200] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-snack
            - img "焼き菓子アソートボックス 商品画像" [ref=e201]
          - generic [ref=e202]: 食品・飲料
          - link "★★★★★ (1142) 焼き菓子アソートボックス" [ref=e203] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-snack
            - generic [ref=e204]:
              - text: ★★★★★
              - generic [ref=e205]: (1142)
            - heading "焼き菓子アソートボックス" [level=3] [ref=e206]
          - paragraph [ref=e207]: ¥2,380 税込
          - button "カートに追加" [ref=e208]
        - article [ref=e209]:
          - link "ペットケアおでかけセット 商品画像" [ref=e210] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-pet
            - img "ペットケアおでかけセット 商品画像" [ref=e211]
          - generic [ref=e212]: ペット用品
          - link "★★★★★ (1189) ペットケアおでかけセット" [ref=e213] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-pet
            - generic [ref=e214]:
              - text: ★★★★★
              - generic [ref=e215]: (1189)
            - heading "ペットケアおでかけセット" [level=3] [ref=e216]
          - paragraph [ref=e217]: ¥3,480 税込
          - button "カートに追加" [ref=e218]
        - article [ref=e219]:
          - link "季節のギフトボックス 商品画像" [ref=e220] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-gift
            - img "季節のギフトボックス 商品画像" [ref=e221]
          - generic [ref=e222]: ギフト
          - link "★★★★★ (1236) 季節のギフトボックス" [ref=e223] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-gift
            - generic [ref=e224]:
              - text: ★★★★★
              - generic [ref=e225]: (1236)
            - heading "季節のギフトボックス" [level=3] [ref=e226]
          - paragraph [ref=e227]: ¥5,980 税込
          - button "カートに追加" [ref=e228]
        - article [ref=e229]:
          - link "国産茶葉ティーバッグ 30包 商品画像" [ref=e230] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-tea
            - img "国産茶葉ティーバッグ 30包 商品画像" [ref=e231]
          - generic [ref=e232]: コーヒー・お茶
          - link "★★★★★ (1283) 国産茶葉ティーバッグ 30包" [ref=e233] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-tea
            - generic [ref=e234]:
              - text: ★★★★★
              - generic [ref=e235]: (1283)
            - heading "国産茶葉ティーバッグ 30包" [level=3] [ref=e236]
          - paragraph [ref=e237]: ¥1,780 税込
          - button "カートに追加" [ref=e238]
    - generic [ref=e239]:
      - generic [ref=e240]:
        - heading "売れ筋ランキング" [level=2] [ref=e241]
        - link "もっと見る" [ref=e242] [cursor=pointer]:
          - /url: /s/aiboux/products?category=ranking
      - generic [ref=e243]:
        - link "1 軽量ステンレスボトル 500ml キッチン用品 軽量ステンレスボトル 500ml ¥2,480" [ref=e244] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-bottle
          - generic [ref=e245]: "1"
          - img "軽量ステンレスボトル 500ml" [ref=e246]
          - generic [ref=e247]: キッチン用品
          - generic [ref=e248]: 軽量ステンレスボトル 500ml
          - generic [ref=e249]: ¥2,480
        - link "2 雪花セレクト ギフトタオル 2枚セット タオル・寝具 雪花セレクト ギフトタオル 2枚セット ¥2,980" [ref=e250] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-towel
          - generic [ref=e251]: "2"
          - img "雪花セレクト ギフトタオル 2枚セット" [ref=e252]
          - generic [ref=e253]: タオル・寝具
          - generic [ref=e254]: 雪花セレクト ギフトタオル 2枚セット
          - generic [ref=e255]: ¥2,980
        - link "3 キッチン保存容器 6点セット キッチン用品 キッチン保存容器 6点セット ¥3,280" [ref=e256] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-storage
          - generic [ref=e257]: "3"
          - img "キッチン保存容器 6点セット" [ref=e258]
          - generic [ref=e259]: キッチン用品
          - generic [ref=e260]: キッチン保存容器 6点セット
          - generic [ref=e261]: ¥3,280
        - link "4 毎日使えるホームケア洗剤セット 日用品 毎日使えるホームケア洗剤セット ¥1,680" [ref=e262] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-cleaning
          - generic [ref=e263]: "4"
          - img "毎日使えるホームケア洗剤セット" [ref=e264]
          - generic [ref=e265]: 日用品
          - generic [ref=e266]: 毎日使えるホームケア洗剤セット
          - generic [ref=e267]: ¥1,680
        - link "5 ナチュラルスキンケア 3点セット ビューティー ナチュラルスキンケア 3点セット ¥4,280" [ref=e268] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-skincare
          - generic [ref=e269]: "5"
          - img "ナチュラルスキンケア 3点セット" [ref=e270]
          - generic [ref=e271]: ビューティー
          - generic [ref=e272]: ナチュラルスキンケア 3点セット
          - generic [ref=e273]: ¥4,280
    - generic [ref=e274]:
      - generic [ref=e275]:
        - heading "タイムセール" [level=2] [ref=e276]
        - link "もっと見る" [ref=e277] [cursor=pointer]:
          - /url: /s/aiboux/products?category=sale
      - generic [ref=e278]:
        - link "SALE キッチン保存容器 6点セット キッチン用品 キッチン保存容器 6点セット ¥3,280 ¥3,880" [ref=e279] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-storage
          - generic [ref=e280]: SALE
          - img "キッチン保存容器 6点セット" [ref=e281]
          - generic [ref=e282]: キッチン用品
          - generic [ref=e283]: キッチン保存容器 6点セット
          - generic [ref=e284]: ¥3,280
          - generic [ref=e285]: ¥3,880
        - link "SALE 毎日使えるホームケア洗剤セット 日用品 毎日使えるホームケア洗剤セット ¥1,680 ¥2,280" [ref=e286] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-cleaning
          - generic [ref=e287]: SALE
          - img "毎日使えるホームケア洗剤セット" [ref=e288]
          - generic [ref=e289]: 日用品
          - generic [ref=e290]: 毎日使えるホームケア洗剤セット
          - generic [ref=e291]: ¥1,680
          - generic [ref=e292]: ¥2,280
        - link "SALE ナチュラルスキンケア 3点セット ビューティー ナチュラルスキンケア 3点セット ¥4,280 ¥4,880" [ref=e293] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-skincare
          - generic [ref=e294]: SALE
          - img "ナチュラルスキンケア 3点セット" [ref=e295]
          - generic [ref=e296]: ビューティー
          - generic [ref=e297]: ナチュラルスキンケア 3点セット
          - generic [ref=e298]: ¥4,280
          - generic [ref=e299]: ¥4,880
        - link "SALE 焼き菓子アソートボックス 食品・飲料 焼き菓子アソートボックス ¥2,380 ¥2,980" [ref=e300] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-snack
          - generic [ref=e301]: SALE
          - img "焼き菓子アソートボックス" [ref=e302]
          - generic [ref=e303]: 食品・飲料
          - generic [ref=e304]: 焼き菓子アソートボックス
          - generic [ref=e305]: ¥2,380
          - generic [ref=e306]: ¥2,980
        - link "SALE ペットケアおでかけセット ペット用品 ペットケアおでかけセット ¥3,480 ¥4,080" [ref=e307] [cursor=pointer]:
          - /url: /s/aiboux/product/setsuka-pet
          - generic [ref=e308]: SALE
          - img "ペットケアおでかけセット" [ref=e309]
          - generic [ref=e310]: ペット用品
          - generic [ref=e311]: ペットケアおでかけセット
          - generic [ref=e312]: ¥3,480
          - generic [ref=e313]: ¥4,080
    - generic [ref=e314]:
      - generic [ref=e315]:
        - heading "カテゴリー一覧" [level=2] [ref=e316]
        - link "もっと見る" [ref=e317] [cursor=pointer]:
          - /url: /s/aiboux/categories
      - generic [ref=e318]:
        - link "食品・飲料 食品・飲料" [ref=e319] [cursor=pointer]:
          - /url: /s/aiboux/products?category=food-drink
          - img "食品・飲料" [ref=e320]
          - text: 食品・飲料
        - link "コーヒー・お茶 コーヒー・お茶" [ref=e321] [cursor=pointer]:
          - /url: /s/aiboux/products?category=coffee-tea
          - img "コーヒー・お茶" [ref=e322]
          - text: コーヒー・お茶
        - link "キッチン用品 キッチン用品" [ref=e323] [cursor=pointer]:
          - /url: /s/aiboux/products?category=kitchen
          - img "キッチン用品" [ref=e324]
          - text: キッチン用品
        - link "日用品 日用品" [ref=e325] [cursor=pointer]:
          - /url: /s/aiboux/products?category=daily-goods
          - img "日用品" [ref=e326]
          - text: 日用品
        - link "タオル・寝具 タオル・寝具" [ref=e327] [cursor=pointer]:
          - /url: /s/aiboux/products?category=towel-bedding
          - img "タオル・寝具" [ref=e328]
          - text: タオル・寝具
        - link "ビューティー ビューティー" [ref=e329] [cursor=pointer]:
          - /url: /s/aiboux/products?category=beauty
          - img "ビューティー" [ref=e330]
          - text: ビューティー
        - link "ペット用品 ペット用品" [ref=e331] [cursor=pointer]:
          - /url: /s/aiboux/products?category=pet
          - img "ペット用品" [ref=e332]
          - text: ペット用品
        - link "ギフト ギフト" [ref=e333] [cursor=pointer]:
          - /url: /s/aiboux/products?category=gift
          - img "ギフト" [ref=e334]
          - text: ギフト
        - link "本・文具 本・文具" [ref=e335] [cursor=pointer]:
          - /url: /s/aiboux/products?category=books-stationery
          - img "本・文具" [ref=e336]
          - text: 本・文具
        - link "セール セール" [ref=e337] [cursor=pointer]:
          - /url: /s/aiboux/products?category=sale
          - img "セール" [ref=e338]
          - text: セール
        - link "ランキング ランキング" [ref=e339] [cursor=pointer]:
          - /url: /s/aiboux/products?category=ranking
          - img "ランキング" [ref=e340]
          - text: ランキング
    - generic [ref=e341]:
      - generic [ref=e342]:
        - heading "人気ブランド" [level=2] [ref=e343]
        - link "もっと見る" [ref=e344] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e345]:
        - generic [ref=e346]: THERMOS
        - generic [ref=e347]: Panasonic
        - generic [ref=e348]: SHARP
        - generic [ref=e349]: dyson
        - generic [ref=e350]: IRIS OHYAMA
        - generic [ref=e351]: KIRIN
  - contentinfo [ref=e352]:
    - link "ページ上部へ戻る" [ref=e353] [cursor=pointer]:
      - /url: "#top"
    - region "買い物を続ける" [ref=e354]:
      - generic [ref=e355]:
        - generic [ref=e356]:
          - heading "買い物を続ける" [level=2] [ref=e357]
          - paragraph [ref=e358]: 商品、カート、注文履歴、問い合わせへすぐ戻れます。
        - navigation "フッタークイックリンク" [ref=e359]:
          - link "商品一覧" [ref=e360] [cursor=pointer]:
            - /url: /s/aiboux/products
            - generic [ref=e361]: 商品一覧
          - link "カート" [ref=e362] [cursor=pointer]:
            - /url: /s/aiboux/cart
            - generic [ref=e363]: カート
          - link "注文履歴" [ref=e364] [cursor=pointer]:
            - /url: /s/aiboux/orders
            - generic [ref=e365]: 注文履歴
          - link "問い合わせ" [ref=e366] [cursor=pointer]:
            - /url: /s/aiboux/contact
            - generic [ref=e367]: 問い合わせ
    - generic [ref=e368]:
      - generic [ref=e369]:
        - heading "税込価格" [level=2] [ref=e370]
        - paragraph [ref=e371]: 商品価格は税込表示で統一します。
        - link "商品を見る" [ref=e372] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e373]:
        - heading "配送・返品" [level=2] [ref=e374]
        - paragraph [ref=e375]: 配送予定、返品条件、問い合わせ先を各ページから確認できます。
        - link "配送を見る" [ref=e376] [cursor=pointer]:
          - /url: /s/aiboux/shipping
      - generic [ref=e377]:
        - heading "支払い方法" [level=2] [ref=e378]
        - paragraph [ref=e379]: 支払い方法の確認が必要な場合は、注文前に分かりやすく案内します。
        - link "注文確認へ" [ref=e380] [cursor=pointer]:
          - /url: /s/aiboux/checkout
      - generic [ref=e381]:
        - heading "定期購入" [level=2] [ref=e382]
        - paragraph [ref=e383]: 定期購入は受付条件とお届け頻度を購入前に確認できます。
        - link "定期購入を見る" [ref=e384] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
    - generic [ref=e385]:
      - navigation "お買い物" [ref=e386]:
        - heading "お買い物" [level=2] [ref=e387]
        - link "商品一覧" [ref=e388] [cursor=pointer]:
          - /url: /s/aiboux/products
        - link "カテゴリ" [ref=e389] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "タイムセール" [ref=e390] [cursor=pointer]:
          - /url: /s/aiboux/products?category=sale
        - link "売れ筋ランキング" [ref=e391] [cursor=pointer]:
          - /url: /s/aiboux/products?category=ranking
        - link "お気に入り" [ref=e392] [cursor=pointer]:
          - /url: /s/aiboux/favorites
      - navigation "アカウント" [ref=e393]:
        - heading "アカウント" [level=2] [ref=e394]
        - link "マイページ" [ref=e395] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "注文履歴" [ref=e396] [cursor=pointer]:
          - /url: /s/aiboux/orders
        - link "定期購入" [ref=e397] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
        - link "ログイン" [ref=e398] [cursor=pointer]:
          - /url: /s/aiboux/login
      - navigation "サポート" [ref=e399]:
        - heading "サポート" [level=2] [ref=e400]
        - link "問い合わせ" [ref=e401] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e402] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "配送について" [ref=e403] [cursor=pointer]:
          - /url: /s/aiboux/shipping
        - link "返品について" [ref=e404] [cursor=pointer]:
          - /url: /s/aiboux/returns
      - navigation "ストア情報" [ref=e405]:
        - heading "ストア情報" [level=2] [ref=e406]
        - link "特定商取引法" [ref=e407] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシーポリシー" [ref=e408] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "カート" [ref=e409] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e410] [cursor=pointer]:
          - /url: /s/aiboux/checkout
    - region "フッター主要リンク" [ref=e411]:
      - generic [ref=e412]:
        - heading "ストア主要リンク" [level=2] [ref=e413]
        - generic [ref=e414]:
          - link "TOPページ" [ref=e415] [cursor=pointer]:
            - /url: /s/aiboux/
          - link "商品一覧" [ref=e416] [cursor=pointer]:
            - /url: /s/aiboux/products
          - link "カテゴリ一覧" [ref=e417] [cursor=pointer]:
            - /url: /s/aiboux/categories
          - link "食品・飲料" [ref=e418] [cursor=pointer]:
            - /url: /s/aiboux/products?category=food-drink
          - link "コーヒー・お茶" [ref=e419] [cursor=pointer]:
            - /url: /s/aiboux/products?category=coffee-tea
          - link "キッチン用品" [ref=e420] [cursor=pointer]:
            - /url: /s/aiboux/products?category=kitchen
          - link "日用品" [ref=e421] [cursor=pointer]:
            - /url: /s/aiboux/products?category=daily-goods
          - link "ギフト" [ref=e422] [cursor=pointer]:
            - /url: /s/aiboux/products?category=gift
          - link "タイムセール" [ref=e423] [cursor=pointer]:
            - /url: /s/aiboux/products?category=sale
          - link "売れ筋ランキング" [ref=e424] [cursor=pointer]:
            - /url: /s/aiboux/products?category=ranking
          - link "カート" [ref=e425] [cursor=pointer]:
            - /url: /s/aiboux/cart
          - link "チェックアウト" [ref=e426] [cursor=pointer]:
            - /url: /s/aiboux/checkout
          - link "マイページ" [ref=e427] [cursor=pointer]:
            - /url: /s/aiboux/mypage
          - link "注文履歴" [ref=e428] [cursor=pointer]:
            - /url: /s/aiboux/orders
          - link "お気に入り" [ref=e429] [cursor=pointer]:
            - /url: /s/aiboux/favorites
          - link "定期購入" [ref=e430] [cursor=pointer]:
            - /url: /s/aiboux/mypage/subscriptions
          - link "問い合わせ" [ref=e431] [cursor=pointer]:
            - /url: /s/aiboux/contact
          - link "よくある質問" [ref=e432] [cursor=pointer]:
            - /url: /s/aiboux/faq
          - link "配送について" [ref=e433] [cursor=pointer]:
            - /url: /s/aiboux/shipping
          - link "返品について" [ref=e434] [cursor=pointer]:
            - /url: /s/aiboux/returns
          - link "特定商取引法" [ref=e435] [cursor=pointer]:
            - /url: /s/aiboux/legal
          - link "プライバシーポリシー" [ref=e436] [cursor=pointer]:
            - /url: /s/aiboux/privacy
    - generic [ref=e438]:
      - generic [ref=e439]:
        - generic [ref=e440]: 株式会社雪花 公式ストア
        - paragraph [ref=e441]: 注文、配送、返品、定期購入、問い合わせまで同じストア内で確認できます。支払い方法の選択が必要な場合は、注文前に分かりやすく案内します。
      - navigation "ストア基本情報" [ref=e442]:
        - link "特商法" [ref=e443] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシー" [ref=e444] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "問い合わせ" [ref=e445] [cursor=pointer]:
          - /url: /s/aiboux/contact
```

# Test source

```ts
  103 |   });
  104 | 
  105 |   test("legal pages render configured or generated policy text", async ({ page }) => {
  106 |     await page.goto("/s/aiboux/legal");
  107 |     await expect(page.getByText("販売業者:")).toBeVisible();
  108 |     await page.goto("/s/aiboux/privacy");
  109 |     await expect(page.getByTestId("storefront-policy-page").getByText("個人情報")).toBeVisible();
  110 |     await page.goto("/s/aiboux/shipping");
  111 |     await expect(page.getByTestId("storefront-policy-page").getByText("配送方法と送料")).toBeVisible();
  112 |     await page.goto("/s/aiboux/returns");
  113 |     await expect(page.getByTestId("storefront-policy-page").getByText("返品・交換")).toBeVisible();
  114 |   });
  115 | 
  116 |   test("store design editor exposes only top and product detail page editing", async ({ page }) => {
  117 |     await page.setViewportSize({ width: 1980, height: 1080 });
  118 |     await page.goto("/s/aiboux/admin/design");
  119 |     await expect(page.getByText("AIBOUX SHOP ストアデザインエディタ")).toBeVisible();
  120 |     await expect(page.getByText("注文管理")).toHaveCount(0);
  121 |     await expect(page.getByText("商品管理")).toHaveCount(0);
  122 |     await expect(page.getByText("在庫", { exact: true })).toHaveCount(0);
  123 |     await expect(page.getByText("TOPページ").first()).toBeVisible();
  124 |     await expect(page.getByText("商品詳細ページ").first()).toBeVisible();
  125 |     await expect(page.getByText("編集できるのは「TOPページ」と「商品詳細ページ」のみです。")).toBeVisible();
  126 |     await expect(page.getByText("ヒーロースライダー").first()).toBeVisible();
  127 |     await expect(page.getByText("ロゴ").first()).toBeVisible();
  128 |     await expect(page.getByText("商品一覧ページ")).toHaveCount(0);
  129 |     await expect(page.getByText("カートページ")).toHaveCount(0);
  130 |     await expect(page.getByText("チェックアウトページ")).toHaveCount(0);
  131 |     await expect(page.getByText("404ページ")).toHaveCount(0);
  132 | 
  133 |     const shell = page.locator("[data-shop-design-editor-shell]");
  134 |     const preview = page.locator("[data-shop-design-preview]");
  135 |     const previewFrame = page.locator("[data-store-preview-frame]");
  136 |     const leftPane = page.locator("[data-shop-design-left-pane]");
  137 |     const rightPane = page.locator("[data-shop-design-right-pane]");
  138 |     await expect(shell).toBeVisible();
  139 |     await expect(leftPane).toBeVisible();
  140 |     await expect(preview).toBeVisible();
  141 |     await expect(rightPane).toBeVisible();
  142 | 
  143 |     const previewBox = await preview.boundingBox();
  144 |     const frameBox = await previewFrame.boundingBox();
  145 |     const leftBox = await leftPane.boundingBox();
  146 |     const rightBox = await rightPane.boundingBox();
  147 |     expect(previewBox?.width ?? 0, "center preview column should be at least 1100px at 1980px viewport").toBeGreaterThanOrEqual(1100);
  148 |     expect(frameBox?.width ?? 0, "store preview frame should be at least 1100px at 1980px viewport").toBeGreaterThanOrEqual(1100);
  149 |     expect(leftBox?.width ?? 0, "left editor pane width").toBeGreaterThanOrEqual(300);
  150 |     expect(leftBox?.width ?? 0, "left editor pane width").toBeLessThanOrEqual(340);
  151 |     expect(rightBox?.width ?? 0, "right editor pane width").toBeGreaterThanOrEqual(340);
  152 |     expect(rightBox?.width ?? 0, "right editor pane width").toBeLessThanOrEqual(380);
  153 | 
  154 |     const navItems = page.locator("[data-shop-nav-item]");
  155 |     await expect(navItems.first()).toBeVisible();
  156 |     const navCount = await navItems.count();
  157 |     expect(navCount, "category nav items should exist").toBeGreaterThanOrEqual(8);
  158 |     for (let index = 0; index < Math.min(navCount, 8); index += 1) {
  159 |       const box = await navItems.nth(index).boundingBox();
  160 |       expect(box?.height ?? 999, `category nav item ${index} should not wrap vertically`).toBeLessThanOrEqual(24);
  161 |     }
  162 | 
  163 |     const sideImages = page.locator("[data-hero-side-image]");
  164 |     await expect(sideImages).toHaveCount(2);
  165 |     for (let index = 0; index < 2; index += 1) {
  166 |       const src = await sideImages.nth(index).getAttribute("src");
  167 |       expect(src ?? "", `side hero ${index} should use a real preview image`).toContain("/shop/design/hero-");
  168 |     }
  169 | 
  170 |     await page.screenshot({ path: "output/playwright/shop-functional/design-editor-1980.png", fullPage: true });
  171 |   });
  172 | 
  173 |   test("store design editor saves top hero changes and restores original layout", async ({ page, request }) => {
  174 |     const originalResponse = await request.get("/shop/api/storefront/layout", {
  175 |       headers: {
  176 |         "cache-control": "no-cache",
  177 |         pragma: "no-cache",
  178 |       },
  179 |     });
  180 |     expect(originalResponse.ok(), "layout GET before persistence test").toBeTruthy();
  181 |     const originalData = await originalResponse.json();
  182 |     expect(originalData.success, "layout GET success before persistence test").toBeTruthy();
  183 |     const originalLayout = originalData.layout;
  184 |     const marker = `Playwright保存検証 ${Date.now()}`;
  185 | 
  186 |     try {
  187 |       await page.setViewportSize({ width: 1980, height: 1080 });
  188 |       await page.goto(`/s/aiboux/admin/design?persistence=${encodeURIComponent(marker)}`);
  189 |       await expect(page.getByText("AIBOUX SHOP ストアデザインエディタ")).toBeVisible();
  190 |       await expect(page.getByText("読み込み中")).toHaveCount(0);
  191 | 
  192 |       const heroTitle = page.getByLabel("タイトル").first();
  193 |       await expect(heroTitle).toBeVisible();
  194 |       await expect(heroTitle).not.toHaveValue("");
  195 |       await heroTitle.fill(marker);
  196 |       await expect(heroTitle).toHaveValue(marker);
  197 | 
  198 |       const saveResponsePromise = page.waitForResponse((response) =>
  199 |         response.url().includes("/shop/api/storefront/layout") && response.request().method() === "POST",
  200 |       );
  201 |       await page.getByRole("button", { name: "保存", exact: true }).click();
  202 |       const saveResponse = await saveResponsePromise;
> 203 |       expect(saveResponse.ok(), "layout POST from design editor save").toBeTruthy();
      |                                                                        ^ Error: layout POST from design editor save
  204 | 
  205 |       const savedResponse = await request.get("/shop/api/storefront/layout", {
  206 |         headers: {
  207 |           "cache-control": "no-cache",
  208 |           pragma: "no-cache",
  209 |         },
  210 |       });
  211 |       expect(savedResponse.ok(), "layout GET after design editor save").toBeTruthy();
  212 |       const savedData = await savedResponse.json();
  213 |       expect(savedData.layout?.pages?.top?.heroSlider?.slides?.[0]?.title).toBe(marker);
  214 | 
  215 |       await page.goto(`/s/aiboux/?layoutVerify=${encodeURIComponent(marker)}`);
  216 |       await expect(page.getByRole("heading", { name: marker })).toBeVisible();
  217 |       await page.reload();
  218 |       await expect(page.getByRole("heading", { name: marker })).toBeVisible();
  219 |     } finally {
  220 |       const restoreResponse = await request.post("/shop/api/storefront/layout", {
  221 |         data: {
  222 |           layout: originalLayout,
  223 |           actorId: "playwright-layout-restore",
  224 |         },
  225 |       });
  226 |       expect(restoreResponse.ok(), "layout restore POST after persistence test").toBeTruthy();
  227 | 
  228 |       await page.goto(`/s/aiboux/?layoutRestoreVerify=${Date.now()}`);
  229 |       await expect(page.getByText(marker)).toHaveCount(0);
  230 |     }
  231 |   });
  232 | 
  233 |   test("published product add-to-cart works when published products exist", async ({ page }) => {
  234 |     await page.goto("/s/aiboux/products");
  235 |     const addButtons = page.locator("[data-cart-add]");
  236 |     const count = await addButtons.count();
  237 |     if (count === 0) {
  238 |       await expect(page.getByText("商品はこれから追加されます。")).toBeVisible();
  239 |       return;
  240 |     }
  241 | 
  242 |     await addButtons.first().click();
  243 |     await expect(page).toHaveURL(/\/s\/aiboux\/cart$/);
  244 |     await expect(page.locator("[data-cart-list]")).toBeVisible();
  245 |   });
  246 | });
  247 | 
```