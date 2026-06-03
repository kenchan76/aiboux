"use client";

import * as React from "react";
import { Bot, FileSpreadsheet, Paperclip, Send, Sparkles, UploadCloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { aiActions, shopNavItems, type ShopSection } from "@/data/shop-sample-data";
import { toast } from "sonner";

interface ShopAIAssistantPanelProps {
  activeSection: ShopSection;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

export function ShopAIAssistantPanel({ activeSection, mobileOpen, onMobileOpenChange }: ShopAIAssistantPanelProps) {
  return (
    <>
      <aside className="hidden w-[380px] shrink-0 border-l border-neutral-200 bg-white xl:flex">
        <AIPanelContent activeSection={activeSection} />
      </aside>
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="right" className="w-full p-0 sm:max-w-[420px]">
          <SheetHeader className="sr-only">
            <SheetTitle>SHOP AI Assistant</SheetTitle>
          </SheetHeader>
          <AIPanelContent activeSection={activeSection} />
        </SheetContent>
      </Sheet>
    </>
  );
}

function AIPanelContent({ activeSection }: { activeSection: ShopSection }) {
  const [input, setInput] = React.useState("");
  const label = shopNavItems.find((item) => item.id === activeSection)?.label ?? "ダッシュボード";

  return (
    <div className="flex min-h-0 w-full flex-col">
      <header className="flex h-14 items-center justify-between border-b border-neutral-200 px-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950">
            <Bot className="size-4" />
            AI Assistant
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            オンライン
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="AI履歴を開く">
              <Sparkles className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>AI履歴</TooltipContent>
        </Tooltip>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-3 p-3">
          <Card className="shadow-none">
            <CardHeader className="px-3 py-2">
              <CardTitle className="text-xs font-medium text-neutral-500">現在のコンテキスト</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-3 pb-3 text-sm">
              <Badge variant="secondary">Shop {label}</Badge>
              <p className="text-neutral-600">ストアの最新状況、注文、商品、在庫、顧客データを参照して支援します。</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-2">
            {aiActions.slice(0, 8).map((action) => (
              <Button key={action.id} variant="outline" size="sm" className="justify-start text-xs" onClick={() => toast.success(`${action.label}を開始しました`)}>
                <Sparkles className="size-3.5" />
                {action.label}
              </Button>
            ))}
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-3 text-sm">
            <p className="font-medium text-neutral-950">こんにちは。aiboux SHOPのストア運営をサポートします。</p>
            <p className="mt-1 text-neutral-600">売上分析、商品改善、在庫確認、割引施策、CSV取り込みをここから実行できます。</p>
            <div className="mt-2 text-right text-xs text-neutral-400">10:30</div>
          </div>

          <div className="ml-auto max-w-[86%] rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-neutral-800">
            売上を分析して、改善提案をください。
            <div className="mt-1 text-right text-xs text-neutral-400">10:31</div>
          </div>

          <Card className="shadow-none">
            <CardHeader className="px-3 py-2">
              <CardTitle className="text-sm">売上分析レポート（5/13-5/19）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-3 pb-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-neutral-200 p-2">
                  <div className="text-xs text-neutral-500">売上</div>
                  <div className=" text-lg font-semibold">¥2,340,000</div>
                </div>
                <div className="rounded-lg border border-neutral-200 p-2">
                  <div className="text-xs text-neutral-500">注文数</div>
                  <div className=" text-lg font-semibold">245件</div>
                </div>
              </div>
              <ul className="list-disc space-y-1 pl-4 text-neutral-600">
                <li>売上は前期間比で18.5%増加しています。</li>
                <li>平均注文単価は¥9,551で、前期間より2.1%改善しています。</li>
                <li>在庫が少ない上位商品を補充すると機会損失を抑えられます。</li>
              </ul>
              <Progress value={72} />
              <div className="flex gap-2">
                <Button variant="outline" size="sm">詳細を表示</Button>
                <Button variant="outline" size="sm">レポートを作成</Button>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
            <UploadCloud className="mx-auto mb-2 size-5" />
            ここにファイルをドラッグ＆ドロップ
            <div className="mt-1 text-xs">CSV、Excel、PDF、画像に対応</div>
          </div>
        </div>
      </ScrollArea>

      <div className="border-t border-neutral-200 p-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-2">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="AIに依頼する（例：特定商品の販売動向を分析）"
            className="min-h-16 border-0 p-1 shadow-none focus-visible:ring-0"
          />
          <Separator className="my-2" />
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="添付">
                <Paperclip className="size-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="CSVを添付">
                <FileSpreadsheet className="size-4" />
              </Button>
            </div>
            <Button size="sm" className="gap-2" onClick={() => { toast.success("AI依頼を送信しました"); setInput(""); }}>
              <Send className="size-4" />
              送信
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
