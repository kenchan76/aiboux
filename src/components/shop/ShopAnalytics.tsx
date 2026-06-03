"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyticsData, shopProducts } from "@/data/shop-sample-data";

const chartConfig = {
  sales: { label: "売上", color: "#2563eb" },
  previous: { label: "前期間", color: "#94a3b8" },
} satisfies ChartConfig;

export function ShopAnalytics() {
  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">分析</h1>
        <p className="text-sm text-neutral-500">売上、注文、流入、商品別成果、在庫回転を確認します。</p>
      </div>
      <Tabs defaultValue="sales" className="space-y-3">
        <TabsList className="h-8">
          <TabsTrigger value="sales" className="text-xs">売上</TabsTrigger>
          <TabsTrigger value="products" className="text-xs">商品別</TabsTrigger>
          <TabsTrigger value="customers" className="text-xs">顧客別</TabsTrigger>
          <TabsTrigger value="channels" className="text-xs">チャネル別</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="grid gap-3 xl:grid-cols-[1.4fr_1fr]">
          <Card className="shadow-sm">
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-sm">売上と注文の推移</CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsData.length === 0 ? (
                <div className="flex h-[320px] items-center justify-center rounded-md border border-dashed border-neutral-200 bg-neutral-50 text-sm text-neutral-500">
                  売上データはまだありません。注文確定後に推移を表示します。
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-[320px] w-full">
                  <AreaChart data={analyticsData} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `¥${Number(value) / 1000}K`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area dataKey="previous" type="monotone" stroke="var(--color-previous)" fill="var(--color-previous)" fillOpacity={0.08} />
                    <Area dataKey="sales" type="monotone" stroke="var(--color-sales)" fill="var(--color-sales)" fillOpacity={0.12} />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-sm">コンバージョン指標</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Metric label="セッション" value="未集計" delta="計測設定が必要です" />
              <Metric label="カート追加率" value="未集計" delta="商品公開後に計測します" />
              <Metric label="購入完了率" value="未集計" delta="注文確定後に計測します" />
              <Metric label="平均注文単価" value="未集計" delta="注文確定後に集計します" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products">
          <Card className="shadow-sm">
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-sm">商品別売上</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {shopProducts.length === 0 ? (
                <div className="rounded-md border border-dashed border-neutral-200 bg-neutral-50 px-3 py-6 text-sm text-neutral-500">
                  商品別売上はまだありません。商品と注文データが揃うと表示します。
                </div>
              ) : null}
              {shopProducts.map((product) => (
                <div key={product.id} className="grid items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm md:grid-cols-[1fr_120px_100px_100px]">
                  <span className="font-medium">{product.name}</span>
                  <span className="">¥{product.sales.toLocaleString("ja-JP")}</span>
                  <span>{product.stock}点</span>
                  <Badge variant={product.stock <= 8 ? "warning" : "secondary"}>{product.stock <= 8 ? "補充候補" : "通常"}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers">
          <Card className="shadow-sm"><CardContent className="p-4 text-sm text-neutral-600">リピーター率、初回購入後の再購入、顧客別売上を同じ密度で確認します。</CardContent></Card>
        </TabsContent>
        <TabsContent value="channels">
          <Card className="shadow-sm"><CardContent className="p-4 text-sm text-neutral-600">自社ストア、広告、SNS、メール経由の成果を集約します。</CardContent></Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function Metric({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2">
      <span className="text-neutral-600">{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-semibold text-neutral-950">{value}</span>
        <span className="text-xs font-medium text-neutral-500">{delta}</span>
      </span>
    </div>
  );
}
