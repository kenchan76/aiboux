"use client";

import { Inbox } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { MailToolbar } from "@/components/mail/MailToolbar";
import { MailListItem } from "@/components/mail/MailListItem";
import { type MailMessage, type MailboxId } from "@/data/mail-sample-data";

interface MailListProps {
  mailbox: MailboxId;
  title: string;
  messages: MailMessage[];
  viewMode: "split" | "compact";
  selectedMessageId?: string;
  selectedMessageIds: Set<string>;
  loading?: boolean;
  onMessageSelect: (messageId: string) => void;
  onMessageChecked: (messageId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onRefresh: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onMarkRead: () => void;
  onStar: (messageId: string) => void;
  onCompose: () => void;
}

export function MailList({
  title,
  messages,
  viewMode,
  selectedMessageId,
  selectedMessageIds,
  loading,
  onMessageSelect,
  onMessageChecked,
  onSelectAll,
  onRefresh,
  onArchive,
  onDelete,
  onMarkRead,
  onStar,
  onCompose,
}: MailListProps) {
  const allSelected = messages.length > 0 && messages.every((message) => selectedMessageIds.has(message.id));
  const unreadCount = messages.filter((message) => message.unread).length;

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-r border-neutral-200 bg-white">
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-neutral-200 px-3">
        <h1 className="truncate text-sm font-semibold tracking-tight text-neutral-950">{title}</h1>
        <div className="ml-auto shrink-0 text-[11px] font-medium text-neutral-500">
          未読 {unreadCount} / {messages.length}
        </div>
      </div>
      <MailToolbar
        checked={allSelected}
        selectedCount={selectedMessageIds.size}
        onSelectAll={onSelectAll}
        onRefresh={onRefresh}
        onArchive={onArchive}
        onDelete={onDelete}
        onMarkRead={onMarkRead}
        onCompose={onCompose}
      />
      <ScrollArea className="min-h-0 flex-1 overflow-hidden">
        {loading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="rounded-md border border-neutral-100 p-2">
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="mt-2 h-3 w-4/5" />
                <Skeleton className="mt-2 h-3 w-2/5" />
              </div>
            ))}
          </div>
        ) : messages.length > 0 ? (
          <div>
            {messages.map((message) => (
              <MailListItem
                key={message.id}
                message={message}
                viewMode={viewMode}
                active={message.id === selectedMessageId}
                selected={selectedMessageIds.has(message.id)}
                onSelect={() => onMessageSelect(message.id)}
                onCheckedChange={(checked) => onMessageChecked(message.id, checked)}
                onStar={() => onStar(message.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50">
              <Inbox className="size-5 text-neutral-500" />
            </div>
            <div className="mt-3 text-sm font-medium text-neutral-900">このボックスにメールはありません</div>
            <p className="mt-1 max-w-xs text-xs text-neutral-500">検索条件またはラベルを変更すると、該当メールが表示されます。</p>
          </div>
        )}
      </ScrollArea>
    </section>
  );
}
