import { z } from "zod";

/** Shared by the client form (React Hook Form) and the server action. */
export const profileBasicsSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name.").max(80, "Use 80 characters or fewer."),
  headline: z.string().trim().max(120, "Use 120 characters or fewer."),
});

export type ProfileBasicsInput = z.input<typeof profileBasicsSchema>;
