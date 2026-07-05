import type { JobWithDetails } from '@/types/database';

export interface MatchResult {
  score: number;
  reasons: string[];
}

export interface CandidatePrefs {
  targetCountries: string[];
  workModes: string[];
  targetRoles: string[];
  skills: string[];
  seniorityLevels: string[];
  needsSponsorship: boolean;
}

export function computeMatchScore(job: JobWithDetails, prefs: CandidatePrefs): MatchResult {
  let score = 30;
  const reasons: string[] = [];

  if (prefs.targetCountries.length > 0 && prefs.targetCountries.includes(job.country ?? '')) {
    score += 25;
    reasons.push(`${job.country} is in your target countries`);
  }

  const jobMode = job.work_mode ?? '';
  if (prefs.workModes.length > 0 && prefs.workModes.includes(jobMode)) {
    score += 15;
    reasons.push(`${jobMode.replace('_', '-')} matches your work mode`);
  }

  const reqSkills = (job.job_requirements ?? [])
    .filter((r) => r.requirement_type === 'skill')
    .map((r) => r.requirement_text.toLowerCase());
  const candidateSkills = prefs.skills.map((s) => s.toLowerCase());
  const matched = reqSkills.filter((rs) =>
    candidateSkills.some((cs) =>
      cs.includes(rs.split(' ')[0]) || rs.includes(cs.split(' ')[0])
    )
  );
  if (matched.length > 0) {
    score += Math.min(20, matched.length * 7);
    reasons.push(`${matched.length} skill match${matched.length > 1 ? 'es' : ''}`);
  }

  const sponsorship = job.job_sponsorship_metadata;
  if (prefs.needsSponsorship && sponsorship?.sponsorship_status === 'available') {
    score += 10;
    reasons.push('Offers visa sponsorship');
  }

  if (prefs.seniorityLevels.length > 0 && prefs.seniorityLevels.includes(job.seniority_level ?? '')) {
    score += 5;
    reasons.push('Matches your seniority level');
  }

  const jobTitleLower = job.title.toLowerCase();
  if (prefs.targetRoles.some((r) => jobTitleLower.includes(r.toLowerCase().split(' ')[0]))) {
    score += 5;
    reasons.push('Matches your target roles');
  }

  return { score: Math.min(98, score), reasons };
}
