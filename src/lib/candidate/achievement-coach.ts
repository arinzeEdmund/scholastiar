// Achievement coach: quick checks that make an achievement line stronger.
// Phase A runs these rules in the browser; Phase B adds AI rewrite suggestions
// (SERVICES/91-onboarding-intelligence.md) that the candidate accepts or edits.

const ACTION_VERBS = [
  "achieved",
  "analysed",
  "analyzed",
  "automated",
  "built",
  "coached",
  "coordinated",
  "created",
  "cut",
  "delivered",
  "designed",
  "developed",
  "drove",
  "grew",
  "improved",
  "increased",
  "introduced",
  "launched",
  "led",
  "managed",
  "mentored",
  "negotiated",
  "organised",
  "organized",
  "planned",
  "produced",
  "raised",
  "redesigned",
  "reduced",
  "reorganised",
  "reorganized",
  "resolved",
  "saved",
  "secured",
  "served",
  "set",
  "simplified",
  "streamlined",
  "supported",
  "taught",
  "trained",
  "won",
  "wrote",
  "handled",
  "halved",
  "doubled",
  "prepared",
  "ran",
  "researched",
  "presented",
  "translated",
  "recruited",
  "processed",
];

const WEAK_OPENERS = ["responsible for", "helped with", "worked on", "involved in", "duties included", "tasked with"];

export interface CoachCheck {
  key: "verb" | "number" | "result" | "length";
  passed: boolean;
  tip: string;
}

export function coachAchievement(text: string): CoachCheck[] {
  const value = text.trim().toLowerCase();
  if (!value) return [];
  const firstWord = value.split(/\s+/)[0]?.replace(/[^a-z]/g, "") ?? "";
  const weak = WEAK_OPENERS.some((w) => value.startsWith(w));
  const words = value.split(/\s+/).length;
  return [
    {
      key: "verb",
      passed: !weak && ACTION_VERBS.includes(firstWord),
      tip: weak ? "Start with what you did, not your duty (e.g. “Led”, “Built”)." : "Start with an action verb.",
    },
    {
      key: "number",
      passed: /\d/.test(value) || /\b(half|double|twice|triple)\b/.test(value),
      tip: "Add a number: how many, how much, how fast.",
    },
    {
      key: "result",
      passed: /\b(by|to|from|saving|so that|resulting|which|leading|cutting|reducing|increasing)\b/.test(value),
      tip: "Say what changed as a result.",
    },
    {
      key: "length",
      passed: words >= 6 && words <= 35,
      tip: words < 6 ? "Add a little more detail." : "Keep it to one sentence.",
    },
  ];
}

/** Starter phrases offered as one-tap templates. */
export const ACHIEVEMENT_STARTERS = [
  "Increased … by …% by …",
  "Reduced … from … to … by …",
  "Led a team of … to …",
  "Trained … people on …, which …",
  "Built … that … for … users",
];
