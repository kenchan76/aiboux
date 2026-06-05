# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop-functional-public.spec.ts >> AIBOUX Shop public functional hardening >> store design editor exposes only top and product detail page editing
- Location: tests/shop-functional-public.spec.ts:116:3

# Error details

```
Error: side hero 0 should use a real preview image

expect(received).toContain(expected) // indexOf

Expected substring: "/shop/design/hero-"
Received string:    "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1500&h=620&q=86"
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - heading "AIBOUX SHOP ストアデザインエディタ" [level=1] [ref=e7]
        - paragraph [ref=e8]: TOPページと商品詳細ページだけを編集します。
      - generic [ref=e9]:
        - button "TOPページ" [ref=e10]
        - button "商品詳細ページ" [ref=e11]
    - generic [ref=e12]:
      - button "undo" [disabled]:
        - img
      - button "redo" [disabled]:
        - img
      - link "公開サイト" [ref=e13] [cursor=pointer]:
        - /url: /s/aiboux/
        - img
        - text: 公開サイト
      - button "desktop preview" [pressed] [ref=e14]:
        - img
      - button "mobile preview" [ref=e15]:
        - img
      - button "保存" [ref=e16]:
        - img
        - text: 保存
  - generic [ref=e17]:
    - complementary [ref=e18]:
      - generic [ref=e20]:
        - button "ページ" [ref=e21]
        - button "共通設定" [ref=e22]
      - generic [ref=e23]:
        - generic [ref=e24]:
          - heading "編集するページ" [level=2] [ref=e25]
          - paragraph [ref=e26]: 編集できるのは以下の2ページのみです。
          - generic [ref=e27]:
            - button "TOPページ" [ref=e28]:
              - img [ref=e29]
              - text: TOPページ
            - button "商品詳細ページ" [ref=e33]:
              - img [ref=e34]
              - text: 商品詳細ページ
        - generic [ref=e38]:
          - heading "TOPページのセクション" [level=2] [ref=e39]
          - generic [ref=e40]:
            - button "ヘッダー" [ref=e41]:
              - generic [ref=e42]:
                - img [ref=e43]
                - text: ヘッダー
              - img [ref=e50]
            - button "カテゴリナビ" [ref=e53]:
              - generic [ref=e54]:
                - img [ref=e55]
                - text: カテゴリナビ
              - img [ref=e62]
            - button "ヒーロースライダー" [ref=e65]:
              - generic [ref=e66]:
                - img [ref=e67]
                - text: ヒーロースライダー
              - img [ref=e74]
            - button "おすすめ商品" [ref=e77]:
              - generic [ref=e78]:
                - img [ref=e79]
                - text: おすすめ商品
              - img [ref=e86]
            - button "売れ筋ランキング" [ref=e89]:
              - generic [ref=e90]:
                - img [ref=e91]
                - text: 売れ筋ランキング
              - img [ref=e98]
            - button "タイムセール" [ref=e101]:
              - generic [ref=e102]:
                - img [ref=e103]
                - text: タイムセール
              - img [ref=e110]
            - button "カテゴリー一覧" [ref=e113]:
              - generic [ref=e114]:
                - img [ref=e115]
                - text: カテゴリー一覧
              - img [ref=e122]
            - button "人気ブランド" [ref=e125]:
              - generic [ref=e126]:
                - img [ref=e127]
                - text: 人気ブランド
              - img [ref=e134]
            - button "最近チェックした商品" [ref=e137]:
              - generic [ref=e138]:
                - img [ref=e139]
                - text: 最近チェックした商品
              - img [ref=e146]
        - generic [ref=e149]:
          - heading "共通設定" [level=2] [ref=e150]
          - generic [ref=e151]:
            - button "ヘッダー" [ref=e152]:
              - img [ref=e153]
              - text: ヘッダー
            - button "ロゴ" [ref=e155]:
              - img [ref=e156]
              - text: ロゴ
            - button "ナビゲーション" [ref=e160]:
              - img [ref=e161]
              - text: ナビゲーション
            - button "カラー" [ref=e168]:
              - img [ref=e169]
              - text: カラー
            - button "フォント" [ref=e175]:
              - img [ref=e176]
              - text: フォント
            - button "ボタン" [ref=e178]:
              - img [ref=e179]
              - text: ボタン
            - button "商品カード" [ref=e183]:
              - img [ref=e184]
              - text: 商品カード
        - generic [ref=e188]: 編集できるのは「TOPページ」と「商品詳細ページ」のみです。商品一覧、カテゴリ、カート、チェックアウト、問い合わせ、法務ページは共通レイアウトで表示します。
    - main [ref=e189]:
      - generic [ref=e191]:
        - generic [ref=e192]:
          - 'button "お届け先: 東京都 千代田区 送料無料は ¥2,000 ヘルプ・サポート お知らせ" [ref=e193]':
            - generic [ref=e194]: "お届け先: 東京都 千代田区"
            - generic [ref=e195]: 送料無料は ¥2,000
            - generic [ref=e196]:
              - generic [ref=e197]: ヘルプ・サポート
              - generic [ref=e198]: お知らせ
          - generic [ref=e199]:
            - button "aiboux" [ref=e200]
            - generic [ref=e201]:
              - generic [ref=e202]: すべてのカテゴリ
              - generic [ref=e203]: キーワード・商品名・ブランド名で検索
              - img [ref=e205]
            - generic [ref=e208]:
              - text: アカウント
              - text: ログイン
            - generic [ref=e209]: 注文履歴
            - generic [ref=e210]:
              - img [ref=e211]
              - text: カート
          - button "すべてのカテゴリー 食品・お菓子 日用品 家電 ファッション ビューティー ペット用品 スポーツ・アウトドア 本・文具 セール ランキング" [ref=e215]:
            - generic [ref=e216]: すべてのカテゴリー
            - generic [ref=e217]: 食品・お菓子
            - generic [ref=e218]: 日用品
            - generic [ref=e219]: 家電
            - generic [ref=e220]: ファッション
            - generic [ref=e221]: ビューティー
            - generic [ref=e222]: ペット用品
            - generic [ref=e223]: スポーツ・アウトドア
            - generic [ref=e224]: 本・文具
            - generic [ref=e225]: セール
            - generic [ref=e226]: ランキング
        - button "贈り物にも使える暮らしのギフト 毎日の暮らしを整える、雪花セレクト市 飲料、日用品、キッチン雑貨まで。今日ほしいものを見つけやすい売り場にまとめました。 商品を見る キッチンと食卓の定番をまとめ買い" [ref=e227]:
          - generic [ref=e228]:
            - generic [ref=e230]: 贈り物にも使える暮らしのギフト
            - img [ref=e232]
          - generic [ref=e234]:
            - generic [ref=e235]:
              - heading "毎日の暮らしを整える、雪花セレクト市" [level=2] [ref=e236]
              - paragraph [ref=e237]: 飲料、日用品、キッチン雑貨まで。今日ほしいものを見つけやすい売り場にまとめました。
              - generic [ref=e238]: 商品を見る
            - img [ref=e240]
            - img [ref=e243]
          - generic [ref=e245]:
            - generic [ref=e247]: キッチンと食卓の定番をまとめ買い
            - img [ref=e249]
        - button "おすすめ商品 もっと見る 雪花セレクト ドリップコーヒー 20袋 コーヒー・お茶 ★★★★★ (800) 雪花セレクト ドリップコーヒー 20袋 ¥1,980 税込 軽量ステンレスボトル 500ml キッチン用品 ★★★★★ (887) 軽量ステンレスボトル 500ml ¥2,480 税込 雪花セレクト ギフトタオル 2枚セット タオル・寝具 ★★★★★ (974) 雪花セレクト ギフトタオル 2枚セット ¥2,980 税込 キッチン保存容器 6点セット キッチン用品 ★★★★★ (1061) キッチン保存容器 6点セット ¥3,280 税込 毎日使えるホームケア洗剤セット 日用品 ★★★★★ (1148) 毎日使えるホームケア洗剤セット ¥1,680 税込 ナチュラルスキンケア 3点セット ビューティー ★★★★★ (1235) ナチュラルスキンケア 3点セット ¥4,280 税込 焼き菓子アソートボックス 食品・飲料 ★★★★★ (1322) 焼き菓子アソートボックス ¥2,380 税込 ペットケアおでかけセット ペット用品 ★★★★★ (1409) ペットケアおでかけセット ¥3,480 税込 季節のギフトボックス ギフト ★★★★★ (1496) 季節のギフトボックス ¥5,980 税込 国産茶葉ティーバッグ 30包 コーヒー・お茶 ★★★★★ (1583) 国産茶葉ティーバッグ 30包 ¥1,780 税込" [ref=e255]:
          - generic [ref=e256]:
            - heading "おすすめ商品" [level=3] [ref=e257]
            - generic [ref=e258]: もっと見る
          - generic [ref=e259]:
            - generic [ref=e260]:
              - img "雪花セレクト ドリップコーヒー 20袋" [ref=e261]
              - generic [ref=e262]: コーヒー・お茶
              - generic [ref=e263]:
                - text: ★★★★★
                - generic [ref=e264]: (800)
              - generic [ref=e265]: 雪花セレクト ドリップコーヒー 20袋
              - generic [ref=e266]: ¥1,980 税込
            - generic [ref=e267]:
              - img "軽量ステンレスボトル 500ml" [ref=e268]
              - generic [ref=e269]: キッチン用品
              - generic [ref=e270]:
                - text: ★★★★★
                - generic [ref=e271]: (887)
              - generic [ref=e272]: 軽量ステンレスボトル 500ml
              - generic [ref=e273]: ¥2,480 税込
            - generic [ref=e274]:
              - img "雪花セレクト ギフトタオル 2枚セット" [ref=e275]
              - generic [ref=e276]: タオル・寝具
              - generic [ref=e277]:
                - text: ★★★★★
                - generic [ref=e278]: (974)
              - generic [ref=e279]: 雪花セレクト ギフトタオル 2枚セット
              - generic [ref=e280]: ¥2,980 税込
            - generic [ref=e281]:
              - img "キッチン保存容器 6点セット" [ref=e282]
              - generic [ref=e283]: キッチン用品
              - generic [ref=e284]:
                - text: ★★★★★
                - generic [ref=e285]: (1061)
              - generic [ref=e286]: キッチン保存容器 6点セット
              - generic [ref=e287]: ¥3,280 税込
            - generic [ref=e288]:
              - img "毎日使えるホームケア洗剤セット" [ref=e289]
              - generic [ref=e290]: 日用品
              - generic [ref=e291]:
                - text: ★★★★★
                - generic [ref=e292]: (1148)
              - generic [ref=e293]: 毎日使えるホームケア洗剤セット
              - generic [ref=e294]: ¥1,680 税込
            - generic [ref=e295]:
              - img "ナチュラルスキンケア 3点セット" [ref=e296]
              - generic [ref=e297]: ビューティー
              - generic [ref=e298]:
                - text: ★★★★★
                - generic [ref=e299]: (1235)
              - generic [ref=e300]: ナチュラルスキンケア 3点セット
              - generic [ref=e301]: ¥4,280 税込
            - generic [ref=e302]:
              - img "焼き菓子アソートボックス" [ref=e303]
              - generic [ref=e304]: 食品・飲料
              - generic [ref=e305]:
                - text: ★★★★★
                - generic [ref=e306]: (1322)
              - generic [ref=e307]: 焼き菓子アソートボックス
              - generic [ref=e308]: ¥2,380 税込
            - generic [ref=e309]:
              - img "ペットケアおでかけセット" [ref=e310]
              - generic [ref=e311]: ペット用品
              - generic [ref=e312]:
                - text: ★★★★★
                - generic [ref=e313]: (1409)
              - generic [ref=e314]: ペットケアおでかけセット
              - generic [ref=e315]: ¥3,480 税込
            - generic [ref=e316]:
              - img "季節のギフトボックス" [ref=e317]
              - generic [ref=e318]: ギフト
              - generic [ref=e319]:
                - text: ★★★★★
                - generic [ref=e320]: (1496)
              - generic [ref=e321]: 季節のギフトボックス
              - generic [ref=e322]: ¥5,980 税込
            - generic [ref=e323]:
              - img "国産茶葉ティーバッグ 30包" [ref=e324]
              - generic [ref=e325]: コーヒー・お茶
              - generic [ref=e326]:
                - text: ★★★★★
                - generic [ref=e327]: (1583)
              - generic [ref=e328]: 国産茶葉ティーバッグ 30包
              - generic [ref=e329]: ¥1,780 税込
        - generic [ref=e330]:
          - button "売れ筋ランキング もっと見る 1 軽量ステンレスボトル 500ml 軽量ステンレスボトル 500ml ¥2,480 2 雪花セレクト ギフトタオル 2枚セット 雪花セレクト ギフトタオル 2枚セット ¥2,980 3 キッチン保存容器 6点セット キッチン保存容器 6点セット ¥3,280 4 毎日使えるホームケア洗剤セット 毎日使えるホームケア洗剤セット ¥1,680 5 ナチュラルスキンケア 3点セット ナチュラルスキンケア 3点セット ¥4,280" [ref=e331]:
            - generic [ref=e332]:
              - text: 売れ筋ランキング
              - generic [ref=e333]: もっと見る
            - generic [ref=e334]:
              - generic [ref=e335]:
                - generic [ref=e336]: "1"
                - img "軽量ステンレスボトル 500ml" [ref=e337]
                - generic [ref=e338]: 軽量ステンレスボトル 500ml
                - generic [ref=e339]: ¥2,480
              - generic [ref=e340]:
                - generic [ref=e341]: "2"
                - img "雪花セレクト ギフトタオル 2枚セット" [ref=e342]
                - generic [ref=e343]: 雪花セレクト ギフトタオル 2枚セット
                - generic [ref=e344]: ¥2,980
              - generic [ref=e345]:
                - generic [ref=e346]: "3"
                - img "キッチン保存容器 6点セット" [ref=e347]
                - generic [ref=e348]: キッチン保存容器 6点セット
                - generic [ref=e349]: ¥3,280
              - generic [ref=e350]:
                - generic [ref=e351]: "4"
                - img "毎日使えるホームケア洗剤セット" [ref=e352]
                - generic [ref=e353]: 毎日使えるホームケア洗剤セット
                - generic [ref=e354]: ¥1,680
              - generic [ref=e355]:
                - generic [ref=e356]: "5"
                - img "ナチュラルスキンケア 3点セット" [ref=e357]
                - generic [ref=e358]: ナチュラルスキンケア 3点セット
                - generic [ref=e359]: ¥4,280
          - button "タイムセール もっと見る SALE 雪花セレクト ギフトタオル 2枚セット 雪花セレクト ギフトタオル 2枚セット ¥2,980 SALE キッチン保存容器 6点セット キッチン保存容器 6点セット ¥3,280 SALE 毎日使えるホームケア洗剤セット 毎日使えるホームケア洗剤セット ¥1,680 SALE ナチュラルスキンケア 3点セット ナチュラルスキンケア 3点セット ¥4,280 SALE 焼き菓子アソートボックス 焼き菓子アソートボックス ¥2,380" [ref=e360]:
            - generic [ref=e361]:
              - text: タイムセール
              - generic [ref=e362]: もっと見る
            - generic [ref=e363]:
              - generic [ref=e364]:
                - generic [ref=e365]: SALE
                - img "雪花セレクト ギフトタオル 2枚セット" [ref=e366]
                - generic [ref=e367]: 雪花セレクト ギフトタオル 2枚セット
                - generic [ref=e368]: ¥2,980
              - generic [ref=e369]:
                - generic [ref=e370]: SALE
                - img "キッチン保存容器 6点セット" [ref=e371]
                - generic [ref=e372]: キッチン保存容器 6点セット
                - generic [ref=e373]: ¥3,280
              - generic [ref=e374]:
                - generic [ref=e375]: SALE
                - img "毎日使えるホームケア洗剤セット" [ref=e376]
                - generic [ref=e377]: 毎日使えるホームケア洗剤セット
                - generic [ref=e378]: ¥1,680
              - generic [ref=e379]:
                - generic [ref=e380]: SALE
                - img "ナチュラルスキンケア 3点セット" [ref=e381]
                - generic [ref=e382]: ナチュラルスキンケア 3点セット
                - generic [ref=e383]: ¥4,280
              - generic [ref=e384]:
                - generic [ref=e385]: SALE
                - img "焼き菓子アソートボックス" [ref=e386]
                - generic [ref=e387]: 焼き菓子アソートボックス
                - generic [ref=e388]: ¥2,380
          - button "カテゴリー一覧 もっと見る 食品・飲料 食品・飲料 コーヒー・お茶 コーヒー・お茶 キッチン用品 キッチン用品 日用品 日用品 タオル・寝具 タオル・寝具 ビューティー ビューティー ペット用品 ペット用品 ギフト ギフト" [ref=e389]:
            - generic [ref=e390]:
              - text: カテゴリー一覧
              - generic [ref=e391]: もっと見る
            - generic [ref=e392]:
              - generic [ref=e393]:
                - img "食品・飲料" [ref=e394]
                - text: 食品・飲料
              - generic [ref=e395]:
                - img "コーヒー・お茶" [ref=e396]
                - text: コーヒー・お茶
              - generic [ref=e397]:
                - img "キッチン用品" [ref=e398]
                - text: キッチン用品
              - generic [ref=e399]:
                - img "日用品" [ref=e400]
                - text: 日用品
              - generic [ref=e401]:
                - img "タオル・寝具" [ref=e402]
                - text: タオル・寝具
              - generic [ref=e403]:
                - img "ビューティー" [ref=e404]
                - text: ビューティー
              - generic [ref=e405]:
                - img "ペット用品" [ref=e406]
                - text: ペット用品
              - generic [ref=e407]:
                - img "ギフト" [ref=e408]
                - text: ギフト
        - button "人気ブランド THERMOS Panasonic SHARP dyson IRIS OHYAMA KIRIN" [ref=e409]:
          - heading "人気ブランド" [level=3] [ref=e410]
          - generic [ref=e411]:
            - generic [ref=e412]: THERMOS
            - generic [ref=e413]: Panasonic
            - generic [ref=e414]: SHARP
            - generic [ref=e415]: dyson
            - generic [ref=e416]: IRIS OHYAMA
            - generic [ref=e417]: KIRIN
    - complementary [ref=e418]:
      - generic [ref=e419]:
        - paragraph [ref=e420]: 編集中のセクション
        - heading "ヒーロースライダー" [level=2] [ref=e421]
        - paragraph [ref=e422]: "最終保存: 2026/6/4 15:15:21"
      - generic [ref=e424]:
        - generic [ref=e425]:
          - generic [ref=e426]: コンテンツ
          - generic [ref=e427]: デザイン
          - generic [ref=e428]: 表示設定
        - generic [ref=e429]:
          - heading "スライド設定" [level=3] [ref=e430]
          - paragraph [ref=e431]: 中央を大きく、左右に前後スライドを少し見せます。
        - generic [ref=e432]:
          - generic [ref=e433]:
            - generic [ref=e434]:
              - generic [ref=e435]: スライド 1
              - button [ref=e436]:
                - img
            - generic [ref=e437]:
              - text: タイトル
              - textbox "タイトル" [ref=e438]: 雪花セレクトを、わかりやすく。
            - generic [ref=e439]:
              - text: サブテキスト
              - textbox "サブテキスト" [ref=e440]: ギフトと日用品を中心に、毎日にちょうどいい商品をお届けします。
            - generic [ref=e441]:
              - text: 画像URL
              - textbox "画像URL" [ref=e442]:
                - /placeholder: /shop/api/assets/...
                - text: /shop/design/hero-lifestyle.svg
            - generic [ref=e443]:
              - text: CTA文言
              - textbox "CTA文言" [ref=e444]: 商品を見る
            - generic [ref=e445]:
              - text: CTAリンク
              - textbox "CTAリンク" [ref=e446]: "#products"
            - generic [ref=e447]:
              - checkbox "表示する" [checked] [ref=e448]
              - text: 表示する
          - generic [ref=e449]:
            - generic [ref=e450]:
              - generic [ref=e451]: スライド 2
              - button [ref=e452]:
                - img
            - generic [ref=e453]:
              - text: タイトル
              - textbox "タイトル" [ref=e454]: 毎日の暮らしに、ちょっとした贅沢を。
            - generic [ref=e455]:
              - text: サブテキスト
              - textbox "サブテキスト" [ref=e456]: 使いやすい日用品を選びやすく。
            - generic [ref=e457]:
              - text: 画像URL
              - textbox "画像URL" [ref=e458]:
                - /placeholder: /shop/api/assets/...
                - text: /shop/design/hero-daily.svg
            - generic [ref=e459]:
              - text: CTA文言
              - textbox "CTA文言" [ref=e460]: 商品を見る
            - generic [ref=e461]:
              - text: CTAリンク
              - textbox "CTAリンク" [ref=e462]: /s/aiboux/products
            - generic [ref=e463]:
              - checkbox "表示する" [checked] [ref=e464]
              - text: 表示する
          - generic [ref=e465]:
            - generic [ref=e466]:
              - generic [ref=e467]: スライド 3
              - button [ref=e468]:
                - img
            - generic [ref=e469]:
              - text: タイトル
              - textbox "タイトル" [ref=e470]: 新しい季節を、心地よく。
            - generic [ref=e471]:
              - text: サブテキスト
              - textbox "サブテキスト" [ref=e472]: 人気商品と定番商品をまとめて確認できます。
            - generic [ref=e473]:
              - text: 画像URL
              - textbox "画像URL" [ref=e474]:
                - /placeholder: /shop/api/assets/...
                - text: /shop/design/hero-season.svg
            - generic [ref=e475]:
              - text: CTA文言
              - textbox "CTA文言" [ref=e476]: おすすめへ
            - generic [ref=e477]:
              - text: CTAリンク
              - textbox "CTAリンク" [ref=e478]: /s/aiboux/products
            - generic [ref=e479]:
              - checkbox "表示する" [checked] [ref=e480]
              - text: 表示する
          - button "+ スライドを追加" [ref=e481]
        - generic [ref=e482]:
          - text: 自動再生
          - checkbox "自動再生" [checked] [ref=e483]
        - generic [ref=e484]:
          - text: 自動再生の間隔
          - generic [ref=e485]:
            - spinbutton "自動再生の間隔 秒" [ref=e486]: "5"
            - generic [ref=e487]: 秒
        - generic [ref=e488]:
          - text: プレビューの幅
          - generic [ref=e489]:
            - spinbutton "プレビューの幅 %" [ref=e490]: "28"
            - generic [ref=e491]: "%"
        - generic [ref=e492]:
          - text: ドット表示
          - checkbox "ドット表示" [checked] [ref=e493]
        - generic [ref=e494]:
          - text: 矢印表示
          - checkbox "矢印表示" [checked] [ref=e495]
```

# Test source

```ts
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
  79  |     await expect(page.getByText("¥3,600")).toBeVisible();
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
> 167 |       expect(src ?? "", `side hero ${index} should use a real preview image`).toContain("/shop/design/hero-");
      |                                                                               ^ Error: side hero 0 should use a real preview image
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
  203 |       expect(saveResponse.ok(), "layout POST from design editor save").toBeTruthy();
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