import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Full-width editorial section for public pages. */
export function MarketingSection({
  eyebrow,
  title,
  description,
  children,
  tone = "white",
  align = "left",
  className,
  id,
  headingLevel = 2,
}: {
  eyebrow?: string;
  title?: string;
  description?: ReactNode;
  children?: ReactNode;
  /** aurora: pale with green blooms (page heroes); dark: brand black lit by a green glow. */
  tone?: "white" | "soft" | "aurora" | "dark";
  align?: "left" | "center";
  className?: string;
  id?: string;
  headingLevel?: 1 | 2;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const dark = tone === "dark";
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-20",
        tone === "soft" && "bg-soft",
        tone === "aurora" && "grain-light aurora-light",
        dark && "grain aurora-dark-side text-white",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {(eyebrow || title || description) && (
          <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
            {eyebrow && (
              <p className={cn("text-sm font-semibold", dark ? "text-mint" : "text-green-dark")}>{eyebrow}</p>
            )}
            {title && (
              <Heading
                className={cn(
                  "mt-2 font-bold text-balance",
                  headingLevel === 1 ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl",
                  dark ? "text-white" : "text-primary-text",
                )}
              >
                {title}
              </Heading>
            )}
            {description && (
              <div className={cn("mt-4 text-lg", dark ? "text-white/75" : "text-secondary-text")}>{description}</div>
            )}
          </div>
        )}
        {children && <div className={cn(title || description ? "mt-10 sm:mt-12" : undefined)}>{children}</div>}
      </div>
    </section>
  );
}
