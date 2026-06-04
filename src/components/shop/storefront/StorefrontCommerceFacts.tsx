import { buildShopCommerceFacts } from "@/lib/shopStorefrontShared";
import { cn } from "@/lib/utils";

type StorefrontCommerceFactsProps = {
  tenantRoot: string;
  page?: string;
  productName?: string | null;
  priceLabel?: string | null;
  inStock?: boolean | null;
  subscriptionSchemaPending?: boolean;
  compact?: boolean;
  className?: string;
};

const toneClass = {
  neutral: "border-neutral-200 bg-neutral-50 text-neutral-700",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  blue: "border-blue-200 bg-blue-50 text-blue-900",
  red: "border-red-200 bg-red-50 text-red-900",
  green: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

export function StorefrontCommerceFacts({
  tenantRoot,
  page = "",
  productName = null,
  priceLabel = null,
  inStock = true,
  subscriptionSchemaPending = false,
  compact = false,
  className = "",
}: StorefrontCommerceFactsProps) {
  const facts = buildShopCommerceFacts(tenantRoot, {
    page,
    productName,
    priceLabel,
    inStock,
    subscriptionSchemaPending,
  });

  return (
    <section
      className={cn("rounded-xl border border-neutral-200 bg-white shadow-sm", compact ? "p-3" : "p-4", className)}
      data-testid="storefront-commerce-facts"
      aria-labelledby="storefront-commerce-facts-title"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <div className={cn("flex flex-col gap-2", compact ? "" : "md:flex-row md:items-end md:justify-between")}>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Purchase facts</p>
          <h2 id="storefront-commerce-facts-title" className={cn("mt-1 font-bold text-neutral-950", compact ? "text-base" : "text-lg")}>
            価格・配送・返品・決済を購入前に確認
          </h2>
        </div>
        <a
          className="inline-flex h-9 w-fit items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 text-xs font-bold text-blue-700 underline-offset-4 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300"
          href={`${tenantRoot}/faq`}
          itemProp="url"
        >
          <span itemProp="name">よくある質問</span>
        </a>
      </div>
      <div className={cn("mt-3 grid gap-2", compact ? "grid-cols-1" : "sm:grid-cols-2 xl:grid-cols-5")}>
        {facts.map((fact) => (
          <a
            key={`${fact.title}-${fact.href}`}
            className={cn(
              "group rounded-lg border p-3 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300",
              toneClass[fact.tone ?? "neutral"],
            )}
            href={fact.href}
            itemProp="url"
          >
            <span className="inline-flex rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold">{fact.badge}</span>
            <h3 className="mt-2 text-sm font-bold text-neutral-950" itemProp="name">
              {fact.title}
            </h3>
            <p className="mt-1 text-xs leading-5">{fact.body}</p>
            <span className="mt-2 inline-flex text-xs font-bold text-blue-700 underline-offset-2 group-hover:text-blue-950 group-hover:underline">
              {fact.label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
