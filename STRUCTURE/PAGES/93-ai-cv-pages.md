# AI CV Pages

Status: Unified Platform Service

Source service spec: `SERVICES/93-ai-cv-generation.md`

## Page System Vision

AI CV pages should make CV creation feel like intelligent profile restructuring, not template filling.

The system should help users generate role-specific CVs, adapt to regional formats, edit safely, and reuse CV versions across applications.

## Candidate Pages

### AI CV Home Page

Route: `/ai-cv`

Purpose: Main CV generation workspace.

Key sections:

- generate from job
- paste job description
- choose CV region/style
- recent CVs
- profile gaps
- AI recommendations

Primary actions:

- generate CV
- upload/import CV
- view history

### Job-Specific CV Generator Page

Route: `/ai-cv/generate`

Purpose: Generate a tailored CV from a selected job or pasted job description.

Inputs:

- target job
- job description
- region format
- tone/style
- sections to include
- target strengths

### CV Preview Page

Route: `/ai-cv/[cvId]`

Purpose: Full formatted preview of generated CV.

Primary actions:

- download PDF
- edit
- duplicate
- attach to application
- regenerate section

### CV Editor Page

Route: `/ai-cv/[cvId]/edit`

Purpose: Manual editor with AI suggestion sidebar.

Features:

- section editor
- AI rewrite suggestions
- ATS checks
- regional formatting controls
- factual accuracy warnings

### CV History Page

Route: `/ai-cv/history`

Purpose: Archive of generated CV versions.

Views:

- by job
- by date
- by region
- by application

### Regional CV Settings Page

Route: `/ai-cv/settings/formats`

Purpose: Manage CV format preferences.

Formats:

- UK CV
- EU CV
- US resume
- African regional norms
- visa-conscious employment CV

## Employer Pages

### Submitted CV Viewer

Route: `/employers/applications/[applicationId]/cv`

Purpose: Employer view of a submitted CV with AI candidate summary.

## Admin Pages

### Admin AI CV Generations Page

Route: `/admin/ai-generations/cvs`

Purpose: Monitor AI CV usage, failures, abuse, and generation quality.

## Suggested MVP Page Set

- `/ai-cv`
- `/ai-cv/generate`
- `/ai-cv/[cvId]`
- `/ai-cv/[cvId]/edit`
- `/ai-cv/history`
- `/ai-cv/settings/formats`
- `/employers/applications/[applicationId]/cv`
- `/admin/ai-generations/cvs`

## Page Priority

### MVP Priority

- AI CV Home Page
- Job-Specific CV Generator Page
- CV Preview Page
- CV Editor Page
- CV History Page

### Phase 2 Priority

- Regional CV Settings Page
- Submitted CV Viewer
- Admin AI CV Generations Page
