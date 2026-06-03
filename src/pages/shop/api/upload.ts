import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { ProductApiError, productError, productJson, textValue, withTenant } from "@/lib/server/productMasterApi";
import { buildShopImageSeoKey } from "@/lib/server/shopImageSeo";

export const prerender = false;

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const form = await request.formData();
    const file = form.get("file");
    const purpose = normalizePurpose(textValue(form.get("purpose"), "purpose", { maxLength: 40 }) || "misc");
    const productTitle = textValue(form.get("productTitle"), "productTitle", { maxLength: 180 });
    const altText = textValue(form.get("altText"), "altText", { maxLength: 240 });
    const keywords = textValue(form.get("keywords"), "keywords", { maxLength: 500 });

    if (!(file instanceof File)) {
      throw new ProductApiError("file is required.", 400);
    }
    if (file.size <= 0) {
      throw new ProductApiError("file is empty.", 400);
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new ProductApiError("file is too large. Maximum size is 8MB.", 413);
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      throw new ProductApiError("Only JPEG, PNG, WebP, and GIF images are supported.", 415);
    }

    const headerBytes = await file.slice(0, 512 * 1024).arrayBuffer();
    const seo = buildShopImageSeoKey({
      tenantId: tenant.tenantId,
      purpose,
      originalName: file.name || "upload",
      contentType: file.type,
      bytes: headerBytes,
      productTitle,
      altText,
      keywords,
    });

    await env.SHOP_STORAGE.put(seo.key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
      },
      customMetadata: {
        tenantId: tenant.tenantId,
        purpose,
        originalName: file.name,
        seoFileName: seo.fileName,
        seoSlug: seo.slug,
        preferredDeliveryFormat: seo.deliveryFormat,
        minRecommendedWidth: "500",
        minRecommendedHeight: "500",
        detectedWidth: seo.dimensions?.width ? String(seo.dimensions.width) : "",
        detectedHeight: seo.dimensions?.height ? String(seo.dimensions.height) : "",
        meetsRecommendedSize: seo.meetsRecommendedSize === null ? "unknown" : String(seo.meetsRecommendedSize),
      },
    });

    return productJson({
      success: true,
      key: seo.key,
      url: `/shop/api/assets/${seo.key}`,
      contentType: file.type,
      size: file.size,
      originalName: file.name,
      seo: {
        optimized: true,
        fileName: seo.fileName,
        deliveryFormat: seo.deliveryFormat,
        minWidth: 500,
        minHeight: 500,
        dimensions: seo.dimensions,
        meetsRecommendedSize: seo.meetsRecommendedSize,
        message: seo.message,
      },
    });
  } catch (error) {
    return productError(error);
  }
};

function normalizePurpose(value: string): "product" | "document-logo" | "misc" {
  if (value === "product" || value === "document-logo") return value;
  return "misc";
}
