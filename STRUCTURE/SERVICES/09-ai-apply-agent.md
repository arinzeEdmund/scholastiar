# AI Apply Agent

Status: Unified Platform Service

## Feature Vision

The AI Apply Agent is the autonomous application execution layer of Scholastiar.ai.

It should apply on behalf of users to opportunities across:

- jobs
- scholarships
- universities

It should support both:

- platform-hosted opportunities posted directly on Scholastiar.ai
- external opportunities that link to third-party websites and application portals

The core idea:

> The user approves their profile, documents, and application preferences once. The AI Apply Agent executes eligible applications automatically according to user rules.

This is different from the AI Application Engine. The AI Application Engine generates answers, documents, and application packages. The AI Apply Agent actually completes and submits applications where technically, legally, and ethically allowed.

The best positioning:

> A supervised-autonomy application agent that can apply automatically where legally, technically, and ethically allowed.

The agent must optimize around the user's mobility goal, not raw application volume. It should prefer opportunities that can help the user work abroad, study abroad, travel for growth, gain funding, relocate, migrate, build target-country credibility, or move toward a country of choice in search of greener pastures.

## AI Apply Agent Board

Every opportunity card across the platform should be able to add eligible opportunities to an AI Apply Agent board when the user's subscription allows agent usage.

The board should collect opportunities the user wants the AI agent to prepare, fill, or submit within their rules.

Board items should show:

- opportunity title and category
- country or region
- application deadline/window
- estimated application effort
- success/fit score
- required documents
- missing information
- automation eligibility
- consent status
- selected autonomy mode
- current agent status

If a user's subscription does not include the AI Apply Agent, opportunity cards should show a locked or upgrade state for the board action while still allowing save, view, and manual apply actions.

## Problem Being Solved

Users lose enormous time and energy applying manually across many opportunity portals.

The AI Apply Agent should reduce:

- repetitive form filling
- repeated document uploads
- missed deadlines
- application fatigue
- inconsistent answers across applications
- poor follow-up tracking
- fragmented external portals
- manual status updates
- cognitive overload
- low-volume application behavior caused by exhaustion

The product should let users focus on their goals while the platform handles repetitive execution.

## Target Users

Primary users:

- job seekers applying to many roles
- students and post-study graduates applying to many jobs
- scholarship applicants
- university applicants
- premium users who want high-volume application execution

Secondary users:

- human support agents
- admin reviewers
- opportunity providers
- employers
- universities
- scholarship providers

## Core Workflows

### Autonomy Modes

The agent should support multiple autonomy levels.

Mode 1: Assistive Apply

- AI prepares answers and documents
- user manually submits
- best for MVP and risky external portals

Mode 2: Review-Then-Apply

- AI fills application package
- user reviews once
- AI submits after approval
- best for sensitive categories such as scholarships and universities

Mode 3: Auto-Apply Within Rules

- user defines rules
- AI applies automatically without reviewing each application
- best for trusted, low-risk, structured flows

Example rules:

- apply only to jobs that fit my study visa hours or sponsor my work visa
- apply only to scholarships I am eligible for
- apply only to universities under a specified tuition amount
- do not apply if application fee is required
- do not apply if reference letter is required
- do not apply if essay requires new personal claims
- do not submit anything with missing documents

Mode 4: Concierge Automation

- AI applies, tracks communication, follows up, updates status, and alerts the user only when human attention is required
- should be high-trust premium tier with human fallback

### Platform-Hosted Auto-Apply

This is the cleanest and safest version.

For opportunities hosted on Scholastiar.ai, the platform controls the form structure.

Flow:

```txt
User profile
-> Document vault
-> User apply rules
-> Structured hosted opportunity form
-> Field mapping
-> AI answer generation
-> Document readiness check
-> AI quality/safety review
-> Consent check
-> Submit
-> Track status
```

This can support true one-click or auto-apply because there are no cross-site browser restrictions.

### External Opportunity Auto-Apply

External portals are harder and require a browser automation layer plus a compliance layer.

Flow:

```txt
Target opportunity
-> External automation eligibility check
-> Isolated browser session
-> Form understanding
-> Field mapping
-> Answer/document generation
-> Step-by-step execution
-> Stop/hand-off if blocked
-> Submission proof capture
-> Status update
```

The agent should stop when external automation is risky, blocked, ambiguous, or not allowed.

### User Consent And Rule Engine

The agent must only act within explicit user consent.

User rules should include:

- allowed categories
- allowed countries
- preferred destination countries or regions
- mobility goal
- maximum application fee
- document types allowed for upload
- whether auto-submit is allowed
- whether external portal automation is allowed
- whether AI can answer essays automatically
- whether sensitive questions require user review
- whether the agent can send emails
- whether the agent can create portal accounts
- daily or weekly application limits
- deadline cutoffs
- quality threshold

### Eligibility And Policy Gate

Before applying, the agent should check:

- user eligibility
- missing documents
- opportunity legitimacy
- source verification status
- application fee
- deadline
- portal automation permission
- user rules
- risk score
- category-specific requirements

