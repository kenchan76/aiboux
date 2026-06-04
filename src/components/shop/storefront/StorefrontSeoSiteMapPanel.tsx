import type { ShopStorefrontSeoSiteMapPanel } from "@/lib/shopStorefrontShared";

type StorefrontSeoSiteMapPanelProps = {
  siteMap: ShopStorefrontSeoSiteMapPanel;
  className?: string;
};

export function StorefrontSeoSiteMapPanel({ siteMap, className = "" }: StorefrontSeoSiteMapPanelProps) {
  return (
    <section
      className={`my-6 rounded-xl border border-blue-200 bg-blue-50/70 p-5 shadow-sm ${className}`}
      data-testid="storefront-seo-sitemap-panel"
      aria-labelledby="storefront-seo-sitemap-panel-title"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="numberOfItems" content={String(siteMap.nodes.length)} />
      <div className="grid gap-4 border-b border-blue-100 pb-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Crawl map</p>
          <h2 id="storefront-seo-sitemap-panel-title" className="mt-1 text-xl font-bold tracking-tight text-neutral-950">
            {siteMap.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-700">{siteMap.summary}</p>
        </div>
        <dl className="grid gap-2 rounded-lg border border-blue-100 bg-white p-3 text-xs leading-5 text-neutral-700">
          <div>
            <dt className="font-bold text-neutral-950">ページ役割</dt>
            <dd>{siteMap.pageRole}</dd>
          </div>
          <div>
            <dt className="font-bold text-neutral-950">canonical</dt>
            <dd className="break-all text-blue-700">{siteMap.canonicalUrl}</dd>
          </div>
          <div>
            <dt className="font-bold text-neutral-950">robots</dt>
            <dd>{siteMap.robots}</dd>
          </div>
          <div>
            <dt className="font-bold text-neutral-950">sitemap</dt>
            <dd>{siteMap.sitemapStatus}</dd>
          </div>
        </dl>
      </div>

      <ol className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {siteMap.nodes.map((node, index) => (
          <li
            key={`${node.href}-${node.title}`}
            className="rounded-lg border border-blue-100 bg-white p-4"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <meta itemProp="position" content={String(index + 1)} />
            <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-[11px] font-bold text-blue-800">{node.badge}</span>
            <h3 className="mt-2 text-sm font-bold text-neutral-950" itemProp="name">{node.title}</h3>
            <p className="mt-1 text-xs leading-5 text-neutral-600">{node.body}</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">{node.policy}</p>
            <a
              className="mt-3 inline-flex text-sm font-bold text-blue-700 underline underline-offset-2 hover:text-blue-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              href={node.href}
              itemProp="url"
            >
              {node.label}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

