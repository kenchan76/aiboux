import {
  BarChart3,
  Boxes,
  CircleDollarSign,
  FileText,
  Gauge,
  Home,
  Package,
  Paintbrush,
  Plug,
  Settings,
  ShoppingCart,
  Tags,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ShopSection =
  | "dashboard"
  | "orders"
  | "order-detail"
  | "products"
  | "product-new"
  | "product-detail"
  | "inventory"
  | "categories"
  | "collections"
  | "collection-new"
  | "customers"
  | "customer-detail"
  | "discounts"
  | "content"
  | "analytics"
  | "apps"
  | "design"
  | "settings";

export interface ShopNavItem {
  id: ShopSection;
  label: string;
  href: string;
  icon: LucideIcon;
  count?: number;
}

export interface ShopMetric {
  id: string;
  label: string;
  value: string;
  delta: string;
  tone: "success" | "warning" | "danger" | "neutral";
  icon: LucideIcon;
}

export type PaymentStatus = "支払い済み" | "未払い" | "返金済み";
export type FulfillmentStatus = "処理中" | "発送済み" | "一部発送" | "キャンセル";
export type DeliveryStatus = "発送準備中" | "配送中" | "配達完了" | "未発送";
export type ShippingCarrier = "日本郵便" | "ヤマト運輸" | "佐川急便";

export interface ShopOrderItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

export interface ShopOrder {
  id: string;
  orderedAt: string;
  customerName: string;
  customerEmail: string;
  total: number;
  carrier?: ShippingCarrier;
  trackingNumber?: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  deliveryStatus: DeliveryStatus;
  tags: string[];
  items: ShopOrderItem[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
}

export interface ShopProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  reserved: number;
  incoming: number;
  status: "公開中" | "下書き" | "非公開";
  sales: number;
  image: string;
  tags: string[];
  variants: ProductVariant[];
  feedSync?: {
    google: "unsynced" | "syncing" | "synced" | "error";
    bing: "unsynced" | "syncing" | "synced" | "error";
    lastSyncedAt?: string;
  };
}

export interface InventoryItem {
  productId: string;
  name: string;
  sku: string;
  stock: number;
  unshippedOrders: number;
  location: string;
  status: "受注中";
}

export interface CollectionItem {
  id: string;
  name: string;
  productCount: number;
  status: "公開中" | "下書き";
  condition: string;
  sort: string;
  seo: string;
  thumbnail: string;
}

export interface ShopCustomer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  tags: string[];
  note: string;
}

export interface Discount {
  id: string;
  code: string;
  type: "割引コード" | "自動割引";
  target: string;
  value: string;
  usage: number;
  period: string;
  status: "有効" | "停止中" | "期限切れ";
}

export interface ShopAnalyticsReport {
  date: string;
  sales: number;
  previous: number;
  orders: number;
}

export interface ShopAppIntegration {
  id: string;
  name: string;
  category: string;
  status: "接続済み" | "未接続" | "確認必要";
  description: string;
}

export interface AIAction {
  id: string;
  label: string;
}

export const shopNavItems: ShopNavItem[] = [
  { id: "dashboard", label: "ダッシュボード", href: "/shop/dashboard", icon: Home },
  { id: "orders", label: "注文管理", href: "/shop/orders", icon: ShoppingCart, count: 128 },
  { id: "products", label: "商品管理", href: "/shop/products", icon: Package },
  { id: "inventory", label: "在庫", href: "/shop/inventory", icon: Boxes },
  { id: "categories", label: "カテゴリ管理", href: "/shop/categories", icon: Tags },
  { id: "customers", label: "顧客", href: "/shop/customers", icon: Users },
  { id: "content", label: "コンテンツ", href: "/shop/content", icon: FileText },
  { id: "analytics", label: "分析", href: "/shop/analytics", icon: BarChart3 },
  { id: "apps", label: "アプリ", href: "/shop/apps", icon: Plug },
  { id: "design", label: "ストアデザイン", href: "/shop/settings/design", icon: Paintbrush },
  { id: "settings", label: "設定", href: "/shop/settings", icon: Settings },
];

