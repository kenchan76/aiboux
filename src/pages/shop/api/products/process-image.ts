import type { APIRoute } from "astro";
import { productJson, readJsonBody, textValue } from "@/lib/server/productMasterApi";

export const prerender = false;

type ProcessImageBody = {
  imageName?: unknown;
  imageKey?: unknown;
  productTitle?: unknown;
};

export const POST: APIRoute = async ({ request }) => {
  const body = await readJsonBody<ProcessImageBody>(request);
  const imageName = textValue(body.imageName, "imageName", { maxLength: 180 }) || "product-image.jpg";
  const imageKey = textValue(body.imageKey, "imageKey", { maxLength: 260 }) || `mock-upload/${sanitizeFileName(imageName)}`;
  const productTitle = textValue(body.productTitle, "productTitle", { maxLength: 180 }) || "AIBOUXの商品";

  await new Promise((resolve) => setTimeout(resolve, 1200));

  return productJson({
    success: true,
    source: "ai-processing-mock",
    processedImageKey: imageKey,
    altText: `${productTitle}の商品画像。白背景で商品全体が見やすく、EC掲載に適した構図。`,
  });
};

function sanitizeFileName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}
