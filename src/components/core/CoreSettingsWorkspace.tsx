"use client";

import * as React from "react";
import {
  Activity,
  Archive,
  Bell,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  KeyRound,
  Mail,
  Plug,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Warehouse,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const settingCards = [
  { title: "基本設定", desc: "事業所名、表示言語、タイムゾーン", icon: SlidersHorizontal, status: "設定済み" },
  { title: "会社情報", desc: "住所、電話、登録番号、代表者", icon: Building2, status: "確認済み" },
  { title: "ユーザー・権限", desc: "スタッフ、ロール、承認権限", icon: Users, status: "3名" },
  { title: "通知", desc: "メール、アプリ通知、承認依頼", icon: Bell, status: "有効" },
  { title: "帳票設定", desc: "ロゴ、印影、備考、採番ルール", icon: FileText, status: "標準" },
  { title: "メール・FAX", desc: "送付準備テンプレートと履歴", icon: Mail, status: "準備のみ" },
  { title: "税・会計", desc: "税率、端数処理、勘定科目", icon: CreditCard, status: "10%" },
  { title: "在庫設定", desc: "拠点、適正在庫、引当ルール", icon: Warehouse, status: "2拠点" },
  { title: "API・連携", desc: "APIキー、Webhook、外部連携", icon: Plug, status: "2接続" },
  { title: "監査ログ", desc: "操作履歴、承認履歴、変更追跡", icon: Activity, status: "記録中" },
];

const auditRows = [
  ["2026/05/29 08:12", "山田 太郎", "帳票設定を更新", "成功"],
  ["2026/05/28 22:18", "core-ui", "納品書を保存", "成功"],
  ["2026/05/28 21:44", "佐藤 花子", "取引先マスタを確認", "成功"],
  ["2026/05/28 20:03", "system", "バックアップを作成", "成功"],
];

export function CoreSettingsWorkspace() {
  const [query, setQuery] = React.useState("");
  const filteredCards = settingCards.filter((card) =>
    [card.title, card.desc, card.status].join(" ").toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <section className="space-y-3" data-testid="core-settings-workspace">
      <div className="grid gap-2 md:grid-cols-4">
        <Metric title="利用状況" value="72%" note="今月の帳票/API利用" />
        <Metric title="プラン" value="premium_980" note="Kenjiro Sato" />
        <Metric title="ストレージ" value="8.4GB" note="100GB中" />
        <Metric title="APIキー状態" value="有効" note="最終利用 18分前" />
      </div>

      <div className="rounded-md border border-neutral-200 bg-white p-2">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1 lg:max-w-md">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <Input className="h-8 pl-8" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="設定項目を検索" />
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <RefreshCw className="size-3.5" />
            同期状態を確認
          </Button>
          <Button size="sm" className="h-8 gap-1.5" onClick={() => toast.success("設定ドラフトを保存しました")}>
            <Save className="size-3.5" />
            設定を保存
          </Button>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Tabs defaultValue="general" className="min-w-0">
          <TabsList className="grid h-8 grid-cols-5">
            <TabsTrigger value="general" className="text-xs">基本</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs">帳票</TabsTrigger>
            <TabsTrigger value="ops" className="text-xs">運用</TabsTrigger>
            <TabsTrigger value="api" className="text-xs">API</TabsTrigger>
            <TabsTrigger value="audit" className="text-xs">監査</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-3">
            <div className="grid gap-2 md:grid-cols-2 2xl:grid-cols-3">
              {filteredCards.slice(0, 8).map((card) => <SettingCard key={card.title} {...card} />)}
            </div>
          </TabsContent>
          <TabsContent value="documents" className="mt-3">
            <div className="grid gap-3 lg:grid-cols-2">
              <Card className="shadow-sm">
                <CardHeader className="border-b px-3 py-2"><CardTitle className="text-sm">帳票設定</CardTitle></CardHeader>
                <CardContent className="grid gap-3 p-3">
                  <Field label="帳票ロゴ"><Input className="h-8" defaultValue="aiboux CORE 標準ロゴ" /></Field>
                  <Field label="採番ルール"><Input className="h-8" defaultValue="{TYPE}-{YYYYMMDD}-{SEQ}" /></Field>
                  <Field label="標準備考"><Textarea className="min-h-20" defaultValue="本書の内容をご確認ください。" /></Field>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="border-b px-3 py-2"><CardTitle className="text-sm">メール・FAX準備</CardTitle></CardHeader>
                <CardContent className="space-y-3 p-3 text-sm">
                  <ToggleLine title="メール送付準備テンプレート" desc="送信前確認画面で本文を生成" checked />
                  <ToggleLine title="FAX送付準備テンプレート" desc="外部回線接続前は準備のみ" checked />
                  <ToggleLine title="添付PDF自動生成" desc="送付準備時に印刷PDFを添付候補化" checked />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="ops" className="mt-3">
            <div className="grid gap-2 md:grid-cols-2">
              <SettingCard title="通知" desc="承認待ち、期限超過、在庫アラート" icon={Bell} status="有効" />
              <SettingCard title="在庫設定" desc="引当、適正在庫、棚卸、入出庫履歴" icon={Warehouse} status="2拠点" />
              <SettingCard title="バックアップ" desc="毎日保存、復元ポイント、CSV保管" icon={Archive} status="毎日" />
              <SettingCard title="サポート窓口" desc="問い合わせ、障害連絡、操作支援" icon={ShieldCheck} status="標準" />
            </div>
          </TabsContent>
          <TabsContent value="api" className="mt-3">
            <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
              <SettingCard title="APIキー" desc="Core API利用状態、最終アクセス、再発行" icon={KeyRound} status="有効" />
              <SettingCard title="外部連携" desc="Shop、Mail、Mall、会計ツール連携" icon={Plug} status="4連携" />
              <Card className="shadow-sm lg:col-span-2">
                <CardHeader className="border-b px-3 py-2"><CardTitle className="text-sm">接続状態</CardTitle></CardHeader>
                <CardContent className="grid gap-2 p-3 md:grid-cols-3">
                  <Connection name="AIBOUX Shop" status="接続済み" />
                  <Connection name="AIBOUX Mail" status="接続済み" />
                  <Connection name="会計API" status="TBD" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="audit" className="mt-3">
            <Card className="shadow-sm">
              <CardHeader className="border-b px-3 py-2"><CardTitle className="text-sm">監査ログ</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-neutral-50">
                      <TableHead className="h-8 px-2 text-xs">日時</TableHead>
                      <TableHead className="h-8 px-2 text-xs">操作者</TableHead>
                      <TableHead className="h-8 px-2 text-xs">内容</TableHead>
                      <TableHead className="h-8 px-2 text-xs">状態</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditRows.map((row) => (
                      <TableRow key={row.join("-")} className="h-9">
                        {row.map((cell) => <TableCell key={cell} className="px-2 py-1 text-xs">{cell}</TableCell>)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <aside className="h-fit rounded-md border border-neutral-200 bg-white">
          <div className="border-b px-3 py-3">
            <div className="text-sm font-semibold">運用サマリー</div>
            <div className="text-xs text-neutral-500">設定の抜け漏れと次のアクション</div>
          </div>
          <div className="space-y-3 p-3">
            <StatusLine title="会社情報" status="確認済み" />
            <StatusLine title="帳票ロゴ" status="設定済み" />
            <StatusLine title="APIキー" status="有効" />
            <StatusLine title="バックアップ" status="本日作成済み" />
            <Separator />
            <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
              <div className="text-xs font-semibold">次のアクション</div>
              <p className="mt-1 text-xs leading-5 text-neutral-600">メール・FAXは送付準備までです。外部送信を有効化する場合は、人間承認付きの送信フローを追加してください。</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Metric({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white px-3 py-2">
      <div className="text-[11px] text-neutral-500">{title}</div>
      <div className="mt-1 text-lg font-semibold text-neutral-950">{value}</div>
      <div className="text-[11px] text-neutral-500">{note}</div>
    </div>
  );
}

function SettingCard({ title, desc, icon: Icon, status }: { title: string; desc: string; icon: React.ComponentType<{ className?: string }>; status: string }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-start gap-3 p-3">
        <div className="rounded-md border border-neutral-200 bg-neutral-50 p-2"><Icon className="size-4 text-neutral-700" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-sm font-semibold">{title}</div>
            <Badge variant="outline" className="rounded-md text-[11px]">{status}</Badge>
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-xs font-medium text-neutral-600">{label}{children}</label>;
}

function ToggleLine({ title, desc, checked }: { title: string; desc: string; checked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 px-3 py-2">
      <div><div className="text-sm font-medium">{title}</div><div className="text-xs text-neutral-500">{desc}</div></div>
      <Checkbox defaultChecked={checked} aria-label={`${title}を有効化`} />
    </div>
  );
}

function Connection({ name, status }: { name: string; status: string }) {
  return (
    <div className="rounded-md border border-neutral-200 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{name}</span>
        <CheckCircle2 className="size-4 text-emerald-600" />
      </div>
      <div className="mt-1 text-xs text-neutral-500">{status}</div>
    </div>
  );
}

function StatusLine({ title, status }: { title: string; status: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-neutral-600">{title}</span>
      <span className="font-medium text-neutral-950">{status}</span>
    </div>
  );
}
