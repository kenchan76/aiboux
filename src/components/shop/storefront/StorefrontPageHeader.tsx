import type { ShopStorefrontPageHeaderAction } from "@/lib/shopStorefrontShared";

type StorefrontPageHeaderProps = {
  storeName: string;
  title: string;
  description: string;
  actions: ShopStorefrontPageHeaderAction[];
  className?: string;
};

export function StorefrontPageHeader({
  storeName,
  title,
  description,
  actions,
  className = "",
}: StorefrontPageHeaderProps) {
  const visibleActions = actions.filter((action) => action.href && action.label).slice(0, 4);

  return (
    <section
      className={`mb-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm ${className}`}
      data-testid="storefront-page-header"
      aria-labelledby="storefront-page-title"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700">{storeName}</p>
          <h1 id="storefront-page-title" className="mt-2 text-2xl font-bold tracking-tight text-neutral-950">
            {title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">{description}</p>
        </div>
        <nav
          className="flex flex-wrap gap-2"
          aria-label={`${title} の主要導線`}
          itemScope
          itemType="https://schema.org/SiteNavigationElement"
        >
          {visibleActions.map((action) => (
            <a
              key={`${action.href}-${action.label}`}
              className={
                action.tone === "primary"
                  ? "inline-flex h-10 items-center justify-center rounded-full bg-amber-400 px-4 text-sm font-bold text-neutral-950 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  : "inline-flex h-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 text-sm font-bold text-blue-700 underline-offset-4 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300"
              }
              href={action.href}
              itemProp="url"
            >
              <span itemProp="name">{action.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
