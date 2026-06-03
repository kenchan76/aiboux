"use client";

import { Paperclip, Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { MailMessage } from "@/data/mail-sample-data";
import { cn } from "@/lib/utils";

interface MailListItemProps {
  message: MailMessage;
  viewMode: "split" | "compact";
  active: boolean;
  selected: boolean;
  onSelect: () => void;
  onCheckedChange: (checked: boolean) => void;
  onStar: () => void;
}

export function MailListItem({
  message,
  viewMode,
  active,
  selected,
  onSelect,
  onCheckedChange,
  onStar,
}: MailListItemProps) {
  if (viewMode === "compact") {
    return (
      <div
        data-mail-list-item="true"
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect();
          }
        }}
        className={cn(
          "group flex h-10 cursor-pointer items-center gap-2 border-b border-neutral-100 px-2 outline-none transition hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-blue-200",
          active && "border-l-2 border-l-blue-600 bg-blue-50/70 pl-1.5 hover:bg-blue-50",
          !active && message.unread && "bg-white text-neutral-950",
          !active && !message.unread && "bg-neutral-50/35 text-neutral-600"
        )}
        aria-label={`${message.senderName} ${message.subject}`}
      >
        <div onClick={(event) => event.stopPropagation()} className="flex w-6 shrink-0 items-center">
          <Checkbox
            checked={selected}
            onCheckedChange={(value) => onCheckedChange(value === true)}
            aria-label={`${message.subject}を選択`}
          />
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onStar();
          }}
          className="flex w-6 shrink-0 items-center justify-center rounded-sm text-neutral-400 hover:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
          aria-label={message.starred ? "スターを外す" : "スターを付ける"}
        >
          <Star className={cn("size-4", message.starred && "fill-amber-400 text-amber-500")} />
        </button>
        <div className="flex min-w-0 shrink basis-[clamp(8rem,18vw,15rem)] items-center gap-1.5">
          {message.unread && <span className="size-2 shrink-0 rounded-full bg-blue-600" aria-label="未読" />}
          <span className={cn("truncate text-[13px]", message.unread && "font-semibold")}>{message.senderName}</span>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className={cn("min-w-0 max-w-[min(52%,36rem)] shrink truncate text-[13px]", message.unread ? "font-semibold" : "font-medium")}>{message.subject}</span>
          <span className="shrink-0 text-xs text-neutral-300">—</span>
          <span className="min-w-0 flex-1 truncate text-xs text-neutral-500">{message.snippet}</span>
          {message.attachments.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Paperclip className="size-3.5 shrink-0 text-neutral-400" />
              </TooltipTrigger>
              <TooltipContent>{message.attachments.length}件の添付</TooltipContent>
            </Tooltip>
          )}
        </div>
        <span className={cn("w-16 shrink-0 pr-1.5 text-right text-[11px]", message.unread ? "font-semibold text-neutral-950" : "text-neutral-500")}>
          {message.receivedAt}
        </span>
      </div>
    );
  }

  return (
    <div
      data-mail-list-item="true"
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "group grid cursor-pointer grid-cols-[20px_20px_1fr_auto] gap-2 border-b border-neutral-100 px-2 py-1.5 outline-none transition hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-blue-200",
        active && "border-l-2 border-l-blue-600 bg-blue-50/70 pl-1.5 hover:bg-blue-50",
        !active && message.unread && "bg-white text-neutral-950",
        !active && !message.unread && "bg-neutral-50/35 text-neutral-600"
      )}
      aria-label={`${message.senderName} ${message.subject}`}
    >
      <div onClick={(event) => event.stopPropagation()} className="flex items-center">
        <Checkbox
          checked={selected}
          onCheckedChange={(value) => onCheckedChange(value === true)}
          aria-label={`${message.subject}を選択`}
        />
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onStar();
        }}
        className="flex items-center justify-center rounded-sm text-neutral-400 hover:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        aria-label={message.starred ? "スターを外す" : "スターを付ける"}
      >
        <Star className={cn("size-4", message.starred && "fill-amber-400 text-amber-500")} />
      </button>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          {message.unread && <span className="size-2 rounded-full bg-blue-600" aria-label="未読" />}
          <span className={cn("truncate text-[13px]", message.unread && "font-semibold")}>{message.senderName}</span>
          {message.attachments.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Paperclip className="size-3.5 shrink-0 text-neutral-400" />
              </TooltipTrigger>
              <TooltipContent>{message.attachments.length}件の添付</TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
          <span className={cn("truncate text-[13px]", message.unread ? "font-semibold" : "font-medium")}>
            {message.subject}
          </span>
        </div>
        <div className="mt-0.5 truncate text-xs text-neutral-500">{message.snippet}</div>
      </div>

      <div className="flex min-w-[42px] flex-col items-end gap-1 text-right">
        <span className={cn("text-[11px]", message.unread ? "font-semibold text-neutral-950" : "text-neutral-500")}>
          {message.receivedAt}
        </span>
      </div>
    </div>
  );
}
