"use client";

import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Circle,
  Loader2,
  Mic,
  RotateCcw,
  Square,
  Upload,
  VideoOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { MAX_PROMPTS, MAX_RECORDING_SECONDS, MAX_UPLOAD_BYTES, PERSONALITY_PROMPTS } from "@/config/personality";
import { savePersonalityVideo } from "@/lib/actions/personality";
import { cn } from "@/lib/utils";

type Prompt = (typeof PERSONALITY_PROMPTS)[number];
type Step = "prompts" | "check" | "recording" | "review";

interface Take {
  url: string;
  seconds: number;
  size: number;
  mime: string;
  source: "recorded" | "uploaded";
  fileName: string;
}

const STEP_LABELS: Record<Step, string> = {
  prompts: "Choose prompts",
  check: "Camera check",
  recording: "Record",
  review: "Review",
};

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function pickMime() {
  if (typeof MediaRecorder === "undefined") return "";
  return (
    ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"].find((t) =>
      MediaRecorder.isTypeSupported(t),
    ) ?? ""
  );
}

/** Live microphone level, so students can see they're being heard. */
function useMicLevel(stream: MediaStream | null) {
  const [level, setLevel] = useState(0);
  useEffect(() => {
    if (!stream || stream.getAudioTracks().length === 0) return;
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    context.createMediaStreamSource(stream).connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    let frame = 0;
    const tick = () => {
      analyser.getByteFrequencyData(data);
      setLevel(Math.min(1, data.reduce((a, b) => a + b, 0) / data.length / 80));
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(frame);
      void context.close();
    };
  }, [stream]);
  return level;
}

