"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { shopNavItems, type ShopSection } from "@/data/shop-sample-data";
import { cn } from "@/lib/utils";

interface ShopSidebarProps {
  activeSection: ShopSection;
  onSectionChange: (section: ShopSection) => void;
}

export function ShopSidebar({ activeSection, onSectionChange }: ShopSidebarProps) {
  const storefrontHref = getStorefrontHref();

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-neutral-200 bg-neutral-50">
      <SidebarHeader className="border-b border-neutral-200 bg-white p-3">
        <div className="flex items-center justify-between gap-2">
          <a href="/shop" className="flex items-center gap-2" aria-label="AIBOUX SHOP Home">
            <img src="/brand/aiboux-logo.svg" alt="aiboux" className="h-7 w-auto" />
            <Badge variant="secondary" className="h-5 rounded-md px-1.5 text-[10px] font-semibold tracking-wide">
              SHOP
            </Badge>
          </a>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="ghost" size="icon-sm" aria-label="ストアを開く">
                <a href={storefrontHref} target="_blank" rel="noreferrer">
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">公開ストアを開く</TooltipContent>
          </Tooltip>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-neutral-50">
        <ScrollArea className="h-full">
          <SidebarGroup className="p-2">
            <SidebarGroupContent>
              <SidebarMenu>
                {shopNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeSection === item.id;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={item.label}
                        className={cn(
                          "h-8 text-[13px]",
                          active
                            ? "bg-neutral-200/70 text-neutral-950 hover:bg-neutral-200/70"
                            : "text-neutral-700 hover:bg-neutral-100"
                        )}
                        onClick={() => onSectionChange(item.id)}
                      >
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {typeof item.count === "number" && (
                        <SidebarMenuBadge className="top-1.5 bg-white text-neutral-600 ring-1 ring-neutral-200">
                          {item.count}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="bg-white p-2">
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-2 text-xs">
          <div className="font-semibold text-neutral-950">AIBOUX STORE</div>
          <div className="mt-0.5 flex items-center justify-between gap-2 text-neutral-500">
            <span>shop.aiboux.com</span>
            <ExternalLink className="size-3.5" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function getStorefrontHref() {
  if (typeof window === "undefined") return "/s/aiboux/";
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts[0] === "s" && parts[1]) return `/s/${encodeURIComponent(decodeURIComponent(parts[1]))}/`;
  return "/s/aiboux/";
}
