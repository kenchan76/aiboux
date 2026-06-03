import {
  Archive,
  Bell,
  Clock3,
  FileText,
  Inbox,
  Mail,
  MailOpen,
  PenLine,
  Send,
  ShieldAlert,
  Star,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { classifyMailPrivacy, type MailPrivacyClassification } from "@/lib/mail/ai";

export type MailboxId =
  | "inbox"
  | "unread"
  | "starred"
  | "snoozed"
  | "sent"
  | "drafts"
  | "templates"
  | "archive"
  | "trash"
  | "spam"
  | "settings";

export type MailLabel =
  | "重要"
  | "要対応"
  | "請求関連"
  | "注文関連"
  | "社内連絡"
  | "仕入先"
  | "添付あり";

export type AttachmentKind = "pdf" | "xlsx" | "csv" | "image" | "docx" | "txt";

export interface MailAttachment {
  id: string;
  name: string;
  kind: AttachmentKind;
  sizeLabel: string;
  status: "解析済み" | "未解析" | "確認待ち";
}

export interface HtmlMailPreview {
  title: string;
  heroAlt: string;
  rows: Array<{ label: string; value: string }>;
  footnote: string;
}

export interface MailThreadEntry {
  id: string;
  senderName: string;
  senderEmail: string;
  sentAt: string;
  body: string[];
  quoted?: string[];
  collapsed?: boolean;
}

export type MailTestScenario = "plain_long" | "html_complex" | "nested_reply" | "attachment";

export interface BusinessInsight {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning" | "danger" | "info";
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
}

export interface MailMessage {
  id: string;
  mailbox: MailboxId;
  senderName: string;
  senderEmail: string;
  to: string[];
  subject: string;
  snippet: string;
  body: string[];
  labels: MailLabel[];
  unread: boolean;
  starred: boolean;
  important: boolean;
  receivedAt: string;
  receivedDate: string;
  attachments: MailAttachment[];
  insights: BusinessInsight[];
  aiClassification: MailPrivacyClassification;
  testScenario?: MailTestScenario;
  deliveryState?: "simulated_sent" | "simulated_received";
  htmlPreview?: HtmlMailPreview;
  thread?: MailThreadEntry[];
  related: {
    invoice?: string;
    order?: string;
    delivery?: string;
    partner?: string;
    amount?: string;
    dueDate?: string;
    sku?: string;
  };
}

type MailMessageBase = Omit<MailMessage, "aiClassification">;

export interface Mailbox {
  id: MailboxId;
  label: string;
  href: string;
  icon: LucideIcon;
  count?: number;
}

export interface TemplateItem {
  id: string;
  name: string;
  category: string;
  subject: string;
  preview: string;
  variables: string[];
  updatedAt: string;
}

export interface MailSettingItem {
  id: string;
  title: string;
  description: string;
  status: string;
}

export interface AIAction {
  id: string;
  label: string;
}

export const mailboxes: Mailbox[] = [
  { id: "inbox", label: "受信トレイ", href: "/mail/inbox", icon: Inbox, count: 8 },
  { id: "unread", label: "未読メール", href: "/mail/unread", icon: MailOpen, count: 15 },
  { id: "starred", label: "スター付き", href: "/mail/starred", icon: Star, count: 4 },
  { id: "snoozed", label: "スヌーズ中", href: "/mail/snoozed", icon: Clock3, count: 2 },
  { id: "sent", label: "送信済み", href: "/mail/sent", icon: Send },
  { id: "drafts", label: "下書き", href: "/mail/drafts", icon: PenLine, count: 3 },
  { id: "templates", label: "テンプレート", href: "/mail/templates", icon: FileText },
  { id: "archive", label: "アーカイブ", href: "/mail/archive", icon: Archive },
  { id: "trash", label: "ゴミ箱", href: "/mail/trash", icon: Trash2 },
  { id: "spam", label: "迷惑メール", href: "/mail/spam", icon: ShieldAlert },
];

export const labelFilters: Array<{ label: MailLabel; count: number }> = [
  { label: "重要", count: 6 },
  { label: "要対応", count: 9 },
  { label: "請求関連", count: 12 },
  { label: "注文関連", count: 10 },
  { label: "社内連絡", count: 5 },
  { label: "仕入先", count: 7 },
  { label: "添付あり", count: 14 },
];

const baseMailMessages: MailMessageBase[] = [
  {
    id: "mail-1008",
    mailbox: "inbox",
    senderName: "株式会社サンプル 経理部",
    senderEmail: "billing@example-sample.co.jp",
    to: ["accounts@aiboux-mail.test"],
    subject: "請求書 INV-2024-1008 の送付について",
    snippet: "5月分の請求書を送付いたします。支払期限は2024/06/20です。",
    body: [
      "いつもお世話になっております。株式会社サンプル 経理部です。",
      "5月分の請求書 INV-2024-1008 を添付いたします。請求金額は120,000円、支払期限は2024/06/20です。",
      "ご確認のうえ、期日までにお振込みくださいますようお願いいたします。",
    ],
    labels: ["請求関連", "要対応", "添付あり"],
    unread: true,
    starred: true,
    important: true,
    receivedAt: "08:24",
    receivedDate: "2024/05/24 08:24",
    attachments: [
      { id: "att-inv-1008", name: "INV-2024-1008.pdf", kind: "pdf", sizeLabel: "124KB", status: "解析済み" },
      { id: "att-ledger-1008", name: "入金予定表.xlsx", kind: "xlsx", sizeLabel: "42KB", status: "解析済み" },
    ],
    insights: [
      { label: "請求書番号", value: "INV-2024-1008", tone: "info" },
      { label: "支払期限", value: "2024/06/20", tone: "warning" },
      { label: "合計金額", value: "¥120,000", tone: "neutral" },
      { label: "関連取引先", value: "株式会社サンプル", tone: "success" },
    ],
    related: {
      invoice: "INV-2024-1008",
      partner: "株式会社サンプル",
      amount: "¥120,000",
      dueDate: "2024/06/20",
    },
  },
  {
    id: "mail-1007",
    mailbox: "inbox",
    senderName: "テスト株式会社 購買担当",
    senderEmail: "order@test-corp.co.jp",
    to: ["sales@aiboux-mail.test"],
    subject: "ご注文 ORD-2024-1007 の確認",
    snippet: "注文書を添付しました。納期と在庫引当のご確認をお願いします。",
    body: [
      "お世話になっております。テスト株式会社の購買担当です。",
      "注文番号 ORD-2024-1007 の注文書を送付します。対象SKUはEAR-001、数量は24点です。",
      "納期回答と在庫引当の状況をご返信ください。",
    ],
    labels: ["注文関連", "要対応", "添付あり"],
    unread: true,
    starred: false,
    important: true,
    receivedAt: "08:11",
    receivedDate: "2024/05/24 08:11",
    attachments: [
      { id: "att-ord-1007", name: "ORD-2024-1007.pdf", kind: "pdf", sizeLabel: "88KB", status: "解析済み" },
    ],
    insights: [
      { label: "注文番号", value: "ORD-2024-1007", tone: "info" },
      { label: "SKU", value: "EAR-001", tone: "warning" },
      { label: "引当数量", value: "24点", tone: "neutral" },
      { label: "在庫状態", value: "要確認", tone: "danger" },
    ],
    related: {
      order: "ORD-2024-1007",
      partner: "テスト株式会社",
      sku: "EAR-001",
    },
  },
  {
    id: "mail-1006",
    mailbox: "inbox",
    senderName: "サンプル商事株式会社",
    senderEmail: "delivery@sample-trading.co.jp",
    to: ["logistics@aiboux-mail.test"],
    subject: "納品書 DLV-2024-1006 の送付",
    snippet: "本日出荷分の納品書と配送番号をお送りします。",
    body: [
      "サンプル商事株式会社です。本日出荷分の納品書 DLV-2024-1006 をお送りします。",
      "配送会社はヤマト運輸、問い合わせ番号は 4520-1180-3301 です。",
      "受領後、検品結果をご連絡ください。",
    ],
    labels: ["請求関連", "添付あり"],
    unread: false,
    starred: false,
    important: false,
    receivedAt: "07:55",
    receivedDate: "2024/05/24 07:55",
    attachments: [
      { id: "att-dlv-1006", name: "DLV-2024-1006.pdf", kind: "pdf", sizeLabel: "96KB", status: "解析済み" },
      { id: "att-photo-1006", name: "検品写真.jpg", kind: "image", sizeLabel: "302KB", status: "未解析" },
    ],
    insights: [
      { label: "納品書番号", value: "DLV-2024-1006", tone: "info" },
      { label: "配送会社", value: "ヤマト運輸", tone: "neutral" },
      { label: "検品", value: "未完了", tone: "warning" },
    ],
    related: {
      delivery: "DLV-2024-1006",
      partner: "サンプル商事株式会社",
    },
  },
  {
    id: "mail-1005",
    mailbox: "inbox",
    senderName: "株式会社テスト 営業部",
    senderEmail: "sales@test-example.jp",
    to: ["sales@aiboux-mail.test"],
    subject: "見積書 QUO-2024-1005 のご送付",
    snippet: "先日ご依頼いただいた見積書をお送りします。条件をご確認ください。",
    body: [
      "株式会社テスト 営業部です。",
      "見積書 QUO-2024-1005 を添付いたします。合計金額は75,000円、有効期限は2024/06/10です。",
      "内容に問題がなければ、注文書の発行をお願いいたします。",
    ],
    labels: ["重要", "添付あり"],
    unread: false,
    starred: true,
    important: true,
    receivedAt: "07:32",
    receivedDate: "2024/05/24 07:32",
    attachments: [
      { id: "att-quo-1005", name: "QUO-2024-1005.pdf", kind: "pdf", sizeLabel: "73KB", status: "解析済み" },
    ],
    insights: [
      { label: "見積番号", value: "QUO-2024-1005", tone: "info" },
      { label: "有効期限", value: "2024/06/10", tone: "warning" },
      { label: "合計金額", value: "¥75,000", tone: "neutral" },
    ],
    related: {
      partner: "株式会社テスト",
      amount: "¥75,000",
    },
  },
  {
    id: "mail-1004",
    mailbox: "inbox",
    senderName: "株式会社マテリアル",
    senderEmail: "spec@material-supply.jp",
    to: ["procurement@aiboux-mail.test"],
    subject: "商品仕様書のご送付",
    snippet: "新規部材の仕様書、単価表、在庫予定表を送付いたします。",
    body: [
      "株式会社マテリアルです。新規部材の仕様書を送付いたします。",
      "対象SKUはCAB-001、初回納入予定は2024/06/05です。",
      "単価表と在庫予定表も添付しておりますので、発注候補への登録をご検討ください。",
    ],
    labels: ["仕入先", "添付あり"],
    unread: true,
    starred: false,
    important: false,
    receivedAt: "06:48",
    receivedDate: "2024/05/24 06:48",
    attachments: [
      { id: "att-spec-1004", name: "商品仕様書_CAB-001.docx", kind: "docx", sizeLabel: "156KB", status: "未解析" },
      { id: "att-price-1004", name: "単価表.csv", kind: "csv", sizeLabel: "18KB", status: "未解析" },
    ],
    insights: [
      { label: "SKU", value: "CAB-001", tone: "warning" },
      { label: "入荷予定", value: "2024/06/05", tone: "info" },
      { label: "発注候補", value: "未登録", tone: "neutral" },
    ],
    related: {
      partner: "株式会社マテリアル",
      sku: "CAB-001",
    },
  },
  {
    id: "mail-private-01",
    mailbox: "inbox",
    senderName: "サウナ付きホテル予約センター",
    senderEmail: "booking@example-hotel.jp",
    to: ["private@aiboux-mail.test"],
    subject: "ご予約内容の確認",
    snippet: "週末の宿泊予約内容をお送りします。",
    body: [
      "このたびはご予約ありがとうございます。",
      "週末のサウナ付きプランのご予約内容をお送りします。チェックインは15時です。",
      "現地でのお支払い予定額は18,700円です。",
    ],
    labels: [],
    unread: true,
    starred: false,
    important: false,
    receivedAt: "06:12",
    receivedDate: "2024/05/24 06:12",
    attachments: [],
    insights: [
      { label: "分類", value: "プライベート隔離", tone: "neutral" },
      { label: "Core連携", value: "対象外", tone: "warning" },
    ],
    related: {},
  },
  {
    id: "mail-1003",
    mailbox: "sent",
    senderName: "山田 太郎",
    senderEmail: "yamada@aiboux-mail.test",
    to: ["billing@example-sample.co.jp"],
    subject: "Re: 請求書 INV-2024-1008 の送付について",
    snippet: "請求書を確認しました。入金予定日は6月18日です。",
    body: [
      "株式会社サンプル 経理部 御中",
      "請求書 INV-2024-1008 を確認しました。社内承認済みで、入金予定日は2024/06/18です。",
      "引き続きよろしくお願いいたします。",
    ],
    labels: ["請求関連"],
    unread: false,
    starred: false,
    important: false,
    receivedAt: "昨日",
    receivedDate: "2024/05/23 17:40",
    attachments: [],
    insights: [
      { label: "入金予定", value: "2024/06/18", tone: "success" },
      { label: "返信状態", value: "送信済み", tone: "neutral" },
    ],
    related: {
      invoice: "INV-2024-1008",
      partner: "株式会社サンプル",
    },
  },
  {
    id: "mail-draft-01",
    mailbox: "drafts",
    senderName: "山田 太郎",
    senderEmail: "yamada@aiboux-mail.test",
    to: ["order@test-corp.co.jp"],
    subject: "ORD-2024-1007 納期回答",
    snippet: "EAR-001の引当状況と分納案についてご連絡します。",
    body: [
      "テスト株式会社 購買担当 御中",
      "ORD-2024-1007 の納期回答案です。EAR-001は現在庫が限られるため、分納をご提案します。",
    ],
    labels: ["注文関連", "要対応"],
    unread: false,
    starred: false,
    important: true,
    receivedAt: "下書き",
    receivedDate: "2024/05/24 09:10",
    attachments: [],
    insights: [
      { label: "下書き状態", value: "未送信", tone: "warning" },
      { label: "関連注文", value: "ORD-2024-1007", tone: "info" },
    ],
    related: {
      order: "ORD-2024-1007",
      sku: "EAR-001",
    },
  },
];


function createThread(senderName: string, senderEmail: string, subject: string, index: number): MailThreadEntry[] {
  return [
    {
      id: `thread-${index}-1`,
      senderName: index % 2 === 0 ? "AIBOUX 管理者" : senderName,
      senderEmail: index % 2 === 0 ? "admin@aiboux.com" : senderEmail,
      sentAt: `2026/05/25 10:${String(index % 60).padStart(2, "0")}`,
      body: [
        `${subject} の初回連絡です。AIBOUX Mailの返信スレッド表示と引用折り畳みを確認します。`,
        "本文は日本語、半角記号、括弧（テスト）と金額 ¥12,345 を含め、ベースラインのずれを確認します。",
      ],
    },
    {
      id: `thread-${index}-2`,
      senderName: index % 2 === 0 ? senderName : "AIBOUX 管理者",
      senderEmail: index % 2 === 0 ? senderEmail : "admin@aiboux.com",
      sentAt: `2026/05/25 11:${String((index + 7) % 60).padStart(2, "0")}`,
      body: [
        "ご連絡ありがとうございます。内容を確認し、添付・HTML・引用の表示崩れがないか確認しています。",
        "次の返信では Re: のネストと前回文面の折り畳みを確認します。",
      ],
      quoted: [
        `${subject} の初回連絡です。`,
        "本文は日本語、半角記号、括弧（テスト）と金額 ¥12,345 を含めます。",
      ],
      collapsed: true,
    },
    {
      id: `thread-${index}-3`,
      senderName,
      senderEmail,
      sentAt: `2026/05/25 12:${String((index + 14) % 60).padStart(2, "0")}`,
      body: [
        "承知しました。引用が折り畳まれていて、返信ボタンが本文直下で見つけやすい状態かを確認してください。",
      ],
      quoted: [
        "ご連絡ありがとうございます。内容を確認し、添付・HTML・引用の表示崩れがないか確認しています。",
        "> 初回連絡の引用です。",
      ],
      collapsed: true,
    },
  ];
}

function generateMailSendReceiveTestMessages(): MailMessageBase[] {
  const scenarios: MailTestScenario[] = ["plain_long", "html_complex", "nested_reply", "attachment"];
  const messages: MailMessageBase[] = [];

  for (let index = 1; index <= 36; index += 1) {
    const scenario = scenarios[(index - 1) % scenarios.length];
    const fromInfo = index % 2 === 1;
    const senderName = fromInfo ? "AIBOUX Info" : "AIBOUX Admin";
    const senderEmail = fromInfo ? "info@aiboux.com" : "admin@aiboux.com";
    const recipient = fromInfo ? "admin@aiboux.com" : "info@aiboux.com";
    const subjectBase = scenario === "nested_reply" ? "Re: Re: 送受信確認" : "送受信確認";
    const subject = `${subjectBase} #${String(index).padStart(2, "0")} / ${scenario}`;
    const htmlPreview = scenario === "html_complex"
      ? {
          title: "HTMLメール表示テスト",
          heroAlt: "AIBOUX Mail inline image placeholder",
          rows: [
            { label: "テスト番号", value: `HTML-${String(index).padStart(2, "0")}` },
            { label: "差出人", value: senderEmail },
            { label: "表示確認", value: "テーブル、罫線、インライン画像領域" },
          ],
          footnote: "HTMLはdangerouslySetInnerHTMLを使わず、構造化データとして安全に表示します。",
        }
      : undefined;
    const attachments = scenario === "attachment"
      ? [
          { id: `test-att-${index}-pdf`, name: `test-report-${String(index).padStart(2, "0")}.pdf`, kind: "pdf" as const, sizeLabel: "212KB", status: "解析済み" as const },
          { id: `test-att-${index}-csv`, name: `mail-routing-${String(index).padStart(2, "0")}.csv`, kind: "csv" as const, sizeLabel: "18KB", status: "確認待ち" as const },
          { id: `test-att-${index}-txt`, name: `plain-body-${String(index).padStart(2, "0")}.txt`, kind: "txt" as const, sizeLabel: "7KB", status: "解析済み" as const },
        ]
      : [];
    const body = scenario === "plain_long"
      ? [
          "これはinfo@aiboux.comとadmin@aiboux.com間の長文プレーンテキスト送受信シミュレーションです。",
          "本文には日本語、英数字、丸括弧（）、角括弧[]、金額¥123,456、時刻12:34、URL https://mail.aiboux.com/test を含め、文字化けとベースラインを確認します。",
          "長文でも行間が詰まりすぎず、Gmailのように本文幅が読みやすい範囲に収まり、業務メールとしてコピーしやすいことを確認します。",
          "この段落は意図的に長めにしています。AIBOUX Mailでは背景装飾や余計なカード感を抑え、白背景、細い罫線、明確な操作ボタンで実務処理に集中できることを目的とします。",
        ]
      : scenario === "html_complex"
        ? [
            "複雑なHTMLメールの構造化表示テストです。テーブルとインライン画像領域を安全なReact要素で再現します。",
            "HTML本文は直接挿入せず、サニタイズ済みの構造化データとして表示します。",
          ]
        : scenario === "nested_reply"
          ? [
              "複数回返信されたスレッドの表示テストです。Re: のネスト、引用文の折り畳み、返信ボタン位置を確認します。",
              "最新返信を上部で読み、過去引用は必要な時だけ開けるようにします。",
            ]
          : [
              "添付ファイル付きメールの表示テストです。PDF、CSV、プレーンテキスト添付の見え方と操作ボタン位置を確認します。",
              "添付領域は本文の邪魔にならず、ファイル名、サイズ、解析状態がひと目で分かることを確認します。",
            ];

    messages.push({
      id: `mail-test-${String(index).padStart(2, "0")}`,
      mailbox: fromInfo ? "inbox" : "sent",
      senderName,
      senderEmail,
      to: [recipient],
      subject,
      snippet: body[0],
      body,
      labels: scenario === "attachment" ? ["添付あり", "要対応"] : scenario === "nested_reply" ? ["社内連絡", "要対応"] : ["重要"],
      unread: fromInfo && index <= 21,
      starred: index % 9 === 0,
      important: scenario === "plain_long" || scenario === "attachment",
      receivedAt: index <= 9 ? `12:${String(10 + index).padStart(2, "0")}` : "テスト",
      receivedDate: `2026/05/25 12:${String(10 + (index % 50)).padStart(2, "0")}`,
      attachments,
      insights: [
        { label: "テスト種別", value: scenario, tone: "info" },
        { label: "送受信", value: `${senderEmail} -> ${recipient}`, tone: "neutral" },
        { label: "状態", value: fromInfo ? "受信シミュレーション" : "送信シミュレーション", tone: "success" },
      ],
      testScenario: scenario,
      deliveryState: fromInfo ? "simulated_received" : "simulated_sent",
      htmlPreview,
      thread: scenario === "nested_reply" ? createThread(senderName, senderEmail, subject, index) : undefined,
      related: {},
    });
  }

  return messages;
}

const generatedMailTestMessages = generateMailSendReceiveTestMessages();

export const mailMessages: MailMessage[] = [
  ...baseMailMessages,
  ...generatedMailTestMessages,
].map((message) => ({
  ...message,
  aiClassification: classifyMailPrivacy({
    senderName: message.senderName,
    senderEmail: message.senderEmail,
    subject: message.subject,
    body: message.body,
  }),
}));

export const mailSendReceiveTestSummary = {
  mode: "simulated_fixture",
  accounts: ["info@aiboux.com", "admin@aiboux.com"],
  totalMessages: generatedMailTestMessages.length,
  inboundMessages: generatedMailTestMessages.filter((message) => message.mailbox === "inbox").length,
  outboundMessages: generatedMailTestMessages.filter((message) => message.mailbox === "sent").length,
  scenarios: {
    plainLong: generatedMailTestMessages.filter((message) => message.testScenario === "plain_long").length,
    htmlComplex: generatedMailTestMessages.filter((message) => message.testScenario === "html_complex").length,
    nestedReply: generatedMailTestMessages.filter((message) => message.testScenario === "nested_reply").length,
    attachment: generatedMailTestMessages.filter((message) => message.testScenario === "attachment").length,
  },
};

export const templates: TemplateItem[] = [
  {
    id: "tpl-invoice",
    name: "請求書送付",
    category: "請求関連",
    subject: "請求書 {請求書番号} の送付について",
    preview: "{取引先名} 御中。請求書を添付いたします。金額は{金額}、支払期限は{支払期限}です。",
    variables: ["{取引先名}", "{請求書番号}", "{金額}", "{支払期限}"],
    updatedAt: "2024/05/21",
  },
  {
    id: "tpl-order",
    name: "注文確認",
    category: "注文関連",
    subject: "ご注文 {注文番号} の確認",
    preview: "ご注文内容を確認しました。納期と在庫引当の状況を本メールにてご案内します。",
    variables: ["{注文番号}", "{商品名}", "{数量}", "{納期}"],
    updatedAt: "2024/05/20",
  },
  {
    id: "tpl-delivery",
    name: "納品案内",
    category: "納品",
    subject: "納品書 {納品書番号} のご案内",
    preview: "本日出荷分の納品書と配送番号をご案内します。受領後に検品結果をご返信ください。",
    variables: ["{納品書番号}", "{配送会社}", "{問い合わせ番号}"],
    updatedAt: "2024/05/18",
  },
  {
    id: "tpl-payment",
    name: "入金確認",
    category: "入金",
    subject: "入金確認のご連絡",
    preview: "{金額}のご入金を確認しました。対象請求書は{請求書番号}です。",
    variables: ["{金額}", "{請求書番号}", "{入金日}"],
    updatedAt: "2024/05/16",
  },
  {
    id: "tpl-stock",
    name: "在庫不足連絡",
    category: "在庫",
    subject: "{商品名} の在庫状況について",
    preview: "{商品名}は現在庫が不足しています。分納または代替品をご提案します。",
    variables: ["{商品名}", "{現在庫}", "{次回入荷予定}"],
    updatedAt: "2024/05/15",
  },
  {
    id: "tpl-quote",
    name: "見積回答",
    category: "見積",
    subject: "見積書 {見積番号} のご回答",
    preview: "見積内容を確認しました。条件に問題がなければ注文書を発行します。",
    variables: ["{見積番号}", "{金額}", "{有効期限}"],
    updatedAt: "2024/05/13",
  },
  {
    id: "tpl-apology",
    name: "お詫び",
    category: "顧客対応",
    subject: "ご連絡事項についてのお詫び",
    preview: "このたびはご不便をおかけし申し訳ございません。対応内容をご報告します。",
    variables: ["{取引先名}", "{対応内容}", "{担当者名}"],
    updatedAt: "2024/05/11",
  },
  {
    id: "tpl-follow",
    name: "追客",
    category: "営業",
    subject: "先日のご提案内容について",
    preview: "先日ご提案した内容について、追加資料と次回確認事項をお送りします。",
    variables: ["{取引先名}", "{提案名}", "{次回日程}"],
    updatedAt: "2024/05/09",
  },
];

export const mailSettings: MailSettingItem[] = [
  {
    id: "signature",
    title: "署名",
    description: "部署別の署名テンプレートと返信時の自動挿入を管理します。",
    status: "営業・経理・仕入の3種を有効化",
  },
  {
    id: "sender",
    title: "差出人名",
    description: "外部宛メールに表示する名前と返信先を設定します。",
    status: "山田 太郎 / AIBOUX運用チーム",
  },
  {
    id: "auto-reply",
    title: "自動返信",
    description: "営業時間外や請求書受領時の自動応答ルールです。",
    status: "請求書受領時のみ有効",
  },
  {
    id: "labels",
    title: "ラベル管理",
    description: "AI分類に利用する業務ラベルと色を整理します。",
    status: "7ラベルを運用中",
  },
  {
    id: "notifications",
    title: "通知",
    description: "要対応・請求期限・在庫不足メールの通知先を設定します。",
    status: "要対応のみ即時通知",
  },
  {
    id: "attachments",
    title: "添付ファイル設定",
    description: "PDF、Excel、CSV、画像の解析と保管ルールです。",
    status: "PDF/CSVは自動解析",
  },
  {
    id: "ai",
    title: "AI Assistant設定",
    description: "返信文作成、要約、音声入力の動作範囲を管理します。",
    status: "返信文と要約を有効化",
  },
];

export const mailAIQuickActions: AIAction[] = [
  { id: "reply", label: "返信文を作成" },
  { id: "summary", label: "要約する" },
  { id: "attachments", label: "添付ファイルを整理" },
  { id: "draft", label: "下書きを作成" },
  { id: "task", label: "タスク化する" },
  { id: "template", label: "メールをテンプレート化" },
];

export const contacts: Contact[] = [
  {
    id: "contact-sample",
    name: "株式会社サンプル 経理部",
    email: "billing@example-sample.co.jp",
    company: "株式会社サンプル",
    role: "請求窓口",
  },
  {
    id: "contact-test",
    name: "テスト株式会社 購買担当",
    email: "order@test-corp.co.jp",
    company: "テスト株式会社",
    role: "注文窓口",
  },
  {
    id: "contact-material",
    name: "株式会社マテリアル",
    email: "spec@material-supply.jp",
    company: "株式会社マテリアル",
    role: "仕入先",
  },
];

export const mailboxIconMap = {
  inbox: Inbox,
  starred: Star,
  snoozed: Clock3,
  sent: Send,
  drafts: PenLine,
  templates: FileText,
  archive: Archive,
  trash: Trash2,
  spam: ShieldAlert,
  settings: Tag,
  contacts: Users,
  mail: Mail,
  notifications: Bell,
};
