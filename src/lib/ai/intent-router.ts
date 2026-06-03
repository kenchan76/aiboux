export type AssistantIntentType = "mail_draft" | "settings_signature" | "settings_filter" | "settings_auto_reply" | "navigate" | "general";

export interface AssistantIntentResult {
  intent: AssistantIntentType;
  confidence: number;
  summary: string;
  route?: string;
  draft?: {
    toName: string;
    toEmail: string;
    subject: string;
    body: string;
  };
  form?: {
    title: string;
    fields: Array<{ name: string; label: string; value: string }>;
  };
  audit: string[];
}

const contacts = [
  { name: "佐藤", email: "sato@example-sample.co.jp" },
  { name: "山田", email: "yamada@aiboux.com" },
  { name: "田中", email: "tanaka@example-sample.co.jp" },
  { name: "admin", email: "admin@aiboux.com" },
  { name: "info", email: "info@aiboux.com" },
];

export function resolveAssistantIntent(spokenText: string, service = "mail"): AssistantIntentResult {
  const normalized = normalizeSpeech(spokenText);
  const audit = [
    `input=${spokenText}`,
    `normalized=${normalized}`,
    "router=deterministic_guardrail",
  ];

  if (/(署名|シグネチャ|signature)/i.test(normalized)) {
    audit.push("intent=settings_signature");
    return {
      intent: "settings_signature",
      confidence: 0.93,
      summary: "メール署名の変更Intentを検知しました。設定画面の署名フォームへ誘導します。",
      route: "/mail/settings#account",
      form: {
        title: "署名を更新",
        fields: [
          { name: "signature", label: "新しい署名", value: extractAfter(normalized, /署名を|署名|signature/i) || "山田 太郎\nAIBOUX運用チーム\nmail.aiboux.com" },
        ],
      },
      audit,
    };
  }

  if (/(自動でアーカイブ|ブロック|フィルタ|サイロ|隔離)/.test(normalized)) {
    const domain = normalized.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|[a-z0-9.-]+\.(?:com|jp|co\.jp|net|org)/i)?.[0] ?? "example-sample.co.jp";
    audit.push("intent=settings_filter", `domain=${domain}`);
    return {
      intent: "settings_filter",
      confidence: 0.91,
      summary: `${domain} からのメールを自動処理するフィルタIntentを検知しました。`,
      route: "/mail/settings#filters",
      form: {
        title: "フィルタを追加",
        fields: [
          { name: "condition", label: "条件", value: domain },
          { name: "action", label: "処理", value: /サイロ|隔離/.test(normalized) ? "private_silo" : "archive" },
        ],
      },
      audit,
    };
  }

  if (/(不在|自動応答|自動返信|休暇)/.test(normalized)) {
    audit.push("intent=settings_auto_reply");
    return {
      intent: "settings_auto_reply",
      confidence: 0.89,
      summary: "自動応答設定のIntentを検知しました。",
      route: "/mail/settings#auto-reply",
      form: {
        title: "自動応答を設定",
        fields: [
          { name: "enabled", label: "有効化", value: "true" },
          { name: "message", label: "返信文", value: "現在不在にしております。確認後、順次返信いたします。" },
        ],
      },
      audit,
    };
  }

  if (/(メール|送って|送信|連絡して)/.test(normalized)) {
    const recipient = inferRecipient(normalized);
    const meetingTime = normalized.match(/(\d{1,2})時/)?.[1];
    const subject = meetingTime ? "会議時間変更のご連絡" : "ご連絡";
    const body = meetingTime
      ? `いつもお世話になっております。\n\n明日の会議開始時刻は${meetingTime}時に変更となりました。\nお手数ですが、ご確認のほどよろしくお願いいたします。`
      : `いつもお世話になっております。\n\nご依頼の件についてご連絡いたします。\n詳細をご確認ください。\n\nよろしくお願いいたします。`;
    audit.push("intent=mail_draft", `recipient=${recipient.name}<${recipient.email}>`, `subject=${subject}`);
    return {
      intent: "mail_draft",
      confidence: 0.94,
      summary: `${recipient.name}さん宛ての送信直前下書きを作成しました。外部送信は人間承認後です。`,
      route: "/mail/compose",
      draft: {
        toName: recipient.name,
        toEmail: recipient.email,
        subject,
        body,
      },
      audit,
    };
  }

  if (/(core|メール|mail|shop|file|biz|office|履歴書)/i.test(normalized)) {
    const route = normalized.includes("core") ? "/core" : normalized.includes("shop") ? "/shop/dashboard" : normalized.includes("file") ? "/file/dashboard" : "/mail/inbox";
    audit.push("intent=navigate", `route=${route}`);
    return {
      intent: "navigate",
      confidence: 0.72,
      summary: `${service} の文脈から ${route} へ移動できます。`,
      route,
      audit,
    };
  }

  audit.push("intent=general");
  return {
    intent: "general",
    confidence: 0.58,
    summary: "通常のAI相談として受け付けました。必要に応じて追加情報を確認します。",
    audit,
  };
}

function normalizeSpeech(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/(えーと|えっと|あの|その|うーん|なんか|まあ|ちょっと)/g, "")
    .replace(/(あ、ごめん|ごめん|いや|違う|訂正)/g, "訂正")
    .replace(/\s+/g, " ")
    .trim();
}

function inferRecipient(value: string): { name: string; email: string } {
  const match = contacts.find((contact) => value.toLowerCase().includes(contact.name.toLowerCase()));
  return match ?? contacts[0];
}

function extractAfter(value: string, pattern: RegExp): string {
  return value.split(pattern).pop()?.trim().replace(/^を/, "") ?? "";
}
