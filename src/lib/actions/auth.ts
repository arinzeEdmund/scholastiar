"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { repos } from "@/data";
import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { nextStepFor } from "@/lib/auth-flow";
import { isMock } from "@/lib/env";
import { notify } from "@/lib/messages/notify";
import { toE164 } from "@/lib/phone";
import { endSession, getSession, startSession } from "@/lib/session";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type SignInInput,
  type SignUpInput,
} from "@/lib/validation/auth";

// Phase A auth actions against the mock auth store. Phase B: Supabase Auth.

const fieldErrors = (error: z.ZodError) => z.flattenError(error).fieldErrors;

/** A link the mock "email" would contain; only returned in mock mode so it can be shown on screen. */
const devLink = (path: string) => (isMock ? path : undefined);

export async function signIn(input: SignInInput): Promise<ActionResult<{ redirectTo: string }>> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));

  const userId = await repos.auth.verifyCredentials(parsed.data.email, parsed.data.password);
  // Same message for unknown email and wrong password, so accounts can't be discovered.
  if (!userId) return fail("That email and password don't match an account. Check them and try again.");

  await startSession(userId);
  revalidatePath("/", "layout");
  return ok({ redirectTo: await nextStepFor(userId) });
}

export async function signUp(input: SignUpInput): Promise<ActionResult<{ redirectTo: string }>> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));
  const data = parsed.data;

  const countries = await repos.reference.listCountries();
  if (!countries.some((c) => c.iso2 === data.countryCode)) {
    return fail("Check the highlighted fields.", { countryCode: ["Choose your country from the list."] });
  }
  const plan = await repos.billing.getPlan(data.planId);
  if (
    !plan ||
    plan.sales_led ||
    plan.audience !== (data.accountType === "candidate" ? "candidate" : data.accountType)
  ) {
    return fail("Check the highlighted fields.", { planId: ["Choose one of the plans shown."] });
  }
  if (await repos.auth.findAccountByEmail(data.email)) {
    return fail("Check the highlighted fields.", {
      email: ["An account with this email already exists. Sign in instead, or reset your password."],
    });
  }

  const userId = await repos.auth.createAccount({ email: data.email, password: data.password });

  if (data.accountType === "candidate") {
    await repos.users.createProfile({
      userId,
      fullName: data.fullName,
      email: data.email,
      primaryRole: "candidate",
      organizationName: null,
      headline: null,
      countryCode: data.countryCode,
    });
    await repos.users.addRole(userId, "candidate");
  } else if (data.accountType === "employer") {
    await repos.users.createProfile({
      userId,
      fullName: data.fullName,
      email: data.email,
      primaryRole: "employer",
      organizationName: data.companyName,
      headline: data.jobTitle,
      countryCode: data.countryCode,
    });
    await repos.users.addRole(userId, "employer_owner");
    await repos.organizations.createEmployerCompany({
      name: data.companyName,
      websiteUrl: data.companyWebsite || null,
      countryCode: data.countryCode,
      hiresStudents: data.hiringFocus !== "graduates",
      sponsorsGraduateWorkVisas: data.hiringFocus !== "students",
      ownerUserId: userId,
    });
  } else {
    await repos.users.createProfile({
      userId,
      fullName: data.fullName,
      email: data.email,
      primaryRole: "provider",
      organizationName: data.organizationName,
      headline: data.jobTitle,
      countryCode: data.countryCode,
    });
    await repos.users.addRole(userId, "provider_owner");
    await repos.organizations.createProviderOrganization({
      name: data.organizationName,
      organizationType: data.organizationType,
      websiteUrl: data.organizationWebsite || null,
      countryCode: data.countryCode,
      ownerUserId: userId,
    });
  }

  if (data.whatsapp) {
    await repos.messages.setWhatsAppConsent(userId, {
      phoneE164: toE164(data.whatsapp),
      optedIn: true,
      source: "sign_up",
    });
  }
  await repos.billing.startSubscription(userId, plan.id);
  await notify("account.created", { userId });
  await startSession(userId);
  revalidatePath("/", "layout");
  return ok({ redirectTo: "/billing/checkout" });
}

export async function signOut(): Promise<ActionResult<{ redirectTo: string }>> {
  await endSession();
  revalidatePath("/", "layout");
  return ok({ redirectTo: "/" });
}

export async function requestPasswordReset(input: ForgotPasswordInput): Promise<ActionResult<{ devLink?: string }>> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return fail("Check your email address.", fieldErrors(parsed.error));

  const account = await repos.auth.findAccountByEmail(parsed.data.email);
  if (!account) return ok({}); // Same response either way, so accounts can't be discovered.
  const token = await repos.auth.issueToken(account.user_id, "reset_password");
  await notify(
    "password.reset_requested",
    { userId: account.user_id },
    { link: `/auth/reset-password?token=${token}` },
  );
  return ok({ devLink: devLink(`/auth/reset-password?token=${token}`) });
}

export async function resetPassword(input: ResetPasswordInput): Promise<ActionResult<undefined>> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));

  const userId = await repos.auth.consumeToken(parsed.data.token, "reset_password");
  if (!userId) return fail("This reset link has expired or was already used. Request a new one.");
  await repos.auth.updatePassword(userId, parsed.data.password);
  // A reset link proves the person controls the email address.
  await repos.auth.markEmailVerified(userId);
  await notify("password.changed", { userId });
  return ok(undefined);
}

export async function resendVerificationEmail(): Promise<ActionResult<{ devLink?: string }>> {
  const session = await getSession();
  if (!session) return fail("Sign in to resend the verification email.");
  const account = await repos.auth.getAccount(session.user.user_id);
  if (!account) return fail("We couldn't find your account. Sign in again.");
  if (account.email_verified_at) return fail("Your email is already verified.");
  const token = await repos.auth.issueToken(session.user.user_id, "verify_email");
  await notify(
    "email.verification_sent",
    { userId: session.user.user_id },
    { link: `/auth/verify-email/confirm?token=${token}` },
  );
  return ok({ devLink: devLink(`/auth/verify-email/confirm?token=${token}`) });
}
