import type { ShopBreadcrumbItem } from "@/lib/shopSeo";
import type { ShopStorefrontBreadcrumbSupportLink } from "@/lib/shopStorefrontShared";
import { cn } from "@/lib/utils";

type StorefrontBreadcrumbProps = {
  items: ShopBreadcrumbItem[];
  supportLinks?: ShopStorefrontBreadcrumbSupportLink[];
  className?: string;
};

export function StorefrontBreadcrumb({ items, supportLinks = [], className }: StorefrontBreadcrumbProps) {
  if (!items.length) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-4",
        className,
      )}
      data-testid="storefront-breadcrumb-shell"
    >
      <nav
        className="flex min-w-0 flex-wrap items-center gap-1 text-xs text-neutral-500"
        aria-label="パンくずリスト"
        data-testid="storefront-breadcrumb"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <span className="mr-1 shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-bold text-neutral-700">
          現在地
        </span>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1 || !item.href;

          return (
            <span
              key={`${item.name}-${index}`}
              className="inline-flex items-center gap-1"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 ? <span className="px-1 text-neutral-300" aria-hidden="true">/</span> : null}
              {isCurrent ? (
                <>
                  <span className="font-semibold text-neutral-700" aria-current="page" data-testid="storefront-breadcrumb-current">
                    {item.visibleName ?? item.name}
                  </span>
                  <meta itemProp="name" content={item.name} />
                  <meta itemProp="item" content={item.url} />
                </>
              ) : (
                <a
                  className="font-semibold text-blue-700 underline-offset-2 hover:text-blue-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  href={item.href}
                  itemProp="item"
                >
                  <span itemProp="name">{item.name}</span>
                </a>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </span>
          );
        })}
      </nav>

      {supportLinks.length ? (
        <nav
          className="mt-2 flex min-w-0 flex-wrap gap-2 sm:mt-0 sm:justify-end"
          aria-label="パンくず関連リンク"
          data-testid="storefront-breadcrumb-support-links"
          itemScope
          itemType="https://schema.org/SiteNavigationElement"
        >
          {supportLinks.slice(0, 4).map((link) => (
            <a
              key={`${link.href}-${link.label}`}
              className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 underline-offset-2 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-950 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              href={link.href}
              itemProp="url"
              title={link.note}
            >
              <span itemProp="name">{link.label}</span>
            </a>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
