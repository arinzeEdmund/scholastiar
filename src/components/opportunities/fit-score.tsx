"use client";

import { Info, Lock, Minus, Plus } from "lucide-react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Fit } from "@/lib/catalogue/fit";
import { cn } from "@/lib/utils";

function Ring({ value, size = 40 }: { value: number; size?: number }) {
  const radius = 15.5;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} className="-rotate-90" aria-hidden>
      <circle
        cx="18"
        cy="18"
        r={radius}
        fill="none"
        strokeWidth="4"
        className="stroke-soft-green dark:stroke-white/10"
      />
      <circle
        cx="18"
        cy="18"
        r={radius}
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        className={value >= 70 ? "stroke-green" : value >= 50 ? "stroke-warning" : "stroke-danger"}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - value / 100)}
      />
    </svg>
  );
}

/** Fit score with the factors behind it. Always an estimate, never a promise. */
export function FitScore({ fit, className }: { fit: Fit; className?: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "group inline-flex items-center gap-2 rounded-xl py-1 pr-2 pl-1 text-left transition-colors hover:bg-soft focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:hover:bg-white/5",
            className,
          )}
          aria-label={`${fit.score}% fit — see why`}
        >
          <span className="relative flex items-center justify-center">
            <Ring value={fit.score} />
            <span className="absolute text-[0.6875rem] font-bold text-primary-text tabular-nums">{fit.score}</span>
          </span>
          <span className="leading-tight">
            <span className="block text-xs font-semibold text-primary-text">{fit.score}% fit</span>
            <span className="flex items-center gap-1 text-[0.6875rem] text-secondary-text group-hover:text-green-dark">
              <Info className="size-3" aria-hidden />
              Why?
            </span>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <p className="text-sm font-semibold text-primary-text">How we estimated {fit.score}%</p>
        <ul className="mt-3 space-y-2">
          {fit.factors.map((factor) => (
            <li key={factor.label} className="flex gap-2 text-sm text-secondary-text">
              <span
                className={cn(
                  "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                  factor.effect === "plus" && "bg-soft-green text-green-dark dark:bg-green/15",
                  factor.effect === "minus" && "bg-danger-soft text-danger",
                  factor.effect === "neutral" && "bg-neutral-soft text-secondary-text dark:bg-white/10",
                )}
                aria-hidden
              >
                {factor.effect === "minus" ? (
                  <Minus className="size-3" />
                ) : factor.effect === "plus" ? (
                  <Plus className="size-3" />
                ) : (
                  <Info className="size-2.5" />
                )}
              </span>
              <span>
                <span className="sr-only">
                  {factor.effect === "plus" ? "Helps: " : factor.effect === "minus" ? "Holds back: " : "Note: "}
                </span>
                {factor.label}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 border-t pt-3 text-xs text-secondary-text">
          An estimate from your profile, not a promise of admission or funding. Decisions belong to the university or
          funder.
        </p>
      </PopoverContent>
    </Popover>
  );
}

/** Visitor version: no number, a lock and a reason to sign up. */
export function LockedFitScore({ href, className }: { href: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 rounded-xl py-1 pr-2 pl-1 transition-colors hover:bg-soft focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:hover:bg-white/5",
        className,
      )}
    >
      <span className="relative flex items-center justify-center">
        <span className="blur-[2px]">
          <Ring value={72} />
        </span>
        <Lock className="absolute size-3.5 text-primary-text" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block text-xs font-semibold text-primary-text">Your fit score</span>
        <span className="block text-[0.6875rem] text-secondary-text group-hover:text-green-dark">
          Sign up to see it
        </span>
      </span>
    </Link>
  );
}
