# PersonalityAI CV Pages

Status: Unified Platform Service

Source service spec: `SERVICES/96-personality-ai-cv.md`

## Page System Vision

PersonalityAI CV pages should add a human trust layer to traditional applications.

The feature should support direct video uploads, guided prompts, profile previews, and employer review.

It should also act as the entry point into Signia, where candidates expand their PersonalityAI CV into a broader proof-of-work and portfolio profile.

## Candidate Pages

### PersonalityAI CV Home Page

Route: `/personality-cv`

Purpose: View, create, update, or regenerate the user's PersonalityAI CV.

Key sections:

- current video/avatar status
- profile completeness
- employer view count
- guided prompt options
- Signia profile prompt and completion status
- privacy controls

Primary actions:

- record
- upload video
- generate avatar alternative later
- preview employer view
- continue to Signia

### Recording Studio Page

Route: `/personality-cv/record`

Purpose: Guided recording experience.

Features:

- prompt cards
- camera/mic check
- recording controls
- retake
- upload

### PersonalityAI CV Preview Page

Route: `/personality-cv/preview`

Purpose: Candidate preview of how employers see the profile.

### PersonalityAI CV Settings Page

Route: `/personality-cv/settings`

Purpose: Manage visibility, consent, and attachment preferences.

## Employer Pages

### Employer PersonalityAI CV Viewer

Route: `/employers/candidates/[candidateId]/personality-cv`

Purpose: Employer playback and review of candidate video/personality layer.

Primary actions:

- watch
- save note
- shortlist
- message candidate

## Admin Pages

### Admin PersonalityAI CV Moderation Page

Route: `/admin/personality-cv`

Purpose: Review flagged videos, storage issues, and moderation problems.

## Suggested MVP Page Set

- `/personality-cv`
- `/personality-cv/record`
- `/personality-cv/preview`
- `/personality-cv/settings`
- `/employers/candidates/[candidateId]/personality-cv`
- `/admin/personality-cv`

## Page Priority

### MVP Priority

- PersonalityAI CV Home Page
- Recording Studio Page
- PersonalityAI CV Preview Page
- Employer PersonalityAI CV Viewer

### Phase 2 Priority

- PersonalityAI CV Settings Page
- Admin PersonalityAI CV Moderation Page