export const shopMetrics: ShopMetric[] = [
  { id: "sales", label: "売上", value: "¥2,340,000", delta: "前期間比 +18.5%", tone: "success", icon: CircleDollarSign },
  { id: "orders", label: "注文数", value: "245件", delta: "前期間比 +15.2%", tone: "success", icon: ShoppingCart },
  { id: "conversion", label: "コンバージョン率", value: "2.35%", delta: "前期間比 +0.48pt", tone: "success", icon: Gauge },
  { id: "aov", label: "平均注文単価", value: "¥9,551", delta: "前期間比 +2.1%", tone: "success", icon: Tags },
  { id: "repeat", label: "リピーター率", value: "28.7%", delta: "前期間比 +3.6pt", tone: "success", icon: Users },
];

export const shopProducts: ShopProduct[] = [
  {
    id: "prod-tsh-001",
    name: "オーガニックコットンTシャツ",
    sku: "TSH-001-WHT",
    category: "アパレル",
    price: 4800,
    stock: 42,
    reserved: 5,
    incoming: 30,
    status: "公開中",
    sales: 412800,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=160&h=160&fit=crop",
    tags: ["定番", "白"],
    feedSync: { google: "synced", bing: "synced", lastSyncedAt: "2026/05/28 12:20" },
    variants: [
      { id: "v-tsh-s", name: "S / ホワイト", sku: "TSH-001-WHT-S", stock: 12, price: 4800 },
      { id: "v-tsh-m", name: "M / ホワイト", sku: "TSH-001-WHT-M", stock: 18, price: 4800 },
      { id: "v-tsh-l", name: "L / ホワイト", sku: "TSH-001-WHT-L", stock: 12, price: 4800 },
    ],
  },
  {
    id: "prod-bag-001",
    name: "ミニマルトートバッグ",
    sku: "BAG-001-BLK",
    category: "バッグ",
    price: 6200,
    stock: 7,
    reserved: 2,
    incoming: 20,
    status: "公開中",
    sales: 359600,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=160&h=160&fit=crop",
    tags: ["人気", "黒"],
    feedSync: { google: "syncing", bing: "syncing" },
    variants: [{ id: "v-bag-b", name: "ブラック", sku: "BAG-001-BLK", stock: 7, price: 6200 }],
  },
  {
    id: "prod-btl-500",
    name: "ステンレスボトル 500ml",
    sku: "BTL-500-SLV",
    category: "生活雑貨",
    price: 3200,
    stock: 8,
    reserved: 4,
    incoming: 24,
    status: "公開中",
    sales: 166400,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=160&h=160&fit=crop",
    tags: ["ギフト"],
    feedSync: { google: "synced", bing: "error", lastSyncedAt: "2026/05/28 12:10" },
    variants: [{ id: "v-btl-s", name: "シルバー", sku: "BTL-500-SLV", stock: 8, price: 3200 }],
  },
  {
    id: "prod-pkr-002",
    name: "リラックスフィットパーカー",
    sku: "PKR-002-GRY",
    category: "アパレル",
    price: 7800,
    stock: 9,
    reserved: 1,
    incoming: 18,
    status: "公開中",
    sales: 296400,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=160&h=160&fit=crop",
    tags: ["季節商品"],
    feedSync: { google: "synced", bing: "synced", lastSyncedAt: "2026/05/28 11:58" },
    variants: [{ id: "v-pkr-g", name: "グレー", sku: "PKR-002-GRY", stock: 9, price: 7800 }],
  },
  {
    id: "prod-cap-001",
    name: "コットンキャップ",
    sku: "CAP-001-NVY",
    category: "帽子",
    price: 2900,
    stock: 6,
    reserved: 1,
    incoming: 12,
    status: "公開中",
    sales: 89900,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=160&h=160&fit=crop",
    tags: ["軽量"],
    feedSync: { google: "unsynced", bing: "unsynced" },
    variants: [{ id: "v-cap-n", name: "ネイビー", sku: "CAP-001-NVY", stock: 6, price: 2900 }],
  },
];

