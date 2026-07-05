import { Zap } from 'lucide-react';

interface ScorePillProps {
  score: number;
  reasons?: string[];
}

type Tier = 'low' | 'mid' | 'high' | 'top';

function getTier(score: number): Tier {
  if (score <= 30) return 'low';
  if (score <= 50) return 'mid';
  if (score <= 80) return 'high';
  return 'top';
}

const TIER: Record<Tier, {
  pill:   string;
  glow:   string;
  icon:   string;
  score:  string;
  label:  string;
}> = {
  low: {
    pill:  'border-border bg-soft-background',
    glow:  'score-glow-low',
    icon:  'text-muted-text',
    score: 'text-secondary-text',
    label: 'text-muted-text',
  },
  mid: {
    pill:  'border-green/25 bg-soft-green/50',
    glow:  'score-glow-mid',
    icon:  'text-green/70',
    score: 'text-green/80',
    label: 'text-green-dark/60',
  },
  high: {
    pill:  'border-green/40 bg-soft-green',
    glow:  'score-glow-high',
    icon:  'text-green',
    score: 'text-green',
    label: 'text-green-dark/70',
  },
  top: {
    pill:  'border-green/55 bg-soft-green',
    glow:  'score-glow-high',
    icon:  'text-green',
    score: 'text-green',
    label: 'text-green-dark/70',
  },
};

export function ScorePill({ score, reasons = [] }: ScorePillProps) {
  const tier = getTier(score);
  const t    = TIER[tier];

  return (
    <div className="group relative shrink-0">
      {/* Pill */}
      <div className={`${t.pill} ${t.glow} w-fit rounded-xl border px-2.5 py-1.5 transition-shadow`}>
        {/* Top row: icon + score + (top tier) blinking dot */}
        <div className="flex items-center gap-1.5">
          <Zap className={`score-zap h-3.5 w-3.5 shrink-0 ${t.icon}`} />
          <span className={`text-sm font-bold leading-none ${t.score}`}>
            {score}%
          </span>
          {tier === 'top' && (
            <span className="ml-0.5 flex items-center gap-1">
              <span className="score-dot-blink inline-block h-1.5 w-1.5 rounded-full bg-green" />
              <span className="text-[10px] font-semibold text-green">Apply now</span>
            </span>
          )}
        </div>
        {/* Label row */}
        <p className={`mt-0.5 text-[10px] leading-tight tracking-tight ${t.label}`}>
          application readiness score
        </p>
      </div>

      {/* Hover tooltip */}
      {reasons.length > 0 && (
        <div className="pointer-events-none absolute right-0 top-full z-30 mt-2 hidden w-56 rounded-xl border border-border bg-white p-3 shadow-lg group-hover:block">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-text">
            Why this job matched
          </p>
          <ul className="space-y-1">
            {reasons.map((r) => (
              <li key={r} className="flex items-start gap-1.5 text-[12px] text-primary-text">
                <span className="mt-0.5 shrink-0 text-green">✓</span>
                {r}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[10px] italic text-muted-text">
            Estimate based on your profile. Not a guarantee of outcome.
          </p>
        </div>
      )}
    </div>
  );
}
