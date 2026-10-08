"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { isRouteReady, routeStage } from "@/config/routes";

type ButtonProps = Omit<ComponentProps<typeof Button>, "asChild" | "children">;

/**
 * A button that navigates. If the destination screen isn't built yet it renders
 * disabled with a tooltip naming the stage that builds it — never a dead link.
 */
export function RouteButton({ href, children, ...props }: ButtonProps & { href: string; children: ReactNode }) {
  if (isRouteReady(href)) {
    return (
      <Button asChild {...props}>
        <Link href={href}>{children}</Link>
      </Button>
    );
  }

  const stage = routeStage(href);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="inline-flex rounded-lg *:w-full">
          <Button {...props} disabled aria-disabled="true">
            {children}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{stage ? `Built in stage ${stage}` : "Not built yet"}</TooltipContent>
    </Tooltip>
  );
}
