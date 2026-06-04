"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  GripVertical,
  ImageIcon,
  Loader2,
  Monitor,
  Package,
  Palette,
  Save,
  Search,
  ShoppingCart,
  Smartphone,
  Trash2,
  Type,
  Undo2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultStorefrontLayout,
  sanitizeStorefrontLayout,
  type LogoConfig,
  type ProductDetailPageDesignConfig,
  type StorefrontLayout,
  type TopPageDesignConfig,
} from "@/lib/shopStorefrontLayout";
import { cn } from "@/lib/utils";

type LayoutResponse = {
  success?: boolean;
  layout?: StorefrontLayout;
  updatedAt?: number | null;
  error?: string;
};

type EditorPage = "top" | "productDetail";
type EditorSection =
  | "top.heroSlider"
  | "top.recommendedProducts"
  | "top.ranking"
  | "top.timeSale"
  | "top.categories"
  | "top.brands"
  | "top.recentlyViewed"
  | "product.gallery"
  | "product.title"
  | "product.priceStock"
  | "product.variations"
  | "product.purchaseBox"
  | "product.description"
  | "product.specs"
  | "product.reviews"
  | "product.related"
  | "global.header"
  | "global.logo"
  | "global.navigation"
  | "global.colors"
  | "global.font"
  | "global.button"
  | "global.productCard";

const topSections: Array<{ id: EditorSection; label: string }> = [
  { id: "global.header", label: "ヘッダー" },
  { id: "global.navigation", label: "カテゴリナビ" },
  { id: "top.heroSlider", label: "ヒーロースライダー" },
  { id: "top.recommendedProducts", label: "おすすめ商品" },
  { id: "top.ranking", label: "売れ筋ランキング" },
  { id: "top.timeSale", label: "タイムセール" },
  { id: "top.categories", label: "カテゴリー一覧" },
  { id: "top.brands", label: "人気ブランド" },
  { id: "top.recentlyViewed", label: "最近チェックした商品" },
];

const productSections: Array<{ id: EditorSection; label: string }> = [
  { id: "global.header", label: "ヘッダー" },
  { id: "product.gallery", label: "商品画像ギャラリー" },
  { id: "product.title", label: "商品タイトル" },
  { id: "product.priceStock", label: "価格・レビュー・在庫" },
  { id: "product.variations", label: "バリエーション" },
  { id: "product.purchaseBox", label: "購入ボックス" },
  { id: "product.description", label: "商品説明" },
  { id: "product.specs", label: "商品仕様" },
  { id: "product.reviews", label: "レビュー" },
  { id: "product.related", label: "関連商品" },
];

const editorHeroDefaults = [
  {
    title: "毎日の暮らしを整える、雪花セレクト市",
    subtitle: "飲料、日用品、キッチン雑貨まで。今日ほしいものを見つけやすい売り場にまとめました。",
    imageUrl: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1500&h=620&q=86",
  },
  {
    title: "キッチンと食卓の定番をまとめ買い",
    subtitle: "保温ボトル、コーヒー、保存容器。日々の使いやすさで選べる定番アイテム。",
    imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1500&h=620&q=86",
  },
  {
    title: "贈り物にも使える暮らしのギフト",
    subtitle: "タオル、ケア用品、食品ギフトを、価格とレビューで比較しながら選べます。",
    imageUrl: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1500&h=620&q=86",
  },
];

