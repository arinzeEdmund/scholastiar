import "server-only";

import type { PortfolioOwner } from "@/components/signia/signia-portfolio";
import { repos } from "@/data";

/** Who a portfolio belongs to, with the PersonalityAI CV only where the owner allows it. */
export async function portfolioOwner(userId: string, audience: "public" | "reviewer"): Promise<PortfolioOwner> {
  const [user, bundle, personality, countries] = await Promise.all([
    repos.users.getProfile(userId),
    repos.candidate.getBundle(userId),
    repos.personality.get(userId),
    repos.reference.listCountries(),
  ]);
  const code = bundle.profile.nationality_country_code;
  const latest = bundle.education[0];
  const { profile, video } = personality;
  const videoAllowed =
    video && (profile.visibility === "signia" || (audience === "reviewer" && profile.visibility === "applications"));
  return {
    name: user?.full_name ?? "Scholastiar student",
    nationalityCode: code,
    nationality: countries.find((c) => c.iso2 === code)?.name ?? null,
    education: latest ? `${latest.qualification_name}, ${latest.institution_name}` : null,
    videoSeconds: videoAllowed ? video.duration_seconds : null,
  };
}
