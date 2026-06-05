# AIBOUX Shop 5時間販売品質スプリント継続

Status: `SHOP_5H_SALES_QUALITY_SPRINT_CONTINUE_WIP`

Active instruction file:

- `ops/instructions/20260605_shop_5h_sales_quality_sprint_continue.md`

## Objective

AIBOUX Shopの5時間販売品質スプリントを継続し、公開ストア、商品詳細、カート、checkout、contact、legal/privacy/shipping/returns、FAQ、mypage系、admin系の見た目、動作、導線、SEO実装をWIP deployと公開ログ更新まで回し続ける。

## Fixed URL Rules

- Tenant storefront: `https://shop.aiboux.com/s/aiboux/`
- Shop service site: `https://shop.aiboux.com/`
- Shop admin: `https://shop.aiboux.com/s/aiboux/admin`
- Design editor: `https://shop.aiboux.com/s/aiboux/admin/design`

`shop.aiboux.com/` をテナントストアに戻さない。
`shop.aboux.com` と書かない。

## Current Focus

- 可視SEO説明削除は維持する。
- 裏側SEOは維持する。
- 購入者向けページ本文に、SEO内部語、migration、DB、schema、認証基盤、成功したふり、共通テンプレート、表示確認日などの実装説明を出さない。
- SEOメタ説明、管理UIの補足、APIのユーザー向けmessageにも、購入者や運用者に不要な内部実装語を出さない。
- API互換のため機械コードが必要な場合でも、表示messageは商用運用向けの自然な文にする。
- legal/privacy/shipping/returns/FAQ/mypage/login/register/subscriptions は、内部状態説明ではなく購入者向けのお買い物ガイド、販売条件、配送返品、会員機能の自然な文言へ整える。
- 公開HTML本文には `準備中`、`未完了`、`未接続`、`Provider subscription creation is not implemented` を出さない。状態説明は `受付条件`、`注文前確認`、`支払い方法の確認` に置き換える。
- `クロール可能`、`内部リンク`、`Page guide`、`Trust / proof matrix` などの監査・SEO・実装者向け語は、本文だけでなく `aria-label` などの公開HTML属性にも出さない。
- SEOの実装は head、JSON-LD、robots、sitemap、canonical で維持する。購入者向け画面では、お買い物ガイド、関連ページ、購入サポート、販売条件として自然に見せる。
- 全公開ページの見た目と導線を購入者向けに磨く。
- TOPと商品詳細のAmazon風売り場密度、リンク色、CTA、フッター、パンくず、商品カード、購入ボックスを改善する。
- cart/checkout/contact/legal/privacy/shipping/returns/FAQ/mypage/account/orders/favorites/login/register/mypage/subscriptions を薄い説明ページにしない。
- adminページはデモ値なし、導線が正しいことを維持する。
- 共通化できるパーツは共通化する。

## Current Cycle Focus: Cart / Checkout / Contact Retail Quality

- カート空状態でも、商品一覧、配送条件、返品条件、問い合わせへすぐ戻れる販売導線を表示する。
- checkoutは注文内容、配送・返品、支払い方法、定期購入の確認ステップを購入前チェックとして見せる。
- 問い合わせはフォームだけにせず、商品、配送、返品、注文履歴の確認導線を同じ画面で出す。
- これらは購入者向けの文言にし、SEO・DB・migration・schemaなどの内部説明は出さない。
- Playwrightで `storefront-cart-recovery-panel`、`storefront-checkout-stepper`、`storefront-checkout-order-guard`、`storefront-contact-topic-grid` を公開URLで検証する。

## Current Cycle Focus: Account / Orders / Favorites Retail Quality

- マイページとアカウントページに、注文、配送返品、定期購入、問い合わせへ進む購入者アクションセンターを表示する。
- 注文履歴は空状態だけで終わらせず、注文検索、配送状況、返品交換、問い合わせへ進める操作導線を表示する。
- お気に入りは商品一覧だけで終わらせず、価格、在庫、カート、配送返品条件を比較できる導線を表示する。
- 定期購入マイページは、次回配送、頻度変更、スキップ、解約条件の確認導線を表示する。
- ログイン/会員登録ページは、無効ボタンだけで終わらせず、入力確認と注文追跡、お気に入り、定期購入、個人情報ページへの導線を表示する。
- これらも購入者向けの文言にし、SEO・DB・migration・schema・未実装説明を公開本文へ出さない。
- Playwrightで `storefront-account-command-center`、`storefront-order-action-panel`、`storefront-order-status-cards`、`storefront-favorite-assist-grid`、`storefront-subscription-control-panel`、`storefront-auth-assist-grid` を公開URLで検証する。

