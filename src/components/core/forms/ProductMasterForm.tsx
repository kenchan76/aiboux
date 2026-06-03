import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { Loader2, PackagePlus, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { coreProductMasterFormSchema, type CoreProductMasterFormValues } from "@/lib/coreProductMasterFormSchema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ProductMasterFormProps = {
  open: boolean;
  productId?: string;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

type ProductDetailResponse = {
  success: boolean;
  product?: CoreProductMasterFormValues;
  error?: string;
};

const defaultSku = {
  id: "",
  skuCode: "",
  variantName: "標準",
  janCode: "",
  stockQuantity: 0,
  salePrice: 0,
  shopPublishEnabled: false,
};

const defaultValues: CoreProductMasterFormValues = {
  id: "",
  productName: "",
  janCode: "",
  standardPrice: 0,
  status: "active",
  unit: "個",
  description: "",
  memo: "",
  shopName: "AIBOUX STORE",
  shopSyncEnabled: true,
  skus: [defaultSku],
  actorId: "core-ui",
};

export function ProductMasterForm({ open, productId, onOpenChange, onSaved }: ProductMasterFormProps) {
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const form = useForm<CoreProductMasterFormValues>({
    resolver: zodResolver(coreProductMasterFormSchema) as Resolver<CoreProductMasterFormValues>,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skus",
  });
  const productName = form.watch("productName");
  const standardPrice = form.watch("standardPrice");
  const skus = form.watch("skus");
  const totalStock = useMemo(() => skus.reduce((sum, sku) => sum + Number(sku.stockQuantity || 0), 0), [skus]);

  useEffect(() => {
    if (!open) return;
    if (!productId) {
      form.reset(defaultValues);
      return;
    }
    void loadProduct(productId);
  }, [open, productId]);

  async function loadProduct(nextProductId: string) {
    setLoadingDetail(true);
    try {
      const response = await fetch(`/core/api/products/save?id=${encodeURIComponent(nextProductId)}`, {
        headers: { accept: "application/json" },
      });
      const data = (await response.json()) as ProductDetailResponse;
      if (!response.ok || !data.success || !data.product) throw new Error(data.error || "商品マスタを読み込めませんでした。");
      form.reset({
        ...defaultValues,
        ...data.product,
        skus: data.product.skus?.length ? data.product.skus : [defaultSku],
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "商品マスタを読み込めませんでした。");
      onOpenChange(false);
    } finally {
      setLoadingDetail(false);
    }
  }

  const onSubmit: SubmitHandler<CoreProductMasterFormValues> = async (values) => {
    setSaving(true);
    try {
      const response = await fetch("/core/api/products/save", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as { success: boolean; error?: string };
      if (!response.ok || !data.success) throw new Error(data.error || "商品マスタを保存できませんでした。");
      toast.success("マスタを保存しました");
      onOpenChange(false);
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "商品マスタを保存できませんでした。");
    } finally {
      setSaving(false);
    }
  };

  function addSkuRow() {
    const baseCode = form.getValues("janCode") || String(Date.now()).slice(-8);
    append({
      ...defaultSku,
      skuCode: `${baseCode}-${fields.length + 1}`,
      salePrice: Number(form.getValues("standardPrice") || 0),
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-none md:w-[920px]" showCloseButton={!saving}>
        <SheetHeader className="border-b bg-white px-4 py-3">
          <SheetTitle className="flex items-center gap-2 text-base">
            <PackagePlus className="size-4" />
            {productId ? "商品マスタを編集" : "商品マスタを追加"}
          </SheetTitle>
          <SheetDescription className="text-xs">
            商品本体、SKU、Shop公開状態を1画面で保存します。Ctrl/Command + Enterで保存できます。
          </SheetDescription>
        </SheetHeader>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
              event.preventDefault();
              void form.handleSubmit(onSubmit)();
            }
          }}
        >
          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-4 p-4">
              {loadingDetail ? (
                <div className="flex h-48 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-sm text-neutral-600">
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  読み込み中
                </div>
              ) : (
                <>
                  <section className="rounded-md border border-neutral-200 bg-white">
                    <div className="border-b px-3 py-2">
                      <h3 className="text-sm font-semibold">基本情報</h3>
                      <p className="text-xs text-neutral-500">商品名とJANを入力すると、SKU行にも流用しやすくなります。</p>
                    </div>
                    <div className="grid gap-3 p-3 md:grid-cols-2">
                      <Field label="商品名" error={form.formState.errors.productName?.message} required>
                        <Input autoFocus className="h-9" placeholder="例: 軽量ステンレスボトル 500ml" {...form.register("productName")} />
                      </Field>
                      <Field label="JANコード" error={form.formState.errors.janCode?.message}>
                        <Input className="h-9" inputMode="numeric" placeholder="8〜14桁" {...form.register("janCode")} />
                      </Field>
                      <Field label="標準価格" error={form.formState.errors.standardPrice?.message} required>
                        <Input className="h-9" type="number" min={0} step={1} {...form.register("standardPrice", { valueAsNumber: true })} />
                      </Field>
                      <Field label="状態" error={form.formState.errors.status?.message}>
                        <Controller
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">有効</SelectItem>
                                <SelectItem value="draft">下書き</SelectItem>
                                <SelectItem value="paused">停止中</SelectItem>
                                <SelectItem value="discontinued">終売</SelectItem>
                                <SelectItem value="archived">アーカイブ</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </Field>
                      <Field label="単位" error={form.formState.errors.unit?.message}>
                        <Input className="h-9" placeholder="個" {...form.register("unit")} />
                      </Field>
                      <Field label="Shop名" error={form.formState.errors.shopName?.message}>
                        <Input className="h-9" placeholder="AIBOUX STORE" {...form.register("shopName")} />
                      </Field>
                      <div className="md:col-span-2">
                        <Field label="説明" error={form.formState.errors.description?.message}>
                          <Textarea className="min-h-20 resize-none" placeholder="販売・社内確認に使う説明を入力" {...form.register("description")} />
                        </Field>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-md border border-neutral-200 bg-white">
                    <div className="flex flex-col gap-2 border-b px-3 py-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">SKU・在庫・Shop公開</h3>
                        <p className="text-xs text-neutral-500">Excelのように行を増やして、バリエーションごとの在庫と公開状態を登録します。</p>
                      </div>
                      <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5 self-start" onClick={addSkuRow}>
                        <Plus className="size-3.5" />
                        SKU行を追加
                      </Button>
                    </div>

                    <div className="overflow-x-auto p-3">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[150px]">SKUコード</TableHead>
                            <TableHead className="w-[170px]">バリエーション</TableHead>
                            <TableHead className="w-[140px]">JAN</TableHead>
                            <TableHead className="w-[110px] text-right">初期在庫</TableHead>
                            <TableHead className="w-[120px] text-right">販売価格</TableHead>
                            <TableHead className="w-[100px] text-center">Shop公開</TableHead>
                            <TableHead className="w-[48px]" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fields.map((field, index) => {
                            const errors = form.formState.errors.skus?.[index];
                            return (
                              <TableRow key={field.id} className="align-top">
                                <TableCell>
                                  <Input className="h-8" placeholder="SKU-001" {...form.register(`skus.${index}.skuCode`)} />
                                  <InlineError message={errors?.skuCode?.message} />
                                </TableCell>
                                <TableCell>
                                  <Input className="h-8" placeholder="標準 / ブラック / M" {...form.register(`skus.${index}.variantName`)} />
                                  <InlineError message={errors?.variantName?.message} />
                                </TableCell>
                                <TableCell>
                                  <Input className="h-8" inputMode="numeric" placeholder="任意" {...form.register(`skus.${index}.janCode`)} />
                                  <InlineError message={errors?.janCode?.message} />
                                </TableCell>
                                <TableCell>
                                  <Input className="h-8 text-right" type="number" min={0} step={1} {...form.register(`skus.${index}.stockQuantity`, { valueAsNumber: true })} />
                                  <InlineError message={errors?.stockQuantity?.message} />
                                </TableCell>
                                <TableCell>
                                  <Input className="h-8 text-right" type="number" min={0} step={1} {...form.register(`skus.${index}.salePrice`, { valueAsNumber: true })} />
                                  <InlineError message={errors?.salePrice?.message} />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Controller
                                    control={form.control}
                                    name={`skus.${index}.shopPublishEnabled`}
                                    render={({ field: checkboxField }) => (
                                      <Checkbox
                                        checked={checkboxField.value}
                                        onCheckedChange={(checked) => checkboxField.onChange(checked === true)}
                                        aria-label={`${index + 1}行目のShop公開`}
                                      />
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    className="text-neutral-500 hover:text-red-600"
                                    disabled={fields.length <= 1}
                                    onClick={() => remove(index)}
                                    aria-label={`${index + 1}行目を削除`}
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                      <InlineError message={form.formState.errors.skus?.message} />
                    </div>
                  </section>

                  <section className="grid gap-3 md:grid-cols-[1fr_220px]">
                    <div className="rounded-md border border-neutral-200 bg-white p-3">
                      <Field label="メモ" error={form.formState.errors.memo?.message}>
                        <Textarea className="min-h-20 resize-none" placeholder="社内向けの注意事項" {...form.register("memo")} />
                      </Field>
                    </div>
                    <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
                      <div className="text-xs text-neutral-500">保存プレビュー</div>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex justify-between gap-2">
                          <span>商品名</span>
                          <span className="truncate font-medium">{productName || "未入力"}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span>SKU数</span>
                          <span className="font-medium">{fields.length}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span>総在庫</span>
                          <span className="font-medium">{totalStock.toLocaleString("ja-JP")}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span>標準価格</span>
                          <span className="font-medium">¥{Number(standardPrice || 0).toLocaleString("ja-JP")}</span>
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          </ScrollArea>

          <SheetFooter className="border-t bg-white px-4 py-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>
                キャンセル
              </Button>
              <Button type="submit" className="gap-1.5" disabled={saving || loadingDetail}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                マスタを保存
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-neutral-700">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>
      {children}
      <InlineError message={error} />
    </label>
  );
}

function InlineError({ message }: { message?: string }) {
  return <div className={cn("min-h-4 text-[11px] leading-4 text-red-600", !message && "invisible")}>{message || "OK"}</div>;
}
