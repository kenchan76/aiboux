export type StorefrontBlockType = "hero" | "featuredProducts" | "trustBar" | "categoryLinks";

export type StorefrontBlock = {
  id: string;
  type: StorefrontBlockType;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  productLimit?: number;
  items?: string[];
};

export type StorefrontLayout = {
  version: 1;
  blocks: StorefrontBlock[];
};

const allowedBlockTypes = new Set<StorefrontBlockType>(["hero", "featuredProducts", "trustBar", "categoryLinks"]);

export const defaultStorefrontLayout: StorefrontLayout = {
  version: 1,
  blocks: [
    {
      id: "hero-main",
      type: "hero",
      title: "毎日にちょうどいい商品を、わかりやすく。",
      subtitle: "AIBOUX Mallで公開中の商品を、すぐに見つけて購入できます。",
      ctaLabel: "商品を見る",
      ctaHref: "#products",
    },
    {
      id: "trust-default",
      type: "trustBar",
      title: "安心して選べるストア",
      items: ["税込価格表示", "在庫状況を表示", "出店者情報を明記"],
    },
    {
      id: "featured-products",
      type: "featuredProducts",
      title: "おすすめ商品",
      subtitle: "いま購入できる公開商品を表示します。",
      productLimit: 6,
    },
  ],
};

export function sanitizeStorefrontLayout(value: unknown): StorefrontLayout {
  const source = isRecord(value) ? value : {};
  const rawBlocks = Array.isArray(source.blocks) ? source.blocks : defaultStorefrontLayout.blocks;
  const blocks = rawBlocks
    .map((block, index) => sanitizeBlock(block, index))
    .filter((block): block is StorefrontBlock => Boolean(block))
    .slice(0, 12);

  return {
    version: 1,
    blocks: blocks.length > 0 ? blocks : defaultStorefrontLayout.blocks,
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

function sanitizeBlock(value: unknown, index: number): StorefrontBlock | null {
  if (!isRecord(value)) return null;
  const type = typeof value.type === "string" && allowedBlockTypes.has(value.type as StorefrontBlockType)
    ? (value.type as StorefrontBlockType)
    : null;
  if (!type) return null;

  const fallback = defaultBlockForType(type, index);
  return {
    id: sanitizeId(value.id, fallback.id),
    type,
    title: sanitizeText(value.title, fallback.title, 80),
    subtitle: sanitizeText(value.subtitle, fallback.subtitle ?? "", 180),
    ctaLabel: sanitizeText(value.ctaLabel, fallback.ctaLabel ?? "", 32),
    ctaHref: sanitizeHref(value.ctaHref, fallback.ctaHref ?? ""),
    imageUrl: sanitizeImageUrl(value.imageUrl),
    productLimit: sanitizeLimit(value.productLimit, fallback.productLimit ?? 6),
    items: sanitizeItems(value.items, fallback.items ?? []),
  };
}

function defaultBlockForType(type: StorefrontBlockType, index: number): StorefrontBlock {
  if (type === "hero") return { id: `hero-${index}`, type, title: "ストアの見出し", subtitle: "商品の魅力を短く伝えます。", ctaLabel: "商品を見る", ctaHref: "#products" };
  if (type === "featuredProducts") return { id: `featured-${index}`, type, title: "おすすめ商品", subtitle: "公開中の商品を表示します。", productLimit: 6 };
  if (type === "trustBar") return { id: `trust-${index}`, type, title: "安心して購入できます", items: ["税込価格表示", "在庫状況を表示", "出店者情報を明記"] };
  return { id: `categories-${index}`, type, title: "カテゴリから探す", items: ["日用品", "ギフト", "生活雑貨"] };
}

function sanitizeId(value: unknown, fallback: string): string {
  const text = typeof value === "string" ? value.trim() : "";
  return /^[a-zA-Z0-9_-]{3,64}$/.test(text) ? text : fallback;
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
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return "";
  if (text.startsWith("/shop/api/assets/") || text.startsWith("https://")) return text.slice(0, 500);
  return "";
}

function sanitizeLimit(value: unknown, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.trunc(parsed), 1), 12);
}

function sanitizeItems(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback.slice(0, 6);
  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().replace(/\s+/g, " ").slice(0, 48))
    .filter(Boolean)
    .slice(0, 6);
  return items.length > 0 ? items : fallback.slice(0, 6);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
