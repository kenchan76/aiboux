"use client";

import { Activity, AlertTriangle, CheckCircle2, PackageCheck, Plus, RefreshCw, Search, Sparkles, Truck, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  analyticsData,
  inventoryItems,
  shopMetrics,
  shopOrders,
  shopProducts,
  type ShopSection,
  formatYen,
} from "@/data/shop-sample-data";
import { ShopBestSellers } from "./ShopBestSellers";
import { ShopInventoryAlerts } from "./ShopInventoryAlerts";
import { ShopKpiCard } from "./ShopKpiCard";
import { ShopRecentOrders } from "./ShopRecentOrders";
import { ShopSalesChart } from "./ShopSalesChart";

interface ShopDashboardProps {
  onSectionChange: (section: ShopSection) => void;
}

export function ShopDashboard({ onSectionChange }: ShopDashboardProps) {
  const unshippedOrders = shopOrders.filter((order) => order.deliveryStatus !== "配達完了" && !order.trackingNumber);
  const lowStockItems = inventoryItems.filter((item) => item.stock <= 8);
  const productReviewItems = shopProducts.filter((product) => product.status !== "公開中" || product.stock <= 8 || product.tags.length === 0);
  const productsSyncing = shopProducts.filter((product) => product.feedSync?.google === "syncing" || product.feedSync?.bing === "syncing").length;
  const productsSynced = shopProducts.filter((product) => product.feedSync?.google === "synced" || product.feedSync?.bing === "synced").length;
  const totalSales = analyticsData.reduce((sum, item) => sum + item.sales, 0);
  const totalPreviousSales = analyticsData.reduce((sum, item) => sum + item.previous, 0);
  const salesDelta = totalPreviousSales > 0 ? ((totalSales - totalPreviousSales) / totalPreviousSales) * 100 : 0;

  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">ダッシュボード</h1>
          <p className="mt-1 text-sm text-neutral-500">ストアの最新状況を確認しましょう。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="gap-2" onClick={() => onSectionChange("products")}>
            <Plus className="size-4" />
            商品を追加
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => onSectionChange("inventory")}>
            <RefreshCw className="size-4" />
            在庫を更新
          </Button>
        </div>
      </div>

      <Card className="mb-3 shadow-sm">
        <CardHeader className="border-b border-neutral-200 px-4 py-3">
          <CardTitle className="text-sm">今日やること</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 p-3 md:grid-cols-3">
          <ActionSummary
            icon={Truck}
            title="発送待ちの注文"
            value={`${unshippedOrders.length}件`}
            description={unshippedOrders.length ? "追跡番号を入れて発送処理を進めます。" : "発送待ちはありません。"}
            actionLabel="注文を見る"
            done={unshippedOrders.length === 0}
            onClick={() => onSectionChange("orders")}
          />
          <ActionSummary
            icon={AlertTriangle}
            title="在庫が少ない商品"
            value={`${lowStockItems.length}件`}
            description={lowStockItems.length ? "売り切れ前に在庫数を確認します。" : "在庫不足の注意はありません。"}
            actionLabel="在庫を見る"
            done={lowStockItems.length === 0}
            onClick={() => onSectionChange("inventory")}
          />
          <ActionSummary
            icon={PackageCheck}
            title="商品ページの見直し"
            value={`${productReviewItems.length}件`}
            description={productReviewItems.length ? "写真、価格、販売状態、検索タグを確認します。" : "見直しが必要な商品はありません。"}
            actionLabel="商品を見る"
            done={productReviewItems.length === 0}
            onClick={() => onSectionChange("products")}
          />
        </CardContent>
      </Card>

      <Card className="mb-3 border-neutral-200 bg-blue-50/40 shadow-sm">
        <CardContent className="grid gap-3 p-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="text-sm font-semibold text-neutral-950">集客とSEOは自動で動いています</div>
            <p className="mt-1 text-xs leading-5 text-neutral-600">
              商品を保存すると、画像最適化、Google/Bing向け同期、在庫状態の反映を裏側で進めます。難しい設定は「集客・SEO自動化」でON/OFFだけ確認できます。
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <AutomationStatus icon={Sparkles} label="AI画像最適化" />
              <AutomationStatus icon={Search} label="Google/Bing同期" />
              <AutomationStatus icon={Activity} label="在庫状態を自動反映" />
            </div>
            <div className="mt-2 text-xs text-neutral-600">
              現在の自動送信: 同期中 {productsSyncing}件 / 送信済み {productsSynced}件
            </div>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Button size="sm" className="gap-2" onClick={() => onSectionChange("products")}>
              <PackageCheck className="size-4" />
              商品の同期状態を見る
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-white" onClick={() => onSectionChange("settings")}>
              <Search className="size-4" />
              自動化設定
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {shopMetrics.map((metric) => (
          <ShopKpiCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[1.25fr_1fr]">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
            <div>
              <CardTitle className="text-sm">売上の動き</CardTitle>
              <div className="mt-1 flex items-center gap-2 text-sm">
                <span className="font-semibold text-neutral-950">{formatYen(totalSales)}</span>
                <span className={salesDelta >= 0 ? "text-xs font-medium text-emerald-600" : "text-xs font-medium text-red-600"}>
                  {salesDelta >= 0 ? "▲" : "▼"} {Math.abs(salesDelta).toFixed(1)}%
                </span>
              </div>
            </div>
            <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs text-neutral-600">日別表示</span>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <ShopSalesChart data={analyticsData} />
          </CardContent>
        </Card>
        <ShopBestSellers products={shopProducts} />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[1.25fr_1fr]">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
            <CardTitle className="text-sm">最近の注文</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onSectionChange("orders")}>すべて見る</Button>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            <ShopRecentOrders orders={shopOrders} compact />
          </CardContent>
        </Card>
        <ShopInventoryAlerts items={inventoryItems} onOpenInventory={() => onSectionChange("inventory")} />
      </div>

    </section>
  );
}

function AutomationStatus({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-blue-100 bg-white px-2.5 py-2 text-xs text-neutral-700">
      <span className="flex size-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
        <Icon className="size-3.5" />
      </span>
      <span className="font-medium">{label}</span>
      <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">稼働中</span>
    </div>
  );
}

function ActionSummary({
  icon: Icon,
  title,
  value,
  description,
  actionLabel,
  done,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  actionLabel: string;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex min-h-28 flex-col justify-between rounded-lg border border-neutral-200 bg-white px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-neutral-500">{title}</div>
          <div className="mt-1 text-lg font-semibold text-neutral-950">{value}</div>
          <p className="mt-1 text-xs leading-5 text-neutral-500">{description}</p>
        </div>
        <div className={`flex size-8 shrink-0 items-center justify-center rounded-md border ${done ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
          {done ? <CheckCircle2 className="size-4" /> : <Icon className="size-4" />}
        </div>
      </div>
      <Button variant={done ? "outline" : "default"} size="sm" className="mt-3 h-8 w-fit" onClick={onClick}>
        {actionLabel}
      </Button>
    </div>
  );
}
