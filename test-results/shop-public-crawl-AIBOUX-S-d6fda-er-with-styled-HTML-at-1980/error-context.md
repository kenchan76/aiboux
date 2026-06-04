# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-public-crawl.spec.ts >> AIBOUX Shop 5H sprint public crawl >> public storefront pages render with styled HTML at 1980
- Location: tests/shop-public-crawl.spec.ts:74:5

# Error details

```
Error: /s/aiboux/contact meta description should explain purchase/search/support intent

expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 45
Received:    44
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
    - navigation "パンくずリスト" [ref=e34]:
      - link "TOP" [ref=e36] [cursor=pointer]:
        - /url: /s/aiboux/
      - generic [ref=e37]:
        - generic [ref=e38]: /
        - generic [ref=e39]: 問い合わせ
    - region "問い合わせ" [ref=e40]:
      - generic [ref=e41]:
        - generic [ref=e42]:
          - paragraph [ref=e43]: 株式会社雪花 公式ストア
          - heading "問い合わせ" [level=1] [ref=e44]
          - paragraph [ref=e45]: 商品、注文、配送、返品、定期購入について、必要な情報を添えてストアへ問い合わせできます。
        - navigation "問い合わせ の主要導線" [ref=e46]:
          - link "よくある質問" [ref=e47] [cursor=pointer]:
            - /url: /s/aiboux/faq
            - generic [ref=e48]: よくある質問
          - link "配送について" [ref=e49] [cursor=pointer]:
            - /url: /s/aiboux/shipping
            - generic [ref=e50]: 配送について
          - link "返品について" [ref=e51] [cursor=pointer]:
            - /url: /s/aiboux/returns
            - generic [ref=e52]: 返品について
    - generic [ref=e53]:
      - generic [ref=e54]:
        - generic [ref=e55]:
          - generic [ref=e56]:
            - text: お名前
            - textbox "お名前" [ref=e57]
          - generic [ref=e58]:
            - text: メールアドレス
            - textbox "メールアドレス" [ref=e59]
          - generic [ref=e60]:
            - text: 注文番号
            - generic [ref=e61]: 任意
            - textbox "注文番号 任意" [ref=e62]:
              - /placeholder: "例: #AIBOUX-1001"
          - generic [ref=e63]:
            - text: 内容
            - textbox "内容" [ref=e64]:
              - /placeholder: 商品名、注文番号、確認したい内容を入力してください。
          - button "入力内容を確認" [ref=e65]
        - complementary [ref=e66]:
          - heading "問い合わせ前に確認してください" [level=2] [ref=e67]
          - list [ref=e68]:
            - listitem [ref=e69]: 配送状況は「配送について」を確認してください。
            - listitem [ref=e70]: 返品条件は「返品について」を確認してください。
            - listitem [ref=e71]: 決済未接続のため、このフォームは送信完了扱いにしません。
          - link "よくある質問を見る" [ref=e72] [cursor=pointer]:
            - /url: /s/aiboux/faq
      - generic [ref=e73]:
        - link "購入前チェック 価格、税込表示、送料、返品条件、決済設定状態を確認してから注文へ進みます。" [ref=e74] [cursor=pointer]:
          - /url: /s/aiboux/checkout
          - heading "購入前チェック" [level=3] [ref=e75]
          - paragraph [ref=e76]: 価格、税込表示、送料、返品条件、決済設定状態を確認してから注文へ進みます。
        - link "配送・返品 配送目安、送料、返品受付条件、不良品時の問い合わせ導線をまとめて確認できます。" [ref=e77] [cursor=pointer]:
          - /url: /s/aiboux/shipping
          - heading "配送・返品" [level=3] [ref=e78]
          - paragraph [ref=e79]: 配送目安、送料、返品受付条件、不良品時の問い合わせ導線をまとめて確認できます。
        - link "問い合わせ 注文番号、商品名、確認したい内容を添えてストアへ問い合わせできます。" [ref=e80] [cursor=pointer]:
          - /url: /s/aiboux/contact
          - heading "問い合わせ" [level=3] [ref=e81]
          - paragraph [ref=e82]: 注文番号、商品名、確認したい内容を添えてストアへ問い合わせできます。
    - region "このページから次に確認すること" [ref=e83]:
      - generic [ref=e85]:
        - paragraph [ref=e86]: Related navigation
        - heading "このページから次に確認すること" [level=2] [ref=e87]
        - paragraph [ref=e88]: 商品発見、購入前確認、購入後サポートをページごとに整理し、SEOに必要な説明的リンクを共通化します。
      - navigation "関連する内部リンク" [ref=e89]:
        - generic [ref=e90]:
          - heading "商品を探す" [level=3] [ref=e91]
          - paragraph [ref=e92]: 価格、税込表示、レビュー、カテゴリ、在庫、配送条件を同じ導線で比較します。
          - list [ref=e93]:
            - listitem [ref=e94]:
              - link "すべての商品" [ref=e95] [cursor=pointer]:
                - /url: /s/aiboux/products
            - listitem [ref=e96]:
              - link "カテゴリ一覧" [ref=e97] [cursor=pointer]:
                - /url: /s/aiboux/categories
            - listitem [ref=e98]:
              - link "食品・飲料" [ref=e99] [cursor=pointer]:
                - /url: /s/aiboux/products?category=food-drink
            - listitem [ref=e100]:
              - link "日用品" [ref=e101] [cursor=pointer]:
                - /url: /s/aiboux/products?category=daily-goods
            - listitem [ref=e102]:
              - link "タイムセール" [ref=e103] [cursor=pointer]:
                - /url: /s/aiboux/products?category=sale
            - listitem [ref=e104]:
              - link "売れ筋ランキング" [ref=e105] [cursor=pointer]:
                - /url: /s/aiboux/products?category=ranking
        - generic [ref=e106]:
          - heading "購入前に確認" [level=3] [ref=e107]
          - paragraph [ref=e108]: 送料、返品、問い合わせ、取引条件を購入前に確認できるようにします。
          - list [ref=e109]:
            - listitem [ref=e110]:
              - link "カート" [ref=e111] [cursor=pointer]:
                - /url: /s/aiboux/cart
            - listitem [ref=e112]:
              - link "チェックアウト" [ref=e113] [cursor=pointer]:
                - /url: /s/aiboux/checkout
            - listitem [ref=e114]:
              - link "配送について" [ref=e115] [cursor=pointer]:
                - /url: /s/aiboux/shipping
            - listitem [ref=e116]:
              - link "返品について" [ref=e117] [cursor=pointer]:
                - /url: /s/aiboux/returns
            - listitem [ref=e118]:
              - link "特定商取引法" [ref=e119] [cursor=pointer]:
                - /url: /s/aiboux/legal
            - listitem [ref=e120]:
              - link "問い合わせ" [ref=e121] [cursor=pointer]:
                - /url: /s/aiboux/contact
        - generic [ref=e122]:
          - heading "購入後サポート" [level=3] [ref=e123]
          - paragraph [ref=e124]: 注文履歴、マイページ、定期購入、お気に入りへ迷わず戻れるようにします。
          - list [ref=e125]:
            - listitem [ref=e126]:
              - link "マイページ" [ref=e127] [cursor=pointer]:
                - /url: /s/aiboux/mypage
            - listitem [ref=e128]:
              - link "注文履歴" [ref=e129] [cursor=pointer]:
                - /url: /s/aiboux/orders
            - listitem [ref=e130]:
              - link "お気に入り" [ref=e131] [cursor=pointer]:
                - /url: /s/aiboux/favorites
            - listitem [ref=e132]:
              - link "定期購入" [ref=e133] [cursor=pointer]:
                - /url: /s/aiboux/mypage/subscriptions
            - listitem [ref=e134]:
              - link "ログイン" [ref=e135] [cursor=pointer]:
                - /url: /s/aiboux/login
            - listitem [ref=e136]:
              - link "会員登録" [ref=e137] [cursor=pointer]:
                - /url: /s/aiboux/register
    - region "株式会社雪花 公式ストアで迷わず探す" [ref=e138]:
      - generic [ref=e139]:
        - generic [ref=e140]:
          - paragraph [ref=e141]: Store navigation
          - heading "株式会社雪花 公式ストアで迷わず探す" [level=2] [ref=e142]
          - paragraph [ref=e143]: 商品、カテゴリ、配送、返品、注文履歴を説明的なリンクで整理します。検索エンジンにもユーザーにも分かる、共通の内部リンク導線です。
        - link "商品一覧へ" [ref=e144] [cursor=pointer]:
          - /url: /s/aiboux/products
      - generic [ref=e145]:
        - navigation "株式会社雪花 公式ストア SEO内部リンク" [ref=e146]:
          - generic [ref=e147]:
            - heading "人気カテゴリ" [level=3] [ref=e148]
            - list [ref=e149]:
              - listitem [ref=e150]:
                - link "食品・飲料を比較する" [ref=e151] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=food-drink
              - listitem [ref=e152]:
                - link "コーヒー・お茶を見る" [ref=e153] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=coffee-tea
              - listitem [ref=e154]:
                - link "キッチン用品を探す" [ref=e155] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=kitchen
              - listitem [ref=e156]:
                - link "日用品をまとめ買いする" [ref=e157] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=daily-goods
              - listitem [ref=e158]:
                - link "ギフト商品を選ぶ" [ref=e159] [cursor=pointer]:
                  - /url: /s/aiboux/products?category=gift
          - generic [ref=e160]:
            - heading "購入前ガイド" [level=3] [ref=e161]
            - list [ref=e162]:
              - listitem [ref=e163]:
                - link "送料と配送予定を確認する" [ref=e164] [cursor=pointer]:
                  - /url: /s/aiboux/shipping
              - listitem [ref=e165]:
                - link "返品・交換条件を確認する" [ref=e166] [cursor=pointer]:
                  - /url: /s/aiboux/returns
              - listitem [ref=e167]:
                - link "よくある質問を見る" [ref=e168] [cursor=pointer]:
                  - /url: /s/aiboux/faq
              - listitem [ref=e169]:
                - link "ストアへ問い合わせる" [ref=e170] [cursor=pointer]:
                  - /url: /s/aiboux/contact
          - generic [ref=e171]:
            - heading "購入後サポート" [level=3] [ref=e172]
            - list [ref=e173]:
              - listitem [ref=e174]:
                - link "注文履歴を確認する" [ref=e175] [cursor=pointer]:
                  - /url: /s/aiboux/orders
              - listitem [ref=e176]:
                - link "マイページを開く" [ref=e177] [cursor=pointer]:
                  - /url: /s/aiboux/mypage
              - listitem [ref=e178]:
                - link "お気に入り商品を見る" [ref=e179] [cursor=pointer]:
                  - /url: /s/aiboux/favorites
              - listitem [ref=e180]:
                - link "定期購入の状態を見る" [ref=e181] [cursor=pointer]:
                  - /url: /s/aiboux/mypage/subscriptions
        - complementary "購入判断の要点" [ref=e182]:
          - link "商品比較 価格、税込、レビュー、在庫、配送目安を同じ商品カードで比較します。 商品一覧" [ref=e183] [cursor=pointer]:
            - /url: /s/aiboux/products
            - text: 商品比較
            - generic [ref=e184]: 価格、税込、レビュー、在庫、配送目安を同じ商品カードで比較します。
            - generic [ref=e185]: 商品一覧
          - link "購入条件 送料、返品、特商法、決済設定状態を注文前に確認できます。 取引条件" [ref=e186] [cursor=pointer]:
            - /url: /s/aiboux/legal
            - text: 購入条件
            - generic [ref=e187]: 送料、返品、特商法、決済設定状態を注文前に確認できます。
            - generic [ref=e188]: 取引条件
          - link "アカウント 注文履歴、配送状況、定期購入、お気に入りを同じ導線で確認します。 マイページ" [ref=e189] [cursor=pointer]:
            - /url: /s/aiboux/mypage
            - text: アカウント
            - generic [ref=e190]: 注文履歴、配送状況、定期購入、お気に入りを同じ導線で確認します。
            - generic [ref=e191]: マイページ
    - region "迷わず買えるための確認導線" [ref=e192]:
      - generic [ref=e193]:
        - generic [ref=e194]:
          - paragraph [ref=e195]: Shopping guide
          - heading "迷わず買えるための確認導線" [level=2] [ref=e196]
          - paragraph [ref=e197]: 商品比較、配送・返品、注文後の確認、定期購入の状態まで、SEOに忠実な内部リンクで移動できます。
        - link "商品一覧を見る" [ref=e198] [cursor=pointer]:
          - /url: /s/aiboux/products
          - generic [ref=e199]: 商品一覧を見る
      - generic [ref=e200]:
        - link "商品を探す 商品一覧、カテゴリ、ランキングから価格・税込・在庫・レビューを比較できます。 商品一覧へ" [ref=e201] [cursor=pointer]:
          - /url: /s/aiboux/products
          - heading "商品を探す" [level=3] [ref=e202]
          - paragraph [ref=e203]: 商品一覧、カテゴリ、ランキングから価格・税込・在庫・レビューを比較できます。
          - generic [ref=e204]: 商品一覧へ
        - link "購入前に確認 送料、返品条件、決済設定状態、特定商取引法の表示を注文前に確認できます。 配送条件を見る" [ref=e205] [cursor=pointer]:
          - /url: /s/aiboux/shipping
          - heading "購入前に確認" [level=3] [ref=e206]
          - paragraph [ref=e207]: 送料、返品条件、決済設定状態、特定商取引法の表示を注文前に確認できます。
          - generic [ref=e208]: 配送条件を見る
        - link "注文後の確認 注文履歴、配送状況、問い合わせ、領収書導線を同じマイページ導線で確認します。 注文履歴へ" [ref=e209] [cursor=pointer]:
          - /url: /s/aiboux/orders
          - heading "注文後の確認" [level=3] [ref=e210]
          - paragraph [ref=e211]: 注文履歴、配送状況、問い合わせ、領収書導線を同じマイページ導線で確認します。
          - generic [ref=e212]: 注文履歴へ
        - link "定期購入 定期購入は本番DB migrationと決済接続が完了するまで、準備中として正直に表示します。 定期購入を見る" [ref=e213] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
          - heading "定期購入" [level=3] [ref=e214]
          - paragraph [ref=e215]: 定期購入は本番DB migrationと決済接続が完了するまで、準備中として正直に表示します。
          - generic [ref=e216]: 定期購入を見る
      - navigation "購入サポートの内部リンク" [ref=e217]:
        - link "カテゴリから探す" [ref=e218] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "カートを見る" [ref=e219] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e220] [cursor=pointer]:
          - /url: /s/aiboux/checkout
        - link "問い合わせ" [ref=e221] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e222] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "返品について" [ref=e223] [cursor=pointer]:
          - /url: /s/aiboux/returns
        - link "マイページ" [ref=e224] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "お気に入り" [ref=e225] [cursor=pointer]:
          - /url: /s/aiboux/favorites
  - contentinfo [ref=e226]:
    - link "ページ上部へ戻る" [ref=e227] [cursor=pointer]:
      - /url: "#top"
    - generic [ref=e228]:
      - generic [ref=e229]:
        - heading "税込価格" [level=2] [ref=e230]
        - paragraph [ref=e231]: 商品価格は税込表示で統一します。
      - generic [ref=e232]:
        - heading "配送・返品" [level=2] [ref=e233]
        - paragraph [ref=e234]: 配送予定、返品条件、問い合わせ先を各ページから確認できます。
      - generic [ref=e235]:
        - heading "決済状態" [level=2] [ref=e236]
        - paragraph [ref=e237]: 決済未接続時は注文確定したふりをせず、設定未完了として表示します。
      - generic [ref=e238]:
        - heading "定期購入" [level=2] [ref=e239]
        - paragraph [ref=e240]: 定期購入はDB migrationと決済接続が完了するまで正直に準備中表示にします。
    - generic [ref=e241]:
      - navigation "お買い物" [ref=e242]:
        - heading "お買い物" [level=2] [ref=e243]
        - link "商品一覧" [ref=e244] [cursor=pointer]:
          - /url: /s/aiboux/products
        - link "カテゴリ" [ref=e245] [cursor=pointer]:
          - /url: /s/aiboux/categories
        - link "タイムセール" [ref=e246] [cursor=pointer]:
          - /url: /s/aiboux/products?category=sale
        - link "売れ筋ランキング" [ref=e247] [cursor=pointer]:
          - /url: /s/aiboux/products?category=ranking
        - link "お気に入り" [ref=e248] [cursor=pointer]:
          - /url: /s/aiboux/favorites
      - navigation "アカウント" [ref=e249]:
        - heading "アカウント" [level=2] [ref=e250]
        - link "マイページ" [ref=e251] [cursor=pointer]:
          - /url: /s/aiboux/mypage
        - link "注文履歴" [ref=e252] [cursor=pointer]:
          - /url: /s/aiboux/orders
        - link "定期購入" [ref=e253] [cursor=pointer]:
          - /url: /s/aiboux/mypage/subscriptions
        - link "ログイン" [ref=e254] [cursor=pointer]:
          - /url: /s/aiboux/login
      - navigation "サポート" [ref=e255]:
        - heading "サポート" [level=2] [ref=e256]
        - link "問い合わせ" [ref=e257] [cursor=pointer]:
          - /url: /s/aiboux/contact
        - link "よくある質問" [ref=e258] [cursor=pointer]:
          - /url: /s/aiboux/faq
        - link "配送について" [ref=e259] [cursor=pointer]:
          - /url: /s/aiboux/shipping
        - link "返品について" [ref=e260] [cursor=pointer]:
          - /url: /s/aiboux/returns
      - navigation "ストア情報" [ref=e261]:
        - heading "ストア情報" [level=2] [ref=e262]
        - link "特定商取引法" [ref=e263] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシーポリシー" [ref=e264] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "カート" [ref=e265] [cursor=pointer]:
          - /url: /s/aiboux/cart
        - link "チェックアウト" [ref=e266] [cursor=pointer]:
          - /url: /s/aiboux/checkout
    - generic [ref=e268]:
      - generic [ref=e269]:
        - generic [ref=e270]: 株式会社雪花 公式ストア
        - paragraph [ref=e271]: 注文、配送、返品、定期購入、問い合わせまで同じテナント導線で確認できます。決済未接続時は注文確定しません。
      - navigation "ストア基本情報" [ref=e272]:
        - link "特商法" [ref=e273] [cursor=pointer]:
          - /url: /s/aiboux/legal
        - link "プライバシー" [ref=e274] [cursor=pointer]:
          - /url: /s/aiboux/privacy
        - link "問い合わせ" [ref=e275] [cursor=pointer]:
          - /url: /s/aiboux/contact
```

