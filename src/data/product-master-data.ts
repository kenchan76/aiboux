export type ProductStatus = "draft" | "active" | "paused" | "discontinued" | "archived";
export type TaxType = "taxable_10" | "taxable_8" | "tax_exempt" | "non_taxable";
export type RoundingMode = "floor" | "ceil" | "round" | "floor_10" | "ceil_10" | "round_10";
export type Marketplace = "yahoo" | "rakuten" | "amazon";
export type PublishState = "draft" | "pending_approval" | "published" | "paused" | "archived";
export type ListingStatus = "draft" | "ready" | "synced" | "error" | "stopped";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type ProductSortKey =
  | "sales"
  | "stock"
  | "name"
  | "jan"
  | "updated"
  | "price"
  | "margin"
  | "listing"
  | "favorite";

export interface ProductDivision {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  colorToken: "neutral" | "blue" | "emerald" | "amber" | "red";
  sortOrder: number;
  isDefault: boolean;
}

export interface FavoriteProductList {
  id: string;
  tenantId: string;
  ownerUserId: string;
  name: string;
  description: string;
  productIds: string[];
}

export interface SavedProductView {
  id: string;
  tenantId: string;
  ownerUserId: string;
  name: string;
  viewType: "division" | "favorite" | "system" | "custom";
  targetId?: string;
  filters: ProductFilterState;
  sortKey: ProductSortKey;
  sortDirection: "asc" | "desc";
  isUserDefault: boolean;
  isTenantDefault: boolean;
}

export interface ProductDimensions {
  widthMm: number;
  heightMm: number;
  depthMm: number;
  weightG: number;
}

export interface MasterProduct {
  id: string;
  tenantId: string;
  divisionId: string;
  janCode: string;
  itfCode: string;
  productName: string;
  caseQuantity: number;
  specification: string;
  unit: string;
  standardPrice: number;
  taxType: TaxType;
  status: ProductStatus;
  inventoryManaged: boolean;
  shopSyncEnabled: boolean;
  mallPublishEnabled: boolean;
  description: string;
  productSize: ProductDimensions;
  caseSize: ProductDimensions;
  stockQuantity: number;
  salesAmount: number;
  grossMarginRate: number;
  tags: string[];
  memo: string;
  updatedAt: string;
}

export interface ProductFilterState {
  divisionId?: string;
  favoriteListId?: string;
  stockState?: "all" | "shortage" | "normal" | "overstock";
  listingState?: "all" | "not_linked" | "shop_linked" | "mall_ready" | "listed";
  hasCustomerPrice?: "all" | "yes" | "no";
  hasPriceSchedule?: "all" | "yes" | "no";
  hasJan?: "all" | "yes" | "no";
  hasItf?: "all" | "yes" | "no";
}

export interface ProductPriceSchedule {
  id: string;
  tenantId: string;
  productId: string;
  standardPrice: number;
  taxType: TaxType;
  effectiveFrom: string;
  reason: string;
  approvalStatus: "draft" | "pending" | "approved" | "rejected";
}

export interface CoreCustomer {
  id: string;
  tenantId: string;
  customerCode: string;
  customerName: string;
  billingName: string;
  bankAccountKana: string;
  baseDiscountRate: number;
  closingDay: string;
  paymentTerms: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  status: "active" | "paused" | "archived";
}

