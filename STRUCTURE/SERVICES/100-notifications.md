# Notifications

Status: Unified Platform Service

Source email reference: `STRUCTURE/BUILD_GUIDE/EMAIL_INTELLIGENCE.md`

## Feature Vision

Notifications and email intelligence keep users aware of important opportunity events without overwhelming them.

They should cover application updates, messages, interviews, new matches, deadlines, profile gaps, readiness scores, AI Apply Agent prompts, Apply For Me delegation prompts, billing events, and relevant conversion/promo packs.

Core promise:

> Users should never miss an important opportunity or hiring update.

## Problem Being Solved

Users miss:

- employer messages
- interview invitations
- job deadlines
- scholarship, fellowship, grant, competition, conference, university, and award deadlines
- application status changes
- new strong job matches
- strong-fit opportunities across all categories
- readiness score changes
- AI Apply Agent authorization opportunities
- Apply For Me delegation opportunities
- billing/account events
- profile improvement prompts

## Target Users

- candidates
- employers
- admins

## Core Workflows

### Candidate Notifications

Types:

- new job match
- new high-fit opportunity
- saved job closing soon
- saved opportunity closing soon
- readiness score update
- save recommendation
- apply recommendation
- AI Apply Agent ready
- Apply For Me delegation suggestion
- application submitted
- application viewed
- status changed
- employer message
- interview invitation
- AI profile suggestion

### Employer Notifications

Types:

- new applicant
- candidate reply
- interview response
- job expiring
- pipeline reminder
- billing notice

### Notification Preferences

Users control email and in-app notifications.

Email preferences should include:

- weekly digest
- daily digest for active users
- deadline reminders
- readiness score emails
- AI Apply Agent emails
- Apply For Me emails
- promo/conversion emails
- category and country preferences

### Delivery Tracking

Admins can inspect failed notification delivery later.

## AI Opportunities

- prioritize important notifications
- generate concise notification copy
- recommend follow-up reminders
- suppress noisy repeated alerts

## Data Model Notes

Core entities:

- notifications
- notification_preferences
- notification_delivery_logs
- notification_templates
- notification_events
- email_templates
- email_campaigns
- email_events
- email_deliveries
- email_digest_schedules
- email_suppression_rules
- email_conversion_events

## UX Direction

Notifications should be clear, grouped, and actionable.

Important UX:

- mark read/unread
- filter by type
- link directly to relevant object
- avoid noisy batching

## Integrations

- messaging
- applications
- jobs
- billing
- pricing/subscriptions
- AI Apply Agent
- Apply For Me
- opportunity card metrics
- application readiness scoring
- email provider
- Supabase Realtime

## Risks And Constraints

- avoid notification fatigue
- preferences must be respected
- sensitive content should not leak in email previews
- failed delivery should be logged
- promo emails should be limited and behavior-based
- deadline emails should be suppressed after application/dismissal

## First Launch Decisions

- Email is periodic plus event-triggered, never random.
- Weekly digest is the default.
- Daily digest is optional for active users.
- Deadline reminders use 7-day, 3-day, and 24-hour triggers.
- Promo/conversion emails are limited to 1-2 per week and must be behavior-based.

## Implementation Roadmap

### Phase 1

Build in-app notifications, transactional emails, weekly digest, and deadline reminders.

### Phase 2

Add readiness score emails, save/apply recommendation emails, preferences, and delivery logs.

### Phase 3

Add AI Apply Agent emails, Apply For Me emails, AI prioritization, smart reminders, and conversion/promo intelligence.
