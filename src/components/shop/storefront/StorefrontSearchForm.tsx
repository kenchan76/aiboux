import { Search } from "lucide-react";

type StorefrontSearchFormProps = {
  tenantRoot: string;
  placeholder?: string;
  defaultQuery?: string;
  categoryLabel?: string;
  className?: string;
};

export function StorefrontSearchForm({
  tenantRoot,
  placeholder = "キーワード・商品名・ブランド名で検索",
  defaultQuery = "",
  categoryLabel = "すべてのカテゴリ",
  className = "",
}: StorefrontSearchFormProps) {
  return (
    <form
      action={`${tenantRoot}/products`}
      method="get"
      role="search"
      aria-label="ストア内商品検索"
      className={`order-3 flex h-10 w-full flex-none overflow-hidden rounded bg-white text-neutral-900 sm:order-none sm:min-w-[260px] sm:flex-1 ${className}`.trim()}
      data-testid="storefront-search-form"
    >
      <span className="hidden items-center border-r border-neutral-200 bg-neutral-100 px-3 text-xs md:flex">
        {categoryLabel}
      </span>
      <input
        className="h-10 min-w-0 flex-1 border-0 px-4 text-sm outline-none"
        type="search"
        name="q"
        defaultValue={defaultQuery}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        data-testid="storefront-search-input"
      />
      <button
        className="flex h-10 w-12 items-center justify-center bg-amber-500 text-neutral-950 hover:bg-amber-400"
        type="submit"
        aria-label="商品を検索"
        data-testid="storefront-search-submit"
      >
        <Search className="size-5" aria-hidden="true" />
      </button>
    </form>
  );
}
