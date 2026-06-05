"use client";

import * as React from "react";
import { PackagePlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CustomersTable } from "@/components/shop/CustomersTable";
import { InventoryTable } from "@/components/shop/InventoryTable";
import { ProductEditor } from "@/components/shop/ProductEditor";
import { ProductsTable } from "@/components/shop/ProductsTable";
import { ShopProductWizard } from "@/components/shop/products/ShopProductWizard";
import { ShopAnalytics } from "@/components/shop/ShopAnalytics";
import { ShopAppsPanel } from "@/components/shop/ShopAppsPanel";
import { ShopCategoryManager } from "@/components/shop/categories/ShopCategoryManager";
import { ShopContentPanel } from "@/components/shop/ShopContentPanel";
import { ShopDashboard } from "@/components/shop/ShopDashboard";
import { ShopOrderDetailPage } from "@/components/shop/ShopOrderDetailPage";
import { ShopRecentOrders } from "@/components/shop/ShopRecentOrders";
import { ShopSettingsPanel } from "@/components/shop/ShopSettingsPanel";
import { ShopSidebar } from "@/components/shop/ShopSidebar";
import { StorefrontDesignBuilder } from "@/components/shop/StorefrontDesignBuilder";
import { ShopTopbar } from "@/components/shop/ShopTopbar";
import {
  createEmptyProduct,
  formatYen,
  inventoryItems,
  shopOrders,
  shopProducts,
  type ShopOrder,
  type ShopProduct,
  type ShopSection,
} from "@/data/shop-sample-data";

const sectionPath: Record<ShopSection, string> = {
  dashboard: "",
  orders: "orders",
  "order-detail": "orders/10085",
  subscriptions: "subscriptions",
  products: "products",
  "product-new": "products/new",
  "product-detail": "products/prod-tsh-001",
  inventory: "inventory",
  categories: "categories",
  collections: "collections",
  "collection-new": "collections/new",
  customers: "customers",
  "customer-detail": "customers/cus-001",
  discounts: "discounts",
  content: "content",
  analytics: "analytics",
  apps: "apps",
  design: "design",
  settings: "settings",
};

interface ShopClientShellProps {
  initialSection?: ShopSection;
}

