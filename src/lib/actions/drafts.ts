"use server";

import { z } from "zod";

import { repos } from "@/data";
import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { getAiFailureSimulated } from "@/lib/dev-settings";
import { aiAnswerMonthlyLimit, monthStart } from "@/lib/entitlements";
import { getSession } from "@/lib/session";

// Phase A stand-in for AI drafting: canned output built only from facts in the candidate's
// profile, with simulated latency and the dev "AI failure" switch. Phase B swaps in the
// AI provider abstraction behind the same action. AI never invents experience.

const draftSchema = z.object({
  programId: z.string().min(1).max(120),
  attempt: z.number().int().min(0).max(20),
});

const OPENERS = [
  (p: string, u: string) => `I am applying for the ${p} at ${u} because`,
  (p: string, u: string) => `The ${p} at ${u} is the right next step for me because`,
  (p: string, u: string) => `I want to study the ${p} at ${u} because`,
];

export async function draftStatement(
  input: z.infer<typeof draftSchema>,
): Promise<ActionResult<{ text: string; facts: string[] }>> {
  const parsed = draftSchema.safeParse(input);
  if (!parsed.success) return fail("That programme couldn't be found.");
  const session = await getSession();
  if (!session || session.user.primary_role !== "candidate") return fail("Sign in to draft with AI.");

  const [subscription, used] = await Promise.all([
    repos.billing.getSubscription(session.user.user_id),
    repos.ai.countSince(session.user.user_id, "answer", monthStart()),
  ]);
  const limit = aiAnswerMonthlyLimit(subscription?.plan_id);
  if (limit !== null && used >= limit) {
    return fail(
      `You've used all ${limit} AI essays and answers for this month. Your allowance resets on the 1st — or upgrade to Pro for unlimited.`,
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 1200));
  if (await getAiFailureSimulated()) {
    await repos.ai.record(session.user.user_id, "answer", "failed");
    return fail("The AI couldn't write a draft right now. Your work is safe — try again in a moment.");
  }

  const [entry, bundle] = await Promise.all([
    repos.catalogue.getProgramEntry(parsed.data.programId),
    repos.candidate.getBundle(session.user.user_id),
  ]);
  if (!entry) return fail("That programme couldn't be found.");

  const facts: string[] = [];
  const latest = bundle.education[0];
  const role = bundle.experience[0];
  const achievement = role?.achievements.find(Boolean);

  const opener = OPENERS[parsed.data.attempt % OPENERS.length](entry.program.name, entry.university.name);
  const parts = [`${opener} it builds directly on what I have studied and done so far.`];
  if (latest) {
    facts.push(`${latest.qualification_name}, ${latest.institution_name}`);
    parts.push(
      `${latest.is_current ? "I am currently studying" : "I studied"} ${latest.qualification_name} at ${latest.institution_name}, focusing on ${latest.field_of_study.toLowerCase()}.`,
    );
  }
  if (role) {
    facts.push(`${role.job_title}, ${role.company_name}`);
    parts.push(
      `As ${role.job_title} at ${role.company_name}, ${achievement ? achievement.charAt(0).toLowerCase() + achievement.slice(1).replace(/\.$/, "") : "I learned to work carefully with real people and real deadlines"}.`,
    );
  }
  parts.push(
    `The programme's focus on ${entry.program.field_name.toLowerCase()} and its ${entry.program.language_of_instruction}-taught format in ${entry.university.city} fit where I want to take my career, and I am ready for the move.`,
  );
  if (!latest && !role) {
    parts.push("[Add your education and experience to your profile so this draft can use your real story.]");
  }

  await repos.ai.record(session.user.user_id, "answer", "succeeded");
  return ok({ text: parts.join(" "), facts });
}
