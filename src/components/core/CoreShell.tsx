import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Copy,
  Download,
  Edit3,
  FilePlus2,
  GripVertical,
  Mail,
  PackagePlus,
  Plus,
  Printer,
  Save,
  Search,
  Send,
  SlidersHorizontal,
  Trash2,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { DocumentTable, InventoryTable, StatusBadge } from "@/components/core/CoreDataTable";
import { DeliveryPrintPreview, type DeliveryPrintModel, type DeliveryPreviewLine } from "@/components/core/documents/DeliveryPrintPreview";
import { deliveryDetailTypography as t } from "@/components/core/documents/detail/deliveryDetailTypography";
import { CoreKpiCard } from "@/components/core/CoreKpiCard";
import { CorePageHeader } from "@/components/core/CorePageHeader";
import { CoreDesignWorkspace } from "@/components/core/CoreDesignWorkspace";
import { CoreHelpWorkspace } from "@/components/core/CoreHelpWorkspace";
import { CorePimHubDashboard } from "@/components/core/CorePimHubDashboard";
import { CoreSettingsWorkspace } from "@/components/core/CoreSettingsWorkspace";
import { CoreSidebar } from "@/components/core/CoreSidebar";
import { CoreTopbar } from "@/components/core/CoreTopbar";
import { CustomerDeliveryMaster } from "@/components/core/CustomerDeliveryMaster";
import { DocumentEntryForm } from "@/components/core/forms/DocumentEntryForm";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import {
  activities,
  documents,
  formatCurrency,
  inventories,
  inventoryHistory,
  kpis,
  salesTrend,
  users,
  viewMeta,
  type CoreView,
  type DocumentRow,
  type InventoryRow,
  type StatusTone,
} from "@/data/core-sample-data";
import type { CoreDocumentFormValues } from "@/lib/coreDocumentFormSchema";
import { documentUiConfigByLabel, documentUiConfigByType, type CoreDocumentUiConfig } from "@/lib/coreDocumentUiConfig";
import { cn } from "@/lib/utils";

interface CoreShellProps {
  view: CoreView;
  initialPreviewDocumentId?: string;
}

const tabs = ["すべて", "下書き", "発行済", "発行済み", "未入金", "入金済み"];

const denseDocumentPartners = [
  "株式会社サンプル",
  "テスト株式会社",
  "北海原材料卸",
  "サンプル商事株式会社",
  "東京建材販売",
  "札幌ロジスティクス",
  "東日本設備",
  "中央商事",
  "丸北資材",
  "AIBOUXテスト取引先",
];

const denseDocumentOwners = ["山田 太郎", "佐藤 健二郎", "中村 美咲", "core"];

const denseDocumentStatuses: Array<{ status: string; tone: StatusTone }> = [
  { status: "下書き", tone: "neutral" },
  { status: "発行済", tone: "green" },
  { status: "下書き", tone: "neutral" },
  { status: "発行済", tone: "green" },
  { status: "下書き", tone: "neutral" },
  { status: "発行済", tone: "green" },
  { status: "下書き", tone: "neutral" },
  { status: "発行済", tone: "green" },
  { status: "下書き", tone: "neutral" },
  { status: "発行済", tone: "green" },
];

const documentPrefixByLabel: Record<string, string> = {
  見積書: "Q",
  注文書: "O",
  納品書: "N",
  請求書: "I",
  入金伝票: "R",
  発注書: "P",
};

const viewTypeFilter: Partial<Record<CoreView, string>> = {
  estimates: "見積書",
  orders: "注文書",
  deliveries: "納品書",
  invoices: "請求書",
  payments: "入金伝票",
  "purchase-orders": "発注書",
};

const documentViews = new Set<CoreView>(["estimates", "orders", "deliveries", "invoices", "payments", "purchase-orders"]);

const viewDocumentFormType: Partial<Record<CoreView, CoreDocumentFormValues["type"]>> = {
  estimates: "quote",
  orders: "order",
  deliveries: "delivery",
  invoices: "invoice",
  payments: "payment",
  "purchase-orders": "purchase-order",
};

export default function CoreShell({ view, initialPreviewDocumentId }: CoreShellProps) {
  const meta = viewMeta[view];
  const [selectedDocument, setSelectedDocument] = useState<DocumentRow | null>(null);
  const [selectedInventory, setSelectedInventory] = useState<InventoryRow | null>(null);
  const [documentFormOpen, setDocumentFormOpen] = useState(false);
  const [documentFormType, setDocumentFormType] = useState<CoreDocumentFormValues["type"]>("quote");
  const [documentFormInitialDocument, setDocumentFormInitialDocument] = useState<DocumentEntryInitialDocument | null>(null);
  const [documentRefreshKey, setDocumentRefreshKey] = useState(0);
  const documentTypeLocked = documentViews.has(view);

  const filteredDocuments = useMemo(() => {
    const docType = viewTypeFilter[view];
    if (!docType) {
      return documents;
    }
    return documents.filter((row) => row.type === docType);
  }, [view]);

  const content = (() => {
    if (view === "dashboard") {
      return <DashboardContent onSelectDocument={setSelectedDocument} onSelectInventory={setSelectedInventory} />;
    }

    if (view === "invoice-new") {
      return <InvoiceCreateContent />;
    }

    if (view === "inventory" || view === "inventory-alerts") {
      return <InventoryContent mode={view} onSelect={setSelectedInventory} />;
    }

    if (view === "inventory-history") {
      return <InventoryHistoryContent />;
    }

    if (view === "partners") {
      return <PartnerMasterContent />;
    }

    if (view === "products") {
      return <ProductMasterContent />;
    }

    if (view === "users") {
      return <UserMasterContent />;
    }

    if (view === "settings") {
      return <CoreSettingsWorkspace />;
    }

    if (view === "design") {
      return <CoreDesignWorkspace />;
    }

    if (view === "help") {
      return <CoreHelpWorkspace />;
    }

    return (
      <DocumentListContent
        view={view}
        rows={filteredDocuments}
        refreshKey={documentRefreshKey}
        onPrint={openDocumentPrint}
        onCreate={openDocumentCreateForView}
        onEdit={openDocumentEditForRow}
        initialPreviewDocumentId={initialPreviewDocumentId}
      />
    );
  })();

  function openDocumentPrint(row: DocumentRow) {
    const lookupId = encodeURIComponent(row.documentId || row.id);
    window.open(`/core/documents/print/${lookupId}?print=1`, "_blank", "noopener,noreferrer");
  }

  function openDocumentCreateForView() {
    const formType = viewDocumentFormType[view];
    if (!formType) return;
    setDocumentFormType(formType);
    setDocumentFormInitialDocument(null);
    setDocumentFormOpen(true);
  }

  function openDocumentEditForRow(row: DocumentRow) {
    const formType = documentUiConfigByLabel(row.type).type;
    setDocumentFormType(formType);
    setDocumentFormInitialDocument({
      id: row.documentId,
      documentNumber: row.id,
      customerName: row.partner,
      issueDate: getDocumentDisplayDate(row, documentUiConfigByType(formType)),
      status: documentStatusFromLabel(row.status),
    });
    setDocumentFormOpen(true);
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-white text-neutral-900">
        <CoreSidebar activeView={view} />
        <div className="flex h-screen min-w-0 flex-1 flex-col">
          <CoreTopbar activeView={view} title={meta.title} onToggleAssistant={() => window.dispatchEvent(new Event("aiboux-ai-open"))} />
          <ScrollArea className="min-h-0 flex-1 bg-white">
            <main className="mx-auto w-full max-w-[1680px] space-y-3 px-3 py-3 sm:px-4 lg:px-5">
              {documentViews.has(view) ? null : (
                <CorePageHeader
                  title={meta.title}
                  description={meta.description}
                  primaryAction={meta.primaryAction}
                  onPrimaryAction={() => toast.success(`${meta.primaryAction} を開始しました`)}
                />
              )}
              {content}
            </main>
          </ScrollArea>
        </div>
        <DocumentDetailSheet
          row={selectedDocument}
          onOpenChange={(open) => !open && setSelectedDocument(null)}
          onPrint={openDocumentPrint}
        />
        <InventoryDetailSheet row={selectedInventory} onOpenChange={(open) => !open && setSelectedInventory(null)} />
        <DocumentEntryForm
          open={documentFormOpen}
          defaultType={documentFormType}
          initialDocument={documentFormInitialDocument}
          typeLocked={documentTypeLocked}
          onOpenChange={(open) => {
            setDocumentFormOpen(open);
            if (!open) setDocumentFormInitialDocument(null);
          }}
          onSaved={() => {
            setDocumentRefreshKey((current) => current + 1);
            toast.success("一覧を更新しました");
          }}
        />
      </div>
      <Toaster position="top-right" richColors />
    </TooltipProvider>
  );
}

type DocumentEntryInitialDocument = {
  id?: string;
  documentNumber: string;
  customerName: string;
  issueDate: string;
  status?: CoreDocumentFormValues["status"];
};

function documentStatusFromLabel(status: string): CoreDocumentFormValues["status"] {
  if (status === "発行済" || status === "発行済み") return "issued";
  if (status === "送付済み") return "sent";
  if (status === "承認済み" || status === "完了" || status === "納品済み") return "accepted";
  if (status === "無効") return "void";
  return "draft";
}