export interface CustomerDiscountRate {
  id: string;
  tenantId: string;
  customerId: string;
  productId?: string;
  rate: number;
  exceptionPrice?: number;
  taxMode: "tax_excluded" | "tax_included";
  roundingMode: RoundingMode;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface DeliveryDestination {
  id: string;
  tenantId: string;
  customerId: string;
  destinationCode: string;
  destinationName: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  contactName: string;
  deliveryConditions: string;
  isDefault: boolean;
  memo: string;
}

export interface ShopProductLink {
  id: string;
  tenantId: string;
  coreProductId: string;
  shopName: string;
  displayName: string;
  description: string;
  publishState: PublishState;
  seoTitle: string;
  seoDescription: string;
}

export interface ShopSkuVariant {
  id: string;
  tenantId: string;
  shopProductId: string;
  coreProductId: string;
  skuCode: string;
  variantName: string;
  setQuantity: number;
  salePrice: number;
  janCode: string;
  description: string;
  inventoryLinked: boolean;
  publishState: PublishState;
  shippingSize: string;
  marketplaceEnabled: boolean;
  approvalStatus: ApprovalStatus;
}

export interface MarketplaceListing {
  id: string;
  tenantId: string;
  skuVariantId: string;
  marketplace: Marketplace;
  marketplaceProductName: string;
  marketplaceDescription: string;
  catchCopy: string;
  searchKeywords: string;
  categoryCode: string;
  shippingSetting: string;
  salePrice: number;
  salePriceOverride?: number;
  pointRate: number;
  imageAssets: string[];
  publishState: "draft" | "pending_approval" | "listed" | "paused" | "error";
  listingStatus: ListingStatus;
  approvalStatus: ApprovalStatus;
  lastSyncedAt?: string;
  errorMessage?: string;
}

export interface ProductAsset {
  id: string;
  tenantId: string;
  productId: string;
  assetType: "image" | "spec_pdf" | "catalog_pdf" | "csv" | "excel" | "manual" | "other";
  fileName: string;
  publicUrl: string;
  fileSize: number;
}

export interface AiEnrichmentJob {
  id: string;
  tenantId: string;
  productId?: string;
  inputType: "image" | "pdf" | "csv" | "excel" | "jan" | "text";
  inputSummary: string;
  engine: string;
  status: "queued" | "running" | "pending_review" | "applied" | "discarded" | "failed";
  confidence: number;
  sources: string[];
  needsReview: string[];
}

export interface AiSuggestion {
  id: string;
  tenantId: string;
  jobId: string;
  productId?: string;
  suggestionType: "product_field" | "sku_variant" | "marketplace_listing" | "price" | "category" | "bundle";
  fieldKey: string;
  suggestedValue: string | number | string[] | Record<string, string | number | boolean>;
  confidence: number;
  sourceUrls: string[];
  reviewStatus: "pending" | "applied" | "edited" | "discarded";
}

export interface IntegrationEvent {
  id: string;
  tenantId: string;
  provider: "core" | "shop" | "mall" | "mail" | "file" | "docs" | Marketplace;
  eventType: string;
  entityType: string;
  entityId: string;
  status: "queued" | "processing" | "succeeded" | "failed" | "skipped";
  createdAt: string;
}

export const productDivisions: ProductDivision[] = [
  { id: "div-own", tenantId: "tenant_001", name: "自社商品", description: "自社ブランドとして販売する正本商品", colorToken: "blue", sortOrder: 1, isDefault: true },
  { id: "div-wholesale", tenantId: "tenant_001", name: "卸商品", description: "得意先別掛率で卸価格を算出する商品", colorToken: "emerald", sortOrder: 2, isDefault: false },
  { id: "div-oem", tenantId: "tenant_001", name: "OEM商品", description: "委託・共同ブランド商品", colorToken: "amber", sortOrder: 3, isDefault: false },
  { id: "div-procured", tenantId: "tenant_001", name: "仕入商品", description: "外部仕入れを主とする商品", colorToken: "neutral", sortOrder: 4, isDefault: false },
  { id: "div-set", tenantId: "tenant_001", name: "セット商品", description: "複数SKUや販売単位を束ねる商品", colorToken: "blue", sortOrder: 5, isDefault: false },
  { id: "div-ec", tenantId: "tenant_001", name: "EC専用商品", description: "Shop/Mall/モール出品向け商品", colorToken: "emerald", sortOrder: 6, isDefault: false },
  { id: "div-discontinue", tenantId: "tenant_001", name: "廃番候補", description: "終売判定・在庫整理対象", colorToken: "red", sortOrder: 7, isDefault: false },
  { id: "div-focus", tenantId: "tenant_001", name: "重点販売商品", description: "販促・営業重点商品", colorToken: "amber", sortOrder: 8, isDefault: false },
];

export const masterProducts: MasterProduct[] = [
  {
    id: "core-prod-001",
    tenantId: "tenant_001",
    divisionId: "div-own",
    janCode: "4900000000000",
    itfCode: "14900000000007",
    productName: "ミネラルウォーター 500ml",
    caseQuantity: 24,
    specification: "500ml / ラベルレス / 軟水",
    unit: "本",
    standardPrice: 120,
    taxType: "taxable_8",
    status: "active",
    inventoryManaged: true,
    shopSyncEnabled: true,
    mallPublishEnabled: true,
    description: "日常備蓄とイベント販売に使える500mlペットボトル飲料。ケース販売とセット販売に対応。",
    productSize: { widthMm: 65, heightMm: 210, depthMm: 65, weightG: 530 },
    caseSize: { widthMm: 410, heightMm: 225, depthMm: 275, weightG: 13200 },
    stockQuantity: 864,
    salesAmount: 1842000,
    grossMarginRate: 0.31,
    tags: ["飲料", "ケース販売", "EC出品候補"],
    memo: "夏季は在庫閾値を高めに設定。",
    updatedAt: "2024-05-22",
  },
  {
    id: "core-prod-002",
    tenantId: "tenant_001",
    divisionId: "div-own",
    janCode: "4900000000109",
    itfCode: "14900000000106",
    productName: "オーガニックコットンTシャツ",
    caseQuantity: 24,
    specification: "ホワイト / Mサイズ",
    unit: "枚",
    standardPrice: 2400,
    taxType: "taxable_10",
    status: "active",
    inventoryManaged: true,
    shopSyncEnabled: true,
    mallPublishEnabled: true,
    description: "肌触りの良いオーガニックコットンを使った定番Tシャツ。",
    productSize: { widthMm: 300, heightMm: 10, depthMm: 420, weightG: 180 },
    caseSize: { widthMm: 540, heightMm: 260, depthMm: 380, weightG: 5200 },
    stockQuantity: 42,
    salesAmount: 1328000,
    grossMarginRate: 0.42,
    tags: ["アパレル", "重点商品", "モール掲載"],
    memo: "白Mは広告連動商品のため在庫注意。",
    updatedAt: "2024-05-21",
  },
  {
    id: "core-prod-003",
    tenantId: "tenant_001",
    divisionId: "div-wholesale",
    janCode: "4901234567890",
    itfCode: "14901234567897",
    productName: "特製塩ラーメン 5食パック",
    caseQuantity: 12,
    specification: "乾麺 / スープ付き / 5食入",
    unit: "パック",
    standardPrice: 450,
    taxType: "taxable_8",
    status: "active",
    inventoryManaged: true,
    shopSyncEnabled: true,
    mallPublishEnabled: false,
    description: "得意先卸とECセット販売の両方で扱う定番ラーメン。",
    productSize: { widthMm: 210, heightMm: 70, depthMm: 160, weightG: 520 },
    caseSize: { widthMm: 440, heightMm: 260, depthMm: 360, weightG: 6700 },
    stockQuantity: 141,
    salesAmount: 965000,
    grossMarginRate: 0.28,
    tags: ["食品", "定番", "LINE受注"],
    memo: "山田商店の定番品。出荷指示はケース単位も多い。",
    updatedAt: "2024-05-23",
  },
  {
    id: "core-prod-004",
    tenantId: "tenant_001",
    divisionId: "div-own",
    janCode: "4900000000307",
    itfCode: "",
    productName: "ステンレスボトル 500ml",
    caseQuantity: 30,
    specification: "シルバー / 保冷保温",
    unit: "本",
    standardPrice: 3200,
    taxType: "taxable_10",
    status: "active",
    inventoryManaged: true,
    shopSyncEnabled: true,
    mallPublishEnabled: true,
    description: "日常利用とノベルティ需要に対応する500mlステンレスボトル。",
    productSize: { widthMm: 70, heightMm: 225, depthMm: 70, weightG: 310 },
    caseSize: { widthMm: 480, heightMm: 260, depthMm: 390, weightG: 10500 },
    stockQuantity: 8,
    salesAmount: 166400,
    grossMarginRate: 0.36,
    tags: ["雑貨", "在庫注意", "Amazon候補"],
    memo: "次回入荷予定を確認。",
    updatedAt: "2024-05-20",
  },
  {
    id: "core-prod-005",
    tenantId: "tenant_001",
    divisionId: "div-focus",
    janCode: "4900000000406",
    itfCode: "14900000000403",
    productName: "ミニマルトートバッグ",
    caseQuantity: 50,
    specification: "ブラック / A4対応",
    unit: "個",
    standardPrice: 6200,
    taxType: "taxable_10",
    status: "active",
    inventoryManaged: true,
    shopSyncEnabled: true,
    mallPublishEnabled: true,
    description: "高単価ギフトと法人ノベルティの両方に使えるバッグ。",
    productSize: { widthMm: 360, heightMm: 390, depthMm: 90, weightG: 420 },
    caseSize: { widthMm: 620, heightMm: 450, depthMm: 420, weightG: 22500 },
    stockQuantity: 7,
    salesAmount: 734000,
    grossMarginRate: 0.39,
    tags: ["雑貨", "重点商品", "Yahoo強化"],
    memo: "Yahoo向け商品名を短く調整予定。",
    updatedAt: "2024-05-19",
  },
];

export const favoriteProductLists: FavoriteProductList[] = [
  { id: "fav-regular", tenantId: "tenant_001", ownerUserId: "usr-001", name: "よく使う商品", description: "帳票作成で頻繁に使う商品", productIds: ["core-prod-001", "core-prod-003"] },
  { id: "fav-focus", tenantId: "tenant_001", ownerUserId: "usr-001", name: "重点商品", description: "営業と広告で優先する商品", productIds: ["core-prod-002", "core-prod-005"] },
  { id: "fav-price-review", tenantId: "tenant_001", ownerUserId: "usr-001", name: "値上げ確認中", description: "未来価格の承認が必要な商品", productIds: ["core-prod-001", "core-prod-003"] },
  { id: "fav-ec-candidate", tenantId: "tenant_001", ownerUserId: "usr-001", name: "EC出品候補", description: "Shop/Mallへ展開する候補", productIds: ["core-prod-001", "core-prod-004", "core-prod-005"] },
];

export const savedProductViews: SavedProductView[] = [
  { id: "view-user-default", tenantId: "tenant_001", ownerUserId: "usr-001", name: "初期表示: 自社商品", viewType: "division", targetId: "div-own", filters: { divisionId: "div-own" }, sortKey: "updated", sortDirection: "desc", isUserDefault: true, isTenantDefault: false },
  { id: "view-tenant-shortage", tenantId: "tenant_001", ownerUserId: "", name: "在庫不足", viewType: "system", filters: { stockState: "shortage" }, sortKey: "stock", sortDirection: "asc", isUserDefault: false, isTenantDefault: true },
  { id: "view-sales-top", tenantId: "tenant_001", ownerUserId: "usr-001", name: "売上上位", viewType: "system", filters: {}, sortKey: "sales", sortDirection: "desc", isUserDefault: false, isTenantDefault: false },
];

export const productPriceSchedules: ProductPriceSchedule[] = [
  { id: "price-001-current", tenantId: "tenant_001", productId: "core-prod-001", standardPrice: 120, taxType: "taxable_8", effectiveFrom: "2024-06-01", reason: "現行価格", approvalStatus: "approved" },
  { id: "price-001-future", tenantId: "tenant_001", productId: "core-prod-001", standardPrice: 132, taxType: "taxable_8", effectiveFrom: "2024-09-01", reason: "物流費上昇に伴う価格改定", approvalStatus: "pending" },
  { id: "price-003-current", tenantId: "tenant_001", productId: "core-prod-003", standardPrice: 450, taxType: "taxable_8", effectiveFrom: "2024-04-01", reason: "現行価格", approvalStatus: "approved" },
  { id: "price-003-future", tenantId: "tenant_001", productId: "core-prod-003", standardPrice: 520, taxType: "taxable_8", effectiveFrom: "2024-09-01", reason: "原材料価格改定", approvalStatus: "pending" },
  { id: "price-005-current", tenantId: "tenant_001", productId: "core-prod-005", standardPrice: 6200, taxType: "taxable_10", effectiveFrom: "2024-05-01", reason: "現行価格", approvalStatus: "approved" },
];

export const coreCustomers: CoreCustomer[] = [
  { id: "cust-yamada", tenantId: "tenant_001", customerCode: "C-001", customerName: "山田商店", billingName: "山田商店", bankAccountKana: "ヤマダシヨウテン", baseDiscountRate: 0.7, closingDay: "末日", paymentTerms: "翌月末払い", contactName: "山田 一郎", email: "order@yamada-shoten.example", phoneNumber: "03-1111-0001", status: "active" },
  { id: "cust-suzuki", tenantId: "tenant_001", customerCode: "C-002", customerName: "鈴木フーズ", billingName: "鈴木フーズ株式会社", bankAccountKana: "スズキフーズ", baseDiscountRate: 0.68, closingDay: "20日", paymentTerms: "翌月20日払い", contactName: "鈴木 美紀", email: "purchase@suzuki-foods.example", phoneNumber: "06-2222-0002", status: "active" },
  { id: "cust-sample", tenantId: "tenant_001", customerCode: "C-003", customerName: "株式会社サンプル", billingName: "株式会社サンプル", bankAccountKana: "カブシキガイシャサンプル", baseDiscountRate: 0.75, closingDay: "末日", paymentTerms: "翌々月5日払い", contactName: "佐藤 花子", email: "accounting@example-sample.jp", phoneNumber: "03-0000-1001", status: "active" },
];

export const customerDiscountRates: CustomerDiscountRate[] = [
  { id: "rate-yamada-base", tenantId: "tenant_001", customerId: "cust-yamada", rate: 0.7, taxMode: "tax_excluded", roundingMode: "floor_10", effectiveFrom: "2024-04-01" },
  { id: "rate-yamada-ramen", tenantId: "tenant_001", customerId: "cust-yamada", productId: "core-prod-003", rate: 0.64, taxMode: "tax_excluded", roundingMode: "floor", effectiveFrom: "2024-04-01" },
  { id: "rate-suzuki-base", tenantId: "tenant_001", customerId: "cust-suzuki", rate: 0.68, taxMode: "tax_excluded", roundingMode: "ceil_10", effectiveFrom: "2024-04-01" },
  { id: "rate-sample-water", tenantId: "tenant_001", customerId: "cust-sample", productId: "core-prod-001", rate: 0.72, exceptionPrice: 86, taxMode: "tax_excluded", roundingMode: "round", effectiveFrom: "2024-06-01" },
];

export const deliveryDestinations: DeliveryDestination[] = [
  { id: "dest-yamada-main", tenantId: "tenant_001", customerId: "cust-yamada", destinationCode: "D-001", destinationName: "山田商店 本店", postalCode: "101-0001", addressLine1: "東京都千代田区丸の内1-1-1", addressLine2: "1F荷受け口", phoneNumber: "03-1111-0001", contactName: "山田 一郎", deliveryConditions: "午前指定、ケースは裏口搬入", isDefault: true, memo: "水曜午前は避ける" },
  { id: "dest-yamada-warehouse", tenantId: "tenant_001", customerId: "cust-yamada", destinationCode: "D-002", destinationName: "山田商店 東倉庫", postalCode: "135-0061", addressLine1: "東京都江東区豊洲2-2-2", addressLine2: "倉庫B", phoneNumber: "03-1111-0002", contactName: "物流担当", deliveryConditions: "パレット可", isDefault: false, memo: "大型納品はこちら" },
  { id: "dest-suzuki-osaka", tenantId: "tenant_001", customerId: "cust-suzuki", destinationCode: "D-003", destinationName: "鈴木フーズ 大阪センター", postalCode: "530-0001", addressLine1: "大阪府大阪市北区梅田1-1-1", addressLine2: "3F", phoneNumber: "06-2222-0002", contactName: "鈴木 美紀", deliveryConditions: "佐川優先", isDefault: true, memo: "納品書同梱" },
];

export const shopProductLinks: ShopProductLink[] = [
  { id: "shop-prod-water", tenantId: "tenant_001", coreProductId: "core-prod-001", shopName: "AIBOUX STORE", displayName: "ミネラルウォーター 500ml ラベルレス", description: "毎日の備蓄にもイベントにも使いやすいラベルレスウォーター。", publishState: "published", seoTitle: "ミネラルウォーター500ml ラベルレス", seoDescription: "ケース販売とセット販売に対応した500mlラベルレスウォーター。" },
  { id: "shop-prod-shirt", tenantId: "tenant_001", coreProductId: "core-prod-002", shopName: "AIBOUX STORE", displayName: "オーガニックコットンTシャツ ホワイト", description: "長く着られる定番の白Tシャツ。", publishState: "published", seoTitle: "オーガニックコットンTシャツ", seoDescription: "ホワイトMサイズの定番アパレル商品。" },
  { id: "shop-prod-ramen", tenantId: "tenant_001", coreProductId: "core-prod-003", shopName: "AIBOUX STORE", displayName: "特製塩ラーメン 5食パック", description: "定番人気の塩ラーメンを家庭用にも業務用にも。", publishState: "draft", seoTitle: "特製塩ラーメン 5食パック", seoDescription: "スープ付き乾麺の5食セット。" },
];

export const shopSkuVariants: ShopSkuVariant[] = [
  { id: "sku-water-001", tenantId: "tenant_001", shopProductId: "shop-prod-water", coreProductId: "core-prod-001", skuCode: "WTR-500-001", variantName: "ミネラルウォーター 500ml 1本", setQuantity: 1, salePrice: 160, janCode: "4900000000000", description: "1本から試せる単品販売。", inventoryLinked: true, publishState: "published", shippingSize: "ネコポス不可 / 60サイズ", marketplaceEnabled: true, approvalStatus: "approved" },
  { id: "sku-water-002", tenantId: "tenant_001", shopProductId: "shop-prod-water", coreProductId: "core-prod-001", skuCode: "WTR-500-002", variantName: "ミネラルウォーター 500ml 2本セット", setQuantity: 2, salePrice: 300, janCode: "4900000000000", description: "少量備蓄に使いやすい2本セット。", inventoryLinked: true, publishState: "published", shippingSize: "60サイズ", marketplaceEnabled: true, approvalStatus: "approved" },
  { id: "sku-water-024", tenantId: "tenant_001", shopProductId: "shop-prod-water", coreProductId: "core-prod-001", skuCode: "WTR-500-024", variantName: "ミネラルウォーター 500ml 24本ケース", setQuantity: 24, salePrice: 2980, janCode: "4900000000000", description: "ケース単位のまとめ買い。", inventoryLinked: true, publishState: "published", shippingSize: "120サイズ", marketplaceEnabled: true, approvalStatus: "approved" },
  { id: "sku-ramen-003", tenantId: "tenant_001", shopProductId: "shop-prod-ramen", coreProductId: "core-prod-003", skuCode: "RAMEN-5P-003", variantName: "特製塩ラーメン 5食パック 3個セット", setQuantity: 3, salePrice: 1780, janCode: "4901234567890", description: "15食分をまとめて常備。", inventoryLinked: true, publishState: "pending_approval", shippingSize: "80サイズ", marketplaceEnabled: true, approvalStatus: "pending" },
];

export const marketplaceListings: MarketplaceListing[] = [
  { id: "list-water-yahoo", tenantId: "tenant_001", skuVariantId: "sku-water-024", marketplace: "yahoo", marketplaceProductName: "ミネラルウォーター 500ml 24本 ラベルレス ケース販売", marketplaceDescription: "備蓄やイベントに使いやすい500ml水の24本ケース。", catchCopy: "毎日の備蓄に、すぐ届くラベルレスウォーター", searchKeywords: "水 ミネラルウォーター 500ml 24本 ラベルレス 備蓄", categoryCode: "48753", shippingSetting: "佐川通常便", salePrice: 2980, pointRate: 5, imageAssets: ["asset-water-main"], publishState: "pending_approval", listingStatus: "ready", approvalStatus: "pending", lastSyncedAt: "2024-05-23 10:20" },
  { id: "list-water-rakuten", tenantId: "tenant_001", skuVariantId: "sku-water-024", marketplace: "rakuten", marketplaceProductName: "ミネラルウォーター 500ml 24本 ラベルレス 送料無料 ケース", marketplaceDescription: "ケース販売のラベルレス水。楽天向け検索語を整理済み。", catchCopy: "ラベルレスで片付け簡単、ケースで常備", searchKeywords: "ミネラルウォーター 500ml 24本 送料無料", categoryCode: "201351", shippingSetting: "通常宅配便", salePrice: 3180, pointRate: 3, imageAssets: ["asset-water-main"], publishState: "draft", listingStatus: "draft", approvalStatus: "pending" },
  { id: "list-ramen-amazon", tenantId: "tenant_001", skuVariantId: "sku-ramen-003", marketplace: "amazon", marketplaceProductName: "特製塩ラーメン 5食パック 3個セット", marketplaceDescription: "乾麺とスープ付きの塩ラーメンセット。", catchCopy: "家庭用にも業務用にも使いやすい定番味", searchKeywords: "塩ラーメン 乾麺 5食 セット", categoryCode: "grocery", shippingSetting: "FBA候補", salePrice: 1880, pointRate: 1, imageAssets: ["asset-ramen-main"], publishState: "draft", listingStatus: "draft", approvalStatus: "pending", errorMessage: "食品成分表示画像の確認が必要" },
];

export const productAssets: ProductAsset[] = [
  { id: "asset-water-main", tenantId: "tenant_001", productId: "core-prod-001", assetType: "image", fileName: "water-500ml-main.webp", publicUrl: "/placeholder.svg", fileSize: 184000 },
  { id: "asset-water-spec", tenantId: "tenant_001", productId: "core-prod-001", assetType: "spec_pdf", fileName: "water-specification.pdf", publicUrl: "/placeholder.svg", fileSize: 448000 },
  { id: "asset-ramen-main", tenantId: "tenant_001", productId: "core-prod-003", assetType: "image", fileName: "ramen-5pack.webp", publicUrl: "/placeholder.svg", fileSize: 206000 },
  { id: "asset-shirt-catalog", tenantId: "tenant_001", productId: "core-prod-002", assetType: "catalog_pdf", fileName: "organic-shirt-catalog.pdf", publicUrl: "/placeholder.svg", fileSize: 880000 },
];

export const aiEnrichmentJobs: AiEnrichmentJob[] = [
  { id: "ai-job-water", tenantId: "tenant_001", productId: "core-prod-001", inputType: "jan", inputSummary: "JAN 4900000000000 と商品写真1枚", engine: "gemini-2.5-flash", status: "pending_review", confidence: 0.86, sources: ["メーカー仕様書PDF", "JANコード照会結果"], needsReview: ["ケース重量", "楽天カテゴリ"] },
  { id: "ai-job-ramen", tenantId: "tenant_001", productId: "core-prod-003", inputType: "image", inputSummary: "パッケージ正面画像と食品表示画像", engine: "gemini-2.5-flash", status: "pending_review", confidence: 0.78, sources: ["パッケージOCR", "社内商品メモ"], needsReview: ["アレルゲン表示", "Amazon食品カテゴリ"] },
];

export const aiSuggestions: AiSuggestion[] = [
  { id: "ai-sug-water-yahoo-name", tenantId: "tenant_001", jobId: "ai-job-water", productId: "core-prod-001", suggestionType: "marketplace_listing", fieldKey: "yahoo_product_name", suggestedValue: "ミネラルウォーター 500ml 24本 ラベルレス ケース販売 備蓄用", confidence: 0.88, sourceUrls: ["メーカー仕様書PDF"], reviewStatus: "pending" },
  { id: "ai-sug-water-bundle", tenantId: "tenant_001", jobId: "ai-job-water", productId: "core-prod-001", suggestionType: "bundle", fieldKey: "bundle_skus", suggestedValue: ["2本セット", "3本セット", "24本ケース"], confidence: 0.91, sourceUrls: ["販売履歴"], reviewStatus: "pending" },
  { id: "ai-sug-ramen-copy", tenantId: "tenant_001", jobId: "ai-job-ramen", productId: "core-prod-003", suggestionType: "product_field", fieldKey: "description", suggestedValue: "香りの良い塩スープと歯切れの良い乾麺を組み合わせた、家庭用にも業務用にも扱いやすい5食パックです。", confidence: 0.79, sourceUrls: ["社内商品メモ"], reviewStatus: "pending" },
];

export const integrationEvents: IntegrationEvent[] = [
  { id: "evt-shop-sync-001", tenantId: "tenant_001", provider: "shop", eventType: "sku_variant_created", entityType: "shop_sku_variant", entityId: "sku-water-024", status: "succeeded", createdAt: "2024-05-23 10:22" },
  { id: "evt-yahoo-draft-001", tenantId: "tenant_001", provider: "yahoo", eventType: "listing_draft_generated", entityType: "marketplace_listing", entityId: "list-water-yahoo", status: "queued", createdAt: "2024-05-23 10:25" },
  { id: "evt-mail-context-001", tenantId: "tenant_001", provider: "mail", eventType: "invoice_product_context_linked", entityType: "core_product", entityId: "core-prod-003", status: "succeeded", createdAt: "2024-05-23 11:05" },
];

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(value);
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}

