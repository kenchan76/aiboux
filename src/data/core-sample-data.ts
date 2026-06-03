export type CoreView =
  | "dashboard"
  | "estimates"
  | "orders"
  | "deliveries"
  | "invoices"
  | "invoice-new"
  | "payments"
  | "purchase-orders"
  | "inventory"
  | "inventory-history"
  | "inventory-alerts"
  | "partners"
  | "products"
  | "users"
  | "settings"
  | "design"
  | "help";

export type StatusTone = "neutral" | "blue" | "green" | "amber" | "red" | "purple";

export interface KpiItem {
  label: string;
  value: string;
  delta: string;
  tone: StatusTone;
}

export interface DocumentRow {
  id: string;
  documentId?: string;
  type: string;
  partner: string;
  issuedAt: string;
  dueAt: string;
  amount: number;
  status: string;
  tone: StatusTone;
  owner: string;
}

export interface InventoryRow {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  idealStock: number;
  inbound: number;
  outbound: number;
  status: string;
  tone: StatusTone;
  location: string;
}

export interface ActivityRow {
  id: string;
  title: string;
  meta: string;
  time: string;
  tone: StatusTone;
}

export interface PartnerRow {
  id: string;
  name: string;
  kana: string;
  email: string;
  phone: string;
  category: string;
  status: string;
}

export interface ProductRow {
  id: string;
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  taxRate: number;
  supplier: string;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  lastActive: string;
}

export const kpis: KpiItem[] = [
  { label: "売上（今月）", value: "¥12,450,000", delta: "前月比 +12.5%", tone: "green" },
  { label: "未入金額", value: "¥2,340,000", delta: "12件が期限超過", tone: "red" },
  { label: "受注件数", value: "325件", delta: "前月比 +8.1%", tone: "blue" },
  { label: "在庫アラート", value: "18件", delta: "要発注 7件", tone: "amber" },
  { label: "発注待ち", value: "7件", delta: "承認待ち 3件", tone: "purple" },
];

export const documents: DocumentRow[] = [
  {
    id: "I20260529-01",
    type: "請求書",
    partner: "株式会社サンプル",
    issuedAt: "2026/05/29",
    dueAt: "2026/06/20",
    amount: 120000,
    status: "入金済み",
    tone: "green",
    owner: "山田 太郎",
  },
  {
    id: "O20260529-01",
    type: "注文書",
    partner: "テスト株式会社",
    issuedAt: "2026/05/29",
    dueAt: "2026/06/05",
    amount: 250000,
    status: "処理中",
    tone: "amber",
    owner: "佐藤 健二郎",
  },
  {
    id: "N20260530-01",
    type: "納品書",
    partner: "株式会社サンプル",
    issuedAt: "2026/05/30",
    dueAt: "2026/05/30",
    amount: 98000,
    status: "下書き",
    tone: "neutral",
    owner: "山田 太郎",
  },
  {
    id: "Q20260528-01",
    type: "見積書",
    partner: "株式会社テスト",
    issuedAt: "2026/05/28",
    dueAt: "2026/06/30",
    amount: 75000,
    status: "承認待ち",
    tone: "amber",
    owner: "中村 美咲",
  },
  {
    id: "R20260528-01",
    type: "入金伝票",
    partner: "株式会社サンプル",
    issuedAt: "2026/05/28",
    dueAt: "2026/05/28",
    amount: 120000,
    status: "入金済み",
    tone: "green",
    owner: "山田 太郎",
  },
  {
    id: "I20260527-01",
    type: "請求書",
    partner: "北海原材料卸",
    issuedAt: "2026/05/27",
    dueAt: "2026/06/30",
    amount: 420000,
    status: "未入金",
    tone: "red",
    owner: "佐藤 健二郎",
  },
  {
    id: "P20260529-01",
    type: "発注書",
    partner: "北海原材料卸",
    issuedAt: "2026/05/29",
    dueAt: "2026/06/03",
    amount: 1180000,
    status: "入荷待ち",
    tone: "amber",
    owner: "山田 太郎",
  },
  {
    id: "P20260528-01",
    type: "発注書",
    partner: "サンプル商事株式会社",
    issuedAt: "2026/05/28",
    dueAt: "2026/06/02",
    amount: 560000,
    status: "承認済み",
    tone: "green",
    owner: "中村 美咲",
  },
  {
    id: "P20260525-01",
    type: "発注書",
    partner: "テスト株式会社",
    issuedAt: "2026/05/25",
    dueAt: "2026/06/01",
    amount: 340000,
    status: "承認待ち",
    tone: "amber",
    owner: "佐藤 健二郎",
  },
  {
    id: "R20260522-01",
    type: "入金伝票",
    partner: "北海原材料卸",
    issuedAt: "2026/05/22",
    dueAt: "2026/05/22",
    amount: 420000,
    status: "消込済み",
    tone: "green",
    owner: "佐藤 健二郎",
  },
  {
    id: "R20260521-01",
    type: "入金伝票",
    partner: "テスト株式会社",
    issuedAt: "2026/05/21",
    dueAt: "2026/05/21",
    amount: 250000,
    status: "確認待ち",
    tone: "amber",
    owner: "山田 太郎",
  },
];

