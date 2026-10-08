# Jobs

Status: Unified Platform Service

## Positioning (decided 2026-10-07)

Jobs is **not a headline service and not a promise**. Scholastiar.ai's core offer is study, funding, relocation and mobility. Jobs is a **Pro-plan feature inside the candidate dashboard**: the ability to get connected to job openings that employers post. We never promise that a candidate will get a job.

- **Pro ($79):** full access to Jobs (student jobs) and Post-study jobs (visa sponsorship): browse, save, apply, track.
- **Starter ($35):** both sections appear in the dashboard and navigation, but locked. Opening either shows an upgrade prompt ("Job connections are part of Pro") and no listings, no counts and no job details.
- **Visitors:** there is no public job board, and job listings are never indexed. Marketing pages mention jobs only as a Pro feature, worded as "job connections — no promise of employment".
- **Employers:** unchanged. Employer Starter ($99) and Employer Pro ($249) still post jobs; Employer Pro is still required for post-study jobs with visa sponsorship. Their jobs are shown to Pro candidates only.
- **Wording:** say "job connections", "get connected to employers", "apply to openings". Never "find you a job", "get hired", "guaranteed" or similar.
- **Build order:** service 14 (formerly 01), built in UI stage U15 after Migration Agencies, followed by Employers (U16).

Scope decided 2026-10-01: Jobs covers **student jobs** and **post-study jobs** only. Post-study jobs are graduate roles where the employer **sponsors the graduate's work visa**. General professional jobs that are not aimed at international graduates are not part of the platform.

## Feature Vision

Jobs helps international students earn, gain experience and stay on after graduation in the country where they study.

It has two tracks:

1. **Student jobs** — part-time, term-time, holiday and campus jobs, internships and placements that a student can take within the work conditions of their study visa.
2. **Post-study jobs** — jobs for international students after they graduate, where the employer **sponsors their work visa** so they can stay and work. Graduates can often start on a post-study work permit (for example a graduate route) while the sponsored visa is arranged.

Core principle (a connection, not a promise):

> A student should never apply for a job their visa doesn't allow, and a graduate should see every job that will sponsor their work visa.

Jobs connects directly to Universities and Scholarships: the same student who applies to study abroad can find a student job while studying and a post-study job when they graduate.

## Problem Being Solved

International students struggle with:

- not knowing which jobs fit their study visa's work conditions
- shifts that clash with timetables and exams
- employers who are unsure whether students or graduates can legally work for them
- not knowing which graduate employers will sponsor a work visa
- graduate roles that say "international applicants welcome" but won't sponsor
- losing time near the end of a post-study permit with no sponsored job lined up

Employers struggle with:

- uncertainty about students' allowed working hours
- not knowing how to describe sponsorship and start-on-permit options clearly
- unstructured, high-volume student applications

## Target Users

- international students (current and incoming)
- recent and soon-to-graduate international students looking for a sponsored work visa
- employers hiring students and graduates (including universities hiring their own students)
- admins/moderators

## Job Tracks

### Student Jobs

Types:

- part-time term-time job
- holiday / vacation job
- campus job (library, student ambassador, research assistant, events)
- internship or placement (including course-required placements)

Every student job states:

- weekly hours during term time and during holidays
- shift pattern and flexibility around timetables and exams
- location and distance or travel time from campus
- hourly pay
- start date and duration
- whether it fits typical study visa work conditions for that country (see `SERVICES/20-work-eligibility.md`)

### Post-Study Jobs

Graduate jobs for international students after they graduate, where the employer sponsors the work visa.

Every post-study job states:

- country and city
- **visa sponsorship confirmed by the employer** (required to publish a post-study job)
- posted from an Employer Pro or Enterprise plan (post-study jobs are not available on Employer Starter)
- the sponsored work visa route (country reference list)
- when sponsorship starts: from day one, or after starting on a post-study permit
- the post-study permit types the employer accepts for starting before sponsorship, if any
- which visa costs the employer covers: none, some or all
- field-of-study or degree-level requirements
- salary range or a reason it is not disclosed
- start date

Sponsorship means the employer supports the visa application. The immigration authority makes the decision; the platform never promises a visa.

## Core Workflows

### Pro Access Gate

Every Jobs route checks the candidate's plan on the server. Pro candidates see the feed; Starter candidates get the locked page with an upgrade prompt. There is no public job discovery (removed 2026-10-07).

### Personalized Job Feed

Pro candidates see jobs ranked by fit across both tracks:

- **Students** see student jobs that fit their recorded visa work conditions, campus city and timetable.
- **Graduates** see post-study jobs in their field whose employers sponsor the work visa they need, including roles they can start on their post-study permit.

