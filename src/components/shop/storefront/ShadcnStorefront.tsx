import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type StorefrontProduct = {
  id: string;
  image: string;
  name: string;
  price: string;
  category: string;
  inStock: boolean;
  href: string;
};

type ShadcnStorefrontProps = {
  storeName: string;
  products: StorefrontProduct[];
};

export function ShadcnStorefront({ storeName, products }: ShadcnStorefrontProps) {
  const tenantRoot = "/s/aiboux";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-screen-xl items-center gap-4 px-4 py-4">
          <a href={`${tenantRoot}/`} className="shrink-0 text-lg font-semibold tracking-tight">
            {storeName}
          </a>
          <div className="min-w-0 flex-1">
            <Input placeholder="このストアの商品を検索" aria-label="このストアの商品を検索" />
          </div>
          <Button asChild variant="outline" size="sm">
            <a href={`${tenantRoot}/cart`}>カート</a>
          </Button>
        </div>
        <Separator />
        <nav className="mx-auto flex max-w-screen-xl items-center gap-5 px-4 py-2 text-sm text-muted-foreground">
          <a href={`${tenantRoot}/products`} className="font-medium text-foreground">
            商品一覧
          </a>
          <a href={`${tenantRoot}/categories`}>カテゴリ</a>
          <a href={`${tenantRoot}/contact`}>問い合わせ</a>
          <a href={`${tenantRoot}/legal`}>特商法</a>
          <a href="https://mall.aiboux.com/">AIBOUX Mall</a>
          <span>{storeName}</span>
        </nav>
      </header>

      <main className="mx-auto max-w-screen-xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">おすすめ商品</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              いま購入できる公開商品を表示します。
            </p>
          </div>
          <Badge variant="secondary">{products.length}件</Badge>
        </div>

        <div id="products" className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
          {products.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed bg-muted/40 px-4 py-12 text-center text-sm text-muted-foreground">
              公開商品はまだありません。管理画面で商品を公開するとここに表示されます。
            </div>
          ) : null}
          {products.map((product) => (
            <Card key={product.id} className="h-full">
              <CardContent className="pt-0">
                <AspectRatio ratio={1} className="overflow-hidden rounded-lg bg-muted">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain p-3"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      画像未登録
                    </div>
                  )}
                </AspectRatio>
              </CardContent>
              <CardHeader className="gap-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={product.inStock ? "success" : "outline"}>
                    {product.inStock ? "在庫あり" : "在庫確認"}
                  </Badge>
                  <span className="truncate text-xs text-muted-foreground">{product.category}</span>
                </div>
                <CardTitle className="line-clamp-2 min-h-10 text-sm">
                  <a href={product.href}>{product.name}</a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold tracking-tight">¥{product.price}</p>
              </CardContent>
              <CardFooter className="grid gap-2 bg-background">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a href={product.href}>商品を見る</a>
                </Button>
                <Button asChild size="sm" className="w-full">
                  <a href={product.href}>商品詳細へ進む</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <footer className="border-t bg-background">
        <nav className="mx-auto flex max-w-screen-xl flex-wrap gap-4 px-4 py-5 text-sm text-muted-foreground">
          <a href={`${tenantRoot}/privacy`}>プライバシーポリシー</a>
          <a href={`${tenantRoot}/shipping`}>配送について</a>
          <a href={`${tenantRoot}/returns`}>返品について</a>
          <a href={`${tenantRoot}/contact`}>問い合わせ</a>
        </nav>
      </footer>
    </div>
  );
}
