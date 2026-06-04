export type LogoConfig = {
  imageUrl: string | null;
  darkImageUrl?: string | null;
  alt: string;
  displayMode: "image" | "imageWithStoreName" | "storeNameOnly";
  desktopWidth: number;
  mobileWidth: number;
  alignment: "left" | "center";
  linkType: "home" | "custom";
  customUrl?: string;
};

export type HeaderDesignConfig = {
  deliveryText: string;
  shippingText: string;
  helpText: string;
  noticeText: string;
  searchPlaceholder: string;
};

export type NavigationConfig = {
  items: string[];
};

export type ThemeConfig = {
  accentColor: string;
  buttonRadius: number;
};

export type ProductCardConfig = {
  showRating: boolean;
  showTaxLabel: boolean;
  columnsDesktop: number;
};

export type SectionVisibilityConfig = {
  enabled: boolean;
  title: string;
  limit?: number;
};

export type TopPageDesignConfig = {
  heroSlider: {
    slides: Array<{
      id: string;
      title: string;
      subtitle: string;
      imageUrl: string;
      mobileImageUrl?: string;
      ctaText: string;
      ctaHref: string;
      enabled: boolean;
    }>;
    autoplay: boolean;
    intervalSeconds: number;
    loop: boolean;
    showArrows: boolean;
    showDots: boolean;
    sidePreviewRatio: number;
  };
  sections: {
    recommendedProducts: SectionVisibilityConfig;
    ranking: SectionVisibilityConfig;
    timeSale: SectionVisibilityConfig;
    categories: SectionVisibilityConfig;
    brands: SectionVisibilityConfig;
    recentlyViewed: SectionVisibilityConfig;
  };
};

export type ProductDetailPageDesignConfig = {
  gallery: {
    position: "left" | "top";
    thumbnailCount: number;
    zoomEnabled: boolean;
  };
  content: {
    showBrand: boolean;
    showReviews: boolean;
    showPoints: boolean;
    showDeliveryEstimate: boolean;
    showStock: boolean;
    showVariations: boolean;
    showSpecs: boolean;
    showRelatedProducts: boolean;
  };
  purchaseBox: {
    sticky: boolean;
    showQuantity: boolean;
    cartButtonText: string;
    buyNowButtonText: string;
  };
};

export type StorefrontLayout = {
  version: 1;
  tenantSlug?: string;
  global: {
    header: HeaderDesignConfig;
    logo: LogoConfig;
    navigation: NavigationConfig;
    theme: ThemeConfig;
    productCard: ProductCardConfig;
  };
  pages: {
    top: TopPageDesignConfig;
    productDetail: ProductDetailPageDesignConfig;
  };
};

type LegacyStorefrontBlock = {
  id?: unknown;
  type?: unknown;
  title?: unknown;
  subtitle?: unknown;
  ctaLabel?: unknown;
  ctaHref?: unknown;
  imageUrl?: unknown;
  productLimit?: unknown;
  items?: unknown;
};

