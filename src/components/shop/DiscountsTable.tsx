"use client";

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

export function DiscountsTable() {
  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">割引</h1>
          <p className="text-sm text-neutral-500">割引コード、自動割引、利用条件を管理します。</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled title="割引機能は現在ナビゲーションから外しています">
              <Plus className="size-4" />
              割引を作成
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>割引を作成</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="割引コード" defaultValue="SUMMER500" />
              <Select defaultValue="割引コード">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="割引コード">割引コード</SelectItem>
                  <SelectItem value="自動割引">自動割引</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="対象商品・条件" defaultValue="初回購入" />
              <Input placeholder="割引率または金額" defaultValue="¥500" />
              <Button className="w-full" disabled>保存</Button>
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
              {discounts.map((discount) => (
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
                        <DropdownMenuItem disabled>編集</DropdownMenuItem>
                        <DropdownMenuItem disabled>複製</DropdownMenuItem>
                        <DropdownMenuItem disabled>停止</DropdownMenuItem>
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
