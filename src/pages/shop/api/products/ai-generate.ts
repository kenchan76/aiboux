import type { APIRoute } from "astro";
import { productJson } from "@/lib/server/productMasterApi";

export const prerender = false;

const samples = [
  {
    title: "毎日使える軽量ステンレスボトル 500ml",
    description:
      "通勤、通学、ジムまで自然に持ち運べる軽量ステンレスボトルです。保冷・保温に対応し、バッグの中でも邪魔になりにくいスリム設計。ギフトにも選びやすい、清潔感のあるミニマルなデザインです。",
    keywords: ["ステンレスボトル", "水筒", "保温", "保冷", "軽量"],
    categoryId: "home-kitchen-drinkware",
    googleShoppingCategory: "Home & Garden > Kitchen & Dining > Drinkware > Water Bottles",
  },
  {
    title: "収納しやすいオーガニックコットントート",
    description:
      "買い物や仕事用のサブバッグとして使いやすい、丈夫なオーガニックコットントートです。A4書類や小物をすっきり入れられ、折りたたんで持ち歩けるため日常使いに最適です。",
    keywords: ["トートバッグ", "オーガニックコットン", "エコバッグ", "A4対応"],
    categoryId: "apparel-accessories-bags",
    googleShoppingCategory: "Apparel & Accessories > Handbags, Wallets & Cases > Tote Bags",
  },
  {
    title: "デスクを整えるマグネット式ケーブルホルダー",
    description:
      "充電ケーブルやイヤホンを机上で見失わないためのマグネット式ケーブルホルダーです。小型ながら安定感があり、在宅ワークやオフィスの配線整理を手早く整えます。",
    keywords: ["ケーブルホルダー", "デスク収納", "配線整理", "マグネット"],
    categoryId: "electronics-cable-management",
    googleShoppingCategory: "Electronics > Electronics Accessories > Cable Management",
  },
];

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const jan = url.searchParams.get("jan")?.replace(/\D/g, "") ?? "";

  if (jan.length < 8 || jan.length > 14) {
    return productJson({ success: false, error: "JAN code must be 8 to 14 digits." }, { status: 400 });
  }

  const sample = samples[Number(jan.at(-1) ?? 0) % samples.length];

  return productJson({
    success: true,
    source: "mock",
    jan,
    product: {
      title: sample.title,
      description: `${sample.description}\n\nJAN: ${jan}`,
      keywords: sample.keywords,
      categoryId: sample.categoryId,
      googleShoppingCategory: sample.googleShoppingCategory,
    },
  });
};
