"use client";

import * as React from "react";
import {
  CheckCircle2,
  Clock,
  Code2,
  Download,
  Eye,
  FileJson,
  History,
  Image,
  Import,
  Layers3,
  LayoutTemplate,
  Monitor,
  Palette,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const themes = [
  { id: "core-standard", name: "Core Standard", status: "公開中", updated: "2026/05/29", blocks: 18 },
  { id: "core-dense", name: "Dense Backoffice", status: "下書き", updated: "2026/05/28", blocks: 22 },
  { id: "invoice-formal", name: "Formal Documents", status: "検証中", updated: "2026/05/27", blocks: 9 },
];

const history = [
  ["2026/05/29 08:20", "余白密度を更新", "山田 太郎"],
  ["2026/05/28 22:10", "帳票プレビューを追加", "core-ui"],
  ["2026/05/28 19:45", "取引先詳細タブを調整", "佐藤 花子"],
];

export function CoreDesignWorkspace() {
  const [selectedTheme, setSelectedTheme] = React.useState(themes[0]);
  const [selectedBlock, setSelectedBlock] = React.useState("ヘッダー / KPI / 一覧 / 詳細");

  return (
    <section className="space-y-3" data-testid="core-design-workspace">
      <div className="grid gap-2 md:grid-cols-4">
        <Metric title="テーマ" value={`${themes.length}件`} note="公開中 1 / 下書き 1" />
        <Metric title="コンポーネント" value="42" note="Core専用UI部品" />
        <Metric title="アセット" value="128" note="ロゴ・帳票・画像" />
        <Metric title="公開チェック" value="9/10" note="残り1件確認" />
      </div>

      <div className="grid min-h-[700px] gap-3 xl:grid-cols-[280px_minmax(0,1fr)_380px]">
        <Card className="h-fit shadow-sm">
          <CardHeader className="border-b px-3 py-2">
            <CardTitle className="flex items-center gap-2 text-sm"><LayoutTemplate className="size-4" />テーマ一覧</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedTheme(theme)}
                className={cn("w-full rounded-md border p-3 text-left transition", selectedTheme.id === theme.id ? "border-blue-300 bg-blue-50/60" : "border-neutral-200 hover:bg-neutral-50")}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{theme.name}</span>
                  <Badge variant="outline" className="rounded-md text-[11px]">{theme.status}</Badge>
                </div>
                <div className="mt-1 text-xs text-neutral-500">{theme.blocks} components / {theme.updated}</div>
              </button>
            ))}
            <Separator />
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1.5"><Download className="size-3.5" />Export</Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5"><Import className="size-3.5" />Import</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b px-3 py-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm"><Monitor className="size-4" />ライブプレビュー</CardTitle>
              <p className="mt-1 text-xs text-neutral-500">{selectedTheme.name} / 1980x1080基準</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-md text-[11px]">Light only</Badge>
              <Button size="sm" className="h-8 gap-1.5" onClick={() => toast.success("デザイン変更を保存しました")}>
                <Save className="size-3.5" />保存
              </Button>
            </div>
          </CardHeader>
          <CardContent className="bg-neutral-50 p-4">
            <div className="mx-auto max-w-5xl rounded-md border border-neutral-200 bg-white shadow-sm">
              <div className="flex h-10 items-center justify-between border-b px-4">
                <div className="text-sm font-semibold">見積書一覧</div>
                <div className="h-7 w-48 rounded-md border bg-white" />
              </div>
              <div className="grid grid-cols-6 gap-2 p-3">
                {["総件数", "下書き", "承認待ち", "発行済み", "期限確認", "対象金額"].map((label) => (
                  <button key={label} type="button" onClick={() => setSelectedBlock("KPI strip")} className="rounded-md border border-neutral-200 p-2 text-left hover:border-blue-300">
                    <div className="text-[10px] text-neutral-500">{label}</div>
                    <div className="mt-1 text-sm font-semibold">256件</div>
                  </button>
                ))}
              </div>
              <div className="grid gap-3 p-3 pt-0 xl:grid-cols-[1fr_260px]">
                <button type="button" onClick={() => setSelectedBlock("高密度テーブル")} className="rounded-md border border-neutral-200 bg-white p-2 text-left hover:border-blue-300">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-8 flex-1 rounded-md border bg-white" />
                    <div className="h-8 w-28 rounded-md border bg-white" />
                    <div className="h-8 w-24 rounded-md bg-blue-600" />
                  </div>
                  {Array.from({ length: 11 }).map((_, index) => (
                    <div key={index} className="grid grid-cols-[120px_1fr_80px_90px_70px] border-t py-1.5 text-[11px]">
                      <span className="font-medium text-blue-700">QTE-00{index + 1}</span><span>株式会社サンプル</span><span>2026/05/{index + 10}</span><span className="text-right">¥{(98000 + index * 6000).toLocaleString()}</span><span className="text-right">...</span>
                    </div>
                  ))}
                </button>
                <button type="button" onClick={() => setSelectedBlock("右詳細パネル")} className="rounded-md border border-neutral-200 bg-white p-3 text-left hover:border-blue-300">
                  <div className="text-sm font-semibold">QTE-20260529</div>
                  <div className="mt-2 rounded-md border bg-neutral-50 p-2 text-xs">合計 ¥1,375,000</div>
                  <div className="mt-3 grid gap-2">
                    <div className="h-8 rounded-md bg-blue-600" />
                    <div className="grid grid-cols-2 gap-2"><div className="h-8 rounded-md border" /><div className="h-8 rounded-md border" /></div>
                  </div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <aside className="space-y-3">
          <Card className="shadow-sm">
            <CardHeader className="border-b px-3 py-2">
              <CardTitle className="flex items-center gap-2 text-sm"><Layers3 className="size-4" />デザイン設定</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <Tabs defaultValue="basic">
                <TabsList className="grid h-8 grid-cols-3">
                  <TabsTrigger value="basic" className="text-xs">基本</TabsTrigger>
                  <TabsTrigger value="parts" className="text-xs">部品</TabsTrigger>
                  <TabsTrigger value="advanced" className="text-xs">高度</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="mt-3 space-y-3">
                  <Field label="テーマ名"><Input className="h-8" value={selectedTheme.name} readOnly /></Field>
                  <Field label="選択中コンポーネント"><Input className="h-8" value={selectedBlock} onChange={(event) => setSelectedBlock(event.target.value)} /></Field>
                  <Notice icon={<Palette className="size-4" />} text="色・フォント・角丸・余白はAIBOUX標準に固定します。" />
                </TabsContent>
                <TabsContent value="parts" className="mt-3 space-y-2">
                  {["KPI card", "Dense toolbar", "Document table", "Right detail panel", "A4 preview"].map((part) => (
                    <button key={part} type="button" onClick={() => setSelectedBlock(part)} className="flex w-full items-center justify-between rounded-md border px-2 py-1.5 text-sm hover:bg-neutral-50">
                      {part}<span className="text-xs text-neutral-500">編集</span>
                    </button>
                  ))}
                </TabsContent>
                <TabsContent value="advanced" className="mt-3 space-y-3">
                  <Field label="カスタムCSS"><Textarea className="min-h-24 font-mono text-xs" defaultValue={"/* TBD: 管理者承認後のみ有効 */"} /></Field>
                  <Notice icon={<Code2 className="size-4" />} text="自由なCSSは品質を崩すため、公開前チェックで承認が必要です。" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="border-b px-3 py-2"><CardTitle className="flex items-center gap-2 text-sm"><Image className="size-4" />アセット管理</CardTitle></CardHeader>
            <CardContent className="space-y-2 p-3 text-xs">
              <Asset name="aiboux-logo.svg" type="Logo" />
              <Asset name="invoice-paper-a4" type="Document" />
              <Asset name="core-empty-state" type="UI" />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="border-b px-3 py-2"><CardTitle className="flex items-center gap-2 text-sm"><ShieldCheck className="size-4" />公開チェックリスト</CardTitle></CardHeader>
            <CardContent className="space-y-2 p-3 text-xs">
              <Check text="Light mode only" done />
              <Check text="Noto Sans JP" done />
              <Check text="1980x1080レイアウト確認" done />
              <Check text="外部送信文言の安全化" done />
              <Check text="管理者承認" />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button variant="outline" size="sm" className="h-8 gap-1.5"><Eye className="size-3.5" />確認</Button>
                <Button size="sm" className="h-8 gap-1.5" onClick={() => toast.info("公開は人間承認後に実行します")}><Sparkles className="size-3.5" />公開準備</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="border-b px-3 py-2"><CardTitle className="flex items-center gap-2 text-sm"><History className="size-4" />変更履歴</CardTitle></CardHeader>
            <CardContent className="space-y-2 p-3">
              {history.map((row) => (
                <div key={row.join("-")} className="grid grid-cols-[86px_1fr] gap-2 text-xs">
                  <span className="text-neutral-500">{row[0]}</span><span>{row[1]} / {row[2]}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
}

function Metric({ title, value, note }: { title: string; value: string; note: string }) {
  return <div className="rounded-md border border-neutral-200 bg-white px-3 py-2"><div className="text-[11px] text-neutral-500">{title}</div><div className="mt-1 text-lg font-semibold">{value}</div><div className="text-[11px] text-neutral-500">{note}</div></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-xs font-medium text-neutral-600">{label}{children}</label>;
}

function Notice({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="flex gap-2 rounded-md border border-neutral-200 bg-neutral-50 p-2 text-xs text-neutral-600">{icon}<span>{text}</span></div>;
}

function Asset({ name, type }: { name: string; type: string }) {
  return <div className="flex items-center justify-between rounded-md border px-2 py-1.5"><span className="flex items-center gap-1.5"><FileJson className="size-3.5" />{name}</span><Badge variant="outline" className="rounded-md text-[10px]">{type}</Badge></div>;
}

function Check({ text, done = false }: { text: string; done?: boolean }) {
  return <div className="flex items-center justify-between gap-2"><span>{text}</span>{done ? <CheckCircle2 className="size-3.5 text-emerald-600" /> : <Clock className="size-3.5 text-amber-600" />}</div>;
}
