# Messaging Pages

Status: Unified Platform Service

Source service spec: `SERVICES/99-messaging-communication.md`

## Page System Vision

Messaging pages should keep employer-candidate communication inside Scholastiar.ai.

They should support status updates, interview invitations, follow-ups, offer communication, and application-linked conversations.

## Candidate Pages

### Candidate Messages Page

Route: `/messages`

Purpose: Candidate inbox for employer conversations.

Key sections:

- threads
- unread messages
- linked applications
- interview invitations
- status updates

Primary actions:

- open thread
- reply
- attach document
- view linked application

### Candidate Message Thread Page

Route: `/messages/[threadId]`

Purpose: One conversation with an employer.

Features:

- message history
- application context
- employer profile
- attachments
- interview/status cards

## Employer Pages

### Employer Messages Page

Route: `/employers/messages`

Purpose: Employer inbox for candidate conversations.

### Employer Message Thread Page

Route: `/employers/messages/[threadId]`

Purpose: One conversation with a candidate.

Primary actions:

- reply
- send interview invitation
- update pipeline status
- attach document

## Admin Pages

### Admin Messages Review Page

Route: `/admin/messages`

Purpose: Support moderation, abuse reports, and troubleshooting.

## Suggested MVP Page Set

- `/messages`
- `/messages/[threadId]`
- `/employers/messages`
- `/employers/messages/[threadId]`
- `/admin/messages`

## Page Priority

### MVP Priority

- Candidate Messages Page
- Candidate Message Thread Page
- Employer Messages Page
- Employer Message Thread Page

### Phase 2 Priority

- Admin Messages Review Page
- Interview Invitation Composer
- Message Templates Page
