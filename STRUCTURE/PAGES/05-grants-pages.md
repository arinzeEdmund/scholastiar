# Grants Pages

Status: Unified Platform Service

Source service spec: `SERVICES/05-grants.md`

## Page System Vision

The Grants product should be a full funding application and post-award management platform, not just a grant listing page.

The page system should support the full journey:

> Discover grants -> check eligibility -> build project profile -> generate tailored answers -> build proposal and budget -> apply through external or hosted forms -> track -> pitch/interview -> award -> report.

It needs public discovery pages, project workspace pages, AI proposal pages, budget and impact pages, assisted application pages, hosted grant pages, support pages, provider pages, and admin operations pages.

## Public Discovery Pages

### Grants Home Page

Route: `/grants`

Purpose: Main entry point into the grant system.

Key sections:

- grant search bar
- find grants for my project AI matcher
- featured grants
- grants closing soon
- grants by sector
- grants by applicant type
- grants by funding amount
- verified grant highlights
- saved/application progress prompt

Primary actions:

- search grants
- start AI matching
- browse by sector
- browse verified grants
- continue applications

### Grant Directory Page

Route: `/grants/search`

Purpose: Search and filter global grant opportunities.

Filters:

- country
- region
- applicant type
- individual or organization
- nonprofit or for-profit
- sector
- funding amount
- funding stage
- deadline
- project duration
- co-funding requirement
- eligible expenses
- reporting requirement
- interview or pitch required
- application difficulty
- verification status

Grant cards should show:

- grant name
- funder
- eligible countries
- funding amount
- sector
- deadline
- estimated application effort
- success/readiness score with responsible tooltip
- verification status
- AI fit indicator
- save action
- direct apply action
- add to AI Apply Agent board, gated by subscription
- add to Apply For Me board, gated by subscription

Primary actions:

- open grant profile
- save grant
- check eligibility
- start application

### Grant Profile Page

Route: `/grants/[grantSlug]`

Purpose: Full information page for one grant.

Key sections:

- grant overview
- funder organization
- eligible countries
- eligible applicant types
- funding amount
- eligible sectors
- eligible expenses
- ineligible expenses
- project duration
- required documents
- application questions
- evaluation criteria
- reporting requirements
- co-funding requirements
- official application link
- deadline
- estimated preparation time
- verified status
- scam/risk notes
- similar grants
- AI fit summary

Primary actions:

- check eligibility
- save grant
- start application
- generate answers
- build budget
- request human review

### Grant Verification Center Page

Route: `/grants/verification`

Purpose: Help users avoid fake grant opportunities.

Features:

- verified grants
- reported grants
- risk indicators
- scam education
- submit suspicious grant
- verification status explanations

Primary actions:

- report grant
- check verification
- view safe application tips

## Project Workspace Pages

### AI Grant Matcher Page

Route: `/grants/matcher`

Purpose: Conversational or adaptive grant recommendation page.

Inputs:

- applicant type
- country or region
- project sector
- project location
- funding amount needed
- project stage
- organization registration status
- deadline preference
- required documents available
- impact goals
- co-funding capacity

Outputs:

- strong-fit grants
- possible-fit grants
- ambitious grants
- not eligible list
- missing requirement warnings
- recommended application order
- funder alignment notes

Primary actions:

- save recommendations
- start applications
- complete missing project profile
- generate grant roadmap

### Project Profiles Page

Route: `/grants/projects`

Purpose: Manage reusable project profiles for grant applications.

Key sections:

- project list
- project status
- sector
- funding need
- readiness score
- missing details
- linked grant applications

Primary actions:

- create project profile
- edit project
- duplicate project
- link project to grant
- run readiness check

### Project Profile Builder Page

Route: `/grants/projects/[projectId]/builder`

Purpose: Build the reusable grant project profile.

Fields:

- project title
- problem statement
- target beneficiaries
- location
- project goals
- activities
- timeline
- expected outcomes
- measurable indicators
- budget needs
- team background
- previous work
- partners
- sustainability plan
- risks and mitigation
- reporting capacity

Primary actions:

- save project profile
- generate project summary
- run completeness check
- attach documents
- use for grant application

### Organization Profile Page

Route: `/grants/organization`

Purpose: Store reusable organization information for grants.

Sections:

- organization overview
- registration details
- mission
- leadership/team
- previous projects
- financial information summary
- documents
- partners
- credibility evidence

