import { cn } from "@/lib/utils";

/** Circular profile-strength meter. The number is always shown, never colour alone. */
export function StrengthRing({ score, size = 72, className }: { score: number; size?: number; className?: string }) {
  const stroke = Math.max(5, Math.round(size / 12));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(score, 0), 100) / 100);
  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Profile strength ${score} out of 100`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-neutral-soft dark:stroke-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-green transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-bold tracking-tight text-primary-text"
        style={{ fontSize: size / 4 }}
      >
        {score}
      </span>
    </div>
  );
}