export const defaultStorefrontLayout: StorefrontLayout = {
  version: 1,
  tenantSlug: "aiboux",
  global: {
    header: {
      deliveryText: "お届け先: 東京都 千代田区",
      shippingText: "送料無料は ¥2,000",
      helpText: "ヘルプ・サポート",
      noticeText: "お知らせ",
      searchPlaceholder: "キーワード・商品名・ブランド名で検索",
    },
    logo: {
      imageUrl: null,
      darkImageUrl: null,
      alt: "AIBOUX Store",
      displayMode: "storeNameOnly",
      desktopWidth: 128,
      mobileWidth: 96,
      alignment: "left",
      linkType: "home",
      customUrl: "",
    },
    navigation: {
      items: ["食品・お菓子", "日用品", "家電", "ファッション", "ビューティー", "ペット用品", "スポーツ・アウトドア", "本・文具", "セール", "ランキング"],
    },
    theme: {
      accentColor: "#f59e0b",
      buttonRadius: 8,
    },
    productCard: {
      showRating: true,
      showTaxLabel: true,
      columnsDesktop: 5,
    },
  },
  pages: {
    top: {
      heroSlider: {
        slides: [
          {
            id: "slide-main",
            title: "上質な暮らしを、もっと身近に。",
            subtitle: "こだわりのアイテムをお届けします。",
            imageUrl: "",
            ctaText: "今すぐ見る",
            ctaHref: "/s/aiboux/products",
            enabled: true,
          },
          {
            id: "slide-daily",
            title: "毎日の暮らしに、ちょっとした贅沢を。",
            subtitle: "使いやすい日用品を選びやすく。",
            imageUrl: "",
            ctaText: "商品を見る",
            ctaHref: "/s/aiboux/products",
            enabled: true,
          },
          {
            id: "slide-season",
            title: "新しい季節を、心地よく。",
            subtitle: "人気商品と定番商品をまとめて確認できます。",
            imageUrl: "",
            ctaText: "おすすめへ",
            ctaHref: "/s/aiboux/products",
            enabled: true,
          },
        ],
        autoplay: true,
        intervalSeconds: 5,
        loop: true,
        showArrows: true,
        showDots: true,
        sidePreviewRatio: 0.28,
      },
      sections: {
        recommendedProducts: { enabled: true, title: "おすすめ商品", limit: 5 },
        ranking: { enabled: true, title: "売れ筋ランキング", limit: 3 },
        timeSale: { enabled: true, title: "タイムセール", limit: 3 },
        categories: { enabled: true, title: "カテゴリー一覧", limit: 6 },
        brands: { enabled: true, title: "人気ブランド", limit: 6 },
        recentlyViewed: { enabled: true, title: "最近チェックした商品", limit: 5 },
      },
    },
    productDetail: {
      gallery: {
        position: "left",
        thumbnailCount: 5,
        zoomEnabled: true,
      },
      content: {
        showBrand: true,
        showReviews: true,
        showPoints: true,
        showDeliveryEstimate: true,
        showStock: true,
        showVariations: true,
        showSpecs: true,
        showRelatedProducts: true,
      },
      purchaseBox: {
        sticky: true,
        showQuantity: true,
        cartButtonText: "カートに入れる",
        buyNowButtonText: "今すぐ購入",
      },
    },
  },
};

export function sanitizeStorefrontLayout(value: unknown): StorefrontLayout {
  const source = isRecord(value) ? value : {};
  const legacyBlocks = Array.isArray(source.blocks) ? source.blocks : [];
  const legacy = legacyBlocks.length ? legacyToLayout(legacyBlocks) : defaultStorefrontLayout;
  const globalSource = isRecord(source.global) ? source.global : legacy.global;
  const pagesSource = isRecord(source.pages) ? source.pages : legacy.pages;

  return {
    version: 1,
    tenantSlug: sanitizeText(source.tenantSlug, "aiboux", 80),
    global: {
      header: sanitizeHeader(isRecord(globalSource.header) ? globalSource.header : legacy.global.header),
      logo: sanitizeLogo(isRecord(globalSource.logo) ? globalSource.logo : legacy.global.logo),
      navigation: sanitizeNavigation(isRecord(globalSource.navigation) ? globalSource.navigation : legacy.global.navigation),
      theme: sanitizeTheme(isRecord(globalSource.theme) ? globalSource.theme : legacy.global.theme),
      productCard: sanitizeProductCard(isRecord(globalSource.productCard) ? globalSource.productCard : legacy.global.productCard),
    },
    pages: {
      top: sanitizeTopPage(isRecord(pagesSource.top) ? pagesSource.top : legacy.pages.top),
      productDetail: sanitizeProductDetail(isRecord(pagesSource.productDetail) ? pagesSource.productDetail : legacy.pages.productDetail),
    },
  };
}

export function parseStorefrontLayoutJson(value: string | null | undefined): StorefrontLayout {
  if (!value) return defaultStorefrontLayout;
  try {
    return sanitizeStorefrontLayout(JSON.parse(value));
  } catch {
    return defaultStorefrontLayout;
  }
}

