import { buildShopCategoryHref, buildShopCuratedCategoryCards, findShopCuratedCategory } from "./shopStorefrontShared";

export type ShopBreadcrumbItem = {
  name: string;
  visibleName?: string;
  href: string;
  url: string;
};

export type ShopSeoProduct = {
  id?: string;
  displayName: string;
  imageUrl: string;
  description?: string;
  seoDescription?: string;
  sku?: string;
  categoryName?: string;
  salePrice: number;
  inStock?: boolean;
};

export type ShopSeoLink = {
  label: string;
  href: string;
};

export type ShopSeoFaqItem = {
  question: string;
  answer: string;
};

const SHOP_ORIGIN = "https://shop.aiboux.com";
const DEFAULT_SHOP_OG_IMAGE =
  "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1200&h=630&q=84";

const NOINDEX_STOREFRONT_PAGES = new Set([
  "cart",
  "checkout",
  "mypage",
  "mypage/subscriptions",
  "orders",
  "favorites",
  "login",
  "register",
  "account",
]);

type ShopStorefrontSeoMetaInput = {
  page: string;
  storeName: string;
  productName?: string | null;
  productDescription?: string | null;
  activeCategoryName?: string | null;
  searchQuery?: string | null;
  found?: boolean;
};

export type ShopStorefrontSeoMeta = {
  title: string;
  metaTitle: string;
  description: string;
};

const SHOP_STOREFRONT_PAGE_META: Record<string, { title: string; description: string }> = {
  "": {
    title: "TOP",
    description:
      "日用品、食品、ギフト、コーヒー、キッチン用品を価格、税込表示、レビュー、配送条件から比較できる公式ストアTOPです。",
  },
  products: {
    title: "商品一覧",
    description:
      "食品、日用品、ギフト、キッチン用品、ペット用品を画像、価格、税込表示、レビュー、在庫、配送条件から比較できます。",
  },
  categories: {
    title: "カテゴリ一覧",
    description:
      "食品・飲料、日用品、キッチン用品、ギフト、ビューティー、ペット用品などの売り場へ迷わず移動できます。",
  },
  cart: {
    title: "カート",
    description:
      "カート内の商品、数量、小計、配送・返品条件、支払い方法の受付状態を購入前にまとめて確認できます。",
  },
  checkout: {
    title: "チェックアウト",
    description:
      "注文内容、配送先、支払い設定状態、定期購入の注意事項を確認し、支払い方法の受付状態を明確に案内します。",
  },
  contact: {
    title: "問い合わせ",
    description:
      "商品、注文、配送、返品、定期購入、支払い設定について、必要な情報を添えてストアへ問い合わせできます。",
  },
  legal: {
    title: "特定商取引法に基づく表示",
    description:
      "販売者情報、所在地、連絡先、支払方法、配送、返品、キャンセル条件、問い合わせ先を購入前に確認できます。",
  },
  privacy: {
    title: "プライバシーポリシー",
    description:
      "購入者の氏名、住所、連絡先、注文情報、問い合わせ内容、配送情報の利用目的と管理方針を確認できます。",
  },
  shipping: {
    title: "配送について",
    description:
      "送料、配送方法、発送目安、追跡、まとめ買い時の配送条件、配送問い合わせ先を注文前に確認できます。",
  },
  returns: {
    title: "返品について",
    description:
      "返品・交換条件、キャンセル、初期不良、返送手順、問い合わせに必要な情報を購入前に確認できます。",
  },
  faq: {
    title: "よくある質問",
    description:
      "商品選び、配送、返品、支払い、定期購入、アカウントに関するよくある質問をまとめて確認できます。",
  },
  mypage: {
    title: "マイページ",
    description:
      "注文履歴、配送状況、お気に入り、定期購入、アカウント情報、問い合わせ導線へ移動する購入者向け入口です。",
  },
  "mypage/subscriptions": {
    title: "定期購入",
    description:
      "定期購入の申込み状況、次回配送予定、一時停止、スキップ、解約の手続き導線と問い合わせ先を確認できます。",
  },
  orders: {
    title: "注文履歴",
    description:
      "過去の注文、配送状況、支払い状態、問い合わせ、返品相談の入口を購入者向けに整理しています。",
  },
  favorites: {
    title: "お気に入り",
    description:
      "保存した商品、最近見た商品、関連カテゴリ、在庫、価格、カートへの戻り導線をまとめて確認できます。",
  },
  login: {
    title: "ログイン",
    description:
      "購入者アカウントへログインし、注文履歴、お気に入り、配送状況、定期購入状態へ移動する入口です。",
  },
  register: {
    title: "会員登録",
    description:
      "購入者アカウントを作成し、配送先、注文履歴、お気に入り、定期購入状態、問い合わせ履歴を管理する入口です。",
  },
  account: {
    title: "アカウント",
    description:
      "購入者情報、配送先、注文履歴、お気に入り、定期購入、問い合わせへの導線をまとめたアカウント入口です。",
  },
};

