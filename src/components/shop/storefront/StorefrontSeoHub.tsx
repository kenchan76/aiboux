import {
  buildShopSeoHubGroups,
  buildShopSeoHubHighlights,
  type ShopStorefrontInfoCard,
  type ShopStorefrontLinkGroup,
} from "@/lib/shopStorefrontShared";

type StorefrontSeoHubProps = {
  tenantRoot: string;
  storeName?: string;
};

export function StorefrontSeoHub({ tenantRoot, storeName = "AIBOUX Store" }: StorefrontSeoHubProps) {
  const groups = buildShopSeoHubGroups(tenantRoot);
  const highlights = buildShopSeoHubHighlights(tenantRoot);

  return (
    <section
      className="my-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
      data-testid="storefront-seo-hub"
      aria-labelledby="storefront-seo-hub-title"
    >
      <div className="flex flex-col gap-3 border-b border-neutral-100 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Store navigation</p>
          <h2 id="storefront-seo-hub-title" className="mt-1 text-xl font-bold tracking-tight text-neutral-950">
            {storeName}で迷わず探す
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
            商品、カテゴリ、配送、返品、注文履歴を分かりやすくまとめました。必要な確認先へすぐ移動できます。
          </p>
        </div>
        <a
          className="inline-flex h-10 w-fit items-center rounded-full bg-amber-400 px-5 text-sm font-bold text-neutral-950 hover:bg-amber-300"
          href={`${tenantRoot}/products`}
        >
          商品一覧へ
        </a>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <nav
          className="grid gap-4 md:grid-cols-3"
          aria-label={`${storeName} 店内ナビゲーション`}
          itemScope
          itemType="https://schema.org/SiteNavigationElement"
        >
          {groups.map((group) => (
            <SeoHubGroup key={group.title} group={group} />
          ))}
        </nav>
        <aside className="grid gap-3" aria-label="購入判断の要点">
          {highlights.map((card) => (
            <SeoHubHighlight key={card.title} card={card} />
          ))}
        </aside>
      </div>
    </section>
  );
}

function SeoHubGroup({ group }: { group: ShopStorefrontLinkGroup }) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      <h3 className="text-sm font-bold text-neutral-950">{group.title}</h3>
      <ul className="mt-3 grid gap-2 text-sm">
        {group.links.map((link) => (
          <li key={`${group.title}-${link.href}-${link.label}`} itemProp="hasPart" itemScope itemType="https://schema.org/WebPage">
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
  );
}

function SeoHubHighlight({ card }: { card: ShopStorefrontInfoCard }) {
  return (
    <a
      className="rounded-lg border border-amber-200 bg-amber-50 p-4 transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-100"
      href={card.href}
    >
      <span className="text-sm font-bold text-neutral-950">{card.title}</span>
      <span className="mt-1 block text-sm leading-6 text-amber-900">{card.body}</span>
      <span className="mt-2 inline-flex text-xs font-bold text-blue-700 underline-offset-2 hover:underline">
        {card.label ?? "詳しく見る"}
      </span>
    </a>
  );
}
