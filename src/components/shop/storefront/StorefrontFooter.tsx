import { buildShopFooterAssurances, buildShopFooterColumns, buildShopFooterShoppingDirectoryLinks } from "@/lib/shopStorefrontShared";

type StorefrontFooterProps = {
  storeName: string;
  tenantRoot: string;
  className?: string;
};

export function StorefrontFooter({ storeName, tenantRoot, className = "" }: StorefrontFooterProps) {
  const assurances = buildShopFooterAssurances(tenantRoot);
  const columns = buildShopFooterColumns(tenantRoot);
  const linkDirectory = buildShopFooterShoppingDirectoryLinks(tenantRoot);

  return (
    <footer id="storefront-footer" className={`mt-8 bg-[#17212f] text-white ${className}`} data-testid="storefront-footer">
      <a className="block bg-[#253447] px-4 py-3 text-center text-sm font-semibold underline-offset-4 hover:bg-[#2e4058] hover:underline focus:outline-none focus:ring-2 focus:ring-amber-300" href="#top">
        ページ上部へ戻る
      </a>
      <section className="border-b border-white/10 bg-[#1f2c3d] px-4 py-5" aria-label="買い物を続ける">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-bold text-white">買い物を続ける</h2>
            <p className="mt-1 text-xs leading-5 text-white/72">商品、カート、注文履歴、問い合わせへすぐ戻れます。</p>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="フッタークイックリンク" itemScope itemType="https://schema.org/SiteNavigationElement">
            {[
              { label: "商品一覧", href: `${tenantRoot}/products` },
              { label: "カート", href: `${tenantRoot}/cart` },
              { label: "注文履歴", href: `${tenantRoot}/orders` },
              { label: "問い合わせ", href: `${tenantRoot}/contact` },
            ].map((link) => (
              <a
                key={link.label}
                className="inline-flex h-9 items-center rounded-full border border-sky-300/45 bg-sky-300/10 px-3 text-xs font-bold text-sky-200 underline-offset-4 hover:border-sky-200 hover:bg-sky-300/20 hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-amber-300"
                href={link.href}
                itemProp="url"
              >
                <span itemProp="name">{link.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>
      <div className="mx-auto grid max-w-screen-xl gap-3 px-4 pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {assurances.map((item) => (
          <section key={item.title} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <h2 className="text-sm font-bold text-white">{item.title}</h2>
            <p className="mt-1 text-xs leading-5 text-white/72">{item.body}</p>
            {item.href && item.label ? (
              <a className="mt-2 inline-flex text-xs font-bold text-sky-200 underline-offset-4 hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-amber-300" href={item.href}>
                {item.label}
              </a>
            ) : null}
          </section>
        ))}
      </div>
      <div className="mx-auto grid max-w-screen-xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => (
          <nav key={column.title} className="grid gap-2 text-sm" aria-label={column.title} itemScope itemType="https://schema.org/SiteNavigationElement">
            <h2 className="mb-2 text-base font-bold">{column.title}</h2>
            {column.links.map((link) => (
              <a
                key={link.label}
                className="text-white/82 underline-offset-4 hover:text-white hover:underline focus:text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                href={link.href}
                itemProp="url"
              >
                <span itemProp="name">{link.label}</span>
              </a>
            ))}
          </nav>
        ))}
      </div>
      <section
        className="border-t border-white/10 bg-[#101826] px-4 py-7"
        aria-label="フッター主要リンク"
        data-testid="storefront-footer-link-directory"
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <div className="mx-auto max-w-screen-xl">
          <h2 className="sr-only">ストア主要リンク</h2>
          <meta itemProp="numberOfItems" content={String(linkDirectory.length)} />
          <div className="flex flex-wrap gap-2">
            {linkDirectory.map((link, index) => (
              <a
                key={`${link.label}-${link.href}`}
                className="rounded-full border border-sky-300/35 bg-sky-400/10 px-3 py-2 text-xs font-semibold text-sky-200 underline-offset-4 hover:border-sky-200 hover:bg-sky-300/15 hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-amber-300"
                href={link.href}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={String(index + 1)} />
                <span itemProp="name">{link.label}</span>
                <meta itemProp="url" content={link.href} />
              </a>
            ))}
          </div>
        </div>
      </section>
      <div className="border-t border-white/10 px-4 py-5">
        <div className="mx-auto grid max-w-screen-xl gap-3 text-xs text-white/70 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="font-bold text-white">{storeName}</div>
            <p className="mt-1">注文、配送、返品、定期購入、問い合わせまで同じストア内で確認できます。支払い方法の選択が必要な場合は、注文前に分かりやすく案内します。</p>
          </div>
          <nav className="flex flex-wrap gap-3 md:justify-end" aria-label="ストア基本情報">
            <a className="underline-offset-4 hover:text-white hover:underline focus:text-white focus:outline-none focus:ring-2 focus:ring-amber-300" href={`${tenantRoot}/legal`}>特商法</a>
            <a className="underline-offset-4 hover:text-white hover:underline focus:text-white focus:outline-none focus:ring-2 focus:ring-amber-300" href={`${tenantRoot}/privacy`}>プライバシー</a>
            <a className="underline-offset-4 hover:text-white hover:underline focus:text-white focus:outline-none focus:ring-2 focus:ring-amber-300" href={`${tenantRoot}/contact`}>問い合わせ</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
