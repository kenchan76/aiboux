export type MailPrivacyCategory = "business" | "private";

export interface MailPrivacyClassification {
  category: MailPrivacyCategory;
  confidence: number;
  reasons: string[];
  silo: "core_linked" | "private_isolated";
  summaryForVoice: string;
  replyDraftPreview?: string;
  coreCandidate?: string;
}

export interface VoiceReplyDraft {
  cleanedInstruction: string;
  subject: string;
  body: string;
  approvalRequired: true;
  safetyNotes: string[];
}

const businessSignals = [
  "株式会社",
  "有限会社",
  "合同会社",
  "御中",
  "お世話になっております",
  "請求",
  "見積",
  "注文",
  "納品",
  "契約",
  "支払",
  "発注",
  "納期",
  "部署",
  "営業部",
  "経理部",
  "代表取締役",
  "invoice",
  "order",
  "quotation",
];

const privateSignals = [
  "ホテル",
  "予約",
  "レシート",
  "領収書",
  "ご家族",
  "ポイント",
  "クーポン",
  "ファストフード",
  "サウナ",
  "旅行",
  "個人",
];

const fillerPattern = /\b(えーと|えっと|あの|その|うーん|うんと|なんか|まあ|ちょっと)\b/g;

export function classifyMailPrivacy(input: {
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string[];
}): MailPrivacyClassification {
  const text = [input.senderName, input.senderEmail, input.subject, input.body.join("\n")].join("\n").toLowerCase();
  const matchedBusinessSignals = businessSignals.filter((signal) => text.includes(signal.toLowerCase()));
  const matchedPrivateSignals = privateSignals.filter((signal) => text.includes(signal.toLowerCase()));
  const hasCorporateDomain = /\.(co\.jp|or\.jp|ne\.jp|biz|inc|corp)\b/i.test(input.senderEmail);
  const businessScore = matchedBusinessSignals.length * 18 + (hasCorporateDomain ? 18 : 0);
  const privateScore = matchedPrivateSignals.length * 20;
  const category: MailPrivacyCategory = businessScore >= Math.max(32, privateScore + 10) ? "business" : "private";
  const confidence = Math.min(96, Math.max(58, category === "business" ? businessScore + 45 : privateScore + 52));
  const reasons =
    category === "business"
      ? [...matchedBusinessSignals.slice(0, 3), ...(hasCorporateDomain ? ["法人系ドメイン"] : [])]
      : matchedPrivateSignals.slice(0, 3);
  const fallbackReason = category === "business" ? "業務語彙を検知" : "業務シグナルなし";

  return {
    category,
    confidence,
    reasons: reasons.length > 0 ? reasons : [fallbackReason],
    silo: category === "business" ? "core_linked" : "private_isolated",
    summaryForVoice:
      category === "business"
        ? buildBusinessVoiceSummary(input.subject, input.body)
        : "業務シグナルがないため、Core連携から隔離します。",
    replyDraftPreview:
      category === "business"
        ? "内容を確認し、期日や番号を照合のうえ返信する下書きを作成できます。"
        : undefined,
    coreCandidate: category === "business" ? extractCompanyCandidate(input.senderName, input.body.join("\n")) : undefined,
  };
}

export function createVoiceReplyDraft(input: {
  spokenText: string;
  recipientName?: string;
  subject?: string;
  contextSummary?: string;
}): VoiceReplyDraft {
  const cleanedInstruction = normalizeSpeech(input.spokenText);
  const recipient = input.recipientName?.trim() || "ご担当者";
  const subjectBase = input.subject?.trim() || "ご連絡の件";
  const context = input.contextSummary?.trim();
  const correctedDate = extractCorrectedDate(cleanedInstruction);
  const dateLine = correctedDate ? `\n\nなお、日程は${correctedDate}として確認いたしました。` : "";

  return {
    cleanedInstruction,
    subject: `Re: ${subjectBase}`,
    body: `${recipient} 様\n\nいつもお世話になっております。\n\nご連絡ありがとうございます。${context ? `\n${context}` : ""}${dateLine}\n\n内容を確認のうえ、必要事項を整理して対応いたします。\n\n引き続きよろしくお願いいたします。`,
    approvalRequired: true,
    safetyNotes: [
      "AIは下書き作成までです。",
      "外部送信は人間の送信ボタン承認後に限定します。",
      "宛先、金額、期日は送信前に確認してください。",
    ],
  };
}

function normalizeSpeech(value: string): string {
  return value
    .replace(fillerPattern, "")
    .replace(/(、|,)?\s*(あ、ごめん|ごめん|いや|違う|訂正)\s*/g, "。訂正: ")
    .replace(/\s+/g, " ")
    .replace(/。{2,}/g, "。")
    .trim();
}

function extractCorrectedDate(value: string): string | null {
  const correctionMatch = value.match(/訂正:\s*([^。]+?)(です|で|に|。|$)/);
  if (correctionMatch) return correctionMatch[1].trim();
  const relativeMatch = value.match(/(明後日|明日|来週[^\s。]*)/);
  return relativeMatch?.[1] ?? null;
}

function buildBusinessVoiceSummary(subject: string, body: string[]): string {
  const text = [subject, ...body].join(" ");
  const invoice = text.match(/[A-Z]{2,5}-\d{4}-\d{3,6}/)?.[0];
  const amount = text.match(/\d{1,3}(,\d{3})*円/)?.[0];
  const dueDate = text.match(/20\d{2}[/-]\d{1,2}[/-]\d{1,2}/)?.[0];
  const details = [invoice && `番号 ${invoice}`, amount && `金額 ${amount}`, dueDate && `期日 ${dueDate}`].filter(Boolean);

  return details.length > 0
    ? `業務メールです。${details.join("、")}を確認してください。`
    : "業務メールです。本文と添付を確認し、返信下書き候補を作成できます。";
}

function extractCompanyCandidate(senderName: string, body: string): string | undefined {
  const text = `${senderName}\n${body}`;
  return text.match(/(?:株式会社|有限会社|合同会社)[^\s　、。]+/)?.[0] ?? (senderName || undefined);
}
