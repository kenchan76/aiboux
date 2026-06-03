"use client";

import * as React from "react";
import { CheckCircle2, ExternalLink, PackageCheck, Plus, RefreshCw, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  formatCurrency,
  marketplaceListings,
  masterProducts,
  shopProductLinks,
  shopSkuVariants,
} from "@/data/product-master-data";

export function ShopProductIntegrationPanel() {
  const [selectedCoreProductId, setSelectedCoreProductId] = React.useState(masterProducts[0].id);
  const product = masterProducts.find((item) => item.id === selectedCoreProductId) ?? masterProducts[0];
  const shopProduct = shopProductLinks.find((item) => item.coreProductId === product.id);
  const variants = shopSkuVariants.filter((variant) => variant.coreProductId === product.id);
  const listings = marketplaceListings.filter((listing) => variants.some((variant) => variant.id === listing.skuVariantId));

  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Core商品連携</h1>
          <p className="text-sm text-neutral-500">Core正本からShop親商品、SKUバリエーション、3大モール下書きまでを承認付きで管理します。</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedCoreProductId} onValueChange={setSelectedCoreProductId}>
            <SelectTrigger className="h-8 w-[260px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {masterProducts.map((item) => <SelectItem key={item.id} value={item.id}>{item.productName}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8 gap-1.5" disabled title="Core連携API接続後に有効化します">
            <RefreshCw className="size-4" />
            正本同期
          </Button>
          <Button size="sm" className="h-8 gap-1.5" disabled title="承認API接続後に有効化します">
            <CheckCircle2 className="size-4" />
            承認へ送る
          </Button>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1fr_360px]">
        <Tabs defaultValue="core" className="space-y-3">
          <TabsList className="h-8">
            <TabsTrigger value="core" className="text-xs">Core正本</TabsTrigger>
            <TabsTrigger value="sku" className="text-xs">SKUバリエーション</TabsTrigger>
            <TabsTrigger value="market" className="text-xs">3大モール下書き</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs">AI補完確認</TabsTrigger>
          </TabsList>

          <TabsContent value="core" className="m-0">
            <Card className="shadow-none">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-sm">{product.productName}</CardTitle>
                <CardDescription className="text-xs">{product.janCode} / 入数 {product.caseQuantity} / {product.specification}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 px-4 pb-4 md:grid-cols-3">
                <Metric label="標準価格" value={formatCurrency(product.standardPrice)} />
                <Metric label="現在庫" value={`${product.stockQuantity} ${product.unit}`} />
                <Metric label="Shop連携" value={shopProduct ? "連携済み" : "未連携"} />
                <div className="md:col-span-3 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm leading-6">{product.description}</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sku" className="m-0">
            <Card className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
                <div><CardTitle className="text-sm">SKUバリエーション</CardTitle><CardDescription className="text-xs">1個、2個セット、3個セット、ケース販売を販売単位として管理します。</CardDescription></div>
                <CreateSkuDialog />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <Table>
                  <TableHeader><TableRow className="bg-neutral-50"><TableHead className="h-8 text-xs">SKU</TableHead><TableHead className="h-8 text-xs">販売名</TableHead><TableHead className="h-8 text-right text-xs">セット数量</TableHead><TableHead className="h-8 text-right text-xs">価格</TableHead><TableHead className="h-8 text-xs">承認</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {variants.map((variant) => (
                      <TableRow key={variant.id} className="h-9">
                        <TableCell className=" text-xs">{variant.skuCode}</TableCell>
                        <TableCell className="text-sm font-medium">{variant.variantName}</TableCell>
                        <TableCell className="text-right text-xs">{variant.setQuantity}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrency(variant.salePrice)}</TableCell>
                        <TableCell><Badge variant={variant.approvalStatus === "approved" ? "success" : "warning"}>{variant.approvalStatus}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="m-0">
            <Card className="shadow-none">
              <CardHeader className="px-4 py-3"><CardTitle className="text-sm">Yahoo / 楽天 / Amazon 下書き</CardTitle><CardDescription className="text-xs">Core商品名とEC販売名を分け、各モールの商品名・説明・価格を個別設定します。</CardDescription></CardHeader>
              <CardContent className="space-y-2 px-4 pb-4">
                {listings.map((listing) => (
                  <div key={listing.id} className="rounded-md border border-neutral-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge variant="outline">{listing.marketplace}</Badge>
                        <div className="mt-1 text-sm font-medium">{listing.marketplaceProductName}</div>
                        <div className="mt-1 text-xs text-neutral-500">{listing.searchKeywords}</div>
                      </div>
                      <Badge variant={listing.listingStatus === "error" ? "destructive" : "warning"}>{listing.approvalStatus}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="m-0">
            <Card className="shadow-none">
              <CardHeader className="px-4 py-3"><CardTitle className="text-sm">AI商品補完と承認</CardTitle><CardDescription className="text-xs">写真、JAN、仕様書から商品情報を補完します。公開前に必ず人間承認を挟みます。</CardDescription></CardHeader>
              <CardContent className="space-y-3 px-4 pb-4">
                <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-5 text-center text-sm text-neutral-500">
                  <Sparkles className="mx-auto mb-2 size-5" />
                  商品写真、仕様書PDF、CSV、Excelをドロップ
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                  <Button variant="outline" disabled>Yahoo案</Button>
                  <Button variant="outline" disabled>楽天案</Button>
                  <Button variant="outline" disabled>Amazon案</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="h-fit shadow-none">
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-sm">連携状態</CardTitle>
            <CardDescription className="text-xs">Shop/Mall/Mail/File/Docsに流れる文脈</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 px-4 pb-4">
            <StateLine icon={<PackageCheck className="size-4" />} label="Core商品正本" value="有効" />
            <StateLine icon={<ExternalLink className="size-4" />} label="Shop親商品" value={shopProduct ? shopProduct.publishState : "未作成"} />
            <StateLine icon={<ExternalLink className="size-4" />} label="SKU数" value={`${variants.length} 件`} />
            <StateLine icon={<ExternalLink className="size-4" />} label="モール下書き" value={`${listings.length} 件`} />
            <Button className="mt-2 w-full" disabled title="モール下書きAPI接続後に有効化します">下書きを保存</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-neutral-200 p-3"><div className="text-xs text-neutral-500">{label}</div><div className="mt-1 text-lg font-semibold">{value}</div></div>;
}

function StateLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center justify-between rounded-md border border-neutral-200 p-2 text-sm"><span className="flex items-center gap-2 text-neutral-600">{icon}{label}</span><span className="font-medium">{value}</span></div>;
}

function CreateSkuDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button size="sm" className="h-8 gap-1.5" disabled title="SKU保存API接続後に有効化します"><Plus className="size-4" />SKU追加</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>SKUバリエーションを追加</DialogTitle><DialogDescription>セット数量、販売価格、公開状態を承認待ちで保存します。</DialogDescription></DialogHeader>
        <div className="grid gap-3">
          <Input placeholder="SKUコード" />
          <Input placeholder="販売名" />
          <Input placeholder="セット数量" type="number" />
          <Input placeholder="販売価格" type="number" />
        </div>
        <DialogFooter><Button disabled title="SKU保存API接続後に有効化します">保存</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
