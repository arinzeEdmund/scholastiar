# Candidate Profile

Status: Unified Platform Service

## Feature Vision

The Candidate Profile is the persistent professional identity layer of Scholastiar.ai.

It should store and continuously improve the user's employment profile so the platform can generate CVs, answer applications, recommend jobs, rank fit, and present the candidate professionally to employers.

Core principle:

> One profile forever. Every application, edit, CV, and outcome should improve it.

## Problem Being Solved

Candidates repeatedly rewrite the same information across job platforms, CVs, forms, and employer portals.

The profile solves:

- repeated self-explanation
- inconsistent CV/application details
- missing achievements
- poor job matching
- weak employer presentation
- disconnected documents
- visa ambiguity

## Target Users

- candidates
- international applicants
- employers reviewing candidate profiles
- AI systems generating CVs and answers

## Core Workflows

### Profile Overview

Show identity, summary, experience, education, skills, documents, visa/mobility profile, and PersonalityAI CV status.

### Profile Editing

Users can update individual sections without restarting onboarding.

### Work Experience Management

Users can add, edit, and improve experience entries with AI achievement support.

### Skills And Certifications

Users manage skills, tools, languages, certifications, and proficiency.

### Visa And Mobility Profile

Users maintain sponsorship needs, work authorization, relocation preferences, and target countries.

### Document Vault Connection

Documents can be attached to profile sections and applications.

## AI Opportunities

- profile summary generation
- achievement rewriting
- skill normalization
- job title normalization
- missing profile gap detection
- CV-ready bullet suggestions
- role compatibility summaries
- employer-facing candidate summaries

## Data Model Notes

Core entities:

- candidate_profiles
- profile_sections
- work_experiences
- education_records
- candidate_skills
- certifications
- languages
- visa_profiles
- career_preferences
- profile_documents
- profile_versions

## UX Direction

The profile should feel alive and useful, not like a database record.

Important UX:

- profile strength indicator
- section-level completeness
- AI improvement suggestions
- employer preview mode
- clear privacy controls

## Integrations

- AI CV generation
- AI-assisted applications
- job matching
- candidate ranking
- PersonalityAI CV
- document storage
- employer candidate view

## Risks And Constraints

- candidate controls profile visibility
- employers should only see relevant/applicant-approved data
- AI edits must not fabricate facts
- sensitive visa/document data requires strict RLS

## Later Phase Decisions (Non-Blocking)

- Which fields are visible to employers before application?
- Should candidates have multiple profile versions?
- How should profile learning from outcomes be shown?

## Implementation Roadmap

### Phase 1

Build core profile sections, editing, profile strength, and employer preview.

### Phase 2

Add AI profile improvements and profile versioning.

### Phase 3

Add continuous learning from applications and employer responses.
