# Awards Pages

Status: Unified Platform Service

Source service spec: `SERVICES/08-awards.md`

## Page System Vision

Awards pages should support the full journey:

> Discover awards -> check eligibility -> build achievement profile -> prepare evidence -> generate nomination/application answers -> submit -> track -> convert recognition into credibility.

## Public Discovery Pages

### Awards Home Page

Route: `/awards`

Purpose: Entry point for award discovery and reputation-building.

Key sections: search, AI award matcher, featured awards, awards closing soon, categories, verified awards, saved progress.

Primary actions: search, match, save, continue application.

### Award Directory Page

Route: `/awards/search`

Purpose: Search and filter awards.

Filters: country, field, career stage, applicant type, age, nationality, prize, nomination required, deadline, verification, difficulty.

Award cards should show:

- award name
- provider/organizer
- country/region and recognition value
- prize, travel, or global exposure benefit
- deadline/application window
- estimated application effort
- success/fit score with responsible tooltip
- nomination or evidence requirements
- verification status
- save action
- direct apply/nomination action
- add to AI Apply Agent board, gated by subscription
- add to Apply For Me board, gated by subscription

Primary actions: open profile, save, check eligibility, start application.

### Award Profile Page

Route: `/awards/[awardSlug]`

Purpose: Full award details and application entry.

Sections: overview, provider, categories, benefits, eligibility, judging criteria, required evidence, questions, deadline, official link, verified status, similar awards.

Primary actions: check eligibility, save, generate answers, request nomination, request review.

## Applicant Workspace Pages

### AI Award Matcher Page

Route: `/awards/matcher`

Purpose: Recommend awards based on achievements and profile.

Outputs: strong fit, possible fit, ambitious, missing evidence, not eligible.

### Achievement Profiles Page

Route: `/awards/achievements`

Purpose: Manage reusable achievement profiles.

Primary actions: create achievement, attach evidence, run readiness check.

### Achievement Builder Page

Route: `/awards/achievements/[achievementId]/builder`

Purpose: Build measurable achievement stories.

Fields: title, role, context, actions, results, beneficiaries, evidence, testimonials, links.

### Saved Awards Page

Route: `/awards/saved`

Purpose: Shortlist awards with deadlines, fit, evidence gaps, and priority.

### Award Application Dashboard

Route: `/awards/applications`

Purpose: Track all award applications.

Statuses: discovered, saved, eligibility checked, evidence missing, nomination requested, answers generated, submitted, shortlisted, awarded, not selected.

### Award Application Detail Page

Route: `/awards/applications/[applicationId]`

Purpose: Full operational view for one award.

Sections: award summary, status, evidence, generated answers, nomination status, AI review, human review, timeline.

## AI Application Pages

### Eligibility Checker Page

Route: `/awards/[awardSlug]/eligibility`

Purpose: Check award fit before applying.

### AI Award Answer Workspace

Route: `/awards/applications/[applicationId]/answers`

Purpose: One-to-one award question mapping and answer generation.

### Evidence Readiness Page

Route: `/awards/evidence`

Purpose: Manage certificates, media, testimonials, project links, metrics screenshots, and proof of impact.

### Award AI Review Page

Route: `/awards/applications/[applicationId]/review`

Purpose: Check evidence gaps, unsupported claims, weak impact language, missing nomination materials, and deadline risk.

## Nomination And Reputation Pages

### Nomination Tracker Page

Route: `/awards/nominations`

Purpose: Manage nominators, request emails, briefing documents, reminders, and references.

### Nominator Guest Page

Route: `/awards/nominations/[requestToken]`

Purpose: Let nominators submit references or nomination material securely.

### Post-Award Reputation Toolkit

Route: `/awards/reputation/[applicationId]`

Purpose: Turn award outcomes into CV updates, LinkedIn posts, verified achievement storage, and PersonalityAI CV updates.

## Premium And Admin Pages

### Human Award Review Page

Route: `/awards/review`

Purpose: Request expert review of award applications and evidence packages.

### Award Pricing Page

Route: `/awards/pricing`

Purpose: Monetize award matching, AI answers, evidence review, nomination support, and reputation tools.

### Provider Portal

Route: `/awards/provider`

Purpose: Let award providers publish awards and review hosted submissions.

### Admin Awards Console

Route: `/admin/awards`

Purpose: Manage awards, verification, providers, reports, and risky listings.

## Suggested MVP Page Set

- `/awards`
- `/awards/search`
- `/awards/[awardSlug]`
- `/awards/matcher`
- `/awards/achievements`
- `/awards/achievements/[achievementId]/builder`
- `/awards/saved`
- `/awards/applications`
- `/awards/applications/[applicationId]`
- `/awards/applications/[applicationId]/answers`
- `/awards/evidence`
- `/awards/review`
- `/awards/pricing`
- `/admin/awards`

## Page Priority

### MVP Priority

- Awards Home Page
- Award Directory Page
- Award Profile Page
- AI Award Matcher Page
- Achievement Builder Page
- Saved Awards Page
- Application Dashboard
- Answer Workspace
- Evidence Readiness Page
- Human Review Page
- Admin Awards Console

### Phase 2 Priority

- Nomination Tracker
- Nominator Guest Page
- Award AI Review Page
- Post-Award Reputation Toolkit
- Provider Portal
