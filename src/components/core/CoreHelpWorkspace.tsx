import { BookOpen, CircleHelp, FileText, Mail, MessageCircle, ReceiptText, Search, Settings, UserPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const quickTasks = [
  { label: "見積書を作成する", icon: FileText, href: "/core/estimates" },
  { label: "請求書を発行する", icon: ReceiptText, href: "/core/invoices/new" },
  { label: "入金を登録する", icon: ReceiptText, href: "/core/payments" },
  { label: "ユーザーを招待する", icon: UserPlus, href: "/core/users" },
  { label: "各種設定を確認する", icon: Settings, href: "/core/settings" },
];

const guides = [
  { title: "はじめての AIBOUX Core", tag: "入門", time: "10分" },
  { title: "見積書の作成と承認", tag: "見積書", time: "8分" },
  { title: "請求書の発行と入金管理", tag: "請求書", time: "12分" },
  { title: "商品・SKUマスタの運用", tag: "商品", time: "9分" },
  { title: "デザインと帳票テンプレート", tag: "デザイン", time: "15分" },
];

const faqs = ["見積書", "請求書", "入金・消込", "ユーザー・権限", "設定", "デザイン", "API・連携", "トラブルシューティング"];
const keywords = ["見積番号", "請求書発行", "入金登録", "権限設定", "帳票ロゴ", "APIキー", "バックアップ", "メール準備"];

export function CoreHelpWorkspace() {
  return (
    <div data-testid="core-help-workspace" className="space-y-3">
      <div className="rounded-md border border-neutral-200 bg-white p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <Input className="h-10 pl-9" placeholder="ヘルプを検索（例: 見積書の作り方）" />
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between p-3">
          <CardTitle className="text-base">クイックタスク</CardTitle>
          <a href="/docs" className="text-xs font-semibold text-blue-700">すべて見る</a>
        </CardHeader>
        <CardContent className="grid gap-2 p-3 pt-0 md:grid-cols-5">
          {quickTasks.map((task) => {
            const Icon = task.icon;
            return (
              <a key={task.label} href={task.href} className="flex min-h-24 flex-col justify-between rounded-md border border-neutral-200 bg-white p-3 hover:border-blue-200 hover:bg-blue-50/30">
                <Icon className="size-5 text-blue-700" />
                <span className="text-sm font-semibold text-neutral-900">{task.label}</span>
              </a>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid gap-3">
          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <CardTitle className="flex items-center gap-2 text-base"><BookOpen className="size-4" />おすすめガイド</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="divide-y divide-neutral-200 rounded-md border border-neutral-200">
                {guides.map((guide) => (
                  <a key={guide.title} href="/docs" className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-neutral-50">
                    <div>
                      <div className="text-sm font-semibold text-blue-700">{guide.title}</div>
                      <div className="mt-0.5 text-[11px] text-neutral-500">Core運用を短時間で確認できます。</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="rounded-md">{guide.tag}</Badge>
                      <span className="text-xs text-neutral-500">{guide.time}</span>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <CardTitle className="text-base">新着情報・お知らせ</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 p-3 pt-0 md:grid-cols-3">
              {["帳票テンプレートを更新しました", "権限管理のガイドを追加しました", "APIキー管理の注意点を更新しました"].map((title) => (
                <div key={title} className="rounded-md border border-neutral-200 p-3">
                  <Badge variant="outline" className="mb-2 rounded-md">更新</Badge>
                  <div className="text-sm font-semibold">{title}</div>
                  <div className="mt-1 text-xs text-neutral-500">2026/05/29</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-3">
          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <CardTitle className="flex items-center gap-2 text-base"><CircleHelp className="size-4" />よくある質問</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="divide-y divide-neutral-200 rounded-md border border-neutral-200">
                {faqs.map((faq, index) => (
                  <a key={faq} href="/docs" className="flex items-center justify-between px-3 py-2 text-sm hover:bg-neutral-50">
                    <span>{faq}</span>
                    <span className="text-xs text-neutral-500">{index + 7}</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <CardTitle className="flex items-center gap-2 text-base"><MessageCircle className="size-4" />サポート・お問い合わせ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0">
              <div className="rounded-md border border-neutral-200 p-3 text-sm">
                <div className="font-semibold">メールサポート</div>
                <div className="mt-1 text-xs text-neutral-500">support@aiboux.com / 24時間以内に返信します</div>
              </div>
              <Button className="w-full gap-1.5"><Mail className="size-4" />問い合わせフォームを開く</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="p-3">
          <CardTitle className="text-base">最近閲覧したページ / 人気の検索キーワード</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 p-3 pt-0">
          {keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="rounded-md px-2 py-1">{keyword}</Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
