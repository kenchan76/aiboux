export interface EmailNotificationPayload {
  subject?: string | null;
  body?: string | null;
  from?: string | null;
  to?: string | string[] | null;
  messageId?: string | null;
}

export interface NotificationDispatch {
  channel: 'web_push';
  reason: 'otp' | 'reply_required';
  title: string;
  body: string;
  payload: {
    messageId: string | null;
    from: string | null;
    subject: string;
  };
}

export interface NotificationResult {
  muted: boolean;
  reason: 'mode_not_supported' | 'no_match' | 'otp' | 'reply_required';
  dispatches: NotificationDispatch[];
}

const OTP_PATTERN = /(認証コード|ワンタイム|OTP|verification|passcode)/iu;
const ACTION_PATTERN = /(\?|？|ご回答|期限|期日|対応をお願い)/u;

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function createDispatch(
  emailPayload: EmailNotificationPayload,
  reason: NotificationDispatch['reason'],
): NotificationDispatch {
  const subject = normalizeText(emailPayload.subject) || '(件名なし)';
  const from = normalizeText(emailPayload.from) || null;

  return {
    channel: 'web_push',
    reason,
    title: reason === 'otp' ? '認証コードを検知しました' : '返信が必要そうなメールです',
    body: subject,
    payload: {
      messageId: normalizeText(emailPayload.messageId) || null,
      from,
      subject,
    },
  };
}

export async function processNotification(
  emailPayload: EmailNotificationPayload,
  currentMode: string,
): Promise<NotificationResult> {
  if (currentMode !== 'otp_reply_only') {
    return {
      muted: true,
      reason: 'mode_not_supported',
      dispatches: [],
    };
  }

  const subject = normalizeText(emailPayload.subject);
  const body = normalizeText(emailPayload.body);
  const searchableText = `${subject}\n${body}`;

  if (OTP_PATTERN.test(searchableText)) {
    return {
      muted: false,
      reason: 'otp',
      dispatches: [createDispatch(emailPayload, 'otp')],
    };
  }

  if (ACTION_PATTERN.test(searchableText)) {
    return {
      muted: false,
      reason: 'reply_required',
      dispatches: [createDispatch(emailPayload, 'reply_required')],
    };
  }

  return {
    muted: true,
    reason: 'no_match',
    dispatches: [],
  };
}
