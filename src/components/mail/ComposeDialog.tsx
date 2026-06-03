"use client";

import * as React from "react";
import { Bot, Paperclip, Save, Send, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { contacts, templates } from "@/data/mail-sample-data";

interface ComposeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComposeDialog({ open, onOpenChange }: ComposeDialogProps) {
  const [to, setTo] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [ccBccVisible, setCcBccVisible] = React.useState(false);

  function insertTemplate(templateId: string) {
    const template = templates.find((item) => item.id === templateId);
    if (!template) return;
    setSubject(template.subject);
    setBody(template.preview);
    toast.success(`${template.name}テンプレートを挿入しました`);
  }

  function generateDraft() {
    const draft =
      "いつもお世話になっております。\n\nご連絡いただいた内容を確認しました。内容を確認のうえ、対応方針を追ってご連絡します。\n\n引き続きよろしくお願いいたします。";
    setBody(draft);
    toast.success("AI下書きを本文に反映しました");
  }

  function sendMail() {
    if (!to || !subject || !body) {
      toast.error("宛先、件名、本文を入力してください");
      return;
    }
    toast.success("メールを送信キューへ登録しました");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b border-neutral-200 px-4 py-3">
          <DialogTitle className="text-base">新規メール</DialogTitle>
          <DialogDescription>テンプレート、AI下書き、添付ファイルを使って業務メールを作成します。</DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 gap-0 md:grid-cols-[1fr_260px]">
          <div className="space-y-2 p-4">
            <div className="flex items-center gap-2">
              <Input value={to} onChange={(event) => setTo(event.target.value)} placeholder="宛先" aria-label="宛先" />
              <Button variant="ghost" size="sm" onClick={() => setCcBccVisible((visible) => !visible)}>
                CC/BCC
              </Button>
            </div>
            {ccBccVisible && (
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="CC" aria-label="CC" />
                <Input placeholder="BCC" aria-label="BCC" />
              </div>
            )}
            <Input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="件名" aria-label="件名" />
            <Textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="本文"
              aria-label="本文"
              className="min-h-[300px] resize-none"
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Paperclip className="size-4" />
                添付
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Wand2 className="size-4" />
                    テンプレート挿入
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {templates.slice(0, 6).map((template) => (
                    <DropdownMenuItem key={template.id} onClick={() => insertTemplate(template.id)}>
                      {template.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" className="gap-2" onClick={generateDraft}>
                <Bot className="size-4" />
                AI下書き生成
              </Button>
            </div>
          </div>

          <aside className="hidden border-l border-neutral-200 bg-neutral-50 p-3 md:block">
            <div className="text-xs font-semibold text-neutral-500">連絡先候補</div>
            <Command className="mt-2 rounded-lg border border-neutral-200">
              <CommandInput placeholder="取引先を検索" />
              <CommandList>
                <CommandEmpty>候補がありません。</CommandEmpty>
                <CommandGroup>
                  {contacts.map((contact) => (
                    <CommandItem
                      key={contact.id}
                      value={`${contact.name} ${contact.email}`}
                      onSelect={() => setTo(contact.email)}
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{contact.name}</div>
                        <div className="truncate text-xs text-neutral-500">{contact.email}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <Separator className="my-3" />
            <div className="rounded-md border border-neutral-200 bg-white p-3 text-xs leading-5 text-neutral-600">
              AI下書きは本文のたたき台として扱い、外部送信前に必ず人間が確認します。
            </div>
          </aside>
        </div>

        <DialogFooter className="border-t border-neutral-200 px-4 py-3">
          <Button variant="outline" className="gap-2" onClick={() => toast.success("下書きを保存しました")}>
            <Save className="size-4" />
            下書き保存
          </Button>
          <Button className="gap-2" onClick={sendMail}>
            <Send className="size-4" />
            送信
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
