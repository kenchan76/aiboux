import type { APIRoute } from "astro";
import { productJson } from "@/lib/server/productMasterApi";

export const prerender = false;

const googleCategories = [
  { id: "1604", name: "Apparel & Accessories > Clothing", keywords: ["アパレル", "衣類", "服", "tシャツ", "パーカー", "clothing"] },
  { id: "212", name: "Apparel & Accessories > Clothing > Shirts & Tops", keywords: ["シャツ", "トップス", "tシャツ", "shirt", "tops"] },
  { id: "203", name: "Apparel & Accessories > Clothing > Outerwear", keywords: ["パーカー", "アウター", "hoodie", "outerwear"] },
  { id: "5181", name: "Luggage & Bags > Shopping Totes", keywords: ["バッグ", "トート", "鞄", "bag", "tote"] },
  { id: "536", name: "Home & Garden", keywords: ["生活雑貨", "ホーム", "home", "garden"] },
  { id: "563", name: "Home & Garden > Kitchen & Dining", keywords: ["キッチン", "ボトル", "水筒", "dining", "bottle"] },
  { id: "173", name: "Apparel & Accessories > Clothing Accessories > Hats", keywords: ["帽子", "キャップ", "hat", "cap"] },
  { id: "166", name: "Apparel & Accessories > Handbags, Wallets & Cases", keywords: ["財布", "ポーチ", "ケース", "wallet"] },
];

export const GET: APIRoute = async ({ url }) => {
  const query = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const suggestions = googleCategories
    .filter((category) => {
      if (!query) return true;
      return [category.id, category.name, ...category.keywords].some((value) => value.toLowerCase().includes(query));
    })
    .slice(0, 6);

  return productJson({ success: true, suggestions });
};
