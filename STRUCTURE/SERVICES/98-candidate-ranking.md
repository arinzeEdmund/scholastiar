# Candidate Ranking

Status: Unified Platform Service

## Feature Vision

Candidate Ranking is the employer-side AI screening layer.

It should help employers quickly understand which applicants appear most compatible with a role while preserving transparency, fairness, and human decision-making.

Core promise:

> Rank candidates by role compatibility, not by shallow keyword matching.

## Problem Being Solved

Employers receive applications that are hard to compare because:

- CVs use inconsistent formats
- screening answers vary in quality
- international profiles need context
- visa needs are unclear
- recruiters lack time
- strong candidates are buried

## Target Users

- employers
- recruiters
- hiring managers
- admins monitoring AI quality

## Core Workflows

### Candidate Fit Score

Score applicants against job requirements, skills, experience, location, available hours and work eligibility.

### AI Candidate Summary

Generate a short recruiter-friendly summary of strengths, risks, and fit.

### Work Eligibility Indicators

Show each applicant's study status, available hours within their study visa conditions, or post-study permit, its expiry and the sponsored visa they need, as the applicant recorded them.

### Applicant Sorting And Filtering

Employers filter by fit score, skills, study or permit status, available hours, location, PersonalityAI CV, Signia proof-of-work depth, and pipeline stage.

### Human Decision Layer

Ranking should support decisions, not make final hiring decisions.

## AI Opportunities

- semantic role matching
- structured candidate summaries
- skill gap analysis
- experience relevance analysis
- screening answer assessment
- Signia project and skill-evidence assessment
- work eligibility explanation
- recruiter next-step suggestions

## Data Model Notes

Core entities:

- candidate_rankings
- job_candidate_scores
- ranking_factors
- ranking_explanations
- candidate_fit_summaries
- ranking_model_versions
- employer_ranking_feedback

## UX Direction

Ranking should be explainable and careful.

Important UX:

- show score with reasons
- show strengths and concerns
- show visa indicators separately
- allow employer override
- avoid black-box rejection

## Integrations

- applications
- jobs
- candidate profiles
- AI-assisted applications
- PersonalityAI CV
- Signia
- employer pipeline
- analytics

## Risks And Constraints

- avoid discriminatory scoring
- do not use protected characteristics
- ranking must be explainable
- humans make final decisions
- model/prompt versions should be logged

## Later Phase Decisions (Non-Blocking)

- What factors should be included in MVP ranking?
- Should employers see numeric scores or grouped bands?
- How should candidate ranking feedback improve the system?

## Implementation Roadmap

### Phase 1

Build fit score, ranking explanation, and applicant sorting.

### Phase 2

Add employer feedback and model version tracking.

### Phase 3

Add deeper semantic matching and hiring outcome calibration.