# Test source

```ts
  89  |         await expect(searchForm, `${target.path} search form should submit as GET`).toHaveAttribute("method", /get/i);
  90  |         await expect(searchForm, `${target.path} search form should target products discovery page`).toHaveAttribute("action", /\/s\/aiboux\/products$/);
  91  |         await expect(searchForm.locator('input[name="q"]'), `${target.path} search input should use q query parameter`).toHaveCount(1);
  92  |         const footer = page.getByTestId("storefront-footer");
  93  |         await expect(footer, `${target.path} should include Amazon-like storefront footer`).toBeVisible();
  94  |         expect(await footer.locator('[itemtype="https://schema.org/SiteNavigationElement"]').count(), `${target.path} footer should expose shared SiteNavigationElement microdata`).toBeGreaterThanOrEqual(4);
  95  |         expect(await footer.locator("a").count(), `${target.path} footer should expose dense internal link coverage`).toBeGreaterThanOrEqual(16);
  96  |         await expect(footer, `${target.path} footer should include payment/subscription honesty assurance`).toContainText("決済未接続時は注文確定しません");
  97  |         const supportRail = page.getByTestId("storefront-support-rail");
  98  |         await expect(supportRail, `${target.path} should include shared storefront support rail`).toBeVisible();
  99  |         await expect(supportRail, `${target.path} support rail should expose purchase guidance`).toContainText("迷わず買えるための確認導線");
  100 |         await expect(supportRail, `${target.path} support rail should expose honest subscription state`).toContainText("定期購入");
  101 |         expect(await supportRail.locator("a").count(), `${target.path} support rail should expose crawlable support links`).toBeGreaterThanOrEqual(9);
  102 |         expect(await supportRail.locator("a").first().getAttribute("class"), `${target.path} support rail links should have visible link affordance`).toMatch(/text-|bg-amber/);
  103 |         const contextLinks = page.getByTestId("storefront-context-links");
  104 |         await expect(contextLinks, `${target.path} should include page-context internal links`).toBeVisible();
  105 |         await expect(contextLinks, `${target.path} contextual links should explain next actions`).toContainText("このページから次に確認すること");
  106 |         expect(await contextLinks.locator('[itemtype="https://schema.org/SiteNavigationElement"]').count(), `${target.path} contextual links should expose visible SiteNavigationElement microdata`).toBeGreaterThanOrEqual(1);
  107 |         expect(await contextLinks.locator("a").count(), `${target.path} contextual links should expose dense internal links`).toBeGreaterThanOrEqual(16);
  108 |         expect(await contextLinks.locator("a").first().getAttribute("class"), `${target.path} contextual links should use visible blue link affordance`).toContain("text-blue-700");
  109 |         const seoHub = page.getByTestId("storefront-seo-hub");
  110 |         await expect(seoHub, `${target.path} should include shared SEO hub`).toBeVisible();
  111 |         await expect(seoHub, `${target.path} SEO hub should explain internal navigation`).toContainText("迷わず探す");
  112 |         await expect(seoHub, `${target.path} SEO hub should expose product discovery`).toContainText("商品一覧へ");
  113 |         await expect(seoHub, `${target.path} SEO hub should expose support/account links`).toContainText("定期購入の状態を見る");
  114 |         expect(await seoHub.locator('[itemtype="https://schema.org/SiteNavigationElement"]').count(), `${target.path} SEO hub should expose visible SiteNavigationElement microdata`).toBeGreaterThanOrEqual(1);
  115 |         expect(await seoHub.locator("a").count(), `${target.path} SEO hub should expose dense crawlable links`).toBeGreaterThanOrEqual(14);
  116 |         expect(await seoHub.locator("a").nth(1).getAttribute("class"), `${target.path} SEO hub links should be visibly link-colored`).toContain("text-blue-700");
  117 |         const breadcrumb = page.getByTestId("storefront-breadcrumb");
  118 |         await expect(breadcrumb, `${target.path} should include visible breadcrumb navigation`).toBeVisible();
  119 |         await expect(breadcrumb, `${target.path} breadcrumb should expose BreadcrumbList microdata`).toHaveAttribute(
  120 |           "itemtype",
  121 |           "https://schema.org/BreadcrumbList",
  122 |         );
  123 |         expect(await breadcrumb.locator('[itemtype="https://schema.org/ListItem"]').count(), `${target.path} should expose visible breadcrumb ListItem microdata`).toBeGreaterThanOrEqual(1);
  124 |         const breadcrumbLinkCount = await breadcrumb.locator("a").count();
  125 |         if (breadcrumbLinkCount > 0) {
  126 |           expect(await breadcrumb.locator("a").first().getAttribute("class"), `${target.path} breadcrumb links should be visibly link-colored`).toContain("text-blue-700");
  127 |         }
  128 |         if ("expectedTestId" in target && target.expectedTestId) {
  129 |           await expect(page.locator(`[data-testid="${target.expectedTestId}"]`), target.path).toBeVisible();
  130 |         }
  131 |         if (target.name !== "shop-top") {
  132 |           const pageHeader = page.getByTestId("storefront-page-header");
  133 |           await expect(pageHeader, `${target.path} should include the shared page header`).toBeVisible();
  134 |           await expect(pageHeader.locator("h1"), `${target.path} shared page header should own the page h1`).toHaveCount(1);
  135 |           expect(await pageHeader.locator("a").count(), `${target.path} shared page header should expose crawlable action links`).toBeGreaterThanOrEqual(2);
  136 |           expect(await pageHeader.locator('[itemtype="https://schema.org/SiteNavigationElement"]').count(), `${target.path} page header should expose SiteNavigationElement microdata`).toBeGreaterThanOrEqual(1);
  137 |           const secondaryLinkClass = await pageHeader.locator("a").last().getAttribute("class");
  138 |           expect(secondaryLinkClass ?? "", `${target.path} page header secondary links should be visibly blue`).toContain("text-blue-700");
  139 |         }
  140 | 
  141 |         const jsonLdText = await page.locator('script[type="application/ld+json"]').first().textContent();
  142 |         expect(jsonLdText ?? "", `${target.path} should include BreadcrumbList JSON-LD`).toContain("BreadcrumbList");
  143 |         expect(jsonLdText ?? "", `${target.path} should include WebSite JSON-LD`).toContain("WebSite");
  144 |         expect(jsonLdText ?? "", `${target.path} should include Organization JSON-LD`).toContain("Organization");
  145 |         expect(jsonLdText ?? "", `${target.path} should identify the storefront as OnlineStore JSON-LD`).toContain("OnlineStore");
  146 |         expect(jsonLdText ?? "", `${target.path} should expose a stable store entity id`).toContain("#store");
  147 |         expect(jsonLdText ?? "", `${target.path} should expose a stable website entity id`).toContain("#website");
  148 |         expect(jsonLdText ?? "", `${target.path} WebPage should be linked to the WebSite entity`).toContain("isPartOf");
  149 |         expect(jsonLdText ?? "", `${target.path} WebPage should declare the storefront publisher`).toContain("publisher");
  150 |         expect(jsonLdText ?? "", `${target.path} WebPage should describe the storefront entity it is about`).toContain("about");
  151 |         expect(jsonLdText ?? "", `${target.path} should include merchant return policy JSON-LD`).toContain("MerchantReturnPolicy");
  152 |         expect(jsonLdText ?? "", `${target.path} should include shared site navigation JSON-LD`).toContain("SiteNavigationElement");
  153 |         expect(jsonLdText ?? "", `${target.path} should expose WebSite SearchAction matching storefront search`).toContain("SearchAction");
  154 |         expect(jsonLdText ?? "", `${target.path} SearchAction should target the products query URL`).toContain("products?q={search_term_string}");
  155 |         expect(jsonLdText ?? "", `${target.path} should expose a page entity JSON-LD`).toMatch(/WebPage|ContactPage|FAQPage|ItemPage|CollectionPage/);
  156 |         if (["shop-products-page", "shop-categories-page", "shop-favorites"].includes(target.name)) {
  157 |           expect(jsonLdText ?? "", `${target.path} discovery page should expose CollectionPage JSON-LD`).toContain("CollectionPage");
  158 |         }
  159 |         if (target.name === "shop-top") {
  160 |           expect(jsonLdText ?? "", `${target.path} should expose TOP product discovery ItemList JSON-LD`).toContain("ItemList");
  161 |           expect(jsonLdText ?? "", `${target.path} TOP ItemList should expose a stable entity id`).toContain("#itemlist");
  162 |           expect(jsonLdText ?? "", `${target.path} TOP ItemList should declare numberOfItems`).toContain("numberOfItems");
  163 |           expect(jsonLdText ?? "", `${target.path} TOP ItemList should link back to the WebPage entity`).toContain("mainEntityOfPage");
  164 |         }
  165 |         if (target.name === "shop-faq-page") {
  166 |           expect(jsonLdText ?? "", `${target.path} should expose FAQPage JSON-LD`).toContain("FAQPage");
  167 |           expect(jsonLdText ?? "", `${target.path} should expose FAQ question entities`).toContain("Question");
  168 |           expect(jsonLdText ?? "", `${target.path} should expose FAQ accepted answers`).toContain("acceptedAnswer");
  169 |         }
  170 |         if (target.name === "shop-contact-page") {
  171 |           expect(jsonLdText ?? "", `${target.path} should expose ContactPage JSON-LD`).toContain("ContactPage");
  172 |         }
  173 |         expect(jsonLdText ?? "", `${target.path} should include page-specific ItemList JSON-LD`).toContain("ItemList");
  174 |         expect(jsonLdText ?? "", `${target.path} ItemList should expose a stable entity id`).toContain("#itemlist");
  175 |         expect(jsonLdText ?? "", `${target.path} ItemList should declare numberOfItems`).toContain("numberOfItems");
  176 |         expect(jsonLdText ?? "", `${target.path} ItemList should link back to the WebPage entity`).toContain("mainEntityOfPage");
  177 | 
  178 |         const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  179 |         expect(canonical, `${target.path} should include a self-referencing canonical URL`).toBeTruthy();
  180 |         expect(canonical ?? "", `${target.path} canonical should point at shop.aiboux.com tenant URL`).toContain(`https://shop.aiboux.com${target.path}`);
  181 | 
  182 |         const titleText = await page.title();
  183 |         expect(titleText.length, `${target.path} should expose a useful SEO title`).toBeGreaterThanOrEqual(12);
  184 |         expect(titleText.length, `${target.path} SEO title should not be overly long`).toBeLessThanOrEqual(78);
  185 |         expect(titleText, `${target.path} title should not use thin placeholder copy`).not.toMatch(/公開中の商品を表示|AIBOUX Storeの公開ページ|ストアページ/);
  186 | 
  187 |         const metaDescription = await page.locator('meta[name="description"]').getAttribute("content");
  188 |         expect(metaDescription, `${target.path} should include meta description`).toBeTruthy();
