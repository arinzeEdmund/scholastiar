# Visa-Sponsored Jobs

Status: Unified Platform Service

## Feature Vision

Visa-Sponsored Jobs is the international hiring focus layer of the unified platform.

It should clearly identify jobs and employers that are sponsorship-friendly, relocation-friendly, or open to international applicants.

Core promise:

> International applicants should not waste energy guessing whether a job can sponsor them.

## Problem Being Solved

International applicants face:

- sponsorship uncertainty
- wasted applications
- unclear employer visa policy
- country-specific work authorization confusion
- relocation anxiety
- low response rates despite strong skills

Employers face:

- unclear applicant visa needs
- surprise sponsorship complexity
- poor filtering for international hiring

## Target Users

- international job seekers
- visa-sponsored candidates
- employers open to sponsorship
- recruiters hiring globally

## Core Workflows

### Sponsorship Labeling

Jobs should display clear sponsorship states:

- visa sponsorship available
- relocation support available
- open to international applicants
- work authorization required
- sponsorship not available
- unknown/not specified

### Visa-Aware Search

Candidates can filter by target country, sponsorship availability, relocation support, work mode, and employer openness.

### Candidate Visa Profile Matching

The system compares candidate visa needs to job/employer sponsorship settings.

### Employer Sponsorship Setup

Employers define sponsorship capability by role, country, and hiring policy.

### Visa Complexity Alerts

Employers see early indicators when applicants may require complex sponsorship paths.

## AI Opportunities

- infer sponsorship language from job descriptions
- summarize visa fit
- flag ambiguous sponsorship claims
- suggest employer sponsorship wording
- explain candidate-job visa compatibility
- generate candidate visa question answers

## Data Model Notes

Core entities:

- job_sponsorship_metadata
- employer_sponsorship_profiles
- candidate_visa_profiles
- visa_target_countries
- sponsorship_compatibility_scores
- visa_complexity_notes

## UX Direction

Visa information should be visible, direct, and emotionally reassuring.

Avoid vague labels. Use clear badges and explanations.

## Integrations

- jobs
- candidate profile
- employers
- AI-assisted applications
- candidate ranking
- application tracking

## Risks And Constraints

- avoid legal advice claims
- sponsorship status must be employer-confirmed or clearly inferred
- do not guarantee visa outcomes
- country rules change and should be treated carefully

## Later Phase Decisions (Non-Blocking)

- Which sponsorship labels should be MVP?
- Should inferred sponsorship require admin/employer confirmation?
- How detailed should visa complexity be in the first jobs release?

## Implementation Roadmap

### Phase 1

Build sponsorship metadata, filters, labels, and employer sponsorship inputs.

### Phase 2

Add AI sponsorship detection and candidate visa fit summaries.

### Phase 3

Add deeper visa complexity indicators and employer education tools.
