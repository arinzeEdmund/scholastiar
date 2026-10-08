import type { CandidateBundle } from "@/data/repositories/candidate";
import type { CvVersion } from "@/data/types";
import { buildCv, CV_FORMATS, keywordsFrom } from "@/lib/cv/build";

import {
  candidateProfileFixtures,
  careerPreferenceFixtures,
  certificationFixtures,
  documentFixtures,
  educationFixtures,
  onboardingSessionFixtures,
  skillFixtures,
  visaProfileFixtures,
  workExperienceFixtures,
} from "./candidate";
import { programFixtures } from "./catalogue";

// Two CVs Amara generated earlier, built from her fixture profile like the real flow.

function bundleFor(userId: string): CandidateBundle {
  return {
    profile: candidateProfileFixtures.find((p) => p.user_id === userId)!,
    visa: visaProfileFixtures.find((v) => v.user_id === userId)!,
    education: educationFixtures.filter((e) => e.user_id === userId),
    experience: workExperienceFixtures.filter((x) => x.user_id === userId),
    skills: skillFixtures.filter((s) => s.user_id === userId),
    certifications: certificationFixtures.filter((c) => c.user_id === userId),
    preferences: careerPreferenceFixtures.find((p) => p.user_id === userId)!,
    documents: documentFixtures.filter((d) => d.owner_user_id === userId),
    onboarding: onboardingSessionFixtures.find((o) => o.user_id === userId)!,
  };
}

function seeded(id: string, programId: string, format: CvVersion["format"], created: string): CvVersion {
  const bundle = bundleFor("user-amara");
  const program = programFixtures.find((p) => p.id === programId)!;
  const keywords = keywordsFrom(`${program.name} ${program.field_name} ${program.description}`);
  return {
    id,
    user_id: "user-amara",
    title: `${program.name} — ${CV_FORMATS[format].label}`,
    format,
    tone: "concise",
    target_type: "program",
    target_id: program.id,
    target_label: program.name,
    target_keywords: keywords,
    content: buildCv(bundle, {
      name: "Amara Okafor",
      email: "amara.okafor@example.com",
      nationality: "Nigeria",
      location: "London, United Kingdom",
      format,
      tone: "concise",
      sections: CV_FORMATS[format].order,
      keywords,
      strengths: [],
      targetLabel: program.name,
    }),
    source: "generated",
    edited_at: null,
    created_at: created,
    updated_at: created,
  };
}

export const cvVersionFixtures: CvVersion[] = [
  seeded("cv-amara-public-health", "prog-volga-public-health", "academic", "2026-10-02T10:00:00.000Z"),
  seeded("cv-amara-pgcert", "prog-gulf-pgcert", "uk_cv", "2026-09-20T15:30:00.000Z"),
];
