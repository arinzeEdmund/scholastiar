import type { SigniaMediaItem, SigniaProfile, SigniaProject, SigniaSocialLink } from "@/data/types";

export interface SigniaBundle {
  profile: SigniaProfile | null;
  projects: SigniaProject[];
  media: SigniaMediaItem[];
  links: SigniaSocialLink[];
}

export type SigniaProfileInput = Omit<SigniaProfile, "user_id" | "published_at" | "updated_at">;
export type SigniaProjectInput = Omit<SigniaProject, "id" | "user_id" | "order_index" | "created_at" | "updated_at">;
export type SigniaMediaInput = Omit<SigniaMediaItem, "id" | "user_id" | "created_at">;
export type SigniaLinkInput = Omit<SigniaSocialLink, "user_id" | "order_index">;

/** Signia portfolio: profile, projects, media and social links. */
export interface SigniaRepository {
  get(userId: string): Promise<SigniaBundle>;
  /** Public page lookup; returns the owner's id too. */
  getByHandle(handle: string): Promise<(SigniaBundle & { userId: string }) | null>;
  isHandleTaken(handle: string, exceptUserId: string): Promise<boolean>;
  saveProfile(userId: string, input: SigniaProfileInput): Promise<SigniaProfile>;
  saveProject(userId: string, id: string | null, input: SigniaProjectInput): Promise<SigniaProject | null>;
  deleteProject(userId: string, id: string): Promise<boolean>;
  addMedia(userId: string, input: SigniaMediaInput): Promise<SigniaMediaItem>;
  updateMedia(
    userId: string,
    id: string,
    update: Pick<SigniaMediaItem, "title" | "description" | "visibility" | "project_id">,
  ): Promise<SigniaMediaItem | null>;
  deleteMedia(userId: string, id: string): Promise<boolean>;
  /** Replaces the whole list, in the given order. */
  saveSocialLinks(userId: string, links: SigniaLinkInput[]): Promise<SigniaSocialLink[]>;
}
