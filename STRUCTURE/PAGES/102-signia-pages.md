# Signia Pages

Status: Unified Platform Service

Source service spec: `SERVICES/107-signia.md`

## Page System Vision

Signia pages should let candidates build a rich, media-backed professional identity and let employers search proof-of-work signals without leaving Scholastiar.ai.

The candidate side should feel like a professional portfolio studio. The employer side should feel like a focused talent intelligence workspace.

## Candidate Pages

### Signia Home Page

Route: `/signia`

Purpose: Manage the user's Signia profile, completion, visibility, projects, media, documents, social links, and portfolio status.

Key sections:

- Signia completeness score
- public/employer visibility status
- featured projects
- videos and documents
- social link hub
- skills with attached proof
- current work section
- recent employer views when allowed

Primary actions:

- add project
- add social link
- upload proof
- edit portfolio page
- preview public page
- manage visibility

### Signia Builder Page

Route: `/signia/builder`

Purpose: Modular editor for portfolio sections.

Features:

- add/reorder sections
- edit overview, projects, current work, research, documents, and media
- attach proof to skills
- publish/unpublish sections
- preview candidate, public, and employer views

### Signia Project Detail Page

Route: `/signia/projects/[projectId]`

Purpose: Create or edit a project showcase.

Features:

- title and summary
- role and contribution
- problem, approach, result
- tools and skills
- links
- video/document attachments
- project status
- visibility

### Signia Media Library Page

Route: `/signia/media`

Purpose: Manage videos, documents, decks, screenshots, work samples, and research proof used in Signia — all added by link (decided 2026-10-08). Video links from YouTube, Loom, Tella, Vimeo or Google Drive play in the page; other links open where they're hosted.

### Signia Social Links Page

Route: `/signia/social-links`

Purpose: Manage professional links and social handles in one place.

### Signia Public Preview Page

Route: `/signia/preview`

Purpose: Candidate preview of the published Signia profile.

### Public Signia Profile Page

Route: `/s/[handle]`

Purpose: Public shareable portfolio page for candidate-approved Signia sections.

## Employer Pages

### Employer Signia Search Page

Route: `/employers/signia`

Purpose: Employer deep search across candidate Signia profiles the employer is allowed to discover or review.

Key sections:

- natural language search
- filters for skills, projects, industries, media, documents, GitHub, research, location, visa indicators, and availability
- saved searches
- candidate result cards
- evidence highlights
- shortlist actions

### Employer Signia Candidate View

Route: `/employers/candidates/[candidateId]/signia`

Purpose: Full employer review of a candidate's Signia profile.

Primary actions:

- view proof items
- open project
- watch videos
- read document summaries
- inspect social/professional links
- save note
- shortlist
- message candidate

### Employer Signia Compare Page

Route: `/employers/signia/compare`

Purpose: Compare shortlisted Signia profiles by role fit, evidence depth, skill proof, communication signals, and study status and work eligibility.

## Admin Pages

### Admin Signia Moderation Page

Route: `/admin/signia`

Purpose: Review flagged Signia content, public profile abuse, unsafe links, media violations, and employer misuse reports.

## Suggested MVP Page Set

- `/signia`
- `/signia/builder`
- `/signia/projects/[projectId]`
- `/signia/media`
- `/signia/social-links`
- `/signia/preview`
- `/s/[handle]`
- `/employers/signia`
- `/employers/candidates/[candidateId]/signia`
- `/admin/signia`

## Page Priority

### MVP Priority

- Signia Home Page
- Signia Builder Page
- Signia Project Detail Page
- Signia Social Links Page
- Signia Public Preview Page
- Public Signia Profile Page
- Employer Signia Candidate View

### Phase 2 Priority

- Signia Media Library Page
- Employer Signia Search Page
- Admin Signia Moderation Page

### Phase 3 Priority

- Employer Signia Compare Page
