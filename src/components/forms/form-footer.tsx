import { ArrowLeft, ArrowRight, CloudCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** The floating bar shell shared by form footers and the onboarding finish bar. */
export function ActionBar({
  sticky = true,
  aboveTabs = false,
  className,
  children,
}: {
  sticky?: boolean;
  /** Candidate workspace pages have mobile bottom tabs; onboarding doesn't. */
  aboveTabs?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mt-8 rounded-2xl border bg-card/85 p-2 shadow-[0_18px_40px_-22px_rgb(0_0_0/0.35)] backdrop-blur-xl supports-[backdrop-filter]:bg-card/70 dark:bg-white/[0.04] dark:shadow-[0_18px_40px_-20px_rgb(0_0_0/0.8)]",
        sticky &&
          cn(
            "sticky z-20",
            aboveTabs
              ? "bottom-[calc(4.75rem+env(safe-area-inset-bottom))] lg:bottom-4"
              : "bottom-[calc(0.75rem+env(safe-area-inset-bottom))] sm:bottom-4",
          ),
        !sticky && "mt-5",
        className,
      )}
    >
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

export function BackLink({ href, label = "Back" }: { href: string; label?: string }) {
  return (
    <Button asChild variant="ghost" className="h-11 rounded-xl px-3.5 text-secondary-text hover:text-primary-text">
      <Link href={href}>
        <ArrowLeft aria-hidden />
        {label}
      </Link>
    </Button>
  );
}

export function BarHint({ children }: { children: ReactNode }) {
  return (
    <span className="hidden min-w-0 items-center gap-1.5 truncate px-1 text-xs text-secondary-text sm:flex">
      <CloudCheck className="size-4 shrink-0 text-green-dark" aria-hidden />
      {children}
    </span>
  );
}

/** Primary action: solid green with a soft glow and an arrow chip. */
export function PrimaryAction({
  pending,
  label,
  icon,
  arrow = false,
  type = "submit",
  onClick,
}: {
  pending: boolean;
  label: string;
  icon?: ReactNode;
  arrow?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={pending}
      className={cn(
        "group ml-auto h-11 gap-2.5 rounded-xl pl-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_10px_24px_-12px_var(--color-green-action)]",
        arrow ? "pr-2" : "pr-5",
      )}
    >
      {pending ? <Loader2 className="animate-spin" aria-hidden /> : icon}
      {label}
      {arrow && (
        <span className="flex size-7 items-center justify-center rounded-lg bg-white/15 transition-transform group-hover:translate-x-0.5">
          <ArrowRight className="size-4" aria-hidden />
        </span>
      )}
    </Button>
  );
}

/**
 * Bottom action row for long forms. Sticks to the bottom of the viewport so Save is always
 * reachable; sits above the mobile bottom tabs.
 */
export function FormFooter({
  pending,
  submitLabel,
  backHref,
  backLabel = "Back",
  secondary,
  continueArrow = false,
  aboveTabs = false,
  sticky = true,
  hint,
  className,
}: {
  pending: boolean;
  submitLabel: string;
  backHref?: string;
  backLabel?: string;
  secondary?: ReactNode;
  continueArrow?: boolean;
  aboveTabs?: boolean;
  /** Pages with several forms use in-flow footers so save bars don't stack. */
  sticky?: boolean;
  hint?: string;
  className?: string;
}) {
  return (
    <ActionBar sticky={sticky} aboveTabs={aboveTabs} className={className}>
      {backHref && <BackLink href={backHref} label={backLabel} />}
      <BarHint>
        {hint ?? (continueArrow ? "Your answers save when you continue" : "Changes save to your profile")}
      </BarHint>
      {secondary}
      <PrimaryAction pending={pending} label={submitLabel} arrow={continueArrow} />
    </ActionBar>
  );
}
