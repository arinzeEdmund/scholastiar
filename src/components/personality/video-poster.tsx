import { Play } from "lucide-react";

import { initials } from "@/lib/initials";
import { cn } from "@/lib/utils";

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * Cover for a saved PersonalityAI CV video. Phase A keeps the video's details only; playback
 * of the stored file arrives with storage in Phase B.
 */
export function VideoPoster({ name, seconds, className }: { name: string; seconds: number; className?: string }) {
  return (
    <div
      className={cn(
        "grain relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl aurora-dark text-white",
        className,
      )}
      role="img"
      aria-label={`PersonalityAI CV video, ${clock(seconds)} long`}
    >
      <span className="absolute top-3 left-3 flex size-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold ring-1 ring-white/20">
        {initials(name)}
      </span>
      <span className="relative flex size-14 items-center justify-center rounded-full bg-white text-brand-black shadow-xl">
        <Play className="ml-0.5 size-6 fill-current" aria-hidden />
      </span>
      <span className="absolute right-3 bottom-3 rounded-md bg-black/60 px-1.5 py-0.5 text-xs font-semibold tabular-nums">
        {clock(seconds)}
      </span>
    </div>
  );
}