export function absoluteShopUrl(path: string): string {
  return new URL(path, SHOP_ORIGIN).toString();
}

function normalizeEntityRoot(absoluteTenantRoot: string): string {
  return absoluteTenantRoot.endsWith("/") ? absoluteTenantRoot.slice(0, -1) : absoluteTenantRoot;
}

function shopStoreEntityId(absoluteTenantRoot: string): string {
  return `${normalizeEntityRoot(absoluteTenantRoot)}#store`;
}

function shopWebsiteEntityId(absoluteTenantRoot: string): string {
  return `${normalizeEntityRoot(absoluteTenantRoot)}#website`;
}

function shopWebPageEntityId(canonicalUrl: string): string {
  return `${canonicalUrl.split("#")[0]}#webpage`;
}

function shopItemListEntityId(canonicalUrl: string): string {
  return `${canonicalUrl.split("#")[0]}#itemlist`;
}

export function normalizeShopSeoDescription(value: string, fallback: string): string {
  const normalized = String(value || fallback).replace(/\s+/g, " ").trim();
  const description = normalized || fallback;
  return description.length > 155 ? `${description.slice(0, 152)}...` : description;
}

function normalizeShopSeoTitle(value: string): string {
  const normalized = String(value || "AIBOUX Store").replace(/\s+/g, " ").trim();
  return normalized.length > 76 ? `${normalized.slice(0, 73)}...` : normalized;
}

export function normalizeShopSeoImageUrl(value?: string | null): string {
  if (!value) return DEFAULT_SHOP_OG_IMAGE;
  return new URL(value, SHOP_ORIGIN).toString();
}

export function buildShopStorefrontSeoMeta({
  page,
  storeName,
  productName,
  productDescription,
  activeCategoryName,
  searchQuery,
  found = true,
}: ShopStorefrontSeoMetaInput): ShopStorefrontSeoMeta {
  if (!found) {
    return {
      metaTitle: "ページが見つかりません",
      title: "ページが見つかりません | AIBOUX Store",
      description: "指定されたストアページは公開されていないか、URLが変更されています。",
    };
  }

  if (page === "product") {
    const safeProductName = String(productName || "商品詳細").replace(/\s+/g, " ").trim();
    const metaTitle = safeProductName || "商品詳細";
    const fallbackDescription = `${metaTitle}の価格、税込表示、レビュー、在庫、配送予定、返品条件、定期購入の可否を確認できます。`;
    const sourceDescription = String(productDescription || "").replace(/\s+/g, " ").trim();
    const purchaseDecisionDescription = sourceDescription
      ? `${fallbackDescription} ${sourceDescription}`
      : fallbackDescription;
    return {
      metaTitle,
      title: normalizeShopSeoTitle(`${metaTitle} | ${storeName}`),
      description: normalizeShopSeoDescription(purchaseDecisionDescription, fallbackDescription),
    };
  }

  if (page === "products" && searchQuery) {
    const safeQuery = String(searchQuery).replace(/\s+/g, " ").trim();
    const metaTitle = `「${safeQuery}」の検索結果`;
    return {
      metaTitle,
      title: normalizeShopSeoTitle(`${metaTitle} | ${storeName}`),
      description: normalizeShopSeoDescription(
        `${storeName}で「${safeQuery}」に関連する商品を検索します。商品名、カテゴリ、価格、レビュー、在庫、配送条件を比較できます。`,
        `${safeQuery}の検索結果を表示します。`,
      ),
    };
  }

  if (page === "products" && activeCategoryName) {
    const categoryName = String(activeCategoryName).replace(/\s+/g, " ").trim();
    const metaTitle = `${categoryName}の商品一覧`;
    return {
      metaTitle,
      title: normalizeShopSeoTitle(`${metaTitle} | ${storeName}`),
      description: normalizeShopSeoDescription(
        `${storeName}の${categoryName}カテゴリ商品を、画像、税込価格、レビュー、在庫、配送条件、カート導線から比較できます。`,
        `${categoryName}カテゴリの商品一覧です。`,
      ),
    };
  }

  const base = SHOP_STOREFRONT_PAGE_META[page] ?? {
    title: "ストアページ",
    description:
      "商品、カテゴリ、配送、返品、問い合わせ、アカウント導線を整理したAIBOUX Storeの公開ページです。",
  };
  const metaTitle = page === "" ? storeName : base.title;
  const title = page === "" ? `${storeName} | AIBOUX Storefront` : `${metaTitle} | ${storeName}`;
  return {
    metaTitle,
    title: normalizeShopSeoTitle(title),
    description: normalizeShopSeoDescription(base.description, `${storeName}の公開ストアです。`),
  };
}

