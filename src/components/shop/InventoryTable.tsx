"use client";

import * as React from "react";
import { Download, ExternalLink, Pencil, Save, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shop/StatusBadges";
import { inventoryItems, type InventoryItem } from "@/data/shop-sample-data";

type UpdateStockResponse = {
  success?: boolean;
  stock?: number;
  error?: string;
};

export function InventoryTable({
  items = inventoryItems,
  compact = false,
  onOpenProduct,
}: {
  items?: InventoryItem[];
  compact?: boolean;
  onOpenProduct?: (productId: string) => void;
}) {
  const rows = compact ? items.slice(0, 5) : items;
  const [stockDrafts, setStockDrafts] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(items.map((item) => [item.productId, item.stock])),
  );
  const [savedStocks, setSavedStocks] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(items.map((item) => [item.productId, item.stock])),
  );

  React.useEffect(() => {
    setStockDrafts(Object.fromEntries(items.map((item) => [item.productId, item.stock])));
    setSavedStocks(Object.fromEntries(items.map((item) => [item.productId, item.stock])));
  }, [items]);

  const hasUnsavedStock = rows.some((item) => (stockDrafts[item.productId] ?? item.stock) !== (savedStocks[item.productId] ?? item.stock));

  React.useEffect(() => {
    window.dispatchEvent(new CustomEvent("aiboux:unsaved-inventory", { detail: hasUnsavedStock }));
  }, [hasUnsavedStock]);

  React.useEffect(() => {
    return () => {
      window.dispatchEvent(new CustomEvent("aiboux:unsaved-inventory", { detail: false }));
    };
  }, []);

  React.useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedStock) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedStock]);

  const saveStock = async (item: InventoryItem) => {
    const nextStock = stockDrafts[item.productId] ?? item.stock;
    if (nextStock < item.unshippedOrders) {
      const ok = window.confirm(`未出荷の注文が${item.unshippedOrders}件あります。在庫を${nextStock}個で保存すると不足する可能性があります。保存しますか？`);
      if (!ok) return;
    }
    try {
      const response = await fetch("/shop/api/inventory/update-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.productId, stock: nextStock }),
      });
      const result = (await response.json().catch(() => ({}))) as UpdateStockResponse;
      if (!response.ok || !result.success) throw new Error(result.error || "在庫数を保存できませんでした");
      setSavedStocks((current) => ({ ...current, [item.productId]: result.stock ?? nextStock }));
      toast.success(`${item.name}の在庫数を${result.stock ?? nextStock}個で保存しました`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "在庫数を保存できませんでした");
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      {!compact && (
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-2">
          <div>
            <div className="text-sm font-medium">在庫数の確認と更新</div>
          <div className="text-xs text-neutral-500">数字欄を直接変更し、各行の「保存」で反映します。未保存の変更があるまま離れると確認が出ます。</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" disabled title="CSV取り込みAPI接続後に有効化します">
              <Upload className="size-4" />
              CSV取り込み
            </Button>
            <Button variant="outline" size="sm" className="gap-2" disabled title="CSV書き出しAPI接続後に有効化します">
              <Download className="size-4" />
              CSV書き出し
            </Button>
          </div>
        </div>
      )}
      <Table className="min-w-[860px]">
        <TableHeader>
          <TableRow className="bg-neutral-50">
            <TableHead>商品</TableHead>
            <TableHead>商品番号</TableHead>
            <TableHead className="text-right">現在庫（編集可）</TableHead>
            <TableHead className="text-right">未出荷の注文数</TableHead>
            {!compact && <TableHead>ロケーション</TableHead>}
            <TableHead>状態</TableHead>
            {!compact && <TableHead className="w-[96px] text-right">保存</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => {
            const draftValue = stockDrafts[item.productId] ?? item.stock;
            const isChanged = draftValue !== (savedStocks[item.productId] ?? item.stock);
            return (
            <TableRow key={item.productId} className="group hover:bg-blue-50/30">
              <TableCell className="font-medium">
                <button
                  type="button"
                  className="inline-flex max-w-full items-center gap-1.5 text-left text-neutral-950 underline-offset-2 hover:underline"
                  onClick={() => onOpenProduct?.(item.productId)}
                >
                  <span className="truncate">{item.name}</span>
                  {!compact && <ExternalLink className="size-3.5 shrink-0 text-neutral-400" />}
                </button>
              </TableCell>
              <TableCell className="text-xs text-neutral-600">{item.sku}</TableCell>
              <TableCell className="text-right">
                {compact ? (
                  <span>{draftValue}</span>
                ) : (
                  <div className="ml-auto flex w-fit items-center gap-1.5">
                    {isChanged ? <Badge variant="outline" className="rounded-md border-amber-200 bg-amber-50 text-[11px] text-amber-700">未保存</Badge> : null}
                    <div className="relative">
                      <Pencil className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400 opacity-0 transition group-hover:opacity-100" />
                      <Input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        className={isChanged ? "h-8 w-28 border-amber-300 pl-7 text-right" : "h-8 w-28 pl-7 text-right"}
                        value={draftValue}
                        onChange={(event) =>
                          setStockDrafts((current) => ({
                            ...current,
                            [item.productId]: Math.max(0, Number(event.target.value || 0)),
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">{item.unshippedOrders}</TableCell>
              {!compact && <TableCell>{item.location}</TableCell>}
              <TableCell><StatusBadge value={item.status} /></TableCell>
              {!compact && (
                <TableCell className="text-right">
                  {isChanged ? (
                    <Button size="sm" className="h-7 gap-1.5" onClick={() => saveStock(item)}>
                      <Save className="size-3.5" />
                      保存
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-7 gap-1.5" onClick={() => saveStock(item)}>
                      保存
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
