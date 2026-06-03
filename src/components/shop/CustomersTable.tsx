"use client";

import { MoreHorizontal, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { customers, formatYen } from "@/data/shop-sample-data";

export function CustomersTable() {
  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">顧客</h1>
          <p className="text-sm text-neutral-500">購入履歴、タグ、メモ、セグメントを管理します。</p>
        </div>
        <div className="relative w-full lg:w-80">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-neutral-400" />
          <Input className="pl-8" placeholder="顧客名・メールで検索" />
        </div>
      </div>
      <Card className="shadow-sm">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-sm">顧客一覧</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>顧客</TableHead>
                <TableHead>注文回数</TableHead>
                <TableHead>合計購入額</TableHead>
                <TableHead>最終注文日</TableHead>
                <TableHead>タグ</TableHead>
                <TableHead>メモ</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} className="h-11">
                  <TableCell>
                    <div className="font-medium text-neutral-950">{customer.name}</div>
                    <div className="text-xs text-neutral-500">{customer.email}</div>
                  </TableCell>
                  <TableCell>{customer.orders}回</TableCell>
                  <TableCell className="">{formatYen(customer.totalSpent)}</TableCell>
                  <TableCell>{customer.lastOrder}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-neutral-600">{customer.note}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`${customer.name}の操作`}>
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled>詳細を開く</DropdownMenuItem>
                        <DropdownMenuItem disabled>セグメントへ追加</DropdownMenuItem>
                        <DropdownMenuItem disabled>メモを編集</DropdownMenuItem>
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
