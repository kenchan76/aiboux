# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-product-detail-public.spec.ts >> AIBOUX Shop product detail public quality >> product detail renders purchase-ready layout at 1980px
- Location: tests/shop-product-detail-public.spec.ts:37:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('商品説明')
Expected: visible
Error: strict mode violation: getByText('商品説明') resolved to 2 elements:
    1) <p class="mt-2 min-h-[4.5rem] text-sm leading-6 text-neutral-600">商品説明、仕様、レビュー、関連商品を確認します。</p> aka getByText('商品説明、仕様、レビュー、関連商品を確認します。')
    2) <h2 class="text-base font-bold text-neutral-950">商品説明</h2> aka getByRole('heading', { name: '商品説明' })

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('商品説明')

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
        - generic [ref=e12]: すべてのカテゴリ
        - searchbox "キーワード・商品名・ブランド名で検索" [ref=e13]
        - button "商品を検索" [ref=e14]:
          - img [ref=e15]
      - link "アカウント マイページ" [ref=e18] [cursor=pointer]:
        - /url: /s/aiboux/mypage
        - text: アカウント
        - text: マイページ
      - link "注文履歴" [ref=e19] [cursor=pointer]:
        - /url: /s/aiboux/orders
      - link "カート" [ref=e20] [cursor=pointer]:
        - /url: /s/aiboux/cart
    - navigation [ref=e21]:
      - link "すべてのカテゴリー" [ref=e22] [cursor=pointer]:
        - /url: /s/aiboux/categories
      - link "食品・お菓子" [ref=e23] [cursor=pointer]:
        - /url: /s/aiboux/products?category=food-drink
      - link "日用品" [ref=e24] [cursor=pointer]:
        - /url: /s/aiboux/products?category=daily-goods
      - link "キッチン用品" [ref=e25] [cursor=pointer]:
        - /url: /s/aiboux/products?category=kitchen
      - link "ギフト" [ref=e26] [cursor=pointer]:
        - /url: /s/aiboux/products?category=gift
      - link "ビューティー" [ref=e27] [cursor=pointer]:
        - /url: /s/aiboux/products?category=beauty
      - link "ペット用品" [ref=e28] [cursor=pointer]:
        - /url: /s/aiboux/products?category=pet
      - link "スポーツ・アウトドア" [ref=e29] [cursor=pointer]:
        - /url: /s/aiboux/products?category=sports-outdoor
      - link "本・文具" [ref=e30] [cursor=pointer]:
        - /url: /s/aiboux/products?category=books-stationery
      - link "セール" [ref=e31] [cursor=pointer]:
        - /url: /s/aiboux/products?category=sale
      - link "ランキング" [ref=e32] [cursor=pointer]:
        - /url: /s/aiboux/products?category=ranking
  - main [ref=e33]:
    - generic [ref=e34]:
      - navigation "パンくずリスト" [ref=e35]:
        - generic [ref=e36]: 現在地
        - link "TOP" [ref=e38] [cursor=pointer]:
          - /url: /s/aiboux/
        - generic [ref=e39]:
          - generic [ref=e40]: /
          - link "商品一覧" [ref=e41] [cursor=pointer]:
            - /url: /s/aiboux/products
        - generic [ref=e42]:
          - generic [ref=e43]: /
          - link "日用品" [ref=e44] [cursor=pointer]:
            - /url: /s/aiboux/products?category=daily-goods
        - generic [ref=e45]:
          - generic [ref=e46]: /
          - generic [ref=e47]: 商品詳細
      - navigation "パンくず関連リンク" [ref=e48]:
        - link "日用品を見る" [ref=e49] [cursor=pointer]:
          - /url: /s/aiboux/products?category=daily-goods
          - generic [ref=e50]: 日用品を見る
        - link "商品一覧" [ref=e51] [cursor=pointer]:
          - /url: /s/aiboux/products
          - generic [ref=e52]: 商品一覧
        - link "カート" [ref=e53] [cursor=pointer]:
          - /url: /s/aiboux/cart
          - generic [ref=e54]: カート
        - link "返品条件" [ref=e55] [cursor=pointer]:
          - /url: /s/aiboux/returns
          - generic [ref=e56]: 返品条件
    - region "商品詳細で確認できること" [ref=e57]:
      - generic [ref=e58]:
        - generic [ref=e59]:
          - paragraph [ref=e60]: Page quality
          - heading "商品詳細で確認できること" [level=2] [ref=e61]
          - generic [ref=e62]:
            - paragraph [ref=e63]:
              - strong [ref=e64]: "検索意図:"
              - text: 1商品に集中し、画像、価格、在庫、配送、返品、購入ボックスで購入判断するページです。
            - paragraph [ref=e65]:
              - strong [ref=e66]: "SEO構造:"
              - text: Product/Offer、BreadcrumbList、MerchantReturnPolicyを同じ商品文脈で接続します。
            - paragraph [ref=e67]:
              - strong [ref=e68]: "次の操作:"
              - text: 画像、説明、仕様、購入ボックス、関連商品を確認してカートへ進みます。
        - navigation "商品詳細の購入・検索補助リンク" [ref=e69]:
          - link "H1 単一H1 商品名は可視H1を1つに維持し、画像上の二重タイトルは出しません。 関連商品" [ref=e70] [cursor=pointer]:
            - /url: /s/aiboux/products
            - generic [ref=e71]: H1
            - heading "単一H1" [level=3] [ref=e72]
            - paragraph [ref=e73]: 商品名は可視H1を1つに維持し、画像上の二重タイトルは出しません。
            - generic [ref=e74]: 関連商品
          - link "購入 購入条件 税込価格、在庫、配送予定、返品条件、定期購入状態を購入前に表示します。 カート" [ref=e75] [cursor=pointer]:
            - /url: /s/aiboux/cart
            - generic [ref=e76]: 購入
            - heading "購入条件" [level=3] [ref=e77]
            - paragraph [ref=e78]: 税込価格、在庫、配送予定、返品条件、定期購入状態を購入前に表示します。
            - generic [ref=e79]: カート
          - link "購入前 価格・配送・返品 税込価格、配送目安、返品条件を購入前に確認できる導線を固定します。 配送条件" [ref=e80] [cursor=pointer]:
            - /url: /s/aiboux/shipping
            - generic [ref=e81]: 購入前
            - heading "価格・配送・返品" [level=3] [ref=e82]
            - paragraph [ref=e83]: 税込価格、配送目安、返品条件を購入前に確認できる導線を固定します。
            - generic [ref=e84]: 配送条件
          - link "支援 サポート導線 FAQ、問い合わせ、注文履歴へ戻れるクロール可能な内部リンクを維持します。 FAQ" [ref=e85] [cursor=pointer]:
            - /url: /s/aiboux/faq
            - generic [ref=e86]: 支援
            - heading "サポート導線" [level=3] [ref=e87]
            - paragraph [ref=e88]: FAQ、問い合わせ、注文履歴へ戻れるクロール可能な内部リンクを維持します。
            - generic [ref=e89]: FAQ
    - region "商品詳細で購入判断を完結する" [ref=e90]:
      - generic [ref=e91]:
        - generic [ref=e92]:
          - paragraph [ref=e93]: Next actions
          - heading "商品詳細で購入判断を完結する" [level=2] [ref=e94]
          - paragraph [ref=e95]: 商品名、画像、税込価格、在庫、配送、返品、定期購入状態を確認してカートへ進みます。
        - generic [ref=e96]: SEO内部リンク
      - generic [ref=e97]:
        - article [ref=e98]:
          - generic [ref=e99]: 情報
          - heading "商品情報を確認" [level=3] [ref=e100]
          - paragraph [ref=e101]: 商品説明、仕様、レビュー、関連商品を確認します。
          - link "関連商品へ" [ref=e102] [cursor=pointer]:
            - /url: /s/aiboux/products
        - article [ref=e103]:
          - generic [ref=e104]: 条件
          - heading "購入条件を確認" [level=3] [ref=e105]
          - paragraph [ref=e106]: 送料、返品、決済未接続時の扱いを購入前に確認します。
          - link "配送条件へ" [ref=e107] [cursor=pointer]:
            - /url: /s/aiboux/shipping
        - article [ref=e108]:
          - generic [ref=e109]: 購入
          - heading "カートへ進む" [level=3] [ref=e110]
          - paragraph [ref=e111]: 通常購入と定期購入状態を区別してカートへ追加します。
          - link "カートを見る" [ref=e112] [cursor=pointer]:
            - /url: /s/aiboux/cart
        - article [ref=e113]:
          - generic [ref=e114]: 支援
          - heading "不明点を解消する" [level=3] [ref=e115]
          - paragraph [ref=e116]: FAQと問い合わせ導線を使い、商品名や注文番号を添えて確認できます。
          - link "FAQを見る" [ref=e117] [cursor=pointer]:
            - /url: /s/aiboux/faq
    - generic [ref=e118]:
      - generic [ref=e120]:
        - generic [ref=e121]:
          - button "毎日使えるホームケア洗剤セット サムネイル 1" [ref=e122]:
            - img "毎日使えるホームケア洗剤セット サムネイル 1" [ref=e123]
          - button "毎日使えるホームケア洗剤セット サムネイル 2" [ref=e124]:
            - img "毎日使えるホームケア洗剤セット サムネイル 2" [ref=e125]
          - button "毎日使えるホームケア洗剤セット サムネイル 3" [ref=e126]:
            - img "毎日使えるホームケア洗剤セット サムネイル 3" [ref=e127]
          - button "毎日使えるホームケア洗剤セット サムネイル 4" [ref=e128]:
            - img "毎日使えるホームケア洗剤セット サムネイル 4" [ref=e129]
          - button "毎日使えるホームケア洗剤セット サムネイル 5" [ref=e130]:
            - img "毎日使えるホームケア洗剤セット サムネイル 5" [ref=e131]
        - img "毎日使えるホームケア洗剤セット 商品画像" [ref=e133]
      - generic [ref=e134]:
        - paragraph [ref=e135]: 日用品
        - heading "毎日使えるホームケア洗剤セット" [level=1] [ref=e136]
        - paragraph [ref=e137]:
          - text: ★★★★★
          - link "(レビューを確認)" [ref=e138] [cursor=pointer]:
            - /url: "#reviews"
        - generic [ref=e139]: ¥2,980 税込
        - region "価格・配送・返品・決済を購入前に確認" [ref=e140]:
          - generic [ref=e141]:
            - generic [ref=e142]:
              - paragraph [ref=e143]: Purchase facts
              - heading "価格・配送・返品・決済を購入前に確認" [level=2] [ref=e144]
            - link "よくある質問" [ref=e145] [cursor=pointer]:
              - /url: /s/aiboux/faq
              - generic [ref=e146]: よくある質問
          - generic [ref=e147]:
            - link "税込 価格・税込表示 毎日使えるホームケア洗剤セットの価格は¥2,980です。商品カード、商品詳細、カートで税込表示を揃えます。 カートで確認" [ref=e148] [cursor=pointer]:
              - /url: /s/aiboux/cart
              - generic [ref=e149]: 税込
              - heading "価格・税込表示" [level=3] [ref=e150]
              - paragraph [ref=e151]: 毎日使えるホームケア洗剤セットの価格は¥2,980です。商品カード、商品詳細、カートで税込表示を揃えます。
              - generic [ref=e152]: カートで確認
            - link "配送 在庫・配送予定 在庫あり・在庫確認を明示。配送は通常2〜4営業日を目安に、追跡と送料条件を配送ページへ集約します。 配送条件を見る" [ref=e153] [cursor=pointer]:
              - /url: /s/aiboux/shipping
              - generic [ref=e154]: 配送
              - heading "在庫・配送予定" [level=3] [ref=e155]
              - paragraph [ref=e156]: 在庫あり・在庫確認を明示。配送は通常2〜4営業日を目安に、追跡と送料条件を配送ページへ集約します。
              - generic [ref=e157]: 配送条件を見る
            - link "返品 返品・キャンセル 未開封・未使用品、初期不良、到着後7日以内の問い合わせ条件を購入前に確認できます。 返品条件を見る" [ref=e158] [cursor=pointer]:
              - /url: /s/aiboux/returns
              - generic [ref=e159]: 返品
              - heading "返品・キャンセル" [level=3] [ref=e160]
              - paragraph [ref=e161]: 未開封・未使用品、初期不良、到着後7日以内の問い合わせ条件を購入前に確認できます。
              - generic [ref=e162]: 返品条件を見る
            - link "準備中 決済・定期購入 定期購入はDB migrationと決済接続が完了するまで申込み不可として表示します。成功したふりはしません。 注文前に確認" [ref=e163] [cursor=pointer]:
              - /url: /s/aiboux/checkout
              - generic [ref=e164]: 準備中
              - heading "決済・定期購入" [level=3] [ref=e165]
              - paragraph [ref=e166]: 定期購入はDB migrationと決済接続が完了するまで申込み不可として表示します。成功したふりはしません。
              - generic [ref=e167]: 注文前に確認
            - link "サポート 問い合わせ導線 商品名、注文番号、配送、返品、定期購入の確認事項を問い合わせページで整理します。 問い合わせる" [ref=e168] [cursor=pointer]:
              - /url: /s/aiboux/contact
              - generic [ref=e169]: サポート
              - heading "問い合わせ導線" [level=3] [ref=e170]
              - paragraph [ref=e171]: 商品名、注文番号、配送、返品、定期購入の確認事項を問い合わせページで整理します。
              - generic [ref=e172]: 問い合わせる
        - paragraph [ref=e173]: ポイント付与対象商品です。
        - generic [ref=e174]:
          - heading "バリエーション" [level=2] [ref=e175]
          - generic [ref=e176]:
            - generic [ref=e177]: 標準
            - generic [ref=e178]: ギフト対応
        - generic [ref=e179]:
          - heading "商品説明" [level=2] [ref=e180]
          - paragraph [ref=e181]: 毎日使えるホームケア洗剤セットは、毎日の暮らしで使いやすい品質と価格のバランスを重視した雪花セレクトの商品です。ギフトやまとめ買いにも選びやすいよう、配送条件と在庫状況を確認しながら購入できます。
        - generic [ref=e182]:
          - heading "商品仕様" [level=2] [ref=e183]
          - generic [ref=e184]:
            - generic [ref=e185]:
              - term [ref=e186]: SKU
              - definition [ref=e187]: "4580000232621"
            - generic [ref=e188]:
              - term [ref=e189]: カテゴリ
              - definition [ref=e190]: 日用品
            - generic [ref=e191]:
              - term [ref=e192]: 配送目安
              - definition [ref=e193]: 通常2〜4営業日で発送
            - generic [ref=e194]:
              - term [ref=e195]: 返品条件
              - definition [ref=e196]: 未開封・未使用品は到着後7日以内に問い合わせ
      - complementary [ref=e197]:
        - generic [ref=e198]: 購入ボックス
        - generic [ref=e199]: ¥2,980 税込
        - generic [ref=e200]:
          - generic [ref=e201]: 定期購入は本番接続後に有効化します。
          - paragraph [ref=e202]: DB migrationが未適用のため、現在は申し込みできません。通常購入と商品閲覧は利用できます。
        - generic [ref=e203]:
          - text: "初回お届け目安: 2〜4営業日"
          - text: "配送方法: 宅配便 / 追跡番号あり"
        - paragraph [ref=e204]: 在庫あり
        - generic [ref=e205]:
          - text: 数量
          - textbox "数量" [ref=e206]: "1"
        - list [ref=e207]:
          - listitem [ref=e208]: ・3,980円以上で送料無料
          - listitem [ref=e209]: ・未開封品は返品条件を確認できます
          - listitem [ref=e210]: ・決済未接続時は注文確定しません
        - generic [ref=e211]:
          - button "カートに入れる" [ref=e212]
          - link "今すぐ購入" [ref=e213] [cursor=pointer]:
            - /url: /s/aiboux/checkout
          - link "カートを見る" [ref=e214] [cursor=pointer]:
            - /url: /s/aiboux/cart
      - generic [ref=e215]:
        - heading "関連商品" [level=2] [ref=e216]
        - generic [ref=e217]:
          - article [ref=e218]:
            - link "雪花セレクト ドリップコーヒー 20袋の商品詳細を見る" [ref=e219] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-coffee-related
              - img "雪花セレクト ドリップコーヒー 20袋 商品画像" [ref=e220]
            - link "コーヒー・お茶" [ref=e221] [cursor=pointer]:
              - /url: /s/aiboux/products?category=coffee-tea
            - link "雪花セレクト ドリップコーヒー 20袋" [ref=e222] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-coffee-related
            - generic "評価 4.4、レビュー 128件" [ref=e223]:
              - generic [ref=e224]: ★★★★★
              - generic [ref=e225]: (128)
            - generic [ref=e226]: ¥1,980 税込
            - link "商品詳細で確認" [ref=e227] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-coffee-related
          - article [ref=e228]:
            - link "軽量ステンレスボトル 500mlの商品詳細を見る" [ref=e229] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-bottle-related
              - img "軽量ステンレスボトル 500ml 商品画像" [ref=e230]
            - link "キッチン用品" [ref=e231] [cursor=pointer]:
              - /url: /s/aiboux/products?category=kitchen
            - link "軽量ステンレスボトル 500ml" [ref=e232] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-bottle-related
            - generic "評価 4.5、レビュー 159件" [ref=e233]:
              - generic [ref=e234]: ★★★★★
              - generic [ref=e235]: (159)
            - generic [ref=e236]: ¥2,480 税込
            - link "商品詳細で確認" [ref=e237] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-bottle-related
          - article [ref=e238]:
            - link "雪花セレクト ギフトタオル 2枚セットの商品詳細を見る" [ref=e239] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-towel-related
              - img "雪花セレクト ギフトタオル 2枚セット 商品画像" [ref=e240]
            - link "タオル・寝具" [ref=e241] [cursor=pointer]:
              - /url: /s/aiboux/products?category=towels
            - link "雪花セレクト ギフトタオル 2枚セット" [ref=e242] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-towel-related
            - generic "評価 4.6、レビュー 190件" [ref=e243]:
              - generic [ref=e244]: ★★★★★
              - generic [ref=e245]: (190)
            - generic [ref=e246]: ¥2,980 税込
            - link "商品詳細で確認" [ref=e247] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-towel-related
          - article [ref=e248]:
            - link "季節のギフトボックスの商品詳細を見る" [ref=e249] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-gift-related
              - img "季節のギフトボックス 商品画像" [ref=e250]
            - link "ギフト" [ref=e251] [cursor=pointer]:
              - /url: /s/aiboux/products?category=gift
            - link "季節のギフトボックス" [ref=e252] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-gift-related
            - generic "評価 4.7、レビュー 221件" [ref=e253]:
              - generic [ref=e254]: ★★★★★
              - generic [ref=e255]: (221)
            - generic [ref=e256]: ¥5,980 税込
            - link "商品詳細で確認" [ref=e257] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-gift-related
    - region "毎日使えるホームケア洗剤セットの購入前チェック" [ref=e258]:
      - generic [ref=e259]:
        - generic [ref=e260]:
          - paragraph [ref=e261]: Buying guide
          - heading "毎日使えるホームケア洗剤セットの購入前チェック" [level=2] [ref=e262]
          - paragraph [ref=e263]: 価格、税込、配送、返品、決済、定期購入の未接続状態をページごとに整理し、購入判断と検索理解に必要な内部リンクを共通化します。
        - generic [ref=e264]: SEO内部リンク強化
      - generic [ref=e265]:
        - article [ref=e266]:
          - heading "商品詳細で購入判断に必要な情報は揃っていますか。" [level=3] [ref=e267]
          - paragraph [ref=e268]: 商品名、画像、税込価格、レビュー、在庫、配送、返品、定期購入状態を購入ボックス周辺に集約します。
          - link "カートを見る" [ref=e269] [cursor=pointer]:
            - /url: /s/aiboux/cart
        - article [ref=e270]:
          - heading "商品名の重複やSEO上の薄い見出しはありませんか。" [level=3] [ref=e271]
          - paragraph [ref=e272]: 商品詳細は可視H1を1つに絞り、パンくずと構造化データで階層を補強します。
          - link "関連商品を探す" [ref=e273] [cursor=pointer]:
            - /url: /s/aiboux/products
        - article [ref=e274]:
          - heading "購入前に価格・税込・送料をどこで確認できますか。" [level=3] [ref=e275]
          - paragraph [ref=e276]: 商品カードと商品詳細は税込表示で揃え、送料と配送目安は配送ページへ集約しています。
          - link "送料と配送を見る" [ref=e277] [cursor=pointer]:
            - /url: /s/aiboux/shipping
        - article [ref=e278]:
          - heading "返品やキャンセル条件は注文前に確認できますか。" [level=3] [ref=e279]
          - paragraph [ref=e280]: 返品条件、未開封品、初期不良、問い合わせ期限を共通テンプレートで確認できます。
          - link "返品条件を見る" [ref=e281] [cursor=pointer]:
            - /url: /s/aiboux/returns
        - article [ref=e282]:
          - heading "決済や定期購入が未接続の場合はどう表示されますか。" [level=3] [ref=e283]
          - paragraph [ref=e284]: 成功したふりをせず、決済未接続や定期購入DB未適用を画面上で明示します。
          - link "注文前に確認" [ref=e285] [cursor=pointer]:
            - /url: /s/aiboux/checkout
        - article [ref=e286]:
          - heading "迷ったときはどのページへ進めばよいですか。" [level=3] [ref=e287]
          - paragraph [ref=e288]: 商品一覧、カテゴリ、FAQ、問い合わせへ戻れる内部リンクを全ページに配置しています。
          - link "FAQを見る" [ref=e289] [cursor=pointer]:
            - /url: /s/aiboux/faq
    - region "このページから次に確認すること" [ref=e290]:
      - generic [ref=e292]:
        - paragraph [ref=e293]: Related navigation
        - heading "このページから次に確認すること" [level=2] [ref=e294]
        - paragraph [ref=e295]: 商品発見、購入前確認、購入後サポートをページごとに整理し、SEOに必要な説明的リンクを共通化します。
      - navigation "関連する内部リンク" [ref=e296]:
        - generic [ref=e297]:
          - heading "商品詳細で確認する" [level=3] [ref=e298]
          - paragraph [ref=e299]: 購入判断に必要な比較、返品、配送、問い合わせ導線を商品詳細から離脱させずに提示します。
          - list [ref=e300]:
            - listitem [ref=e301]:
              - link "同じカテゴリを見る" [ref=e302] [cursor=pointer]:
                - /url: /s/aiboux/products
            - listitem [ref=e303]:
              - link "カートを見る" [ref=e304] [cursor=pointer]:
                - /url: /s/aiboux/cart
            - listitem [ref=e305]:
              - link "配送条件" [ref=e306] [cursor=pointer]:
                - /url: /s/aiboux/shipping
            - listitem [ref=e307]:
              - link "返品条件" [ref=e308] [cursor=pointer]:
                - /url: /s/aiboux/returns
        - generic [ref=e309]:
          - heading "商品を探す" [level=3] [ref=e310]
          - paragraph [ref=e311]: 価格、税込表示、レビュー、カテゴリ、在庫、配送条件を同じ導線で比較します。
          - list [ref=e312]:
            - listitem [ref=e313]:
              - link "すべての商品" [ref=e314] [cursor=pointer]:
                - /url: /s/aiboux/products
            - listitem [ref=e315]:
              - link "カテゴリ一覧" [ref=e316] [cursor=pointer]:
                - /url: /s/aiboux/categories
            - listitem [ref=e317]:
              - link "食品・飲料" [ref=e318] [cursor=pointer]:
                - /url: /s/aiboux/products?category=food-drink
            - listitem [ref=e319]:
              - link "日用品" [ref=e320] [cursor=pointer]:
                - /url: /s/aiboux/products?category=daily-goods
            - listitem [ref=e321]:
              - link "タイムセール" [ref=e322] [cursor=pointer]:
                - /url: /s/aiboux/products?category=sale
            - listitem [ref=e323]:
              - link "売れ筋ランキング" [ref=e324] [cursor=pointer]:
                - /url: /s/aiboux/products?category=ranking
        - generic [ref=e325]:
          - heading "購入前に確認" [level=3] [ref=e326]
          - paragraph [ref=e327]: 送料、返品、問い合わせ、取引条件を購入前に確認できるようにします。
          - list [ref=e328]:
            - listitem [ref=e329]:
              - link "カート" [ref=e330] [cursor=pointer]:
                - /url: /s/aiboux/cart
            - listitem [ref=e331]:
              - link "チェックアウト" [ref=e332] [cursor=pointer]:
                - /url: /s/aiboux/checkout
            - listitem [ref=e333]:
              - link "配送について" [ref=e334] [cursor=pointer]:
                - /url: /s/aiboux/shipping
            - listitem [ref=e335]:
              - link "返品について" [ref=e336] [cursor=pointer]:
                - /url: /s/aiboux/returns
            - listitem [ref=e337]:
              - link "特定商取引法" [ref=e338] [cursor=pointer]:
                - /url: /s/aiboux/legal
            - listitem [ref=e339]:
              - link "問い合わせ" [ref=e340] [cursor=pointer]:
                - /url: /s/aiboux/contact
        - generic [ref=e341]:
          - heading "購入後サポート" [level=3] [ref=e342]
          - paragraph [ref=e343]: 注文履歴、マイページ、定期購入、お気に入りへ迷わず戻れるようにします。
          - list [ref=e344]:
            - listitem [ref=e345]:
              - link "マイページ" [ref=e346] [cursor=pointer]:
                - /url: /s/aiboux/mypage
            - listitem [ref=e347]:
              - link "注文履歴" [ref=e348] [cursor=pointer]:
                - /url: /s/aiboux/orders
            - listitem [ref=e349]:
              - link "お気に入り" [ref=e350] [cursor=pointer]:
                - /url: /s/aiboux/favorites
            - listitem [ref=e351]:
              - link "定期購入" [ref=e352] [cursor=pointer]:
                - /url: /s/aiboux/mypage/subscriptions
            - listitem [ref=e353]:
              - link "ログイン" [ref=e354] [cursor=pointer]:
                - /url: /s/aiboux/login
            - listitem [ref=e355]:
              - link "会員登録" [ref=e356] [cursor=pointer]:
                - /url: /s/aiboux/register
    - region "株式会社雪花 公式ストアで迷わず探す" [ref=e357]:
      - generic [ref=e358]:
        - generic [ref=e359]:
          - paragraph [ref=e360]: Store navigation
          - heading "株式会社雪花 公式ストアで迷わず探す" [level=2] [ref=e361]
          - paragraph [ref=e362]: 商品、カテゴリ、配送、返品、注文履歴を説明的なリンクで整理します。検索エンジンにもユーザーにも分かる、共通の内部リンク導線です。
        - link "商品一覧へ" [ref=e363] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e364]:
        - navigation "株式会社雪花 公式ストア SEO内部リンク" [ref=e365]:
          - generic [ref=e366]:
            - heading "人気カテゴリ" [level=3] [ref=e367]
            - list [ref=e368]:
              - listitem [ref=e369]:
                - link "食品・飲料を比較する" [ref=e370] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=food-drink
              - listitem [ref=e371]:
                - link "コーヒー・お茶を見る" [ref=e372] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=coffee-tea
              - listitem [ref=e373]:
                - link "キッチン用品を探す" [ref=e374] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=kitchen
              - listitem [ref=e375]:
                - link "日用品をまとめ買いする" [ref=e376] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=daily-goods
              - listitem [ref=e377]:
                - link "ギフト商品を選ぶ" [ref=e378] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=gift
          - generic [ref=e379]:
            - heading "購入前ガイド" [level=3] [ref=e380]
            - list [ref=e381]:
              - listitem [ref=e382]:
                - link "送料と配送予定を確認する" [ref=e383] [cursor=pointer]:
                  - /url: /s/aiboux/shipping
              - listitem [ref=e384]:
                - link "返品・交換条件を確認する" [ref=e385] [cursor=pointer]:
                  - /url: /s/aiboux/returns
              - listitem [ref=e386]:
                - link "よくある質問を見る" [ref=e387] [cursor=pointer]:
                  - /url: /s/aiboux/faq
              - listitem [ref=e388]:
                - link "ストアへ問い合わせる" [ref=e389] [cursor=pointer]:
                  - /url: /s/aiboux/contact
          - generic [ref=e390]:
            - heading "購入後サポート" [level=3] [ref=e391]
            - list [ref=e392]:
              - listitem [ref=e393]:
                - link "注文履歴を確認する" [ref=e394] [cursor=pointer]:
                  - /url: /s/aiboux/orders
              - listitem [ref=e395]:
                - link "マイページを開く" [ref=e396] [cursor=pointer]:
                  - /url: /s/aiboux/mypage
              - listitem [ref=e397]:
                - link "お気に入り商品を見る" [ref=e398] [cursor=pointer]:
                  - /url: /s/aiboux/favorites
              - listitem [ref=e399]:
                - link "定期購入の状態を見る" [ref=e400] [cursor=pointer]:
                  - /url: /s/aiboux/mypage/subscriptions
        - complementary "購入判断の要点" [ref=e401]:
          - link "商品比較 価格、税込、レビュー、在庫、配送目安を同じ商品カードで比較します。 商品一覧" [ref=e402] [cursor=pointer]:
            - /url: /s/aiboux/products
            - text: 商品比較
            - generic [ref=e403]: 価格、税込、レビュー、在庫、配送目安を同じ商品カードで比較します。
            - generic [ref=e404]: 商品一覧
          - link "購入条件 送料、返品、特商法、決済設定状態を注文前に確認できます。 取引条件" [ref=e405] [cursor=pointer]:
            - /url: /s/aiboux/legal
            - text: 購入条件
            - generic [ref=e406]: 送料、返品、特商法、決済設定状態を注文前に確認できます。
            - generic [ref=e407]: 取引条件
          - link "アカウント 注文履歴、配送状況、定期購入、お気に入りを同じ導線で確認します。 マイページ" [ref=e408] [cursor=pointer]:
            - /url: /s/aiboux/mypage
            - text: アカウント
            - generic [ref=e409]: 注文履歴、配送状況、定期購入、お気に入りを同じ導線で確認します。
            - generic [ref=e410]: マイページ
    - region "迷わず買えるための確認導線" [ref=e411]:
      - generic [ref=e412]:
        - generic [ref=e413]:
          - paragraph [ref=e414]: Shopping guide
          - heading "迷わず買えるための確認導線" [level=2] [ref=e415]
          - paragraph [ref=e416]: 商品比較、配送・返品、注文後の確認、定期購入の状態まで、SEOに忠実な内部リンクで移動できます。
        - link "商品一覧を見る" [ref=e417] [cursor=pointer]:
          - /url: /s/aiboux/products
          - generic [ref=e418]: 商品一覧を見る
      - generic [ref=e419]:
        - link "商品を探す 商品一覧、カテゴリ、ランキングから価格・税込・在庫・レビューを比較できます。 商品一覧へ" [ref=e420] [cursor=pointer]:
          - /url: /s/aiboux/products
          - heading "商品を探す" [level=3] [ref=e421]
          - paragraph [ref=e422]: 商品一覧、カテゴリ、ランキングから価格・税込・在庫・レビューを比較できます。
          - generic [ref=e423]: 商品一覧へ
        - link "購入前に確認 送料、返品条件、決済設定状態、特定商取引法の表示を注文前に確認できます。 配送条件を見る" [ref=e424] [cursor=pointer]:
          - /url: /s/aiboux/shipping
          - heading "購入前に確認" [level=3] [ref=e425]
          - paragraph [ref=e426]: 送料、返品条件、決済設定状態、特定商取引法の表示を注文前に確認できます。
          - generic [ref=e427]: 配送条件を見る
        - link "注文後の確認 注文履歴、配送状況、問い合わせ、領収書導線を同じマイページ導線で確認します。 注文履歴へ" [ref=e428] [cursor=pointer]:
          - /url: /s/aiboux/orders
          - heading "注文後の確認" [level=3] [ref=e429]
          - paragraph [ref=e430]: 注文履歴、配送状況、問い合わせ、領収書導線を同じマイページ導線で確認します。
          - generic [ref=e431]: 注文履歴へ
        - link "定期購入 定期購入は本番DB migrationと決済接続が完了するまで、準備中として正直に表示します。 定期購入を見る" [ref=e432] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
          - heading "定期購入" [level=3] [ref=e433]
          - paragraph [ref=e434]: 定期購入は本番DB migrationと決済接続が完了するまで、準備中として正直に表示します。
          - generic [ref=e435]: 定期購入を見る
      - navigation "購入サポートの内部リンク" [ref=e436]:
        - link "カテゴリから探す" [ref=e437] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "カートを見る" [ref=e438] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e439] [cursor=pointer]:
          - /url: /s/aiboux/checkout
        - link "問い合わせ" [ref=e440] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e441] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "返品について" [ref=e442] [cursor=pointer]:
          - /url: /s/aiboux/returns
        - link "マイページ" [ref=e443] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "お気に入り" [ref=e444] [cursor=pointer]:
          - /url: /s/aiboux/favorites
  - contentinfo [ref=e445]:
    - link "ページ上部へ戻る" [ref=e446] [cursor=pointer]:
      - /url: "#top"
    - generic [ref=e447]:
      - generic [ref=e448]:
        - heading "税込価格" [level=2] [ref=e449]
        - paragraph [ref=e450]: 商品価格は税込表示で統一します。
      - generic [ref=e451]:
        - heading "配送・返品" [level=2] [ref=e452]
        - paragraph [ref=e453]: 配送予定、返品条件、問い合わせ先を各ページから確認できます。
      - generic [ref=e454]:
        - heading "決済状態" [level=2] [ref=e455]
        - paragraph [ref=e456]: 決済未接続時は注文確定したふりをせず、設定未完了として表示します。
      - generic [ref=e457]:
        - heading "定期購入" [level=2] [ref=e458]
        - paragraph [ref=e459]: 定期購入はDB migrationと決済接続が完了するまで正直に準備中表示にします。
    - generic [ref=e460]:
      - navigation "お買い物" [ref=e461]:
        - heading "お買い物" [level=2] [ref=e462]
        - link "商品一覧" [ref=e463] [cursor=pointer]:
          - /url: /s/aiboux/products
        - link "カテゴリ" [ref=e464] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "タイムセール" [ref=e465] [cursor=pointer]:
          - /url: /s/aiboux/products?category=sale
        - link "売れ筋ランキング" [ref=e466] [cursor=pointer]:
          - /url: /s/aiboux/products?category=ranking
        - link "お気に入り" [ref=e467] [cursor=pointer]:
          - /url: /s/aiboux/favorites
      - navigation "アカウント" [ref=e468]:
        - heading "アカウント" [level=2] [ref=e469]
        - link "マイページ" [ref=e470] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "注文履歴" [ref=e471] [cursor=pointer]:
          - /url: /s/aiboux/orders
        - link "定期購入" [ref=e472] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
        - link "ログイン" [ref=e473] [cursor=pointer]:
          - /url: /s/aiboux/login
      - navigation "サポート" [ref=e474]:
        - heading "サポート" [level=2] [ref=e475]
        - link "問い合わせ" [ref=e476] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e477] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "配送について" [ref=e478] [cursor=pointer]:
          - /url: /s/aiboux/shipping
        - link "返品について" [ref=e479] [cursor=pointer]:
          - /url: /s/aiboux/returns
      - navigation "ストア情報" [ref=e480]:
        - heading "ストア情報" [level=2] [ref=e481]
        - link "特定商取引法" [ref=e482] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシーポリシー" [ref=e483] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "カート" [ref=e484] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e485] [cursor=pointer]:
          - /url: /s/aiboux/checkout
    - generic [ref=e487]:
      - generic [ref=e488]:
        - generic [ref=e489]: 株式会社雪花 公式ストア
        - paragraph [ref=e490]: 注文、配送、返品、定期購入、問い合わせまで同じテナント導線で確認できます。決済未接続時は注文確定しません。
      - navigation "ストア基本情報" [ref=e491]:
        - link "特商法" [ref=e492] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシー" [ref=e493] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "問い合わせ" [ref=e494] [cursor=pointer]:
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
  47  |       await expect(page.getByTestId("public-product-purchase-box").getByText(/在庫あり|在庫確認/)).toBeVisible();
