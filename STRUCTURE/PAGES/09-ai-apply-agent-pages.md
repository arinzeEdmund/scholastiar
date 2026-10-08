# AI Apply Agent Pages

Status: Unified Platform Service

Source service spec: `SERVICES/09-ai-apply-agent.md`

## Page System Vision

The AI Apply Agent page system should support both user-facing automation controls and admin-facing operational oversight.

It should help users move through:

> Set rules -> approve consent -> connect documents -> build apply queue -> let agent apply -> review blockers -> track submissions -> manage follow-ups.

It should help admins and human support teams monitor:

> Agent runs -> external portal blockers -> risk events -> human fallback -> audit logs -> platform safety.

## User Setup Pages

### AI Apply Agent Home Page

Route: `/apply-agent`

Purpose: User entry point for autonomous application execution.

Key sections:

- agent status
- active autonomy mode
- applications submitted
- applications blocked
- upcoming queue
- documents readiness
- follow-up tasks
- plan/credits status

Primary actions:

- configure agent
- add opportunities to queue
- view active runs
- review blockers
- pause automation

### Autonomy Mode Selector Page

Route: `/apply-agent/mode`

Purpose: Let users choose how much control the agent has.

Modes:

- Assistive Apply
- Review-Then-Apply
- Auto-Apply Within Rules
- Concierge Automation

Primary actions:

- choose mode
- compare modes
- save mode
- require review for sensitive categories

### Consent And Rules Builder Page

Route: `/apply-agent/rules`

Purpose: Define exactly what the agent is allowed to do.

Rule sections:

- allowed categories
- allowed countries
- maximum application fee
- document permissions
- auto-submit permission
- external portal permission
- essay/question generation permission
- email/follow-up permission
- account creation permission
- daily/weekly application limits
- mandatory review triggers

Primary actions:

- save rules
- update consent
- pause all automation
- reset to safe defaults

### Document Readiness Gate Page

Route: `/apply-agent/documents`

Purpose: Confirm the agent has the approved documents it needs.

Sections:

- AI CV
- academic documents
- passport/ID
- transcripts
- recommendation letters
- proof of funds
- portfolio
- category-specific documents
- missing documents
- expired/outdated documents

Primary actions:

- upload document
- approve document for agent use
- revoke document permission
- attach document to categories

## Queue And Run Pages

### Auto-Apply Queue Page

Route: `/apply-agent/queue`

Purpose: Show opportunities waiting for the agent.

Views:

- ready to apply
- needs review
- missing documents
- blocked by rules
- scheduled
- external portal unsupported

Primary actions:

- approve queue item
- remove item
- change priority
- run now
- require review

### Add Opportunities To Queue Page

Route: `/apply-agent/queue/add`

Purpose: Add opportunities from platform sections into the apply queue.

Sources:

- saved jobs
- saved scholarships
- saved universities
- AI recommendations
- opportunity cards using `Add to AI Apply Agent Board`

Primary actions:

- add selected
- auto-add matching opportunities
- apply rules filter
- preview blocked items

Queue items should preserve the card signals that helped the user choose them:

- application period/deadline
- estimated application effort
- success/fit score
- subscription/usage eligibility
- missing documents
- automation risk
- consent status

### Apply Run Detail Page

Route: `/apply-agent/runs/[runId]`

Purpose: Show exactly what the agent did for one application.

Sections:

- opportunity summary
- application plan
- current status
- steps completed
- fields filled
- generated answers
- documents uploaded
- screenshots/proof
- blockers/errors
- final confirmation
- audit trail

Primary actions:

- continue run
- approve next step
- stop run
- open proof
- request human help

### Blocker Review Page

Route: `/apply-agent/blockers`

Purpose: Show applications that need user input.

Blocker types:

- CAPTCHA
- MFA/login
- payment
- legal declaration
- low-confidence field
- missing document
- unsupported file type
- suspicious page
- unclear question

Primary actions:

- resolve blocker
- provide missing answer
- upload document
- approve declaration
- stop application
- request human help

### Submission Proof Archive Page

Route: `/apply-agent/proofs`

Purpose: Store confirmation evidence for submitted applications.

Proof items:

- confirmation screenshot
- confirmation number
- submission timestamp
- submitted documents
- submitted answers
- application URL
- agent version
- consent version

Primary actions:

- open proof
- download summary
- link to application tracker
- report issue

## Category Automation Pages

### Jobs Auto-Apply Settings Page

Route: `/apply-agent/categories/jobs`

Purpose: Configure job-specific automation. Pro plan only, like every Jobs surface; Starter sees it locked with an upgrade prompt.

Rules:

- fits my study visa hours / sponsors my work visa
- salary range
- location
- role type
- remote/hybrid/on-site
- excluded employers
- maximum applications per day
- cover letter review requirement

### Scholarships Auto-Apply Settings Page

Route: `/apply-agent/categories/scholarships`

Purpose: Configure scholarship-specific automation.

Rules:

- fully funded only
- eligible only
- no application fee
- require essay review
- require document completeness
- require recommendation availability

### Universities Auto-Apply Settings Page

Route: `/apply-agent/categories/universities`

Purpose: Configure university-specific automation.

Rules:

- target countries
- tuition limit
- program/degree
- intake
- language of instruction
- require final review before submit
- no paid applications without approval

### Other Category Settings Page

Route: `/apply-agent/categories/[category]`

Purpose: Configure rules for any other category.

Primary actions:

- define category rules
- require review triggers
- set daily limits
- approve documents

## Communication And Follow-Up Pages

### Follow-Up Inbox Page