export const inventories: InventoryRow[] = [
  {
    id: "prod-ear-001",
    sku: "EAR-001",
    name: "ワイヤレスイヤホン",
    category: "生活家電",
    currentStock: 3,
    idealStock: 20,
    inbound: 0,
    outbound: 8,
    status: "在庫不足",
    tone: "red",
    location: "A-01",
  },
  {
    id: "prod-cab-001",
    sku: "CAB-001",
    name: "USB-Cケーブル",
    category: "アクセサリ",
    currentStock: 5,
    idealStock: 30,
    inbound: 20,
    outbound: 11,
    status: "発注候補",
    tone: "amber",
    location: "B-02",
  },
  {
    id: "prod-pc-015",
    sku: "PC-015",
    name: "ノートPC 15インチ",
    category: "PC",
    currentStock: 2,
    idealStock: 10,
    inbound: 5,
    outbound: 4,
    status: "要確認",
    tone: "red",
    location: "C-04",
  },
  {
    id: "prod-bat-001",
    sku: "BAT-001",
    name: "モバイルバッテリー",
    category: "アクセサリ",
    currentStock: 8,
    idealStock: 20,
    inbound: 12,
    outbound: 5,
    status: "発注候補",
    tone: "amber",
    location: "B-05",
  },
  {
    id: "prod-prn-001",
    sku: "PRN-001",
    name: "レーザープリンター",
    category: "オフィス機器",
    currentStock: 6,
    idealStock: 15,
    inbound: 4,
    outbound: 2,
    status: "通常",
    tone: "green",
    location: "D-01",
  },
];

export const activities: ActivityRow[] = [
  { id: "act-01", title: "山田 太郎さんが請求書を作成しました", meta: "INV-2024-1008", time: "10:24", tone: "blue" },
  { id: "act-02", title: "佐藤 花子さんが入金を登録しました", meta: "RCV-2024-1003", time: "09:15", tone: "green" },
  { id: "act-03", title: "在庫アラートが発生しました", meta: "EAR-001", time: "08:45", tone: "amber" },
  { id: "act-04", title: "発注書が承認されました", meta: "PO-2024-1003", time: "昨日", tone: "purple" },
  { id: "act-05", title: "テスト株式会社が新規登録されました", meta: "取引先マスタ", time: "昨日", tone: "neutral" },
];

export const partners: PartnerRow[] = [
  {
    id: "prt-001",
    name: "株式会社サンプル",
    kana: "カブシキガイシャサンプル",
    email: "accounting@example-sample.jp",
    phone: "03-0000-1001",
    category: "得意先",
    status: "稼働中",
  },
  {
    id: "prt-002",
    name: "テスト株式会社",
    kana: "テストカブシキガイシャ",
    email: "order@test-corp.jp",
    phone: "03-0000-1002",
    category: "得意先",
    status: "稼働中",
  },
  {
    id: "prt-003",
    name: "北海原材料卸",
    kana: "ホッカイゲンザイリョウオロシ",
    email: "sales@hokkai-supply.jp",
    phone: "011-000-1003",
    category: "仕入先",
    status: "確認待ち",
  },
  {
    id: "prt-004",
    name: "サンプル商事株式会社",
    kana: "サンプルショウジ",
    email: "info@sample-trade.jp",
    phone: "06-0000-1004",
    category: "得意先",
    status: "稼働中",
  },
];

export const products: ProductRow[] = [
  {
    id: "sku-ear-001",
    sku: "EAR-001",
    name: "ワイヤレスイヤホン",
    category: "生活家電",
    unitPrice: 9800,
    taxRate: 10,
    supplier: "サンプル商事株式会社",
  },
  {
    id: "sku-cab-001",
    sku: "CAB-001",
    name: "USB-Cケーブル",
    category: "アクセサリ",
    unitPrice: 1200,
    taxRate: 10,
    supplier: "テスト株式会社",
  },
  {
    id: "sku-pc-015",
    sku: "PC-015",
    name: "ノートPC 15インチ",
    category: "PC",
    unitPrice: 98000,
    taxRate: 10,
    supplier: "北海原材料卸",
  },
  {
    id: "sku-bat-001",
    sku: "BAT-001",
    name: "モバイルバッテリー",
    category: "アクセサリ",
    unitPrice: 4200,
    taxRate: 10,
    supplier: "サンプル商事株式会社",
  },
];

