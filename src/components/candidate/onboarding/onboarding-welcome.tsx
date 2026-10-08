"use client";

import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Lock,
  MessageCircleQuestion,
  Pencil,
  Save,
  Sparkles,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";

import portrait from "@/assets/guide/nkechinyere.jpg";
import { Button } from "@/components/ui/button";

import { GuideVideoCard } from "./guide-video-card";
import { tokenize, useGuideVoice } from "./use-guide-voice";
import { ONBOARDING_STEPS, type OnboardingStep } from "@/data/types/candidate";
import { GUIDE, GUIDE_QUESTIONS, STEP_GUIDE, type GuideQuestion } from "@/lib/candidate/guide";
import { ONBOARDING } from "@/lib/candidate/labels";
import { cn } from "@/lib/utils";

type Stage = "new" | "started" | "finished";

const ANSWER_DELAY_MS = 900;

function Avatar({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <Image
      src={portrait}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover object-[50%_28%] ring-2 ring-card", className)}
      style={{ width: size, height: size }}
    />
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-hidden>
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="size-1.5 animate-guide-dot rounded-full bg-secondary-text"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}

/** One of Nkechinyere's messages. `delay` staggers the opening conversation (CSS only). */
function GuideBubble({ children, delay, avatar = true }: { children: ReactNode; delay?: number; avatar?: boolean }) {
  return (
    <li
      className={cn("flex items-end gap-2.5", delay !== undefined && "animate-guide-in")}
      style={delay !== undefined ? { animationDelay: `${delay}ms` } : undefined}
    >
      {avatar ? <Avatar size={30} /> : <span className="w-[30px] shrink-0" aria-hidden />}
      <div className="max-w-[34rem] rounded-2xl rounded-bl-md bg-soft px-3.5 py-2.5 text-[0.9375rem] leading-relaxed text-primary-text dark:bg-white/[0.06]">
        {children}
      </div>
    </li>
  );
}

function UserBubble({ children }: { children: ReactNode }) {
  return (
    <li className="flex animate-guide-in justify-end">
      <div className="max-w-[28rem] rounded-2xl rounded-br-md bg-green-action px-3.5 py-2.5 text-[0.9375rem] text-white">
        {children}
      </div>
    </li>
  );
}

/** Answer bubble that is read aloud, with the spoken word highlighted as it goes. */
function SpokenAnswer({
  text,
  speaking,
  wordIndex,
  canSpeak,
  onReplay,
  onStop,
}: {
  text: string;
  speaking: boolean;
  wordIndex: number;
  canSpeak: boolean;
  onReplay: () => void;
  onStop: () => void;
}) {
  const words = tokenize(text);
  const progress = speaking && words.length ? Math.min(100, ((wordIndex + 1) / words.length) * 100) : 0;
  return (
    <li className="flex animate-guide-in items-end gap-2.5">
      <Avatar size={30} />
      <div
        className={cn(
          "relative max-w-[34rem] overflow-hidden rounded-2xl rounded-bl-md bg-soft px-3.5 pt-2.5 pb-2 text-[0.9375rem] leading-relaxed text-primary-text transition-shadow dark:bg-white/[0.06]",
          speaking && "shadow-[0_0_0_2px_rgb(16_182_91/0.35),0_10px_30px_-12px_rgb(16_182_91/0.45)]",
        )}
      >
        <p aria-label={text}>
          {words.map((word, i) => (
            <span key={i} aria-hidden>
              <span
                className={cn(
                  "rounded-md transition-[color,background-color,box-shadow] duration-200 motion-reduce:transition-none",
                  speaking && i < wordIndex && "text-primary-text",
                  speaking &&
                    i === wordIndex &&
                    "bg-green/20 text-green-dark shadow-[0_0_0_3px_rgb(16_182_91/0.2)] dark:bg-green/25",
                  speaking && i > wordIndex && "text-secondary-text/55",
                )}
              >
                {word.text}
              </span>{" "}
            </span>
          ))}
        </p>
        {canSpeak && (
          <div className="mt-1.5 flex items-center justify-between gap-3">
            {speaking ? (
              <span className="flex items-center gap-1.5 text-[0.6875rem] font-medium text-green-dark">
                <span className="flex h-3 items-end gap-0.5" aria-hidden>
                  {[0, 150, 75, 225].map((delay) => (
                    <span
                      key={delay}
                      className="w-0.5 animate-guide-bar rounded-full bg-green"
                      style={{ height: "100%", animationDelay: `${delay}ms` }}
                    />
                  ))}
                </span>
                Speaking…
              </span>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={speaking ? onStop : onReplay}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium text-secondary-text transition-colors hover:bg-black/5 hover:text-primary-text dark:hover:bg-white/10"
            >
              {speaking ? (
                <Square className="size-3 fill-current" aria-hidden />
              ) : (
                <Volume2 className="size-3.5" aria-hidden />
              )}
              {speaking ? "Stop" : "Listen"}
            </button>
          </div>
        )}
        {speaking && (
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-green/15">
            <span
              className="block h-full bg-green transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </span>
        )}
      </div>
    </li>
  );
}

function openingLines(
  stage: Stage,
  firstName: string,
  done: number,
  next: OnboardingStep,
  minutes: number,
): ReactNode[] {
  if (stage === "finished") {
    return [
      <>Nicely done, {firstName} — every step is complete.</>,
      <>Keep it up to date: every change flows into your CV and applications automatically.</>,
    ];
  }
  if (stage === "started") {
    return [
      <>
        Welcome back, {firstName}. You&apos;ve finished{" "}
        <strong>
          {done} of {ONBOARDING_STEPS.length}
        </strong>{" "}
        steps — everything so far is saved.
      </>,
      <>
        Next up: <strong>{ONBOARDING[next].title.toLowerCase()}</strong>. {STEP_GUIDE[next].why}
      </>,
    ];
  }
  return [
    <>
      Hi {firstName}, I&apos;m <strong>{GUIDE.name}</strong>. I&apos;ll guide you through setting up your Scholastiar
      profile.
    </>,
    <>
      It&apos;s a short interview — {ONBOARDING_STEPS.length} steps, about {minutes} minutes — and you only do it once.
      Everything saves as you go.
    </>,
    <>
      Please take your time with it: your answers become your CV, your application drafts and your visa guidance.{" "}
      <strong>The more complete and honest you are, the stronger every application gets.</strong>
    </>,
  ];
}

export function OnboardingWelcome({
  firstName,
  stage,
  completedSteps,
  currentStep,
  minutes,
  videoAvailable,
  videoDuration,
}: {
  firstName: string;
  stage: Stage;
  completedSteps: OnboardingStep[];
  currentStep: OnboardingStep;
  minutes: number;
  videoAvailable: boolean;
  videoDuration: string;
}) {
  const done = new Set(completedSteps);
  const [conversation, setConversation] = useState<{ id: GuideQuestion["id"]; answered: boolean }[]>([]);
  const [openStep, setOpenStep] = useState<OnboardingStep | null>(stage === "started" ? currentStep : null);
  const stepsRef = useRef<HTMLElement>(null);
  const voice = useGuideVoice();
  const chatEndRef = useRef<HTMLLIElement>(null);

  const lines = openingLines(stage, firstName, done.size, currentStep, minutes);
  // Stagger: each line appears ~1.3s after the previous one; typing dots fill the gaps.
  const delays = lines.map((_, i) => 250 + i * 1300);
  const introEnd = delays[delays.length - 1] + 300;
  const waiting = conversation.some((c) => !c.answered);
  const remaining = GUIDE_QUESTIONS.filter((q) => !conversation.some((c) => c.id === q.id));

  const ctaHref = stage === "finished" ? "/dashboard" : `/onboarding/${currentStep}`;
  const ctaLabel =
    stage === "finished"
      ? "Go to your dashboard"
      : stage === "started"
        ? `Continue: ${ONBOARDING[currentStep].short}`
        : "Start with step 1";

  function ask(question: GuideQuestion) {
    if (waiting) return;
    voice.stop();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setConversation((c) => [...c, { id: question.id, answered: reduce }]);
    const finish = () => {
      setConversation((c) => c.map((entry) => (entry.id === question.id ? { ...entry, answered: true } : entry)));
      voice.speak(question.id, question.answer);
      if (question.id === "steps") {
        setOpenStep((current) => current ?? "personal");
        stepsRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      } else {
        chatEndRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
      }
    };
    if (reduce) finish();
    else window.setTimeout(finish, ANSWER_DELAY_MS);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-12">
      {/* Guide card with welcome video */}
      <aside>
        <div className="lg:sticky lg:top-6">
          <GuideVideoCard videoAvailable={videoAvailable} durationLabel={videoDuration} />
          <dl className="mt-4 hidden grid-cols-3 gap-2 text-center lg:grid">
            {[
              { label: "Steps", value: String(ONBOARDING_STEPS.length) },
              { label: "Minutes", value: `~${minutes}` },
              { label: "Saved", value: stage === "new" ? "Each step" : `${done.size}/${ONBOARDING_STEPS.length}` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border bg-card px-2 py-3 shadow-xs dark:bg-white/[0.03]">
                <dt className="text-[0.6875rem] text-secondary-text">{stat.label}</dt>
                <dd className="mt-0.5 text-sm font-semibold text-primary-text">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>

      <div className="min-w-0">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-green/25 bg-soft-green/70 px-2.5 py-1 text-xs font-semibold text-green-dark dark:bg-green/10">
          <Sparkles className="size-3.5" aria-hidden />
          {stage === "finished" ? "Profile set up" : stage === "started" ? "Welcome back" : "Let's get you set up"}
        </span>
        <h1 className="mt-4 text-[2rem] leading-[1.1] font-bold tracking-tight text-balance text-foreground sm:text-[2.5rem]">
          {stage === "finished"
            ? "Your profile is ready"
            : stage === "started"
              ? `Let's finish your profile, ${firstName}`
              : "Build your profile once. Use it everywhere."}
        </h1>

        {stage === "started" && (
          <div
            className="mt-5 flex items-center gap-3"
            aria-label={`${done.size} of ${ONBOARDING_STEPS.length} steps done`}
          >
            <div className="flex flex-1 gap-1" aria-hidden>
              {ONBOARDING_STEPS.map((step) => (
                <span
                  key={step}
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    done.has(step)
                      ? "bg-green"
                      : step === currentStep
                        ? "bg-green/40"
                        : "bg-neutral-soft dark:bg-white/10",
                  )}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-secondary-text">
              {done.size}/{ONBOARDING_STEPS.length}
            </span>
          </div>
        )}

        {/* Conversation */}
        <section
          aria-label={`Message from ${GUIDE.name}`}
          className="mt-6 overflow-hidden rounded-3xl border bg-card shadow-xs dark:bg-white/[0.03]"
        >
          <ol className="space-y-2.5 p-4 sm:p-5" aria-live="polite">
            {lines.map((line, index) => (
              <GuideBubble key={index} delay={delays[index]} avatar={index === lines.length - 1}>
                {line}
              </GuideBubble>
            ))}
            <li
              aria-hidden
              className="flex animate-guide-typing items-end gap-2.5"
              style={{ "--guide-total": `${introEnd - 200}ms` } as CSSProperties}
            >
              <Avatar size={30} />
              <span className="rounded-2xl rounded-bl-md bg-soft px-3.5 py-2 dark:bg-white/[0.06]">
                <TypingDots />
              </span>
            </li>
            {conversation.map(({ id, answered }) => {
              const q = GUIDE_QUESTIONS.find((item) => item.id === id)!;
              return (
                <li key={id} className="space-y-2.5">
                  <ol className="space-y-2.5">
                    <UserBubble>{q.question}</UserBubble>
                    {answered ? (
                      <SpokenAnswer
                        text={q.answer}
                        speaking={voice.speakingId === q.id}
                        wordIndex={voice.speakingId === q.id ? voice.wordIndex : -1}
                        canSpeak={voice.supported && voice.enabled}
                        onReplay={() => voice.speak(q.id, q.answer)}
                        onStop={voice.stop}
                      />
                    ) : (
                      <li className="flex items-end gap-2.5" aria-label={`${GUIDE.name} is typing`}>
                        <Avatar size={30} />
                        <span className="rounded-2xl rounded-bl-md bg-soft px-3.5 py-2 dark:bg-white/[0.06]">
                          <TypingDots />
                        </span>
                      </li>
                    )}
                  </ol>
                </li>
              );
            })}
            <li ref={chatEndRef} aria-hidden />
          </ol>

          {remaining.length > 0 && (
            <div
              className="animate-guide-in border-t bg-soft/50 px-4 py-3 sm:px-5 dark:bg-white/[0.02]"
              style={{ animationDelay: `${introEnd}ms` }}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="flex items-center gap-1.5 text-[0.6875rem] font-medium text-secondary-text">
                  <MessageCircleQuestion className="size-3.5" aria-hidden />
                  Ask {GUIDE.name}
                </p>
                {voice.supported && (
                  <button
                    type="button"
                    aria-pressed={voice.enabled}
                    onClick={() => voice.setEnabled(!voice.enabled)}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium text-secondary-text transition-colors hover:bg-black/5 hover:text-primary-text dark:hover:bg-white/10"
                  >
                    {voice.enabled ? (
                      <Volume2 className="size-3.5" aria-hidden />
                    ) : (
                      <VolumeX className="size-3.5" aria-hidden />
                    )}
                    Voice {voice.enabled ? "on" : "off"}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {remaining.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => ask(q)}
                    disabled={waiting}
                    className="rounded-full border border-green/30 bg-card px-3 py-1.5 text-sm font-medium text-green-dark transition-all hover:-translate-y-px hover:border-green-action hover:shadow-sm disabled:opacity-50 dark:bg-white/[0.04]"
                  >
                    {q.question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Primary action */}
        <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary-text">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden />
              About {minutes} minutes
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Save className="size-3.5" aria-hidden />
              Saves every step
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="size-3.5" aria-hidden />
              Private until you apply
            </span>
          </p>
          <Button
            asChild
            size="lg"
            className="h-12 rounded-xl px-6 shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_10px_24px_-12px_var(--color-green-action)]"
          >
            <Link href={ctaHref}>
              {ctaLabel}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>

        {stage === "finished" && (
          <p className="mt-3 text-right text-sm">
            <Link href="/onboarding/review" className="font-medium text-green-dark hover:underline">
              Review your answers
            </Link>
          </p>
        )}

        {/* Steps explorer */}
        <section ref={stepsRef} aria-labelledby="steps-title" className="mt-10 scroll-mt-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 id="steps-title" className="text-lg font-semibold text-primary-text">
                What we&apos;ll cover
              </h2>
              <p className="text-sm text-secondary-text">Open a step to see what {GUIDE.name} will ask, and why.</p>
            </div>
          </div>
          <ol className="mt-4 overflow-hidden rounded-3xl border bg-card shadow-xs dark:bg-white/[0.03]">
            {ONBOARDING_STEPS.map((step, index) => {
              const complete = done.has(step);
              const current = stage !== "finished" && step === currentStep;
              const open = openStep === step;
              return (
                <li
                  key={step}
                  className={cn("border-b last:border-b-0", current && "bg-soft-green/30 dark:bg-green/[0.06]")}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`step-panel-${step}`}
                      onClick={() => setOpenStep(open ? null : step)}
                      className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-soft/60 sm:px-5 dark:hover:bg-white/[0.03]"
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                          complete
                            ? "bg-green text-white"
                            : current
                              ? "bg-green-action text-white ring-4 ring-green/20"
                              : "bg-neutral-soft text-secondary-text dark:bg-white/10",
                        )}
                      >
                        {complete ? <Check className="size-4" strokeWidth={3} aria-hidden /> : index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-2 text-sm font-semibold text-primary-text">
                          {ONBOARDING[step].title}
                          {step === "personality-cv" && (
                            <span className="text-xs font-normal text-secondary-text">Optional</span>
                          )}
                          {current && (
                            <span className="rounded-full bg-green-action px-1.5 py-px text-[0.625rem] font-semibold tracking-wide text-white uppercase">
                              Up next
                            </span>
                          )}
                        </span>
                        <span className="block truncate text-xs text-secondary-text">
                          {ONBOARDING[step].description}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs text-secondary-text">
                        {complete ? (
                          <span className="font-medium text-green-dark">Done</span>
                        ) : (
                          `${ONBOARDING[step].minutes} min`
                        )}
                      </span>
                      <ChevronDown
                        className={cn("size-4 shrink-0 text-subtle-text transition-transform", open && "rotate-180")}
                        aria-hidden
                      />
                    </button>
                  </h3>
                  {open && (
                    <div
                      id={`step-panel-${step}`}
                      className="animate-guide-in px-4 pb-4 sm:px-5"
                      style={{ animationDuration: "0.25s" }}
                    >
                      <div className="flex gap-3 rounded-2xl bg-soft px-4 py-3.5 sm:ml-11 dark:bg-white/[0.04]">
                        <Avatar size={28} />
                        <dl className="grid flex-1 gap-3 text-sm sm:grid-cols-2">
                          <div>
                            <dt className="text-[0.6875rem] font-medium tracking-wide text-secondary-text uppercase">
                              I&apos;ll ask about
                            </dt>
                            <dd className="mt-1 text-primary-text">{STEP_GUIDE[step].ask}</dd>
                          </div>
                          <div>
                            <dt className="text-[0.6875rem] font-medium tracking-wide text-secondary-text uppercase">
                              Why it matters
                            </dt>
                            <dd className="mt-1 text-primary-text">{STEP_GUIDE[step].why}</dd>
                          </div>
                        </dl>
                      </div>
                      {(complete || current) && (
                        <div className="mt-2.5 flex justify-end">
                          <Link
                            href={`/onboarding/${step}`}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-green-dark hover:bg-soft-green/60 dark:hover:bg-green/10"
                          >
                            {complete ? (
                              <Pencil className="size-3" aria-hidden />
                            ) : (
                              <ArrowRight className="size-3" aria-hidden />
                            )}
                            {complete ? "Edit this step" : "Go to this step"}
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
}