Primary actions:

- update organization profile
- upload registration documents
- attach team CVs
- run organization readiness check

### Saved Grants Page

Route: `/grants/saved`

Purpose: User's grant shortlist.

Key sections:

- saved grants
- deadlines
- fit scores
- eligibility status
- required documents
- budget requirements
- preparation time
- AI recommended priority

Primary actions:

- remove saved grant
- start application
- check eligibility
- generate application answers

### Grant Application Dashboard

Route: `/grants/applications`

Purpose: Central tracker for all grant applications.

Views:

- all applications
- by status
- by deadline
- by sector
- by missing documents
- by budget incomplete
- by reporting stage

Statuses:

- discovered
- saved
- eligibility checked
- project profile incomplete
- documents missing
- budget incomplete
- proposal drafted
- answers generated
- ready for review
- submitted
- awaiting response
- shortlisted
- interview/pitch invited
- additional documents requested
- awarded
- rejected
- deferred
- reporting stage
- closed

Primary actions:

- open application
- continue draft
- upload missing document
- complete budget
- request review
- prepare pitch

### Grant Application Detail Page

Route: `/grants/applications/[applicationId]`

Purpose: Full operational view for one grant application.

Key sections:

- grant summary
- current status
- eligibility result
- linked project profile
- linked organization profile
- required documents
- generated answers
- proposal
- budget
- impact model
- external form status
- hosted form submission status
- AI review results
- human review notes
- deadline countdown
- timeline/activity
- reporting obligations if awarded

Primary actions:

- generate answers
- edit proposal
- edit budget
- upload documents
- open external form workspace
- submit hosted application
- request human review
- prepare pitch

### Grant Roadmap Page

Route: `/grants/roadmap`

Purpose: Personalized plan showing which grants to apply for and in what order.

Sections:

- recommended grants
- application priority
- upcoming deadlines
- required documents
- proposal themes
- budget readiness
- time needed
- expected difficulty
- premium support suggestions

Primary actions:

- start next application
- save roadmap
- update project goals
- request human strategy review

## AI Proposal Pages

### Eligibility Checker Page

Route: `/grants/[grantSlug]/eligibility`

Purpose: Determine if the user or organization is eligible before investing time.

Checks:

- applicant type
- country eligibility
- organization registration status
- project sector
- project location
- funding amount
- project duration
- co-funding requirement
- required documents
- reporting capacity

Outputs:

- eligible
- likely eligible
- missing information
- not eligible
- explanation of blockers
- recommended next steps

Primary actions:

- update project profile
- update organization profile
- save grant
- start application
- find similar grants

### AI Grant Answer Workspace

Route: `/grants/applications/[applicationId]/answers`

Purpose: One-to-one grant question mapping and answer generation.

Key sections:

- grant questions
- AI-generated answer for each question
- word limit
- project facts used
- organization facts used
- missing information warnings
- confidence level
- edit field
- answer version history
- final approval checkbox

Primary actions:

- generate answer
- regenerate
- edit manually
- approve answer
- save version
- request human review

### Grant Proposal Builder Page

Route: `/grants/proposals/builder`

Purpose: Generate grant-specific proposal documents using real project and organization information.

Document types:

- concept note
- full proposal
- executive summary
- problem statement
- theory of change
- logic model
- M&E plan
- sustainability plan
- risk management plan
- budget narrative
- partnership letter draft
- organizational capacity statement
- impact statement
- research proposal
- startup grant narrative

Primary actions:

- generate proposal section
- edit
- regenerate
- save version
- attach to application
- request human review

### Grant AI Review Page

Route: `/grants/applications/[applicationId]/review`

Purpose: Pre-submission quality, budget, impact, and compliance check.

AI checks:

- missing required answers
- missing documents
- unsupported claims
- fabricated-sounding statements
- weak problem statement
- weak funder alignment
- budget inconsistency
- ineligible expenses
- weak impact indicators
- word limit violations
- repeated content from other applications
- deadline risk
- scam/risk warning if relevant

Primary actions:

- fix issue
- regenerate weak section
- confirm facts
- request human review
- mark ready to submit

## Budget And Impact Pages

### Budget Builder Page

Route: `/grants/applications/[applicationId]/budget`

Purpose: Build a funder-aligned grant budget.

Features:

