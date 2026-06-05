import {
  buildShopSupportRailCards,
  buildShopSupportRailQuickLinks,
} from "@/lib/shopStorefrontShared";

type StorefrontSupportRailProps = {
  tenantRoot: string;
  className?: string;
};

export function StorefrontSupportRail({ tenantRoot, className = "" }: StorefrontSupportRailProps) {
  const cards = buildShopSupportRailCards(tenantRoot);
  const quickLinks = buildShopSupportRailQuickLinks(tenantRoot);

  return (
    <section
      className={`mt-6 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm ${className}`}
      data-testid="storefront-support-rail"
      aria-labelledby="storefront-support-rail-title"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Shopping guide</p>
          <h2 id="storefront-support-rail-title" className="mt-1 text-lg font-bold text-neutral-950">
            迷わず買えるための確認導線
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
            商品比較、配送・返品、注文後の確認、定期購入の状態まで、必要なページへ迷わず移動できます。
          </p>
        </div>
        <a
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-amber-400 px-5 text-sm font-bold text-neutral-950 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600"
          href={`${tenantRoot}/products`}
          itemProp="url"
        >
          <span itemProp="name">商品一覧を見る</span>
        </a>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <a
            key={card.title}
            className="group rounded-lg border border-neutral-200 bg-neutral-50 p-4 transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            href={card.href}
            itemProp="url"
          >
            <h3 className="text-sm font-bold text-neutral-950" itemProp="name">{card.title}</h3>
            <p className="mt-2 min-h-[3rem] text-sm leading-6 text-neutral-600">{card.body}</p>
            <span className="mt-3 inline-flex text-xs font-bold text-blue-700 underline-offset-4 group-hover:text-blue-900 group-hover:underline">
              {card.label ?? "詳しく見る"}
            </span>
          </a>
        ))}
      </div>
      <nav className="mt-4 flex flex-wrap gap-2 border-t border-neutral-100 pt-4 text-sm" aria-label="購入サポート">
        {quickLinks.map((link) => (
          <a
            key={link.href}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 font-semibold text-blue-700 underline-offset-4 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300"
            href={link.href}
            itemProp="url"
          >
            <span itemProp="name">{link.label}</span>
          </a>
        ))}
      </nav>
    </section>
  );
}
