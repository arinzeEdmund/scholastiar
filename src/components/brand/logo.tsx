import Link from "next/link";

import { cn } from "@/lib/utils";

/** "Scholastiar." — the green dot is the brand signal (ux_ui_base.md → Visual Identity). */
export function Logo({
  href = "/",
  className,
  inverted = false,
}: {
  href?: string | null;
  className?: string;
  inverted?: boolean;
}) {
  const mark = (
    <span
      className={cn(
        "text-[1.35rem] leading-none font-bold tracking-normal",
        inverted ? "text-white" : "text-foreground",
        className,
      )}
    >
      Scholastiar<span className="text-green">.</span>
    </span>
  );

  if (href === null) return mark;

  return (
    <Link href={href} aria-label="Scholastiar.ai home" className="inline-flex items-center rounded-sm">
      {mark}
    </Link>
  );
}