export function stringifyStorefrontLayout(layout: StorefrontLayout): string {
  return JSON.stringify(sanitizeStorefrontLayout(layout));
}

function legacyToLayout(blocks: unknown[]): StorefrontLayout {
  const layout = structuredClone(defaultStorefrontLayout) as StorefrontLayout;
  const legacyHero = blocks.find((block): block is LegacyStorefrontBlock => isRecord(block) && block.type === "hero");
  const legacyFeatured = blocks.find((block): block is LegacyStorefrontBlock => isRecord(block) && block.type === "featuredProducts");
  const legacyCategory = blocks.find((block): block is LegacyStorefrontBlock => isRecord(block) && block.type === "categoryLinks");

  if (legacyHero) {
    layout.pages.top.heroSlider.slides[0] = {
      ...layout.pages.top.heroSlider.slides[0],
      title: sanitizeText(legacyHero.title, layout.pages.top.heroSlider.slides[0].title, 90),
      subtitle: sanitizeText(legacyHero.subtitle, layout.pages.top.heroSlider.slides[0].subtitle, 160),
      imageUrl: sanitizeImageUrl(legacyHero.imageUrl),
      ctaText: sanitizeText(legacyHero.ctaLabel, layout.pages.top.heroSlider.slides[0].ctaText, 32),
      ctaHref: sanitizeHref(legacyHero.ctaHref, layout.pages.top.heroSlider.slides[0].ctaHref),
    };
  }

  if (legacyFeatured) {
    layout.pages.top.sections.recommendedProducts.title = sanitizeText(legacyFeatured.title, "おすすめ商品", 40);
    layout.pages.top.sections.recommendedProducts.limit = sanitizeNumber(legacyFeatured.productLimit, 5, 1, 12);
  }

  if (legacyCategory && Array.isArray(legacyCategory.items)) {
    layout.global.navigation.items = sanitizeItems(legacyCategory.items, layout.global.navigation.items, 10);
  }

  return layout;
}

function sanitizeHeader(value: Record<string, unknown>): HeaderDesignConfig {
  return {
    deliveryText: sanitizeText(value.deliveryText, defaultStorefrontLayout.global.header.deliveryText, 48),
    shippingText: sanitizeText(value.shippingText, defaultStorefrontLayout.global.header.shippingText, 48),
    helpText: sanitizeText(value.helpText, defaultStorefrontLayout.global.header.helpText, 40),
    noticeText: sanitizeText(value.noticeText, defaultStorefrontLayout.global.header.noticeText, 40),
    searchPlaceholder: sanitizeText(value.searchPlaceholder, defaultStorefrontLayout.global.header.searchPlaceholder, 80),
  };
}

function sanitizeLogo(value: Record<string, unknown>): LogoConfig {
  const displayMode = ["image", "imageWithStoreName", "storeNameOnly"].includes(String(value.displayMode))
    ? (value.displayMode as LogoConfig["displayMode"])
    : defaultStorefrontLayout.global.logo.displayMode;
  const alignment = value.alignment === "center" ? "center" : "left";
  const linkType = value.linkType === "custom" ? "custom" : "home";

  return {
    imageUrl: sanitizeNullableImageUrl(value.imageUrl),
    darkImageUrl: sanitizeNullableImageUrl(value.darkImageUrl),
    alt: sanitizeText(value.alt, defaultStorefrontLayout.global.logo.alt, 80),
    displayMode,
    desktopWidth: sanitizeNumber(value.desktopWidth, defaultStorefrontLayout.global.logo.desktopWidth, 48, 240),
    mobileWidth: sanitizeNumber(value.mobileWidth, defaultStorefrontLayout.global.logo.mobileWidth, 40, 180),
    alignment,
    linkType,
    customUrl: sanitizeHref(value.customUrl, ""),
  };
}

function sanitizeNavigation(value: Record<string, unknown>): NavigationConfig {
  return {
    items: sanitizeItems(value.items, defaultStorefrontLayout.global.navigation.items, 12),
  };
}

