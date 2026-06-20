# PersonalityAI CV

Status: Unified Platform Service

## Feature Vision

PersonalityAI CV is the human trust layer on top of traditional applications.

It lets candidates express communication style, motivation, confidence, and cultural fit through guided video or future avatar-assisted alternatives.

Core promise:

> Employers should see more than a document, and candidates should have a professional way to be understood.

PersonalityAI CV should connect directly into Signia, where the candidate can expand from a guided professional video into a full proof-of-work profile with projects, media, documents, social links, and portfolio pages.

## Problem Being Solved

Traditional CVs do not show:

- communication style
- confidence
- motivation
- personality
- cultural fit
- language comfort
- presence

International applicants often struggle to build trust before interviews.

## Target Users

- candidates
- international applicants
- employers
- recruiters

## Core Workflows

### Guided Prompt Selection

Candidates choose prompts that help present themselves professionally.

Example prompts:

- introduce yourself
- explain your career goal
- describe your strongest project
- why are you seeking international opportunities?

### Video Recording Or Upload

Candidates record or upload a short video.

### Preview And Consent

Candidates preview employer view and control visibility.

### Application Attachment

Candidates choose whether to attach PersonalityAI CV to applications.

### Employer Review

Employers view the video inside candidate profiles and applications.

### Signia Expansion

Candidates can use the PersonalityAI CV as the human introduction inside Signia, then attach project videos, research documents, social links, and proof items around it.

## AI Opportunities

- prompt generation
- transcript generation
- video summary
- communication coaching
- avatar-generated alternatives later
- employer-facing personality summary
- Signia profile summary and proof-of-work highlights

## Data Model Notes

Core entities:

- personality_cv_profiles
- personality_cv_videos
- personality_cv_prompts
- personality_cv_transcripts
- personality_cv_visibility_settings
- personality_cv_views

## UX Direction

The experience should feel professional, not gimmicky.

Important UX:

- guided prompts
- camera/mic check
- retake controls
- privacy settings
- employer preview
- clear consent

## Integrations

- Supabase Storage
- Stream/GetStream
- candidate profile
- applications
- employer candidate review
- Signia
- messaging later

## Risks And Constraints

- video privacy is sensitive
- candidates need visibility control
- employers must not misuse video for discriminatory screening
- moderation/reporting may be needed
- storage costs must be managed

## Later Phase Decisions (Non-Blocking)

- What video length should be MVP?
- Should PersonalityAI CV be optional or encouraged?
- Should employers see transcripts?

## Implementation Roadmap

### Phase 1

Build upload/record, preview, storage, and employer playback.

### Phase 2

Add transcripts, prompts, view analytics, and privacy controls.

### Phase 3

Add avatar/voice alternatives and deeper application integration.
