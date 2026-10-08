# Application Tracking

Status: Unified Platform Service

## Feature Vision

Application Tracking is the candidate and employer operational layer for job applications.

It should show candidates exactly where their applications stand and give employers a structured pipeline for reviewing applicants.

Core promise:

> Every application has a clear status, history, next step, and communication thread.

## Problem Being Solved

Candidates lose track of:

- where they applied
- which CV they used
- what answers they submitted
- employer responses
- interviews
- follow-ups
- rejections

Employers lose track of:

- applicant review stages
- candidate communications
- pipeline bottlenecks
- work eligibility questions

## Target Users

- candidates
- employers
- recruiters
- admins

## Core Workflows

### Candidate Application Dashboard

Candidates view all applications by status, job, employer, date, and next action.

### Application Detail

Show job summary, submitted CV, answers, cover letter, PersonalityAI CV, timeline, and messages.

### Draft Applications

Users can resume incomplete application packages.

### Employer Pipeline

Employers move applicants through stages.

Stages:

- applied
- reviewed
- shortlisted
- interviewed
- offered
- rejected

### Status Updates

Status changes trigger candidate notifications and timeline entries.

## AI Opportunities

- next action recommendations
- follow-up suggestions
- status summary
- application weakness detection
- pipeline bottleneck detection
- outcome pattern analysis

## Data Model Notes

Core entities:

- applications
- application_status_history
- application_documents
- submitted_answers
- pipeline_stages
- employer_notes
- application_messages
- application_events

## UX Direction

Tracking should feel calm and reassuring.

Important UX:

- clear status badges
- timeline
- next action
- submitted package preview
- linked messages
- filters by stage

## Integrations

- jobs
- AI CV generation
- AI-assisted applications
- messaging
- notifications
- employer pipeline
- analytics

## Risks And Constraints

- employers should not see candidate-private drafts
- status changes must be auditable
- rejected applications should be handled respectfully
- candidate data must stay scoped to applications

## Later Phase Decisions (Non-Blocking)

- Which statuses are MVP?
- Can candidates manually track external applications in V1?
- Should employers be required to send rejection reasons?

## Implementation Roadmap

### Phase 1

Build candidate tracker, application details, employer pipeline, and status updates.

### Phase 2

Add drafts, follow-up reminders, and richer timeline events.

### Phase 3

Add application outcome intelligence and automated recommendations.
