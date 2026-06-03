import { Filter, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CorePageHeaderProps {
  title: string;
  description: string;
  primaryAction: string;
  onPrimaryAction: () => void;
  directPrimaryAction?: boolean;
}

export function CorePageHeader({ title, description, primaryAction, onPrimaryAction, directPrimaryAction = false }: CorePageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">{title}</h1>
        {description ? <p className="mt-0.5 text-sm text-neutral-500">{description}</p> : null}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9">
          <Filter className="mr-1.5 h-4 w-4" />
          カスタマイズ
        </Button>
        {directPrimaryAction ? (
          <Button size="sm" className="h-9" onClick={onPrimaryAction}>
            <Plus className="mr-1.5 h-4 w-4" />
            {primaryAction}
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-9">
                <Plus className="mr-1.5 h-4 w-4" />
                {primaryAction}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onPrimaryAction}>{primaryAction}</DropdownMenuItem>
              <DropdownMenuItem>CSVから一括作成</DropdownMenuItem>
              <DropdownMenuItem>テンプレートから作成</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