## Current Cycle Focus: CLEANUP_AND_REFOCUS_CYCLE_0

方針変更:

- 販売画面を直接直す作業に集中する。
- SEO説明コンポーネント、SEO checklist、SEO sitemap panel、trust matrix、support rail、action map、context links、page quality summary の追加は禁止する。
- すでに使っていない可視SEO/説明パネル系コンポーネントは削除または非表示にする。
- gate追加だけ、Barkだけ、`/g/*` 更新だけ、D1権限不足の長文反復は禁止する。
- D1定期購入DB laneは `D1_PERMISSION_BLOCKED_NOT_FINAL` として一行で分離し、TOP/商品詳細/カート/checkout/contact/legal/admin改善を止めない。
- BarkはCycle完了時、deploy失敗時、D1権限復旧時、FINAL候補時だけ送る。小修正ごとの乱発は禁止する。

今後の作業レーン:

- Lane A: 公開TOP。スライダー、商品画像/商品名一致、商品カード、カート追加、もっと見る、売り場密度。
- Lane B: 商品詳細。画像ギャラリー、Amazon風3カラム、購入ボックス、カート追加、定期購入UIの安全停止。
- Lane C: 購入フロー。cart、checkout、contact、legal/privacy/shipping/returns。
- Lane D: 管理・永続化。admin/products、admin/settings、admin/design、admin/subscriptions。

実行サイクル:

- Cycle 1: TOP + 商品詳細。
- Cycle 2: カート + checkout + 問い合わせ + 法務。
- Cycle 3: 管理 + 保存 + 回帰確認。

ログ方針:

- `/g/l68` は最新状況だけを短く出す。
- `/g/d68` は最新画面証跡だけを短く出す。
- 旧長文履歴は必要に応じて `all_log/archive/` に退避する。

## Current Local Progress: Product Detail Buy-Now Flow

- 商品詳細の購入ボックスで「今すぐ購入」を押した場合、商品をカート状態へ入れてからcheckoutへ進む。
- 空checkoutへ直接飛ばす導線を避ける。
- 通常購入と定期購入の選択状態、選択中プラン、価格、配送頻度をcart/checkoutへ引き継ぐ。
- 公開URL用Playwrightで、商品詳細の「今すぐ購入」からcheckoutの注文内容に商品が入ることを検証する。

## Current Local Progress: Policy / FAQ Buyer Wording

- legal/privacy/shipping/returns/FAQ から、購入者に内部状態のように見える `未設定`、`決済接続`、`決済設定状態` を出さない。
- 問い合わせ先や所在地が不足する場合は、空欄や内部状態ではなく「問い合わせページから確認」として購入者導線へ寄せる。
- 配送・返品・FAQでは、支払い方法、送料、返品条件、問い合わせ導線を購入者向けに表示する。

## Current Local Progress: Storefront Link Data Refocus

- TOPページの構造化データ用リンク生成から、説明パネル系ヘルパー依存を外す。
- `buildShopPageActionMap`、`buildShopPageBuyingGuide`、`buildShopPageQualitySummary`、`buildShopTrustMatrix` をTOPの販売リンク生成に使わない。
- TOPの内部リンクは、商品一覧、カテゴリ、カート、配送、返品、問い合わせなど、購入に直結する販売リンクだけに寄せる。

## Current Local Progress: Product Quantity Purchase Flow

- 商品詳細の購入ボックスで、readonly数量ではなく `- / +` 付き数量stepperを表示する。
- 数量は1〜99点に正規化する。
- カートに入れる、今すぐ購入の両方で選択数量をcart/checkoutへ引き継ぐ。
- Playwrightで、商品詳細から数量2点を選んで今すぐ購入し、checkoutの注文内容が2点になることを検証する。

## Current Local Progress: Checkout Payment Panel Wording

- checkout右側に `storefront-checkout-payment-panel` を設け、通常購入、定期購入、サポートを購入前確認として表示する。
- checkoutと定期購入申込みの表示から `決済設定` を出さず、購入者向けに `支払い方法` と `受付条件` の文言へ寄せる。
- Playwrightでcheckout本文に `決済設定` が残らないことを検証する。

## Current Local Progress: Product Review Anchor Completion

- 商品詳細の `レビューを確認` リンクが、実体のないアンカーにならないよう `public-product-reviews` セクションを追加する。
- レビュー領域には平均評価、配送、ギフト、問い合わせ導線を含め、購入判断に使える内容として表示する。
- Playwrightで `#reviews` リンクと `public-product-reviews` の表示を検証する。

