import { useMemo, useState } from "react";
import {
  FileSpreadsheet,
  Loader2,
  Paperclip,
  Send,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CoreView } from "@/data/core-sample-data";
import { viewMeta } from "@/data/core-sample-data";
import { cn } from "@/lib/utils";

interface AIAssistantPanelProps {
  view: CoreView;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const quickActions = ["未入金を分析", "在庫不足を確認", "請求書を作成", "発注候補を提案", "CSVを取り込む"];

export function AIContextHeader({ view }: { view: CoreView }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-2.5">
      <div className="text-[11px] font-medium text-neutral-500">現在のコンテキスト</div>
      <div className="mt-1 flex items-center gap-2">
        <Badge variant="secondary" className="rounded-md">
          {viewMeta[view].title}
        </Badge>
        <span className="truncate text-xs text-neutral-600">{viewMeta[view].description}</span>
      </div>
    </div>
  );
}

export function AIQuickActions({ onRun }: { onRun: (action: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {quickActions.map((action) => (
        <Button key={action} type="button" variant="outline" size="sm" className="h-8 justify-start text-xs" onClick={() => onRun(action)}>
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          {action}
        </Button>
      ))}
    </div>
  );
}

export function AIMessage({
  role,
  children,
  time,
}: {
  role: "assistant" | "user";
  children: React.ReactNode;
  time: string;
}) {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[88%] rounded-lg border px-3 py-2 text-sm",
          role === "user" ? "border-blue-200 bg-blue-50 text-blue-950" : "border-neutral-200 bg-white text-neutral-800",
        )}
      >
        <div>{children}</div>
        <div className="mt-1 text-right text-[10px] text-neutral-400">{time}</div>
      </div>
    </div>
  );
}

export function AIResultCard() {
  return (
    <Card className="border-neutral-200 shadow-sm">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-sm">未入金サマリー</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-3 pt-1">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-semibold tracking-tight">¥2,340,000</span>
          <span className="text-xs text-neutral-500">12件</span>
        </div>
        <Progress value={63} className="h-1.5" />
        <ul className="space-y-1 text-xs text-neutral-600">
          <li>11日超過の取引が全体の53%を占めます。</li>
          <li>株式会社サンプルの入金予定確認が優先です。</li>
        </ul>
      </CardContent>
    </Card>
  );
}

export function AIFileDropzone() {
  const [fileName, setFileName] = useState("");

  return (
    <label className="block cursor-pointer rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-3 text-center hover:bg-neutral-100">
      <input
        type="file"
        className="sr-only"
        accept=".csv,.xlsx,.xls,.pdf,image/*"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (file) {
            setFileName(file.name);
            toast.success(`${file.name} を受け取りました`);
          }
        }}
      />
      <UploadCloud className="mx-auto h-5 w-5 text-neutral-500" />
      <div className="mt-1 text-xs font-medium text-neutral-800">
        {fileName || "ここにファイルをドラッグ & ドロップ"}
      </div>
      <div className="mt-0.5 text-[11px] text-neutral-500">CSV, Excel, PDF, 画像に対応</div>
    </label>
  );
}

export function AIProgressLog({ running }: { running: boolean }) {
  if (!running) {
    return null;
  }

  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50 p-2.5 text-xs text-blue-900">
      <div className="flex items-center gap-2 font-medium">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        取引データを分析しています
      </div>
      <div className="mt-1 text-blue-800">未入金、在庫、発注候補を同時に照合中です。</div>
    </div>
  );
}

export function AIComposer({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-2">
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="AIに依頼する（例：請求書を作成して）"
        className="min-h-16 resize-none border-0 p-1 text-sm shadow-none focus-visible:ring-0"
      />
      <div className="mt-1 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Paperclip className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>ファイルを添付</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <FileSpreadsheet className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>CSVを解析</TooltipContent>
          </Tooltip>
        </div>
        <Button
          type="button"
          size="sm"
          className="h-8"
          onClick={() => {
            const text = value.trim();
            if (!text) {
              toast.error("依頼内容を入力してください");
              return;
            }
            setValue("");
            onSubmit(text);
          }}
        >
          <Send className="mr-1.5 h-3.5 w-3.5" />
          送信
        </Button>
      </div>
    </div>
  );
}

function PanelBody({ view }: { view: CoreView }) {
  const [running, setRunning] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant" as const, text: "こんにちは。aiboux Coreの業務をサポートします。何をお手伝いしましょうか？", time: "10:30" },
    { role: "user" as const, text: "未入金の取引を分析してください。", time: "10:31" },
  ]);

  const contextLabel = useMemo(() => viewMeta[view].title, [view]);

  const runAction = (action: string) => {
    setRunning(true);
    setMessages((current) => [...current, { role: "user", text: action, time: "今" }]);
    window.setTimeout(() => {
      setRunning(false);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: `${contextLabel} の文脈で「${action}」を実行しました。候補と根拠を右下のカードに整理しています。`,
          time: "今",
        },
      ]);
      toast.success("AI Assistantが結果を更新しました");
    }, 650);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-14 items-center justify-between border-b border-neutral-200 px-3">
        <div>
          <div className="text-sm font-semibold">AI Assistant</div>
          <div className="text-[11px] text-emerald-600">● オンライン</div>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-3 p-3">
          <AIContextHeader view={view} />
          <AIQuickActions onRun={runAction} />
          <Separator />
          <div className="space-y-2">
            {messages.map((message, index) => (
              <AIMessage key={`${message.role}-${index}`} role={message.role} time={message.time}>
                {message.text}
              </AIMessage>
            ))}
          </div>
          <AIProgressLog running={running} />
          <AIResultCard />
          <AIFileDropzone />
        </div>
      </ScrollArea>

      <div className="border-t border-neutral-200 p-3">
        <AIComposer onSubmit={runAction} />
      </div>
    </div>
  );
}

export function AIAssistantPanel({ view, open, onOpenChange }: AIAssistantPanelProps) {
  return (
    <>
      <aside className="hidden h-screen w-[392px] shrink-0 border-l border-neutral-200 bg-white xl:block">
        <PanelBody view={view} />
      </aside>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full max-w-[420px] p-0 sm:max-w-[420px]">
          <SheetTitle className="sr-only">AI Assistant</SheetTitle>
          <SheetDescription className="sr-only">aiboux Coreの業務代行AIパネルです。</SheetDescription>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 z-10 h-8 w-8 xl:hidden"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <PanelBody view={view} />
        </SheetContent>
      </Sheet>
    </>
  );
}
