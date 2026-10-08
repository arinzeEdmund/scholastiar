import type { NotificationCategory } from "@/data/types";

// The message catalogue (db.md → message_templates). Every platform event has an entry with its
// email, WhatsApp and in-app versions. A feature isn't done until its events are here.
// WhatsApp texts are short and never contain one-time links (those go by email only).

export type MessageVars = Record<string, string>;

interface Link {
  label: string;
  href: string;
}

export interface EventDefinition {
  /** Preference category. `null` = sent to a visitor without an account (email only). */
  category: NotificationCategory | null;
  email?: (v: MessageVars) => { subject: string; body: string; link?: Link };
  /** `template` names the WhatsApp-approved template used in Phase B. */
  whatsapp?: (v: MessageVars) => { template: string; body: string; link?: Link };
  inApp?: (v: MessageVars) => { title: string; body: string; href?: string };
}

const SIGN_OFF = "\n\n— The Scholastiar team";

export const CATALOGUE = {
  "account.created": {
    category: "profile_activity",
    email: (v) => ({
      subject: "Welcome to Scholastiar.ai",
      body: `Hi ${v.firstName},\n\nYour account is ready. Next, finish paying for your plan, then we'll help you build your profile.${SIGN_OFF}`,
      link: { label: "Continue", href: "/billing/checkout" },
    }),
    whatsapp: (v) => ({
      template: "account_created",
      body: `Hi ${v.firstName}, welcome to Scholastiar.ai! Your account is ready. We'll send your important updates here.`,
    }),
    inApp: () => ({ title: "Welcome to Scholastiar.ai", body: "Your account is ready.", href: "/dashboard" }),
  },

  "payment.succeeded": {
    category: "billing",
    email: (v) => ({
      subject: `Payment received — ${v.planName} is active`,
      body: `Hi ${v.firstName},\n\nWe received your payment of ${v.amount} by ${v.method}. Your ${v.planName} plan is now active.\n\nReference: ${v.reference}${SIGN_OFF}`,
    }),
    whatsapp: (v) => ({
      template: "payment_succeeded",
      body: `Payment received: ${v.amount} by ${v.method}. Your ${v.planName} plan is active. Ref ${v.reference}.`,
    }),
    inApp: (v) => ({ title: "Payment received", body: `${v.planName} is active.` }),
  },

  "payment.failed": {
    category: "billing",
    email: (v) => ({
      subject: "Your payment didn't go through",
      body: `Hi ${v.firstName},\n\nYour payment of ${v.amount} by ${v.method} didn't go through: ${v.reason}\n\nYou can try again or choose another payment method.${SIGN_OFF}`,
      link: { label: "Try again", href: "/billing/checkout" },
    }),
    whatsapp: (v) => ({
      template: "payment_failed",
      body: `Your payment of ${v.amount} didn't go through. Please try again or use another method in the app.`,
    }),
    inApp: () => ({
      title: "Payment didn't go through",
      body: "Try again or choose another method.",
      href: "/billing/checkout",
    }),
  },

  "email.verification_sent": {
    category: "account_security",
    email: (v) => ({
      subject: "Confirm your email address",
      body: `Hi ${v.firstName},\n\nConfirm your email address to finish setting up your account. The link works once and expires in 24 hours.${SIGN_OFF}`,
      link: { label: "Confirm email address", href: v.link },
    }),
    whatsapp: (v) => ({
      template: "verify_email_sent",
      body: `We've emailed a confirmation link to ${v.email}. Open it to finish setting up your account.`,
    }),
  },

  "email.verified": {
    category: "account_security",
    email: (v) => ({
      subject: "Your email address is confirmed",
      body: `Hi ${v.firstName},\n\nYour email address is confirmed. You're ready to set up your profile.${SIGN_OFF}`,
      link: { label: "Set up your profile", href: "/onboarding" },
    }),
    whatsapp: () => ({
      template: "email_verified",
      body: "Your email address is confirmed. You're ready to set up your profile.",
    }),
    inApp: () => ({ title: "Email confirmed", body: "You're ready to set up your profile.", href: "/onboarding" }),
  },

  "password.reset_requested": {
    category: "account_security",
    email: (v) => ({
      subject: "Reset your password",
      body: `Hi ${v.firstName},\n\nSomeone asked to reset your password. If it was you, use the link below — it works once and expires in an hour. If it wasn't you, you can ignore this email.${SIGN_OFF}`,
      link: { label: "Choose a new password", href: v.link },
    }),
    whatsapp: () => ({
      template: "password_reset_requested",
      body: "A password reset was requested for your Scholastiar account. The link is in your email. If this wasn't you, ignore it.",
    }),
  },

  "password.changed": {
    category: "account_security",
    email: (v) => ({
      subject: "Your password was changed",
      body: `Hi ${v.firstName},\n\nYour Scholastiar password was just changed. If this wasn't you, reset it now and contact support.${SIGN_OFF}`,
      link: { label: "Reset password", href: "/auth/forgot-password" },
    }),
    whatsapp: () => ({
      template: "password_changed",
      body: "Your Scholastiar password was just changed. If this wasn't you, reset it now from the sign-in page.",
    }),
    inApp: () => ({ title: "Password changed", body: "If this wasn't you, reset it now." }),
  },

  "onboarding.completed": {
    category: "profile_activity",
    email: (v) => ({
      subject: "Your profile is ready",
      body: `Hi ${v.firstName},\n\nYour profile is set up — profile strength ${v.score}/100. It now powers your CV, application answers and your visa guidance.${SIGN_OFF}`,
      link: { label: "Go to your dashboard", href: "/dashboard" },
    }),
    whatsapp: (v) => ({
      template: "onboarding_completed",
      body: `Your Scholastiar profile is ready (strength ${v.score}/100). You can start exploring opportunities.`,
    }),
    inApp: (v) => ({ title: "Your profile is ready", body: `Profile strength ${v.score}/100.`, href: "/dashboard" }),
  },

  "document.uploaded": {
    category: "profile_activity",
    email: (v) => ({
      subject: `${v.fileName} was added to your documents`,
      body: `Hi ${v.firstName},\n\n${v.fileName} (${v.type}) was uploaded to your private document vault.${SIGN_OFF}`,
      link: { label: "Open documents", href: "/profile/documents" },
    }),
    whatsapp: (v) => ({
      template: "document_uploaded",
      body: `${v.fileName} was added to your Scholastiar documents.`,
    }),
    inApp: (v) => ({ title: "Document uploaded", body: v.fileName, href: "/profile/documents" }),
  },

  "account.deleted": {
    category: "account_security",
    email: (v) => ({
      subject: "Your account has been deleted",
      body: `Hi ${v.firstName},\n\nYour Scholastiar account, profile and documents have been deleted and your plan cancelled. We're sorry to see you go.${SIGN_OFF}`,
    }),
    whatsapp: () => ({
      template: "account_deleted",
      body: "Your Scholastiar account has been deleted. You won't receive more messages from us.",
    }),
  },

  "deadline.reminder": {
    category: "deadlines",
    email: (v) => ({
      subject: `${v.name} closes in ${v.days} days`,
      body: `Hi ${v.firstName},\n\n${v.name} closes on ${v.date}. Your documents and statement can be ready in about an hour.${SIGN_OFF}`,
      link: { label: "Open your shortlist", href: "/dashboard#shortlist" },
    }),
    whatsapp: (v) => ({ template: "deadline_reminder", body: `${v.name} closes in ${v.days} days (${v.date}).` }),
    inApp: (v) => ({
      title: `${v.name} closes in ${v.days} days`,
      body: `Deadline ${v.date}.`,
      href: "/dashboard#shortlist",
    }),
  },

  "matches.new": {
    category: "new_matches",
    email: (v) => ({
      subject: `${v.count} new matches for you`,
      body: `Hi ${v.firstName},\n\n${v.count} new programmes and scholarships fit your profile, including ${v.example}.${SIGN_OFF}`,
      link: { label: "See your matches", href: "/dashboard#matches" },
    }),
    whatsapp: (v) => ({
      template: "matches_new",
      body: `${v.count} new matches fit your profile, including ${v.example}.`,
    }),
    inApp: (v) => ({ title: `${v.count} new matches`, body: `Including ${v.example}.`, href: "/dashboard#matches" }),
  },

  "message.received": {
    category: "messages",
    email: (v) => ({
      subject: `New message from ${v.from}`,
      body: `Hi ${v.firstName},\n\n${v.from} sent you a message: "${v.preview}"${SIGN_OFF}`,
      link: { label: "Reply", href: v.href },
    }),
    whatsapp: (v) => ({
      template: "message_received",
      body: `New message from ${v.from}. Reply in the Scholastiar app.`,
    }),
    inApp: (v) => ({ title: `New message from ${v.from}`, body: v.preview, href: v.href }),
  },

  "personality.viewed": {
    category: "profile_activity",
    email: (v) => ({
      subject: `${v.viewer} watched your PersonalityAI CV`,
      body: `Hi ${v.firstName},\n\n${v.viewer} watched your PersonalityAI CV with your application.${SIGN_OFF}`,
      link: { label: "See who watched", href: "/personality-cv" },
    }),
    inApp: (v) => ({
      title: "Your video was watched",
      body: `${v.viewer} watched your PersonalityAI CV.`,
      href: "/personality-cv",
    }),
  },

  "contact.received": {
    category: null,
    email: (v) => ({
      subject: "We received your message",
      body: `Hi ${v.name},\n\nThanks for contacting Scholastiar about "${v.topic}". A person reads every message; we'll reply to this address.${SIGN_OFF}`,
    }),
  },

  "newsletter.subscribed": {
    category: null,
    email: () => ({
      subject: "You're subscribed to Scholastiar guides",
      body: `Thanks for subscribing. We'll send new guides on studying, working and living abroad — never more than once a week.${SIGN_OFF}`,
    }),
  },
} satisfies Record<string, EventDefinition>;

export type EventKey = keyof typeof CATALOGUE;
