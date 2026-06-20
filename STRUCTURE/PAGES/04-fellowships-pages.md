# Fellowships Pages

Status: Unified Platform Service

Source service spec: `SERVICES/04-fellowships.md`

## Page System Vision

Fellowships pages should support:

> Discover fellowships -> check eligibility -> build purpose and leadership profile -> generate essays -> manage references -> prepare interview -> track -> convert fellowship outcomes into career capital.

## Public Discovery Pages

### Fellowships Home Page

Route: `/fellowships`

Purpose: Entry point for fellowship discovery and application support.

Key sections: search, AI matcher, featured fellowships, fully funded/stipended fellowships, closing soon, by sector, by career stage, verified fellowships.

### Fellowship Directory Page

Route: `/fellowships/search`

Purpose: Search and filter fellowships.

Filters: country, format, sector, career stage, nationality, age, funding/stipend, duration, project requirement, references, interview, deadline, verification.

Fellowship cards should show:

- fellowship name
- provider or host organization
- host country/region and format
- funding/stipend or travel support
- deadline/application window
- estimated application effort
- success/fit score with responsible tooltip
- verification status
- save action
- direct apply action
- add to AI Apply Agent board, gated by subscription
- add to Apply For Me board, gated by subscription

### Fellowship Profile Page

Route: `/fellowships/[fellowshipSlug]`

Purpose: Full fellowship details and application entry.

Sections: overview, provider, duration, benefits, eligibility, selection criteria, essays, references, project details, cohort benefits, alumni outcomes, deadline, official link.

## Applicant Workspace Pages

### AI Fellowship Matcher Page

Route: `/fellowships/matcher`

Purpose: Recommend fellowships based on leadership, mission, career stage, and impact goals.

### Purpose Profile Page

Route: `/fellowships/purpose`

Purpose: Build reusable purpose, leadership, values, impact, and future contribution profile.

### Leadership Story Builder Page

Route: `/fellowships/leadership`

Purpose: Structure leadership experiences into strong fellowship narratives.

### Saved Fellowships Page

Route: `/fellowships/saved`

Purpose: Shortlist fellowships with deadlines, fit, references, essays, and missing requirements.

### Fellowship Application Dashboard

Route: `/fellowships/applications`

Purpose: Track all fellowship applications.

### Fellowship Application Detail Page

Route: `/fellowships/applications/[applicationId]`

Purpose: Full operational view for one fellowship application.

## AI Essay And Application Pages

### Eligibility Checker Page

Route: `/fellowships/[fellowshipSlug]/eligibility`

Purpose: Check eligibility before writing essays.

### AI Fellowship Answer Workspace

Route: `/fellowships/applications/[applicationId]/answers`

Purpose: One-to-one fellowship question mapping and answer generation.

### Fellowship Essay Builder Page

Route: `/fellowships/applications/[applicationId]/essays`

Purpose: Generate personal statements, leadership essays, purpose statements, impact essays, and project proposals.

### Fellowship AI Review Page

Route: `/fellowships/applications/[applicationId]/review`

Purpose: Check mission alignment, generic essays, unsupported leadership claims, weak project plans, missing references, and deadline risk.

## Reference And Interview Pages

### Reference Tracker Page

Route: `/fellowships/references`

Purpose: Manage referees, request emails, briefing notes, reminders, and uploaded letters.

### Referee Guest Page

Route: `/fellowships/references/[requestToken]`

Purpose: Let referees submit letters or confirm recommendations securely.

### Interview Prep Page

Route: `/fellowships/interview-prep/[applicationId]`

Purpose: Prepare for leadership, mission, project, and values-based interviews.

## Career, Provider And Admin Pages

### Post-Fellowship Career Toolkit

Route: `/fellowships/career/[applicationId]`

Purpose: Update AI CV, PersonalityAI CV, LinkedIn, certificate vault, and impact summary.

### Human Fellowship Review Page

Route: `/fellowships/review`

Purpose: Request essay, project, reference, or interview review.

### Fellowship Pricing Page

Route: `/fellowships/pricing`

Purpose: Monetize AI essays, purpose profile, leadership builder, references, interview prep, and human review.

### Provider Portal

Route: `/fellowships/provider`

Purpose: Let fellowship providers publish programs and review hosted applications.

### Admin Fellowships Console

Route: `/admin/fellowships`

Purpose: Manage fellowships, verification, providers, reports, and risky listings.

## Suggested MVP Page Set

- `/fellowships`
- `/fellowships/search`
- `/fellowships/[fellowshipSlug]`
- `/fellowships/matcher`
- `/fellowships/purpose`
- `/fellowships/leadership`
- `/fellowships/saved`
- `/fellowships/applications`
- `/fellowships/applications/[applicationId]`
- `/fellowships/applications/[applicationId]/answers`
- `/fellowships/applications/[applicationId]/essays`
- `/fellowships/references`
- `/fellowships/interview-prep/[applicationId]`
- `/fellowships/review`
- `/fellowships/pricing`
- `/admin/fellowships`

## Page Priority

### MVP Priority

- Fellowships Home Page
- Directory Page
- Profile Page
- AI Matcher
- Purpose Profile
- Leadership Story Builder
- Saved Fellowships
- Application Dashboard
- Answer Workspace
- Essay Builder
- Reference Tracker
- Interview Prep
- Human Review
- Admin Console

### Phase 2 Priority

- Referee Guest Page
- Fellowship AI Review Page
- Post-Fellowship Career Toolkit
- Provider Portal
