import { ChevronLeft, ChevronRight, Search, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StorefrontLayout } from "@/lib/shopStorefrontLayout";
import { cn } from "@/lib/utils";

type StorefrontProduct = {
  id: string;
  image: string;
  name: string;
  price: string;
  category: string;
  inStock: boolean;
  href: string;
};

type ShadcnStorefrontProps = {
  storeName: string;
  products: StorefrontProduct[];
  layout: StorefrontLayout;
};

const storefrontHeroDefaults = [
  {
    id: "aiboux-hero-market",
    title: "暮らしを整える人気アイテム特集",
    subtitle: "毎日の食品・日用品・ギフトを、見つけやすく買いやすい売り場で。",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1500&h=620&q=86",
    ctaText: "おすすめを見る",
    ctaHref: "/s/aiboux/products",
    enabled: true,
  },
  {
    id: "aiboux-hero-home",
    title: "日用品・家電をまとめてチェック",
    subtitle: "ストック品から便利家電まで、よく使うものをすばやく選べます。",
    imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1500&h=620&q=86",
    ctaText: "売れ筋を見る",
    ctaHref: "/s/aiboux/products",
    enabled: true,
  },
  {
    id: "aiboux-hero-gift",
    title: "季節のギフトと定番商品",
    subtitle: "贈り物にも自宅用にも使いやすい商品を集めました。",
    imageUrl: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1500&h=620&q=86",
    ctaText: "ギフトを見る",
    ctaHref: "/s/aiboux/products",
    enabled: true,
  },
];

