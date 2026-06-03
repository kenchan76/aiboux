"use client";

import { ExternalLink, FileArchive, FileImage, FileSpreadsheet, FileText, FileType2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { MailAttachment } from "@/data/mail-sample-data";
import { cn } from "@/lib/utils";

interface MailAttachmentCardProps {
  attachment: MailAttachment;
}

const iconMap = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  csv: FileArchive,
  image: FileImage,
  docx: FileType2,
  txt: FileText,
};

const iconTone: Record<MailAttachment["kind"], string> = {
  pdf: "border-red-200 bg-red-50 text-red-700",
  xlsx: "border-emerald-200 bg-emerald-50 text-emerald-700",
  csv: "border-teal-200 bg-teal-50 text-teal-700",
  image: "border-violet-200 bg-violet-50 text-violet-700",
  docx: "border-blue-200 bg-blue-50 text-blue-700",
  txt: "border-neutral-200 bg-neutral-50 text-neutral-700",
};

export function MailAttachmentCard({ attachment }: MailAttachmentCardProps) {
  const Icon = iconMap[attachment.kind];
  return (
    <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white p-2">
      <div
        data-attachment-kind={attachment.kind}
        className={cn("flex size-9 shrink-0 items-center justify-center rounded-md border", iconTone[attachment.kind])}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-neutral-950">{attachment.name}</div>
        <div className="mt-0.5 text-xs text-neutral-500">{attachment.sizeLabel}</div>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon-sm" aria-label={`${attachment.name}を開く`}>
            <ExternalLink className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>開く</TooltipContent>
      </Tooltip>
    </div>
  );
}
