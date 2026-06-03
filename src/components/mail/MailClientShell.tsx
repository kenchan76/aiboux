"use client";

import * as React from "react";
import { Bot } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { MailAIAssistantPanel } from "@/components/ai/MailAIAssistantPanel";
import { ComposeDialog } from "@/components/mail/ComposeDialog";
import { MailList } from "@/components/mail/MailList";
import { MailSettingsPanel } from "@/components/mail/MailSettingsPanel";
import { MailSidebar } from "@/components/mail/MailSidebar";
import { MailThreadView } from "@/components/mail/MailThreadView";
import { MailTopbar } from "@/components/mail/MailTopbar";
import { TemplateManager } from "@/components/mail/TemplateManager";
import {
  mailMessages,
  mailboxes,
  type MailMessage,
  type MailboxId,
} from "@/data/mail-sample-data";
import { cn } from "@/lib/utils";

interface MailClientShellProps {
  initialMailbox?: MailboxId;
}

function getMailboxPath(mailbox: MailboxId, basePath: string) {
  if (mailbox === "inbox") return basePath;
  return `${basePath}/${mailbox}`;
}

function getMailBasePath() {
  if (typeof window === "undefined") return "/mail";
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts[0] === "s" && parts[1]) return `/s/${encodeURIComponent(decodeURIComponent(parts[1]))}`;
  return "/mail";
}

function isMailboxId(value: string): value is MailboxId {
  return ["inbox", "unread", "starred", "snoozed", "sent", "drafts", "templates", "archive", "trash", "spam", "settings"].includes(value);
}