If the opportunity fails the gate, the agent should not apply.

### Application Planner

The agent should create a step-by-step execution plan.

Example:

```txt
1. Open application link
2. Create or log into account if allowed
3. Fill personal information
4. Fill education history
5. Upload transcript
6. Generate 500-word motivation answer
7. Review declarations
8. Submit
9. Capture confirmation
```

### Form Understanding Engine

The system should identify:

- text inputs
- textareas
- dropdowns
- checkboxes
- radio buttons
- file uploads
- date fields
- multi-step pages
- required fields
- validation errors
- word limits
- consent/declaration fields

For platform-hosted forms, this comes from structured schema.

For external forms, this comes from DOM inspection, browser automation, screenshots, and AI interpretation where needed.

### Field Mapping Engine

The agent should map form fields to known profile data.

Examples:

- first name -> user.first_name
- passport number -> passport metadata
- degree -> education.degree
- why do you deserve this scholarship -> AI-generated scholarship answer
- upload CV -> latest approved AI CV
- upload transcript -> verified transcript document

Every mapped field should have confidence. Low-confidence fields should stop or request review.

### Answer And Document Generation Engine

The agent should generate truthful, tailored content based on:

- user profile
- opportunity requirements
- opportunity category
- uploaded documents
- question wording
- word limits
- tone
- selection criteria

The AI must not invent:

- grades
- work experience
- financial hardship
- publications
- research
- leadership roles
- immigration details
- documents
- references
- signatures

### Execution Engine

The execution engine performs application steps.

Capabilities:

- open page
- click
- type
- select dropdowns
- check boxes
- upload files
- navigate steps
- wait for validation
- read errors
- retry safe failures
- capture screenshots
- detect confirmation pages
- save submission proof

Technical recommendation:

- use Playwright-style controlled browser automation for external portals
- use lightweight internal API submission for platform-hosted opportunities
- use isolated browser contexts per user/application
- use screenshots, DOM snapshots, and structured logs for auditability
- use Playwright selectively, not for every platform-hosted flow

### Stop And Hand-Off Engine

The agent must stop when it encounters:

- CAPTCHA
- payment
- unclear legal declarations
- login requiring MFA
- request for credentials if not allowed
- unexpected question with low confidence
- missing document
- unsupported file type
- website terms warning
- suspicious application page
- inconsistent user data
- request for false information
- request for signature
- request for recommender submission
- request for sensitive information not pre-approved

It should escalate to the user or human support agent.

### External Portal Account Handling

Some portals require accounts.

Possible policies:

- user provides existing login through encrypted vault later
- user authorizes agent to create account
- user manually completes login, then agent resumes
- agent stops at MFA/CAPTCHA
- agent never stores passwords unless explicitly enabled and encrypted

Recommended MVP:

- no credential storage
- user-assisted login session
- pause-and-resume
- no CAPTCHA bypass

### Audit And Proof System

Every application should store:

- opportunity ID
- user consent version
- application plan
- fields filled
- generated answers
- documents uploaded
- timestamps
- screenshots at key steps
- errors encountered
- final confirmation screenshot
- confirmation number or email if available
- submission URL
- agent version

This protects the user and the platform.

### Communication And Follow-Up Agent

After applying, the agent can:

- monitor platform inbox
- monitor dedicated admissions/application email
- summarize responses
- update application status
- draft replies
- send follow-up emails where allowed
- remind user of interviews or missing documents
- escalate complex replies to human support

## AI Opportunities

### Application Planning AI

AI should turn an opportunity into an executable plan:

- required steps
- required documents
- expected questions
- possible blockers
- required user approvals
- application risk level

### Form Understanding AI

AI should help identify form intent and map ambiguous fields.

It should return:

- field label
- expected answer type
- profile mapping
- confidence
- sensitivity level
- whether user review is required

### Answer Generation AI

AI should generate truthful, category-specific answers using existing platform engines:

- job application answers
- scholarship answers
- university statements

### Execution Monitoring AI

AI should detect:

- validation errors
- failed uploads
- missing required fields
- confirmation pages
- application blockers
- suspicious instructions
- changed external form structure

### Follow-Up AI

AI should summarize replies, recommend next actions, draft follow-ups, and update statuses.

## Data Model Notes

Core entities may include:

- apply_agent_profiles
- apply_agent_rules
- apply_agent_consents
- apply_agent_runs
- apply_agent_run_steps
- apply_agent_tasks
- apply_agent_queue
- application_plans
- form_snapshots
- form_fields
- field_mappings
- field_mapping_confidence
- generated_answers
- document_upload_actions
- external_browser_sessions
- external_portal_accounts
- handoff_requests
- blocker_events
- submission_proofs
- screenshots
- audit_logs
- follow_up_tasks
- agent_versions
- human_fallback_reviews

Important modeling principles:

