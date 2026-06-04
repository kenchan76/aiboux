import type { ShopStorefrontTrustMatrix } from "@/lib/shopStorefrontShared";

type StorefrontTrustMatrixProps = {
  trustMatrix: ShopStorefrontTrustMatrix;
  className?: string;
};

export function StorefrontTrustMatrix({ trustMatrix, className = "" }: StorefrontTrustMatrixProps) {
  if (!trustMatrix.signals.length) return null;

  return (
    <section
      className={`mt-5 rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70 p-5 shadow-sm ${className}`}
      data-testid="storefront-trust-matrix"
      aria-labelledby="storefront-trust-matrix-title"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Trust / proof matrix</p>
          <h2 id="storefront-trust-matrix-title" className="mt-1 text-lg font-bold text-neutral-950" itemProp="name">
            {trustMatrix.title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600" itemProp="description">
            {trustMatrix.summary}
          </p>
        </div>
        <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-100">
          購入前の信頼
        </span>
      </div>
      <p className="mt-3 rounded-lg border border-emerald-100 bg-white px-3 py-2 text-sm leading-6 text-neutral-700">
        {trustMatrix.pageContext}
      </p>
      <meta itemProp="numberOfItems" content={String(trustMatrix.signals.length)} />
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {trustMatrix.signals.map((signal, index) => (
          <article
            key={`${signal.title}-${signal.href}`}
            className="group flex min-h-[13rem] flex-col rounded-lg border border-emerald-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <meta itemProp="position" content={String(index + 1)} />
            <span className="inline-flex w-fit rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-800 ring-1 ring-emerald-100">
              {signal.badge}
            </span>
            <h3 className="mt-3 text-sm font-bold leading-5 text-neutral-950" itemProp="name">
              {signal.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{signal.body}</p>
            <p className="mt-3 rounded-md bg-neutral-50 px-3 py-2 text-xs leading-5 text-neutral-600">
              {signal.proof}
            </p>
            <a
              className="mt-auto inline-flex pt-3 text-sm font-bold text-blue-700 underline underline-offset-4 group-hover:text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-300"
              href={signal.href}
              itemProp="url"
            >
              {signal.label}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
