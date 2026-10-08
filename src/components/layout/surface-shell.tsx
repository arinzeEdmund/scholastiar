import type { ReactNode } from "react";

import type { UserProfile } from "@/data/types";
import type { ShellKey } from "@/config/personas";

import { CandidateShell } from "./candidate-shell";
import { PublicShell } from "./public-shell";
import { SidebarShell } from "./sidebar-shell";
import type { ShellUser } from "./user-menu";

const SURFACE_LABELS: Record<Exclude<ShellKey, "public" | "candidate">, string> = {
  employer: "Employer workspace",
  provider: "Provider workspace",
  forwarder: "Forwarder workspace",
  office: "Office workspace",
  admin: "Admin console",
};

/** Renders the frame for a product surface. Route-group layouts use this. */
export function SurfaceShell({
  shell,
  user,
  unreadCount = 0,
  children,
}: {
  shell: ShellKey;
  user: UserProfile | null;
  /** Unread in-app notifications (bell dot). */
  unreadCount?: number;
  children: ReactNode;
}) {
  if (shell === "public" || !user) return <PublicShell>{children}</PublicShell>;

  const shellUser: ShellUser = { name: user.full_name, email: user.email, subtitle: user.headline };

  if (shell === "candidate")
    return (
      <CandidateShell user={shellUser} unreadCount={unreadCount}>
        {children}
      </CandidateShell>
    );

  const isPartnerAgency = user.primary_role === "partner_agency";
  const surfaceLabel = isPartnerAgency ? "Partner agency workspace" : SURFACE_LABELS[shell];

  return (
    <SidebarShell
      user={shellUser}
      nav={isPartnerAgency ? "partner_agency" : shell}
      surfaceLabel={surfaceLabel}
      organizationName={user.organization_name}
    >
      {children}
    </SidebarShell>
  );
}
