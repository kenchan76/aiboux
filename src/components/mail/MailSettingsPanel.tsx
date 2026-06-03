"use client";

import * as React from "react";
import { Archive, AtSign, Ban, Bell, Bot, Check, Eye, Forward, Globe2, Inbox, Info, MailCheck, Save, Send, Settings2, Shield, Signature, SlidersHorizontal, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CopyableEmail } from "@/components/mail/CopyableEmail";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "account", label: "アカウント", icon: UserRound },
  { id: "domains", label: "ドメイン", icon: Globe2 },
  { id: "forwarding", label: "転送/POP", icon: Forward },
  { id: "filters", label: "フィルタ", icon: Shield },
  { id: "auto-reply", label: "自動応答", icon: MailCheck },
  { id: "ui", label: "UI", icon: SlidersHorizontal },
] as const;

type SettingsTab = (typeof tabs)[number]["id"];

type SenderProfile = {
  address: string;
  displayName: string;
  signature: string;
  status: "既定" | "確認済み" | "確認待ち";
};

const initialSenderProfiles: SenderProfile[] = [
  {
    address: "info@aiboux.com",
    displayName: "山田 太郎 / AIBOUX運用チーム",
    signature: "山田 太郎\nAIBOUX運用チーム\nmail.aiboux.com",
    status: "既定",
  },
  {
    address: "admin@aiboux.com",
    displayName: "山田 太郎",
    signature: "山田 太郎\n管理者\nAIBOUX",
    status: "確認済み",
  },
  {
    address: "billing@aiboux.com",
    displayName: "AIBOUX 経理",
    signature: "AIBOUX 経理\nbilling@aiboux.com",
    status: "確認待ち",
  },
];

const defaultSenderProfile = initialSenderProfiles[0] as SenderProfile;
const mailSettingsStorageKey = "aiboux-mail-settings-v1";

const filters = [
  { condition: "@example-sample.co.jp", action: "重要メールとして受信トレイに表示", silo: "business" },
  { condition: "newsletter.example.com", action: "自動アーカイブ", silo: "private" },
  { condition: "hotel", action: "プライベート隔離", silo: "private" },
];

