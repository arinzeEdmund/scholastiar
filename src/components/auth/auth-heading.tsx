import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Auth page heading: audience badge, large title and supporting line. */
export function AuthHeading({
  icon: Icon,
  eyebrow,
  title,
  description,
  compact = false,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  /** Badge and a smaller title only — for later steps of a flow. */
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-green/25 bg-soft-green/70 px-2.5 py-1 text-xs font-semibold text-green-dark dark:bg-green/10">
          <Icon className="size-3.5" aria-hidden />
          {eyebrow}
        </span>
        <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
      </div>
    );
  }
  return (
    <div>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-green/25 bg-soft-green/70 px-2.5 py-1 text-xs font-semibold text-green-dark dark:bg-green/10">
        <Icon className="size-3.5" aria-hidden />
        {eyebrow}
      </span>
      <h1 className="mt-4 text-[1.875rem] leading-[1.1] font-bold tracking-tight text-balance text-foreground sm:text-[2.25rem]">
        {title}
      </h1>
      {description && <p className="mt-2.5 text-[0.95rem] leading-relaxed text-secondary-text">{description}</p>}
    </div>
  );
}

/** Primary call to action on auth screens: taller, softly lit. */
export const authCta =
  "h-12 w-full rounded-xl text-[0.95rem] shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_10px_24px_-12px_var(--color-green-action)]";
