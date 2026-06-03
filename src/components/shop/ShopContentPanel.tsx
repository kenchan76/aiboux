"use client";

import { FileText, Image, Megaphone, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const contentItems = [
  { id: "page-about", type: "固定ページ", title: "ブランドについて", status: "公開中", updatedAt: "2024/05/18", icon: FileText },
  { id: "news-001", type: "お知らせ", title: "初夏の新作入荷のお知らせ", status: "公開中", updatedAt: "2024/05/17", icon: Megaphone },
  { id: "banner-main", type: "バナー", title: "送料無料キャンペーン", status: "下書き", updatedAt: "2024/05/16", icon: Image },
  { id: "seo-home", type: "SEO", title: "トップページメタ情報", status: "改善候補", updatedAt: "2024/05/15", icon: Search },
];

export function ShopContentPanel() {
  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">コンテンツ</h1>
          <p className="text-sm text-neutral-500">ページ、ブログ、お知らせ、バナー、SEOを管理します。</p>
        </div>
        <Button disabled title="コンテンツ保存API接続後に有効化します">コンテンツを作成</Button>
      </div>
      <Card className="shadow-sm">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-sm">公開コンテンツ</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>種別</TableHead>
                <TableHead>タイトル</TableHead>
                <TableHead>状態</TableHead>
                <TableHead>更新日</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentItems.map((item) => {
                const Icon = item.icon;
                return (
                  <TableRow key={item.id} className="h-11">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-neutral-500" />
                        {item.type}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-neutral-950">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "公開中" ? "success" : item.status === "改善候補" ? "warning" : "secondary"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.updatedAt}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" disabled>編集</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