function sanitizeTheme(value: Record<string, unknown>): ThemeConfig {
  return {
    accentColor: sanitizeColor(value.accentColor, defaultStorefrontLayout.global.theme.accentColor),
    buttonRadius: sanitizeNumber(value.buttonRadius, defaultStorefrontLayout.global.theme.buttonRadius, 0, 16),
  };
}

function sanitizeProductCard(value: Record<string, unknown>): ProductCardConfig {
  return {
    showRating: sanitizeBoolean(value.showRating, defaultStorefrontLayout.global.productCard.showRating),
    showTaxLabel: sanitizeBoolean(value.showTaxLabel, defaultStorefrontLayout.global.productCard.showTaxLabel),
    columnsDesktop: sanitizeNumber(value.columnsDesktop, defaultStorefrontLayout.global.productCard.columnsDesktop, 3, 6),
  };
}

function sanitizeTopPage(value: Record<string, unknown>): TopPageDesignConfig {
  const hero = isRecord(value.heroSlider) ? value.heroSlider : defaultStorefrontLayout.pages.top.heroSlider;
  const rawSlides = Array.isArray(hero.slides) ? hero.slides : defaultStorefrontLayout.pages.top.heroSlider.slides;
  const sections = isRecord(value.sections) ? value.sections : defaultStorefrontLayout.pages.top.sections;

  return {
    heroSlider: {
      slides: rawSlides.map(sanitizeSlide).filter(Boolean).slice(0, 8) as TopPageDesignConfig["heroSlider"]["slides"],
      autoplay: sanitizeBoolean(hero.autoplay, defaultStorefrontLayout.pages.top.heroSlider.autoplay),
      intervalSeconds: sanitizeNumber(hero.intervalSeconds, defaultStorefrontLayout.pages.top.heroSlider.intervalSeconds, 3, 20),
      loop: sanitizeBoolean(hero.loop, defaultStorefrontLayout.pages.top.heroSlider.loop),
      showArrows: sanitizeBoolean(hero.showArrows, defaultStorefrontLayout.pages.top.heroSlider.showArrows),
      showDots: sanitizeBoolean(hero.showDots, defaultStorefrontLayout.pages.top.heroSlider.showDots),
      sidePreviewRatio: sanitizeNumber(hero.sidePreviewRatio, defaultStorefrontLayout.pages.top.heroSlider.sidePreviewRatio, 0.1, 0.4),
    },
    sections: {
      recommendedProducts: sanitizeSection(sections.recommendedProducts, defaultStorefrontLayout.pages.top.sections.recommendedProducts),
      ranking: sanitizeSection(sections.ranking, defaultStorefrontLayout.pages.top.sections.ranking),
      timeSale: sanitizeSection(sections.timeSale, defaultStorefrontLayout.pages.top.sections.timeSale),
      categories: sanitizeSection(sections.categories, defaultStorefrontLayout.pages.top.sections.categories),
      brands: sanitizeSection(sections.brands, defaultStorefrontLayout.pages.top.sections.brands),
      recentlyViewed: sanitizeSection(sections.recentlyViewed, defaultStorefrontLayout.pages.top.sections.recentlyViewed),
    },
  };
}

