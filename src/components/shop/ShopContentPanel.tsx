"use client";

import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const contentItems: Array<{ id: string; type: string; title: string; status: string; updatedAt: string; icon: typeof FileText }> = [];

export function ShopContentPanel() {
  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">コンテンツ</h1>
          <p className="text-sm text-neutral-500">お知らせ、ストア案内、特商法、配送、返品、問い合わせ文言を管理します。</p>
        </div>
        <Button asChild>
          <a href="/s/aiboux/admin/settings">ストア文言を編集</a>
        </Button>
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
              {contentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-28 text-center text-sm text-neutral-500">
                    公開コンテンツはまだありません。特商法・配送・返品・問い合わせ文言は設定画面から登録します。
                  </TableCell>
                </TableRow>
              ) : null}
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
                      <Button asChild variant="outline" size="sm">
                        <a href="/s/aiboux/admin/settings">編集</a>
                      </Button>
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
