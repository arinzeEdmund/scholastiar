# Scholarships Pages

Status: Unified Platform Service

Source service spec: `SERVICES/03-scholarships.md`

## Page System Vision

The Scholarships product should be a full application platform, not just a scholarship listing page.

The page system should support the full journey:

> Discover scholarships -> check eligibility -> generate tailored answers -> prepare documents -> fill external or hosted forms -> submit -> track -> interview/award stage.

It needs public discovery pages, student workspace pages, AI answer and document pages, assisted application pages, hosted scholarship pages, recommendation pages, premium support pages, provider pages, and admin operations pages.

## Public Discovery Pages

### Scholarships Home Page

Route: `/scholarships`

Purpose: Main entry point into the scholarship system.

This page should help students immediately search, match, or continue applications.

Key sections:

- scholarship search bar
- find scholarships for me AI matcher
- featured scholarships
- fully funded scholarships
- scholarships closing soon
- country-based scholarships
- degree-level filters
- field-of-study filters
- saved/application progress prompt
- verified scholarship highlights

Primary actions:

- search scholarships
- start AI matching
- browse fully funded scholarships
- view closing soon scholarships
- continue applications

### Scholarship Directory Page

Route: `/scholarships/search`

Purpose: Search and filter global scholarship opportunities.

Filters:

- country
- university
- degree level
- field of study
- nationality eligibility
- fully funded or partially funded
- tuition coverage
- stipend coverage
- deadline
- scholarship type
- provider type
- language requirement
- recommendation required
- interview required
- application difficulty
- verification status

Scholarship cards should show:

- scholarship name
- provider
- host country
- eligible degree levels
- funding type
- deadline
- estimated application effort, such as `2 min apply`, `20 min apply`, or `essay prep needed`
- success score with responsible tooltip
- verification status
- AI fit indicator
- save action
- direct apply action
- add to AI Apply Agent board, gated by subscription
- add to Apply For Me board, gated by subscription

Primary actions:

- open scholarship profile
- save scholarship
- check eligibility
- start application
- compare scholarships later

### Scholarship Profile Page

Route: `/scholarships/[scholarshipSlug]`

Purpose: Full information page for one scholarship.

Key sections:

- scholarship overview
- provider or funding organization
- host country
- host university if applicable
- eligibility requirements
- eligible nationalities
- eligible degree levels
- eligible courses
- scholarship benefits
- tuition coverage
- stipend amount
- travel and accommodation support
- required documents
- essay questions
- application form questions
- selection criteria
- deadline
- estimated preparation time
- official website/application link
- verification status
- scam/risk notes
- similar scholarships

Primary actions:

- check eligibility
- save scholarship
- start application
- generate answers
- view required documents
- open official form workspace
- request human review

### Scam And Verification Center Page

Route: `/scholarships/verification`

Purpose: Help students avoid fake scholarship opportunities.

Features:

- verified scholarships
- reported scholarships
- risk indicators
- scam education
- submit suspicious scholarship
- verification status explanations

Primary actions:

- report scholarship
- check verification
- view safe application tips

## Student Workspace Pages

### AI Scholarship Matcher Page

Route: `/scholarships/matcher`

Purpose: Conversational or adaptive scholarship recommendation page.

Inputs:

- nationality
- current education level
- target degree
- field of study
- target country
- academic performance
- financial need
- leadership or volunteering background
- research background
- language tests
- deadline preference
- available documents

Outputs:

- strong-fit scholarships
- possible-fit scholarships
- ambitious scholarships
- not eligible list
- missing requirement warnings
- recommended application order
- essay themes to emphasize

Primary actions:

- save recommendations
- start applications
- complete missing profile info
- generate scholarship roadmap

### Saved Scholarships Page

Route: `/scholarships/saved`

Purpose: Student's scholarship shortlist.

Key sections:

- saved scholarships
- deadlines
- fit scores
- eligibility status
- required documents
- missing documents
- preparation time
- AI recommended priority
- grouped by deadline, country, and type

