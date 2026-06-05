"use client";

import * as React from "react";
import { Loader2, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shop/StatusBadges";
import { formatYen, shopProducts, type ShopProduct } from "@/data/shop-sample-data";

interface ProductsTableProps {
  products?: ShopProduct[];
  compact?: boolean;
  onSelectProduct?: (product: ShopProduct) => void;
}

export function ProductsTable({ products = shopProducts, compact, onSelectProduct }: ProductsTableProps) {
  const rows = compact ? products.slice(0, 5) : products;
  const [remoteSync, setRemoteSync] = React.useState<Record<string, ShopProduct["feedSync"]>>({});
  const [isRefreshingSync, setIsRefreshingSync] = React.useState(false);

  const loadSyncStatus = React.useCallback(() => {
    let cancelled = false;
    setIsRefreshingSync(true);
    fetch("/shop/api/feed-sync/status")
      .then(async (response) => (response.ok ? ((await response.json()) as FeedSyncStatusResponse) : null))
      .then((data: FeedSyncStatusResponse | null) => {
        if (cancelled || !data?.success || !Array.isArray(data.products)) return;
        const next: Record<string, ShopProduct["feedSync"]> = {};
        for (const item of data.products) {
          if (typeof item.productId === "string") next[item.productId] = normalizeRemoteSync(item);
        }
        setRemoteSync(next);
      })
        .catch(() => {
        // Product list remains usable with local empty state when the status API is unavailable.
      })
      .finally(() => {
        if (!cancelled) setIsRefreshingSync(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    return loadSyncStatus();
  }, [loadSyncStatus]);

  const syncFor = React.useCallback((product: ShopProduct) => {
    return remoteSync[product.id] ?? product.feedSync ?? {
      google: "unsynced" as const,
      bing: "unsynced" as const,
    };
  }, [remoteSync]);

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      {!compact ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-50 px-3 py-2">
          <div>
            <div className="text-xs font-medium text-neutral-700">Google/Bingへの送信状態</div>
            <p className="mt-0.5 text-[11px] text-neutral-500">商品保存後に自動で送信します。テスト環境では実送信せず、状態だけ記録します。</p>
          </div>
          <Button variant="outline" size="sm" className="h-7 gap-1.5 bg-white text-xs" onClick={() => { loadSyncStatus(); }} disabled={isRefreshingSync}>
            {isRefreshingSync ? <Loader2 className="size-3.5 animate-spin" /> : null}
            最新状態を確認
          </Button>
        </div>
      ) : null}
      <Table className="min-w-[1040px]">
        <TableHeader>
          <TableRow className="bg-neutral-50">
            {!compact && <TableHead className="w-8"><Checkbox aria-label="商品を全選択" /></TableHead>}
            <TableHead>商品</TableHead>
            <TableHead>商品番号</TableHead>
            <TableHead>カテゴリ</TableHead>
            <TableHead className="text-right">価格</TableHead>
            <TableHead className="text-right">在庫</TableHead>
            <TableHead>販売状態</TableHead>
            <TableHead>自動集客</TableHead>
            <TableHead className="text-right">売上</TableHead>
            {!compact && <TableHead className="w-10" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={compact ? 9 : 10} className="h-28 text-center text-sm text-neutral-500">
                商品はまだ登録されていません。「商品を追加」から公開用の商品情報を作成します。
              </TableCell>
            </TableRow>
          ) : null}
          {rows.map((product) => {
            const display = toAdminProductDisplay(product);
            return (
            <TableRow key={product.id} className="cursor-pointer" onClick={() => onSelectProduct?.(product)}>
              {!compact && (
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <Checkbox aria-label={`${display.name}を選択`} />
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-2">
                  <img
                    src={product.image || adminImageFor(display.category)}
                    alt={display.name}
                    className="size-9 rounded-md border border-neutral-200 object-cover"
                    onError={(event) => {
                      const image = event.currentTarget;
                      if (image.dataset.fallbackApplied === "true") return;
                      image.dataset.fallbackApplied = "true";
                      image.src = adminImageFor(display.category);
                    }}
                  />
                  <div className="min-w-0">
                    <div className="truncate font-medium">{display.name}</div>
                    <div className="truncate text-xs text-neutral-500">{display.tags.join(" / ")}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className=" text-xs">{product.sku}</TableCell>
              <TableCell>{display.category}</TableCell>
              <TableCell className="text-right">{formatYen(product.price)}</TableCell>
              <TableCell className="text-right">{product.stock}</TableCell>
              <TableCell><StatusBadge value={product.status} /></TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <FeedSyncBadge channel="Google" status={syncFor(product).google} />
                    <FeedSyncBadge channel="Bing" status={syncFor(product).bing} />
                  </div>
                  {!compact ? (
                    <div className="text-[11px] text-neutral-500">
                      {syncFor(product).lastSyncedAt ?? "保存すると自動で送信"}
                    </div>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="text-right">{formatYen(product.sales)}</TableCell>
              {!compact && (
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label="商品操作">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onSelectProduct?.(product)}>編集</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          window.history.pushState({ section: "product-new", duplicateFrom: product.id }, "", `/s/aiboux/admin/products/new?duplicate=${encodeURIComponent(product.id)}`);
                          window.dispatchEvent(new PopStateEvent("popstate", { state: { section: "product-new", duplicateFrom: product.id } }));
                        }}
                      >
                        複製して編集
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSelectProduct?.(product)}>販売状態を編集</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {!compact && (
        <div className="border-t border-neutral-200 bg-neutral-50 p-2">
          <Button size="sm" className="gap-2" onClick={() => {
            window.history.pushState({ section: "product-new" }, "", "/s/aiboux/admin/products/new");
            window.dispatchEvent(new PopStateEvent("popstate", { state: { section: "product-new" } }));
          }}>
            <Plus className="size-4" />
            商品を追加
          </Button>
        </div>
      )}
    </div>
  );
}

type SyncStatus = NonNullable<ShopProduct["feedSync"]>["google"];

type FeedSyncStatusResponse = {
  success?: boolean;
  products?: Array<{
    productId?: string;
    status?: string;
    providers?: Array<{ channel?: string; status?: string; syncedAt?: string }>;
    finalSyncedAt?: string | null;
  }>;
};

function FeedSyncBadge({ channel, status }: { channel: "Google" | "Bing"; status: SyncStatus }) {
  const className = {
    unsynced: "border-neutral-200 bg-neutral-50 text-neutral-500",
    syncing: "border-blue-200 bg-blue-50 text-blue-700",
    synced: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-red-200 bg-red-50 text-red-700",
  }[status];

  return (
    <span
      className={`inline-flex h-6 items-center gap-1 rounded-md border px-1.5 text-[11px] font-semibold ${className}`}
      title={`${channel}に商品情報と在庫状態を${syncLabel(status)}`}
    >
      {status === "syncing" ? <Loader2 className="size-3 animate-spin" /> : null}
      <span>{channel}</span>
      <span className="font-medium">{syncLabel(status)}</span>
    </span>
  );
}

function syncLabel(status: SyncStatus): string {
  if (status === "synced") return "同期完了";
  if (status === "syncing") return "同期中";
  if (status === "error") return "要確認";
  return "未同期";
}

function normalizeRemoteSync(item: {
  status?: string;
  providers?: Array<{ channel?: string; status?: string; syncedAt?: string }>;
  finalSyncedAt?: string | null;
}): ShopProduct["feedSync"] {
  const google = item.providers?.find((provider) => provider.channel === "google");
  const bing = item.providers?.find((provider) => provider.channel === "bing");
  return {
    google: providerStatus(item.status, google?.status),
    bing: providerStatus(item.status, bing?.status),
    lastSyncedAt: item.finalSyncedAt ? new Date(item.finalSyncedAt).toLocaleString("ja-JP") : undefined,
  };
}

function providerStatus(jobStatus?: string, providerStatusValue?: string): SyncStatus {
  if (providerStatusValue === "failed" || jobStatus === "failed") return "error";
  if (providerStatusValue === "succeeded" || jobStatus === "succeeded") return "synced";
  if (jobStatus === "queued" || jobStatus === "received") return "syncing";
  return "unsynced";
}

function toAdminProductDisplay(product: ShopProduct) {
  const rawName = String(product.name ?? "");
  const rawCategory = String(product.category ?? "");
  const source = `${rawName} ${rawCategory} ${product.sku} ${product.tags.join(" ")}`;
  const isInternalTestName = /公開検証商品|検証商品|テスト商品|利益確認用|dummy|sample|test product/i.test(source);
  const category = normalizeAdminCategory(source);
  const name = isInternalTestName ? adminDisplayNameFor(source, category) : rawName;
  const tags = product.tags
    .filter((tag) => !/検証|テスト|AIBOUX|dummy|sample|test/i.test(tag))
    .slice(0, 3);

  return {
    name,
    category,
    tags: tags.length ? tags : [category, product.status],
  };
}

function adminDisplayNameFor(source: string, category: string) {
  if (/4580000232621|洗剤|ホームケア|日用品/i.test(source)) return "毎日使えるホームケア洗剤セット";
  if (/利益|margin|profit/i.test(source)) return "ホームケア詰め替えセット";
  if (/4901234567897|タオル|ギフト/i.test(source)) return "雪花セレクト ギフトタオル";
  if (/4901234567895|ボトル|ステンレス/i.test(source)) return "軽量ステンレスボトル";
  if (category === "キッチン用品") return "キッチン用品セット";
  if (category === "日用品") return "毎日使える日用品セット";
  return "雪花セレクト 商品";
}

function normalizeAdminCategory(source: string) {
  if (/test category|166|検証|テスト/i.test(source)) return "日用品";
  if (/towel|タオル|寝具/i.test(source)) return "タオル・寝具";
  if (/kitchen|drinkware|ボトル|ステンレス|キッチン/i.test(source)) return "キッチン用品";
  if (/gift|ギフト/i.test(source)) return "ギフト";
  if (/coffee|tea|コーヒー|茶/i.test(source)) return "コーヒー・お茶";
  if (/洗剤|日用品|ホームケア|clean|laundry/i.test(source)) return "日用品";
  return source.trim() || "日用品";
}

function adminImageFor(category: string) {
  if (category === "タオル・寝具") {
    return "https://images.unsplash.com/photo-1724847885015-be191f1a47ef?auto=format&fit=crop&w=160&h=160&q=82";
  }
  if (category === "キッチン用品") {
    return "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=160&h=160&q=82";
  }
  if (category === "ギフト") {
    return "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=160&h=160&q=82";
  }
  if (category === "コーヒー・お茶") {
    return "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=160&h=160&q=82";
  }
  return "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=160&h=160&q=82";
}