const editorProductShowcase = [
  { name: "雪花セレクト ドリップコーヒー 20袋", price: 1980, category: "コーヒー・お茶", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=720&h=720&q=82" },
  { name: "軽量ステンレスボトル 500ml", price: 2480, category: "キッチン用品", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=720&h=720&q=82" },
  { name: "雪花セレクト ギフトタオル 2枚セット", price: 2980, category: "タオル・寝具", image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=720&h=720&q=82" },
  { name: "キッチン保存容器 6点セット", price: 3280, category: "キッチン用品", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=720&h=720&q=82" },
  { name: "毎日使えるホームケア洗剤セット", price: 1680, category: "日用品", image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=720&h=720&q=82" },
  { name: "ナチュラルスキンケア 3点セット", price: 4280, category: "ビューティー", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=720&h=720&q=82" },
  { name: "焼き菓子アソートボックス", price: 2380, category: "食品・飲料", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=720&h=720&q=82" },
  { name: "ペットケアおでかけセット", price: 3480, category: "ペット用品", image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=720&h=720&q=82" },
  { name: "季節のギフトボックス", price: 5980, category: "ギフト", image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=720&h=720&q=82" },
  { name: "国産茶葉ティーバッグ 30包", price: 1780, category: "コーヒー・お茶", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=720&h=720&q=82" },
];

const globalSections: Array<{ id: EditorSection; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "global.header", label: "ヘッダー", icon: Monitor },
  { id: "global.logo", label: "ロゴ", icon: ImageIcon },
  { id: "global.navigation", label: "ナビゲーション", icon: GripVertical },
  { id: "global.colors", label: "カラー", icon: Palette },
  { id: "global.font", label: "フォント", icon: Type },
  { id: "global.button", label: "ボタン", icon: ShoppingCart },
  { id: "global.productCard", label: "商品カード", icon: Package },
];

function initialEditorPage(): EditorPage {
  if (typeof window === "undefined") return "top";
  return new URLSearchParams(window.location.search).get("page") === "productDetail" ? "productDetail" : "top";
}

function initialEditorSection(page: EditorPage): EditorSection {
  return page === "productDetail" ? "product.purchaseBox" : "top.heroSlider";
}

export function StorefrontDesignBuilder() {
  const [layout, setLayout] = React.useState<StorefrontLayout>(defaultStorefrontLayout);
  const [activePage, setActivePage] = React.useState<EditorPage>(() => initialEditorPage());
  const [selectedSection, setSelectedSection] = React.useState<EditorSection>(() => initialEditorSection(initialEditorPage()));
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [uploadingLogo, setUploadingLogo] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<number | null>(null);

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
        if (!mounted) return;
        setLayout(sanitizeStorefrontLayout(data.layout));
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

  const updateLayout = (updater: (current: StorefrontLayout) => StorefrontLayout) => {
    setLayout((current) => sanitizeStorefrontLayout(updater(current)));
  };

  const updateLogo = (patch: Partial<LogoConfig>) => {
    updateLayout((current) => ({
      ...current,
      global: {
        ...current.global,
        logo: { ...current.global.logo, ...patch },
      },
    }));
  };

  const updateTop = (patch: Partial<TopPageDesignConfig>) => {
    updateLayout((current) => ({
      ...current,
      pages: {
        ...current.pages,
        top: { ...current.pages.top, ...patch },
      },
    }));
  };

  const updateProductDetail = (patch: Partial<ProductDetailPageDesignConfig>) => {
    updateLayout((current) => ({
      ...current,
      pages: {
        ...current.pages,
        productDetail: { ...current.pages.productDetail, ...patch },
      },
    }));
  };

  const saveLayout = async () => {
    setSaving(true);
    try {
      const safeLayout = sanitizeStorefrontLayout(layout);
      const response = await fetch("/shop/api/storefront/layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layout: safeLayout, actorId: "shop-design-editor" }),
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

  const uploadLogo = async (file: File | undefined, target: "light" | "dark") => {
    if (!file) return;
    setUploadingLogo(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("purpose", "document-logo");
      form.append("productTitle", layout.global.logo.alt || "AIBOUX Store logo");
      form.append("altText", layout.global.logo.alt || "AIBOUX Store logo");
      form.append("keywords", "store logo header brand");
      const response = await fetch("/shop/api/upload", { method: "POST", body: form });
      const data = (await response.json().catch(() => ({}))) as { success?: boolean; url?: string; error?: string };
      if (!response.ok || !data.success || !data.url) {
        throw new Error(data.error || "ロゴをアップロードできませんでした");
      }
      updateLogo(target === "light" ? { imageUrl: data.url, displayMode: "imageWithStoreName" } : { darkImageUrl: data.url });
      toast.success("ロゴ画像を保存しました");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ロゴをアップロードできませんでした");
    } finally {
      setUploadingLogo(false);
    }
  };

  const openPublicUrl = activePage === "top" ? "/s/aiboux/" : "/s/aiboux/product/shopprod_tenant_001_4580000232621";

  return (
    <section className="grid h-screen w-screen overflow-hidden bg-[#f6f7f9] [grid-template-rows:56px_1fr]" data-shop-design-editor-shell>
      <div className="flex h-14 min-w-0 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4">
        <div className="flex min-w-0 items-center gap-5">
          <div className="min-w-[270px]">
            <h1 className="truncate text-base font-semibold tracking-tight text-neutral-950">AIBOUX SHOP ストアデザインエディタ</h1>
            <p className="truncate text-xs text-neutral-500">TOPページと商品詳細ページだけを編集します。</p>
          </div>
          <div className="flex rounded-md border border-neutral-200 bg-neutral-50 p-1 text-sm">
            <button
              type="button"
              className={cn("h-8 rounded px-3 font-semibold", activePage === "top" ? "bg-white text-blue-700 shadow-sm" : "text-neutral-600")}
              onClick={() => {
                setActivePage("top");
                setSelectedSection("top.heroSlider");
              }}
            >
              TOPページ
            </button>
            <button
              type="button"
              className={cn("h-8 rounded px-3 font-semibold", activePage === "productDetail" ? "bg-white text-blue-700 shadow-sm" : "text-neutral-600")}
              onClick={() => {
                setActivePage("productDetail");
                setSelectedSection("product.purchaseBox");
              }}
            >
              商品詳細ページ
            </button>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="outline" size="icon" aria-label="undo" disabled>
            <Undo2 className="size-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" aria-label="redo" disabled>
            <Undo2 className="size-4 rotate-180" />
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href={openPublicUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" />
              公開サイト
            </a>
          </Button>
          <Button type="button" variant="outline" size="icon" aria-label="desktop preview">
            <Monitor className="size-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" aria-label="mobile preview">
            <Smartphone className="size-4" />
          </Button>
          <Button onClick={saveLayout} disabled={saving || loading} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            保存
          </Button>
        </div>
      </div>

      <div
        className="grid min-h-0 gap-4 overflow-hidden p-4 [grid-template-columns:300px_minmax(0,1fr)_340px] min-[1840px]:[grid-template-columns:320px_minmax(1100px,1fr)_360px]"
        data-shop-design-editor-main
        data-testid="shop-design-editor-main"
      >
        <LeftPane
          activePage={activePage}
          selectedSection={selectedSection}
          onPage={(page) => {
            setActivePage(page);
            setSelectedSection(page === "top" ? "top.heroSlider" : "product.purchaseBox");
          }}
          onSection={(section) => setSelectedSection(section)}
        />
        <main className="min-w-0 overflow-auto rounded-lg border border-neutral-200 bg-[#eef1f6] p-4" data-shop-design-preview data-testid="shop-design-editor-preview">
          {loading ? (
            <div className="flex h-full min-h-[640px] items-center justify-center rounded-md border border-dashed border-neutral-300 bg-white text-sm text-neutral-500">
              <Loader2 className="mr-2 size-4 animate-spin" />
              読み込み中
            </div>
          ) : (
            <div className="mx-auto w-full max-w-[1280px]" data-store-preview-frame data-testid="store-preview-frame">
              {activePage === "top" ? (
                <TopPreview layout={layout} selectedSection={selectedSection} onSelect={setSelectedSection} />
              ) : (
                <ProductDetailPreview layout={layout} selectedSection={selectedSection} onSelect={setSelectedSection} />
              )}
            </div>
          )}
        </main>
        <RightPane
          layout={layout}
          selectedSection={selectedSection}
          saving={saving}
          uploadingLogo={uploadingLogo}
          lastSavedAt={lastSavedAt}
          updateLayout={updateLayout}
          updateLogo={updateLogo}
          updateTop={updateTop}
          updateProductDetail={updateProductDetail}
          uploadLogo={uploadLogo}
        />
      </div>
    </section>
  );
}

function LeftPane({
  activePage,
  selectedSection,
  onPage,
  onSection,
}: {
  activePage: EditorPage;
  selectedSection: EditorSection;
  onPage: (page: EditorPage) => void;
  onSection: (section: EditorSection) => void;
}) {
  const sections = activePage === "top" ? topSections : productSections;
  return (
    <aside className="min-h-0 overflow-auto rounded-lg border border-neutral-200 bg-white" data-shop-design-left-pane data-testid="shop-design-left-pane">
      <div className="border-b border-neutral-200 px-4 py-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <button
            type="button"
            className={cn("rounded-md px-3 py-2 font-semibold", activePage === "top" ? "bg-blue-50 text-blue-700" : "text-neutral-600 hover:bg-neutral-50")}
            onClick={() => onPage("top")}
          >
            ページ
          </button>
          <button
            type="button"
            className="rounded-md px-3 py-2 font-semibold text-neutral-600 hover:bg-neutral-50"
            onClick={() => onSection("global.logo")}
          >
            共通設定
          </button>
        </div>
      </div>
      <div className="space-y-5 px-4 py-4">
        <div>
          <h2 className="text-xs font-bold text-neutral-700">編集するページ</h2>
          <p className="mt-2 text-xs leading-5 text-neutral-500">編集できるのは以下の2ページのみです。</p>
          <div className="mt-3 grid gap-2">
            <PageButton active={activePage === "top"} label="TOPページ" onClick={() => onPage("top")} />
            <PageButton active={activePage === "productDetail"} label="商品詳細ページ" onClick={() => onPage("productDetail")} />
          </div>
        </div>
        <Separator />
        <div>
          <h2 className="text-xs font-bold text-neutral-700">{activePage === "top" ? "TOPページのセクション" : "商品詳細ページのセクション"}</h2>
          <div className="mt-3 grid gap-1">
            {sections.map((section) => (
              <SectionButton key={section.id} active={selectedSection === section.id} label={section.label} onClick={() => onSection(section.id)} />
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <h2 className="text-xs font-bold text-neutral-700">共通設定</h2>
          <div className="mt-3 grid gap-1">
            {globalSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => onSection(section.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm",
                    selectedSection === section.id ? "bg-blue-50 font-semibold text-blue-700" : "text-neutral-700 hover:bg-neutral-50",
                  )}
                >
                  <Icon className="size-4" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-3 text-xs leading-5 text-blue-900">
          編集できるのは「TOPページ」と「商品詳細ページ」のみです。商品一覧、カテゴリ、カート、チェックアウト、問い合わせ、法務ページはテナント全共通テンプレートです。
        </div>
      </div>
    </aside>
  );
}

function PageButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm",
        active ? "border-blue-100 bg-blue-50 font-semibold text-blue-700" : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
      )}
    >
      <Package className="size-4" />
      {label}
    </button>
  );
}

function SectionButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-md px-2 py-2 text-left text-sm",
        active ? "bg-blue-50 font-semibold text-blue-700" : "text-neutral-700 hover:bg-neutral-50",
      )}
    >
      <span className="flex items-center gap-2">
        <GripVertical className="size-3.5 text-neutral-400" />
        {label}
      </span>
      <Eye className="size-3.5" />
    </button>
  );
}

function TopPreview({
  layout,
  selectedSection,
  onSelect,
}: {
  layout: StorefrontLayout;
  selectedSection: EditorSection;
  onSelect: (section: EditorSection) => void;
}) {
  const slides = layout.pages.top.heroSlider.slides.filter((slide) => slide.enabled).map((slide, index) => ({
    ...slide,
    imageUrl: isWeakEditorImage(slide.imageUrl) ? editorHeroDefaults[index % editorHeroDefaults.length].imageUrl : slide.imageUrl,
    title: isWeakEditorImage(slide.imageUrl) ? editorHeroDefaults[index % editorHeroDefaults.length].title : slide.title,
    subtitle: isWeakEditorImage(slide.imageUrl) ? editorHeroDefaults[index % editorHeroDefaults.length].subtitle : slide.subtitle,
  }));
  const main = slides[0] ?? { ...defaultStorefrontLayout.pages.top.heroSlider.slides[0], ...editorHeroDefaults[0] };
  const previous = slides[slides.length - 1] ?? slides[1] ?? main;
  const next = slides[1] ?? slides[0] ?? main;

  return (
    <div className="overflow-hidden rounded-md border border-neutral-300 bg-white shadow-sm">
      <AmazonHeader layout={layout} onSelect={onSelect} selectedSection={selectedSection} />
      <button
        type="button"
        onClick={() => onSelect("top.heroSlider")}
        className={cn(
          "grid w-full gap-3 bg-white p-3 text-left [grid-template-columns:180px_minmax(0,1fr)_180px]",
          selectedSection === "top.heroSlider" && "ring-2 ring-inset ring-blue-500",
        )}
        data-testid="storefront-hero-slider"
      >
        <SideHeroCard slide={previous} direction="left" />
        <div className="relative min-h-[220px] overflow-hidden rounded-md bg-neutral-900 text-white" data-testid="hero-slide-main">
          {main.imageUrl ? <img src={main.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" /> : <div className="absolute inset-0 bg-[linear-gradient(115deg,#201a12,#80633d_55%,#1b1b1b)]" />}
          <div className="relative z-10 flex h-full max-w-lg flex-col justify-center px-12 py-8">
            <h2 className="text-3xl font-semibold leading-tight">{main.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/90">{main.subtitle}</p>
            {main.ctaText ? <span className="mt-5 inline-flex h-10 w-fit items-center rounded bg-white px-8 text-sm font-semibold text-neutral-950">{main.ctaText}</span> : null}
          </div>
          {layout.pages.top.heroSlider.showArrows ? (
            <>
              <span className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-950 shadow">
                <ChevronLeft className="size-5" />
              </span>
              <span className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-950 shadow">
                <ChevronRight className="size-5" />
              </span>
            </>
          ) : null}
        </div>
        <SideHeroCard slide={next} direction="right" />
      </button>
      {layout.pages.top.heroSlider.showDots ? (
        <div className="flex justify-center gap-3 py-2">
          {slides.slice(0, 6).map((slide, index) => <span key={slide.id} className={cn("size-2 rounded-full", index === 0 ? "bg-slate-900" : "bg-slate-300")} />)}
        </div>
      ) : null}
      <PreviewProducts
        title={layout.pages.top.sections.recommendedProducts.title}
        selected={selectedSection === "top.recommendedProducts"}
        onClick={() => onSelect("top.recommendedProducts")}
        products={editorProductShowcase}
      />
      <div className="space-y-3 p-3">
        <CompactSection title={layout.pages.top.sections.ranking.title} selected={selectedSection === "top.ranking"} onClick={() => onSelect("top.ranking")} products={editorProductShowcase.slice(1)} ranking />
        <CompactSection title={layout.pages.top.sections.timeSale.title} selected={selectedSection === "top.timeSale"} onClick={() => onSelect("top.timeSale")} products={editorProductShowcase.slice(2)} accent="red" sale />
        <EditorCategorySection title={layout.pages.top.sections.categories.title} selected={selectedSection === "top.categories"} onClick={() => onSelect("top.categories")} />
      </div>
      <CompactBrandSection selected={selectedSection === "top.brands"} onClick={() => onSelect("top.brands")} />
    </div>
  );
}

function AmazonHeader({ layout, onSelect, selectedSection }: { layout: StorefrontLayout; onSelect: (section: EditorSection) => void; selectedSection: EditorSection }) {
  const navItems = layout.global.navigation.items.slice(0, 10);
  return (
    <div className={cn("bg-[#0f1722] text-white", selectedSection === "global.header" && "ring-2 ring-inset ring-blue-500")}>
      <button type="button" onClick={() => onSelect("global.header")} className="flex w-full items-center justify-between px-5 py-2 text-left text-xs">
        <span>{layout.global.header.deliveryText}</span>
        <span>{layout.global.header.shippingText}</span>
        <span className="flex gap-5"><span>{layout.global.header.helpText}</span><span>{layout.global.header.noticeText}</span></span>
      </button>
      <div className="flex items-center gap-4 px-5 py-3">
        <button type="button" onClick={() => onSelect("global.logo")} className={cn("shrink-0 text-2xl font-bold", selectedSection === "global.logo" && "rounded ring-2 ring-blue-400")}>
          <LogoMark layout={layout} />
        </button>
        <div className="flex h-10 min-w-0 flex-1 overflow-hidden rounded bg-white text-neutral-900">
          <span className="flex items-center border-r border-neutral-200 bg-neutral-100 px-3 text-xs">すべてのカテゴリ</span>
          <div className="flex min-w-0 flex-1 items-center px-4 text-sm text-neutral-400">{layout.global.header.searchPlaceholder}</div>
          <span className="flex w-12 items-center justify-center bg-amber-500 text-neutral-950"><Search className="size-5" /></span>
        </div>
        <span className="text-xs">アカウント<br /><b>ログイン</b></span>
        <span className="text-xs">注文履歴</span>
        <span className="flex items-center gap-1 text-xs"><ShoppingCart className="size-6" />カート</span>
      </div>
      <button type="button" onClick={() => onSelect("global.navigation")} className={cn("flex w-full min-w-0 gap-5 overflow-x-auto whitespace-nowrap border-t border-white/10 px-5 py-2 text-left text-xs [scrollbar-width:none]", selectedSection === "global.navigation" && "ring-2 ring-inset ring-blue-500")}>
        <span className="shrink-0 font-bold">すべてのカテゴリー</span>
        {navItems.map((item) => <span key={item} data-shop-nav-item className={cn("shrink-0", item === "セール" ? "font-bold text-red-400" : "")}>{item}</span>)}
      </button>
    </div>
  );
}

function LogoMark({ layout }: { layout: StorefrontLayout }) {
  const logo = layout.global.logo;
  const storeName = logo.alt || "aiboux";
  if (logo.displayMode !== "storeNameOnly" && logo.imageUrl) {
    return (
      <span className="inline-flex items-center gap-2">
        <img src={logo.imageUrl} alt={logo.alt} style={{ width: `${logo.desktopWidth}px` }} className="max-h-10 object-contain" />
        {logo.displayMode === "imageWithStoreName" ? <span>{storeName}</span> : null}
      </span>
    );
  }
  return <span>aiboux</span>;
}

function SideHeroCard({ slide, direction }: { slide: TopPageDesignConfig["heroSlider"]["slides"][number]; direction: "left" | "right" }) {
  return (
    <div
      className="relative min-h-[220px] overflow-hidden rounded-md bg-neutral-200"
      data-hero-side={direction}
      data-testid={direction === "left" ? "hero-slide-prev" : "hero-slide-next"}
    >
      <img src={isWeakEditorImage(slide.imageUrl) ? editorHeroDefaults[0].imageUrl : slide.imageUrl} alt="" className="h-full w-full object-cover" data-hero-side-image />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-x-3 bottom-3 line-clamp-2 text-left text-xs font-semibold leading-5 text-white drop-shadow">{slide.title}</div>
      <span className={cn("absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-950 shadow", direction === "left" ? "left-4" : "right-4")}>
        {direction === "left" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
      </span>
    </div>
  );
}

function PreviewProducts({ title, selected, onClick, products }: { title: string; selected: boolean; onClick: () => void; products: typeof editorProductShowcase }) {
  return (
    <button type="button" onClick={onClick} className={cn("block w-full p-3 text-left", selected && "ring-2 ring-inset ring-blue-500")} data-testid="recommended-products">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-neutral-950">{title}</h3>
        <span className="text-xs text-neutral-500">もっと見る</span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {products.map((product, index) => (
          <div key={product.name} className="rounded-md border border-neutral-200 bg-white p-3">
            <img src={product.image} alt={product.name} className="h-36 w-full rounded object-cover" />
            <div className="mt-2 text-[11px] font-semibold text-neutral-500">{product.category}</div>
            <div className="mt-1 text-xs text-amber-500">★★★★★ <span className="text-neutral-500">({800 + index * 87})</span></div>
            <div className="mt-1 line-clamp-2 min-h-8 text-xs font-semibold text-neutral-800">{product.name}</div>
            <div className="mt-1 text-sm font-bold text-neutral-950">¥{product.price.toLocaleString("ja-JP")} <span className="text-[11px] font-normal text-neutral-500">税込</span></div>
          </div>
        ))}
      </div>
    </button>
  );
}

function CompactSection({ title, selected, onClick, products, accent = "neutral", ranking, sale }: { title: string; selected: boolean; onClick: () => void; products: typeof editorProductShowcase; accent?: "neutral" | "red"; ranking?: boolean; sale?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={cn("block w-full rounded-md border border-neutral-200 bg-white p-3 text-left", selected && "ring-2 ring-blue-500")}>
      <div className="mb-2 flex justify-between text-sm font-bold">{title}<span className="text-xs font-normal text-neutral-500">もっと見る</span></div>
      <div className="grid grid-cols-5 gap-2">
        {products.slice(0, 5).map((product, index) => (
          <div key={`${title}-${product.name}`} className="relative rounded border border-neutral-100 p-2">
            {ranking ? <span className="absolute left-2 top-2 z-10 rounded bg-amber-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{index + 1}</span> : null}
            {sale ? <span className="absolute left-2 top-2 z-10 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">SALE</span> : null}
            <img src={product.image} alt={product.name} className="h-24 w-full rounded object-cover" />
            <div className="mt-1 line-clamp-1 text-[11px] font-semibold text-neutral-700">{product.name}</div>
            <div className={cn("mt-1 text-xs font-bold", accent === "red" ? "text-red-600" : "text-neutral-950")}>¥{product.price.toLocaleString("ja-JP")}</div>
          </div>
        ))}
      </div>
    </button>
  );
}

function EditorCategorySection({ title, selected, onClick }: { title: string; selected: boolean; onClick: () => void }) {
  const categories = [
    ["食品・飲料", "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=420&h=280&q=82"],
    ["コーヒー・お茶", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=420&h=280&q=82"],
    ["キッチン用品", "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=420&h=280&q=82"],
    ["日用品", "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=420&h=280&q=82"],
    ["タオル・寝具", "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=420&h=280&q=82"],
    ["ビューティー", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=420&h=280&q=82"],
    ["ペット用品", "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=420&h=280&q=82"],
    ["ギフト", "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=420&h=280&q=82"],
  ];
  return (
    <button type="button" onClick={onClick} className={cn("block w-full rounded-md border border-neutral-200 bg-white p-3 text-left", selected && "ring-2 ring-blue-500")}>
      <div className="mb-2 flex justify-between text-sm font-bold">{title}<span className="text-xs font-normal text-neutral-500">もっと見る</span></div>
      <div className="grid grid-cols-4 gap-2">
        {categories.map(([name, image]) => (
          <div key={name} className="rounded border border-neutral-100 p-2 text-center text-[11px] font-semibold text-neutral-700">
            <img src={image} alt={name} className="mb-1 h-16 w-full rounded object-cover" />
            {name}
          </div>
        ))}
      </div>
    </button>
  );
}

function isWeakEditorImage(value: string | null | undefined) {
  if (!value) return true;
  return /placeholder|skeleton|gray|grey|画像なし|no-image|\/shop\/design\/hero-/i.test(value);
}

function CompactBrandSection({ selected, onClick }: { selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn("block w-full p-3 text-left", selected && "ring-2 ring-inset ring-blue-500")}>
      <h3 className="mb-2 text-sm font-bold">人気ブランド</h3>
      <div className="grid grid-cols-6 gap-3">
        {["THERMOS", "Panasonic", "SHARP", "dyson", "IRIS OHYAMA", "KIRIN"].map((brand) => (
          <div key={brand} className="rounded border border-neutral-200 bg-white px-3 py-2 text-center text-sm font-bold text-neutral-700">{brand}</div>
        ))}
      </div>
    </button>
  );
}

function ProductDetailPreview({
  layout,
  selectedSection,
  onSelect,
}: {
  layout: StorefrontLayout;
  selectedSection: EditorSection;
  onSelect: (section: EditorSection) => void;
}) {
  const product = layout.pages.productDetail;
  return (
    <div className="overflow-hidden rounded-md border border-neutral-300 bg-white shadow-sm" data-testid="product-detail-editor-preview">
      <AmazonHeader layout={layout} onSelect={onSelect} selectedSection={selectedSection} />
      <div className="border-b border-neutral-100 px-5 py-3 text-xs text-neutral-500">ストア &gt; 日用品 &gt; 商品詳細</div>
      <div className="grid gap-6 p-5 lg:grid-cols-[300px_1fr_280px]">
        <button
          type="button"
          onClick={() => onSelect("product.gallery")}
          className={cn("text-left", selectedSection === "product.gallery" && "rounded-md ring-2 ring-blue-500")}
          data-testid="product-detail-gallery"
        >
          <div className="flex gap-3">
            <div className="grid gap-2">
              {Array.from({ length: product.gallery.thumbnailCount }).map((_, index) => <div key={index} className="size-12 rounded border border-neutral-200 bg-neutral-100" />)}
            </div>
            <div className="flex aspect-square flex-1 items-center justify-center rounded-md bg-neutral-100 text-sm text-neutral-500">商品画像</div>
          </div>
        </button>
        <div className="space-y-4">
          <button type="button" onClick={() => onSelect("product.title")} className={cn("block w-full text-left", selectedSection === "product.title" && "rounded-md ring-2 ring-blue-500")}>
            <p className="text-xs text-blue-700">AIBOUX ブランド</p>
            <h2 className="mt-1 text-2xl font-semibold leading-tight">上質な暮らしに合わせたサンプル商品名</h2>
          </button>
          <button type="button" onClick={() => onSelect("product.priceStock")} className={cn("block w-full border-y border-neutral-200 py-4 text-left", selectedSection === "product.priceStock" && "rounded-md ring-2 ring-blue-500")}>
            {product.content.showReviews ? <div className="text-sm text-amber-500">★★★★★ <span className="text-blue-700">(1,245件の評価)</span></div> : null}
            <div className="mt-3 text-3xl font-bold text-red-700">¥4,980 <span className="text-sm font-normal text-neutral-500">税込</span></div>
            {product.content.showPoints ? <p className="mt-2 text-sm text-neutral-600">ポイント 49pt</p> : null}
            {product.content.showStock ? <p className="mt-2 text-sm font-semibold text-emerald-700">在庫あり</p> : null}
          </button>
          <button type="button" onClick={() => onSelect("product.variations")} className={cn("block w-full text-left", selectedSection === "product.variations" && "rounded-md ring-2 ring-blue-500")}>
            <h3 className="text-sm font-bold">バリエーション</h3>
            <div className="mt-2 flex gap-2">
              {["ホワイト", "ブラック", "ベージュ"].map((item) => <span key={item} className="rounded-md border border-neutral-200 px-3 py-2 text-xs">{item}</span>)}
            </div>
          </button>
          <button type="button" onClick={() => onSelect("product.description")} className={cn("block w-full rounded-md border border-neutral-200 p-4 text-left", selectedSection === "product.description" && "ring-2 ring-blue-500")}>
            <h3 className="text-sm font-bold">商品説明</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">商品の特徴、使い方、素材、配送時の注意点をここに表示します。</p>
          </button>
        </div>
        <button
          type="button"
          onClick={() => onSelect("product.purchaseBox")}
          className={cn("h-fit rounded-md border border-neutral-200 bg-white p-4 text-left shadow-sm", selectedSection === "product.purchaseBox" && "ring-2 ring-blue-500")}
          data-testid="product-detail-purchase-box"
        >
          <div className="text-2xl font-bold text-red-700">¥4,980</div>
          {product.content.showDeliveryEstimate ? <p className="mt-3 text-sm leading-6 text-neutral-600">最短で明日お届け予定</p> : null}
          {product.content.showStock ? <p className="mt-2 text-sm font-bold text-emerald-700">在庫あり</p> : null}
          {product.purchaseBox.showSubscriptionOptions ? (
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs">
              <div className="font-bold text-neutral-950">購入方法</div>
              <div className="mt-2 rounded bg-white px-2 py-1">通常購入 ¥4,980</div>
              <div className="mt-1 rounded bg-white px-2 py-1 text-amber-800">定期購入 ¥4,482 10%OFF / 毎月</div>
            </div>
          ) : null}
          {product.purchaseBox.showQuantity ? <label className="mt-4 block text-xs font-semibold">数量<input className="mt-1 h-9 w-full rounded-md border border-neutral-200 px-3" value="1" readOnly /></label> : null}
          <div className="mt-4 grid gap-2">
            <span className="flex h-10 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-neutral-950">{product.purchaseBox.cartButtonText}</span>
            <span className="flex h-10 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">{product.purchaseBox.buyNowButtonText}</span>
            <span className="flex h-9 items-center justify-center rounded-md border border-neutral-200 text-sm font-semibold">お気に入り</span>
          </div>
        </button>
      </div>
    </div>
  );
}

function RightPane({
  layout,
  selectedSection,
  uploadingLogo,
  lastSavedAt,
  updateLayout,
  updateLogo,
  updateTop,
  updateProductDetail,
  uploadLogo,
}: {
  layout: StorefrontLayout;
  selectedSection: EditorSection;
  saving: boolean;
  uploadingLogo: boolean;
  lastSavedAt: number | null;
  updateLayout: (updater: (current: StorefrontLayout) => StorefrontLayout) => void;
  updateLogo: (patch: Partial<LogoConfig>) => void;
  updateTop: (patch: Partial<TopPageDesignConfig>) => void;
  updateProductDetail: (patch: Partial<ProductDetailPageDesignConfig>) => void;
  uploadLogo: (file: File | undefined, target: "light" | "dark") => void;
}) {
  return (
    <aside className="min-h-0 overflow-auto rounded-lg border border-neutral-200 bg-white" data-shop-design-right-pane data-testid="shop-design-right-pane">
      <div className="border-b border-neutral-200 px-4 py-3">
        <p className="text-xs font-bold text-neutral-600">編集中のセクション</p>
        <h2 className="mt-1 text-lg font-semibold text-neutral-950">{sectionTitle(selectedSection)}</h2>
        {lastSavedAt ? <p className="mt-1 text-xs text-neutral-500">最終保存: {new Date(lastSavedAt).toLocaleString("ja-JP")}</p> : null}
      </div>
      <div className="space-y-5 px-4 py-4">
        {selectedSection === "top.heroSlider" ? <HeroSliderEditor layout={layout} updateLayout={updateLayout} /> : null}
        {selectedSection.startsWith("top.") && selectedSection !== "top.heroSlider" ? <TopSectionEditor layout={layout} selectedSection={selectedSection} updateTop={updateTop} /> : null}
        {selectedSection === "global.logo" ? <LogoEditor layout={layout} updateLogo={updateLogo} uploadLogo={uploadLogo} uploading={uploadingLogo} /> : null}
        {selectedSection === "global.header" ? <HeaderEditor layout={layout} updateLayout={updateLayout} /> : null}
        {selectedSection === "global.navigation" ? <NavigationEditor layout={layout} updateLayout={updateLayout} /> : null}
        {["global.colors", "global.font", "global.button", "global.productCard"].includes(selectedSection) ? <GlobalSimpleEditor layout={layout} selectedSection={selectedSection} updateLayout={updateLayout} /> : null}
        {selectedSection.startsWith("product.") ? <ProductDetailEditor layout={layout} selectedSection={selectedSection} updateProductDetail={updateProductDetail} /> : null}
      </div>
    </aside>
  );
}

function HeroSliderEditor({ layout, updateLayout }: { layout: StorefrontLayout; updateLayout: (updater: (current: StorefrontLayout) => StorefrontLayout) => void }) {
  const hero = layout.pages.top.heroSlider;
  const updateSlide = (index: number, patch: Partial<TopPageDesignConfig["heroSlider"]["slides"][number]>) => {
    updateLayout((current) => {
      const slides = current.pages.top.heroSlider.slides.map((slide, slideIndex) => slideIndex === index ? { ...slide, ...patch } : slide);
      return { ...current, pages: { ...current.pages, top: { ...current.pages.top, heroSlider: { ...current.pages.top.heroSlider, slides } } } };
    });
  };
  const addSlide = () => {
    updateLayout((current) => ({
      ...current,
      pages: {
        ...current.pages,
        top: {
          ...current.pages.top,
          heroSlider: {
            ...current.pages.top.heroSlider,
            slides: [
              ...current.pages.top.heroSlider.slides,
              { id: `slide-${Date.now()}`, title: "新しいスライド", subtitle: "説明文を入力", imageUrl: "", ctaText: "見る", ctaHref: "/s/aiboux/products", enabled: true },
            ].slice(0, 8),
          },
        },
      },
    }));
  };
  const removeSlide = (index: number) => {
    updateLayout((current) => {
      const slides = current.pages.top.heroSlider.slides.filter((_, slideIndex) => slideIndex !== index);
      return { ...current, pages: { ...current.pages, top: { ...current.pages.top, heroSlider: { ...current.pages.top.heroSlider, slides: slides.length ? slides : current.pages.top.heroSlider.slides } } } };
    });
  };

  return (
    <div className="space-y-5">
      <TabsLabel />
      <div>
        <h3 className="text-sm font-bold">スライド設定</h3>
        <p className="mt-1 text-xs text-neutral-500">中央を大きく、左右に前後スライドを少し見せます。</p>
      </div>
      <div className="space-y-3">
        {hero.slides.map((slide, index) => (
          <div key={slide.id} className="rounded-md border border-neutral-200 p-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-600">スライド {index + 1}</span>
              <Button type="button" variant="outline" size="icon" className="size-8" onClick={() => removeSlide(index)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            <Field label="タイトル"><Input value={slide.title} onChange={(event) => updateSlide(index, { title: event.target.value })} /></Field>
            <Field label="サブテキスト"><Textarea rows={2} value={slide.subtitle} onChange={(event) => updateSlide(index, { subtitle: event.target.value })} /></Field>
            <Field label="画像URL"><Input value={slide.imageUrl} onChange={(event) => updateSlide(index, { imageUrl: event.target.value })} placeholder="/shop/api/assets/..." /></Field>
            <Field label="CTA文言"><Input value={slide.ctaText} onChange={(event) => updateSlide(index, { ctaText: event.target.value })} /></Field>
            <Field label="CTAリンク"><Input value={slide.ctaHref} onChange={(event) => updateSlide(index, { ctaHref: event.target.value })} /></Field>
            <label className="mt-3 flex items-center gap-2 text-xs font-semibold text-neutral-700">
              <input type="checkbox" checked={slide.enabled} onChange={(event) => updateSlide(index, { enabled: event.target.checked })} />
              表示する
            </label>
          </div>
        ))}
        <Button type="button" variant="outline" className="w-full" onClick={addSlide}>+ スライドを追加</Button>
      </div>
      <SwitchField label="自動再生" checked={hero.autoplay} onChange={(value) => updateLayout((current) => ({ ...current, pages: { ...current.pages, top: { ...current.pages.top, heroSlider: { ...current.pages.top.heroSlider, autoplay: value } } } }))} />
      <NumberField label="自動再生の間隔" value={hero.intervalSeconds} suffix="秒" min={3} max={20} onChange={(value) => updateLayout((current) => ({ ...current, pages: { ...current.pages, top: { ...current.pages.top, heroSlider: { ...current.pages.top.heroSlider, intervalSeconds: value } } } }))} />
      <NumberField label="プレビューの幅" value={Math.round(hero.sidePreviewRatio * 100)} suffix="%" min={10} max={40} onChange={(value) => updateLayout((current) => ({ ...current, pages: { ...current.pages, top: { ...current.pages.top, heroSlider: { ...current.pages.top.heroSlider, sidePreviewRatio: value / 100 } } } }))} />
      <SwitchField label="ドット表示" checked={hero.showDots} onChange={(value) => updateLayout((current) => ({ ...current, pages: { ...current.pages, top: { ...current.pages.top, heroSlider: { ...current.pages.top.heroSlider, showDots: value } } } }))} />
      <SwitchField label="矢印表示" checked={hero.showArrows} onChange={(value) => updateLayout((current) => ({ ...current, pages: { ...current.pages, top: { ...current.pages.top, heroSlider: { ...current.pages.top.heroSlider, showArrows: value } } } }))} />
    </div>
  );
}

function LogoEditor({ layout, updateLogo, uploadLogo, uploading }: { layout: StorefrontLayout; updateLogo: (patch: Partial<LogoConfig>) => void; uploadLogo: (file: File | undefined, target: "light" | "dark") => void; uploading: boolean }) {
  const logo = layout.global.logo;
  return (
    <div className="space-y-4">
      <TabsLabel />
      <Field label="ロゴ画像">
        <label className={cn("flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-neutral-300 px-3 py-4 text-sm text-neutral-600", uploading && "opacity-60")}>
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          ロゴ画像をアップロード
          <input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={(event) => uploadLogo(event.target.files?.[0], "light")} />
        </label>
      </Field>
      {logo.imageUrl ? (
        <div className="rounded-md border border-neutral-200 p-3">
          <img src={logo.imageUrl} alt={logo.alt} className="max-h-16 object-contain" />
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => updateLogo({ imageUrl: null, displayMode: "storeNameOnly" })}>削除</Button>
        </div>
      ) : null}
      <Field label="代替テキスト"><Input value={logo.alt} onChange={(event) => updateLogo({ alt: event.target.value })} /></Field>
      <Field label="表示形式">
        <select className="h-10 rounded-md border border-neutral-200 px-3 text-sm" value={logo.displayMode} onChange={(event) => updateLogo({ displayMode: event.target.value as LogoConfig["displayMode"] })}>
          <option value="image">ロゴ画像のみ</option>
          <option value="imageWithStoreName">ロゴ画像 + ストア名</option>
          <option value="storeNameOnly">ストア名のみ</option>
        </select>
      </Field>
      <NumberField label="PCロゴサイズ" value={logo.desktopWidth} suffix="px" min={48} max={240} onChange={(value) => updateLogo({ desktopWidth: value })} />
      <NumberField label="モバイルロゴサイズ" value={logo.mobileWidth} suffix="px" min={40} max={180} onChange={(value) => updateLogo({ mobileWidth: value })} />
      <Field label="ロゴ配置">
        <select className="h-10 rounded-md border border-neutral-200 px-3 text-sm" value={logo.alignment} onChange={(event) => updateLogo({ alignment: event.target.value as LogoConfig["alignment"] })}>
          <option value="left">左寄せ</option>
          <option value="center">中央寄せ</option>
        </select>
      </Field>
      <Field label="クリック先">
        <select className="h-10 rounded-md border border-neutral-200 px-3 text-sm" value={logo.linkType} onChange={(event) => updateLogo({ linkType: event.target.value as LogoConfig["linkType"] })}>
          <option value="home">TOPページ</option>
          <option value="custom">任意URL</option>
        </select>
      </Field>
      {logo.linkType === "custom" ? <Field label="任意URL"><Input value={logo.customUrl ?? ""} onChange={(event) => updateLogo({ customUrl: event.target.value })} /></Field> : null}
      <Field label="ダーク背景用ロゴ">
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-neutral-300 px-3 py-3 text-sm text-neutral-600">
          <Upload className="size-4" />
          アップロード
          <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadLogo(event.target.files?.[0], "dark")} />
        </label>
      </Field>
    </div>
  );
}

function HeaderEditor({ layout, updateLayout }: { layout: StorefrontLayout; updateLayout: (updater: (current: StorefrontLayout) => StorefrontLayout) => void }) {
  const header = layout.global.header;
  const updateHeader = (patch: Partial<typeof header>) => updateLayout((current) => ({ ...current, global: { ...current.global, header: { ...current.global.header, ...patch } } }));
  return (
    <div className="space-y-4">
      <TabsLabel />
      <Field label="お届け先表示"><Input value={header.deliveryText} onChange={(event) => updateHeader({ deliveryText: event.target.value })} /></Field>
      <Field label="配送案内"><Input value={header.shippingText} onChange={(event) => updateHeader({ shippingText: event.target.value })} /></Field>
      <Field label="ヘルプ表示"><Input value={header.helpText} onChange={(event) => updateHeader({ helpText: event.target.value })} /></Field>
      <Field label="お知らせ表示"><Input value={header.noticeText} onChange={(event) => updateHeader({ noticeText: event.target.value })} /></Field>
      <Field label="検索プレースホルダ"><Input value={header.searchPlaceholder} onChange={(event) => updateHeader({ searchPlaceholder: event.target.value })} /></Field>
    </div>
  );
}

function NavigationEditor({ layout, updateLayout }: { layout: StorefrontLayout; updateLayout: (updater: (current: StorefrontLayout) => StorefrontLayout) => void }) {
  return (
    <div className="space-y-4">
      <TabsLabel />
      <Field label="ナビ項目">
        <Textarea
          rows={10}
          value={layout.global.navigation.items.join("\n")}
          onChange={(event) => updateLayout((current) => ({ ...current, global: { ...current.global, navigation: { items: event.target.value.split("\n") } } }))}
        />
      </Field>
      <p className="text-xs leading-5 text-neutral-500">1行につき1項目。商品一覧・カート等のページ自体は編集対象に追加されません。</p>
    </div>
  );
}

function GlobalSimpleEditor({ layout, selectedSection, updateLayout }: { layout: StorefrontLayout; selectedSection: EditorSection; updateLayout: (updater: (current: StorefrontLayout) => StorefrontLayout) => void }) {
  if (selectedSection === "global.colors") {
    return (
      <div className="space-y-4">
        <TabsLabel />
        <Field label="アクセントカラー"><Input type="color" value={layout.global.theme.accentColor} onChange={(event) => updateLayout((current) => ({ ...current, global: { ...current.global, theme: { ...current.global.theme, accentColor: event.target.value } } }))} /></Field>
      </div>
    );
  }
  if (selectedSection === "global.button") {
    return (
      <div className="space-y-4">
        <TabsLabel />
        <NumberField label="ボタン角丸" value={layout.global.theme.buttonRadius} suffix="px" min={0} max={16} onChange={(value) => updateLayout((current) => ({ ...current, global: { ...current.global, theme: { ...current.global.theme, buttonRadius: value } } }))} />
      </div>
    );
  }
  if (selectedSection === "global.productCard") {
    return (
      <div className="space-y-4">
        <TabsLabel />
        <SwitchField label="レビュー表示" checked={layout.global.productCard.showRating} onChange={(value) => updateLayout((current) => ({ ...current, global: { ...current.global, productCard: { ...current.global.productCard, showRating: value } } }))} />
        <SwitchField label="税込表示" checked={layout.global.productCard.showTaxLabel} onChange={(value) => updateLayout((current) => ({ ...current, global: { ...current.global, productCard: { ...current.global.productCard, showTaxLabel: value } } }))} />
        <NumberField label="PC列数" value={layout.global.productCard.columnsDesktop} min={3} max={6} onChange={(value) => updateLayout((current) => ({ ...current, global: { ...current.global, productCard: { ...current.global.productCard, columnsDesktop: value } } }))} />
      </div>
    );
  }
  return <p className="text-sm leading-6 text-neutral-600">フォントはAIBOUX標準フォントを固定で使います。ページ単位の自由フォント変更はできません。</p>;
}

function TopSectionEditor({ layout, selectedSection, updateTop }: { layout: StorefrontLayout; selectedSection: EditorSection; updateTop: (patch: Partial<TopPageDesignConfig>) => void }) {
  const key = selectedSection.replace("top.", "") as keyof TopPageDesignConfig["sections"];
  const section = layout.pages.top.sections[key];
  if (!section) return null;
  return (
    <div className="space-y-4">
      <TabsLabel />
      <SwitchField label="表示する" checked={section.enabled} onChange={(enabled) => updateTop({ sections: { ...layout.pages.top.sections, [key]: { ...section, enabled } } })} />
      <Field label="セクション名"><Input value={section.title} onChange={(event) => updateTop({ sections: { ...layout.pages.top.sections, [key]: { ...section, title: event.target.value } } })} /></Field>
      <NumberField label="表示数" value={section.limit ?? 5} min={1} max={12} onChange={(limit) => updateTop({ sections: { ...layout.pages.top.sections, [key]: { ...section, limit } } })} />
    </div>
  );
}

function ProductDetailEditor({ layout, selectedSection, updateProductDetail }: { layout: StorefrontLayout; selectedSection: EditorSection; updateProductDetail: (patch: Partial<ProductDetailPageDesignConfig>) => void }) {
  const product = layout.pages.productDetail;
  if (selectedSection === "product.gallery") {
    return (
      <div className="space-y-4">
        <TabsLabel />
        <Field label="サムネイル位置">
          <select className="h-10 rounded-md border border-neutral-200 px-3 text-sm" value={product.gallery.position} onChange={(event) => updateProductDetail({ gallery: { ...product.gallery, position: event.target.value as "left" | "top" } })}>
            <option value="left">左</option>
            <option value="top">上</option>
          </select>
        </Field>
        <NumberField label="サムネイル数" value={product.gallery.thumbnailCount} min={3} max={8} onChange={(thumbnailCount) => updateProductDetail({ gallery: { ...product.gallery, thumbnailCount } })} />
        <SwitchField label="ズーム有効" checked={product.gallery.zoomEnabled} onChange={(zoomEnabled) => updateProductDetail({ gallery: { ...product.gallery, zoomEnabled } })} />
      </div>
    );
  }
  if (selectedSection === "product.purchaseBox") {
    return (
      <div className="space-y-4">
        <TabsLabel />
        <SwitchField label="追従表示" checked={product.purchaseBox.sticky} onChange={(sticky) => updateProductDetail({ purchaseBox: { ...product.purchaseBox, sticky } })} />
        <SwitchField label="数量表示" checked={product.purchaseBox.showQuantity} onChange={(showQuantity) => updateProductDetail({ purchaseBox: { ...product.purchaseBox, showQuantity } })} />
        <SwitchField label="定期購入選択を表示" checked={product.purchaseBox.showSubscriptionOptions} onChange={(showSubscriptionOptions) => updateProductDetail({ purchaseBox: { ...product.purchaseBox, showSubscriptionOptions } })} />
        <Field label="カートボタン文言"><Input value={product.purchaseBox.cartButtonText} onChange={(event) => updateProductDetail({ purchaseBox: { ...product.purchaseBox, cartButtonText: event.target.value } })} /></Field>
        <Field label="今すぐ購入ボタン文言"><Input value={product.purchaseBox.buyNowButtonText} onChange={(event) => updateProductDetail({ purchaseBox: { ...product.purchaseBox, buyNowButtonText: event.target.value } })} /></Field>
      </div>
    );
  }

  const toggles: Array<[keyof ProductDetailPageDesignConfig["content"], string]> = [
    ["showBrand", "ブランド表示"],
    ["showReviews", "レビュー表示"],
    ["showPoints", "ポイント表示"],
    ["showDeliveryEstimate", "配送予定表示"],
    ["showStock", "在庫表示"],
    ["showVariations", "バリエーション表示"],
    ["showSpecs", "商品仕様表示"],
    ["showRelatedProducts", "関連商品表示"],
  ];
  return (
    <div className="space-y-4">
      <TabsLabel />
      {toggles.map(([key, label]) => (
        <SwitchField key={key} label={label} checked={product.content[key]} onChange={(value) => updateProductDetail({ content: { ...product.content, [key]: value } })} />
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-xs font-semibold text-neutral-700">
      {label}
      {children}
    </label>
  );
}

function NumberField({ label, value, onChange, min, max, suffix = "" }: { label: string; value: number; onChange: (value: number) => void; min: number; max: number; suffix?: string }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <Input type="number" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} />
        {suffix ? <span className="w-10 text-xs text-neutral-500">{suffix}</span> : null}
      </div>
    </Field>
  );
}

function SwitchField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function TabsLabel() {
  return (
    <div className="grid grid-cols-3 border-b border-neutral-200 text-center text-sm font-semibold">
      <span className="border-b-2 border-blue-600 px-2 py-2 text-blue-700">コンテンツ</span>
      <span className="px-2 py-2 text-neutral-500">デザイン</span>
      <span className="px-2 py-2 text-neutral-500">表示設定</span>
    </div>
  );
}

function sectionTitle(section: EditorSection): string {
  return [...topSections, ...productSections, ...globalSections].find((item) => item.id === section)?.label ?? "設定";
}
