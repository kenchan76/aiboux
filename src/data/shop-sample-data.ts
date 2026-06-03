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
  { id: "dashboard", label: "ダッシュボード", href: "/s/aiboux/admin", icon: Home },
  { id: "orders", label: "注文管理", href: "/s/aiboux/admin/orders", icon: ShoppingCart },
  { id: "products", label: "商品管理", href: "/s/aiboux/admin/products", icon: Package },
  { id: "inventory", label: "在庫", href: "/s/aiboux/admin/inventory", icon: Boxes },
  { id: "categories", label: "カテゴリ管理", href: "/s/aiboux/admin/categories", icon: Tags },
  { id: "customers", label: "顧客", href: "/s/aiboux/admin/customers", icon: Users },
  { id: "content", label: "コンテンツ", href: "/s/aiboux/admin/content", icon: FileText },
  { id: "analytics", label: "分析", href: "/s/aiboux/admin/analytics", icon: BarChart3 },
  { id: "apps", label: "アプリ", href: "/s/aiboux/admin/apps", icon: Plug },
  { id: "design", label: "ストアデザイン", href: "/s/aiboux/admin/design", icon: Paintbrush },
  { id: "settings", label: "設定", href: "/s/aiboux/admin/settings", icon: Settings },
];

export const shopMetrics: ShopMetric[] = [
  { id: "sales", label: "売上", value: "¥0", delta: "注文データ未連携", tone: "neutral", icon: CircleDollarSign },
  { id: "orders", label: "注文数", value: "0件", delta: "注文はまだありません", tone: "neutral", icon: ShoppingCart },
  { id: "conversion", label: "コンバージョン率", value: "未集計", delta: "計測設定が必要です", tone: "neutral", icon: Gauge },
  { id: "aov", label: "平均注文単価", value: "未集計", delta: "注文確定後に集計します", tone: "neutral", icon: Tags },
  { id: "repeat", label: "リピーター率", value: "未集計", delta: "顧客データ連携後に表示します", tone: "neutral", icon: Users },
];

export const shopProducts: ShopProduct[] = [];
export const shopOrders: ShopOrder[] = [];
export const inventoryItems: InventoryItem[] = [];
export const collections: CollectionItem[] = [];
export const customers: ShopCustomer[] = [];
export const discounts: Discount[] = [];
export const analyticsData: ShopAnalyticsReport[] = [];
export const integrations: ShopAppIntegration[] = [
  { id: "app-payment", name: "決済連携", category: "決済", status: "未接続", description: "決済設定を保存すると受付状態を確認できます" },
  { id: "app-mail", name: "Mail連携", category: "問い合わせ", status: "未接続", description: "問い合わせ保存またはメール送信の接続を確認してください" },
  { id: "app-seo", name: "検索連携", category: "集客", status: "未接続", description: "商品公開後にGoogle/Bing連携状態を確認します" },
  { id: "app-core", name: "Core連携", category: "商品・在庫", status: "未接続", description: "Core商品と在庫の同期設定を確認してください" },
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

export function createEmptyProduct(): ShopProduct {
  return {
    id: "new-product",
    name: "",
    sku: "",
    category: "未分類",
    price: 0,
    stock: 0,
    reserved: 0,
    incoming: 0,
    status: "下書き",
    sales: 0,
    image: "",
    tags: [],
    variants: [],
    feedSync: { google: "unsynced", bing: "unsynced" },
  };
}

export function formatYen(value: number) {
  return `¥${value.toLocaleString("ja-JP")}`;
}
