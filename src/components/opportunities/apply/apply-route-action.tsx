import { ArrowRight, ExternalLink, Handshake, Send, UserPlus } from "lucide-react";
import Link from "next/link";

import { RouteButton } from "@/components/layout/route-button";
import { Button } from "@/components/ui/button";
import { APPLY_ROUTE_LABELS } from "@/config/catalogue";
import type { ApplyRoute } from "@/data/types";
import { cn } from "@/lib/utils";

const ICONS = { hosted: Send, partner: Handshake, official: ExternalLink } as const;

/**
 * The apply button for one programme or scholarship (SERVICES/21-study-catalogue.md →
 * The Apply Button). Visitors are sent to sign-up; students start on Scholastiar whatever the route.
 */
export function ApplyRouteAction({
  route,
  applyHref,
  signUpHref,
  className,
}: {
  route: ApplyRoute;
  applyHref: string;
  /** Set for visitors. */
  signUpHref?: string;
  className?: string;
}) {
  if (signUpHref) {
    return (
      <div className={cn("space-y-1.5", className)}>
        <Button asChild size="lg" className="w-full rounded-xl">
          <Link href={signUpHref}>
            <UserPlus aria-hidden />
            Sign up to apply
          </Link>
        </Button>
        <p className="text-center text-xs text-secondary-text">Your profile does the hard work on every application.</p>
      </div>
    );
  }

  const Icon = ICONS[route];
  const { button, note } = APPLY_ROUTE_LABELS[route];
  return (
    <div className={cn("space-y-1.5", className)}>
      {/* Until the apply screens exist, RouteButton wraps a disabled button in a span: stretch it too. */}
      <div className="[&>span]:flex [&>span]:w-full">
        <RouteButton href={applyHref} size="lg" className="w-full rounded-xl">
          <Icon aria-hidden />
          <span className="truncate">{button}</span>
          <ArrowRight aria-hidden />
        </RouteButton>
      </div>
      <p className="text-center text-xs text-secondary-text">{note}</p>
    </div>
  );
}
