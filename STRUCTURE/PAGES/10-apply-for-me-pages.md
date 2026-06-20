# Apply For Me Pages

Status: Unified Platform Service

Source service spec: `SERVICES/10-apply-for-me.md`

## Page System Vision

Apply For Me pages should support a specialized human application marketplace.

The system should support the full journey:

> Customer creates proposal -> Forwarders bid or accept -> contract starts -> milestones are completed -> applications are submitted with proof -> customer approves -> Forwarder gets paid -> disputes are handled if needed.

It should also support Forwarder vetting, document access control, AI-assisted application execution, quality audits, and AI Apply Agent escalation.

## Customer Pages

### Apply For Me Home Page

Route: `/apply-for-me`

Purpose: Customer entry point for hiring vetted Scholastiar Forwarders.

Key sections:

- active campaigns
- create new proposal
- recommended campaign types
- featured Forwarders
- pending bids
- submitted applications
- proof archive
- spending summary

Primary actions:

- create proposal
- browse Forwarders
- review bids
- open active campaign
- view proof

### Apply For Me Board Page

Route: `/apply-for-me/board`

Purpose: Show opportunities the user added from opportunity cards for human application support.

Board items should show:

- opportunity title and type
- provider/employer/organizer
- country or region
- application period/deadline
- estimated application effort
- success/fit score
- required documents
- estimated Forwarder effort or credit cost
- review-before-submit preference
- campaign readiness status

Primary actions:

- create campaign from selected opportunities
- remove from board
- request Forwarder estimate
- upgrade plan if board access is locked

### Create Proposal Page

Route: `/apply-for-me/proposals/new`

Purpose: Let customers define an application mission.

Inputs:

- category
- opportunity type
- target countries
- number of applications
- budget
- deadline
- required quality level
- review-before-submit setting
- follow-up included
- AI tools allowed
- portal account creation allowed
- application fees allowed
- required documents
- special instructions

Primary actions:

- save draft
- preview proposal
- publish proposal
- invite Forwarders

### Proposal Detail Page

Route: `/apply-for-me/proposals/[proposalId]`

Purpose: View proposal details, bids, and negotiation.

Sections:

- proposal scope
- budget
- timeline
- required documents
- bids/counteroffers
- questions from Forwarders
- recommended Forwarders
- risk/scope warnings

Primary actions:

- accept bid
- reject bid
- counteroffer
- answer question
- edit proposal
- close proposal

### Customer Campaign Dashboard

Route: `/apply-for-me/campaigns`

Purpose: Show all active and completed Apply For Me campaigns.

Views:

- active
- pending milestones
- waiting for customer approval
- completed
- disputed
- cancelled

Primary actions:

- open campaign
- review milestone
- approve proof
- message Forwarder
- open dispute

### Campaign Detail Page

Route: `/apply-for-me/campaigns/[contractId]`

Purpose: Full operational view for one active contract.

Sections:

- Forwarder profile
- campaign scope
- milestones
- application tracker
- submitted applications
- proof archive
- documents shared
- sensitive action requests
- messages
- spend
- timeline

Primary actions:

- approve milestone
- request revision
- message Forwarder
- update document permissions
- approve sensitive action
- open dispute

### Customer Proof Archive Page

Route: `/apply-for-me/proofs`

Purpose: Store proof for all submitted applications.

Proof items:

- screenshot
- confirmation email
- confirmation number
- submitted URL
- submitted documents
- submitted answers
- date/time
- Forwarder notes

Primary actions:

- open proof
- link to application tracker
- approve proof
- report issue

### Customer Document Permissions Page

Route: `/apply-for-me/documents`

Purpose: Control what Forwarders can access.

Sections:

- shared documents
- documents pending approval
- documents by campaign
- access logs
- revoked access
- expiring links

Primary actions:

- approve access
- revoke access
- set expiration
- view access log
- upload document

### Sensitive Action Approval Page

Route: `/apply-for-me/approvals`

Purpose: Review actions requiring explicit customer approval.

Approval types:

- payment/application fee
- legal declaration
- signature
- visa/immigration declaration
- financial information
- reference information
- portal account creation
- high-stakes essay submission

Primary actions:

- approve
- reject
- ask question
- request human/admin review

## Forwarder Pages

### Forwarder Onboarding Page

Route: `/forwarder/onboarding`

Purpose: Start vetting and training for new Forwarders.

Steps:

- profile setup
- identity verification
- specialization selection
- writing test
- application accuracy test
- privacy/ethics agreement
- training checklist

Primary actions:

- submit verification
- complete test
- sign agreement
- continue onboarding

### Forwarder Marketplace Page

Route: `/forwarder/marketplace`

Purpose: Browse available customer proposals.

