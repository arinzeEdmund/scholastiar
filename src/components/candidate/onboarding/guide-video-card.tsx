"use client";

import { Captions, Play, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import portrait from "@/assets/guide/nkechinyere.jpg";
import { GUIDE, WELCOME_SCRIPT, WELCOME_VIDEO } from "@/lib/candidate/guide";
import { cn } from "@/lib/utils";

/**
 * Nkechinyere's welcome video in the guide card. The portrait is the cover; play swaps in the
 * video with captions on. Without a video file yet, the card says so and offers the transcript.
 */
export function GuideVideoCard({ videoAvailable, durationLabel }: { videoAvailable: boolean; durationLabel: string }) {
  const [state, setState] = useState<"cover" | "playing" | "ended">("cover");
  const [showTranscript, setShowTranscript] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div>
      <figure className="relative overflow-hidden rounded-3xl bg-near-black shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)] ring-1 ring-black/5 dark:ring-white/10">
        {state === "playing" ? (
          <video
            ref={videoRef}
            src={WELCOME_VIDEO.src}
            poster={portrait.src}
            autoPlay
            controls
            playsInline
            onEnded={() => setState("ended")}
            className="aspect-[16/10] w-full bg-near-black object-cover lg:aspect-[4/5]"
            aria-label={`Welcome video from ${GUIDE.name}`}
          >
            <track kind="captions" src={WELCOME_VIDEO.captions} srcLang="en" label="English" default />
          </video>
        ) : (
          <>
            <Image
              src={portrait}
              alt={`${GUIDE.name}, your onboarding guide`}
              placeholder="blur"
              priority
              sizes="(min-width: 1024px) 320px, 100vw"
              className="aspect-[16/10] h-auto w-full object-cover object-[50%_28%] lg:aspect-[4/5] lg:object-[50%_20%]"
            />
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/10" />
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[0.6875rem] font-medium text-white backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-mint" />
              </span>
              Here to help
            </span>

            {videoAvailable ? (
              <button
                type="button"
                onClick={() => setState("playing")}
                className="group absolute inset-0 flex items-center justify-center focus-visible:outline-none"
                aria-label={`${state === "ended" ? "Replay" : "Play"} welcome video from ${GUIDE.name}, ${durationLabel}`}
              >
                <span className="relative flex size-16 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/40 backdrop-blur-md transition-transform group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-mint">
                  <span
                    aria-hidden
                    className="absolute inset-0 animate-ping rounded-full bg-white/20 motion-reduce:animate-none"
                  />
                  {state === "ended" ? (
                    <RotateCcw className="size-6" aria-hidden />
                  ) : (
                    <Play className="ml-1 size-7 fill-white" aria-hidden />
                  )}
                </span>
              </button>
            ) : (
              <span className="absolute top-3 right-3 rounded-full bg-black/45 px-2.5 py-1 text-[0.6875rem] font-medium text-white backdrop-blur">
                Video coming soon
              </span>
            )}

            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
              <span className="min-w-0">
                <span className="block text-xl font-semibold tracking-tight">{GUIDE.name}</span>
                <span className="block text-sm text-white/75">{GUIDE.role}</span>
              </span>
              {videoAvailable && (
                <span className="mb-0.5 inline-flex shrink-0 items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-xs font-medium whitespace-nowrap tabular-nums backdrop-blur">
                  <Play className="size-3 fill-white" aria-hidden />
                  {state === "ended" ? "Again" : durationLabel}
                </span>
              )}
            </figcaption>
          </>
        )}
      </figure>

      {videoAvailable && (
        <button
          type="button"
          aria-expanded={showTranscript}
          aria-controls="guide-transcript"
          onClick={() => setShowTranscript((v) => !v)}
          className="mt-2.5 inline-flex items-center gap-1.5 px-1 text-xs font-medium text-secondary-text hover:text-primary-text"
        >
          <Captions className="size-3.5" aria-hidden />
          {showTranscript ? "Hide transcript" : "Read the transcript"}
        </button>
      )}
      {videoAvailable && showTranscript && (
        <div
          id="guide-transcript"
          className={cn(
            "mt-2 space-y-2 rounded-2xl border bg-card p-4 text-sm leading-relaxed text-primary-text/90 dark:bg-white/[0.03]",
          )}
        >
          {WELCOME_SCRIPT.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
