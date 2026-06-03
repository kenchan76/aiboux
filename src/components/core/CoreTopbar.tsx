import { useState } from "react";
import { Bell, ChevronDown, CircleHelp, Menu, Search, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CoreSidebar } from "@/components/core/CoreSidebar";
import type { CoreView } from "@/data/core-sample-data";

interface CoreTopbarProps {
  activeView: CoreView;
  title: string;
  onToggleAssistant: () => void;
}

const searchItems = [
  "株式会社サンプル",
  "INV-2024-1008",
  "ORD-2024-1007",
  "ワイヤレスイヤホン EAR-001",
  "USB-Cケーブル CAB-001",
  "北海原材料卸",
];

export function CoreTopbar({ activeView, title: _title, onToggleAssistant }: CoreTopbarProps) {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-neutral-200 bg-white/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] p-0">
          <SheetTitle className="sr-only">aiboux Core menu</SheetTitle>
          <CoreSidebar activeView={activeView} mode="drawer" />
        </SheetContent>
      </Sheet>

      <button
        data-testid="core-top-search"
        type="button"
        onClick={() => setCommandOpen(true)}
        className="ml-0 flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-left text-sm text-neutral-500 shadow-sm transition-colors hover:bg-neutral-50 md:ml-4 md:max-w-[650px]"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="truncate sm:hidden">検索</span>
        <span className="hidden truncate sm:inline">取引先・書類番号・商品名で検索...</span>
        <kbd className="ml-auto hidden rounded border bg-neutral-50 px-1.5 py-0.5 text-[11px] text-neutral-500 sm:inline-flex">
          ⌘ K
        </kbd>
      </button>

      <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogContent className="top-[20%] max-w-xl translate-y-0 p-0">
          <DialogTitle className="sr-only">Global Search</DialogTitle>
          <DialogDescription className="sr-only">取引先、書類番号、商品名を検索します。</DialogDescription>
          <Command>
            <CommandInput placeholder="取引先・書類番号・商品名で検索..." />
            <CommandList>
              <CommandEmpty>該当する項目がありません。</CommandEmpty>
              <CommandGroup heading="候補">
                {searchItems.map((item) => (
                  <CommandItem key={item} value={item} onSelect={() => setCommandOpen(false)}>
                    <Search className="mr-2 h-4 w-4" />
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="ショートカット">
                <CommandItem value="invoice-new" onSelect={() => (window.location.href = "/core/invoices/new")}>
                  請求書を新規作成
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      <div className="ml-auto flex items-center gap-1">
        {activeView === "deliveries" ? null : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleAssistant}>
                <Sparkles className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>AI Assistant</TooltipContent>
          </Tooltip>
        )}
        <Button variant="ghost" size="icon" className="hidden h-8 w-8 sm:inline-flex">
          <Bell className="h-4 w-4" />
        </Button>
        <Button asChild variant="ghost" size="icon" className="hidden h-8 w-8 sm:inline-flex">
          <a href="/core/help" aria-label="ヘルプ・操作ガイド">
          <CircleHelp className="h-4 w-4" />
          </a>
        </Button>
        <div className="hidden sm:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="" alt="山田 太郎" />
                  <AvatarFallback className="text-xs">山田</AvatarFallback>
                </Avatar>
                <span className="hidden text-left text-xs leading-tight md:block">
                  <span className="block font-medium text-neutral-900">山田 太郎</span>
                  <span className="block text-neutral-500">管理者</span>
                </span>
                <ChevronDown className="hidden h-3.5 w-3.5 text-neutral-400 md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>山田 太郎</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>プロフィール</DropdownMenuItem>
              <DropdownMenuItem>通知設定</DropdownMenuItem>
              <DropdownMenuItem>ログアウト</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
