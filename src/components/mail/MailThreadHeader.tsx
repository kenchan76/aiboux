"use client";

import { Forward, MoreHorizontal, Reply, ReplyAll, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CopyableEmail } from "@/components/mail/CopyableEmail";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { MailMessage } from "@/data/mail-sample-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MailThreadHeaderProps {
  message: MailMessage;
  onStar: () => void;
  onCompose?: () => void;
}

export function MailThreadHeader({ message, onStar, onCompose }: MailThreadHeaderProps) {
  function openCompose(label: string) {
    onCompose?.();
    toast.info(`${label}の作成画面を開きました`);
  }

  return (
    <div className="border-b border-neutral-200 bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="break-words text-base font-semibold leading-snug tracking-tight text-neutral-950 lg:text-lg">{message.subject}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="スター" onClick={onStar}>
                <Star className={cn("size-4", message.starred && "fill-amber-400 text-amber-500")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>スター</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="返信" onClick={() => openCompose("返信")}>
                <Reply className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>返信</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="全員に返信" onClick={() => openCompose("全員に返信")}>
                <ReplyAll className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>全員に返信</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="転送" onClick={() => openCompose("転送")}>
                <Forward className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>転送</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="その他">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.info("テンプレート候補を作成しました")}>テンプレート化</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("連絡先候補に追加しました")}>連絡先候補に追加</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>迷惑メールとして報告</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Avatar className="size-9">
          <AvatarFallback>{message.senderName.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-neutral-950">{message.senderName}</span>
            <CopyableEmail email={message.senderEmail} showBrackets className="text-xs text-neutral-500" />
          </div>
          <div className="flex flex-wrap items-center gap-1 text-xs text-neutral-500">
            <span>宛先:</span>
            {message.to.map((email, index) => (
              <span key={email} className="inline-flex items-center gap-1">
                {index > 0 ? <span>,</span> : null}
                <CopyableEmail email={email} className="text-xs text-neutral-500" />
              </span>
            ))}
            <span>・ {message.receivedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
