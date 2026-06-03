import { AlertTriangle, ClipboardCheck, CreditCard, PackagePlus, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { KpiItem, StatusTone } from "@/data/core-sample-data";
import { cn } from "@/lib/utils";

const icons = {
  "売上（今月）": TrendingUp,
  未入金額: CreditCard,
  受注件数: ClipboardCheck,
  在庫アラート: AlertTriangle,
  発注待ち: PackagePlus,
};

const toneClasses: Record<StatusTone, string> = {
  neutral: "bg-neutral-100 text-neutral-700",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  purple: "bg-violet-50 text-violet-700",
};

export function CoreKpiCard({ item }: { item: KpiItem }) {
  const Icon = icons[item.label as keyof typeof icons] ?? TrendingUp;
  const isNegative = item.delta.includes("-") || item.delta.includes("期限");

  return (
    <Card className="border-neutral-200 shadow-sm">
      <CardContent className="p-2.5">
        <div className="flex items-start gap-3">
          <div className={cn("rounded-lg p-2", toneClasses[item.tone])}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-neutral-500">{item.label}</div>
            <div className="mt-1 whitespace-nowrap text-[16px] font-semibold tracking-tight text-neutral-950">{item.value}</div>
            <div className={cn("mt-1 text-xs font-medium", isNegative ? "text-red-600" : "text-emerald-600")}>
              {item.delta}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
