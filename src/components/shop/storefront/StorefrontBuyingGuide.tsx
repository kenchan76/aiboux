import type { ShopStorefrontBuyingGuideItem } from "@/lib/shopStorefrontShared";
import { cn } from "@/lib/utils";

type StorefrontBuyingGuideProps = {
  items: ShopStorefrontBuyingGuideItem[];
  pageLabel?: string;
  className?: string;
};

export function StorefrontBuyingGuide({ items, pageLabel = "このページ", className = "" }: StorefrontBuyingGuideProps) {
  const visibleItems = items.filter((item) => item.question && item.answer && item.href);
  if (!visibleItems.length) return null;

  return (
    <section
      className={cn("mt-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm", className)}
      data-testid="storefront-buying-guide"
      aria-labelledby="storefront-buying-guide-title"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <div className="flex flex-col gap-2 border-b border-neutral-100 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Buying guide</p>
          <h2 id="storefront-buying-guide-title" className="mt-1 text-lg font-bold text-neutral-950">
            {pageLabel}の購入前チェック
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
            価格、税込、配送、返品、決済、定期購入の状態をページごとに整理し、購入前に必要な確認先へ進めます。
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
          購入前に確認
        </span>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {visibleItems.map((item) => (
          <article
            key={item.question}
            className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"
            itemProp="hasPart"
            itemScope
            itemType="https://schema.org/WebPage"
          >
            <h3 className="text-sm font-bold leading-6 text-neutral-950" itemProp="name">
              {item.question}
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{item.answer}</p>
            <a
              className="mt-3 inline-flex text-sm font-bold text-blue-700 underline-offset-2 hover:text-blue-950 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              href={item.href}
              itemProp="url"
            >
              {item.label}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
