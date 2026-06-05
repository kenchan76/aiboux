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

export type ShopStorefrontActionMapStep = {
  title: string;
  body: string;
  href: string;
  label: string;
  badge: string;
};

export type ShopStorefrontActionMap = {
  title: string;
  summary: string;
  steps: ShopStorefrontActionMapStep[];
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

export type ShopStorefrontTrustMatrixSignal = {
  title: string;
  body: string;
  href: string;
  label: string;
  badge: string;
  proof: string;
};

export type ShopStorefrontTrustMatrix = {
  title: string;
  summary: string;
  pageContext: string;
  signals: ShopStorefrontTrustMatrixSignal[];
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

export function buildShopFooterSeoSitemapLinks(tenantRoot: string): ShopStorefrontLink[] {
  return [
    { label: "TOPページ", href: `${tenantRoot}/` },
    { label: "商品一覧", href: `${tenantRoot}/products` },
    { label: "カテゴリ一覧", href: `${tenantRoot}/categories` },
    { label: "食品・飲料", href: buildShopCategoryHref(tenantRoot, "food-drink") },
    { label: "コーヒー・お茶", href: buildShopCategoryHref(tenantRoot, "coffee-tea") },
    { label: "キッチン用品", href: buildShopCategoryHref(tenantRoot, "kitchen") },
    { label: "日用品", href: buildShopCategoryHref(tenantRoot, "daily-goods") },
    { label: "ギフト", href: buildShopCategoryHref(tenantRoot, "gift") },
    { label: "タイムセール", href: buildShopCategoryHref(tenantRoot, "sale") },
    { label: "売れ筋ランキング", href: buildShopCategoryHref(tenantRoot, "ranking") },
    { label: "カート", href: `${tenantRoot}/cart` },
    { label: "チェックアウト", href: `${tenantRoot}/checkout` },
    { label: "マイページ", href: `${tenantRoot}/mypage` },
    { label: "注文履歴", href: `${tenantRoot}/orders` },
    { label: "お気に入り", href: `${tenantRoot}/favorites` },
    { label: "定期購入", href: `${tenantRoot}/mypage/subscriptions` },
    { label: "問い合わせ", href: `${tenantRoot}/contact` },
    { label: "よくある質問", href: `${tenantRoot}/faq` },
    { label: "配送について", href: `${tenantRoot}/shipping` },
    { label: "返品について", href: `${tenantRoot}/returns` },
    { label: "特定商取引法", href: `${tenantRoot}/legal` },
    { label: "プライバシーポリシー", href: `${tenantRoot}/privacy` },
  ];
}

export function buildShopFooterAssurances(): ShopStorefrontInfoCard[] {
  return [
    { title: "税込価格", body: "商品価格は税込表示で統一します。" },
    { title: "配送・返品", body: "配送予定、返品条件、問い合わせ先を各ページから確認できます。" },
    { title: "決済状態", body: "オンライン決済準備中は注文確定表示を出さず、準備中として表示します。" },
    { title: "定期購入", body: "定期購入は受付開始まで準備中として表示します。" },
  ];
}

export function buildShopAccountCards(tenantRoot: string): ShopStorefrontInfoCard[] {
  return [
    { title: "注文履歴", body: "注文番号、配送状況、領収書、問い合わせを確認します。", href: `${tenantRoot}/orders` },
    { title: "お気に入り", body: "あとで購入したい商品を保存して比較できます。", href: `${tenantRoot}/favorites` },
    { title: "定期購入", body: "次回配送、スキップ、一時停止、解約条件を確認します。", href: `${tenantRoot}/mypage/subscriptions` },
    { title: "配送先", body: "配送先住所はオンライン決済の受付開始後に登録できるようになります。", href: `${tenantRoot}/checkout` },
    { title: "問い合わせ", body: "注文番号を添えてストアへ問い合わせできます。", href: `${tenantRoot}/contact` },
    { title: "返品・配送", body: "配送、返品、キャンセル条件を確認します。", href: `${tenantRoot}/returns` },
  ];
}

export function buildShopPolicySupportCards(tenantRoot: string): ShopStorefrontInfoCard[] {
  return [
    { title: "購入前チェック", body: "価格、税込表示、送料、返品条件、支払い方法の状態を確認してから注文へ進みます。", href: `${tenantRoot}/checkout` },
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
    ? "定期購入は受付開始まで申込み不可として表示します。申込み完了表示は出しません。"
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
      body: "定期購入は受付開始まで、準備中として表示します。",
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
      summary: "カテゴリ、セール、ランキングに分岐して、目的の商品を探しやすくします。",
      links: [
        { label: "カテゴリ一覧", href: `${tenantRoot}/categories` },
        { label: "コーヒー・お茶", href: buildShopCategoryHref(tenantRoot, "coffee-tea") },
        { label: "キッチン用品", href: buildShopCategoryHref(tenantRoot, "kitchen") },
        { label: "ギフト", href: buildShopCategoryHref(tenantRoot, "gift") },
      ],
    },
    categories: {
      title: "カテゴリから売り場へ",
      summary: "カテゴリ一覧から食品、日用品、ギフトなどの売り場へ直接進めます。",
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
      summary: "注文前に商品追加、配送、返品、オンライン決済準備中状態を確認できます。",
      links: [
        { label: "商品を追加", href: `${tenantRoot}/products` },
        { label: "チェックアウト", href: `${tenantRoot}/checkout` },
        { label: "配送について", href: `${tenantRoot}/shipping` },
        { label: "返品について", href: `${tenantRoot}/returns` },
      ],
    },
    checkout: {
      title: "注文前の確認",
      summary: "オンライン決済準備中は完了表示にせず、取引条件と問い合わせ先へ誘導します。",
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
      answer: "返品条件、未開封品、初期不良、問い合わせ期限をお買い物ガイドで確認できます。",
      href: `${tenantRoot}/returns`,
      label: "返品条件を見る",
    },
    {
      question: "決済や定期購入が準備中の場合はどう表示されますか。",
      answer: "完了表示にせず、オンライン決済準備中や定期購入受付前であることを画面上で明示します。",
      href: `${tenantRoot}/checkout`,
      label: "注文前に確認",
    },
    {
      question: "迷ったときはどのページへ進めばよいですか。",
      answer: "商品一覧、カテゴリ、FAQ、問い合わせへ戻れる案内リンクを全ページに配置しています。",
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
        question: "カテゴリ別に商品を見比べられますか。",
        answer: "カテゴリ選択時は同じ形式の商品カードで表示し、価格、レビュー、在庫、カート導線を見比べられます。",
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
        question: "カテゴリから商品を探しやすくなっていますか。",
        answer: "カテゴリ名、画像、商品件数を同じカードで並べ、カテゴリ別の商品一覧へ進めます。",
        href: `${tenantRoot}/products`,
        label: "商品一覧へ",
      },
      {
        question: "売れ筋やセールカテゴリへ直接進めますか。",
        answer: "ランキング、セール、食品、日用品、ギフトなどの売り場へ直接進めます。",
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
        question: "商品名や説明は重複せず読みやすいですか。",
        answer: "商品詳細は商品名、写真、価格、在庫、配送、返品条件を一つの購入判断画面にまとめます。",
        href: `${tenantRoot}/products`,
        label: "関連商品を探す",
      },
    ],
    cart: [
      {
        question: "カートで通常購入と定期購入を区別できますか。",
        answer: "定期購入商品は頻度や次回配送の説明を分け、準備中は申込み確定しない表示にします。",
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
        question: "オンライン決済準備中でも注文完了のように見えませんか。",
        answer: "オンライン決済準備中は明確に停止し、特定商取引法、配送、問い合わせへ誘導します。",
        href: `${tenantRoot}/legal`,
        label: "販売条件を見る",
      },
      {
        question: "配送先や支払い情報は保存されますか。",
        answer: "会員ログインと決済接続前は個人情報を保存せず、入力導線は状態表示として扱います。",
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
        question: "フォームは準備中なのに送信完了扱いになりませんか。",
        answer: "通知準備中は完了表示にせず、入力確認と準備中状態を明示します。",
        href: `${tenantRoot}/contact`,
        label: "問い合わせを確認",
      },
    ],
    legal: [
      {
        question: "販売者情報と取引条件は注文前に確認できますか。",
        answer: "販売者、問い合わせ先、支払い、配送、返品条件をお買い物ガイドで整理します。",
        href: `${tenantRoot}/shipping`,
        label: "配送条件を見る",
      },
      {
        question: "未設定項目がある場合はどう扱いますか。",
        answer: "空欄で隠さず、問い合わせ先と確認導線を表示します。",
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
        question: "ログインやオンライン決済準備中のデータ保存はどうなりますか。",
        answer: "準備中機能は保存済みのように見せず、利用可能範囲を画面に明記します。",
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
        question: "FAQの内容は受付状態と一致していますか。",
        answer: "オンライン決済準備中や定期購入準備中など、未完了を受付済みのように書かない方針です。",
        href: `${tenantRoot}/checkout`,
        label: "注文前に確認",
      },
    ],
    mypage: [
      {
        question: "マイページで注文や定期購入を確認できますか。",
        answer: "注文履歴、定期購入、お気に入り、問い合わせ入口をまとめ、準備中機能は準備中として表示します。",
        href: `${tenantRoot}/orders`,
        label: "注文履歴へ",
      },
      {
        question: "会員ログイン準備中でも誤解しませんか。",
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
        question: "保存機能が準備中でも分かりますか。",
        answer: "ログイン保存が有効化されるまで、人気商品候補として表示することを明記します。",
        href: `${tenantRoot}/login`,
        label: "ログインを見る",
      },
    ],
    login: [
      {
        question: "ログイン準備中でも利用者に誤解を与えませんか。",
        answer: "会員ログイン接続前は入力を保存せず、注文履歴やお気に入りの確認導線を表示します。",
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
        question: "登録機能が準備中でも購入導線は残りますか。",
        answer: "商品一覧、カート、問い合わせへ戻れる導線を残し、認証準備中を明示します。",
        href: `${tenantRoot}/products`,
        label: "商品を見る",
      },
    ],
    "mypage/subscriptions": [
      {
        question: "定期購入の状態は分かりやすく表示されていますか。",
        answer: "定期購入受付前は契約作成や表示を行わず、準備中として明示します。",
        href: `${tenantRoot}/checkout`,
        label: "注文前に確認",
      },
      {
        question: "スキップ・一時停止・解約条件は確認できますか。",
        answer: "受付開始後に操作できる項目を説明し、問い合わせと商品一覧へ戻れるようにします。",
        href: `${tenantRoot}/contact`,
        label: "問い合わせる",
      },
    ],
  };

  const merged = [...(pageItems[page] ?? []), ...defaultItems];
  return merged.filter((item, index, array) => array.findIndex((candidate) => candidate.question === item.question) === index).slice(0, 6);
}

