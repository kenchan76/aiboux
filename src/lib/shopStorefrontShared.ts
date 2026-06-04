export type ShopStorefrontLink = {
  label: string;
  href: string;
};

export type ShopStorefrontLinkGroup = {
  title: string;
  links: ShopStorefrontLink[];
};

export type ShopStorefrontContextLinkSection = {
  title: string;
  summary: string;
  links: ShopStorefrontLink[];
};

export type ShopStorefrontInfoCard = {
  title: string;
  body: string;
  href?: string;
  label?: string;
};

export type ShopStorefrontCommerceFact = {
  title: string;
  body: string;
  href: string;
  label: string;
  badge?: string;
  tone?: "neutral" | "amber" | "blue" | "red" | "green";
};

export type ShopStorefrontPageHeaderAction = {
  label: string;
  href: string;
  tone?: "primary" | "secondary";
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

export type ShopStorefrontBuyingGuideItem = {
  question: string;
  answer: string;
  href: string;
  label: string;
};

export type ShopStorefrontPageQualitySignal = {
  title: string;
  body: string;
  href: string;
  label: string;
  badge: string;
};

export type ShopStorefrontPageQualitySummary = {
  pageLabel: string;
  intent: string;
  seoRole: string;
  userAction: string;
  signals: ShopStorefrontPageQualitySignal[];
};

export type ShopStorefrontBreadcrumbSupportLink = {
  label: string;
  href: string;
  note: string;
};

export function buildShopCategoryHref(tenantRoot: string, slugOrName: string): string {
  const category = findShopCuratedCategory(slugOrName);
  const slug = category?.slug ?? slugOrName;
  return `${tenantRoot}/products?category=${encodeURIComponent(slug)}`;
}

export function findShopCuratedCategory(slugOrName: string): ShopStorefrontCategorySeed | null {
  const normalized = normalizeShopCategoryToken(slugOrName);
  return buildShopCuratedCategoryCards().find((category) => {
    return normalizeShopCategoryToken(category.slug) === normalized || normalizeShopCategoryToken(category.name) === normalized;
  }) ?? null;
}

export function buildShopHeaderCategoryLinks(tenantRoot: string): ShopStorefrontLink[] {
  return [
    { label: "食品・お菓子", href: buildShopCategoryHref(tenantRoot, "food-drink") },
    { label: "日用品", href: buildShopCategoryHref(tenantRoot, "daily-goods") },
    { label: "キッチン用品", href: buildShopCategoryHref(tenantRoot, "kitchen") },
    { label: "ギフト", href: buildShopCategoryHref(tenantRoot, "gift") },
    { label: "ビューティー", href: buildShopCategoryHref(tenantRoot, "beauty") },
    { label: "ペット用品", href: buildShopCategoryHref(tenantRoot, "pet") },
    { label: "スポーツ・アウトドア", href: buildShopCategoryHref(tenantRoot, "sports-outdoor") },
    { label: "本・文具", href: buildShopCategoryHref(tenantRoot, "books-stationery") },
    { label: "セール", href: buildShopCategoryHref(tenantRoot, "sale") },
    { label: "ランキング", href: buildShopCategoryHref(tenantRoot, "ranking") },
  ];
}

export function buildShopBreadcrumbSupportLinks(
  page: string,
  tenantRoot: string,
  input: {
    categoryName?: string | null;
  } = {},
): ShopStorefrontBreadcrumbSupportLink[] {
  const categoryName = String(input.categoryName || "").replace(/\s+/g, " ").trim();
  const category = categoryName ? findShopCuratedCategory(categoryName) : null;
  const categoryLink: ShopStorefrontBreadcrumbSupportLink = category
    ? {
        label: `${category.name}を見る`,
        href: buildShopCategoryHref(tenantRoot, category.slug),
        note: "同じカテゴリの商品へ戻る",
      }
    : {
        label: "カテゴリから探す",
        href: `${tenantRoot}/categories`,
        note: "売り場階層をたどる",
      };

  const commonDiscovery: ShopStorefrontBreadcrumbSupportLink[] = [
    { label: "商品一覧", href: `${tenantRoot}/products`, note: "全商品を比較する" },
    { label: "配送・返品", href: `${tenantRoot}/shipping`, note: "購入条件を確認する" },
    { label: "問い合わせ", href: `${tenantRoot}/contact`, note: "不明点を確認する" },
  ];

  const map: Record<string, ShopStorefrontBreadcrumbSupportLink[]> = {
    "": [
      { label: "タイムセール", href: buildShopCategoryHref(tenantRoot, "sale"), note: "セール商品へ移動" },
      { label: "ランキング", href: buildShopCategoryHref(tenantRoot, "ranking"), note: "売れ筋を確認" },
      { label: "カテゴリ一覧", href: `${tenantRoot}/categories`, note: "売り場を選ぶ" },
      { label: "カート", href: `${tenantRoot}/cart`, note: "購入候補を確認" },
    ],
    products: [
      { label: "カテゴリ一覧", href: `${tenantRoot}/categories`, note: "カテゴリで絞り込む" },
      { label: "タイムセール", href: buildShopCategoryHref(tenantRoot, "sale"), note: "値引き商品を確認" },
      { label: "ランキング", href: buildShopCategoryHref(tenantRoot, "ranking"), note: "人気商品を見る" },
      { label: "配送・返品", href: `${tenantRoot}/shipping`, note: "購入前条件を確認" },
    ],
    categories: [
      { label: "商品一覧", href: `${tenantRoot}/products`, note: "すべての商品を見る" },
      { label: "食品・飲料", href: buildShopCategoryHref(tenantRoot, "food-drink"), note: "食品カテゴリへ" },
      { label: "日用品", href: buildShopCategoryHref(tenantRoot, "daily-goods"), note: "日用品カテゴリへ" },
      { label: "ギフト", href: buildShopCategoryHref(tenantRoot, "gift"), note: "ギフトカテゴリへ" },
    ],
    product: [
      categoryLink,
      { label: "商品一覧", href: `${tenantRoot}/products`, note: "比較に戻る" },
      { label: "カート", href: `${tenantRoot}/cart`, note: "購入候補を確認" },
      { label: "返品条件", href: `${tenantRoot}/returns`, note: "購入前に確認" },
    ],
    cart: [
      { label: "商品を追加", href: `${tenantRoot}/products`, note: "買い物を続ける" },
      { label: "チェックアウト", href: `${tenantRoot}/checkout`, note: "注文確認へ進む" },
      { label: "配送条件", href: `${tenantRoot}/shipping`, note: "送料を確認" },
      { label: "返品条件", href: `${tenantRoot}/returns`, note: "返品可否を確認" },
    ],
    checkout: [
      { label: "カートへ戻る", href: `${tenantRoot}/cart`, note: "数量と小計を確認" },
      { label: "特商法", href: `${tenantRoot}/legal`, note: "販売条件を確認" },
      { label: "プライバシー", href: `${tenantRoot}/privacy`, note: "個人情報を確認" },
      { label: "問い合わせ", href: `${tenantRoot}/contact`, note: "注文前に相談" },
    ],
    contact: [
      { label: "FAQ", href: `${tenantRoot}/faq`, note: "よくある質問を見る" },
      { label: "配送について", href: `${tenantRoot}/shipping`, note: "配送条件を見る" },
      { label: "返品について", href: `${tenantRoot}/returns`, note: "返品条件を見る" },
      { label: "注文履歴", href: `${tenantRoot}/orders`, note: "注文番号を確認" },
    ],
    legal: [
      { label: "配送について", href: `${tenantRoot}/shipping`, note: "発送条件を確認" },
      { label: "返品について", href: `${tenantRoot}/returns`, note: "返品条件を確認" },
      { label: "プライバシー", href: `${tenantRoot}/privacy`, note: "個人情報を確認" },
      { label: "問い合わせ", href: `${tenantRoot}/contact`, note: "販売条件を相談" },
    ],
    privacy: [
      { label: "特商法", href: `${tenantRoot}/legal`, note: "販売者情報を見る" },
      { label: "問い合わせ", href: `${tenantRoot}/contact`, note: "個人情報を相談" },
      { label: "マイページ", href: `${tenantRoot}/mypage`, note: "登録情報を確認" },
      { label: "FAQ", href: `${tenantRoot}/faq`, note: "よくある質問へ" },
    ],
    shipping: [
      { label: "商品一覧", href: `${tenantRoot}/products`, note: "商品へ戻る" },
      { label: "返品について", href: `${tenantRoot}/returns`, note: "返品条件と合わせて確認" },
      { label: "カート", href: `${tenantRoot}/cart`, note: "送料前の小計を見る" },
      { label: "問い合わせ", href: `${tenantRoot}/contact`, note: "配送を相談" },
    ],
    returns: [
      { label: "配送について", href: `${tenantRoot}/shipping`, note: "配送条件を確認" },
      { label: "注文履歴", href: `${tenantRoot}/orders`, note: "対象注文を確認" },
      { label: "問い合わせ", href: `${tenantRoot}/contact`, note: "返品を相談" },
      { label: "特商法", href: `${tenantRoot}/legal`, note: "取引条件を見る" },
    ],
    faq: [
      { label: "問い合わせ", href: `${tenantRoot}/contact`, note: "解決しない場合に連絡" },
      { label: "配送について", href: `${tenantRoot}/shipping`, note: "配送FAQへ移動" },
      { label: "返品について", href: `${tenantRoot}/returns`, note: "返品FAQへ移動" },
      { label: "商品一覧", href: `${tenantRoot}/products`, note: "商品比較へ戻る" },
    ],
    mypage: [
      { label: "注文履歴", href: `${tenantRoot}/orders`, note: "注文を確認" },
      { label: "お気に入り", href: `${tenantRoot}/favorites`, note: "保存商品を見る" },
      { label: "定期購入", href: `${tenantRoot}/mypage/subscriptions`, note: "契約状態を見る" },
      { label: "問い合わせ", href: `${tenantRoot}/contact`, note: "購入後相談" },
    ],
    "mypage/subscriptions": [
      { label: "マイページ", href: `${tenantRoot}/mypage`, note: "アカウントへ戻る" },
      { label: "商品一覧", href: `${tenantRoot}/products`, note: "対象商品を探す" },
      { label: "FAQ", href: `${tenantRoot}/faq`, note: "定期購入FAQを見る" },
      { label: "問い合わせ", href: `${tenantRoot}/contact`, note: "契約を相談" },
    ],
    orders: [
      { label: "マイページ", href: `${tenantRoot}/mypage`, note: "購入者ページへ戻る" },
      { label: "配送について", href: `${tenantRoot}/shipping`, note: "配送状態を確認" },
      { label: "返品について", href: `${tenantRoot}/returns`, note: "返品条件を見る" },
      { label: "問い合わせ", href: `${tenantRoot}/contact`, note: "注文番号で相談" },
    ],
    favorites: [
      { label: "商品一覧", href: `${tenantRoot}/products`, note: "商品を追加" },
      { label: "カテゴリ一覧", href: `${tenantRoot}/categories`, note: "カテゴリで探す" },
      { label: "カート", href: `${tenantRoot}/cart`, note: "購入候補を確認" },
      { label: "マイページ", href: `${tenantRoot}/mypage`, note: "アカウントへ戻る" },
    ],
    login: [
      { label: "会員登録", href: `${tenantRoot}/register`, note: "新規登録へ" },
      { label: "マイページ", href: `${tenantRoot}/mypage`, note: "アカウントへ" },
      { label: "注文履歴", href: `${tenantRoot}/orders`, note: "注文確認へ" },
      { label: "FAQ", href: `${tenantRoot}/faq`, note: "ログインFAQへ" },
    ],
    register: [
      { label: "ログイン", href: `${tenantRoot}/login`, note: "既存アカウントへ" },
      { label: "マイページ", href: `${tenantRoot}/mypage`, note: "登録後の入口" },
      { label: "プライバシー", href: `${tenantRoot}/privacy`, note: "個人情報を確認" },
      { label: "商品一覧", href: `${tenantRoot}/products`, note: "買い物へ戻る" },
    ],
    account: [
      { label: "マイページ", href: `${tenantRoot}/mypage`, note: "購入者ページへ" },
      { label: "注文履歴", href: `${tenantRoot}/orders`, note: "注文を確認" },
      { label: "お気に入り", href: `${tenantRoot}/favorites`, note: "保存商品を見る" },
      { label: "定期購入", href: `${tenantRoot}/mypage/subscriptions`, note: "契約状態を見る" },
    ],
  };

  return map[page] ?? commonDiscovery;
}

function normalizeShopCategoryToken(value: string): string {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[・\s_]+/g, "-")
    .replace(/[^a-z0-9ぁ-んァ-ヶー一-龠-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildShopFooterColumns(tenantRoot: string): ShopStorefrontLinkGroup[] {
  return [
    {
      title: "お買い物",
      links: [
        { label: "商品一覧", href: `${tenantRoot}/products` },
        { label: "カテゴリ", href: `${tenantRoot}/categories` },
        { label: "タイムセール", href: buildShopCategoryHref(tenantRoot, "sale") },
        { label: "売れ筋ランキング", href: buildShopCategoryHref(tenantRoot, "ranking") },
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

export function buildShopCommerceFacts(
  tenantRoot: string,
  input: {
    page?: string;
    productName?: string | null;
    priceLabel?: string | null;
    inStock?: boolean | null;
    subscriptionSchemaPending?: boolean;
  } = {},
): ShopStorefrontCommerceFact[] {
  const productName = String(input.productName || "商品").replace(/\s+/g, " ").trim();
  const priceLabel = String(input.priceLabel || "税込価格を商品ページで確認").replace(/\s+/g, " ").trim();
  const stockText = input.inStock === false ? "在庫は商品ページで確認" : "在庫あり・在庫確認を明示";
  const subscriptionBody = input.subscriptionSchemaPending
    ? "定期購入はDB migrationと決済接続が完了するまで申込み不可として表示します。成功したふりはしません。"
    : "通常購入と定期購入の条件を購入前に分けて確認できます。";

  return [
    {
      title: "価格・税込表示",
      body: input.page === "product"
        ? `${productName}の価格は${priceLabel}です。商品カード、商品詳細、カートで税込表示を揃えます。`
        : "商品一覧、商品詳細、カートで税込価格を同じ形式で表示し、購入前の比較をしやすくします。",
      href: input.page === "product" ? `${tenantRoot}/cart` : `${tenantRoot}/products`,
      label: input.page === "product" ? "カートで確認" : "商品を比較",
      badge: "税込",
      tone: "red",
    },
    {
      title: "在庫・配送予定",
      body: `${stockText}。配送は通常2〜4営業日を目安に、追跡と送料条件を配送ページへ集約します。`,
      href: `${tenantRoot}/shipping`,
      label: "配送条件を見る",
      badge: "配送",
      tone: "green",
    },
    {
      title: "返品・キャンセル",
      body: "未開封・未使用品、初期不良、到着後7日以内の問い合わせ条件を購入前に確認できます。",
      href: `${tenantRoot}/returns`,
      label: "返品条件を見る",
      badge: "返品",
      tone: "blue",
    },
    {
      title: "決済・定期購入",
      body: subscriptionBody,
      href: `${tenantRoot}/checkout`,
      label: "注文前に確認",
      badge: input.subscriptionSchemaPending ? "準備中" : "購入条件",
      tone: "amber",
    },
    {
      title: "問い合わせ導線",
      body: "商品名、注文番号、配送、返品、定期購入の確認事項を問い合わせページで整理します。",
      href: `${tenantRoot}/contact`,
      label: "問い合わせる",
      badge: "サポート",
      tone: "neutral",
    },
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

export function buildShopSeoHubGroups(tenantRoot: string): ShopStorefrontLinkGroup[] {
  return [
    {
      title: "人気カテゴリ",
      links: [
        { label: "食品・飲料を比較する", href: buildShopCategoryHref(tenantRoot, "food-drink") },
        { label: "コーヒー・お茶を見る", href: buildShopCategoryHref(tenantRoot, "coffee-tea") },
        { label: "キッチン用品を探す", href: buildShopCategoryHref(tenantRoot, "kitchen") },
        { label: "日用品をまとめ買いする", href: buildShopCategoryHref(tenantRoot, "daily-goods") },
        { label: "ギフト商品を選ぶ", href: buildShopCategoryHref(tenantRoot, "gift") },
      ],
    },
    {
      title: "購入前ガイド",
      links: [
        { label: "送料と配送予定を確認する", href: `${tenantRoot}/shipping` },
        { label: "返品・交換条件を確認する", href: `${tenantRoot}/returns` },
        { label: "よくある質問を見る", href: `${tenantRoot}/faq` },
        { label: "ストアへ問い合わせる", href: `${tenantRoot}/contact` },
      ],
    },
    {
      title: "購入後サポート",
      links: [
        { label: "注文履歴を確認する", href: `${tenantRoot}/orders` },
        { label: "マイページを開く", href: `${tenantRoot}/mypage` },
        { label: "お気に入り商品を見る", href: `${tenantRoot}/favorites` },
        { label: "定期購入の状態を見る", href: `${tenantRoot}/mypage/subscriptions` },
      ],
    },
  ];
}

export function buildShopSeoHubHighlights(tenantRoot: string): ShopStorefrontInfoCard[] {
  return [
    {
      title: "商品比較",
      body: "価格、税込、レビュー、在庫、配送目安を同じ商品カードで比較します。",
      href: `${tenantRoot}/products`,
      label: "商品一覧",
    },
    {
      title: "購入条件",
      body: "送料、返品、特商法、決済設定状態を注文前に確認できます。",
      href: `${tenantRoot}/legal`,
      label: "取引条件",
    },
    {
      title: "アカウント",
      body: "注文履歴、配送状況、定期購入、お気に入りを同じ導線で確認します。",
      href: `${tenantRoot}/mypage`,
      label: "マイページ",
    },
  ];
}

export function buildShopContextualLinkSections(page: string, tenantRoot: string): ShopStorefrontContextLinkSection[] {
  const productDiscovery: ShopStorefrontContextLinkSection = {
    title: "商品を探す",
    summary: "価格、税込表示、レビュー、カテゴリ、在庫、配送条件を同じ導線で比較します。",
    links: [
      { label: "すべての商品", href: `${tenantRoot}/products` },
      { label: "カテゴリ一覧", href: `${tenantRoot}/categories` },
      { label: "食品・飲料", href: buildShopCategoryHref(tenantRoot, "food-drink") },
      { label: "日用品", href: buildShopCategoryHref(tenantRoot, "daily-goods") },
      { label: "タイムセール", href: buildShopCategoryHref(tenantRoot, "sale") },
      { label: "売れ筋ランキング", href: buildShopCategoryHref(tenantRoot, "ranking") },
    ],
  };

  const purchaseSupport: ShopStorefrontContextLinkSection = {
    title: "購入前に確認",
    summary: "送料、返品、問い合わせ、取引条件を購入前に確認できるようにします。",
    links: [
      { label: "カート", href: `${tenantRoot}/cart` },
      { label: "チェックアウト", href: `${tenantRoot}/checkout` },
      { label: "配送について", href: `${tenantRoot}/shipping` },
      { label: "返品について", href: `${tenantRoot}/returns` },
      { label: "特定商取引法", href: `${tenantRoot}/legal` },
      { label: "問い合わせ", href: `${tenantRoot}/contact` },
    ],
  };

  const accountSupport: ShopStorefrontContextLinkSection = {
    title: "購入後サポート",
    summary: "注文履歴、マイページ、定期購入、お気に入りへ迷わず戻れるようにします。",
    links: [
      { label: "マイページ", href: `${tenantRoot}/mypage` },
      { label: "注文履歴", href: `${tenantRoot}/orders` },
      { label: "お気に入り", href: `${tenantRoot}/favorites` },
      { label: "定期購入", href: `${tenantRoot}/mypage/subscriptions` },
      { label: "ログイン", href: `${tenantRoot}/login` },
      { label: "会員登録", href: `${tenantRoot}/register` },
    ],
  };

  const pageSpecific: Record<string, ShopStorefrontContextLinkSection> = {
    products: {
      title: "商品一覧から次に見る",
      summary: "カテゴリ、セール、ランキングに分岐して、商品発見URLを薄い一覧で終わらせません。",
      links: [
        { label: "カテゴリ一覧", href: `${tenantRoot}/categories` },
        { label: "コーヒー・お茶", href: buildShopCategoryHref(tenantRoot, "coffee-tea") },
        { label: "キッチン用品", href: buildShopCategoryHref(tenantRoot, "kitchen") },
        { label: "ギフト", href: buildShopCategoryHref(tenantRoot, "gift") },
      ],
    },
    categories: {
      title: "カテゴリから売り場へ",
      summary: "カテゴリ一覧は各カテゴリURLへ直接リンクし、検索エンジンにも階層を伝えます。",
      links: [
        { label: "食品・飲料", href: buildShopCategoryHref(tenantRoot, "food-drink") },
        { label: "コーヒー・お茶", href: buildShopCategoryHref(tenantRoot, "coffee-tea") },
        { label: "日用品", href: buildShopCategoryHref(tenantRoot, "daily-goods") },
        { label: "ペット用品", href: buildShopCategoryHref(tenantRoot, "pet") },
      ],
    },
    product: {
      title: "商品詳細で確認する",
      summary: "購入判断に必要な比較、返品、配送、問い合わせ導線を商品詳細から離脱させずに提示します。",
      links: [
        { label: "同じカテゴリを見る", href: `${tenantRoot}/products` },
        { label: "カートを見る", href: `${tenantRoot}/cart` },
        { label: "配送条件", href: `${tenantRoot}/shipping` },
        { label: "返品条件", href: `${tenantRoot}/returns` },
      ],
    },
    cart: {
      title: "カートから次に進む",
      summary: "注文前に商品追加、配送、返品、決済未接続状態を確認できます。",
      links: [
        { label: "商品を追加", href: `${tenantRoot}/products` },
        { label: "チェックアウト", href: `${tenantRoot}/checkout` },
        { label: "配送について", href: `${tenantRoot}/shipping` },
        { label: "返品について", href: `${tenantRoot}/returns` },
      ],
    },
    checkout: {
      title: "注文前の確認",
      summary: "決済未接続時は成功したふりをせず、取引条件と問い合わせ先へ誘導します。",
      links: [
        { label: "カートへ戻る", href: `${tenantRoot}/cart` },
        { label: "特定商取引法", href: `${tenantRoot}/legal` },
        { label: "配送について", href: `${tenantRoot}/shipping` },
        { label: "問い合わせ", href: `${tenantRoot}/contact` },
      ],
    },
    faq: {
      title: "FAQから確認する",
      summary: "よくある質問から配送、返品、問い合わせ、商品一覧へ直接戻れます。",
      links: [
        { label: "配送について", href: `${tenantRoot}/shipping` },
        { label: "返品について", href: `${tenantRoot}/returns` },
        { label: "問い合わせ", href: `${tenantRoot}/contact` },
        { label: "商品一覧", href: `${tenantRoot}/products` },
      ],
    },
  };

  const sections = [pageSpecific[page], productDiscovery, purchaseSupport, accountSupport].filter(Boolean) as ShopStorefrontContextLinkSection[];
  return sections.filter((section, index, array) => array.findIndex((item) => item.title === section.title) === index);
}

export function buildShopPageBuyingGuide(page: string, tenantRoot: string): ShopStorefrontBuyingGuideItem[] {
  const defaultItems: ShopStorefrontBuyingGuideItem[] = [
    {
      question: "購入前に価格・税込・送料をどこで確認できますか。",
      answer: "商品カードと商品詳細は税込表示で揃え、送料と配送目安は配送ページへ集約しています。",
      href: `${tenantRoot}/shipping`,
      label: "送料と配送を見る",
    },
    {
      question: "返品やキャンセル条件は注文前に確認できますか。",
      answer: "返品条件、未開封品、初期不良、問い合わせ期限を共通テンプレートで確認できます。",
      href: `${tenantRoot}/returns`,
      label: "返品条件を見る",
    },
    {
      question: "決済や定期購入が未接続の場合はどう表示されますか。",
      answer: "成功したふりをせず、決済未接続や定期購入DB未適用を画面上で明示します。",
      href: `${tenantRoot}/checkout`,
      label: "注文前に確認",
    },
    {
      question: "迷ったときはどのページへ進めばよいですか。",
      answer: "商品一覧、カテゴリ、FAQ、問い合わせへ戻れる内部リンクを全ページに配置しています。",
      href: `${tenantRoot}/faq`,
      label: "FAQを見る",
    },
  ];

  const pageItems: Record<string, ShopStorefrontBuyingGuideItem[]> = {
    "": [
      {
        question: "TOPページから最短で商品を探すには。",
        answer: "ヒーロー直下のおすすめ商品、ランキング、タイムセール、カテゴリから商品詳細へ直接進めます。",
        href: `${tenantRoot}/products`,
        label: "商品一覧へ",
      },
      {
        question: "カテゴリ別に比較できますか。",
        answer: "カテゴリURLは安定した検索向けURLとして用意し、食品、日用品、キッチン、ギフトなどへ分岐できます。",
        href: `${tenantRoot}/categories`,
        label: "カテゴリを見る",
      },
    ],
    products: [
      {
        question: "商品一覧はSEOに強いカテゴリURLで見られますか。",
        answer: "カテゴリ選択時は安定した `category` URLで表示し、任意検索語ページとはcanonicalとrobotsを分けます。",
        href: `${tenantRoot}/categories`,
        label: "カテゴリ一覧へ",
      },
      {
        question: "価格・レビュー・在庫を同じ形式で比較できますか。",
        answer: "共有商品カードで画像、商品名、評価、税込価格、CTA、カテゴリリンクを同じ位置に揃えています。",
        href: `${tenantRoot}/products`,
        label: "商品を比較",
      },
    ],
    categories: [
      {
        question: "カテゴリは検索エンジンにも分かる構造ですか。",
        answer: "カテゴリ名、画像、商品件数、カテゴリ別商品URLを同じカードで並べ、内部リンクを明確にしています。",
        href: `${tenantRoot}/products`,
        label: "商品一覧へ",
      },
      {
        question: "売れ筋やセールカテゴリへ直接進めますか。",
        answer: "ランキング、セール、食品、日用品、ギフトなどのカテゴリURLをクロール可能なリンクで提供します。",
        href: buildShopCategoryHref(tenantRoot, "ranking"),
        label: "ランキングを見る",
      },
    ],
    product: [
      {
        question: "商品詳細で購入判断に必要な情報は揃っていますか。",
        answer: "商品名、画像、税込価格、レビュー、在庫、配送、返品、定期購入状態を購入ボックス周辺に集約します。",
        href: `${tenantRoot}/cart`,
        label: "カートを見る",
      },
      {
        question: "商品名の重複やSEO上の薄い見出しはありませんか。",
        answer: "商品詳細は可視H1を1つに絞り、パンくずと構造化データで階層を補強します。",
        href: `${tenantRoot}/products`,
        label: "関連商品を探す",
      },
    ],
    cart: [
      {
        question: "カートで通常購入と定期購入を区別できますか。",
        answer: "定期購入商品は頻度や次回配送の説明を分け、未接続時は申込み確定しない表示にします。",
        href: `${tenantRoot}/mypage/subscriptions`,
        label: "定期購入を見る",
      },
      {
        question: "注文前に商品追加や返品条件へ戻れますか。",
        answer: "カートから商品一覧、配送、返品、チェックアウトへ進めるリンクを用意しています。",
        href: `${tenantRoot}/products`,
        label: "商品を追加",
      },
    ],
    checkout: [
      {
        question: "決済未接続でも注文完了のように見えませんか。",
        answer: "決済未接続時は明確に停止し、特定商取引法、配送、問い合わせへ誘導します。",
        href: `${tenantRoot}/legal`,
        label: "販売条件を見る",
      },
      {
        question: "配送先や支払い情報は保存されますか。",
        answer: "本番認証と決済接続前は個人情報を保存せず、入力導線は状態表示として扱います。",
        href: `${tenantRoot}/privacy`,
        label: "個人情報の扱い",
      },
    ],
    contact: [
      {
        question: "問い合わせ前に何を確認すればよいですか。",
        answer: "配送状況、返品条件、FAQを確認し、必要なら注文番号と商品名を添えて問い合わせます。",
        href: `${tenantRoot}/faq`,
        label: "FAQを見る",
      },
      {
        question: "フォームは未接続なのに送信完了扱いになりませんか。",
        answer: "通知未接続時は成功したふりをせず、入力確認と未接続状態を明示します。",
        href: `${tenantRoot}/contact`,
        label: "問い合わせを確認",
      },
    ],
    legal: [
      {
        question: "販売者情報と取引条件は注文前に確認できますか。",
        answer: "販売者、問い合わせ先、支払い、配送、返品条件を共通テンプレートで整理します。",
        href: `${tenantRoot}/shipping`,
        label: "配送条件を見る",
      },
      {
        question: "未設定項目がある場合はどう扱いますか。",
        answer: "空欄で隠さず、管理画面の設定反映が必要であることを明示します。",
        href: `${tenantRoot}/contact`,
        label: "確認する",
      },
    ],
    privacy: [
      {
        question: "個人情報の扱いはどこで確認できますか。",
        answer: "注文、問い合わせ、アカウント、定期購入で扱う情報の方針をこのページに集約します。",
        href: `${tenantRoot}/contact`,
        label: "問い合わせる",
      },
      {
        question: "ログインや決済未接続時のデータ保存はどうなりますか。",
        answer: "未接続機能は保存済みのように見せず、利用可能範囲を画面に明記します。",
        href: `${tenantRoot}/mypage`,
        label: "マイページを見る",
      },
    ],
    shipping: [
      {
        question: "配送予定と送料を商品購入前に確認できますか。",
        answer: "通常2〜4営業日の目安、送料、追跡条件をまとめ、商品詳細とカートからリンクします。",
        href: `${tenantRoot}/products`,
        label: "商品を選ぶ",
      },
      {
        question: "返品条件と一緒に確認できますか。",
        answer: "配送と返品は相互リンクし、購入前の不安を同じ流れで解消します。",
        href: `${tenantRoot}/returns`,
        label: "返品条件を見る",
      },
    ],
    returns: [
      {
        question: "返品できる条件は分かりやすく整理されていますか。",
        answer: "未開封、初期不良、到着後7日以内の問い合わせなど、判断基準を明確にします。",
        href: `${tenantRoot}/contact`,
        label: "問い合わせる",
      },
      {
        question: "返品前に注文や配送を確認できますか。",
        answer: "注文履歴、配送条件、問い合わせへ戻れる導線を用意しています。",
        href: `${tenantRoot}/orders`,
        label: "注文履歴へ",
      },
    ],
    faq: [
      {
        question: "FAQから商品購入へ戻れますか。",
        answer: "配送、返品、定期購入、決済状態を確認したあと商品一覧やカテゴリへ戻れます。",
        href: `${tenantRoot}/products`,
        label: "商品一覧へ",
      },
      {
        question: "FAQの内容は実装状態と一致していますか。",
        answer: "決済未接続や定期購入準備中など、未完了を実装済みのように書かない方針です。",
        href: `${tenantRoot}/checkout`,
        label: "注文前に確認",
      },
    ],
    mypage: [
      {
        question: "マイページで注文や定期購入を確認できますか。",
        answer: "注文履歴、定期購入、お気に入り、問い合わせ入口をまとめ、未接続機能は準備中として表示します。",
        href: `${tenantRoot}/orders`,
        label: "注文履歴へ",
      },
      {
        question: "ログイン基盤未接続でも誤解しませんか。",
        answer: "保存済みアカウントのように見せず、ログイン機能の状態と利用可能な導線を明記します。",
        href: `${tenantRoot}/login`,
        label: "ログインを見る",
      },
    ],
    account: [
      {
        question: "アカウント機能の入口は整理されていますか。",
        answer: "注文履歴、お気に入り、定期購入、問い合わせへ同じ導線で移動できます。",
        href: `${tenantRoot}/mypage`,
        label: "マイページへ",
      },
      {
        question: "会員登録前に購入条件を確認できますか。",
        answer: "配送、返品、特商法、プライバシーをアカウント導線から確認できます。",
        href: `${tenantRoot}/legal`,
        label: "取引条件を見る",
      },
    ],
    orders: [
      {
        question: "注文がない状態でも次の行動が分かりますか。",
        answer: "空状態には商品一覧、問い合わせ、配送・返品への導線を出し、何もないページで終わらせません。",
        href: `${tenantRoot}/products`,
        label: "商品を見る",
      },
      {
        question: "注文後の問い合わせ導線はありますか。",
        answer: "注文番号を添えて問い合わせできる導線を注文履歴から確認できます。",
        href: `${tenantRoot}/contact`,
        label: "問い合わせる",
      },
    ],
    favorites: [
      {
        question: "お気に入りから商品比較に戻れますか。",
        answer: "候補商品、商品詳細、カテゴリ、カートへ移動できるリンクを維持します。",
        href: `${tenantRoot}/products`,
        label: "商品一覧へ",
      },
      {
        question: "保存機能が未接続でも分かりますか。",
        answer: "ログイン保存が有効化されるまで、人気商品候補として表示することを明記します。",
        href: `${tenantRoot}/login`,
        label: "ログインを見る",
      },
    ],
    login: [
      {
        question: "ログイン未接続でも利用者に誤解を与えませんか。",
        answer: "本番認証接続前は入力を保存せず、注文履歴やお気に入りの確認導線を表示します。",
        href: `${tenantRoot}/mypage`,
        label: "マイページへ",
      },
      {
        question: "会員登録や注文履歴へ移動できますか。",
        answer: "ログイン、会員登録、注文履歴、問い合わせを相互リンクでつなげます。",
        href: `${tenantRoot}/register`,
        label: "会員登録へ",
      },
    ],
    register: [
      {
        question: "会員登録前に個人情報の扱いを確認できますか。",
        answer: "プライバシーポリシー、問い合わせ、ログイン導線を近くに置きます。",
        href: `${tenantRoot}/privacy`,
        label: "プライバシーを見る",
      },
      {
        question: "登録機能が未接続でも購入導線は残りますか。",
        answer: "商品一覧、カート、問い合わせへ戻れる導線を残し、認証未接続を明示します。",
        href: `${tenantRoot}/products`,
        label: "商品を見る",
      },
    ],
    "mypage/subscriptions": [
      {
        question: "定期購入の状態は正直に表示されていますか。",
        answer: "D1 migration未適用時は契約作成や表示を行わず、準備中として明示します。",
        href: `${tenantRoot}/checkout`,
        label: "注文前に確認",
      },
      {
        question: "スキップ・一時停止・解約条件は確認できますか。",
        answer: "本番接続後に操作できる項目を説明し、問い合わせと商品一覧へ戻れるようにします。",
        href: `${tenantRoot}/contact`,
        label: "問い合わせる",
      },
    ],
  };

  const merged = [...(pageItems[page] ?? []), ...defaultItems];
  return merged.filter((item, index, array) => array.findIndex((candidate) => candidate.question === item.question) === index).slice(0, 6);
}

export function buildShopPageQualitySummary(page: string, tenantRoot: string): ShopStorefrontPageQualitySummary {
  const sharedSignals: ShopStorefrontPageQualitySignal[] = [
    {
      title: "価格・配送・返品",
      body: "税込価格、配送目安、返品条件を購入前に確認できる導線を固定します。",
      href: `${tenantRoot}/shipping`,
      label: "配送条件",
      badge: "購入前",
    },
    {
      title: "サポート導線",
      body: "FAQ、問い合わせ、注文履歴へ戻れるクロール可能な内部リンクを維持します。",
      href: `${tenantRoot}/faq`,
      label: "FAQ",
      badge: "支援",
    },
  ];

  const summaries: Record<string, Omit<ShopStorefrontPageQualitySummary, "signals"> & { signals: ShopStorefrontPageQualitySignal[] }> = {
    "": {
      pageLabel: "TOPページ",
      intent: "おすすめ、ランキング、タイムセール、カテゴリから商品発見を始める入口です。",
      seoRole: "ストア全体の主要カテゴリと購入サポートへリンクするハブページとして扱います。",
      userAction: "ヒーロー、商品カード、カテゴリ、フッターから商品詳細や購入条件へ移動します。",
      signals: [
        { title: "商品発見", body: "おすすめ商品、ランキング、タイムセールを商品詳細へ直結します。", href: `${tenantRoot}/products`, label: "商品一覧", badge: "発見" },
        { title: "カテゴリ導線", body: "カテゴリURLを安定化し、食品・日用品・ギフトなどへ分岐します。", href: `${tenantRoot}/categories`, label: "カテゴリ", badge: "SEO" },
      ],
    },
    products: {
      pageLabel: "商品一覧",
      intent: "価格、画像、レビュー、カテゴリ、カート導線を同じカード密度で比較するページです。",
      seoRole: "安定カテゴリURLはindex可能、任意検索URLはnoindexとして重複を抑えます。",
      userAction: "商品カード、カテゴリリンク、検索フォームから商品詳細へ進みます。",
      signals: [
        { title: "商品カード共通化", body: "Product/Offer microdata、画像alt、価格、CTA位置を共通化します。", href: `${tenantRoot}/products`, label: "比較する", badge: "商品" },
        { title: "カテゴリURL", body: "カテゴリごとのcanonical、robots、ItemListを分けて扱います。", href: `${tenantRoot}/categories`, label: "カテゴリ", badge: "URL" },
      ],
    },
    categories: {
      pageLabel: "カテゴリ一覧",
      intent: "カテゴリ画像と商品件数から売り場を選ぶページです。",
      seoRole: "メニュー、カテゴリカード、商品一覧をリンクでつなぎ、Googleが階層を理解できる構造にします。",
      userAction: "カテゴリカードから安定カテゴリURLへ移動します。",
      signals: [
        { title: "階層導線", body: "カテゴリから商品一覧へ、商品一覧から商品詳細へ進むリンク階層を固定します。", href: `${tenantRoot}/products`, label: "商品一覧", badge: "階層" },
        { title: "人気カテゴリ", body: "ランキング、セール、ギフトなどの比較導線を同じモデルで生成します。", href: buildShopCategoryHref(tenantRoot, "ranking"), label: "ランキング", badge: "発見" },
      ],
    },
    product: {
      pageLabel: "商品詳細",
      intent: "1商品に集中し、画像、価格、在庫、配送、返品、購入ボックスで購入判断するページです。",
      seoRole: "Product/Offer、BreadcrumbList、MerchantReturnPolicyを同じ商品文脈で接続します。",
      userAction: "画像、説明、仕様、購入ボックス、関連商品を確認してカートへ進みます。",
      signals: [
        { title: "単一H1", body: "商品名は可視H1を1つに維持し、画像上の二重タイトルは出しません。", href: `${tenantRoot}/products`, label: "関連商品", badge: "H1" },
        { title: "購入条件", body: "税込価格、在庫、配送予定、返品条件、定期購入状態を購入前に表示します。", href: `${tenantRoot}/cart`, label: "カート", badge: "購入" },
      ],
    },
    cart: {
      pageLabel: "カート",
      intent: "通常購入と定期購入を区別し、数量、小計、配送、返品を確認するページです。",
      seoRole: "購入直前ページはnoindex対象でも、内部導線と取引条件を明確にします。",
      userAction: "数量変更、削除、商品追加、チェックアウト、配送返品確認へ進みます。",
      signals: [
        { title: "注文前確認", body: "小計、送料見込み、定期購入頻度を分けて表示します。", href: `${tenantRoot}/checkout`, label: "チェックアウト", badge: "確認" },
        { title: "商品追加", body: "空カートでも商品一覧へ戻れる導線を残します。", href: `${tenantRoot}/products`, label: "商品を追加", badge: "回遊" },
      ],
    },
    checkout: {
      pageLabel: "チェックアウト",
      intent: "顧客情報、配送先、支払い状態、定期購入規約を確認するページです。",
      seoRole: "決済未接続時に注文完了風UIを出さず、販売条件へリンクします。",
      userAction: "決済設定状態を確認し、必要ならカートや問い合わせへ戻ります。",
      signals: [
        { title: "決済状態", body: "未接続時は注文確定を停止し、成功したふりをしません。", href: `${tenantRoot}/legal`, label: "販売条件", badge: "正直" },
        { title: "個人情報", body: "配送先や支払い情報の保存条件をプライバシー導線で確認します。", href: `${tenantRoot}/privacy`, label: "個人情報", badge: "保護" },
      ],
    },
    contact: {
      pageLabel: "問い合わせ",
      intent: "注文番号、商品名、確認内容を整理してストアへ連絡するページです。",
      seoRole: "問い合わせ前にFAQ、配送、返品へ戻れるサポート導線を示します。",
      userAction: "FAQ確認後、必要事項を入力して送信状態を確認します。",
      signals: [
        { title: "FAQ先行", body: "配送・返品・決済未接続状態をFAQで確認してから問い合わせます。", href: `${tenantRoot}/faq`, label: "FAQ", badge: "確認" },
        { title: "注文番号", body: "注文後の確認は注文履歴と問い合わせをつなげます。", href: `${tenantRoot}/orders`, label: "注文履歴", badge: "注文" },
      ],
    },
    legal: {
      pageLabel: "特定商取引法",
      intent: "販売者、支払い、配送、返品、問い合わせ先を注文前に確認するページです。",
      seoRole: "取引条件を共通テンプレート化し、空欄や未設定を隠さない方針を示します。",
      userAction: "販売条件を確認し、配送・返品・問い合わせへ移動します。",
      signals: [
        { title: "販売者情報", body: "販売者名、連絡先、取引条件を同じレイアウトで表示します。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "取引" },
        { title: "配送返品", body: "配送条件と返品条件を相互リンクで確認します。", href: `${tenantRoot}/returns`, label: "返品条件", badge: "条件" },
      ],
    },
    privacy: {
      pageLabel: "プライバシーポリシー",
      intent: "注文、問い合わせ、アカウント、定期購入で扱う情報を確認するページです。",
      seoRole: "個人情報の扱いを購入導線と問い合わせ導線から到達可能にします。",
      userAction: "個人情報の扱いを確認し、必要なら問い合わせやマイページへ進みます。",
      signals: [
        { title: "個人情報", body: "注文、問い合わせ、ログインで扱う項目を明確にします。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "保護" },
        { title: "アカウント", body: "ログイン未接続時も保存済みのように見せません。", href: `${tenantRoot}/mypage`, label: "マイページ", badge: "状態" },
      ],
    },
    shipping: {
      pageLabel: "配送について",
      intent: "送料、配送目安、追跡、発送条件を注文前に確認するページです。",
      seoRole: "商品詳細、カート、チェックアウトから配送条件へリンクし、購入不安を減らします。",
      userAction: "配送条件を確認して商品一覧、返品条件、カートへ進みます。",
      signals: [
        { title: "配送目安", body: "通常2〜4営業日、送料、追跡条件を共通文脈で確認します。", href: `${tenantRoot}/products`, label: "商品を見る", badge: "配送" },
        { title: "返品連携", body: "配送と返品を相互リンクして購入前確認を完結させます。", href: `${tenantRoot}/returns`, label: "返品条件", badge: "連携" },
      ],
    },
    returns: {
      pageLabel: "返品について",
      intent: "返品条件、初期不良、問い合わせ期限、キャンセル条件を確認するページです。",
      seoRole: "返品条件を商品詳細、カート、チェックアウト、特商法から到達可能にします。",
      userAction: "返品可否を確認し、注文履歴や問い合わせへ進みます。",
      signals: [
        { title: "返品条件", body: "未開封、初期不良、到着後7日以内などを分かりやすく整理します。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "返品" },
        { title: "注文確認", body: "返品前に注文履歴と配送状態へ戻れる導線を用意します。", href: `${tenantRoot}/orders`, label: "注文履歴", badge: "注文" },
      ],
    },
    faq: {
      pageLabel: "FAQ",
      intent: "配送、返品、決済、定期購入、問い合わせ前確認をまとめるページです。",
      seoRole: "FAQPage構造化データはこのページだけに限定し、他ページで濫用しません。",
      userAction: "質問から商品一覧、配送、返品、問い合わせへ戻ります。",
      signals: [
        { title: "FAQ構造", body: "Question/acceptedAnswerはFAQページの実本文と一致させます。", href: `${tenantRoot}/products`, label: "商品一覧", badge: "FAQ" },
        { title: "サポート", body: "解決しない場合は問い合わせへ移動します。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "支援" },
      ],
    },
    mypage: {
      pageLabel: "マイページ",
      intent: "注文、配送、返品、定期購入、お気に入りを確認する購入後ページです。",
      seoRole: "購入者向けページはnoindex対象でも、サポート導線を明確にします。",
      userAction: "注文履歴、定期購入、お気に入り、問い合わせへ移動します。",
      signals: [
        { title: "注文管理", body: "注文履歴、配送、返品、問い合わせをまとめます。", href: `${tenantRoot}/orders`, label: "注文履歴", badge: "注文" },
        { title: "定期購入", body: "D1/決済未接続時は準備中として正直に表示します。", href: `${tenantRoot}/mypage/subscriptions`, label: "定期購入", badge: "状態" },
      ],
    },
    account: {
      pageLabel: "アカウント",
      intent: "購入者アカウントの入口を整理するページです。",
      seoRole: "ログイン、会員登録、注文履歴、定期購入へ迷わず移動できる構造にします。",
      userAction: "ログイン、注文履歴、お気に入り、問い合わせへ移動します。",
      signals: [
        { title: "ログイン導線", body: "本番認証未接続時は入力保存を行わず状態を明記します。", href: `${tenantRoot}/login`, label: "ログイン", badge: "認証" },
        { title: "購入後導線", body: "注文履歴と問い合わせへ戻れる導線を固定します。", href: `${tenantRoot}/orders`, label: "注文履歴", badge: "購入後" },
      ],
    },
    orders: {
      pageLabel: "注文履歴",
      intent: "注文番号、配送状況、領収書、問い合わせを確認するページです。",
      seoRole: "注文履歴はnoindexでも、商品一覧とサポートへ戻れる導線を持ちます。",
      userAction: "商品一覧、問い合わせ、配送、返品へ進みます。",
      signals: [
        { title: "空状態", body: "注文がない場合でも商品一覧と問い合わせへ進めます。", href: `${tenantRoot}/products`, label: "商品を見る", badge: "空状態" },
        { title: "問い合わせ", body: "注文番号を添えて問い合わせできる導線を近くに置きます。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "支援" },
      ],
    },
    favorites: {
      pageLabel: "お気に入り",
      intent: "保存候補、比較候補、商品詳細への戻り先をまとめるページです。",
      seoRole: "保存機能未接続時も、商品カードとカテゴリ導線で薄い空ページにしません。",
      userAction: "候補商品から商品詳細やカートへ進みます。",
      signals: [
        { title: "商品比較", body: "お気に入り候補の商品カードで価格、画像、CTAを揃えます。", href: `${tenantRoot}/products`, label: "商品一覧", badge: "比較" },
        { title: "ログイン", body: "保存機能の本番接続状態をログイン導線で確認します。", href: `${tenantRoot}/login`, label: "ログイン", badge: "保存" },
      ],
    },
    login: {
      pageLabel: "ログイン",
      intent: "注文履歴、定期購入、お気に入りへ進む入口です。",
      seoRole: "認証未接続時は入力保存を避け、利用可能状態を明示します。",
      userAction: "会員登録、マイページ、問い合わせへ移動します。",
      signals: [
        { title: "認証状態", body: "本番認証接続前はログイン成功扱いにしません。", href: `${tenantRoot}/register`, label: "会員登録", badge: "認証" },
        { title: "購入確認", body: "注文履歴や問い合わせへ戻れる導線を維持します。", href: `${tenantRoot}/orders`, label: "注文履歴", badge: "注文" },
      ],
    },
    register: {
      pageLabel: "会員登録",
      intent: "購入者登録の入口と個人情報確認をまとめるページです。",
      seoRole: "認証未接続時に登録完了風UIを出さず、プライバシーへリンクします。",
      userAction: "プライバシー、ログイン、商品一覧へ移動します。",
      signals: [
        { title: "個人情報", body: "登録前に個人情報の扱いを確認できます。", href: `${tenantRoot}/privacy`, label: "プライバシー", badge: "保護" },
        { title: "商品へ戻る", body: "登録せずに商品一覧やカートへ戻れます。", href: `${tenantRoot}/products`, label: "商品一覧", badge: "回遊" },
      ],
    },
    "mypage/subscriptions": {
      pageLabel: "定期購入",
      intent: "契約、次回配送、一時停止、再開、スキップ、解約の状態を確認するページです。",
      seoRole: "定期購入レーンが未合格の間は準備中を明示し、成功したふりをしません。",
      userAction: "チェックアウト、問い合わせ、商品一覧へ戻ります。",
      signals: [
        { title: "Schema pending", body: "D1 migration未適用時は契約表示や作成を行いません。", href: `${tenantRoot}/checkout`, label: "注文前確認", badge: "未完了" },
        { title: "解約条件", body: "本番接続後に停止、再開、スキップ、解約導線を検証します。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "契約" },
      ],
    },
  };

  const selected = summaries[page] ?? summaries[""];
  return {
    ...selected,
    signals: [...selected.signals, ...sharedSignals]
      .filter((item, index, array) => array.findIndex((candidate) => candidate.title === item.title) === index)
      .slice(0, 4),
  };
}

export function buildShopPageHeaderActions(page: string, tenantRoot: string): ShopStorefrontPageHeaderAction[] {
  const defaultActions: ShopStorefrontPageHeaderAction[] = [
    { label: "商品一覧を見る", href: `${tenantRoot}/products`, tone: "primary" },
    { label: "配送・返品を確認", href: `${tenantRoot}/shipping`, tone: "secondary" },
    { label: "問い合わせ", href: `${tenantRoot}/contact`, tone: "secondary" },
  ];

  const actionMap: Record<string, ShopStorefrontPageHeaderAction[]> = {
    products: [
      { label: "カテゴリから探す", href: `${tenantRoot}/categories`, tone: "primary" },
      { label: "カートを見る", href: `${tenantRoot}/cart`, tone: "secondary" },
      { label: "配送条件", href: `${tenantRoot}/shipping`, tone: "secondary" },
    ],
    categories: [
      { label: "商品一覧へ", href: `${tenantRoot}/products`, tone: "primary" },
      { label: "タイムセールを見る", href: buildShopCategoryHref(tenantRoot, "sale"), tone: "secondary" },
      { label: "購入前ガイド", href: `${tenantRoot}/faq`, tone: "secondary" },
    ],
    cart: [
      { label: "商品を追加する", href: `${tenantRoot}/products`, tone: "primary" },
      { label: "チェックアウトへ", href: `${tenantRoot}/checkout`, tone: "secondary" },
      { label: "返品条件", href: `${tenantRoot}/returns`, tone: "secondary" },
    ],
    checkout: [
      { label: "カートへ戻る", href: `${tenantRoot}/cart`, tone: "primary" },
      { label: "配送条件", href: `${tenantRoot}/shipping`, tone: "secondary" },
      { label: "特商法を確認", href: `${tenantRoot}/legal`, tone: "secondary" },
    ],
    contact: [
      { label: "よくある質問", href: `${tenantRoot}/faq`, tone: "primary" },
      { label: "配送について", href: `${tenantRoot}/shipping`, tone: "secondary" },
      { label: "返品について", href: `${tenantRoot}/returns`, tone: "secondary" },
    ],
    legal: [
      { label: "配送条件", href: `${tenantRoot}/shipping`, tone: "primary" },
      { label: "返品条件", href: `${tenantRoot}/returns`, tone: "secondary" },
      { label: "問い合わせ", href: `${tenantRoot}/contact`, tone: "secondary" },
    ],
    privacy: [
      { label: "問い合わせ", href: `${tenantRoot}/contact`, tone: "primary" },
      { label: "特商法", href: `${tenantRoot}/legal`, tone: "secondary" },
      { label: "FAQ", href: `${tenantRoot}/faq`, tone: "secondary" },
    ],
    shipping: [
      { label: "返品条件", href: `${tenantRoot}/returns`, tone: "primary" },
      { label: "商品一覧", href: `${tenantRoot}/products`, tone: "secondary" },
      { label: "問い合わせ", href: `${tenantRoot}/contact`, tone: "secondary" },
    ],
    returns: [
      { label: "配送条件", href: `${tenantRoot}/shipping`, tone: "primary" },
      { label: "問い合わせ", href: `${tenantRoot}/contact`, tone: "secondary" },
      { label: "特商法", href: `${tenantRoot}/legal`, tone: "secondary" },
    ],
    faq: [
      { label: "問い合わせ", href: `${tenantRoot}/contact`, tone: "primary" },
      { label: "商品一覧", href: `${tenantRoot}/products`, tone: "secondary" },
      { label: "配送・返品", href: `${tenantRoot}/shipping`, tone: "secondary" },
    ],
    mypage: [
      { label: "注文履歴", href: `${tenantRoot}/orders`, tone: "primary" },
      { label: "お気に入り", href: `${tenantRoot}/favorites`, tone: "secondary" },
      { label: "定期購入", href: `${tenantRoot}/mypage/subscriptions`, tone: "secondary" },
    ],
    account: [
      { label: "注文履歴", href: `${tenantRoot}/orders`, tone: "primary" },
      { label: "お気に入り", href: `${tenantRoot}/favorites`, tone: "secondary" },
      { label: "定期購入", href: `${tenantRoot}/mypage/subscriptions`, tone: "secondary" },
    ],
    orders: [
      { label: "マイページ", href: `${tenantRoot}/mypage`, tone: "primary" },
      { label: "問い合わせ", href: `${tenantRoot}/contact`, tone: "secondary" },
      { label: "商品一覧", href: `${tenantRoot}/products`, tone: "secondary" },
    ],
    favorites: [
      { label: "商品一覧", href: `${tenantRoot}/products`, tone: "primary" },
      { label: "カート", href: `${tenantRoot}/cart`, tone: "secondary" },
      { label: "カテゴリ", href: `${tenantRoot}/categories`, tone: "secondary" },
    ],
    login: [
      { label: "会員登録", href: `${tenantRoot}/register`, tone: "primary" },
      { label: "注文履歴", href: `${tenantRoot}/orders`, tone: "secondary" },
      { label: "問い合わせ", href: `${tenantRoot}/contact`, tone: "secondary" },
    ],
    register: [
      { label: "ログイン", href: `${tenantRoot}/login`, tone: "primary" },
      { label: "商品一覧", href: `${tenantRoot}/products`, tone: "secondary" },
      { label: "プライバシー", href: `${tenantRoot}/privacy`, tone: "secondary" },
    ],
    "mypage/subscriptions": [
      { label: "マイページ", href: `${tenantRoot}/mypage`, tone: "primary" },
      { label: "商品一覧", href: `${tenantRoot}/products`, tone: "secondary" },
      { label: "問い合わせ", href: `${tenantRoot}/contact`, tone: "secondary" },
    ],
  };

  return actionMap[page] ?? defaultActions;
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
