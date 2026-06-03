import { useEffect, useState } from "react";
import { AlertCircle, DatabaseZap, Edit3, PackagePlus, PackageSearch, RefreshCcw, Search, Store } from "lucide-react";

import { ProductMasterForm } from "@/components/core/forms/ProductMasterForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type HubProduct = {
  id: string;
  name: string;
  janCode: string;
  status: string;
  stockQuantity: number;
  standardPrice: number;
  shopSyncEnabled: boolean;
  skuCount: number;
  shopListingCount: number;
  shopPublishedCount: number;
  shopErrorCount: number;
  lastInventoryAt: number | null;
  updatedAt: number | null;
};

type HubResponse = {
  success: boolean;
  products: HubProduct[];
  summary: {
    productCount: number;
    totalStock: number;
    shopPublishedCount: number;
    shopErrorCount: number;
  };
  error?: string;
};

const statusLabels: Record<string, string> = {
  draft: "下書き",
  active: "有効",
  paused: "停止中",
  discontinued: "終売",
  archived: "アーカイブ",
};

export function CorePimHubDashboard() {
  const [products, setProducts] = useState<HubProduct[]>([]);
  const [summary, setSummary] = useState<HubResponse["summary"]>({
    productCount: 0,
    totalStock: 0,
    shopPublishedCount: 0,
    shopErrorCount: 0,
  });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | undefined>();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProducts(query, status);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query, status]);

  async function loadProducts(nextQuery = query, nextStatus = status) {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ limit: "200" });
      if (nextQuery.trim()) params.set("q", nextQuery.trim());
      if (nextStatus !== "all") params.set("status", nextStatus);
      const response = await fetch(`/core/api/products/hub?${params.toString()}`, {
        headers: { accept: "application/json" },
      });
      const data = (await response.json()) as HubResponse;
      if (!response.ok || !data.success) throw new Error(data.error || "Core商品ハブを読み込めませんでした。");
      setProducts(data.products);
      setSummary(data.summary);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Core商品ハブを読み込めませんでした。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        <HubMetric icon={PackageSearch} label="Core商品" value={`${summary.productCount.toLocaleString("ja-JP")}件`} />
        <HubMetric icon={DatabaseZap} label="総在庫数" value={summary.totalStock.toLocaleString("ja-JP")} />
        <HubMetric icon={Store} label="Shop公開中" value={`${summary.shopPublishedCount.toLocaleString("ja-JP")}件`} />
        <HubMetric
          icon={AlertCircle}
          label="同期エラー"
          value={`${summary.shopErrorCount.toLocaleString("ja-JP")}件`}
          tone={summary.shopErrorCount > 0 ? "warning" : "neutral"}
        />
      </div>

      <Card className="border-neutral-200 shadow-sm">
        <CardHeader className="gap-2 p-3">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle className="text-base">PIM商品ハブ</CardTitle>
              <CardDescription className="text-xs">
                Coreを起点に、SKU、在庫、Shop配信状態を同じテナント内で突合します。
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => {
                  setEditingProductId(undefined);
                  setFormOpen(true);
                }}
              >
                <PackagePlus className="size-3.5" />
                商品マスタを追加
              </Button>
              <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => loadProducts()} disabled={loading}>
                <RefreshCcw className={cn("size-3.5", loading && "animate-spin")} />
                再読込
              </Button>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-[1fr_180px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-9 pl-8"
                placeholder="商品名・JAN・商品IDで検索"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="状態" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての状態</SelectItem>
                <SelectItem value="active">有効</SelectItem>
                <SelectItem value="draft">下書き</SelectItem>
                <SelectItem value="paused">停止中</SelectItem>
                <SelectItem value="discontinued">終売</SelectItem>
                <SelectItem value="archived">アーカイブ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[260px]">商品</TableHead>
                  <TableHead>状態</TableHead>
                  <TableHead className="text-right">SKU</TableHead>
                  <TableHead className="text-right">総在庫</TableHead>
                  <TableHead>Shop配信</TableHead>
                  <TableHead>最終在庫同期</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={7}>
                        <div className="h-8 animate-pulse rounded-md bg-neutral-100" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : products.length ? (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{product.name}</div>
                          <div className="truncate text-[11px] text-neutral-500">
                            {product.janCode || "JAN未設定"} / {product.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <CoreStatusBadge status={product.status} />
                      </TableCell>
                      <TableCell className="text-right">{product.skuCount.toLocaleString("ja-JP")}</TableCell>
                      <TableCell className="text-right font-medium">{product.stockQuantity.toLocaleString("ja-JP")}</TableCell>
                      <TableCell>
                        <ShopStatusBadge product={product} />
                      </TableCell>
                      <TableCell className="text-xs text-neutral-600">{formatDate(product.lastInventoryAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1.5"
                          onClick={() => {
                            setEditingProductId(product.id);
                            setFormOpen(true);
                          }}
                        >
                          <Edit3 className="size-3.5" />
                          編集
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-sm text-neutral-500">
                      条件に一致するCore商品はありません。
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <ProductMasterForm
        open={formOpen}
        productId={editingProductId}
        onOpenChange={setFormOpen}
        onSaved={() => {
          void loadProducts();
        }}
      />
    </div>
  );
}

function HubMetric({
  icon: Icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: typeof PackageSearch;
  label: string;
  value: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <Card className="border-neutral-200 shadow-sm">
      <CardContent className="flex items-center gap-3 p-3">
        <div className={cn("rounded-md border p-2", tone === "warning" ? "border-amber-200 bg-amber-50" : "border-neutral-200 bg-neutral-50")}>
          <Icon className={cn("size-4", tone === "warning" ? "text-amber-700" : "text-neutral-700")} />
        </div>
        <div>
          <div className="text-xs text-neutral-500">{label}</div>
          <div className="text-lg font-semibold leading-tight">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function CoreStatusBadge({ status }: { status: string }) {
  const variant = status === "active" ? "success" : status === "paused" || status === "draft" ? "warning" : "outline";
  return (
    <Badge variant={variant} className="font-medium">
      {statusLabels[status] ?? status}
    </Badge>
  );
}

function ShopStatusBadge({ product }: { product: HubProduct }) {
  if (product.shopErrorCount > 0) return <Badge variant="destructive">エラー</Badge>;
  if (product.shopPublishedCount > 0) return <Badge variant="success">公開中 {product.shopPublishedCount}</Badge>;
  if (product.shopListingCount > 0 || product.shopSyncEnabled) return <Badge variant="secondary">下書き/同期準備</Badge>;
  return <Badge variant="outline">未配信</Badge>;
}

function formatDate(value: number | null): string {
  if (!value) return "未記録";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
