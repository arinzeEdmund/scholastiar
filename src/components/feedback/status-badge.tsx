import { AlertTriangle, CheckCircle2, Circle, Clock, Info, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

/**
 * Trust/status badge — ux_ui_base.md → Trust And Verification UI.
 * Always icon + text, never colour alone.
 */
const TONES = {
  verified: { variant: "success", Icon: CheckCircle2 },
  success: { variant: "success", Icon: CheckCircle2 },
  review: { variant: "warning", Icon: Clock },
  warning: { variant: "warning", Icon: AlertTriangle },
  risky: { variant: "danger", Icon: ShieldAlert },
  info: { variant: "info", Icon: Info },
  pending: { variant: "neutral", Icon: Circle },
} as const;

export type StatusTone = keyof typeof TONES;

export function StatusBadge({ tone, children }: { tone: StatusTone; children: ReactNode }) {
  const { variant, Icon } = TONES[tone];
  return (
    <Badge variant={variant}>
      <Icon aria-hidden />
      {children}
    </Badge>
  );
}
