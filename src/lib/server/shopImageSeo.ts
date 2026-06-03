export type ShopImagePurpose = "product" | "document-logo" | "misc";

export type ImageDimensions = {
  width: number;
  height: number;
};

export type ShopImageSeoResult = {
  key: string;
  fileName: string;
  slug: string;
  deliveryFormat: "webp" | "source";
  dimensions: ImageDimensions | null;
  meetsRecommendedSize: boolean | null;
  message: string;
};

const GENERIC_BASENAMES = new Set([
  "image",
  "img",
  "photo",
  "picture",
  "upload",
  "file",
  "screenshot",
  "dsc",
  "dcim",
]);

const JP_CONTEXT_DICTIONARY: Array<[RegExp, string]> = [
  [/黒|ブラック/i, "black"],
  [/白|ホワイト/i, "white"],
  [/茶|ブラウン/i, "brown"],
  [/革|レザー/i, "leather"],
  [/財布|ウォレット/i, "wallet"],
  [/バッグ|鞄/i, "bag"],
  [/トート/i, "tote"],
  [/シャツ/i, "shirt"],
  [/パーカー/i, "hoodie"],
  [/ボトル/i, "bottle"],
  [/キャップ|帽子/i, "cap"],
  [/前|正面|フロント/i, "front"],
  [/背面|バック/i, "back"],
  [/詳細|ディテール/i, "detail"],
];

export function buildShopImageSeoKey(input: {
  tenantId: string;
  purpose: ShopImagePurpose;
  originalName: string;
  contentType: string;
  bytes: ArrayBuffer;
  productTitle?: string;
  altText?: string;
  keywords?: string;
}): ShopImageSeoResult {
  const extension = extensionForContentType(input.contentType, input.originalName);
  const slug = buildSeoSlug({
    originalName: input.originalName,
    productTitle: input.productTitle,
    altText: input.altText,
    keywords: input.keywords,
  });
  const fileName = `${slug}.${extension}`;
  const key = [
    input.tenantId,
    "shop",
    input.purpose,
    "seo",
    new Date().toISOString().slice(0, 10),
    `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${fileName}`,
  ].join("/");
  const dimensions = readImageDimensions(input.contentType, input.bytes);
  const meetsRecommendedSize = dimensions ? dimensions.width >= 500 && dimensions.height >= 500 : null;

  return {
    key,
    fileName,
    slug,
    deliveryFormat: preferredDeliveryFormat(input.contentType),
    dimensions,
    meetsRecommendedSize,
    message: "検索エンジン向けに画像名と配信メタデータを自動調整しました。",
  };
}

function buildSeoSlug(input: {
  originalName: string;
  productTitle?: string;
  altText?: string;
  keywords?: string;
}): string {
  const originalBase = input.originalName.replace(/\.[^.]+$/, "");
  const context = [input.productTitle, input.altText, input.keywords, originalBase].filter(Boolean).join(" ");
  const asciiTokens = context
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 2 && !GENERIC_BASENAMES.has(token))
    .slice(0, 8);
  const dictionaryTokens = JP_CONTEXT_DICTIONARY.filter(([pattern]) => pattern.test(context)).map(([, token]) => token);
  const tokens = Array.from(new Set([...dictionaryTokens, ...asciiTokens])).slice(0, 8);

  if (tokens.length) return tokens.join("-").slice(0, 96);
  return "product-image";
}

function extensionForContentType(contentType: string, originalName: string): string {
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/png") return "png";
  if (contentType === "image/gif") return "gif";
  if (contentType === "image/svg+xml") return "svg";
  const extension = originalName.toLowerCase().match(/\.([a-z0-9]{2,5})$/)?.[1];
  return extension || "jpg";
}

function preferredDeliveryFormat(contentType: string): "webp" | "source" {
  return contentType === "image/svg+xml" || contentType === "image/gif" ? "source" : "webp";
}

function readImageDimensions(contentType: string, bytes: ArrayBuffer): ImageDimensions | null {
  const view = new DataView(bytes);
  if (contentType === "image/png" && view.byteLength >= 24) {
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }
  if (contentType === "image/jpeg") return readJpegDimensions(view);
  if (contentType === "image/webp") return readWebpDimensions(view);
  return null;
}

function readJpegDimensions(view: DataView): ImageDimensions | null {
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return null;
  let offset = 2;
  while (offset + 9 < view.byteLength) {
    if (view.getUint8(offset) !== 0xff) return null;
    const marker = view.getUint8(offset + 1);
    const length = view.getUint16(offset + 2);
    if (length < 2) return null;
    if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb)) {
      return { width: view.getUint16(offset + 7), height: view.getUint16(offset + 5) };
    }
    offset += 2 + length;
  }
  return null;
}

function readWebpDimensions(view: DataView): ImageDimensions | null {
  if (view.byteLength < 30 || readAscii(view, 0, 4) !== "RIFF" || readAscii(view, 8, 4) !== "WEBP") return null;
  const chunk = readAscii(view, 12, 4);
  if (chunk === "VP8X" && view.byteLength >= 30) {
    return {
      width: 1 + readUint24LittleEndian(view, 24),
      height: 1 + readUint24LittleEndian(view, 27),
    };
  }
  if (chunk === "VP8 " && view.byteLength >= 30) {
    return {
      width: view.getUint16(26, true) & 0x3fff,
      height: view.getUint16(28, true) & 0x3fff,
    };
  }
  if (chunk === "VP8L" && view.byteLength >= 25) {
    const bits = view.getUint32(21, true);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }
  return null;
}

function readAscii(view: DataView, offset: number, length: number): string {
  let value = "";
  for (let index = 0; index < length; index += 1) {
    value += String.fromCharCode(view.getUint8(offset + index));
  }
  return value;
}

function readUint24LittleEndian(view: DataView, offset: number): number {
  return view.getUint8(offset) | (view.getUint8(offset + 1) << 8) | (view.getUint8(offset + 2) << 16);
}
