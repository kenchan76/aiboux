"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  支払い済み: "border-emerald-100 bg-emerald-50 text-emerald-700",
  未払い: "border-amber-100 bg-amber-50 text-amber-700",
  返金済み: "border-neutral-200 bg-neutral-100 text-neutral-700",
  処理中: "border-blue-100 bg-blue-50 text-blue-700",
  発送済み: "border-emerald-100 bg-emerald-50 text-emerald-700",
  一部発送: "border-amber-100 bg-amber-50 text-amber-700",
  発送準備中: "border-amber-100 bg-amber-50 text-amber-700",
  配送中: "border-blue-100 bg-blue-50 text-blue-700",
  配達完了: "border-emerald-100 bg-emerald-50 text-emerald-700",
  未発送: "border-neutral-200 bg-neutral-100 text-neutral-700",
  キャンセル: "border-red-100 bg-red-50 text-red-700",
  公開中: "border-emerald-100 bg-emerald-50 text-emerald-700",
  下書き: "border-neutral-200 bg-neutral-100 text-neutral-700",
  非公開: "border-red-100 bg-red-50 text-red-700",
  受注中: "border-blue-100 bg-blue-50 text-blue-700",
  有効: "border-emerald-100 bg-emerald-50 text-emerald-700",
  停止中: "border-amber-100 bg-amber-50 text-amber-700",
  期限切れ: "border-neutral-200 bg-neutral-100 text-neutral-700",
  接続済み: "border-emerald-100 bg-emerald-50 text-emerald-700",
  受付前: "border-neutral-200 bg-neutral-100 text-neutral-700",
  確認必要: "border-amber-100 bg-amber-50 text-amber-700",
};

export function StatusBadge({ value, className }: { value: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn("h-5 rounded-md px-1.5 text-[10px] font-medium", toneMap[value] ?? "border-neutral-200 bg-neutral-100 text-neutral-700", className)}>
      {value}
    </Badge>
  );
}
