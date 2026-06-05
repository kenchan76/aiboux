"use client";

import * as React from "react";
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
  const [selectedCustomer, setSelectedCustomer] = React.useState<(typeof customers)[number] | null>(null);
  const [segmentIds, setSegmentIds] = React.useState<Set<string>>(() => new Set());
  const [editingMemoId, setEditingMemoId] = React.useState<string | null>(null);
  const [memoDrafts, setMemoDrafts] = React.useState<Record<string, string>>(() => Object.fromEntries(customers.map((customer) => [customer.id, customer.note])));
  const toggleSegment = (customerId: string) => {
    setSegmentIds((current) => {
      const next = new Set(current);
      if (next.has(customerId)) next.delete(customerId);
      else next.add(customerId);
      return next;
    });
  };
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
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-28 text-center text-sm text-neutral-500">
                    顧客データはまだありません。購入が発生すると注文履歴と一緒に表示されます。
                  </TableCell>
                </TableRow>
              ) : null}
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
                      {segmentIds.has(customer.id) ? <Badge variant="success">確認対象</Badge> : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    {editingMemoId === customer.id ? (
                      <div className="flex min-w-[240px] items-center gap-2">
                        <Input
                          value={memoDrafts[customer.id] ?? ""}
                          onChange={(event) => setMemoDrafts((current) => ({ ...current, [customer.id]: event.target.value }))}
                          aria-label={`${customer.name}のメモ`}
                        />
                        <Button size="sm" className="h-8" onClick={() => setEditingMemoId(null)}>保存</Button>
                      </div>
                    ) : (
                      memoDrafts[customer.id] || customer.note
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`${customer.name}の操作`}>
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedCustomer(customer)}>詳細を開く</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleSegment(customer.id)}>
                          {segmentIds.has(customer.id) ? "セグメントから外す" : "セグメントへ追加"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingMemoId(customer.id)}>メモを編集</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedCustomer ? (
        <Card className="mt-4 shadow-sm" data-testid="admin-customer-detail-panel">
          <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
            <CardTitle className="text-sm">{selectedCustomer.name} の詳細</CardTitle>
            <Button variant="outline" size="sm" className="h-8" onClick={() => setSelectedCustomer(null)}>閉じる</Button>
          </CardHeader>
          <CardContent className="grid gap-3 px-4 pb-4 text-sm md:grid-cols-4">
            <Detail label="メール" value={selectedCustomer.email} />
            <Detail label="注文回数" value={`${selectedCustomer.orders}回`} />
            <Detail label="合計購入額" value={formatYen(selectedCustomer.totalSpent)} />
            <Detail label="最終注文日" value={selectedCustomer.lastOrder} />
            <div className="md:col-span-4 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-neutral-700">
              メモ: {memoDrafts[selectedCustomer.id] || selectedCustomer.note}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-neutral-200 p-3">
      <div className="text-xs font-semibold text-neutral-500">{label}</div>
      <div className="mt-1 font-medium text-neutral-950">{value}</div>
    </div>
  );
}
