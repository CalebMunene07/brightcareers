"use client";

import { useEffect, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { improveCvText, type AiKind } from "@/app/cv-ai-actions";
import { useL } from "@/components/cv/cv-labels";

/* ---------------- AI suggestion ---------------- */

export function AiAssist({
  kind,
  input,
  onAccept,
  label = "Improve with AI",
}: {
  kind: AiKind;
  input: Parameters<typeof improveCvText>[1];
  onAccept: (text: string) => void;
  label?: string;
}) {
  const L = useL();
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function run() {
    setError(null);
    setSuggestion(null);
    start(async () => {
      const res = await improveCvText(kind, input);
      if (res.ok) setSuggestion(res.text);
      else setError(res.message);
    });
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200 hover:bg-violet-100 disabled:opacity-60"
      >
        <span aria-hidden="true">✨</span>
        {pending ? L("Thinking…") : L(label)}
      </button>
      {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
      {suggestion && (
        <div className="mt-2 rounded-xl bg-violet-50 p-3 text-sm ring-1 ring-violet-200">
          <p className="text-xs font-semibold text-violet-700">{L("Suggestion (check it's accurate before using it)")}</p>
          <p className="mt-1 whitespace-pre-line text-slate-800">{suggestion}</p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                onAccept(suggestion);
                setSuggestion(null);
              }}
              className="rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white hover:bg-violet-700"
            >
              {L("Use this")}
            </button>
            <button type="button" onClick={() => setSuggestion(null)} className="text-xs text-slate-500 hover:text-slate-800">
              {L("Dismiss")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Speech to text (browser Web Speech API) ---------------- */

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>; resultIndex: number }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
};

function getRecognitionCtor(): (new () => Recognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const subscribe = () => () => {};

export function DictateButton({ onText, lang = "en-GB" }: { onText: (text: string) => void; lang?: string }) {
  // Only show the button in browsers that support speech recognition.
  const L = useL();
  const supported = useSyncExternalStore(subscribe, () => !!getRecognitionCtor(), () => false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<Recognition | null>(null);

  useEffect(() => () => recRef.current?.stop(), []);

  if (!supported) return null;

  function toggle() {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) text += e.results[i][0].transcript;
      }
      if (text.trim()) onText(text.trim());
    };
    rec.onerror = (e) => setError(L(e.error === "not-allowed" ? "Microphone access was blocked." : "Couldn't hear that. Try again."));
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setError(null);
    setListening(true);
    rec.start();
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={listening}
        title={L(listening ? "Stop dictation" : "Dictate with your voice")}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
          listening ? "bg-red-50 text-red-700 ring-red-200" : "bg-slate-50 text-slate-700 ring-slate-200 hover:bg-slate-100"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
        </svg>
        {L(listening ? "Listening… tap to stop" : "Dictate")}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
