import type { ShopStorefrontActionMap } from "@/lib/shopStorefrontShared";

type StorefrontPageActionMapProps = {
  actionMap: ShopStorefrontActionMap;
  className?: string;
};

export function StorefrontPageActionMap({ actionMap, className = "" }: StorefrontPageActionMapProps) {
  return (
    <section
      className={`mt-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm ${className}`}
      data-testid="storefront-page-action-map"
      aria-labelledby="storefront-page-action-map-title"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">次にできること</p>
          <h2 id="storefront-page-action-map-title" className="mt-1 text-lg font-bold text-neutral-950" itemProp="name">
            {actionMap.title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600" itemProp="description">
            {actionMap.summary}
          </p>
        </div>
        <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
          次にできること
        </span>
      </div>
      <meta itemProp="numberOfItems" content={String(actionMap.steps.length)} />
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {actionMap.steps.map((step, index) => (
          <article
            key={`${step.href}-${step.title}`}
            className="group rounded-lg border border-neutral-200 bg-neutral-50 p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-md"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <meta itemProp="position" content={String(index + 1)} />
            <span className="inline-flex rounded-full bg-white px-2 py-1 text-[11px] font-bold text-blue-800 ring-1 ring-blue-100">
              {step.badge}
            </span>
            <h3 className="mt-3 min-h-[2.5rem] text-sm font-bold leading-5 text-neutral-950" itemProp="name">
              {step.title}
            </h3>
            <p className="mt-2 min-h-[4.5rem] text-sm leading-6 text-neutral-600">
              {step.body}
            </p>
            <a
              className="mt-3 inline-flex text-sm font-bold text-blue-700 underline-offset-4 group-hover:text-blue-950 group-hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300"
              href={step.href}
              itemProp="url"
            >
              {step.label}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