export function ShopClientShell({ initialSection = "dashboard" }: ShopClientShellProps) {
  const [activeSection, setActiveSection] = React.useState<ShopSection>(initialSection);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dateRange, setDateRange] = React.useState("今月");
  const [hasUnsavedInventory, setHasUnsavedInventory] = React.useState(false);
  const [products, setProducts] = React.useState<ShopProduct[]>(shopProducts);

  const loadProducts = React.useCallback(() => {
    let cancelled = false;
    fetch("/api/shop/products?tenant=aiboux")
      .then(async (response) => (response.ok ? ((await response.json()) as ShopProductsResponse) : null))
      .then((data) => {
        if (cancelled || !data?.success || !Array.isArray(data.shopProducts)) return;
        setProducts(data.shopProducts.map(mapApiProduct));
      })
      .catch(() => {
        // Keep the current rows. The table itself has an honest empty state.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const changeSection = React.useCallback((section: ShopSection) => {
    if (hasUnsavedInventory && activeSection === "inventory" && section !== "inventory") {
      const ok = window.confirm("未保存の在庫変更があります。このまま移動しますか？");
      if (!ok) return;
      setHasUnsavedInventory(false);
    }
    setActiveSection(section);
    const path = buildShopAdminPath(section);
    if (typeof window !== "undefined" && window.location.pathname !== path) {
      window.history.pushState({ section }, "", path);
    }
  }, [activeSection, hasUnsavedInventory]);

  React.useEffect(() => {
    const handler = (event: PopStateEvent) => {
      const section = event.state?.section as ShopSection | undefined;
      if (!section) return;
      if (hasUnsavedInventory && activeSection === "inventory" && section !== "inventory") {
        const ok = window.confirm("未保存の在庫変更があります。このまま移動しますか？");
        if (!ok) {
          const path = buildShopAdminPath(activeSection);
          window.history.pushState({ section: activeSection }, "", path);
          return;
        }
        setHasUnsavedInventory(false);
      }
      setActiveSection(section);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [activeSection, hasUnsavedInventory]);

  React.useEffect(() => {
    const handler = (event: Event) => {
      setHasUnsavedInventory(Boolean((event as CustomEvent<boolean>).detail));
    };
    window.addEventListener("aiboux:unsaved-inventory", handler);
    return () => window.removeEventListener("aiboux:unsaved-inventory", handler);
  }, []);

  React.useEffect(() => {
    return loadProducts();
  }, [loadProducts]);

  React.useEffect(() => {
    const handler = () => {
      loadProducts();
    };
    window.addEventListener("aiboux:shop-products-changed", handler);
    return () => window.removeEventListener("aiboux:shop-products-changed", handler);
  }, [loadProducts]);

  const openOrder = (order: ShopOrder) => {
    setActiveSection("order-detail");
    if (typeof window !== "undefined") {
      window.history.pushState({ section: "order-detail" }, "", `${getShopAdminBasePath()}/orders/${order.id.replace("#", "")}`);
    }
  };

  const openProduct = (product: ShopProduct) => {
    if (hasUnsavedInventory && activeSection === "inventory") {
      const ok = window.confirm("未保存の在庫変更があります。このまま商品編集へ移動しますか？");
      if (!ok) return;
      setHasUnsavedInventory(false);
    }
    setActiveSection("product-detail");
    if (typeof window !== "undefined") {
      window.history.pushState({ section: "product-detail" }, "", `${getShopAdminBasePath()}/products/${product.id}`);
    }
  };

  return (
    <TooltipProvider delayDuration={120}>
      <SidebarProvider>
        <ShopSidebar activeSection={activeSection} onSectionChange={changeSection} />
        <SidebarInset className="min-w-0 bg-white">
          <ShopTopbar
            activeSection={activeSection}
            searchQuery={searchQuery}
            dateRange={dateRange}
            onSearchChange={setSearchQuery}
            onDateRangeChange={setDateRange}
            onSectionChange={changeSection}
          />
          <main className="flex min-h-0 flex-1">
            <div className="min-w-0 flex-1">
              {renderSection(activeSection, changeSection, openOrder, openProduct, searchQuery, products)}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster richColors position="top-right" />
    </TooltipProvider>
  );
}

function buildShopAdminPath(section: ShopSection) {
  const suffix = sectionPath[section];
  return suffix ? `${getShopAdminBasePath()}/${suffix}` : getShopAdminBasePath();
}

function getShopAdminBasePath() {
  if (typeof window === "undefined") return "/s/aiboux/admin";
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts[0] === "s" && parts[1] && parts[2] === "admin") {
    return `/s/${encodeURIComponent(decodeURIComponent(parts[1]))}/admin`;
  }
  return "/shop";
}

function renderSection(
  section: ShopSection,
  onSectionChange: (section: ShopSection) => void,
  onOpenOrder: (order: ShopOrder) => void,
  onOpenProduct: (product: ShopProduct) => void,
  searchQuery: string,
  products: ShopProduct[],
) {
  const filteredOrders = filterOrders(shopOrders, searchQuery);
  const filteredProducts = filterProducts(products, searchQuery);
  const filteredInventory = inventoryItems.filter((item) =>
    matchesSearch(searchQuery, [item.name, item.sku, item.location, item.status]),
  );

  switch (section) {
    case "dashboard":
      return <ShopDashboard onSectionChange={onSectionChange} />;
    case "orders":
      return (
        <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-neutral-950">注文管理</h1>
              <p className="text-sm text-neutral-500">支払い、発送準備、配送状況を確認し、発送作業を進めます。</p>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
              <PackagePlus className="size-4" />
              注文作成は購入者の決済完了後に自動で追加されます
            </div>
          </div>
          <ShopRecentOrders orders={filteredOrders} onSelectOrder={onOpenOrder} />
        </section>
      );
    case "order-detail":
      return <ShopOrderDetailPage order={getOrderFromPath()} onSectionChange={onSectionChange} />;
    case "subscriptions":
      return <ShopSubscriptionsPanel />;
    case "products":
      return (
        <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-neutral-950">商品管理</h1>
              <p className="text-sm text-neutral-500">商品名、商品番号、価格、販売状態を管理します。</p>
            </div>
            <Button onClick={() => onSectionChange("product-new")}>商品を追加</Button>
          </div>
          <ProductsTable products={filteredProducts} onSelectProduct={onOpenProduct} />
        </section>
      );
    case "product-new":
      return <ShopProductWizard onComplete={() => onSectionChange("products")} />;
    case "product-detail":
      return <ProductEditor product={getProductFromPath(products)} mode="edit" />;
    case "inventory":
      return (
        <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
          <div className="mb-4">
            <h1 className="text-xl font-semibold tracking-tight text-neutral-950">在庫</h1>
            <p className="text-sm text-neutral-500">受注中の未出荷数と現在庫を確認し、リスト上で在庫数量を更新します。</p>
          </div>
          <InventoryTable
            items={filteredInventory}
            onOpenProduct={(productId) => {
              const product = products.find((candidate) => candidate.id === productId);
              if (product) onOpenProduct(product);
            }}
          />
        </section>
      );
    case "categories":
      return <ShopCategoryManager />;
    case "collections":
    case "collection-new":
      return <ShopCategoryManager />;
    case "customers":
    case "customer-detail":
      return <CustomersTable />;
    case "discounts":
      return <ShopSettingsPanel />;
    case "content":
      return <ShopContentPanel />;
    case "analytics":
      return <ShopAnalytics />;
    case "apps":
      return <ShopAppsPanel />;
    case "design":
      return <StorefrontDesignBuilder />;
    case "settings":
      return <ShopSettingsPanel />;
    default:
      return <ShopDashboard onSectionChange={onSectionChange} />;
  }
}

function matchesSearch(query: string, values: Array<string | number | undefined>) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  return values.some((value) => String(value ?? "").toLowerCase().includes(normalizedQuery));
}

function filterOrders(orders: ShopOrder[], query: string) {
  return orders.filter((order) =>
    matchesSearch(query, [
      order.id,
      order.customerName,
      order.customerEmail,
      order.trackingNumber,
      order.paymentStatus,
      order.fulfillmentStatus,
      order.deliveryStatus,
      ...order.tags,
      ...order.items.flatMap((item) => [item.name, item.sku]),
    ]),
  );
}

function filterProducts(products: ShopProduct[], query: string) {
  return products.filter((product) =>
    matchesSearch(query, [
      product.id,
      product.name,
      product.sku,
      product.category,
      product.status,
      ...product.tags,
      ...product.variants.flatMap((variant) => [variant.name, variant.sku]),
    ]),
  );
}

function getProductFromPath(products: ShopProduct[]) {
  if (typeof window === "undefined") return shopProducts[0] ?? createEmptyProduct();
  const productId = window.location.pathname.split("/").filter(Boolean).at(-1);
  return products.find((product) => product.id === productId) ?? products[0] ?? shopProducts[0] ?? createEmptyProduct();
}

function getOrderFromPath() {
  if (typeof window === "undefined") return shopOrders[0];
  const orderId = window.location.pathname.split("/").filter(Boolean).at(-1);
  return shopOrders.find((order) => order.id.replace("#", "") === orderId || order.id === orderId) ?? shopOrders[0];
}

type ShopProductsResponse = {
  success?: boolean;
  shopProducts?: Array<Record<string, unknown>>;
};

function mapApiProduct(row: Record<string, unknown>): ShopProduct {
  const id = stringValue(row.id) || "shop-product";
  const name = stringValue(row.display_name) || stringValue(row.product_name) || "名称未設定の商品";
  const sku = stringValue(row.jan_code) || id;
  const category = stringValue(row.category_name) || stringValue(row.google_category_id) || stringValue(row.category_id) || "未分類";
  const price = numberValue(row.sale_price);
  const stock = numberValue(row.stock_quantity);
  const tags = parseStringArray(row.ai_keywords_json);
  const imageKeys = parseStringArray(row.image_r2_keys);
  const publishState = stringValue(row.publish_state);
  return {
    id,
    name,
    sku,
    category,
    price,
    stock,
    reserved: 0,
    incoming: 0,
    status: publishState === "published" ? "公開中" : publishState === "paused" || publishState === "archived" ? "非公開" : "下書き",
    sales: 0,
    image: imageKeys[0] ? `/shop/api/assets/${imageKeys[0]}` : "",
    tags,
    variants: [{ id: `${id}-default`, name, sku, stock, price }],
    subscriptionPlans: parseSubscriptionPlans(row.subscriptionPlans),
    feedSync: { google: "unsynced", bing: "unsynced" },
  };
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: unknown): number {
  const number = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(number) ? Math.max(Math.trunc(number), 0) : 0;
}

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
}