Primary actions:

- remove saved scholarship
- start application
- check eligibility
- generate application answers
- compare options

### Scholarship Application Dashboard

Route: `/scholarships/applications`

Purpose: Central tracker for all scholarship applications.

Views:

- all applications
- by status
- by deadline
- by country
- by missing documents
- by interview stage
- by award/rejection status

Statuses:

- discovered
- saved
- eligibility checked
- documents missing
- answers generated
- ready for review
- submitted
- awaiting response
- shortlisted
- interview invited
- additional documents requested
- awarded
- rejected
- deferred

Primary actions:

- open application
- continue draft
- upload missing document
- request review
- prepare for interview

### Scholarship Application Detail Page

Route: `/scholarships/applications/[applicationId]`

Purpose: Full operational view for one scholarship application.

Key sections:

- scholarship summary
- current status
- eligibility result
- required documents
- generated question answers
- essays/documents
- external form status
- hosted form submission status
- recommendation letter status
- AI review results
- human review notes
- deadline countdown
- timeline/activity
- next action checklist

Primary actions:

- generate answers
- edit answers
- upload documents
- open external form workspace
- submit hosted application
- request human review
- prepare interview

### Deadline Dashboard Page

Route: `/scholarships/deadlines`

Purpose: Help students prioritize scholarship work by urgency.

Views:

- closing this week
- closing this month
- missing documents
- ready to submit
- long preparation required
- interviews upcoming

Features:

- countdowns
- urgency score
- preparation time estimate
- missing task warnings
- calendar sync later

Primary actions:

- continue urgent application
- upload missing document
- generate answers
- set reminder

### Scholarship Roadmap Page

Route: `/scholarships/roadmap`

Purpose: Personalized plan showing which scholarships to apply for and in what order.

Sections:

- recommended scholarships
- application priority
- upcoming deadlines
- required documents
- essay themes
- time needed
- expected difficulty
- premium support suggestions

Primary actions:

- start next application
- save roadmap
- update goals
- request human strategy review

## AI Answer And Application Pages

### Eligibility Checker Page

Route: `/scholarships/[scholarshipSlug]/eligibility`

Purpose: Determine if the student is eligible before they waste time.

Checks:

- nationality
- age
- degree level
- academic score or GPA
- course/field match
- language test
- admission offer requirement
- financial need requirement
- work/leadership requirement
- country-specific requirement
- required documents

Outputs:

- eligible
- likely eligible
- missing information
- not eligible
- explanation of blockers
- recommended next steps

Primary actions:

- update profile
- save scholarship
- start application
- find similar scholarships

### AI Question Answer Workspace

Route: `/scholarships/applications/[applicationId]/answers`

Purpose: One-to-one scholarship question mapping and answer generation.

This is one of the core product pages.

Key sections:

- scholarship questions
- AI-generated answer for each question
- word limit
- profile facts used
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

### Scholarship Essay And Document Builder Page

Route: `/scholarships/documents/builder`

Purpose: Generate scholarship-specific documents legally using real student information.

Document types:

- scholarship essay
- personal statement
- motivation letter
- study plan
- academic CV
- leadership statement
- financial need statement
- community impact essay
- recommendation request draft
- research proposal
- project proposal
- cover letter
- biography statement
- interview answers

Flow:

- choose document type
- choose scholarship
- answer guided questions
- AI generates draft
- student reviews facts
- edit or regenerate
- save to document vault
- attach to application

Primary actions:

- generate document
- edit
- regenerate
- save version
- attach to application
- request human review

### Scholarship AI Review Page

Route: `/scholarships/applications/[applicationId]/review`

Purpose: Pre-submission quality and risk check.

AI checks:

- missing required answers
- missing documents
- unsupported claims
- fabricated-sounding statements
- weak financial need explanation
- generic essay tone
- poor alignment with scholarship mission
- word limit violations
- inconsistent facts
- repeated content from other applications
- deadline risk
- scam/risk warning if relevant

Primary actions:

