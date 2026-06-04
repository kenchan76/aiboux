# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-product-detail-public.spec.ts >> AIBOUX Shop product detail public quality >> product detail renders purchase-ready layout at 390px
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
    - generic [ref=e31]:
      - navigation "パンくずリスト" [ref=e32]:
        - generic [ref=e33]: 現在地
        - link "TOP" [ref=e35] [cursor=pointer]:
          - /url: /s/aiboux/
        - generic [ref=e36]:
          - generic [ref=e37]: /
          - link "商品一覧" [ref=e38] [cursor=pointer]:
            - /url: /s/aiboux/products
        - generic [ref=e39]:
          - generic [ref=e40]: /
          - link "日用品" [ref=e41] [cursor=pointer]:
            - /url: /s/aiboux/products?category=daily-goods
        - generic [ref=e42]:
          - generic [ref=e43]: /
          - generic [ref=e44]: 商品詳細
      - navigation "パンくず関連リンク" [ref=e45]:
        - link "日用品を見る" [ref=e46] [cursor=pointer]:
          - /url: /s/aiboux/products?category=daily-goods
          - generic [ref=e47]: 日用品を見る
        - link "商品一覧" [ref=e48] [cursor=pointer]:
          - /url: /s/aiboux/products
          - generic [ref=e49]: 商品一覧
        - link "カート" [ref=e50] [cursor=pointer]:
          - /url: /s/aiboux/cart
          - generic [ref=e51]: カート
        - link "返品条件" [ref=e52] [cursor=pointer]:
          - /url: /s/aiboux/returns
          - generic [ref=e53]: 返品条件
    - region "商品詳細で確認できること" [ref=e54]:
      - generic [ref=e55]:
        - generic [ref=e56]:
          - paragraph [ref=e57]: Page quality
          - heading "商品詳細で確認できること" [level=2] [ref=e58]
          - generic [ref=e59]:
            - paragraph [ref=e60]:
              - strong [ref=e61]: "検索意図:"
              - text: 1商品に集中し、画像、価格、在庫、配送、返品、購入ボックスで購入判断するページです。
            - paragraph [ref=e62]:
              - strong [ref=e63]: "SEO構造:"
              - text: Product/Offer、BreadcrumbList、MerchantReturnPolicyを同じ商品文脈で接続します。
            - paragraph [ref=e64]:
              - strong [ref=e65]: "次の操作:"
              - text: 画像、説明、仕様、購入ボックス、関連商品を確認してカートへ進みます。
        - navigation "商品詳細の購入・検索補助リンク" [ref=e66]:
          - link "H1 単一H1 商品名は可視H1を1つに維持し、画像上の二重タイトルは出しません。 関連商品" [ref=e67] [cursor=pointer]:
            - /url: /s/aiboux/products
            - generic [ref=e68]: H1
            - heading "単一H1" [level=3] [ref=e69]
            - paragraph [ref=e70]: 商品名は可視H1を1つに維持し、画像上の二重タイトルは出しません。
            - generic [ref=e71]: 関連商品
          - link "購入 購入条件 税込価格、在庫、配送予定、返品条件、定期購入状態を購入前に表示します。 カート" [ref=e72] [cursor=pointer]:
            - /url: /s/aiboux/cart
            - generic [ref=e73]: 購入
            - heading "購入条件" [level=3] [ref=e74]
            - paragraph [ref=e75]: 税込価格、在庫、配送予定、返品条件、定期購入状態を購入前に表示します。
            - generic [ref=e76]: カート
          - link "購入前 価格・配送・返品 税込価格、配送目安、返品条件を購入前に確認できる導線を固定します。 配送条件" [ref=e77] [cursor=pointer]:
            - /url: /s/aiboux/shipping
            - generic [ref=e78]: 購入前
            - heading "価格・配送・返品" [level=3] [ref=e79]
            - paragraph [ref=e80]: 税込価格、配送目安、返品条件を購入前に確認できる導線を固定します。
            - generic [ref=e81]: 配送条件
          - link "支援 サポート導線 FAQ、問い合わせ、注文履歴へ戻れるクロール可能な内部リンクを維持します。 FAQ" [ref=e82] [cursor=pointer]:
            - /url: /s/aiboux/faq
            - generic [ref=e83]: 支援
            - heading "サポート導線" [level=3] [ref=e84]
            - paragraph [ref=e85]: FAQ、問い合わせ、注文履歴へ戻れるクロール可能な内部リンクを維持します。
            - generic [ref=e86]: FAQ
    - region "商品詳細で購入判断を完結する" [ref=e87]:
      - generic [ref=e88]:
        - generic [ref=e89]:
          - paragraph [ref=e90]: Next actions
          - heading "商品詳細で購入判断を完結する" [level=2] [ref=e91]
          - paragraph [ref=e92]: 商品名、画像、税込価格、在庫、配送、返品、定期購入状態を確認してカートへ進みます。
        - generic [ref=e93]: SEO内部リンク
      - generic [ref=e94]:
        - article [ref=e95]:
          - generic [ref=e96]: 情報
          - heading "商品情報を確認" [level=3] [ref=e97]
          - paragraph [ref=e98]: 商品説明、仕様、レビュー、関連商品を確認します。
          - link "関連商品へ" [ref=e99] [cursor=pointer]:
            - /url: /s/aiboux/products
        - article [ref=e100]:
          - generic [ref=e101]: 条件
          - heading "購入条件を確認" [level=3] [ref=e102]
          - paragraph [ref=e103]: 送料、返品、決済未接続時の扱いを購入前に確認します。
          - link "配送条件へ" [ref=e104] [cursor=pointer]:
            - /url: /s/aiboux/shipping
        - article [ref=e105]:
          - generic [ref=e106]: 購入
          - heading "カートへ進む" [level=3] [ref=e107]
          - paragraph [ref=e108]: 通常購入と定期購入状態を区別してカートへ追加します。
          - link "カートを見る" [ref=e109] [cursor=pointer]:
            - /url: /s/aiboux/cart
        - article [ref=e110]:
          - generic [ref=e111]: 支援
          - heading "不明点を解消する" [level=3] [ref=e112]
          - paragraph [ref=e113]: FAQと問い合わせ導線を使い、商品名や注文番号を添えて確認できます。
          - link "FAQを見る" [ref=e114] [cursor=pointer]:
            - /url: /s/aiboux/faq
    - generic [ref=e115]:
      - generic [ref=e117]:
        - generic [ref=e118]:
          - button "毎日使えるホームケア洗剤セット サムネイル 1" [ref=e119]:
            - img "毎日使えるホームケア洗剤セット サムネイル 1" [ref=e120]
          - button "毎日使えるホームケア洗剤セット サムネイル 2" [ref=e121]:
            - img "毎日使えるホームケア洗剤セット サムネイル 2" [ref=e122]
          - button "毎日使えるホームケア洗剤セット サムネイル 3" [ref=e123]:
            - img "毎日使えるホームケア洗剤セット サムネイル 3" [ref=e124]
          - button "毎日使えるホームケア洗剤セット サムネイル 4" [ref=e125]:
            - img "毎日使えるホームケア洗剤セット サムネイル 4" [ref=e126]
          - button "毎日使えるホームケア洗剤セット サムネイル 5" [ref=e127]:
            - img "毎日使えるホームケア洗剤セット サムネイル 5" [ref=e128]
        - img "毎日使えるホームケア洗剤セット 商品画像" [ref=e130]
      - generic [ref=e131]:
        - paragraph [ref=e132]: 日用品
        - heading "毎日使えるホームケア洗剤セット" [level=1] [ref=e133]
        - paragraph [ref=e134]:
          - text: ★★★★★
          - link "(レビューを確認)" [ref=e135] [cursor=pointer]:
            - /url: "#reviews"
        - generic [ref=e136]: ¥2,980 税込
        - region "価格・配送・返品・決済を購入前に確認" [ref=e137]:
          - generic [ref=e138]:
            - generic [ref=e139]:
              - paragraph [ref=e140]: Purchase facts
              - heading "価格・配送・返品・決済を購入前に確認" [level=2] [ref=e141]
            - link "よくある質問" [ref=e142] [cursor=pointer]:
              - /url: /s/aiboux/faq
              - generic [ref=e143]: よくある質問
          - generic [ref=e144]:
            - link "税込 価格・税込表示 毎日使えるホームケア洗剤セットの価格は¥2,980です。商品カード、商品詳細、カートで税込表示を揃えます。 カートで確認" [ref=e145] [cursor=pointer]:
              - /url: /s/aiboux/cart
              - generic [ref=e146]: 税込
              - heading "価格・税込表示" [level=3] [ref=e147]
              - paragraph [ref=e148]: 毎日使えるホームケア洗剤セットの価格は¥2,980です。商品カード、商品詳細、カートで税込表示を揃えます。
              - generic [ref=e149]: カートで確認
            - link "配送 在庫・配送予定 在庫あり・在庫確認を明示。配送は通常2〜4営業日を目安に、追跡と送料条件を配送ページへ集約します。 配送条件を見る" [ref=e150] [cursor=pointer]:
              - /url: /s/aiboux/shipping
              - generic [ref=e151]: 配送
              - heading "在庫・配送予定" [level=3] [ref=e152]
              - paragraph [ref=e153]: 在庫あり・在庫確認を明示。配送は通常2〜4営業日を目安に、追跡と送料条件を配送ページへ集約します。
              - generic [ref=e154]: 配送条件を見る
            - link "返品 返品・キャンセル 未開封・未使用品、初期不良、到着後7日以内の問い合わせ条件を購入前に確認できます。 返品条件を見る" [ref=e155] [cursor=pointer]:
              - /url: /s/aiboux/returns
              - generic [ref=e156]: 返品
              - heading "返品・キャンセル" [level=3] [ref=e157]
              - paragraph [ref=e158]: 未開封・未使用品、初期不良、到着後7日以内の問い合わせ条件を購入前に確認できます。
              - generic [ref=e159]: 返品条件を見る
            - link "準備中 決済・定期購入 定期購入はDB migrationと決済接続が完了するまで申込み不可として表示します。成功したふりはしません。 注文前に確認" [ref=e160] [cursor=pointer]:
              - /url: /s/aiboux/checkout
              - generic [ref=e161]: 準備中
              - heading "決済・定期購入" [level=3] [ref=e162]
              - paragraph [ref=e163]: 定期購入はDB migrationと決済接続が完了するまで申込み不可として表示します。成功したふりはしません。
              - generic [ref=e164]: 注文前に確認
            - link "サポート 問い合わせ導線 商品名、注文番号、配送、返品、定期購入の確認事項を問い合わせページで整理します。 問い合わせる" [ref=e165] [cursor=pointer]:
              - /url: /s/aiboux/contact
              - generic [ref=e166]: サポート
              - heading "問い合わせ導線" [level=3] [ref=e167]
              - paragraph [ref=e168]: 商品名、注文番号、配送、返品、定期購入の確認事項を問い合わせページで整理します。
              - generic [ref=e169]: 問い合わせる
        - paragraph [ref=e170]: ポイント付与対象商品です。
        - generic [ref=e171]:
          - heading "バリエーション" [level=2] [ref=e172]
          - generic [ref=e173]:
            - generic [ref=e174]: 標準
            - generic [ref=e175]: ギフト対応
        - generic [ref=e176]:
          - heading "商品説明" [level=2] [ref=e177]
          - paragraph [ref=e178]: 毎日使えるホームケア洗剤セットは、毎日の暮らしで使いやすい品質と価格のバランスを重視した雪花セレクトの商品です。ギフトやまとめ買いにも選びやすいよう、配送条件と在庫状況を確認しながら購入できます。
        - generic [ref=e179]:
          - heading "商品仕様" [level=2] [ref=e180]
          - generic [ref=e181]:
            - generic [ref=e182]:
              - term [ref=e183]: SKU
              - definition [ref=e184]: "4580000232621"
            - generic [ref=e185]:
              - term [ref=e186]: カテゴリ
              - definition [ref=e187]: 日用品
            - generic [ref=e188]:
              - term [ref=e189]: 配送目安
              - definition [ref=e190]: 通常2〜4営業日で発送
            - generic [ref=e191]:
              - term [ref=e192]: 返品条件
              - definition [ref=e193]: 未開封・未使用品は到着後7日以内に問い合わせ
      - complementary [ref=e194]:
        - generic [ref=e195]: 購入ボックス
        - generic [ref=e196]: ¥2,980 税込
        - generic [ref=e197]:
          - generic [ref=e198]: 定期購入は本番接続後に有効化します。
          - paragraph [ref=e199]: DB migrationが未適用のため、現在は申し込みできません。通常購入と商品閲覧は利用できます。
        - generic [ref=e200]:
          - text: "初回お届け目安: 2〜4営業日"
          - text: "配送方法: 宅配便 / 追跡番号あり"
        - paragraph [ref=e201]: 在庫あり
        - generic [ref=e202]:
          - text: 数量
          - textbox "数量" [ref=e203]: "1"
        - list [ref=e204]:
          - listitem [ref=e205]: ・3,980円以上で送料無料
          - listitem [ref=e206]: ・未開封品は返品条件を確認できます
          - listitem [ref=e207]: ・決済未接続時は注文確定しません
        - generic [ref=e208]:
          - button "カートに入れる" [ref=e209]
          - link "今すぐ購入" [ref=e210] [cursor=pointer]:
            - /url: /s/aiboux/checkout
          - link "カートを見る" [ref=e211] [cursor=pointer]:
            - /url: /s/aiboux/cart
      - generic [ref=e212]:
        - heading "関連商品" [level=2] [ref=e213]
        - generic [ref=e214]:
          - article [ref=e215]:
            - link "雪花セレクト ドリップコーヒー 20袋の商品詳細を見る" [ref=e216] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-coffee-related
              - img "雪花セレクト ドリップコーヒー 20袋 商品画像" [ref=e217]
            - link "コーヒー・お茶" [ref=e218] [cursor=pointer]:
              - /url: /s/aiboux/products?category=coffee-tea
            - link "雪花セレクト ドリップコーヒー 20袋" [ref=e219] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-coffee-related
            - generic "評価 4.4、レビュー 128件" [ref=e220]:
              - generic [ref=e221]: ★★★★★
              - generic [ref=e222]: (128)
            - generic [ref=e223]: ¥1,980 税込
            - link "商品詳細で確認" [ref=e224] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-coffee-related
          - article [ref=e225]:
            - link "軽量ステンレスボトル 500mlの商品詳細を見る" [ref=e226] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-bottle-related
              - img "軽量ステンレスボトル 500ml 商品画像" [ref=e227]
            - link "キッチン用品" [ref=e228] [cursor=pointer]:
              - /url: /s/aiboux/products?category=kitchen
            - link "軽量ステンレスボトル 500ml" [ref=e229] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-bottle-related
            - generic "評価 4.5、レビュー 159件" [ref=e230]:
              - generic [ref=e231]: ★★★★★
              - generic [ref=e232]: (159)
            - generic [ref=e233]: ¥2,480 税込
            - link "商品詳細で確認" [ref=e234] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-bottle-related
          - article [ref=e235]:
            - link "雪花セレクト ギフトタオル 2枚セットの商品詳細を見る" [ref=e236] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-towel-related
              - img "雪花セレクト ギフトタオル 2枚セット 商品画像" [ref=e237]
            - link "タオル・寝具" [ref=e238] [cursor=pointer]:
              - /url: /s/aiboux/products?category=towels
            - link "雪花セレクト ギフトタオル 2枚セット" [ref=e239] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-towel-related
            - generic "評価 4.6、レビュー 190件" [ref=e240]:
              - generic [ref=e241]: ★★★★★
              - generic [ref=e242]: (190)
            - generic [ref=e243]: ¥2,980 税込
            - link "商品詳細で確認" [ref=e244] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-towel-related
          - article [ref=e245]:
            - link "季節のギフトボックスの商品詳細を見る" [ref=e246] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-gift-related
              - img "季節のギフトボックス 商品画像" [ref=e247]
            - link "ギフト" [ref=e248] [cursor=pointer]:
              - /url: /s/aiboux/products?category=gift
            - link "季節のギフトボックス" [ref=e249] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-gift-related
            - generic "評価 4.7、レビュー 221件" [ref=e250]:
              - generic [ref=e251]: ★★★★★
              - generic [ref=e252]: (221)
            - generic [ref=e253]: ¥5,980 税込
            - link "商品詳細で確認" [ref=e254] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-gift-related
    - region "毎日使えるホームケア洗剤セットの購入前チェック" [ref=e255]:
      - generic [ref=e256]:
        - generic [ref=e257]:
          - paragraph [ref=e258]: Buying guide
          - heading "毎日使えるホームケア洗剤セットの購入前チェック" [level=2] [ref=e259]
          - paragraph [ref=e260]: 価格、税込、配送、返品、決済、定期購入の未接続状態をページごとに整理し、購入判断と検索理解に必要な内部リンクを共通化します。
        - generic [ref=e261]: SEO内部リンク強化
      - generic [ref=e262]:
        - article [ref=e263]:
          - heading "商品詳細で購入判断に必要な情報は揃っていますか。" [level=3] [ref=e264]
          - paragraph [ref=e265]: 商品名、画像、税込価格、レビュー、在庫、配送、返品、定期購入状態を購入ボックス周辺に集約します。
          - link "カートを見る" [ref=e266] [cursor=pointer]:
            - /url: /s/aiboux/cart
        - article [ref=e267]:
          - heading "商品名の重複やSEO上の薄い見出しはありませんか。" [level=3] [ref=e268]
          - paragraph [ref=e269]: 商品詳細は可視H1を1つに絞り、パンくずと構造化データで階層を補強します。
          - link "関連商品を探す" [ref=e270] [cursor=pointer]:
            - /url: /s/aiboux/products
        - article [ref=e271]:
          - heading "購入前に価格・税込・送料をどこで確認できますか。" [level=3] [ref=e272]
          - paragraph [ref=e273]: 商品カードと商品詳細は税込表示で揃え、送料と配送目安は配送ページへ集約しています。
          - link "送料と配送を見る" [ref=e274] [cursor=pointer]:
            - /url: /s/aiboux/shipping
        - article [ref=e275]:
          - heading "返品やキャンセル条件は注文前に確認できますか。" [level=3] [ref=e276]
          - paragraph [ref=e277]: 返品条件、未開封品、初期不良、問い合わせ期限を共通テンプレートで確認できます。
          - link "返品条件を見る" [ref=e278] [cursor=pointer]:
            - /url: /s/aiboux/returns
        - article [ref=e279]:
          - heading "決済や定期購入が未接続の場合はどう表示されますか。" [level=3] [ref=e280]
          - paragraph [ref=e281]: 成功したふりをせず、決済未接続や定期購入DB未適用を画面上で明示します。
          - link "注文前に確認" [ref=e282] [cursor=pointer]:
            - /url: /s/aiboux/checkout
        - article [ref=e283]:
          - heading "迷ったときはどのページへ進めばよいですか。" [level=3] [ref=e284]
          - paragraph [ref=e285]: 商品一覧、カテゴリ、FAQ、問い合わせへ戻れる内部リンクを全ページに配置しています。
          - link "FAQを見る" [ref=e286] [cursor=pointer]:
            - /url: /s/aiboux/faq
    - region "このページから次に確認すること" [ref=e287]:
      - generic [ref=e289]:
        - paragraph [ref=e290]: Related navigation
        - heading "このページから次に確認すること" [level=2] [ref=e291]
        - paragraph [ref=e292]: 商品発見、購入前確認、購入後サポートをページごとに整理し、SEOに必要な説明的リンクを共通化します。
      - navigation "関連する内部リンク" [ref=e293]:
        - generic [ref=e294]:
          - heading "商品詳細で確認する" [level=3] [ref=e295]
          - paragraph [ref=e296]: 購入判断に必要な比較、返品、配送、問い合わせ導線を商品詳細から離脱させずに提示します。
          - list [ref=e297]:
            - listitem [ref=e298]:
              - link "同じカテゴリを見る" [ref=e299] [cursor=pointer]:
                - /url: /s/aiboux/products
            - listitem [ref=e300]:
              - link "カートを見る" [ref=e301] [cursor=pointer]:
                - /url: /s/aiboux/cart
            - listitem [ref=e302]:
              - link "配送条件" [ref=e303] [cursor=pointer]:
                - /url: /s/aiboux/shipping
            - listitem [ref=e304]:
              - link "返品条件" [ref=e305] [cursor=pointer]:
                - /url: /s/aiboux/returns
        - generic [ref=e306]:
          - heading "商品を探す" [level=3] [ref=e307]
          - paragraph [ref=e308]: 価格、税込表示、レビュー、カテゴリ、在庫、配送条件を同じ導線で比較します。
          - list [ref=e309]:
            - listitem [ref=e310]:
              - link "すべての商品" [ref=e311] [cursor=pointer]:
                - /url: /s/aiboux/products
            - listitem [ref=e312]:
              - link "カテゴリ一覧" [ref=e313] [cursor=pointer]:
                - /url: /s/aiboux/categories
            - listitem [ref=e314]:
              - link "食品・飲料" [ref=e315] [cursor=pointer]:
                - /url: /s/aiboux/products?category=food-drink
            - listitem [ref=e316]:
              - link "日用品" [ref=e317] [cursor=pointer]:
                - /url: /s/aiboux/products?category=daily-goods
            - listitem [ref=e318]:
              - link "タイムセール" [ref=e319] [cursor=pointer]:
                - /url: /s/aiboux/products?category=sale
            - listitem [ref=e320]:
              - link "売れ筋ランキング" [ref=e321] [cursor=pointer]:
                - /url: /s/aiboux/products?category=ranking
        - generic [ref=e322]:
          - heading "購入前に確認" [level=3] [ref=e323]
          - paragraph [ref=e324]: 送料、返品、問い合わせ、取引条件を購入前に確認できるようにします。
          - list [ref=e325]:
            - listitem [ref=e326]:
              - link "カート" [ref=e327] [cursor=pointer]:
                - /url: /s/aiboux/cart
            - listitem [ref=e328]:
              - link "チェックアウト" [ref=e329] [cursor=pointer]:
                - /url: /s/aiboux/checkout
            - listitem [ref=e330]:
              - link "配送について" [ref=e331] [cursor=pointer]:
                - /url: /s/aiboux/shipping
            - listitem [ref=e332]:
              - link "返品について" [ref=e333] [cursor=pointer]:
                - /url: /s/aiboux/returns
            - listitem [ref=e334]:
              - link "特定商取引法" [ref=e335] [cursor=pointer]:
                - /url: /s/aiboux/legal
            - listitem [ref=e336]:
              - link "問い合わせ" [ref=e337] [cursor=pointer]:
                - /url: /s/aiboux/contact
        - generic [ref=e338]:
          - heading "購入後サポート" [level=3] [ref=e339]
          - paragraph [ref=e340]: 注文履歴、マイページ、定期購入、お気に入りへ迷わず戻れるようにします。
          - list [ref=e341]:
            - listitem [ref=e342]:
              - link "マイページ" [ref=e343] [cursor=pointer]:
                - /url: /s/aiboux/mypage
            - listitem [ref=e344]:
              - link "注文履歴" [ref=e345] [cursor=pointer]:
                - /url: /s/aiboux/orders
            - listitem [ref=e346]:
              - link "お気に入り" [ref=e347] [cursor=pointer]:
                - /url: /s/aiboux/favorites
            - listitem [ref=e348]:
              - link "定期購入" [ref=e349] [cursor=pointer]:
                - /url: /s/aiboux/mypage/subscriptions
            - listitem [ref=e350]:
              - link "ログイン" [ref=e351] [cursor=pointer]:
                - /url: /s/aiboux/login
            - listitem [ref=e352]:
              - link "会員登録" [ref=e353] [cursor=pointer]:
                - /url: /s/aiboux/register
    - region "株式会社雪花 公式ストアで迷わず探す" [ref=e354]:
      - generic [ref=e355]:
        - generic [ref=e356]:
          - paragraph [ref=e357]: Store navigation
          - heading "株式会社雪花 公式ストアで迷わず探す" [level=2] [ref=e358]
          - paragraph [ref=e359]: 商品、カテゴリ、配送、返品、注文履歴を説明的なリンクで整理します。検索エンジンにもユーザーにも分かる、共通の内部リンク導線です。
        - link "商品一覧へ" [ref=e360] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e361]:
        - navigation "株式会社雪花 公式ストア SEO内部リンク" [ref=e362]:
          - generic [ref=e363]:
            - heading "人気カテゴリ" [level=3] [ref=e364]
            - list [ref=e365]:
              - listitem [ref=e366]:
                - link "食品・飲料を比較する" [ref=e367] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=food-drink
              - listitem [ref=e368]:
                - link "コーヒー・お茶を見る" [ref=e369] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=coffee-tea
              - listitem [ref=e370]:
                - link "キッチン用品を探す" [ref=e371] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=kitchen
              - listitem [ref=e372]:
                - link "日用品をまとめ買いする" [ref=e373] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=daily-goods
              - listitem [ref=e374]:
                - link "ギフト商品を選ぶ" [ref=e375] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=gift
          - generic [ref=e376]:
            - heading "購入前ガイド" [level=3] [ref=e377]
            - list [ref=e378]:
              - listitem [ref=e379]:
                - link "送料と配送予定を確認する" [ref=e380] [cursor=pointer]:
                  - /url: /s/aiboux/shipping
              - listitem [ref=e381]:
                - link "返品・交換条件を確認する" [ref=e382] [cursor=pointer]:
                  - /url: /s/aiboux/returns
              - listitem [ref=e383]:
                - link "よくある質問を見る" [ref=e384] [cursor=pointer]:
                  - /url: /s/aiboux/faq
              - listitem [ref=e385]:
                - link "ストアへ問い合わせる" [ref=e386] [cursor=pointer]:
                  - /url: /s/aiboux/contact
          - generic [ref=e387]:
            - heading "購入後サポート" [level=3] [ref=e388]
            - list [ref=e389]:
              - listitem [ref=e390]:
                - link "注文履歴を確認する" [ref=e391] [cursor=pointer]:
                  - /url: /s/aiboux/orders
              - listitem [ref=e392]:
                - link "マイページを開く" [ref=e393] [cursor=pointer]:
                  - /url: /s/aiboux/mypage
              - listitem [ref=e394]:
                - link "お気に入り商品を見る" [ref=e395] [cursor=pointer]:
                  - /url: /s/aiboux/favorites
              - listitem [ref=e396]:
                - link "定期購入の状態を見る" [ref=e397] [cursor=pointer]:
                  - /url: /s/aiboux/mypage/subscriptions
        - complementary "購入判断の要点" [ref=e398]:
          - link "商品比較 価格、税込、レビュー、在庫、配送目安を同じ商品カードで比較します。 商品一覧" [ref=e399] [cursor=pointer]:
            - /url: /s/aiboux/products
            - text: 商品比較
            - generic [ref=e400]: 価格、税込、レビュー、在庫、配送目安を同じ商品カードで比較します。
            - generic [ref=e401]: 商品一覧
          - link "購入条件 送料、返品、特商法、決済設定状態を注文前に確認できます。 取引条件" [ref=e402] [cursor=pointer]:
            - /url: /s/aiboux/legal
            - text: 購入条件
            - generic [ref=e403]: 送料、返品、特商法、決済設定状態を注文前に確認できます。
            - generic [ref=e404]: 取引条件
          - link "アカウント 注文履歴、配送状況、定期購入、お気に入りを同じ導線で確認します。 マイページ" [ref=e405] [cursor=pointer]:
            - /url: /s/aiboux/mypage
            - text: アカウント
            - generic [ref=e406]: 注文履歴、配送状況、定期購入、お気に入りを同じ導線で確認します。
            - generic [ref=e407]: マイページ
    - region "迷わず買えるための確認導線" [ref=e408]:
      - generic [ref=e409]:
        - generic [ref=e410]:
          - paragraph [ref=e411]: Shopping guide
          - heading "迷わず買えるための確認導線" [level=2] [ref=e412]
          - paragraph [ref=e413]: 商品比較、配送・返品、注文後の確認、定期購入の状態まで、SEOに忠実な内部リンクで移動できます。
        - link "商品一覧を見る" [ref=e414] [cursor=pointer]:
          - /url: /s/aiboux/products
          - generic [ref=e415]: 商品一覧を見る
      - generic [ref=e416]:
        - link "商品を探す 商品一覧、カテゴリ、ランキングから価格・税込・在庫・レビューを比較できます。 商品一覧へ" [ref=e417] [cursor=pointer]:
          - /url: /s/aiboux/products
          - heading "商品を探す" [level=3] [ref=e418]
          - paragraph [ref=e419]: 商品一覧、カテゴリ、ランキングから価格・税込・在庫・レビューを比較できます。
          - generic [ref=e420]: 商品一覧へ
        - link "購入前に確認 送料、返品条件、決済設定状態、特定商取引法の表示を注文前に確認できます。 配送条件を見る" [ref=e421] [cursor=pointer]:
          - /url: /s/aiboux/shipping
          - heading "購入前に確認" [level=3] [ref=e422]
          - paragraph [ref=e423]: 送料、返品条件、決済設定状態、特定商取引法の表示を注文前に確認できます。
          - generic [ref=e424]: 配送条件を見る
        - link "注文後の確認 注文履歴、配送状況、問い合わせ、領収書導線を同じマイページ導線で確認します。 注文履歴へ" [ref=e425] [cursor=pointer]:
          - /url: /s/aiboux/orders
          - heading "注文後の確認" [level=3] [ref=e426]
          - paragraph [ref=e427]: 注文履歴、配送状況、問い合わせ、領収書導線を同じマイページ導線で確認します。
          - generic [ref=e428]: 注文履歴へ
        - link "定期購入 定期購入は本番DB migrationと決済接続が完了するまで、準備中として正直に表示します。 定期購入を見る" [ref=e429] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
          - heading "定期購入" [level=3] [ref=e430]
          - paragraph [ref=e431]: 定期購入は本番DB migrationと決済接続が完了するまで、準備中として正直に表示します。
          - generic [ref=e432]: 定期購入を見る
      - navigation "購入サポートの内部リンク" [ref=e433]:
        - link "カテゴリから探す" [ref=e434] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "カートを見る" [ref=e435] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e436] [cursor=pointer]:
          - /url: /s/aiboux/checkout
        - link "問い合わせ" [ref=e437] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e438] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "返品について" [ref=e439] [cursor=pointer]:
          - /url: /s/aiboux/returns
        - link "マイページ" [ref=e440] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "お気に入り" [ref=e441] [cursor=pointer]:
          - /url: /s/aiboux/favorites
  - contentinfo [ref=e442]:
    - link "ページ上部へ戻る" [ref=e443] [cursor=pointer]:
      - /url: "#top"
    - generic [ref=e444]:
      - generic [ref=e445]:
        - heading "税込価格" [level=2] [ref=e446]
        - paragraph [ref=e447]: 商品価格は税込表示で統一します。
      - generic [ref=e448]:
        - heading "配送・返品" [level=2] [ref=e449]
        - paragraph [ref=e450]: 配送予定、返品条件、問い合わせ先を各ページから確認できます。
      - generic [ref=e451]:
        - heading "決済状態" [level=2] [ref=e452]
        - paragraph [ref=e453]: 決済未接続時は注文確定したふりをせず、設定未完了として表示します。
      - generic [ref=e454]:
        - heading "定期購入" [level=2] [ref=e455]
        - paragraph [ref=e456]: 定期購入はDB migrationと決済接続が完了するまで正直に準備中表示にします。
    - generic [ref=e457]:
      - navigation "お買い物" [ref=e458]:
        - heading "お買い物" [level=2] [ref=e459]
        - link "商品一覧" [ref=e460] [cursor=pointer]:
          - /url: /s/aiboux/products
        - link "カテゴリ" [ref=e461] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "タイムセール" [ref=e462] [cursor=pointer]:
          - /url: /s/aiboux/products?category=sale
        - link "売れ筋ランキング" [ref=e463] [cursor=pointer]:
          - /url: /s/aiboux/products?category=ranking
        - link "お気に入り" [ref=e464] [cursor=pointer]:
          - /url: /s/aiboux/favorites
      - navigation "アカウント" [ref=e465]:
        - heading "アカウント" [level=2] [ref=e466]
        - link "マイページ" [ref=e467] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "注文履歴" [ref=e468] [cursor=pointer]:
          - /url: /s/aiboux/orders
        - link "定期購入" [ref=e469] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
        - link "ログイン" [ref=e470] [cursor=pointer]:
          - /url: /s/aiboux/login
      - navigation "サポート" [ref=e471]:
        - heading "サポート" [level=2] [ref=e472]
        - link "問い合わせ" [ref=e473] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e474] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "配送について" [ref=e475] [cursor=pointer]:
          - /url: /s/aiboux/shipping
        - link "返品について" [ref=e476] [cursor=pointer]:
          - /url: /s/aiboux/returns
      - navigation "ストア情報" [ref=e477]:
        - heading "ストア情報" [level=2] [ref=e478]
        - link "特定商取引法" [ref=e479] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシーポリシー" [ref=e480] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "カート" [ref=e481] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e482] [cursor=pointer]:
          - /url: /s/aiboux/checkout
    - generic [ref=e484]:
      - generic [ref=e485]:
        - generic [ref=e486]: 株式会社雪花 公式ストア
        - paragraph [ref=e487]: 注文、配送、返品、定期購入、問い合わせまで同じテナント導線で確認できます。決済未接続時は注文確定しません。
      - navigation "ストア基本情報" [ref=e488]:
        - link "特商法" [ref=e489] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシー" [ref=e490] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "問い合わせ" [ref=e491] [cursor=pointer]:
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