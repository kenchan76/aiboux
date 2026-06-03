"use client";

import type { ReactNode } from "react";
import { Archive, Clock3, MailOpen, MoreHorizontal, PenLine, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface MailToolbarProps {
  checked: boolean;
  selectedCount: number;
  onSelectAll: (checked: boolean) => void;
  onRefresh: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onMarkRead: () => void;
  onCompose: () => void;
}

export function MailToolbar({
  checked,
  selectedCount,
  onSelectAll,
  onRefresh,
  onArchive,
  onDelete,
  onMarkRead,
  onCompose,
}: MailToolbarProps) {
  return (
    <div className="flex h-10 shrink-0 items-center gap-1 border-b border-neutral-200 bg-white px-2">
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onSelectAll(value === true)}
        aria-label="メールをすべて選択"
      />
      <Separator orientation="vertical" className="mx-1 h-5" />
      <ToolbarButton label="更新" onClick={onRefresh}>
        <RefreshCw className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="アーカイブ" onClick={onArchive}>
        <Archive className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="削除" onClick={onDelete}>
        <Trash2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="既読にする" onClick={onMarkRead}>
        <MailOpen className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="スヌーズ" onClick={() => toast.info("選択したメールを後で表示します")}>
        <Clock3 className="size-4" />
      </ToolbarButton>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="border border-neutral-200 bg-white" aria-label="その他の操作">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>その他</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => toast.info("選択したメールにスターを付けます")}>スターを付ける</DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.info("選択したメールを重要として扱います")}>重要としてマーク</DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.info("ラベル編集を開きます")}>ラベルを変更</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => toast.info("迷惑メール報告の確認を開きます")}>迷惑メールとして報告</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="min-w-0 flex-1 text-xs text-neutral-500">
        {selectedCount > 0 ? `${selectedCount}件選択中` : null}
      </div>
      <Button onClick={onCompose} className="h-8 shrink-0 gap-1.5 rounded-md px-2 text-xs">
        <PenLine className="size-4" />
        <span>新規作成</span>
      </Button>
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="border border-neutral-200 bg-white" aria-label={label} onClick={onClick}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
