# Onboarding Intelligence

Status: Unified Platform Service

## Feature Vision

Onboarding Intelligence is the foundation of Scholastiar.ai.

It should feel like an intelligent career interview that builds the user's one-profile-forever employment identity. The data collected here powers job matching, AI CV generation, application answers, visa-aware recommendations, PersonalityAI CV, and employer ranking.

Core promise:

> The user explains themselves once. The platform learns enough to help everywhere.

## Problem Being Solved

Traditional signup forms fail because they:

- collect shallow data
- feel administrative
- do not understand visa realities
- do not capture achievements well
- do not personalize future applications
- force users to repeat themselves later

International applicants especially need onboarding that captures study status, study visa work conditions, post-study permit plans, relocation goals, regional CV context, language ability, and career direction.

## Target Users

- candidates
- international job seekers
- international students and post-study graduates
- early-career applicants
- experienced professionals
- employers indirectly through better candidate data

## Core Workflows

### Candidate Identity Modeling

Collect identity, nationality, location, languages, visa status, and mobility preferences.

### Professional Profile Construction

Collect education, work history, skills, certifications, tools, projects, and achievements.

### Career Preference Learning

Capture target roles, industries, salary, seniority, work mode, countries, and relocation willingness.

### Guided Achievement Capture

Use prompts to turn responsibilities into measurable achievements.

### PersonalityAI CV Entry

Introduce the optional video/personality layer during onboarding without forcing completion.

### Review And Completion

Allow users to review the full profile, identify gaps, and complete onboarding.

## AI Opportunities

- extract skills from descriptions
- suggest achievements from responsibilities
- detect profile gaps
- infer role families from experience
- suggest target roles
- normalize job titles and education
- identify visa-sensitive profile areas
- create onboarding summaries for future AI prompts

## Data Model Notes

Core entities:

- candidate_profiles
- candidate_onboarding_sessions
- candidate_identity
- candidate_visa_profiles
- education_records
- work_experiences
- skills
- certifications
- career_preferences
- onboarding_intelligence_notes
- profile_completeness_scores

## UX Direction

The experience should feel conversational, calm, premium, and psychologically supportive.

Avoid:

- long sterile forms
- overwhelming screens
- generic progress language
- forcing video creation too early

Use:

- progressive disclosure
- smart defaults
- friendly prompts
- save-and-resume
- profile completeness feedback

## Integrations

- Supabase Auth
- PostgreSQL profile tables
- DeepSeek AI for profile interpretation
- Vercel AI SDK for structured outputs
- Supabase Storage for optional uploads

## Risks And Constraints

- avoid overcollecting sensitive data
- clearly explain why visa data is requested
- AI suggestions must be user-approved
- do not infer protected attributes for ranking
- profile data must be private by default

## Later Phase Decisions (Non-Blocking)

- Which onboarding fields are mandatory for MVP?
- Should candidates be allowed to skip visa details?
- How much AI guidance should appear during onboarding versus after?

## Implementation Roadmap

### Phase 1

Build candidate onboarding steps and profile completion scoring.

### Phase 2

Add AI skill extraction, achievement prompts, and profile gap detection.

### Phase 3

Add adaptive onboarding that changes questions based on user goals and visa context.
