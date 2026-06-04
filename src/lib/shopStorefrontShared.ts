export type ShopStorefrontLink = {
  label: string;
  href: string;
};

export type ShopStorefrontLinkGroup = {
  title: string;
  links: ShopStorefrontLink[];
};

export type ShopStorefrontInfoCard = {
  title: string;
  body: string;
  href?: string;
  label?: string;
};

export type ShopStorefrontCategorySeed = {
  name: string;
  slug: string;
  productCount: number;
};

export type ShopStorefrontFaqItem = {
  question: string;
  answer: string;
};

export function buildShopFooterColumns(tenantRoot: string): ShopStorefrontLinkGroup[] {
  return [
    {
      title: "お買い物",
      links: [
        { label: "商品一覧", href: `${tenantRoot}/products` },
        { label: "カテゴリ", href: `${tenantRoot}/categories` },
        { label: "タイムセール", href: `${tenantRoot}/products` },
        { label: "お気に入り", href: `${tenantRoot}/favorites` },
      ],
    },
    {
      title: "アカウント",
      links: [
        { label: "マイページ", href: `${tenantRoot}/mypage` },
        { label: "注文履歴", href: `${tenantRoot}/orders` },
        { label: "定期購入", href: `${tenantRoot}/mypage/subscriptions` },
        { label: "ログイン", href: `${tenantRoot}/login` },
      ],
    },
    {
      title: "サポート",
      links: [
        { label: "問い合わせ", href: `${tenantRoot}/contact` },
        { label: "よくある質問", href: `${tenantRoot}/faq` },
        { label: "配送について", href: `${tenantRoot}/shipping` },
        { label: "返品について", href: `${tenantRoot}/returns` },
      ],
    },
    {
      title: "ストア情報",
      links: [
        { label: "特定商取引法", href: `${tenantRoot}/legal` },
        { label: "プライバシーポリシー", href: `${tenantRoot}/privacy` },
        { label: "カート", href: `${tenantRoot}/cart` },
        { label: "チェックアウト", href: `${tenantRoot}/checkout` },
      ],
    },
  ];
}

export function buildShopFooterAssurances(): ShopStorefrontInfoCard[] {
  return [
    { title: "税込価格", body: "商品価格は税込表示で統一します。" },
    { title: "配送・返品", body: "配送予定、返品条件、問い合わせ先を各ページから確認できます。" },
    { title: "決済状態", body: "決済未接続時は注文確定したふりをせず、設定未完了として表示します。" },
    { title: "定期購入", body: "定期購入はDB migrationと決済接続が完了するまで正直に準備中表示にします。" },
  ];
}

export function buildShopAccountCards(tenantRoot: string): ShopStorefrontInfoCard[] {
  return [
    { title: "注文履歴", body: "注文番号、配送状況、領収書、問い合わせを確認します。", href: `${tenantRoot}/orders` },
    { title: "お気に入り", body: "あとで購入したい商品を保存して比較できます。", href: `${tenantRoot}/favorites` },
    { title: "定期購入", body: "次回配送、スキップ、一時停止、解約条件を確認します。", href: `${tenantRoot}/mypage/subscriptions` },
    { title: "配送先", body: "配送先住所は決済接続後に登録できるようになります。", href: `${tenantRoot}/checkout` },
    { title: "問い合わせ", body: "注文番号を添えてストアへ問い合わせできます。", href: `${tenantRoot}/contact` },
    { title: "返品・配送", body: "配送、返品、キャンセル条件を確認します。", href: `${tenantRoot}/returns` },
  ];
}

export function buildShopPolicySupportCards(tenantRoot: string): ShopStorefrontInfoCard[] {
  return [
    { title: "購入前チェック", body: "価格、税込表示、送料、返品条件、決済設定状態を確認してから注文へ進みます。", href: `${tenantRoot}/checkout` },
    { title: "配送・返品", body: "配送目安、送料、返品受付条件、不良品時の問い合わせ導線をまとめて確認できます。", href: `${tenantRoot}/shipping` },
    { title: "問い合わせ", body: "注文番号、商品名、確認したい内容を添えてストアへ問い合わせできます。", href: `${tenantRoot}/contact` },
  ];
}

