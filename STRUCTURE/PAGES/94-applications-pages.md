# Applications Pages

Status: Unified Platform Service

Source service specs: `SERVICES/94-ai-assisted-applications.md`, `SERVICES/95-application-tracking.md`, `SERVICES/101-application-intelligence.md`

## Page System Vision

Applications pages should reduce repetitive work and make each application feel strategically prepared.

The flow should support:

> Select job -> generate tailored CV -> answer screening questions -> attach PersonalityAI CV -> review -> submit -> track outcome.

## Candidate Pages

### Apply Page

Route: `/applications/apply/[jobId]`

Purpose: Main job application flow.

Steps:

- job fit review
- AI CV selection/generation
- screening questions
- cover letter
- right-to-work answers (study visa hours, post-study permit, sponsorship needed)
- PersonalityAI CV toggle
- final review
- submit

### Application Review Page

Route: `/applications/apply/[jobId]/review`

Purpose: Final pre-submit quality check.

Checks:

- missing answers
- weak responses
- unsupported claims
- CV/job mismatch
- visa answer consistency
- missing documents

### Applications Dashboard

Route: `/applications`

Purpose: List and manage all submitted applications.

Views:

- all
- draft
- submitted
- viewed
- shortlisted
- interview
- offer
- rejected

### Application Detail Page

Route: `/applications/[applicationId]`

Purpose: Full view of one application.

Sections:

- job summary
- status timeline
- submitted CV
- submitted answers
- cover letter
- PersonalityAI CV status
- employer messages
- next actions

### Draft Applications Page

Route: `/applications/drafts`

Purpose: Resume incomplete applications.

### Application Insights Page

Route: `/applications/insights`

Purpose: Premium performance analytics and AI improvement recommendations.

Metrics:

- response rate
- match score trends
- strongest countries/industries
- weak profile patterns
- CV performance
- application volume

## Employer Pages

### Employer Application Detail Page

Route: `/employers/applications/[applicationId]`

Purpose: Employer review of a submitted application.

Sections:

- AI candidate summary
- CV
- screening answers
- cover letter
- PersonalityAI CV
- work eligibility indicators
- ranking score
- pipeline actions

### Hiring Pipeline Page

Route: `/employers/pipeline`

Purpose: Kanban-style hiring pipeline across active jobs.

Stages:

- Applied
- Reviewed
- Shortlisted
- Interviewed
- Offered
- Rejected

## Admin Pages

### Admin Applications Page

Route: `/admin/applications`

Purpose: Internal oversight of application volume, errors, and moderation issues.

### Admin AI Application Generations Page

Route: `/admin/ai-generations/applications`

Purpose: Monitor answer generation quality and failures.

## Suggested MVP Page Set

- `/applications/apply/[jobId]`
- `/applications/apply/[jobId]/review`
- `/applications`
- `/applications/[applicationId]`
- `/applications/drafts`
- `/applications/insights`
- `/employers/applications/[applicationId]`
- `/employers/pipeline`
- `/admin/applications`
- `/admin/ai-generations/applications`

## Page Priority

### MVP Priority

- Apply Page
- Application Review Page
- Applications Dashboard
- Application Detail Page
- Employer Application Detail Page
- Hiring Pipeline Page

### Phase 2 Priority

- Draft Applications Page
- Application Insights Page
- Admin Applications Page
- Admin AI Application Generations Page
