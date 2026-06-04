import type { ShopStorefrontSeoChecklist } from "@/lib/shopStorefrontShared";

type StorefrontSeoChecklistProps = {
  checklist: ShopStorefrontSeoChecklist;
  className?: string;
};

export function StorefrontSeoChecklist({ checklist, className = "" }: StorefrontSeoChecklistProps) {
  if (!checklist.items.length) return null;

  return (
    <section
      className={`mt-5 rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/70 p-5 shadow-sm ${className}`}
      data-testid="storefront-seo-checklist"
      aria-labelledby="storefront-seo-checklist-title"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">SEO / UI checklist</p>
          <h2 id="storefront-seo-checklist-title" className="mt-1 text-lg font-bold text-neutral-950" itemProp="name">
            {checklist.title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600" itemProp="description">
            {checklist.summary}
          </p>
        </div>
        <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-800 ring-1 ring-blue-100">
          共通SEO部品
        </span>
      </div>
      <meta itemProp="numberOfItems" content={String(checklist.items.length)} />
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {checklist.items.map((item, index) => (
          <article
            key={`${item.title}-${item.href}`}
            className="group rounded-lg border border-blue-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <meta itemProp="position" content={String(index + 1)} />
            <span className="inline-flex rounded-full bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-800 ring-1 ring-blue-100">
              {item.badge}
            </span>
            <h3 className="mt-3 min-h-[2.5rem] text-sm font-bold leading-5 text-neutral-950" itemProp="name">
              {item.title}
            </h3>
            <p className="mt-2 min-h-[4.5rem] text-sm leading-6 text-neutral-600">{item.body}</p>
            <a
              className="mt-3 inline-flex text-sm font-bold text-blue-700 underline underline-offset-4 group-hover:text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
