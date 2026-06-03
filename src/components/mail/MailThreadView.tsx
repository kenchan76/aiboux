"use client";

import * as React from "react";
import { ArrowLeft, ChevronDown, Image as ImageIcon, Link2, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CopyableEmail } from "@/components/mail/CopyableEmail";
import { MailAttachmentCard } from "@/components/mail/MailAttachmentCard";
import { MailThreadHeader } from "@/components/mail/MailThreadHeader";
import type { HtmlMailPreview, MailMessage, MailThreadEntry } from "@/data/mail-sample-data";

interface MailThreadViewProps {
  message?: MailMessage;
  onBack?: () => void;
  onStar: (messageId: string) => void;
  onCompose?: () => void;
}

function sanitizeMailText(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\uFFFD/g, "");
}

function MailParagraphs({ body }: { body: string[] }) {
  return (
    <div className="space-y-3 text-[13px] leading-6 text-neutral-900 [font-variant-ligatures:none]">
      {body.map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 20)}`} className="whitespace-pre-wrap break-words">
          {sanitizeMailText(paragraph)}
        </p>
      ))}
    </div>
  );
}

function HtmlPreview({ preview }: { preview: HtmlMailPreview }) {
  return (
    <section className="mt-4 overflow-hidden border border-neutral-200 bg-white">
      <div className="flex items-center gap-2 border-b border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700">
        <Table2 className="size-4 text-neutral-500" />
        {sanitizeMailText(preview.title)}
      </div>
      <div className="flex min-h-24 items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded border border-neutral-300 bg-white">
          <ImageIcon className="size-5 text-neutral-500" />
        </div>
        <div>
          <div className="text-xs font-medium text-neutral-900">インライン画像領域</div>
          <div className="mt-1 text-[11px] text-neutral-500">{sanitizeMailText(preview.heroAlt)}</div>
        </div>
      </div>
      <table className="w-full border-collapse text-left text-xs">
        <tbody>
          {preview.rows.map((row) => (
            <tr key={row.label} className="border-b border-neutral-200 last:border-b-0">
              <th className="w-32 bg-neutral-50 px-3 py-2 font-medium text-neutral-600">{sanitizeMailText(row.label)}</th>
              <td className="px-3 py-2 text-neutral-900">{sanitizeMailText(row.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-neutral-200 px-3 py-2 text-[11px] text-neutral-500">{sanitizeMailText(preview.footnote)}</p>
    </section>
  );
}

function ThreadConversation({ entries }: { entries: MailThreadEntry[] }) {
  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <article key={entry.id} className="border-t border-neutral-200 pt-4 first:border-t-0 first:pt-0">
          <header className="mb-2 flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-neutral-950">{sanitizeMailText(entry.senderName)}</div>
              <CopyableEmail email={entry.senderEmail} className="text-[11px] text-neutral-500" />
            </div>
            <div className="text-[11px] text-neutral-500">{sanitizeMailText(entry.sentAt)}</div>
          </header>
          <div>
            <MailParagraphs body={entry.body} />
            {entry.quoted && entry.quoted.length > 0 ? (
              <details className="mt-3 border border-neutral-200 bg-neutral-50" open={!entry.collapsed && index === entries.length - 1}>
                <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-700 marker:hidden">
                  <ChevronDown className="size-3.5 text-neutral-500" />
                  引用を表示
                </summary>
                <div className="border-t border-neutral-200 px-3 py-2 text-xs leading-6 text-neutral-600">
                  {entry.quoted.map((line, lineIndex) => (
                    <p key={`${entry.id}-quote-${lineIndex}`} className="whitespace-pre-wrap border-l-2 border-neutral-300 pl-2">
                      {sanitizeMailText(line)}
                    </p>
                  ))}
                </div>
              </details>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

function AttachmentBlock({ message }: { message: MailMessage }) {
  if (message.attachments.length === 0) return null;

  return (
    <section className="border-t border-neutral-200 pt-3">
      <div className="grid gap-2 xl:grid-cols-2">
        {message.attachments.map((attachment) => (
          <MailAttachmentCard key={attachment.id} attachment={attachment} />
        ))}
      </div>
    </section>
  );
}

export function MailThreadView({ message, onBack, onStar, onCompose }: MailThreadViewProps) {
  const touchStart = React.useRef<{ x: number; y: number } | null>(null);

  function handleTouchStart(event: React.TouchEvent<HTMLElement>) {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLElement>) {
    if (!onBack || !touchStart.current || typeof window === "undefined" || window.innerWidth >= 768) {
      touchStart.current = null;
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (deltaX < -64 && Math.abs(deltaY) < 48) {
      onBack();
    }
  }

  if (!message) {
    return (
      <section className="hidden min-h-0 flex-1 items-center justify-center bg-white p-8 text-center md:flex">
        <div>
          <div className="mx-auto flex size-12 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50">
            <Link2 className="size-5 text-neutral-500" />
          </div>
          <h2 className="mt-3 text-sm font-medium text-neutral-950">メールを選択してください</h2>
          <p className="mt-1 max-w-sm text-xs text-neutral-500">左の一覧からメールを選ぶと、本文と添付ファイルが表示されます。</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-white" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-neutral-200 px-3 md:hidden">
        <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="メール一覧へ戻る">
          <ArrowLeft className="size-4" />
        </Button>
        <span className="truncate text-sm font-medium">{sanitizeMailText(message.subject)}</span>
      </div>
      <MailThreadHeader message={message} onStar={() => onStar(message.id)} onCompose={onCompose} />
      <ScrollArea className="min-h-0 flex-1">
        <div className="px-4 py-4 md:px-6">
          <section className="space-y-4">
            {message.thread ? <ThreadConversation entries={message.thread} /> : <MailParagraphs body={message.body} />}
            {message.htmlPreview ? <HtmlPreview preview={message.htmlPreview} /> : null}
            <AttachmentBlock message={message} />
          </section>
        </div>
      </ScrollArea>
    </section>
  );
}
