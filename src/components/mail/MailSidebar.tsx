"use client";

import { Contact, FileText, ShieldAlert, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mailboxes, type MailboxId } from "@/data/mail-sample-data";
import { cn } from "@/lib/utils";

interface MailSidebarProps {
  activeMailbox: MailboxId;
  onMailboxChange: (mailbox: MailboxId) => void;
}

const serviceLinks = [
  { label: "CORE", href: "https://core.aiboux.com/" },
  { label: "SHOP", href: "https://shop.aiboux.com" },
  { label: "FILE", href: "https://file.aiboux.com" },
  { label: "BIZ", href: "https://biz.aiboux.com" },
  { label: "OFFICE", href: "https://office.aiboux.com" },
  { label: "履歴書", href: "https://rirekisho.aiboux.com" },
  { label: "Docs", href: "https://docs.aiboux.com" },
];

export function MailSidebar({ activeMailbox, onMailboxChange }: MailSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar();

  function closeMobileSidebar() {
    if (isMobile) setOpenMobile(false);
  }

  function navigateMailbox(mailbox: MailboxId) {
    onMailboxChange(mailbox);
    closeMobileSidebar();
  }

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-neutral-200 bg-neutral-50">
      <SidebarHeader className="relative border-b border-neutral-200 bg-white p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 justify-start gap-2 rounded-md px-1.5 pr-8" aria-label="aiboux MAIL サービスメニュー">
              <span className="text-lg font-semibold tracking-tight text-neutral-950">aiboux</span>
              <Badge variant="secondary" className="h-5 rounded-md px-1.5 text-[10px] font-semibold tracking-wide">
                MAIL
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuLabel>サービス</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {serviceLinks.map((service) => (
              <DropdownMenuItem key={service.href} asChild>
                <a href={service.href} onClick={closeMobileSidebar}>{service.label}</a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute right-2 top-3 md:hidden"
          aria-label="メールサイドバーを閉じる"
          onClick={closeMobileSidebar}
        >
          <X className="size-4" />
        </Button>
      </SidebarHeader>

      <SidebarContent className="bg-neutral-50">
        <ScrollArea className="h-full">
          <SidebarGroup className="p-2">
            <SidebarGroupLabel className="h-7 px-2 text-[11px] font-semibold text-neutral-500">
              メールボックス
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mailboxes.map((box) => {
                  const Icon = box.icon;
                  const active = activeMailbox === box.id;
                  return (
                    <SidebarMenuItem key={box.id}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={box.label}
                        className={cn(
                          "h-8 text-[13px]",
                          active
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700"
                            : "text-neutral-700 hover:bg-neutral-100"
                        )}
                        onClick={() => navigateMailbox(box.id)}
                      >
                        <Icon className="size-4" />
                        <span>{box.label}</span>
                        {typeof box.count === "number" && (
                          <span className="ml-auto rounded-md bg-white px-1.5 py-0.5 text-[11px] text-neutral-600 ring-1 ring-neutral-200">
                            {box.count}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="p-2">
            <SidebarGroupLabel className="h-7 px-2 text-[11px] font-semibold text-neutral-500">
              業務リンク
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="h-8 text-[13px] text-neutral-700 hover:bg-neutral-100" onClick={closeMobileSidebar}>
                    <Contact className="size-4" />
                    <span>連絡先</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeMailbox === "templates"}
                    className="h-8 text-[13px] text-neutral-700 hover:bg-neutral-100"
                    onClick={() => navigateMailbox("templates")}
                  >
                    <FileText className="size-4" />
                    <span>テンプレート管理</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeMailbox === "spam"}
                    className="h-8 text-[13px] text-neutral-700 hover:bg-neutral-100"
                    onClick={() => navigateMailbox("spam")}
                  >
                    <ShieldAlert className="size-4" />
                    <span>迷惑メール対策</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-200 bg-white p-2">
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-2 text-xs text-neutral-600">
          <div className="font-medium text-neutral-900">mail.aiboux.com</div>
          <div>Kenjiro Sato / premium_980</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
