# Conferences And Training Pages

Status: Unified Platform Service

Source service spec: `SERVICES/07-conferences-training.md`

## Page System Vision

Conferences and Training pages should support:

> Discover opportunities -> check eligibility -> prepare application/abstract -> manage travel and visa readiness -> attend -> network -> convert participation into career value.

## Public Discovery Pages

### Conferences And Training Home Page

Route: `/conferences`

Purpose: Entry point for conferences, workshops, trainings, summits, bootcamps, and academies.

Key sections: search, AI matcher, funded opportunities, closing soon, by field, by country, online/hybrid/in-person, verified opportunities.

### Opportunity Directory Page

Route: `/conferences/search`

Purpose: Search and filter events and training opportunities.

Filters: country, city, online/in-person, field, event type, funding, visa support, certificate, deadline, duration, cost, language, verification.

Opportunity cards should show:

- event/training name
- organizer
- host country/city and format
- funding, travel support, visa support, or certificate signals
- deadline/application window
- event dates
- estimated application effort
- success/fit score with responsible tooltip
- verification status
- save action
- direct apply action
- add to AI Apply Agent board, gated by subscription
- add to Apply For Me board, gated by subscription

### Opportunity Profile Page

Route: `/conferences/[opportunitySlug]`

Purpose: Full opportunity details and application entry.

Sections: overview, organizer, location, dates, eligibility, fees, funding, requirements, abstract rules, certificate, agenda, speakers, visa/travel notes, official link.

## Applicant Workspace Pages

### AI Opportunity Matcher Page

Route: `/conferences/matcher`

Purpose: Recommend events based on career goals, research interests, funding needs, and location preferences.

### Saved Opportunities Page

Route: `/conferences/saved`

Purpose: Shortlist opportunities with deadlines, fit, cost, travel needs, and document gaps.

### Application Dashboard

Route: `/conferences/applications`

Purpose: Track all conference/training applications.

Statuses: discovered, saved, eligibility checked, documents missing, drafted, submitted, accepted, rejected, waitlisted, travel/visa stage, attended, certificate received.

### Application Detail Page

Route: `/conferences/applications/[applicationId]`

Purpose: Full operational view for one opportunity.

## AI Application Pages

### Eligibility Checker Page

Route: `/conferences/[opportunitySlug]/eligibility`

Purpose: Check eligibility and funding/travel readiness.

### Application Builder Page

Route: `/conferences/applications/[applicationId]/builder`

Purpose: Generate motivation statements, training goals, funding requests, bios, and answers.

### Abstract Builder Page

Route: `/conferences/applications/[applicationId]/abstract`

Purpose: Draft or refine abstracts, titles, keywords, research summaries, poster outlines, and presentation outlines.

### AI Review Page

Route: `/conferences/applications/[applicationId]/review`

Purpose: Check missing documents, weak motivation, abstract quality, funding fit, visa/travel risks, and deadline issues.

## Travel, Networking And Career Pages

### Document And Travel Readiness Page

Route: `/conferences/documents`

Purpose: Track passport, invitation letter, proof of registration, travel grant letter, accommodation, insurance, and permission letters.

### Visa And Travel Checklist Page

Route: `/conferences/travel/[applicationId]`

Purpose: Manage country/event-specific travel preparation.

### Networking Planner Page

Route: `/conferences/networking/[applicationId]`

Purpose: Build speaker outreach, elevator pitch, session plan, and post-event follow-ups.

### Post-Event Career Toolkit

Route: `/conferences/career/[applicationId]`

Purpose: Add certificates, update AI CV, generate LinkedIn posts, summarize learning, and create employer-facing summaries.

## Provider And Admin Pages

### Organizer Portal

Route: `/conferences/organizer`

Purpose: Let organizers publish opportunities and review applications.

### Human Review Page

Route: `/conferences/review`

Purpose: Request abstract, motivation, or travel support statement review.

### Pricing Page

Route: `/conferences/pricing`

Purpose: Monetize applications, abstract support, travel readiness, networking planner, and human review.

### Admin Conferences Console

Route: `/admin/conferences`

Purpose: Manage opportunities, organizers, verification, reports, and risky listings.

## Suggested MVP Page Set

- `/conferences`
- `/conferences/search`
- `/conferences/[opportunitySlug]`
- `/conferences/matcher`
- `/conferences/saved`
- `/conferences/applications`
- `/conferences/applications/[applicationId]`
- `/conferences/applications/[applicationId]/builder`
- `/conferences/applications/[applicationId]/abstract`
- `/conferences/documents`
- `/conferences/review`
- `/conferences/pricing`
- `/admin/conferences`

## Page Priority

### MVP Priority

- Home Page
- Directory Page
- Profile Page
- AI Matcher
- Saved Opportunities
- Application Dashboard
- Application Builder
- Abstract Builder
- Document Readiness
- Human Review
- Pricing
- Admin Console

### Phase 2 Priority

- Travel Checklist
- Networking Planner
- Post-Event Career Toolkit
- Organizer Portal
