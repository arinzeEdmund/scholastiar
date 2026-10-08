# Analytics

Status: Unified Platform Service

## Feature Vision

Analytics turns platform activity into actionable insight for candidates, employers, and admins.

Candidate analytics should improve job search strategy. Employer analytics should improve hiring performance. Admin analytics should improve platform operations.

## Problem Being Solved

Without analytics:

- candidates do not know what works
- employers do not see hiring bottlenecks
- admins cannot track platform health
- AI features cannot be evaluated
- subscription value is harder to prove

## Target Users

- candidates
- premium candidates
- employers
- admins

## Core Workflows

### Candidate Analytics

Track:

- application volume
- response rate
- interview rate
- match score trends
- country/industry performance
- CV version performance
- profile strength over time

### Employer Analytics

Track:

- applicant funnel
- reviewed/shortlisted/interviewed/offered counts
- time-to-hire
- candidate source
- geographic applicant distribution
- student job and post-study job demand
- screening drop-off

### Admin Analytics

Track:

- user growth
- employer growth
- active jobs
- application volume
- AI usage
- revenue
- retention
- errors/failures

## AI Opportunities

- generate insight summaries
- detect trends
- recommend candidate strategy
- identify employer bottlenecks
- summarize platform health

## Data Model Notes

Core entities:

- analytics_events
- candidate_metrics
- employer_metrics
- job_metrics
- application_metrics
- ai_usage_metrics
- revenue_metrics

## UX Direction

Analytics should be clear and actionable.

Avoid vanity metrics without recommended action.

## Integrations

- applications
- jobs
- AI CV
- employers
- billing
- notifications

## Risks And Constraints

- analytics should protect privacy
- avoid overclaiming causality
- aggregate employer/admin metrics carefully
- user-specific insights need enough data

## Later Phase Decisions (Non-Blocking)

- Which analytics are premium?
- Which events are required in MVP?
- Should employers see demographic/geographic data in grouped form only?

## Implementation Roadmap

### Phase 1

Build core event tracking and basic candidate/employer dashboards.

### Phase 2

Add AI insight summaries and admin analytics.

### Phase 3

Add predictive trends and deeper funnel diagnostics.