function DashboardContent({
  onSelectDocument,
  onSelectInventory,
}: {
  onSelectDocument: (row: DocumentRow) => void;
  onSelectInventory: (row: InventoryRow) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
        {kpis.map((item) => (
          <CoreKpiCard key={item.label} item={item} />
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.35fr_0.85fr]">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-3">
            <div>
              <CardTitle className="text-base">最近の取引</CardTitle>
              <CardDescription className="text-xs">帳票、入金、承認の最新処理</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8">
              すべて見る
            </Button>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <RecentDocumentsCompact rows={documents.slice(0, 5)} onSelect={onSelectDocument} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-3">
            <div>
              <CardTitle className="text-base">在庫アラート</CardTitle>
              <CardDescription className="text-xs">上位5件</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8">
              すべて見る
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            {inventories.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => onSelectInventory(item)}
                className="flex w-full items-center gap-2 rounded-md border border-transparent p-1.5 text-left hover:border-neutral-200 hover:bg-neutral-50"
              >
                <StatusBadge tone={item.tone}>{item.status}</StatusBadge>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{item.name}</div>
                  <div className="text-[11px] text-neutral-500">
                    {item.sku} / {item.currentStock} / {item.idealStock}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <Card className="shadow-sm xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between p-3">
            <CardTitle className="text-base">売上推移</CardTitle>
            <Select defaultValue="monthly">
              <SelectTrigger size="sm" className="h-8 w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">月次</SelectItem>
                <SelectItem value="weekly">週次</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="flex h-[180px] items-end gap-2 border-b border-l border-neutral-200 px-2 pb-2">
              {salesTrend.map((point) => (
                <div key={point.month} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-blue-600"
                    style={{ height: `${Math.max(18, point.value / 9)}px` }}
                    aria-label={`${point.month}: ${point.value}`}
                  />
                  <span className="text-[11px] text-neutral-500">{point.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="p-3">
            <CardTitle className="text-base">未入金一覧</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            {documents
              .filter((doc) => doc.status === "未入金" || doc.status === "承認待ち")
              .map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-md border border-neutral-200 p-2">
                  <div>
                    <div className="text-sm font-medium">{doc.partner}</div>
                    <div className=" text-[11px] text-neutral-500">{doc.id}</div>
                  </div>
                  <div className="text-right">
                    <div className=" text-sm">{formatCurrency(doc.amount)}</div>
                    <div className="text-[11px] text-red-600">11日超</div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="p-3">
            <CardTitle className="text-base">アクティビティ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-neutral-800">{activity.title}</div>
                  <div className="text-[11px] text-neutral-500">{activity.meta}</div>
                </div>
                <div className="text-[11px] text-neutral-500">{activity.time}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RecentDocumentsCompact({
  rows,
  onSelect,
}: {
  rows: DocumentRow[];
  onSelect: (row: DocumentRow) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50">
            <TableHead className="h-8 px-2 text-xs">種別</TableHead>
            <TableHead className="h-8 px-2 text-xs">番号</TableHead>
            <TableHead className="h-8 px-2 text-xs">取引先</TableHead>
            <TableHead className="h-8 px-2 text-right text-xs">金額</TableHead>
            <TableHead className="h-8 px-2 text-xs">状態</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="h-9 cursor-pointer hover:bg-neutral-50" onClick={() => onSelect(row)}>
              <TableCell className="px-2 py-1 text-xs font-medium">{row.type}</TableCell>
              <TableCell className="px-2 py-1 text-[11px]">{row.id}</TableCell>
              <TableCell className="max-w-[170px] truncate px-2 py-1 text-sm font-medium">{row.partner}</TableCell>
              <TableCell className="px-2 py-1 text-right text-xs">{formatCurrency(row.amount)}</TableCell>
              <TableCell className="px-2 py-1">
                <StatusBadge tone={row.tone}>{row.status}</StatusBadge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function dedupeDocumentRows(rows: DocumentRow[]) {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = `${row.type}:${row.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildDenseDocumentRows(rows: DocumentRow[], typeLabel: string, monthKey: string) {
  const prefix = documentPrefixByLabel[typeLabel] ?? "D";
  const baseRows = rows.length
    ? rows
    : [{
        id: `${prefix}${monthKey.replace("/", "")}-01`,
        type: typeLabel,
        partner: denseDocumentPartners[0],
        issuedAt: `${monthKey}/29`,
        dueAt: `${monthKey}/29`,
        amount: 128000,
        status: "下書き",
        tone: "neutral" as StatusTone,
        owner: denseDocumentOwners[0],
      }];

  if (baseRows.length >= 8) return baseRows.slice(0, 12);

  const nextRows = [...baseRows];
  for (let index = baseRows.length; index < 10; index += 1) {
    const seed = baseRows[index % baseRows.length];
    const status = denseDocumentStatuses[index % denseDocumentStatuses.length];
    const day = String(Math.max(1, 29 - index)).padStart(2, "0");
    nextRows.push({
      ...seed,
      documentId: undefined,
      id: `${prefix}${monthKey.replace("/", "")}-${String(index + 1).padStart(2, "0")}`,
      partner: denseDocumentPartners[index % denseDocumentPartners.length],
      issuedAt: `${monthKey}/${day}`,
      dueAt: `${monthKey}/${day}`,
      amount: Math.max(12000, seed.amount + index * 18000),
      status: status.status,
      tone: status.tone,
      owner: denseDocumentOwners[index % denseDocumentOwners.length],
    });
  }
  return nextRows;
}

function DocumentListContent({
  view,
  rows,
  refreshKey,
  onPrint,
  onCreate,
  onEdit,
  initialPreviewDocumentId,
}: {
  view: CoreView;
  rows: DocumentRow[];
  refreshKey: number;
  onPrint: (row: DocumentRow) => void;
  onCreate: () => void;
  onEdit: (row: DocumentRow) => void;
  initialPreviewDocumentId?: string;
}) {
  const [persistedRows, setPersistedRows] = useState<DocumentRow[] | null>(null);
  const [detailRow, setDetailRow] = useState<DocumentRow | null>(null);
  const [previewDismissed, setPreviewDismissed] = useState(false);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<Set<string>>(() => new Set());
  const [statusFilter, setStatusFilter] = useState("すべて");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const documentApiType = viewDocumentFormType[view] ?? null;
  const config = documentApiType ? documentUiConfigByType(documentApiType) : documentUiConfigByLabel(viewMeta[view].title);
  const currentMonth = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const end = new Date(year, month + 1, 0);
    const monthNumber = month + 1;
    return {
      key: `${year}/${String(monthNumber).padStart(2, "0")}`,
      label: `${year}年${monthNumber}月`,
      rangeLabel: `${year}/${String(monthNumber).padStart(2, "0")}/01 - ${year}/${String(monthNumber).padStart(2, "0")}/${String(end.getDate()).padStart(2, "0")}`,
    };
  }, []);
  const displayRows = useMemo(() => {
    const baseRows = persistedRows ? [...persistedRows, ...rows] : rows;
    const monthlyRows = dedupeDocumentRows(baseRows.filter((row) => row.issuedAt.startsWith(currentMonth.key)));
    return buildDenseDocumentRows(monthlyRows, config.listTitle, currentMonth.key);
  }, [config.listTitle, currentMonth.key, persistedRows, rows]);
  const owners = useMemo(() => Array.from(new Set(displayRows.map((row) => row.owner))).filter(Boolean), [displayRows]);
  const clientPreviewDocumentId = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") !== "delivery-detail") return "";
    return params.get("document") || "N20260530-01";
  }, []);
  const previewDocumentId = view === "deliveries" ? (initialPreviewDocumentId || clientPreviewDocumentId) : "";
  const previewRow = useMemo(() => {
    if (!previewDocumentId) return null;
    return displayRows.find((row) => row.id === previewDocumentId || row.documentId === previewDocumentId) ?? null;
  }, [displayRows, previewDocumentId]);
  const filteredRows = useMemo(() => {
    return displayRows.filter((row) => {
      const statusMatched = statusFilter === "すべて" || row.status === statusFilter;
      const ownerMatched = ownerFilter === "all" || row.owner === ownerFilter;
      return statusMatched && ownerMatched;
    });
  }, [displayRows, ownerFilter, statusFilter]);
  const visibleRows = filteredRows.length ? filteredRows : [];
  const visibleRowIds = useMemo(() => new Set(visibleRows.map((row) => row.id)), [visibleRows]);
  const selectedCount = selectedDocumentIds.size;
  const summary = useMemo(() => {
    const totalAmount = filteredRows.reduce((sum, row) => sum + row.amount, 0);
    return [
      { label: "今月の件数", value: `${filteredRows.length}件`, note: "", tone: "neutral" as StatusTone },
      { label: "今月の下書き", value: `${displayRows.filter((row) => row.status === "下書き").length}件`, note: "", tone: "neutral" as StatusTone },
      { label: "今月の発行済", value: `${displayRows.filter((row) => row.status === "発行済" || row.status === "発行済み" || row.status === "入金済み").length}件`, note: "", tone: "green" as StatusTone },
      { label: "今月の対象金額", value: formatCurrency(totalAmount), note: "", tone: "blue" as StatusTone },
    ];
  }, [displayRows, filteredRows]);

  useEffect(() => {
    if (!documentApiType) {
      setPersistedRows(null);
      return;
    }
    let cancelled = false;
    fetch(`/core/api/documents/save?type=${documentApiType}`, { headers: { accept: "application/json" } })
      .then((response) => response.json() as Promise<{ success: boolean; documents?: DocumentRow[] }>)
      .then((data) => {
        if (cancelled) return;
        setPersistedRows(data.success && data.documents?.length ? data.documents : rows);
      })
      .catch(() => {
        if (!cancelled) setPersistedRows(rows);
      })
    return () => {
      cancelled = true;
    };
  }, [documentApiType, refreshKey, rows]);

  useEffect(() => {
    if (!visibleRows.length) {
      if (selectedDocumentIds.size) setSelectedDocumentIds(new Set());
      return;
    }
    setSelectedDocumentIds((current) => {
      const next = new Set(Array.from(current).filter((id) => visibleRowIds.has(id)));
      return next.size === current.size ? current : next;
    });
  }, [detailRow, selectedDocumentIds.size, visibleRowIds, visibleRows]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (view !== "deliveries") return;
    if (initialPreviewDocumentId) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") !== "delivery-detail") return;

    const requestedDocument = params.get("document") || "N20260530-01";
    const previewRow = visibleRows.find((row) => row.id === requestedDocument || row.documentId === requestedDocument);
    if (!previewRow || detailRow?.id === previewRow.id) return;

    setDetailRow(previewRow);
  }, [detailRow?.id, view, visibleRows]);

  function handleDetailBack() {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("preview") === "delivery-detail") {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
    setPreviewDismissed(true);
    setDetailRow(null);
  }

  function handleDocumentSelect(row: DocumentRow) {
    setDetailRow(row);
  }

  function handleDocumentToggle(row: DocumentRow, checked: boolean) {
    setSelectedDocumentIds((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(row.id);
      } else {
        next.delete(row.id);
      }
      return next;
    });
  }

  function handleDocumentToggleAll(checked: boolean) {
    setSelectedDocumentIds(checked ? new Set(visibleRows.map((row) => row.id)) : new Set());
  }

  const activeDetailRow = detailRow || (!previewDismissed ? previewRow : null);

  if (previewDocumentId && !previewDismissed && !activeDetailRow) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" data-testid="delivery-detail-preview-error">
        <h1 className="text-base font-semibold">納品書詳細プレビューを表示できません</h1>
        <p className="mt-2">指定された納品書が見つかりません: {previewDocumentId}</p>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-3">
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">{config.listTitle}</h1>
        <div className="flex flex-wrap items-center gap-1.5 xl:justify-end">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2.5">
            <CalendarDays className="size-3.5" />
            表示期間 {currentMonth.label}
          </Button>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger size="sm" className="h-8 w-[132px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tabs.map((tab) => (
                <SelectItem key={tab} value={tab}>
                  {tab === "すべて" ? "すべての状態" : tab}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ownerFilter} onValueChange={setOwnerFilter}>
            <SelectTrigger size="sm" className="h-8 w-[150px]">
              <SelectValue placeholder="担当者" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべての担当者</SelectItem>
              {owners.map((owner) => <SelectItem key={owner} value={owner}>{owner}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <SlidersHorizontal className="size-3.5" />
            詳細フィルタ
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => toast.success("CSV出力を準備しました")}>
            <Download className="size-3.5" />
            CSV出力
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            disabled={selectedCount === 0}
            onClick={() => toast.info(`${selectedCount}件の送付内容を確認画面で準備します。送信は人間承認後に実行します。`)}
          >
            <Mail className="size-3.5" />
            一括送付を準備
          </Button>
          <span className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-500">
            選択 {selectedCount}件
          </span>
          <Button size="sm" className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700" onClick={onCreate}>
            <Plus className="size-3.5" />
            {viewMeta[view].primaryAction}
          </Button>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-4">
        {summary.map((item, index) => (
          <DocumentKpiCard key={item.label} item={item} index={index} />
        ))}
      </div>

      <div className="space-y-2">
          <DocumentTable
            rows={visibleRows}
            config={config}
            onSelect={handleDocumentSelect}
            onPrint={onPrint}
            onMail={(row) => toast.info(`${row.id} のメール送付準備を開きます。送信は確認後に実行します。`)}
            onFax={(row) => toast.info(`${row.id} のFAX送付準備を開きます。送信は確認後に実行します。`)}
            selectedIds={selectedDocumentIds}
            onToggleRow={handleDocumentToggle}
            onToggleAll={handleDocumentToggleAll}
          />
          <div className="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-500">
            <span>1-{Math.max(visibleRows.length, 1)} / {visibleRows.length}件を表示</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 px-2" disabled>前へ</Button>
              <Button variant="secondary" size="sm" className="h-7 px-2">1</Button>
              <Button variant="outline" size="sm" className="h-7 px-2" disabled>次へ</Button>
            </div>
          </div>
      </div>
    </div>
      <DocumentDetailWorkspaceSheet
        row={activeDetailRow}
        onOpenChange={(open) => {
          if (!open) handleDetailBack();
        }}
        onEdit={(row) => onEdit(row)}
      />
    </>
  );
}

function DocumentDetailWorkspaceSheet({
  row,
  onOpenChange,
  onEdit,
}: {
  row: DocumentRow | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (row: DocumentRow) => void;
}) {
  return (
    <Sheet open={Boolean(row)} onOpenChange={onOpenChange}>
      <SheetContent
        className="m-0 left-0 right-0 top-0 bottom-0 flex h-screen !w-auto !max-w-none flex-col gap-0 overflow-hidden border-l !bg-white p-0 lg:left-[var(--core-sidebar-width,240px)] lg:right-0"
        style={{ "--core-sidebar-width": "216px" } as React.CSSProperties}
        showOverlay={false}
      >
        {row ? (
          <ScrollArea className="min-h-0 flex-1 bg-white">
            <DeliveryDocumentDetailWorkspace
              row={row}
              config={documentUiConfigByLabel(row.type)}
              onBack={() => onOpenChange(false)}
              onEdit={() => onEdit(row)}
            />
          </ScrollArea>
        ) : (
          <Skeleton className="m-4 h-48" />
        )}
      </SheetContent>
    </Sheet>
  );
}

function DocumentKpiCard({
  item,
  index,
}: {
  item: { label: string; value: string; note: string; tone: StatusTone };
  index: number;
}) {
  const iconClass = cn(
    "flex size-9 items-center justify-center rounded-full border",
    item.tone === "green" && "border-emerald-100 bg-emerald-50 text-emerald-700",
    item.tone === "blue" && "border-blue-100 bg-blue-50 text-blue-700",
    item.tone === "amber" && "border-amber-100 bg-amber-50 text-amber-700",
    item.tone === "red" && "border-red-100 bg-red-50 text-red-700",
    item.tone === "neutral" && "border-neutral-100 bg-neutral-50 text-neutral-700",
  );

  return (
    <div className="flex h-[74px] items-center gap-3 rounded-md border border-neutral-200 bg-white px-3 py-2 shadow-sm" data-testid="document-kpi-card">
      <div className={iconClass}>
        {index === 0 ? <FilePlus2 className="size-4" /> : index === 1 ? <Edit3 className="size-4" /> : index === 2 ? <Check className="size-4" /> : <span className="text-sm font-semibold">¥</span>}
      </div>
      <div className="min-w-0">
        <div className="truncate text-[11px] font-medium text-neutral-500">{item.label}</div>
        <div className={cn("mt-0.5 truncate text-lg font-semibold leading-6 text-neutral-950", item.tone === "green" && "text-emerald-700", item.tone === "blue" && "text-blue-700")}>
          {item.value}
        </div>
        {item.note ? <div className="truncate text-[11px] text-neutral-500">{item.note}</div> : null}
      </div>
    </div>
  );
}

function DeliveryDocumentDetailWorkspace({
  row,
  config,
  onBack,
  onEdit,
}: {
  row: DocumentRow;
  config: CoreDocumentUiConfig;
  onBack: () => void;
  onEdit: () => void;
}) {
  const isDelivery = config.type === "delivery";
  const numberLabel = config.numberLabel;
  const dateLabel = config.dateLabel;
  const partnerLabel = config.partnerLabel;
  const destinationTitle = config.destinationTitle;
  const destinationValue = getDocumentDestinationValue(row, config);
  const [firstThirdField, secondThirdField, thirdThirdField] = config.thirdCardFields;
  const [carrier, setCarrier] = useState("yamato");
  const [trackingNumber, setTrackingNumber] = useState("1234-5678-9012");
  const [serviceType, setServiceType] = useState("takkyubin");
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState("am");
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);
  const detailLines: DeliveryPreviewLine[] = [
    {
      id: "line-1",
      lineNo: 1,
      lineKind: "product",
      productCode: "4901234567890",
      productName: "コンクリートブロック",
      spec: "C種 100 x 190 x 390",
      quantity: 100,
      unit: "個",
      packageQuantity: 1,
      unitPrice: 743,
      taxRate: 10,
      amount: 74300,
      note: "",
    },
    {
      id: "line-2",
      lineNo: 2,
      lineKind: "product",
      productCode: "4901234567891",
      productName: "モルタル混和剤",
      spec: "AE減水剤 18L",
      quantity: 10,
      unit: "缶",
      packageQuantity: 1,
      unitPrice: 5800,
      taxRate: 10,
      amount: 58000,
      note: "",
    },
    {
      id: "line-3",
      lineNo: 3,
      lineKind: "product",
      productCode: "4901234567892",
      productName: "鉄筋",
      spec: "D10 SD295A 4m",
      quantity: 30,
      unit: "本",
      packageQuantity: 10,
      unitPrice: 850,
      taxRate: 10,
      amount: 25500,
      note: "",
    },
    {
      id: "note-4",
      lineNo: 4,
      lineKind: "note",
      productCode: "",
      productName: "【担当】現場残りの鋼材等を事前にご連絡をお願いいたします。",
      spec: "",
      quantity: "-",
      unit: "-",
      packageQuantity: "-",
      unitPrice: 0,
      taxRate: 10,
      amount: 0,
      note: "【担当】現場残りの鋼材等を事前にご連絡をお願いいたします。",
    },
    {
      id: "line-5",
      lineNo: 5,
      lineKind: "product",
      productCode: "4901234567893",
      productName: "養生テープ",
      spec: "50mm x 25m 緑",
      quantity: 60,
      unit: "巻",
      packageQuantity: 30,
      unitPrice: 350,
      taxRate: 10,
      amount: 21000,
      note: "",
    },
  ];
  const subtotal = detailLines.reduce((sum, line) => sum + (line.lineKind === "product" ? line.amount : 0), 0);
  const taxable10 = detailLines.filter((line) => line.lineKind === "product" && line.taxRate === 10).reduce((sum, line) => sum + line.amount, 0);
  const taxable8 = detailLines.filter((line) => line.lineKind === "product" && line.taxRate === 8).reduce((sum, line) => sum + line.amount, 0);
  const tax10 = Math.floor(taxable10 * 0.1);
  const tax8 = Math.floor(taxable8 * 0.08);
  const total = subtotal + tax10 + tax8;
  const includedTax = tax10 + tax8;
  const deliveryMemo = "内容のご確認をお願いいたします。\nご不明点がございましたら、担当者までご連絡ください。\nよろしくお願いいたします。";
  const printModel: DeliveryPrintModel = {
    documentNumber: row.id,
    deliveryDate: getDocumentDisplayDate(row, config),
    customerName: row.partner,
    customerContact: "佐藤 一郎",
    destinationName: "株式会社サンプル",
    destinationDepartment: "東京本社 仕入部門",
    destinationContact: "佐藤 一郎 様",
    destinationPostalCode: "100-0014",
    destinationAddress: "東京都千代田区永田町 1-7-1 東京本社ビル 1F倉庫前",
    destinationPhone: "03-1234-5678",
    memo: deliveryMemo,
    subtotal,
    tax10,
    tax8,
    total,
    includedTax,
    lines: detailLines,
  };

  function showSendPreparation(kind: "メール送信" | "FAX送信") {
    toast.info(`${kind}は送信前の確認画面を開きます。外部送信は人間確認後に実行します。`);
  }

  return (
    <div
      className="box-border w-full max-w-full min-w-0 overflow-hidden px-[5px] pt-3 pb-[120px]"
      data-testid="delivery-detail-page"
      style={{
        "--core-sidebar-width": "244px",
        maxWidth: "calc(100vw - var(--core-sidebar-width, 244px) - 20px)",
      } as React.CSSProperties}
    >
    <div className="space-y-4" data-testid="delivery-detail-workspace">
      <div data-testid="delivery-detail-toolbar" className="mb-[11px] grid min-w-0 grid-cols-[minmax(260px,auto)_minmax(0,1fr)] items-start gap-2 max-[1500px]:grid-cols-1">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button type="button" onClick={onBack} aria-label={`${config.listTitle}一覧`} className="sr-only">
            <ChevronRight className="size-3.5 rotate-180" />
          </button>
          <h1 data-testid="delivery-page-title" className={cn("shrink-0 tracking-tight", t.pageTitle)}>{config.listTitle}詳細</h1>
          <StatusBadge tone={row.tone}>{row.status === "完了" ? "発行済" : row.status}</StatusBadge>
        </div>
        <div data-testid="delivery-detail-actions" className="flex min-w-0 max-w-full flex-wrap items-center justify-end gap-2 overflow-visible pr-1 max-[1500px]:justify-start">
          {isDelivery ? (
            <>
              <Button variant="outline" size="sm" className={cn("h-9 shrink-0 gap-1 px-3 max-[1450px]:px-2", t.button)} onClick={() => toast.success("B2 CSV出力を準備しました")}>
                <Download className="size-3.5" />
                B2 CSV
              </Button>
              <Button variant="outline" size="sm" className={cn("h-9 shrink-0 gap-1 px-3 max-[1450px]:px-2", t.button)} onClick={() => toast.success("飛伝CSV出力を準備しました")}>
                <Download className="size-3.5" />
                商品CSV
              </Button>
            </>
          ) : null}
          <Button variant="outline" size="sm" className={cn("h-9 shrink-0 gap-1 border-blue-200 px-3 text-blue-600 hover:bg-blue-50 hover:text-blue-700 max-[1450px]:px-2", t.button)} onClick={() => showSendPreparation("メール送信")}>
            <Mail className="size-3.5" />
            メール送信
          </Button>
          <Button variant="outline" size="sm" className={cn("h-9 shrink-0 gap-1 border-emerald-200 px-3 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700 max-[1450px]:px-2", t.button)} onClick={() => showSendPreparation("FAX送信")}>
            <Send className="size-3.5" />
            FAX送信
          </Button>
          <Button variant="outline" size="sm" className={cn("h-9 shrink-0 gap-1 border-blue-200 px-3 text-blue-600 hover:bg-blue-50 hover:text-blue-700 max-[1450px]:px-2", t.button)} onClick={() => toast.success(`${row.id} をコピーしました`)}>
            <Copy className="size-3.5" />
            コピー
          </Button>
          <Button
            data-testid="delivery-detail-print-button"
            variant="outline"
            size="sm"
            className={cn("h-9 shrink-0 gap-1 border-blue-200 px-3 text-blue-600 hover:bg-blue-50 hover:text-blue-700 max-[1450px]:px-2", t.button)}
            onClick={() => {
              if (isDelivery) {
                setPrintPreviewOpen(true);
                return;
              }
              toast.success(`${config.listTitle}の印刷プレビューを準備しました`);
            }}
          >
            <Printer className="size-3.5" />
            印刷
          </Button>
          <Button variant="outline" size="sm" className={cn("h-9 shrink-0 gap-1 px-3 max-[1450px]:px-2", t.button)} onClick={onEdit}>
            <Edit3 className="size-3.5" />
            編集
          </Button>
          <Button size="sm" className={cn("h-9 shrink-0 gap-1 bg-blue-600 px-4 hover:bg-blue-700 max-[1450px]:px-3", t.button)} onClick={() => toast.success(`${row.id} を保存しました`)}>
            <Save className="size-3.5" />
            保存
          </Button>
        </div>
      </div>

      <div
        data-testid="delivery-detail-top-cards"
        className="grid items-start gap-3 min-[1360px]:grid-cols-[minmax(300px,0.95fr)_minmax(360px,1fr)_minmax(390px,1.05fr)] min-[1600px]:grid-cols-[minmax(390px,0.95fr)_minmax(430px,1fr)_minmax(470px,1.05fr)]"
      >
        <Card data-testid="delivery-detail-basic-card" className="min-h-[320px] gap-0 overflow-hidden rounded-md border border-neutral-200 bg-white py-0 shadow-none">
          <CardHeader className="flex h-12 flex-row items-center justify-between border-b px-5 py-0 !pb-0">
            <DeliverySectionTitle>基本情報</DeliverySectionTitle>
            <Button variant="outline" size="sm" className={cn("h-8 px-3", t.button)} onClick={onEdit}>編集</Button>
          </CardHeader>
          <CardContent className="px-5 py-4">
            <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-x-4 gap-y-4">
              <DeliveryLabel>{numberLabel}</DeliveryLabel>
              <DeliveryValue testId="delivery-basic-document-number-value">{row.id}</DeliveryValue>
              <DeliveryLabel>{dateLabel}</DeliveryLabel>
              <DeliveryValue testId="delivery-basic-date-value">{getDocumentDisplayDate(row, config)}</DeliveryValue>
              <DeliveryLabel>{partnerLabel}</DeliveryLabel>
              <a data-testid="delivery-basic-customer-value" data-typography-role="value" href="/core/partners" className={cn("min-w-0 truncate text-right hover:underline", t.valueLink)}><span data-testid="delivery-detail-value">{row.partner}</span></a>
              <DeliveryLabel>取引先担当者</DeliveryLabel>
              <DeliveryValue testId="delivery-basic-contact-value">佐藤 一郎 様</DeliveryValue>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="delivery-detail-destination-card" className="min-h-[320px] gap-0 overflow-hidden rounded-md border border-neutral-200 bg-white py-0 shadow-none">
          <CardHeader className="flex h-12 flex-row items-center justify-between border-b px-5 py-0 !pb-0">
            <DeliverySectionTitle>{destinationTitle}</DeliverySectionTitle>
            <Button variant="outline" size="sm" className={cn("h-8 px-3", t.button)} onClick={onEdit}>編集</Button>
          </CardHeader>
          <CardContent className="px-5 py-4">
            <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-4 gap-y-2.5">
              <InfoRow label={`${destinationTitle}名`} value={destinationValue} testId="delivery-destination-name-value" />
              <InfoRow label="部署名" value="東京本社 仕入部門" testId="delivery-destination-department-value" />
              <InfoRow label="担当者名" value="佐藤 一郎 様" testId="delivery-destination-contact-value" />
              <InfoRow label="郵便番号" value="100-0014" testId="delivery-destination-postal-value" />
              <InfoRow label="都道府県" value="東京都" testId="delivery-destination-prefecture-value" />
              <InfoRow label="市区町村" value="千代田区永田町" testId="delivery-destination-city-value" />
              <InfoRow label="住所・建物名" value="1-7-1 東京本社ビル 1F倉庫前" testId="delivery-destination-address-value" />
              <InfoRow label="電話番号" value="03-1234-5678" testId="delivery-destination-phone-value" />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="delivery-detail-shipping-card" className="min-h-[320px] gap-0 overflow-hidden rounded-md border border-neutral-200 bg-white py-0 shadow-none">
          <CardHeader className="flex h-12 flex-row items-center justify-between border-b px-5 py-0 !pb-0">
            <DeliverySectionTitle className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              {config.thirdCardTitle}
            </DeliverySectionTitle>
            <Button variant="outline" size="sm" className={cn("h-8 px-3", t.button)} onClick={onEdit}>編集</Button>
          </CardHeader>
          <CardContent className="px-5 py-4">
            <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-x-4 gap-y-2.5">
              {isDelivery ? (
                <>
                  <DeliveryLabel>配送業者</DeliveryLabel>
                  <Select value={carrier} onValueChange={setCarrier}>
                    <SelectTrigger data-testid="delivery-shipping-carrier-value" data-typography-role="value" className={cn("h-8 w-full min-w-0", t.inputText)}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yamato">ヤマト運輸</SelectItem>
                      <SelectItem value="japanpost">日本郵便</SelectItem>
                      <SelectItem value="sagawa">佐川急便</SelectItem>
                      <SelectItem value="seino">西濃運輸</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              ) : null}
              {isDelivery ? (
                <>
                  <DeliveryLabel>サービス種別</DeliveryLabel>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger data-testid="delivery-shipping-service-value" data-typography-role="value" className={cn("h-8 w-full min-w-0", t.inputText)}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="takkyubin">宅急便</SelectItem>
                      <SelectItem value="compact">宅急便コンパクト</SelectItem>
                      <SelectItem value="charter">チャーター便</SelectItem>
                    </SelectContent>
                  </Select>
                  <DeliveryLabel>お問い合わせ番号</DeliveryLabel>
                  <div className="flex min-w-0 gap-2">
                    <Input data-testid="delivery-shipping-tracking-value" data-typography-role="value" className={cn("h-8 min-w-0 flex-1 px-2", t.inputText)} value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} />
                    <Button variant="outline" size="sm" className={cn("h-8 shrink-0 px-3 text-blue-600", t.button)} onClick={() => toast.info(`${trackingNumber} の追跡ページを確認します`)}>
                      追跡
                    </Button>
                  </div>
                  <DeliveryLabel>{dateLabel}</DeliveryLabel>
                  <div data-testid="delivery-shipping-date-value" className="min-w-0">
                    <Input data-testid="delivery-detail-date-input" data-typography-role="value" className={cn("h-8 w-full min-w-0 bg-white px-2", t.inputText)} value={getDocumentDisplayDate(row, config)} readOnly />
                  </div>
                  <DeliveryLabel>配送希望時間帯</DeliveryLabel>
                  <Select value={deliveryTimeSlot} onValueChange={setDeliveryTimeSlot}>
                    <SelectTrigger data-testid="delivery-detail-time-select" data-typography-role="value" className={cn("h-8 w-full min-w-0", t.inputText)}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="am">午前中（8:00-12:00）</SelectItem>
                      <SelectItem value="pm1">14:00-16:00</SelectItem>
                      <SelectItem value="pm2">16:00-18:00</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <>
                  <DeliveryLabel>{firstThirdField}</DeliveryLabel>
                  <div data-testid="delivery-shipping-date-value" className="min-w-0">
                    <Input data-testid="delivery-detail-date-input" data-typography-role="value" className={cn("h-8 w-full min-w-0 bg-white px-2", t.inputText)} value={getDocumentDisplayDate(row, config)} readOnly />
                  </div>
                  <DeliveryLabel>{secondThirdField}</DeliveryLabel>
                  <Input data-testid="delivery-detail-time-select" data-typography-role="value" className={cn("h-8 w-full min-w-0 bg-white px-2", t.inputText)} value={getDocumentSecondaryDetailValue(config)} readOnly />
                  <DeliveryLabel>{thirdThirdField}</DeliveryLabel>
                  <Input data-testid="delivery-shipping-service-value" data-typography-role="value" className={cn("h-8 w-full min-w-0 bg-white px-2", t.inputText)} value={getDocumentTertiaryDetailValue(config)} readOnly />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-2">
        <Card className="gap-0 overflow-hidden rounded-md border border-neutral-200 bg-white py-0 shadow-none" data-testid="delivery-detail-lines-card">
          <CardHeader className="flex h-11 flex-row items-center justify-between border-b px-3 py-0 !pb-0">
            <DeliverySectionTitle>明細一覧</DeliverySectionTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className={cn("h-8 gap-1 px-3", t.button)}><Plus className="size-3.5" />行を追加</Button>
              <Button variant="outline" size="sm" className={cn("h-8 gap-1 px-3", t.button)}><PackagePlus className="size-3.5" />商品を追加</Button>
              <Button variant="outline" size="sm" className={cn("h-8 px-3", t.button)}>一括割引</Button>
              <Button variant="outline" size="sm" className={cn("h-8 px-3", t.button)}>一括削除</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full min-w-0 overflow-x-auto rounded-md border border-neutral-200" data-testid="delivery-detail-lines">
              <div className="grid min-w-[1160px] grid-cols-[20px_30px_120px_minmax(560px,1fr)_42px_42px_50px_70px_48px_96px_42px_58px] bg-slate-50 min-[1500px]:min-w-[1336px] min-[1500px]:grid-cols-[20px_30px_130px_minmax(680px,1fr)_44px_44px_54px_76px_50px_100px_50px_58px]">
                {["", "No.", "商品コード", "商品名 / 規格", "単位", "入数", "数量", "単価", "税率", "金額", "備考", "操作"].map((label) => (
                  <div
                    key={label || "drag"}
                    data-testid={label === "単位" ? "delivery-header-unit" : "delivery-table-header-text"}
                    className={cn("whitespace-nowrap border-b border-r border-neutral-200 px-[6px] py-[6px] last:border-r-0", t.tableHeader, label === "操作" ? "sticky right-0 z-20 border-l bg-slate-50" : "")}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div>
                {detailLines.map((line) => (
                  line.lineKind === "note" ? (
                    <div key={line.id} data-testid="delivery-line-row" className={cn("grid min-w-[1160px] scroll-mb-28 grid-cols-[20px_30px_minmax(0,1fr)_58px] border-b border-neutral-200 last:border-b-0 min-[1500px]:min-w-[1336px]", t.tableCell)}>
                      <div className="flex items-center justify-center border-r border-neutral-200 px-[2px] py-[2px] text-neutral-400"><GripVertical className="size-3.5" /></div>
                      <div className="border-r border-neutral-200 px-[6px] py-[2px] text-center">{line.lineNo}</div>
                      <div className="px-[6px] py-[2px]">{line.note}</div>
                      <div data-testid="delivery-line-actions" className="sticky right-0 z-10 flex items-center justify-end gap-1 border-l border-neutral-200 bg-white px-1 py-[2px] pr-2">
                        <Button aria-label={`編集 ${line.lineNo}`} variant="ghost" size="icon" className="size-6"><Edit3 className="size-3.5" /></Button>
                        <Button aria-label={`削除 ${line.lineNo}`} variant="ghost" size="icon" className="size-6 text-red-600"><Trash2 className="size-3.5" /></Button>
                      </div>
                    </div>
                  ) : (
                    <div key={line.id} data-testid="delivery-line-row" className={cn("grid min-w-[1160px] scroll-mb-28 grid-cols-[20px_30px_120px_minmax(560px,1fr)_42px_42px_50px_70px_48px_96px_42px_58px] border-b border-neutral-200 last:border-b-0 min-[1500px]:min-w-[1336px] min-[1500px]:grid-cols-[20px_30px_130px_minmax(680px,1fr)_44px_44px_54px_76px_50px_100px_50px_58px]", t.tableCell)}>
                      <div className="flex items-center justify-center border-r border-neutral-200 px-[2px] py-[2px] text-neutral-400"><GripVertical className="size-3" /></div>
                      <div className="border-r border-neutral-200 px-[6px] py-[2px] text-center">{line.lineNo}</div>
                      <div className="truncate border-r border-neutral-200 px-[6px] py-[2px]">{line.productCode}</div>
                      <div data-testid="delivery-line-product-cell" className="min-w-0 border-r border-neutral-200 px-[6px] py-[6px]">
                        <DeliveryProductNameText title={line.spec ? `${line.productName} / ${line.spec}` : line.productName}>
                          {line.productName}
                          {line.spec ? <span className="font-normal text-slate-500"> / {line.spec}</span> : null}
                        </DeliveryProductNameText>
                      </div>
                      <div className="whitespace-nowrap border-r border-neutral-200 px-[6px] py-[2px] text-center">{line.unit}</div>
                      <div className="border-r border-neutral-200 px-[6px] py-[2px] text-right">{line.packageQuantity}</div>
                      <div className="border-r border-neutral-200 px-[6px] py-[2px] text-right">{line.quantity}</div>
                      <div className="border-r border-neutral-200 px-[6px] py-[2px] text-right">{formatCurrency(line.unitPrice)}</div>
                      <div className="border-r border-neutral-200 px-[6px] py-[2px] text-center">{line.taxRate}%</div>
                      <DeliveryAmountValue>{formatCurrency(line.amount)}</DeliveryAmountValue>
                      <div className={cn("truncate border-r border-neutral-200 px-[6px] py-[2px]", t.muted)}>{line.note || "-"}</div>
                      <div data-testid="delivery-line-actions" className="sticky right-0 z-10 flex items-center justify-end gap-1 border-l border-neutral-200 bg-white px-1 py-[2px] pr-2">
                        <Button aria-label={`編集 ${line.lineNo}`} variant="ghost" size="icon" className="size-6"><Edit3 className="size-3.5" /></Button>
                        <Button aria-label={`削除 ${line.lineNo}`} variant="ghost" size="icon" className="size-6 text-red-600"><Trash2 className="size-3.5" /></Button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

      <div data-testid="delivery-detail-bottom-grid" className="mt-5 grid gap-2 xl:grid-cols-2">
        <Card className="gap-0 overflow-hidden rounded-md border border-neutral-200 bg-white py-0 shadow-none">
          <CardHeader className="flex h-10 items-center border-b px-3 py-0 !pb-0">
            <DeliverySectionTitle>備考・メモ</DeliverySectionTitle>
          </CardHeader>
          <CardContent className="p-3">
            <Textarea data-testid="delivery-memo-body" className={cn("min-h-[72px] resize-none", t.inputText)} defaultValue={deliveryMemo} aria-label="備考・メモ" />
            <div className={cn("mt-1 text-right", t.muted)}>67 / 1000</div>
          </CardContent>
        </Card>
        <Card className="gap-0 overflow-hidden rounded-md border border-neutral-200 bg-white py-0 shadow-none">
          <CardHeader className="flex h-10 flex-row items-center justify-between border-b px-3 py-0 !pb-0">
            <DeliverySectionTitle>履歴</DeliverySectionTitle>
            <Button variant="outline" size="sm" className={cn("h-7 px-2", t.button)}>履歴をすべて表示</Button>
          </CardHeader>
          <CardContent data-testid="delivery-history-body" className={cn("space-y-1.5 p-3", t.tableCell)}>
            <div className="grid grid-cols-[112px_80px_1fr] gap-2 border-b border-neutral-100 pb-2">
              <span>2026/05/30 10:15</span>
              <span>山田 太郎</span>
              <span>下書きを作成しました</span>
            </div>
            <div className="grid grid-cols-[112px_80px_1fr] gap-2 border-b border-neutral-100 pb-2">
              <span>2026/05/30 09:40</span>
              <span>山田 太郎</span>
              <span>納品日を2026/05/29に変更しました</span>
            </div>
            <div className="grid grid-cols-[112px_80px_1fr] gap-2">
              <span>2026/05/29 11:03</span>
              <span>山田 太郎</span>
              <span>配送情報を配送中に変更しました</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="fixed bottom-0 left-[var(--core-sidebar-width,240px)] right-0 z-40 flex h-[56px] items-center justify-between gap-6 border-t border-neutral-200 bg-white/90 px-6 pr-6 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur" data-testid="delivery-detail-footer">
        <div className="flex min-w-[220px] items-center gap-2">
          <span data-testid="delivery-footer-label" className={t.footerLabel}>{numberLabel}</span>
          <span data-testid="delivery-footer-document-number-value" className={t.footerValue}>{row.id}</span>
        </div>
        <div className="grid min-w-0 flex-1 grid-cols-[repeat(5,minmax(112px,auto))] items-center justify-end gap-4">
          <SummaryLine label="小計" value={formatCurrency(subtotal)} />
          <SummaryLine label="消費税 10%" value={formatCurrency(tax10)} />
          <SummaryLine label="消費税 8%" value={tax8 === 0 ? "" : formatCurrency(tax8)} />
          <SummaryLine label="合計金額" value={formatCurrency(total)} strong />
          <SummaryLine label="内消費税" value={formatCurrency(includedTax)} testId="delivery-detail-included-tax" />
        </div>
      </div>
      <DeliveryPrintPreview open={printPreviewOpen} onOpenChange={setPrintPreviewOpen} model={printModel} />
    </div>
  );
}

function getDocumentDisplayDate(row: DocumentRow, config: CoreDocumentUiConfig) {
  if (config.type === "delivery" || config.type === "purchase-order") return row.dueAt || row.issuedAt;
  return row.issuedAt || row.dueAt;
}

function getDocumentDestinationValue(row: DocumentRow, config: CoreDocumentUiConfig) {
  if (config.type === "delivery") return "株式会社サンプル";
  if (config.type === "quote") return "本社購買部";
  if (config.type === "order") return "東京倉庫";
  if (config.type === "invoice") return `${row.partner} 請求窓口`;
  if (config.type === "payment") return row.id.startsWith("R") ? row.id.replace(/^R/, "I") : "対象請求書";
  return "東京倉庫";
}

function getDocumentSecondaryDetailValue(config: CoreDocumentUiConfig) {
  if (config.type === "quote") return "確認予定";
  if (config.type === "order") return "納期確認中";
  if (config.type === "invoice") return "月末締め";
  if (config.type === "purchase-order") return "通常発注";
  if (config.type === "payment") return "照合待ち";
  return "通常";
}

function getDocumentTertiaryDetailValue(config: CoreDocumentUiConfig) {
  if (config.type === "quote") return "有効期限内に確認";
  if (config.type === "order") return "注文備考なし";
  if (config.type === "invoice") return "請求備考なし";
  if (config.type === "purchase-order") return "発注備考なし";
  if (config.type === "payment") return "入金備考なし";
  return "備考なし";
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white px-2 py-1.5">
      <div className="text-[11px] text-neutral-500">{label}</div>
      <div className="mt-0.5 truncate text-xs font-medium text-neutral-900">{value}</div>
    </div>
  );
}

function InvoiceCreateContent() {
  const [rows, setRows] = useState([
    { id: "line-1", name: "ワイヤレスイヤホン", quantity: 3, unitPrice: 9800, taxRate: 10 },
    { id: "line-2", name: "USB-Cケーブル", quantity: 5, unitPrice: 1200, taxRate: 10 },
  ]);
  const subtotal = rows.reduce((sum, row) => sum + row.quantity * row.unitPrice, 0);
  const tax = Math.floor(subtotal * 0.1);
  const total = subtotal + tax;

  return (
    <div className="grid gap-3 xl:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        <Card className="shadow-sm">
          <CardHeader className="p-3">
            <CardTitle className="text-base">基本情報</CardTitle>
            <CardDescription className="text-xs">取引先、請求日、支払期限を設定します。</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 p-3 pt-0 md:grid-cols-2">
            <Field label="取引先">
              <Select defaultValue="sample">
                <SelectTrigger className="h-9 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sample">株式会社サンプル</SelectItem>
                  <SelectItem value="test">テスト株式会社</SelectItem>
                  <SelectItem value="trade">サンプル商事株式会社</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="請求番号">
              <Input defaultValue="INV-2024-1009" className="h-9" />
            </Field>
            <DateField label="請求日" />
            <DateField label="支払期限" />
            <Field label="管理メモ">
              <Input defaultValue="5月分 商品納入費" className="h-9" />
            </Field>
            <Field label="担当者">
              <Input defaultValue="山田 太郎" className="h-9" />
            </Field>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-3">
            <div>
              <CardTitle className="text-base">明細</CardTitle>
              <CardDescription className="text-xs">数量、単価、税率から小計を自動計算します。</CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={() =>
                setRows((current) => [
                  ...current,
                  { id: `line-${current.length + 1}`, name: "新規明細", quantity: 1, unitPrice: 0, taxRate: 10 },
                ])
              }
            >
              <Plus className="mr-1.5 h-4 w-4" />
              行追加
            </Button>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="overflow-hidden rounded-lg border border-neutral-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-50">
                    <TableHead className="h-8 px-2 text-xs">品目</TableHead>
                    <TableHead className="h-8 w-24 px-2 text-xs text-right">数量</TableHead>
                    <TableHead className="h-8 w-32 px-2 text-xs text-right">単価</TableHead>
                    <TableHead className="h-8 w-24 px-2 text-xs text-right">税率</TableHead>
                    <TableHead className="h-8 w-32 px-2 text-xs text-right">小計</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="px-2 py-1">
                        <Input className="h-8" value={row.name} onChange={(event) => setRows((current) => current.map((item) => item.id === row.id ? { ...item, name: event.target.value } : item))} />
                      </TableCell>
                      <TableCell className="px-2 py-1">
                        <Input className="h-8 text-right" type="number" value={row.quantity} onChange={(event) => setRows((current) => current.map((item) => item.id === row.id ? { ...item, quantity: Number(event.target.value) } : item))} />
                      </TableCell>
                      <TableCell className="px-2 py-1">
                        <Input className="h-8 text-right" type="number" value={row.unitPrice} onChange={(event) => setRows((current) => current.map((item) => item.id === row.id ? { ...item, unitPrice: Number(event.target.value) } : item))} />
                      </TableCell>
                      <TableCell className="px-2 py-1 text-right text-xs">{row.taxRate}%</TableCell>
                      <TableCell className="px-2 py-1 text-right text-xs">
                        {formatCurrency(row.quantity * row.unitPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit shadow-sm">
        <CardHeader className="p-3">
          <CardTitle className="text-base">合計サマリー</CardTitle>
          <CardDescription className="text-xs">発行前に金額を確認します。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 p-3 pt-0">
          <SummaryLine label="小計" value={formatCurrency(subtotal)} />
          <SummaryLine label="消費税" value={formatCurrency(tax)} />
          <Separator />
          <SummaryLine label="合計" value={formatCurrency(total)} strong />
          <Textarea defaultValue="お振込期限までに下記口座へお振込みください。" className="min-h-20 text-sm" />
          <div className="grid gap-2">
            <Button onClick={() => toast.success("請求書を保存しました")}>
              <Save className="mr-1.5 h-4 w-4" />
              保存
            </Button>
            <Button variant="outline" onClick={() => toast.success("プレビューを作成しました")}>
              <FilePlus2 className="mr-1.5 h-4 w-4" />
              プレビュー
            </Button>
            <Button variant="outline" onClick={() => toast.success("請求書を発行しました")}>
              <Send className="mr-1.5 h-4 w-4" />
              発行
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InventoryContent({ mode, onSelect }: { mode: CoreView; onSelect: (row: InventoryRow) => void }) {
  const rows = mode === "inventory-alerts" ? inventories.filter((row) => row.tone === "red" || row.tone === "amber") : inventories;
  const [selectedRow, setSelectedRow] = useState<InventoryRow>(rows[0] ?? inventories[0]);
  const totalStock = rows.reduce((sum, row) => sum + row.currentStock, 0);
  const idealStock = rows.reduce((sum, row) => sum + row.idealStock, 0);
  const alertCount = rows.filter((row) => row.tone === "red" || row.tone === "amber").length;
  return (
    <div className="space-y-3">
      <div className="grid gap-2 md:grid-cols-4">
        <MetricCard label="総SKU" value={`${rows.length.toLocaleString("ja-JP")}件`} note="表示中" />
        <MetricCard label="現在庫計" value={totalStock.toLocaleString("ja-JP")} note={`適正在庫 ${idealStock.toLocaleString("ja-JP")}`} />
        <MetricCard label="入荷予定" value={rows.reduce((sum, row) => sum + row.inbound, 0).toLocaleString("ja-JP")} note="未反映の入荷" tone="green" />
        <MetricCard label="要対応" value={`${alertCount}件`} note="不足/発注候補" tone={alertCount > 0 ? "amber" : "green"} />
      </div>
      <div className="rounded-md border border-neutral-200 bg-white p-2">
        <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1 xl:max-w-md">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <Input className="h-8 pl-8 text-sm" placeholder="SKU・商品名・JANで検索" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger size="sm" className="h-8 w-full xl:w-[128px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">倉庫: すべて</SelectItem>
              <SelectItem value="tokyo">東京倉庫</SelectItem>
              <SelectItem value="sapporo">札幌倉庫</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger size="sm" className="h-8 w-full xl:w-[128px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">状態: すべて</SelectItem>
              <SelectItem value="short">不足</SelectItem>
              <SelectItem value="normal">適正</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 xl:ml-auto">
            <SlidersHorizontal className="size-3.5" />
            列設定
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => toast.success("在庫CSV出力を準備しました")}>
            <Download className="size-3.5" />
            CSV出力
          </Button>
        </div>
      </div>
      <div className="grid min-h-[620px] gap-3 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="min-w-0 space-y-2">
          <InventoryTable rows={rows} selectedId={selectedRow?.id} onSelect={(row) => setSelectedRow(row)} />
          <div className="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-500">
            <span>1-{rows.length} / {rows.length}件を表示</span>
            <div className="flex items-center gap-1"><Button variant="outline" size="sm" className="h-7 px-2" disabled>前へ</Button><Button variant="secondary" size="sm" className="h-7 px-2">1</Button><Button variant="outline" size="sm" className="h-7 px-2" disabled>次へ</Button></div>
          </div>
        </div>
        <InventoryWorkspaceDetail row={selectedRow} onOpenSheet={onSelect} />
      </div>
    </div>
  );
}

function InventoryHistoryContent() {
  const [selectedHistory, setSelectedHistory] = useState(inventoryHistory[0]);
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-neutral-200 bg-white p-2">
        <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
          <Input className="h-8 xl:max-w-[180px]" type="date" defaultValue="2026-05-01" />
          <Input className="h-8 xl:max-w-[180px]" type="date" defaultValue="2026-05-31" />
          <Select defaultValue="all"><SelectTrigger size="sm" className="h-8 w-full xl:w-[140px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">操作種別: すべて</SelectItem><SelectItem value="in">入庫</SelectItem><SelectItem value="out">出庫</SelectItem><SelectItem value="adjust">調整</SelectItem></SelectContent></Select>
          <div className="relative min-w-0 flex-1 xl:max-w-md">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <Input className="h-8 pl-8 text-sm" placeholder="SKU・商品名で検索" />
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 xl:ml-auto"><Download className="size-3.5" />エクスポート</Button>
          <Button size="sm" className="h-8">調整を追加</Button>
        </div>
      </div>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-3">
            <div>
              <CardTitle className="text-base">監査トレイル</CardTitle>
              <CardDescription className="text-xs">入出庫と調整の履歴を時系列で確認します。</CardDescription>
            </div>
            <span className="text-xs text-neutral-500">{inventoryHistory.length}件</span>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50">
                  <TableHead className="h-8 px-2 text-xs">日時</TableHead>
                  <TableHead className="h-8 px-2 text-xs">操作種別</TableHead>
                  <TableHead className="h-8 px-2 text-xs">SKU</TableHead>
                  <TableHead className="h-8 px-2 text-xs">商品</TableHead>
                  <TableHead className="h-8 px-2 text-xs">理由</TableHead>
                  <TableHead className="h-8 px-2 text-xs text-right">変動</TableHead>
                  <TableHead className="h-8 px-2 text-xs text-right">残数</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryHistory.map((row) => (
                  <TableRow key={row.id} className={cn("h-9 cursor-pointer hover:bg-blue-50/40", selectedHistory.id === row.id && "bg-blue-50/60")} onClick={() => setSelectedHistory(row)}>
                    <TableCell className="px-2 py-1 text-xs">{row.at}</TableCell>
                    <TableCell className="px-2 py-1"><StatusBadge tone={row.change < 0 ? "red" : "green"}>{row.change < 0 ? "出庫" : "入庫"}</StatusBadge></TableCell>
                    <TableCell className="px-2 py-1 text-xs">{row.sku}</TableCell>
                    <TableCell className="px-2 py-1 text-sm font-medium">{row.name}</TableCell>
                    <TableCell className="px-2 py-1 text-xs">{row.reason}</TableCell>
                    <TableCell className={cn("px-2 py-1 text-right text-xs", row.change < 0 ? "text-red-600" : "text-emerald-700")}>{row.change > 0 ? `+${row.change}` : row.change}</TableCell>
                    <TableCell className="px-2 py-1 text-right text-xs">{row.stock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <aside className="rounded-md border border-neutral-200 bg-white p-3">
          <div className="text-sm font-semibold">選択中の履歴詳細</div>
          <div className="mt-3 space-y-2 text-xs">
            <DetailStat label="日時" value={selectedHistory.at} />
            <DetailStat label="SKU" value={selectedHistory.sku} />
            <DetailStat label="商品" value={selectedHistory.name} />
            <DetailStat label="理由" value={selectedHistory.reason} />
            <DetailStat label="変動後在庫" value={`${selectedHistory.stock}個`} />
          </div>
          <Button variant="outline" size="sm" className="mt-3 h-8 w-full" onClick={() => toast.info("監査ログの関連書類を確認します")}>関連書類を確認</Button>
        </aside>
      </div>
    </div>
  );
}

function MetricCard({ label, value, note, tone = "neutral" }: { label: string; value: string; note: string; tone?: StatusTone }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white px-3 py-2">
      <div className="text-[11px] font-medium text-neutral-500">{label}</div>
      <div className={cn("mt-1 truncate text-lg font-semibold text-neutral-950", tone === "red" && "text-red-700", tone === "amber" && "text-amber-700", tone === "green" && "text-emerald-700", tone === "blue" && "text-blue-700")}>{value}</div>
      <div className="mt-0.5 text-[11px] text-neutral-500">{note}</div>
    </div>
  );
}

function InventoryWorkspaceDetail({ row, onOpenSheet }: { row: InventoryRow | null; onOpenSheet: (row: InventoryRow) => void }) {
  if (!row) {
    return <aside className="rounded-md border border-dashed border-neutral-200 bg-white p-4 text-sm text-neutral-500">在庫行を選択すると、適正在庫、入出荷予定、次アクションを表示します。</aside>;
  }
  const shortage = row.idealStock - row.currentStock;
  const coverage = row.idealStock ? Math.round((row.currentStock / row.idealStock) * 100) : 0;

  return (
    <aside className="sticky top-3 h-fit rounded-md border border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-neutral-950">{row.name}</div>
            <div className="mt-0.5 text-xs text-neutral-500">{row.sku} / {row.location}</div>
          </div>
          <StatusBadge tone={row.tone}>{row.status}</StatusBadge>
        </div>
      </div>
      <div className="space-y-3 p-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <DetailStat label="現在庫" value={`${row.currentStock}個`} />
          <DetailStat label="適正在庫" value={`${row.idealStock}個`} />
          <DetailStat label="入荷予定" value={`${row.inbound}個`} />
          <DetailStat label="出荷予定" value={`${row.outbound}個`} />
        </div>
        <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium">適正在庫カバレッジ</span>
            <span className="font-semibold">{coverage}%</span>
          </div>
          <div className="h-2 rounded-full bg-neutral-200">
            <div className={cn("h-2 rounded-full", coverage < 50 ? "bg-red-500" : coverage < 85 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${Math.min(100, coverage)}%` }} />
          </div>
          <div className="mt-2 text-xs text-neutral-600">
            {shortage > 0 ? `${shortage}個の補充候補があります。` : "現時点では適正在庫を満たしています。"}
          </div>
        </div>
        <div className="rounded-md border border-neutral-200 p-3">
          <div className="mb-2 text-xs font-semibold">次アクション</div>
          <div className="grid gap-2">
            <Button size="sm" className="h-8" onClick={() => toast.info(`${row.sku} の在庫調整ドラフトを開きます`)}>在庫調整を開始</Button>
            <Button variant="outline" size="sm" className="h-8" onClick={() => toast.info(`${row.sku} の発注候補を作成します`)}>発注候補を作成</Button>
            <Button variant="outline" size="sm" className="h-8" onClick={() => onOpenSheet(row)}>詳細パネルで確認</Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function PartnerMasterContent() {
  return <CustomerDeliveryMaster />;
}

function ProductMasterContent() {
  return <CorePimHubDashboard />;
}

function UserMasterContent() {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  return (
    <div className="space-y-3">
      <div className="grid gap-2 md:grid-cols-4">
        <MetricCard label="従業員" value={`${users.length}名`} note="招待済み" />
        <MetricCard label="管理者" value={`${users.filter((row) => row.role === "管理者").length}名`} note="権限強め" tone="blue" />
        <MetricCard label="本日アクティブ" value="1名" note="直近24時間" tone="green" />
        <MetricCard label="確認待ち" value="0件" note="権限変更申請" />
      </div>
      <div className="rounded-md border border-neutral-200 bg-white p-2">
        <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1 xl:max-w-md">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <Input className="h-8 pl-8 text-sm" placeholder="従業員名・メールで検索" />
          </div>
          <Select defaultValue="all"><SelectTrigger size="sm" className="h-8 w-full xl:w-[128px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">状態: すべて</SelectItem><SelectItem value="active">有効</SelectItem><SelectItem value="invited">招待中</SelectItem></SelectContent></Select>
          <Select defaultValue="all"><SelectTrigger size="sm" className="h-8 w-full xl:w-[128px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">ロール: すべて</SelectItem><SelectItem value="admin">管理者</SelectItem><SelectItem value="accounting">経理</SelectItem></SelectContent></Select>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 xl:ml-auto"><Download className="size-3.5" />エクスポート</Button>
          <Button size="sm" className="h-8" onClick={() => toast.info("招待メールの送付内容を確認してから送信します")}>従業員を招待</Button>
        </div>
      </div>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="shadow-sm">
          <CardContent className="p-3">
            <div className="overflow-hidden rounded-md border border-neutral-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-50">
                    <TableHead className="h-8 px-2 text-xs">氏名</TableHead>
                    <TableHead className="h-8 px-2 text-xs">メールアドレス</TableHead>
                    <TableHead className="h-8 px-2 text-xs">ロール</TableHead>
                    <TableHead className="h-8 px-2 text-xs">所属チーム</TableHead>
                    <TableHead className="h-8 px-2 text-xs">最終アクティブ</TableHead>
                    <TableHead className="h-8 px-2 text-xs">2FA</TableHead>
                    <TableHead className="h-8 px-2 text-xs">状態</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((row, index) => (
                    <TableRow key={row.id} className={cn("h-10 cursor-pointer hover:bg-blue-50/40", selectedUser.id === row.id && "bg-blue-50/60")} onClick={() => setSelectedUser(row)}>
                      <TableCell className="px-2 py-1 text-sm font-medium">{row.name}</TableCell>
                      <TableCell className="px-2 py-1 text-xs text-neutral-600">{row.email}</TableCell>
                      <TableCell className="px-2 py-1 text-xs">{row.role}</TableCell>
                      <TableCell className="px-2 py-1 text-xs">{index === 0 ? "経営企画" : index === 1 ? "経理部" : "在庫管理"}</TableCell>
                      <TableCell className="px-2 py-1 text-xs">{row.lastActive}</TableCell>
                      <TableCell className="px-2 py-1 text-xs text-emerald-700">有効</TableCell>
                      <TableCell className="px-2 py-1"><StatusBadge tone="green">有効</StatusBadge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <Card className="h-fit shadow-sm">
          <CardHeader className="border-b p-3">
            <CardTitle className="text-base">{selectedUser.name}</CardTitle>
            <CardDescription className="text-xs">{selectedUser.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-3">
            <div className="grid gap-2 rounded-md border border-neutral-200 bg-neutral-50/70 p-2 text-xs">
              <InfoLine label="ロール" value={selectedUser.role} />
              <InfoLine label="プラン" value={selectedUser.plan} />
              <InfoLine label="最終利用" value={selectedUser.lastActive} />
            </div>
            <div className="rounded-md border border-neutral-200 p-3">
              <div className="mb-2 text-xs font-semibold">主な権限</div>
              {["帳票の作成・編集", "商品マスタ閲覧", "ユーザー管理", "システム設定"].map((item) => (
                <div key={item} className="flex items-center justify-between border-b border-neutral-100 py-1.5 text-xs last:border-b-0">
                  <span>{item}</span>
                  <span className="text-emerald-700">付与</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" className="h-8" onClick={() => toast.info("権限変更は確認画面で承認後に反映します")}>権限変更を準備</Button>
              <Button variant="outline" size="sm" className="h-8" onClick={() => toast.info("招待/通知メールの文面確認画面を開きます")}>通知を準備</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-neutral-500">{label}</span>
      <span className="truncate text-right font-medium text-neutral-900">{value}</span>
    </div>
  );
}

function DetailLabel({ children }: { children: React.ReactNode }) {
  return <span className="whitespace-nowrap text-[11px] leading-[18px] text-neutral-500">{children}</span>;
}

function DetailValue({ children }: { children: React.ReactNode }) {
  return <span className="min-w-0 truncate text-[13px] font-medium leading-[18px] text-neutral-900">{children}</span>;
}

function DeliverySectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 data-testid="delivery-section-title" className={cn(t.sectionTitle, className)}>
      {children}
    </h3>
  );
}

function DeliveryLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-testid="delivery-detail-label" className={cn("whitespace-nowrap", t.label, className)}>
      {children}
    </div>
  );
}

function DeliveryValue({
  children,
  className = "",
  testId,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  testId?: string;
  title?: string;
}) {
  return (
    <div data-testid={testId ?? "delivery-detail-value"} data-typography-role="value" title={title} className={cn("min-w-0 whitespace-nowrap text-right", t.value, className)}>
      <span data-testid={testId ? "delivery-detail-value" : undefined}>{children}</span>
    </div>
  );
}

function DeliveryProductNameText({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div data-testid="delivery-line-product-name" title={title} className={cn("min-w-0 truncate whitespace-nowrap", t.productName)}>
      {children}
    </div>
  );
}

function DeliveryAmountValue({ children }: { children: React.ReactNode }) {
  return (
    <div data-testid="delivery-amount-value" className={cn("border-r border-neutral-200 px-[6px] py-[2px] text-right", t.tableCell)}>
      {children}
    </div>
  );
}

function InfoRow({ label, value, testId }: { label: string; value: string; testId: string }) {
  return (
    <>
      <DeliveryLabel>{label}</DeliveryLabel>
      <DeliveryValue testId={testId} title={value}>
        {value}
      </DeliveryValue>
    </>
  );
}

function SectionMiniHeader({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="mb-0.5 flex h-5 items-center justify-between">
      <h3 className="flex min-w-0 items-center gap-1.5 truncate text-sm font-semibold leading-none text-neutral-950">
        {icon}
        {title}
      </h3>
      <Button variant="ghost" size="sm" className="h-6 shrink-0 px-2 text-xs">編集</Button>
    </div>
  );
}

function DestinationLine({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("grid min-w-0 grid-cols-[78px_minmax(0,1fr)] items-center gap-2", className)}>
      <span className="whitespace-nowrap text-[11px] leading-[18px] text-neutral-500">{label}</span>
      <span className="min-w-0 truncate text-[13px] font-medium leading-[18px] text-neutral-900">{value}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-[12px] font-medium leading-4 text-neutral-600">{label}</span>
      {children}
    </label>
  );
}

function CompactField({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("min-w-0 space-y-0.5", className)}>
      <span className="block whitespace-nowrap text-[11px] font-medium leading-[9px] text-neutral-500">{label}</span>
      <div className="min-w-0">{children}</div>
    </label>
  );
}

function DateField({ label }: { label: string }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Field label={label}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-9 justify-start font-normal">
            <CalendarDays className="mr-2 h-4 w-4" />
            {date ? date.toLocaleDateString("ja-JP") : "日付を選択"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

function SummaryLine({ label, value, strong = false, testId }: { label: string; value: string; strong?: boolean; testId?: string }) {
  return (
    <div className={cn("grid min-w-[112px] gap-0.5 text-right", strong && "min-w-[140px]")} data-testid={testId}>
      <span data-testid="delivery-amount-label" className={cn("whitespace-nowrap", t.footerLabel)}>{label}</span>
      <span data-testid="delivery-amount-value" className={strong ? t.footerTotal : t.footerValue}>{value}</span>
    </div>
  );
}

function DocumentDetailSheet({
  row,
  onOpenChange,
  onPrint,
}: {
  row: DocumentRow | null;
  onOpenChange: (open: boolean) => void;
  onPrint: (row: DocumentRow) => void;
}) {
  const config = row ? documentUiConfigByLabel(row.type) : null;
  return (
    <Sheet open={Boolean(row)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[480px]">
        <SheetHeader>
          <SheetTitle>{row?.id ?? "詳細"}</SheetTitle>
          <SheetDescription>{row?.partner} の{row?.type}詳細</SheetDescription>
        </SheetHeader>
        {row ? (
          <div className="mt-4 space-y-3">
            <Card>
              <CardContent className="space-y-2 p-3">
                <SummaryLine label="種別" value={row.type} />
                <SummaryLine label={config?.dateLabel ?? "日付"} value={config ? getDocumentDisplayDate(row, config) : row.issuedAt} />
                <SummaryLine label={config?.thirdCardFields[0] ?? "管理日"} value={row.dueAt} />
                <SummaryLine label="金額" value={formatCurrency(row.amount)} strong />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">ステータス</span>
                  <StatusBadge tone={row.tone}>{row.status}</StatusBadge>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => onPrint(row)} className="gap-1.5">
                <Printer className="size-4" />
                印刷（PDF）
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info(`${row.id} のメール送付準備を開きます。送信は確認後に実行します。`)}
                className="gap-1.5"
              >
                <Mail className="size-4" />
                メール送付を準備
              </Button>
              <Button variant="outline" onClick={() => toast.info(`${row.id} のFAX送付準備を開きます。送信は確認後に実行します。`)}>
                FAX送付を準備
              </Button>
              <Button>編集</Button>
            </div>
          </div>
        ) : (
          <Skeleton className="mt-4 h-48" />
        )}
      </SheetContent>
    </Sheet>
  );
}

function InventoryDetailSheet({
  row,
  onOpenChange,
}: {
  row: InventoryRow | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={Boolean(row)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[480px]">
        <SheetHeader>
          <SheetTitle>{row?.name ?? "在庫詳細"}</SheetTitle>
          <SheetDescription>{row?.sku} / {row?.location}</SheetDescription>
        </SheetHeader>
        {row ? (
          <div className="mt-4 space-y-3">
            <Card>
              <CardContent className="space-y-2 p-3">
                <SummaryLine label="現在庫" value={`${row.currentStock} 個`} strong />
                <SummaryLine label="適正在庫" value={`${row.idealStock} 個`} />
                <SummaryLine label="入荷予定" value={`${row.inbound} 個`} />
                <SummaryLine label="出荷予定" value={`${row.outbound} 個`} />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">状態</span>
                  <StatusBadge tone={row.tone}>{row.status}</StatusBadge>
                </div>
              </CardContent>
            </Card>
            <Button className="w-full" onClick={() => toast.success(`${row.name} の在庫調整を開始しました`)}>
              <Check className="mr-1.5 h-4 w-4" />
              在庫調整を開始
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
