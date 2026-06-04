export type ShopBreadcrumbItem = {
  name: string;
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

export function absoluteShopUrl(path: string): string {
  return new URL(path, SHOP_ORIGIN).toString();
}

export function normalizeShopSeoDescription(value: string, fallback: string): string {
  const normalized = String(value || fallback).replace(/\s+/g, " ").trim();
  const description = normalized || fallback;
  return description.length > 155 ? `${description.slice(0, 152)}...` : description;
}

export function normalizeShopSeoImageUrl(value?: string | null): string {
  if (!value) return DEFAULT_SHOP_OG_IMAGE;
  return new URL(value, SHOP_ORIGIN).toString();
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

  return [...publicPages, ...productPages].map((entry) => ({
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
    items.push({
      name: categoryName,
      href: `${tenantRoot}/products?category=${encodeURIComponent(categoryName)}`,
      url: absoluteShopUrl(`${tenantRoot}/products?category=${encodeURIComponent(categoryName)}`),
    });
    items.push({ name: product.displayName, href: "", url: canonicalUrl });
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
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: storeName,
    url: absoluteTenantRoot,
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteTenantRoot}products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
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
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
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

export function buildShopProductJsonLd({
  product,
  canonicalUrl,
  storeName,
  fallbackDescription,
}: {
  product: ShopSeoProduct | null;
  canonicalUrl: string;
  storeName: string;
  fallbackDescription: string;
}) {
  if (!product) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.displayName,
    image: [product.imageUrl],
    description: product.description || product.seoDescription || fallbackDescription,
    sku: product.sku,
    category: product.categoryName,
    brand: {
      "@type": "Brand",
      name: storeName,
    },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "JPY",
      price: String(product.salePrice),
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
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
}: {
  page: string;
  canonicalUrl: string;
  tenantRoot: string;
  publicProductCards: Array<{ id: string; displayName: string }>;
  categoryCards: Array<{ name: string; slug?: string }>;
  accountCards: Array<{ title: string; href: string }>;
  policySupportCards: Array<{ title: string; href: string }>;
}) {
  const listItems =
    page === "" || page === "products" || page === "favorites"
      ? publicProductCards.slice(0, 20).map((item) => ({
          name: item.displayName,
          url: absoluteShopUrl(`${tenantRoot}/product/${item.id}`),
        }))
      : page === "categories"
        ? categoryCards.slice(0, 20).map((item) => ({
            name: item.name,
            url: absoluteShopUrl(`${tenantRoot}/products?category=${encodeURIComponent(item.slug ?? item.name)}`),
          }))
        : ["mypage", "account", "login", "register"].includes(page)
          ? accountCards.map((item) => ({
              name: item.title,
              url: absoluteShopUrl(item.href),
            }))
          : ["contact", "legal", "privacy", "shipping", "returns", "faq"].includes(page)
            ? policySupportCards.map((item) => ({
                name: item.title,
                url: absoluteShopUrl(item.href),
              }))
            : [];

  if (!listItems.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: canonicalUrl,
    itemListElement: listItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}
