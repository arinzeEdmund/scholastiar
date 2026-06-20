# Employers Pages

Status: Unified Platform Service

Source service specs: `SERVICES/97-employers.md`, `SERVICES/98-candidate-ranking.md`

## Page System Vision

Employer pages should help hiring teams post jobs, review ranked candidates, communicate, and manage sponsorship-aware pipelines without recruiter fatigue.

Signia should be part of the employer product as a deep search and evidence review layer for candidate projects, media, documents, social links, and professional proof.

## Public Pages

### Employer Landing Page

Route: `/employers`

Purpose: Dedicated employer product entry.

Key sections:

- hiring value proposition
- AI ranking
- visa sponsorship indicators
- PersonalityAI CV preview
- Signia proof-of-work search
- pricing CTA

Primary actions:

- sign up
- view pricing
- request demo later

## Employer Pages

### Employer Dashboard

Route: `/employers/dashboard`

Purpose: Main employer command center.

Key sections:

- active jobs
- new applicants
- candidates awaiting response
- interview count
- top candidate cards
- Signia evidence highlights
- pipeline summary
- recent messages
- visa complexity alerts

### Company Profile Page

Route: `/employers/company`

Purpose: Manage public company profile and hiring brand.

Sections:

- logo
- company overview
- industry
- locations
- website
- sponsorship policy
- benefits

### Employer Job Listings Page

Route: `/employers/jobs`

Purpose: Manage job listings.

### Create Job Page

Route: `/employers/jobs/new`

Purpose: Create job posts with AI-assisted description writing and screening questions.

### Job Applicants Page

Route: `/employers/jobs/[jobId]/applicants`

Purpose: Review applicants ranked by AI match.

### Candidate Profile Page

Route: `/employers/candidates/[candidateId]`

Purpose: Full candidate review with CV, PersonalityAI CV, Signia, AI compatibility, and visa indicators.

### Employer Signia Search Page

Route: `/employers/signia`

Purpose: Deep search across candidate Signia profiles by projects, skills, proof, media, research, social links, GitHub, portfolio pages, and current work.

### Employer Signia Candidate View

Route: `/employers/candidates/[candidateId]/signia`

Purpose: Full employer review of a candidate's Signia profile, evidence, projects, videos, documents, social links, and portfolio sections.

### Screening Question Library Page

Route: `/employers/screening-questions`

Purpose: Manage reusable screening question sets.

### Employer Team Settings Page

Route: `/employers/team`

Purpose: Manage hiring team members and roles.

### Employer Settings Page

Route: `/employers/settings`

Purpose: Company account, notifications, billing shortcuts, and privacy settings.

### Visa Complexity Page

Route: `/employers/visa-complexity`

Purpose: Reference tool for sponsorship complexity by nationality and destination.

## Admin Pages

### Admin Employers Page

Route: `/admin/employers`

Purpose: Manage employer accounts, verification, abuse, and support.

## Suggested MVP Page Set

- `/employers`
- `/employers/dashboard`
- `/employers/company`
- `/employers/jobs`
- `/employers/jobs/new`
- `/employers/jobs/[jobId]/applicants`
- `/employers/candidates/[candidateId]`
- `/employers/signia`
- `/employers/candidates/[candidateId]/signia`
- `/employers/screening-questions`
- `/employers/team`
- `/employers/settings`
- `/employers/visa-complexity`
- `/admin/employers`

## Page Priority

### MVP Priority

- Employer Landing Page
- Employer Dashboard
- Company Profile Page
- Employer Job Listings Page
- Create Job Page
- Job Applicants Page
- Candidate Profile Page
- Employer Signia Candidate View
- Employer Settings Page
- Admin Employers Page

### Phase 2 Priority

- Screening Question Library Page
- Employer Signia Search Page
- Employer Team Settings Page
- Visa Complexity Page