export const shopOrders: ShopOrder[] = [
  {
    id: "#10085",
    orderedAt: "2024/05/19 14:32",
    customerName: "佐藤 花子",
    customerEmail: "hanako.sato@example.jp",
    total: 12480,
    carrier: "ヤマト運輸",
    trackingNumber: "YMT-8062-4512",
    paymentStatus: "支払い済み",
    fulfillmentStatus: "発送済み",
    deliveryStatus: "配送中",
    tags: ["リピーター", "ギフト"],
    items: [
      { productId: "prod-bag-001", name: "ミニマルトートバッグ", sku: "BAG-001-BLK", quantity: 1, price: 6200 },
      { productId: "prod-cap-001", name: "コットンキャップ", sku: "CAP-001-NVY", quantity: 2, price: 2900 },
    ],
  },
  {
    id: "#10084",
    orderedAt: "2024/05/19 13:15",
    customerName: "鈴木 一郎",
    customerEmail: "ichiro.suzuki@example.jp",
    total: 8760,
    carrier: "日本郵便",
    paymentStatus: "支払い済み",
    fulfillmentStatus: "一部発送",
    deliveryStatus: "発送準備中",
    tags: ["要確認"],
    items: [{ productId: "prod-tsh-001", name: "オーガニックコットンTシャツ", sku: "TSH-001-WHT", quantity: 2, price: 4800 }],
  },
  {
    id: "#10083",
    orderedAt: "2024/05/19 11:08",
    customerName: "田中 美咲",
    customerEmail: "misaki.tanaka@example.jp",
    total: 5980,
    paymentStatus: "支払い済み",
    fulfillmentStatus: "処理中",
    deliveryStatus: "未発送",
    tags: ["初回"],
    items: [{ productId: "prod-btl-500", name: "ステンレスボトル 500ml", sku: "BTL-500-SLV", quantity: 1, price: 3200 }],
  },
  {
    id: "#10082",
    orderedAt: "2024/05/18 23:41",
    customerName: "高橋 大輔",
    customerEmail: "daisuke.takahashi@example.jp",
    total: 15320,
    paymentStatus: "未払い",
    fulfillmentStatus: "処理中",
    deliveryStatus: "未発送",
    tags: ["決済確認"],
    items: [{ productId: "prod-pkr-002", name: "リラックスフィットパーカー", sku: "PKR-002-GRY", quantity: 2, price: 7800 }],
  },
  {
    id: "#10081",
    orderedAt: "2024/05/18 21:27",
    customerName: "伊藤 優子",
    customerEmail: "yuko.ito@example.jp",
    total: 9200,
    paymentStatus: "返金済み",
    fulfillmentStatus: "キャンセル",
    deliveryStatus: "未発送",
    tags: ["返金済み"],
    items: [{ productId: "prod-cap-001", name: "コットンキャップ", sku: "CAP-001-NVY", quantity: 3, price: 2900 }],
  },
];