export function divisionName(divisionId: string): string {
  return productDivisions.find((division) => division.id === divisionId)?.name ?? "未設定";
}

export function currentApprovedPrice(productId: string, date = new Date()): ProductPriceSchedule | undefined {
  const target = date.toISOString().slice(0, 10);
  return productPriceSchedules
    .filter((row) => row.productId === productId && row.approvalStatus === "approved" && row.effectiveFrom <= target)
    .sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom))[0];
}

export function futurePriceSchedules(productId: string, date = new Date()): ProductPriceSchedule[] {
  const target = date.toISOString().slice(0, 10);
  return productPriceSchedules
    .filter((row) => row.productId === productId && row.effectiveFrom > target)
    .sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom));
}

export function hasFuturePriceSchedule(productId: string): boolean {
  return futurePriceSchedules(productId).length > 0;
}

export function marketplaceSummary(productId: string): { total: number; approved: number; pending: number; error: number } {
  const variantIds = shopSkuVariants.filter((variant) => variant.coreProductId === productId).map((variant) => variant.id);
  const listings = marketplaceListings.filter((listing) => variantIds.includes(listing.skuVariantId));
  return {
    total: listings.length,
    approved: listings.filter((listing) => listing.approvalStatus === "approved").length,
    pending: listings.filter((listing) => listing.approvalStatus === "pending").length,
    error: listings.filter((listing) => listing.listingStatus === "error").length,
  };
}

