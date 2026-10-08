"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Nkechinyere's voice for spoken answers. Phase A uses the browser's speech synthesis with word
// boundary events for highlighting (and a timed fallback when a voice doesn't report boundaries).
// Later, recorded audio with word timings can replace it behind the same interface.

export interface Word {
  text: string;
  start: number;
}

/** "Hi there, friend." → words with their character offsets. */
export function tokenize(text: string): Word[] {
  return [...text.matchAll(/\S+/g)].map((m) => ({ text: m[0], start: m.index ?? 0 }));
}

const PREFERRED_VOICES = [
  "Google UK English Female",
  "Microsoft Sonia",
  "Microsoft Libby",
  "Microsoft Aria",
  "Microsoft Jenny",
  "Samantha",
  "Serena",
  "Karen",
  "Moira",
  "Tessa",
];

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  for (const name of PREFERRED_VOICES) {
    const match = voices.find((v) => v.name.startsWith(name));
    if (match) return match;
  }
  return voices.find((v) => v.lang.startsWith("en-GB")) ?? voices.find((v) => v.lang.startsWith("en")) ?? null;
}

const STORAGE_KEY = "scholastiar:guide-voice";

export function useGuideVoice() {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabledState] = useState(true);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [wordIndex, setWordIndex] = useState(-1);
  const timers = useRef<number[]>([]);
  const runId = useRef(0);

  useEffect(() => {
    const ok = typeof window !== "undefined" && "speechSynthesis" in window;
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage unavailable: default on.
    }
    // Reading browser-only capabilities after mount keeps server and client markup identical.
    queueMicrotask(() => {
      setSupported(ok);
      if (stored === "off") setEnabledState(false);
    });
    if (ok) window.speechSynthesis.getVoices(); // warm the voice list (loads asynchronously)
    return () => {
      if (ok) window.speechSynthesis.cancel();
    };
  }, []);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const stop = useCallback(() => {
    runId.current += 1;
    clearTimers();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeakingId(null);
    setWordIndex(-1);
  }, []);

  const setEnabled = useCallback(
    (value: boolean) => {
      setEnabledState(value);
      try {
        window.localStorage.setItem(STORAGE_KEY, value ? "on" : "off");
      } catch {
        // Ignore: preference just isn't remembered.
      }
      if (!value) stop();
    },
    [stop],
  );

  /** Speaks `text`, reporting the current word index. Sentences are queued separately (long utterances can stall in some browsers). */
  const speak = useCallback(
    (id: string, text: string) => {
      stop();
      if (!enabled || !("speechSynthesis" in window)) return;
      const run = ++runId.current;
      const words = tokenize(text);
      const sentences = [...text.matchAll(/[^.!?]+[.!?]*\s*/g)].map((m) => ({ text: m[0], start: m.index ?? 0 }));
      const voice = pickVoice();
      setSpeakingId(id);
      setWordIndex(0);
      let started = false;
      // Watchdog: if speech never starts (no voices, blocked audio), fall back to plain text.
      timers.current.push(
        window.setTimeout(() => {
          if (started || run !== runId.current) return;
          window.speechSynthesis.cancel();
          setSpeakingId(null);
          setWordIndex(-1);
        }, 1500),
      );

      const wordAt = (charIndex: number) => {
        let index = 0;
        for (let i = 0; i < words.length; i++) if (words[i].start <= charIndex) index = i;
        return index;
      };

      sentences.forEach((sentence, s) => {
        const utterance = new SpeechSynthesisUtterance(sentence.text);
        if (voice) utterance.voice = voice;
        utterance.lang = voice?.lang ?? "en-GB";
        utterance.rate = 0.98;
        utterance.pitch = 1.05;
        let gotBoundary = false;

        utterance.onboundary = (event) => {
          if (run !== runId.current || event.name !== "word") return;
          gotBoundary = true;
          setWordIndex(wordAt(sentence.start + event.charIndex));
        };
        utterance.onstart = () => {
          if (run !== runId.current) return;
          started = true;
          setWordIndex(wordAt(sentence.start));
          // Some voices never report word boundaries: walk the words on an estimated pace instead.
          timers.current.push(
            window.setTimeout(() => {
              if (gotBoundary || run !== runId.current) return;
              const inSentence = words.filter(
                (w) => w.start >= sentence.start && w.start < sentence.start + sentence.text.length,
              );
              let elapsed = 0;
              inSentence.forEach((w) => {
                timers.current.push(
                  window.setTimeout(() => run === runId.current && setWordIndex(words.indexOf(w)), elapsed),
                );
                elapsed += 170 + w.text.length * 42;
              });
            }, 350),
          );
        };
        utterance.onend = () => {
          if (run !== runId.current || s !== sentences.length - 1) return;
          clearTimers();
          setSpeakingId(null);
          setWordIndex(-1);
        };
        utterance.onerror = () => {
          if (run !== runId.current) return;
          clearTimers();
          setSpeakingId(null);
          setWordIndex(-1);
        };
        window.speechSynthesis.speak(utterance);
      });
    },
    [enabled, stop],
  );

  return { supported, enabled, setEnabled, speak, stop, speakingId, wordIndex };
}