export function buildShopPageActionMap(page: string, tenantRoot: string): ShopStorefrontActionMap {
  const defaultSteps: ShopStorefrontActionMapStep[] = [
    {
      title: "商品を比較する",
      body: "税込価格、画像、レビュー、カテゴリ、在庫を同じ商品カードで比較します。",
      href: `${tenantRoot}/products`,
      label: "商品一覧へ",
      badge: "探す",
    },
    {
      title: "購入条件を確認する",
      body: "送料、配送予定、返品条件、決済設定状態を注文前に確認します。",
      href: `${tenantRoot}/shipping`,
      label: "配送条件を見る",
      badge: "確認",
    },
    {
      title: "不明点を解消する",
      body: "FAQと問い合わせ導線を使い、商品名や注文番号を添えて確認できます。",
      href: `${tenantRoot}/faq`,
      label: "FAQを見る",
      badge: "支援",
    },
  ];

  const map: Record<string, ShopStorefrontActionMap> = {
    "": {
      title: "TOPページから迷わず購入へ進む",
      summary: "おすすめ、ランキング、セール、カテゴリから商品詳細へ進み、購入前条件を確認します。",
      steps: [
        { title: "おすすめを見る", body: "ヒーロー直下の商品カードから商品詳細へ進みます。", href: `${tenantRoot}/products`, label: "おすすめ商品へ", badge: "01" },
        { title: "カテゴリで絞る", body: "食品、日用品、キッチン、ギフトなどの安定カテゴリURLへ移動します。", href: `${tenantRoot}/categories`, label: "カテゴリを見る", badge: "02" },
        { title: "購入前条件を見る", body: "送料、返品、決済状態を確認してからカートへ進みます。", href: `${tenantRoot}/shipping`, label: "配送条件へ", badge: "03" },
      ],
    },
    products: {
      title: "商品一覧で比較して詳細へ進む",
      summary: "一覧は商品発見の中心です。検索、カテゴリ、ランキングから商品詳細とカートへつなげます。",
      steps: [
        { title: "商品カードを比較", body: "画像、商品名、税込価格、レビュー、カテゴリを同じカード構造で確認します。", href: `${tenantRoot}/products`, label: "比較を続ける", badge: "比較" },
        { title: "カテゴリへ移動", body: "カテゴリごとの商品を見比べ、目的の売り場へ戻れます。", href: `${tenantRoot}/categories`, label: "カテゴリ一覧へ", badge: "分類" },
        { title: "カートへ進む", body: "購入候補を追加したら、数量や配送条件をカートで確認します。", href: `${tenantRoot}/cart`, label: "カートを見る", badge: "購入" },
      ],
    },
    categories: {
      title: "カテゴリ階層から売り場へ移動する",
      summary: "カテゴリ一覧から売り場を選び、商品一覧と購入条件へ進めます。",
      steps: [
        { title: "主要カテゴリを選ぶ", body: "食品、日用品、キッチン、ギフトなどの売り場へ移動します。", href: buildShopCategoryHref(tenantRoot, "food-drink"), label: "食品・飲料へ", badge: "階層" },
        { title: "売れ筋を見る", body: "ランキングカテゴリから人気商品を確認します。", href: buildShopCategoryHref(tenantRoot, "ranking"), label: "ランキングへ", badge: "人気" },
        { title: "条件を確認", body: "配送・返品条件を見て購入前の不安を減らします。", href: `${tenantRoot}/shipping`, label: "配送条件へ", badge: "条件" },
      ],
    },
    product: {
      title: "商品詳細で購入判断を完結する",
      summary: "商品名、画像、税込価格、在庫、配送、返品、定期購入状態を確認してカートへ進みます。",
      steps: [
        { title: "商品情報を確認", body: "説明本文、仕様、レビュー、関連商品を確認します。", href: `${tenantRoot}/products`, label: "関連商品へ", badge: "情報" },
        { title: "購入条件を確認", body: "送料、返品、オンライン決済準備中の扱いを購入前に確認します。", href: `${tenantRoot}/shipping`, label: "配送条件へ", badge: "条件" },
        { title: "カートへ進む", body: "通常購入と定期購入状態を区別してカートへ追加します。", href: `${tenantRoot}/cart`, label: "カートを見る", badge: "購入" },
      ],
    },
    cart: {
      title: "カートで数量と条件を確認する",
      summary: "商品小計、数量、定期購入頻度、送料見込みを確認して注文確認へ進みます。",
      steps: [
        { title: "商品を追加する", body: "不足商品があれば商品一覧へ戻って追加します。", href: `${tenantRoot}/products`, label: "商品を追加", badge: "追加" },
        { title: "配送・返品を見る", body: "送料、配送予定、返品条件を確認します。", href: `${tenantRoot}/returns`, label: "返品条件へ", badge: "条件" },
        { title: "注文確認へ進む", body: "オンライン決済準備中は注文確定せず、確認画面として表示します。", href: `${tenantRoot}/checkout`, label: "注文確認へ", badge: "確認" },
      ],
    },
    checkout: {
      title: "注文確認で注文前チェックを行う",
      summary: "オンライン決済準備中は完了表示にせず、販売条件と個人情報の扱いを確認します。",
      steps: [
        { title: "カートへ戻る", body: "数量、商品、定期購入頻度を再確認します。", href: `${tenantRoot}/cart`, label: "カートへ戻る", badge: "戻る" },
        { title: "販売条件を確認", body: "特定商取引法、配送、返品条件を注文前に確認します。", href: `${tenantRoot}/legal`, label: "特商法へ", badge: "条件" },
        { title: "問い合わせる", body: "決済や配送で不明点があれば問い合わせへ進みます。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "相談" },
      ],
    },
    contact: {
      title: "問い合わせ前に必要情報を揃える",
      summary: "FAQ、配送、返品、注文履歴を確認し、商品名や注文番号を添えて問い合わせます。",
      steps: [
        { title: "FAQを確認", body: "よくある質問で配送、返品、決済、定期購入の状態を確認します。", href: `${tenantRoot}/faq`, label: "FAQへ", badge: "確認" },
        { title: "注文番号を確認", body: "注文後の問い合わせは注文履歴で番号を確認します。", href: `${tenantRoot}/orders`, label: "注文履歴へ", badge: "注文" },
        { title: "購入条件を見る", body: "配送や返品条件を見たうえで問い合わせ内容を整理します。", href: `${tenantRoot}/shipping`, label: "配送条件へ", badge: "条件" },
      ],
    },
    legal: {
      title: "取引条件を確認して購入へ戻る",
      summary: "販売者、支払い、配送、返品、問い合わせ先を確認し、商品比較へ戻ります。",
      steps: [
        { title: "配送条件を見る", body: "送料、配送目安、追跡条件を確認します。", href: `${tenantRoot}/shipping`, label: "配送条件へ", badge: "配送" },
        { title: "返品条件を見る", body: "返品、交換、キャンセル条件を確認します。", href: `${tenantRoot}/returns`, label: "返品条件へ", badge: "返品" },
        { title: "商品へ戻る", body: "条件を確認したら商品一覧へ戻って比較します。", href: `${tenantRoot}/products`, label: "商品一覧へ", badge: "商品" },
      ],
    },
    privacy: {
      title: "個人情報の扱いを確認する",
      summary: "注文、問い合わせ、ログイン、定期購入で扱う情報を確認します。",
      steps: [
        { title: "問い合わせ情報", body: "問い合わせフォームで扱う氏名、メール、注文番号の扱いを確認します。", href: `${tenantRoot}/contact`, label: "問い合わせへ", badge: "連絡" },
        { title: "アカウント状態", body: "ログイン準備中の保存範囲をマイページで確認します。", href: `${tenantRoot}/mypage`, label: "マイページへ", badge: "状態" },
        { title: "販売条件", body: "個人情報と合わせて販売者情報も確認します。", href: `${tenantRoot}/legal`, label: "特商法へ", badge: "取引" },
      ],
    },
    shipping: {
      title: "配送条件を確認して商品へ戻る",
      summary: "送料、配送予定、追跡条件を確認し、カートや返品条件へ進みます。",
      steps: [
        { title: "商品を選ぶ", body: "配送条件を見たあと、商品一覧へ戻ります。", href: `${tenantRoot}/products`, label: "商品一覧へ", badge: "商品" },
        { title: "返品条件も確認", body: "配送と返品は購入前に合わせて確認します。", href: `${tenantRoot}/returns`, label: "返品条件へ", badge: "返品" },
        { title: "カートへ進む", body: "購入候補の小計と配送前提を確認します。", href: `${tenantRoot}/cart`, label: "カートへ", badge: "購入" },
      ],
    },
    returns: {
      title: "返品条件を確認して手続きへ進む",
      summary: "返品可否、初期不良、問い合わせ期限を確認し、注文履歴や問い合わせへ移動します。",
      steps: [
        { title: "注文を確認", body: "返品対象の注文番号と商品を注文履歴で確認します。", href: `${tenantRoot}/orders`, label: "注文履歴へ", badge: "注文" },
        { title: "配送条件を見る", body: "配送状況や到着日を確認します。", href: `${tenantRoot}/shipping`, label: "配送条件へ", badge: "配送" },
        { title: "問い合わせる", body: "返品相談は商品名と注文番号を添えて連絡します。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "相談" },
      ],
    },
    faq: {
      title: "FAQから解決し、次のページへ進む",
      summary: "FAQPage本文と受付状態を一致させ、商品、配送、返品、問い合わせへ戻します。",
      steps: [
        { title: "商品へ戻る", body: "疑問が解消したら商品一覧へ戻ります。", href: `${tenantRoot}/products`, label: "商品一覧へ", badge: "商品" },
        { title: "配送・返品を見る", body: "FAQから配送と返品の詳細へ移動します。", href: `${tenantRoot}/shipping`, label: "配送条件へ", badge: "条件" },
        { title: "問い合わせる", body: "解決しない場合は問い合わせページへ進みます。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "相談" },
      ],
    },
    mypage: {
      title: "マイページから購入後導線へ進む",
      summary: "注文履歴、お気に入り、定期購入、問い合わせを同じアカウント導線にまとめます。",
      steps: [
        { title: "注文を確認", body: "注文番号、配送、返品相談の入口へ進みます。", href: `${tenantRoot}/orders`, label: "注文履歴へ", badge: "注文" },
        { title: "保存商品を見る", body: "お気に入り候補から商品詳細へ戻ります。", href: `${tenantRoot}/favorites`, label: "お気に入りへ", badge: "保存" },
        { title: "定期購入を見る", body: "定期購入受付前は準備中表示で状態を確認します。", href: `${tenantRoot}/mypage/subscriptions`, label: "定期購入へ", badge: "定期" },
      ],
    },
    account: {
      title: "アカウント導線を整理する",
      summary: "マイページ、注文履歴、お気に入り、定期購入へ移動します。",
      steps: [
        { title: "マイページへ", body: "アカウント機能の状態と導線を確認します。", href: `${tenantRoot}/mypage`, label: "マイページ", badge: "入口" },
        { title: "注文履歴へ", body: "注文と配送状況を確認します。", href: `${tenantRoot}/orders`, label: "注文履歴", badge: "注文" },
        { title: "問い合わせへ", body: "アカウント準備中の確認事項を連絡します。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "支援" },
      ],
    },
    orders: {
      title: "注文履歴から購入後サポートへ進む",
      summary: "注文がない状態でも、商品、配送、返品、問い合わせへ移動できます。",
      steps: [
        { title: "買い物を続ける", body: "注文前なら商品一覧へ戻ります。", href: `${tenantRoot}/products`, label: "商品一覧へ", badge: "商品" },
        { title: "配送を見る", body: "配送予定や追跡条件を確認します。", href: `${tenantRoot}/shipping`, label: "配送条件へ", badge: "配送" },
        { title: "問い合わせる", body: "注文番号がある場合は添えて相談します。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "相談" },
      ],
    },
    favorites: {
      title: "お気に入りから比較と購入へ戻る",
      summary: "保存候補、商品一覧、カテゴリ、カートへ移動して購入判断を続けます。",
      steps: [
        { title: "商品を比較", body: "お気に入り候補から商品詳細へ進みます。", href: `${tenantRoot}/products`, label: "商品一覧へ", badge: "比較" },
        { title: "カテゴリを見る", body: "カテゴリ別に候補を探し直します。", href: `${tenantRoot}/categories`, label: "カテゴリへ", badge: "分類" },
        { title: "カートへ", body: "購入候補をカートで確認します。", href: `${tenantRoot}/cart`, label: "カートへ", badge: "購入" },
      ],
    },
    login: {
      title: "ログイン前に利用可能範囲を確認する",
      summary: "会員ログイン準備中は保存済みのように見せず、商品や注文導線へ戻します。",
      steps: [
        { title: "会員登録へ", body: "登録導線の状態を確認します。", href: `${tenantRoot}/register`, label: "会員登録へ", badge: "登録" },
        { title: "注文履歴へ", body: "注文番号確認の入口へ進みます。", href: `${tenantRoot}/orders`, label: "注文履歴へ", badge: "注文" },
        { title: "商品へ戻る", body: "認証準備中でも商品閲覧とカート確認は続けられます。", href: `${tenantRoot}/products`, label: "商品一覧へ", badge: "商品" },
      ],
    },
    register: {
      title: "登録前に個人情報と購入条件を確認する",
      summary: "会員ログイン準備中は登録成功扱いにせず、プライバシーと商品導線を示します。",
      steps: [
        { title: "プライバシーを見る", body: "登録や注文で扱う情報を確認します。", href: `${tenantRoot}/privacy`, label: "プライバシーへ", badge: "情報" },
        { title: "ログインへ", body: "既存アカウント導線を確認します。", href: `${tenantRoot}/login`, label: "ログインへ", badge: "認証" },
        { title: "商品へ戻る", body: "認証準備中でも商品比較へ戻れます。", href: `${tenantRoot}/products`, label: "商品一覧へ", badge: "商品" },
      ],
    },
    "mypage/subscriptions": {
      title: "定期購入の状態と次の行動を確認する",
      summary: "準備中は申込み済みのように見せず、商品、注文確認、問い合わせへ案内します。",
      steps: [
        { title: "対象商品を見る", body: "定期購入に向く商品候補を商品詳細で確認します。", href: `${tenantRoot}/products`, label: "商品一覧へ", badge: "商品" },
        { title: "注文前に確認", body: "定期購入のオンライン決済準備中は注文確認で申込みを止めます。", href: `${tenantRoot}/checkout`, label: "注文確認へ", badge: "確認" },
        { title: "相談する", body: "スキップ、一時停止、解約条件を問い合わせます。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "相談" },
      ],
    },
  };

  const specific = map[page] ?? {
    title: "このページから次に進む",
    summary: "商品、購入条件、サポート、アカウント導線へ移動できます。",
    steps: [],
  };
  const steps = [...specific.steps, ...defaultSteps]
    .filter((step, index, array) => array.findIndex((candidate) => candidate.title === step.title || candidate.href === step.href) === index)
    .slice(0, 5);
  return { ...specific, steps };
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
      seoRole: "主要カテゴリ、商品一覧、購入サポートへ進める入口です。",
      userAction: "ヒーロー、商品カード、カテゴリ、フッターから商品詳細や購入条件へ移動します。",
      signals: [
        { title: "商品発見", body: "おすすめ商品、ランキング、タイムセールを商品詳細へ直結します。", href: `${tenantRoot}/products`, label: "商品一覧", badge: "発見" },
        { title: "カテゴリ導線", body: "食品・日用品・ギフトなどの売り場へ分かりやすく分岐します。", href: `${tenantRoot}/categories`, label: "カテゴリ", badge: "売り場" },
      ],
    },
    products: {
      pageLabel: "商品一覧",
      intent: "価格、画像、レビュー、カテゴリ、カート導線を同じカード密度で比較するページです。",
      seoRole: "カテゴリ、検索、商品カードから目的の商品を見つけやすくします。",
      userAction: "商品カード、カテゴリリンク、検索フォームから商品詳細へ進みます。",
      signals: [
        { title: "商品カード", body: "画像、商品名、価格、レビュー、カートボタンを同じ位置で比較できます。", href: `${tenantRoot}/products`, label: "比較する", badge: "商品" },
        { title: "カテゴリ", body: "カテゴリ別に絞り込み、商品を探し直せます。", href: `${tenantRoot}/categories`, label: "カテゴリ", badge: "分類" },
      ],
    },
    categories: {
      pageLabel: "カテゴリ一覧",
      intent: "カテゴリ画像と商品件数から売り場を選ぶページです。",
      seoRole: "カテゴリカードから商品一覧へ進み、売り場ごとに比較できます。",
      userAction: "カテゴリカードから安定カテゴリURLへ移動します。",
      signals: [
        { title: "階層導線", body: "カテゴリから商品一覧へ、商品一覧から商品詳細へ進むリンク階層を固定します。", href: `${tenantRoot}/products`, label: "商品一覧", badge: "階層" },
        { title: "人気カテゴリ", body: "ランキング、セール、ギフトなどの比較導線を同じモデルで生成します。", href: buildShopCategoryHref(tenantRoot, "ranking"), label: "ランキング", badge: "発見" },
      ],
    },
    product: {
      pageLabel: "商品詳細",
      intent: "1商品に集中し、画像、価格、在庫、配送、返品、購入ボックスで購入判断するページです。",
      seoRole: "商品写真、価格、在庫、配送、返品条件を同じ画面で確認できます。",
      userAction: "画像、説明、仕様、購入ボックス、関連商品を確認してカートへ進みます。",
      signals: [
        { title: "商品名と写真", body: "商品名、写真、価格、説明を一つの購入判断画面にまとめます。", href: `${tenantRoot}/products`, label: "関連商品", badge: "商品" },
        { title: "購入条件", body: "税込価格、在庫、配送予定、返品条件、定期購入状態を購入前に表示します。", href: `${tenantRoot}/cart`, label: "カート", badge: "購入" },
      ],
    },
    cart: {
      pageLabel: "カート",
      intent: "通常購入と定期購入を区別し、数量、小計、配送、返品を確認するページです。",
      seoRole: "購入直前の商品、数量、小計、配送、返品条件を確認できます。",
      userAction: "数量変更、削除、商品追加、チェックアウト、配送返品確認へ進みます。",
      signals: [
        { title: "注文前確認", body: "小計、送料見込み、定期購入頻度を分けて表示します。", href: `${tenantRoot}/checkout`, label: "チェックアウト", badge: "確認" },
        { title: "商品追加", body: "空カートでも商品一覧へ戻れる導線を残します。", href: `${tenantRoot}/products`, label: "商品を追加", badge: "回遊" },
      ],
    },
    checkout: {
      pageLabel: "チェックアウト",
      intent: "顧客情報、配送先、支払い状態、定期購入規約を確認するページです。",
      seoRole: "オンライン決済準備中は注文完了風に見せず、必要な確認先へ案内します。",
      userAction: "決済設定状態を確認し、必要ならカートや問い合わせへ戻ります。",
      signals: [
        { title: "決済状態", body: "準備中は注文確定を停止し、完了表示にしません。", href: `${tenantRoot}/legal`, label: "販売条件", badge: "正直" },
        { title: "個人情報", body: "配送先や支払い情報の保存条件をプライバシー導線で確認します。", href: `${tenantRoot}/privacy`, label: "個人情報", badge: "保護" },
      ],
    },
    contact: {
      pageLabel: "問い合わせ",
      intent: "注文番号、商品名、確認内容を整理してストアへ連絡するページです。",
      seoRole: "問い合わせ前にFAQ、配送、返品を確認できます。",
      userAction: "FAQ確認後、必要事項を入力して送信状態を確認します。",
      signals: [
        { title: "FAQ先行", body: "配送・返品・オンライン決済準備中状態をFAQで確認してから問い合わせます。", href: `${tenantRoot}/faq`, label: "FAQ", badge: "確認" },
        { title: "注文番号", body: "注文後の確認は注文履歴と問い合わせをつなげます。", href: `${tenantRoot}/orders`, label: "注文履歴", badge: "注文" },
      ],
    },
    legal: {
      pageLabel: "特定商取引法",
      intent: "販売者、支払い、配送、返品、問い合わせ先を注文前に確認するページです。",
      seoRole: "販売者情報と取引条件をまとめて確認できます。",
      userAction: "販売条件を確認し、配送・返品・問い合わせへ移動します。",
      signals: [
        { title: "販売者情報", body: "販売者名、連絡先、取引条件を同じレイアウトで表示します。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "取引" },
        { title: "配送返品", body: "配送条件と返品条件を相互リンクで確認します。", href: `${tenantRoot}/returns`, label: "返品条件", badge: "条件" },
      ],
    },
    privacy: {
      pageLabel: "プライバシーポリシー",
      intent: "注文、問い合わせ、アカウント、定期購入で扱う情報を確認するページです。",
      seoRole: "注文や問い合わせで扱う情報と相談先を確認できます。",
      userAction: "個人情報の扱いを確認し、必要なら問い合わせやマイページへ進みます。",
      signals: [
        { title: "個人情報", body: "注文、問い合わせ、ログインで扱う項目を明確にします。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "保護" },
        { title: "アカウント", body: "ログイン準備中も保存済みのように見せません。", href: `${tenantRoot}/mypage`, label: "マイページ", badge: "状態" },
      ],
    },
    shipping: {
      pageLabel: "配送について",
      intent: "送料、配送目安、追跡、発送条件を注文前に確認するページです。",
      seoRole: "送料、配送目安、追跡条件を購入前に確認できます。",
      userAction: "配送条件を確認して商品一覧、返品条件、カートへ進みます。",
      signals: [
        { title: "配送目安", body: "通常2〜4営業日、送料、追跡条件を共通文脈で確認します。", href: `${tenantRoot}/products`, label: "商品を見る", badge: "配送" },
        { title: "返品連携", body: "配送と返品を相互リンクして購入前確認を完結させます。", href: `${tenantRoot}/returns`, label: "返品条件", badge: "連携" },
      ],
    },
    returns: {
      pageLabel: "返品について",
      intent: "返品条件、初期不良、問い合わせ期限、キャンセル条件を確認するページです。",
      seoRole: "返品条件、初期不良、問い合わせ期限を購入前に確認できます。",
      userAction: "返品可否を確認し、注文履歴や問い合わせへ進みます。",
      signals: [
        { title: "返品条件", body: "未開封、初期不良、到着後7日以内などを分かりやすく整理します。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "返品" },
        { title: "注文確認", body: "返品前に注文履歴と配送状態へ戻れる導線を用意します。", href: `${tenantRoot}/orders`, label: "注文履歴", badge: "注文" },
      ],
    },
    faq: {
      pageLabel: "FAQ",
      intent: "配送、返品、決済、定期購入、問い合わせ前確認をまとめるページです。",
      seoRole: "よくある質問から商品、配送、返品、問い合わせへ移動できます。",
      userAction: "質問から商品一覧、配送、返品、問い合わせへ戻ります。",
      signals: [
        { title: "質問一覧", body: "配送、返品、決済、定期購入の質問をまとめて確認できます。", href: `${tenantRoot}/products`, label: "商品一覧", badge: "FAQ" },
        { title: "サポート", body: "解決しない場合は問い合わせへ移動します。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "支援" },
      ],
    },
    mypage: {
      pageLabel: "マイページ",
      intent: "注文、配送、返品、定期購入、お気に入りを確認する購入後ページです。",
      seoRole: "注文後の確認、定期購入、お気に入り、問い合わせへ移動できます。",
      userAction: "注文履歴、定期購入、お気に入り、問い合わせへ移動します。",
      signals: [
        { title: "注文管理", body: "注文履歴、配送、返品、問い合わせをまとめます。", href: `${tenantRoot}/orders`, label: "注文履歴", badge: "注文" },
        { title: "定期購入", body: "定期購入受付前は準備中として表示します。", href: `${tenantRoot}/mypage/subscriptions`, label: "定期購入", badge: "状態" },
      ],
    },
    account: {
      pageLabel: "アカウント",
      intent: "購入者アカウントの入口を整理するページです。",
      seoRole: "ログイン、会員登録、注文履歴、定期購入へ移動できます。",
      userAction: "ログイン、注文履歴、お気に入り、問い合わせへ移動します。",
      signals: [
        { title: "ログイン導線", body: "会員ログイン準備中は入力保存を行わず状態を明記します。", href: `${tenantRoot}/login`, label: "ログイン", badge: "認証" },
        { title: "購入後導線", body: "注文履歴と問い合わせへ戻れる導線を固定します。", href: `${tenantRoot}/orders`, label: "注文履歴", badge: "購入後" },
      ],
    },
    orders: {
      pageLabel: "注文履歴",
      intent: "注文番号、配送状況、領収書、問い合わせを確認するページです。",
      seoRole: "注文がない状態でも商品一覧とサポートへ戻れます。",
      userAction: "商品一覧、問い合わせ、配送、返品へ進みます。",
      signals: [
        { title: "空状態", body: "注文がない場合でも商品一覧と問い合わせへ進めます。", href: `${tenantRoot}/products`, label: "商品を見る", badge: "空状態" },
        { title: "問い合わせ", body: "注文番号を添えて問い合わせできる導線を近くに置きます。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "支援" },
      ],
    },
    favorites: {
      pageLabel: "お気に入り",
      intent: "保存候補、比較候補、商品詳細への戻り先をまとめるページです。",
      seoRole: "保存機能準備中も商品一覧やカテゴリへ戻れます。",
      userAction: "候補商品から商品詳細やカートへ進みます。",
      signals: [
        { title: "商品比較", body: "お気に入り候補の商品カードで価格、画像、CTAを揃えます。", href: `${tenantRoot}/products`, label: "商品一覧", badge: "比較" },
        { title: "ログイン", body: "保存機能の受付開始状態をログイン導線で確認します。", href: `${tenantRoot}/login`, label: "ログイン", badge: "保存" },
      ],
    },
    login: {
      pageLabel: "ログイン",
      intent: "注文履歴、定期購入、お気に入りへ進む入口です。",
      seoRole: "認証準備中は入力保存を行わず、利用可能状態を明示します。",
      userAction: "会員登録、マイページ、問い合わせへ移動します。",
      signals: [
        { title: "認証状態", body: "会員ログイン接続前はログイン成功扱いにしません。", href: `${tenantRoot}/register`, label: "会員登録", badge: "認証" },
        { title: "購入確認", body: "注文履歴や問い合わせへ戻れる導線を維持します。", href: `${tenantRoot}/orders`, label: "注文履歴", badge: "注文" },
      ],
    },
    register: {
      pageLabel: "会員登録",
      intent: "購入者登録の入口と個人情報確認をまとめるページです。",
      seoRole: "認証準備中は登録完了風に見せず、プライバシーへ案内します。",
      userAction: "プライバシー、ログイン、商品一覧へ移動します。",
      signals: [
        { title: "個人情報", body: "登録前に個人情報の扱いを確認できます。", href: `${tenantRoot}/privacy`, label: "プライバシー", badge: "保護" },
        { title: "商品へ戻る", body: "登録せずに商品一覧やカートへ戻れます。", href: `${tenantRoot}/products`, label: "商品一覧", badge: "回遊" },
      ],
    },
    "mypage/subscriptions": {
      pageLabel: "定期購入",
      intent: "契約、次回配送、一時停止、再開、スキップ、解約の状態を確認するページです。",
      seoRole: "定期購入が準備中の間は準備中を明示し、完了表示にしません。",
      userAction: "チェックアウト、問い合わせ、商品一覧へ戻ります。",
      signals: [
        { title: "準備中", body: "定期購入受付前は契約表示や作成を行いません。", href: `${tenantRoot}/checkout`, label: "注文前確認", badge: "未完了" },
        { title: "解約条件", body: "受付開始後に停止、再開、スキップ、解約導線を検証します。", href: `${tenantRoot}/contact`, label: "問い合わせ", badge: "契約" },
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

export function buildShopTrustMatrix(
  page: string,
  tenantRoot: string,
  input: {
    productName?: string | null;
    priceLabel?: string | null;
    inStock?: boolean | null;
    subscriptionSchemaPending?: boolean;
  } = {},
): ShopStorefrontTrustMatrix {
  const productName = String(input.productName || "商品").replace(/\s+/g, " ").trim();
  const priceLabel = String(input.priceLabel || "税込価格").replace(/\s+/g, " ").trim();
  const stockProof = input.inStock === false ? "在庫状態は商品詳細と問い合わせで確認" : "在庫あり表示と配送目安を購入前に確認";
  const subscriptionProof = input.subscriptionSchemaPending
    ? "定期購入準備中は申込み不可として明示"
    : "通常購入と定期購入の条件を購入前に分離";

  const sharedSignals: ShopStorefrontTrustMatrixSignal[] = [
    {
      title: "販売者と連絡先",
      body: "販売者情報、問い合わせ先、特商法を確認できる状態にし、薄い匿名ストアにしません。",
      href: `${tenantRoot}/legal`,
      label: "販売者情報",
      badge: "Seller",
      proof: "特商法・問い合わせへクロール可能なリンク",
    },
    {
      title: "配送と在庫",
      body: `${stockProof}。送料、発送目安、追跡条件を配送ページへ集約します。`,
      href: `${tenantRoot}/shipping`,
      label: "配送条件",
      badge: "Shipping",
      proof: "配送ページと商品詳細の購入条件を接続",
    },
    {
      title: "返品とキャンセル",
      body: "返品期限、初期不良、未開封条件、キャンセル相談先を注文前に確認できます。",
      href: `${tenantRoot}/returns`,
      label: "返品条件",
      badge: "Return",
      proof: "返品・特商法・問い合わせを相互リンク",
    },
    {
      title: "決済と定期購入",
      body: `${subscriptionProof}。オンライン決済準備中は完了表示にせず、注文確認で申込みを止めます。`,
      href: `${tenantRoot}/checkout`,
      label: "注文前確認",
      badge: "Payment",
      proof: "オンライン決済準備中と定期購入状態を明示",
    },
    {
      title: "個人情報とサポート",
      body: "注文、問い合わせ、アカウント、定期購入で扱う情報をプライバシーとFAQへつなげます。",
      href: `${tenantRoot}/privacy`,
      label: "個人情報",
      badge: "Privacy",
      proof: "プライバシー・FAQ・問い合わせを同一導線に配置",
    },
  ];

  const specific: Record<string, Omit<ShopStorefrontTrustMatrix, "signals"> & { signals: ShopStorefrontTrustMatrixSignal[] }> = {
    "": {
      title: "TOPページ購入前の信頼マトリクス",
      summary: "初回訪問でも、ストアの販売者、配送、返品、決済、サポートにすぐ到達できるようにします。",
      pageContext: "TOPから商品、カテゴリ、購入条件へ進む前の安心材料です。",
      signals: [
        {
          title: "売り場全体の信頼導線",
          body: "おすすめ、ランキング、タイムセールから商品詳細へ進む前に、配送返品と問い合わせへ戻れます。",
          href: `${tenantRoot}/products`,
          label: "商品一覧",
          badge: "Store",
          proof: "TOP、商品一覧、カテゴリ、フッターの内部リンクを統一",
        },
      ],
    },
    products: {
      title: "商品一覧購入前の信頼マトリクス",
      summary: "商品比較中に、税込価格、配送、返品、在庫、サポートの確認先を見失わない構造にします。",
      pageContext: "一覧から詳細、カテゴリ、カートへ進む前の購入判断です。",
      signals: [
        {
          title: "一覧カードの比較根拠",
          body: "画像、商品名、カテゴリ、価格、レビュー、CTAを共通カードで揃えます。",
          href: `${tenantRoot}/categories`,
          label: "カテゴリ",
          badge: "Compare",
          proof: "商品カードとカテゴリURLを同じデータから生成",
        },
      ],
    },
    categories: {
      title: "カテゴリ購入前の信頼マトリクス",
      summary: "カテゴリごとの商品件数、画像、購入条件を同じ形式で確認できます。",
      pageContext: "カテゴリから商品一覧へ進む前の階層確認です。",
      signals: [
        {
          title: "カテゴリ階層の明確化",
          body: "カテゴリカードから商品一覧へつなげ、売り場ごとに比較できます。",
          href: `${tenantRoot}/products`,
          label: "商品一覧",
          badge: "Category",
          proof: "カテゴリカードから商品一覧へ直接移動",
        },
      ],
    },
    product: {
      title: `${productName} 購入前の信頼マトリクス`,
      summary: `${priceLabel}、在庫、配送、返品、決済、定期購入、問い合わせを1商品に集中させます。`,
      pageContext: "商品詳細で購入判断を完結させるための確認表です。",
      signals: [
        {
          title: "単一商品ページの根拠",
          body: "商品名、画像、価格、在庫、SKU、配送返品を一つの購入判断画面に揃えます。",
          href: `${tenantRoot}/cart`,
          label: "カートで確認",
          badge: "Product",
          proof: "商品名の二重表示なし・購入条件を同じ画面に集約",
        },
      ],
    },
    cart: {
      title: "カート購入前の信頼マトリクス",
      summary: "数量、小計、配送、返品、通常購入と定期購入の違いを注文前に確認します。",
      pageContext: "注文確認へ進む前の注文確認です。",
      signals: [
        {
          title: "注文前の合計確認",
          body: "数量変更、削除、小計、定期購入頻度を分けて表示します。",
          href: `${tenantRoot}/checkout`,
          label: "注文確認",
          badge: "Cart",
          proof: "カート操作と注文確認導線を同じページで確認",
        },
      ],
    },
    checkout: {
      title: "注文前確認の信頼マトリクス",
      summary: "顧客情報、配送先、決済状態、定期購入規約、販売条件を注文確定前に確認します。",
      pageContext: "オンライン決済準備中なら成功扱いにせず、原因と戻り先を示します。",
      signals: [
        {
          title: "注文確定の正直な停止",
          body: "オンライン決済準備中や定期購入受付前は完了表示を出さず、必要な確認先を案内します。",
          href: `${tenantRoot}/contact`,
          label: "問い合わせ",
          badge: "Checkout",
          proof: "オンライン決済準備中は注文確定をブロック",
        },
      ],
    },
    contact: {
      title: "問い合わせ前の信頼マトリクス",
      summary: "FAQ、注文履歴、配送返品を確認してから、商品名や注文番号付きで問い合わせできます。",
      pageContext: "問い合わせ本文を送る前の確認先です。",
      signals: [
        {
          title: "問い合わせ前確認",
          body: "よくある質問と注文履歴へ戻り、必要な情報を整理できます。",
          href: `${tenantRoot}/faq`,
          label: "FAQ",
          badge: "Support",
          proof: "FAQ・注文履歴・問い合わせを相互接続",
        },
      ],
    },
    legal: {
      title: "特商法ページの信頼マトリクス",
      summary: "販売者、支払い、配送、返品、問い合わせ先を取引条件としてまとめます。",
      pageContext: "注文前の販売条件確認です。",
      signals: [
        {
          title: "販売条件の確認",
          body: "支払い、配送、返品、連絡先を同じ取引条件として確認できます。",
          href: `${tenantRoot}/shipping`,
          label: "配送条件",
          badge: "Legal",
          proof: "販売条件から配送返品へ相互リンク",
        },
      ],
    },
    privacy: {
      title: "プライバシーページの信頼マトリクス",
      summary: "注文、問い合わせ、アカウント、定期購入で扱う情報を購入導線と接続します。",
      pageContext: "個人情報を入力する前の確認です。",
      signals: [
        {
          title: "個人情報の利用範囲",
          body: "問い合わせ、配送、注文履歴で使う情報をプライバシー文脈にまとめます。",
          href: `${tenantRoot}/contact`,
          label: "問い合わせ",
          badge: "Privacy",
          proof: "個人情報ページから相談導線へ接続",
        },
      ],
    },
    shipping: {
      title: "配送ページの信頼マトリクス",
      summary: "送料、発送目安、追跡、返品条件を商品詳細とカートへ戻せる形で整理します。",
      pageContext: "注文前の配送確認です。",
      signals: [
        {
          title: "配送から購入へ戻る",
          body: "配送条件を確認後、商品一覧や返品条件へ移動できます。",
          href: `${tenantRoot}/products`,
          label: "商品を見る",
          badge: "Delivery",
          proof: "配送ページから商品・返品・問い合わせへ内部リンク",
        },
      ],
    },
    returns: {
      title: "返品ページの信頼マトリクス",
      summary: "返品可否、初期不良、キャンセル、問い合わせ条件を注文履歴と接続します。",
      pageContext: "購入前後の返品確認です。",
      signals: [
        {
          title: "返品と注文確認",
          body: "返品対象の商品、注文番号、問い合わせ条件を確認できます。",
          href: `${tenantRoot}/orders`,
          label: "注文履歴",
          badge: "Return",
          proof: "返品ページから注文履歴と問い合わせへ接続",
        },
      ],
    },
    faq: {
      title: "FAQページの信頼マトリクス",
      summary: "FAQ本文と購入導線を一致させ、解決しない場合の問い合わせ先を明確にします。",
      pageContext: "質問から商品、配送、返品、問い合わせへ戻る導線です。",
      signals: [
        {
          title: "FAQから次の行動へ",
          body: "FAQで解決しない場合は問い合わせへ進み、商品比較にも戻れます。",
          href: `${tenantRoot}/contact`,
          label: "問い合わせ",
          badge: "FAQ",
          proof: "FAQPage本文とサポート導線を一致",
        },
      ],
    },
    mypage: {
      title: "マイページの信頼マトリクス",
      summary: "注文、定期購入、お気に入り、問い合わせを購入後サポートとしてまとめます。",
      pageContext: "購入後に次の操作を探すための確認表です。",
      signals: [
        {
          title: "購入後の状態確認",
          body: "注文履歴、定期購入、返品、問い合わせへすぐ移動できます。",
          href: `${tenantRoot}/orders`,
          label: "注文履歴",
          badge: "Account",
          proof: "購入後ページでも商品・サポートへ戻れる",
        },
      ],
    },
    account: {
      title: "アカウントページの信頼マトリクス",
      summary: "ログイン、会員登録、注文履歴、定期購入、問い合わせを同じ認証導線で整理します。",
      pageContext: "認証準備中も完了表示をしない確認表です。",
      signals: [
        {
          title: "認証状態の明示",
          body: "ログイン準備中は注文履歴や商品一覧へ戻れるようにします。",
          href: `${tenantRoot}/login`,
          label: "ログイン",
          badge: "Account",
          proof: "認証導線と購入後導線を分離",
        },
      ],
    },
    orders: {
      title: "注文履歴の信頼マトリクス",
      summary: "注文がない状態でも、商品、配送、返品、問い合わせへ進める購入後ページにします。",
      pageContext: "注文番号を探す前後の確認表です。",
      signals: [
        {
          title: "注文後サポート",
          body: "注文番号、配送、返品、問い合わせを購入後サポートとしてまとめます。",
          href: `${tenantRoot}/contact`,
          label: "問い合わせ",
          badge: "Orders",
          proof: "注文履歴とサポート導線を接続",
        },
      ],
    },
    favorites: {
      title: "お気に入りの信頼マトリクス",
      summary: "保存候補から商品詳細、カテゴリ、カート、問い合わせへ戻れるようにします。",
      pageContext: "保存候補を購入判断へ戻す確認表です。",
      signals: [
        {
          title: "比較候補から購入へ",
          body: "保存商品を商品一覧や商品詳細へ戻し、価格と配送を再確認できます。",
          href: `${tenantRoot}/products`,
          label: "商品一覧",
          badge: "Favorite",
          proof: "お気に入りから商品比較へ内部リンク",
        },
      ],
    },
    login: {
      title: "ログインページの信頼マトリクス",
      summary: "ログイン準備中に成功扱いにせず、登録、注文履歴、商品導線へ戻します。",
      pageContext: "認証前の利用可能範囲を示す確認表です。",
      signals: [
        {
          title: "認証前の回遊",
          body: "ログイン前でも商品一覧、登録、問い合わせへ移動できます。",
          href: `${tenantRoot}/register`,
          label: "会員登録",
          badge: "Login",
          proof: "認証準備中状態を明示",
        },
      ],
    },
    register: {
      title: "会員登録ページの信頼マトリクス",
      summary: "登録前に個人情報、購入条件、ログイン、商品導線を確認します。",
      pageContext: "登録前の個人情報確認です。",
      signals: [
        {
          title: "登録前の個人情報確認",
          body: "登録に使う情報と購入時の扱いをプライバシーへ接続します。",
          href: `${tenantRoot}/privacy`,
          label: "プライバシー",
          badge: "Register",
          proof: "登録導線と個人情報ページを接続",
        },
      ],
    },
    "mypage/subscriptions": {
      title: "定期購入ページの信頼マトリクス",
      summary: "定期購入受付時は契約済みのように見せず、商品、注文確認、問い合わせへ案内します。",
      pageContext: "定期購入の申込み・状態確認前の確認表です。",
      signals: [
        {
          title: "定期購入の正直な状態",
          body: "準備中は申込み不可として表示し、停止・解約導線は受付開始後に検証します。",
          href: `${tenantRoot}/checkout`,
          label: "注文確認",
          badge: "Subscription",
          proof: "準備中は定期購入準備中",
        },
      ],
    },
  };

  const selected = specific[page] ?? specific[""];
  return {
    ...selected,
    signals: [...selected.signals, ...sharedSignals]
      .filter((item, index, array) => array.findIndex((candidate) => candidate.title === item.title || candidate.href === item.href) === index)
      .slice(0, 6),
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
        "定期購入は受付開始後に有効化します。商品詳細に表示される購入条件と、チェックアウトの決済設定状態を確認してください。",
    },
    {
      question: "送料や返品条件はどこで確認できますか。",
      answer:
        "配送について、返品について、特定商取引法に基づく表示の各ページで確認できます。",
    },
    {
      question: "決済が準備中の場合はどうなりますか。",
      answer:
        "購入者に誤解を与えないため、オンライン決済準備中は注文確定や支払い完了のような表示を出さず、設定が必要であることを表示します。",
    },
  ];
}
