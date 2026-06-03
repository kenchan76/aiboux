"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { analyticsData, type ShopAnalyticsReport } from "@/data/shop-sample-data";

const chartConfig = {
  sales: {
    label: "売上",
    color: "#2563eb",
  },
  previous: {
    label: "前期間",
    color: "#93c5fd",
  },
} satisfies ChartConfig;

export function ShopSalesChart({ data = analyticsData }: { data?: ShopAnalyticsReport[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[220px] w-full aspect-auto">
      <LineChart data={data} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickFormatter={(value: number) => `¥${Math.round(value / 1000)}K`}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="sales" stroke="var(--color-sales)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="previous" stroke="var(--color-previous)" strokeWidth={2} dot={false} strokeDasharray="4 4" />
      </LineChart>
    </ChartContainer>
  );
}