- budget categories
- line items
- quantity/rate calculations
- personnel costs
- equipment
- travel
- training
- materials
- software/tools
- monitoring and evaluation
- overhead/admin
- co-funding
- currency conversion
- budget justification
- funder rule warnings
- exportable budget table

Primary actions:

- add line item
- generate budget justification
- check budget rules
- export budget
- attach to application

### Impact And M&E Builder Page

Route: `/grants/applications/[applicationId]/impact`

Purpose: Build credible outcomes, indicators, and reporting plans.

Features:

- impact goal builder
- beneficiary count estimator
- indicator builder
- baseline/target fields
- monitoring plan
- evaluation method
- reporting schedule
- theory of change assistant
- logic model builder

Primary actions:

- generate impact model
- add indicator
- create reporting plan
- attach to proposal
- request review

## Assisted And Hosted Application Pages

### Assisted External Grant Workspace

Route: `/grants/apply/external/[applicationId]`

Purpose: Guided workspace for grants hosted on external websites.

Layout:

- official grant website/form inside iframe where allowed
- Scholastiar side panel with mapped answers
- project snippets
- budget values
- document checklist
- copy-to-field buttons
- AI explanation of selected question
- progress tracker
- notes
- deadline countdown

Primary actions:

- copy answer
- copy budget snippet
- autofill supported fields where allowed
- open official site in new tab if iframe blocked
- mark field complete
- attach documents
- mark submitted

### Platform-Hosted Grant Application Page

Route: `/grants/apply/hosted/[applicationId]`

Purpose: One-click or near-one-click application for grants hosted directly on Scholastiar.ai.

Key sections:

- grant details
- eligibility confirmation
- structured application form
- mapped AI answers
- budget
- proposal
- required documents
- final review
- submission consent

Primary actions:

- generate missing answers
- edit answers
- attach documents
- attach budget
- attach proposal
- review application
- submit application

## Document And Reporting Pages

### Grant Document Readiness Page

Route: `/grants/documents`

Purpose: Grant-specific document readiness and vault view.

Categories:

- registration certificate
- tax documents
- bank details
- audited accounts
- annual report
- organizational profile
- team CVs
- project proposal
- budget
- budget narrative
- work plan
- M&E plan
- letters of support
- partnership MOUs
- proof of previous work
- portfolio
- research ethics approval
- financial statements
- legal representative ID

Primary actions:

- upload document
- attach to application
- request translation
- request human review

### Post-Award Reporting Workspace

Route: `/grants/reports/[applicationId]`

Purpose: Help awarded users manage funder reporting requirements.

Features:

- reporting deadlines
- funder reporting templates
- activity reports
- financial reports
- impact reports
- receipts/evidence tracking
- milestone tracking
- beneficiary numbers
- photo/evidence organization
- final report generation
- renewal/follow-on funding preparation

Primary actions:

- create report
- upload evidence
- generate report draft
- track milestone
- submit/report as complete

## Pitch, Verification And Support Pages

### Grant Pitch Or Interview Prep Page

Route: `/grants/pitch-prep/[applicationId]`

Purpose: Prepare users for grant interviews, pitch sessions, or due diligence calls.

Features:

- likely pitch questions
- personalized answer drafts
- funder mission briefing
- budget defense preparation
- impact defense preparation
- weakness analysis
- speaking notes

Primary actions:

- generate pitch answers
- practice question
- save notes
- request human coaching

### Human Grant Review Page

Route: `/grants/review`

Purpose: Request expert or human support.

Support types:

- proposal review
- budget review
- impact model review
- eligibility review
- concept note review
- research proposal review
- startup pitch review
- compliance review
- post-award reporting review

Primary actions:

- request review
- attach grant/application
- attach documents
- book consultation
- view review status

## Premium Pages

### Grant Pricing Page

Route: `/grants/pricing`

Purpose: Monetize premium grant services.

Plans:

- Basic
- AI Grant Plan
- Project Builder Plan
- Premium Review Plan
- Grant Concierge

Paid add-ons:

- AI grant credits
- human proposal review
- budget review
- impact model review
- pitch preparation
- compliance review
- post-award reporting support
- priority support

Primary actions:

- choose plan
- buy credits
- upgrade
- view included services

## Provider Pages

### Grant Provider Portal

Route: `/grants/provider`

Purpose: Allow grant providers to publish and manage grants directly on Scholastiar.ai.

