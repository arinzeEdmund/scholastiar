# Competitions Pages

Status: Unified Platform Service

Source service spec: `SERVICES/06-competitions.md`

## Page System Vision

Competitions pages should support:

> Discover competitions -> check eligibility -> prepare team/project -> build submission -> practice pitch -> submit -> track -> convert results into credibility.

## Public Discovery Pages

### Competitions Home Page

Route: `/competitions`

Purpose: Entry point for competitions, challenges, hackathons, and contests.

Key sections: search, AI matcher, featured competitions, closing soon, by category, online/hybrid/in-person, verified competitions.

### Competition Directory Page

Route: `/competitions/search`

Purpose: Search and filter competitions.

Filters: country, online/in-person, field, applicant type, team/individual, prize, deadline, deliverables, judging criteria, difficulty, verification.

Competition cards should show:

- competition name
- organizer
- host country/region and format
- prize/funding/global exposure benefit
- deadline/application window
- estimated application effort
- success/fit score with responsible tooltip
- required deliverables
- verification status
- save action
- direct apply/submission action
- add to AI Apply Agent board, gated by subscription
- add to Apply For Me board, gated by subscription

### Competition Profile Page

Route: `/competitions/[competitionSlug]`

Purpose: Full competition details and application entry.

Sections: overview, organizer, eligibility, tracks, prizes, rules, deliverables, judging criteria, timeline, official link, verified status.

## Participant Workspace Pages

### AI Competition Matcher Page

Route: `/competitions/matcher`

Purpose: Recommend competitions based on skills, project, team, and goals.

### Project Profiles Page

Route: `/competitions/projects`

Purpose: Manage competition project profiles.

### Project Builder Page

Route: `/competitions/projects/[projectId]/builder`

Purpose: Build idea/project details used across competitions.

### Team Workspace Page

Route: `/competitions/teams/[teamId]`

Purpose: Manage members, roles, tasks, deliverables, notes, and deadlines.

### Saved Competitions Page

Route: `/competitions/saved`

Purpose: Shortlist competitions with deadlines, fit, and deliverable gaps.

### Competition Application Dashboard

Route: `/competitions/applications`

Purpose: Track all competition applications.

### Competition Application Detail Page

Route: `/competitions/applications/[applicationId]`

Purpose: Full operational view for one competition.

## Submission And Pitch Pages

### Eligibility Checker Page

Route: `/competitions/[competitionSlug]/eligibility`

Purpose: Check eligibility before preparing deliverables.

### Submission Builder Page

Route: `/competitions/applications/[applicationId]/submission`

Purpose: Build written answers, project summaries, links, portfolios, and deliverables.

### Deliverables Checklist Page

Route: `/competitions/applications/[applicationId]/deliverables`

Purpose: Track required videos, decks, documents, links, demos, code, and portfolios.

### Pitch Builder Page

Route: `/competitions/applications/[applicationId]/pitch`

Purpose: Build pitch deck outline, demo script, value proposition, and judge Q&A.

### Competition AI Review Page

Route: `/competitions/applications/[applicationId]/review`

Purpose: Check rule compliance, missing deliverables, weak story, unclear innovation, and deadline risk.

## Hosted And Provider Pages

### Assisted External Competition Workspace

Route: `/competitions/apply/external/[applicationId]`

Purpose: Guided side-panel support for external competition forms where allowed.

### Platform-Hosted Competition Application Page

Route: `/competitions/apply/hosted/[applicationId]`

Purpose: Hosted competition submission inside Scholastiar.ai.

### Organizer Portal

Route: `/competitions/organizer`

Purpose: Let organizers publish competitions and review submissions.

### Organizer Form Builder

Route: `/competitions/organizer/forms/[competitionId]`

Purpose: Define questions, deliverables, tracks, and judging criteria.

### Organizer Review Page

Route: `/competitions/organizer/submissions/[competitionId]`

Purpose: Review submissions and update statuses.

## Credibility And Admin Pages

### Post-Competition Toolkit

Route: `/competitions/credibility/[applicationId]`

Purpose: Convert participation/wins into CV updates, portfolio case studies, and announcements.

### Human Competition Review Page

Route: `/competitions/review`

Purpose: Request submission, pitch, or portfolio review.

### Competition Pricing Page

Route: `/competitions/pricing`

Purpose: Monetize AI submission tools, pitch prep, team workspaces, and human review.

### Admin Competitions Console

Route: `/admin/competitions`

Purpose: Manage competitions, verification, organizers, and reports.

## Suggested MVP Page Set

- `/competitions`
- `/competitions/search`
- `/competitions/[competitionSlug]`
- `/competitions/matcher`
- `/competitions/projects`
- `/competitions/projects/[projectId]/builder`
- `/competitions/saved`
- `/competitions/applications`
- `/competitions/applications/[applicationId]`
- `/competitions/applications/[applicationId]/submission`
- `/competitions/applications/[applicationId]/deliverables`
- `/competitions/applications/[applicationId]/pitch`
- `/competitions/review`
- `/competitions/pricing`
- `/admin/competitions`

## Page Priority

### MVP Priority

- Competitions Home Page
- Directory Page
- Profile Page
- AI Matcher
- Project Builder
- Saved Competitions
- Application Dashboard
- Submission Builder
- Deliverables Checklist
- Pitch Builder
- Human Review
- Admin Console

### Phase 2 Priority

- Team Workspace
- Assisted External Workspace
- Hosted Application
- Organizer Portal
- Post-Competition Toolkit
