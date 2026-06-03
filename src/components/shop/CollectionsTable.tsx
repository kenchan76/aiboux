"use client";

import { MoreHorizontal, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { collections } from "@/data/shop-sample-data";

export function CollectionsTable() {
  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">コレクション</h1>
          <p className="text-sm text-neutral-500">商品を束ねて販売導線とSEO導線を管理します。</p>
        </div>
        <Button className="gap-2" disabled title="コレクション機能は現在ナビゲーションから外しています">
          <Plus className="size-4" />
          作成
        </Button>
      </div>
      <Card className="shadow-sm">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-sm">コレクション一覧</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>商品数</TableHead>
                <TableHead>公開状態</TableHead>
                <TableHead>条件</TableHead>
                <TableHead>並び順</TableHead>
                <TableHead>SEO</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections.map((collection) => (
                <TableRow key={collection.id} className="h-11">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-[10px] font-semibold text-neutral-500">
                        {collection.thumbnail}
                      </div>
                      <span className="font-medium text-neutral-950">{collection.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{collection.productCount}件</TableCell>
                  <TableCell>
                    <Badge variant={collection.status === "公開中" ? "success" : "secondary"}>{collection.status}</Badge>
                  </TableCell>
                  <TableCell className="text-neutral-600">{collection.condition}</TableCell>
                  <TableCell className="text-neutral-600">{collection.sort}</TableCell>
                  <TableCell className="text-neutral-600">{collection.seo}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`${collection.name}の操作`}>
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled>編集</DropdownMenuItem>
                        <DropdownMenuItem disabled>商品を確認</DropdownMenuItem>
                        <DropdownMenuItem disabled>公開ストアで開く</DropdownMenuItem>
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
