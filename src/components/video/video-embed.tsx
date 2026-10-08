import { cn } from "@/lib/utils";
import { parseVideoLink, VIDEO_PROVIDERS } from "@/lib/video-embed";

/** Plays a linked video in the page through the platform's own embed player. */
export function VideoEmbed({ url, title, className }: { url: string; title: string; className?: string }) {
  const video = parseVideoLink(url);
  if (!video) return null;
  return (
    <div className={cn("overflow-hidden rounded-2xl bg-brand-black", className)}>
      <iframe
        src={video.embedUrl}
        title={`${title} (${VIDEO_PROVIDERS[video.provider]})`}
        className="aspect-video w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