export function MailSettingsPanel() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("account");
  const [senderProfiles, setSenderProfiles] = React.useState<SenderProfile[]>(initialSenderProfiles);
  const [activeAddress, setActiveAddress] = React.useState(defaultSenderProfile.address);
  const [customDomain, setCustomDomain] = React.useState("example-sample.co.jp");
  const [autoReplyEnabled, setAutoReplyEnabled] = React.useState(false);
  const [settingsLoaded, setSettingsLoaded] = React.useState(false);

  const activeProfile = senderProfiles.find((profile) => profile.address === activeAddress) ?? defaultSenderProfile;
  const sanitizedDomain = customDomain.trim().replace(/^@+/, "").toLowerCase();
  const dnsRecords = [
    { type: "MX", host: "@", value: "mx1.mail.aiboux.com", note: "優先度 10" },
    { type: "TXT", host: "@", value: "v=spf1 include:mail.aiboux.com ~all", note: "送信元のなりすまし対策" },
    { type: "CNAME", host: `mail.${sanitizedDomain || "your-domain.example"}`, value: "mail.aiboux.com", note: "Webメール用の推奨サブドメイン" },
    { type: "TXT", host: `_dmarc.${sanitizedDomain || "your-domain.example"}`, value: "v=DMARC1; p=none; rua=mailto:dmarc@aiboux.com", note: "まず監視モードで開始" },
  ];

  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "") as SettingsTab;
    if (tabs.some((tab) => tab.id === hash)) setActiveTab(hash);
  }, []);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(mailSettingsStorageKey);
      if (!raw) {
        setSettingsLoaded(true);
        return;
      }
      const saved = JSON.parse(raw) as {
        senderProfiles?: SenderProfile[];
        activeAddress?: string;
        customDomain?: string;
      };
      if (Array.isArray(saved.senderProfiles) && saved.senderProfiles.length > 0) {
        setSenderProfiles(saved.senderProfiles);
        setActiveAddress(saved.activeAddress ?? saved.senderProfiles[0]?.address ?? defaultSenderProfile.address);
      }
      if (typeof saved.customDomain === "string") setCustomDomain(saved.customDomain);
    } catch {
      window.localStorage.removeItem(mailSettingsStorageKey);
    } finally {
      setSettingsLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    if (!settingsLoaded) return;
    window.localStorage.setItem(
      mailSettingsStorageKey,
      JSON.stringify({ senderProfiles, activeAddress, customDomain })
    );
  }, [activeAddress, customDomain, senderProfiles, settingsLoaded]);

  function save(label = "メール設定") {
    toast.success(`${label}を保存しました`);
  }

  function updateActiveProfile(patch: Partial<SenderProfile>) {
    setSenderProfiles((current) =>
      current.map((profile) => (profile.address === activeProfile.address ? { ...profile, ...patch } : profile))
    );
  }

  return (
    <section className="min-h-0 flex-1 overflow-auto bg-white">
      <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-neutral-950">メール設定</h1>
            <p className="text-sm text-neutral-500">アカウント、独自ドメイン、転送、フィルタ、自動応答、表示密度を一画面で管理します。</p>
          </div>
          <Button className="h-9 gap-2 rounded-sm" onClick={() => save()}>
            <Save className="size-4" />
            保存
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SettingsTab)} className="p-4">
        <div className="overflow-x-auto">
          <TabsList className="!grid h-9 min-w-[640px] grid-cols-[repeat(6,minmax(0,1fr))] items-stretch gap-0 overflow-hidden rounded-sm border border-neutral-200 bg-white p-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="h-full min-w-0 rounded-none border-0 border-r border-neutral-200 px-2 text-xs last:border-r-0 after:hidden data-active:bg-neutral-50 data-active:shadow-none"
                >
                  <Icon className="size-3.5" />
                  <span className="truncate">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <TabsContent value="account" className="mt-4">
          <SettingsGrid>
            <SettingsSection title="アドレス別プロファイル" icon={UserRound} description="Fromアドレスごとに送信者名と署名を分けて管理します。">
              <Field label="編集するアドレス">
                <Select value={activeProfile.address} onValueChange={setActiveAddress}>
                  <SelectTrigger aria-label="編集するアドレス"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {senderProfiles.map((profile) => (
                      <SelectItem key={profile.address} value={profile.address}>{profile.address}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="表示名（送信者名）">
                <Input aria-label="表示名（送信者名）" value={activeProfile.displayName} onChange={(event) => updateActiveProfile({ displayName: event.target.value })} />
              </Field>
              <Field label="署名（シグネチャ）">
                <Textarea
                  aria-label="署名（シグネチャ）"
                  value={activeProfile.signature}
                  onChange={(event) => updateActiveProfile({ signature: event.target.value })}
                  className="min-h-32"
                />
              </Field>
              <Button variant="outline" className="h-8 rounded-sm text-xs" onClick={() => save("アドレス別プロファイル")}>このアドレスの設定を保存</Button>
              <p className="text-xs leading-5 text-neutral-500">この画面で編集した表示名と署名は、このブラウザの設定として保存されます。</p>
            </SettingsSection>
            <SettingsSection title="送信元アドレス" icon={AtSign} description="送信時に利用できるFromと個別設定の状態を確認します。">
              <div className="space-y-2">
                {senderProfiles.map((sender) => (
                  <button
                    type="button"
                    key={sender.address}
                    onClick={() => setActiveAddress(sender.address)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition hover:bg-neutral-50",
                      sender.address === activeProfile.address ? "border-blue-200 bg-blue-50" : "border-neutral-200"
                    )}
                  >
                    <div>
                      <CopyableEmail email={sender.address} className="font-medium text-neutral-950" />
                      <div className="text-xs text-neutral-500">{sender.displayName}</div>
                    </div>
                    <Badge variant="outline" className="rounded-sm">{sender.status}</Badge>
                  </button>
                ))}
              </div>
              <Button variant="outline" className="h-8 rounded-sm text-xs">送信元を追加</Button>
            </SettingsSection>
          </SettingsGrid>
        </TabsContent>

        <TabsContent value="domains" className="mt-4">
          <SettingsGrid>
            <SettingsSection title="独自ドメインの簡単設定" icon={Globe2} description="ドメイン名を入力すると、推奨DNSレコードと確認手順を表示します。">
              <Field label="利用したいドメイン">
                <Input aria-label="利用したいドメイン" value={customDomain} onChange={(event) => setCustomDomain(event.target.value)} placeholder="example.co.jp" />
              </Field>
              <div className="grid gap-2 sm:grid-cols-3">
                {["1. ドメイン入力", "2. DNSに追加", "3. 確認して有効化"].map((step, index) => (
                  <div key={step} className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs">
                    <div className="font-medium text-neutral-900">{step}</div>
                    <div className="mt-1 text-neutral-500">{index === 0 ? "この画面で入力" : index === 1 ? "管理会社のDNS画面へ登録" : "AIBOUX側で反映確認"}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-md border border-neutral-200">
                <div className="grid grid-cols-[70px_1fr_1.5fr_1fr] border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-[11px] font-medium text-neutral-500">
                  <span>種類</span>
                  <span>ホスト</span>
                  <span>値</span>
                  <span>メモ</span>
                </div>
                {dnsRecords.map((record) => (
                  <div key={`${record.type}-${record.host}`} className="grid grid-cols-[70px_1fr_1.5fr_1fr] gap-2 border-b border-neutral-100 px-3 py-2 text-xs last:border-b-0">
                    <span className="font-semibold text-neutral-900">{record.type}</span>
                    <span className="truncate text-neutral-700">{record.host}</span>
                    <span className="truncate text-[11px] text-neutral-700">{record.value}</span>
                    <span className="text-neutral-500">{record.note}</span>
                  </div>
                ))}
              </div>
              <Button className="h-8 rounded-sm text-xs" onClick={() => save("独自ドメイン設定")}>DNS確認を開始</Button>
              <p className="text-xs leading-5 text-neutral-500">入力したドメインはこのブラウザに保存されます。DNS反映の実確認とサーバー側の有効化は次工程です。</p>
            </SettingsSection>
            <SettingsSection title="接続状態" icon={Check} description="DNS反映には時間がかかるため、確認結果を段階表示します。">
              <DomainStatus label="所有確認" state="確認待ち" />
              <DomainStatus label="受信MX" state="未確認" />
              <DomainStatus label="SPF" state="推奨値あり" />
              <DomainStatus label="DMARC" state="監視モード" />
            </SettingsSection>
          </SettingsGrid>
        </TabsContent>

        <TabsContent value="forwarding" className="mt-4">
          <SettingsGrid>
            <SettingsSection title="転送" icon={Forward} description="受信メールの外部転送を安全に管理します。">
              <Field label="転送先"><Input defaultValue="archive@example-sample.co.jp" /></Field>
              <ToggleRow label="転送後もAIBOUX Mailにコピーを残す" defaultChecked />
              <ToggleRow label="添付ファイルも転送する" />
              <ToggleRow label="プライベート隔離メールは転送しない" defaultChecked />
            </SettingsSection>
            <SettingsSection title="POP / IMAP" icon={Inbox} description="外部クライアント接続用の読み取り設定です。">
              <ToggleRow label={<HelpTerm term="IMAP" description="複数端末で同じメール状態を同期して読む方式です。スマホ、PC、Webメールを併用する場合に向いています。" />} ariaLabel="IMAPを有効化" defaultChecked />
              <ToggleRow label={<HelpTerm term="POP" description="端末へメールを取り込む古い方式です。1台で保管したい場合に使いますが、複数端末の同期には向きません。" />} ariaLabel="POPを有効化" />
              <Field label={<HelpTerm term="IMAPサーバー" description="受信箱や既読状態をサーバー上で同期するための接続先です。" />}><Input readOnly value="imap.mail.aiboux.com" /></Field>
              <Field label={<HelpTerm term="POPサーバー" description="メールを端末へ取得するための接続先です。取得後の扱いはクライアント設定に依存します。" />}><Input readOnly value="pop.mail.aiboux.com" /></Field>
              <Field label="アプリパスワード"><Input readOnly value="•••• •••• •••• ••••" /></Field>
            </SettingsSection>
          </SettingsGrid>
        </TabsContent>

        <TabsContent value="filters" className="mt-4">
          <SettingsGrid>
            <SettingsSection title="フィルタとブロックリスト" icon={Ban} description="送信者、ドメイン、件名に応じた自動処理です。">
              <div className="space-y-2">
                {filters.map((filter) => (
                  <div key={filter.condition} className="rounded-md border border-neutral-200 p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-neutral-950">{filter.condition}</div>
                      <Badge variant="outline" className={cn("rounded-sm", filter.silo === "business" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-neutral-200 bg-neutral-50 text-neutral-600")}>{filter.silo}</Badge>
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">{filter.action}</div>
                  </div>
                ))}
              </div>
            </SettingsSection>
            <SettingsSection title="サイロ化ルールを追加" icon={Shield} description="業務/私用の扱いを手動で補正します。">
              <Field label="条件"><Input defaultValue="@vendor.example.co.jp" /></Field>
              <Field label="処理">
                <Select defaultValue="inbox">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbox">重要メールとして表示</SelectItem>
                    <SelectItem value="archive">自動アーカイブ</SelectItem>
                    <SelectItem value="private">プライベート隔離</SelectItem>
                    <SelectItem value="block">ブロック</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <ToggleRow label="過去メールにも適用" />
              <Button variant="outline" className="h-8 rounded-sm text-xs" onClick={() => save("フィルタ")}>ルールを追加</Button>
            </SettingsSection>
          </SettingsGrid>
        </TabsContent>

        <TabsContent value="auto-reply" className="mt-4">
          <SettingsGrid>
            <SettingsSection title="自動応答" icon={MailCheck} description="不在時返信を期間指定で設定します。">
              <ToggleRow label="自動応答を有効にする" checked={autoReplyEnabled} onCheckedChange={setAutoReplyEnabled} />
              <Field label="開始日"><Input type="date" defaultValue="2026-05-26" /></Field>
              <Field label="終了日"><Input type="date" defaultValue="2026-05-31" /></Field>
              <Field label="件名"><Input defaultValue="不在のお知らせ" /></Field>
              <Field label="本文"><Textarea className="min-h-32" defaultValue="現在不在にしております。確認後、順次返信いたします。お急ぎの場合は admin@aiboux.com までご連絡ください。" /></Field>
            </SettingsSection>
            <SettingsSection title="送信条件" icon={Send} description="自動応答の対象と頻度を制御します。">
              <ToggleRow label="同一送信者には1日1回だけ返信" defaultChecked />
              <ToggleRow label="メーリングリストには返信しない" defaultChecked />
              <ToggleRow label="プライベート隔離メールには返信しない" defaultChecked />
              <ToggleRow label="社内アドレスにも返信する" />
            </SettingsSection>
          </SettingsGrid>
        </TabsContent>

        <TabsContent value="ui" className="mt-4">
          <SettingsGrid>
            <SettingsSection title="表示" icon={Eye} description="一覧密度とスレッド表示を調整します。">
              <Field label="1ページの表示件数">
                <Select defaultValue="50">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25件</SelectItem>
                    <SelectItem value="50">50件</SelectItem>
                    <SelectItem value="100">100件</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <ToggleRow label="スレッド表示を有効にする" defaultChecked />
              <ToggleRow label="未読を強調表示" defaultChecked />
              <ToggleRow label="添付アイコンを一覧に表示" defaultChecked />
              <ToggleRow label="AI Assistantを右下アイコンで待機" defaultChecked />
            </SettingsSection>
            <SettingsSection title="通知と操作" icon={Bell} description="実務処理の速度に関わる表示を設定します。">
              <ToggleRow label="要対応メールを通知" defaultChecked />
              <ToggleRow label="返信/転送ボタンを本文上部に固定" defaultChecked />
              <ToggleRow label="キーボードショートカットを有効化" defaultChecked />
              <ToggleRow label="危険な外部送信前に確認ダイアログ" defaultChecked />
            </SettingsSection>
          </SettingsGrid>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function SettingsGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 xl:grid-cols-2">{children}</div>;
}

function SettingsSection({ title, description, icon: Icon, children }: { title: string; description: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-neutral-200 bg-white">
      <header className="flex gap-3 border-b border-neutral-200 px-4 py-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-white">
          <Icon className="size-4 text-neutral-700" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-neutral-950">{title}</h2>
          <p className="mt-0.5 text-xs leading-5 text-neutral-500">{description}</p>
        </div>
      </header>
      <div className="space-y-3 p-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="block space-y-1.5">
      <span className="text-xs font-medium text-neutral-600">{label}</span>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  ariaLabel,
  defaultChecked,
  checked,
  onCheckedChange,
}: {
  label: React.ReactNode;
  ariaLabel?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm">
      <span>{label}</span>
      <Checkbox
        defaultChecked={defaultChecked}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange?.(value === true)}
        aria-label={ariaLabel ?? (typeof label === "string" ? label : "設定を切り替え")}
      />
    </label>
  );
}

function HelpTerm({ term, description }: { term: string; description: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span>{term}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex size-4 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 hover:bg-neutral-50"
            aria-label={`${term}の説明`}
          >
            <Info className="size-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-72 leading-5">{description}</TooltipContent>
      </Tooltip>
    </span>
  );
}

function DomainStatus({ label, state }: { label: string; state: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm">
      <span className="text-neutral-700">{label}</span>
      <Badge variant="outline" className="rounded-sm bg-white">{state}</Badge>
    </div>
  );
}
