"use client";

import * as React from "react";
import { Building2, Mail, MapPin, Phone, Plus, Search, Tag } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  coreCustomers,
  customerDiscountRates,
  deliveryDestinations,
  formatPercent,
  type CoreCustomer,
} from "@/data/product-master-data";
import { cn } from "@/lib/utils";

export function CustomerDeliveryMaster() {
  const [query, setQuery] = React.useState("");
  const [selectedCustomer, setSelectedCustomer] = React.useState<CoreCustomer>(coreCustomers[0]);
  const rows = coreCustomers.filter((customer) => {
    if (!query.trim()) return true;
    return [customer.customerName, customer.customerCode, customer.bankAccountKana, customer.email].join(" ").toLowerCase().includes(query.toLowerCase());
  });
  const destinations = deliveryDestinations.filter((destination) => destination.customerId === selectedCustomer.id);
  const rates = customerDiscountRates.filter((rate) => rate.customerId === selectedCustomer.id);

  return (
    <div className="space-y-3">
      <div className="grid gap-2 md:grid-cols-4">
        <Metric label="取引先" value={`${coreCustomers.length}件`} note="稼働中" />
        <Metric label="納品先" value={`${deliveryDestinations.length}件`} note="複数拠点対応" />
        <Metric label="価格ルール" value={`${customerDiscountRates.length}件`} note="掛率・例外価格" />
        <Metric label="選択中" value={selectedCustomer.customerCode} note={selectedCustomer.customerName} />
      </div>

      <div className="grid min-h-[650px] gap-3 xl:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_460px]">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">取引先マスタ</CardTitle>
              <CardDescription className="text-xs">請求条件、納品先、掛率を一覧と詳細で高速確認します。</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild><Button size="sm" className="h-8 gap-1.5"><Plus className="size-4" />取引先を追加</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>取引先を追加</DialogTitle><DialogDescription>請求先と基本掛率を登録します。</DialogDescription></DialogHeader>
                <div className="grid gap-3">
                  <Input placeholder="取引先名" />
                  <Input placeholder="銀行名義カナ" />
                  <Input placeholder="基本掛率 例: 0.70" />
                  <Textarea placeholder="支払条件・備考" />
                </div>
                <DialogFooter><Button onClick={() => toast.success("取引先ドラフトを作成しました")}>保存</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                <Input className="h-8 pl-8" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="取引先名・コード・名義カナ・メールで検索" />
              </div>
              <Button variant="outline" size="sm" className="h-8">稼働中のみ</Button>
              <Button variant="outline" size="sm" className="h-8">CSV出力</Button>
            </div>
            <div className="overflow-hidden rounded-md border border-neutral-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50">
                  <TableHead className="h-8 px-2 text-xs">取引先</TableHead>
                  <TableHead className="h-8 px-2 text-xs">連絡先</TableHead>
                  <TableHead className="h-8 px-2 text-xs">掛率</TableHead>
                  <TableHead className="h-8 px-2 text-xs">締日/支払</TableHead>
                  <TableHead className="h-8 px-2 text-xs">状態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className={cn("h-10 cursor-pointer hover:bg-blue-50/40", selectedCustomer.id === customer.id && "bg-blue-50/60")}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <TableCell className="px-2 py-1">
                      <div className="text-sm font-medium">{customer.customerName}</div>
                      <div className=" text-[11px] text-neutral-500">{customer.customerCode} / {customer.bankAccountKana}</div>
                    </TableCell>
                    <TableCell className="px-2 py-1">
                      <div className="truncate text-xs">{customer.contactName}</div>
                      <div className="truncate text-[11px] text-neutral-500">{customer.email}</div>
                    </TableCell>
                    <TableCell className="px-2 py-1 text-xs">{formatPercent(customer.baseDiscountRate)}</TableCell>
                    <TableCell className="px-2 py-1 text-xs">{customer.closingDay} / {customer.paymentTerms}</TableCell>
                    <TableCell className="px-2 py-1"><Badge variant="success">稼働中</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

        <Card className="h-fit shadow-sm">
          <CardHeader className="border-b p-3">
            <CardTitle className="flex items-center gap-2 text-base"><Building2 className="size-4" />{selectedCustomer.customerName}</CardTitle>
            <CardDescription className="text-xs">請求・納品・価格ルールを右側で確認します。</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid gap-2 rounded-md border border-neutral-200 bg-neutral-50/60 p-2 text-sm">
              <Info label="請求先名" value={selectedCustomer.billingName} />
              <Info label="担当者" value={selectedCustomer.contactName} />
              <Info label="基本掛率" value={formatPercent(selectedCustomer.baseDiscountRate)} />
            </div>
            <Tabs defaultValue="basic" className="mt-3">
              <TabsList className="grid h-8 grid-cols-3">
                <TabsTrigger value="basic" className="h-7 text-xs">基本</TabsTrigger>
                <TabsTrigger value="destinations" className="h-7 text-xs">納品先</TabsTrigger>
                <TabsTrigger value="prices" className="h-7 text-xs">価格</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="mt-3 space-y-2">
                <DetailLine icon={<Mail className="size-3.5" />} label="メール" value={selectedCustomer.email} />
                <DetailLine icon={<Phone className="size-3.5" />} label="電話" value="03-0000-0000" />
                <DetailLine icon={<Tag className="size-3.5" />} label="支払条件" value={`${selectedCustomer.closingDay} / ${selectedCustomer.paymentTerms}`} />
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button size="sm" className="h-8">編集</Button>
                  <Button variant="outline" size="sm" className="h-8" onClick={() => toast.info("送付先確認画面を開いてから送信します")}>連絡を準備</Button>
                </div>
              </TabsContent>
              <TabsContent value="destinations" className="mt-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs font-medium">納品先一覧</div>
                  <Button variant="outline" size="sm" className="h-7" onClick={() => toast.success("納品先追加フォームを開きました")}>追加</Button>
                </div>
                <ScrollArea className="h-[260px] pr-2">
                  <div className="space-y-2">
                    {destinations.map((destination) => (
                      <div key={destination.id} className="rounded-md border border-neutral-200 p-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 text-sm font-medium"><MapPin className="size-4 text-neutral-500" />{destination.destinationName}</div>
                            <div className="mt-1 text-xs text-neutral-500">{destination.postalCode} {destination.addressLine1} {destination.addressLine2}</div>
                            <div className="text-xs text-neutral-500">{destination.deliveryConditions}</div>
                          </div>
                          {destination.isDefault ? <Badge variant="secondary">標準</Badge> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="prices" className="mt-3 space-y-2">
                {rates.map((rate) => (
                  <div key={rate.id} className="flex items-center justify-between rounded-md border border-neutral-200 p-2 text-xs">
                    <span>{rate.productId ? "商品別上書き" : "取引先基本掛率"}</span>
                    <span>{formatPercent(rate.rate)} / {rate.roundingMode}</span>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white px-3 py-2">
      <div className="text-[11px] text-neutral-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-neutral-950">{value}</div>
      <div className="text-[11px] text-neutral-500">{note}</div>
    </div>
  );
}

function DetailLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 px-2 py-1.5 text-xs">
      <span className="flex items-center gap-1.5 text-neutral-500">{icon}{label}</span>
      <span className="truncate text-right font-medium text-neutral-900">{value}</span>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-neutral-500">{label}</span>
      <span className="text-right text-xs font-medium text-neutral-900">{value}</span>
    </div>
  );
}