- fix issue
- regenerate weak answer
- confirm facts
- request human review
- mark ready to submit

## Assisted And Hosted Application Pages

### Assisted External Form Workspace

Route: `/scholarships/apply/external/[applicationId]`

Purpose: Guided workspace for scholarships hosted on external websites.

Layout:

- official scholarship website/form inside iframe where allowed
- Scholastiar side panel with mapped answers
- document checklist
- copy-to-field buttons
- AI explanation of selected question
- progress tracker
- notes
- deadline countdown

Features:

- click a form question to view matching AI answer
- copy answer into field
- fill eligible fields automatically on higher plan where allowed
- track completed fields manually
- save progress notes
- store proof of submission if available

Primary actions:

- copy answer
- autofill supported fields
- open official site in new tab if iframe blocked
- mark field complete
- attach documents
- mark submitted

### Platform-Hosted Scholarship Application Page

Route: `/scholarships/apply/hosted/[applicationId]`

Purpose: One-click or near-one-click application for scholarships hosted directly on Scholastiar.ai.

Key sections:

- scholarship details
- eligibility confirmation
- structured application form
- mapped AI answers
- required documents
- document readiness
- final review
- submission consent

Primary actions:

- generate missing answers
- edit answers
- attach documents
- review application
- submit application

## Document And Recommendation Pages

### Document Readiness Page

Route: `/scholarships/documents`

Purpose: Scholarship-specific document readiness and vault view.

Categories:

- passport
- transcript
- certificate
- recommendation letter
- CV
- essay
- proof of admission
- proof of income
- language test
- research proposal
- portfolio
- financial document
- translated document

Features:

- show ready documents
- show missing documents
- show documents needing translation
- show outdated documents
- connect documents to scholarship applications
- upload files
- request review/translation

Primary actions:

- upload document
- attach to application
- request translation
- request human review

### Recommendation Letter Tracker Page

Route: `/scholarships/recommendations`

Purpose: Manage recommendation letters across scholarships.

Features:

- list recommenders
- recommendation requests
- scholarships requiring letters
- request email generator
- recommender briefing document
- status tracking
- reminders
- uploaded letters
- letter matching to scholarships
- warning for outdated or generic letters

Primary actions:

- add recommender
- generate request email
- send reminder
- upload letter
- attach letter to scholarship

### Recommender Guest Submission Page

Route: `/scholarships/recommendations/[requestToken]`

Purpose: Lightweight page for recommenders to submit letters without needing a full account.

Features:

- student name
- scholarship/program context
- instructions
- upload field
- optional recommender note
- deadline
- secure token access

Primary actions:

- upload recommendation letter
- submit note
- confirm submission

## Interview, Verification And Support Pages

### Scholarship Interview Prep Page

Route: `/scholarships/interview-prep/[applicationId]`

Purpose: Prepare students for scholarship interviews.

Features:

- likely interview questions
- personalized answer drafts
- scholarship mission briefing
- mock interview practice later
- weakness analysis
- speaking notes
- confidence checklist

Primary actions:

- generate interview answers
- practice question
- save notes
- request human coaching

### Human Review Page

Route: `/scholarships/review`

Purpose: Request expert or human support.

Support types:

- essay review
- application package review
- financial need explanation review
- scholarship strategy
- recommendation letter strategy
- interview prep
- document review
- country-specific guidance

Primary actions:

- request review
- attach scholarship/application
- attach documents
- book consultation
- view review status

## Premium Pages

### Scholarship Pricing Page

Route: `/scholarships/pricing`

Purpose: Monetize premium scholarship services.

Plans:

- Basic
- AI Scholarship Plan
- Bulk Apply Plan
- Premium Review Plan
- Full Scholarship Concierge

Paid add-ons:

- AI answer credits
- human essay review
- interview prep
- recommendation letter support
- application package review
- assisted external form filling
- priority support

Primary actions:

- choose plan
- buy credits
- upgrade
- view included services

## Provider Pages

### Scholarship Provider Portal

Route: `/scholarships/provider`

