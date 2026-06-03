import {
  Bell,
  ChevronRight,
  Gift,
  Globe2,
  Headphones,
  HeartHandshake,
  HelpCircle,
  MapPin,
  Menu,
  PackageCheck,
  RotateCcw,
  Search,
  ShoppingCart,
  Star,
  Store,
  Truck,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { shopProducts, formatYen, type ShopProduct } from "@/data/shop-sample-data";

const categories = ["食品・お菓子", "日用品", "家電", "北海道特産品", "ギフト", "健康", "コスメ・美容", "ベビー・キッズ", "ペット用品", "本・文具", "DIY・工具", "セール", "ランキング"];

const promoCards = [
  { icon: Truck, title: "最短当日お届け", text: "12時までのご注文で当日発送", tone: "blue" },
  { icon: Gift, title: "新規会員登録で500ポイント", text: "今すぐ登録する", tone: "amber" },
  { icon: PackageCheck, title: "定期便でいつでもおトク", text: "最大15%OFFでお届け", tone: "rose" },
];

const rightPromos = [
  { title: "本日限定タイムセール", text: "最大50%OFF / 人気商品が今だけおトク", badge: "SALE" },
  { title: "ギフト・贈り物特集", text: "のし・ラッピング無料 / 心を込めてお届け", badge: "GIFT" },
  { title: "安心・便利なサービス", text: "返品送料無料・サポート充実", badge: "SAFE" },
];

const serviceItems = [
  { icon: Truck, title: "全国送料無料", text: "一部地域を除く" },
  { icon: PackageCheck, title: "最短当日発送", text: "12時までのご注文" },
  { icon: RotateCcw, title: "30日間返品無料", text: "一部商品を除く" },
  { icon: Star, title: "ポイントが貯まる", text: "1ポイント=1円" },
  { icon: HeartHandshake, title: "定期便でお得", text: "最大15%OFF" },
  { icon: Gift, title: "ギフト包装", text: "大切な方への贈り物" },
];

const categoryTiles = ["食品・お菓子", "日用品・雑貨", "家電・カメラ", "コスメ・美容", "ベビー・キッズ", "ペット用品"];
const brandTiles = ["IRIS OHYAMA", "THERMOS", "KIRIN", "Panasonic", "SHARP", "dyson"];

export function ShopStorefrontHome() {
  const recommendations = enrichProducts(shopProducts);
  const ranking = recommendations.slice(1).concat(recommendations.slice(0, 1));
  const sale = recommendations.slice().reverse();

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <UtilityBar />
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-[1980px] items-center gap-4 px-6 py-4">
          <a href="/s/aiboux/" className="min-w-[210px]">
            <div className="flex items-end gap-1">
              <span className="text-3xl font-black tracking-tight">aiboux</span>
              <span className="pb-1 text-lg font-black text-blue-700">SHOP</span>
            </div>
            <div className="-mt-0.5 text-xs font-medium text-neutral-500">いいものを、もっと身近に。</div>
          </a>
          <div className="flex min-w-0 flex-1 overflow-hidden rounded-md border-2 border-blue-600 bg-white">
            <button type="button" className="h-11 shrink-0 border-r border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-700">
              すべてのカテゴリ
            </button>
            <Input className="h-11 rounded-none border-0 shadow-none focus-visible:ring-0" placeholder="キーワード・商品名・ブランド名で検索" />
            <Button className="h-11 rounded-none bg-blue-700 px-8 hover:bg-blue-800">
              <Search className="mr-1.5 size-4" />
              検索
            </Button>
          </div>
          <HeaderAction icon={<UserRound className="size-6" />} label="ログイン" sub="アカウントサービス" />
          <HeaderAction icon={<PackageCheck className="size-6" />} label="注文履歴" sub="返品もこちら" />
          <HeaderAction icon={<ShoppingCart className="size-7" />} label="カート" sub="0" strong />
        </div>
        <nav className="mx-auto flex max-w-[1980px] items-center gap-2 overflow-x-auto px-6">
          <a href="#categories" className="flex h-11 shrink-0 items-center gap-2 border border-b-0 border-neutral-200 bg-white px-4 text-sm font-semibold">
            <Menu className="size-4" />
            すべてのカテゴリ
          </a>
          {categories.map((category) => (
            <a key={category} href={`#${category}`} className="shrink-0 px-4 py-3 text-sm font-semibold text-neutral-700 hover:text-blue-700">
              {category}
            </a>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1980px] px-6 py-4">
        <section className="grid gap-4 xl:grid-cols-[390px_minmax(0,1fr)_370px]">
          <div className="grid gap-3">
            {promoCards.map((card) => <PromoCard key={card.title} {...card} />)}
          </div>
          <HeroPanel />
          <div className="grid gap-3">
            {rightPromos.map((promo) => <RightPromo key={promo.title} {...promo} />)}
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-0 rounded-md border border-neutral-200 bg-neutral-50 md:grid-cols-3 xl:grid-cols-6">
          {serviceItems.map((item) => <ServiceItem key={item.title} {...item} />)}
        </section>

        <div className="mt-5 grid gap-5">
          <ProductRail title="本日のおすすめ" products={recommendations} />
          <ProductRail title="売れ筋ランキング" products={ranking} ranking />
          <ProductRail title="タイムセール" products={sale} sale />
          <ProductRail title="あなたへのおすすめ" products={recommendations.slice(2).concat(recommendations.slice(0, 2))} />
        </div>

        <section className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <FeatureCard title="カテゴリ別特集" id="categories">
            <div className="grid grid-cols-3 gap-3">
              {categoryTiles.map((item, index) => (
                <div key={item} className="rounded-md border border-neutral-200 bg-white p-3 text-center">
                  <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-600">{index + 1}</div>
                  <div className="text-xs font-semibold">{item}</div>
                </div>
              ))}
            </div>
          </FeatureCard>
          <FeatureCard title="新着商品">
            <MiniList products={recommendations.slice(0, 4)} />
          </FeatureCard>
          <FeatureCard title="ギフト特集">
            <div className="grid grid-cols-2 gap-2">
              {["お中元・夏ギフト", "お歳暮・冬ギフト", "内祝い・お返し", "誕生日・記念日"].map((item) => (
                <div key={item} className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm font-semibold">{item}<div className="mt-1 text-xs font-normal text-neutral-500">人気ギフトランキング</div></div>
              ))}
            </div>
          </FeatureCard>
          <FeatureCard title="人気のブランド">
            <div className="grid grid-cols-2 gap-2">
              {brandTiles.map((brand) => (
                <div key={brand} className="flex h-14 items-center justify-center rounded-md border border-neutral-200 bg-white text-sm font-black text-neutral-700">{brand}</div>
              ))}
            </div>
          </FeatureCard>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-5">
          {["配送", "お支払い方法", "ポイントプログラム", "返品・交換", "出品者向け"].map((title, index) => (
            <div key={title} className="flex items-start gap-3 rounded-md border border-neutral-200 bg-white p-4">
              <Headphones className="mt-0.5 size-6 text-neutral-700" />
              <div>
                <div className="text-sm font-bold">{title}</div>
                <div className="mt-1 text-xs leading-5 text-neutral-500">{index === 4 ? "AIBOUX Shopへの出品相談はこちら" : "詳しい条件とサポート内容を確認できます"}</div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

function UtilityBar() {
  return (
    <div className="bg-[#122033] text-white">
      <div className="mx-auto flex h-8 max-w-[1980px] items-center justify-between px-6 text-xs">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />お届け先: 東京都千代田区</span>
          <span className="font-semibold">日本全国送料無料（一部地域を除く）</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5"><HelpCircle className="size-3.5" />ヘルプ・サポート</span>
          <span className="flex items-center gap-1.5"><Bell className="size-3.5" />お知らせ</span>
          <span className="flex items-center gap-1.5"><Store className="size-3.5" />出品者登録</span>
          <span>法人向け</span>
          <span className="flex items-center gap-1.5"><Globe2 className="size-3.5" />日本語</span>
        </div>
      </div>
    </div>
  );
}

function HeaderAction({ icon, label, sub, strong }: { icon: React.ReactNode; label: string; sub: string; strong?: boolean }) {
  return (
    <a href="#" className="flex shrink-0 items-center gap-2 text-sm">
      <span className="relative">{icon}{strong ? <Badge className="absolute -right-2 -top-2 size-5 justify-center rounded-full p-0 text-[10px]">0</Badge> : null}</span>
      <span><span className="block text-xs text-neutral-500">{label}</span><span className="block font-bold text-neutral-950">{sub}</span></span>
    </a>
  );
}

function PromoCard({ icon: Icon, title, text, tone }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string; tone: string }) {
  const toneClass = tone === "blue" ? "bg-blue-50 text-blue-800" : tone === "amber" ? "bg-amber-50 text-amber-800" : "bg-rose-50 text-rose-800";
  return (
    <Card className={`${toneClass} border-0 shadow-none`}>
      <CardContent className="flex items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-4"><Icon className="size-8" /><div><div className="text-base font-bold">{title}</div><div className="text-xs">{text}</div></div></div>
        <ChevronRight className="size-5" />
      </CardContent>
    </Card>
  );
}

function HeroPanel() {
  return (
    <section className="relative min-h-[260px] overflow-hidden rounded-md border border-neutral-200 bg-[linear-gradient(90deg,#fff_0%,#f8fafc_42%,#fff7ed_100%)]">
      <div className="absolute inset-y-0 left-0 w-1/3 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&h=380&fit=crop')] bg-cover bg-center opacity-75" />
      <div className="absolute inset-y-0 right-0 w-1/3 bg-[url('https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&h=380&fit=crop')] bg-cover bg-center opacity-75" />
      <div className="relative mx-auto flex min-h-[260px] max-w-xl flex-col items-center justify-center text-center">
        <Badge variant="secondary" className="mb-3 rounded-md">北海道特集</Badge>
        <h1 className="text-4xl font-black tracking-tight">北海道特産品特集</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-700">海の幸も、山の幸も。産地直送でお届けします。</p>
        <Button className="mt-5 bg-green-700 px-10 hover:bg-green-800">詳しく見る</Button>
      </div>
    </section>
  );
}

function RightPromo({ title, text, badge }: { title: string; text: string; badge: string }) {
  return <div className="rounded-md border border-neutral-200 bg-neutral-50 p-5"><Badge className="mb-2 rounded-md">{badge}</Badge><div className="text-base font-bold">{title}</div><div className="mt-1 text-xs text-neutral-600">{text}</div></div>;
}

function ServiceItem({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return <div className="flex items-center gap-3 border-r border-neutral-200 px-5 py-4 last:border-r-0"><Icon className="size-6 text-neutral-700" /><div><div className="text-sm font-bold">{title}</div><div className="text-xs text-neutral-500">{text}</div></div></div>;
}

function ProductRail({ title, products, ranking, sale }: { title: string; products: ShopProduct[]; ranking?: boolean; sale?: boolean }) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <a href="#" className="text-xs font-semibold text-blue-700">もっと見る</a>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
        {products.slice(0, 8).map((product, index) => <ProductCard key={`${title}-${product.id}`} product={product} rank={ranking ? index + 1 : undefined} sale={sale} />)}
      </div>
    </section>
  );
}

function ProductCard({ product, rank, sale }: { product: ShopProduct; rank?: number; sale?: boolean }) {
  return (
    <Card className="relative overflow-hidden shadow-none">
      {rank ? <Badge className="absolute left-2 top-2 z-10 rounded-sm bg-amber-600">{rank}</Badge> : null}
      {sale ? <Badge className="absolute left-2 top-2 z-10 rounded-sm bg-red-600">SALE</Badge> : null}
      <CardContent className="p-3">
        <div className="flex aspect-square items-center justify-center rounded-md bg-neutral-50">
          <img src={product.image} alt={product.name} className="h-full w-full object-contain p-2" loading="lazy" />
        </div>
        <a href={`/s/aiboux/product/${product.id}`} className="mt-2 line-clamp-2 min-h-9 text-xs font-semibold text-neutral-800 hover:text-blue-700">{product.name}</a>
        <div className="mt-1 text-[11px] text-amber-600">★★★★★ <span className="text-neutral-500">({Math.max(128, product.sales / 100).toFixed(0)})</span></div>
        <div className="mt-1 text-base font-black text-red-700">{formatYen(product.price)}</div>
        <Button size="sm" className="mt-2 h-7 w-full bg-[#FFD814] text-xs font-bold text-neutral-950 hover:bg-[#F7CA00]">カートに追加</Button>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return <Card id={id} className="shadow-none"><CardHeader className="flex flex-row items-center justify-between px-4 py-3"><CardTitle className="text-base">{title}</CardTitle><a href="#" className="text-xs font-semibold text-blue-700">もっと見る</a></CardHeader><CardContent className="px-4 pb-4">{children}</CardContent></Card>;
}

function MiniList({ products }: { products: ShopProduct[] }) {
  return <div className="grid gap-2">{products.map((product) => <div key={product.id} className="flex items-center gap-3 rounded-md border border-neutral-200 p-2"><img src={product.image} alt={product.name} className="size-14 rounded bg-neutral-50 object-contain" /><div className="min-w-0"><div className="truncate text-sm font-semibold">{product.name}</div><div className="text-xs font-bold text-red-700">{formatYen(product.price)}</div></div></div>)}</div>;
}

function enrichProducts(products: ShopProduct[]) {
  return products.length >= 8
    ? products
    : [
        ...products,
        ...products.map((product, index) => ({ ...product, id: `${product.id}-rec-${index}`, name: `${product.name} セット`, price: product.price + 380 })),
      ];
}
