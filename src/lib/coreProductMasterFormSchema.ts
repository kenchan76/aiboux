import { z } from "zod";

const optionalJan = z
  .string()
  .trim()
  .transform((value) => value.replace(/\D/g, ""))
  .refine((value) => value === "" || /^\d{8,14}$/.test(value), "JANは8〜14桁の数字で入力してください。");

export const coreProductSkuSchema = z.object({
  id: z.string().trim().optional().default(""),
  skuCode: z.string().trim().min(1, "SKUコードは必須です。").max(80, "SKUコードは80文字以内です。"),
  variantName: z.string().trim().min(1, "バリエーション名は必須です。").max(120, "バリエーション名は120文字以内です。"),
  janCode: optionalJan.default(""),
  stockQuantity: z.coerce.number().int("在庫数は整数で入力してください。").min(0, "在庫数は0以上です。"),
  salePrice: z.coerce.number().int("販売価格は整数で入力してください。").min(0, "販売価格は0以上です。"),
  shopPublishEnabled: z.coerce.boolean().default(false),
});

export const coreProductMasterFormSchema = z
  .object({
    id: z.string().trim().optional().default(""),
    productName: z.string().trim().min(1, "商品名は必須です。").max(180, "商品名は180文字以内です。"),
    janCode: optionalJan.default(""),
    standardPrice: z.coerce.number().int("標準価格は整数で入力してください。").min(0, "標準価格は0以上です。"),
    status: z.enum(["draft", "active", "paused", "discontinued", "archived"]).default("active"),
    unit: z.string().trim().min(1, "単位は必須です。").max(24, "単位は24文字以内です。").default("個"),
    description: z.string().trim().max(2000, "説明は2000文字以内です。").default(""),
    memo: z.string().trim().max(1000, "メモは1000文字以内です。").default(""),
    shopName: z.string().trim().min(1, "Shop名は必須です。").max(120, "Shop名は120文字以内です。").default("AIBOUX STORE"),
    shopSyncEnabled: z.coerce.boolean().default(true),
    skus: z.array(coreProductSkuSchema).min(1, "SKUは1行以上必要です。").max(100, "SKUは100行以内です。"),
    actorId: z.string().trim().max(120).optional().default(""),
  })
  .superRefine((value, ctx) => {
    const seen = new Set<string>();
    value.skus.forEach((sku, index) => {
      const key = sku.skuCode.toLowerCase();
      if (seen.has(key)) {
        ctx.addIssue({
          code: "custom",
          path: ["skus", index, "skuCode"],
          message: "同じSKUコードがフォーム内にあります。",
        });
      }
      seen.add(key);
    });
  });

export type CoreProductMasterFormValues = z.infer<typeof coreProductMasterFormSchema>;
