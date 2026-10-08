# Jobs Pages

Status: Unified Platform Service

Source service specs: `SERVICES/14-jobs.md`, `SERVICES/20-work-eligibility.md`

Scope (decided 2026-10-01): student jobs, and post-study jobs where the employer sponsors the graduate's work visa.

## Page System Vision

Jobs pages should feel like a calm, student-friendly job finder, not a noisy job board.

The user should understand, on every job, whether it fits their study visa hours (student jobs) or whether the employer sponsors their work visa (post-study jobs), and what to do next.

## Access (decided 2026-10-07)

Every candidate Jobs page is Pro only and lives inside the candidate dashboard. There is no public job board; the former `/jobs` and `/jobs/[jobId]/public` pages were removed. See `SERVICES/14-jobs.md` → Positioning.

### Locked State (Starter)

Shown on every candidate Jobs route (`/dashboard/jobs`, `/dashboard/jobs/[jobId]`, `/dashboard/jobs/saved`, `/dashboard/jobs/post-study`, `/applications/apply/[jobId]`, `/applications/apply/[jobId]/review`) when the candidate is on Starter.

Key sections:

- lock icon and "Pro" badge
- title: "Job connections are part of Pro" (Post-study: "Post-study jobs with visa sponsorship are part of Pro")
- what Pro unlocks: student jobs that fit your visa hours, post-study jobs with sponsorship, save and apply
- the no-promise line: "We connect you to openings employers post. We can't promise a job."
- no listings, counts, employer names or job details

Primary actions:

- upgrade to Pro
- compare plans

Dashboard and navigation: the Jobs and Post-study jobs tiles and menu items show a lock and a "Pro" badge for Starter candidates and open the upgrade prompt.

## Public Pages

### For Employers Landing Page

Route: `/for-employers`

Purpose: Public page for employers hiring international students and graduates.

Primary actions:

- create employer account
- view pricing
- learn hiring features

## Candidate Pages

### Personalized Job Feed Page

Route: `/dashboard/jobs`

Purpose: Personalized discovery across both tracks for Pro candidates (Starter sees the locked state). Students land on Student jobs; graduates land on Post-study jobs.

Filters:

- keyword
- track
- country/city/campus
- hours per week (term time / holiday)
- fits my visa hours
- shift flexibility
- pay
- visa sponsorship route
- can start on my post-study permit
- visa costs covered
- start date
- remote/hybrid/on-site
- match score

Job cards show:

- title and track label
- employer
- location
- hours and hourly pay (student) or salary and "Visa sponsorship offered" with the route (post-study)
- work eligibility label
- match score with why-this-job reason
- success score with responsible tooltip
- estimated application effort, such as `5 min apply`
- application window or closing date
- save action
- direct apply action
- add to AI Apply Agent board, gated by subscription
- add to Apply For Me board, gated by subscription

### Job Detail Page

Route: `/dashboard/jobs/[jobId]`

Purpose: Full job detail with AI match and work eligibility.

Key sections:

- job description
- employer profile
- requirements
- hours, shifts and pay, or salary and start date
- work eligibility breakdown (visa hours fit, or sponsorship route, timing, start-on-permit and costs covered, with the reason)
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

Purpose: Manage saved jobs (a filtered view of the unified `/saved` page).

Views:

- all saved
- closing soon
- high match
- student jobs
- post-study jobs
- applied/not applied

### Post-Study Jobs Page

Route: `/dashboard/jobs/post-study`

Purpose: Dedicated surface for graduates looking for a job that will sponsor their work visa.

Key sections:

- jobs that sponsor the work visa the candidate needs
- jobs the candidate can start on their post-study permit
- permit status and time remaining before a sponsored job is needed
- country and city filters
- field-of-study match
- employers who regularly sponsor international graduates

## Employer Pages

### Employer Job Listings Page

Route: `/employers/jobs`

Purpose: Manage active, paused, draft and closed jobs across both tracks.

Primary actions:

- create job
- edit job
- pause/close job
- view applicants

### Create Job Page

Route: `/employers/jobs/new`

Purpose: Create a student or post-study job with AI-assisted description writing.

Inputs:

- track: student job or post-study job
- job title
- location or campus
- work mode
- description
- requirements
- screening questions
- application deadline

Student job inputs:

- student job type
- term-time and holiday weekly hours
- shift flexibility
- hourly pay
- start date and duration

Post-study job inputs:

- visa sponsorship confirmation (required)
- sponsored work visa route
- sponsorship timing: from day one or after starting on a post-study permit
- accepted post-study permit types for starting before sponsorship
- visa costs covered
- salary range
- start date

### Edit Job Page

Route: `/employers/jobs/[jobId]/edit`

Purpose: Edit an existing job listing.

### Job Applicants Page

Route: `/employers/jobs/[jobId]/applicants`

Purpose: View all applicants for a job ranked by AI match.

Filters:

- match score
- study status, permit status or sponsorship need
- available hours
- location
- skills
- pipeline stage
- PersonalityAI CV available

## Admin Pages

### Admin Jobs Page

Route: `/admin/jobs`

Purpose: Moderate job listings, including checks that student-job hours are stated and that every post-study job has employer-confirmed visa sponsorship.

Primary actions:

- approve
- reject
- edit
- flag employer
- remove listing

## Suggested MVP Page Set

- `/for-employers`
- `/dashboard/jobs`
- `/dashboard/jobs/[jobId]`
- `/dashboard/jobs/saved`
- `/dashboard/jobs/post-study`
- `/employers/jobs`
- `/employers/jobs/new`
- `/employers/jobs/[jobId]/edit`
- `/employers/jobs/[jobId]/applicants`
- `/admin/jobs`

## Page Priority

### MVP Priority

- Locked State (Starter)
- Personalized Job Feed Page
- Job Detail Page
- Saved Jobs Page
- Post-Study Jobs Page
- Employer Job Listings Page
- Create Job Page
- Job Applicants Page
- Admin Jobs Page

### Phase 2 Priority

- AI Job Match Explanation Page
- Employer Preview Job Page
- Visa Route And Post-Study Permit Reference Page