### Job Detail View

Candidates see the description, requirements, employer profile, match analysis, work-eligibility breakdown (visa hours fit for student jobs; sponsorship and start-on-permit details for post-study jobs) and application actions.

### Saved Jobs

Candidates save jobs, track closing dates and return later. Saved jobs also appear on the unified `/saved` page.

### Employer Job Posting

Employers choose the track (student or post-study), then complete the track's required fields, screening questions and deadline.

### Job Moderation

Admins review, flag, approve, pause or remove jobs. Moderation checks that student jobs state hours honestly and that every post-study job has employer-confirmed visa sponsorship.

## AI Opportunities

- job fit analysis for students and graduates
- timetable and hours compatibility explanation
- sponsorship and start-on-permit explanation for post-study roles
- missing skills detection
- student CV and cover letter tailoring (first-job and graduate formats)
- employer job description improvement, including clear hours and sponsorship wording
- screening question suggestions
- similar jobs

## Data Model Notes

Core entities:

- jobs (with `job_track`: student, post_study)
- job_requirements
- job_work_eligibility (student hours and post-study sponsorship details)
- post_study_permit_types and work_visa_routes (country reference data)
- job_screening_questions
- saved_jobs / saved_opportunities
- job_match_scores
- employer_companies

See `DATABASE/db.md` → Jobs Tables.

## UX Direction

Jobs should feel calm, honest and student-friendly.

Important UX:

- clear track label: Student job or Post-study job
- hours and pay visible on every student job card
- "Fits study visa hours" / "Check your visa hours" labels
- "Visa sponsorship offered" with the visa route and start-on-permit details on every post-study job
- clear match score with why-this-job reasons
- fast save/apply actions
- employer credibility signals

## Integrations

- candidate profile (study status, visa work conditions, post-study permit, sponsorship need)
- universities (campus city, course dates)
- AI CV generation
- AI-assisted applications
- employers
- candidate ranking
- application tracking

## Risks And Constraints

- visa work conditions are set by each student's own visa; the platform shows guidance, not legal advice
- labels are based on the conditions the candidate records and typical country rules; candidates must confirm their own conditions
- employers remain responsible for right-to-work checks
- never present a job as fitting a student's visa if its hours exceed the candidate's recorded limit
- visa and permit rules change; reference data needs review dates and official sources
- sponsorship must be employer-confirmed; never infer or promise it, and never guarantee a visa outcome
- prevent scam listings and unpaid "jobs" that should be paid roles
- employers should not see candidate data before appropriate permissions

## First Launch Defaults

- Employer-created jobs require admin approval before becoming visible to Pro candidates.
- Expired jobs are removed from active discovery and marked `closed` or `archived`.
- Mandatory fields are defined below.

## First Launch Decisions

### Publishing And Moderation

All employer-created jobs start as `draft` or `pending_review`.

- visibility to Pro candidates requires admin approval
- edited active jobs that change hours, pay, track or sponsorship details return to review
- admins can approve, reject, pause, archive or flag jobs
- suspicious jobs are never auto-published

### Mandatory Job Fields

All jobs:

- job track: student or post-study
- job title
- employer company
- country
- city or campus, or remote indication
- work mode: on-site, hybrid or remote
- description
- core responsibilities
- requirements
- application deadline
- application method: platform-hosted or external link
- screening questions, if the employer requires them

Student jobs also require:

- student job type: part-time, holiday, campus, internship/placement
- weekly hours in term time and in holidays
- hourly pay
- shift flexibility

Post-study jobs also require:

- visa sponsorship confirmation
- sponsored work visa route
- sponsorship timing: from day one or after starting on a post-study permit
- accepted post-study permit types for starting before sponsorship, or "none"
- visa costs covered: none, some or all
- salary range or explicit salary-not-disclosed reason
- start date

### Expired Job Handling

When a job passes its application deadline:

- remove it from active search results
- keep it visible to applicants who already applied
- mark it `closed` if the employer may still review applicants
- mark it `archived` when the employer/admin ends the process
- notify saved-job users before the deadline when possible

## Implementation Roadmap

### Phase 1

Student and post-study job posting, Pro access gate (locked for Starter), personalized feed, job details, saved jobs and apply entry, with work-eligibility labels.

### Phase 2

AI job matching, timetable fit, job description assistance and moderation.

### Phase 3

Advanced recommendations, permit-expiry planning (finding a sponsored job before a post-study permit ends) and employer quality signals.

## Later Phase Decisions (Non-Blocking)

- Which countries' work visa routes and post-study permits are in the first reference list?
- Should employers show their sponsorship track record (for example, graduates sponsored last year)?