## Current Local Progress: Checkout And Order Lookup Inputs

- checkoutの配送先・連絡先欄をdisabled表示から、入力内容を確認できるフォームへ変更する。
- 注文履歴の注文検索欄をdisabled表示から、注文番号またはメールで入力確認できるフォームへ変更する。
- 定期購入規約チェックをdisabled表示から、購入者が確認できるチェックボックスへ変更する。
- Playwrightでcheckout customer formとorder lookup formがenabledであることを検証する。

## Current Local Progress: Admin Subscription CTA Links

- admin/subscriptionsの空状態CTAをJavaScript遷移ボタンから実リンクへ変更する。
- 商品設定と支払い設定へ、`/s/aiboux/admin/products`、`/s/aiboux/admin/settings` のhrefで進めるようにする。
- Playwrightでadmin subscription empty stateのCTA hrefを検証する。

## Current Local Progress: Admin Product Editor Back Link

- 商品作成/編集画面の「商品一覧へ戻る」を `window.location.assign` ではなく実リンクへ変更する。
- 戻り先は `/s/aiboux/admin/products` に固定する。
- Playwrightで商品作成画面の戻るリンクhrefを検証する。

## Current Local Progress: Admin Content Settings Link

- コンテンツ管理の「コンテンツを作成」disabledボタンをやめ、実際に編集できる設定画面へのリンクへ変更する。
- ストア文言、特商法、配送、返品、問い合わせ文言の編集導線を `/s/aiboux/admin/settings` に寄せる。
- Playwrightでcontentページの設定リンクhrefと、古いAPI接続待ち文言が出ないことを検証する。

## Current Local Progress: Inventory CSV Actions

- 在庫ページのCSV取り込み/CSV書き出しをdisabled表示から実操作へ変更する。
- CSV書き出しは表示中の在庫行をBOM付きCSVとして保存する。
- CSV取り込みは `productId` または商品番号と現在庫列を読み、在庫draftに反映する。
- Playwrightで在庫CSVボタンがenabledで、古いAPI接続待ち文言が出ないことを検証する。

## Current Local Progress: Design Editor Undo / Preview Controls

- ストアデザインエディタのUndo/Redoをdisabled表示から実操作へ変更する。
- TOP/商品詳細の編集中設定を変更した後、Undoで前状態へ戻り、Redoで再適用できるようにする。
- PC/モバイルプレビュー切替を画面内フレーム幅へ反映する。
- PlaywrightでUndo/Redoとpreview device属性を検証する。

## Current Local Progress: Core Product Integration Panel Actions

- Core商品連携画面の `API接続後` disabledボタンを、画面内で状態が変わる運用操作へ変更する。
- 正本同期、承認へ送る、SKU追加、AI案作成、下書き保存を押せる操作にする。
- SKU追加は入力値から画面内のSKU行を追加し、承認待ち状態へ反映する。
- Playwrightで `API接続後` 文言が残らないことと、各操作が状態反映されることを検証する。

## Current Local Progress: Product And Customer Row Menus

- 商品一覧の行メニューからdisabledの複製/販売状態説明をなくす。
- 商品行メニューの複製は商品作成画面へ進む実導線にする。
- 販売状態変更は商品編集へ進む実操作にする。
- 顧客一覧の行メニューからdisabledの詳細/セグメント/メモ操作をなくす。
- 顧客詳細パネル、セグメント追加表示、メモ編集入力を画面内で操作できるようにする。
- 管理トップバーのdisabledログアウト項目をやめ、管理者設定へ進める実メニューにする。
- Playwrightで商品・顧客の行メニュー操作を検証する。

## Current Local Progress: Storefront Carousel Smoothness

- TOPヒーローカルーセルの切替を、固定タイマーだけではなく `transitionend` で完了判定する。
- 画像を事前デコード対象にして、切替時の白抜けや引っかかりを減らす。
- trackにGPU向けの描画スタイルを付け、JS/CSSのtransition durationを560msへ揃える。

## Current Local Progress: Admin Collection / Discount Action Cleanup

- コレクション管理と割引管理に残っていた永久disabled操作をやめる。
- コレクション作成、編集状態化、商品確認、公開カテゴリ確認を画面内または実リンクで操作できるようにする。
- 割引作成、編集、複製、停止/再開を画面内で操作できるようにする。
- 支払い設定の状態表示は、内部的な未接続/未設定語ではなく、運用者向けの受付前/支払い方法確認の文に寄せる。
- アプリ連携の状態表示も `未接続` ではなく `受付前` へ統一する。

## Current Local Progress: Checkout Empty-State Sales Recovery

