// Video links students can use instead of uploading (decided 2026-10-08): we play them in the page
// through each platform's official embed player. Unknown sites are refused rather than guessed.

export type VideoProvider = "youtube" | "loom" | "tella" | "vimeo" | "google_drive";

export const VIDEO_PROVIDERS: Record<VideoProvider, string> = {
  youtube: "YouTube",
  loom: "Loom",
  tella: "Tella",
  vimeo: "Vimeo",
  google_drive: "Google Drive",
};

export interface VideoLink {
  provider: VideoProvider;
  url: string;
  embedUrl: string;
  /** A still image when the platform offers one without an API call. */
  thumbnailUrl: string | null;
}

const ID = /^[A-Za-z0-9_-]+$/;

export function parseVideoLink(raw: string): VideoLink | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^www\.|^m\./, "");
  const parts = url.pathname.split("/").filter(Boolean);
  const href = url.toString();

  if (host === "youtube.com" || host === "youtu.be" || host === "youtube-nocookie.com") {
    const id =
      host === "youtu.be"
        ? parts[0]
        : parts[0] === "watch"
          ? url.searchParams.get("v")
          : ["shorts", "embed", "live"].includes(parts[0])
            ? parts[1]
            : null;
    if (!id || !ID.test(id)) return null;
    return {
      provider: "youtube",
      url: href,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }
  if (host === "loom.com" && (parts[0] === "share" || parts[0] === "embed") && parts[1] && ID.test(parts[1])) {
    return { provider: "loom", url: href, embedUrl: `https://www.loom.com/embed/${parts[1]}`, thumbnailUrl: null };
  }
  if (host === "tella.tv" && parts[0] === "video" && parts[1] && ID.test(parts[1])) {
    return {
      provider: "tella",
      url: href,
      embedUrl: `https://www.tella.tv/video/${parts[1]}/embed`,
      thumbnailUrl: null,
    };
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = parts.find((p) => /^\d+$/.test(p));
    if (!id) return null;
    return { provider: "vimeo", url: href, embedUrl: `https://player.vimeo.com/video/${id}`, thumbnailUrl: null };
  }
  if (host === "drive.google.com" && parts[0] === "file" && parts[1] === "d" && parts[2] && ID.test(parts[2])) {
    return {
      provider: "google_drive",
      url: href,
      embedUrl: `https://drive.google.com/file/d/${parts[2]}/preview`,
      thumbnailUrl: null,
    };
  }
  return null;
}

export const VIDEO_LINK_HELP = "Paste a YouTube, Loom, Tella, Vimeo or Google Drive link.";
