"use client";

import * as React from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Loader2,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type AiGenerateResponse = {
  success: boolean;
  product?: {
    title: string;
    description: string;
    keywords: string[];
    categoryId: string;
    googleShoppingCategory: string;
  };
  error?: string;
};

type ProcessImageResponse = {
  success: boolean;
  processedImageKey?: string;
  altText?: string;
  error?: string;
};

type UploadResponse = {
  success: boolean;
  key?: string;
  url?: string;
  originalName?: string;
  seo?: {
    optimized: boolean;
    fileName: string;
    deliveryFormat: string;
    minWidth: number;
    minHeight: number;
    dimensions: { width: number; height: number } | null;
    meetsRecommendedSize: boolean | null;
    message: string;
  };
  error?: string;
};

type SaveResponse = {
  success: boolean;
  productId?: string;
  publishState?: "draft" | "published";
  grossProfit?: number;
  grossMarginRate?: number;
  netProfit?: number;
  netMarginRate?: number;
  feedSync?: {
    queued?: boolean;
  };
  error?: string;
};

const steps = [
  { id: 1, label: "JAN/画像" },
  { id: 2, label: "価格" },
  { id: 3, label: "公開" },
];

export function ShopProductWizard({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = React.useState(1);
  const [janCode, setJanCode] = React.useState("4901234567894");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [keywords, setKeywords] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [googleShoppingCategory, setGoogleShoppingCategory] = React.useState("");
  const [costPrice, setCostPrice] = React.useState("1200");
  const [salePrice, setSalePrice] = React.useState("2980");
  const [shippingCost, setShippingCost] = React.useState("450");
  const [stripeFeeRate, setStripeFeeRate] = React.useState("3.6");
  const [platformFeeRate, setPlatformFeeRate] = React.useState("8");
  const [imageName, setImageName] = React.useState("");
  const [imageKey, setImageKey] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageSeoMessage, setImageSeoMessage] = React.useState("");
  const [imageSeoFileName, setImageSeoFileName] = React.useState("");
  const [processedImageKey, setProcessedImageKey] = React.useState("");
  const [aiAltText, setAiAltText] = React.useState("");
  const [aiLoading, setAiLoading] = React.useState(false);
  const [imageUploading, setImageUploading] = React.useState(false);
  const [imageProcessing, setImageProcessing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [publishedProductId, setPublishedProductId] = React.useState("");

  const cost = toNumber(costPrice);
  const price = toNumber(salePrice);
  const shipping = toNumber(shippingCost);
  const stripeRate = toNumber(stripeFeeRate);
  const platformRate = toNumber(platformFeeRate);
  const stripeFee = Math.round(price * (stripeRate / 100));
  const platformFee = Math.round(price * (platformRate / 100));
  const grossProfit = price - cost - shipping;
  const grossMargin = price > 0 ? (grossProfit / price) * 100 : 0;
  const netProfit = grossProfit - stripeFee - platformFee;
  const netMargin = price > 0 ? (netProfit / price) * 100 : 0;
  const profitTone = netProfit < 0 ? "danger" : netMargin < 10 ? "warning" : "neutral";
  const progress = (step / steps.length) * 100;

  async function generateWithAi() {
    const normalizedJan = janCode.replace(/\D/g, "");
    setJanCode(normalizedJan);
    if (normalizedJan.length < 8 || normalizedJan.length > 14) {
      toast.error("JANコードは8〜14桁で入力してください");
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch(`/shop/api/products/ai-generate?jan=${encodeURIComponent(normalizedJan)}`);
      const data = (await response.json()) as AiGenerateResponse;
      if (!response.ok || !data.success || !data.product) {
        toast.error(data.error ?? "AI生成に失敗しました");
        return;
      }
      setTitle(data.product.title);
      setDescription(data.product.description);
      setKeywords(data.product.keywords.join(", "));
      setCategoryId(data.product.categoryId);
      setGoogleShoppingCategory(data.product.googleShoppingCategory);
      toast.success("AIが商品情報を補完しました");
    } catch {
      toast.error("AI生成APIに接続できませんでした");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setImageName(file.name);
    setImageUploading(true);
    setImageSeoMessage("");
    setImageSeoFileName("");
    setProcessedImageKey("");
    setAiAltText("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("purpose", "product");
      form.append("productTitle", title);
      form.append("altText", aiAltText);
      form.append("keywords", keywords);
      const response = await fetch("/shop/api/upload", {
        method: "POST",
        body: form,
      });
      const data = (await response.json()) as UploadResponse;
      if (!response.ok || !data.success || !data.key) {
        toast.error(formatUploadError(data.error));
        setImageName("");
        return;
      }
      setImageKey(data.key);
      setImageUrl(data.url ?? "");
      setImageSeoMessage(data.seo?.message ?? "");
      setImageSeoFileName(data.seo?.fileName ?? "");
      toast.success(data.seo?.message ?? "商品画像を追加しました");
    } catch {
      toast.error("画像を保存できませんでした。通信状態を確認してもう一度お試しください。");
      setImageName("");
    } finally {
      setImageUploading(false);
    }
  }

  async function processImage() {
    if (!imageName || !imageKey) {
      toast.error("先に商品画像を追加してください");
      return;
    }

    setImageProcessing(true);
    try {
      const response = await fetch("/shop/api/products/process-image", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageName, imageKey, productTitle: title }),
      });
      const data = (await response.json()) as ProcessImageResponse;
      if (!response.ok || !data.success || !data.processedImageKey || !data.altText) {
        toast.error(data.error ?? "画像AI処理に失敗しました");
        return;
      }
      setProcessedImageKey(data.processedImageKey);
      setAiAltText(data.altText);
      toast.success("白背景化とaltテキスト生成が完了しました");
    } catch {
      toast.error("画像AI処理APIに接続できませんでした");
    } finally {
      setImageProcessing(false);
    }
  }

  async function saveProduct(publishState: "draft" | "published") {
    if (!title.trim()) {
      toast.error("商品タイトルを入力してください");
      setStep(1);
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/shop/api/products/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          janCode,
          title,
          description,
          keywords: keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean),
          categoryId,
          googleShoppingCategory,
          costPrice: cost,
          salePrice: price,
          shippingCost: shipping,
          stripeFeeRate: stripeRate,
          platformFeeRate: platformRate,
          imageR2Keys: [processedImageKey || imageKey].filter(Boolean),
          aiAltTexts: [aiAltText].filter(Boolean),
          publishState,
          shopName: "AIBOUX STORE",
        }),
      });
      const data = (await response.json()) as SaveResponse;
      if (!response.ok || !data.success) {
        toast.error(data.error ?? "商品を保存できませんでした");
        return;
      }

      if (publishState === "published") {
        setPublishedProductId(data.productId ?? "published-product");
        window.dispatchEvent(new CustomEvent("aiboux:shop-products-changed"));
        toast.success("商品を公開しました");
        if (data.feedSync?.queued) {
          toast.info("Google/Bingへの送信を開始しました。反映まで数分かかる場合があります。");
        }
        return;
      }

      toast.success("下書き保存しました");
      window.dispatchEvent(new CustomEvent("aiboux:shop-products-changed"));
      if (data.feedSync?.queued) {
        toast.info("商品情報の自動送信準備を記録しました。公開後に送信状態を確認できます。");
      }
      onComplete?.();
    } catch {
      toast.error("商品保存APIに接続できませんでした");
    } finally {
      setSaving(false);
    }
  }

  if (publishedProductId) {
    return (
      <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
        <Card className="border-neutral-200 bg-white shadow-none">
          <CardHeader className="border-b border-neutral-200 px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50">
                <CheckCircle2 className="size-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-base">商品が公開されました。次は何をしますか？</CardTitle>
                <p className="mt-1 text-xs text-neutral-500">{title} の販売準備が完了しました。</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-4 py-4">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
              <div className="font-medium text-neutral-950">次に確認すること</div>
              <p className="mt-1 text-xs leading-5 text-neutral-600">
                Google/Bingへの商品同期は自動で開始済みです。SNS/LINE投稿は任意の拡張機能のため、必要な場合だけ設定画面で下書き作成をONにしてください。
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  window.history.pushState({ section: "settings" }, "", "/s/aiboux/admin/settings");
                  window.dispatchEvent(new PopStateEvent("popstate", { state: { section: "settings" } }));
                }}
              >
                任意のSNS/LINE設定を確認
              </Button>
              <Button variant="outline" onClick={onComplete}>商品一覧へ戻る</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">AI商品登録</h1>
        <p className="text-sm text-neutral-500">JAN、画像、価格を整えて、利益を確認してから公開します。</p>
      </div>

      <Card className="border-neutral-200 bg-white shadow-none">
        <CardHeader className="border-b border-neutral-200 px-4 py-3">
          <CardTitle className="text-sm">商品登録ウィザード</CardTitle>
          <div className="mt-3 space-y-2">
            <Progress value={progress} />
            <div className="grid grid-cols-3 gap-1 text-[11px] text-neutral-500">
              {steps.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStep(item.id)}
                  className={cn(
                    "rounded-md px-2 py-1 text-left transition hover:bg-neutral-50",
                    item.id === step && "bg-neutral-100 font-medium text-neutral-950",
                  )}
                >
                  {item.id}. {item.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-4 py-4">
          {step === 1 ? (
            <div className="grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3">
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <Input
                    value={janCode}
                    onChange={(event) => setJanCode(event.target.value.replace(/\D/g, "").slice(0, 14))}
                    inputMode="numeric"
                    placeholder="JANコード"
                  />
                  <Button className="gap-2" onClick={generateWithAi} disabled={aiLoading}>
                    {aiLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                    AIで商品情報を自動生成
                  </Button>
                </div>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="商品タイトル" />
                <Textarea value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-36" placeholder="SEO最適化済みの商品説明文" />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input value={keywords} onChange={(event) => setKeywords(event.target.value)} placeholder="検索キーワード（カンマ区切り）" />
                  <Input value={categoryId} onChange={(event) => setCategoryId(event.target.value)} placeholder="カテゴリID" />
                </div>
                <Input value={googleShoppingCategory} onChange={(event) => setGoogleShoppingCategory(event.target.value)} placeholder="Googleショッピング対応カテゴリ" />
                <ImageUploadBox
                  imageName={imageName}
                  imageKey={imageKey}
                  imageUrl={imageUrl}
                  imageSeoMessage={imageSeoMessage}
                  imageSeoFileName={imageSeoFileName}
                  processedImageKey={processedImageKey}
                  aiAltText={aiAltText}
                  uploading={imageUploading}
                  processing={imageProcessing}
                  onFiles={handleFiles}
                  onProcess={processImage}
                />
              </div>
              <SummaryPanel title="登録内容" rows={[`JAN: ${janCode || "-"}`, title || "商品タイトル未生成", categoryId || "カテゴリ未設定", imageKey ? "画像追加済み" : "画像未追加"]} />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <NumberField label="仕入原価" value={costPrice} onChange={setCostPrice} />
                <NumberField label="販売価格" value={salePrice} onChange={setSalePrice} />
                <NumberField label="想定送料" value={shippingCost} onChange={setShippingCost} />
                <NumberField label="決済手数料(%)" value={stripeFeeRate} onChange={setStripeFeeRate} decimal />
                <NumberField label="モール手数料(%)" value={platformFeeRate} onChange={setPlatformFeeRate} decimal />
              </div>
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <div className="text-sm font-semibold text-neutral-950">実利益シミュレーション</div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <MetricBadge label="粗利額" value={`¥${grossProfit.toLocaleString("ja-JP")}`} tone="neutral" />
                  <MetricBadge label="粗利率" value={`${grossMargin.toFixed(1)}%`} tone="neutral" />
                  <MetricBadge label="純利益" value={`¥${netProfit.toLocaleString("ja-JP")}`} tone={profitTone} />
                  <MetricBadge label="純利益率" value={`${netMargin.toFixed(1)}%`} tone={profitTone} />
                </div>
                <div className="mt-2 grid gap-1 text-[11px] text-neutral-500 sm:grid-cols-2">
                  <span>決済手数料: ¥{stripeFee.toLocaleString("ja-JP")}</span>
                  <span>モール手数料: ¥{platformFee.toLocaleString("ja-JP")}</span>
                </div>
                {profitTone !== "neutral" ? (
                  <div className={cn("mt-3 flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs", profitTone === "danger" ? "border-red-200 bg-red-50 text-red-600" : "border-amber-200 bg-amber-50 text-amber-700")}>
                    <AlertTriangle className="size-4" />
                    {profitTone === "danger" ? "赤字見込みです。価格、送料、手数料を見直してください。" : "純利益率が10%未満です。広告費や返品リスクを考慮して再確認してください。"}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <div className="text-sm font-semibold text-neutral-950">公開前確認</div>
                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  下書き保存できます。公開は人間が内容と利益を確認した操作として保存します。
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="outline" className="gap-2" onClick={() => saveProduct("draft")} disabled={saving}>
                    {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                    下書き保存
                  </Button>
                  <Button className="gap-2" onClick={() => saveProduct("published")} disabled={saving}>
                    {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                    人間が承認して公開
                  </Button>
                </div>
              </div>
              <SummaryPanel title="保存内容" rows={[title || "商品タイトル未設定", `販売価格: ¥${price.toLocaleString("ja-JP")}`, `純利益: ¥${netProfit.toLocaleString("ja-JP")}`, `純利益率: ${netMargin.toFixed(1)}%`]} />
            </div>
          ) : null}

          <Separator />
          <div className="flex items-center justify-between gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>
              <ChevronLeft className="size-4" />
              戻る
            </Button>
            <Button className="gap-2" onClick={() => setStep((current) => Math.min(3, current + 1))} disabled={step === 3}>
              次へ
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function ImageUploadBox({
  imageName,
  imageKey,
  imageUrl,
  imageSeoMessage,
  imageSeoFileName,
  processedImageKey,
  aiAltText,
  uploading,
  processing,
  onFiles,
  onProcess,
}: {
  imageName: string;
  imageKey: string;
  imageUrl: string;
  imageSeoMessage: string;
  imageSeoFileName: string;
  processedImageKey: string;
  aiAltText: string;
  uploading: boolean;
  processing: boolean;
  onFiles: (files: FileList | null) => void | Promise<void>;
  onProcess: () => void;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <div
        className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-white px-3 py-4 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          onFiles(event.dataTransfer.files);
        }}
      >
        {imageUrl && !uploading ? (
          <img src={imageUrl} alt={imageName || "商品画像"} className="mb-2 size-16 rounded-md border border-neutral-200 object-cover" />
        ) : uploading ? (
          <Loader2 className="mb-2 size-5 animate-spin text-neutral-500" />
        ) : (
          <UploadCloud className="mb-2 size-5 text-neutral-500" />
        )}
        <div className="text-sm font-medium text-neutral-950">
          {uploading ? "画像を保存中..." : imageName || "商品画像をドラッグ＆ドロップ"}
        </div>
        <label className={cn("mt-2 inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 transition hover:bg-neutral-50", uploading ? "cursor-not-allowed opacity-60" : "cursor-pointer")}>
          <ImagePlus className="size-4" />
          画像を選択
          <input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={(event) => onFiles(event.target.files)} />
        </label>
      </div>
      {imageKey ? (
        <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-xs text-emerald-700">
          画像を保存しました。商品ページと帳票で使える状態です。
          {imageUrl ? <span className="ml-2 text-emerald-600">プレビュー表示中</span> : null}
          {imageSeoMessage ? <span className="mt-1 block text-emerald-700">{imageSeoMessage}</span> : null}
          {imageSeoFileName ? (
            <span className="mt-1 block text-emerald-800">
              保存名: {imageName} から {imageSeoFileName} へ自動調整済み
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2" onClick={onProcess} disabled={!imageKey || uploading || processing}>
          {processing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          AIで白背景化とalt生成
        </Button>
        {processedImageKey ? <span className="text-xs text-emerald-700">AI画像処理済み</span> : null}
      </div>
      {!imageKey ? <p className="mt-2 text-xs text-neutral-500">先に画像を追加すると、AI画像処理を実行できます。</p> : null}
      {aiAltText ? <p className="mt-2 rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-xs text-neutral-600">{aiAltText}</p> : null}
    </div>
  );
}

function NumberField({ label, value, onChange, decimal = false }: { label: string; value: string; onChange: (value: string) => void; decimal?: boolean }) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-medium text-neutral-700">{label}</span>
      <Input value={value} onChange={(event) => onChange(decimal ? normalizeDecimal(event.target.value) : event.target.value.replace(/[^\d]/g, ""))} inputMode="decimal" placeholder="0" />
    </label>
  );
}

function MetricBadge({ label, value, tone }: { label: string; value: string; tone: "neutral" | "warning" | "danger" }) {
  return (
    <div className={cn(
      "rounded-lg border bg-white px-3 py-2",
      tone === "danger" && "border-red-200 text-red-600",
      tone === "warning" && "border-amber-200 text-amber-700",
      tone === "neutral" && "border-neutral-200 text-neutral-950",
    )}>
      <div className="text-[11px] text-neutral-500">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function SummaryPanel({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3">
      <div className="text-sm font-semibold text-neutral-950">{title}</div>
      <div className="mt-3 space-y-1.5">
        {rows.map((row) => (
          <div key={row} className="truncate rounded-md border border-neutral-100 bg-neutral-50 px-2 py-1.5 text-xs text-neutral-600">
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}

function toNumber(value: string): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function normalizeDecimal(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [head, ...tail] = cleaned.split(".");
  return tail.length ? `${head}.${tail.join("")}` : head;
}

function formatUploadError(error: string | undefined): string {
  if (!error) return "画像を保存できませんでした。ファイル形式とサイズを確認してください。";
  if (error.includes("too large") || error.includes("8MB")) return "画像が大きすぎます。8MB以下の画像を選んでください。";
  if (error.includes("Only JPEG") || error.includes("supported")) return "JPEG、PNG、WebP、GIF、SVGの画像を選んでください。";
  if (error.includes("empty")) return "空のファイルは追加できません。別の画像を選んでください。";
  return "画像を保存できませんでした。ファイル形式とサイズを確認してください。";
}
