"use server";

import { z } from "zod";

import { repos } from "@/data";
import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { notify } from "@/lib/messages/notify";
import {
  CONTACT_TOPICS,
  contactSchema,
  newsletterSchema,
  type ContactInput,
  type NewsletterInput,
} from "@/lib/validation/inbound";

export async function subscribeToNewsletter(
  input: NewsletterInput,
): Promise<ActionResult<{ alreadySubscribed: boolean }>> {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) return fail("Check your email address.", z.flattenError(parsed.error).fieldErrors);

  const { alreadySubscribed } = await repos.newsletter.subscribe(parsed.data.email, parsed.data.source);
  if (!alreadySubscribed) await notify("newsletter.subscribed", { email: parsed.data.email });
  return ok({ alreadySubscribed });
}

export async function sendContactMessage(input: ContactInput): Promise<ActionResult<{ id: string }>> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", z.flattenError(parsed.error).fieldErrors);

  const message = await repos.contact.createMessage(parsed.data);
  await notify(
    "contact.received",
    { email: parsed.data.email },
    { name: parsed.data.name.split(" ")[0], topic: CONTACT_TOPICS[parsed.data.topic] },
  );
  return ok({ id: message.id });
}
