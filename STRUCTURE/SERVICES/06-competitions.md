# Competitions

Status: Unified Platform Service

## Feature Vision

Scholastiar.ai Competitions is an AI-powered competition discovery and preparation system for students, founders, professionals, researchers, creators, and teams.

The platform should help users find relevant competitions, understand rules, prepare submissions, build pitch decks or project materials, track deadlines, collaborate with team members, and convert wins into long-term credibility.

Core promise:

> The user brings the idea or skill. Scholastiar.ai helps turn it into a competition-ready submission.

Every competition opportunity should be evaluated for cross-border potential: whether it can provide travel abroad, relocation exposure, startup market entry, international networks, funding, prizes, accelerators, visas, internships, job pathways, or credibility that helps the user move toward a better life in another country.

## Problem Being Solved

Competitions are hard because users often:

- do not know which competitions exist
- miss deadlines
- misunderstand rules
- struggle to prepare strong submissions
- cannot adapt the same idea to different competitions
- lack pitch, demo, essay, or portfolio support
- do not manage team responsibilities clearly
- fail to prepare for judging or interviews
- do not track outcomes
- do not reuse wins in CVs, grants, fellowships, scholarships, or jobs

## Target Users

Primary users:

- students
- startup founders
- hackathon participants
- researchers
- creators and artists
- developers and designers
- social impact builders
- case competition teams
- innovation challenge applicants

Secondary users:

- competition organizers
- universities
- incubators
- employers
- sponsors
- judges
- mentors
- human reviewers

## Core Workflows

### Competition Discovery

Users should browse competitions by:

- country/region
- online/in-person/hybrid
- host country and travel or relocation pathway
- field or category
- applicant type
- team or individual
- age or student eligibility
- prize amount
- funding/investment opportunity
- travel, visa, accelerator, or global exposure support
- deadline
- submission format
- required deliverables
- judging criteria
- difficulty
- verification status

### Competition Profile Pages

Profiles should include:

- competition overview
- organizer
- eligibility
- categories/tracks
- prize benefits
- timeline
- rules
- required deliverables
- judging criteria
- submission format
- team size
- official link
- verified status
- estimated preparation time
- AI fit summary

### AI Competition Matching

The AI should evaluate:

- user skills
- project/idea fit
- team readiness
- location eligibility
- deadline readiness
- required deliverables
- previous work
- portfolio strength
- prize relevance
- target-country or international mobility value

Recommendations can be grouped as strong fit, possible fit, ambitious, missing requirements, and not eligible.

### Submission Builder

Competitions may require:

- written applications
- project descriptions
- pitch decks
- demo videos
- code repositories
- portfolios
- case solutions
- business plans
- research summaries
- design boards
- prototypes

The platform should guide users through building competition-specific submissions.

### Pitch And Presentation Builder

For startup, innovation, and case competitions, the platform should help generate:

- pitch deck outline
- problem/solution story
- market explanation
- business model
- traction summary
- impact story
- financial summary
- demo script
- judge Q&A prep

### Team Workspace

Competitions often involve teams.

The platform should support:

- team member invitations
- role assignment
- task checklist
- shared documents
- submission responsibility tracking
- deadline reminders
- internal notes

### Assisted External Forms And Hosted Competitions

For external competition portals, the platform can provide guided side-panel support where allowed.

For hosted competitions, organizers can create forms, collect submissions, review applicants, and update statuses inside Scholastiar.ai.

### Competition Tracker

Statuses:

- discovered
- saved
- eligibility checked
- team forming
- submission drafted
- deliverables missing
- ready for review
- submitted
- shortlisted
- finalist
- pitch/interview invited
- won
- not selected
- certificate received

### Post-Competition Credibility Layer

The platform should help users:

- add participation/win to AI CV
- update portfolio
- generate LinkedIn announcements
- create project case studies
- attach results to awards, fellowships, grants, and jobs

## AI Opportunities

### Competition Answer Engine

Generate tailored answers for competition questions using the user's real project, skills, team, and goals.

### Pitch Coach

Help users prepare:

- pitch scripts
- judge questions
- concise value propositions
- demo walkthroughs
- final presentation notes

### Submission Quality Review

AI should check:

- rule compliance
- missing deliverables
- weak problem statement
- unclear innovation
- weak evidence
- poor pitch structure
- deadline risk
- judging criteria mismatch

### Legal And Truthful Generation

The AI must never fabricate prototypes, traction, users, revenue, code ownership, team credentials, awards, or research results.

Core rule:

> Scholastiar.ai helps users present real work competitively. It does not fake progress.

## Data Model Notes

Core entities may include:

- competitions
- competition_organizers
- competition_tracks
- competition_rules
- competition_questions
- competition_deliverables
- competition_applications
- competition_application_answers
- competition_teams
- team_members
- team_tasks
- project_profiles
- submission_assets
- pitch_decks
- ai_generations
- human_review_requests
- hosted_competition_submissions
- competition_verification_records

## UX Direction

The experience should feel energetic, focused, and progress-driven.

Important UX surfaces:

- competition search
- competition profile
- AI competition matcher
- team workspace
- submission builder
- pitch builder
- deliverables checklist
- application tracker
- judge Q&A prep
- post-win credibility toolkit

## Integrations

Potential integrations:

- DeepSeek AI for submissions and pitch prep
- Supabase Storage for deliverables
- email invitations for team members
- presentation export later
- video upload integrations
- GitHub/portfolio links later
- payment provider for premium reviews

## Monetization And Premium Services

Paid features:

- AI competition matching
- submission generation
- pitch deck builder
- judge Q&A prep
- team workspace premium
- human pitch review
- human submission review
- portfolio/case study builder

Possible plans:

```txt
Basic
- Competition search
- Save competitions
- Deadline reminders

AI Competitor Plan
- AI answers
- Submission builder
- Deliverables checklist

Pitch Plan
- Pitch deck builder
- Demo script
- Judge Q&A prep

Team Plan
- Shared workspace
- Task tracking
- Team submission review
```

## Differentiators

- competition matching
- team workspace
- submission builder
- pitch coach
- deliverables compliance review
- post-win credibility layer

Strong differentiator:

> Scholastiar.ai helps users move from idea to submission to pitch to credibility.

## Risks And Constraints

Key risks:

- unclear competition rules
- fake competitions
- plagiarism
- IP ownership issues
- AI overclaiming traction
- missed deliverables
- team permission conflicts

Important constraints:

- AI must not fabricate project progress
- team ownership should be explicit
- competition rules and verification status must be visible
- users approve final submissions

## Later Phase Decisions (Non-Blocking)

- Which competition categories launch first?
- Should team workspaces be MVP?
- How should hosted competitions charge organizers?
- How should pitch deck generation integrate later?
- What should be free versus paid?

## Implementation Roadmap

### Phase 1: Competition Discovery MVP

Build search, profiles, saved competitions, eligibility checks, deadlines, and tracker.

### Phase 2: Submission Engine

Build AI answers, submission builder, deliverables checklist, and AI review.

### Phase 3: Team And Pitch Tools

Build team workspace, pitch builder, and judge Q&A prep.

### Phase 4: Hosted Competitions

Build organizer portal, form builder, submissions, and judging support.

### Phase 5: Credibility Layer

Build portfolio, CV, and PersonalityAI CV updates for wins and participation.
