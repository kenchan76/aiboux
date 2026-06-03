"use client";

import * as React from "react";
import { FileText, MoreHorizontal, ReceiptText, Truck, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shop/StatusBadges";
import { formatYen, shopOrders, type ShippingCarrier, type ShopOrder } from "@/data/shop-sample-data";
import { printShopDocument, printShopDocuments } from "@/lib/shopDocumentPrint";

const shippingCarriers: ShippingCarrier[] = ["日本郵便", "ヤマト運輸", "佐川急便"];

interface ShopRecentOrdersProps {
  orders?: ShopOrder[];
  compact?: boolean;
  onSelectOrder?: (order: ShopOrder) => void;
}

export function ShopRecentOrders({ orders = shopOrders, compact, onSelectOrder }: ShopRecentOrdersProps) {
  const rows = compact ? orders.slice(0, 5) : orders;
  const [selectedOrderIds, setSelectedOrderIds] = React.useState<string[]>([]);
  const [carrierDrafts, setCarrierDrafts] = React.useState<Record<string, ShippingCarrier>>(() =>
    Object.fromEntries(orders.map((order) => [order.id, order.carrier ?? "ヤマト運輸"])),
  );

  React.useEffect(() => {
    setSelectedOrderIds((current) => current.filter((id) => orders.some((order) => order.id === id)));
  }, [orders]);

  const selectedOrders = rows.filter((order) => selectedOrderIds.includes(order.id));
  const allRowsSelected = rows.length > 0 && selectedOrders.length === rows.length;

  const toggleOrder = (orderId: string, checked: boolean) => {
    setSelectedOrderIds((current) => (checked ? [...new Set([...current, orderId])] : current.filter((id) => id !== orderId)));
  };

  const toggleAllRows = (checked: boolean) => {
    setSelectedOrderIds(checked ? rows.map((order) => order.id) : []);
  };

  const bulkPrint = (kind: "delivery" | "invoice" | "receipt") => {
    if (selectedOrders.length === 0) {
      toast.error("一括出力する注文を選択してください");
      return;
    }
    const opened = printShopDocuments(selectedOrders, kind);
    if (!opened) toast.error("帳票プレビューを開けませんでした。ポップアップ設定を確認してください。");
  };

  const rowTone = (order: ShopOrder) => {
    if (order.fulfillmentStatus === "キャンセル") return "bg-red-50/50 hover:bg-red-50";
    if (order.fulfillmentStatus === "発送済み") return "bg-green-50/50 hover:bg-green-50";
    return "hover:bg-neutral-50";
  };

  const updateCarrier = async (order: ShopOrder, carrier: ShippingCarrier) => {
    setCarrierDrafts((current) => ({ ...current, [order.id]: carrier }));
    if (!order.trackingNumber) {
      toast.info("配送業者は詳細画面で出荷伝票番号と一緒に保存します");
      return;
    }
    try {
      const response = await fetch("/shop/api/orders/update-shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, carrier, trackingNumber: order.trackingNumber }),
      });
      const data = (await response.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (!response.ok || !data.success) throw new Error(data.error || "配送業者を保存できませんでした");
      toast.success(`${order.id} の配送業者を ${carrier} で保存しました`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "配送業者を保存できませんでした");
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      {!compact && selectedOrders.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-50 px-3 py-2">
          <div className="text-sm font-medium text-neutral-950">{selectedOrders.length}件を選択中</div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => bulkPrint("delivery")}>
              <FileText className="size-4" />
              納品書を一括出力
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => bulkPrint("invoice")}>
              <FileText className="size-4" />
              請求書を一括出力
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => bulkPrint("receipt")}>
              <ReceiptText className="size-4" />
              領収書を一括出力
            </Button>
          </div>
        </div>
      ) : !compact ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-50 px-3 py-2">
          <div className="text-xs text-neutral-600">複数の帳票をまとめて出す場合は、左のチェックボックスで注文を選択します。</div>
          <div className="text-xs font-medium text-neutral-500">配送業者は行内で選び、発送情報の入力やキャンセルは右端の「...」から開きます。</div>
        </div>
      ) : null}
      <Table className="min-w-[980px]">
        <TableHeader>
          <TableRow className="bg-neutral-50">
            {!compact && (
              <TableHead className="w-8">
                <Checkbox
                  aria-label="注文を全選択"
                  checked={allRowsSelected}
                  onCheckedChange={(value) => toggleAllRows(value === true)}
                />
              </TableHead>
            )}
            <TableHead>注文番号</TableHead>
            <TableHead>日時</TableHead>
            <TableHead>お客様</TableHead>
            <TableHead className="text-right">合計金額</TableHead>
            <TableHead>支払い</TableHead>
            <TableHead>発送準備</TableHead>
            {!compact && <TableHead>配送状況</TableHead>}
            {!compact && <TableHead className="w-[150px]">配送業者</TableHead>}
            {!compact && <TableHead className="w-[180px]">追跡番号</TableHead>}
            {!compact && <TableHead className="w-[64px] text-right">操作</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((order) => (
            <TableRow
              key={order.id}
              className={`cursor-pointer ${rowTone(order)}`}
              onClick={() => onSelectOrder?.(order)}
            >
              {!compact && (
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <Checkbox
                    aria-label={`${order.id}を選択`}
                    checked={selectedOrderIds.includes(order.id)}
                    onCheckedChange={(value) => toggleOrder(order.id, value === true)}
                  />
                </TableCell>
              )}
              <TableCell className="text-xs font-semibold">{order.id}</TableCell>
              <TableCell className="text-xs text-neutral-600">{order.orderedAt}</TableCell>
              <TableCell className="font-medium">{order.customerName}</TableCell>
              <TableCell className="text-right">{formatYen(order.total)}</TableCell>
              <TableCell><StatusBadge value={order.paymentStatus} /></TableCell>
              <TableCell><StatusBadge value={order.fulfillmentStatus} /></TableCell>
              {!compact && <TableCell><StatusBadge value={order.deliveryStatus} /></TableCell>}
              {!compact && (
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <Select
                    value={carrierDrafts[order.id] ?? order.carrier ?? "ヤマト運輸"}
                    onValueChange={(value) => void updateCarrier(order, value as ShippingCarrier)}
                  >
                    <SelectTrigger className="h-8 text-xs" aria-label={`${order.id}の配送業者`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingCarriers.map((carrier) => (
                        <SelectItem key={carrier} value={carrier}>
                          {carrier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              )}
              {!compact && (
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <Button variant="outline" size="sm" className="h-8 w-full justify-start gap-1.5 text-xs" onClick={() => onSelectOrder?.(order)}>
                    <Truck className="size-3.5" />
                    {order.trackingNumber || "詳細で入力"}
                  </Button>
                </TableCell>
              )}
              {!compact && (
                <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label={`${order.id}の操作メニュー`} title="発送情報の入力・印刷・キャンセル">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onSelectOrder?.(order)}>
                        <Truck className="size-4" />
                        発送情報の入力
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => printShopDocument(order, "delivery")}>
                        <FileText className="size-4" />
                        納品書を印刷
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => printShopDocument(order, "invoice")}>
                        <FileText className="size-4" />
                        請求書を印刷
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => printShopDocument(order, "receipt")}>
                        <ReceiptText className="size-4" />
                        領収書を印刷
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-700 focus:text-red-700" onClick={() => onSelectOrder?.(order)}>
                        <Undo2 className="size-4" />
                        キャンセル・返金処理
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
