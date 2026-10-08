"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { repos } from "@/data";
import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { hasJobAccess } from "@/lib/entitlements";
import { getSession } from "@/lib/session";

// Save and board actions for every opportunity type. Only paying candidates can save or
// queue; jobs also need Pro (PRICING.md → Jobs Are Pro Only).

const refSchema = z.object({
  type: z.enum(["job", "program", "university", "scholarship"]),
  id: z.string().min(1).max(120),
});

const saveSchema = refSchema.extend({ saved: z.boolean() });
const boardSchema = refSchema.extend({ board: z.enum(["ai_apply_agent", "apply_for_me"]), on: z.boolean() });

type Gate = { userId: string } | { error: string };

async function payingCandidate(type: z.infer<typeof refSchema>["type"]): Promise<Gate> {
  const session = await getSession();
  if (!session) return { error: "Sign in to save opportunities and add them to your boards." };
  if (session.user.primary_role !== "candidate") return { error: "Saving and boards are for student accounts." };
  const subscription = await repos.billing.getSubscription(session.user.user_id);
  if (subscription?.status !== "active") return { error: "Finish paying for your plan to use this." };
  if (type === "job" && !hasJobAccess(subscription.plan_id)) return { error: "Job connections are part of Pro." };
  return { userId: session.user.user_id };
}

export async function setOpportunitySaved(
  input: z.infer<typeof saveSchema>,
): Promise<ActionResult<{ saved: boolean }>> {
  const parsed = saveSchema.safeParse(input);
  if (!parsed.success) return fail("That opportunity couldn't be found.");
  const gate = await payingCandidate(parsed.data.type);
  if ("error" in gate) return fail(gate.error);

  const { type, id, saved } = parsed.data;
  const result = await repos.opportunities.setSaved(gate.userId, { type, id }, saved);
  revalidatePath("/", "layout");
  return ok({ saved: result });
}

export async function setOpportunityOnBoard(
  input: z.infer<typeof boardSchema>,
): Promise<ActionResult<{ on: boolean }>> {
  const parsed = boardSchema.safeParse(input);
  if (!parsed.success) return fail("That opportunity couldn't be found.");
  if (parsed.data.type === "university") return fail("Add a programme from this university instead.");
  const gate = await payingCandidate(parsed.data.type);
  if ("error" in gate) return fail(gate.error);

  const { board, type, id, on } = parsed.data;
  const result = await repos.opportunities.setOnBoard(gate.userId, board, { type, id }, on);
  revalidatePath("/", "layout");
  return ok({ on: result });
}
