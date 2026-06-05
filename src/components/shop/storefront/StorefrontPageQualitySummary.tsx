import type { ShopStorefrontPageQualitySummary } from "@/lib/shopStorefrontShared";

type StorefrontPageQualitySummaryProps = {
  summary: ShopStorefrontPageQualitySummary;
  className?: string;
};

export function StorefrontPageQualitySummary({ summary, className = "" }: StorefrontPageQualitySummaryProps) {
  const signals = summary.signals.filter((signal) => signal.href && signal.label);
  if (!signals.length) return null;

  return (
    <section
      className={`mb-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm ${className}`}
      data-testid="storefront-page-quality-summary"
      aria-labelledby="storefront-page-quality-summary-title"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_1.35fr] xl:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Page guide</p>
          <h2 id="storefront-page-quality-summary-title" className="mt-1 text-lg font-bold text-neutral-950">
            {summary.pageLabel}で確認できること
          </h2>
          <div className="mt-3 grid gap-2 text-sm leading-6 text-neutral-700">
            <p>
              <strong className="text-neutral-950">探せること:</strong> {summary.intent}
            </p>
            <p>
              <strong className="text-neutral-950">確認できること:</strong> {summary.seoRole}
            </p>
            <p>
              <strong className="text-neutral-950">次の操作:</strong> {summary.userAction}
            </p>
          </div>
        </div>
        <nav className="grid gap-2 sm:grid-cols-2" aria-label={`${summary.pageLabel}の購入・検索補助リンク`}>
          {signals.map((signal) => (
            <a
              key={`${signal.title}-${signal.href}`}
              className="group rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-blue-700 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-950 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              href={signal.href}
              itemProp="url"
            >
              <span className="inline-flex rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-blue-700 ring-1 ring-blue-100">
                {signal.badge}
              </span>
              <h3 className="mt-2 text-sm font-bold text-neutral-950" itemProp="name">
                {signal.title}
              </h3>
              <p className="mt-1 min-h-[2.5rem] text-xs leading-5 text-neutral-600">{signal.body}</p>
              <span className="mt-2 inline-flex text-xs font-bold text-blue-700 underline-offset-2 group-hover:text-blue-950 group-hover:underline">
                {signal.label}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