export function calculateWholesalePrice(input: {
  product: MasterProduct;
  customer: CoreCustomer;
  date?: Date;
  productOverride?: CustomerDiscountRate;
}): { basePrice: number; rate: number; wholesalePrice: number; roundingMode: RoundingMode; source: string } {
  const schedule = currentApprovedPrice(input.product.id, input.date) ?? productPriceSchedules.find((row) => row.productId === input.product.id);
  const basePrice = schedule?.standardPrice ?? input.product.standardPrice;
  const matchedOverride =
    input.productOverride ??
    customerDiscountRates.find((row) => row.customerId === input.customer.id && row.productId === input.product.id) ??
    customerDiscountRates.find((row) => row.customerId === input.customer.id && !row.productId);
  const rate = matchedOverride?.rate ?? input.customer.baseDiscountRate;
  const rawPrice = matchedOverride?.exceptionPrice ?? basePrice * rate;
  const roundingMode = matchedOverride?.roundingMode ?? "round";
  return {
    basePrice,
    rate,
    wholesalePrice: applyRounding(rawPrice, roundingMode),
    roundingMode,
    source: matchedOverride?.productId ? "商品別上書き" : matchedOverride ? "得意先基本掛率" : "得意先マスタ掛率",
  };
}

export function applyRounding(value: number, mode: RoundingMode): number {
  if (mode === "floor") return Math.floor(value);
  if (mode === "ceil") return Math.ceil(value);
  if (mode === "floor_10") return Math.floor(value / 10) * 10;
  if (mode === "ceil_10") return Math.ceil(value / 10) * 10;
  if (mode === "round_10") return Math.round(value / 10) * 10;
  return Math.round(value);
}