> 189 |         expect(metaDescription?.length ?? 0, `${target.path} meta description should explain purchase/search/support intent`).toBeGreaterThanOrEqual(45);
      |                                                                                                                               ^ Error: /s/aiboux/contact meta description should explain purchase/search/support intent
  190 |         expect(metaDescription?.length ?? 0, `${target.path} meta description should remain snippet-safe`).toBeLessThanOrEqual(155);
  191 |         expect(metaDescription ?? "", `${target.path} description should not use thin placeholder copy`).not.toMatch(/公開中の商品を表示|AIBOUX Storeの公開ページ|ストアへの問い合わせを受け付けます/);
  192 | 
  193 |         const robots = await page.locator('meta[name="robots"]').getAttribute("content");
  194 |         if (noIndexPublicPageNames.has(target.name)) {
  195 |           expect(robots ?? "", `${target.path} transactional/account page should not be indexed`).toContain("noindex");
  196 |           expect(robots ?? "", `${target.path} should still allow link following`).toContain("follow");
  197 |         } else {
  198 |           expect(robots ?? "", `${target.path} discovery/content page should be indexable`).toContain("index");
  199 |           expect(robots ?? "", `${target.path} should allow large image previews`).toContain("max-image-preview:large");
  200 |         }
  201 | 
  202 |         await expect(page.locator('meta[property="og:title"]'), `${target.path} should include Open Graph title`).toHaveCount(1);
  203 |         await expect(page.locator('meta[property="og:description"]'), `${target.path} should include Open Graph description`).toHaveCount(1);
  204 |         await expect(page.locator('meta[property="og:url"]'), `${target.path} should include Open Graph URL`).toHaveCount(1);
  205 |         await expect(page.locator('meta[property="og:image"]'), `${target.path} should include Open Graph image`).toHaveCount(1);
  206 |         await expect(page.locator('meta[property="og:url"]'), `${target.path} Open Graph URL should match canonical`).toHaveAttribute("content", canonical ?? "");
  207 |         const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  208 |         expect(ogImage ?? "", `${target.path} Open Graph image should be absolute`).toMatch(/^https:\/\/.+/);
  209 |         await expect(page.locator('meta[name="twitter:card"]'), `${target.path} should include Twitter Card metadata`).toHaveCount(1);
  210 |         await expect(page.locator('meta[name="twitter:card"]'), `${target.path} should use large image Twitter Card`).toHaveAttribute("content", "summary_large_image");
  211 |         await expect(page.locator('meta[name="twitter:description"]'), `${target.path} Twitter description should match meta description`).toHaveAttribute("content", metaDescription ?? "");
  212 |         await expect(page.locator('link[rel="alternate"][hreflang="ja-JP"]'), `${target.path} should include ja-JP alternate link`).toHaveCount(1);
  213 |         await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'), `${target.path} should include x-default alternate link`).toHaveCount(1);
  214 |         await expect(page.locator("h1"), `${target.path} should expose one primary heading`).toHaveCount(1);
  215 | 
  216 |         const bodyBox = await page.locator("body").boundingBox();
  217 |         expect(bodyBox?.width ?? 0, `${target.path} should render a styled page body`).toBeGreaterThan(300);
  218 | 
  219 |         if (target.name === "shop-top" || viewport.suffix === "1980") {
  220 |           await saveScreenshot(page, `${target.name}-${viewport.suffix}.png`);
  221 |         }
  222 |       }
  223 |     });
  224 |   }
  225 | 
  226 |   test("admin pages render and keep demo values absent", async ({ page, request }) => {
  227 |     await page.setViewportSize({ width: 1980, height: 1080 });
  228 |     for (const target of adminUrls) {
  229 |       const response = await request.get(target.path, { headers: { "cache-control": "no-cache" } });
  230 |       expect(response.status(), target.path).toBe(200);
  231 |       expect(response.headers()["content-type"] ?? "", target.path).toContain("text/html");
  232 | 
  233 |       await page.goto(`${target.path}?adminCrawl=${Date.now()}`, { waitUntil: "networkidle" });
  234 |       await expect(page.locator("body")).not.toContainText("2024/05");
  235 |       await expect(page.locator("body")).not.toContainText("山田 太郎");
  236 |       await expect(page.locator("body")).not.toContainText("#10085");
  237 |       await expect(page.locator('a[href="#"], a[href^="javascript:void"]')).toHaveCount(0);
  238 | 
  239 |       if (target.name === "shop-admin-design" || target.name === "shop-admin-subscriptions") {
  240 |         await saveScreenshot(page, `${target.name}.png`);
  241 |       }
  242 |     }
  243 |   });
  244 | 
  245 |   test("public storefront internal links resolve to implemented tenant pages", async ({ request }) => {
  246 |     const discovered = new Set<string>();
  247 | 
  248 |     for (const target of publicUrls) {
  249 |       const response = await request.get(target.path, { headers: { "cache-control": "no-cache" } });
  250 |       expect(response.status(), target.path).toBe(200);
  251 |       const html = await response.text();
  252 | 
  253 |       for (const match of html.matchAll(/href="([^"]+)"/g)) {
  254 |         const href = match[1];
  255 |         if (
  256 |           !href ||
  257 |           href.startsWith("#") ||
  258 |           href.startsWith("javascript:") ||
  259 |           href.startsWith("mailto:") ||
  260 |           href.startsWith("tel:")
  261 |         ) {
  262 |           continue;
  263 |         }
  264 | 
  265 |         const url = new URL(href, "https://shop.aiboux.com");
  266 |         if (url.hostname === "shop.aiboux.com" && url.pathname.startsWith("/s/aiboux")) {
  267 |           discovered.add(url.pathname);
  268 |         }
  269 |       }
  270 |     }
  271 | 
  272 |     expect(discovered.size, "tenant storefront should expose internal links for account, commerce, and policy pages").toBeGreaterThan(12);
  273 | 
  274 |     for (const pathname of [...discovered].sort()) {
  275 |       const linked = await request.get(pathname, { headers: { "cache-control": "no-cache" } });
  276 |       expect(linked.status(), pathname).toBe(200);
  277 |       const body = await linked.text();
  278 |       expect(body, pathname).not.toContain("ページが見つかりません");
  279 |       expect(body, pathname).not.toContain("Not Found");
  280 |     }
  281 |   });
  282 | 
  283 |   test("shop robots and sitemap expose only indexable tenant discovery pages", async ({ request }) => {
  284 |     const robots = await request.get("/robots.txt", { headers: { host: "shop.aiboux.com", "cache-control": "no-cache" } });
  285 |     expect(robots.status(), "robots.txt should be public").toBe(200);
  286 |     const robotsText = await robots.text();
  287 |     expect(robotsText).toContain("Sitemap: https://shop.aiboux.com/sitemap.xml");
  288 |     expect(robotsText).toContain("Disallow: /s/aiboux/cart");
  289 |     expect(robotsText).toContain("Disallow: /s/aiboux/checkout");
```