const categoryShowcase = [
  { name: "食品・飲料", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=360&h=240&q=82" },
  { name: "日用品", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=360&h=240&q=82" },
  { name: "家電", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=360&h=240&q=82" },
  { name: "コスメ", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=360&h=240&q=82" },
  { name: "ファッション", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=360&h=240&q=82" },
  { name: "ペット用品", image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=360&h=240&q=82" },
];

const fallbackShowcaseProducts: StorefrontProduct[] = [
  { id: "default-food", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=720&h=720&q=82", name: "AIBOUXセレクト 食品・飲料セット", price: "3,980", category: "食品・飲料", inStock: true, href: "/s/aiboux/products" },
  { id: "default-daily", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=720&h=720&q=82", name: "暮らしを整える日用品パック", price: "2,480", category: "日用品", inStock: true, href: "/s/aiboux/products" },
  { id: "default-home", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=720&h=720&q=82", name: "便利家電スターターセット", price: "12,800", category: "家電", inStock: true, href: "/s/aiboux/products" },
  { id: "default-beauty", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=720&h=720&q=82", name: "ビューティーケア定番アイテム", price: "4,280", category: "コスメ", inStock: true, href: "/s/aiboux/products" },
  { id: "default-gift", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=720&h=720&q=82", name: "季節のギフトボックス", price: "5,980", category: "ギフト", inStock: true, href: "/s/aiboux/products" },
  { id: "default-pet", image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=720&h=720&q=82", name: "ペット用品おすすめセット", price: "3,480", category: "ペット用品", inStock: true, href: "/s/aiboux/products" },
];

export function ShadcnStorefront({ storeName, products, layout }: ShadcnStorefrontProps) {
  const tenantRoot = "/s/aiboux";
  const hero = layout.pages.top.heroSlider;
  const slides = normalizeHeroSlides(hero.slides.filter((slide) => slide.enabled));
  const main = slides[0] ?? hero.slides[0];
  const previous = slides[slides.length - 1] ?? main;
  const next = slides[1] ?? main;
  const recommended = layout.pages.top.sections.recommendedProducts;
  const visualProducts = normalizeProducts(products);
  const rankingProducts = rotateProducts(visualProducts, 1);
  const saleProducts = rotateProducts(visualProducts, 3);
  const columnClass = {
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
  }[Math.min(Math.max(layout.global.productCard.columnsDesktop, 3), 6)] ?? "lg:grid-cols-5";

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-foreground">
      <StoreHeader storeName={storeName} tenantRoot={tenantRoot} layout={layout} />

      <main className="mx-auto max-w-screen-xl px-4 pb-10">
        <section className="grid gap-3 pt-3 md:grid-cols-[12%_minmax(0,1fr)_12%] xl:grid-cols-[140px_minmax(0,1fr)_140px]" data-testid="storefront-hero-slider">
          <SideHeroCard slide={previous} />
          <div className="relative min-h-[330px] overflow-hidden rounded-md bg-neutral-950 text-white shadow-sm" data-testid="hero-slide-main">
            {main.imageUrl ? (
              <img src={main.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(115deg,#211b13,#8b6f46_55%,#171717)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/68 via-black/28 to-black/5" />
            <div className="relative z-10 flex h-full max-w-2xl flex-col justify-center px-12 py-10">
              <Badge className="mb-4 w-fit rounded-sm bg-red-600 text-white">AIBOUX SALE</Badge>
              <h1 className="text-3xl font-black leading-tight md:text-5xl">{main.title}</h1>
              <p className="mt-3 text-sm leading-6 text-white/90 md:text-base">{main.subtitle}</p>
              {main.ctaText ? (
                <a className="mt-6 inline-flex h-11 w-fit items-center rounded bg-white px-10 text-sm font-semibold text-neutral-950" href={main.ctaHref || `${tenantRoot}/products`}>
                  {main.ctaText}
                </a>
              ) : null}
            </div>
            {hero.showArrows ? (
              <>
                <button className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-950 shadow" type="button" aria-label="前のスライド">
                  <ChevronLeft className="size-5" />
                </button>
                <button className="absolute right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-950 shadow" type="button" aria-label="次のスライド">
                  <ChevronRight className="size-5" />
                </button>
              </>
            ) : null}
          </div>
          <SideHeroCard slide={next} />
        </section>

        {hero.showDots ? (
          <div className="flex justify-center gap-3 py-3">
            {slides.slice(0, 6).map((slide, index) => <span key={slide.id} className={cn("size-2 rounded-full", index === 0 ? "bg-slate-900" : "bg-slate-300")} />)}
          </div>
        ) : null}

        {recommended.enabled ? (
          <section id="products" className="rounded-md bg-white p-4 shadow-sm" data-testid="recommended-products">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{recommended.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">ヒーロースライダーの直下に公開商品を表示します。</p>
              </div>
              <Badge variant="secondary">{products.length}件</Badge>
            </div>
            <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-4", columnClass)}>
              {visualProducts.slice(0, Math.max(recommended.limit ?? 5, 5)).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} showTaxLabel={layout.global.productCard.showTaxLabel} showRating={layout.global.productCard.showRating} />
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <StoreSection title={layout.pages.top.sections.ranking.title} enabled={layout.pages.top.sections.ranking.enabled} products={rankingProducts} ranking />
          <StoreSection title={layout.pages.top.sections.timeSale.title} enabled={layout.pages.top.sections.timeSale.enabled} products={saleProducts} accent="red" sale />
          <CategorySection title={layout.pages.top.sections.categories.title} enabled={layout.pages.top.sections.categories.enabled} />
        </div>
        {layout.pages.top.sections.brands.enabled ? (
          <section className="mt-4 rounded-md bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">{layout.pages.top.sections.brands.title}</h2>
              <a className="text-xs text-muted-foreground" href={`${tenantRoot}/products`}>もっと見る</a>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
              {["THERMOS", "Panasonic", "SHARP", "dyson", "IRIS OHYAMA", "KIRIN"].map((brand) => (
                <div key={brand} className="rounded border border-neutral-200 bg-white px-3 py-2 text-center text-sm font-bold text-neutral-700">{brand}</div>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <footer className="border-t bg-white">
        <nav className="mx-auto flex max-w-screen-xl flex-wrap gap-4 px-4 py-5 text-sm text-muted-foreground">
          <a href={`${tenantRoot}/privacy`}>プライバシーポリシー</a>
          <a href={`${tenantRoot}/shipping`}>配送について</a>
          <a href={`${tenantRoot}/returns`}>返品について</a>
          <a href={`${tenantRoot}/contact`}>問い合わせ</a>
        </nav>
      </footer>
    </div>
  );
}

function StoreHeader({ storeName, tenantRoot, layout }: { storeName: string; tenantRoot: string; layout: StorefrontLayout }) {
  const logo = layout.global.logo;
  const logoHref = logo.linkType === "custom" && logo.customUrl ? logo.customUrl : `${tenantRoot}/`;
  return (
    <header className="sticky top-0 z-30 bg-[#0f1722] text-white shadow-sm">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-2 text-xs">
        <span>{layout.global.header.deliveryText}</span>
        <span>{layout.global.header.shippingText}</span>
        <span className="flex gap-5"><span>{layout.global.header.helpText}</span><span>{layout.global.header.noticeText}</span></span>
      </div>
      <div className="mx-auto flex max-w-screen-xl items-center gap-4 px-4 py-3">
        <a href={logoHref} className={cn("shrink-0 text-2xl font-bold tracking-tight", logo.alignment === "center" && "text-center")}>
          {logo.displayMode !== "storeNameOnly" && logo.imageUrl ? (
            <span className="inline-flex items-center gap-2">
              <img src={logo.imageUrl} alt={logo.alt} style={{ width: `${logo.desktopWidth}px` }} className="max-h-10 object-contain" />
              {logo.displayMode === "imageWithStoreName" ? <span>{storeName}</span> : null}
            </span>
          ) : (
            storeName
          )}
        </a>
        <div className="flex h-10 min-w-0 flex-1 overflow-hidden rounded bg-white text-neutral-900">
          <span className="hidden items-center border-r border-neutral-200 bg-neutral-100 px-3 text-xs md:flex">すべてのカテゴリ</span>
          <Input className="h-10 flex-1 rounded-none border-0" placeholder={layout.global.header.searchPlaceholder} aria-label={layout.global.header.searchPlaceholder} />
          <Button className="h-10 rounded-none bg-amber-500 px-4 text-neutral-950 hover:bg-amber-500" aria-label="検索">
            <Search className="size-5" />
          </Button>
        </div>
        <a href={`${tenantRoot}/contact`} className="hidden text-xs md:block">アカウント<br /><b>ログイン</b></a>
        <a href={`${tenantRoot}/checkout`} className="hidden text-xs md:block">注文履歴</a>
        <a href={`${tenantRoot}/cart`} className="flex items-center gap-1 text-xs"><ShoppingCart className="size-6" />カート</a>
      </div>
      <nav className="mx-auto flex max-w-screen-xl items-center gap-6 overflow-x-auto border-t border-white/10 px-4 py-2 text-xs">
        <a className="shrink-0 font-bold" href={`${tenantRoot}/categories`}>すべてのカテゴリー</a>
        {layout.global.navigation.items.map((item) => (
          <a key={item} className={cn("shrink-0", item === "セール" && "font-bold text-red-400")} href={`${tenantRoot}/products`}>
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}

function SideHeroCard({ slide }: { slide: StorefrontLayout["pages"]["top"]["heroSlider"]["slides"][number] }) {
  return (
    <div className="relative hidden min-h-[330px] overflow-hidden rounded-md bg-neutral-900 md:block" data-testid="hero-slide-side">
      <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" data-hero-side-image />
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-x-3 bottom-3 line-clamp-2 text-xs font-bold leading-5 text-white drop-shadow">{slide.title}</div>
    </div>
  );
}

function StoreSection({ title, enabled, products, accent = "neutral", ranking, sale }: { title: string; enabled: boolean; products: StorefrontProduct[]; accent?: "neutral" | "red"; ranking?: boolean; sale?: boolean }) {
  if (!enabled) return null;
  return (
    <section className="rounded-md bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        <a className="text-xs text-muted-foreground" href="/s/aiboux/products">もっと見る</a>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {products.slice(0, 3).map((product, index) => (
          <a key={`${title}-${product.id}`} href={product.href} className="relative rounded border border-neutral-100 p-2 hover:border-amber-300">
            {ranking ? <span className="absolute left-2 top-2 z-10 rounded-sm bg-amber-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{index + 1}</span> : null}
            {sale ? <span className="absolute left-2 top-2 z-10 rounded-sm bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">SALE</span> : null}
            <img src={product.image} alt={product.name} className="aspect-square w-full rounded object-cover" loading="lazy" />
            <div className="mt-1 line-clamp-2 min-h-8 text-[11px] font-semibold text-neutral-800">{product.name}</div>
            <div className={cn("mt-1 text-sm font-bold", accent === "red" ? "text-red-600" : "text-neutral-950")}>¥{product.price}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

function CategorySection({ title, enabled }: { title: string; enabled: boolean }) {
  if (!enabled) return null;
  return (
    <section className="rounded-md bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        <a className="text-xs text-muted-foreground" href="/s/aiboux/categories">もっと見る</a>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {categoryShowcase.map((item) => (
          <a key={item.name} href="/s/aiboux/products" className="rounded border border-neutral-100 p-2 text-center text-xs hover:bg-neutral-50">
            <img src={item.image} alt={item.name} className="mx-auto mb-2 aspect-[4/3] w-full rounded object-cover" loading="lazy" />
            {item.name}
          </a>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, index, showTaxLabel, showRating }: { product: StorefrontProduct; index: number; showTaxLabel: boolean; showRating: boolean }) {
  return (
    <article className="rounded-md border border-neutral-200 bg-white p-3 hover:border-amber-300">
      <a href={product.href} className="block">
        <img src={product.image} alt={product.name} className="aspect-square w-full rounded object-cover" loading="lazy" />
        {showRating ? <div className="mt-3 text-xs text-amber-500">★★★★★ <span className="text-neutral-500">({860 + index * 47})</span></div> : null}
        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold text-neutral-950">{product.name}</h3>
        <p className="mt-1 text-lg font-bold tracking-tight text-red-700">¥{product.price} {showTaxLabel ? <span className="text-[11px] font-normal text-neutral-500">税込</span> : null}</p>
        <span className="mt-2 inline-flex h-8 w-full items-center justify-center rounded bg-[#FFD814] text-xs font-bold text-neutral-950">カートに追加</span>
      </a>
    </article>
  );
}

function normalizeHeroSlides(slides: StorefrontLayout["pages"]["top"]["heroSlider"]["slides"]) {
  const merged = [...slides, ...storefrontHeroDefaults].filter((slide) => slide.enabled);
  return merged.slice(0, Math.max(3, merged.length)).map((slide, index) => ({
    ...slide,
    imageUrl: isWeakImage(slide.imageUrl) ? storefrontHeroDefaults[index % storefrontHeroDefaults.length].imageUrl : slide.imageUrl,
    title: slide.title || storefrontHeroDefaults[index % storefrontHeroDefaults.length].title,
    subtitle: slide.subtitle || storefrontHeroDefaults[index % storefrontHeroDefaults.length].subtitle,
    ctaText: slide.ctaText || storefrontHeroDefaults[index % storefrontHeroDefaults.length].ctaText,
    ctaHref: slide.ctaHref || storefrontHeroDefaults[index % storefrontHeroDefaults.length].ctaHref,
  }));
}

function normalizeProducts(products: StorefrontProduct[]) {
  const source = products.length ? products : fallbackShowcaseProducts;
  const normalized = source.map((product, index) => ({
    ...product,
    image: isWeakImage(product.image) ? fallbackShowcaseProducts[index % fallbackShowcaseProducts.length].image : product.image,
    href: product.href || "/s/aiboux/products",
  }));
  return normalized.length >= 6
    ? normalized
    : [...normalized, ...fallbackShowcaseProducts].slice(0, 6);
}

function rotateProducts(products: StorefrontProduct[], offset: number) {
  if (!products.length) return fallbackShowcaseProducts;
  return [...products.slice(offset), ...products.slice(0, offset)];
}

function isWeakImage(value: string | null | undefined) {
  if (!value) return true;
  return /placeholder|skeleton|gray|grey|画像なし|no-image|\/shop\/design\/hero-/i.test(value);
}