export function productStockState(product: MasterProduct): "shortage" | "normal" | "overstock" {
  if (product.stockQuantity <= 10) return "shortage";
  if (product.stockQuantity >= 700) return "overstock";
  return "normal";
}

export function sortProducts(rows: MasterProduct[], sortKey: ProductSortKey, direction: "asc" | "desc" = "desc"): MasterProduct[] {
  const sign = direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    if (sortKey === "sales") return (a.salesAmount - b.salesAmount) * sign;
    if (sortKey === "stock") return (a.stockQuantity - b.stockQuantity) * sign;
    if (sortKey === "name") return a.productName.localeCompare(b.productName, "ja") * sign;
    if (sortKey === "jan") return a.janCode.localeCompare(b.janCode) * sign;
    if (sortKey === "price") return (a.standardPrice - b.standardPrice) * sign;
    if (sortKey === "margin") return (a.grossMarginRate - b.grossMarginRate) * sign;
    if (sortKey === "listing") return (marketplaceSummary(a.id).total - marketplaceSummary(b.id).total) * sign;
    if (sortKey === "favorite") return (favoriteScore(a.id) - favoriteScore(b.id)) * sign;
    return a.updatedAt.localeCompare(b.updatedAt) * sign;
  });
}

export function favoriteScore(productId: string): number {
  return favoriteProductLists.filter((list) => list.productIds.includes(productId)).length;
}

