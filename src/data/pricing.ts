export type FilePricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  limitations?: string[];
  cta: string;
  highlighted?: boolean;
};

export const filePricingPlans: FilePricingPlan[] = [
  {
    name: "無料プラン",
    price: "¥0",
    description: "会員登録なしで、ファイル転送と基本ツールをすぐ使えます。",
    features: [
      "最大5GBまで送信可能",
      "PDF/画像ツール利用可能",
      "QR/バーコード作成可能",
      "共有リンク作成",
      "保存期間を選択",
    ],
    limitations: ["広告あり", "送受信履歴なし", "保存管理なし"],
    cta: "無料で始める",
  },
  {
    name: "Plus Lite",
    price: "¥500/月",
    description: "履歴管理と広告なしで、日々のファイル業務をすっきり残せます。",
    features: [
      "広告なし",
      "送信・受信履歴",
      "変換履歴",
      "再ダウンロード",
      "再共有",
      "保存容量50GB",
      "AIBOUX Core / Mail / Shop連携予定",
    ],
    cta: "Plus Liteにアップグレード",
    highlighted: true,
  },
];
