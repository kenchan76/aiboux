import type { ShopStorefrontContextLinkSection } from "@/lib/shopStorefrontShared";

type StorefrontContextLinksProps = {
  sections: ShopStorefrontContextLinkSection[];
  className?: string;
};

export function StorefrontContextLinks({ sections, className = "" }: StorefrontContextLinksProps) {
  const visibleSections = sections.filter((section) => section.links.length > 0);
  if (!visibleSections.length) return null;

  return (
    <section
      className={`mt-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm ${className}`}
      data-testid="storefront-context-links"
      aria-labelledby="storefront-context-links-title"
    >
      <div className="flex flex-col gap-2 border-b border-neutral-100 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Related navigation</p>
          <h2 id="storefront-context-links-title" className="mt-1 text-lg font-bold text-neutral-950">
            このページから次に確認すること
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
            商品探し、購入前の確認、購入後サポートをページごとに整理し、必要な案内へすぐ移動できます。
          </p>
        </div>
      </div>
      <nav
        className="mt-4 grid gap-3 lg:grid-cols-4"
        aria-label="関連する内部リンク"
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
      >
        {visibleSections.map((section) => (
          <section key={section.title} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <h3 className="text-sm font-bold text-neutral-950">{section.title}</h3>
            <p className="mt-2 min-h-[3rem] text-xs leading-5 text-neutral-600">{section.summary}</p>
            <ul className="mt-3 grid gap-2 text-sm">
              {section.links.map((link) => (
                <li key={`${section.title}-${link.href}-${link.label}`} itemProp="hasPart" itemScope itemType="https://schema.org/WebPage">
                  <a
                    className="font-semibold text-blue-700 underline-offset-2 hover:text-blue-950 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    href={link.href}
                    itemProp="url"
                  >
                    <span itemProp="name">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </section>
  );
}
