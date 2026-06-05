# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-cart-checkout-public.spec.ts >> AIBOUX Shop cart and checkout public quality >> cart supports quantity, remove, and checkout shows honest payment blocker
- Location: tests/shop-cart-checkout-public.spec.ts:43:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('[data-cart-quantity-control]')
Expected: 2
Received: 0
Timeout:  10000ms

Call log:
  - Expect "toHaveCount" with timeout 10000ms
  - waiting for locator('[data-cart-quantity-control]')
    24 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation "ページ内ショートカット":
    - link "本文へスキップ" [ref=e2] [cursor=pointer]:
      - /url: "#storefront-main"
    - link "商品検索へ移動" [ref=e3] [cursor=pointer]:
      - /url: "#storefront-search"
    - link "フッターの主要リンクへ移動" [ref=e4] [cursor=pointer]:
      - /url: "#storefront-footer"
  - banner "ストアヘッダー" [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]: "お届け先: 東京都 千代田区"
      - generic [ref=e8]: 送料無料は ¥2,000
      - generic [ref=e9]:
        - generic [ref=e10]: ヘルプ・サポート
        - generic [ref=e11]: お知らせ
    - generic [ref=e12]:
      - link "株式会社雪花 公式ストア" [ref=e13] [cursor=pointer]:
        - /url: /s/aiboux/
      - search "ストア内商品検索" [ref=e14]:
        - generic [ref=e15]: すべてのカテゴリ
        - searchbox "キーワード・商品名・ブランド名で検索" [ref=e16]
        - button "商品を検索" [ref=e17]:
          - img [ref=e18]
      - link "アカウント マイページ" [ref=e21] [cursor=pointer]:
        - /url: /s/aiboux/mypage
        - text: アカウント
        - text: マイページ
      - link "注文履歴" [ref=e22] [cursor=pointer]:
        - /url: /s/aiboux/orders
      - link "カート" [ref=e23] [cursor=pointer]:
        - /url: /s/aiboux/cart
    - navigation "ストアカテゴリナビ" [ref=e24]:
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
        - link "TOP" [ref=e41] [cursor=pointer]:
          - /url: /s/aiboux/
        - generic [ref=e42]:
          - generic [ref=e43]: /
          - generic [ref=e44]: カート
      - navigation "パンくず関連リンク" [ref=e45]:
        - link "商品を追加" [ref=e46] [cursor=pointer]:
          - /url: /s/aiboux/products
          - generic [ref=e47]: 商品を追加
        - link "チェックアウト" [ref=e48] [cursor=pointer]:
          - /url: /s/aiboux/checkout
          - generic [ref=e49]: チェックアウト
        - link "配送条件" [ref=e50] [cursor=pointer]:
          - /url: /s/aiboux/shipping
          - generic [ref=e51]: 配送条件
        - link "返品条件" [ref=e52] [cursor=pointer]:
          - /url: /s/aiboux/returns
          - generic [ref=e53]: 返品条件
    - region "カート" [ref=e54]:
      - generic [ref=e55]:
        - generic [ref=e56]:
          - paragraph [ref=e57]: 株式会社雪花 公式ストア
          - heading "カート" [level=1] [ref=e58]
          - paragraph [ref=e59]: カート内の商品、数量、小計、配送・返品条件、支払い方法の受付状態を購入前にまとめて確認できます。
        - navigation "カート の主要導線" [ref=e60]:
          - link "商品を追加する" [ref=e61] [cursor=pointer]:
            - /url: /s/aiboux/products
            - generic [ref=e62]: 商品を追加する
          - link "チェックアウトへ" [ref=e63] [cursor=pointer]:
            - /url: /s/aiboux/checkout
            - generic [ref=e64]: チェックアウトへ
          - link "返品条件" [ref=e65] [cursor=pointer]:
            - /url: /s/aiboux/returns
            - generic [ref=e66]: 返品条件
    - generic [ref=e67]:
      - generic [ref=e68]:
        - generic [ref=e69]:
          - generic [ref=e70]:
            - generic [ref=e71]:
              - heading "ショッピングカート" [level=2] [ref=e72]
              - paragraph [ref=e73]: 商品、数量、定期購入頻度、返品条件を確認してからチェックアウトへ進みます。
            - link "買い物を続ける" [ref=e74] [cursor=pointer]:
              - /url: /s/aiboux/products
          - generic [ref=e75]:
            - link "買い物を続ける カテゴリ、ランキング、タイムセールから商品を追加できます。 商品一覧" [ref=e76] [cursor=pointer]:
              - /url: /s/aiboux/products
              - text: 買い物を続ける
              - generic [ref=e77]: カテゴリ、ランキング、タイムセールから商品を追加できます。
              - generic [ref=e78]: 商品一覧
            - link "配送予定を確認 送料、発送目安、追跡条件を購入前に確認できます。 配送条件" [ref=e79] [cursor=pointer]:
              - /url: /s/aiboux/shipping
              - text: 配送予定を確認
              - generic [ref=e80]: 送料、発送目安、追跡条件を購入前に確認できます。
              - generic [ref=e81]: 配送条件
            - link "返品条件を確認 未開封品、不良品、問い合わせ期限を購入前に確認できます。 返品条件" [ref=e82] [cursor=pointer]:
              - /url: /s/aiboux/returns
              - text: 返品条件を確認
              - generic [ref=e83]: 未開封品、不良品、問い合わせ期限を購入前に確認できます。
              - generic [ref=e84]: 返品条件
            - link "注文前に相談 商品名や注文番号を添えてストアへ問い合わせできます。 問い合わせ" [ref=e85] [cursor=pointer]:
              - /url: /s/aiboux/contact
              - text: 注文前に相談
              - generic [ref=e86]: 商品名や注文番号を添えてストアへ問い合わせできます。
              - generic [ref=e87]: 問い合わせ
          - generic [ref=e88]:
            - generic [ref=e89]:
              - link "雪花セレクト ドリップコーヒー 20袋 商品画像" [ref=e90] [cursor=pointer]:
                - /url: /s/aiboux/products
                - img "雪花セレクト ドリップコーヒー 20袋 商品画像" [ref=e91]
              - generic [ref=e92]:
                - link "雪花セレクト ドリップコーヒー 20袋" [ref=e93] [cursor=pointer]:
                  - /url: /s/aiboux/products
                - generic [ref=e94]:
                  - generic [ref=e95]: 通常購入
                  - generic [ref=e96]: 税込 ¥1,980
                  - generic [ref=e97]: お届け目安 2〜4営業日
                - generic [ref=e98]:
                  - generic [ref=e99]:
                    - text: 数量
                    - textbox "数量" [ref=e100]: "1"
                  - link "配送条件" [ref=e101] [cursor=pointer]:
                    - /url: /s/aiboux/shipping
                  - link "返品条件" [ref=e102] [cursor=pointer]:
                    - /url: /s/aiboux/returns
              - generic [ref=e103]:
                - strong [ref=e104]: ¥1,980
                - button "削除" [ref=e105]
            - generic [ref=e106]:
              - link "軽量ステンレスボトル 500ml 商品画像" [ref=e107] [cursor=pointer]:
                - /url: /s/aiboux/products
                - img "軽量ステンレスボトル 500ml 商品画像" [ref=e108]
              - generic [ref=e109]:
                - link "軽量ステンレスボトル 500ml" [ref=e110] [cursor=pointer]:
                  - /url: /s/aiboux/products
                - generic [ref=e111]:
                  - generic [ref=e112]: 定期購入
                  - generic [ref=e113]: 税込 ¥2,232
                  - generic [ref=e114]: お届け目安 2〜4営業日
                - generic [ref=e115]: "定期購入: 毎月便 / 毎月"
                - generic [ref=e116]:
                  - generic [ref=e117]:
                    - text: 数量
                    - textbox "数量" [ref=e118]: "1"
                  - link "配送条件" [ref=e119] [cursor=pointer]:
                    - /url: /s/aiboux/shipping
                  - link "返品条件" [ref=e120] [cursor=pointer]:
                    - /url: /s/aiboux/returns
              - generic [ref=e121]:
                - strong [ref=e122]: ¥2,232
                - button "削除" [ref=e123]
        - complementary [ref=e124]:
          - heading "注文サマリー" [level=3] [ref=e125]
          - generic [ref=e126]:
            - generic [ref=e127]:
              - generic [ref=e128]: 商品点数
              - strong [ref=e129]: 2点
            - generic [ref=e130]:
              - generic [ref=e131]: 商品小計
              - strong [ref=e132]: ¥4,212
            - generic [ref=e133]:
              - generic [ref=e134]: 送料見込み
              - generic [ref=e135]: 注文前に確認
            - generic [ref=e136]:
              - generic [ref=e137]: お届け目安
              - generic [ref=e138]: 通常2〜4営業日
            - generic [ref=e139]:
              - generic [ref=e140]: 定期購入
              - generic [ref=e141]: 定期購入 1件 / 次回以降合計 ¥2,232
            - generic [ref=e142]:
              - generic [ref=e143]:
                - generic [ref=e144]: 注文合計
                - strong [ref=e145]: ¥4,212
              - paragraph [ref=e146]: 送料と支払い方法はチェックアウトで確認します。
          - generic [ref=e147]:
            - generic [ref=e148]: 購入前チェック
            - list [ref=e149]:
              - listitem [ref=e150]: ・数量変更後の合計をすぐ確認
              - listitem [ref=e151]: ・配送予定と返品条件へ1クリックで戻れる
              - listitem [ref=e152]: ・通常購入と定期購入を分けて表示
          - link "チェックアウトへ進む" [ref=e153] [cursor=pointer]:
            - /url: /s/aiboux/checkout
          - link "配送・返品条件を見る" [ref=e154] [cursor=pointer]:
            - /url: /s/aiboux/shipping
      - generic [ref=e155]:
        - generic [ref=e156]:
          - heading "一緒に見られている商品" [level=3] [ref=e157]
          - link "もっと見る" [ref=e158] [cursor=pointer]:
            - /url: /s/aiboux/products
        - generic [ref=e159]:
          - article [ref=e160]:
            - link "雪花セレクト ドリップコーヒー 20袋の商品詳細を見る" [ref=e161] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-coffee
              - img "雪花セレクト ドリップコーヒー 20袋 商品画像" [ref=e162]
            - generic [ref=e163]:
              - link "コーヒー・お茶" [ref=e164] [cursor=pointer]:
                - /url: /s/aiboux/products?category=coffee-tea
              - link "雪花セレクト ドリップコーヒー 20袋" [ref=e165] [cursor=pointer]:
                - /url: /s/aiboux/product/setsuka-coffee
              - generic "評価 4.4、レビュー 128件" [ref=e166]:
                - generic [ref=e167]: ★★★★★
                - generic [ref=e168]: (128)
              - generic [ref=e169]: ¥1,980 税込
              - button "カートに入れる" [ref=e170]
          - article [ref=e171]:
            - link "軽量ステンレスボトル 500mlの商品詳細を見る" [ref=e172] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-bottle
              - img "軽量ステンレスボトル 500ml 商品画像" [ref=e173]
            - generic [ref=e174]:
              - link "キッチン用品" [ref=e175] [cursor=pointer]:
                - /url: /s/aiboux/products?category=kitchen
              - link "軽量ステンレスボトル 500ml" [ref=e176] [cursor=pointer]:
                - /url: /s/aiboux/product/setsuka-bottle
              - generic "評価 4.5、レビュー 159件" [ref=e177]:
                - generic [ref=e178]: ★★★★★
                - generic [ref=e179]: (159)
              - generic [ref=e180]: ¥2,480 税込
              - button "カートに入れる" [ref=e181]
          - article [ref=e182]:
            - link "雪花セレクト ギフトタオル 2枚セットの商品詳細を見る" [ref=e183] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-towel
              - img "雪花セレクト ギフトタオル 2枚セット 商品画像" [ref=e184]
            - generic [ref=e185]:
              - link "タオル・寝具" [ref=e186] [cursor=pointer]:
                - /url: /s/aiboux/products?category=towels
              - link "雪花セレクト ギフトタオル 2枚セット" [ref=e187] [cursor=pointer]:
                - /url: /s/aiboux/product/setsuka-towel
              - generic "評価 4.6、レビュー 190件" [ref=e188]:
                - generic [ref=e189]: ★★★★★
                - generic [ref=e190]: (190)
              - generic [ref=e191]: ¥2,980 税込
              - button "カートに入れる" [ref=e192]
          - article [ref=e193]:
            - link "季節のギフトボックスの商品詳細を見る" [ref=e194] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-gift
              - img "季節のギフトボックス 商品画像" [ref=e195]
            - generic [ref=e196]:
              - link "ギフト" [ref=e197] [cursor=pointer]:
                - /url: /s/aiboux/products?category=gift
              - link "季節のギフトボックス" [ref=e198] [cursor=pointer]:
                - /url: /s/aiboux/product/setsuka-gift
              - generic "評価 4.7、レビュー 221件" [ref=e199]:
                - generic [ref=e200]: ★★★★★
                - generic [ref=e201]: (221)
              - generic [ref=e202]: ¥5,980 税込
              - button "カートに入れる" [ref=e203]
          - article [ref=e204]:
            - link "キッチン保存容器 6点セットの商品詳細を見る" [ref=e205] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-storage
              - img "キッチン保存容器 6点セット 商品画像" [ref=e206]
            - generic [ref=e207]:
              - link "キッチン用品" [ref=e208] [cursor=pointer]:
                - /url: /s/aiboux/products?category=kitchen
              - link "キッチン保存容器 6点セット" [ref=e209] [cursor=pointer]:
                - /url: /s/aiboux/product/setsuka-storage
              - generic "評価 4.8、レビュー 252件" [ref=e210]:
                - generic [ref=e211]: ★★★★★
                - generic [ref=e212]: (252)
              - generic [ref=e213]: ¥3,280 税込
              - button "カートに入れる" [ref=e214]
  - contentinfo [ref=e215]:
    - link "ページ上部へ戻る" [ref=e216] [cursor=pointer]:
      - /url: "#top"
    - region "買い物を続ける" [ref=e217]:
      - generic [ref=e218]:
        - generic [ref=e219]:
          - heading "買い物を続ける" [level=2] [ref=e220]
          - paragraph [ref=e221]: 商品、カート、注文履歴、問い合わせへすぐ戻れます。
        - navigation "フッタークイックリンク" [ref=e222]:
          - link "商品一覧" [ref=e223] [cursor=pointer]:
            - /url: /s/aiboux/products
            - generic [ref=e224]: 商品一覧
          - link "カート" [ref=e225] [cursor=pointer]:
            - /url: /s/aiboux/cart
            - generic [ref=e226]: カート
          - link "注文履歴" [ref=e227] [cursor=pointer]:
            - /url: /s/aiboux/orders
            - generic [ref=e228]: 注文履歴
          - link "問い合わせ" [ref=e229] [cursor=pointer]:
            - /url: /s/aiboux/contact
            - generic [ref=e230]: 問い合わせ
    - generic [ref=e231]:
      - generic [ref=e232]:
        - heading "税込価格" [level=2] [ref=e233]
        - paragraph [ref=e234]: 商品価格は税込表示で統一します。
        - link "商品を見る" [ref=e235] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e236]:
        - heading "配送・返品" [level=2] [ref=e237]
        - paragraph [ref=e238]: 配送予定、返品条件、問い合わせ先を各ページから確認できます。
        - link "配送を見る" [ref=e239] [cursor=pointer]:
          - /url: /s/aiboux/shipping
      - generic [ref=e240]:
        - heading "支払い方法" [level=2] [ref=e241]
        - paragraph [ref=e242]: 支払い方法の確認が必要な場合は、注文前に分かりやすく案内します。
        - link "注文確認へ" [ref=e243] [cursor=pointer]:
          - /url: /s/aiboux/checkout
      - generic [ref=e244]:
        - heading "定期購入" [level=2] [ref=e245]
        - paragraph [ref=e246]: 定期購入は受付条件とお届け頻度を購入前に確認できます。
        - link "定期購入を見る" [ref=e247] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
    - generic [ref=e248]:
      - navigation "お買い物" [ref=e249]:
        - heading "お買い物" [level=2] [ref=e250]
        - link "商品一覧" [ref=e251] [cursor=pointer]:
          - /url: /s/aiboux/products
        - link "カテゴリ" [ref=e252] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "タイムセール" [ref=e253] [cursor=pointer]:
          - /url: /s/aiboux/products?category=sale
        - link "売れ筋ランキング" [ref=e254] [cursor=pointer]:
          - /url: /s/aiboux/products?category=ranking
        - link "お気に入り" [ref=e255] [cursor=pointer]:
          - /url: /s/aiboux/favorites
      - navigation "アカウント" [ref=e256]:
        - heading "アカウント" [level=2] [ref=e257]
        - link "マイページ" [ref=e258] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "注文履歴" [ref=e259] [cursor=pointer]:
          - /url: /s/aiboux/orders
        - link "定期購入" [ref=e260] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
        - link "ログイン" [ref=e261] [cursor=pointer]:
          - /url: /s/aiboux/login
      - navigation "サポート" [ref=e262]:
        - heading "サポート" [level=2] [ref=e263]
        - link "問い合わせ" [ref=e264] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e265] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "配送について" [ref=e266] [cursor=pointer]:
          - /url: /s/aiboux/shipping
        - link "返品について" [ref=e267] [cursor=pointer]:
          - /url: /s/aiboux/returns
      - navigation "ストア情報" [ref=e268]:
        - heading "ストア情報" [level=2] [ref=e269]
        - link "特定商取引法" [ref=e270] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシーポリシー" [ref=e271] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "カート" [ref=e272] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e273] [cursor=pointer]:
          - /url: /s/aiboux/checkout
    - region "フッター主要リンク" [ref=e274]:
      - generic [ref=e275]:
        - heading "ストア主要リンク" [level=2] [ref=e276]
        - generic [ref=e277]:
          - link "TOPページ" [ref=e278] [cursor=pointer]:
            - /url: /s/aiboux/
          - link "商品一覧" [ref=e279] [cursor=pointer]:
            - /url: /s/aiboux/products
          - link "カテゴリ一覧" [ref=e280] [cursor=pointer]:
            - /url: /s/aiboux/categories
          - link "食品・飲料" [ref=e281] [cursor=pointer]:
            - /url: /s/aiboux/products?category=food-drink
          - link "コーヒー・お茶" [ref=e282] [cursor=pointer]:
            - /url: /s/aiboux/products?category=coffee-tea
          - link "キッチン用品" [ref=e283] [cursor=pointer]:
            - /url: /s/aiboux/products?category=kitchen
          - link "日用品" [ref=e284] [cursor=pointer]:
            - /url: /s/aiboux/products?category=daily-goods
          - link "ギフト" [ref=e285] [cursor=pointer]:
            - /url: /s/aiboux/products?category=gift
          - link "タイムセール" [ref=e286] [cursor=pointer]:
            - /url: /s/aiboux/products?category=sale
          - link "売れ筋ランキング" [ref=e287] [cursor=pointer]:
            - /url: /s/aiboux/products?category=ranking
          - link "カート" [ref=e288] [cursor=pointer]:
            - /url: /s/aiboux/cart
          - link "チェックアウト" [ref=e289] [cursor=pointer]:
            - /url: /s/aiboux/checkout
          - link "マイページ" [ref=e290] [cursor=pointer]:
            - /url: /s/aiboux/mypage
          - link "注文履歴" [ref=e291] [cursor=pointer]:
            - /url: /s/aiboux/orders
          - link "お気に入り" [ref=e292] [cursor=pointer]:
            - /url: /s/aiboux/favorites
          - link "定期購入" [ref=e293] [cursor=pointer]:
            - /url: /s/aiboux/mypage/subscriptions
          - link "問い合わせ" [ref=e294] [cursor=pointer]:
            - /url: /s/aiboux/contact
          - link "よくある質問" [ref=e295] [cursor=pointer]:
            - /url: /s/aiboux/faq
          - link "配送について" [ref=e296] [cursor=pointer]:
            - /url: /s/aiboux/shipping
          - link "返品について" [ref=e297] [cursor=pointer]:
            - /url: /s/aiboux/returns
          - link "特定商取引法" [ref=e298] [cursor=pointer]:
            - /url: /s/aiboux/legal
          - link "プライバシーポリシー" [ref=e299] [cursor=pointer]:
            - /url: /s/aiboux/privacy
    - generic [ref=e301]:
      - generic [ref=e302]:
        - generic [ref=e303]: 株式会社雪花 公式ストア
        - paragraph [ref=e304]: 注文、配送、返品、定期購入、問い合わせまで同じストア内で確認できます。支払い方法の選択が必要な場合は、注文前に分かりやすく案内します。
      - navigation "ストア基本情報" [ref=e305]:
        - link "特商法" [ref=e306] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシー" [ref=e307] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "問い合わせ" [ref=e308] [cursor=pointer]:
          - /url: /s/aiboux/contact
