# Employers

Status: Unified Platform Service

## Feature Vision

Employers is the hiring infrastructure side of Scholastiar.ai.

It should help companies post jobs, manage applicants, understand international candidates, communicate, and hire with less recruiter fatigue.

Core promise:

> Employers receive structured, ranked, context-rich candidates instead of raw application noise.

Employer search should use Signia as the deep candidate intelligence layer when candidates have opted into discoverability or have applied to that employer.

## Problem Being Solved

Employers struggle with:

- too many unstructured applications
- difficulty screening international applicants
- unclear sponsorship needs
- repetitive candidate review
- slow communication
- pipeline disorganization
- poor visibility into candidate fit

## Target Users

- employers
- recruiters
- hiring managers
- HR teams
- admins verifying employers

## Core Workflows

### Employer Onboarding

Collect company information, hiring needs, team members, and sponsorship capability.

### Company Profile

Employers manage public company information and hiring brand.

### Job Posting

Employers create roles with AI-assisted descriptions, structured requirements, screening questions, and visa sponsorship settings.

### Applicant Review

Employers view applicants ranked by fit, with CV, answers, PersonalityAI CV, and visa indicators.

### Signia Search And Review

Employers search and filter candidates by Signia proof-of-work signals, including projects, videos, documents, GitHub links, portfolio pages, research, social handles, skill evidence, and current work.

### Pipeline Management

Employers move applicants through hiring stages.

### Team Management

Employers invite team members and assign permissions.

## AI Opportunities

- job description writing
- screening question suggestions
- candidate summaries
- compatibility reports
- Signia deep search and proof-of-work summaries
- pipeline prioritization
- visa complexity alerts
- recruiter fatigue reduction

## Data Model Notes

Core entities:

- employer_companies
- employer_memberships
- employer_roles
- company_profiles
- employer_jobs
- screening_question_sets
- hiring_pipelines
- employer_notes
- employer_billing_accounts

## UX Direction

Employer UX should feel operational, clean, and decision-focused.

Important UX:

- dashboard with pipeline health
- ranked applicants
- clear sponsorship indicators
- fast shortlist/reject/message actions
- team permissions
- evidence-backed Signia candidate cards

## Integrations

- jobs
- candidate ranking
- Signia
- messaging
- notifications
- billing
- analytics
- Supabase Auth/RLS

## Risks And Constraints

- employer access must be scoped to company
- candidate data must only be shown through applications
- prevent discriminatory ranking or misuse
- employer verification may be required
- sponsorship claims should be explicit

## Later Phase Decisions (Non-Blocking)

- Should employers be verified before posting?
- How many team roles are needed in MVP?
- Should employers pay before posting?

## Implementation Roadmap

### Phase 1

Build employer onboarding, company profile, job posting, applicant review, and pipeline.

### Phase 2

Add team roles, screening library, analytics, and billing.

### Phase 3

Add advanced candidate intelligence and sponsorship workflow tooling.
