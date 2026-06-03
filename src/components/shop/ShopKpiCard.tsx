"use client";

import type { ShopMetric } from "@/data/shop-sample-data";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const toneClass = {
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  neutral: "bg-neutral-50 text-neutral-700",
};

export function ShopKpiCard({ metric }: { metric: ShopMetric }) {
  const Icon = metric.icon;
  return (
    <Card className="shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", toneClass[metric.tone])}>
            <Icon className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-neutral-500">{metric.label}</div>
            <div className="mt-0.5 text-lg font-semibold tracking-tight text-neutral-950">{metric.value}</div>
            <div className={cn("mt-0.5 text-xs font-medium", metric.tone === "success" ? "text-emerald-700" : "text-neutral-500")}>
              {metric.delta}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
