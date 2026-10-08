import {
  Award,
  BarChart3,
  Compass,
  FileCheck2,
  Globe2,
  GraduationCap,
  LayoutGrid,
  Plane,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import type { ArticleCategory, OpportunityType } from "@/data/types";

export interface OpportunityCategory {
  type: OpportunityType;
  label: string;
  description: string;
  /** Public listing route (ROUTES.md). */
  href: string;
  icon: LucideIcon;
}

/**
 * The public apply-able opportunity services, in build order. Jobs are not listed: they are
 * Pro-only job connections inside the candidate dashboard (PRICING.md → Jobs Are Pro Only).
 */
export const OPPORTUNITY_CATEGORIES: OpportunityCategory[] = [
  {
    type: "universities",
    label: "Universities",
    description: "Programmes abroad with admissions and student visa guidance.",
    href: "/universities",
    icon: GraduationCap,
  },
  {
    type: "scholarships",
    label: "Scholarships",
    description: "Funded study, matched to your eligibility.",
    href: "/scholarships",
    icon: Award,
  },
];

/** Relocation is a journey, not an apply-able listing, but sits beside the categories on public pages. */
export const RELOCATION_CATEGORY = {
  label: "Relocation",
  description: "Pre-arrival and post-arrival steps, costs and housing for your move.",
  href: "/relocation",
  icon: Plane,
};

export const ARTICLE_CATEGORIES: Record<ArticleCategory, string> = {
  opportunities: "Opportunities",
  immigration: "Immigration & mobility",
  readiness: "Application readiness",
  product: "Using Scholastiar",
  insights: "Insights",
};

export const ARTICLE_CATEGORY_ICONS: Record<ArticleCategory | "all", LucideIcon> = {
  all: LayoutGrid,
  opportunities: Compass,
  immigration: Globe2,
  readiness: FileCheck2,
  product: Sparkles,
  insights: BarChart3,
};