export function MailClientShell({ initialMailbox = "inbox" }: MailClientShellProps) {
  const [messages, setMessages] = React.useState<MailMessage[]>(mailMessages);
  const [activeMailbox, setActiveMailbox] = React.useState<MailboxId>(initialMailbox);
  const [selectedMessageId, setSelectedMessageId] = React.useState(mailMessages[0]?.id);
  const [selectedMessageIds, setSelectedMessageIds] = React.useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = React.useState("");
  const [quickFilter, setQuickFilter] = React.useState<MailQuickFilter | null>(null);
  const [viewMode, setViewMode] = React.useState<MailViewMode>("split");
  const [composeOpen, setComposeOpen] = React.useState(false);
  const [mobileThreadOpen, setMobileThreadOpen] = React.useState(false);
  const [aiOpen, setAIOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const selectedMessage = messages.find((message) => message.id === selectedMessageId);

  const activeTitle = mailboxes.find((box) => box.id === activeMailbox)?.label ?? "受信トレイ";

  function getMessageTime(message: MailMessage) {
    return Number(message.receivedDate.replace(/\D/g, ""));
  }

  const visibleMessages = React.useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filtered = messages.filter((message) => {
      const mailboxMatch =
        activeMailbox === "starred"
          ? message.starred
          : activeMailbox === "unread"
            ? message.unread
          : activeMailbox === "templates" || activeMailbox === "settings"
            ? false
            : message.mailbox === activeMailbox;
      if (!mailboxMatch) return false;
      if (!normalizedQuery) return true;
      const haystack = [
        message.senderName,
        message.senderEmail,
        message.subject,
        message.snippet,
        message.body.join(" "),
        message.labels.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    }).filter((message) => {
      if (quickFilter === "unread") return message.unread;
      if (quickFilter === "attachments") return message.attachments.length > 0;
      if (quickFilter === "noAttachments") return message.attachments.length === 0;
      if (quickFilter === "important") return message.important || message.starred;
      if (quickFilter === "pending") return message.unread || message.labels.includes("要対応");
      return true;
    });

    if (quickFilter === "unreadFirst") {
      return [...filtered].sort((a, b) => Number(b.unread) - Number(a.unread) || getMessageTime(b) - getMessageTime(a));
    }
    if (quickFilter === "newest") {
      return [...filtered].sort((a, b) => getMessageTime(b) - getMessageTime(a));
    }
    return filtered;
  }, [activeMailbox, messages, quickFilter, searchQuery]);

  React.useEffect(() => {
    if (activeMailbox === "templates" || activeMailbox === "settings") return;
    if (!visibleMessages.some((message) => message.id === selectedMessageId)) {
      setSelectedMessageId(visibleMessages[0]?.id);
    }
  }, [activeMailbox, selectedMessageId, visibleMessages]);

  React.useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key.toLowerCase() === "c") {
        event.preventDefault();
        setComposeOpen(true);
      }
      if (event.key.toLowerCase() === "e" && selectedMessageId) {
        event.preventDefault();
        archiveSelected([selectedMessageId]);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [selectedMessageId]);

  function changeMailbox(mailbox: MailboxId) {
    setActiveMailbox(mailbox);
    setSelectedMessageIds(new Set());
    setMobileThreadOpen(false);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", getMailboxPath(mailbox, getMailBasePath()));
    }
  }

  function selectMessage(messageId: string) {
    setSelectedMessageId(messageId);
    if (viewMode === "compact") setViewMode("split");
    setMobileThreadOpen(true);
    setMessages((current) =>
      current.map((message) => (message.id === messageId ? { ...message, unread: false } : message))
    );
  }

  function setMessageChecked(messageId: string, checked: boolean) {
    setSelectedMessageIds((current) => {
      const next = new Set(current);
      if (checked) next.add(messageId);
      else next.delete(messageId);
      return next;
    });
  }

  function selectAllVisible(checked: boolean) {
    setSelectedMessageIds(checked ? new Set(visibleMessages.map((message) => message.id)) : new Set());
  }

  function refresh() {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      toast.success("メール一覧を更新しました");
    }, 450);
  }

  function archiveSelected(ids = Array.from(selectedMessageIds)) {
    if (ids.length === 0) {
      toast.error("処理対象のメールを選択してください");
      return;
    }
    setMessages((current) =>
      current.map((message) => (ids.includes(message.id) ? { ...message, mailbox: "archive" } : message))
    );
    setSelectedMessageIds(new Set());
    toast.success(`${ids.length}件をアーカイブしました`);
  }

  function deleteSelected() {
    const ids = Array.from(selectedMessageIds);
    if (ids.length === 0) {
      toast.error("削除するメールを選択してください");
      return;
    }
    setMessages((current) =>
      current.map((message) => (ids.includes(message.id) ? { ...message, mailbox: "trash" } : message))
    );
    setSelectedMessageIds(new Set());
    toast.success(`${ids.length}件をゴミ箱へ移動しました`);
  }

  function markSelectedRead() {
    const ids = Array.from(selectedMessageIds);
    if (ids.length === 0) {
      toast.error("既読にするメールを選択してください");
      return;
    }
    setMessages((current) =>
      current.map((message) => (ids.includes(message.id) ? { ...message, unread: false } : message))
    );
    toast.success(`${ids.length}件を既読にしました`);
  }

  function toggleStar(messageId: string) {
    setMessages((current) =>
      current.map((message) => (message.id === messageId ? { ...message, starred: !message.starred } : message))
    );
  }

  function renderWorkspace() {
    if (activeMailbox === "templates") {
      return <TemplateManager />;
    }
    if (activeMailbox === "settings") {
      return <MailSettingsPanel />;
    }

    return (
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="hidden min-h-0 flex-1 overflow-hidden md:flex">
          <div className={cn("h-full min-h-0 shrink-0 border-r border-neutral-200 bg-white", viewMode === "compact" ? "w-full" : "w-[270px] lg:w-[390px] xl:w-[460px]")}>
            <MailList
              mailbox={activeMailbox}
              title={activeTitle}
              messages={visibleMessages}
              viewMode={viewMode}
              selectedMessageId={selectedMessageId}
              selectedMessageIds={selectedMessageIds}
              loading={loading}
              onMessageSelect={selectMessage}
              onMessageChecked={setMessageChecked}
              onSelectAll={selectAllVisible}
              onRefresh={refresh}
              onArchive={() => archiveSelected()}
              onDelete={deleteSelected}
              onMarkRead={markSelectedRead}
              onStar={toggleStar}
              onCompose={() => setComposeOpen(true)}
            />
          </div>
          {viewMode === "split" ? <MailThreadView message={selectedMessage} onStar={toggleStar} onCompose={() => setComposeOpen(true)} /> : null}
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden md:hidden">
          <div className={cn("h-full min-h-0 flex-1", mobileThreadOpen && "hidden")}>
            <MailList
              mailbox={activeMailbox}
              title={activeTitle}
              messages={visibleMessages}
              viewMode="split"
              selectedMessageId={selectedMessageId}
              selectedMessageIds={selectedMessageIds}
              loading={loading}
              onMessageSelect={selectMessage}
              onMessageChecked={setMessageChecked}
              onSelectAll={selectAllVisible}
              onRefresh={refresh}
              onArchive={() => archiveSelected()}
              onDelete={deleteSelected}
              onMarkRead={markSelectedRead}
              onStar={toggleStar}
              onCompose={() => setComposeOpen(true)}
            />
          </div>
          <div className={cn("min-h-0 flex-1", !mobileThreadOpen && "hidden")}>
            <MailThreadView
              message={selectedMessage}
              onBack={() => setMobileThreadOpen(false)}
              onStar={toggleStar}
              onCompose={() => setComposeOpen(true)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={120}>
      <SidebarProvider defaultOpen style={{ "--sidebar-width": "14rem" } as React.CSSProperties}>
        <div className="flex h-dvh w-full overflow-hidden bg-white text-neutral-950">
          <MailSidebar activeMailbox={activeMailbox} onMailboxChange={changeMailbox} />
          <SidebarInset className="min-w-0 bg-white">
            <MailTopbar
              activeMailbox={activeMailbox}
              searchQuery={searchQuery}
              quickFilter={quickFilter}
              onSearchChange={setSearchQuery}
              onQuickFilterChange={setQuickFilter}
              onMailboxChange={changeMailbox}
            />
            <div className="flex min-h-0 flex-1">
              <main className="flex min-w-0 flex-1 flex-col overflow-hidden">{renderWorkspace()}</main>
            </div>
          </SidebarInset>

          <MailAIAssistantPanel
            message={selectedMessage}
            open={aiOpen}
            onOpenChange={setAIOpen}
          />
          {!aiOpen ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="fixed z-40 size-16 rounded-full border border-blue-300 bg-white p-0 text-blue-700 shadow-lg shadow-blue-100/90 hover:border-blue-400 hover:bg-blue-50 focus-visible:ring-4 focus-visible:ring-blue-100 [bottom:calc(env(safe-area-inset-bottom)_+_18px)] [right:calc(env(safe-area-inset-right)_+_18px)]"
                  variant="outline"
                  onClick={() => setAIOpen(true)}
                  aria-label="AI Assistantを開く"
                >
                  <Bot className="size-7" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>AI Assistantを開く</TooltipContent>
            </Tooltip>
          ) : null}

          <ComposeDialog open={composeOpen} onOpenChange={setComposeOpen} />
          <Toaster position="top-right" richColors className="z-[80]" />
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export function resolveMailboxFromPath(pathname: string): MailboxId {
  const part = pathname.split("/").filter(Boolean).pop() ?? "inbox";
  return isMailboxId(part) ? part : "inbox";
}

export type MailQuickFilter = "unread" | "newest" | "unreadFirst" | "attachments" | "noAttachments" | "important" | "pending";
export type MailViewMode = "split" | "compact";
