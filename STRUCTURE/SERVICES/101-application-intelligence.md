# Application Intelligence

Status: Unified Platform Service

## Feature Vision

Application Intelligence learns from user application behavior and outcomes to improve future job search performance.

It should help candidates understand what works, what fails, and how to improve.

Core promise:

> Every application outcome should teach the platform how to help the user apply better next time.

## Problem Being Solved

Candidates often do not know:

- why they are not getting responses
- which roles are realistic
- which countries/industries respond
- whether their CV is weak
- whether they are applying to poor-fit roles
- whether visa constraints are affecting outcomes

## Target Users

- candidates
- premium candidates
- admins analyzing platform outcomes

## Core Workflows

### Outcome Tracking

Track applications, status changes, responses, interviews, offers, and rejections.

### Performance Insights

Show response rate by country, role type, industry, seniority, and match score.

### Weakness Detection

Identify profile gaps, CV weaknesses, answer weaknesses, and poor targeting patterns.

### Recommendations

Suggest better target roles, CV improvements, skill additions, or application strategy changes.

## AI Opportunities

- pattern detection
- application strategy recommendations
- CV weakness analysis
- role targeting guidance
- visa friction analysis
- response trend summaries

## Data Model Notes

Core entities:

- application_outcomes
- application_insights
- candidate_performance_metrics
- recommendation_events
- profile_gap_findings
- cv_performance_metrics

## UX Direction

Insights should be specific, supportive, and actionable.

Avoid generic advice. Use user-specific patterns.

## Integrations

- application tracking
- AI CV generation
- candidate profile
- jobs
- analytics

## Risks And Constraints

- avoid discouraging language
- do not overstate causality
- insights should distinguish inference from fact
- protect sensitive outcome data

## Later Phase Decisions (Non-Blocking)

- Which insights are free versus premium?
- How much data is needed before showing recommendations?
- Should users manually enter outcomes?

## Implementation Roadmap

### Phase 1

Track outcomes and show basic response analytics.

### Phase 2

Add AI recommendations and profile gap detection.

### Phase 3

Add predictive application strategy and CV performance learning.
