import { SurfaceShell } from "@/components/layout/surface-shell";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";

/** Candidate workspace: signed-in, paid, verified candidates only. */
export default async function CandidateLayout({ children }: LayoutProps<"/">) {
  const { user } = await requireCandidate();
  const unreadCount = await repos.messages.countUnread(user.user_id);
  return (
    <SurfaceShell shell="candidate" user={user} unreadCount={unreadCount}>
      {children}
    </SurfaceShell>
  );
}
