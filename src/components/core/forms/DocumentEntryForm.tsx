import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm, type Resolver, type SubmitHandler, type UseFormReturn } from "react-hook-form";
import { Copy, Download, FileText, GripVertical, Loader2, Mail, PackagePlus, Plus, Save, Send, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  calculateDocumentTotals,
  coreDocumentFormSchema,
  documentTypeLabel,
  type CoreDocumentFormValues,
} from "@/lib/coreDocumentFormSchema";
import { documentUiConfigByType, type CoreDocumentUiConfig } from "@/lib/coreDocumentUiConfig";
import { cn } from "@/lib/utils";

type DocumentEntryFormProps = {
  open: boolean;
  defaultType: CoreDocumentFormValues["type"];
  initialDocument?: DocumentEntryInitialDocument | null;
  typeLocked?: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

type DocumentEntryInitialDocument = {
  id?: string;
  documentNumber: string;
  customerName: string;
  issueDate: string;
  status?: CoreDocumentFormValues["status"];
};

type CustomerSuggestion = {
  id: string;
  customerCode: string;
  customerName: string;
  billingName: string;
  contactName: string;
};

type ProductSuggestion = {
  id: string;
  productName: string;
  janCode: string;
  standardPrice: number;
  stockQuantity: number;
};

const defaultLine = {
  id: "",
  line_no: 1,
  lineKind: "product" as const,
  productCode: "",
  productName: "",
  spec: "",
  unit: "枚",
  packageQuantity: 1,
  quantity: 1,
  unitPrice: 0,
  taxRate: 10,
  note: "",
};

const defaultLineSeeds = [
  { productCode: "4901234567890", productName: "樹脂部品保護フレーム / 12mm x 910 x 1820", unit: "枚", packageQuantity: 10, quantity: 10, unitPrice: 1200, taxRate: 10 },
  { productCode: "4909876543210", productName: "帯電防止クリアフィルム / 0.1mm x 1000mm x 100m", unit: "巻", packageQuantity: 1, quantity: 50, unitPrice: 3200, taxRate: 10 },
  { productCode: "4912345678901", productName: "梱包用OPPテープ / 48mm x 100m 透明", unit: "巻", packageQuantity: 36, quantity: 36, unitPrice: 140, taxRate: 8 },
] satisfies Array<Pick<CoreDocumentFormValues["lines"][number], "productCode" | "productName" | "unit" | "packageQuantity" | "quantity" | "unitPrice" | "taxRate">>;

const cellInputClassName =
  "h-7 min-w-0 w-full rounded-sm border-transparent bg-white px-1.5 text-xs shadow-none outline-none transition-colors hover:border-neutral-200 focus-visible:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-200";

const cellNumberInputClassName = cn(
  cellInputClassName,
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
);

const cellSelectClassName =
  "h-7 min-w-0 w-full rounded-sm border-transparent bg-white px-1.5 text-xs shadow-none transition-colors hover:border-neutral-200 focus:ring-1 focus:ring-blue-200 focus-visible:ring-1 focus-visible:ring-blue-200 [&>svg]:hidden";

const cellSelectButtonClassName =
  "h-7 min-w-0 w-full justify-start rounded-sm border-transparent bg-white px-1.5 text-left text-xs font-normal shadow-none hover:border-neutral-200 hover:bg-white focus-visible:ring-1 focus-visible:ring-blue-200";

const lineActionButtonClassName = "h-6 w-[18px] min-w-0 p-0 text-neutral-500";

function createDefaultLines(type: CoreDocumentFormValues["type"] = "delivery"): CoreDocumentFormValues["lines"] {
  const productLines = defaultLineSeeds.map((seed, index) => ({
    ...defaultLine,
    line_no: index + 1,
    ...seed,
  }));
  if (type !== "delivery") return productLines;
  return [
    ...productLines,
    {
      ...defaultLine,
      line_no: productLines.length + 1,
      lineKind: "note" as const,
      productName: "※午前納品希望 / 荷受担当へ事前連絡",
      unit: "",
      packageQuantity: 1,
      quantity: 1,
      unitPrice: 0,
      taxRate: 10 as const,
    },
  ];
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function createDocumentNumber(type: CoreDocumentFormValues["type"]) {
  const prefix = documentUiConfigByType(type).numberPrefix;
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  return `${prefix}${date}-01`;
}

function createNextDocumentNumber(type: CoreDocumentFormValues["type"]) {
  const prefix = documentUiConfigByType(type).numberPrefix;
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  if (typeof window === "undefined") return `${prefix}${date}-01`;
  const key = `aiboux-core-docseq-${prefix}-${date}`;
  const next = Number(window.localStorage.getItem(key) || "0") + 1;
  window.localStorage.setItem(key, String(next));
  return `${prefix}${date}-${String(next).padStart(2, "0")}`;
}

export function DocumentEntryForm({ open, defaultType, initialDocument = null, typeLocked = false, onOpenChange, onSaved }: DocumentEntryFormProps) {
  const [saving, setSaving] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState<CustomerSuggestion[]>([]);
  const form = useForm<CoreDocumentFormValues>({
    resolver: zodResolver(coreDocumentFormSchema) as Resolver<CoreDocumentFormValues>,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      id: "",
      type: defaultType,
      documentNumber: createDocumentNumber(defaultType),
      customerName: defaultType === "delivery" ? "株式会社タノソリューションズ" : "",
      issueDate: todayIsoDate(),
      status: "draft",
      memo: "",
      lines: createDefaultLines(defaultType),
      actorId: "core-ui",
    },
  });
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "lines",
  });
  const type = form.watch("type");
  const lines = form.watch("lines");
  const totals = calculateDocumentTotals({ lines });
  const config = documentUiConfigByType(type);
  const formTitle = initialDocument ? `${config.listTitle}編集` : config.createTitle;
  const [carrier, setCarrier] = useState("yamato");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(todayIsoDate());
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState("am");
  const [deliveryStatus, setDeliveryStatus] = useState("宅急便");

  useEffect(() => {
    if (!open) return;
    const nextType = defaultType;
    const editMode = Boolean(initialDocument);
    const nextIssueDate = initialDocument?.issueDate?.replaceAll("/", "-") || todayIsoDate();
    setCustomerQuery("");
    setCustomerSuggestions([]);
    form.reset({
      id: initialDocument?.id || "",
      type: nextType,
      documentNumber: initialDocument?.documentNumber || createNextDocumentNumber(nextType),
      customerName: initialDocument?.customerName || (nextType === "delivery" ? "株式会社タノソリューションズ" : ""),
      issueDate: nextIssueDate,
      status: initialDocument?.status || "draft",
      memo: editMode
        ? `${documentTypeLabel(nextType)} ${initialDocument?.documentNumber} の編集メモ`
        : nextType === "delivery"
          ? "上記の通り納品いたしました。ご確認をお願いいたします。\nドライバーの方へ: 搬入口は南側です。ご不明点は担当者までご連絡ください。"
          : "",
      lines: createDefaultLines(nextType),
      actorId: "core-ui",
    });
    setCarrier("yamato");
    setTrackingNumber("");
    setDeliveryDate(nextIssueDate);
    setDeliveryTimeSlot("am");
    setDeliveryStatus(nextType === "delivery" ? "宅急便" : "管理中");
  }, [open, defaultType, initialDocument]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`/core/api/masters/customers?q=${encodeURIComponent(customerQuery)}&limit=10`, {
        headers: { accept: "application/json" },
        signal: controller.signal,
      })
        .then((response) => response.json() as Promise<{ success: boolean; customers?: CustomerSuggestion[] }>)
        .then((data) => {
          if (!cancelled) setCustomerSuggestions(data.success ? data.customers ?? [] : []);
        })
        .catch(() => {
          if (!cancelled) setCustomerSuggestions([]);
        });
    }, 120);
    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [open, customerQuery]);

  const onSubmit: SubmitHandler<CoreDocumentFormValues> = async (values) => {
    const orderedValues = {
      ...values,
      lines: values.lines.map((line, index) => ({
        ...line,
        line_no: index + 1,
      })),
    };
    setSaving(true);
    try {
      const response = await fetch("/core/api/documents/save", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(orderedValues),
      });
      const data = (await response.json()) as { success: boolean; error?: string; documentId?: string };
      if (!response.ok || !data.success) throw new Error(data.error || "帳票を保存できませんでした。");
      toast.success("帳票を保存しました");
      onOpenChange(false);
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "帳票を保存できませんでした。");
    } finally {
      setSaving(false);
    }
  };

  function addLine() {
    append({ ...defaultLine, line_no: fields.length + 1, productCode: "4900000000000", productName: "商品名 / 規格", taxRate: 10 as const });
    window.setTimeout(() => {
      const next = document.querySelector<HTMLElement>(`[data-testid="line-product-${fields.length}"]`);
      next?.focus();
    }, 0);
  }

  function addNoteLine() {
    if (form.getValues("lines").some((line) => line.lineKind === "note")) {
      toast.info("備考行は1行だけ追加できます");
      return;
    }
    append({
      ...defaultLine,
      line_no: fields.length + 1,
      lineKind: "note",
      productName: "※備考を入力してください",
      unit: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: 10 as const,
    });
  }

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => !saving && onOpenChange(nextOpen)}>
      <SheetContent
        className="m-0 left-0 right-0 top-0 bottom-0 flex h-screen !w-auto !max-w-none flex-col gap-0 overflow-hidden border-l !bg-white p-0 lg:left-[var(--core-sidebar-width,240px)] lg:right-0"
        style={{ "--core-sidebar-width": "216px" } as React.CSSProperties}
        showCloseButton={!saving}
        showOverlay={false}
      >
        <SheetHeader className="border-b bg-white px-3 py-2">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4" />
                {formTitle}
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="ml-1 h-8 w-[104px] border-neutral-200 bg-neutral-50 text-xs font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">下書き</SelectItem>
                        <SelectItem value="issued">発行済み</SelectItem>
                        <SelectItem value="sent">送付済み</SelectItem>
                        <SelectItem value="accepted">承認済み</SelectItem>
                        <SelectItem value="delivered">処理済み</SelectItem>
                        <SelectItem value="void">無効</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </SheetTitle>
            </div>
            <div className="flex items-center gap-1.5">
              {config.csvActions.map((action) => (
                <Button key={action} type="button" variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => toast.success(`${action}出力を準備しました`)}>
                  <Download className="size-3.5" />
                  {action}
                </Button>
              ))}
              <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-700" onClick={() => toast.info("メール送信は送信前確認を開く準備状態です。外部送信は人間確認後に実行します。")}>
                <Mail className="size-3.5" />
                メール送信
              </Button>
              <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => toast.info("FAX送信は送信前確認を開く準備状態です。外部送信は人間確認後に実行します。")}>
                <Send className="size-3.5" />
                FAX送信
              </Button>
              <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-700" onClick={() => toast.success(`${documentTypeLabel(type)}をコピーしました`)}>
                <Copy className="size-3.5" />
                コピー
              </Button>
              <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => onOpenChange(false)} disabled={saving}>
                キャンセル
              </Button>
              <Button type="button" size="sm" className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700" disabled={saving || !form.formState.isValid} onClick={() => void form.handleSubmit(onSubmit)()}>
                {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                保存
              </Button>
            </div>
          </div>
        </SheetHeader>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
              event.preventDefault();
              void form.handleSubmit(onSubmit)();
            }
          }}
        >
          <ScrollArea className="min-h-0 flex-1">
            <CoreDocumentWorkspace
              form={form}
              fields={fields}
              saving={saving}
              typeLocked={typeLocked}
              customerOpen={customerOpen}
              setCustomerOpen={setCustomerOpen}
              customerQuery={customerQuery}
              setCustomerQuery={setCustomerQuery}
              customerSuggestions={customerSuggestions}
              totals={totals}
              carrier={carrier}
              setCarrier={setCarrier}
              trackingNumber={trackingNumber}
              setTrackingNumber={setTrackingNumber}
              deliveryDate={deliveryDate}
              setDeliveryDate={setDeliveryDate}
              deliveryTimeSlot={deliveryTimeSlot}
              setDeliveryTimeSlot={setDeliveryTimeSlot}
              deliveryStatus={deliveryStatus}
              setDeliveryStatus={setDeliveryStatus}
              addLine={addLine}
              addNoteLine={addNoteLine}
              removeLine={remove}
              moveLine={move}
              config={config}
            />
          </ScrollArea>
          <SheetFooter className="shrink-0 border-t border-blue-300 bg-white/90 px-5 py-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="ml-auto grid w-full grid-cols-5 gap-4 text-sm md:max-w-[960px]" data-testid="document-amount-footer">
              <Amount label="小計" value={formatCurrency(totals.subtotal)} />
              <Amount label="消費税 10%" value={formatCurrency(totals.tax10)} />
              <Amount label="消費税 8%" value={formatCurrency(totals.tax8)} />
              <Amount label="合計金額" value={formatCurrency(totals.total)} strong />
              <Amount label="内消費税" value={formatCurrency(totals.tax)} />
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function CoreDocumentWorkspace({
  form,
  fields,
  saving,
  typeLocked,
  customerOpen,
  setCustomerOpen,
  customerQuery,
  setCustomerQuery,
  customerSuggestions,
  totals,
  carrier,
  setCarrier,
  trackingNumber,
  setTrackingNumber,
  deliveryDate,
  setDeliveryDate,
  deliveryTimeSlot,
  setDeliveryTimeSlot,
  deliveryStatus,
  setDeliveryStatus,
  addLine,
  addNoteLine,
  removeLine,
  moveLine,
  config,
}: {
  form: UseFormReturn<CoreDocumentFormValues>;
  fields: Array<{ id: string }>;
  saving: boolean;
  typeLocked: boolean;
  customerOpen: boolean;
  setCustomerOpen: (open: boolean) => void;
  customerQuery: string;
  setCustomerQuery: (value: string) => void;
  customerSuggestions: CustomerSuggestion[];
  totals: ReturnType<typeof calculateDocumentTotals>;
  carrier: string;
  setCarrier: (value: string) => void;
  trackingNumber: string;
  setTrackingNumber: (value: string) => void;
  deliveryDate: string;
  setDeliveryDate: (value: string) => void;
  deliveryTimeSlot: string;
  setDeliveryTimeSlot: (value: string) => void;
  deliveryStatus: string;
  setDeliveryStatus: (value: string) => void;
  addLine: () => void;
  addNoteLine: () => void;
  removeLine: (index: number) => void;
  moveLine: (from: number, to: number) => void;
  config: CoreDocumentUiConfig;
}) {
  const lines = form.watch("lines");
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const isDelivery = config.type === "delivery";
  const isPurchaseOrder = config.type === "purchase-order";
  const hasNoteLine = lines.some((line) => line.lineKind === "note");
  const [firstThirdField, secondThirdField, thirdThirdField, fourthThirdField] = config.thirdCardFields;

  function selectCustomer(customer: CustomerSuggestion) {
    form.setValue("customerName", customer.billingName || customer.customerName, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setCustomerQuery(customer.customerName);
    setCustomerOpen(false);
  }

  return (
    <div className="space-y-1.5 px-1.5 py-1.5 pb-2" data-testid="delivery-entry-workspace" data-core-document-workspace="true">
      <div className="grid items-start gap-1.5 xl:grid-cols-[minmax(280px,0.85fr)_minmax(560px,1.55fr)_minmax(360px,1fr)]">
        <section className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-none" data-testid="document-top-card">
          <div className="border-b bg-neutral-50/70 px-2.5 py-1.5">
            <h3 className="text-sm font-semibold">基本情報</h3>
          </div>
          <div className="grid gap-x-2 gap-y-1.5 px-2.5 py-1.5 md:grid-cols-2" data-testid="delivery-basic-content">
            <Field label="帳票種別" error={form.formState.errors.type?.message} required>
              {typeLocked ? (
                <div className="flex h-8 items-center rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm font-medium text-neutral-700">
                  {documentTypeLabel(form.watch("type"))}
                </div>
              ) : (
                <Controller
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value: CoreDocumentFormValues["type"]) => {
                        field.onChange(value);
                        form.setValue("documentNumber", createNextDocumentNumber(value), { shouldDirty: true, shouldValidate: true });
                      }}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quote">見積書</SelectItem>
                        <SelectItem value="order">注文書</SelectItem>
                        <SelectItem value="delivery">納品書</SelectItem>
                        <SelectItem value="invoice">請求書</SelectItem>
                        <SelectItem value="payment">入金伝票</SelectItem>
                        <SelectItem value="purchase-order">発注書</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
            </Field>
            <Field label={config.numberLabel} error={form.formState.errors.documentNumber?.message} required>
              <Input className="h-8" {...form.register("documentNumber")} />
            </Field>
            <div className="md:col-span-2">
              <Field label={config.partnerLabel} error={form.formState.errors.customerName?.message} required>
                <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 w-full justify-start bg-white px-3 text-left font-normal"
                      data-testid="customer-combobox"
                    >
                      <span className="truncate">{form.watch("customerName") || `${config.partnerLabel}マスタから検索`}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[420px] p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        autoFocus
                        placeholder={`${config.partnerLabel}名・コードで検索`}
                        value={customerQuery}
                        onValueChange={setCustomerQuery}
                        data-testid="customer-search"
                      />
                      <CommandList>
                        <CommandEmpty>該当する得意先がありません</CommandEmpty>
                        <CommandGroup>
                          {customerSuggestions.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              value={customer.customerName}
                              data-testid={`customer-option-${customer.id}`}
                              onSelect={() => selectCustomer(customer)}
                            >
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium">{customer.customerName}</div>
                                <div className="truncate text-[11px] text-neutral-500">
                                  {customer.customerCode} / {customer.contactName}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </Field>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-none" data-testid="document-top-card">
          <div className="border-b bg-neutral-50/70 px-2.5 py-1.5">
            <h3 className="text-sm font-semibold">{config.destinationTitle}</h3>
          </div>
          <div className="grid gap-x-2 gap-y-1.5 px-2.5 py-1.5 md:grid-cols-3" data-testid="delivery-destination-content">
            <Field label={config.destinationNameLabel}>
              <Input className="h-8" defaultValue={isPurchaseOrder ? "東京倉庫" : "東京本社"} />
            </Field>
            <Field label="部署名">
              <Input className="h-8" defaultValue="物流部" />
            </Field>
            <Field label="担当者名">
              <Input className="h-8" defaultValue="佐藤 一郎" />
            </Field>
            <Field label="郵便番号">
              <Input className="h-8" defaultValue="100-0014" />
            </Field>
            <Field label="都道府県">
              <Select defaultValue="tokyo">
                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tokyo">東京都</SelectItem>
                  <SelectItem value="osaka">大阪府</SelectItem>
                  <SelectItem value="hokkaido">北海道</SelectItem>
                  <SelectItem value="fukuoka">福岡県</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="市区町村">
              <Input className="h-8" defaultValue="千代田区永田町" />
            </Field>
            <div className="md:col-span-2">
              <Field label="番地・建物名">
                <Input className="h-8" defaultValue="1-7-1 東京本社ビル 1F倉庫" />
              </Field>
            </div>
            <Field label="電話番号">
              <Input className="h-8" defaultValue="03-1234-5678" />
            </Field>
          </div>
        </section>

        {isDelivery ? (
        <section className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-none" data-testid="document-top-card">
          <div className="border-b bg-neutral-50/70 px-2.5 py-1.5">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold">
              <Truck className="size-4" />
              {config.thirdCardTitle}
            </h3>
          </div>
          <div className="grid gap-x-2 gap-y-1.5 px-2.5 py-1.5 md:grid-cols-2" data-testid="delivery-shipping-content">
            <Field label="配送業者" required>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger className="h-8" data-testid="delivery-carrier">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yamato">ヤマト運輸</SelectItem>
                  <SelectItem value="japanpost">日本郵便</SelectItem>
                  <SelectItem value="sagawa">佐川急便</SelectItem>
                  <SelectItem value="seino">西濃運輸</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="サービス種別">
              <Select value={deliveryStatus} onValueChange={setDeliveryStatus}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="宅急便">宅急便</SelectItem>
                  <SelectItem value="ネコポス">ネコポス</SelectItem>
                  <SelectItem value="飛脚宅配便">飛脚宅配便</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Field label="お問い合わせ番号" required>
                <div className="flex gap-2">
                  <Input
                    className="h-8"
                    value={trackingNumber}
                    onChange={(event) => setTrackingNumber(event.target.value)}
                    placeholder="例: 1234-5678-9012"
                    data-testid="delivery-tracking-number"
                  />
                  <Button type="button" variant="outline" className="h-8 px-3 text-blue-700" onClick={() => toast.info(`${trackingNumber || "お問い合わせ番号"} の追跡を準備します`)}>
                    追跡
                  </Button>
                </div>
              </Field>
            </div>
            <Field label="納品日">
              <Input className="h-8" value={deliveryDate.replaceAll("-", "/")} onChange={(event) => setDeliveryDate(event.target.value.replaceAll("/", "-"))} />
            </Field>
            <Field label="配送希望時間帯">
              <Select value={deliveryTimeSlot} onValueChange={setDeliveryTimeSlot}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="am">午前中</SelectItem>
                  <SelectItem value="pm1">14:00-16:00</SelectItem>
                  <SelectItem value="pm2">16:00-18:00</SelectItem>
                  <SelectItem value="none">指定なし</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </section>
        ) : (
        <section className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-none" data-testid="document-top-card">
          <div className="border-b bg-neutral-50/70 px-2.5 py-1.5">
            <h3 className="text-sm font-semibold">{config.thirdCardTitle}</h3>
          </div>
          <div className="grid gap-x-2 gap-y-1.5 px-2.5 py-1.5 md:grid-cols-2">
            <Field label={firstThirdField}>
              <Input className="h-8" type="date" value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} />
            </Field>
            <Field label={secondThirdField}>
              <Select value={deliveryStatus} onValueChange={setDeliveryStatus}>
                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="管理中">管理中</SelectItem>
                  <SelectItem value="確認待ち">確認待ち</SelectItem>
                  <SelectItem value="承認準備">承認準備</SelectItem>
                  <SelectItem value="銀行振込">銀行振込</SelectItem>
                  <SelectItem value="口座振替">口座振替</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            {fourthThirdField ? (
              <>
                <Field label={thirdThirdField}>
                  <Input className="h-8" placeholder={config.type === "payment" ? "I20260529-01" : "例: 銀行振込"} />
                </Field>
                <Field label={fourthThirdField}>
                  <Input className="h-8" placeholder={config.type === "payment" ? "0" : "補足事項"} />
                </Field>
              </>
            ) : (
              <div className="md:col-span-2">
                <Field label={thirdThirdField}>
                  <Input className="h-8" placeholder="補足事項" />
                </Field>
              </div>
            )}
          </div>
        </section>
        )}
      </div>

      <div className="grid gap-2">
        <section className="rounded-md border border-neutral-200 bg-white shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-1.5 border-b bg-neutral-50/70 px-2.5 py-1.5">
            <h3 className="text-sm font-semibold">明細一覧</h3>
            <div className="flex flex-wrap items-center gap-1">
              <Button type="button" variant="outline" size="sm" className="h-7 gap-1 px-2" onClick={addLine}>
                <Plus className="size-3.5" />
                行を追加
              </Button>
              <Button type="button" variant="outline" size="sm" className="h-7 gap-1 px-2" onClick={addLine}>
                <PackagePlus className="size-3.5" />
                商品を追加
              </Button>
              <Button type="button" variant="outline" size="sm" className="h-7 gap-1 px-2" onClick={addNoteLine} disabled={hasNoteLine}>
                <Plus className="size-3.5" />
                備考行を追加
              </Button>
              <Button type="button" variant="outline" size="sm" className="h-7 px-2" onClick={() => toast.info("一括割引は承認確認後に適用します")}>
                一括割引
              </Button>
              <Button type="button" variant="outline" size="sm" className="h-7 px-2" onClick={() => toast.info("一括削除は確認画面で対象行を確認します")}>
                一括削除
              </Button>
            </div>
          </div>
          <div className="px-1.5 py-1.5">
            <div
              data-line-table-header
              className="grid grid-cols-[20px_20px_116px_minmax(720px,1fr)_34px_42px_50px_64px_44px_92px_40px] items-center overflow-hidden rounded-t-md border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-600"
            >
              <div className="px-[6px] py-[6px]" data-testid="line-header-drag" />
              <div className="border-l border-neutral-200 px-[2px] py-[6px] text-center" data-testid="line-header-no">No.</div>
              <div className="border-l border-neutral-200 px-[6px] py-[6px]" data-testid="line-header-code">商品コード</div>
              <div className="border-l border-neutral-200 px-[6px] py-[6px]" data-testid="line-header-product">{config.lineMode === "payment" ? "対象請求書 / 入金内容" : "商品名 / 規格"}</div>
              <div className="border-l border-neutral-200 px-[3px] py-[6px] text-center" data-testid="line-header-unit">単位</div>
              <div className="border-l border-neutral-200 px-[4px] py-[6px] text-right" data-testid="line-header-pack">入数</div>
              <div className="border-l border-neutral-200 px-[4px] py-[6px] text-right" data-testid="line-header-quantity">数量</div>
              <div className="border-l border-neutral-200 px-[4px] py-[6px] text-right" data-testid="line-header-unit-price">単価</div>
              <div className="border-l border-neutral-200 px-[2px] py-[6px] text-center" data-testid="line-header-tax-rate">税率</div>
              <div className="border-l border-neutral-200 px-[6px] py-[6px] text-right" data-testid="line-header-amount">金額</div>
              <div className="border-l border-neutral-200 px-[2px] py-[6px] text-center" data-testid="line-header-actions">操作</div>
            </div>
            <div className="overflow-hidden rounded-b-md border-x border-b border-neutral-200">
              {fields.map((field, index) => {
                const errors = form.formState.errors.lines?.[index];
                const isNoteLine = form.watch(`lines.${index}.lineKind`) === "note";
                return (
                  <div
                    key={field.id}
                    data-line-table-row
                    draggable={!saving}
                    onDragStart={() => setDraggingIndex(index)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      if (draggingIndex === null || draggingIndex === index) return;
                      moveLine(draggingIndex, index);
                      setDraggingIndex(null);
                    }}
                    onDragEnd={() => setDraggingIndex(null)}
                    className={cn(
                      "grid grid-cols-[20px_20px_116px_minmax(720px,1fr)_34px_42px_50px_64px_44px_92px_40px] items-center border-t border-neutral-200 bg-white first:border-t-0",
                      draggingIndex === index && "opacity-60",
                    )}
                  >
                    <button
                      type="button"
                      className="flex h-8 w-5 cursor-grab items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                      aria-label={`${index + 1}行目をドラッグ`}
                    >
                      <GripVertical className="size-3.5" />
                    </button>
                    <div className="border-l border-neutral-200 px-[2px] py-[6px] text-center text-xs text-neutral-500">{index + 1}</div>
                    {isNoteLine ? (
                      <>
                        <input type="hidden" {...form.register(`lines.${index}.lineKind`)} />
                        <input type="hidden" {...form.register(`lines.${index}.productCode`)} />
                        <input type="hidden" {...form.register(`lines.${index}.unit`)} />
                        <input type="hidden" {...form.register(`lines.${index}.packageQuantity`, { valueAsNumber: true })} />
                        <input type="hidden" {...form.register(`lines.${index}.quantity`, { valueAsNumber: true })} />
                        <input type="hidden" {...form.register(`lines.${index}.unitPrice`, { valueAsNumber: true })} />
                        <input type="hidden" {...form.register(`lines.${index}.taxRate`, { valueAsNumber: true })} />
                        <div className="col-span-8 border-l border-neutral-200 px-[6px] py-[6px]">
                          <Input
                            className={cellInputClassName}
                            data-testid={`line-note-${index}`}
                            {...form.register(`lines.${index}.productName`)}
                          />
                        </div>
                        <div className="flex items-center justify-center gap-0.5 border-l border-neutral-200 px-[1px] py-[6px]">
                          <Button type="button" variant="ghost" size="icon" className={lineActionButtonClassName} aria-label={`${index + 1}行目をコピー`}>
                            <Copy className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={cn(lineActionButtonClassName, "hover:text-red-600")}
                            onClick={() => fields.length > 1 && removeLine(index)}
                            disabled={fields.length === 1 || saving}
                            aria-label={`${index + 1}行目を削除`}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <input type="hidden" {...form.register(`lines.${index}.lineKind`)} />
                        <input type="hidden" {...form.register(`lines.${index}.spec`)} />
                        <div className="border-l border-neutral-200 px-[6px] py-[6px]">
                          <Input
                            className={cn(cellInputClassName, "px-0.5 !font-mono !text-[10px] tabular-nums")}
                            data-testid={`line-code-${index}`}
                            maxLength={13}
                            {...form.register(`lines.${index}.productCode`)}
                          />
                        </div>
                        <div className="min-w-0 border-l border-neutral-200 px-[6px] py-[6px]">
                          <ProductSuggestInput
                            value={form.watch(`lines.${index}.productName`) ?? ""}
                            inputName={`lines.${index}.productName`}
                            testId={`line-product-${index}`}
                            disabled={saving}
                            triggerClassName={cellSelectButtonClassName}
                            onChange={(value) => {
                              form.setValue(`lines.${index}.productName`, value, { shouldDirty: true, shouldValidate: true });
                            }}
                            onSelect={(product) => {
                              form.setValue(`lines.${index}.productCode`, (product.janCode || product.id).slice(0, 13), { shouldDirty: true, shouldValidate: true });
                              form.setValue(`lines.${index}.productName`, product.productName, { shouldDirty: true, shouldValidate: true });
                              form.setValue(`lines.${index}.unit`, "枚", { shouldDirty: true, shouldValidate: true });
                              form.setValue(`lines.${index}.packageQuantity`, 1, { shouldDirty: true, shouldValidate: true });
                              form.setValue(`lines.${index}.unitPrice`, product.standardPrice, { shouldDirty: true, shouldValidate: true });
                            }}
                          />
                          <InlineError message={errors?.productName?.message} />
                        </div>
                        <div className="border-l border-neutral-200 px-[3px] py-[6px]">
                          <Controller
                            control={form.control}
                            name={`lines.${index}.unit`}
                            render={({ field }) => (
                              <Select value={field.value || "枚"} onValueChange={field.onChange}>
                                <SelectTrigger className={cn(cellSelectClassName, "justify-center px-0 text-center")} data-testid={`line-unit-${index}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="枚">枚</SelectItem>
                                  <SelectItem value="個">個</SelectItem>
                                  <SelectItem value="箱">箱</SelectItem>
                                  <SelectItem value="巻">巻</SelectItem>
                                  <SelectItem value="袋">袋</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div className="border-l border-neutral-200 px-[4px] py-[6px]">
                          <Input
                            className={cn(cellNumberInputClassName, "text-right")}
                            type="number"
                            min={0}
                            step="1"
                            {...form.register(`lines.${index}.packageQuantity`, { valueAsNumber: true })}
                          />
                        </div>
                        <div className="border-l border-neutral-200 px-[4px] py-[6px]">
                          <Input
                            className={cn(cellNumberInputClassName, "text-right")}
                            type="number"
                            min={0.01}
                            step="0.01"
                            data-testid={`line-quantity-${index}`}
                            {...form.register(`lines.${index}.quantity`, { valueAsNumber: true })}
                          />
                        </div>
                        <div className="border-l border-neutral-200 px-[4px] py-[6px]">
                          <Input
                            className={cn(cellNumberInputClassName, "text-right")}
                            type="number"
                            min={0}
                            step={1}
                            data-testid={`line-unit-price-${index}`}
                            {...form.register(`lines.${index}.unitPrice`, { valueAsNumber: true })}
                          />
                        </div>
                        <div className="border-l border-neutral-200 px-[2px] py-[6px]">
                          <Controller
                            control={form.control}
                            name={`lines.${index}.taxRate`}
                            render={({ field }) => (
                              <Select value={String(field.value ?? 10)} onValueChange={(value) => field.onChange(Number(value))}>
                                <SelectTrigger className={cn(cellSelectClassName, "w-[40px] justify-center px-[2px] text-center text-xs")} data-testid={`line-tax-rate-${index}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="10">10%</SelectItem>
                                  <SelectItem value="8">8%</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div className="truncate border-l border-neutral-200 px-[6px] py-[6px] text-right text-xs font-semibold tabular-nums text-neutral-950" data-testid={`line-subtotal-${index}`}>
                          {formatCurrency(totals.lineTotals[index] ?? 0)}
                        </div>
                        <div className="flex items-center justify-center gap-0.5 border-l border-neutral-200 px-[1px] py-[6px]">
                          <Button type="button" variant="ghost" size="icon" className={lineActionButtonClassName} aria-label={`${index + 1}行目をコピー`}>
                            <Copy className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={cn(lineActionButtonClassName, "hover:text-red-600")}
                            onClick={() => fields.length > 1 && removeLine(index)}
                            disabled={fields.length === 1 || saving}
                            aria-label={`${index + 1}行目を削除`}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-1.5 xl:grid-cols-[1fr_0.85fr]">
        <section className="rounded-md border border-neutral-200 bg-white shadow-sm">
          <div className="border-b bg-neutral-50/70 px-2.5 py-1.5">
            <h3 className="text-sm font-semibold">備考・メモ</h3>
          </div>
          <div className="px-2.5 py-1.5">
            <Textarea
              className="min-h-16 resize-none text-sm"
              placeholder={isDelivery ? "納品書に記載する備考、納品時の注意事項など" : config.memoPlaceholder}
              {...form.register("memo")}
            />
            <InlineError message={form.formState.errors.memo?.message} />
          </div>
        </section>

        <section className="rounded-md border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b bg-neutral-50/70 px-2.5 py-1.5">
            <h3 className="text-sm font-semibold">履歴</h3>
            <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-xs">
              履歴をすべて表示
            </Button>
          </div>
          <div className="space-y-1.5 px-2.5 py-1.5 text-xs">
            <div className="grid grid-cols-[112px_72px_1fr] gap-2 border-b border-neutral-100 pb-2">
              <span>{new Date().toLocaleDateString("ja-JP")}</span>
              <span>core-ui</span>
              <span>{config.historyCreatedText}</span>
            </div>
            <div className="grid grid-cols-[112px_72px_1fr] gap-2 text-neutral-600">
              <span>{new Date().toLocaleDateString("ja-JP")}</span>
              <span>core-ui</span>
              <span>{config.thirdCardTitle}を確認中</span>
            </div>
          </div>
        </section>

      </div>

      <div className="sr-only" data-testid="delivery-form-line-count">
        {lines.length}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  error,
  required,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1" data-field-label={label}>
      <span className="block text-[12px] font-medium leading-4 text-neutral-600">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </span>
      {children}
      <InlineError message={error} />
    </div>
  );
}

function ProductSuggestInput({
  value,
  inputName,
  testId,
  disabled,
  triggerClassName,
  onChange,
  onSelect,
}: {
  value: string;
  inputName: string;
  testId: string;
  disabled?: boolean;
  triggerClassName?: string;
  onChange: (value: string) => void;
  onSelect: (product: ProductSuggestion) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [products, setProducts] = useState<ProductSuggestion[]>([]);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`/core/api/masters/products?q=${encodeURIComponent(query)}&limit=10`, {
        headers: { accept: "application/json" },
        signal: controller.signal,
      })
        .then((response) => response.json() as Promise<{ success: boolean; products?: ProductSuggestion[] }>)
        .then((data) => {
          if (!cancelled) setProducts(data.success ? data.products ?? [] : []);
        })
        .catch(() => {
          if (!cancelled) setProducts([]);
        });
    }, 120);
    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [open, query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn("h-8 w-full justify-start bg-white px-3 text-left font-normal", triggerClassName)}
          data-testid={testId}
        >
          <span className={cn("truncate", !value && "text-neutral-400")}>{value || "商品マスタから検索"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[520px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            name={inputName}
            placeholder="商品名・JANで検索"
            value={query}
            onValueChange={(nextValue) => {
              setQuery(nextValue);
              onChange(nextValue);
            }}
            data-testid={`${testId}-search`}
          />
          <CommandList>
            <CommandEmpty>該当する商品がありません</CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.productName}
                  data-testid={`product-option-${product.id}`}
                  onSelect={() => {
                    onSelect(product);
                    setQuery(product.productName);
                    setOpen(false);
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{product.productName}</div>
                    <div className="truncate text-[11px] text-neutral-500">
                      JAN {product.janCode || "-"} / 標準単価 {formatCurrency(product.standardPrice)} / 在庫 {product.stockQuantity}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function InlineError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="min-h-4 text-[11px] leading-4 text-red-600">{message}</span>;
}

function Amount({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn("grid gap-0.5", strong && "font-semibold")}>
      <span className="text-[11px] text-neutral-500">{label}</span>
      <span className={cn("text-right text-sm", strong && "text-2xl leading-none text-neutral-950")} data-testid={strong ? "document-total" : undefined}>
        {value}
      </span>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}
