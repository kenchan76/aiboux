import type { ShopBreadcrumbItem } from "@/lib/shopSeo";
import { cn } from "@/lib/utils";

type StorefrontBreadcrumbProps = {
  items: ShopBreadcrumbItem[];
  className?: string;
};

export function StorefrontBreadcrumb({ items, className }: StorefrontBreadcrumbProps) {
  if (!items.length) return null;

  return (
    <nav
      className={cn("flex flex-wrap items-center gap-1 text-xs text-neutral-500", className)}
      aria-label="パンくずリスト"
      data-testid="storefront-breadcrumb"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
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
                <span className="font-semibold text-neutral-700" aria-current="page" itemProp="name">
                  {item.name}
                </span>
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
  );
}
