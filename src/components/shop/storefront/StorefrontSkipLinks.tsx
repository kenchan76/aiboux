export function StorefrontSkipLinks() {
  const links = [
    { href: "#storefront-main", label: "本文へスキップ" },
    { href: "#storefront-search", label: "商品検索へ移動" },
    { href: "#storefront-footer", label: "フッターの主要リンクへ移動" },
  ];

  return (
    <nav
      aria-label="ページ内ショートカット"
      className="fixed left-3 top-3 z-[100] flex gap-2"
      data-testid="storefront-skip-links"
    >
      {links.map((link) => (
        <a
          key={link.href}
          className="sr-only rounded-md border border-blue-700 bg-white px-3 py-2 text-sm font-bold text-blue-700 shadow-lg underline-offset-4 focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-amber-400"
          href={link.href}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
