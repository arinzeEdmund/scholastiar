# Messaging And Communication

Status: Unified Platform Service

## Feature Vision

Messaging keeps employer-applicant communication inside Scholastiar.ai.

It should support direct messages, interview invitations, status updates, follow-ups, and offer communication linked to applications.

Core promise:

> Candidate and employer communication should be organized, contextual, and action-oriented.

## Problem Being Solved

Hiring communication is often fragmented across email, job boards, and informal channels.

This creates:

- missed messages
- unclear application context
- slow responses
- poor status visibility
- lost interview details

## Target Users

- candidates
- employers
- recruiters
- admins/support

## Core Workflows

### Application-Linked Threads

Messages should be linked to applications and jobs.

### Candidate Inbox

Candidates see employer messages, interview invitations, and status updates.

### Employer Inbox

Employers communicate with candidates and take pipeline actions from threads.

### Interview Invitation

Employers can send structured interview invitations with date, time, location/link, and notes.

### System Status Messages

Application status changes can create system-generated messages or notifications.

## AI Opportunities

- message summaries
- reply drafting
- interview confirmation drafts
- follow-up suggestions
- unread priority detection
- tone improvement

## Data Model Notes

Core entities:

- message_threads
- messages
- message_participants
- application_thread_links
- interview_invitations
- message_attachments
- read_receipts

## UX Direction

Messaging should feel like a focused hiring inbox, not a generic chat app.

Important UX:

- application context sidebar
- status badges
- interview cards
- quick replies
- attachment support
- unread indicators

## Integrations

- Supabase Realtime
- notifications
- applications
- employers
- candidate profiles
- email triggers

## Risks And Constraints

- prevent harassment/spam
- support reporting/blocking
- protect attachments
- keep messages scoped to application/company
- admin access should be limited and audited

## Later Phase Decisions (Non-Blocking)

- Should messages open only after application submission?
- Should employers be able to message saved candidates?
- What moderation tools are MVP?

## Implementation Roadmap

### Phase 1

Build application-linked candidate/employer messaging and notifications.

### Phase 2

Add interview invitation cards, templates, and attachments.

### Phase 3

Add AI summaries, reply drafting, and communication analytics.
