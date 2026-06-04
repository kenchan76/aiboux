# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-product-detail-public.spec.ts >> AIBOUX Shop product detail public quality >> product detail renders purchase-ready layout at 390px
- Location: tests/shop-product-detail-public.spec.ts:37:5

# Error details

```
Error: product detail description should mention purchase decision information

expect(received).toMatch(expected)

Expected pattern: /価格|税込|レビュー|在庫|配送|返品|定期購入/
Received string:  "公開ストア反映確認用の商品です。 / Keywords: 検証, AIBOUX / Google: 166"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]: "お届け先: 東京都 千代田区"
      - generic [ref=e5]: 送料無料は ¥2,000
      - generic [ref=e6]:
        - generic [ref=e7]: ヘルプ・サポート
        - generic [ref=e8]: お知らせ
    - generic [ref=e9]:
      - link "株式会社雪花 公式ストア" [ref=e10] [cursor=pointer]:
        - /url: /s/aiboux/
      - search "ストア内商品検索" [ref=e11]:
        - searchbox "キーワード・商品名・ブランド名で検索" [ref=e12]
        - button "商品を検索" [ref=e13]:
          - img [ref=e14]
      - link "カート" [ref=e17] [cursor=pointer]:
        - /url: /s/aiboux/cart
    - navigation [ref=e18]:
      - link "すべてのカテゴリー" [ref=e19] [cursor=pointer]:
        - /url: /s/aiboux/categories
      - link "食品・お菓子" [ref=e20] [cursor=pointer]:
        - /url: /s/aiboux/products?category=food-drink
      - link "日用品" [ref=e21] [cursor=pointer]:
        - /url: /s/aiboux/products?category=daily-goods
      - link "キッチン用品" [ref=e22] [cursor=pointer]:
        - /url: /s/aiboux/products?category=kitchen
      - link "ギフト" [ref=e23] [cursor=pointer]:
        - /url: /s/aiboux/products?category=gift
      - link "ビューティー" [ref=e24] [cursor=pointer]:
        - /url: /s/aiboux/products?category=beauty
      - link "ペット用品" [ref=e25] [cursor=pointer]:
        - /url: /s/aiboux/products?category=pet
      - link "スポーツ・アウトドア" [ref=e26] [cursor=pointer]:
        - /url: /s/aiboux/products?category=sports-outdoor
      - link "本・文具" [ref=e27] [cursor=pointer]:
        - /url: /s/aiboux/products?category=books-stationery
      - link "セール" [ref=e28] [cursor=pointer]:
        - /url: /s/aiboux/products?category=sale
      - link "ランキング" [ref=e29] [cursor=pointer]:
        - /url: /s/aiboux/products?category=ranking
  - main [ref=e30]:
    - navigation "パンくずリスト" [ref=e31]:
      - link "TOP" [ref=e33] [cursor=pointer]:
        - /url: /s/aiboux/
      - generic [ref=e34]:
        - generic [ref=e35]: /
        - link "商品一覧" [ref=e36] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e37]:
        - generic [ref=e38]: /
        - link "日用品" [ref=e39] [cursor=pointer]:
          - /url: /s/aiboux/products?category=daily-goods
      - generic [ref=e40]:
        - generic [ref=e41]: /
        - generic [ref=e42]: 商品詳細
    - generic [ref=e43]:
      - generic [ref=e45]:
        - generic [ref=e46]:
          - button "毎日使えるホームケア洗剤セット サムネイル 1" [ref=e47]:
            - img "毎日使えるホームケア洗剤セット サムネイル 1" [ref=e48]
          - button "毎日使えるホームケア洗剤セット サムネイル 2" [ref=e49]:
            - img "毎日使えるホームケア洗剤セット サムネイル 2" [ref=e50]
          - button "毎日使えるホームケア洗剤セット サムネイル 3" [ref=e51]:
            - img "毎日使えるホームケア洗剤セット サムネイル 3" [ref=e52]
          - button "毎日使えるホームケア洗剤セット サムネイル 4" [ref=e53]:
            - img "毎日使えるホームケア洗剤セット サムネイル 4" [ref=e54]
          - button "毎日使えるホームケア洗剤セット サムネイル 5" [ref=e55]:
            - img "毎日使えるホームケア洗剤セット サムネイル 5" [ref=e56]
        - img "毎日使えるホームケア洗剤セット 商品画像" [ref=e58]
      - generic [ref=e59]:
        - paragraph [ref=e60]: 日用品
        - heading "毎日使えるホームケア洗剤セット" [level=1] [ref=e61]
        - paragraph [ref=e62]:
          - text: ★★★★★
          - link "(レビューを確認)" [ref=e63] [cursor=pointer]:
            - /url: "#reviews"
        - generic [ref=e64]: ¥2,980 税込
        - paragraph [ref=e65]: ポイント付与対象商品です。
        - generic [ref=e66]:
          - heading "バリエーション" [level=2] [ref=e67]
          - generic [ref=e68]:
            - generic [ref=e69]: 標準
            - generic [ref=e70]: ギフト対応
        - generic [ref=e71]:
          - heading "商品説明" [level=2] [ref=e72]
          - paragraph [ref=e73]: 毎日使えるホームケア洗剤セットは、毎日の暮らしで使いやすい品質と価格のバランスを重視した雪花セレクトの商品です。ギフトやまとめ買いにも選びやすいよう、配送条件と在庫状況を確認しながら購入できます。
        - generic [ref=e74]:
          - heading "商品仕様" [level=2] [ref=e75]
          - generic [ref=e76]:
            - generic [ref=e77]:
              - term [ref=e78]: SKU
              - definition [ref=e79]: "4580000232621"
            - generic [ref=e80]:
              - term [ref=e81]: カテゴリ
              - definition [ref=e82]: 日用品
            - generic [ref=e83]:
              - term [ref=e84]: 配送目安
              - definition [ref=e85]: 通常2〜4営業日で発送
            - generic [ref=e86]:
              - term [ref=e87]: 返品条件
              - definition [ref=e88]: 未開封・未使用品は到着後7日以内に問い合わせ
      - complementary [ref=e89]:
        - generic [ref=e90]: 購入ボックス
        - generic [ref=e91]: ¥2,980 税込
        - generic [ref=e92]:
          - generic [ref=e93]: 定期購入は本番接続後に有効化します。
          - paragraph [ref=e94]: DB migrationが未適用のため、現在は申し込みできません。通常購入と商品閲覧は利用できます。
        - generic [ref=e95]:
          - text: "初回お届け目安: 2〜4営業日"
          - text: "配送方法: 宅配便 / 追跡番号あり"
        - paragraph [ref=e96]: 在庫あり
        - generic [ref=e97]:
          - text: 数量
          - textbox "数量" [ref=e98]: "1"
        - list [ref=e99]:
          - listitem [ref=e100]: ・3,980円以上で送料無料
          - listitem [ref=e101]: ・未開封品は返品条件を確認できます
          - listitem [ref=e102]: ・決済未接続時は注文確定しません
        - generic [ref=e103]:
          - button "カートに入れる" [ref=e104]
          - link "今すぐ購入" [ref=e105] [cursor=pointer]:
            - /url: /s/aiboux/checkout
          - link "カートを見る" [ref=e106] [cursor=pointer]:
            - /url: /s/aiboux/cart
      - generic [ref=e107]:
        - heading "関連商品" [level=2] [ref=e108]
        - generic [ref=e109]:
          - link "雪花セレクト ドリップコーヒー 20袋 商品画像 雪花セレクト ドリップコーヒー 20袋 ¥1,980" [ref=e110] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-coffee-related
            - img "雪花セレクト ドリップコーヒー 20袋 商品画像" [ref=e112]
            - generic [ref=e113]: 雪花セレクト ドリップコーヒー 20袋
            - generic [ref=e114]: ¥1,980
          - link "軽量ステンレスボトル 500ml 商品画像 軽量ステンレスボトル 500ml ¥2,480" [ref=e115] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-bottle-related
            - img "軽量ステンレスボトル 500ml 商品画像" [ref=e117]
            - generic [ref=e118]: 軽量ステンレスボトル 500ml
            - generic [ref=e119]: ¥2,480
          - link "雪花セレクト ギフトタオル 2枚セット 商品画像 雪花セレクト ギフトタオル 2枚セット ¥2,980" [ref=e120] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-towel-related
            - img "雪花セレクト ギフトタオル 2枚セット 商品画像" [ref=e122]
            - generic [ref=e123]: 雪花セレクト ギフトタオル 2枚セット
            - generic [ref=e124]: ¥2,980
          - link "季節のギフトボックス 商品画像 季節のギフトボックス ¥5,980" [ref=e125] [cursor=pointer]:
            - /url: /s/aiboux/product/setsuka-gift-related
            - img "季節のギフトボックス 商品画像" [ref=e127]
            - generic [ref=e128]: 季節のギフトボックス
            - generic [ref=e129]: ¥5,980
    - region "このページから次に確認すること" [ref=e130]:
      - generic [ref=e132]:
        - paragraph [ref=e133]: Related navigation
        - heading "このページから次に確認すること" [level=2] [ref=e134]
        - paragraph [ref=e135]: 商品発見、購入前確認、購入後サポートをページごとに整理し、SEOに必要な説明的リンクを共通化します。
      - navigation "関連する内部リンク" [ref=e136]:
        - generic [ref=e137]:
          - heading "商品詳細で確認する" [level=3] [ref=e138]
          - paragraph [ref=e139]: 購入判断に必要な比較、返品、配送、問い合わせ導線を商品詳細から離脱させずに提示します。
          - list [ref=e140]:
            - listitem [ref=e141]:
              - link "同じカテゴリを見る" [ref=e142] [cursor=pointer]:
                - /url: /s/aiboux/products
            - listitem [ref=e143]:
              - link "カートを見る" [ref=e144] [cursor=pointer]:
                - /url: /s/aiboux/cart
            - listitem [ref=e145]:
              - link "配送条件" [ref=e146] [cursor=pointer]:
                - /url: /s/aiboux/shipping
            - listitem [ref=e147]:
              - link "返品条件" [ref=e148] [cursor=pointer]:
                - /url: /s/aiboux/returns
        - generic [ref=e149]:
          - heading "商品を探す" [level=3] [ref=e150]
          - paragraph [ref=e151]: 価格、税込表示、レビュー、カテゴリ、在庫、配送条件を同じ導線で比較します。
          - list [ref=e152]:
            - listitem [ref=e153]:
              - link "すべての商品" [ref=e154] [cursor=pointer]:
                - /url: /s/aiboux/products
            - listitem [ref=e155]:
              - link "カテゴリ一覧" [ref=e156] [cursor=pointer]:
                - /url: /s/aiboux/categories
            - listitem [ref=e157]:
              - link "食品・飲料" [ref=e158] [cursor=pointer]:
                - /url: /s/aiboux/products?category=food-drink
            - listitem [ref=e159]:
              - link "日用品" [ref=e160] [cursor=pointer]:
                - /url: /s/aiboux/products?category=daily-goods
            - listitem [ref=e161]:
              - link "タイムセール" [ref=e162] [cursor=pointer]:
                - /url: /s/aiboux/products?category=sale
            - listitem [ref=e163]:
              - link "売れ筋ランキング" [ref=e164] [cursor=pointer]:
                - /url: /s/aiboux/products?category=ranking
        - generic [ref=e165]:
          - heading "購入前に確認" [level=3] [ref=e166]
          - paragraph [ref=e167]: 送料、返品、問い合わせ、取引条件を購入前に確認できるようにします。
          - list [ref=e168]:
            - listitem [ref=e169]:
              - link "カート" [ref=e170] [cursor=pointer]:
                - /url: /s/aiboux/cart
            - listitem [ref=e171]:
              - link "チェックアウト" [ref=e172] [cursor=pointer]:
                - /url: /s/aiboux/checkout
            - listitem [ref=e173]:
              - link "配送について" [ref=e174] [cursor=pointer]:
                - /url: /s/aiboux/shipping
            - listitem [ref=e175]:
              - link "返品について" [ref=e176] [cursor=pointer]:
                - /url: /s/aiboux/returns
            - listitem [ref=e177]:
              - link "特定商取引法" [ref=e178] [cursor=pointer]:
                - /url: /s/aiboux/legal
            - listitem [ref=e179]:
              - link "問い合わせ" [ref=e180] [cursor=pointer]:
                - /url: /s/aiboux/contact
        - generic [ref=e181]:
          - heading "購入後サポート" [level=3] [ref=e182]
          - paragraph [ref=e183]: 注文履歴、マイページ、定期購入、お気に入りへ迷わず戻れるようにします。
          - list [ref=e184]:
            - listitem [ref=e185]:
              - link "マイページ" [ref=e186] [cursor=pointer]:
                - /url: /s/aiboux/mypage
            - listitem [ref=e187]:
              - link "注文履歴" [ref=e188] [cursor=pointer]:
                - /url: /s/aiboux/orders
            - listitem [ref=e189]:
              - link "お気に入り" [ref=e190] [cursor=pointer]:
                - /url: /s/aiboux/favorites
            - listitem [ref=e191]:
              - link "定期購入" [ref=e192] [cursor=pointer]:
                - /url: /s/aiboux/mypage/subscriptions
            - listitem [ref=e193]:
              - link "ログイン" [ref=e194] [cursor=pointer]:
                - /url: /s/aiboux/login
            - listitem [ref=e195]:
              - link "会員登録" [ref=e196] [cursor=pointer]:
                - /url: /s/aiboux/register
    - region "株式会社雪花 公式ストアで迷わず探す" [ref=e197]:
      - generic [ref=e198]:
        - generic [ref=e199]:
          - paragraph [ref=e200]: Store navigation
          - heading "株式会社雪花 公式ストアで迷わず探す" [level=2] [ref=e201]
          - paragraph [ref=e202]: 商品、カテゴリ、配送、返品、注文履歴を説明的なリンクで整理します。検索エンジンにもユーザーにも分かる、共通の内部リンク導線です。
        - link "商品一覧へ" [ref=e203] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e204]:
        - navigation "株式会社雪花 公式ストア SEO内部リンク" [ref=e205]:
          - generic [ref=e206]:
            - heading "人気カテゴリ" [level=3] [ref=e207]
            - list [ref=e208]:
              - listitem [ref=e209]:
                - link "食品・飲料を比較する" [ref=e210] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=food-drink
              - listitem [ref=e211]:
                - link "コーヒー・お茶を見る" [ref=e212] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=coffee-tea
              - listitem [ref=e213]:
                - link "キッチン用品を探す" [ref=e214] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=kitchen
              - listitem [ref=e215]:
                - link "日用品をまとめ買いする" [ref=e216] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=daily-goods
              - listitem [ref=e217]:
                - link "ギフト商品を選ぶ" [ref=e218] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=gift
          - generic [ref=e219]:
            - heading "購入前ガイド" [level=3] [ref=e220]
            - list [ref=e221]:
              - listitem [ref=e222]:
                - link "送料と配送予定を確認する" [ref=e223] [cursor=pointer]:
                  - /url: /s/aiboux/shipping
              - listitem [ref=e224]:
                - link "返品・交換条件を確認する" [ref=e225] [cursor=pointer]:
                  - /url: /s/aiboux/returns
              - listitem [ref=e226]:
                - link "よくある質問を見る" [ref=e227] [cursor=pointer]:
                  - /url: /s/aiboux/faq
              - listitem [ref=e228]:
                - link "ストアへ問い合わせる" [ref=e229] [cursor=pointer]:
                  - /url: /s/aiboux/contact
          - generic [ref=e230]:
            - heading "購入後サポート" [level=3] [ref=e231]
            - list [ref=e232]:
              - listitem [ref=e233]:
                - link "注文履歴を確認する" [ref=e234] [cursor=pointer]:
                  - /url: /s/aiboux/orders
              - listitem [ref=e235]:
                - link "マイページを開く" [ref=e236] [cursor=pointer]:
                  - /url: /s/aiboux/mypage
              - listitem [ref=e237]:
                - link "お気に入り商品を見る" [ref=e238] [cursor=pointer]:
                  - /url: /s/aiboux/favorites
              - listitem [ref=e239]:
                - link "定期購入の状態を見る" [ref=e240] [cursor=pointer]:
                  - /url: /s/aiboux/mypage/subscriptions
        - complementary "購入判断の要点" [ref=e241]:
          - link "商品比較 価格、税込、レビュー、在庫、配送目安を同じ商品カードで比較します。 商品一覧" [ref=e242] [cursor=pointer]:
            - /url: /s/aiboux/products
            - text: 商品比較
            - generic [ref=e243]: 価格、税込、レビュー、在庫、配送目安を同じ商品カードで比較します。
            - generic [ref=e244]: 商品一覧
          - link "購入条件 送料、返品、特商法、決済設定状態を注文前に確認できます。 取引条件" [ref=e245] [cursor=pointer]:
            - /url: /s/aiboux/legal
            - text: 購入条件
            - generic [ref=e246]: 送料、返品、特商法、決済設定状態を注文前に確認できます。
            - generic [ref=e247]: 取引条件
          - link "アカウント 注文履歴、配送状況、定期購入、お気に入りを同じ導線で確認します。 マイページ" [ref=e248] [cursor=pointer]:
            - /url: /s/aiboux/mypage
            - text: アカウント
            - generic [ref=e249]: 注文履歴、配送状況、定期購入、お気に入りを同じ導線で確認します。
            - generic [ref=e250]: マイページ
    - region "迷わず買えるための確認導線" [ref=e251]:
      - generic [ref=e252]:
        - generic [ref=e253]:
          - paragraph [ref=e254]: Shopping guide
          - heading "迷わず買えるための確認導線" [level=2] [ref=e255]
          - paragraph [ref=e256]: 商品比較、配送・返品、注文後の確認、定期購入の状態まで、SEOに忠実な内部リンクで移動できます。
        - link "商品一覧を見る" [ref=e257] [cursor=pointer]:
          - /url: /s/aiboux/products
          - generic [ref=e258]: 商品一覧を見る
      - generic [ref=e259]:
        - link "商品を探す 商品一覧、カテゴリ、ランキングから価格・税込・在庫・レビューを比較できます。 商品一覧へ" [ref=e260] [cursor=pointer]:
          - /url: /s/aiboux/products
          - heading "商品を探す" [level=3] [ref=e261]
          - paragraph [ref=e262]: 商品一覧、カテゴリ、ランキングから価格・税込・在庫・レビューを比較できます。
          - generic [ref=e263]: 商品一覧へ
        - link "購入前に確認 送料、返品条件、決済設定状態、特定商取引法の表示を注文前に確認できます。 配送条件を見る" [ref=e264] [cursor=pointer]:
          - /url: /s/aiboux/shipping
          - heading "購入前に確認" [level=3] [ref=e265]
          - paragraph [ref=e266]: 送料、返品条件、決済設定状態、特定商取引法の表示を注文前に確認できます。
          - generic [ref=e267]: 配送条件を見る
        - link "注文後の確認 注文履歴、配送状況、問い合わせ、領収書導線を同じマイページ導線で確認します。 注文履歴へ" [ref=e268] [cursor=pointer]:
          - /url: /s/aiboux/orders
          - heading "注文後の確認" [level=3] [ref=e269]
          - paragraph [ref=e270]: 注文履歴、配送状況、問い合わせ、領収書導線を同じマイページ導線で確認します。
          - generic [ref=e271]: 注文履歴へ
        - link "定期購入 定期購入は本番DB migrationと決済接続が完了するまで、準備中として正直に表示します。 定期購入を見る" [ref=e272] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
          - heading "定期購入" [level=3] [ref=e273]
          - paragraph [ref=e274]: 定期購入は本番DB migrationと決済接続が完了するまで、準備中として正直に表示します。
          - generic [ref=e275]: 定期購入を見る
      - navigation "購入サポートの内部リンク" [ref=e276]:
        - link "カテゴリから探す" [ref=e277] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "カートを見る" [ref=e278] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e279] [cursor=pointer]:
          - /url: /s/aiboux/checkout
        - link "問い合わせ" [ref=e280] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e281] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "返品について" [ref=e282] [cursor=pointer]:
          - /url: /s/aiboux/returns
        - link "マイページ" [ref=e283] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "お気に入り" [ref=e284] [cursor=pointer]:
          - /url: /s/aiboux/favorites
  - contentinfo [ref=e285]:
    - link "ページ上部へ戻る" [ref=e286] [cursor=pointer]:
      - /url: "#top"
    - generic [ref=e287]:
      - generic [ref=e288]:
        - heading "税込価格" [level=2] [ref=e289]
        - paragraph [ref=e290]: 商品価格は税込表示で統一します。
      - generic [ref=e291]:
        - heading "配送・返品" [level=2] [ref=e292]
        - paragraph [ref=e293]: 配送予定、返品条件、問い合わせ先を各ページから確認できます。
      - generic [ref=e294]:
        - heading "決済状態" [level=2] [ref=e295]
        - paragraph [ref=e296]: 決済未接続時は注文確定したふりをせず、設定未完了として表示します。
      - generic [ref=e297]:
        - heading "定期購入" [level=2] [ref=e298]
        - paragraph [ref=e299]: 定期購入はDB migrationと決済接続が完了するまで正直に準備中表示にします。
    - generic [ref=e300]:
      - navigation "お買い物" [ref=e301]:
        - heading "お買い物" [level=2] [ref=e302]
        - link "商品一覧" [ref=e303] [cursor=pointer]:
          - /url: /s/aiboux/products
        - link "カテゴリ" [ref=e304] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "タイムセール" [ref=e305] [cursor=pointer]:
          - /url: /s/aiboux/products?category=sale
        - link "売れ筋ランキング" [ref=e306] [cursor=pointer]:
          - /url: /s/aiboux/products?category=ranking
        - link "お気に入り" [ref=e307] [cursor=pointer]:
          - /url: /s/aiboux/favorites
      - navigation "アカウント" [ref=e308]:
        - heading "アカウント" [level=2] [ref=e309]
        - link "マイページ" [ref=e310] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "注文履歴" [ref=e311] [cursor=pointer]:
          - /url: /s/aiboux/orders
        - link "定期購入" [ref=e312] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
        - link "ログイン" [ref=e313] [cursor=pointer]:
          - /url: /s/aiboux/login
      - navigation "サポート" [ref=e314]:
        - heading "サポート" [level=2] [ref=e315]
        - link "問い合わせ" [ref=e316] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e317] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "配送について" [ref=e318] [cursor=pointer]:
          - /url: /s/aiboux/shipping
        - link "返品について" [ref=e319] [cursor=pointer]:
          - /url: /s/aiboux/returns
      - navigation "ストア情報" [ref=e320]:
        - heading "ストア情報" [level=2] [ref=e321]
        - link "特定商取引法" [ref=e322] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシーポリシー" [ref=e323] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "カート" [ref=e324] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e325] [cursor=pointer]:
          - /url: /s/aiboux/checkout
    - generic [ref=e327]:
      - generic [ref=e328]:
        - generic [ref=e329]: 株式会社雪花 公式ストア
        - paragraph [ref=e330]: 注文、配送、返品、定期購入、問い合わせまで同じテナント導線で確認できます。決済未接続時は注文確定しません。
      - navigation "ストア基本情報" [ref=e331]:
        - link "特商法" [ref=e332] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシー" [ref=e333] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "問い合わせ" [ref=e334] [cursor=pointer]:
          - /url: /s/aiboux/contact
```