> 48  |       await expect(page.getByText("商品説明")).toBeVisible();
      |                                            ^ Error: expect(locator).toBeVisible() failed
  49  |       await expect(page.getByText(/AIBOUX公開検証商品|公開検証商品|検証商品/)).toHaveCount(0);
  50  |       await expect(page.getByTestId("product-main-image")).toBeVisible();
  51  |       expect(await page.getByTestId("product-thumbnail").count(), "thumbnail gallery should use real image thumbnails").toBeGreaterThanOrEqual(5);
  52  |       const thumbnailImages = page.locator("[data-testid='product-thumbnail'] img");
  53  |       expect(await thumbnailImages.count(), "thumbnail images should be visible instead of numbered boxes").toBeGreaterThanOrEqual(5);
  54  |       await expect(
  55  |         page.getByTestId("public-product-info").locator("dt", { hasText: /^返品条件$/ }),
  56  |       ).toBeVisible();
  57  |       const commerceFacts = page.getByTestId("storefront-commerce-facts");
  58  |       await expect(commerceFacts, "product detail should include shared merchant listing purchase facts").toBeVisible();
  59  |       await expect(commerceFacts, "product detail purchase facts should include price/shipping/returns/payment context").toContainText("価格・配送・返品・決済");
  60  |       await expect(commerceFacts, "product detail purchase facts should include the visible product price").toContainText("¥");
  61  |       await expect(commerceFacts, "product detail purchase facts should expose SiteNavigationElement microdata").toHaveAttribute(
  62  |         "itemtype",
  63  |         "https://schema.org/SiteNavigationElement",
  64  |       );
  65  |       expect(await commerceFacts.locator("a").count(), "product detail purchase facts should expose crawlable internal links").toBeGreaterThanOrEqual(5);
  66  |       const qualitySummary = page.getByTestId("storefront-page-quality-summary");
  67  |       await expect(qualitySummary, "product detail should include shared page quality summary").toBeVisible();
  68  |       await expect(qualitySummary, "product detail quality summary should identify page role").toContainText("商品詳細で確認できること");
  69  |       await expect(qualitySummary, "product detail quality summary should reinforce single-H1 cleanup").toContainText("単一H1");
  70  |       await expect(qualitySummary, "product detail quality summary should mention product structured data").toContainText("Product/Offer");
  71  |       expect(await qualitySummary.locator("a").count(), "product detail quality summary should expose crawlable links").toBeGreaterThanOrEqual(4);
  72  |       expect(await qualitySummary.locator("a").first().getAttribute("class"), "product detail quality summary links should be visibly blue").toContain("text-blue-700");
  73  |       const actionMap = page.getByTestId("storefront-page-action-map");
  74  |       await expect(actionMap, "product detail should include shared page action map").toBeVisible();
  75  |       await expect(actionMap, "product detail action map should expose ItemList microdata").toHaveAttribute(
  76  |         "itemtype",
  77  |         "https://schema.org/ItemList",
  78  |       );
  79  |       await expect(actionMap, "product detail action map should explain product purchase actions").toContainText("商品詳細で購入判断を完結する");
  80  |       await expect(actionMap, "product detail action map should link to cart or shipping context").toContainText(/カート|配送条件/);
  81  |       await expect(actionMap.locator('meta[itemprop="numberOfItems"]'), "product detail action map should declare numberOfItems").toHaveCount(1);
  82  |       expect(await actionMap.locator('[itemtype="https://schema.org/ListItem"]').count(), "product detail action map should expose ListItem microdata").toBeGreaterThanOrEqual(3);
  83  |       expect(await actionMap.locator("a").count(), "product detail action map should expose crawlable internal links").toBeGreaterThanOrEqual(3);
  84  |       expect(await actionMap.locator("a").first().getAttribute("class"), "product detail action map links should be visibly blue").toContain("text-blue-700");
  85  |       const buyingGuide = page.getByTestId("storefront-buying-guide");
  86  |       await expect(buyingGuide, "product detail should include page-specific buying guide").toBeVisible();
  87  |       await expect(buyingGuide, "product detail buying guide should mention product purchase decisions").toContainText("購入前チェック");
  88  |       await expect(buyingGuide, "product detail buying guide should reinforce single-H1 SEO cleanup").toContainText("可視H1を1つ");
  89  |       expect(await buyingGuide.locator("a").count(), "product detail buying guide should expose crawlable links").toBeGreaterThanOrEqual(4);
  90  |       expect(await buyingGuide.locator("a").first().getAttribute("class"), "product detail buying guide links should be visibly blue").toContain("text-blue-700");
  91  |       const relatedCards = page.getByTestId("storefront-product-card");
  92  |       expect(await relatedCards.count(), "product detail related products should use the shared storefront product card").toBeGreaterThanOrEqual(4);
  93  |       await expect(relatedCards.first(), "related product card should expose Product microdata").toHaveAttribute(
  94  |         "itemtype",
  95  |         "https://schema.org/Product",
  96  |       );
  97  |       await expect(
  98  |         relatedCards.first().locator('[itemtype="https://schema.org/Offer"]'),
  99  |         "related product card should expose Offer microdata",
  100 |       ).toHaveCount(1);
  101 |       await expect(
  102 |         relatedCards.first().getByTestId("storefront-product-card-link"),
  103 |         "related product card should link to product detail",
  104 |       ).toHaveAttribute("href", /\/s\/aiboux\/product\//);
  105 |       await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  106 |       const breadcrumb = page.getByTestId("storefront-breadcrumb");
  107 |       await expect(breadcrumb).toBeVisible();
  108 |       await expect(breadcrumb).toHaveAttribute("itemtype", "https://schema.org/BreadcrumbList");
  109 |       expect(await breadcrumb.locator('[itemtype="https://schema.org/ListItem"]').count(), "product breadcrumb should expose visible ListItem microdata").toBeGreaterThanOrEqual(3);
  110 |       expect(await breadcrumb.locator("a").first().getAttribute("class"), "product breadcrumb links should be visibly link-colored").toContain("text-blue-700");
  111 |       await expect(page.getByTestId("storefront-breadcrumb-shell"), "product detail should use the shared breadcrumb shell").toContainText("現在地");
  112 |       const breadcrumbSupport = page.getByTestId("storefront-breadcrumb-support-links");
  113 |       await expect(breadcrumbSupport, "product detail should expose breadcrumb support links").toBeVisible();
  114 |       await expect(breadcrumbSupport, "product detail breadcrumb support should use SiteNavigationElement microdata").toHaveAttribute(
  115 |         "itemtype",
  116 |         "https://schema.org/SiteNavigationElement",
  117 |       );
  118 |       expect(await breadcrumbSupport.locator("a").count(), "product detail should expose multiple breadcrumb support links").toBeGreaterThanOrEqual(4);
  119 |       expect(await breadcrumbSupport.locator("a").first().getAttribute("class"), "product detail breadcrumb support links should be visibly blue").toContain("text-blue-700");
  120 |       await expect(breadcrumbSupport, "product detail breadcrumb support should link back to cart or product comparison").toContainText(/カート|商品一覧/);
  121 |       await expect(page.locator("h1")).toHaveCount(1);
  122 |       const productTitle = (await page.locator("h1").innerText()).trim();
  123 |       await expect(page.getByTestId("storefront-breadcrumb-current"), "product breadcrumb current label should not duplicate the full product title above the gallery").toHaveText("商品詳細");
  124 |       expect(await page.getByText(productTitle, { exact: true }).count(), "product title should be visible only as the primary product h1").toBe(1);
  125 | 
  126 |       const jsonLdText = await page.locator('script[type="application/ld+json"]').first().textContent();
  127 |       const jsonLd = JSON.parse(jsonLdText || "{}");
  128 |       expect(jsonLd["@context"], "product detail structured data should use a single top-level schema.org context").toBe("https://schema.org");
  129 |       expect(Array.isArray(jsonLd["@graph"]), "product detail structured data should be emitted as @graph").toBe(true);
  130 |       expect(jsonLd["@graph"].length, "product detail @graph should contain connected storefront and product entities").toBeGreaterThanOrEqual(6);
  131 |       expect((jsonLdText?.match(/"@context"/g) ?? []).length, "product detail should not repeat @context inside graph nodes").toBe(1);
  132 |       expect(jsonLdText ?? "", "product detail should include BreadcrumbList JSON-LD").toContain("BreadcrumbList");
  133 |       expect(jsonLdText ?? "", "product breadcrumb JSON-LD should preserve the full product title").toContain(productTitle);
  134 |       expect(jsonLdText ?? "", "product detail should include Product JSON-LD").toContain("Product");
  135 |       expect(jsonLdText ?? "", "product detail should include Offer JSON-LD").toContain("Offer");
  136 |       expect(jsonLdText ?? "", "product detail should identify the storefront as OnlineStore JSON-LD").toContain("OnlineStore");
  137 |       expect(jsonLdText ?? "", "product detail should link Product to its canonical WebPage").toContain("mainEntityOfPage");
  138 |       expect(jsonLdText ?? "", "product detail should link offer seller to the shared store entity").toContain("seller");
  139 |       expect(jsonLdText ?? "", "product detail should expose stable store and website entity ids").toContain("#store");
  140 |       expect(jsonLdText ?? "", "product detail should expose stable website entity id").toContain("#website");
  141 |       expect(jsonLdText ?? "", "product detail WebPage should be linked to the WebSite entity").toContain("isPartOf");
  142 |       expect(jsonLdText ?? "", "product detail should include Organization return policy JSON-LD").toContain("MerchantReturnPolicy");
  143 |       expect(jsonLdText ?? "", "product detail should include shipping details for merchant listing").toContain("OfferShippingDetails");
  144 | 
  145 |       const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  146 |       expect(canonical ?? "", "product detail canonical should point at the product URL").toContain("https://shop.aiboux.com/s/aiboux/product/");
  147 |       const titleText = await page.title();
  148 |       expect(titleText, "product detail title should include the product name").toContain(productTitle);
```