Purpose: Allow scholarship providers to publish and manage scholarships directly on Scholastiar.ai.

Features:

- provider verification
- create scholarship
- define eligibility
- define questions
- define required documents
- set deadline
- review applications
- update statuses
- message applicants later

Primary actions:

- create scholarship
- edit scholarship
- review applicants
- export applications
- update applicant status

### Scholarship Form Builder For Providers

Route: `/scholarships/provider/forms/[scholarshipId]`

Purpose: Let providers define structured platform-hosted scholarship forms.

Fields:

- short answer
- long essay
- dropdown
- checkbox
- file upload
- date
- eligibility field
- word limit
- required/optional
- document requirement

Primary actions:

- add question
- set validation
- define word limit
- preview form
- publish form

### Provider Applicant Review Page

Route: `/scholarships/provider/applications/[scholarshipId]`

Purpose: Provider-side review of applications submitted on Scholastiar.ai.

Features:

- applicant list
- eligibility indicators
- submitted answers
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

### Admin Scholarship Data Console

Route: `/admin/scholarships`

Purpose: Internal Scholastiar operations page.

Features:

- create and edit scholarship listings
- verify data
- manage providers
- update deadlines
- review reports
- mark scam/risky
- source tracking
- verification timestamps

Primary actions:

- add scholarship
- update scholarship
- mark verified
- review flagged listing

### Admin Scholarship Applications Console

Route: `/admin/scholarship-applications`

Purpose: Internal support page for student scholarship applications.

Features:

- application status overview
- support tickets
- human review status
- AI generation logs
- external form session notes
- payment/plan status
- risk flags

Primary actions:

- assign reviewer
- inspect issue
- update support status
- escalate

### Admin Human Review Console

Route: `/admin/scholarship-reviews`

Purpose: Manage human review services.

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

### Admin Provider Console

Route: `/admin/scholarship-providers`

Purpose: Manage scholarship providers.

Features:

- provider verification
- provider profiles
- submitted scholarships
- suspicious provider flags
- hosted scholarship approval
- support history

Primary actions:

- approve provider
- reject provider
- verify organization
- suspend provider

## Suggested MVP Page Set

For the first Scholarships MVP, start with:

- `/scholarships`
- `/scholarships/search`
- `/scholarships/[scholarshipSlug]`
- `/scholarships/matcher`
- `/scholarships/saved`
- `/scholarships/applications`
- `/scholarships/applications/[applicationId]`
- `/scholarships/[scholarshipSlug]/eligibility`
- `/scholarships/applications/[applicationId]/answers`
- `/scholarships/documents/builder`
- `/scholarships/applications/[applicationId]/review`
- `/scholarships/documents`
- `/scholarships/deadlines`
- `/scholarships/review`
- `/scholarships/pricing`
- `/admin/scholarships`

This gives the module a complete discovery, preparation, AI generation, tracking, and monetization loop without requiring external form automation or provider tools immediately.

## Page Priority

### MVP Priority

- Scholarships Home Page
- Scholarship Directory Page
- Scholarship Profile Page
- AI Scholarship Matcher Page
- Saved Scholarships Page
- Scholarship Application Dashboard
- Scholarship Application Detail Page
- Eligibility Checker Page
- AI Question Answer Workspace
- Scholarship Essay And Document Builder Page
- Scholarship AI Review Page
- Document Readiness Page
- Deadline Dashboard Page
- Human Review Page
- Scholarship Pricing Page
- Admin Scholarship Data Console

### Phase 2 Priority

- Assisted External Form Workspace
- Platform-Hosted Scholarship Application Page
- Recommendation Letter Tracker Page
- Recommender Guest Submission Page
- Scholarship Interview Prep Page
- Scam And Verification Center Page
- Scholarship Roadmap Page

### Phase 3 Priority

- Scholarship Provider Portal
- Scholarship Form Builder For Providers
- Provider Applicant Review Page
- Admin Scholarship Applications Console
- Admin Human Review Console
- Admin Provider Console
