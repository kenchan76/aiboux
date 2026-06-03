"use client";

import * as React from "react";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyableEmailProps {
  email: string;
  className?: string;
  showBrackets?: boolean;
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Fall through to the DOM copy path for restricted or headless browsers.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("copy command failed");
}

export function CopyableEmail({ email, className, showBrackets = false }: CopyableEmailProps) {
  const [notice, setNotice] = React.useState<string | null>(null);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function showNotice(message: string) {
    setNotice(message);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setNotice(null), 1800);
  }

  async function handleCopy() {
    try {
      await copyToClipboard(email);
      showNotice("コピーしました");
    } catch {
      showNotice("コピーできませんでした");
    }
  }

  return (
    <>
      <button
        type="button"
        data-copy-email={email}
        onClick={handleCopy}
        className={cn(
          "group inline-flex max-w-full cursor-pointer items-center gap-1 truncate rounded-sm text-left underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300",
          className
        )}
        aria-label={`${email}をコピー`}
        title={`${email} をコピー`}
      >
        <span className="truncate">{showBrackets ? `<${email}>` : email}</span>
        <Copy className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-60 group-focus-visible:opacity-80" />
      </button>
      {notice ? (
        <div className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 rounded-sm border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-800 shadow-sm">
          {notice}
        </div>
      ) : null}
    </>
  );
}
