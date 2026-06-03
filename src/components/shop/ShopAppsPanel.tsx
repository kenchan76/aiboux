"use client";

import { CheckCircle2, ExternalLink, PlugZap, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { integrations } from "@/data/shop-sample-data";

export function ShopAppsPanel() {
  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">アプリ</h1>
        <p className="text-sm text-neutral-500">モール、配送、決済、分析の連携状態を確認します。</p>
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.id} className="shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-3 px-4 py-3">
              <div>
                <CardTitle className="text-sm">{integration.name}</CardTitle>
                <p className="mt-1 text-xs text-neutral-500">{integration.category}</p>
              </div>
              <Badge variant={integration.status === "接続済み" ? "success" : integration.status === "確認必要" ? "warning" : "secondary"}>
                {integration.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                {integration.status === "接続済み" ? <CheckCircle2 className="size-4 text-emerald-600" /> : integration.status === "確認必要" ? <TriangleAlert className="size-4 text-amber-600" /> : <PlugZap className="size-4 text-neutral-500" />}
                <span>{integration.description}</span>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => { window.history.pushState({ section: "settings" }, "", "/s/aiboux/admin/settings"); }}>
                設定を開く
                <ExternalLink className="size-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
