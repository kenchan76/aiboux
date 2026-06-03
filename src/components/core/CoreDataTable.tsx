import { MoreHorizontal, Printer, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import type { DocumentRow, InventoryRow, StatusTone } from "@/data/core-sample-data";
import { formatCurrency } from "@/data/core-sample-data";
import type { CoreDocumentUiConfig } from "@/lib/coreDocumentUiConfig";
import { cn } from "@/lib/utils";

const badgeTone: Record<StatusTone, string> = {
  neutral: "border-neutral-200 bg-neutral-50 text-neutral-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  red: "border-red-200 bg-red-50 text-red-700",
  purple: "border-violet-200 bg-violet-50 text-violet-700",
};

export function StatusBadge({ tone, children }: { tone: StatusTone; children: React.ReactNode }) {
  return (
    <Badge variant="outline" className={cn("rounded-md px-1.5 py-0 text-[11px] font-medium", badgeTone[tone])}>
      {children}
    </Badge>
  );
}

export function DocumentTable({
  rows,
  config,
  onSelect,
  onPrint,
  onMail,
  onFax,
  selectedIds,
  onToggleRow,
  onToggleAll,
}: {
  rows: DocumentRow[];
  config: CoreDocumentUiConfig;
  onSelect: (row: DocumentRow) => void;
  onPrint?: (row: DocumentRow) => void;
  onMail?: (row: DocumentRow) => void;
  onFax?: (row: DocumentRow) => void;
  selectedIds?: Set<string>;
  onToggleRow?: (row: DocumentRow, checked: boolean) => void;
  onToggleAll?: (checked: boolean) => void;
}) {
  const allSelected = rows.length > 0 && rows.every((row) => selectedIds?.has(row.id));
  const someSelected = rows.some((row) => selectedIds?.has(row.id));

  return (
    <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50/90">
            <TableHead className="h-8 w-[36px] px-2">
              <Checkbox
                aria-label="表示中の帳票を全件選択"
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={(checked) => onToggleAll?.(checked === true)}
              />
            </TableHead>
            <TableHead className="h-8 w-[150px] px-2 text-xs">{config.listColumns.number}</TableHead>
            <TableHead className="h-8 min-w-[180px] px-2 text-xs">{config.listColumns.partner}</TableHead>
            <TableHead className="h-8 min-w-[180px] px-2 text-xs">{config.listColumns.destination}</TableHead>
            <TableHead className="h-8 w-[112px] px-2 text-xs">{config.listColumns.date}</TableHead>
            <TableHead className="h-8 w-[108px] px-2 text-right text-xs">{config.listColumns.amount}</TableHead>
            <TableHead className="h-8 w-[84px] px-2 text-xs">{config.listColumns.owner}</TableHead>
            <TableHead className="h-8 w-[88px] px-2 text-xs">{config.listColumns.status}</TableHead>
            <TableHead className="w-[128px] px-2 text-right text-xs">{config.listColumns.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              data-testid={`document-row-${row.id}`}
              className="h-10 cursor-pointer hover:bg-blue-50/40"
              onClick={() => onSelect(row)}
            >
              <TableCell className="px-2 py-1" onClick={(event) => event.stopPropagation()}>
                <Checkbox
                  aria-label={`${row.id}を選択`}
                  checked={selectedIds?.has(row.id) ?? false}
                  onCheckedChange={(checked) => onToggleRow?.(row, checked === true)}
                />
              </TableCell>
              <TableCell className="px-2 py-1 text-xs font-semibold text-blue-700 underline-offset-2 hover:underline">
                <button type="button" className="font-semibold text-blue-700 underline-offset-2 hover:underline" onClick={(event) => { event.stopPropagation(); onSelect(row); }}>
                  {row.id}
                </button>
              </TableCell>
              <TableCell className="max-w-[220px] truncate px-2 py-1 text-sm font-medium text-neutral-950">
                {row.partner}
              </TableCell>
              <TableCell className="max-w-[240px] truncate px-2 py-1 text-xs text-neutral-700">{getDestination(row, config)}</TableCell>
              <TableCell className="px-2 py-1 text-xs text-neutral-600">{getListDate(row, config)}</TableCell>
              <TableCell className="px-2 py-1 text-right text-xs text-neutral-900">
                {formatCurrency(row.amount)}
              </TableCell>
              <TableCell className="px-2 py-1 text-xs text-neutral-600">{row.owner}</TableCell>
              <TableCell className="px-2 py-1">
                <StatusBadge tone={row.tone}>{row.status}</StatusBadge>
              </TableCell>
              <TableCell className="px-2 py-1" onClick={(event) => event.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onPrint?.(row)} aria-label={`${row.id}を印刷`}>
                    <Printer className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onMail?.(row)} aria-label={`${row.id}のメール送付を準備`}>
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onSelect(row)}>詳細を開く</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPrint?.(row)}>印刷（PDF）</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onMail?.(row)}>メール送付を準備</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFax?.(row)}>FAX送付を準備</DropdownMenuItem>
                    <DropdownMenuItem>複製して作成</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getDestination(row: DocumentRow, config: CoreDocumentUiConfig) {
  if (config.type === "delivery") return "東京本社 1F倉庫";
  if (config.type === "quote") return "本社購買部";
  if (config.type === "order") return "東京倉庫";
  if (config.type === "invoice") return `${row.partner} 請求窓口`;
  if (config.type === "payment") return row.id.startsWith("R") ? row.id.replace(/^R/, "I") : "対象請求書";
  return "東京倉庫";
}

function getListDate(row: DocumentRow, config: CoreDocumentUiConfig) {
  if (config.type === "delivery" || config.type === "purchase-order") return row.dueAt || row.issuedAt;
  return row.issuedAt || row.dueAt;
}

export function InventoryTable({
  rows,
  onSelect,
  selectedId,
}: {
  rows: InventoryRow[];
  onSelect: (row: InventoryRow) => void;
  selectedId?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50/80">
            <TableHead className="h-8 px-2 text-xs">SKU</TableHead>
            <TableHead className="h-8 px-2 text-xs">商品名</TableHead>
            <TableHead className="h-8 px-2 text-xs">カテゴリ</TableHead>
            <TableHead className="h-8 px-2 text-xs text-right">現在庫</TableHead>
            <TableHead className="h-8 px-2 text-xs text-right">適正在庫</TableHead>
            <TableHead className="h-8 px-2 text-xs text-right">入荷予定</TableHead>
            <TableHead className="h-8 px-2 text-xs text-right">出荷予定</TableHead>
            <TableHead className="h-8 px-2 text-xs">状態</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className={cn("h-9 cursor-pointer hover:bg-blue-50/40", selectedId === row.id && "bg-blue-50/60")} onClick={() => onSelect(row)}>
              <TableCell className="px-2 py-1 text-xs">{row.sku}</TableCell>
              <TableCell className="px-2 py-1 text-sm font-medium text-neutral-950">{row.name}</TableCell>
              <TableCell className="px-2 py-1 text-xs text-neutral-600">{row.category}</TableCell>
              <TableCell className="px-2 py-1 text-right text-xs">{row.currentStock}</TableCell>
              <TableCell className="px-2 py-1 text-right text-xs">{row.idealStock}</TableCell>
              <TableCell className="px-2 py-1 text-right text-xs">{row.inbound}</TableCell>
              <TableCell className="px-2 py-1 text-right text-xs">{row.outbound}</TableCell>
              <TableCell className="px-2 py-1">
                <StatusBadge tone={row.tone}>{row.status}</StatusBadge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
