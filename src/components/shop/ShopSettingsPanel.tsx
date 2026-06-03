"use client";

import * as React from "react";
import { Activity, AlertCircle, Bell, CheckCircle2, ChevronDown, CreditCard, ExternalLink, ImagePlus, Loader2, RefreshCw, Save, Search, Sparkles, Store } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export function ShopSettingsPanel() {
  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">設定</h1>
          <p className="text-sm text-neutral-500">ストア運営に必要な情報を、用途ごとに確認して保存します。</p>
        </div>
        <Badge variant="secondary" className="rounded-md text-[11px]">
          手動保存
        </Badge>
      </div>

      <Tabs defaultValue="general" className="space-y-3">
        <TabsList className="h-8">
          <TabsTrigger value="general" className="gap-1.5 text-xs">
            <Store className="size-3.5" />
            一般・ストア情報
          </TabsTrigger>
          <TabsTrigger value="growth" className="gap-1.5 text-xs">
            <CreditCard className="size-3.5" />
            決済・集客の自動化
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-1.5 text-xs">
            <Bell className="size-3.5" />
            通知・運用履歴
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0">
          <UnifiedStoreProfileCard />
        </TabsContent>

        <TabsContent value="growth" className="mt-0 space-y-3">
          <div className="grid gap-3 xl:grid-cols-[1fr_360px]">
            <StripeConnectCard />
            <Card className="shadow-sm">
              <CardHeader className="border-b border-neutral-200 px-4 py-3">
                <CardTitle className="text-sm">売上と集客の安全ルール</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-4 py-4 text-xs text-neutral-600">
                <p>決済連携の開始は人間操作でのみ実行します。AIが勝手に連携や公開を完了することはありません。</p>
                <p>Google/Bingへの送信と画像最適化は商品保存時に自動で動きます。難しい項目はON/OFFだけ確認します。</p>
              </CardContent>
            </Card>
          </div>
          <OmnichannelAutomationCard />
        </TabsContent>

        <TabsContent value="integrations" className="mt-0 space-y-3">
          <EmailNotificationHistory />
          <SocialLineOperationsCard />
        </TabsContent>
      </Tabs>
    </section>
  );
}

type StripeStatusResponse = {
  success?: boolean;
  state?: "not_connected" | "pending" | "active" | "restricted";
  accountId?: string | null;
  onboardingUrl?: string | null;
  onboardingExpiresAt?: number | null;
  lastSyncedAt?: number | null;
  statusNote?: string;
  businessData?: {
    representativeName?: string;
    companyName?: string;
    location?: string;
    postalCode?: string;
    phone?: string;
    email?: string;
    dataSource?: string;
  };
  apiMode?: "stripe_api" | "mock";
  error?: string;
};

type StripeOnboardResponse = StripeStatusResponse & {
  message?: string;
};

type EmailNotificationLog = {
  id: string;
  recipientEmail: string;
  subject: string;
  provider: string;
  status: "queued" | "sent" | "failed";
  errorMessage: string;
  createdAt: number;
  sentAt: number | null;
  attempts: number;
  lastAttemptAt: number | null;
};

type EmailLogsResponse = {
  success?: boolean;
  logs?: EmailNotificationLog[];
  error?: string;
};

type SocialSettings = {
  xOnProductPublish: boolean;
  instagramOnProductPublish: boolean;
  lineOnProductPublish: boolean;
  xOnSaleStart: boolean;
  lineOnLowStock: boolean;
  xTemplate: string;
  instagramTemplate: string;
  lineTemplate: string;
  updatedAt: number | null;
};

type SocialSettingsResponse = {
  success?: boolean;
  settings?: SocialSettings;
  error?: string;
};

type SocialPostHistory = {
  id: string;
  productId: string;
  productName: string;
  platform: string;
  content: string;
  status: string;
  scheduledFor: string | null;
  createdAt: string | null;
  approvedAt: string | null;
  postedUrl: string;
};

type SocialHistoryResponse = {
  success?: boolean;
  posts?: SocialPostHistory[];
  error?: string;
};

type UnifiedStoreProfile = {
  storeName: string;
  storeUrl: string;
  businessName: string;
  postalCode: string;
  address: string;
  phone: string;
  email: string;
  invoiceRegistrationNumber: string;
  logoR2Key: string;
  logoUrl: string;
  logoFileName: string;
  tokushohoText: string;
  privacyPolicyText: string;
};

type UnifiedStoreProfileResponse = {
  success?: boolean;
  profile?: UnifiedStoreProfile;
  error?: string;
};