export function buildShopRobotsContent(page: string): string {
  if (NOINDEX_STOREFRONT_PAGES.has(page)) {
    return "noindex,follow,noarchive";
  }
  return "index,follow,max-image-preview:large";
}

export function buildShopSocialMeta({
  title,
  description,
  canonicalUrl,
  imageUrl,
  storeName,
  type = "website",
}: {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl?: string | null;
  storeName: string;
  type?: "website" | "product";
}) {
  const safeDescription = normalizeShopSeoDescription(description, `${storeName}の公開ストアです。`);
  return {
    title,
    description: safeDescription,
    canonicalUrl,
    imageUrl: normalizeShopSeoImageUrl(imageUrl),
    storeName,
    ogType: type,
    twitterCard: "summary_large_image",
  };
}

export function buildShopSitemapEntries(tenantSlug = "aiboux") {
  const tenantRoot = `/s/${encodeURIComponent(tenantSlug)}`;
  const publicPages = [
    { path: "/", changefreq: "daily", priority: "0.80" },
    { path: `${tenantRoot}/`, changefreq: "daily", priority: "1.00" },
    { path: `${tenantRoot}/products`, changefreq: "daily", priority: "0.90" },
    { path: `${tenantRoot}/categories`, changefreq: "weekly", priority: "0.80" },
    { path: `${tenantRoot}/contact`, changefreq: "monthly", priority: "0.55" },
    { path: `${tenantRoot}/legal`, changefreq: "monthly", priority: "0.50" },
    { path: `${tenantRoot}/privacy`, changefreq: "monthly", priority: "0.50" },
    { path: `${tenantRoot}/shipping`, changefreq: "monthly", priority: "0.60" },
    { path: `${tenantRoot}/returns`, changefreq: "monthly", priority: "0.60" },
    { path: `${tenantRoot}/faq`, changefreq: "monthly", priority: "0.65" },
  ];
  const categoryPages = buildShopCuratedCategoryCards().map((category) => ({
    path: buildShopCategoryHref(tenantRoot, category.slug),
    changefreq: "weekly",
    priority: "0.70",
  }));
  const productIds = [
    "setsuka-coffee",
    "setsuka-bottle",
    "setsuka-towel",
    "setsuka-storage",
    "setsuka-cleaning",
    "setsuka-skincare",
    "setsuka-snack",
    "setsuka-pet",
    "setsuka-gift",
    "setsuka-tea",
    "setsuka-rice",
    "setsuka-pan",
    "setsuka-dishcloth",
    "setsuka-laundry",
    "setsuka-candle",
    "setsuka-stationery",
  ];
  const productPages = productIds.map((id) => ({
    path: `${tenantRoot}/product/${id}`,
    changefreq: "weekly",
    priority: "0.75",
  }));

  return [...publicPages, ...categoryPages, ...productPages].map((entry) => ({
    ...entry,
    url: absoluteShopUrl(entry.path),
  }));
}

