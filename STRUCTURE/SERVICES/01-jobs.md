# Jobs

Status: Unified Platform Service

## Feature Vision

Jobs is the core discovery layer for employment opportunities that can improve a candidate's life, including roles that help them work abroad, relocate, migrate, or move toward a country of choice in search of greener pastures.

It should help candidates find roles that match their profile, preferences, skills, career direction, target countries, relocation goals, and visa reality, while giving employers a clean way to publish roles and receive structured applicants.

Core promise:

> Job discovery should feel personalized, strategic, mobility-aware, and action-ready.

## Problem Being Solved

Traditional job boards are noisy and repetitive.

Candidates struggle with:

- too many irrelevant jobs
- unclear fit
- repetitive applications
- poor visibility into employer needs
- weak filtering by international constraints
- limited clarity on which jobs can help them move abroad, relocate, or build a better future in another country

Employers struggle with:

- unstructured applications
- low-quality applicant volume
- recruiter fatigue
- poor candidate context

## Target Users

- candidates
- employers
- recruiters
- admins/moderators

## Core Workflows

### Public Job Discovery

Unauthenticated users can browse limited job listings and are prompted to sign up to apply.

### Personalized Job Feed

Logged-in candidates receive jobs ranked by fit, preferences, skills, profile completeness, target country, relocation intent, and realistic migration pathway.

### Job Detail View

Candidates see job description, requirements, employer profile, match analysis, and application actions.

Every job detail should clearly show whether the role can support cross-border movement through sponsorship, relocation support, remote-to-relocation pathways, international hiring openness, or career credibility in a target country.

### Saved Jobs

Candidates save jobs, track closing dates, and return later.

### Employer Job Posting

Employers create and manage jobs with structured requirements, screening questions, work mode, salary, and sponsorship details.

### Job Moderation

Admins can review, flag, approve, pause, or remove jobs.

## AI Opportunities

- job fit analysis
- missing skills detection
- job summary generation
- employer job description improvement
- screening question suggestions
- candidate-job match scoring
- recommended CV angle
- similar jobs
- relocation and target-country opportunity fit

## Data Model Notes

Core entities:

- jobs
- job_requirements
- job_locations
- job_benefits
- job_screening_questions
- saved_jobs
- job_views
- job_match_scores
- job_status_history
- employer_companies

## UX Direction

Jobs should feel calmer and more selective than a traditional job board.

Important UX:

- clear match score
- transparent why-this-job indicators
- strong visa/sponsorship labels where relevant
- clear target-country, relocation, and work-authorization signals
- fast save/apply actions
- employer credibility signals

## Integrations

- candidate profile
- AI CV generation
- AI-assisted applications
- employers
- candidate ranking
- application tracking

## Risks And Constraints

- avoid misleading match scores
- keep job data accurate
- prevent scam or low-quality listings
- distinguish standard jobs from visa-sponsored jobs
- avoid presenting local-only jobs as migration or relocation pathways
- employers should not see candidate data before appropriate permissions

## First Launch Defaults

- Resolved for first launch: employer-created jobs require admin approval before becoming public.
- Resolved for first launch: expired jobs are removed from active discovery and marked `closed` or `archived`.
- Resolved for first launch: mandatory job fields are defined below.

## First Launch Decisions

### Publishing And Moderation

All employer-created jobs must start as `draft` or `pending_review`.

For first launch:

- public visibility requires admin approval
- edited active jobs that change core hiring details return to review
- admins can approve, reject, pause, archive, or flag jobs
- suspicious jobs should never be auto-published

### Mandatory Job Fields

First-launch job posting requires:

- job title
- employer company
- country
- city or remote-region indication
- work mode: remote, hybrid, on-site, or remote-to-relocation
- employment type
- description
- core responsibilities
- required skills/experience
- application deadline
- visa sponsorship status
- relocation support status
- open-to-international-applicants status
- salary range or explicit salary-not-disclosed reason
- application method: platform-hosted or external link
- screening questions, if employer requires them

### Expired Job Handling

When a job passes its application deadline:

- remove it from active search results
- keep it visible to applicants who already applied
- mark it `closed` if the employer may still review applicants
- mark it `archived` when the employer/admin ends the process
- notify saved-job users before deadline when possible

### First Jobs MVP Slice

Build Jobs first as the platform's first full vertical slice:

```txt
auth
-> onboarding/profile
-> employer company
-> job posting
-> admin review
-> public job board
-> candidate personalized feed
-> opportunity card actions
-> save/apply
-> application tracking
-> employer applicant review
```

## Implementation Roadmap

### Phase 1

Build job posting, public board, personalized feed, details, saved jobs, and apply entry.

### Phase 2

Add AI job matching, job description assistance, and job moderation.

### Phase 3

Add advanced recommendations and employer quality signals.