function UnifiedStoreProfileCard() {
  const [profile, setProfile] = React.useState<UnifiedStoreProfile>({
    storeName: "AIBOUX STORE",
    storeUrl: "store.mall.aiboux.com",
    businessName: "AIBOUX STORE",
    postalCode: "",
    address: "",
    phone: "",
    email: "support@shop.aiboux.com",
    invoiceRegistrationNumber: "",
    logoR2Key: "",
    logoUrl: "",
    logoFileName: "",
    tokushohoText: "",
    privacyPolicyText: "",
  });
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [logoUploading, setLogoUploading] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<number | null>(null);

  const update = (key: keyof UnifiedStoreProfile, value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const loadProfile = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/shop/api/settings/profile");
      const data = (await response.json().catch(() => ({}))) as UnifiedStoreProfileResponse;
      if (!response.ok || !data.success || !data.profile) {
        throw new Error(data.error || "ストア情報を取得できませんでした");
      }
      setProfile(data.profile);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ストア情報を取得できませんでした");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const saveProfile = async () => {
    if (!normalizeStoreSlugPreview(profile.storeUrl)) {
      toast.error("ストアURLを入力してください");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/shop/api/settings/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = (await response.json().catch(() => ({}))) as UnifiedStoreProfileResponse;
      if (!response.ok || !data.success || !data.profile) {
        throw new Error(data.error || "ストア情報を保存できませんでした");
      }
      setProfile(data.profile);
      setLastSavedAt(Date.now());
      toast.success("ストア情報を保存し、法務表示と帳票情報へ自動反映しました");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ストア情報を保存できませんでした");
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (file: File | undefined) => {
    if (!file) return;
    setLogoUploading(true);
    update("logoFileName", file.name);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("purpose", "document-logo");
      const response = await fetch("/shop/api/upload", { method: "POST", body: form });
      const result = (await response.json().catch(() => ({}))) as { success?: boolean; key?: string; url?: string; error?: string };
      if (!response.ok || !result.success || !result.key) {
        throw new Error(formatImageUploadError(result.error));
      }
      setProfile((current) => ({
        ...current,
        logoFileName: file.name,
        logoR2Key: result.key ?? "",
        logoUrl: result.url ?? "",
      }));
      toast.success("ロゴ画像を追加しました。保存すると帳票へ反映されます。");
    } catch (error) {
      setProfile((current) => ({ ...current, logoFileName: "", logoR2Key: "", logoUrl: "" }));
      toast.error(error instanceof Error ? error.message : "ロゴ画像を保存できませんでした");
    } finally {
      setLogoUploading(false);
    }
  };

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-3">
        <Card className="border-blue-200 bg-blue-50/40 shadow-sm">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-neutral-950">ここだけ保存すれば連動します</div>
              <p className="mt-1 text-xs leading-5 text-neutral-600">会社名、住所、電話番号、メールはこの画面が正本です。特商法、プライバシーポリシー、請求書・領収書へ自動反映します。</p>
            </div>
            <Button size="sm" className="h-8 gap-1.5" onClick={saveProfile} disabled={loading || saving}>
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              {saving ? "保存中..." : "保存"}
            </Button>
            {lastSavedAt ? <div className="text-[11px] text-neutral-500">最終反映: {formatDateTime(lastSavedAt)}</div> : null}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="border-b border-neutral-200 px-4 py-3">
            <CardTitle className="text-sm">ストアと事業者のマスター情報</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 px-4 py-4 md:grid-cols-2">
            <ControlledInput label="店名" value={profile.storeName} onChange={(value) => update("storeName", value)} />
            <div>
              <ControlledInput
                label="ストアURL"
                help="購入者に案内するURLです。例: custom-shop.mall.aiboux.com"
                value={profile.storeUrl}
                onChange={(value) => update("storeUrl", value)}
              />
              <div className="mt-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] leading-4 text-neutral-600">
                保存後のURL: <span className="font-medium text-neutral-900">{formatStoreUrlPreview(profile.storeUrl)}</span>
              </div>
            </div>
            <ControlledInput
              label="会社名・事業者名"
              help="特商法、Stripe連携、納品書、請求書、領収書へ自動で使います。"
              value={profile.businessName}
              onChange={(value) => update("businessName", value)}
            />
            <ControlledInput
              label="問い合わせメール"
              help="購入者対応、法務表示、帳票問い合わせ先へ自動で使います。"
              value={profile.email}
              onChange={(value) => update("email", value)}
            />
            <ControlledInput label="郵便番号" value={profile.postalCode} onChange={(value) => update("postalCode", value)} />
            <ControlledInput label="電話番号" value={profile.phone} onChange={(value) => update("phone", value)} />
            <ControlledInput
              label="登録番号（インボイスT番号）"
              help="未登録の場合は空欄で問題ありません。帳票へだけ反映します。"
              value={profile.invoiceRegistrationNumber}
              onChange={(value) => update("invoiceRegistrationNumber", value)}
            />
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-neutral-700">住所</label>
              <Textarea className="min-h-20 resize-none" value={profile.address} onChange={(event) => update("address", event.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="border-b border-neutral-200 px-4 py-3">
            <CardTitle className="text-sm">自動生成される法務表示</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 px-4 py-4 lg:grid-cols-2">
            <ReadonlyLegalPreview title="特定商取引法に基づく表記" value={profile.tokushohoText} />
            <ReadonlyLegalPreview title="プライバシーポリシー" value={profile.privacyPolicyText} />
            <p className="text-xs leading-5 text-neutral-500 lg:col-span-2">
              法務表示はマスター情報から自動で組み立てる固定テンプレートです。直接編集はせず、会社名や住所を直したい場合は上のマスター情報だけを変更してください。
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <Card className="shadow-sm">
          <CardHeader className="border-b border-neutral-200 px-4 py-3">
            <CardTitle className="text-sm">請求書・納品書用ロゴ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-4 py-4">
            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-5 text-center hover:bg-neutral-100">
              {logoUploading ? <Loader2Icon /> : <ImagePlus className="size-6 text-neutral-500" />}
              <span className="text-sm font-medium text-neutral-900">{logoUploading ? "ロゴ画像を保存中..." : "ロゴ画像を選択"}</span>
              <span className="text-xs leading-5 text-neutral-500">納品書、請求書、領収書へ自動で使います。</span>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                className="sr-only"
                disabled={logoUploading}
                onChange={(event) => uploadLogo(event.target.files?.[0])}
              />
            </label>
            <div className="rounded-md border border-neutral-200 px-3 py-2 text-xs text-neutral-600">
              現在の選択: <span className="font-medium text-neutral-950">{profile.logoFileName || "未設定"}</span>
              {profile.logoR2Key ? <span className="mt-1 block text-emerald-700">上の保存ボタンで請求書・納品書・領収書に反映します。</span> : null}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="border-b border-neutral-200 px-4 py-3">
            <CardTitle className="text-sm">連動先</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-4 text-xs text-neutral-600">
            <LinkedDestination label="Stripe連携" />
            <LinkedDestination label="特商法表示" />
            <LinkedDestination label="プライバシーポリシー" />
            <LinkedDestination label="納品書・請求書・領収書" />
            <Separator />
            <div className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2">
              <span>管理URL</span>
              <span className="font-medium text-neutral-900">shop.aiboux.com</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReadonlyLegalPreview({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <div className="text-xs font-semibold text-neutral-800">{title}</div>
      <pre className="mt-2 max-h-64 whitespace-pre-wrap rounded-md bg-white p-3 text-[11px] leading-5 text-neutral-600">{value || "マスター情報を保存すると自動生成されます。"}</pre>
    </div>
  );
}

function LinkedDestination({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2">
      <CheckCircle2 className="size-3.5 text-emerald-600" />
      <span>{label}へ自動反映</span>
    </div>
  );
}

type OmnichannelSettings = {
  googleShoppingAutoSync: boolean;
  bingShoppingAutoSync: boolean;
  aiImageOptimization: boolean;
  updatedAt: number | null;
};

type OmnichannelSettingsResponse = {
  success?: boolean;
  settings?: OmnichannelSettings;
  error?: string;
};

function OmnichannelAutomationCard() {
  const [settings, setSettings] = React.useState<OmnichannelSettings>({
    googleShoppingAutoSync: true,
    bingShoppingAutoSync: true,
    aiImageOptimization: true,
    updatedAt: null,
  });
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const loadSettings = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/shop/api/settings/omnichannel");
      const data = (await response.json().catch(() => ({}))) as OmnichannelSettingsResponse;
      if (!response.ok || !data.success || !data.settings) {
        throw new Error(data.error || "集客・SEO自動化設定を取得できませんでした");
      }
      setSettings(data.settings);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "集客・SEO自動化設定を取得できませんでした");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const update = async (key: keyof Omit<OmnichannelSettings, "updatedAt">, value: boolean) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    setSaving(true);
    try {
      const response = await fetch("/shop/api/settings/omnichannel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const data = (await response.json().catch(() => ({}))) as OmnichannelSettingsResponse;
      if (!response.ok || !data.success || !data.settings) {
        throw new Error(data.error || "自動化設定を保存できませんでした");
      }
      setSettings(data.settings);
      toast.success("自動化設定を保存しました");
    } catch (error) {
      setSettings(settings);
      toast.error(error instanceof Error ? error.message : "自動化設定を保存できませんでした");
    } finally {
      setSaving(false);
    }
  };

  const updateAll = async (enabled: boolean) => {
    const next = {
      ...settings,
      googleShoppingAutoSync: enabled,
      bingShoppingAutoSync: enabled,
      aiImageOptimization: enabled,
    };
    setSettings(next);
    setSaving(true);
    try {
      const response = await fetch("/shop/api/settings/omnichannel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const data = (await response.json().catch(() => ({}))) as OmnichannelSettingsResponse;
      if (!response.ok || !data.success || !data.settings) {
        throw new Error(data.error || "自動集客設定を保存できませんでした");
      }
      setSettings(data.settings);
      toast.success(enabled ? "自動集客をまとめてONにしました" : "自動集客をまとめてOFFにしました");
    } catch (error) {
      setSettings(settings);
      toast.error(error instanceof Error ? error.message : "自動集客設定を保存できませんでした");
    } finally {
      setSaving(false);
    }
  };

  const activeCount = [settings.googleShoppingAutoSync, settings.bingShoppingAutoSync, settings.aiImageOptimization].filter(Boolean).length;

  return (
    <div className="grid gap-3 xl:grid-cols-[1fr_360px]">
      <Card className="shadow-sm">
        <CardHeader className="border-b border-neutral-200 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm">自動集客設定</CardTitle>
              <p className="mt-1 text-xs text-neutral-500">難しい検索対策は不要です。ONにすると、商品保存時に画像・商品情報・在庫状態を裏側で整えます。</p>
            </div>
            <Badge className="rounded-md border border-emerald-200 bg-emerald-50 text-xs text-emerald-700">
              {activeCount}/3 稼働中
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-3">
            <div>
              <div className="text-sm font-semibold text-neutral-950">おすすめ自動化をまとめて使う</div>
              <p className="mt-1 text-xs leading-5 text-neutral-500">まずはここをONにすれば、Google/Bingへの送信と画像最適化をまとめて任せられます。</p>
            </div>
            <Button size="sm" className="h-8" onClick={() => updateAll(activeCount < 3)} disabled={loading || saving}>
              {activeCount === 3 ? "まとめてOFF" : "まとめてON"}
            </Button>
          </div>
          <AutomationToggle
            icon={Search}
            title="Googleに商品を自動で送る"
            description="商品を保存・公開すると、Google向けに商品名、価格、在庫状態を自動で送ります。APIキー未設定時はテスト同期として状態だけ記録します。"
            checked={settings.googleShoppingAutoSync}
            disabled={loading || saving}
            onCheckedChange={(checked) => update("googleShoppingAutoSync", checked)}
          />
          <AutomationToggle
            icon={Activity}
            title="Bingに在庫を自動反映"
            description="Bing向けにも同じタイミングで商品情報を送ります。結果は商品一覧のGoogle/Bingバッジで確認できます。"
            checked={settings.bingShoppingAutoSync}
            disabled={loading || saving}
            onCheckedChange={(checked) => update("bingShoppingAutoSync", checked)}
          />
          <AutomationToggle
            icon={Sparkles}
            title="AI 画像最適化"
            description="画像名と保存形式を検索に向いた形へ自動で整えます。出店者がファイル名や専門用語を意識する必要はありません。"
            checked={settings.aiImageOptimization}
            disabled={loading || saving}
            onCheckedChange={(checked) => update("aiImageOptimization", checked)}
          />
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/40 shadow-sm">
        <CardHeader className="border-b border-blue-100 px-4 py-3">
          <CardTitle className="text-sm">いま裏側で行うこと</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-4 py-4 text-xs text-neutral-700">
          <AutomationStep done={settings.aiImageOptimization} label="画像を検索向けの保存名へ自動調整" />
          <AutomationStep done={settings.googleShoppingAutoSync || settings.bingShoppingAutoSync} label="公開商品の在庫状態を検索エンジン向けに反映" />
          <AutomationStep done={settings.googleShoppingAutoSync || settings.bingShoppingAutoSync} label="同期結果を商品一覧のバッジで見える化" />
          <Separator />
          <p className="leading-5 text-neutral-600">
            {saving ? "保存中です。少し待つと自動化の状態が商品管理に反映されます。" : "ONにした項目は商品保存時に自動で動きます。難しい設定画面を開く必要はありません。"}
          </p>
          {settings.updatedAt ? <p className="text-[11px] text-neutral-500">最終更新: {formatDateTime(settings.updatedAt)}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}

function AutomationToggle({
  icon: Icon,
  title,
  description,
  checked,
  disabled,
  onCheckedChange,
}: {
  icon: typeof Search;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white px-3 py-3">
      <div className="flex min-w-0 items-start gap-3">
        <div className={checked ? "flex size-9 shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700" : "flex size-9 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-neutral-500"}>
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-neutral-950">{title}</div>
          <p className="mt-1 text-xs leading-5 text-neutral-500">{description}</p>
          <div className={checked ? "mt-2 text-xs font-medium text-emerald-700" : "mt-2 text-xs font-medium text-neutral-500"}>
            {checked ? "自動で処理中" : "停止中"}
          </div>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={[
          "relative h-6 w-11 shrink-0 rounded-full border transition disabled:cursor-not-allowed disabled:opacity-60",
          checked ? "border-emerald-500 bg-emerald-500" : "border-neutral-300 bg-neutral-200",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition",
            checked ? "left-5" : "left-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

function AutomationStep({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={done ? "flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700" : "flex size-5 items-center justify-center rounded-full bg-neutral-100 text-neutral-400"}>
        {done ? <CheckCircle2 className="size-3.5" /> : <span className="size-1.5 rounded-full bg-current" />}
      </span>
      <span>{label}</span>
    </div>
  );
}

function SocialLineOperationsCard() {
  const [open, setOpen] = React.useState(false);
  const [settings, setSettings] = React.useState<SocialSettings>({
    xOnProductPublish: false,
    instagramOnProductPublish: false,
    lineOnProductPublish: false,
    xOnSaleStart: false,
    lineOnLowStock: false,
    xTemplate: '新商品「{productName}」を公開しました。価格: {price} {storeUrl}',
    instagramTemplate: '新商品のお知らせ: {productName}\n{description}\n{storeUrl}',
    lineTemplate: '新商品「{productName}」を公開しました。{storeUrl}',
    updatedAt: null,
  });
  const [posts, setPosts] = React.useState<SocialPostHistory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [settingsResponse, historyResponse] = await Promise.all([
        fetch("/shop/api/settings/social"),
        fetch("/shop/api/social/history?limit=20"),
      ]);
      const settingsData = (await settingsResponse.json().catch(() => ({}))) as SocialSettingsResponse;
      const historyData = (await historyResponse.json().catch(() => ({}))) as SocialHistoryResponse;
      if (!settingsResponse.ok || !settingsData.success || !settingsData.settings) {
        throw new Error(settingsData.error || "SNS/LINE設定を取得できませんでした");
      }
      setSettings(settingsData.settings);
      if (historyResponse.ok && historyData.success) setPosts(historyData.posts ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "SNS/LINE設定を取得できませんでした");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (open) void load();
  }, [load, open]);

  const update = <K extends keyof SocialSettings>(key: K, value: SocialSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch("/shop/api/settings/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = (await response.json().catch(() => ({}))) as SocialSettingsResponse;
      if (!response.ok || !data.success || !data.settings) {
        throw new Error(data.error || "SNS/LINE設定を保存できませんでした");
      }
      setSettings(data.settings);
      toast.success("SNS/LINE連携設定を保存しました");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "SNS/LINE設定を保存できませんでした");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-neutral-200 bg-neutral-50/60 shadow-sm">
        <CardHeader className="border-b border-neutral-200 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Badge variant="outline" className="rounded-md bg-white text-[11px]">拡張機能</Badge>
                <CardTitle className="text-sm">SNS/LINE連携</CardTitle>
              </div>
              <p className="text-xs text-neutral-500">通常運用では設定不要です。必要な店舗だけ開いて、投稿下書きとLINE通知を調整します。</p>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2 bg-white">
                {open ? "閉じる" : "必要なときだけ開く"}
                <ChevronDown className={["size-4 transition", open ? "rotate-180" : ""].join(" ")} />
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <span>外部送信は必ず人間承認後です。AIBOUXが勝手に投稿することはありません。</span>
                <Button size="sm" className="h-7 gap-2" onClick={save} disabled={loading || saving}>
                  {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                  保存
                </Button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <SocialToggle label="商品公開時にX下書きを作成" checked={settings.xOnProductPublish} onCheckedChange={(value) => update("xOnProductPublish", value)} />
                <SocialToggle label="商品公開時にInstagram下書きを作成" checked={settings.instagramOnProductPublish} onCheckedChange={(value) => update("instagramOnProductPublish", value)} />
                <SocialToggle label="商品公開時にLINE下書きを作成" checked={settings.lineOnProductPublish} onCheckedChange={(value) => update("lineOnProductPublish", value)} />
                <SocialToggle label="セール開始時にX下書きを作成" checked={settings.xOnSaleStart} onCheckedChange={(value) => update("xOnSaleStart", value)} />
                <SocialToggle label="在庫が少ない商品をLINEで通知" checked={settings.lineOnLowStock} onCheckedChange={(value) => update("lineOnLowStock", value)} />
              </div>
              <TemplateField label="X投稿テンプレート" value={settings.xTemplate} onChange={(value) => update("xTemplate", value)} />
              <TemplateField label="Instagram投稿テンプレート" value={settings.instagramTemplate} onChange={(value) => update("instagramTemplate", value)} />
              <TemplateField label="LINE通知テンプレート" value={settings.lineTemplate} onChange={(value) => update("lineTemplate", value)} />
              <p className="text-[11px] leading-5 text-neutral-500">
                使える差し込み: {"{productName}"}, {"{price}"}, {"{description}"}, {"{storeUrl}"}。公開や外部送信は人間承認が必要です。
              </p>
            </div>

            <div className="min-w-0 rounded-lg border border-neutral-200 bg-white">
              <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-2">
                <div className="text-sm font-medium text-neutral-950">投稿履歴</div>
                <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={load} disabled={loading}>
                  {loading ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
                  更新
                </Button>
              </div>
              <div className="max-h-[420px] overflow-auto">
                {posts.length === 0 ? (
                  <div className="px-3 py-8 text-center text-xs text-neutral-500">投稿履歴はまだありません。</div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {posts.map((post) => (
                      <div key={post.id} className="space-y-2 px-3 py-3 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate font-medium text-neutral-950">{post.productName}</div>
                            <div className="mt-0.5 text-neutral-500">{platformLabel(post.platform)} / {socialStatusLabel(post.status)}</div>
                          </div>
                          <SocialStatusBadge status={post.status} />
                        </div>
                        <p className="line-clamp-2 leading-5 text-neutral-600">{post.content || "本文未設定"}</p>
                        {post.postedUrl ? (
                          <Button asChild variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                            <a href={post.postedUrl} target="_blank" rel="noreferrer">
                              <ExternalLink className="size-3.5" />
                              投稿を開く
                            </a>
                          </Button>
                        ) : (
                          <div className="text-[11px] text-neutral-500">公開リンクは投稿完了後に表示されます。</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function SocialToggle({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-10 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700">
      <Checkbox checked={checked} onCheckedChange={(value) => onCheckedChange(value === true)} />
      <span>{label}</span>
    </label>
  );
}

function TemplateField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-neutral-700">{label}</span>
      <Textarea className="mt-1 min-h-20 resize-none text-xs leading-5" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SocialStatusBadge({ status }: { status: string }) {
  if (status === "published") return <Badge className="rounded-md border border-emerald-200 bg-emerald-50 text-xs text-emerald-700">投稿済み</Badge>;
  if (status === "approved") return <Badge className="rounded-md border border-blue-200 bg-blue-50 text-xs text-blue-700">承認済み</Badge>;
  if (status === "failed") return <Badge className="rounded-md border border-red-200 bg-red-50 text-xs text-red-700">要確認</Badge>;
  return <Badge className="rounded-md border border-neutral-200 bg-neutral-50 text-xs text-neutral-600">下書き</Badge>;
}

function platformLabel(value: string): string {
  if (value === "x") return "X";
  if (value === "instagram") return "Instagram";
  if (value === "line") return "LINE";
  return "その他";
}

function socialStatusLabel(value: string): string {
  if (value === "published") return "投稿済み";
  if (value === "approved") return "承認済み";
  if (value === "failed") return "要確認";
  return "下書き";
}

function EmailNotificationHistory() {
  const [logs, setLogs] = React.useState<EmailNotificationLog[]>([]);
  const [filter, setFilter] = React.useState<"all" | "sent" | "pending" | "failed">("all");
  const [loading, setLoading] = React.useState(true);

  const loadLogs = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/shop/api/notifications/email-logs?limit=50");
      const data = (await response.json().catch(() => ({}))) as EmailLogsResponse;
      if (!response.ok || !data.success) {
        throw new Error(data.error || "通知履歴を取得できませんでした");
      }
      setLogs(data.logs ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "通知履歴を取得できませんでした");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    if (filter === "pending") return log.status === "queued" || (log.status === "failed" && log.attempts < 5);
    if (filter === "failed") return log.status === "failed" && log.attempts >= 5;
    return log.status === filter;
  });

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-neutral-200 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm">メール通知履歴</CardTitle>
            <p className="mt-1 text-xs text-neutral-500">帳票設定や商品公開など、システム通知の送信状況を確認できます。</p>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-2" onClick={loadLogs} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            更新
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            ["all", "すべて"],
            ["pending", "対応中"],
            ["sent", "送信済み"],
            ["failed", "要確認"],
          ].map(([value, label]) => (
            <Button
              key={value}
              variant={filter === value ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setFilter(value as typeof filter)}
            >
              {label}
            </Button>
          ))}
        </div>
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px] px-4 text-xs">状態</TableHead>
              <TableHead className="text-xs">内容</TableHead>
              <TableHead className="text-xs">宛先</TableHead>
              <TableHead className="text-xs">送信日時</TableHead>
              <TableHead className="w-[90px] text-right text-xs">試行</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-6 text-center text-xs text-neutral-500">
                  通知履歴を読み込み中...
                </TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-6 text-center text-xs text-neutral-500">
                  まだ該当する通知履歴はありません。帳票設定の保存、商品公開、管理者通知が発生するとここへ表示されます。
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="px-4">
                    <EmailStatusBadge log={log} />
                  </TableCell>
                  <TableCell className="max-w-[520px] whitespace-normal">
                    <div className="text-xs font-medium text-neutral-950">{log.subject}</div>
                    {log.errorMessage ? <div className="mt-1 text-[11px] leading-4 text-amber-700">{friendlyEmailError(log.errorMessage)}</div> : null}
                  </TableCell>
                  <TableCell className="text-xs text-neutral-600">
                    <div>{log.recipientEmail}</div>
                    <div className="mt-1 text-[11px] text-neutral-400">{log.provider || "resend"}</div>
                  </TableCell>
                  <TableCell className="text-xs text-neutral-600">{formatDateTime(log.sentAt || log.lastAttemptAt || log.createdAt)}</TableCell>
                  <TableCell className="text-right text-xs text-neutral-600">{log.attempts || 0}/5回</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function EmailStatusBadge({ log }: { log: EmailNotificationLog }) {
  if (log.status === "sent") return <Badge className="rounded-md border border-emerald-200 bg-emerald-50 text-xs text-emerald-700">送信済み</Badge>;
  if (log.status === "failed" && log.attempts < 5) return <Badge className="rounded-md border border-amber-200 bg-amber-50 text-xs text-amber-700">再試行中</Badge>;
  if (log.status === "failed") return <Badge className="rounded-md border border-red-200 bg-red-50 text-xs text-red-700">要確認</Badge>;
  return <Badge className="rounded-md border border-blue-200 bg-blue-50 text-xs text-blue-700">送信待ち</Badge>;
}

function friendlyEmailError(value: string): string {
  if (value.includes("RESEND_API_KEY")) return "Resend APIキー未設定のため、送信せず要確認として記録しています。";
  if (value.includes("mock_send_without_resend_api_key")) return "旧ログ: Resend APIキー未設定時の安全なモック送信記録です。";
  if (value.includes("internal server error")) return "メール基盤側の一時的な問題で、キューへ退避しました。";
  if (value.includes("timeout") || value.includes("aborted")) return "送信先サーバーの応答が遅いため、再試行します。";
  if (value.includes("Invalid") || value.includes("email address")) return "宛先メールアドレスを確認してください。";
  if (value.includes("rate") || value.includes("limit") || value.includes("429")) return "送信上限に達したため、時間をおいて再試行します。";
  return "通知送信で確認が必要です。設定内容を確認し、解決しない場合はサポートへお問い合わせください。";
}

function formatDateTime(value: number | null | undefined): string {
  if (!value) return "未送信";
  return new Date(value).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatStoreUrlPreview(value: string): string {
  const normalized = normalizeStoreSlugPreview(value);
  return normalized ? `https://${normalized}.mall.aiboux.com` : "ストアURLを入力してください";
}

function normalizeStoreSlugPreview(value: string): string {
  const host = extractStoreHostPreview(value);
  const raw = host.endsWith(".mall.aiboux.com") ? host.slice(0, -".mall.aiboux.com".length) : host;
  const slug = raw
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return slug;
}

function extractStoreHostPreview(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    return url.hostname;
  } catch {
    return trimmed;
  }
}

function StripeConnectCard({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = React.useState<StripeStatusResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [connecting, setConnecting] = React.useState(false);

  const loadStatus = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/shop/api/stripe/status");
      const data = (await response.json().catch(() => ({}))) as StripeStatusResponse;
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Stripe連携状態を取得できませんでした");
      }
      setStatus(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Stripe連携状態を取得できませんでした");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const startOnboarding = async () => {
    setConnecting(true);
    try {
      const response = await fetch("/shop/api/stripe/onboard", { method: "POST" });
      const data = (await response.json().catch(() => ({}))) as StripeOnboardResponse;
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Stripe連携を開始できませんでした");
      }
      setStatus(data);
      toast.success(data.apiMode === "mock" ? "決済連携の準備状態を保存しました" : "Stripe連携ページを作成しました");
      if (data.apiMode === "stripe_api" && data.onboardingUrl) {
        window.open(data.onboardingUrl, "_blank", "noopener,noreferrer");
        toast.info("Stripeで入力を完了したら、この画面に戻って状態を更新してください");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Stripe連携を開始できませんでした");
    } finally {
      setConnecting(false);
    }
  };

  const state = status?.state ?? "not_connected";
  const badge = stripeStateBadge(state);
  const businessData = status?.businessData ?? {
    representativeName: "",
    companyName: "",
    location: "",
    dataSource: "shop_settings",
  };
  const businessLabelSuffix = businessData.dataSource === "phase13_failsafe_mock" || businessData.dataSource === "phase12_test_mock" ? "（未設定）" : "";

  return (
    <Card className={compact ? "border-blue-200 bg-blue-50/30 shadow-sm" : "shadow-sm"}>
      <CardHeader className="border-b border-neutral-200 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm">Stripe Connect決済</CardTitle>
            <p className="mt-1 text-xs text-neutral-500">カード決済の売上を受け取るための接続状態です。</p>
          </div>
          <Badge className={`rounded-md text-[11px] ${badge.className}`}>{badge.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4 py-4">
        <div className="grid gap-2 text-xs md:grid-cols-3">
          <StatusLine label={`事業者名${businessLabelSuffix}`} value={businessData.companyName || "一般・ストア情報で入力してください"} />
          <StatusLine label="所在地" value={businessData.location || "一般・ストア情報で入力してください"} />
          <StatusLine label="電話番号" value={businessData.phone || "未設定でも開始できます"} />
        </div>
        {!compact ? (
          <div className="grid gap-3 md:grid-cols-2">
            <LabeledInput label="決済手数料率" help="カード決済などで差し引かれる割合です。" defaultValue="3.6%" />
            <LabeledInput label="モール手数料率" help="外部モール販売時に差し引かれる割合です。" defaultValue="0%" />
          </div>
        ) : null}
        <div className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600">
          {state === "active" ? "決済の受付準備が完了しています。" : null}
          {state === "pending" ? "Stripe側の確認を進めています。Stripe画面で入力を完了した後、この画面に戻って状態を更新してください。" : null}
          {state === "restricted" ? "追加確認が必要です。Stripeの案内に沿って情報を更新してください。" : null}
          {state === "not_connected" ? "まだ接続されていません。下のボタンから安全に開始できます。" : null}
          {status?.apiMode === "mock" ? <span className="mt-1 block text-neutral-500">現在はAPIキー未設定のため、モック連携で状態保存します。</span> : null}
          {businessData.dataSource === "shop_settings" ? <span className="mt-1 block text-emerald-700">一般・ストア情報の事業者データをStripeへ連携します。</span> : null}
          {businessData.dataSource === "phase13_failsafe_mock" || businessData.dataSource === "phase12_test_mock" ? <span className="mt-1 block text-amber-700">事業者情報が未設定のため、Stripe連携はまだ開始しません。先に一般・ストア情報を保存してください。</span> : null}
          {status?.accountId ? <span className="mt-1 block text-neutral-500">接続IDは保存済みです。</span> : null}
          {status?.onboardingExpiresAt ? <span className="mt-1 block text-neutral-500">入力リンク期限: {new Date(status.onboardingExpiresAt).toLocaleString("ja-JP")}</span> : null}
          {status?.lastSyncedAt ? <span className="mt-1 block text-neutral-500">最終確認: {new Date(status.lastSyncedAt).toLocaleString("ja-JP")}</span> : null}
          {status?.statusNote ? <span className="mt-1 block text-amber-700">Stripe確認事項: {status.statusNote}</span> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="h-8 gap-2" onClick={startOnboarding} disabled={connecting || loading}>
            {connecting ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
            {state === "not_connected" ? "決済連携を開始" : "連携情報を更新"}
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-2" onClick={loadStatus} disabled={loading || connecting}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            状態を更新
          </Button>
          {status?.onboardingUrl && status.apiMode === "stripe_api" ? (
            <Button asChild variant="outline" size="sm" className="h-8 gap-2">
              <a href={status.onboardingUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" />
                Stripeで入力
              </a>
            </Button>
          ) : null}
        </div>
        {state === "restricted" ? (
          <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>本人確認や銀行口座など、追加の入力が必要です。連携情報を更新してください。</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function stripeStateBadge(state: NonNullable<StripeStatusResponse["state"]>): { label: string; className: string } {
  if (state === "active") return { label: "受付可能", className: "bg-emerald-600 text-white" };
  if (state === "pending") return { label: "確認中", className: "bg-blue-600 text-white" };
  if (state === "restricted") return { label: "要対応", className: "bg-amber-500 text-white" };
  return { label: "未接続", className: "bg-neutral-200 text-neutral-700" };
}

function Loader2Icon() {
  return (
    <span className="flex size-6 items-center justify-center rounded-full border border-neutral-200 bg-white">
      <span className="size-3 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800" />
    </span>
  );
}

function formatImageUploadError(error: string | undefined): string {
  if (!error) return "ロゴ画像を保存できませんでした。ファイル形式とサイズを確認してください。";
  if (error.includes("too large") || error.includes("8MB")) return "画像が大きすぎます。8MB以下の画像を選んでください。";
  if (error.includes("Only JPEG") || error.includes("supported")) return "PNG、JPG、SVGなどの画像ファイルを選んでください。";
  if (error.includes("empty")) return "空のファイルは追加できません。別の画像を選んでください。";
  return "ロゴ画像を保存できませんでした。ファイル形式とサイズを確認してください。";
}

function ControlledInput({
  label,
  value,
  help,
  onChange,
}: {
  label: string;
  value: string;
  help?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-neutral-700">{label}</span>
      <Input className="mt-1 h-8" value={value} onChange={(event) => onChange(event.target.value)} />
      {help ? <span className="mt-1 block text-[11px] leading-4 text-neutral-500">{help}</span> : null}
    </label>
  );
}

function LabeledInput({ label, defaultValue, help }: { label: string; defaultValue: string; help?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-neutral-700">{label}</span>
      <Input className="mt-1 h-8" defaultValue={defaultValue} />
      {help ? <span className="mt-1 block text-[11px] leading-4 text-neutral-500">{help}</span> : null}
    </label>
  );
}

function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="font-medium text-neutral-950">{value}</span>
    </div>
  );
}