export function buildShopSupportRailCards(tenantRoot: string): ShopStorefrontInfoCard[] {
  return [
    {
      title: "商品を探す",
      body: "商品一覧、カテゴリ、ランキングから価格・税込・在庫・レビューを比較できます。",
      href: `${tenantRoot}/products`,
      label: "商品一覧へ",
    },
    {
      title: "購入前に確認",
      body: "送料、返品条件、決済設定状態、特定商取引法の表示を注文前に確認できます。",
      href: `${tenantRoot}/shipping`,
      label: "配送条件を見る",
    },
    {
      title: "注文後の確認",
      body: "注文履歴、配送状況、問い合わせ、領収書導線を同じマイページ導線で確認します。",
      href: `${tenantRoot}/orders`,
      label: "注文履歴へ",
    },
    {
      title: "定期購入",
      body: "定期購入は本番DB migrationと決済接続が完了するまで、準備中として正直に表示します。",
      href: `${tenantRoot}/mypage/subscriptions`,
      label: "定期購入を見る",
    },
  ];
}

export function buildShopSupportRailQuickLinks(tenantRoot: string): ShopStorefrontLink[] {
  return [
    { label: "カテゴリから探す", href: `${tenantRoot}/categories` },
    { label: "カートを見る", href: `${tenantRoot}/cart` },
    { label: "チェックアウト", href: `${tenantRoot}/checkout` },
    { label: "問い合わせ", href: `${tenantRoot}/contact` },
    { label: "よくある質問", href: `${tenantRoot}/faq` },
    { label: "返品について", href: `${tenantRoot}/returns` },
    { label: "マイページ", href: `${tenantRoot}/mypage` },
    { label: "お気に入り", href: `${tenantRoot}/favorites` },
  ];
}

export function buildShopPurchaseGuideCards(): ShopStorefrontInfoCard[] {
  return [
    { title: "未発送", body: "注文後、発送準備前の変更や問い合わせに対応します。" },
    { title: "発送済み", body: "追跡番号、配送予定日、配送会社を確認できます。" },
    { title: "返品・交換", body: "未開封品、不良品、到着後7日以内などの条件を案内します。" },
  ];
}

export function buildShopCuratedCategoryCards(): ShopStorefrontCategorySeed[] {
  return [
    { name: "食品・飲料", slug: "food-drink", productCount: 18 },
    { name: "コーヒー・お茶", slug: "coffee-tea", productCount: 12 },
    { name: "キッチン用品", slug: "kitchen", productCount: 16 },
    { name: "日用品", slug: "daily-goods", productCount: 22 },
    { name: "タオル・寝具", slug: "towels", productCount: 9 },
    { name: "ビューティー", slug: "beauty", productCount: 11 },
    { name: "ペット用品", slug: "pet", productCount: 8 },
    { name: "ギフト", slug: "gift", productCount: 14 },
    { name: "スポーツ・アウトドア", slug: "sports-outdoor", productCount: 10 },
    { name: "本・文具", slug: "books-stationery", productCount: 7 },
    { name: "セール", slug: "sale", productCount: 15 },
    { name: "ランキング", slug: "ranking", productCount: 20 },
  ];
}

export function buildShopFaqItems(): ShopStorefrontFaqItem[] {
  return [
    {
      question: "注文後に内容を変更できますか。",
      answer:
        "発送準備前であれば、問い合わせフォームから変更希望内容を送信してください。発送準備後は変更できない場合があります。",
    },
    {
      question: "定期購入は利用できますか。",
      answer:
        "定期購入は本番接続後に有効化します。商品詳細に表示される購入条件と、チェックアウトの決済設定状態を確認してください。",
    },
    {
      question: "送料や返品条件はどこで確認できますか。",
      answer:
        "配送について、返品について、特定商取引法に基づく表示の各ページで確認できます。",
    },
    {
      question: "決済が未接続の場合はどうなりますか。",
      answer:
        "購入者に誤解を与えないため、決済未接続時は注文確定や支払い完了のような表示を出さず、設定が必要であることを表示します。",
    },
  ];
}
