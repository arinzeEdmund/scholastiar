import { z } from "zod";

import { parseVideoLink, VIDEO_LINK_HELP } from "@/lib/video-embed";

export const MEDIA_LINK_TYPES = ["video", "document", "deck", "image", "certificate", "other"] as const;

/** A Signia media item added by link. Videos must come from a platform we can play in the page. */
export const mediaLinkFormSchema = z
  .object({
    media_type: z.enum(MEDIA_LINK_TYPES),
    url: z
      .string()
      .trim()
      .max(500)
      .url("Enter a full link, starting with https://")
      .refine((v) => /^https?:\/\//.test(v), "Use a link starting with https://"),
    title: z.string().trim().min(2, "Add a title.").max(120),
  })
  .superRefine((value, ctx) => {
    if (value.media_type === "video" && !parseVideoLink(value.url)) {
      ctx.addIssue({ code: "custom", path: ["url"], message: VIDEO_LINK_HELP });
    }
  });
export type MediaLinkFormInput = z.infer<typeof mediaLinkFormSchema>;