function sanitizeProductDetail(value: Record<string, unknown>): ProductDetailPageDesignConfig {
  const gallery = isRecord(value.gallery) ? value.gallery : defaultStorefrontLayout.pages.productDetail.gallery;
  const content = isRecord(value.content) ? value.content : defaultStorefrontLayout.pages.productDetail.content;
  const purchaseBox = isRecord(value.purchaseBox) ? value.purchaseBox : defaultStorefrontLayout.pages.productDetail.purchaseBox;

  return {
    gallery: {
      position: gallery.position === "top" ? "top" : "left",
      thumbnailCount: sanitizeNumber(gallery.thumbnailCount, defaultStorefrontLayout.pages.productDetail.gallery.thumbnailCount, 3, 8),
      zoomEnabled: sanitizeBoolean(gallery.zoomEnabled, defaultStorefrontLayout.pages.productDetail.gallery.zoomEnabled),
    },
    content: {
      showBrand: sanitizeBoolean(content.showBrand, true),
      showReviews: sanitizeBoolean(content.showReviews, true),
      showPoints: sanitizeBoolean(content.showPoints, true),
      showDeliveryEstimate: sanitizeBoolean(content.showDeliveryEstimate, true),
      showStock: sanitizeBoolean(content.showStock, true),
      showVariations: sanitizeBoolean(content.showVariations, true),
      showSpecs: sanitizeBoolean(content.showSpecs, true),
      showRelatedProducts: sanitizeBoolean(content.showRelatedProducts, true),
    },
    purchaseBox: {
      sticky: sanitizeBoolean(purchaseBox.sticky, true),
      showQuantity: sanitizeBoolean(purchaseBox.showQuantity, true),
      cartButtonText: sanitizeText(purchaseBox.cartButtonText, "カートに入れる", 28),
      buyNowButtonText: sanitizeText(purchaseBox.buyNowButtonText, "今すぐ購入", 28),
    },
  };
}

function sanitizeSlide(value: unknown, index: number): TopPageDesignConfig["heroSlider"]["slides"][number] | null {
  if (!isRecord(value)) return null;
  const fallback = defaultStorefrontLayout.pages.top.heroSlider.slides[index] ?? defaultStorefrontLayout.pages.top.heroSlider.slides[0];
  return {
    id: sanitizeId(value.id, fallback.id || `slide-${index + 1}`),
    title: sanitizeText(value.title, fallback.title, 90),
    subtitle: sanitizeText(value.subtitle, fallback.subtitle, 160),
    imageUrl: sanitizeImageUrl(value.imageUrl),
    mobileImageUrl: sanitizeImageUrl(value.mobileImageUrl),
    ctaText: sanitizeText(value.ctaText, fallback.ctaText, 32),
    ctaHref: sanitizeHref(value.ctaHref, fallback.ctaHref),
    enabled: sanitizeBoolean(value.enabled, true),
  };
}

function sanitizeSection(value: unknown, fallback: SectionVisibilityConfig): SectionVisibilityConfig {
  const source = isRecord(value) ? value : {};
  return {
    enabled: sanitizeBoolean(source.enabled, fallback.enabled),
    title: sanitizeText(source.title, fallback.title, 40),
    limit: sanitizeNumber(source.limit, fallback.limit ?? 5, 1, 12),
  };
}

function sanitizeId(value: unknown, fallback: string): string {
  const text = typeof value === "string" ? value.trim() : "";
  return /^[a-zA-Z0-9_-]{3,80}$/.test(text) ? text : fallback;
}

function sanitizeText(value: unknown, fallback: string, maxLength: number): string {
  const text = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  return (text || fallback).slice(0, maxLength);
}

function sanitizeHref(value: unknown, fallback: string): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return fallback;
  if (text.startsWith("#") || text.startsWith("/") || text.startsWith("https://")) return text.slice(0, 300);
  return fallback;
}

function sanitizeImageUrl(value: unknown): string {
  return sanitizeNullableImageUrl(value) ?? "";
}

function sanitizeNullableImageUrl(value: unknown): string | null {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return null;
  if (text.startsWith("/shop/api/assets/") || text.startsWith("https://")) return text.slice(0, 500);
  return null;
}

function sanitizeNumber(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

function sanitizeBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") return ["1", "true", "yes", "on"].includes(value.toLowerCase());
  return fallback;
}

function sanitizeItems(value: unknown, fallback: string[], max: number): string[] {
  if (!Array.isArray(value)) return fallback.slice(0, max);
  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().replace(/\s+/g, " ").slice(0, 48))
    .filter(Boolean)
    .slice(0, max);
  return items.length > 0 ? items : fallback.slice(0, max);
}

function sanitizeColor(value: unknown, fallback: string): string {
  const text = typeof value === "string" ? value.trim() : "";
  return /^#[0-9a-fA-F]{6}$/.test(text) ? text : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
