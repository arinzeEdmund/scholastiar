# Work Eligibility (Study Visa Hours And Post-Study Sponsorship)

Status: Unified Platform Service

Replaces the former Visa-Sponsored Jobs service (decided 2026-10-01). Supports `SERVICES/14-jobs.md`. Job labels are shown inside the Pro-only Jobs section; the visa and permit details candidates record are also used by Relocation.

## Feature Vision

Work Eligibility tells students and graduates, on every job, whether they can realistically take it:

- **Student jobs:** does the role fit the work conditions of the candidate's study visa (hours in term time and holidays, type of work)? No sponsorship is involved.
- **Post-study jobs:** will the employer sponsor the graduate's work visa, through which route, from when, and can the graduate start on their post-study permit first?

Core promise:

> Students should never waste an application on a job their visa doesn't allow, and graduates should know exactly which employers will sponsor their work visa.

## Problem Being Solved

Students and graduates face:

- confusion about how many hours they may work while studying, and when
- student jobs whose hours quietly exceed their visa conditions
- graduate employers who say "international applicants welcome" but won't sponsor
- post-study permits running out before a sponsored job is found

Employers face:

- uncertainty about students' allowed hours
- not knowing how to describe sponsorship and start-on-permit options clearly
- avoidable compliance mistakes

## Target Users

- international students
- graduates who need a sponsored work visa to stay (often while on a post-study permit)
- employers hiring students and sponsoring graduates
- admins maintaining visa route and permit reference data

## Core Workflows

### Candidate Work Conditions

During onboarding and in their profile, candidates record:

- study status: incoming, studying, graduated
- study country, institution and course dates
- study visa work conditions as stated on their visa: weekly hour limit in term time, holiday arrangements, restrictions
- post-study permit: type, status (holding, applying, planning, none) and expiry date
- whether they will need work visa sponsorship after graduating, and for which countries

Candidates confirm these from their own visa documents. The platform never decides them.

### Job Eligibility Labels

Student jobs:

- fits study visa hours — job hours are within the candidate's recorded term-time and holiday limits
- check your visa hours — job hours exceed the candidate's recorded limit, or the candidate hasn't recorded one
- holiday only — role is only offered during official holidays

Post-study jobs:

- visa sponsorship offered — employer-confirmed, with the sponsored visa route (required on every post-study job)
- start on your post-study permit — the employer accepts the candidate's permit type for starting before sponsorship
- sponsorship from day one — no permit needed to start
- check permit validity — the candidate's permit ends before the employer's planned sponsorship date
- visa costs covered — none, some or all, as stated by the employer

### Eligibility-Aware Search

Candidates filter by track, country/city, hours per week, fits-my-visa-hours, sponsored visa route, start-on-permit, visa costs covered and start date.

### Employer Eligibility Setup

Employers state hours (term time and holiday) for student jobs. For post-study jobs they confirm sponsorship and state the visa route, timing, accepted post-study permits and which costs they cover. Admin moderation checks these before publishing; a post-study job without confirmed sponsorship cannot be published.

### Permit-To-Sponsorship Planning (Phase 3)

Graduates see how long their post-study permit has left and which sponsored jobs they can secure before it ends.

## AI Opportunities

- detect stated hours and sponsorship wording in job descriptions
- flag ambiguous hours or sponsorship claims for moderation
- suggest clear employer wording for hours, sponsorship and start-on-permit options
- explain candidate–job eligibility in plain language
- draft answers to "Do you have the right to work?" and "Will you need sponsorship?" from the candidate's recorded conditions

## Data Model Notes

Core entities:

- job_work_eligibility (student hours; post-study sponsorship details)
- work_visa_routes (reference data: country, route name, official URL, review date)
- post_study_permit_types (reference data: country, name, official URL, review date)
- candidate_visa_profiles (study visa work conditions, post-study permit, sponsorship need)
- work_eligibility_scores

See `DATABASE/db.md`.

## UX Direction

Eligibility information should be visible, direct and reassuring.

- Show the label on every job card and detail page.
- Explain why in one sentence ("This job is 12 hours a week; your recorded term-time limit is 20" / "Sponsors a Skilled Worker visa; you can start on your Graduate permit").
- Always link to the candidate's own visa conditions in their profile.

## Risks And Constraints

- guidance, not legal advice; candidates confirm their own conditions
- sponsorship must be employer-confirmed, never inferred, before a post-study job is published
- sponsorship is support for an application, not a guaranteed visa; the immigration authority decides
- country rules change: route and permit reference data need official sources and review dates
- employers remain responsible for right-to-work checks and any sponsor licence their country requires

## Later Phase Decisions (Non-Blocking)

- Which countries, work visa routes and post-study permits are in the first reference list?
- Should employers show their sponsorship track record?
- Should the platform show typical country hour limits when a candidate hasn't recorded their own?

## Implementation Roadmap

### Phase 1

Candidate work conditions, employer hours and sponsorship fields, eligibility labels and filters.

### Phase 2

AI detection of hours and sponsorship wording, and plain-language eligibility explanations.

### Phase 3

Permit-to-sponsorship planning for graduates.