export const inventoryItems: InventoryItem[] = shopProducts.map((product) => {
  const unshippedOrders = shopOrders
    .filter((order) => order.fulfillmentStatus !== "発送済み" && order.fulfillmentStatus !== "キャンセル" && !order.trackingNumber)
    .flatMap((order) => order.items)
    .filter((item) => item.productId === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  return {
    productId: product.id,
    name: product.name,
    sku: product.sku,
    stock: product.stock,
    unshippedOrders,
    location: product.category === "アパレル" ? "東京倉庫 A-1" : "大阪倉庫 B-2",
    status: "受注中",
  };
});

export const collections: CollectionItem[] = [
  { id: "col-summer", name: "初夏の定番アイテム", productCount: 18, status: "公開中", condition: "タグ: 定番", sort: "売上順", seo: "設定済み", thumbnail: "TSH" },
  { id: "col-gift", name: "ギフト向けセレクション", productCount: 12, status: "公開中", condition: "タグ: ギフト", sort: "手動", seo: "改善候補", thumbnail: "GFT" },
  { id: "col-stock", name: "在庫強化商品", productCount: 9, status: "下書き", condition: "在庫20以上", sort: "新着順", seo: "未設定", thumbnail: "STK" },
];

export const customers: ShopCustomer[] = [
  { id: "cus-001", name: "佐藤 花子", email: "hanako.sato@example.jp", orders: 8, totalSpent: 92840, lastOrder: "2024/05/19", tags: ["リピーター", "ギフト"], note: "ギフト包装を好む" },
  { id: "cus-002", name: "鈴木 一郎", email: "ichiro.suzuki@example.jp", orders: 3, totalSpent: 28600, lastOrder: "2024/05/19", tags: ["要フォロー"], note: "納期確認が多い" },
  { id: "cus-003", name: "田中 美咲", email: "misaki.tanaka@example.jp", orders: 1, totalSpent: 5980, lastOrder: "2024/05/19", tags: ["初回"], note: "初回購入" },
  { id: "cus-004", name: "高橋 大輔", email: "daisuke.takahashi@example.jp", orders: 5, totalSpent: 74020, lastOrder: "2024/05/18", tags: ["高単価"], note: "まとめ買い傾向" },
  { id: "cus-005", name: "伊藤 優子", email: "yuko.ito@example.jp", orders: 2, totalSpent: 18400, lastOrder: "2024/05/18", tags: ["返金履歴"], note: "サイズ交換履歴あり" },
];

export const discounts: Discount[] = [
  { id: "dis-001", code: "WELCOME10", type: "割引コード", target: "初回購入", value: "10%", usage: 42, period: "2024/05/01 - 2024/06/30", status: "有効" },
  { id: "dis-002", code: "BAGSET500", type: "自動割引", target: "バッグ + キャップ", value: "¥500", usage: 18, period: "2024/05/10 - 2024/05/31", status: "有効" },
  { id: "dis-003", code: "SPRING20", type: "割引コード", target: "季節商品", value: "20%", usage: 96, period: "2024/03/01 - 2024/04/30", status: "期限切れ" },
];

export const analyticsData: ShopAnalyticsReport[] = [
  { date: "5/13", sales: 168000, previous: 72000, orders: 24 },
  { date: "5/14", sales: 212000, previous: 126000, orders: 31 },
  { date: "5/15", sales: 174000, previous: 98000, orders: 27 },
  { date: "5/16", sales: 218000, previous: 132000, orders: 34 },
  { date: "5/17", sales: 183000, previous: 101000, orders: 28 },
  { date: "5/18", sales: 205000, previous: 118000, orders: 32 },
  { date: "5/19", sales: 172000, previous: 73000, orders: 25 },
];

export const integrations: ShopAppIntegration[] = [
  { id: "app-amazon", name: "Amazon Seller Central", category: "3大モール連携", status: "接続済み", description: "出品・在庫・価格を同期中" },
  { id: "app-rakuten", name: "楽天 RMS", category: "3大モール連携", status: "確認必要", description: "価格同期で2件の警告" },
  { id: "app-yahoo", name: "Yahoo!ストアクリエイターPro", category: "3大モール連携", status: "接続済み", description: "注文取り込みを有効化" },
  { id: "app-yamato", name: "ヤマトB2クラウド", category: "配送連携", status: "接続済み", description: "発送CSVを自動生成" },
  { id: "app-stripe", name: "Stripe", category: "決済連携", status: "接続済み", description: "カード / Apple Payに対応" },
  { id: "app-analytics", name: "Search Console", category: "分析連携", status: "未接続", description: "検索流入分析を準備中" },
];

export const aiActions: AIAction[] = [
  { id: "sales", label: "売上を分析" },
  { id: "orders", label: "注文を分析" },
  { id: "products", label: "商品を分析" },
  { id: "customers", label: "顧客を分析" },
  { id: "inventory", label: "在庫を確認" },
  { id: "purchase", label: "発注候補を提案" },
  { id: "report", label: "レポートを生成" },
  { id: "copy", label: "商品説明を作成" },
  { id: "seo", label: "SEO説明文を作成" },
  { id: "discount", label: "割引施策を提案" },
  { id: "csv", label: "CSVを取り込む" },
  { id: "mall", label: "3大モール同期状況を確認" },
];

export function formatYen(value: number) {
  return `¥${value.toLocaleString("ja-JP")}`;
}
