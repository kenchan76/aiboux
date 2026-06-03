"use client";

import * as React from "react";
import {
  Bot,
  CalendarDays,
  Check,
  ChevronRight,
  FileSpreadsheet,
  Filter,
  Package,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Star,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  aiEnrichmentJobs,
  aiSuggestions,
  calculateWholesalePrice,
  coreCustomers,
  customerDiscountRates,
  deliveryDestinations,
  divisionName,
  favoriteProductLists,
  filterProducts,
  formatCurrency,
  formatPercent,
  futurePriceSchedules,
  hasFuturePriceSchedule,
  marketplaceListings,
  marketplaceSummary,
  masterProducts,
  productAssets,
  productDivisions,
  productPriceSchedules,
  shopProductLinks,
  shopSkuVariants,
  sortProducts,
  type FavoriteProductList,
  type MasterProduct,
  type ProductDivision,
  type ProductFilterState,
  type ProductSortKey,
} from "@/data/product-master-data";
import { cn } from "@/lib/utils";

const sortLabels: Array<{ key: ProductSortKey; label: string }> = [
  { key: "sales", label: "売上順" },
  { key: "stock", label: "在庫順" },
  { key: "name", label: "商品名順" },
  { key: "jan", label: "JAN順" },
  { key: "updated", label: "更新日順" },
  { key: "price", label: "価格順" },
  { key: "margin", label: "利益率順" },
  { key: "listing", label: "出品状態順" },
  { key: "favorite", label: "お気に入り順" },
];

