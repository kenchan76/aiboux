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
    id: "setsuka-hero-market",
    title: "毎日の暮らしを整える、雪花セレクト市",
    subtitle: "飲料、日用品、キッチン雑貨まで。今日ほしいものを見つけやすい売り場にまとめました。",
    imageUrl: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1500&h=620&q=86",
    ctaText: "おすすめを見る",
    ctaHref: "/s/aiboux/products",
    enabled: true,
  },
  {
    id: "setsuka-hero-kitchen",
    title: "キッチンと食卓の定番をまとめ買い",
    subtitle: "保温ボトル、コーヒー、保存容器。日々の使いやすさで選べる定番アイテム。",
    imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1500&h=620&q=86",
    ctaText: "売れ筋を見る",
    ctaHref: "/s/aiboux/products",
    enabled: true,
  },
  {
    id: "setsuka-hero-gift",
    title: "贈り物にも使える暮らしのギフト",
    subtitle: "タオル、ケア用品、食品ギフトを、価格とレビューで比較しながら選べます。",
    imageUrl: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1500&h=620&q=86",
    ctaText: "ギフトを見る",
    ctaHref: "/s/aiboux/products",
    enabled: true,
  },
];

const categoryShowcase = [
  { name: "食品・飲料", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=420&h=280&q=82" },
  { name: "コーヒー・お茶", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=420&h=280&q=82" },
  { name: "キッチン用品", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=420&h=280&q=82" },
  { name: "日用品", image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=420&h=280&q=82" },
  { name: "タオル・寝具", image: "https://images.unsplash.com/photo-1724847885015-be191f1a47ef?auto=format&fit=crop&w=420&h=280&q=82" },
  { name: "ビューティー", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=420&h=280&q=82" },
  { name: "ペット用品", image: "https://images.unsplash.com/photo-1741942732341-d1ec386afd68?auto=format&fit=crop&w=420&h=280&q=82" },
  { name: "ギフト", image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=420&h=280&q=82" },
  { name: "本・文具", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=420&h=280&q=82" },
  { name: "セール", image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=420&h=280&q=82" },
  { name: "ランキング", image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=420&h=280&q=82" },
];

const curatedStorefrontProducts: StorefrontProduct[] = [
  { id: "setsuka-coffee", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=720&h=720&q=82", name: "雪花セレクト ドリップコーヒー 20袋", price: "1,980", category: "コーヒー・お茶", inStock: true, href: "/s/aiboux/product/setsuka-coffee" },
  { id: "setsuka-bottle", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=720&h=720&q=82", name: "軽量ステンレスボトル 500ml", price: "2,480", category: "キッチン用品", inStock: true, href: "/s/aiboux/product/setsuka-bottle" },
  { id: "setsuka-towel", image: "https://images.unsplash.com/photo-1724847885015-be191f1a47ef?auto=format&fit=crop&w=720&h=720&q=82", name: "雪花セレクト ギフトタオル 2枚セット", price: "2,980", category: "タオル・寝具", inStock: true, href: "/s/aiboux/product/setsuka-towel" },
  { id: "setsuka-storage", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=720&h=720&q=82", name: "キッチン保存容器 6点セット", price: "3,280", category: "キッチン用品", inStock: true, href: "/s/aiboux/product/setsuka-storage" },
  { id: "setsuka-cleaning", image: "https://images.unsplash.com/photo-1576503276229-998652dc7e56?auto=format&fit=crop&w=720&h=720&q=82", name: "毎日使えるホームケア洗剤セット", price: "1,680", category: "日用品", inStock: true, href: "/s/aiboux/product/setsuka-cleaning" },
  { id: "setsuka-skincare", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=720&h=720&q=82", name: "ナチュラルスキンケア 3点セット", price: "4,280", category: "ビューティー", inStock: true, href: "/s/aiboux/product/setsuka-skincare" },
  { id: "setsuka-snack", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=720&h=720&q=82", name: "焼き菓子アソートボックス", price: "2,380", category: "食品・飲料", inStock: true, href: "/s/aiboux/product/setsuka-snack" },
  { id: "setsuka-pet", image: "https://images.unsplash.com/photo-1741942732341-d1ec386afd68?auto=format&fit=crop&w=720&h=720&q=82", name: "ペットケアおでかけセット", price: "3,480", category: "ペット用品", inStock: true, href: "/s/aiboux/product/setsuka-pet" },
  { id: "setsuka-gift", image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=720&h=720&q=82", name: "季節のギフトボックス", price: "5,980", category: "ギフト", inStock: true, href: "/s/aiboux/product/setsuka-gift" },
  { id: "setsuka-tea", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=720&h=720&q=82", name: "国産茶葉ティーバッグ 30包", price: "1,780", category: "コーヒー・お茶", inStock: true, href: "/s/aiboux/product/setsuka-tea" },
  { id: "setsuka-rice", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=720&h=720&q=82", name: "北海道ゆめぴりか 2kg", price: "2,680", category: "食品・飲料", inStock: true, href: "/s/aiboux/product/setsuka-rice" },
  { id: "setsuka-pan", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=720&h=720&q=82", name: "ふっくら食パン詰め合わせ", price: "2,280", category: "食品・飲料", inStock: true, href: "/s/aiboux/product/setsuka-pan" },
  { id: "setsuka-dishcloth", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=720&h=720&q=82", name: "吸水キッチンクロス 4枚組", price: "1,480", category: "キッチン用品", inStock: true, href: "/s/aiboux/product/setsuka-dishcloth" },
  { id: "setsuka-laundry", image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=720&h=720&q=82", name: "部屋干しランドリー洗剤セット", price: "1,880", category: "日用品", inStock: true, href: "/s/aiboux/product/setsuka-laundry" },
  { id: "setsuka-candle", image: "https://images.unsplash.com/photo-1607344645866-009c320f6103?auto=format&fit=crop&w=720&h=720&q=82", name: "リラックスアロマキャンドル", price: "1,980", category: "ギフト", inStock: true, href: "/s/aiboux/product/setsuka-candle" },
  { id: "setsuka-stationery", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=720&h=720&q=82", name: "毎日使える文具スターターセット", price: "1,680", category: "本・文具", inStock: true, href: "/s/aiboux/product/setsuka-stationery" },
];

export function ShadcnStorefront({ storeName, products, layout }: ShadcnStorefrontProps) {
  const tenantRoot = "/s/aiboux";
  const hero = layout.pages.top.heroSlider;
  const slides = normalizeHeroSlides(hero.slides.filter((slide) => slide.enabled));
  const main = slides[0] ?? hero.slides[0];
  const previous = slides[slides.length - 1] ?? main;
  const next = slides[1] ?? main;
  const recommended = layout.pages.top.sections.recommendedProducts;
  const visualProducts = buildSalesReadyProducts(products);
  const rankingProducts = rotateProducts(visualProducts, 1);
  const saleProducts = rotateProducts(visualProducts, 3);
  const columnClass = {
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
  }[Math.min(Math.max(layout.global.productCard.columnsDesktop, 3), 6)] ?? "lg:grid-cols-5";

  return (
    <div id="top" className="min-h-screen bg-[#f3f4f6] text-foreground">
      <StoreHeader storeName={storeName} tenantRoot={tenantRoot} layout={layout} />

      <main className="mx-auto max-w-screen-xl px-4 pb-10">
        <section
          className="pt-3"
          data-testid="hero-carousel"
          data-hero-carousel
          data-slides={JSON.stringify(slides)}
          data-autoplay={hero.autoplay ? "true" : "false"}
          data-interval-ms={String(Math.max(3, hero.intervalSeconds || 5) * 1000)}
          data-loop={hero.loop ? "true" : "false"}
          data-current-slide-id={main.id}
          tabIndex={0}
          aria-label="TOPヒーロースライダー"
        >
          <div className="relative overflow-hidden" data-testid="storefront-hero-slider">
            <div
              className="flex gap-3 transition-transform duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
              data-testid="hero-carousel-track"
              data-hero-track
            >
              <SideHeroCard slide={previous} direction="prev" />
              <div className="relative min-h-[330px] shrink-0 basis-full overflow-hidden rounded-md bg-neutral-950 text-white shadow-sm md:basis-[72%]" data-testid="hero-slide-main" data-slide-id={main.id}>
                {main.imageUrl ? (
                  <img src={main.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" data-hero-main-img />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(115deg,#211b13,#8b6f46_55%,#171717)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/68 via-black/28 to-black/5" />
                <div className="relative z-10 flex h-full max-w-2xl flex-col justify-center px-12 py-10">
                  <Badge className="mb-4 w-fit rounded-sm bg-red-600 text-white">AIBOUX SALE</Badge>
                  <h1 className="text-3xl font-black leading-tight md:text-5xl" data-hero-title>{main.title}</h1>
                  <p className="mt-3 text-sm leading-6 text-white/90 md:text-base" data-hero-subtitle>{main.subtitle}</p>
                  {main.ctaText ? (
                    <a className="mt-6 inline-flex h-11 w-fit items-center rounded bg-white px-10 text-sm font-semibold text-neutral-950" href={main.ctaHref || `${tenantRoot}/products`} data-hero-cta>
                      {main.ctaText}
                    </a>
                  ) : null}
                </div>
              </div>
              <SideHeroCard slide={next} direction="next" />
            </div>
            {hero.showArrows ? (
              <>
                <button className="absolute left-4 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-950 shadow" type="button" aria-label="前のスライド" data-testid="hero-prev-button" data-hero-prev-button>
                  <ChevronLeft className="size-5" />
                </button>
                <button className="absolute right-4 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-950 shadow" type="button" aria-label="次のスライド" data-testid="hero-next-button" data-hero-next-button>
                  <ChevronRight className="size-5" />
                </button>
              </>
            ) : null}
          </div>

        {hero.showDots ? (
          <div className="flex justify-center gap-3 py-3">
            {slides.slice(0, 6).map((slide, index) => (
              <button
                key={slide.id}
                className={cn("size-2 rounded-full", index === 0 ? "bg-slate-900" : "bg-slate-300")}
                type="button"
                aria-label={`スライド${index + 1}へ移動`}
                aria-current={index === 0 ? "true" : "false"}
                data-testid={`hero-dot-${index}`}
                data-hero-dot={String(index)}
              />
            ))}
          </div>
        ) : null}
        </section>

        {recommended.enabled ? (
          <section id="products" className="rounded-md bg-white p-4 shadow-sm" data-testid="recommended-products">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{recommended.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">ヒーロースライダーの直下に公開商品を表示します。</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{products.length}件</Badge>
                <a className="text-xs text-muted-foreground" href={`${tenantRoot}/products`}>もっと見る</a>
              </div>
            </div>
            <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:gap-4", columnClass)}>
              {visualProducts.slice(0, Math.max(recommended.limit ?? 10, 10)).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} showTaxLabel={layout.global.productCard.showTaxLabel} showRating={layout.global.productCard.showRating} />
              ))}
            </div>
          </section>
        ) : null}

        <StoreSection title={layout.pages.top.sections.ranking.title} enabled={layout.pages.top.sections.ranking.enabled} products={rankingProducts} ranking />
        <StoreSection title={layout.pages.top.sections.timeSale.title} enabled={layout.pages.top.sections.timeSale.enabled} products={saleProducts} accent="red" sale />
        <CategorySection title={layout.pages.top.sections.categories.title} enabled={layout.pages.top.sections.categories.enabled} />
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

      <StoreFooter storeName={storeName} tenantRoot={tenantRoot} />
      <StorefrontInteractionScript />
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
        <a href={`${tenantRoot}/mypage`} className="hidden text-xs md:block">アカウント<br /><b>マイページ</b></a>
        <a href={`${tenantRoot}/orders`} className="hidden text-xs md:block">注文履歴</a>
        <a href={`${tenantRoot}/cart`} className="flex items-center gap-1 text-xs"><ShoppingCart className="size-6" />カート <span className="rounded bg-amber-400 px-1.5 py-0.5 text-[11px] font-bold text-neutral-950" data-testid="storefront-cart-count" data-cart-count>0</span></a>
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

function StoreFooter({ storeName, tenantRoot }: { storeName: string; tenantRoot: string }) {
  const columns = [
    {
      title: "お買い物",
      links: [
        ["商品一覧", `${tenantRoot}/products`],
        ["カテゴリ", `${tenantRoot}/categories`],
        ["タイムセール", `${tenantRoot}/products`],
        ["お気に入り", `${tenantRoot}/favorites`],
      ],
    },
    {
      title: "アカウント",
      links: [
        ["マイページ", `${tenantRoot}/mypage`],
        ["注文履歴", `${tenantRoot}/orders`],
        ["定期購入", `${tenantRoot}/mypage/subscriptions`],
        ["ログイン", `${tenantRoot}/login`],
      ],
    },
    {
      title: "サポート",
      links: [
        ["問い合わせ", `${tenantRoot}/contact`],
        ["よくある質問", `${tenantRoot}/faq`],
        ["配送について", `${tenantRoot}/shipping`],
        ["返品について", `${tenantRoot}/returns`],
      ],
    },
    {
      title: "ストア情報",
      links: [
        ["特定商取引法", `${tenantRoot}/legal`],
        ["プライバシーポリシー", `${tenantRoot}/privacy`],
        ["カート", `${tenantRoot}/cart`],
        ["チェックアウト", `${tenantRoot}/checkout`],
      ],
    },
  ];
  return (
    <footer className="mt-8 bg-[#17212f] text-white" data-testid="storefront-footer">
      <a className="block bg-[#253447] px-4 py-3 text-center text-sm font-semibold hover:bg-[#2e4058]" href="#top">ページ上部へ戻る</a>
      <div className="mx-auto grid max-w-screen-xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => (
          <nav key={column.title} className="grid gap-2 text-sm">
            <h2 className="mb-2 text-base font-bold">{column.title}</h2>
            {column.links.map(([label, href]) => (
              <a key={label} className="text-white/78 hover:text-white" href={href}>{label}</a>
            ))}
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/70">
        <div className="font-bold text-white">{storeName}</div>
        <div className="mt-1">配送、返品、定期購入、問い合わせまで同じテナント導線で確認できます。決済未接続時は注文確定しません。</div>
      </div>
    </footer>
  );
}

function SideHeroCard({ slide, direction }: { slide: StorefrontLayout["pages"]["top"]["heroSlider"]["slides"][number]; direction: "prev" | "next" }) {
  return (
    <div className="relative hidden min-h-[330px] shrink-0 basis-[14%] overflow-hidden rounded-md bg-neutral-900 md:block" data-testid={`hero-slide-${direction}`} data-slide-id={slide.id}>
      <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" data-hero-side-image />
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-x-3 bottom-3 line-clamp-2 text-xs font-bold leading-5 text-white drop-shadow" data-hero-side-title>{slide.title}</div>
    </div>
  );
}

function StoreSection({ title, enabled, products, accent = "neutral", ranking, sale }: { title: string; enabled: boolean; products: StorefrontProduct[]; accent?: "neutral" | "red"; ranking?: boolean; sale?: boolean }) {
  if (!enabled) return null;
  return (
    <section className="mt-4 rounded-md bg-white p-4 shadow-sm" data-testid={ranking ? "bestseller-ranking" : sale ? "time-sale-products" : undefined}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        <a className="text-xs text-muted-foreground" href="/s/aiboux/products">もっと見る</a>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {products.slice(0, 5).map((product, index) => (
          <a key={`${title}-${product.id}`} href={product.href} className="relative rounded-md border border-neutral-200 p-2 hover:border-amber-300" data-testid={ranking ? "ranking-card" : sale ? "time-sale-card" : "store-section-card"}>
            {ranking ? <span className="absolute left-2 top-2 z-10 rounded-sm bg-amber-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{index + 1}</span> : null}
            {sale ? <span className="absolute left-2 top-2 z-10 rounded-sm bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">SALE</span> : null}
            <img src={product.image} alt={product.name} className="h-32 w-full rounded bg-neutral-50 object-cover" loading="lazy" />
            <div className="mt-2 text-[10px] font-semibold text-neutral-500">{product.category}</div>
            <div className="mt-1 line-clamp-2 min-h-9 text-xs font-semibold leading-[18px] text-neutral-900">{product.name}</div>
            <div className={cn("mt-1 text-base font-bold", accent === "red" ? "text-red-600" : "text-neutral-950")}>¥{product.price}</div>
            {sale ? <div className="mt-0.5 text-[11px] text-neutral-500 line-through">¥{priceAdd(product.price, 600)}</div> : null}
          </a>
        ))}
      </div>
    </section>
  );
}

function CategorySection({ title, enabled }: { title: string; enabled: boolean }) {
  if (!enabled) return null;
  return (
    <section className="mt-4 rounded-md bg-white p-4 shadow-sm" data-testid="category-showcase">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        <a className="text-xs text-muted-foreground" href="/s/aiboux/categories">もっと見る</a>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        {categoryShowcase.map((item) => (
          <a key={item.name} href="/s/aiboux/products" className="rounded-md border border-neutral-200 p-2 text-center text-xs font-semibold hover:bg-neutral-50" data-testid="category-card">
            <img src={item.image} alt={item.name} className="mx-auto mb-2 h-20 w-full rounded object-cover" loading="lazy" />
            <span>{item.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, index, showTaxLabel, showRating }: { product: StorefrontProduct; index: number; showTaxLabel: boolean; showRating: boolean }) {
  return (
    <article className="rounded-md border border-neutral-200 bg-white p-3 hover:border-amber-300" data-testid="product-card">
      <a href={product.href} className="block">
        <img src={product.image} alt={product.name} className="h-44 w-full rounded bg-neutral-50 object-cover md:h-48" loading="lazy" />
        <div className="mt-3 text-[11px] font-semibold text-neutral-500">{product.category}</div>
        {showRating ? <div className="mt-1 text-xs text-amber-500">★★★★★ <span className="text-neutral-500">({860 + index * 47})</span></div> : null}
        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold text-neutral-950">{product.name}</h3>
        <p className="mt-1 text-lg font-bold tracking-tight text-red-700">¥{product.price} {showTaxLabel ? <span className="text-[11px] font-normal text-neutral-500">税込</span> : null}</p>
      </a>
      <button
        className="mt-2 inline-flex h-8 w-full items-center justify-center rounded bg-[#FFD814] text-xs font-bold text-neutral-950 hover:bg-[#F7CA00]"
        type="button"
        data-cart-add
        data-testid="storefront-product-add-to-cart"
        data-product-id={product.id}
        data-product-name={product.name}
        data-product-price={String(product.price).replace(/[^\d]/g, "")}
        data-product-image={product.image}
      >
        カートに追加
      </button>
    </article>
  );
}

function StorefrontInteractionScript() {
  const script = `
(() => {
  const cartKey = "aiboux:shop:aiboux:cart";
  const readCart = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(cartKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const writeCart = (items) => {
    localStorage.setItem(cartKey, JSON.stringify(items));
    updateCartCount();
  };
  const updateCartCount = () => {
    const total = readCart().reduce((sum, item) => sum + Math.max(1, Number(item.quantity || 1)), 0);
    document.querySelectorAll("[data-cart-count]").forEach((node) => {
      node.textContent = String(total);
    });
  };
  const addToCart = (button) => {
    const id = button.getAttribute("data-product-id") || "";
    if (!id) return;
    const items = readCart();
    const existing = items.find((item) => item.id === id);
    if (existing) {
      existing.quantity = Math.min(99, Number(existing.quantity || 1) + 1);
    } else {
      items.push({
        id,
        productId: id,
        name: button.getAttribute("data-product-name") || "",
        price: Number(button.getAttribute("data-product-price") || 0),
        image: button.getAttribute("data-product-image") || "",
        purchaseMode: "normal",
        quantity: 1,
      });
    }
    writeCart(items);
    button.setAttribute("data-cart-added", "true");
    button.textContent = "カートに追加済み";
  };

  document.querySelectorAll("[data-cart-add]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      addToCart(button);
    });
  });
  updateCartCount();

  document.querySelectorAll("[data-hero-carousel]").forEach((carousel) => {
    let slides = [];
    try {
      slides = JSON.parse(carousel.getAttribute("data-slides") || "[]");
    } catch {
      slides = [];
    }
    slides = slides.filter((slide) => slide && slide.id);
    if (slides.length < 2) return;

    const loop = carousel.getAttribute("data-loop") !== "false";
    const autoplay = carousel.getAttribute("data-autoplay") === "true";
    const intervalMs = Math.max(3000, Number(carousel.getAttribute("data-interval-ms") || 5000));
    const transitionMs = 560;
    const easing = "cubic-bezier(0.22, 1, 0.36, 1)";
    const offset = "calc(14% + 12px)";
    const track = carousel.querySelector("[data-hero-track]");
    const main = carousel.querySelector("[data-testid='hero-slide-main']");
    const prev = carousel.querySelector("[data-testid='hero-slide-prev']");
    const next = carousel.querySelector("[data-testid='hero-slide-next']");
    const mainImg = carousel.querySelector("[data-hero-main-img]");
    const title = carousel.querySelector("[data-hero-title]");
    const subtitle = carousel.querySelector("[data-hero-subtitle]");
    const cta = carousel.querySelector("[data-hero-cta]");
    const dots = [...carousel.querySelectorAll("[data-hero-dot]")];
    const prevButton = carousel.querySelector("[data-hero-prev-button]");
    const nextButton = carousel.querySelector("[data-hero-next-button]");
    let index = 0;
    let timer = 0;
    let paused = false;
    let transitioning = false;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerTracking = false;

    const slideAt = (position) => slides[(position + slides.length) % slides.length];
    const setTrackTransition = (enabled) => {
      if (!track) return;
      track.style.transition = enabled ? "transform " + transitionMs + "ms " + easing : "none";
    };
    const resetTrack = () => {
      if (!track) return;
      setTrackTransition(false);
      track.style.transform = "translate3d(0, 0, 0)";
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setTrackTransition(true));
      });
    };
    const setSide = (node, slide) => {
      if (!node || !slide) return;
      node.setAttribute("data-slide-id", slide.id);
      const image = node.querySelector("img");
      const sideTitle = node.querySelector("[data-hero-side-title]");
      if (image) image.setAttribute("src", slide.imageUrl || "");
      if (sideTitle) sideTitle.textContent = slide.title || "";
    };
    const render = () => {
      const current = slideAt(index);
      const previous = slideAt(index - 1);
      const following = slideAt(index + 1);
      carousel.setAttribute("data-current-slide-id", current.id);
      if (main) main.setAttribute("data-slide-id", current.id);
      if (mainImg) mainImg.setAttribute("src", current.imageUrl || "");
      if (title) title.textContent = current.title || "";
      if (subtitle) subtitle.textContent = current.subtitle || "";
      if (cta) {
        cta.textContent = current.ctaText || "詳しく見る";
        cta.setAttribute("href", current.ctaHref || "/s/aiboux/products");
      }
      setSide(prev, previous);
      setSide(next, following);
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === index;
        dot.setAttribute("aria-current", active ? "true" : "false");
        dot.classList.toggle("bg-slate-900", active);
        dot.classList.toggle("bg-slate-300", !active);
      });
    };
    const completeMove = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;
      render();
      resetTrack();
      transitioning = false;
      carousel.setAttribute("data-hero-animating", "false");
    };
    const move = (delta, animate = true) => {
      if (transitioning) return;
      const nextIndex = index + delta;
      if (!loop && (nextIndex < 0 || nextIndex >= slides.length)) return;
      if (!animate || !track) {
        completeMove(nextIndex);
        return;
      }
      transitioning = true;
      carousel.setAttribute("data-hero-animating", "true");
      setTrackTransition(true);
      track.style.transform = delta > 0 ? "translate3d(calc(-1 * " + offset + "), 0, 0)" : "translate3d(" + offset + ", 0, 0)";
      window.setTimeout(() => completeMove(nextIndex), transitionMs);
    };
    const goTo = (targetIndex) => {
      if (transitioning) return;
      const normalized = ((targetIndex % slides.length) + slides.length) % slides.length;
      if (normalized === index) return;
      const forward = (normalized - index + slides.length) % slides.length;
      const backward = (index - normalized + slides.length) % slides.length;
      move(forward <= backward ? forward : -backward);
    };
    const restart = () => {
      window.clearInterval(timer);
      if (!autoplay) return;
      timer = window.setInterval(() => {
        if (!paused) move(1);
      }, intervalMs);
    };

    prevButton?.addEventListener("click", () => {
      move(-1);
      restart();
    });
    nextButton?.addEventListener("click", () => {
      move(1);
      restart();
    });
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        goTo(Number(dot.getAttribute("data-hero-dot") || 0) % slides.length);
        restart();
      });
    });
    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    });
    carousel.addEventListener("pointerdown", (event) => {
      pointerTracking = true;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
    });
    carousel.addEventListener("pointerup", (event) => {
      if (!pointerTracking) return;
      pointerTracking = false;
      const dx = event.clientX - pointerStartX;
      const dy = event.clientY - pointerStartY;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
      move(dx < 0 ? 1 : -1);
      restart();
    });
    carousel.addEventListener("pointercancel", () => {
      pointerTracking = false;
    });
    carousel.addEventListener("mouseenter", () => { paused = true; });
    carousel.addEventListener("mouseleave", () => { paused = false; });
    carousel.addEventListener("focusin", () => { paused = true; });
    carousel.addEventListener("focusout", () => { paused = false; });
    setTrackTransition(true);
    render();
    restart();
  });
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

function normalizeHeroSlides(slides: StorefrontLayout["pages"]["top"]["heroSlider"]["slides"]) {
  const merged = [...slides, ...storefrontHeroDefaults].filter((slide) => slide.enabled);
  return merged.slice(0, Math.max(3, merged.length)).map((slide, index) => {
    const fallback = storefrontHeroDefaults[index % storefrontHeroDefaults.length];
    const weak = isWeakImage(slide.imageUrl);
    return {
      ...slide,
      imageUrl: weak ? fallback.imageUrl : slide.imageUrl,
      title: weak ? fallback.title : slide.title || fallback.title,
      subtitle: weak ? fallback.subtitle : slide.subtitle || fallback.subtitle,
      ctaText: weak ? fallback.ctaText : slide.ctaText || fallback.ctaText,
      ctaHref: weak ? fallback.ctaHref : slide.ctaHref || fallback.ctaHref,
    };
  });
}

function buildSalesReadyProducts(products: StorefrontProduct[]) {
  const realProducts = products
    .filter((product) => !isPublicTestProduct(product.name))
    .map((product, index) => toSalesReadyProduct(product, index));
  const merged = [...curatedStorefrontProducts, ...realProducts].filter((product, index, array) => {
    const duplicateName = array.findIndex((item) => item.name === product.name) !== index;
    return !duplicateName;
  });
  return merged.slice(0, Math.max(10, merged.length));
}

function rotateProducts(products: StorefrontProduct[], offset: number) {
  if (!products.length) return curatedStorefrontProducts;
  return [...products.slice(offset), ...products.slice(0, offset)];
}

function isWeakImage(value: string | null | undefined) {
  if (!value) return true;
  return /placeholder|skeleton|gray|grey|画像なし|no-image|\/shop\/design\/hero-/i.test(value);
}

function toSalesReadyProduct(product: StorefrontProduct, index: number): StorefrontProduct {
  const category = inferCategory(product);
  return {
    ...product,
    category,
    image: imageForProduct(product.name, category, index),
    href: product.href || "/s/aiboux/products",
  };
}

function inferCategory(product: StorefrontProduct) {
  const source = `${product.name} ${product.category}`.toLowerCase();
  if (/コーヒー|珈琲|茶|coffee|tea/.test(source)) return "コーヒー・お茶";
  if (/ボトル|水筒|保存|キッチン|kitchen|bottle/.test(source)) return "キッチン用品";
  if (/タオル|寝具|布|towel/.test(source)) return "タオル・寝具";
  if (/食品|飲料|菓子|パン|food|drink|snack/.test(source)) return "食品・飲料";
  if (/洗剤|掃除|日用品|ホームケア|daily|clean/.test(source)) return "日用品";
  if (/ペット|pet/.test(source)) return "ペット用品";
  if (/美容|コスメ|スキン|beauty|skin/.test(source)) return "ビューティー";
  if (/ギフト|gift/.test(source)) return "ギフト";
  if (/文具|本|stationery|book/.test(source)) return "本・文具";
  if (/家電|電/.test(source)) return "キッチン用品";
  return product.category && product.category !== "未分類" ? product.category : "日用品";
}

function imageForProduct(name: string, category: string, index: number) {
  const source = `${name} ${category}`.toLowerCase();
  const directMatch = /ゆめぴりか|米|rice/.test(source)
    ? "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=720&h=720&q=82"
    : /保存容器|クロス|キッチン/.test(source)
      ? "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=720&h=720&q=82"
      : /文具|本|stationery|book/.test(source)
        ? "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=720&h=720&q=82"
        : /スポーツ|アウトドア|sports|outdoor/.test(source)
          ? "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=720&h=720&q=82"
          : /セール|sale/.test(source)
            ? "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=720&h=720&q=82"
            : /ランキング|ranking/.test(source)
              ? "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=720&h=720&q=82"
              : "";
  if (directMatch) return `${directMatch}&sig=${encodeURIComponent(`direct-${index}-${name}`)}`;
  const images = {
    coffee: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=720&h=720&q=82",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=720&h=720&q=82",
    ],
    bottle: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=720&h=720&q=82",
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=720&h=720&q=82",
    ],
    towel: [
      "https://images.unsplash.com/photo-1724847885015-be191f1a47ef?auto=format&fit=crop&w=720&h=720&q=82",
      "https://images.unsplash.com/photo-1724847885015-be191f1a47ef?auto=format&fit=crop&w=720&h=720&q=82",
    ],
    food: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=720&h=720&q=82",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=720&h=720&q=82",
    ],
    kitchen: [
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=720&h=720&q=82",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=720&h=720&q=82",
    ],
    daily: [
      "https://images.unsplash.com/photo-1576503276229-998652dc7e56?auto=format&fit=crop&w=720&h=720&q=82",
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=720&h=720&q=82",
    ],
    beauty: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=720&h=720&q=82",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=720&h=720&q=82",
    ],
    pet: [
      "https://images.unsplash.com/photo-1741942732341-d1ec386afd68?auto=format&fit=crop&w=720&h=720&q=82",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=720&h=720&q=82",
    ],
    gift: [
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=720&h=720&q=82",
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=720&h=720&q=82",
    ],
    stationery: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=720&h=720&q=82",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=720&h=720&q=82",
    ],
  };
  const key = /コーヒー|茶|coffee|tea/.test(source)
    ? "coffee"
    : /ボトル|水筒|bottle/.test(source)
      ? "bottle"
      : /タオル|寝具|towel/.test(source)
        ? "towel"
        : /食品|飲料|菓子|パン|food|drink|snack/.test(source)
          ? "food"
          : /キッチン|保存|家電|kitchen/.test(source)
            ? "kitchen"
            : /ペット|pet/.test(source)
                ? "pet"
                : /美容|コスメ|スキン|beauty|skin/.test(source)
                  ? "beauty"
	                : /ギフト|gift/.test(source)
	                  ? "gift"
	                  : /文具|本|stationery|book/.test(source)
	                    ? "stationery"
	                    : "daily";
  const variants = images[key];
  return `${variants[index % variants.length]}&sig=${encodeURIComponent(`${key}-${index}-${name}`)}`;
}

function isPublicTestProduct(name: string) {
  return /公開検証商品|検証商品|テスト商品|dummy|sample|test product/i.test(name);
}

function priceAdd(price: string, amount: number) {
  const number = Number(price.replace(/[^\d]/g, "")) || 0;
  return (number + amount).toLocaleString("ja-JP");
}
