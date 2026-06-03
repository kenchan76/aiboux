import {
  BarChart3,
  Bell,
  Box,
  Building2,
  CircleHelp,
  ClipboardList,
  FileCheck2,
  FileInput,
  FileSpreadsheet,
  FileText,
  Home,
  PackageCheck,
  ReceiptText,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { CoreView } from "@/data/core-sample-data";
import { cn } from "@/lib/utils";

type Icon = React.ComponentType<{ className?: string }>;

interface NavigationItem {
  label: string;
  href: string;
  view: CoreView;
  icon: Icon;
}

const groups: { label: string; items: NavigationItem[] }[] = [
  {
    label: "Core",
    items: [{ label: "ダッシュボード", href: "/core", view: "dashboard", icon: Home }],
  },
  {
    label: "帳票管理",
    items: [
      { label: "見積書", href: "/core/estimates", view: "estimates", icon: FileText },
      { label: "注文書", href: "/core/orders", view: "orders", icon: ClipboardList },
      { label: "納品書", href: "/core/deliveries", view: "deliveries", icon: PackageCheck },
      { label: "請求書", href: "/core/invoices", view: "invoices", icon: ReceiptText },
      { label: "入金伝票", href: "/core/payments", view: "payments", icon: FileInput },
    ],
  },
  {
    label: "仕入管理",
    items: [{ label: "発注書", href: "/core/purchase-orders", view: "purchase-orders", icon: ShoppingCart }],
  },
  {
    label: "在庫管理",
    items: [
      { label: "在庫一覧", href: "/core/inventory", view: "inventory", icon: Warehouse },
      { label: "入出庫履歴・調整", href: "/core/inventory/history", view: "inventory-history", icon: Truck },
      { label: "アラート・適正在庫", href: "/core/inventory/alerts", view: "inventory-alerts", icon: Bell },
    ],
  },
  {
    label: "マスタ管理",
    items: [
      { label: "取引先マスタ", href: "/core/partners", view: "partners", icon: Building2 },
      { label: "商品・SKUマスタ", href: "/core/products", view: "products", icon: Box },
      { label: "従業員・権限マスタ", href: "/core/users", view: "users", icon: Users },
    ],
  },
];

interface CoreSidebarProps {
  activeView: CoreView;
  mode?: "desktop" | "drawer";
}

export function CoreSidebar({ activeView, mode = "desktop" }: CoreSidebarProps) {
  const visibleGroups = activeView === "deliveries" ? groups.filter((group) => group.label !== "マスタ管理") : groups;

  return (
    <aside
      data-testid="core-sidebar"
      className={cn(
        "h-screen w-[244px] shrink-0 border-r border-neutral-200 bg-neutral-50",
        mode === "desktop" ? "hidden lg:flex lg:flex-col" : "flex flex-col",
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <a href="/core" className="flex items-center gap-2" aria-label="aiboux Core dashboard">
          <img src="/brand/aiboux-logo.svg" alt="aiboux" className="h-7 w-auto" />
          <Badge variant="secondary" className="h-5 rounded-md px-1.5 text-[10px] font-medium">
            CORE
          </Badge>
        </a>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-500">
          <FileSpreadsheet className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScrollArea className={cn("min-h-0", activeView === "deliveries" ? "h-[610px] flex-none" : "flex-1")}>
        <nav className="space-y-3 px-3 py-2">
          {visibleGroups.map((group) => (
            <section key={group.label} className="space-y-1">
              <div className="px-2 py-1 text-[11px] font-semibold text-neutral-500">{group.label}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.view === activeView;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex h-8 items-center gap-2 rounded-md px-2 text-sm transition-colors",
                      isActive
                        ? "bg-neutral-200/70 font-medium text-neutral-950"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{activeView === "deliveries" && item.label === "アラート・適正在庫" ? "スマート・適正在庫" : item.label}</span>
                  </a>
                );
              })}
            </section>
          ))}
        </nav>
      </ScrollArea>

      <Separator />
      <div className="space-y-1 p-3">
        <a className="flex h-8 items-center gap-2 rounded-md px-2 text-sm text-neutral-600 hover:bg-neutral-100" href="/core/settings">
          <Settings className="h-3.5 w-3.5" />
          設定
        </a>
        <a className="flex h-8 items-center gap-2 rounded-md px-2 text-sm text-neutral-600 hover:bg-neutral-100" href="/docs">
          <CircleHelp className="h-3.5 w-3.5" />
          ヘルプ
        </a>
        <div className="rounded-lg border border-neutral-200 bg-white p-2.5">
          <div className="text-xs font-medium text-neutral-900">tenant_001</div>
          <div className="mt-0.5 text-[11px] text-neutral-500">Kenjiro Sato / premium_980</div>
        </div>
      </div>
    </aside>
  );
}