export function filterProducts(rows: MasterProduct[], filters: ProductFilterState, query = ""): MasterProduct[] {
  const normalizedQuery = query.trim().toLowerCase();
  return rows.filter((product) => {
    if (filters.divisionId && product.divisionId !== filters.divisionId) return false;
    if (filters.favoriteListId) {
      const list = favoriteProductLists.find((favorite) => favorite.id === filters.favoriteListId);
      if (!list?.productIds.includes(product.id)) return false;
    }
    if (filters.stockState && filters.stockState !== "all" && productStockState(product) !== filters.stockState) return false;
    if (filters.listingState && filters.listingState !== "all") {
      const summary = marketplaceSummary(product.id);
      if (filters.listingState === "not_linked" && (product.shopSyncEnabled || summary.total > 0)) return false;
      if (filters.listingState === "shop_linked" && !product.shopSyncEnabled) return false;
      if (filters.listingState === "mall_ready" && !product.mallPublishEnabled) return false;
      if (filters.listingState === "listed" && summary.approved === 0) return false;
    }
    if (filters.hasCustomerPrice === "yes" && !customerDiscountRates.some((rate) => rate.productId === product.id)) return false;
    if (filters.hasCustomerPrice === "no" && customerDiscountRates.some((rate) => rate.productId === product.id)) return false;
    if (filters.hasPriceSchedule === "yes" && !hasFuturePriceSchedule(product.id)) return false;
    if (filters.hasPriceSchedule === "no" && hasFuturePriceSchedule(product.id)) return false;
    if (filters.hasJan === "yes" && !product.janCode) return false;
    if (filters.hasJan === "no" && product.janCode) return false;
    if (filters.hasItf === "yes" && !product.itfCode) return false;
    if (filters.hasItf === "no" && product.itfCode) return false;
    if (!normalizedQuery) return true;
    return [product.productName, product.janCode, product.itfCode, product.specification, product.tags.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });
}