Features:

- provider verification
- create grant
- define eligibility
- define questions
- define required documents
- define budget rules
- define reporting requirements
- set deadline
- review applications
- update statuses
- message applicants later

Primary actions:

- create grant
- edit grant
- review applicants
- export applications
- update applicant status

### Grant Form Builder For Providers

Route: `/grants/provider/forms/[grantId]`

Purpose: Let providers define structured platform-hosted grant forms.

Fields:

- short answer
- long proposal answer
- dropdown
- checkbox
- file upload
- budget table
- date
- eligibility field
- word limit
- required/optional
- document requirement

Primary actions:

- add question
- set validation
- define word limit
- define budget rules
- preview form
- publish form

### Provider Applicant Review Page

Route: `/grants/provider/applications/[grantId]`

Purpose: Provider-side review of applications submitted on Scholastiar.ai.

Features:

- applicant list
- eligibility indicators
- submitted answers
- proposals
- budgets
- attached documents
- AI summary if allowed
- status update
- export/download
- notes

Primary actions:

- view applicant
- update status
- shortlist
- request more documents
- export applications

## Admin And Operations Pages

### Admin Grant Data Console

Route: `/admin/grants`

Purpose: Internal Scholastiar operations page.

Features:

- create and edit grant listings
- verify data
- manage providers
- update deadlines
- review reports
- mark scam/risky
- source tracking
- verification timestamps

Primary actions:

- add grant
- update grant
- mark verified
- review flagged listing

### Admin Grant Applications Console

Route: `/admin/grant-applications`

Purpose: Internal support page for grant applications.

Features:

- application status overview
- support tickets
- human review status
- AI generation logs
- budget issue flags
- external form session notes
- payment/plan status
- risk flags

Primary actions:

- assign reviewer
- inspect issue
- update support status
- escalate

### Admin Human Grant Review Console

Route: `/admin/grant-reviews`

Purpose: Manage human grant review services.

Features:

- review requests
- reviewer assignment
- attached documents
- application context
- SLA tracking
- reviewer notes
- delivery status

Primary actions:

- assign reviewer
- return reviewed document
- mark complete
- escalate

### Admin Grant Provider Console

Route: `/admin/grant-providers`

Purpose: Manage grant providers.

Features:

- provider verification
- provider profiles
- submitted grants
- suspicious provider flags
- hosted grant approval
- support history

Primary actions:

- approve provider
- reject provider
- verify organization
- suspend provider

## Suggested MVP Page Set

For the first Grants MVP, start with:

- `/grants`
- `/grants/search`
- `/grants/[grantSlug]`
- `/grants/matcher`
- `/grants/projects`
- `/grants/projects/[projectId]/builder`
- `/grants/saved`
- `/grants/applications`
- `/grants/applications/[applicationId]`
- `/grants/[grantSlug]/eligibility`
- `/grants/applications/[applicationId]/answers`
- `/grants/proposals/builder`
- `/grants/applications/[applicationId]/budget`
- `/grants/applications/[applicationId]/review`
- `/grants/documents`
- `/grants/review`
- `/grants/pricing`
- `/admin/grants`

This gives the module a complete discovery, project building, AI proposal, budget, tracking, and monetization loop before adding provider tools or post-award reporting.

## Page Priority

### MVP Priority

- Grants Home Page
- Grant Directory Page
- Grant Profile Page
- AI Grant Matcher Page
- Project Profiles Page
- Project Profile Builder Page
- Saved Grants Page
- Grant Application Dashboard
- Grant Application Detail Page
- Eligibility Checker Page
- AI Grant Answer Workspace
- Grant Proposal Builder Page
- Budget Builder Page
- Grant AI Review Page
- Grant Document Readiness Page
- Human Grant Review Page
- Grant Pricing Page
- Admin Grant Data Console

### Phase 2 Priority

- Organization Profile Page
- Impact And M&E Builder Page
- Grant Roadmap Page
- Assisted External Grant Workspace
- Platform-Hosted Grant Application Page
- Grant Pitch Or Interview Prep Page
- Grant Verification Center Page

### Phase 3 Priority

- Post-Award Reporting Workspace
- Grant Provider Portal
- Grant Form Builder For Providers
- Provider Applicant Review Page
- Admin Grant Applications Console
- Admin Human Grant Review Console
- Admin Grant Provider Console