export function ProductMasterHub() {
  const [query, setQuery] = React.useState("");
  const [activeDivisionId, setActiveDivisionId] = React.useState("div-own");
  const [favoriteLists, setFavoriteLists] = React.useState(favoriteProductLists);
  const [divisions, setDivisions] = React.useState(productDivisions);
  const [sortKey, setSortKey] = React.useState<ProductSortKey>("updated");
  const [filters, setFilters] = React.useState<ProductFilterState>({ divisionId: "div-own" });
  const [selectedProduct, setSelectedProduct] = React.useState<MasterProduct | null>(masterProducts[0]);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [effectiveDate, setEffectiveDate] = React.useState<Date | undefined>(new Date("2024-09-01"));

  const activeFavorite = favoriteLists.find((list) => list.id === activeDivisionId);
  const activeProducts = React.useMemo(() => {
    const nextFilters: ProductFilterState = activeFavorite
      ? { ...filters, divisionId: undefined, favoriteListId: activeFavorite.id }
      : { ...filters, divisionId: activeDivisionId.startsWith("div-") ? activeDivisionId : undefined };
    return sortProducts(filterProducts(masterProducts, nextFilters, query), sortKey, sortKey === "name" || sortKey === "jan" ? "asc" : "desc");
  }, [activeDivisionId, activeFavorite, filters, query, sortKey]);

  const openProduct = (product: MasterProduct) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };

  const createDivision = (name: string) => {
    const next: ProductDivision = {
      id: `div-local-${crypto.randomUUID().slice(0, 8)}`,
      tenantId: "tenant_001",
      name,
      description: "ユーザー作成の商品管理区分",
      colorToken: "neutral",
      sortOrder: divisions.length + 1,
      isDefault: false,
    };
    setDivisions((current) => [...current, next]);
    toast.success(`${name} を商品区分に追加しました`);
  };

  const createFavoriteList = (name: string) => {
    const next: FavoriteProductList = {
      id: `fav-local-${crypto.randomUUID().slice(0, 8)}`,
      tenantId: "tenant_001",
      ownerUserId: "usr-001",
      name,
      description: "商品区分タブと同列に表示されるお気に入り",
      productIds: selectedProduct ? [selectedProduct.id] : [],
    };
    setFavoriteLists((current) => [...current, next]);
    toast.success(`${name} をお気に入りリストに追加しました`);
  };

  return (
    <div className="space-y-3">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-base">商品マスタ正本</CardTitle>
            <CardDescription className="text-xs">
              Coreの商品をShop、Mall、Mail、File、Docs、MCPの共通正本として管理します。
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => toast.success("CSV取込ジョブを準備しました")}>
              <Upload className="size-4" />
              CSV取込
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => toast.success("AI補完レビューを開始しました")}>
              <Sparkles className="size-4" />
              AI補完
            </Button>
            <Button size="sm" className="h-8 gap-1.5" onClick={() => toast.success("新規商品ドラフトを作成しました")}>
              <Plus className="size-4" />
              新規商品作成
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-3 pt-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {divisions.map((division) => (
              <Button
                key={division.id}
                variant={activeDivisionId === division.id ? "secondary" : "ghost"}
                size="sm"
                className="h-7 rounded-md px-2 text-xs"
                onClick={() => {
                  setActiveDivisionId(division.id);
                  setFilters((current) => ({ ...current, divisionId: division.id, favoriteListId: undefined }));
                }}
              >
                {division.name}
                {division.isDefault ? <Badge variant="outline" className="ml-1 h-4 px-1 text-[10px]">初期</Badge> : null}
              </Button>
            ))}
            {favoriteLists.map((favorite) => (
              <Button
                key={favorite.id}
                variant={activeDivisionId === favorite.id ? "secondary" : "ghost"}
                size="sm"
                className="h-7 rounded-md px-2 text-xs"
                onClick={() => {
                  setActiveDivisionId(favorite.id);
                  setFilters((current) => ({ ...current, divisionId: undefined, favoriteListId: favorite.id }));
                }}
              >
                <Star className="mr-1 size-3 fill-amber-400 text-amber-500" />
                {favorite.name}
              </Button>
            ))}
            <CreateTinyDialog label="区分追加" title="商品区分を追加" placeholder="例: 価格改定対象" onCreate={createDivision} />
            <CreateTinyDialog label="お気に入り追加" title="お気に入りリストを追加" placeholder="例: EC出品候補" onCreate={createFavoriteList} />
          </div>

          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
              <Input className="h-8 pl-8" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="JAN・商品名・仕様・タグで検索" />
            </div>
            <Select value={sortKey} onValueChange={(value) => setSortKey(value as ProductSortKey)}>
              <SelectTrigger size="sm" className="h-8 w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortLabels.map((item) => (
                  <SelectItem key={item.key} value={item.key}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <Filter className="size-4" />
                  フィルター
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setFilters((current) => ({ ...current, stockState: "shortage" }))}>在庫不足だけ表示</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters((current) => ({ ...current, hasCustomerPrice: "yes" }))}>得意先別価格あり</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters((current) => ({ ...current, hasPriceSchedule: "yes" }))}>価格改定予定あり</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters((current) => ({ ...current, listingState: "mall_ready" }))}>Mall公開対象</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ divisionId: activeDivisionId.startsWith("div-") ? activeDivisionId : undefined })}>条件をクリア</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <CalendarDays className="size-4" />
                  価格適用日
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={effectiveDate} onSelect={setEffectiveDate} />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => toast.success("この表示をユーザー初期表示に保存しました")}>
              <Settings2 className="size-4" />
              初期表示に保存
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <Table className="min-w-[1180px]">
              <TableHeader>
                <TableRow className="bg-neutral-50">
                  {["", "JAN", "商品名", "商品区分", "入数", "単位", "標準価格", "卸価格", "在庫", "売上", "価格改定", "Shop/Mall", "状態", ""].map((header) => (
                    <TableHead key={header} className="h-8 px-2 text-xs">{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeProducts.map((product) => {
                  const customerPrice = calculateWholesalePrice({ product, customer: coreCustomers[0], date: effectiveDate });
                  const listing = marketplaceSummary(product.id);
                  return (
                    <TableRow key={product.id} className="h-10 cursor-pointer hover:bg-neutral-50" onClick={() => openProduct(product)}>
                      <TableCell className="px-2 py-1">
                        <Star className={cn("size-4", favoriteScoreLabel(product.id) ? "fill-amber-400 text-amber-500" : "text-neutral-300")} />
                      </TableCell>
                      <TableCell className="px-2 py-1 text-[11px]">{product.janCode || "未設定"}</TableCell>
                      <TableCell className="max-w-[250px] px-2 py-1">
                        <div className="truncate text-sm font-medium">{product.productName}</div>
                        <div className="truncate text-[11px] text-neutral-500">{product.specification}</div>
                      </TableCell>
                      <TableCell className="px-2 py-1"><DivisionBadge name={divisionName(product.divisionId)} /></TableCell>
                      <TableCell className="px-2 py-1 text-right text-xs">{product.caseQuantity}</TableCell>
                      <TableCell className="px-2 py-1 text-xs">{product.unit}</TableCell>
                      <TableCell className="px-2 py-1 text-right text-xs">{formatCurrency(product.standardPrice)}</TableCell>
                      <TableCell className="px-2 py-1 text-right">
                        <div className=" text-xs">{formatCurrency(customerPrice.wholesalePrice)}</div>
                        <div className="text-[10px] text-neutral-500">{formatPercent(customerPrice.rate)}</div>
                      </TableCell>
                      <TableCell className="px-2 py-1 text-right text-xs">{product.stockQuantity}</TableCell>
                      <TableCell className="px-2 py-1 text-right text-xs">{formatCurrency(product.salesAmount)}</TableCell>
                      <TableCell className="px-2 py-1">
                        {hasFuturePriceSchedule(product.id) ? <Badge variant="warning">予定あり</Badge> : <Badge variant="outline">なし</Badge>}
                      </TableCell>
                      <TableCell className="px-2 py-1">
                        <Badge variant={product.shopSyncEnabled ? "success" : "outline"}>{product.shopSyncEnabled ? `SKU ${shopSkuVariants.filter((variant) => variant.coreProductId === product.id).length}` : "未連携"}</Badge>
                        {listing.pending > 0 ? <Badge variant="warning" className="ml-1">承認待ち</Badge> : null}
                      </TableCell>
                      <TableCell className="px-2 py-1"><StatusBadge status={product.status} /></TableCell>
                      <TableCell className="px-2 py-1 text-right"><ChevronRight className="ml-auto size-4 text-neutral-400" /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ProductDetailSheet product={selectedProduct} open={detailOpen} onOpenChange={setDetailOpen} effectiveDate={effectiveDate} />
    </div>
  );
}

function ProductDetailSheet({ product, open, onOpenChange, effectiveDate }: { product: MasterProduct | null; open: boolean; onOpenChange: (open: boolean) => void; effectiveDate?: Date }) {
  if (!product) return null;
  const productPrices = productPriceSchedules.filter((schedule) => schedule.productId === product.id);
  const variants = shopSkuVariants.filter((variant) => variant.coreProductId === product.id);
  const shopProducts = shopProductLinks.filter((link) => link.coreProductId === product.id);
  const listings = marketplaceListings.filter((listing) => variants.some((variant) => variant.id === listing.skuVariantId));
  const assets = productAssets.filter((asset) => asset.productId === product.id);
  const suggestions = aiSuggestions.filter((suggestion) => suggestion.productId === product.id);
  const jobs = aiEnrichmentJobs.filter((job) => job.productId === product.id);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-hidden sm:max-w-[780px]">
        <SheetHeader>
          <SheetTitle>{product.productName}</SheetTitle>
          <SheetDescription>{product.janCode} / {divisionName(product.divisionId)} / Core正本</SheetDescription>
        </SheetHeader>
        <ScrollArea className="mt-4 h-[calc(100vh-96px)] pr-3">
          <Tabs defaultValue="0" className="space-y-3">
            <TabsList className="h-auto flex-wrap justify-start">
              {["基本情報", "価格", "得意先別卸価格", "サイズ/物流", "Shop/SKU連携", "モール出品", "ファイル", "AI補完", "履歴"].map((label, index) => (
                <TabsTrigger key={label} value={String(index)} className="h-7 text-xs">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="0" className="m-0 space-y-3">
              <Card className="shadow-sm">
                <CardContent className="grid gap-3 p-3 sm:grid-cols-2">
                  <Info label="JANコード" value={product.janCode} />
                  <Info label="ITFコード" value={product.itfCode || "未設定"} />
                  <Info label="入数" value={`${product.caseQuantity} ${product.unit}`} />
                  <Info label="税区分" value={product.taxType} />
                  <Info label="在庫管理" value={product.inventoryManaged ? "対象" : "対象外"} />
                  <Info label="Shop/Mall" value={`${product.shopSyncEnabled ? "Shop連携" : "Shop未連携"} / ${product.mallPublishEnabled ? "Mall対象" : "Mall対象外"}`} />
                  <div className="sm:col-span-2">
                    <div className="mb-1 text-xs text-neutral-500">商品説明</div>
                    <p className="rounded-md border border-neutral-200 bg-neutral-50 p-2 text-sm leading-6">{product.description}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="1" className="m-0 space-y-3">
              <PriceScheduleTable schedules={productPrices} />
              <Card className="shadow-sm">
                <CardHeader className="p-3"><CardTitle className="text-sm">未来価格予約</CardTitle></CardHeader>
                <CardContent className="grid gap-2 p-3 pt-0 sm:grid-cols-[1fr_160px_120px]">
                  <Input defaultValue="2024-09-01" />
                  <Input defaultValue={String(futurePriceSchedules(product.id, effectiveDate).at(0)?.standardPrice ?? product.standardPrice)} />
                  <Button onClick={() => toast.success("価格改定予定を承認待ちにしました")}>承認待ち作成</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="2" className="m-0">
              <CustomerWholesalePreview product={product} effectiveDate={effectiveDate} />
            </TabsContent>
            <TabsContent value="3" className="m-0">
              <Card className="shadow-sm">
                <CardContent className="grid gap-3 p-3 sm:grid-cols-2">
                  <Info label="商品サイズ" value={`${product.productSize.widthMm}×${product.productSize.heightMm}×${product.productSize.depthMm}mm`} />
                  <Info label="商品重量" value={`${product.productSize.weightG}g`} />
                  <Info label="ケースサイズ" value={`${product.caseSize.widthMm}×${product.caseSize.heightMm}×${product.caseSize.depthMm}mm`} />
                  <Info label="ケース重量" value={`${product.caseSize.weightG}g`} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="4" className="m-0">
              <ShopSkuPanel shopProducts={shopProducts} variants={variants} />
            </TabsContent>
            <TabsContent value="5" className="m-0">
              <MarketplaceListingPanel listings={listings} />
            </TabsContent>
            <TabsContent value="6" className="m-0">
              <AssetPanel assets={assets} />
            </TabsContent>
            <TabsContent value="7" className="m-0">
              <AiSuggestionPanel jobs={jobs} suggestions={suggestions} />
            </TabsContent>
            <TabsContent value="8" className="m-0">
              <Card className="shadow-sm">
                <CardContent className="space-y-2 p-3">
                  <ActivityLine provider="core" text="標準価格が確認されました" />
                  <ActivityLine provider="shop" text="2個セットSKUの下書きが作成されました" />
                  <ActivityLine provider="mail" text="請求書メールから商品文脈が紐づきました" />
                  <ActivityLine provider="file" text="仕様書PDFが商品ファイルとして登録されました" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function CustomerWholesalePreview({ product, effectiveDate }: { product: MasterProduct; effectiveDate?: Date }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="p-3">
        <CardTitle className="text-sm">得意先別卸価格プレビュー</CardTitle>
        <CardDescription className="text-xs">商品標準価格と得意先掛率、商品別例外価格から算出します。</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <Table>
          <TableHeader><TableRow className="bg-neutral-50"><TableHead className="h-8 text-xs">得意先</TableHead><TableHead className="h-8 text-xs">掛率</TableHead><TableHead className="h-8 text-xs">丸め</TableHead><TableHead className="h-8 text-right text-xs">卸価格</TableHead></TableRow></TableHeader>
          <TableBody>
            {coreCustomers.map((customer) => {
              const override = customerDiscountRates.find((rate) => rate.customerId === customer.id && rate.productId === product.id);
              const price = calculateWholesalePrice({ product, customer, productOverride: override, date: effectiveDate });
              return (
                <TableRow key={customer.id} className="h-9">
                  <TableCell className="py-1 text-sm font-medium">{customer.customerName}<div className="text-[11px] text-neutral-500">{price.source}</div></TableCell>
                  <TableCell className="py-1 text-xs">{formatPercent(price.rate)}</TableCell>
                  <TableCell className="py-1 text-xs">{price.roundingMode}</TableCell>
                  <TableCell className="py-1 text-right text-xs">{formatCurrency(price.wholesalePrice)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PriceScheduleTable({ schedules }: { schedules: typeof productPriceSchedules }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="p-3"><CardTitle className="text-sm">価格履歴</CardTitle></CardHeader>
      <CardContent className="p-3 pt-0">
        <Table>
          <TableHeader><TableRow className="bg-neutral-50"><TableHead className="h-8 text-xs">適用開始日</TableHead><TableHead className="h-8 text-right text-xs">標準価格</TableHead><TableHead className="h-8 text-xs">状態</TableHead><TableHead className="h-8 text-xs">理由</TableHead></TableRow></TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id} className="h-9">
                <TableCell className="py-1 text-xs">{schedule.effectiveFrom}</TableCell>
                <TableCell className="py-1 text-right text-xs">{formatCurrency(schedule.standardPrice)}</TableCell>
                <TableCell className="py-1"><Badge variant={schedule.approvalStatus === "approved" ? "success" : "warning"}>{schedule.approvalStatus}</Badge></TableCell>
                <TableCell className="py-1 text-xs">{schedule.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ShopSkuPanel({ shopProducts, variants }: { shopProducts: typeof shopProductLinks; variants: typeof shopSkuVariants }) {
  return (
    <div className="space-y-3">
      {shopProducts.map((item) => (
        <Card key={item.id} className="shadow-sm">
          <CardHeader className="p-3"><CardTitle className="text-sm">{item.displayName}</CardTitle><CardDescription className="text-xs">{item.publishState} / {item.shopName}</CardDescription></CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            {variants.map((variant) => (
              <div key={variant.id} className="grid gap-2 rounded-md border border-neutral-200 p-2 sm:grid-cols-[1fr_110px_90px_100px]">
                <div><div className="text-sm font-medium">{variant.variantName}</div><div className=" text-[11px] text-neutral-500">{variant.skuCode}</div></div>
                <div className="text-xs">セット数量 {variant.setQuantity}</div>
                <div className="text-right text-xs">{formatCurrency(variant.salePrice)}</div>
                <Badge variant={variant.approvalStatus === "approved" ? "success" : "warning"}>{variant.approvalStatus}</Badge>
              </div>
            ))}
            <Button variant="outline" size="sm" className="h-8" onClick={() => toast.success("2個セット/3個セットの候補を作成しました")}>セットSKU案を作成</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MarketplaceListingPanel({ listings }: { listings: typeof marketplaceListings }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="p-3"><CardTitle className="text-sm">モール出品下書き</CardTitle><CardDescription className="text-xs">Yahoo / 楽天 / Amazon への公開は承認後に実行します。</CardDescription></CardHeader>
      <CardContent className="space-y-2 p-3 pt-0">
        {listings.map((listing) => (
          <div key={listing.id} className="rounded-md border border-neutral-200 p-2">
            <div className="flex items-start justify-between gap-2">
              <div><Badge variant="outline">{listing.marketplace}</Badge><div className="mt-1 text-sm font-medium">{listing.marketplaceProductName}</div><div className="text-[11px] text-neutral-500">{listing.searchKeywords}</div></div>
              <Badge variant={listing.listingStatus === "error" ? "destructive" : listing.approvalStatus === "approved" ? "success" : "warning"}>{listing.approvalStatus}</Badge>
            </div>
            {listing.errorMessage ? <div className="mt-2 rounded-md bg-red-50 p-2 text-xs text-red-700">{listing.errorMessage}</div> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AssetPanel({ assets }: { assets: typeof productAssets }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="p-3"><CardTitle className="text-sm">商品ファイル</CardTitle><CardDescription className="text-xs">画像、仕様書、CSV、Excelを正本商品へ紐づけます。</CardDescription></CardHeader>
      <CardContent className="space-y-2 p-3 pt-0">
        {assets.map((asset) => (
          <div key={asset.id} className="flex items-center justify-between rounded-md border border-neutral-200 p-2">
            <div className="flex items-center gap-2"><FileSpreadsheet className="size-4 text-neutral-500" /><div><div className="text-sm font-medium">{asset.fileName}</div><div className="text-[11px] text-neutral-500">{asset.assetType} / {(asset.fileSize / 1024).toFixed(0)}KB</div></div></div>
            <Button variant="outline" size="sm" className="h-7">開く</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AiSuggestionPanel({ jobs, suggestions }: { jobs: typeof aiEnrichmentJobs; suggestions: typeof aiSuggestions }) {
  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <Card key={job.id} className="shadow-sm">
          <CardHeader className="p-3"><CardTitle className="text-sm">AI補完ジョブ</CardTitle><CardDescription className="text-xs">{job.inputSummary}</CardDescription></CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            <div className="flex flex-wrap gap-1.5">{job.needsReview.map((item) => <Badge key={item} variant="warning">{item}</Badge>)}</div>
            <div className="text-xs text-neutral-500">信頼度 {formatPercent(job.confidence)} / 参照元 {job.sources.join("、")}</div>
          </CardContent>
        </Card>
      ))}
      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} className="shadow-sm">
          <CardContent className="space-y-2 p-3">
            <div className="flex items-center justify-between"><Badge variant="outline">{suggestion.suggestionType}</Badge><span className="text-xs text-neutral-500">信頼度 {formatPercent(suggestion.confidence)}</span></div>
            <div className="rounded-md bg-neutral-50 p-2 text-sm">{Array.isArray(suggestion.suggestedValue) ? suggestion.suggestedValue.join(" / ") : typeof suggestion.suggestedValue === "object" ? JSON.stringify(suggestion.suggestedValue) : String(suggestion.suggestedValue)}</div>
            <div className="flex gap-2"><Button size="sm" className="h-8" onClick={() => toast.success("提案を適用候補にしました")}>適用</Button><Button variant="outline" size="sm" className="h-8">修正</Button><Button variant="outline" size="sm" className="h-8">破棄</Button></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CreateTinyDialog({ label, title, placeholder, onCreate }: { label: string; title: string; placeholder: string; onCreate: (name: string) => void }) {
  const [name, setName] = React.useState("");
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline" size="sm" className="h-7 px-2 text-xs"><Plus className="mr-1 size-3" />{label}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>商品マスタのタブとして保存されます。</DialogDescription></DialogHeader>
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder={placeholder} />
        <DialogFooter><Button onClick={() => { if (name.trim()) onCreate(name.trim()); }}>保存</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md border border-neutral-200 p-2"><div className="text-[11px] text-neutral-500">{label}</div><div className="mt-1 text-sm font-medium">{value}</div></div>;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active") return <Badge variant="success">有効</Badge>;
  if (status === "draft") return <Badge variant="warning">下書き</Badge>;
  if (status === "discontinued") return <Badge variant="destructive">廃番</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

function DivisionBadge({ name }: { name: string }) {
  return <Badge variant="secondary" className="bg-neutral-100 text-neutral-700">{name}</Badge>;
}

function ActivityLine({ provider, text }: { provider: string; text: string }) {
  return <div className="flex items-center gap-2 rounded-md border border-neutral-200 p-2 text-sm"><Bot className="size-4 text-neutral-500" /><Badge variant="outline">{provider}</Badge><span>{text}</span></div>;
}

function favoriteScoreLabel(productId: string) {
  return favoriteProductLists.some((list) => list.productIds.includes(productId));
}
