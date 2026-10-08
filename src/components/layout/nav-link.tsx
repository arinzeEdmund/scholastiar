"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { NavItem } from "@/config/navigation";
import { isRouteReady, routeStage } from "@/config/routes";
import { cn } from "@/lib/utils";

const EXACT_MATCH = new Set(["/", "/dashboard", "/admin"]);

export function useIsActive(href: string) {
  const pathname = usePathname();
  if (EXACT_MATCH.has(href)) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const VARIANTS = {
  top: {
    base: "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap text-secondary-text transition-colors hover:text-primary-text",
    active: "text-primary-text bg-soft",
  },
  side: {
    base: "flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium text-secondary-text transition-colors hover:bg-soft hover:text-primary-text [&_svg]:size-4 [&_svg]:shrink-0",
    active: "bg-soft-green text-green-dark hover:bg-soft-green hover:text-green-dark",
  },
  tab: {
    base: "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[0.7rem] font-medium text-secondary-text [&_svg]:size-5",
    active: "text-green-dark",
  },
  plain: {
    base: "inline-flex items-center gap-2 text-sm text-secondary-text transition-colors hover:text-primary-text",
    active: "text-primary-text",
  },
} as const;

export function NavLink({
  item,
  variant = "plain",
  className,
  onNavigate,
  hideSoonBadge = false,
}: {
  item: NavItem;
  /** Dim unbuilt links without the "Soon" pill (used where pills would be noisy, e.g. the footer). */
  hideSoonBadge?: boolean;
  variant?: keyof typeof VARIANTS;
  className?: string;
  onNavigate?: ComponentProps<typeof Link>["onClick"];
}) {
  const active = useIsActive(item.href);
  const ready = isRouteReady(item.href);
  const styles = VARIANTS[variant];
  const Icon = item.icon;

  const content = (
    <>
      {Icon && <Icon aria-hidden className={variant === "top" ? "size-4" : undefined} />}
      <span className={cn(variant === "side" && "truncate")}>{item.label}</span>
    </>
  );

  if (!ready) {
    const stage = routeStage(item.href);
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            role="link"
            aria-disabled="true"
            tabIndex={0}
            className={cn(
              styles.base,
              "cursor-not-allowed opacity-60 hover:bg-transparent hover:text-secondary-text",
              className,
            )}
          >
            {content}
            {(variant === "side" || variant === "plain") && !hideSoonBadge && (
              <span className="ml-auto rounded-full bg-neutral-soft px-1.5 py-px text-[0.625rem] font-semibold tracking-wide text-secondary-text uppercase">
                Soon
              </span>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent>{stage ? `Built in stage ${stage}` : "Not built yet"}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(styles.base, active && styles.active, className)}
    >
      {content}
    </Link>
  );
}
