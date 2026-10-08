import {
  Award,
  Calculator,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  Lock,
  Plane,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

// Sign-up prompts for public catalogue pages (SERVICES/21-study-catalogue.md → Sign-Up Prompts).
// Each tile shows what Scholastiar would tell this visitor, locked, and opens sign-up.

interface Preview {
  icon: LucideIcon;
  title: string;
  teaser: string;
}

export function LockedPreviews({
  signUpHref,
  documentCount,
  scholarshipCount,
  countryName,
  className,
}: {
  signUpHref: string;
  documentCount: number;
  scholarshipCount: number;
  countryName: string;
  className?: string;
}) {
  const previews: Preview[] = [
    { icon: Gauge, title: "Your fit score", teaser: "See how well you fit, and what would raise your chances" },
    { icon: ClipboardCheck, title: "Eligibility check", teaser: "Check if you meet the entry requirements" },
    {
      icon: FileCheck2,
      title: "Document readiness",
      teaser: `${documentCount} document${documentCount === 1 ? "" : "s"} needed — see which ones you already have`,
    },
    {
      icon: Award,
      title: "Scholarships for you",
      teaser:
        scholarshipCount > 0
          ? `${scholarshipCount} scholarship${scholarshipCount === 1 ? "" : "s"} could fund this — check if you're eligible`
          : "Find scholarships you're eligible for",
    },
    { icon: Calculator, title: "Your total cost", teaser: "Tuition, living and moving costs for your situation" },
    { icon: Plane, title: "Visa and arrival steps", teaser: `Every step to get to ${countryName} and settle in` },
    { icon: Sparkles, title: "AI application help", teaser: "We draft your statement and answers from your profile" },
  ];

  return (
    <section
      aria-labelledby="locked-previews"
      className={cn("rounded-2xl border bg-card p-4 sm:p-5 dark:bg-white/[0.03]", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="locked-previews" className="font-semibold text-primary-text">
            See what this means for you
          </h2>
          <p className="text-sm text-secondary-text">
            Create your profile once and Scholastiar works it out for every programme.
          </p>
        </div>
        <Link
          href={signUpHref}
          className="inline-flex h-9 items-center rounded-lg bg-primary px-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Sign up to unlock
        </Link>
      </div>
      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {previews.map(({ icon: Icon, title, teaser }) => (
          <li key={title}>
            <Link
              href={signUpHref}
              className="group flex h-full items-start gap-3 rounded-xl border border-dashed p-3 transition-colors hover:border-green/50 hover:bg-soft dark:hover:bg-white/5"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-soft-green text-green-dark dark:bg-green/15">
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-primary-text">
                  {title}
                  <Lock className="size-3 text-subtle-text group-hover:text-green-dark" aria-label="Locked" />
                </span>
                <span className="block text-xs text-secondary-text">{teaser}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