- checkoutが空のとき、テキストだけで終わらせない。
- 商品一覧、カート、配送条件へ戻れる購入導線を表示する。
- `storefront-checkout-empty-guide` として、購入者が次に進める導線を明示する。
- Playwrightでcheckout空状態の復帰リンク、購入完了のふりが出ないこと、dead linkがないことを固定する。

## Current Local Progress: Buyer Form Recovery Links

- 注文検索フォームの正常入力後に、問い合わせ、配送条件、返品条件へ進めるリンクを出す。
- ログイン/登録フォームの正常入力後に、マイページ、注文履歴、お気に入りへ進めるリンクを出す。
- 成功したふりはしない。入力確認と次導線だけを表示する。
- Playwrightで注文検索とログイン/登録のリンク、完了偽装文言がないことを固定する。

## Current Local Progress: TOP Sales Links Refocus

- TOPカテゴリカードが全て商品一覧へ戻るだけだった状態をやめる。
- コーヒー・お茶、キッチン用品、日用品、ギフト、セール、ランキングなど、各カテゴリカードを `/s/aiboux/products?category=...` へ直接つなぐ。
- 売れ筋ランキングとタイムセールの「もっと見る」を、それぞれランキング売り場、セール売り場へつなぐ。
- おすすめ商品の件数バッジはDB取得件数ではなく、実際に公開TOPへ表示する販売カード件数を示す。
- フッター主要リンクの内部実装名をSEO sitemapではなく、販売向けのshopping directoryへ寄せる。
- PlaywrightでTOP本文のカテゴリリンク、ランキングリンク、セールリンクを公開URLで検証する。

## Current Public Progress: TOP Sales Links Refocus Deployed

- WIP deploy executed.
- Worker Version ID: `0dbb45dc-ffb2-41fd-9b00-996920d0846f`.
- WIP checkpoint commit: `0a1c8e1`.
- Source change commit: `ece5930`.
- Public `https://shop.aiboux.com/s/aiboux/`: HTTP 200.
- Public storefront HTML includes `coffee-tea`, `kitchen`, `ranking`, and `sale` category links.
- Public `gate:shop-storefront-interaction`: PASS, 2 tests.
- Public `/g/l68` and `/g/d68` matched local source before this post-deploy log update.
- Public `/g/m68` still differs from local `public/g/m68.md`; do not claim full URL bundle source equality until reconciled.

## Current Local Progress: Product Slug Detail Consistency

- Public screenshot review found `/s/aiboux/product/setsuka-coffee` showing a home-care detergent product.
- Curated storefront product slugs now take precedence over stale DB fallback rows for matching curated URLs.
- `setsuka-coffee` must render `雪花セレクト ドリップコーヒー 20袋`, category `コーヒー・お茶`, matching image alt, breadcrumb, canonical, and a single visible H1.
- `tests/shop-product-detail-public.spec.ts` now includes a direct curated slug consistency check.
- This is a direct product-detail SEO and buyer trust fix, not a visible SEO explanation component.

## Current Public Progress: Product Slug Detail Consistency Deployed

- WIP deploy executed.
- Worker Version ID for the footer-copy publication deploy: `f3b5a184-8d9b-4269-b428-46238f267d11`.
- Public `https://shop.aiboux.com/s/aiboux/product/setsuka-coffee`: HTTP 200.
- Response header `x-aiboux-worker-version`: `f3b5a184-8d9b-4269-b428-46238f267d11`.
- Public `gate:shop-product-detail`: PASS, 4 tests.
- Public `gate:shop-public-crawl`: PASS, 11 tests.
- The public gate confirms visible H1 `雪花セレクト ドリップコーヒー 20袋`, visible category `コーヒー・お茶`, matching product image alt, breadcrumb, canonical URL, and no visible stale title `毎日使えるホームケア洗剤セット`.

## Current Local Progress: Footer Visible Copy Cleanup

- Footer dense buyer links remain.
- Footer link directory no longer shows explanatory copy `ストア内リンクをまとめて確認`.
- Footer link directory no longer shows explanatory copy `必要なページへすぐ移動できます`.
- Tests now protect against these visible explanation phrases returning.

## Verification

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run astro -- check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-public-crawl`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-product-detail`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality`

`gate:shop-subscriptions` remains a separate blocked lane until D1/subscription persistence is accepted.

## Reporting

Before reporting, publish and verify:

- `https://mail.aiboux.com/g/m68`
- `https://mail.aiboux.com/g/l68`
- `https://mail.aiboux.com/g/d68`

`FINAL_ACCEPTED` remains prohibited.
