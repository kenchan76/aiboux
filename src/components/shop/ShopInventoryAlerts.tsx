"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shop/StatusBadges";
import { inventoryItems, type InventoryItem } from "@/data/shop-sample-data";

export function ShopInventoryAlerts({ items = inventoryItems, onOpenInventory }: { items?: InventoryItem[]; onOpenInventory?: () => void }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
        <CardTitle className="text-base">在庫アラート</CardTitle>
        <Button variant="outline" size="sm" onClick={onOpenInventory}>すべて見る</Button>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-4">
        {items.filter((item) => item.unshippedOrders > 0).length === 0 ? (
          <div className="rounded-md border border-dashed border-neutral-200 bg-neutral-50 px-3 py-6 text-sm text-neutral-600">
            在庫アラートはありません。商品と在庫を登録すると注意が必要なSKUを表示します。
          </div>
        ) : null}
        {items
          .filter((item) => item.unshippedOrders > 0)
          .map((item) => (
            <div key={item.productId} className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 px-3 py-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-neutral-950">{item.name}</div>
                <div className="text-xs text-neutral-500">SKU: {item.sku} / 未出荷 {item.unshippedOrders}件 / 現在庫 {item.stock}点</div>
              </div>
              <StatusBadge value={item.status} />
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
