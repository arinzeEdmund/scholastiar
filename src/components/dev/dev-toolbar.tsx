import { repos } from "@/data";
import { devListPlans, devListProfiles } from "@/data/mock/dev";
import { SURFACES } from "@/config/personas";
import { getAiFailureSimulated, getViewState } from "@/lib/dev-settings";
import { isMock } from "@/lib/env";
import { getSession } from "@/lib/session";

import { DevPanel } from "./dev-panel";

/** Floating Phase A dev panel. Renders nothing unless DATA_SOURCE=mock. */
export async function DevToolbar() {
  if (!isMock) return null;

  const [session, profiles, viewState, aiFailure] = await Promise.all([
    getSession(),
    devListProfiles(),
    getViewState(),
    getAiFailureSimulated(),
  ]);

  const audience = session ? SURFACES[session.user.primary_role].planAudience : null;
  const [plans, subscription] = await Promise.all([
    audience ? devListPlans(audience) : Promise.resolve([]),
    session ? repos.billing.getSubscription(session.user.user_id) : Promise.resolve(null),
  ]);

  return (
    <DevPanel
      personas={profiles.map((p) => ({
        userId: p.user_id,
        name: p.full_name,
        surface: SURFACES[p.primary_role].label,
        organization: p.organization_name,
      }))}
      currentUserId={session?.user.user_id ?? null}
      currentRoles={session?.roles ?? []}
      plans={plans.map((p) => ({ id: p.id, name: p.name }))}
      currentPlanId={subscription?.plan_id ?? null}
      viewState={viewState}
      aiFailure={aiFailure}
    />
  );
}
