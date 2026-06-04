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

export function ShadcnStorefront({ storeName, products, layout }: ShadcnStorefrontProps) {
  const tenantRoot = "/s/aiboux";
  const hero = layout.pages.top.heroSlider;
  const slides = hero.slides.filter((slide) => slide.enabled);
  const main = slides[0] ?? hero.slides[0];
  const previous = slides[1] ?? main;
  const next = slides[2] ?? main;
  const recommended = layout.pages.top.sections.recommendedProducts;
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
        <section className="grid gap-3 pt-3 md:grid-cols-[16%_1fr_16%]">
          <SideHeroCard slide={previous} />
          <div className="relative min-h-[260px] overflow-hidden rounded-md bg-neutral-950 text-white shadow-sm">
            {main.imageUrl ? (
              <img src={main.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75" />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(115deg,#211b13,#8b6f46_55%,#171717)]" />
            )}
            <div className="relative z-10 flex h-full max-w-xl flex-col justify-center px-12 py-10">
              <h1 className="text-3xl font-semibold leading-tight md:text-4xl">{main.title}</h1>
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
          <section id="products" className="rounded-md bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{recommended.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">ヒーロースライダーの直下に公開商品を表示します。</p>
              </div>
              <Badge variant="secondary">{products.length}件</Badge>
            </div>
            <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-4", columnClass)}>
              {products.length === 0 ? (
                <div className="col-span-full rounded-lg border border-dashed bg-muted/40 px-4 py-12 text-center text-sm text-muted-foreground">
                  公開商品はまだありません。管理画面で商品を公開するとここに表示されます。
                </div>
              ) : null}
              {products.slice(0, recommended.limit ?? 5).map((product) => (
                <article key={product.id} className="rounded-md border border-neutral-200 bg-white p-3">
                  <a href={product.href} className="block">
                    <div className="flex aspect-square items-center justify-center rounded bg-neutral-50">
                      {product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-contain p-3" loading="lazy" /> : <span className="text-xs text-muted-foreground">画像未登録</span>}
                    </div>
                    {layout.global.productCard.showRating ? <div className="mt-3 text-xs text-amber-500">★★★★★ <span className="text-neutral-500">(986)</span></div> : null}
                    <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold text-neutral-950">{product.name}</h3>
                    <p className="mt-1 text-lg font-bold tracking-tight">¥{product.price} {layout.global.productCard.showTaxLabel ? <span className="text-[11px] font-normal text-neutral-500">税込</span> : null}</p>
                  </a>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <StoreSection title={layout.pages.top.sections.ranking.title} enabled={layout.pages.top.sections.ranking.enabled} />
          <StoreSection title={layout.pages.top.sections.timeSale.title} enabled={layout.pages.top.sections.timeSale.enabled} accent="red" />
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
    <div className="relative hidden min-h-[260px] overflow-hidden rounded-md bg-neutral-200 md:block">
      {slide.imageUrl ? <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-[linear-gradient(135deg,#d7d1c6,#756a58)]" />}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
}

function StoreSection({ title, enabled, accent = "neutral" }: { title: string; enabled: boolean; accent?: "neutral" | "red" }) {
  if (!enabled) return null;
  return (
    <section className="rounded-md bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        <a className="text-xs text-muted-foreground" href="/s/aiboux/products">もっと見る</a>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded border border-neutral-100 p-2">
            <div className="aspect-square rounded bg-neutral-100" />
            <div className={cn("mt-2 text-sm font-bold", accent === "red" ? "text-red-600" : "text-neutral-950")}>¥{[2980, 4980, 12800][index].toLocaleString("ja-JP")}</div>
          </div>
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
        {["家電", "日用品", "食品・飲料", "コスメ", "ファッション", "ペット用品"].map((item) => (
          <a key={item} href="/s/aiboux/products" className="rounded border border-neutral-100 p-2 text-center text-xs hover:bg-neutral-50">
            <div className="mx-auto mb-2 size-12 rounded bg-neutral-100" />
            {item}
          </a>
        ))}
      </div>
    </section>
  );
}
