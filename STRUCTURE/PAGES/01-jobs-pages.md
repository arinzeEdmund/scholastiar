# Jobs Pages

Status: Unified Platform Service

Source service specs: `SERVICES/01-jobs.md`, `SERVICES/20-visa-sponsored-jobs.md`

## Page System Vision

Jobs pages should make Scholastiar.ai feel like an intelligent employment discovery system, not a static job board.

The user should understand which jobs match them, which jobs support visa sponsorship, and what actions to take next.

## Public Pages

### Public Job Board Page

Route: `/jobs`

Purpose: Public browsable job board with limited teaser access for unauthenticated users.

Key sections:

- search
- location filters
- visa sponsorship filter
- role/category filters
- featured visa-sponsored jobs
- sign-up prompts

Primary actions:

- search jobs
- open job detail
- sign up to apply

### Public Job Detail Page

Route: `/jobs/[jobId]/public`

Purpose: Public view of one job with signup prompt.

Key sections:

- job title
- employer
- location
- sponsorship indicator
- summary
- requirements preview
- signup CTA

### For Employers Landing Page

Route: `/for-employers`

Purpose: Public employer product page.

Primary actions:

- create employer account
- view pricing
- learn hiring features

## Candidate Pages

### Personalized Job Feed Page

Route: `/dashboard/jobs`

Purpose: Personalized job discovery feed for logged-in candidates.

Filters:

- keyword
- country/city
- visa sponsorship
- relocation support
- salary
- remote/hybrid/on-site
- job type
- seniority
- industry
- match score

Job cards should show:

- title
- employer
- location
- sponsorship badge
- match score
- success score or fit score with responsible tooltip
- estimated application effort, such as `2 min apply`
- salary if available
- deadline/status
- application window or closing date
- save action
- direct apply action
- add to AI Apply Agent board, gated by subscription
- add to Apply For Me board, gated by subscription

### Job Detail Page

Route: `/dashboard/jobs/[jobId]`

Purpose: Full job detail with AI match and visa context.

Key sections:

- job description
- employer profile
- requirements
- benefits
- visa sponsorship breakdown
- AI match analysis
- missing skills
- suggested CV angle
- PersonalityAI CV relevance

Primary actions:

- apply
- save
- generate tailored CV
- ask AI about fit

### Saved Jobs Page

Route: `/dashboard/jobs/saved`

Purpose: Manage bookmarked jobs.

Views:

- all saved
- closing soon
- high match
- visa sponsored
- applied/not applied

### Visa-Sponsored Jobs Page

Route: `/dashboard/jobs/visa-sponsored`

Purpose: Dedicated discovery surface for sponsorship-friendly roles.

Key sections:

- sponsorship-friendly jobs
- relocation-friendly employers
- country filters
- visa complexity notes
- role match

## Employer Pages

### Employer Job Listings Page

Route: `/employers/jobs`

Purpose: Manage active, paused, draft, and closed jobs.

Primary actions:

- create job
- edit job
- pause/close job
- view applicants

### Create Job Page

Route: `/employers/jobs/new`

Purpose: Create a job post with AI-assisted description writing.

Inputs:

- job title
- location
- work mode
- salary
- description
- requirements
- benefits
- visa sponsorship toggle
- screening questions
- application deadline

### Edit Job Page

Route: `/employers/jobs/[jobId]/edit`

Purpose: Edit an existing job listing.

### Job Applicants Page

Route: `/employers/jobs/[jobId]/applicants`

Purpose: View all applicants for a job ranked by AI match.

Filters:

- match score
- visa status
- location
- skills
- pipeline stage
- PersonalityAI CV available

## Admin Pages

### Admin Jobs Page

Route: `/admin/jobs`

Purpose: Moderate and manage job listings.

Primary actions:

- approve
- reject
- edit
- flag employer
- remove listing

## Suggested MVP Page Set

- `/jobs`
- `/jobs/[jobId]/public`
- `/for-employers`
- `/dashboard/jobs`
- `/dashboard/jobs/[jobId]`
- `/dashboard/jobs/saved`
- `/dashboard/jobs/visa-sponsored`
- `/employers/jobs`
- `/employers/jobs/new`
- `/employers/jobs/[jobId]/edit`
- `/employers/jobs/[jobId]/applicants`
- `/admin/jobs`

## Page Priority

### MVP Priority

- Public Job Board Page
- Public Job Detail Page
- Personalized Job Feed Page
- Job Detail Page
- Saved Jobs Page
- Visa-Sponsored Jobs Page
- Employer Job Listings Page
- Create Job Page
- Job Applicants Page
- Admin Jobs Page

### Phase 2 Priority

- AI Job Match Explanation Page
- Employer Preview Job Page
- Visa Complexity Reference Page
