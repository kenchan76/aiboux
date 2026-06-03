"use client";

import * as React from "react";
import { AppWindow, Bell, CalendarDays, HelpCircle, Search, SlidersHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { shopNavItems, shopOrders, shopProducts, type ShopSection } from "@/data/shop-sample-data";

interface ShopTopbarProps {
  activeSection: ShopSection;
  searchQuery: string;
  dateRange: string;
  onSearchChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
  onSectionChange: (section: ShopSection) => void;
}

export function ShopTopbar({
  activeSection,
  searchQuery,
  dateRange,
  onSearchChange,
  onDateRangeChange,
  onSectionChange,
}: ShopTopbarProps) {
  const [commandOpen, setCommandOpen] = React.useState(false);
  const label = shopNavItems.find((item) => item.id === activeSection)?.label ?? "ダッシュボード";

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
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-neutral-200 bg-white px-3">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger aria-label="SHOPサイドバーを開く" />
        <a href="/shop" className="flex items-center gap-1.5" aria-label="aiboux SHOP">
          <img src="/brand/aiboux-logo.svg" alt="aiboux" className="h-5 w-auto" />
          <Badge variant="secondary" className="h-5 rounded-md px-1.5 text-[10px] font-semibold tracking-wide">
            SHOP
          </Badge>
        </a>
      </div>
      <div className="hidden min-w-[170px] items-center gap-1 text-sm text-neutral-600 md:flex">
        <span>Shop</span>
        <span className="text-neutral-300">/</span>
        <span className="font-medium text-neutral-950">{label}</span>
      </div>
      <button
        type="button"
        onClick={() => setCommandOpen(true)}
        className="flex h-9 min-w-0 flex-1 items-center rounded-lg border border-neutral-200 bg-white px-2.5 text-left text-sm text-neutral-500 shadow-sm hover:bg-neutral-50 sm:px-3"
        aria-label="ストア検索を開く"
      >
        <Search className="mr-2 size-4" />
        <span className="truncate">{searchQuery || "ストア内を検索（注文、商品、顧客など）"}</span>
        <kbd className="ml-auto hidden rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] sm:inline-flex">
          ⌘ K
        </kbd>
      </button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="hidden gap-2 md:inline-flex">
            <CalendarDays className="size-4" />
            {dateRange}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-3">
          <Calendar mode="single" selected={new Date(2024, 4, 19)} />
          <div className="mt-2 grid grid-cols-2 gap-2">
            {["今日", "今週", "今月", "前月"].map((range) => (
              <Button key={range} variant="outline" size="sm" onClick={() => onDateRangeChange(range)}>
                {range}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="hidden sm:inline-flex" aria-label="フィルター" onClick={() => setCommandOpen(true)}>
            <SlidersHorizontal className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>フィルター</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="hidden lg:inline-flex" aria-label="アプリ切替" onClick={() => onSectionChange("apps")}>
            <AppWindow className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>アプリ切替</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="通知" onClick={() => onSectionChange("settings")}>
            <Bell className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>通知</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="hidden sm:inline-flex" aria-label="ヘルプ" onClick={() => onSectionChange("settings")}>
            <HelpCircle className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>ヘルプ</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 gap-2 px-2">
            <Avatar className="size-7">
              <AvatarImage src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&h=80&fit=crop&crop=face" alt="山田 太郎" />
              <AvatarFallback>山田</AvatarFallback>
            </Avatar>
            <span className="hidden text-left text-xs leading-tight lg:block">
              <span className="block font-medium text-neutral-950">山田 太郎</span>
              <span className="block text-neutral-500">管理者</span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>ストアアカウント</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onSectionChange("settings")}>設定</DropdownMenuItem>
          <DropdownMenuItem asChild><a href="/shop" target="_blank" rel="noreferrer">公開ストアを開く</a></DropdownMenuItem>
          <DropdownMenuItem disabled>ログアウト</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput
          placeholder="ストア内を検索（注文、商品、顧客など）"
          value={searchQuery}
          onValueChange={onSearchChange}
        />
        <CommandList>
          <CommandEmpty>一致する項目はありません。</CommandEmpty>
          <CommandGroup heading="メニュー">
            {shopNavItems.map((item) => (
              <CommandItem
                key={item.id}
                value={item.label}
                onSelect={() => {
                  onSectionChange(item.id);
                  setCommandOpen(false);
                }}
              >
                <item.icon className="size-4" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="注文と商品">
            {[...shopOrders.slice(0, 3), ...shopProducts.slice(0, 3)].map((item) => (
              <CommandItem
                key={item.id}
                value={"customerName" in item ? `${item.id} ${item.customerName}` : `${item.name} ${item.sku}`}
                onSelect={() => {
                  onSearchChange("customerName" in item ? item.id : item.name);
                  onSectionChange("customerName" in item ? "orders" : "products");
                  setCommandOpen(false);
                }}
              >
                <Search className="size-4" />
                {"customerName" in item ? `${item.id} / ${item.customerName}` : `${item.name} / ${item.sku}`}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
