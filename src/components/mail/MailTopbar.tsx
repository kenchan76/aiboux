"use client";

import * as React from "react";
import { Bell, Filter, Search, Settings, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { mailboxes, mailMessages, type MailboxId } from "@/data/mail-sample-data";
import type { MailQuickFilter } from "@/components/mail/MailClientShell";
import { toast } from "sonner";

interface MailTopbarProps {
  activeMailbox: MailboxId;
  searchQuery: string;
  quickFilter: MailQuickFilter | null;
  onSearchChange: (query: string) => void;
  onQuickFilterChange: (filter: MailQuickFilter | null) => void;
  onMailboxChange: (mailbox: MailboxId) => void;
}

const quickFilters: Array<{ id: MailQuickFilter; label: string }> = [
  { id: "unread", label: "未読のみ" },
  { id: "newest", label: "新着順" },
  { id: "unreadFirst", label: "未読順" },
  { id: "attachments", label: "添付あり" },
  { id: "noAttachments", label: "添付なし" },
  { id: "important", label: "重要" },
  { id: "pending", label: "返信待ち" },
];

export function MailTopbar({
  activeMailbox,
  searchQuery,
  quickFilter,
  onSearchChange,
  onQuickFilterChange,
  onMailboxChange,
}: MailTopbarProps) {
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <header className="flex min-h-11 shrink-0 items-center gap-1.5 border-b border-neutral-200 bg-white px-2 py-1 sm:gap-2 sm:px-3">
      <SidebarTrigger aria-label="メールサイドバーを開く" className="size-8 md:hidden" />

      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverAnchor asChild>
          <div className="relative flex h-8 min-w-0 flex-1 items-center rounded-md border border-neutral-200 bg-white shadow-sm focus-within:border-blue-300 focus-within:ring-3 focus-within:ring-blue-100 md:h-9">
            <Search className="ml-2 size-4 shrink-0 text-neutral-500" />
            <Input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              onFocus={() => setFilterOpen(true)}
              placeholder="メールを検索"
              aria-label="メールを検索"
              className="h-7 min-w-0 border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0 md:h-8"
            />
            <kbd className="mr-1 hidden rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] text-neutral-500 lg:inline-flex">
              ⌘ K
            </kbd>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="mr-1" aria-label="検索フィルター">
                    <Filter className="size-4" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>検索条件</TooltipContent>
            </Tooltip>
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-[min(calc(100vw-1rem),34rem)] rounded-md border-neutral-200 bg-white p-2 shadow-sm"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-semibold text-neutral-900">検索フィルター</div>
              <p className="text-[11px] text-neutral-500">検索窓タップで絞り込みを切り替えます。</p>
            </div>
            <Button variant="ghost" size="icon-xs" aria-label="検索フィルターを閉じる" onClick={() => setFilterOpen(false)}>
              <X className="size-3.5" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickFilters.map((item) => (
              <Button
                key={item.id}
                variant={quickFilter === item.id ? "default" : "outline"}
                size="xs"
                className="rounded-full px-2.5"
                onClick={() => onQuickFilterChange(quickFilter === item.id ? null : item.id)}
              >
                {item.label}
              </Button>
            ))}
            {quickFilter ? (
              <Button variant="ghost" size="xs" className="rounded-full px-2.5 text-neutral-600" onClick={() => onQuickFilterChange(null)}>
                解除
              </Button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="お知らせ" onClick={() => toast.info("新しいお知らせはありません")}>
            <Bell className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>お知らせ</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="メール設定" onClick={() => onMailboxChange("settings")}>
            <Settings className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>設定</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 gap-1 rounded-md px-1.5 lg:h-9 lg:gap-2 lg:px-2" aria-label="アカウントメニュー">
            <Avatar className="size-7">
              <AvatarImage src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&h=80&fit=crop&crop=face" alt="山田 太郎" />
              <AvatarFallback>山田</AvatarFallback>
            </Avatar>
            <span className="hidden text-left text-xs leading-tight xl:block">
              <span className="block font-medium text-neutral-900">山田 太郎</span>
              <span className="block text-neutral-500">管理者</span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>アカウント</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>プロフィール</DropdownMenuItem>
          <DropdownMenuItem>プランと請求</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onMailboxChange("settings")}>メール設定</DropdownMenuItem>
          <DropdownMenuItem asChild><a href="https://docs.aiboux.com">ヘルプ</a></DropdownMenuItem>
          <DropdownMenuItem>ログアウト</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput
          placeholder="メールを検索（送信者、件名、本文、ラベル）"
          value={searchQuery}
          onValueChange={onSearchChange}
        />
        <CommandList>
          <CommandEmpty>一致するメールはありません。</CommandEmpty>
          <CommandGroup heading="メールボックス">
            {mailboxes.slice(0, 6).map((box) => (
              <CommandItem
                key={box.id}
                value={box.label}
                onSelect={() => {
                  onMailboxChange(box.id);
                  setCommandOpen(false);
                }}
              >
                <box.icon className="size-4" />
                {box.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="最近のメール">
            {mailMessages.slice(0, 5).map((message) => (
              <CommandItem
                key={message.id}
                value={`${message.senderName} ${message.subject}`}
                onSelect={() => {
                  onSearchChange(message.subject);
                  setCommandOpen(false);
                }}
              >
                <Search className="size-4" />
                <span className="truncate">{message.subject}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
