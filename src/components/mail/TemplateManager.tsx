"use client";

import * as React from "react";
import { Copy, FileText, Plus, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { templates } from "@/data/mail-sample-data";
import { cn } from "@/lib/utils";

export function TemplateManager() {
  const [activeId, setActiveId] = React.useState(templates[0]?.id ?? "");
  const active = templates.find((template) => template.id === activeId) ?? templates[0];
  const visibleVariables = active.variables.filter((variable) => !["{請求書番号}", "{金額}", "{支払期限}", "{注文番号}"].includes(variable));
  const preview = active.preview
    .replace(/金額は\{金額\}、支払期限は\{支払期限\}です。/g, "内容をご確認ください。")
    .replace(/対象請求書は\{請求書番号\}です。/g, "内容をご確認ください。")
    .replace(/\{請求書番号\}/g, "")
    .replace(/\{注文番号\}/g, "")
    .replace(/\{金額\}/g, "")
    .replace(/\{支払期限\}/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <section className="flex min-h-0 flex-1 bg-white">
      <aside className="hidden w-[320px] shrink-0 border-r border-neutral-200 bg-neutral-50 md:flex md:flex-col">
        <div className="flex h-12 items-center justify-between border-b border-neutral-200 px-3">
          <div>
            <h1 className="text-base font-semibold text-neutral-950">テンプレート</h1>
            <p className="text-xs text-neutral-500">{templates.length}件を管理中</p>
          </div>
          <Button size="icon-sm" aria-label="テンプレート追加">
            <Plus className="size-4" />
          </Button>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div className="p-2">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setActiveId(template.id)}
                className={cn(
                  "mb-1 w-full rounded-lg border px-3 py-2 text-left transition",
                  active.id === template.id
                    ? "border-blue-200 bg-blue-50"
                    : "border-transparent bg-white hover:border-neutral-200 hover:bg-neutral-50"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-neutral-950">{template.name}</span>
                  <Badge variant="outline" className="h-5 rounded-md px-1.5 text-[10px]">
                    {template.category}
                  </Badge>
                </div>
                <div className="mt-1 truncate text-xs text-neutral-500">{template.subject}</div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      <div className="min-w-0 flex-1 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950">テンプレート編集</h2>
            <p className="text-sm text-neutral-500">宛先や文面の定型部分を使って、メール作成を短縮します。</p>
          </div>
          <Button className="gap-2" onClick={() => toast.success("テンプレートを保存しました")}>
            <Save className="size-4" />
            保存
          </Button>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
          <Card className="shadow-none">
            <CardHeader className="px-4 py-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileText className="size-4" />
                {active.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              <Input defaultValue={active.name} aria-label="テンプレート名" />
              <Input defaultValue={active.subject} aria-label="件名" />
              <Textarea defaultValue={preview} className="min-h-[260px]" aria-label="本文テンプレート" />
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-sm">使用できる変数</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              {visibleVariables.map((variable) => (
                <button
                  key={variable}
                  type="button"
                  onClick={() => toast.success(`${variable} をコピーしました`)}
                  className="flex w-full items-center justify-between rounded-md border border-neutral-200 px-2.5 py-2 text-left text-sm transition hover:bg-neutral-50"
                >
                  <span className=" text-xs">{variable}</span>
                  <Copy className="size-3.5 text-neutral-500" />
                </button>
              ))}
              <Separator />
              <p className="text-xs leading-5 text-neutral-500">
                変数は送信時に宛先名などの定型データへ置換されます。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
