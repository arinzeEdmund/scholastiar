# AI-Assisted Applications

Status: Unified Platform Service

## Feature Vision

AI-Assisted Applications helps candidates answer job applications with less repetition and more strategy.

It should generate truthful, role-specific answers for cover letters, screening questions, visa questions, competency questions, and salary prompts using the candidate profile.

Core promise:

> The platform helps the user answer like a prepared professional, not like a generic AI.

## Problem Being Solved

Job applications are exhausting because candidates repeatedly answer:

- why this role
- why this company
- tell us about yourself
- competency questions
- visa/work authorization questions
- salary expectations
- relocation questions
- cover letter prompts

Most users either rush, sound generic, or abandon applications.

## Target Users

- candidates
- international applicants
- users applying to many jobs
- employers receiving structured applications

## Core Workflows

### Screening Answer Generation

Generate answers based on the user's profile, job description, employer context, and question type.

### Cover Letter Generation

Generate role-specific cover letters with human tone and factual grounding.

### Visa Question Support

Help candidates answer right-to-work questions (study visa hours, post-study permit, sponsorship needed) clearly and consistently, from what they recorded.

### Competency Answer Builder

Use STAR-style structure for behavioral questions.

### Final Review

Before submission, check for missing answers, weak responses, unsupported claims, and inconsistency.

## AI Opportunities

- question classification
- STAR answer construction
- company/role relevance alignment
- salary expectation framing
- visa answer consistency
- tone adaptation
- answer quality review
- generic phrase detection

## Truthfulness Rules

AI must not invent:

- experience
- visa status
- salary history
- achievements
- qualifications
- employer-specific facts

AI can improve structure, clarity, and relevance.

## Data Model Notes

Core entities:

- application_questions
- application_answers
- generated_application_answers
- cover_letters
- answer_generation_sources
- application_review_results
- ai_generation_logs

## UX Direction

The flow should feel like a reviewable application package.

Important UX:

- generated answer beside question
- edit/regenerate controls
- source facts used
- confidence indicators
- final review checklist
- attach PersonalityAI CV toggle

## Integrations

- candidate profile
- jobs
- AI CV generation
- application tracking
- PersonalityAI CV
- DeepSeek AI

## Risks And Constraints

- avoid fake or exaggerated answers
- user must approve final answers
- sensitive visa answers need consistency
- salary guidance should not be misleading

## Later Phase Decisions (Non-Blocking)

- Which question types are MVP?
- Should cover letters be free or premium?
- Should low-confidence answers require manual review?

## Implementation Roadmap

### Phase 1

Build screening answer, cover letter, visa answer, and review flow.

### Phase 2

Add STAR assistant, answer versioning, and answer quality scoring.

### Phase 3

Add outcome-based learning and answer performance insights.