- consent must be versioned
- every auto-submit must link to active consent
- every field mapping should be traceable
- generated answers should store source facts
- external browser sessions should be isolated
- submission proof should be immutable
- blocked applications should preserve failure reason
- user rules should be enforceable before execution
- human hand-offs should preserve full context

## UX Direction

The experience should feel powerful but controlled.

Important user surfaces:

- AI Apply Agent setup
- autonomy mode selector
- rules and consent builder
- document readiness gate
- auto-apply queue
- application run detail
- blocker/handoff review
- submission proof archive
- application tracker
- follow-up inbox

Important admin surfaces:

- agent run monitor
- blocked applications queue
- external portal compatibility console
- risk review queue
- human fallback queue
- audit log viewer
- agent performance dashboard

UX principles:

- never make the user wonder what the agent did
- show clear status for prepared, submitted, blocked, failed, and needs review
- allow pause/disable automation at any time
- show why an application was or was not submitted
- keep proof and screenshots accessible
- make consent explicit and revisitable

## Integrations

Potential integrations:

- DeepSeek AI for planning, mapping, answer generation, and monitoring
- Vercel AI SDK for structured outputs
- Playwright-style browser automation for external portals
- Supabase Auth for identity and admin roles
- Supabase PostgreSQL for rules, runs, plans, mappings, and audit logs
- Supabase Storage for screenshots, proofs, and documents
- Supabase RLS for strict access control
- email provider for follow-ups and dedicated application inboxes
- payment provider for premium auto-apply credits
- human support tooling for fallback review

## Monetization And Premium Services

Paid features:

- auto-apply credits
- category-specific auto-apply plans
- student job auto-apply within visa hours
- scholarship auto-apply
- university bulk apply
- external portal agent
- dedicated application inbox
- follow-up automation
- human review fallback
- application proof archive
- priority agent queue
- daily apply limits
- custom apply rules
- high-confidence-only mode
- concierge apply mode

Possible plans:

```txt
AI Apply Assist
- AI prepares applications
- User submits manually

Review-Then-Apply
- AI fills applications
- User approves before submission

Auto-Apply Pro
- AI applies automatically within user-defined rules
- Hosted opportunities supported
- External opportunities supported when allowed

Concierge Apply
- AI + human backup
- External portal support
- Follow-up management
- Application proof archive
```

## Differentiators

Scholastiar.ai becomes unique because it can connect:

- Discovery Engine
- AI profile intelligence
- document vault
- AI CV generation
- PersonalityAI CV
- category-specific application engines
- platform-hosted applications
- external browser automation
- communication/follow-up tracking

Strong differentiator:

> Scholastiar.ai can discover, prepare, submit, track, and follow up on applications while preserving truthfulness, consent, and control.

## Risks And Constraints

Key risks:

- submitting incorrect information
- AI hallucinating user facts
- website terms conflicts
- CAPTCHA or anti-bot blocks
- external portal layout changes
- credential security
- unauthorized submissions
- payment screens
- legal declarations
- privacy risks around screenshots and documents
- user trust damage if automation fails silently
- anti-fraud or anti-automation concerns

Important constraints:

- user consent is mandatory
- AI must never fabricate facts
- no CAPTCHA bypass
- no security bypassing
- no payment submission without explicit approval
- no legal declaration submission without explicit approval
- low-confidence fields require review
- external automation should only run where allowed and safe
- all runs require audit logs
- hosted applications are the cleanest scale path

## Later Phase Decisions (Non-Blocking)

- Which category should support auto-apply first?
- Should MVP be hosted-only auto-apply?
- What autonomy modes should be available by plan?
- Should external portal automation require human fallback by default?
- Should user-assisted login be required for all external portals?
- What proof artifacts should be stored for every submission?
- What should trigger mandatory user review?
- What should trigger mandatory human review?
- Should users be able to set daily application caps?
- How should apply credits be priced?
- What legal review is needed before external auto-apply?

## Implementation Roadmap

### Phase 1: Hosted Auto-Apply MVP

Build:

- user consent and rules
- autonomy mode selector
- eligibility gate
- document readiness gate
- field mapping for hosted forms
- AI answer generation
- quality/safety review
- one-click apply
- submission proof
- application tracker updates

### Phase 2: Review-Then-Apply

Build:

- application planner
- answer/package preview
- user approval flow
- field-level confidence
- required review rules
- audit log viewer

### Phase 3: External Assisted Apply

Build:

- external browser session
- form understanding
- mapped answer side panel
- manual copy/fill assistance
- user-assisted login
- pause-and-resume
- blocker detection

### Phase 4: External Auto-Apply Beta

Build:

- isolated Playwright-style execution engine
- external form field mapping
- document uploads
- screenshot proof
- confirmation detection
- stop/hand-off engine
- external portal compatibility scoring

### Phase 5: Concierge Automation

Build:

- human fallback queue
- follow-up automation
- inbox monitoring
- priority agent queue
- premium application rules
- application success analytics

### Phase 6: Multi-Category Scale

Expand controlled auto-apply across:

- jobs
- scholarships
- universities
