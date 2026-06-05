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
  const importInputRef = React.useRef<HTMLInputElement | null>(null);

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

  const escapeCsvCell = (value: string | number) => {
    const text = String(value ?? "");
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  const exportInventoryCsv = () => {
    const header = ["productId", "商品名", "商品番号", "現在庫", "未出荷注文数", "ロケーション", "状態"];
    const body = rows.map((item) => [
      item.productId,
      item.name,
      item.sku,
      stockDrafts[item.productId] ?? item.stock,
      item.unshippedOrders,
      item.location,
      item.status,
    ]);
    const csv = [header, ...body].map((line) => line.map(escapeCsvCell).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aiboux-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("在庫CSVを書き出しました");
  };

  const importInventoryCsv = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length < 2) {
      toast.error("CSVに在庫行がありません");
      return;
    }
    const headers = lines[0].split(",").map((cell) => cell.replace(/^\uFEFF/, "").trim());
    const productIdIndex = headers.findIndex((cell) => /productId|商品ID/i.test(cell));
    const skuIndex = headers.findIndex((cell) => /sku|商品番号/i.test(cell));
    const stockIndex = headers.findIndex((cell) => /stock|現在庫|在庫/i.test(cell));
    if (stockIndex < 0 || (productIdIndex < 0 && skuIndex < 0)) {
      toast.error("productIdまたは商品番号と現在庫の列が必要です");
      return;
    }
    const nextDrafts: Record<string, number> = {};
    for (const line of lines.slice(1)) {
      const cells = line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, "").replace(/""/g, '"'));
      const lookup = productIdIndex >= 0 ? cells[productIdIndex] : cells[skuIndex];
      const stock = Math.max(0, Number(cells[stockIndex] || 0));
      const matched = items.find((item) => item.productId === lookup || item.sku === lookup);
      if (matched && Number.isFinite(stock)) nextDrafts[matched.productId] = stock;
    }
    if (Object.keys(nextDrafts).length === 0) {
      toast.error("一致する商品が見つかりませんでした");
      return;
    }
    setStockDrafts((current) => ({ ...current, ...nextDrafts }));
    toast.success(`${Object.keys(nextDrafts).length}件の在庫数を読み込みました。各行の保存で反映します。`);
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
            <input
              ref={importInputRef}
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(event) => {
                importInventoryCsv(event.target.files?.[0] ?? null);
                event.currentTarget.value = "";
              }}
            />
            <Button variant="outline" size="sm" className="gap-2" onClick={() => importInputRef.current?.click()}>
              <Upload className="size-4" />
              CSV取り込み
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={exportInventoryCsv}>
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
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={compact ? 5 : 7} className="h-28 text-center text-sm text-neutral-500">
                在庫データはまだありません。商品登録後にSKU別の在庫を管理できます。
              </TableCell>
            </TableRow>
          ) : null}
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
