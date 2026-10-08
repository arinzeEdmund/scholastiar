import { PublicShell, type PublicAccount } from "@/components/layout/public-shell";
import { landingFor, nextStepFor } from "@/lib/auth-flow";
import { getSession } from "@/lib/session";

const STEP_LABELS: Record<string, string> = {
  "/auth/choose-role": "Finish sign-up",
  "/billing/checkout": "Finish payment",
  "/auth/verify-email": "Verify your email",
};

export default async function PublicLayout({ children }: LayoutProps<"/">) {
  const session = await getSession();
  let account: PublicAccount | null = null;
  if (session) {
    const href = await nextStepFor(session.user.user_id);
    account = {
      user: { name: session.user.full_name, email: session.user.email, subtitle: session.user.organization_name },
      // Workspaces built in later stages fall back to "/", which needs no header button.
      next: href === "/" ? null : { href, label: STEP_LABELS[href] ?? landingFor(session.user).label },
    };
  }
  return <PublicShell account={account}>{children}</PublicShell>;
}
