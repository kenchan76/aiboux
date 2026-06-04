"use client";

import * as React from "react";
import { Bot, CheckCircle2, ExternalLink, Mic, MicOff, Paperclip, Send, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { resolveAssistantIntent, type AssistantIntentResult } from "@/lib/ai/intent-router";
import { cn } from "@/lib/utils";

type AssistantMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  time: string;
  intent?: AssistantIntentResult;
};

type StoredState = {
  open: boolean;
  input: string;
  messages: AssistantMessage[];
  lastIntent?: AssistantIntentResult;
};

interface GlobalAIAssistantProps {
  service?: string;
  defaultOpen?: boolean;
}

const storageKey = "aiboux.global-ai.v1";
const sampleVoice = "取引先へ、明日の会議は10時からに変更してとメールを送って";
const mobileQuery = "(max-width: 767px)";

const initialMessages: AssistantMessage[] = [
  {
    id: "hello",
    role: "assistant",
    text: "AIBOUX OS全体を横断して支援します。Mail、Core、Shop、Fileの作業状態を保ったまま相談できます。",
    time: "初期",
  },
];

export function GlobalAIAssistant({ service = "AIBOUX", defaultOpen = true }: GlobalAIAssistantProps) {
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<AssistantMessage[]>(initialMessages);
  const [lastIntent, setLastIntent] = React.useState<AssistantIntentResult | undefined>();
  const [listening, setListening] = React.useState(false);
  const [speechSupported, setSpeechSupported] = React.useState(false);
  const [speechText, setSpeechText] = React.useState("");
  const [apiStatus, setApiStatus] = React.useState("待機中");
  const [hideLauncherForDetail, setHideLauncherForDetail] = React.useState(false);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  React.useEffect(() => {
    setMounted(true);
    const stored = loadState();
    const isMobile = window.matchMedia(mobileQuery).matches;
    setSpeechSupported(Boolean(getSpeechRecognition()));

    if (stored) {
      setOpen(isMobile || !defaultOpen ? false : stored.open);
      setInput(stored.input);
      setMessages(stored.messages.length > 0 ? stored.messages : initialMessages);
      setLastIntent(stored.lastIntent);
      return;
    }

    setOpen(defaultOpen && !isMobile);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    saveState({ open, input, messages, lastIntent });
  }, [mounted, open, input, messages, lastIntent]);

  React.useEffect(() => {
    const openAssistant = () => {
      setOpen(true);
    };
    window.addEventListener("aiboux-ai-open", openAssistant);
    return () => window.removeEventListener("aiboux-ai-open", openAssistant);
  }, []);

  React.useEffect(() => {
    if (!mounted || service !== "Core") return;

    const syncVisibility = () => {
      setHideLauncherForDetail(Boolean(document.querySelector('[data-testid="delivery-detail-workspace"]')));
    };
    syncVisibility();

    const observer = new MutationObserver(syncVisibility);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [mounted, service]);

  React.useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  async function runIntent(text: string) {
    const clean = text.trim();
    if (!clean) return;
    const now = new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
    const userMessage: AssistantMessage = { id: crypto.randomUUID(), role: "user", text: clean, time: now };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setApiStatus("Cloudflare Workers AIへIntent照会中");

    let result: AssistantIntentResult;
    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 900);
      const response = await fetch("/api/ai/intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: clean, service }),
        signal: controller.signal,
      });
      window.clearTimeout(timeoutId);
      const payload = (await response.json()) as { success?: boolean; intent?: AssistantIntentResult };
      result = payload.intent ?? resolveAssistantIntent(clean, service);
      setApiStatus(response.ok && payload.intent ? "Workers AI連携OK" : "決定的ルーターで補完");
    } catch {
      result = resolveAssistantIntent(clean, service);
      result.audit = [...result.audit, "workers_ai_timeout_or_unavailable=client_fallback"];
      setApiStatus("Workers AI遅延のためローカルIntentで即時補完");
    }

    setLastIntent(result);
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text: result.summary,
        time: "今",
        intent: result,
      },
    ]);
  }

  function startSpeech() {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setApiStatus("音声入力はこのブラウザで未対応です");
      setSpeechText("");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setApiStatus("音声入力を停止中");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "ja-JP";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    setSpeechText("");
    setListening(true);
    setApiStatus("音声入力中");

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const { finalText, interimText } = readSpeechResult(event);
      const nextText = [finalText, interimText].filter(Boolean).join("");
      setSpeechText(interimText);

      if (nextText.trim()) {
        setInput(nextText);
      }

      if (finalText.trim()) {
        setSpeechText("");
        setInput(finalText.trim());
        setApiStatus("音声入力をテキスト化しました");
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setListening(false);
      setSpeechText("");
      setApiStatus(speechErrorMessage(event.error));
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
      setApiStatus("音声入力を開始できませんでした");
    }
  }

  if (!mounted || hideLauncherForDetail) return null;

  return (
    <TooltipProvider delayDuration={120}>
      {open ? (
        <section
          className="fixed z-50 flex h-[min(680px,calc(100dvh_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom)_-_24px))] max-h-[calc(100svh_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom)_-_24px)] w-[min(420px,calc(100vw_-_env(safe-area-inset-left)_-_env(safe-area-inset-right)_-_24px))] flex-col rounded-md border border-neutral-200 bg-white text-neutral-950 shadow-sm [bottom:calc(env(safe-area-inset-bottom)_+_12px)] [right:calc(env(safe-area-inset-right)_+_12px)] max-md:[left:calc(env(safe-area-inset-left)_+_12px)] max-md:[top:calc(env(safe-area-inset-top)_+_12px)] max-md:[width:calc(100vw_-_env(safe-area-inset-left)_-_env(safe-area-inset-right)_-_24px)] max-md:[height:calc(100dvh_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom)_-_24px)]"
          aria-label="AIBOUX Global AI Assistant"
        >
          <header className="flex h-12 shrink-0 items-center justify-between border-b border-neutral-200 px-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4" />
                AI Assistant
                <Badge variant="outline" className="rounded-sm px-1.5 text-[10px]">{service}</Badge>
              </div>
              <div className="mt-0.5 text-[11px] text-neutral-500">{apiStatus}</div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)} aria-label="AI Assistantを閉じる">
                  <X className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>閉じる</TooltipContent>
            </Tooltip>
          </header>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-3 p-3">
              <div className="rounded-md border border-neutral-200 bg-white p-3 text-xs leading-5 text-neutral-600">
                <div className="mb-1 font-semibold text-neutral-900">永続状態</div>
                この会話と入力中テキストはブラウザに保存され、MailからCoreなどへ移動しても復帰します。
              </div>
              {messages.map((message) => (
                <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[88%] rounded-md border px-3 py-2 text-sm leading-6", message.role === "user" ? "border-neutral-300 bg-neutral-50" : "border-neutral-200 bg-white")}>
                    <div>{message.text}</div>
                    {message.intent ? <IntentCard intent={message.intent} /> : null}
                    <div className="mt-1 text-right text-[10px] text-neutral-400">{message.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="shrink-0 border-t border-neutral-200 p-3">
            {lastIntent ? <IntentAction intent={lastIntent} /> : null}
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={listening ? "話すとここへ文字起こしされます" : "AIに依頼する（例：取引先へ明日の会議は10時からとメール）"}
              className="mt-2 min-h-20 resize-none text-sm"
            />
            {speechText ? <div className="mt-1 text-xs text-neutral-500">認識中: {speechText}</div> : null}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-1">
                <Button
                  variant={listening ? "default" : "outline"}
                  size="icon-sm"
                  aria-label={listening ? "音声入力を停止" : "音声入力"}
                  aria-pressed={listening}
                  onClick={startSpeech}
                  disabled={!speechSupported && mounted}
                >
                  {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                </Button>
                <Button variant="ghost" size="icon-sm" aria-label="添付">
                  <Paperclip className="size-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => runIntent(sampleVoice)}>
                  音声テスト
                </Button>
              </div>
              <Button size="sm" className="h-8 gap-2" onClick={() => runIntent(input)}>
                <Send className="size-4" />
                送信
              </Button>
            </div>
          </div>
        </section>
      ) : hideLauncherForDetail ? null : (
        <Button
          className="fixed z-50 size-14 rounded-full border border-neutral-200 bg-white p-0 text-neutral-950 shadow-md hover:bg-neutral-50 focus-visible:ring-4 focus-visible:ring-neutral-200 [bottom:calc(env(safe-area-inset-bottom)_+_104px)] [right:calc(env(safe-area-inset-right)_+_20px)]"
          variant="outline"
          onClick={() => setOpen(true)}
          aria-label="AI Assistantを開く"
        >
          <Bot className="size-6" />
        </Button>
      )}
      <Toaster position="top-right" richColors />
    </TooltipProvider>
  );
}

function IntentCard({ intent }: { intent: AssistantIntentResult }) {
  return (
    <div className="mt-2 rounded-md border border-neutral-200 bg-neutral-50 p-2 text-xs text-neutral-700">
      <div className="flex items-center gap-1.5 font-medium text-neutral-950">
        <CheckCircle2 className="size-3.5" />
        Intent: {intent.intent} / {Math.round(intent.confidence * 100)}%
      </div>
      {intent.draft ? (
        <div className="mt-2 space-y-1">
          <div>To: {intent.draft.toName} &lt;{intent.draft.toEmail}&gt;</div>
          <div>Subject: {intent.draft.subject}</div>
        </div>
      ) : null}
      {intent.form ? <div className="mt-2">フォーム: {intent.form.title}</div> : null}
    </div>
  );
}

function IntentAction({ intent }: { intent: AssistantIntentResult }) {
  if (!intent.route) return null;
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-2 text-xs">
      <div className="font-medium text-neutral-950">次の操作候補</div>
      <div className="mt-1 text-neutral-600">{intent.summary}</div>
      <Button variant="outline" size="sm" className="mt-2 h-8 gap-1.5 text-xs" onClick={() => { window.location.href = intent.route!; }}>
        <ExternalLink className="size-3.5" />
        {intent.route} へ移動
      </Button>
    </div>
  );
}

function loadState(): StoredState | null {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as StoredState) : null;
  } catch {
    return null;
  }
}

function saveState(state: StoredState) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Storage may be disabled. The assistant still works for the current page.
  }
}

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  const source = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return source.SpeechRecognition ?? source.webkitSpeechRecognition ?? null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;

type SpeechRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionEvent = {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

function readSpeechResult(event: SpeechRecognitionEvent): { finalText: string; interimText: string } {
  let finalText = "";
  let interimText = "";

  for (let index = event.resultIndex; index < event.results.length; index += 1) {
    const result = event.results[index];
    const transcript = result[0]?.transcript ?? "";
    if (result.isFinal) finalText += transcript;
    else interimText += transcript;
  }

  return { finalText, interimText };
}

function speechErrorMessage(error: string): string {
  if (error === "not-allowed" || error === "service-not-allowed") {
    return "マイク権限が許可されていません";
  }
  if (error === "no-speech") return "音声を検出できませんでした";
  if (error === "audio-capture") return "マイク入力を取得できませんでした";
  if (error === "network") return "音声認識サービスへ接続できませんでした";
  return "音声入力でエラーが発生しました";
}
