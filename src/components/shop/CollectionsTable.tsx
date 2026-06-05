"use client";

import { useState } from "react";
import { ExternalLink, MoreHorizontal, Plus } from "lucide-react";
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
  const [rows, setRows] = useState(collections);

  const createCollection = () => {
    const next = rows.length + 1;
    setRows((current) => [
      {
        id: `collection-local-${Date.now()}`,
        name: `販売特集 ${next}`,
        thumbnail: "特",
        productCount: 0,
        status: "下書き",
        condition: "手動選択",
        sort: `${next}`,
        seo: "商品登録後に公開",
      },
      ...current,
    ]);
  };

  const markEdited = (id: string) => {
    setRows((current) => current.map((collection) => (
      collection.id === id
        ? { ...collection, name: `${collection.name.replace(/（編集中）$/, "")}（編集中）`, status: "下書き" }
        : collection
    )));
  };

  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">コレクション</h1>
          <p className="text-sm text-neutral-500">商品を束ねて、公開ストアのカテゴリ導線へつなげます。</p>
        </div>
        <Button className="gap-2" onClick={createCollection}>
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
              {rows.map((collection) => (
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
                        <DropdownMenuItem onSelect={() => markEdited(collection.id)}>編集状態にする</DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href="/s/aiboux/admin/products">商品を確認</a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href="/s/aiboux/categories">
                            <ExternalLink className="mr-2 size-3.5" />
                            公開ストアで開く
                          </a>
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
