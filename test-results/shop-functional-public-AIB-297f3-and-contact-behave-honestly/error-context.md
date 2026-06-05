# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-functional-public.spec.ts >> AIBOUX Shop public functional hardening >> storefront cart, checkout, and contact behave honestly
- Location: tests/shop-functional-public.spec.ts:67:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('¥3,600')
Expected: visible
Error: strict mode violation: getByText('¥3,600') resolved to 2 elements:
    1) <strong data-cart-subtotal="" class="text-neutral-950">¥3,600</strong> aka getByText('¥').nth(2)
    2) <strong data-cart-grand-total="" class="text-xl text-red-700">¥3,600</strong> aka getByText('¥').nth(3)

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('¥3,600')

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
          - generic [ref=e89]:
            - img "Playwright検証商品 商品画像" [ref=e91]
            - generic [ref=e92]:
              - generic [ref=e93]: Playwright検証商品
              - generic [ref=e94]: ¥1,200
              - generic [ref=e95]:
                - text: 数量
                - textbox "数量" [ref=e96]: "3"
            - button "削除" [ref=e97]
        - complementary [ref=e98]:
          - heading "注文サマリー" [level=3] [ref=e99]
          - generic [ref=e100]:
            - generic [ref=e101]:
              - generic [ref=e102]: 商品点数
              - strong [ref=e103]: 3点
            - generic [ref=e104]:
              - generic [ref=e105]: 商品小計
              - strong [ref=e106]: ¥3,600
            - generic [ref=e107]:
              - generic [ref=e108]: 送料見込み
              - generic [ref=e109]: 注文受付時に確認
            - generic [ref=e111]: 定期購入
            - generic [ref=e112]:
              - generic [ref=e113]:
                - generic [ref=e114]: 注文合計
                - strong [ref=e115]: ¥3,600
              - paragraph [ref=e116]: 送料と支払い方法はチェックアウトで確認します。
          - generic [ref=e117]: 商品、数量、小計、配送・返品条件を注文前に確認できます。支払い方法の選択が必要な場合も分かりやすく案内します。
          - link "チェックアウトへ進む" [ref=e118] [cursor=pointer]:
            - /url: /s/aiboux/checkout
          - link "配送・返品条件を見る" [ref=e119] [cursor=pointer]:
            - /url: /s/aiboux/shipping
      - generic [ref=e120]:
        - generic [ref=e121]:
          - heading "一緒に見られている商品" [level=3] [ref=e122]
          - link "もっと見る" [ref=e123] [cursor=pointer]:
            - /url: /s/aiboux/products
        - generic [ref=e124]:
          - article [ref=e125]:
            - link "雪花セレクト ドリップコーヒー 20袋の商品詳細を見る" [ref=e126] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-coffee
              - img "雪花セレクト ドリップコーヒー 20袋 商品画像" [ref=e127]
            - link "コーヒー・お茶" [ref=e128] [cursor=pointer]:
              - /url: /s/aiboux/products?category=coffee-tea
            - link "雪花セレクト ドリップコーヒー 20袋" [ref=e129] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-coffee
            - generic "評価 4.4、レビュー 128件" [ref=e130]:
              - generic [ref=e131]: ★★★★★
              - generic [ref=e132]: (128)
            - generic [ref=e133]: ¥1,980 税込
            - button "カートに入れる" [ref=e134]
          - article [ref=e135]:
            - link "軽量ステンレスボトル 500mlの商品詳細を見る" [ref=e136] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-bottle
              - img "軽量ステンレスボトル 500ml 商品画像" [ref=e137]
            - link "キッチン用品" [ref=e138] [cursor=pointer]:
              - /url: /s/aiboux/products?category=kitchen
            - link "軽量ステンレスボトル 500ml" [ref=e139] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-bottle
            - generic "評価 4.5、レビュー 159件" [ref=e140]:
              - generic [ref=e141]: ★★★★★
              - generic [ref=e142]: (159)
            - generic [ref=e143]: ¥2,480 税込
            - button "カートに入れる" [ref=e144]
          - article [ref=e145]:
            - link "雪花セレクト ギフトタオル 2枚セットの商品詳細を見る" [ref=e146] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-towel
              - img "雪花セレクト ギフトタオル 2枚セット 商品画像" [ref=e147]
            - link "タオル・寝具" [ref=e148] [cursor=pointer]:
              - /url: /s/aiboux/products?category=towels
            - link "雪花セレクト ギフトタオル 2枚セット" [ref=e149] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-towel
            - generic "評価 4.6、レビュー 190件" [ref=e150]:
              - generic [ref=e151]: ★★★★★
              - generic [ref=e152]: (190)
            - generic [ref=e153]: ¥2,980 税込
            - button "カートに入れる" [ref=e154]
          - article [ref=e155]:
            - link "季節のギフトボックスの商品詳細を見る" [ref=e156] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-gift
              - img "季節のギフトボックス 商品画像" [ref=e157]
            - link "ギフト" [ref=e158] [cursor=pointer]:
              - /url: /s/aiboux/products?category=gift
            - link "季節のギフトボックス" [ref=e159] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-gift
            - generic "評価 4.7、レビュー 221件" [ref=e160]:
              - generic [ref=e161]: ★★★★★
              - generic [ref=e162]: (221)
            - generic [ref=e163]: ¥5,980 税込
            - button "カートに入れる" [ref=e164]
          - article [ref=e165]:
            - link "キッチン保存容器 6点セットの商品詳細を見る" [ref=e166] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-storage
              - img "キッチン保存容器 6点セット 商品画像" [ref=e167]
            - link "キッチン用品" [ref=e168] [cursor=pointer]:
              - /url: /s/aiboux/products?category=kitchen
            - link "キッチン保存容器 6点セット" [ref=e169] [cursor=pointer]:
              - /url: /s/aiboux/product/setsuka-storage
            - generic "評価 4.8、レビュー 252件" [ref=e170]:
              - generic [ref=e171]: ★★★★★
              - generic [ref=e172]: (252)
            - generic [ref=e173]: ¥3,280 税込
            - button "カートに入れる" [ref=e174]
  - contentinfo [ref=e175]:
    - link "ページ上部へ戻る" [ref=e176] [cursor=pointer]:
      - /url: "#top"
    - region "買い物を続ける" [ref=e177]:
      - generic [ref=e178]:
        - generic [ref=e179]:
          - heading "買い物を続ける" [level=2] [ref=e180]
          - paragraph [ref=e181]: 商品、カート、注文履歴、問い合わせへすぐ戻れます。
        - navigation "フッタークイックリンク" [ref=e182]:
          - link "商品一覧" [ref=e183] [cursor=pointer]:
            - /url: /s/aiboux/products
            - generic [ref=e184]: 商品一覧
          - link "カート" [ref=e185] [cursor=pointer]:
            - /url: /s/aiboux/cart
            - generic [ref=e186]: カート
          - link "注文履歴" [ref=e187] [cursor=pointer]:
            - /url: /s/aiboux/orders
            - generic [ref=e188]: 注文履歴
          - link "問い合わせ" [ref=e189] [cursor=pointer]:
            - /url: /s/aiboux/contact
            - generic [ref=e190]: 問い合わせ
    - generic [ref=e191]:
      - generic [ref=e192]:
        - heading "税込価格" [level=2] [ref=e193]
        - paragraph [ref=e194]: 商品価格は税込表示で統一します。
        - link "商品を見る" [ref=e195] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e196]:
        - heading "配送・返品" [level=2] [ref=e197]
        - paragraph [ref=e198]: 配送予定、返品条件、問い合わせ先を各ページから確認できます。
        - link "配送を見る" [ref=e199] [cursor=pointer]:
          - /url: /s/aiboux/shipping
      - generic [ref=e200]:
        - heading "支払い方法" [level=2] [ref=e201]
        - paragraph [ref=e202]: 支払い方法の確認が必要な場合は、注文前に分かりやすく案内します。
        - link "注文確認へ" [ref=e203] [cursor=pointer]:
          - /url: /s/aiboux/checkout
      - generic [ref=e204]:
        - heading "定期購入" [level=2] [ref=e205]
        - paragraph [ref=e206]: 定期購入は受付条件とお届け頻度を購入前に確認できます。
        - link "定期購入を見る" [ref=e207] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
    - generic [ref=e208]:
      - navigation "お買い物" [ref=e209]:
        - heading "お買い物" [level=2] [ref=e210]
        - link "商品一覧" [ref=e211] [cursor=pointer]:
          - /url: /s/aiboux/products
        - link "カテゴリ" [ref=e212] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "タイムセール" [ref=e213] [cursor=pointer]:
          - /url: /s/aiboux/products?category=sale
        - link "売れ筋ランキング" [ref=e214] [cursor=pointer]:
          - /url: /s/aiboux/products?category=ranking
        - link "お気に入り" [ref=e215] [cursor=pointer]:
          - /url: /s/aiboux/favorites
      - navigation "アカウント" [ref=e216]:
        - heading "アカウント" [level=2] [ref=e217]
        - link "マイページ" [ref=e218] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "注文履歴" [ref=e219] [cursor=pointer]:
          - /url: /s/aiboux/orders
        - link "定期購入" [ref=e220] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
        - link "ログイン" [ref=e221] [cursor=pointer]:
          - /url: /s/aiboux/login
      - navigation "サポート" [ref=e222]:
        - heading "サポート" [level=2] [ref=e223]
        - link "問い合わせ" [ref=e224] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e225] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "配送について" [ref=e226] [cursor=pointer]:
          - /url: /s/aiboux/shipping
        - link "返品について" [ref=e227] [cursor=pointer]:
          - /url: /s/aiboux/returns
      - navigation "ストア情報" [ref=e228]:
        - heading "ストア情報" [level=2] [ref=e229]
        - link "特定商取引法" [ref=e230] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシーポリシー" [ref=e231] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "カート" [ref=e232] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e233] [cursor=pointer]:
          - /url: /s/aiboux/checkout
    - region "フッター主要リンク" [ref=e234]:
      - generic [ref=e235]:
        - heading "ストア主要リンク" [level=2] [ref=e236]
        - generic [ref=e237]:
          - link "TOPページ" [ref=e238] [cursor=pointer]:
            - /url: /s/aiboux/
          - link "商品一覧" [ref=e239] [cursor=pointer]:
            - /url: /s/aiboux/products
          - link "カテゴリ一覧" [ref=e240] [cursor=pointer]:
            - /url: /s/aiboux/categories
          - link "食品・飲料" [ref=e241] [cursor=pointer]:
            - /url: /s/aiboux/products?category=food-drink
          - link "コーヒー・お茶" [ref=e242] [cursor=pointer]:
            - /url: /s/aiboux/products?category=coffee-tea
          - link "キッチン用品" [ref=e243] [cursor=pointer]:
            - /url: /s/aiboux/products?category=kitchen
          - link "日用品" [ref=e244] [cursor=pointer]:
            - /url: /s/aiboux/products?category=daily-goods
          - link "ギフト" [ref=e245] [cursor=pointer]:
            - /url: /s/aiboux/products?category=gift
          - link "タイムセール" [ref=e246] [cursor=pointer]:
            - /url: /s/aiboux/products?category=sale
          - link "売れ筋ランキング" [ref=e247] [cursor=pointer]:
            - /url: /s/aiboux/products?category=ranking
          - link "カート" [ref=e248] [cursor=pointer]:
            - /url: /s/aiboux/cart
          - link "チェックアウト" [ref=e249] [cursor=pointer]:
            - /url: /s/aiboux/checkout
          - link "マイページ" [ref=e250] [cursor=pointer]:
            - /url: /s/aiboux/mypage
          - link "注文履歴" [ref=e251] [cursor=pointer]:
            - /url: /s/aiboux/orders
          - link "お気に入り" [ref=e252] [cursor=pointer]:
            - /url: /s/aiboux/favorites
          - link "定期購入" [ref=e253] [cursor=pointer]:
            - /url: /s/aiboux/mypage/subscriptions
          - link "問い合わせ" [ref=e254] [cursor=pointer]:
            - /url: /s/aiboux/contact
          - link "よくある質問" [ref=e255] [cursor=pointer]:
            - /url: /s/aiboux/faq
          - link "配送について" [ref=e256] [cursor=pointer]:
            - /url: /s/aiboux/shipping
          - link "返品について" [ref=e257] [cursor=pointer]:
            - /url: /s/aiboux/returns
          - link "特定商取引法" [ref=e258] [cursor=pointer]:
            - /url: /s/aiboux/legal
          - link "プライバシーポリシー" [ref=e259] [cursor=pointer]:
            - /url: /s/aiboux/privacy
    - generic [ref=e261]:
      - generic [ref=e262]:
        - generic [ref=e263]: 株式会社雪花 公式ストア
        - paragraph [ref=e264]: 注文、配送、返品、定期購入、問い合わせまで同じストア内で確認できます。支払い方法の選択が必要な場合は、注文前に分かりやすく案内します。
      - navigation "ストア基本情報" [ref=e265]:
        - link "特商法" [ref=e266] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシー" [ref=e267] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "問い合わせ" [ref=e268] [cursor=pointer]:
          - /url: /s/aiboux/contact
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | import { mkdirSync } from "node:fs";
  3   | 
  4   | const shopUrls = [
  5   |   "/",
  6   |   "/s/aiboux/",
  7   |   "/s/aiboux/admin",
  8   |   "/s/aiboux/admin/products",
  9   |   "/s/aiboux/admin/orders",
  10  |   "/s/aiboux/admin/inventory",
  11  |   "/s/aiboux/admin/categories",
  12  |   "/s/aiboux/admin/customers",
  13  |   "/s/aiboux/admin/content",
  14  |   "/s/aiboux/admin/analytics",
  15  |   "/s/aiboux/admin/apps",
  16  |   "/s/aiboux/admin/design",
  17  |   "/s/aiboux/admin/settings",
  18  |   "/s/aiboux/products",
  19  |   "/s/aiboux/categories",
  20  |   "/s/aiboux/cart",
  21  |   "/s/aiboux/checkout",
  22  |   "/s/aiboux/contact",
  23  |   "/s/aiboux/legal",
  24  |   "/s/aiboux/privacy",
  25  |   "/s/aiboux/shipping",
  26  |   "/s/aiboux/returns",
  27  | ];
  28  | 
  29  | const forbiddenDemoTexts = [
  30  |   "2024/05",
  31  |   "山田 太郎",
  32  |   "¥2,340,000",
  33  |   "245件",
  34  |   "2.35%",
  35  |   "¥9,551",
  36  |   "28.7%",
  37  |   "TSH-001",
  38  |   "BAG-001",
  39  |   "BTL-500",
  40  |   "#10085",
  41  |   "#10084",
  42  |   "#10083",
  43  |   "shop.aboux.com",
  44  | ];
  45  | 
  46  | test.describe("AIBOUX Shop public functional hardening", () => {
  47  |   test.beforeAll(() => {
  48  |     mkdirSync("output/playwright/shop-functional", { recursive: true });
  49  |   });
  50  | 
  51  |   test("all target public URLs return usable HTML", async ({ page, request }) => {
  52  |     for (const url of shopUrls) {
  53  |       const response = await request.get(url);
  54  |       expect(response.status(), url).toBe(200);
  55  |       const contentType = response.headers()["content-type"] ?? "";
  56  |       expect(contentType, url).toContain("text/html");
  57  |     }
  58  | 
  59  |     await page.goto("/s/aiboux/admin");
  60  |     const bodyText = await page.locator("body").innerText();
  61  |     for (const text of forbiddenDemoTexts) {
  62  |       expect(bodyText, `demo text should be absent: ${text}`).not.toContain(text);
  63  |     }
  64  |     await page.screenshot({ path: "output/playwright/shop-functional/admin-demo-free-1980.png", fullPage: true });
  65  |   });
  66  | 
  67  |   test("storefront cart, checkout, and contact behave honestly", async ({ page }) => {
  68  |     await page.goto("/s/aiboux/cart");
  69  |     await page.evaluate(() => {
  70  |       localStorage.setItem(
  71  |         "aiboux:shop:aiboux:cart",
  72  |         JSON.stringify([{ id: "playwright-product", name: "Playwright検証商品", price: 1200, image: "", quantity: 1 }]),
  73  |       );
  74  |       window.location.reload();
  75  |     });
  76  |     await expect(page.getByText("Playwright検証商品")).toBeVisible();
  77  |     const quantity = page.locator("[data-cart-qty]").first();
  78  |     await quantity.fill("3");
> 79  |     await expect(page.getByText("¥3,600")).toBeVisible();
      |                                            ^ Error: expect(locator).toBeVisible() failed
  80  |     await page.locator("[data-cart-remove]").first().click();
  81  |     await expect(page.getByText("カートは空です")).toBeVisible();
  82  | 
  83  |     await page.goto("/s/aiboux/checkout");
  84  |     await expect(page.getByTestId("storefront-checkout-empty-guide")).toBeVisible();
  85  |     await expect(page.getByTestId("storefront-checkout-empty-guide").getByRole("link", { name: "商品一覧へ戻る" })).toHaveAttribute(
  86  |       "href",
  87  |       "/s/aiboux/products",
  88  |     );
  89  |     await expect(page.getByText("注文が確定しました")).toHaveCount(0);
  90  |     await expect(page.getByText("支払いが完了しました")).toHaveCount(0);
  91  | 
  92  |     await page.goto("/s/aiboux/contact");
  93  |     await page.getByRole("button", { name: "入力内容を確認" }).click();
  94  |     await expect(page.getByText("お名前を入力してください。")).toBeVisible();
  95  |     await page.locator("input[name='name']").fill("検証 太郎");
  96  |     await page.locator("input[name='email']").fill("invalid-email");
  97  |     await page.locator("textarea[name='message']").fill("問い合わせ検証です。");
  98  |     await page.getByRole("button", { name: "入力内容を確認" }).click();
  99  |     await expect(page.getByText("正しいメールアドレスを入力してください。")).toBeVisible();
  100 |     await page.locator("input[name='email']").fill("tester@example.com");
  101 |     await page.getByRole("button", { name: "入力内容を確認" }).click();
  102 |     await expect(page.getByText("入力内容を確認しました。")).toBeVisible();
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
```