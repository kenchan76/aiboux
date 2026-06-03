"use client";

import * as React from "react";
import { ArrowLeft, AlertCircle, CheckCircle2, Clock3, FileText, Loader2, ReceiptText, Save, Truck, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/shop/StatusBadges";
import { formatYen, shopProducts, type ShopOrder, type ShopSection } from "@/data/shop-sample-data";
import { printShopDocument } from "@/lib/shopDocumentPrint";

const shippingCarriers = ["日本郵便", "ヤマト運輸", "佐川急便"] as const;

type UpdateShippingResponse = {
  success?: boolean;
  orderUpdated?: boolean;
  error?: string;
};

export function ShopOrderDetailPage({
  order,
  onSectionChange,
}: {
  order: ShopOrder;
  onSectionChange: (section: ShopSection) => void;
}) {
  const [carrier, setCarrier] = React.useState<(typeof shippingCarriers)[number]>(order.carrier ?? "ヤマト運輸");
  const [trackingNumber, setTrackingNumber] = React.useState(order.trackingNumber ?? "");
  const [paymentStatus, setPaymentStatus] = React.useState(order.paymentStatus);
  const [fulfillmentStatus, setFulfillmentStatus] = React.useState(order.fulfillmentStatus);
  const [deliveryStatus, setDeliveryStatus] = React.useState(order.deliveryStatus);
  const [isDirty, setIsDirty] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState("購入者都合によるキャンセル");
  const [isCancelling, setIsCancelling] = React.useState(false);

  React.useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const updateCarrier = (value: string) => {
    setCarrier(value as (typeof shippingCarriers)[number]);
    setIsDirty(true);
  };

  const updateTrackingNumber = (value: string) => {
    setTrackingNumber(value);
    setIsDirty(true);
  };

  const saveShipping = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/shop/api/orders/update-shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, carrier, trackingNumber }),
      });
      const data = (await response.json().catch(() => ({}))) as UpdateShippingResponse;
      if (!response.ok || !data.success) throw new Error(data.error || "配送情報を保存できませんでした");
      setIsDirty(false);
      setFulfillmentStatus("発送済み");
      setDeliveryStatus("配送中");
      toast.success(data.orderUpdated ? `${order.id} の配送情報を保存しました` : `${order.id} の配送情報を操作ログに記録しました`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "配送情報を保存できませんでした");
    } finally {
      setIsSaving(false);
    }
  };

  const focusShippingInfo = () => {
    document.getElementById("shipping-info")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goBack = () => {
    if (isDirty && !window.confirm("未保存の配送情報があります。注文一覧へ戻りますか？")) return;
    onSectionChange("orders");
  };

  const cancelAndRefund = async () => {
    if (!cancelReason.trim()) {
      toast.error("キャンセル理由を入力してください");
      return;
    }
    setIsCancelling(true);
    try {
      const response = await fetch("/shop/api/orders/cancel-refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          refundAmount: order.paymentStatus === "支払い済み" ? order.total : 0,
          reason: cancelReason,
          items: order.items,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { success?: boolean; refund?: { message?: string }; inventoryRestore?: Array<{ restored?: boolean }>; error?: string };
      if (!response.ok || !data.success) {
        throw new Error(data.error || "キャンセル・返金処理に失敗しました");
      }
      setPaymentStatus(order.paymentStatus === "支払い済み" ? "返金済み" : order.paymentStatus);
      setFulfillmentStatus("キャンセル");
      setDeliveryStatus("未発送");
      setCancelOpen(false);
      const restoredCount = data.inventoryRestore?.filter((item) => item.restored).length ?? 0;
      toast.success(`キャンセルを記録しました。在庫戻し ${restoredCount}件。${data.refund?.message ?? ""}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "キャンセル・返金処理に失敗しました");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" aria-label="注文一覧へ戻る" onClick={goBack}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-neutral-950">注文 {order.id}</h1>
              <StatusBadge value={paymentStatus} />
              <StatusBadge value={fulfillmentStatus} />
              <StatusBadge value={deliveryStatus} />
              {isDirty ? <Badge variant="outline" className="rounded-md border-amber-200 bg-amber-50 text-amber-700">未保存</Badge> : null}
            </div>
            <p className="mt-1 text-sm text-neutral-500">{order.orderedAt} / {order.customerName}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="h-8 gap-2" onClick={focusShippingInfo}>
            <Truck className="size-4" />
            発送情報へ
          </Button>
          <Button variant="outline" className="h-8 gap-2" onClick={() => printShopDocument(order, "delivery")}>
            <FileText className="size-4" />
            納品書
          </Button>
          <Button variant="outline" className="h-8 gap-2" onClick={() => printShopDocument(order, "invoice")}>
            <FileText className="size-4" />
            請求書
          </Button>
          <Button variant="outline" className="h-8 gap-2" onClick={() => printShopDocument(order, "receipt")}>
            <ReceiptText className="size-4" />
            領収書
          </Button>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          <Card id="shipping-info" className="shadow-none">
            <CardHeader className="border-b border-neutral-200 px-4 py-3">
              <CardTitle className="text-sm">注文商品</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {order.items.map((item) => {
                const product = shopProducts.find((candidate) => candidate.id === item.productId);
                return (
                  <div key={item.sku} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 border-b border-neutral-100 px-4 py-3 last:border-b-0">
                    {product ? (
                      <img src={product.image} alt={item.name} className="size-12 rounded-md border border-neutral-200 object-cover" />
                    ) : (
                      <div className="flex size-12 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-[10px] text-neutral-400">NO IMG</div>
                    )}
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-neutral-950">{item.name}</div>
                      <div className="mt-1 text-xs text-neutral-500">SKU: {item.sku} / 数量 {item.quantity}</div>
                    </div>
                    <div className="text-right text-sm font-semibold text-neutral-950">{formatYen(item.price * item.quantity)}</div>
                  </div>
                );
              })}
              <div className="flex items-center justify-between bg-neutral-50 px-4 py-3">
                <span className="text-sm text-neutral-500">注文合計</span>
                <span className="text-lg font-semibold text-neutral-950">{formatYen(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-3 lg:grid-cols-2">
            <Card className="shadow-none">
              <CardHeader className="border-b border-neutral-200 px-4 py-3"><CardTitle className="text-sm">請求先</CardTitle></CardHeader>
              <CardContent className="space-y-1 px-4 py-3 text-sm">
                <div className="font-medium text-neutral-950">{order.customerName}</div>
                <div className="text-neutral-600">{order.customerEmail}</div>
                <div className="text-neutral-600">〒100-0001 東京都千代田区千代田1-1</div>
                <div className="text-neutral-600">請求書宛名: {order.customerName} 様</div>
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardHeader className="border-b border-neutral-200 px-4 py-3"><CardTitle className="text-sm">配送先</CardTitle></CardHeader>
              <CardContent className="space-y-1 px-4 py-3 text-sm">
                <div className="font-medium text-neutral-950">{order.customerName}</div>
                <div className="text-neutral-600">〒150-0001 東京都渋谷区神宮前1-2-3</div>
                <div className="text-neutral-600">電話番号: 03-0000-0000</div>
                <div className="text-neutral-600">配送希望: 指定なし</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-none">
            <CardHeader className="border-b border-neutral-200 px-4 py-3"><CardTitle className="text-sm">支払いと発送の流れ</CardTitle></CardHeader>
            <CardContent className="space-y-3 px-4 py-3">
              <TimelineItem icon={CheckCircle2} title="注文受付" description={`${order.orderedAt} に注文を受け付けました`} tone="success" />
              <TimelineItem icon={CheckCircle2} title="支払い確認" description={`支払い: ${paymentStatus}`} tone={paymentStatus === "支払い済み" || paymentStatus === "返金済み" ? "success" : "warning"} />
              <TimelineItem icon={Truck} title="発送準備" description={`発送準備: ${fulfillmentStatus}`} tone={fulfillmentStatus === "発送済み" || fulfillmentStatus === "キャンセル" ? "success" : "warning"} />
              <TimelineItem icon={Clock3} title="配送" description={`配送状況: ${trackingNumber || deliveryStatus}`} tone={trackingNumber ? "success" : "neutral"} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <Card className="shadow-none">
            <CardHeader className="border-b border-neutral-200 px-4 py-3"><CardTitle className="text-sm">発送に必要な情報</CardTitle></CardHeader>
            <CardContent className="space-y-3 px-4 py-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700">配送業者</label>
                <Select value={carrier} onValueChange={updateCarrier}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {shippingCarriers.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-700">追跡番号</label>
                <Input value={trackingNumber} placeholder="例: 1234-5678-9012" onChange={(event) => updateTrackingNumber(event.target.value)} />
              </div>
              <Button className="w-full gap-2" onClick={saveShipping} disabled={isSaving}>
                <Save className="size-4" />
                {isSaving ? "保存中..." : "配送情報を保存して発送準備完了"}
              </Button>
              <p className="text-[11px] leading-5 text-neutral-500">配送業者を選び、追跡番号を入れて保存します。購入者への発送連絡に使う情報です。</p>
              <p className="text-[11px] leading-5 text-neutral-500">現在はデモUIのため、保存しても購入者への通知や外部配送連携は実行しません。</p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="border-b border-neutral-200 px-4 py-3"><CardTitle className="text-sm">この注文でできること</CardTitle></CardHeader>
            <CardContent className="space-y-2 px-4 py-4">
              <Button className="w-full gap-2" onClick={focusShippingInfo}>
                <Truck className="size-4" />
                発送情報を入力する
              </Button>
              <Button variant="outline" className="w-full gap-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800" onClick={() => setCancelOpen(true)}>
                <Undo2 className="size-4" />
                キャンセル・返金処理
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="border-b border-neutral-200 px-4 py-3"><CardTitle className="text-sm">内部メモ</CardTitle></CardHeader>
            <CardContent className="space-y-2 px-4 py-4 text-sm text-neutral-600">
              <div>タグ: {order.tags.join(" / ") || "なし"}</div>
              <Separator />
              <div className="text-xs leading-5">ギフト包装や配送希望がある場合は、出荷前にここで確認します。</div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>キャンセル・返金処理</DialogTitle>
            <DialogDescription>
              注文をキャンセルし、支払い済みの場合は返金記録を作成します。商品在庫は自動で戻します。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
              <div className="flex gap-2">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>外部返金はStripe決済IDが保存されている場合にだけ実行できます。未設定時は安全なモック返金として操作ログへ記録します。</span>
              </div>
            </div>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <StatusLine label="注文番号" value={order.id} />
              <StatusLine label="返金予定額" value={formatYen(order.paymentStatus === "支払い済み" ? order.total : 0)} />
              <StatusLine label="在庫戻し対象" value={`${order.items.reduce((sum, item) => sum + item.quantity, 0)}点`} />
              <StatusLine label="処理後ステータス" value={order.paymentStatus === "支払い済み" ? "返金済み / キャンセル" : "キャンセル"} />
            </div>
            <label className="block">
              <span className="text-xs font-medium text-neutral-700">キャンセル理由</span>
              <Textarea className="mt-1 min-h-24 resize-none" value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)} disabled={isCancelling}>閉じる</Button>
            <Button className="gap-2 bg-red-600 text-white hover:bg-red-700" onClick={cancelAndRefund} disabled={isCancelling}>
              {isCancelling ? <Loader2 className="size-4 animate-spin" /> : <Undo2 className="size-4" />}
              実行する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-neutral-200 px-3 py-2">
      <div className="text-[11px] text-neutral-500">{label}</div>
      <div className="mt-0.5 font-medium text-neutral-950">{value}</div>
    </div>
  );
}

function TimelineItem({
  icon: Icon,
  title,
  description,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  tone: "success" | "warning" | "neutral";
}) {
  const color = tone === "success" ? "text-emerald-600" : tone === "warning" ? "text-amber-600" : "text-neutral-500";
  return (
    <div className="grid grid-cols-[28px_1fr] gap-2">
      <div className="flex size-7 items-center justify-center rounded-full border border-neutral-200 bg-white">
        <Icon className={`size-4 ${color}`} />
      </div>
      <div>
        <div className="text-sm font-medium text-neutral-950">{title}</div>
        <div className="text-xs text-neutral-500">{description}</div>
      </div>
    </div>
  );
}
