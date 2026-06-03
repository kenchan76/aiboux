export interface SendMailInput {
  to: string | EmailAddress | (string | EmailAddress)[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string | EmailAddress;
}

export async function sendSystemMail(
  env: Pick<Cloudflare.Env, 'EMAIL' | 'DEFAULT_FROM_EMAIL'>,
  input: SendMailInput,
): Promise<EmailSendResult> {
  return env.EMAIL.send({
    from: env.DEFAULT_FROM_EMAIL,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    replyTo: input.replyTo,
    headers: {
      'X-AIBOUX-Mailer': 'edge',
    },
  });
}
