"use client";

import * as React from "react";
import { BadgeCheck, Building2, Check, ChevronLeft, ChevronRight, CreditCard, FileText, Globe2, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type CorporateSuggestion = {
  corporateNumber: string;
  companyName: string;
  postalCode: string;
  address: string;
};

type ZipcodeResponse = {
  success: boolean;
  address?: {
    postalCode: string;
    prefecture: string;
    city: string;
    street: string;
    address: string;
  };
  error?: string;
};

type StripeOnboardResponse = {
  success: boolean;
  state?: "not_connected" | "pending" | "active" | "restricted";
  accountId?: string;
  onboardingUrl?: string;
  onboardingExpiresAt?: number;
  businessData?: {
    representativeName?: string;
    companyName?: string;
    location?: string;
  };
  apiMode?: "stripe_api" | "mock";
  error?: string;
};

const steps = [
  { id: 1, label: "事業者" },
  { id: 2, label: "店舗" },
  { id: 3, label: "法務文面" },
  { id: 4, label: "決済" },
];

function stripHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

function buildTokushohoText({
  companyName,
  storeName,
  address,
  corporateNumber,
  invoiceRegistered,
}: {
  companyName: string;
  storeName: string;
  address: string;
  corporateNumber: string;
  invoiceRegistered: boolean;
}) {
  const seller = companyName || storeName || "登録後に設定";
  return [
    "特定商取引法に基づく表記",
    "",
    `販売事業者: ${seller}`,
    "通信販売に関する業務責任者: 登録後に管理画面で設定してください",
    `所在地: ${address || "登録後に設定してください"}`,
    "電話番号: 登録後に管理画面で設定してください。受付時間、休業日、連絡方法を併記してください。",
    "メールアドレス: 登録後に管理画面で設定してください",
    `法人番号: ${corporateNumber || "未設定"}`,
    `適格請求書発行事業者登録番号: ${invoiceRegistered ? `T${corporateNumber || "登録番号未設定"}` : "未登録"}`,
    "",
    "販売価格: 各商品ページに税込価格で表示します。送料、決済手数料、代引手数料その他購入者が負担する費用がある場合は、商品ページ、配送ポリシー、注文確認画面に明示します。",
    "商品代金以外の必要料金: 送料、振込手数料、決済手数料、ラッピング料、離島・遠隔地追加送料等が発生する場合があります。発生条件と金額は注文確定前に表示します。",
    "支払方法: クレジットカード、その他AIBOUX Shopで有効化した決済方法。前払い決済の場合は入金確認後に発送準備を開始します。",
    "支払時期: クレジットカード決済は注文確定時に決済処理を行います。その他の決済方法は各決済事業者または注文確認画面に表示される期限に従います。",
    "商品の引渡時期: 決済確認後、各商品ページまたは注文確認画面に表示する発送予定日に従い発送します。予約商品、受注生産品、天候・交通事情・在庫切れ等により遅延する場合は速やかに通知します。",
    "返品・交換・キャンセル: 商品発送前のキャンセル可否、商品発送後の返品特約、不良品・誤配送時の対応、返送料負担者、連絡期限を商品特性に応じて明示します。通信販売にはクーリング・オフ制度の適用がないため、返品特約を最終確認画面にも明瞭に表示します。",
    "不良品の取扱い: 商品到着後、管理画面で定める期間内に連絡を受けた場合、事業者確認後に交換、修補、返金その他合理的な方法で対応します。",
    "申込みの有効期限: 在庫、販売期間、予約受付期間、支払期限、数量制限がある場合は該当商品ページおよび注文確認画面に表示します。",
    "販売数量の制限: 商品ごとの在庫数、購入上限、同一顧客への販売制限がある場合は商品ページに表示します。",
    "最終確認画面: 商品名、数量、販売価格、送料、支払総額、支払時期・方法、引渡時期、返品特約、申込期間を一覧性をもって確認・訂正できる画面を提供します。",
    "広告表示: 重要事項について虚偽、誇大、著しく優良または有利と誤認させる表示を行いません。",
    "備考: 本テンプレートはECサイト向けの初期文面です。取扱商品、配送方法、決済方法、所在地・電話番号の表示方針に応じ、公開前に事業者または専門家が確認してください。",
  ].join("\n");
}

function buildPrivacyText(storeName: string) {
  const name = storeName || "当ストア";
  return [
    "プライバシーポリシー",
    "",
    `${name}は、個人情報保護法その他関連法令・ガイドラインを遵守し、ECサイトの運営に必要な範囲で個人情報を適正に取り扱います。`,
    "",
    "1. 取得する情報",
    "氏名、住所、電話番号、メールアドレス、配送先、注文内容、決済状態、問い合わせ内容、本人確認に必要な情報、アクセスログ、Cookie等のオンライン識別子、端末・ブラウザ情報を取得することがあります。",
    "",
    "2. 利用目的",
    "注文受付、決済、本人確認、配送、返品・交換・返金、問い合わせ対応、領収書・請求書・納品書等の発行、法令上必要な保存、サービス改善、不正注文・不正アクセスの防止、重要なお知らせの通知、同意を得たマーケティング配信のために利用します。",
    "",
    "3. 第三者提供・委託",
    "法令に基づく場合、本人の同意がある場合、配送事業者・決済事業者・クラウドサービス・カスタマーサポート等の委託先へ業務に必要な範囲で提供する場合を除き、個人データを第三者に提供しません。委託先には安全管理を求め、必要かつ適切な監督を行います。",
    "",
    "4. 安全管理措置",
    "アクセス権限管理、通信の暗号化、操作ログ、バックアップ、従業者教育、委託先管理、漏えい等発生時の報告・通知体制を整備し、個人データの漏えい、滅失、毀損を防止します。",
    "",
    "5. 保存期間",
    "注文・請求・税務関連情報は法令上必要な期間保存します。問い合わせ、マーケティング、アクセスログ等は利用目的達成に必要な期間を超えて保存しないよう管理します。",
    "",
    "6. Cookie等",
    "ログイン維持、不正利用防止、アクセス解析、広告効果測定、UI改善のためCookie等を利用することがあります。ブラウザ設定により無効化できますが、一部機能が利用できない場合があります。",
    "",
    "7. 開示・訂正・利用停止等",
    "本人から保有個人データの開示、訂正、追加、削除、利用停止、第三者提供停止等の請求があった場合、本人確認後、法令に従い合理的な範囲で対応します。",
    "",
    "8. 改定",
    "法令改正、サービス内容、委託先、利用目的の変更に応じて本ポリシーを改定する場合があります。重要な変更は管理画面またはストア上で通知します。",
    "",
    "9. お問い合わせ窓口",
    "個人情報の取扱いに関する問い合わせ窓口は、公開前に管理画面で設定してください。",
  ].join("\n");
}

export function ShopOnboardingWizard() {
  const [step, setStep] = React.useState(1);
  const [invoiceRegistered, setInvoiceRegistered] = React.useState(true);
  const [corporateQuery, setCorporateQuery] = React.useState("株式会社AIBOUX");
  const [corporateNumber, setCorporateNumber] = React.useState("7010001243121");
  const [companyName, setCompanyName] = React.useState("株式会社AIBOUX");
  const [postalCode, setPostalCode] = React.useState("1000001");
  const [address, setAddress] = React.useState("東京都千代田区千代田1-1");
  const [storeName, setStoreName] = React.useState("AIBOUX STORE");
  const [subdomain, setSubdomain] = React.useState("aiboux-store");
  const [suggestions, setSuggestions] = React.useState<CorporateSuggestion[]>([]);
  const [lookupLoading, setLookupLoading] = React.useState(false);
  const [stripeConnected, setStripeConnected] = React.useState(false);
  const [stripeLoading, setStripeLoading] = React.useState(false);
  const [stripeState, setStripeState] = React.useState<StripeOnboardResponse["state"]>("not_connected");
  const [saving, setSaving] = React.useState(false);

  const tokushohoPreview = React.useMemo(
    () =>
      stripHtml(buildTokushohoText({ companyName, storeName, address, corporateNumber, invoiceRegistered })),
    [address, companyName, corporateNumber, invoiceRegistered, storeName],
  );
  const privacyPreview = React.useMemo(
    () => stripHtml(buildPrivacyText(storeName)),
    [storeName],
  );

  const progress = (step / steps.length) * 100;

  async function lookupCorporate() {
    setLookupLoading(true);
    try {
      const response = await fetch(`/shop/api/lookup/corporate?q=${encodeURIComponent(corporateQuery)}`);
      const data = (await response.json()) as { success: boolean; suggestions?: CorporateSuggestion[] };
      setSuggestions(data.suggestions ?? []);
      if ((data.suggestions ?? []).length === 0) toast.info("候補がありません。手入力で続行できます。");
    } catch {
      toast.error("法人番号候補を取得できませんでした");
    } finally {
      setLookupLoading(false);
    }
  }

  async function lookupZipcode(nextPostalCode = postalCode) {
    const normalized = nextPostalCode.replace(/\D/g, "");
    setPostalCode(normalized);
    if (normalized.length !== 7) return;

    setLookupLoading(true);
    try {
      const response = await fetch(`/shop/api/lookup/zipcode?postalCode=${normalized}`);
      const data = (await response.json()) as ZipcodeResponse;
      if (!response.ok || !data.success || !data.address) {
        toast.error(data.error ?? "郵便番号から住所を取得できませんでした");
        return;
      }
      setAddress(data.address.address);
      toast.success("郵便番号から住所を補完しました");
    } catch {
      toast.error("住所補完に失敗しました");
    } finally {
      setLookupLoading(false);
    }
  }

  function applySuggestion(suggestion: CorporateSuggestion) {
    setCorporateNumber(suggestion.corporateNumber);
    setCompanyName(suggestion.companyName);
    setPostalCode(suggestion.postalCode);
    setAddress(suggestion.address);
    setCorporateQuery(suggestion.companyName);
    setSuggestions([]);
    toast.success("法人情報を反映しました");
  }

  async function connectStripe() {
    setStripeLoading(true);
    try {
      const response = await fetch("/shop/api/stripe/onboard", { method: "POST" });
      const data = (await response.json()) as StripeOnboardResponse;
      if (!response.ok || !data.success) {
        toast.error(data.error ?? "Stripe連携を開始できませんでした");
        return;
      }
      setStripeState(data.state ?? "pending");
      setStripeConnected((data.state ?? "pending") === "active");
      toast.success(data.apiMode === "mock" ? "決済連携の準備状態を保存しました" : "Stripe連携ページを作成しました");
      if (data.apiMode === "stripe_api" && data.onboardingUrl) {
        window.open(data.onboardingUrl, "_blank", "noopener,noreferrer");
        toast.info("Stripeで入力を完了したら、この画面に戻って保存してください");
      }
    } catch {
      toast.error("Stripe連携APIに接続できませんでした");
    } finally {
      setStripeLoading(false);
    }
  }

  async function saveOnboarding() {
    setSaving(true);
    try {
      const response = await fetch("/shop/api/settings/onboarding", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          invoiceRegistered,
          corporateNumber,
          companyName,
          postalCode,
          address,
          storeName,
          subdomain,
          tokushohoText: tokushohoPreview,
          privacyPolicyText: privacyPreview,
          stripeConnected,
        }),
      });
      const data = (await response.json()) as { success: boolean; dashboardPath?: string; error?: string };
      if (!response.ok || !data.success) {
        toast.error(data.error ?? "Shop初期設定を保存できませんでした");
        return;
      }
      toast.success("Shop初期設定を保存しました");
      const nextPath = data.dashboardPath ?? "/s/aiboux/admin";
      window.history.pushState({ section: "dashboard" }, "", nextPath);
      window.dispatchEvent(new PopStateEvent("popstate", { state: { section: "dashboard" } }));
    } catch {
      toast.error("Shop初期設定APIに接続できませんでした");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border-neutral-200 bg-white shadow-sm">
      <CardHeader className="border-b border-neutral-200 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm">Shop初期設定ウィザード</CardTitle>
            <p className="mt-1 text-xs text-neutral-500">法人情報、店舗URL、法務文面、決済を最短で公開準備します。</p>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <Progress value={progress} />
          <div className="grid grid-cols-4 gap-1 text-[11px] text-neutral-500">
            {steps.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStep(item.id)}
                className={cn(
                  "rounded-md px-2 py-1 text-left transition hover:bg-neutral-50",
                  item.id === step && "bg-neutral-100 font-medium text-neutral-950",
                )}
              >
                {item.id}. {item.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 py-4">
        {step === 1 ? (
          <div className="grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              <label className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm">
                <span>
                  <span className="font-medium text-neutral-950">インボイス登録済み</span>
                  <span className="ml-2 text-xs text-neutral-500">適格請求書発行事業者として表示</span>
                </span>
                <Checkbox checked={invoiceRegistered} onCheckedChange={(value) => setInvoiceRegistered(value === true)} />
              </label>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <Input value={corporateQuery} onChange={(event) => setCorporateQuery(event.target.value)} placeholder="法人名または法人番号" />
                <Button variant="outline" className="gap-2" onClick={lookupCorporate} disabled={lookupLoading}>
                  {lookupLoading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                  法人候補
                </Button>
              </div>
              {suggestions.length > 0 ? (
                <div className="space-y-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.corporateNumber}
                      type="button"
                      onClick={() => applySuggestion(suggestion)}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-xs transition hover:border-blue-200 hover:bg-blue-50"
                    >
                      <div className="font-medium text-neutral-950">{suggestion.companyName}</div>
                      <div className="mt-1 text-neutral-500">{suggestion.corporateNumber} / {suggestion.postalCode} / {suggestion.address}</div>
                    </button>
                  ))}
                </div>
              ) : null}
              <div className="grid gap-2 sm:grid-cols-2">
                <Input value={corporateNumber} onChange={(event) => setCorporateNumber(event.target.value.replace(/\D/g, "").slice(0, 13))} placeholder="法人番号 13桁" />
                <Input value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="会社名" />
              </div>
              <div className="grid gap-2 sm:grid-cols-[180px_1fr]">
                <Input value={postalCode} onChange={(event) => lookupZipcode(event.target.value)} placeholder="郵便番号 7桁" inputMode="numeric" />
                <Input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="住所" />
              </div>
            </div>
            <StatusPanel icon={Building2} title="事業者情報" rows={[companyName, corporateNumber, postalCode, address, invoiceRegistered ? "インボイス登録: ON" : "インボイス登録: OFF"]} />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              <Input value={storeName} onChange={(event) => setStoreName(event.target.value)} placeholder="店名" />
              <div className="flex rounded-lg border border-neutral-200 bg-white focus-within:border-blue-400 focus-within:ring-3 focus-within:ring-blue-100">
                <Input
                  value={subdomain}
                  onChange={(event) => setSubdomain(normalizeSlug(event.target.value))}
                  className="border-0 focus-visible:ring-0"
                  placeholder="store-name"
                />
                <div className="flex shrink-0 items-center border-l border-neutral-200 bg-neutral-50 px-3 text-xs text-neutral-500">.mall.aiboux.com</div>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
                公開URL候補: <span className="font-medium text-neutral-950">https://{subdomain || "store"}.mall.aiboux.com</span>
              </div>
            </div>
            <StatusPanel icon={Globe2} title="店舗URL" rows={[storeName, `${subdomain || "store"}.mall.aiboux.com`, "SSL: 自動", "Mall連携: 準備中"]} />
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-3 xl:grid-cols-2">
            <PreviewBlock title="特商法プレビュー" value={tokushohoPreview} />
            <PreviewBlock title="プライバシーポリシープレビュー" value={privacyPreview} />
          </div>
        ) : null}

        {step === 4 ? (
          <div className="grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white">
                  <CreditCard className="size-4 text-neutral-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-neutral-950">Stripe Connect決済</div>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    代表者「篠原 千恵」、法人「株式会社雪花」、所在地「北海道長万部町」をテスト用事業者情報として連携準備します。Stripe画面が開いた場合は、入力完了後にこの画面へ戻って保存してください。
                  </p>
                  <div className="mt-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600">
                    状態: <span className="font-medium text-neutral-950">{stripeStateLabel(stripeState)}</span>
                  </div>
                  <Button className="mt-3 gap-2" onClick={connectStripe} disabled={stripeLoading}>
                    {stripeLoading ? <Loader2 className="size-4 animate-spin" /> : stripeState === "active" ? <Check className="size-4" /> : <CreditCard className="size-4" />}
                    {stripeLoading ? "連携を準備中..." : stripeState === "active" ? "決済受付準備済み" : "決済連携を開始"}
                  </Button>
                </div>
              </div>
            </div>
            <StatusPanel icon={BadgeCheck} title="公開準備" rows={[`Stripe Connect: ${stripeStateLabel(stripeState)}`, "法務文面: 生成済み", "店舗URL: 予約済み", "公開承認: 人間確認待ち"]} />
          </div>
        ) : null}

        <Separator />
        <div className="flex items-center justify-between gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>
            <ChevronLeft className="size-4" />
            戻る
          </Button>
          <Button className="gap-2" onClick={() => (step === 4 ? saveOnboarding() : setStep((current) => Math.min(4, current + 1)))} disabled={saving}>
            {step === 4 ? "保存" : "次へ"}
            {saving ? <Loader2 className="size-4 animate-spin" /> : step === 4 ? <Check className="size-4" /> : <ChevronRight className="size-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function stripeStateLabel(state: StripeOnboardResponse["state"]): string {
  if (state === "active") return "受付可能";
  if (state === "pending") return "確認中";
  if (state === "restricted") return "要対応";
  return "未接続";
}

function StatusPanel({ icon: Icon, title, rows }: { icon: React.ComponentType<{ className?: string }>; title: string; rows: string[] }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950">
        <Icon className="size-4 text-blue-600" />
        {title}
      </div>
      <div className="mt-3 space-y-1.5">
        {rows.filter(Boolean).map((row) => (
          <div key={row} className="truncate rounded-md border border-neutral-100 bg-neutral-50 px-2 py-1.5 text-xs text-neutral-600">
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950">
        <FileText className="size-4 text-neutral-600" />
        {title}
      </div>
      <Textarea value={value} readOnly className="min-h-64 resize-none bg-white text-xs leading-5" />
      <p className="text-[11px] text-neutral-500">HTMLタグは非表示化済み。公開前に人間確認が必要です。</p>
    </div>
  );
}
