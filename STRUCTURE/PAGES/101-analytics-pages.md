# Analytics Pages

Status: Unified Platform Service

Source service specs: `SERVICES/105-analytics.md`, `SERVICES/101-application-intelligence.md`

## Page System Vision

Analytics pages should turn platform activity into actionable intelligence for candidates, employers, and admins.

Candidate analytics should improve job search outcomes. Employer analytics should improve hiring efficiency. Admin analytics should improve platform operations.

## Candidate Pages

### Application Insights Page

Route: `/applications/insights`

Purpose: Premium candidate analytics dashboard.

Metrics:

- total applications
- response rate
- interview rate
- match score trends
- response by country
- response by industry
- response by job type
- CV version performance
- profile strength over time

AI insights:

- weak application patterns
- strongest target segments
- profile gaps
- recommended job strategy

### Profile Strength Analytics Page

Route: `/profile/insights`

Purpose: Show how profile completeness affects matching and applications.

## Employer Pages

### Employer Analytics Page

Route: `/employers/analytics`

Purpose: Hiring funnel analytics.

Metrics:

- total applicants
- reviewed
- shortlisted
- interviewed
- offered
- time-to-hire
- candidate source breakdown
- geographic distribution
- visa sponsorship demand
- candidate drop-off

### Job Analytics Page

Route: `/employers/jobs/[jobId]/analytics`

Purpose: Analytics for one job listing.

Metrics:

- views
- saves
- applications
- completion rate
- candidate match distribution
- screening question drop-off

## Admin Pages

### Admin Analytics Page

Route: `/admin/analytics`

Purpose: Platform-wide metrics.

Sections:

- user acquisition
- employer acquisition
- active jobs
- application volume
- AI usage
- revenue
- retention
- error/failure trends

## Suggested MVP Page Set

- `/applications/insights`
- `/profile/insights`
- `/employers/analytics`
- `/employers/jobs/[jobId]/analytics`
- `/admin/analytics`

## Page Priority

### MVP Priority

- Application Insights Page
- Employer Analytics Page
- Admin Analytics Page

### Phase 2 Priority

- Profile Strength Analytics Page
- Job Analytics Page