export function buildShopBreadcrumbJsonLd(items: ShopBreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildShopBreadcrumbItems({
  page,
  metaTitle,
  tenantRoot,
  absoluteTenantRoot,
  canonicalUrl,
  product,
}: {
  page: string;
  metaTitle: string;
  tenantRoot: string;
  absoluteTenantRoot: string;
  canonicalUrl: string;
  product: Pick<ShopSeoProduct, "displayName" | "categoryName"> | null;
}): ShopBreadcrumbItem[] {
  const items: ShopBreadcrumbItem[] = [{ name: "TOP", href: `${tenantRoot}/`, url: absoluteTenantRoot }];

  if (page === "product" && product) {
    const categoryName = product.categoryName || "商品";
    items.push({ name: "商品一覧", href: `${tenantRoot}/products`, url: absoluteShopUrl(`${tenantRoot}/products`) });
    const categoryHref = buildShopCategoryHref(tenantRoot, findShopCuratedCategory(categoryName)?.slug ?? categoryName);
    items.push({
      name: categoryName,
      href: categoryHref,
      url: absoluteShopUrl(categoryHref),
    });
    items.push({ name: product.displayName, visibleName: "商品詳細", href: "", url: canonicalUrl });
    return items;
  }

  if (page !== "") {
    items.push({ name: metaTitle, href: "", url: canonicalUrl });
  }

  return items;
}

export function buildShopWebsiteJsonLd({
  storeName,
  absoluteTenantRoot,
}: {
  storeName: string;
  absoluteTenantRoot: string;
}) {
  const storeId = shopStoreEntityId(absoluteTenantRoot);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": shopWebsiteEntityId(absoluteTenantRoot),
    name: storeName,
    url: absoluteTenantRoot,
    publisher: {
      "@id": storeId,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteTenantRoot}products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildShopWebPageJsonLd({
  page,
  name,
  description,
  canonicalUrl,
  absoluteTenantRoot,
  breadcrumbItems,
}: {
  page: string;
  name: string;
  description: string;
  canonicalUrl: string;
  absoluteTenantRoot: string;
  breadcrumbItems: ShopBreadcrumbItem[];
}) {
  const type =
    page === "contact"
      ? "ContactPage"
      : page === "faq"
        ? "FAQPage"
        : page === "product"
          ? "ItemPage"
          : ["products", "categories", "favorites"].includes(page)
            ? "CollectionPage"
            : "WebPage";

  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": shopWebPageEntityId(canonicalUrl),
    name,
    description: normalizeShopSeoDescription(description, name),
    url: canonicalUrl,
    inLanguage: "ja-JP",
    isPartOf: {
      "@id": shopWebsiteEntityId(absoluteTenantRoot),
    },
    publisher: {
      "@id": shopStoreEntityId(absoluteTenantRoot),
    },
    about: {
      "@id": shopStoreEntityId(absoluteTenantRoot),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    },
  };
}

export function buildShopSiteNavigationJsonLd({
  canonicalUrl,
  storeName,
  links,
}: {
  canonicalUrl: string;
  storeName: string;
  links: ShopSeoLink[];
}) {
  const deduped = links.filter(
    (link, index, array) => link.href && array.findIndex((item) => item.href === link.href && item.label === link.label) === index,
  );

  return {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: `${storeName} 主要ナビゲーション`,
    url: canonicalUrl,
    hasPart: deduped.slice(0, 40).map((link) => ({
      "@type": "WebPage",
      name: link.label,
      url: absoluteShopUrl(link.href),
    })),
  };
}

type ShopJsonLdNode = Record<string, unknown>;

function isShopJsonLdNode(value: unknown): value is ShopJsonLdNode {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stripTopLevelJsonLdContext(node: ShopJsonLdNode): ShopJsonLdNode {
  const { "@context": _context, ...rest } = node;
  return rest;
}

function shopJsonLdDedupeKey(node: ShopJsonLdNode): string {
  const id = node["@id"];
  if (typeof id === "string" && id.trim()) return `id:${id}`;
  const type = node["@type"];
  const url = node.url;
  const name = node.name;
  if (typeof type === "string" && typeof url === "string") return `type-url:${type}:${url}`;
  if (Array.isArray(type) && typeof url === "string") return `type-url:${type.join("|")}:${url}`;
  if (typeof type === "string" && typeof name === "string") return `type-name:${type}:${name}`;
  return `json:${JSON.stringify(node)}`;
}

export function buildShopStructuredDataGraph(items: unknown[]) {
  const graph: ShopJsonLdNode[] = [];
  const seen = new Set<string>();

  for (const item of items.flat()) {
    if (!isShopJsonLdNode(item)) continue;
    const node = stripTopLevelJsonLdContext(item);
    const key = shopJsonLdDedupeKey(node);
    if (seen.has(key)) continue;
    seen.add(key);
    graph.push(node);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function buildShopOrganizationJsonLd({
  storeName,
  absoluteTenantRoot,
  tenantRoot,
  contactEmail,
  phone,
}: {
  storeName: string;
  absoluteTenantRoot: string;
  tenantRoot: string;
  contactEmail?: string | null;
  phone?: string | null;
}) {
  const storeId = shopStoreEntityId(absoluteTenantRoot);
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "OnlineStore"],
    "@id": storeId,
    name: storeName,
    url: absoluteTenantRoot,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: contactEmail || undefined,
      telephone: phone || undefined,
      areaServed: "JP",
      availableLanguage: ["ja"],
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "JP",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 7,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
      merchantReturnLink: absoluteShopUrl(`${tenantRoot}/returns`),
    },
  };
}

export function buildShopFaqPageJsonLd({
  canonicalUrl,
  faqItems,
}: {
  canonicalUrl: string;
  faqItems: ShopSeoFaqItem[];
}) {
  if (!faqItems.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: canonicalUrl,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildShopProductJsonLd({
  product,
  canonicalUrl,
  absoluteTenantRoot,
  storeName,
  fallbackDescription,
}: {
  product: ShopSeoProduct | null;
  canonicalUrl: string;
  absoluteTenantRoot: string;
  storeName: string;
  fallbackDescription: string;
}) {
  if (!product) return null;

  const storeId = shopStoreEntityId(absoluteTenantRoot);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonicalUrl.split("#")[0]}#product`,
    name: product.displayName,
    image: [product.imageUrl],
    description: product.description || product.seoDescription || fallbackDescription,
    sku: product.sku,
    category: product.categoryName,
    mainEntityOfPage: {
      "@id": shopWebPageEntityId(canonicalUrl),
    },
    brand: {
      "@type": "Brand",
      "@id": `${storeId}-brand`,
      name: storeName,
    },
    offers: {
      "@type": "Offer",
      "@id": `${canonicalUrl.split("#")[0]}#offer`,
      url: canonicalUrl,
      priceCurrency: "JPY",
      price: String(product.salePrice),
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@id": storeId,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "JP",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 4,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "JP",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "128",
    },
  };
}

export function buildShopItemListJsonLd({
  page,
  canonicalUrl,
  tenantRoot,
  publicProductCards,
  categoryCards,
  accountCards,
  policySupportCards,
  contextualLinks = [],
}: {
  page: string;
  canonicalUrl: string;
  tenantRoot: string;
  publicProductCards: Array<{ id: string; displayName: string }>;
  categoryCards: Array<{ name: string; slug?: string }>;
  accountCards: Array<{ title: string; href?: string }>;
  policySupportCards: Array<{ title: string; href?: string }>;
  contextualLinks?: ShopSeoLink[];
}) {
  const listItems =
    page === "" || page === "products" || page === "favorites"
      ? publicProductCards.slice(0, 20).map((item) => ({
          itemType: "Product",
          name: item.displayName,
          url: absoluteShopUrl(`${tenantRoot}/product/${item.id}`),
          entityId: `${absoluteShopUrl(`${tenantRoot}/product/${item.id}`)}#product`,
        }))
      : page === "categories"
        ? categoryCards.slice(0, 20).map((item) => ({
            itemType: "CollectionPage",
            name: item.name,
            url: absoluteShopUrl(`${tenantRoot}/products?category=${encodeURIComponent(item.slug ?? item.name)}`),
            entityId: `${absoluteShopUrl(`${tenantRoot}/products?category=${encodeURIComponent(item.slug ?? item.name)}`)}#collection`,
          }))
        : ["mypage", "account", "login", "register"].includes(page)
          ? accountCards.map((item) => ({
              itemType: "WebPage",
              name: item.title,
              url: item.href ? absoluteShopUrl(item.href) : "",
              entityId: item.href ? `${absoluteShopUrl(item.href)}#webpage` : "",
            })).filter((item) => item.url)
          : ["contact", "legal", "privacy", "shipping", "returns", "faq"].includes(page)
            ? policySupportCards.map((item) => ({
                itemType: "WebPage",
                name: item.title,
                url: item.href ? absoluteShopUrl(item.href) : "",
                entityId: item.href ? `${absoluteShopUrl(item.href)}#webpage` : "",
              })).filter((item) => item.url)
            : contextualLinks.map((item) => ({
                itemType: "WebPage",
                name: item.label,
                url: item.href ? absoluteShopUrl(item.href) : "",
                entityId: item.href ? `${absoluteShopUrl(item.href)}#webpage` : "",
              })).filter((item) => item.url);

  if (!listItems.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": shopItemListEntityId(canonicalUrl),
    name: page === "" ? "ストアTOPの商品導線" : `${page} 関連導線`,
    url: canonicalUrl,
    numberOfItems: listItems.length,
    mainEntityOfPage: {
      "@id": shopWebPageEntityId(canonicalUrl),
    },
    itemListElement: listItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
      item: {
        "@type": item.itemType,
        "@id": item.entityId,
        name: item.name,
        url: item.url,
      },
    })),
  };
}
