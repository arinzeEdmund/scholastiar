"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { repos } from "@/data";
import { devListPlans } from "@/data/mock/dev";
import { resetStore } from "@/data/mock/store";
import { DEV_COOKIES, VIEW_STATES } from "@/lib/dev-settings";
import { isMock } from "@/lib/env";
import { fail, ok, type ActionResult } from "@/lib/actions/result";

// Phase A dev panel actions. All refuse to run unless DATA_SOURCE=mock.

const COOKIE_OPTIONS = { path: "/", sameSite: "lax", httpOnly: true, maxAge: 60 * 60 * 24 * 30 } as const;

function guard(): ActionResult<never> | null {
  return isMock ? null : fail("Dev tools are only available with the mock data source.");
}

export async function switchPersona(userId: string | null): Promise<ActionResult<{ name: string | null }>> {
  const blocked = guard();
  if (blocked) return blocked;

  const store = await cookies();
  if (userId === null) {
    store.delete(DEV_COOKIES.session);
    revalidatePath("/", "layout");
    return ok({ name: null });
  }

  const profile = await repos.users.getProfile(z.string().parse(userId));
  if (!profile) return fail("That demo persona doesn't exist. Try resetting demo data.");

  store.set(DEV_COOKIES.session, profile.user_id, COOKIE_OPTIONS);
  revalidatePath("/", "layout");
  return ok({ name: profile.full_name });
}

/** Dev panel value for "no subscription" (there is no free applicant plan). */
const NO_PLAN = "none";

const planSchema = z.object({ userId: z.string().min(1), planId: z.string().min(1) });

export async function switchPlan(input: z.input<typeof planSchema>): Promise<ActionResult<{ planName: string }>> {
  const blocked = guard();
  if (blocked) return blocked;

  const parsed = planSchema.safeParse(input);
  if (!parsed.success) return fail("Choose a plan to switch to.");

  if (parsed.data.planId === NO_PLAN) {
    await repos.billing.cancelSubscription(parsed.data.userId);
    revalidatePath("/", "layout");
    return ok({ planName: "No subscription" });
  }

  const plans = await devListPlans();
  const plan = plans.find((p) => p.id === parsed.data.planId);
  if (!plan) return fail("That plan doesn't exist.");

  await repos.billing.setPlan(parsed.data.userId, plan.id);
  revalidatePath("/", "layout");
  return ok({ planName: plan.name });
}

export async function setViewState(state: string): Promise<ActionResult<{ state: string }>> {
  const blocked = guard();
  if (blocked) return blocked;

  const parsed = z.enum(VIEW_STATES).safeParse(state);
  if (!parsed.success) return fail("Unknown screen state.");

  const store = await cookies();
  if (parsed.data === "live") store.delete(DEV_COOKIES.viewState);
  else store.set(DEV_COOKIES.viewState, parsed.data, COOKIE_OPTIONS);
  revalidatePath("/", "layout");
  return ok({ state: parsed.data });
}

export async function setAiFailure(enabled: boolean): Promise<ActionResult<{ enabled: boolean }>> {
  const blocked = guard();
  if (blocked) return blocked;

  const store = await cookies();
  if (enabled) store.set(DEV_COOKIES.aiFailure, "1", COOKIE_OPTIONS);
  else store.delete(DEV_COOKIES.aiFailure);
  return ok({ enabled });
}

export async function resetDemoData(): Promise<ActionResult<undefined>> {
  const blocked = guard();
  if (blocked) return blocked;

  resetStore();
  const store = await cookies();
  store.delete(DEV_COOKIES.viewState);
  store.delete(DEV_COOKIES.aiFailure);
  revalidatePath("/", "layout");
  return ok(undefined);
}

export async function clearOutbox(): Promise<ActionResult<undefined>> {
  const blocked = guard();
  if (blocked) return blocked;
  await repos.messages.clearDeliveries();
  revalidatePath("/dev/outbox");
  return ok(undefined);
}
