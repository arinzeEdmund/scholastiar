# Candidate Profile Pages

Status: Unified Platform Service

Source service spec: `SERVICES/92-candidate-profile.md`

## Page System Vision

Candidate profile pages support the one-profile-forever principle.

The profile should become the source of truth for AI CVs, application answers, job matching, PersonalityAI CV, and employer candidate review.

## Candidate Pages

### Candidate Profile Overview Page

Route: `/profile`

Purpose: Show the complete employment profile and profile strength.

Key sections:

- profile completion
- personal summary
- work experience
- education
- skills
- visa/mobility profile
- documents
- PersonalityAI CV status
- AI improvement suggestions

Primary actions:

- edit section
- generate CV
- update preferences
- upload document

### Profile Edit Page

Route: `/profile/edit`

Purpose: Dedicated editing interface for candidate profile sections.

Editable sections:

- personal information
- visa/mobility
- education
- work experience
- skills
- preferences
- links/portfolio
- documents

### Experience Detail Editor

Route: `/profile/experience/[experienceId]`

Purpose: Edit one work experience with AI achievement prompts.

Primary actions:

- rewrite achievement
- add metrics
- save experience

### Skills And Certifications Page

Route: `/profile/skills`

Purpose: Manage skills, proficiency, tools, certifications, and endorsements later.

### Visa And Mobility Profile Page

Route: `/profile/visa`

Purpose: Manage sponsorship needs, relocation preferences, and work authorization.

### Job Preferences Page

Route: `/profile/preferences`

Purpose: Manage desired roles, industries, salary, countries, and work mode.

### Document Vault Page

Route: `/profile/documents`

Purpose: Store CVs, transcripts, certificates, IDs, work samples, and application documents.

Primary actions:

- upload document
- tag document
- attach to applications
- delete/revoke access

## Employer Pages

### Candidate Public Employer View

Route: `/employers/candidates/[candidateId]`

Purpose: Employer-facing view of a candidate profile.

Key sections:

- AI profile summary
- CV
- PersonalityAI CV preview
- skills
- experience
- education
- visa/sponsorship indicators
- compatibility report
- application answers

Primary actions:

- shortlist
- message
- move pipeline stage
- view CV

## Admin Pages

### Admin Candidate Profile Review Page

Route: `/admin/users/[userId]/profile`

Purpose: Support/admin view for profile troubleshooting and moderation.

## Suggested MVP Page Set

- `/profile`
- `/profile/edit`
- `/profile/experience/[experienceId]`
- `/profile/skills`
- `/profile/visa`
- `/profile/preferences`
- `/profile/documents`
- `/employers/candidates/[candidateId]`
- `/admin/users/[userId]/profile`

## Page Priority

### MVP Priority

- Candidate Profile Overview Page
- Profile Edit Page
- Visa And Mobility Profile Page
- Job Preferences Page
- Document Vault Page
- Candidate Public Employer View

### Phase 2 Priority

- Experience Detail Editor
- Skills And Certifications Page
- Admin Candidate Profile Review Page
