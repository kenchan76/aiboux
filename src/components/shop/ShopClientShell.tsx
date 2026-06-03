"use client";

import * as React from "react";
import { PackagePlus } from "lucide-react";
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
  design: "settings/design",
  settings: "settings",
};

interface ShopClientShellProps {
  initialSection?: ShopSection;
}

export function ShopClientShell({ initialSection = "dashboard" }: ShopClientShellProps) {
  const [activeSection, setActiveSection] = React.useState<ShopSection>(initialSection);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dateRange, setDateRange] = React.useState("2024/05/13 - 2024/05/19");
  const [hasUnsavedInventory, setHasUnsavedInventory] = React.useState(false);

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
              {renderSection(activeSection, changeSection, openOrder, openProduct, searchQuery)}
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
  if (typeof window === "undefined") return "/shop";
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
) {
  const filteredOrders = filterOrders(shopOrders, searchQuery);
  const filteredProducts = filterProducts(shopProducts, searchQuery);
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
      return <ProductEditor product={getProductFromPath()} mode="edit" />;
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
              const product = shopProducts.find((candidate) => candidate.id === productId);
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

function getProductFromPath() {
  if (typeof window === "undefined") return shopProducts[0];
  const productId = window.location.pathname.split("/").filter(Boolean).at(-1);
  return shopProducts.find((product) => product.id === productId) ?? shopProducts[0];
}

function getOrderFromPath() {
  if (typeof window === "undefined") return shopOrders[0];
  const orderId = window.location.pathname.split("/").filter(Boolean).at(-1);
  return shopOrders.find((order) => order.id.replace("#", "") === orderId || order.id === orderId) ?? shopOrders[0];
}
