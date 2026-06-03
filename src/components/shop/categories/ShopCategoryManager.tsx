"use client";

import * as React from "react";
import { Check, Loader2, Pencil, Plus, Save, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type CategoryMapping = {
  id: string;
  name: string;
  slug: string;
  googleCategoryId: string;
  googleCategoryName: string;
  feedEnabled: boolean;
  sortOrder: number;
  status: "active" | "hidden";
};

type GoogleCategorySuggestion = {
  id: string;
  name: string;
};

const defaultMappings: CategoryMapping[] = [
  {
    id: "cat-apparel",
    name: "アパレル",
    slug: "apparel",
    googleCategoryId: "1604",
    googleCategoryName: "Apparel & Accessories > Clothing",
    feedEnabled: true,
    sortOrder: 10,
    status: "active",
  },
  {
    id: "cat-bag",
    name: "バッグ",
    slug: "bags",
    googleCategoryId: "5181",
    googleCategoryName: "Luggage & Bags > Shopping Totes",
    feedEnabled: true,
    sortOrder: 20,
    status: "active",
  },
  {
    id: "cat-home",
    name: "生活雑貨",
    slug: "home-goods",
    googleCategoryId: "536",
    googleCategoryName: "Home & Garden",
    feedEnabled: true,
    sortOrder: 30,
    status: "active",
  },
];

const emptyDraft: CategoryMapping = {
  id: "",
  name: "",
  slug: "",
  googleCategoryId: "",
  googleCategoryName: "",
  feedEnabled: true,
  sortOrder: 100,
  status: "active",
};

export function ShopCategoryManager() {
  const [mappings, setMappings] = React.useState<CategoryMapping[]>(defaultMappings);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<CategoryMapping>(emptyDraft);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      setIsLoading(true);
      try {
        const response = await fetch("/shop/api/categories/list", { headers: { accept: "application/json" } });
        const data = (await response.json()) as { success?: boolean; categories?: CategoryMapping[]; error?: string };
        if (!response.ok || !data.success) throw new Error(data.error || "カテゴリを読み込めませんでした");
        if (!cancelled) setMappings(data.categories?.length ? data.categories : defaultMappings);
      } catch (error) {
        if (!cancelled) {
          setMappings(defaultMappings);
          toast.error(error instanceof Error ? error.message : "カテゴリを読み込めませんでした");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  const startEdit = (mapping: CategoryMapping) => {
    setEditingId(mapping.id);
    setDraft(mapping);
  };

  const startCreate = () => {
    setEditingId("new");
    setDraft({ ...emptyDraft, id: `shopcat-${Date.now()}`, sortOrder: (mappings.length + 1) * 10 });
  };

  const saveDraft = async () => {
    const normalizedName = draft.name.trim();
    const normalizedSlug = draft.slug.trim().toLowerCase();
    const normalizedGoogleId = draft.googleCategoryId.trim();

    if (!normalizedName || !normalizedSlug || !normalizedGoogleId) {
      toast.error("店内のカテゴリ名、URL用の名前、GoogleカテゴリIDを入力してください");
      return;
    }

    const normalizedDraft = {
      ...draft,
      name: normalizedName,
      slug: normalizedSlug,
      googleCategoryId: normalizedGoogleId,
      googleCategoryName: draft.googleCategoryName.trim(),
    };

    setIsSaving(true);
    try {
      const response = await fetch("/shop/api/categories/save", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(normalizedDraft),
      });
      const data = (await response.json()) as { success?: boolean; category?: CategoryMapping; error?: string };
      if (!response.ok || !data.success || !data.category) throw new Error(data.error || "カテゴリを保存できませんでした");

      const savedCategory = data.category;
      const exists = mappings.some((mapping) => mapping.id === savedCategory.id || mapping.slug === savedCategory.slug);
      setMappings((current) =>
        exists
          ? current.map((mapping) => (mapping.id === savedCategory.id || mapping.slug === savedCategory.slug ? savedCategory : mapping))
          : [...current, savedCategory],
      );
      toast.success(exists ? "カテゴリ設定を更新しました" : "カテゴリ設定を追加しました");
      setEditingId(null);
      setDraft(emptyDraft);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "カテゴリを保存できませんでした");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">カテゴリ管理</h1>
          <p className="text-sm text-neutral-500">
            商品を店内とGoogleショッピングで正しいカテゴリに出すための設定です。
          </p>
        </div>
        <Button className="h-8 gap-2" onClick={startCreate}>
          <Plus className="size-4" />
          追加
        </Button>
      </div>

      <div className="mb-3 grid gap-3 lg:grid-cols-2">
        <Card className="border-blue-200 bg-blue-50/40 shadow-sm">
          <CardContent className="px-4 py-3">
            <div className="text-sm font-semibold text-neutral-950">必須設定</div>
            <p className="mt-1 text-xs leading-5 text-neutral-600">店内のカテゴリ名、URL用の名前、GoogleカテゴリIDは保存に必要です。GoogleカテゴリIDが違うと外部連携で商品が見つかりにくくなります。</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="px-4 py-3">
            <div className="text-sm font-semibold text-neutral-950">拡張設定</div>
            <p className="mt-1 text-xs leading-5 text-neutral-600">Googleカテゴリ名や表示順は後から整えられます。迷った場合は候補検索を使って近いカテゴリを選びます。</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b border-neutral-200 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-sm">カテゴリ対応表</CardTitle>
            <Badge variant="secondary" className="rounded-md text-[11px]">
              {isLoading ? "読込中" : `${mappings.length}件`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="min-w-[920px]">
            <TableHeader>
              <TableRow className="bg-neutral-50">
                <TableHead className="w-[18%]">店内のカテゴリ名 *</TableHead>
                <TableHead className="w-[16%]">URL用の名前 *</TableHead>
                <TableHead className="w-[16%]">GoogleカテゴリID *</TableHead>
                <TableHead>Googleカテゴリ名</TableHead>
                <TableHead className="w-[92px]">状態</TableHead>
                <TableHead className="w-[104px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editingId === "new" && (
                <EditableRow
                  draft={draft}
                  isSaving={isSaving}
                  onDraftChange={setDraft}
                  onCancel={() => setEditingId(null)}
                  onSave={saveDraft}
                />
              )}
              {mappings.map((mapping) =>
                editingId === mapping.id ? (
                  <EditableRow
                    key={mapping.id}
                    draft={draft}
                    isSaving={isSaving}
                    onDraftChange={setDraft}
                    onCancel={() => setEditingId(null)}
                    onSave={saveDraft}
                  />
                ) : (
                  <TableRow key={mapping.id}>
                    <TableCell className="font-medium text-neutral-950">{mapping.name}</TableCell>
                    <TableCell className="text-neutral-600">{mapping.slug}</TableCell>
                    <TableCell className=" text-xs text-neutral-700">{mapping.googleCategoryId}</TableCell>
                    <TableCell className="text-neutral-700">{mapping.googleCategoryName || "未設定"}</TableCell>
                    <TableCell>
                      <Badge variant={mapping.status === "active" ? "default" : "secondary"} className="rounded-md text-[11px]">
                        {mapping.status === "active" ? "有効" : "非表示"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2" onClick={() => startEdit(mapping)}>
                        <Pencil className="size-3.5" />
                        編集
                      </Button>
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}

function EditableRow({
  draft,
  isSaving,
  onDraftChange,
  onCancel,
  onSave,
}: {
  draft: CategoryMapping;
  isSaving: boolean;
  onDraftChange: (draft: CategoryMapping) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const [suggestions, setSuggestions] = React.useState<GoogleCategorySuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = React.useState(false);

  const searchGoogleCategory = async () => {
    setIsSuggesting(true);
    try {
      const keyword = draft.name || draft.googleCategoryName || draft.slug;
      const response = await fetch(`/shop/api/categories/google-suggest?q=${encodeURIComponent(keyword)}`);
      const data = (await response.json()) as { success?: boolean; suggestions?: GoogleCategorySuggestion[] };
      setSuggestions(data.suggestions ?? []);
      if (!data.suggestions?.length) toast.info("Googleカテゴリ候補が見つかりませんでした");
    } catch {
      toast.error("Googleカテゴリ候補を取得できませんでした");
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <TableRow className="bg-neutral-50/80">
      <TableCell>
        <Input
          className="h-8"
          value={draft.name}
          placeholder="例: アパレル"
          onChange={(event) => onDraftChange({ ...draft, name: event.target.value })}
        />
      </TableCell>
      <TableCell>
        <Input
          className="h-8"
          value={draft.slug}
          placeholder="apparel"
          onChange={(event) => onDraftChange({ ...draft, slug: event.target.value })}
        />
      </TableCell>
      <TableCell>
        <Input
          className="h-8"
          value={draft.googleCategoryId}
          placeholder="1604"
          onChange={(event) => onDraftChange({ ...draft, googleCategoryId: event.target.value.replace(/\D/g, "") })}
        />
      </TableCell>
      <TableCell>
        <div className="space-y-1.5">
          <div className="flex gap-1.5">
            <Input
              className="h-8"
              value={draft.googleCategoryName}
              placeholder="Apparel & Accessories > Clothing"
              onChange={(event) => onDraftChange({ ...draft, googleCategoryName: event.target.value })}
            />
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Googleカテゴリ候補を検索"
              disabled={isSuggesting}
              onClick={searchGoogleCategory}
            >
              {isSuggesting ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            </Button>
          </div>
          {suggestions.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-left text-[11px] text-neutral-700 hover:border-blue-200 hover:bg-blue-50"
                  onClick={() =>
                    onDraftChange({
                      ...draft,
                      googleCategoryId: suggestion.id,
                      googleCategoryName: suggestion.name,
                    })
                  }
                >
                  <span className="">{suggestion.id}</span> {suggestion.name}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </TableCell>
      <TableCell>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 w-[72px]"
          onClick={() => onDraftChange({ ...draft, status: draft.status === "active" ? "hidden" : "active" })}
        >
          {draft.status === "active" ? <Check className="mr-1 size-3.5" /> : <X className="mr-1 size-3.5" />}
          {draft.status === "active" ? "有効" : "非表示"}
        </Button>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="キャンセル" onClick={onCancel}>
            <X className="size-4" />
          </Button>
          <Button size="icon-sm" aria-label="保存" disabled={isSaving} onClick={onSave}>
            <Save className="size-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