Route: `/apply-agent/inbox`

Purpose: Manage responses from submitted applications.

Features:

- application-linked threads
- AI summaries
- next action suggestions
- follow-up drafts
- missing document requests
- interview invitations

Primary actions:

- reply
- generate response
- mark status
- escalate to human

### Follow-Up Tasks Page

Route: `/apply-agent/follow-ups`

Purpose: Track pending follow-ups and response deadlines.

Views:

- needs reply
- follow-up due
- interview/action required
- missing document requested
- unanswered applications

Primary actions:

- send follow-up
- snooze
- mark complete
- request human help

## Premium Pages

### AI Apply Agent Pricing Page

Route: `/apply-agent/pricing`

Purpose: Monetize apply automation plans and credits.

Plans:

- AI Apply Assist
- Review-Then-Apply
- Auto-Apply Pro
- Concierge Apply

Paid add-ons:

- auto-apply credits
- external portal support
- human fallback
- priority agent queue
- follow-up automation
- proof archive

Primary actions:

- choose plan
- buy credits
- upgrade
- view limits

### Usage And Credits Page

Route: `/apply-agent/usage`

Purpose: Show user usage, limits, and credit consumption.

Sections:

- applications prepared
- applications submitted
- external portal runs
- blocked runs
- human fallback usage
- credits remaining

Primary actions:

- buy credits
- upgrade plan
- view history

## Admin And Operations Pages

### Admin Agent Runs Console

Route: `/admin/apply-agent/runs`

Purpose: Monitor all AI Apply Agent runs.

Views:

- running
- completed
- blocked
- failed
- needs human fallback
- suspicious

Primary actions:

- open run
- pause run
- assign human support
- mark resolved
- escalate risk

### Admin Run Detail Page

Route: `/admin/apply-agent/runs/[runId]`

Purpose: Inspect one agent run.

Sections:

- user
- opportunity
- mode
- consent version
- steps
- generated answers
- documents uploaded
- screenshots
- errors
- blocker events
- audit trail

Primary actions:

- assign support
- pause automation
- add internal note
- escalate risk

### Human Fallback Queue Page

Route: `/admin/apply-agent/fallback`

Purpose: Manage applications requiring human intervention.

Queue reasons:

- external portal blocked
- unclear question
- payment approval
- legal declaration
- document issue
- suspicious page
- user requested help

Primary actions:

- assign agent
- contact user
- resolve blocker
- return to AI agent
- close fallback

### External Portal Compatibility Console

Route: `/admin/apply-agent/portals`

Purpose: Track which external portals are compatible with automation.

Fields:

- domain
- category
- compatibility score
- login required
- CAPTCHA frequency
- file upload support
- known blockers
- last successful run
- terms notes

Primary actions:

- mark supported
- mark unsupported
- add notes
- review failures

### Risk And Safety Queue Page

Route: `/admin/apply-agent/risk`

Purpose: Review risky automation events.

Risk events:

- attempted payment
- legal declaration
- suspicious page
- low-confidence field
- repeated failure
- possible terms issue
- user complaint

Primary actions:

- pause category
- pause portal
- escalate
- mark false positive
- create policy rule

### Agent Audit Logs Page

Route: `/admin/apply-agent/audit`

Purpose: Audit agent actions across users and applications.

Tracked events:

- consent changes
- rule changes
- field mappings
- generated answers
- uploads
- submissions
- failures
- human interventions

Primary actions:

- filter by user
- filter by category
- filter by run
- export audit summary

### Agent Performance Dashboard

Route: `/admin/apply-agent/performance`

Purpose: Understand reliability and business performance.

Metrics:

- successful submissions
- blocked runs
- failure rate
- average completion time
- portal compatibility
- category success rate
- human fallback rate
- credit usage
- user satisfaction signals

Primary actions:

- identify weak portals
- tune rules
- update compatibility
- assign operations work

## Suggested MVP Page Set

For the first AI Apply Agent MVP, start with:

- `/apply-agent`
- `/apply-agent/mode`
- `/apply-agent/rules`
- `/apply-agent/documents`
- `/apply-agent/queue`
- `/apply-agent/queue/add`
- `/apply-agent/runs/[runId]`
- `/apply-agent/blockers`
- `/apply-agent/proofs`
- `/apply-agent/pricing`
- `/apply-agent/usage`
- `/admin/apply-agent/runs`
- `/admin/apply-agent/runs/[runId]`
- `/admin/apply-agent/fallback`
- `/admin/apply-agent/audit`

This supports hosted auto-apply and review-then-apply before deep external automation.

## Page Priority

### MVP Priority

- AI Apply Agent Home Page
- Autonomy Mode Selector Page
- Consent And Rules Builder Page
- Document Readiness Gate Page
- Auto-Apply Queue Page
- Add Opportunities To Queue Page
- Apply Run Detail Page
- Blocker Review Page
- Submission Proof Archive Page
- AI Apply Agent Pricing Page
- Usage And Credits Page
- Admin Agent Runs Console
- Admin Run Detail Page
- Human Fallback Queue Page
- Agent Audit Logs Page

### Phase 2 Priority

- Jobs Auto-Apply Settings Page
- Scholarships Auto-Apply Settings Page
- Universities Auto-Apply Settings Page
- Other Category Settings Page
- Follow-Up Inbox Page
- Follow-Up Tasks Page
- External Portal Compatibility Console

### Phase 3 Priority

- Risk And Safety Queue Page
- Agent Performance Dashboard
- Concierge operations dashboard
- Advanced portal policy pages
- Provider-hosted auto-apply analytics