```

# Test source

```ts
  1   | import { expect, test, type Page } from "@playwright/test";
  2   | import { copyFileSync, mkdirSync } from "node:fs";
  3   | import path from "node:path";
  4   | 
  5   | const outputDir = "output/playwright/shop-cart-checkout";
  6   | const publicDir = "public/g/screens";
  7   | const fallbackProductPath = "/s/aiboux/product/shopprod_tenant_001_4580000232621";
  8   | 
  9   | async function saveScreenshot(page: Page, filename: string) {
  10  |   const outputPath = path.join(outputDir, filename);
  11  |   const publicPath = path.join(publicDir, filename);
  12  |   await page.screenshot({ path: outputPath, fullPage: true });
  13  |   copyFileSync(outputPath, publicPath);
  14  | }
  15  | 
  16  | test.describe("AIBOUX Shop cart and checkout public quality", () => {
  17  |   test.beforeAll(() => {
  18  |     mkdirSync(outputDir, { recursive: true });
  19  |     mkdirSync(publicDir, { recursive: true });
  20  |   });
  21  | 
  22  |   test("checkout empty state recovers shoppers to products, cart, and shipping without pretending payment is ready", async ({ page }) => {
  23  |     await page.setViewportSize({ width: 1365, height: 1200 });
  24  |     await page.goto(`/s/aiboux/checkout?emptyCheckoutGate=${Date.now()}`, { waitUntil: "networkidle" });
  25  |     await page.evaluate(() => localStorage.removeItem("aiboux:shop:aiboux:cart"));
  26  |     await page.reload({ waitUntil: "networkidle" });
  27  | 
  28  |     const guide = page.getByTestId("storefront-checkout-empty-guide");
  29  |     await expect(guide).toBeVisible();
  30  |     await expect(guide).toContainText("カートに商品がありません");
  31  |     await expect(page.locator("[data-checkout-step-index='0']")).toHaveAttribute("data-current", "true");
  32  |     await expect(page.locator("[data-checkout-step-index='1']")).toHaveAttribute("data-current", "false");
  33  |     await expect(guide).toContainText("配送・返品条件");
  34  |     await expect(guide.getByRole("link", { name: "商品一覧へ戻る" })).toHaveAttribute("href", "/s/aiboux/products");
  35  |     await expect(guide.getByRole("link", { name: "カートを確認" })).toHaveAttribute("href", "/s/aiboux/cart");
  36  |     await expect(guide.getByRole("link", { name: "配送条件を見る" })).toHaveAttribute("href", "/s/aiboux/shipping");
  37  |     await expect(page.getByText("注文が確定しました")).toHaveCount(0);
  38  |     await expect(page.getByText("支払いが完了しました")).toHaveCount(0);
  39  |     await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  40  |     await saveScreenshot(page, "shop-checkout-empty-guide.png");
  41  |   });
  42  | 
  43  |   test("cart supports quantity, remove, and checkout shows honest payment blocker", async ({ page }) => {
  44  |     await page.setViewportSize({ width: 1365, height: 1200 });
  45  |     await page.goto("/s/aiboux/cart", { waitUntil: "networkidle" });
  46  |     await expect(page.getByTestId("storefront-cart-recovery-panel")).toBeVisible();
  47  |     await expect(page.getByTestId("storefront-cart-recovery-panel")).toContainText("配送予定を確認");
  48  |     await expect(page.getByTestId("storefront-cart-recovery-panel")).toContainText("返品条件を確認");
  49  |     await expect(page.getByTestId("storefront-cart-purchase-check")).not.toBeVisible();
  50  |     await page.evaluate(() => {
  51  |       localStorage.setItem(
  52  |         "aiboux:shop:aiboux:cart",
  53  |         JSON.stringify([
  54  |           { id: "sprint-normal", name: "雪花セレクト ドリップコーヒー 20袋", price: 1980, image: "", quantity: 1, purchaseMode: "normal" },
  55  |           { id: "sprint-subscription", name: "軽量ステンレスボトル 500ml", price: 2232, image: "", quantity: 1, purchaseMode: "subscription", subscriptionPlanName: "毎月便", subscriptionInterval: "毎月" },
  56  |         ]),
  57  |       );
  58  |     });
  59  |     await page.goto(`/s/aiboux/cart?cartGate=${Date.now()}`, { waitUntil: "networkidle" });
  60  | 
  61  |     const cartList = page.locator("[data-cart-list]");
  62  |     await expect(cartList.getByText("雪花セレクト ドリップコーヒー 20袋")).toBeVisible();
  63  |     await expect(cartList.getByText("お届け目安 2〜4営業日")).toHaveCount(2);
  64  |     await expect(cartList.getByRole("link", { name: "配送条件" }).first()).toHaveAttribute("href", "/s/aiboux/shipping");
  65  |     await expect(page.getByTestId("storefront-cart-purchase-check")).toBeVisible();
  66  |     await expect(page.getByTestId("storefront-cart-purchase-check")).toContainText("通常購入と定期購入を分けて表示");
  67  |     await expect(page.getByText("定期購入:")).toBeVisible();
  68  |     await expect(page.getByText("次回以降合計")).toBeVisible();
  69  |     await expect(page.locator("[data-cart-total-items]")).toHaveText("2点");
  70  |     await expect(page.locator("[data-cart-grand-total]")).toHaveText("¥4,212");
> 71  |     await expect(page.locator("[data-cart-quantity-control]")).toHaveCount(2);
      |                                                                ^ Error: expect(locator).toHaveCount(expected) failed
  72  |     await expect(page.locator("[data-cart-qty-decrease]").first()).toBeVisible();
  73  |     await expect(page.locator("[data-cart-qty-increase]").first()).toBeVisible();
  74  |     await saveScreenshot(page, "shop-cart-page.png");
  75  | 
  76  |     await page.locator("[data-cart-qty-increase]").first().click();
  77  |     await expect(page.locator("[data-cart-subtotal]")).toHaveText("¥6,192");
  78  |     await expect(page.locator("[data-cart-total-items]")).toHaveText("3点");
  79  |     await expect(page.locator("[data-cart-grand-total]")).toHaveText("¥6,192");
  80  |     await page.locator("[data-cart-qty-decrease]").first().click();
  81  |     await expect(page.locator("[data-cart-subtotal]")).toHaveText("¥4,212");
  82  |     await expect(page.locator("[data-cart-total-items]")).toHaveText("2点");
  83  |     await page.locator("[data-cart-qty]").first().fill("2");
  84  |     await expect(page.locator("[data-cart-subtotal]")).toHaveText("¥6,192");
  85  |     await expect(page.locator("[data-cart-total-items]")).toHaveText("3点");
  86  |     await page.locator("[data-cart-remove]").first().click();
  87  |     await expect(cartList.getByText("雪花セレクト ドリップコーヒー 20袋")).toHaveCount(0);
  88  |     await expect(page.locator("[data-cart-total-items]")).toHaveText("1点");
  89  |     await expect(page.locator("[data-cart-grand-total]")).toHaveText("¥2,232");
  90  | 
  91  |     await page.getByRole("link", { name: "チェックアウトへ進む" }).click();
  92  |     await expect(page).toHaveURL(/\/s\/aiboux\/checkout/);
  93  |     await expect(page.getByTestId("storefront-checkout-stepper")).toBeVisible();
  94  |     await expect(page.locator("[data-checkout-step-index='0']")).toHaveAttribute("data-current", "false");
  95  |     await expect(page.locator("[data-checkout-step-index='1']")).toHaveAttribute("data-current", "true");
  96  |     await expect(page.getByTestId("storefront-checkout-order-guard")).toBeVisible();
  97  |     await expect(page.getByTestId("storefront-checkout-payment-panel")).toBeVisible();
  98  |     await expect(page.getByTestId("storefront-checkout-live-summary")).toBeVisible();
  99  |     await expect(page.getByTestId("storefront-checkout-payment-panel")).toContainText("通常購入");
  100 |     await expect(page.getByTestId("storefront-checkout-payment-panel")).toContainText("サポート");
  101 |     await expect(page.locator("[data-checkout-total-items]")).toHaveText("1点");
  102 |     await expect(page.locator("[data-checkout-grand-total]")).toHaveText("¥2,232");
  103 |     await expect(page.locator("[data-checkout-side-total-items]")).toHaveText("1点");
  104 |     await expect(page.locator("[data-checkout-side-grand-total]")).toHaveText("¥2,232");
  105 |     await expect(page.locator("[data-checkout-side-mode]")).toHaveText("定期購入");
  106 |     await expect(page.locator("[data-checkout-side-items]")).toContainText("軽量ステンレスボトル 500ml");
  107 |     await expect(page.getByTestId("storefront-checkout-order-guard")).toContainText("税込価格");
  108 |     await expect(page.getByTestId("storefront-checkout-order-guard")).toContainText("定期購入");
  109 |     await expect(page.getByText("支払い方法を確認してください")).toBeVisible();
  110 |     await expect(page.getByText("定期購入の支払い方法を確認してください")).toBeVisible();
  111 |     await expect(page.locator("[data-subscription-terms-checkbox]")).toBeEnabled();
  112 |     await expect(page.locator("[data-checkout-customer-form]")).toBeVisible();
  113 |     await expect(page.locator("[data-checkout-customer-form] input[name='customerName']")).toBeEnabled();
  114 |     await expect(page.locator("[data-checkout-customer-form] input[name='customerEmail']")).toBeEnabled();
  115 |     await expect(page.locator("[data-checkout-customer-form] input[name='shippingAddress']")).toBeEnabled();
  116 |     await page.locator("[data-checkout-customer-form] input[name='customerName']").fill("山田 花子");
  117 |     await page.locator("[data-checkout-customer-form] input[name='customerEmail']").fill("hanako@example.com");
  118 |     await page.locator("[data-checkout-customer-form] input[name='shippingAddress']").fill("東京都千代田区丸の内1-1-1");
  119 |     await page.locator("[data-checkout-customer-form]").getByRole("button", { name: "配送先を確認" }).click();
  120 |     await expect(page.locator("[data-checkout-customer-status]")).toContainText("配送先と連絡先を確認しました");
  121 |     await expect(page.locator("body")).not.toContainText("決済設定");
  122 |     await expect(page.getByText("注文が確定しました")).toHaveCount(0);
  123 |     await expect(page.getByText("支払いが完了しました")).toHaveCount(0);
  124 |     await saveScreenshot(page, "shop-checkout-page.png");
  125 |   });
  126 | 
  127 |   test("product detail buy-now carries selected item into checkout", async ({ page, request }) => {
  128 |     await page.setViewportSize({ width: 1365, height: 1200 });
  129 |     const fallback = await request.get(fallbackProductPath);
  130 |     expect(fallback.status(), "fallback product detail should be available for buy-now flow").toBe(200);
  131 | 
  132 |     await page.goto(fallbackProductPath, { waitUntil: "networkidle" });
  133 |     await page.evaluate(() => localStorage.removeItem("aiboux:shop:aiboux:cart"));
  134 |     const title = (await page.locator("h1").innerText()).trim();
  135 | 
  136 |     await expect(page.getByTestId("product-quantity-stepper")).toBeVisible();
  137 |     await page.locator("[data-product-quantity-increase]").click();
  138 |     await expect(page.locator("[data-product-quantity]")).toHaveValue("2");
  139 |     await page.getByRole("button", { name: /今すぐ購入|今すぐ申し込む/ }).click();
  140 |     await expect(page).toHaveURL(/\/s\/aiboux\/checkout/);
  141 |     await expect(page.locator("[data-checkout-items]")).toContainText(title);
  142 |     await expect(page.locator("[data-checkout-total-items]")).toHaveText("2点");
  143 |     await expect(page.locator("[data-checkout-grand-total]")).toContainText("¥");
  144 |     await expect(page.getByTestId("storefront-checkout-payment-panel")).toContainText("支払い方法");
  145 |     await saveScreenshot(page, "shop-checkout-buy-now-result.png");
  146 |   });
  147 | });
  148 | 
```