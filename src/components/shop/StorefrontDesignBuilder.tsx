"use client";

import * as React from "react";
import { Eye, GripVertical, LayoutTemplate, Loader2, MousePointer2, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultStorefrontLayout,
  sanitizeStorefrontLayout,
  type StorefrontBlock,
  type StorefrontBlockType,
  type StorefrontLayout,
} from "@/lib/shopStorefrontLayout";
import { cn } from "@/lib/utils";

type LayoutResponse = {
  success?: boolean;
  layout?: StorefrontLayout;
  updatedAt?: number | null;
  error?: string;
};

const blockLabels: Record<StorefrontBlockType, string> = {
  hero: "メインビジュアル",
  trustBar: "安心表示",
  featuredProducts: "おすすめ商品",
  categoryLinks: "カテゴリ導線",
};

const blockDescriptions: Record<StorefrontBlockType, string> = {
  hero: "ストアの第一印象を決める見出しです。",
  trustBar: "購入前の不安を減らす短い約束を並べます。",
  featuredProducts: "公開中の商品を自動で表示します。",
  categoryLinks: "探しやすいカテゴリ導線を表示します。",
};

export function StorefrontDesignBuilder() {
  const [layout, setLayout] = React.useState<StorefrontLayout>(defaultStorefrontLayout);
  const [selectedBlockId, setSelectedBlockId] = React.useState(defaultStorefrontLayout.blocks[0]?.id ?? "");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [draggingBlockId, setDraggingBlockId] = React.useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = React.useState<number | null>(null);

  const selectedBlock = layout.blocks.find((block) => block.id === selectedBlockId) ?? layout.blocks[0];

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch("/shop/api/storefront/layout");
        const data = (await response.json().catch(() => ({}))) as LayoutResponse;
        if (!response.ok || !data.success || !data.layout) {
          throw new Error(data.error || "ストアデザインを取得できませんでした");
        }
        const safeLayout = sanitizeStorefrontLayout(data.layout);
        if (!mounted) return;
        setLayout(safeLayout);
        setSelectedBlockId(safeLayout.blocks[0]?.id ?? "");
        setLastSavedAt(data.updatedAt ?? null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "ストアデザインを取得できませんでした");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const updateBlock = (blockId: string, patch: Partial<StorefrontBlock>) => {
    setLayout((current) => ({
      ...current,
      blocks: current.blocks.map((block) => (block.id === blockId ? { ...block, ...patch } : block)),
    }));
  };

  const reorderBlock = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    setLayout((current) => {
      const fromIndex = current.blocks.findIndex((block) => block.id === fromId);
      const toIndex = current.blocks.findIndex((block) => block.id === toId);
      if (fromIndex < 0 || toIndex < 0) return current;
      const blocks = [...current.blocks];
      const [moved] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, moved);
      return { ...current, blocks };
    });
  };

  const moveSelected = (direction: -1 | 1) => {
    setLayout((current) => {
      const index = current.blocks.findIndex((block) => block.id === selectedBlockId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.blocks.length) return current;
      const blocks = [...current.blocks];
      const [moved] = blocks.splice(index, 1);
      blocks.splice(nextIndex, 0, moved);
      return { ...current, blocks };
    });
  };

  const saveLayout = async () => {
    setSaving(true);
    try {
      const safeLayout = sanitizeStorefrontLayout(layout);
      const response = await fetch("/shop/api/storefront/layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layout: safeLayout, actorId: "shop-design-builder" }),
      });
      const data = (await response.json().catch(() => ({}))) as LayoutResponse;
      if (!response.ok || !data.success || !data.layout) {
        throw new Error(data.error || "ストアデザインを保存できませんでした");
      }
      setLayout(sanitizeStorefrontLayout(data.layout));
      setLastSavedAt(data.updatedAt ?? Date.now());
      toast.success("ストアデザインを保存しました");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ストアデザインを保存できませんでした");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">ストアデザイン</h1>
          <p className="text-sm text-neutral-500">ブロックをクリックして右側で編集します。文字の直接編集や色変更はできません。</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {lastSavedAt ? <span className="text-xs text-neutral-500">最終保存: {new Date(lastSavedAt).toLocaleString("ja-JP")}</span> : null}
          <Button asChild variant="outline" className="gap-2">
            <a href="/s/aiboux/" target="_blank" rel="noreferrer">
              <Eye className="size-4" />
              SSR表示を確認
            </a>
          </Button>
          <Button onClick={saveLayout} disabled={saving || loading} className="gap-2">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            保存
          </Button>
        </div>
      </div>

      <div className="grid min-h-[640px] gap-4 xl:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-200 px-4 py-3">
            <div>
              <CardTitle className="text-sm">インタラクティブキャンバス</CardTitle>
              <p className="mt-1 text-xs text-neutral-500">選択、並び替え、構成確認だけをキャンバスで行います。</p>
            </div>
            <Badge variant="secondary" className="rounded-md text-[11px]">
              固定デザイン
            </Badge>
          </CardHeader>
          <CardContent className="bg-neutral-50 p-4">
            {loading ? (
              <div className="flex h-[520px] items-center justify-center rounded-md border border-dashed border-neutral-300 bg-white text-sm text-neutral-500">
                <Loader2 className="mr-2 size-4 animate-spin" />
                読み込み中
              </div>
            ) : (
              <div className="mx-auto max-w-4xl rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
                {layout.blocks.map((block) => (
                  <CanvasBlock
                    key={block.id}
                    block={block}
                    selected={block.id === selectedBlock?.id}
                    dragging={draggingBlockId === block.id}
                    onSelect={() => setSelectedBlockId(block.id)}
                    onDragStart={() => setDraggingBlockId(block.id)}
                    onDragEnd={() => setDraggingBlockId(null)}
                    onDrop={() => {
                      if (draggingBlockId) reorderBlock(draggingBlockId, block.id);
                      setDraggingBlockId(null);
                    }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit shadow-sm">
          <CardHeader className="border-b border-neutral-200 px-4 py-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <MousePointer2 className="size-4" />
              選択中のブロック
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 py-4">
            {selectedBlock ? (
              <BlockEditor
                block={selectedBlock}
                onUpdate={(patch) => updateBlock(selectedBlock.id, patch)}
                onMoveUp={() => moveSelected(-1)}
                onMoveDown={() => moveSelected(1)}
              />
            ) : (
              <p className="text-sm text-neutral-500">キャンバス内のブロックを選択してください。</p>
            )}
            <Separator />
            <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs leading-5 text-neutral-600">
              <div className="mb-1 flex items-center gap-1.5 font-semibold text-neutral-950">
                <ShieldCheck className="size-3.5" />
                デザイン制約
              </div>
              カラー、フォントサイズ、余白、角丸はAIBOUX側で固定します。出店者は内容と順序だけを編集できるため、公開ページの品質が崩れません。
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function CanvasBlock({
  block,
  selected,
  dragging,
  onSelect,
  onDragStart,
  onDragEnd,
  onDrop,
}: {
  block: StorefrontBlock;
  selected: boolean;
  dragging: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: () => void;
}) {
  return (
    <button
      type="button"
      draggable
      onClick={onSelect}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
      className={cn(
        "mb-3 block w-full rounded-md border bg-white text-left transition",
        selected ? "border-orange-400 ring-2 ring-orange-100" : "border-neutral-200 hover:border-neutral-300",
        dragging && "opacity-60",
      )}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2 text-xs text-neutral-500">
        <span className="flex items-center gap-2">
          <GripVertical className="size-3.5" />
          {blockLabels[block.type]}
        </span>
        <span>{selected ? "選択中" : "クリックして編集"}</span>
      </div>
      <div className="p-4">
        {block.type === "hero" ? <HeroPreview block={block} /> : null}
        {block.type === "trustBar" ? <TrustPreview block={block} /> : null}
        {block.type === "featuredProducts" ? <FeaturedPreview block={block} /> : null}
        {block.type === "categoryLinks" ? <CategoryPreview block={block} /> : null}
      </div>
    </button>
  );
}

function HeroPreview({ block }: { block: StorefrontBlock }) {
  return (
    <div className="grid gap-4 rounded-md bg-neutral-950 p-5 text-white md:grid-cols-[1fr_180px]">
      <div>
        <div className="text-xs font-semibold text-orange-200">AIBOUX STORE</div>
        <div className="mt-2 text-2xl font-semibold leading-tight">{block.title}</div>
        <p className="mt-2 text-sm leading-6 text-neutral-200">{block.subtitle}</p>
        <div className="mt-4 inline-flex rounded-md bg-[#FF9933] px-3 py-2 text-xs font-semibold text-white">{block.ctaLabel || "商品を見る"}</div>
      </div>
      <div className="hidden rounded-md bg-white/10 md:block" />
    </div>
  );
}

function TrustPreview({ block }: { block: StorefrontBlock }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
      <div className="text-sm font-semibold text-neutral-950">{block.title}</div>
      <div className="mt-2 grid gap-2 md:grid-cols-3">
        {(block.items ?? []).slice(0, 3).map((item) => (
          <div key={item} className="rounded border border-neutral-200 bg-white px-2 py-2 text-xs text-neutral-700">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedPreview({ block }: { block: StorefrontBlock }) {
  return (
    <div id="products">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-base font-semibold text-neutral-950">{block.title}</div>
          <p className="text-xs text-neutral-500">{block.subtitle}</p>
        </div>
        <span className="text-xs text-neutral-500">最大{block.productLimit ?? 6}件</span>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-md border border-neutral-200 bg-white p-2">
            <div className="aspect-[4/3] rounded bg-neutral-100" />
            <div className="mt-2 h-3 rounded bg-neutral-200" />
            <div className="mt-2 h-3 w-1/2 rounded bg-orange-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryPreview({ block }: { block: StorefrontBlock }) {
  return (
    <div>
      <div className="text-base font-semibold text-neutral-950">{block.title}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(block.items ?? []).map((item) => (
          <span key={item} className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function BlockEditor({
  block,
  onUpdate,
  onMoveUp,
  onMoveDown,
}: {
  block: StorefrontBlock;
  onUpdate: (patch: Partial<StorefrontBlock>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <Badge variant="secondary" className="rounded-md">{blockLabels[block.type]}</Badge>
        <p className="mt-2 text-xs leading-5 text-neutral-500">{blockDescriptions[block.type]}</p>
      </div>
      <div className="grid gap-2">
        <label className="text-xs font-semibold text-neutral-700">見出し</label>
        <Input value={block.title} maxLength={80} onChange={(event) => onUpdate({ title: event.target.value })} />
      </div>
      {block.type === "hero" || block.type === "featuredProducts" ? (
        <div className="grid gap-2">
          <label className="text-xs font-semibold text-neutral-700">補足文</label>
          <Textarea value={block.subtitle ?? ""} maxLength={180} rows={3} onChange={(event) => onUpdate({ subtitle: event.target.value })} />
        </div>
      ) : null}
      {block.type === "hero" ? (
        <>
          <div className="grid gap-2">
            <label className="text-xs font-semibold text-neutral-700">ボタン文言</label>
            <Input value={block.ctaLabel ?? ""} maxLength={32} onChange={(event) => onUpdate({ ctaLabel: event.target.value })} />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-semibold text-neutral-700">リンク先</label>
            <Input value={block.ctaHref ?? ""} maxLength={300} onChange={(event) => onUpdate({ ctaHref: event.target.value })} />
          </div>
        </>
      ) : null}
      {block.type === "featuredProducts" ? (
        <div className="grid gap-2">
          <label className="text-xs font-semibold text-neutral-700">表示商品数</label>
          <Input
            type="number"
            min={1}
            max={12}
            value={block.productLimit ?? 6}
            onChange={(event) => onUpdate({ productLimit: Number(event.target.value) })}
          />
        </div>
      ) : null}
      {block.type === "trustBar" || block.type === "categoryLinks" ? (
        <div className="grid gap-2">
          <label className="text-xs font-semibold text-neutral-700">表示項目</label>
          <Textarea
            value={(block.items ?? []).join("\n")}
            rows={5}
            onChange={(event) => onUpdate({ items: event.target.value.split("\n") })}
          />
          <p className="text-[11px] text-neutral-500">1行につき1項目。最大6件まで保存されます。</p>
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onMoveUp}>上へ</Button>
        <Button type="button" variant="outline" onClick={onMoveDown}>下へ</Button>
      </div>
      <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-[11px] leading-5 text-neutral-500">
        <LayoutTemplate className="mb-1 size-3.5" />
        直接キャンバス内を書き換える機能はありません。構造化フォームからのみ変更できるため、HTML崩れを防ぎます。
      </div>
    </div>
  );
}
