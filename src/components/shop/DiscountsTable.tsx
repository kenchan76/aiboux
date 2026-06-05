"use client";

import { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { discounts } from "@/data/shop-sample-data";
import type { Discount } from "@/data/shop-sample-data";

type DiscountForm = Pick<Discount, "code" | "type" | "target" | "value">;

export function DiscountsTable() {
  const [rows, setRows] = useState(discounts);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<DiscountForm>({
    code: "WELCOME500",
    type: "割引コード",
    target: "初回購入",
    value: "¥500",
  });

  const saveDiscount = () => {
    const code = form.code.trim();
    if (!code) return;
    setRows((current) => [
      {
        id: `discount-local-${Date.now()}`,
        code,
        type: form.type,
        target: form.target || "全商品",
        value: form.value || "5%",
        usage: 0,
        period: "本日から",
        status: "有効",
      },
      ...current,
    ]);
    setOpen(false);
  };

  const duplicateDiscount = (id: string) => {
    const source = rows.find((discount) => discount.id === id);
    if (!source) return;
    setRows((current) => [
      {
        ...source,
        id: `discount-copy-${Date.now()}`,
        code: `${source.code}-COPY`,
        usage: 0,
        status: "停止中",
      },
      ...current,
    ]);
  };

  const toggleDiscount = (id: string) => {
    setRows((current) => current.map((discount) => (
      discount.id === id
        ? { ...discount, status: discount.status === "有効" ? "停止中" : "有効" }
        : discount
    )));
  };

  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">割引</h1>
          <p className="text-sm text-neutral-500">割引コード、自動割引、利用条件を管理します。</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              割引を作成
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>割引を作成</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="割引コード" value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))} />
              <Select value={form.type} onValueChange={(value) => setForm((current) => ({ ...current, type: value === "自動割引" ? "自動割引" : "割引コード" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="割引コード">割引コード</SelectItem>
                  <SelectItem value="自動割引">自動割引</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="対象商品・条件" value={form.target} onChange={(event) => setForm((current) => ({ ...current, target: event.target.value }))} />
              <Input placeholder="割引率または金額" value={form.value} onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))} />
              <Button className="w-full" onClick={saveDiscount}>保存</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="shadow-sm">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-sm">割引一覧</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>コード</TableHead>
                <TableHead>種別</TableHead>
                <TableHead>対象</TableHead>
                <TableHead>割引</TableHead>
                <TableHead>使用回数</TableHead>
                <TableHead>期間</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((discount) => (
                <TableRow key={discount.id} className="h-11">
                  <TableCell className=" font-medium">{discount.code}</TableCell>
                  <TableCell>{discount.type}</TableCell>
                  <TableCell>{discount.target}</TableCell>
                  <TableCell>{discount.value}</TableCell>
                  <TableCell>{discount.usage}回</TableCell>
                  <TableCell className="text-neutral-600">{discount.period}</TableCell>
                  <TableCell>
                    <Badge variant={discount.status === "有効" ? "success" : discount.status === "停止中" ? "warning" : "secondary"}>
                      {discount.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`${discount.code}の操作`}>
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => {
                          setForm({
                            code: discount.code,
                            type: discount.type,
                            target: discount.target,
                            value: discount.value,
                          });
                          setOpen(true);
                        }}>編集</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => duplicateDiscount(discount.id)}>複製</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => toggleDiscount(discount.id)}>
                          {discount.status === "有効" ? "停止" : "再開"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
