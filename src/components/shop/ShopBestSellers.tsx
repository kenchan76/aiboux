"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatYen, shopProducts, type ShopProduct } from "@/data/shop-sample-data";

export function ShopBestSellers({ products = shopProducts }: { products?: ShopProduct[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
        <CardTitle className="text-base">ベストセラー商品</CardTitle>
        <Select defaultValue="week">
          <SelectTrigger className="h-8 w-[92px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">今週</SelectItem>
            <SelectItem value="month">今月</SelectItem>
            <SelectItem value="quarter">四半期</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-4">
        {products.length === 0 ? (
          <div className="rounded-md border border-dashed border-neutral-200 bg-neutral-50 px-3 py-6 text-sm text-neutral-600">
            商品別売上はまだありません。商品を登録し、注文が入ると集計します。
          </div>
        ) : null}
        {products.map((product) => (
          <div key={product.id} className="grid grid-cols-[40px_1fr_auto_auto] items-center gap-2">
            <img src={product.image} alt={product.name} className="size-9 rounded-md border border-neutral-200 object-cover" />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{product.name}</div>
              <div className="text-xs text-neutral-500">SKU: {product.sku}</div>
            </div>
            <div className="text-right text-xs text-neutral-600">{product.stock + product.reserved}個</div>
            <div className="text-right text-xs">{formatYen(product.sales)}</div>
          </div>
        ))}
        <Button asChild variant="link" className="h-7 px-0">
          <a href="/s/aiboux/admin/products">商品別売上を開く</a>
        </Button>
      </CardContent>
    </Card>
  );
}