# Test source

```ts
  1   | import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
  2   | import { copyFileSync, mkdirSync } from "node:fs";
  3   | import path from "node:path";
  4   | 
  5   | const outputDir = "output/playwright/shop-product-detail";
  6   | const publicDir = "public/g/screens";
  7   | const fallbackProduct = "/s/aiboux/product/shopprod_tenant_001_4580000232621";
  8   | 
  9   | async function saveScreenshot(page: Page, filename: string) {
  10  |   const outputPath = path.join(outputDir, filename);
  11  |   const publicPath = path.join(publicDir, filename);
  12  |   await page.screenshot({ path: outputPath, fullPage: true });
  13  |   copyFileSync(outputPath, publicPath);
  14  | }
  15  | 
  16  | async function findProductPath(page: Page, request: APIRequestContext) {
  17  |   const fallback = await request.get(fallbackProduct);
  18  |   if (fallback.status() === 200) return fallbackProduct;
  19  | 
  20  |   await page.goto("/s/aiboux/products", { waitUntil: "networkidle" });
  21  |   const href = await page.locator("a[href*='/s/aiboux/product/']").first().getAttribute("href");
  22  |   expect(href, "product detail URL should be discoverable").toBeTruthy();
  23  |   return href!;
  24  | }
  25  | 
  26  | test.describe("AIBOUX Shop product detail public quality", () => {
  27  |   test.beforeAll(() => {
  28  |     mkdirSync(outputDir, { recursive: true });
  29  |     mkdirSync(publicDir, { recursive: true });
  30  |   });
  31  | 
  32  |   for (const viewport of [
  33  |     { width: 1365, height: 1200, file: "shop-product-detail-1365.png" },
  34  |     { width: 1980, height: 1080, file: "shop-product-detail-1980.png" },
  35  |     { width: 390, height: 1200, file: "shop-product-detail-mobile.png" },
  36  |   ]) {
  37  |     test(`product detail renders purchase-ready layout at ${viewport.width}px`, async ({ page, request }) => {
  38  |       await page.setViewportSize({ width: viewport.width, height: viewport.height });
  39  |       const productPath = await findProductPath(page, request);
  40  |       await page.goto(`${productPath}?detailGate=${Date.now()}`, { waitUntil: "networkidle" });
  41  | 
  42  |       await expect(page.getByTestId("public-product-detail")).toBeVisible();
  43  |       await expect(page.getByTestId("public-product-gallery")).toBeVisible();
  44  |       await expect(page.getByTestId("public-product-info")).toBeVisible();
  45  |       await expect(page.getByTestId("public-product-purchase-box")).toBeVisible();
  46  |       await expect(page.locator("[data-cart-add]").first()).toBeVisible();
  47  |       await expect(page.getByText(/在庫あり|在庫確認/)).toBeVisible();
  48  |       await expect(page.getByText("商品説明")).toBeVisible();
  49  |       await expect(page.getByText(/AIBOUX公開検証商品|公開検証商品|検証商品/)).toHaveCount(0);
  50  |       await expect(page.getByTestId("product-main-image")).toBeVisible();
  51  |       expect(await page.getByTestId("product-thumbnail").count(), "thumbnail gallery should use real image thumbnails").toBeGreaterThanOrEqual(5);
  52  |       const thumbnailImages = page.locator("[data-testid='product-thumbnail'] img");
  53  |       expect(await thumbnailImages.count(), "thumbnail images should be visible instead of numbered boxes").toBeGreaterThanOrEqual(5);
  54  |       await expect(page.getByTestId("public-product-info").getByText("返品条件")).toBeVisible();
  55  |       await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  56  |       const breadcrumb = page.getByTestId("storefront-breadcrumb");
  57  |       await expect(breadcrumb).toBeVisible();
  58  |       await expect(breadcrumb).toHaveAttribute("itemtype", "https://schema.org/BreadcrumbList");
  59  |       expect(await breadcrumb.locator('[itemtype="https://schema.org/ListItem"]').count(), "product breadcrumb should expose visible ListItem microdata").toBeGreaterThanOrEqual(3);
  60  |       expect(await breadcrumb.locator("a").first().getAttribute("class"), "product breadcrumb links should be visibly link-colored").toContain("text-blue-700");
  61  |       await expect(page.locator("h1")).toHaveCount(1);
  62  |       const productTitle = (await page.locator("h1").innerText()).trim();
  63  |       await expect(page.getByTestId("storefront-breadcrumb-current"), "product breadcrumb current label should not duplicate the full product title above the gallery").toHaveText("商品詳細");
  64  |       expect(await page.getByText(productTitle, { exact: true }).count(), "product title should be visible only as the primary product h1").toBe(1);
  65  | 
  66  |       const jsonLdText = await page.locator('script[type="application/ld+json"]').first().textContent();
  67  |       expect(jsonLdText ?? "", "product detail should include BreadcrumbList JSON-LD").toContain("BreadcrumbList");
  68  |       expect(jsonLdText ?? "", "product breadcrumb JSON-LD should preserve the full product title").toContain(productTitle);
  69  |       expect(jsonLdText ?? "", "product detail should include Product JSON-LD").toContain("Product");
  70  |       expect(jsonLdText ?? "", "product detail should include Offer JSON-LD").toContain("Offer");
  71  |       expect(jsonLdText ?? "", "product detail should identify the storefront as OnlineStore JSON-LD").toContain("OnlineStore");
  72  |       expect(jsonLdText ?? "", "product detail should link Product to its canonical WebPage").toContain("mainEntityOfPage");
  73  |       expect(jsonLdText ?? "", "product detail should link offer seller to the shared store entity").toContain("seller");
  74  |       expect(jsonLdText ?? "", "product detail should expose stable store and website entity ids").toContain("#store");
  75  |       expect(jsonLdText ?? "", "product detail should expose stable website entity id").toContain("#website");
  76  |       expect(jsonLdText ?? "", "product detail WebPage should be linked to the WebSite entity").toContain("isPartOf");
  77  |       expect(jsonLdText ?? "", "product detail should include Organization return policy JSON-LD").toContain("MerchantReturnPolicy");
  78  |       expect(jsonLdText ?? "", "product detail should include shipping details for merchant listing").toContain("OfferShippingDetails");
  79  | 
  80  |       const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  81  |       expect(canonical ?? "", "product detail canonical should point at the product URL").toContain("https://shop.aiboux.com/s/aiboux/product/");
  82  |       const titleText = await page.title();
  83  |       expect(titleText, "product detail title should include the product name").toContain(productTitle);
  84  |       expect(titleText.length, "product detail title should remain snippet-safe").toBeLessThanOrEqual(78);
  85  |       const metaDescription = await page.locator('meta[name="description"]').getAttribute("content");
> 86  |       expect(metaDescription ?? "", "product detail description should mention purchase decision information").toMatch(/価格|税込|レビュー|在庫|配送|返品|定期購入/);
      |                                                                                                                ^ Error: product detail description should mention purchase decision information
  87  |       expect(metaDescription?.length ?? 0, "product detail description should be useful").toBeGreaterThanOrEqual(45);
  88  |       expect(metaDescription?.length ?? 0, "product detail description should remain snippet-safe").toBeLessThanOrEqual(155);
  89  |       expect(await page.locator('meta[name="robots"]').getAttribute("content"), "product detail should be indexable").toContain("index");
  90  |       expect(await page.locator('meta[property="og:type"]').getAttribute("content"), "product detail should use product Open Graph type").toBe("product");
  91  |       await expect(page.locator('meta[property="og:title"]'), "product detail should include Open Graph title").toHaveCount(1);
  92  |       await expect(page.locator('meta[property="og:image"]'), "product detail should include Open Graph product image").toHaveCount(1);
  93  |       await expect(page.locator('meta[property="og:url"]'), "product detail Open Graph URL should match canonical").toHaveAttribute("content", canonical ?? "");
  94  |       await expect(page.locator('meta[name="twitter:description"]'), "product detail Twitter description should match meta description").toHaveAttribute("content", metaDescription ?? "");
  95  |       await expect(page.locator('meta[property="product:price:amount"]'), "product detail should include product price Open Graph metadata").toHaveCount(1);
  96  |       await expect(page.locator('meta[property="product:price:currency"]'), "product detail should include product currency Open Graph metadata").toHaveCount(1);
  97  |       await expect(page.locator('meta[name="twitter:card"]'), "product detail should include Twitter Card metadata").toHaveCount(1);
  98  |       await expect(page.locator('link[rel="alternate"][hreflang="ja-JP"]'), "product detail should include ja-JP alternate link").toHaveCount(1);
  99  |       await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'), "product detail should include x-default alternate link").toHaveCount(1);
  100 | 
  101 |       const purchaseBox = await page.getByTestId("public-product-purchase-box").boundingBox();
  102 |       expect(purchaseBox?.height ?? 0, "purchase box should not be collapsed").toBeGreaterThan(260);
  103 |       await saveScreenshot(page, viewport.file);
  104 |     });
  105 |   }
  106 | });
  107 | 
```