function parseSubscriptionPlans(value: unknown): ShopProduct["subscriptionPlans"] {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => {
    const row = item && typeof item === "object" ? item as Record<string, unknown> : {};
    const intervalUnit = row.intervalUnit === "day" || row.intervalUnit === "week" || row.intervalUnit === "month" ? row.intervalUnit : "month";
    const status = row.status === "hidden" || row.status === "archived" ? row.status : "active";
    return {
      id: stringValue(row.id) || `subplan_${index + 1}`,
      name: stringValue(row.name) || "毎月お届け",
      intervalUnit,
      intervalCount: Math.max(numberValue(row.intervalCount) || 1, 1),
      price: numberValue(row.price),
      discountRate: Number(row.discountRate ?? 0) || 0,
      firstOrderPrice: row.firstOrderPrice === null || row.firstOrderPrice === undefined ? null : numberValue(row.firstOrderPrice),
      minimumCycles: numberValue(row.minimumCycles),
      canSkip: row.canSkip !== false,
      canPause: row.canPause !== false,
      canCancel: row.canCancel !== false,
      status,
      noticeText: stringValue(row.noticeText),
      cancellationPolicy: stringValue(row.cancellationPolicy),
    };
  });
}

function ShopSubscriptionsPanel() {
  const [subscriptions, setSubscriptions] = React.useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [receptionLimited, setReceptionLimited] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    fetch("/shop/api/subscriptions")
      .then(async (response) => {
        const data = (await response.json().catch(() => ({}))) as { success?: boolean; code?: string; error?: string; subscriptions?: Array<Record<string, unknown>> };
        if (response.status === 503 && data.code === "SUBSCRIPTION_SCHEMA_PENDING") {
          setSubscriptions([]);
          setReceptionLimited(true);
          setError("");
          return;
        }
        if (!response.ok || data.success === false) throw new Error("定期購入の受付状態を確認できませんでした");
        setSubscriptions(Array.isArray(data.subscriptions) ? data.subscriptions : []);
        setReceptionLimited(false);
        setError("");
      })
      .catch(() => {
        setReceptionLimited(false);
        setError("定期購入の受付状態を確認できませんでした。少し時間をおいて再読込してください。");
      })
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const action = async (subscriptionId: string, nextAction: "pause" | "resume" | "skip" | "cancel") => {
    const response = await fetch(`/shop/api/subscriptions/${encodeURIComponent(subscriptionId)}/${nextAction}`, { method: "PATCH" });
    const data = (await response.json().catch(() => ({}))) as { success?: boolean; code?: string; error?: string };
    if (!response.ok || data.success === false) {
      alert(data.code === "SUBSCRIPTION_SCHEMA_PENDING" ? "定期購入の受付条件を確認してください。" : "定期購入を更新できませんでした。");
      return;
    }
    load();
  };

  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4" data-testid="admin-subscriptions-page">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">定期購入</h1>
          <p className="text-sm text-neutral-500">定期購入契約、次回請求日、次回配送日、停止・再開・スキップ・解約を確認します。</p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>{loading ? "読込中..." : "再読込"}</Button>
      </div>
      {error ? <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      {receptionLimited ? (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-4" data-testid="admin-subscription-reception-limited">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-amber-950">定期購入の受付条件を確認してください</div>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-amber-900">
                商品詳細とカートでは定期購入の案内を表示できます。契約受付、次回請求日、停止・再開などの操作は、支払い方法と契約保存の条件が整ってから有効になります。
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-amber-300 bg-white text-amber-900 hover:bg-amber-100" onClick={load}>
              状態を再確認
            </Button>
          </div>
        </div>
      ) : null}
      <div className="mb-4 grid gap-3 md:grid-cols-3" data-testid="admin-subscription-operation-cards">
        <AdminSubscriptionStatusCard
          label="受付商品"
          value={subscriptions.length > 0 ? `${subscriptions.length}件` : "商品設定を確認"}
          description="商品編集で定期価格、頻度、停止・解約条件を整えます。"
        />
        <AdminSubscriptionStatusCard
          label="次回対応"
          value={subscriptions.length > 0 ? "配送日を確認" : "受付開始前"}
          description="申込後は次回請求日と次回配送日をこの画面で確認します。"
        />
        <AdminSubscriptionStatusCard
          label="購入者対応"
          value="停止・再開・スキップ"
          description="契約行ごとに一時停止、再開、スキップ、解約を操作します。"
        />
      </div>
      {subscriptions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-4 py-12 text-center text-sm text-neutral-600" data-testid="admin-subscription-empty-state">
          <div className="mx-auto max-w-xl">
            <div className="text-base font-semibold text-neutral-950">現在管理対象の定期購入はありません</div>
            <p className="mt-2 leading-6">
              商品編集で定期購入プランを設定し、商品詳細で購入者に頻度と受付条件を表示します。申込が入ると、顧客名、商品、次回請求日、次回配送日をここで確認できます。
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button asChild variant="outline">
                <a href={`${getShopAdminBasePath()}/products`}>商品設定を開く</a>
              </Button>
              <Button asChild variant="outline">
                <a href={`${getShopAdminBasePath()}/settings`}>支払い設定を確認</a>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-neutral-50 text-left text-xs text-neutral-500">
              <tr>
                <th className="px-3 py-2">顧客</th>
                <th className="px-3 py-2">商品 / プラン</th>
                <th className="px-3 py-2">金額</th>
                <th className="px-3 py-2">次回請求</th>
                <th className="px-3 py-2">次回配送</th>
                <th className="px-3 py-2">状態</th>
                <th className="px-3 py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {subscriptions.map((subscription) => {
                const id = stringValue(subscription.id);
                const status = stringValue(subscription.status);
                return (
                  <tr key={id}>
                    <td className="px-3 py-3">
                      <div className="font-medium text-neutral-950">{stringValue(subscription.customerName) || "未入力"}</div>
                      <div className="text-xs text-neutral-500">{stringValue(subscription.customerEmail) || "メール未入力"}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-neutral-950">{stringValue(subscription.productName)}</div>
                      <div className="text-xs text-neutral-500">{stringValue(subscription.planName)} / {subscriptionIntervalLabelForAdmin(subscription)}</div>
                    </td>
                    <td className="px-3 py-3 font-semibold">{formatYen(numberValue(subscription.unitPrice))}</td>
                    <td className="px-3 py-3">{formatDateValue(subscription.nextBillingAt)}</td>
                    <td className="px-3 py-3">{formatDateValue(subscription.nextDeliveryAt)}</td>
                    <td className="px-3 py-3"><Badge variant="outline" className="rounded-md">{status || "pending_payment_setup"}</Badge></td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8" onClick={() => action(id, status === "paused" ? "resume" : "pause")}>{status === "paused" ? "再開" : "一時停止"}</Button>
                        <Button variant="outline" size="sm" className="h-8" onClick={() => action(id, "skip")}>スキップ</Button>
                        <Button variant="outline" size="sm" className="h-8 text-red-600" onClick={() => action(id, "cancel")}>解約</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function AdminSubscriptionStatusCard({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="text-xs font-medium text-neutral-500">{label}</div>
      <div className="mt-1 text-base font-semibold text-neutral-950">{value}</div>
      <p className="mt-1 text-xs leading-5 text-neutral-600">{description}</p>
    </div>
  );
}

function subscriptionIntervalLabelForAdmin(value: Record<string, unknown>): string {
  const unit = stringValue(value.intervalUnit);
  const count = Math.max(numberValue(value.intervalCount) || 1, 1);
  if (unit === "week") return count === 1 ? "毎週" : `${count}週間ごと`;
  if (unit === "day") return `${count}日ごと`;
  return count === 1 ? "毎月" : `${count}か月ごと`;
}

function formatDateValue(value: unknown): string {
  const number = typeof value === "number" ? value : Number(value ?? 0);
  if (!Number.isFinite(number) || number <= 0) return "未設定";
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date(number));
}
