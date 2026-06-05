"use client";

import * as React from "react";
import { AlertTriangle, CircleDollarSign, GripVertical, ImagePlus, Loader2, Save, Star, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createEmptyProduct, formatYen, shopProducts, type ShopProduct, type ShopSubscriptionPlan } from "@/data/shop-sample-data";

type ProductImage = {
  id: string;
  url: string;
  alt: string;
  isMain: boolean;
  key?: string;
};

export function ProductEditor({ product = shopProducts[0] ?? createEmptyProduct(), mode = "edit" }: { product?: ShopProduct; mode?: "new" | "edit" }) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [images, setImages] = React.useState<ProductImage[]>(() => [
    ...(product.image ? [
      { id: `${product.id}-main`, url: product.image, alt: product.name, isMain: true },
      { id: `${product.id}-detail-1`, url: product.image, alt: `${product.name} 詳細`, isMain: false },
    ] : []),
  ]);
  const [name, setName] = React.useState(mode === "new" ? "" : product.name);
  const [description, setDescription] = React.useState("素材、サイズ、利用シーン、購入前に知りたい注意点を簡潔に入力します。");
  const [sku, setSku] = React.useState(product.sku);
  const [category, setCategory] = React.useState(product.category);
  const [price, setPrice] = React.useState(String(product.price));
  const [cost, setCost] = React.useState("2200");
  const [shipping, setShipping] = React.useState("660");
  const [stock, setStock] = React.useState(String(product.stock));
  const [googleCategoryId, setGoogleCategoryId] = React.useState("1604");
  const [tags, setTags] = React.useState(product.tags.join(", "));
  const [isDirty, setIsDirty] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [status, setStatus] = React.useState<ShopProduct["status"]>(product.status);
  const [subscriptionPlans, setSubscriptionPlans] = React.useState<ShopSubscriptionPlan[]>(() => initialSubscriptionPlans(product));

  React.useEffect(() => {
    setImages([
      ...(product.image ? [
        { id: `${product.id}-main`, url: product.image, alt: product.name, isMain: true },
        { id: `${product.id}-detail-1`, url: product.image, alt: `${product.name} 詳細`, isMain: false },
      ] : []),
    ]);
    setName(mode === "new" ? "" : product.name);
    setSku(product.sku);
    setCategory(product.category);
    setPrice(String(product.price));
    setStock(String(product.stock));
    setTags(product.tags.join(", "));
    setStatus(product.status);
    setSubscriptionPlans(initialSubscriptionPlans(product));
    setIsDirty(false);
  }, [mode, product]);

  React.useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const markDirty = () => setIsDirty(true);

  const saveProduct = async () => {
    if (!name.trim()) {
      toast.error("商品名を入力してください");
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch("/shop/api/products/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          janCode: buildStableJan(product.id, sku),
          title: name,
          description,
          keywords: tags,
          googleShoppingCategory: googleCategoryId,
          categoryId: category,
          salePrice: toPositiveNumber(price),
          costPrice: toPositiveNumber(cost),
          shippingCost: toPositiveNumber(shipping),
          platformFeeRate: 0,
          stripeFeeRate: 3.6,
          imageR2Keys: images.map((image) => image.key).filter(Boolean),
          aiAltTexts: images.map((image) => image.alt).filter(Boolean),
          publishState: status === "公開中" ? "published" : "draft",
          subscriptionPlans,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (!response.ok || !result.success) {
        throw new Error(result.error || "商品を保存できませんでした");
      }
      setIsDirty(false);
      window.dispatchEvent(new CustomEvent("aiboux:shop-products-changed"));
      toast.success("商品を保存し、公開ストアへの反映を更新しました");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "商品を保存できませんでした");
    } finally {
      setIsSaving(false);
    }
  };

  const uploadImages = async (files: FileList | File[]) => {
    const uploadFiles = Array.from(files).filter((file) => file.type.startsWith("image/")).slice(0, 8);
    if (!uploadFiles.length) {
      toast.error("画像ファイルを選択してください");
      return;
    }
    setIsUploadingImage(true);
    try {
      const uploaded: ProductImage[] = [];
      for (const [index, file] of uploadFiles.entries()) {
        const form = new FormData();
        form.append("file", file);
        form.append("purpose", "product");
        form.append("productTitle", name || product.name);
        form.append("altText", `${name || product.name} 商品画像`);
        form.append("keywords", tags);
        const response = await fetch("/shop/api/upload", { method: "POST", body: form });
        const result = (await response.json().catch(() => ({}))) as { success?: boolean; key?: string; url?: string; error?: string };
        if (!response.ok || !result.success || !result.key || !result.url) {
          throw new Error(result.error || "画像を保存できませんでした");
        }
        uploaded.push({
          id: result.key,
          key: result.key,
          url: result.url,
          alt: `${name || product.name} 商品画像 ${index + 1}`,
          isMain: images.length === 0 && uploaded.length === 0,
        });
      }
      setImages((current) => [...current, ...uploaded]);
      setIsDirty(true);
      toast.success(`${uploaded.length}件の画像を保存しました`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "画像を保存できませんでした");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void uploadImages(event.dataTransfer.files);
  };

  const setMainImage = (imageId: string) => {
    setImages((current) => current.map((image) => ({ ...image, isMain: image.id === imageId })));
    setIsDirty(true);
  };

  const removeImage = (imageId: string) => {
    setImages((current) => {
      const nextImages = current.filter((image) => image.id !== imageId);
      if (!nextImages.some((image) => image.isMain) && nextImages[0]) nextImages[0] = { ...nextImages[0], isMain: true };
      return nextImages;
    });
    setIsDirty(true);
  };

  const mainImageReady = images.some((image) => image.isMain);
  const seoReady = product.name.length > 0 && product.tags.length > 0;
  const estimatedCost = 2200;
  const estimatedShipping = 660;
  const estimatedFee = Math.round(product.price * 0.036);
  const estimatedProfit = product.price - estimatedCost - estimatedShipping - estimatedFee;

  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-neutral-950">{mode === "new" ? "商品を追加" : "商品編集"}</h1>
            {isDirty ? <Badge variant="outline" className="rounded-md border-amber-200 bg-amber-50 text-amber-700">未保存</Badge> : null}
          </div>
          <p className="mt-1 text-sm text-neutral-500">販売に必要な情報だけを、公開判断しやすい順番で管理します。</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <a href="/s/aiboux/admin/products">商品一覧へ戻る</a>
          </Button>
          <Button className="gap-2" onClick={saveProduct} disabled={isSaving}>
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {isSaving ? "保存中..." : "保存"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="h-8">
          <TabsTrigger value="summary" className="text-xs">販売情報</TabsTrigger>
          <TabsTrigger value="media" className="text-xs">画像</TabsTrigger>
          <TabsTrigger value="pricing" className="text-xs">価格・在庫</TabsTrigger>
          <TabsTrigger value="subscription" className="text-xs">定期購入</TabsTrigger>
          <TabsTrigger value="seo" className="text-xs">公開・検索</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-3 grid gap-3 xl:grid-cols-[1fr_340px]">
          <Card className="shadow-none">
            <CardHeader className="border-b border-neutral-200 px-4 py-3"><CardTitle className="text-sm">商品概要</CardTitle></CardHeader>
            <CardContent className="space-y-3 px-4 py-4">
              <Field label="商品名" help="購入者に表示される名前です。色やサイズより、商品の特徴が先に伝わる名前にします。">
                <Input value={name} placeholder="例: オーガニックコットンTシャツ" onChange={(event) => { setName(event.target.value); markDirty(); }} />
              </Field>
              <Field label="商品説明" help="素材、サイズ、使い方、購入前に知りたい注意点を短くまとめます。">
                <Textarea
                  value={description}
                  className="min-h-36"
                  onChange={(event) => { setDescription(event.target.value); markDirty(); }}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="商品番号" help="店内で商品を探すための管理番号です。購入者には目立って表示しません。">
                  <Input value={sku} placeholder="例: SKU-001" onChange={(event) => { setSku(event.target.value); markDirty(); }} />
                </Field>
                <Field label="カテゴリ" help="商品一覧や検索で使う店内カテゴリです。">
                  <Select value={category} onValueChange={(value) => { setCategory(value); markDirty(); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="アパレル">アパレル</SelectItem>
                      <SelectItem value="バッグ">バッグ</SelectItem>
                      <SelectItem value="生活雑貨">生活雑貨</SelectItem>
                      <SelectItem value="帽子">帽子</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="販売状態" help="販売する=購入可能、下書き=公開前、販売停止=購入者に表示しません。保存後に反映します。">
                  <div className="grid grid-cols-3 gap-1 rounded-md border border-neutral-200 bg-neutral-50 p-1">
                    {[
                      ["公開中", "販売する"],
                      ["下書き", "下書き"],
                      ["非公開", "販売停止"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        className={cn(
                          "h-8 rounded px-2 text-xs font-medium transition",
                          status === value ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-500 hover:bg-white/70 hover:text-neutral-900",
                        )}
                        onClick={() => {
                          setStatus(value as ShopProduct["status"]);
                          markDirty();
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="border-b border-neutral-200 px-4 py-3"><CardTitle className="text-sm">公開品質チェック</CardTitle></CardHeader>
            <CardContent className="space-y-2 px-4 py-4 text-xs text-neutral-600">
              <QualityRow label="商品名と説明" ready={product.name.length > 0} />
              <QualityRow label="メイン画像" ready={mainImageReady} />
              <QualityRow label="価格と在庫" ready={product.price > 0 && product.stock >= 0} />
              <QualityRow label="SEO・タグ" ready={seoReady} />
              <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
                <div className="flex items-center gap-2 font-medium">
                  <AlertTriangle className="size-4" />
                  公開前確認
                </div>
                <p className="mt-1 leading-5">販売する前に、価格・画像・検索用のカテゴリを確認してください。未確認の項目がある場合は下書きで保存します。</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-3 grid gap-3 xl:grid-cols-[360px_1fr]">
          <Card className="shadow-none">
            <CardHeader className="border-b border-neutral-200 px-4 py-3"><CardTitle className="text-sm">画像追加</CardTitle></CardHeader>
            <CardContent className="space-y-3 px-4 py-4">
              <div
                className={cn(
                  "flex min-h-52 items-center justify-center rounded-lg border border-dashed bg-neutral-50 transition",
                  isDragging ? "border-blue-300 bg-blue-50" : "border-neutral-300",
                )}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
              >
                <div className="text-center text-sm text-neutral-500">
                  <UploadCloud className="mx-auto mb-2 size-6" />
                  {isUploadingImage ? "画像を保存中..." : "画像をドラッグ＆ドロップ"}
                  <div className="mt-1 text-xs">推奨: 正方形 / JPGまたはPNG / 1枚以上</div>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={(event) => {
                  if (event.target.files) void uploadImages(event.target.files);
                  event.currentTarget.value = "";
                }}
              />
              <Button variant="outline" className="w-full gap-2" onClick={() => fileInputRef.current?.click()} disabled={isUploadingImage}>
                {isUploadingImage ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
                画像を選択して保存
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="border-b border-neutral-200 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-sm">画像一覧</CardTitle>
                <Badge variant="secondary" className="rounded-md">{images.length}枚</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
              {images.map((image, index) => (
                <div key={image.id} className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
                  <div className="relative aspect-square bg-neutral-50">
                    <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-[11px] shadow-sm">
                      <GripVertical className="size-3.5 text-neutral-400" />
                      {index + 1}
                    </div>
                    {image.isMain ? <Badge className="absolute right-2 top-2 rounded-md">メイン</Badge> : null}
                  </div>
                  <div className="space-y-2 p-2">
                    <Field label="画像の説明文" help="検索や読み上げで使われます。商品名、色、特徴を短く入れます。">
                      <Input value={image.alt} onChange={(event) => {
                        const nextAlt = event.target.value;
                        setImages((current) => current.map((item) => item.id === image.id ? { ...item, alt: nextAlt } : item));
                        setIsDirty(true);
                      }} />
                    </Field>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setMainImage(image.id)} disabled={image.isMain}>
                        <Star className="size-3.5" />
                        メイン
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 gap-1.5 text-red-600" onClick={() => removeImage(image.id)}>
                        <Trash2 className="size-3.5" />
                        削除
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-3 grid gap-3 xl:grid-cols-[1fr_340px]">
          <Card className="shadow-none">
            <CardHeader className="border-b border-neutral-200 px-4 py-3"><CardTitle className="text-sm">価格・在庫</CardTitle></CardHeader>
            <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
              <Field label="販売価格" help="購入者が支払う税込価格です。公開前に必ず確認します。">
                <Input value={price} placeholder="販売価格" inputMode="numeric" onChange={(event) => { setPrice(event.target.value); markDirty(); }} />
              </Field>
              <Field label="仕入原価" help="利益計算用の内部メモです。購入者には表示されません。">
                <Input value={cost} placeholder="仕入原価" inputMode="numeric" onChange={(event) => { setCost(event.target.value); markDirty(); }} />
              </Field>
              <Field label="想定送料" help="1件の注文で見込む送料です。利益計算に使います。">
                <Input value={shipping} placeholder="想定送料" inputMode="numeric" onChange={(event) => { setShipping(event.target.value); markDirty(); }} />
              </Field>
              <Field label="現在庫" help="今すぐ販売できる数量です。">
                <Input value={stock} placeholder="現在庫" inputMode="numeric" onChange={(event) => { setStock(event.target.value); markDirty(); }} />
              </Field>
              <Field label="受注中数量" help="注文済みで、まだ発送していない数量です。">
                <Input defaultValue={String(product.reserved)} placeholder="受注中数量" inputMode="numeric" onChange={markDirty} />
              </Field>
              <Field label="決済手数料率" help="カード決済などで差し引かれる目安です。通常は初期値のままで問題ありません。">
                <Input defaultValue="3.6" placeholder="決済手数料率(%)" inputMode="decimal" onChange={markDirty} />
              </Field>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader className="border-b border-neutral-200 px-4 py-3"><CardTitle className="text-sm">粗利目安</CardTitle></CardHeader>
            <CardContent className="space-y-2 px-4 py-4 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">販売価格</span><strong>{formatYen(product.price)}</strong></div>
              <div className="flex justify-between"><span className="text-neutral-500">仕入と送料</span><strong>{formatYen(estimatedCost + estimatedShipping)}</strong></div>
              <div className="flex justify-between"><span className="text-neutral-500">決済手数料目安</span><strong>{formatYen(estimatedFee)}</strong></div>
              <div className="flex justify-between"><span className="text-neutral-500">手元に残る目安</span><strong>{formatYen(estimatedProfit)}</strong></div>
              <div className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">ここは内部確認用です。購入者には表示されません。</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="mt-3 grid gap-3 xl:grid-cols-[1fr_340px]">
          <Card className="shadow-none">
            <CardHeader className="border-b border-neutral-200 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-sm">定期購入プラン</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5"
                  onClick={() => {
                    setSubscriptionPlans((current) => [...current, createSubscriptionPlan(product.id, current.length, toPositiveNumber(price))]);
                    markDirty();
                  }}
                >
                  <CircleDollarSign className="size-3.5" />
                  プラン追加
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {subscriptionPlans.length === 0 ? (
                <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-4 py-10 text-center text-sm text-neutral-600">
                  定期購入プランは未設定です。プランを追加すると商品詳細、カート、checkoutに反映します。
                </div>
              ) : subscriptionPlans.map((plan, index) => (
                <div key={plan.id} className="rounded-lg border border-neutral-200 bg-white p-3" data-testid="subscription-plan-editor">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-neutral-950">プラン {index + 1}</div>
                      <div className="text-xs text-neutral-500">{subscriptionIntervalLabel(plan.intervalUnit, plan.intervalCount)} / {formatYen(plan.price)}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-red-600"
                      onClick={() => {
                        setSubscriptionPlans((current) => current.filter((item) => item.id !== plan.id));
                        markDirty();
                      }}
                    >
                      削除
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Field label="プラン名" help="購入ボックスとカートで表示します。">
                      <Input value={plan.name} onChange={(event) => updateSubscriptionPlan(setSubscriptionPlans, plan.id, { name: event.target.value }, markDirty)} />
                    </Field>
                    <Field label="頻度単位" help="毎週、毎月などの基本単位です。">
                      <Select value={plan.intervalUnit} onValueChange={(value) => updateSubscriptionPlan(setSubscriptionPlans, plan.id, { intervalUnit: value as ShopSubscriptionPlan["intervalUnit"] }, markDirty)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">週</SelectItem>
                          <SelectItem value="month">月</SelectItem>
                          <SelectItem value="day">日</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="間隔" help="2か月ごと、3週間ごとなどの数字です。">
                      <Input value={String(plan.intervalCount)} inputMode="numeric" onChange={(event) => updateSubscriptionPlan(setSubscriptionPlans, plan.id, { intervalCount: toPositiveNumber(event.target.value) || 1 }, markDirty)} />
                    </Field>
                    <Field label="定期価格" help="初回以降の1回あたり税込価格です。">
                      <Input value={String(plan.price)} inputMode="numeric" onChange={(event) => updateSubscriptionPlan(setSubscriptionPlans, plan.id, { price: toPositiveNumber(event.target.value) }, markDirty)} />
                    </Field>
                    <Field label="割引率" help="通常価格からの割引表示です。">
                      <Input value={String(plan.discountRate)} inputMode="decimal" onChange={(event) => updateSubscriptionPlan(setSubscriptionPlans, plan.id, { discountRate: Number(event.target.value) || 0 }, markDirty)} />
                    </Field>
                    <Field label="最低継続回数" help="0なら最低継続なしです。">
                      <Input value={String(plan.minimumCycles)} inputMode="numeric" onChange={(event) => updateSubscriptionPlan(setSubscriptionPlans, plan.id, { minimumCycles: toPositiveNumber(event.target.value) }, markDirty)} />
                    </Field>
                  </div>
                  <div className="mt-3 grid gap-2 md:grid-cols-4">
                    <label className="flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-xs font-medium">
                      <Checkbox checked={plan.status === "active"} onCheckedChange={(checked) => updateSubscriptionPlan(setSubscriptionPlans, plan.id, { status: checked ? "active" : "hidden" }, markDirty)} />
                      公開
                    </label>
                    <label className="flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-xs font-medium">
                      <Checkbox checked={plan.canSkip} onCheckedChange={(checked) => updateSubscriptionPlan(setSubscriptionPlans, plan.id, { canSkip: Boolean(checked) }, markDirty)} />
                      スキップ可
                    </label>
                    <label className="flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-xs font-medium">
                      <Checkbox checked={plan.canPause} onCheckedChange={(checked) => updateSubscriptionPlan(setSubscriptionPlans, plan.id, { canPause: Boolean(checked) }, markDirty)} />
                      一時停止可
                    </label>
                    <label className="flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-xs font-medium">
                      <Checkbox checked={plan.canCancel} onCheckedChange={(checked) => updateSubscriptionPlan(setSubscriptionPlans, plan.id, { canCancel: Boolean(checked) }, markDirty)} />
                      解約可
                    </label>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <Field label="注意文" help="商品詳細とcheckoutに表示します。">
                      <Textarea value={plan.noticeText} onChange={(event) => updateSubscriptionPlan(setSubscriptionPlans, plan.id, { noticeText: event.target.value }, markDirty)} />
                    </Field>
                    <Field label="解約ポリシー" help="解約可能タイミングを明示します。">
                      <Textarea value={plan.cancellationPolicy} onChange={(event) => updateSubscriptionPlan(setSubscriptionPlans, plan.id, { cancellationPolicy: event.target.value }, markDirty)} />
                    </Field>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader className="border-b border-neutral-200 px-4 py-3"><CardTitle className="text-sm">公開反映</CardTitle></CardHeader>
            <CardContent className="space-y-2 px-4 py-4 text-xs text-neutral-600">
              <QualityRow label="定期購入プラン" ready={subscriptionPlans.some((plan) => plan.status === "active" && plan.price > 0)} />
              <QualityRow label="商品詳細への表示" ready={status === "公開中" && subscriptionPlans.some((plan) => plan.status === "active")} />
              <QualityRow label="checkoutの正直なブロック" ready />
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
                支払い方法の確認が必要な場合は、購入者に受付前であることを明確に表示します。
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="mt-3 grid gap-3 xl:grid-cols-[1fr_340px]">
          <Card className="shadow-none">
            <CardHeader className="border-b border-neutral-200 px-4 py-3"><CardTitle className="text-sm">SEO・モール連携</CardTitle></CardHeader>
            <CardContent className="space-y-3 p-4">
              <Field label="検索用タイトル" help="Googleなどの検索結果に出す短い商品名です。商品名と同じでも構いません。">
                <Input placeholder="検索用タイトル" value={`${name || product.name} | AIBOUX STORE`} readOnly />
              </Field>
              <Field label="検索用説明文" help="検索結果やモール連携で使う短い説明です。購入者が知りたい特徴を120文字前後で書きます。">
                <Textarea placeholder="検索用説明文" value={`${name || product.name}の特徴、素材、配送情報を簡潔に説明します。`} readOnly />
              </Field>
              <Field label="GoogleカテゴリID" help="Googleショッピング連携で使う数字です。分からない場合はカテゴリ管理画面の候補検索を使います。">
                <Input placeholder="例: 1604" value={googleCategoryId} onChange={(event) => { setGoogleCategoryId(event.target.value); markDirty(); }} />
              </Field>
              <Field label="検索タグ" help="店内検索で見つけやすくする言葉です。カンマ区切りで入力します。">
                <Input placeholder="タグ" value={tags} onChange={(event) => { setTags(event.target.value); markDirty(); }} />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox defaultChecked onCheckedChange={markDirty} />
                公開ストアと外部モール連携の対象にする
              </label>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader className="border-b border-neutral-200 px-4 py-3"><CardTitle className="text-sm">配送属性</CardTitle></CardHeader>
            <CardContent className="grid gap-3 p-4">
              <Input placeholder="重量(g)" defaultValue="340" onChange={markDirty} />
              <Input placeholder="配送サイズ" defaultValue="60" onChange={markDirty} />
              <Input placeholder="発送元" defaultValue="東京倉庫" onChange={markDirty} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function QualityRow({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-neutral-200 px-2 py-1.5">
      {label}
      <Badge variant={ready ? "secondary" : "outline"} className={cn("rounded-md", !ready && "border-amber-200 bg-amber-50 text-amber-700")}>
        {ready ? "OK" : "確認"}
      </Badge>
    </div>
  );
}

function toPositiveNumber(value: string): number {
  const number = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(number) ? Math.max(Math.trunc(number), 0) : 0;
}

function buildStableJan(productId: string, sku: string): string {
  const source = `${productId}:${sku}`;
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
  }
  return String(10_000_000 + (hash % 89_999_999)).slice(0, 8);
}

function initialSubscriptionPlans(product: ShopProduct): ShopSubscriptionPlan[] {
  if (product.subscriptionPlans?.length) return product.subscriptionPlans;
  return [];
}

function createSubscriptionPlan(productId: string, index: number, basePrice: number): ShopSubscriptionPlan {
  const price = basePrice > 0 ? Math.max(Math.round(basePrice * 0.9), 0) : 0;
  return {
    id: `subplan_${productId}_${Date.now()}_${index + 1}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
    name: "毎月お届け",
    intervalUnit: "month",
    intervalCount: 1,
    price,
    discountRate: 10,
    firstOrderPrice: null,
    minimumCycles: 0,
    canSkip: true,
    canPause: true,
    canCancel: true,
    status: "active",
    noticeText: "定期購入は次回配送前にスキップ・一時停止・解約を確認できます。",
    cancellationPolicy: "最低継続回数がない場合、次回決済前まで解約できます。",
  };
}

function updateSubscriptionPlan(
  setPlans: React.Dispatch<React.SetStateAction<ShopSubscriptionPlan[]>>,
  planId: string,
  patch: Partial<ShopSubscriptionPlan>,
  markDirty: () => void,
) {
  setPlans((current) => current.map((plan) => plan.id === planId ? { ...plan, ...patch } : plan));
  markDirty();
}

function subscriptionIntervalLabel(unit: ShopSubscriptionPlan["intervalUnit"], count: number): string {
  const safeCount = Math.max(Math.trunc(Number(count) || 1), 1);
  if (unit === "week") return safeCount === 1 ? "毎週" : `${safeCount}週間ごと`;
  if (unit === "day") return `${safeCount}日ごと`;
  return safeCount === 1 ? "毎月" : `${safeCount}か月ごと`;
}

function Field({ label, help, children }: { label: string; help: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-neutral-700">{label}</span>
      {children}
      <span className="block text-[11px] leading-4 text-neutral-500">{help}</span>
    </label>
  );
}
