# AI CV Generation

Status: Unified Platform Service

## Feature Vision

AI CV Generation is the intelligent CV restructuring engine of Scholastiar.ai.

It should analyze a job description, understand the candidate profile, and generate a truthful, tailored CV for that exact role and region.

Core promise:

> This CV was written specifically for this role, without inventing anything.

## Problem Being Solved

Candidates struggle with:

- generic CVs
- poor regional formatting
- weak achievement language
- missing role alignment
- repetitive rewriting
- uncertainty about what to emphasize

International applicants also need regional CV norms and visa-conscious positioning.

## Target Users

- candidates
- international applicants
- job seekers applying across regions
- employers indirectly through better applications

## Core Workflows

### Generate From Job

Candidate selects a job, and the system generates a tailored CV.

### Generate From Pasted Description

Candidate pastes any job description to create a tailored CV.

### Regional Format Selection

Supported formats:

- UK CV
- EU CV
- US resume
- African regional norms
- visa-conscious employment CV

### CV Preview And Edit

Candidate previews, edits, regenerates sections, and downloads.

### CV Version History

Every generated CV is stored with its target job, date, format, and application link.

## AI Opportunities

- job description analysis
- role priority extraction
- achievement rewriting
- summary generation
- skills reordering
- regional format adaptation
- ATS keyword alignment
- weakness detection
- CV-to-job fit explanation

## Truthfulness Rules

AI must not invent:

- jobs
- degrees
- skills
- certifications
- achievements
- dates
- employers
- visa status

AI may improve wording, structure, prioritization, and relevance.

## Data Model Notes

Core entities:

- cv_versions
- cv_sections
- cv_generation_requests
- cv_generation_outputs
- cv_target_jobs
- cv_formats
- cv_exports
- ai_generation_logs

## UX Direction

CV generation should feel premium and controlled.

Important UX:

- before/after preview
- editable sections
- factual warnings
- clear download/export
- attach-to-application action
- AI suggestions sidebar

## Integrations

- candidate profile
- jobs
- AI-assisted applications
- application tracking
- document storage
- DeepSeek AI
- Vercel AI SDK

## Risks And Constraints

- AI hallucination must be prevented
- users must approve final CV
- CVs should be versioned
- exported files should be stored securely
- region-specific advice should not become legal advice

## Later Phase Decisions (Non-Blocking)

- Which CV formats launch first?
- Should CV downloads require premium plan?
- Should generated CVs be editable block-by-block?

## Implementation Roadmap

### Phase 1

Build job-specific CV generation, preview, edit, export, and history.

### Phase 2

Add regional formats, ATS checks, and AI section regeneration.

### Phase 3

Add CV performance analytics based on application outcomes.