export const users: UserRow[] = [
  {
    id: "usr-001",
    name: "山田 太郎",
    email: "taro.yamada@aiboux.example",
    role: "管理者",
    plan: "premium_980",
    lastActive: "10分前",
  },
  {
    id: "usr-002",
    name: "佐藤 花子",
    email: "hanako.sato@aiboux.example",
    role: "経理",
    plan: "free",
    lastActive: "2時間前",
  },
  {
    id: "usr-003",
    name: "中村 美咲",
    email: "misaki.nakamura@aiboux.example",
    role: "在庫担当",
    plan: "free",
    lastActive: "昨日",
  },
];

export const inventoryHistory = [
  { id: "invh-001", at: "2024/05/20 10:15", sku: "EAR-001", name: "ワイヤレスイヤホン", change: -8, reason: "EC出荷", stock: 3 },
  { id: "invh-002", at: "2024/05/20 09:40", sku: "CAB-001", name: "USB-Cケーブル", change: 20, reason: "仕入入荷", stock: 5 },
  { id: "invh-003", at: "2024/05/19 16:22", sku: "PC-015", name: "ノートPC 15インチ", change: -4, reason: "B2B納品", stock: 2 },
  { id: "invh-004", at: "2024/05/19 11:05", sku: "PRN-001", name: "レーザープリンター", change: 4, reason: "棚卸調整", stock: 6 },
];

export const salesTrend = [
  { month: "12月", value: 420 },
  { month: "1月", value: 740 },
  { month: "2月", value: 620 },
  { month: "3月", value: 860 },
  { month: "4月", value: 1080 },
  { month: "5月", value: 1370 },
];

export const viewMeta: Record<CoreView, { title: string; description: string; primaryAction: string }> = {
  dashboard: {
    title: "ダッシュボード",
    description: "本日の業務状況を確認しましょう。",
    primaryAction: "新規作成",
  },
  estimates: {
    title: "見積書",
    description: "見積の作成、承認、発行状況を管理します。",
    primaryAction: "見積書を作成",
  },
  orders: {
    title: "注文書",
    description: "受注と注文内容を一覧で確認します。",
    primaryAction: "注文書を作成",
  },
  deliveries: {
    title: "納品書",
    description: "納品予定、納品済み、配送連携を管理します。",
    primaryAction: "納品書を作成",
  },
  invoices: {
    title: "請求書",
    description: "請求書の発行、送付、入金状況を確認します。",
    primaryAction: "請求書を作成",
  },
  "invoice-new": {
    title: "請求書作成",
    description: "取引先、明細、支払条件を入力して請求書を発行します。",
    primaryAction: "発行する",
  },
  payments: {
    title: "入金伝票",
    description: "入金予定、消込結果、伝票履歴を管理します。",
    primaryAction: "入金を登録",
  },
  "purchase-orders": {
    title: "発注書",
    description: "仕入先への発注と承認状況を管理します。",
    primaryAction: "発注書を作成",
  },
  inventory: {
    title: "在庫一覧",
    description: "現在庫、適正在庫、入出荷予定を確認します。",
    primaryAction: "在庫を調整",
  },
  "inventory-history": {
    title: "入出庫履歴・調整",
    description: "在庫変動の理由と監査履歴を確認します。",
    primaryAction: "調整を追加",
  },
  "inventory-alerts": {
    title: "アラート・適正在庫",
    description: "在庫不足、過剰在庫、発注候補を管理します。",
    primaryAction: "閾値を設定",
  },
  partners: {
    title: "取引先マスタ",
    description: "得意先、仕入先、請求先の情報を管理します。",
    primaryAction: "取引先を追加",
  },
  products: {
    title: "商品・SKUマスタ",
    description: "商品、SKU、単価、税区分を管理します。",
    primaryAction: "商品を追加",
  },
  users: {
    title: "従業員・権限マスタ",
    description: "スタッフ権限、プラン、最終利用状況を管理します。",
    primaryAction: "従業員を招待",
  },
  settings: {
    title: "設定",
    description: "会社情報、帳票、通知、税・会計、連携、監査をまとめて管理します。",
    primaryAction: "設定を保存",
  },
  design: {
    title: "デザイン管理",
    description: "テーマ、コンポーネント、ライブプレビュー、公開前チェックを管理します。",
    primaryAction: "変更を保存",
  },
  help: {
    title: "ヘルプ・操作ガイド",
    description: "使い方、よくある質問、サポート導線をCore内で確認します。",
    primaryAction: "問い合わせを準備",
  },
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}
