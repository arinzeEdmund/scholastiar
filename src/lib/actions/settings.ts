"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { repos } from "@/data";
import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { NOTIFICATION_CATEGORIES } from "@/lib/candidate/labels";
import { notify } from "@/lib/messages/notify";
import { E164, toE164 } from "@/lib/phone";
import { endSession, getSession } from "@/lib/session";
import {
  accountSchema,
  changePasswordSchema,
  notificationPreferencesSchema,
  type AccountInput,
  type ChangePasswordInput,
} from "@/lib/validation/candidate";

const fieldErrors = (error: z.ZodError) => z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
const SIGNED_OUT = "Your session has ended. Sign in again to continue.";

export async function updateAccount(input: AccountInput): Promise<ActionResult<undefined>> {
  const session = await getSession();
  if (!session) return fail(SIGNED_OUT);
  const parsed = accountSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));
  if (!Intl.supportedValuesOf("timeZone").includes(parsed.data.timezone) && parsed.data.timezone !== "UTC") {
    return fail("Check the highlighted fields.", { timezone: ["Choose a time zone."] });
  }

  await repos.users.updateProfile(session.user.user_id, {
    full_name: parsed.data.fullName,
    timezone: parsed.data.timezone,
  });
  revalidatePath("/", "layout");
  return ok(undefined);
}

export async function changePassword(input: ChangePasswordInput): Promise<ActionResult<undefined>> {
  const session = await getSession();
  if (!session) return fail(SIGNED_OUT);
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));

  const account = await repos.auth.getAccount(session.user.user_id);
  const matches = account && (await repos.auth.verifyCredentials(account.email, parsed.data.currentPassword));
  if (!matches)
    return fail("Check the highlighted fields.", { currentPassword: ["That's not your current password."] });
  if (parsed.data.currentPassword === parsed.data.newPassword) {
    return fail("Check the highlighted fields.", { newPassword: ["Choose a new password."] });
  }

  await repos.auth.updatePassword(session.user.user_id, parsed.data.newPassword);
  await notify("password.changed", { userId: session.user.user_id });
  return ok(undefined);
}

export async function saveNotificationPreferences(input: unknown): Promise<ActionResult<undefined>> {
  const session = await getSession();
  if (!session) return fail(SIGNED_OUT);
  const parsed = notificationPreferencesSchema.safeParse(input);
  if (!parsed.success) return fail("Those settings couldn't be saved. Refresh and try again.");

  // Locked channels stay on (security, payments); "never" channels stay off (no promotions on WhatsApp).
  const preferences = parsed.data.map((p) => {
    const rules = NOTIFICATION_CATEGORIES[p.notification_type];
    if (rules.locked?.includes(p.channel)) return { ...p, enabled: true };
    if (rules.never?.includes(p.channel)) return { ...p, enabled: false };
    return p;
  });
  await repos.candidate.saveNotificationPreferences(session.user.user_id, preferences);
  return ok(undefined);
}

/**
 * Permanently deletes the account after the user types their email to confirm.
 * Phase B: also cancels the payment-provider subscription and schedules storage cleanup.
 */
export async function deleteAccount(confirmEmail: string): Promise<ActionResult<{ redirectTo: string }>> {
  const session = await getSession();
  if (!session) return fail(SIGNED_OUT);
  if (confirmEmail.trim().toLowerCase() !== session.user.email.toLowerCase()) {
    return fail("Type your email address exactly to confirm.");
  }

  const userId = session.user.user_id;
  // Sent before the account (and its WhatsApp consent) is removed.
  await notify("account.deleted", { userId });
  await repos.candidate.deleteAllForUser(userId);
  await repos.messages.deleteAllForUser(userId);
  await repos.billing.cancelSubscription(userId);
  await repos.users.deleteUser(userId);
  await repos.auth.deleteAccount(userId);
  await endSession();
  revalidatePath("/", "layout");
  return ok({ redirectTo: "/?account=deleted" });
}

/** WhatsApp number and opt-in for official Scholastiar messages. */
export async function saveWhatsApp(input: { phone: string; optedIn: boolean }): Promise<ActionResult<undefined>> {
  const session = await getSession();
  if (!session) return fail(SIGNED_OUT);
  const phone = toE164(input.phone ?? "");
  if (input.optedIn && !E164.test(phone)) {
    return fail("Check the highlighted fields.", { phone: ["Start with + and your country code."] });
  }
  if (phone && !E164.test(phone))
    return fail("Check the highlighted fields.", { phone: ["Start with + and your country code."] });
  await repos.messages.setWhatsAppConsent(session.user.user_id, {
    phoneE164: phone,
    optedIn: input.optedIn && Boolean(phone),
    source: "settings",
  });
  revalidatePath("/settings/notifications");
  return ok(undefined);
}
