"use client";

import * as React from "react";
import { Bot, Mic, MicOff, Paperclip, Send, Sparkles, Volume2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { mailAIQuickActions, type MailMessage } from "@/data/mail-sample-data";
import { createVoiceReplyDraft, type VoiceReplyDraft } from "@/lib/mail/ai";
import { cn } from "@/lib/utils";

const defaultVoiceInput = "えーと 明日のあの件、あ、ごめん明後日だ。確認して返信して";

interface MailAIAssistantPanelProps {
  message?: MailMessage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MailAIAssistantPanel({
  message,
  open,
  onOpenChange,
}: MailAIAssistantPanelProps) {
  if (!open) return null;

  return (
    <section
      role="dialog"
      aria-label="AI Assistant"
      className={cn(
        "mail-ai-cosmic-panel fixed z-50 flex overflow-hidden rounded-lg text-neutral-950",
        "[bottom:calc(env(safe-area-inset-bottom)_+_10px)] [left:calc(env(safe-area-inset-left)_+_10px)] [right:calc(env(safe-area-inset-right)_+_10px)] [top:calc(env(safe-area-inset-top)_+_10px)]",
        "sm:left-auto sm:top-auto sm:w-[420px] sm:[bottom:calc(env(safe-area-inset-bottom)_+_20px)] sm:[right:calc(env(safe-area-inset-right)_+_20px)]",
        "sm:h-[min(720px,calc(100dvh_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom)_-_40px))]"
      )}
    >
      <MailAIPanelBody message={message} onClose={() => onOpenChange(false)} />
    </section>
  );
}

function MailAIPanelBody({
  message,
  onClose,
}: {
  message?: MailMessage;
  onClose: () => void;
}) {
  const [input, setInput] = React.useState("");
  const [voiceInput, setVoiceInput] = React.useState(defaultVoiceInput);
  const [voiceDraft, setVoiceDraft] = React.useState<VoiceReplyDraft | null>(null);
  const [listening, setListening] = React.useState(false);
  const [speechSupported, setSpeechSupported] = React.useState(false);
  const [interimSpeech, setInterimSpeech] = React.useState("");
  const [speechStatus, setSpeechStatus] = React.useState("マイクボタンで音声メモを追加できます");
  const [inputFocused, setInputFocused] = React.useState(false);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  React.useEffect(() => {
    const supported = Boolean(getSpeechRecognition());
    setSpeechSupported(supported);
    setSpeechStatus(supported ? "マイクボタンで音声メモを追加できます" : "このブラウザでは音声入力に対応していません");

    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  function runAction(label: string) {
    toast.success(`${label}を実行しました`);
  }

  function submit() {
    if (!input.trim()) {
      toast.error("依頼内容を入力してください");
      return;
    }
    toast.success("AI Assistantが処理結果を更新しました");
    setInput("");
  }

  function makeVoiceDraft() {
    if (!voiceInput.trim()) {
      toast.error("音声メモを入力してください");
      return;
    }
    const draft = createVoiceReplyDraft({
      spokenText: voiceInput,
      recipientName: message?.senderName,
      subject: message?.subject,
      contextSummary: message ? getAssistantSummary(message) : undefined,
    });
    setVoiceDraft(draft);
    toast.success("音声メモから返信下書きを作成しました");
  }

  function startVoiceMemoSpeech() {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setSpeechStatus("このブラウザでは音声入力に対応していません");
      toast.error("このブラウザでは音声入力に対応していません");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setSpeechStatus("音声入力を停止中です");
      return;
    }

    const recognition = new SpeechRecognition();
    const sessionBase = voiceInput.trim() === defaultVoiceInput ? "" : voiceInput.trim();
    recognitionRef.current = recognition;
    recognition.lang = "ja-JP";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    setListening(true);
    setInterimSpeech("");
    setSpeechStatus("音声入力中です。話した内容を自動でメモへ反映します");

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const { finalText, interimText } = readSpeechResult(event);
      const transcript = [finalText, interimText].filter(Boolean).join("");
      const nextValue = [sessionBase, transcript.trim()].filter(Boolean).join(" ");

      setInterimSpeech(interimText);
      if (nextValue) setVoiceInput(nextValue);
      if (finalText.trim()) {
        setInterimSpeech("");
        setSpeechStatus("音声メモを文字起こししました");
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const message = speechErrorMessage(event.error);
      setListening(false);
      setInterimSpeech("");
      setSpeechStatus(message);
      toast.error(message);
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
      setSpeechStatus((current) => (current === "音声入力中です。話した内容を自動でメモへ反映します" ? "音声入力を終了しました" : current));
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
      setSpeechStatus("音声入力を開始できませんでした");
      toast.error("音声入力を開始できませんでした");
    }
  }

  function readSummary() {
    if (!message) {
      toast.error("読み上げるメールを選択してください");
      return;
    }
    const text = getAssistantSummary(message);
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.info(text);
      return;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }

  function approveVoiceDraft() {
    toast.success("人間承認済みとして送信キューへ渡しました");
    setVoiceDraft(null);
  }

  return (
    <div className="relative z-10 flex h-full min-h-0 w-full flex-col">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/45 bg-white/[0.92] px-3 text-neutral-950 shadow-sm shadow-slate-950/10">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex size-6 items-center justify-center rounded-md border border-cyan-200 bg-gradient-to-br from-violet-700 to-cyan-500 text-white shadow-sm">
              <Sparkles className="size-3.5" />
            </span>
            AI Assistant
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-cyan-700">
            <span className="size-1.5 rounded-full bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.55)]" />
            オンライン
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
              aria-label="AIパネルを閉じる"
            >
              <X className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>閉じる</TooltipContent>
        </Tooltip>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-3 p-3">
          <Card className="border-neutral-200 bg-white/[0.98] shadow-sm shadow-slate-950/10">
            <CardHeader className="px-3 py-2">
              <CardTitle className="text-xs font-semibold text-neutral-500">現在のメール</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-3 pb-3 text-sm">
              {message ? (
                <>
                  <div className="font-medium text-neutral-950">{message.subject}</div>
                  <div className="text-xs text-neutral-500">{message.senderName} / {message.attachments.length}件の添付</div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      className={cn(
                        "h-5 rounded-md px-1.5 text-[10px]",
                        message.aiClassification.category === "business"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-neutral-200 bg-neutral-50 text-neutral-600"
                      )}
                    >
                      {message.aiClassification.category === "business" ? "業務" : "私用隔離"}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="text-xs text-neutral-500">メールを選択すると、件名・差出人・添付数を読み込みます。</div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 rounded-md border border-neutral-200 bg-white/[0.94] px-2 py-1.5 text-xs font-medium text-neutral-800 shadow-sm shadow-slate-950/10">
              <span>よく使う依頼</span>
              <span className="text-[11px] font-normal text-neutral-500">メール処理を下書きまで補助</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {mailAIQuickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  className="h-9 justify-start gap-1.5 rounded-full border border-white/60 bg-white/42 px-3 text-xs font-semibold !text-violet-950 shadow-sm shadow-slate-950/15 backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-cyan-100/90 hover:bg-cyan-50/80 hover:shadow-md hover:shadow-cyan-950/20 focus-visible:ring-2 focus-visible:ring-cyan-100/70"
                  onClick={() => runAction(action.label)}
                >
                  <Bot className="size-3.5" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {message && (
            <Card className="border-neutral-200 bg-white/[0.98] shadow-sm shadow-slate-950/10">
              <CardHeader className="px-3 py-2">
                <CardTitle className="text-sm">要約</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-3 pb-3">
                <p className="text-xs leading-5 text-neutral-600">{getAssistantSummary(message)}</p>
                <Button variant="outline" size="sm" className="h-8 gap-2 text-xs" onClick={readSummary}>
                  <Volume2 className="size-3.5" />
                  読み上げ
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="border-neutral-200 bg-white/[0.98] shadow-sm shadow-slate-950/10">
            <CardHeader className="px-3 py-2">
              <CardTitle className="text-sm">音声返信メモ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-3 pb-3">
              <Textarea
                value={voiceInput}
                onChange={(event) => setVoiceInput(event.target.value)}
                className="min-h-20 resize-none border-neutral-200 bg-white text-xs focus-visible:border-blue-500 focus-visible:ring-blue-100"
                aria-label="音声返信メモ"
              />
              <div className="text-xs text-neutral-500">
                {interimSpeech ? `認識中: ${interimSpeech}` : speechStatus}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={listening ? "default" : "outline"}
                  size="sm"
                  className="h-8 gap-2 text-xs"
                  onClick={startVoiceMemoSpeech}
                  disabled={!speechSupported}
                  aria-pressed={listening}
                >
                  {listening ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
                  {listening ? "停止" : "音声入力"}
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-2 text-xs" onClick={makeVoiceDraft}>
                  <Sparkles className="size-3.5" />
                  下書き化
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {voiceDraft && (
        <div className="shrink-0 border-t border-white/20 bg-white/15 p-3">
          <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50">
                <Sparkles className="size-3.5 text-neutral-700" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-neutral-950">返信下書き</div>
                <p className="mt-1 max-h-12 overflow-hidden text-xs leading-5 text-neutral-600">{voiceDraft.body}</p>
                <div className="mt-2 flex justify-end gap-2">
                  <Button variant="outline" size="sm" className="h-8" onClick={() => setVoiceDraft(null)}>
                    やめる
                  </Button>
                  <Button size="sm" className="h-8 gap-1.5" onClick={approveVoiceDraft}>
                    <Send className="size-3.5" />
                    承認
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="shrink-0 border-t border-white/25 bg-violet-950/24 p-3 text-white shadow-[0_-1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-white">AIへの依頼</span>
          <span className={cn("text-[11px]", inputFocused ? "font-medium text-cyan-100" : "text-white/70")}>
            {inputFocused ? "入力中: 下書き作成まで実行" : "下書き作成まで実行"}
          </span>
        </div>
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          placeholder="AIに依頼する（例：返信文を作成して）"
          className="min-h-24 resize-none border-white/40 bg-violet-950/30 text-white shadow-inner shadow-slate-950/20 backdrop-blur-md placeholder:text-white/72 focus-visible:border-cyan-100 focus-visible:ring-cyan-100/40"
          aria-label="AIへの依頼内容"
        />
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-sm" className="text-white hover:bg-white/15 hover:text-white" aria-label="ファイル添付">
              <Paperclip className="size-4" />
            </Button>
          </div>
          <Button size="sm" className="gap-2 rounded-full bg-white px-4 text-violet-900 shadow-sm shadow-slate-950/15 hover:bg-cyan-50" onClick={submit}>
            <Send className="size-4" />
            依頼
          </Button>
        </div>
      </div>
    </div>
  );
}

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  const source = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return source.SpeechRecognition ?? source.webkitSpeechRecognition ?? null;
}

function getAssistantSummary(message: MailMessage): string {
  if (message.aiClassification.category !== "business") {
    return "業務処理から分けて扱う可能性があるメールです。返信前に本文を確認してください。";
  }

  if (message.attachments.length > 0) {
    return "本文と添付ファイルの確認が必要な業務メールです。返信前に内容を確認してください。";
  }

  return "返信前の内容確認が必要な業務メールです。必要に応じて下書きを作成できます。";
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
