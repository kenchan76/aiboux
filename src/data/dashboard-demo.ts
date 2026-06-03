export type FileDashboardRow = {
  name: string;
  size: string;
  type: string;
  recipient: string;
  status: "送信済み" | "期限間近" | "変換済み" | "保存中";
  date: string;
};

export const dashboardRows: FileDashboardRow[] = [
  {
    name: "商品写真_2026春.zip",
    size: "1.8GB",
    type: "送信",
    recipient: "株式会社サンプル",
    status: "送信済み",
    date: "2026/05/24 09:42",
  },
  {
    name: "請求書_INV-2026-0524.pdf",
    size: "4.2MB",
    type: "PDF",
    recipient: "テスト株式会社",
    status: "保存中",
    date: "2026/05/24 09:12",
  },
  {
    name: "商品バーコード_ケース用.svg",
    size: "320KB",
    type: "バーコード",
    recipient: "社内共有",
    status: "変換済み",
    date: "2026/05/23 17:28",
  },
  {
    name: "契約書確認用_署名前.pdf",
    size: "18MB",
    type: "受信",
    recipient: "山田 太郎",
    status: "期限間近",
    date: "2026/05/22 14:05",
  },
];
