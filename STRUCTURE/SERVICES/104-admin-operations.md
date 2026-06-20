# Admin Operations

Status: Unified Platform Service

## Feature Vision

Admin Operations gives the Scholastiar.ai team control over platform health, moderation, user support, employer verification, job quality, billing visibility, and AI generation oversight.

Core promise:

> The internal team can operate a trusted employment platform safely and efficiently.

## Problem Being Solved

The platform needs internal tooling for:

- user support
- employer verification
- job moderation
- reported content
- AI generation monitoring
- PersonalityAI CV moderation
- billing support
- platform configuration
- abuse prevention

## Target Users

- super admins
- support admins
- content moderators
- employer verification admins
- billing/support operators
- AI quality reviewers

## Core Workflows

### Admin Dashboard

Show user growth, employer growth, active jobs, applications, reports, AI failures, revenue, and system alerts.

### User Management

Search users, inspect account status, view support context, suspend/reactivate when needed.

### Employer Management

Review employer profiles, verify companies, inspect jobs, and handle abuse.

### Job Moderation

Review jobs, remove scams, flag unclear sponsorship claims, and enforce listing standards.

### Application Oversight

Monitor application errors, suspicious activity, and support issues.

### Reports And Abuse

Handle reported users, employers, jobs, messages, and videos.

### AI Generation Oversight

Monitor failed generations, unsafe outputs, hallucination reports, and prompt version issues.

## AI Opportunities

- summarize reports
- detect suspicious job posts
- flag low-quality employer listings
- classify support tickets
- summarize user/account context for support
- monitor AI output quality signals

## Data Model Notes

Core entities:

- admin_users
- admin_roles
- admin_audit_logs
- moderation_reports
- moderation_actions
- employer_verification_records
- support_notes
- platform_settings
- ai_quality_events

## UX Direction

Admin UX should be dense, operational, and safe.

Important UX:

- audit trails
- clear destructive-action confirmations
- filters and queues
- role-based access
- source/context panels
- internal notes

## Integrations

- Supabase Auth/RLS
- jobs
- employers
- users
- applications
- billing
- AI generation logs
- PersonalityAI CV storage

## Risks And Constraints

- admin actions must be audited
- role permissions must be strict
- support access to user data should be limited
- destructive actions require confirmation
- internal notes must not leak to users

## Later Phase Decisions (Non-Blocking)

- Which admin roles are MVP?
- Should jobs require moderation before publishing?
- What AI outputs should admins be able to inspect?

## Implementation Roadmap

### Phase 1

Build admin dashboard, users, employers, jobs, reports, and settings.

### Phase 2

Add AI generation monitoring, support notes, and moderation workflows.

### Phase 3

Add advanced audit logs, admin roles, and operational analytics.