export function RecordingStudio() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("prompts");
  const [prompts, setPrompts] = useState<Prompt[]>([PERSONALITY_PROMPTS[0], PERSONALITY_PROMPTS[2]]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [promptIndex, setPromptIndex] = useState(0);
  const [take, setTake] = useState<Take | null>(null);
  const [saving, startSaving] = useTransition();
  const liveRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const secondsRef = useRef(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const level = useMicLevel(stream);

  // Show the live camera whenever there's a stream.
  useEffect(() => {
    if (liveRef.current && stream) liveRef.current.srcObject = stream;
  }, [stream, step]);

  // Release the camera when leaving the page.
  useEffect(() => () => stream?.getTracks().forEach((t) => t.stop()), [stream]);

  // Timer while recording, with an automatic stop at the limit.
  useEffect(() => {
    if (step !== "recording") return;
    const timer = setInterval(() => {
      secondsRef.current += 1;
      setSeconds(secondsRef.current);
      if (secondsRef.current >= MAX_RECORDING_SECONDS) recorderRef.current?.stop();
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  async function connect() {
    setConnecting(true);
    setCameraError(null);
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true });
      setStream(media);
      setStep("check");
    } catch {
      setCameraError(
        "We can't reach your camera or microphone. Allow access in your browser settings, or upload a video instead.",
      );
      setStep("check");
    } finally {
      setConnecting(false);
    }
  }

  function startRecording() {
    if (!stream) return;
    const mime = pickMime();
    const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    chunksRef.current = [];
    secondsRef.current = 0;
    setSeconds(0);
    setPromptIndex(0);
    recorder.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "video/webm" });
      setTake({
        url: URL.createObjectURL(blob),
        seconds: Math.max(secondsRef.current, 1),
        size: blob.size || 1,
        mime: blob.type || "video/webm",
        source: "recorded",
        fileName: "personality-cv.webm",
      });
      setStep("review");
    };
    recorder.start(1000);
    recorderRef.current = recorder;
    setStep("recording");
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Choose a video file (MP4, MOV or WebM).");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("Videos can be up to 200 MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    const probe = document.createElement("video");
    probe.preload = "metadata";
    const done = (secs: number) =>
      setTake({ url, seconds: secs, size: file.size, mime: file.type, source: "uploaded", fileName: file.name });
    probe.onloadedmetadata = () => {
      done(Number.isFinite(probe.duration) ? Math.round(probe.duration) : 60);
      setStep("review");
    };
    probe.onerror = () => {
      // Some formats can't be previewed in every browser; keep the file and estimate later.
      done(60);
      setStep("review");
    };
    probe.src = url;
  }

  function save() {
    if (!take) return;
    startSaving(async () => {
      const result = await savePersonalityVideo({
        prompts,
        duration_seconds: take.seconds,
        size_bytes: take.size,
        mime_type: take.mime.split(";")[0],
        source: take.source,
        file_name: take.fileName,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      stream?.getTracks().forEach((t) => t.stop());
      toast.success("Your PersonalityAI CV is saved");
      router.push("/personality-cv");
    });
  }

  const steps: Step[] = ["prompts", "check", "recording", "review"];

  return (
    <div className="space-y-5">
      <ol className="flex gap-1.5" aria-label="Recording steps">
        {steps.map((s, i) => {
          const current = steps.indexOf(step);
          return (
            <li key={s} className="flex-1" aria-current={s === step ? "step" : undefined}>
              <span
                className={cn(
                  "block h-1.5 rounded-full",
                  i < current ? "bg-green" : i === current ? "bg-green-action" : "bg-neutral-soft dark:bg-white/10",
                )}
              />
              <span
                className={cn(
                  "mt-1.5 hidden text-xs sm:block",
                  s === step ? "font-semibold text-primary-text" : "text-secondary-text",
                )}
              >
                {STEP_LABELS[s]}
              </span>
            </li>
          );
        })}
      </ol>

      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        className="sr-only"
        aria-label="Upload a video"
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      {step === "prompts" && (
        <section className="rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
          <h2 className="font-semibold text-primary-text">Choose up to {MAX_PROMPTS} prompts</h2>
          <p className="mt-1 text-sm text-secondary-text">
            About 30 seconds each. Talk the way you would to an admissions tutor — no script needed.
          </p>
          <div role="group" aria-label="Prompts" className="mt-4 grid gap-2 sm:grid-cols-2">
            {PERSONALITY_PROMPTS.map((prompt) => {
              const on = prompts.includes(prompt);
              const full = !on && prompts.length >= MAX_PROMPTS;
              return (
                <button
                  key={prompt}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  disabled={full}
                  onClick={() => setPrompts(on ? prompts.filter((p) => p !== prompt) : [...prompts, prompt])}
                  className={cn(
                    "flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-left text-sm transition-all disabled:opacity-50",
                    on
                      ? "border-green-action bg-soft-green/50 text-primary-text dark:bg-green/10"
                      : "text-secondary-text hover:border-green/50",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                      on ? "border-green-action bg-green-action text-white" : "border-subtle-text/60",
                    )}
                    aria-hidden
                  >
                    {on && <Check className="size-3" />}
                  </span>
                  {prompt}
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => fileRef.current?.click()}
              disabled={prompts.length === 0}
            >
              <Upload aria-hidden />
              Upload a video instead
            </Button>
            <Button
              type="button"
              className="rounded-xl"
              onClick={connect}
              disabled={prompts.length === 0 || connecting}
            >
              {connecting ? <Loader2 className="animate-spin" aria-hidden /> : <Camera aria-hidden />}
              Check camera and mic
            </Button>
          </div>
        </section>
      )}

      {(step === "check" || step === "recording") && (
        <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-brand-black">
            {cameraError ? (
              <div
                className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-white"
                role="alert"
              >
                <VideoOff className="size-8 text-white/70" aria-hidden />
                <p className="max-w-sm text-sm text-white/80">{cameraError}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button type="button" variant="inverse" size="sm" onClick={connect}>
                    Try again
                  </Button>
                  <Button type="button" variant="outline-inverse" size="sm" onClick={() => fileRef.current?.click()}>
                    <Upload aria-hidden />
                    Upload instead
                  </Button>
                </div>
              </div>
            ) : (
              <video
                ref={liveRef}
                autoPlay
                muted
                playsInline
                className="size-full -scale-x-100 object-cover"
                aria-label="Your camera"
              />
            )}
            {step === "recording" && (
              <span
                className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white"
                role="status"
              >
                <Circle className="size-2.5 animate-pulse fill-danger text-danger" aria-hidden />
                Recording {clock(seconds)} / {clock(MAX_RECORDING_SECONDS)}
              </span>
            )}
          </div>

          <div className="flex flex-col rounded-2xl border bg-card p-5 dark:bg-white/[0.03]">
            {step === "check" ? (
              <>
                <h2 className="font-semibold text-primary-text">Camera and mic check</h2>
                <ul className="mt-3 space-y-2 text-sm text-secondary-text">
                  <li>Face a window or lamp so your face is lit.</li>
                  <li>Keep your eyes near the camera.</li>
                  <li>Find a quiet spot.</li>
                </ul>
                {!cameraError && (
                  <div className="mt-4">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-secondary-text">
                      <Mic className="size-3.5" aria-hidden />
                      Microphone level
                    </p>
                    <div
                      className="mt-1.5 h-2 overflow-hidden rounded-full bg-neutral-soft dark:bg-white/10"
                      role="meter"
                      aria-label="Microphone level"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(level * 100)}
                    >
                      <div
                        className="h-full rounded-full bg-green transition-[width] duration-100"
                        style={{ width: `${Math.round(level * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  <Button type="button" variant="ghost" onClick={() => setStep("prompts")}>
                    <ArrowLeft aria-hidden />
                    Prompts
                  </Button>
                  <Button type="button" className="ml-auto rounded-xl" onClick={startRecording} disabled={!stream}>
                    <Circle className="fill-current" aria-hidden />
                    Start recording
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold tracking-wide text-green-dark uppercase">
                  Prompt {promptIndex + 1} of {prompts.length}
                </p>
                <p className="mt-2 text-xl font-semibold text-balance text-primary-text" aria-live="polite">
                  {prompts[promptIndex]}
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {promptIndex < prompts.length - 1 && (
                    <Button type="button" variant="outline" onClick={() => setPromptIndex(promptIndex + 1)}>
                      Next prompt
                      <ArrowRight aria-hidden />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    className="ml-auto rounded-xl"
                    onClick={() => recorderRef.current?.stop()}
                  >
                    <Square className="fill-current" aria-hidden />
                    Stop
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {step === "review" && take && (
        <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <video
            src={take.url}
            controls
            playsInline
            className="aspect-video w-full rounded-2xl bg-brand-black"
            aria-label="Your recording"
          />
          <div className="flex flex-col rounded-2xl border bg-card p-5 dark:bg-white/[0.03]">
            <h2 className="font-semibold text-primary-text">Happy with it?</h2>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-secondary-text">Length</dt>
                <dd className="font-medium text-primary-text">{clock(take.seconds)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-secondary-text">Prompts</dt>
                <dd className="font-medium text-primary-text">{prompts.length}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-secondary-text">Source</dt>
                <dd className="font-medium text-primary-text">
                  {take.source === "recorded" ? "Recorded here" : take.fileName}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-secondary-text">
              Only reviewers of applications you attach it to can watch it, unless you change that in settings.
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => (take.source === "recorded" ? setStep("check") : fileRef.current?.click())}
              >
                <RotateCcw aria-hidden />
                {take.source === "recorded" ? "Retake" : "Choose another"}
              </Button>
              <Button type="button" className="ml-auto rounded-xl" onClick={save} disabled={saving}>
                {saving ? <Loader2 className="animate-spin" aria-hidden /> : <Check aria-hidden />}
                Use this video
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