Filters:

- category
- country
- budget
- deadline
- number of applications
- required specialization
- review-before-submit
- urgency

Primary actions:

- open proposal
- accept
- bid
- ask question
- save proposal

### Forwarder Proposal Response Page

Route: `/forwarder/proposals/[proposalId]`

Purpose: Review proposal and submit bid/counteroffer.

Sections:

- customer scope
- budget
- deadline
- documents needed
- AI scope estimate
- risk warnings
- milestone suggestion

Primary actions:

- accept offer
- submit bid
- counteroffer
- ask clarification
- decline

### Forwarder Active Contracts Page

Route: `/forwarder/contracts`

Purpose: Show assigned campaigns and work queue.

Views:

- active
- awaiting customer info
- milestone due
- proof pending
- completed
- disputed

Primary actions:

- open contract
- message customer
- submit proof
- request approval

### Forwarder Contract Workspace

Route: `/forwarder/contracts/[contractId]`

Purpose: Specialized workspace for executing applications.

Sections:

- customer profile summary
- allowed documents
- opportunity targets
- application checklist
- AI assist panel
- generated answers
- milestones
- proof upload
- messages
- sensitive action requests

Primary actions:

- create application task
- use AI assist
- upload proof
- request document
- request sensitive approval
- submit milestone

### Forwarder Application Task Page

Route: `/forwarder/contracts/[contractId]/tasks/[taskId]`

Purpose: Work on one specific application.

Sections:

- opportunity details
- required documents
- customer instructions
- generated answers
- portal/account notes
- proof requirements
- task checklist

Primary actions:

- mark step complete
- upload proof
- request approval
- flag blocker
- submit task

### Forwarder Earnings Page

Route: `/forwarder/earnings`

Purpose: Show earnings, pending milestones, escrow, payouts, and fees.

Primary actions:

- view payout
- view escrow status
- open milestone
- download earnings summary

### Forwarder Quality Score Page

Route: `/forwarder/quality`

Purpose: Show Forwarder reputation and performance.

Metrics:

- completion rate
- on-time delivery
- customer rating
- proof quality
- admin audit score
- dispute rate
- repeat client rate
- specialization level

## Marketplace And Discovery Pages

### Browse Forwarders Page

Route: `/apply-for-me/forwarders`

Purpose: Let customers browse vetted Forwarders.

Filters:

- category specialization
- country expertise
- language
- level
- rating
- availability
- price range

Primary actions:

- view profile
- invite to proposal
- message

### Forwarder Public Profile Page

Route: `/apply-for-me/forwarders/[forwarderId]`

Purpose: Show Forwarder credibility.

Sections:

- profile summary
- specialization
- levels/badges
- ratings
- completed campaigns
- languages
- country expertise
- response time
- pricing guidance

Primary actions:

- invite to proposal
- message
- save Forwarder

### Smart Match Results Page

Route: `/apply-for-me/match/[proposalId]`

Purpose: Recommend best Forwarders for a proposal.

Outputs:

- top Forwarders
- match reasons
- category fit
- country/language fit
- availability
- estimated price
- risk notes

Primary actions:

- invite Forwarder
- compare Forwarders
- auto-invite top matches

## Messaging And Collaboration Pages

### Apply For Me Messages Page

Route: `/apply-for-me/messages`

Purpose: Customer and Forwarder communication.

Features:

- contract-linked threads
- proposal questions
- file requests
- sensitive action requests
- admin-visible dispute history when needed

Primary actions:

- send message
- attach file
- link message to milestone
- escalate

### Progress Reports Page

Route: `/apply-for-me/reports`

Purpose: View weekly or milestone-based progress reports.

Sections:

- applications submitted
- pending applications
- blockers
- follow-ups
- recommendations
- next milestones

Primary actions:

- approve report
- request clarification
- download report

## Payments And Disputes Pages

### Escrow And Payments Page

Route: `/apply-for-me/payments`

Purpose: Customer payment and escrow dashboard.

Sections:

- active escrow
- funded milestones
- pending releases
- completed payments
- refunds
- platform fees

Primary actions:

- fund milestone
- release milestone
- request refund
- view invoice

### Dispute Center Page

Route: `/apply-for-me/disputes`

Purpose: Manage disputes.

Views:

- open disputes
- waiting for evidence
- admin reviewing
- resolved

Primary actions:

- open dispute
- upload evidence
- respond
- accept resolution

### Dispute Detail Page

Route: `/apply-for-me/disputes/[disputeId]`

Purpose: Review dispute evidence and resolution.

Sections:

- contract terms
- milestone scope
- submitted proof
- messages
- application logs
- customer claim
- Forwarder response
- admin decision

Primary actions:

- submit evidence
- request rework
- accept resolution
- escalate

## Admin And Operations Pages

### Admin Apply For Me Dashboard

Route: `/admin/apply-for-me`

Purpose: Marketplace operations overview.

Key sections:

- active proposals
- active contracts
- pending vetting
- disputes
- escrow volume
- quality alerts
- overdue milestones
- high-risk campaigns

Primary actions:

- review disputes
- vet Forwarders
- inspect contract
- pause campaign

### Admin Forwarder Vetting Page

Route: `/admin/apply-for-me/forwarders/vetting`

Purpose: Review and approve Forwarders.

Sections:

- identity verification
- tests
- specialization
- training progress
- ethics agreement
- probation status

Primary actions:

- approve
- reject
- request more info
- assign level

### Admin Contracts Console

Route: `/admin/apply-for-me/contracts`

Purpose: Monitor contracts and campaign health.

Views:

- active
- overdue
- disputed
- high-value
- high-risk
- completed

Primary actions:

- open contract
- assign support
- pause contract
- add internal note

### Admin Contract Detail Page

Route: `/admin/apply-for-me/contracts/[contractId]`

Purpose: Inspect a customer-Forwarder contract.

Sections:

- proposal scope
- milestones
- payments
- proof
- messages
- document access logs
- sensitive approvals
- quality audit results

Primary actions:

- intervene
- request proof
- freeze payment
- resolve issue

### Admin Quality Audit Queue

Route: `/admin/apply-for-me/quality`

Purpose: Audit Forwarder work.

Audit triggers:

- missing proof
- customer complaint
- low rating
- high-value campaign
- random audit
- AI quality warning
- sensitive action

Primary actions:

- review proof
- mark passed
- mark failed
- penalize Forwarder
- request correction

### Admin Dispute Review Page

Route: `/admin/apply-for-me/disputes`

Purpose: Resolve marketplace disputes.

Primary actions:

- review evidence
- issue refund
- release funds
- require rework
- penalize Forwarder
- close dispute

### Admin Payments And Escrow Page

Route: `/admin/apply-for-me/payments`

Purpose: Monitor escrow, payouts, refunds, and platform fees.

Primary actions:

- view transaction
- freeze payout
- approve refund
- export financial report

### Admin Risk And Compliance Page

Route: `/admin/apply-for-me/risk`

Purpose: Monitor privacy, document access, sensitive actions, and policy violations.

Primary actions:

- revoke Forwarder access
- suspend Forwarder
- inspect document logs
- escalate compliance issue

## Suggested MVP Page Set

For the first Apply For Me MVP, start with:

- `/apply-for-me`
- `/apply-for-me/proposals/new`
- `/apply-for-me/proposals/[proposalId]`
- `/apply-for-me/campaigns`
- `/apply-for-me/campaigns/[contractId]`
- `/apply-for-me/documents`
- `/apply-for-me/proofs`
- `/apply-for-me/messages`
- `/forwarder/onboarding`
- `/forwarder/marketplace`
- `/forwarder/proposals/[proposalId]`
- `/forwarder/contracts`
- `/forwarder/contracts/[contractId]`
- `/forwarder/contracts/[contractId]/tasks/[taskId]`
- `/admin/apply-for-me`
- `/admin/apply-for-me/forwarders/vetting`
- `/admin/apply-for-me/contracts`
- `/admin/apply-for-me/disputes`

This creates the core marketplace loop before advanced matching, escrow sophistication, and AI Apply Agent escalation.

## Page Priority

### MVP Priority

- Apply For Me Home Page
- Create Proposal Page
- Proposal Detail Page
- Customer Campaign Dashboard
- Campaign Detail Page
- Customer Document Permissions Page
- Customer Proof Archive Page
- Apply For Me Messages Page
- Forwarder Onboarding Page
- Forwarder Marketplace Page
- Forwarder Proposal Response Page
- Forwarder Active Contracts Page
- Forwarder Contract Workspace
- Forwarder Application Task Page
- Admin Apply For Me Dashboard
- Admin Forwarder Vetting Page
- Admin Contracts Console
- Admin Dispute Review Page

### Phase 2 Priority

- Sensitive Action Approval Page
- Browse Forwarders Page
- Forwarder Public Profile Page
- Smart Match Results Page
- Progress Reports Page
- Escrow And Payments Page
- Dispute Center Page
- Dispute Detail Page
- Forwarder Earnings Page
- Forwarder Quality Score Page

### Phase 3 Priority

- Admin Contract Detail Page
- Admin Quality Audit Queue
- Admin Payments And Escrow Page
- Admin Risk And Compliance Page
- AI Apply Agent escalation dashboards
- Concierge campaign manager pages
