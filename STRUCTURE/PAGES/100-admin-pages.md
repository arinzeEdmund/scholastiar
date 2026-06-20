# Admin Pages

Status: Unified Platform Service

Source service spec: `SERVICES/104-admin-operations.md`

## Page System Vision

Admin pages should give the Scholastiar team safe operational control over users, employers, jobs, applications, AI generations, content, reports, billing, and platform health.

## Admin Pages

### Admin Dashboard

Route: `/admin`

Purpose: Platform-wide operations overview.

Key sections:

- user growth
- employer growth
- active jobs
- applications submitted
- reports/issues
- AI generation failures
- revenue snapshot
- system alerts

### Admin Users Page

Route: `/admin/users`

Purpose: Manage candidates and employer users.

Primary actions:

- search users
- view profile
- suspend
- support account

### Admin Employers Page

Route: `/admin/employers`

Purpose: Manage employer accounts and verification.

### Admin Jobs Page

Route: `/admin/jobs`

Purpose: Moderate job listings.

### Admin Applications Page

Route: `/admin/applications`

Purpose: Monitor application activity and support issues.

### Admin Reports Page

Route: `/admin/reports`

Purpose: Review reported jobs, users, employers, messages, and content.

### Admin AI Generations Page

Route: `/admin/ai-generations`

Purpose: Monitor AI generation volume, failures, abuse, and quality.

### Admin PersonalityAI CV Page

Route: `/admin/personality-cv`

Purpose: Moderate video/profile issues.

### Admin Blog Page

Route: `/admin/blog`

Purpose: Manage blog and employment advice content.

### Admin Settings Page

Route: `/admin/settings`

Purpose: Platform configuration.

## Support Pages

### Admin Support User Detail Page

Route: `/admin/users/[userId]`

Purpose: Full support view of user account, profile, applications, messages, billing, and flags.

### Admin Employer Detail Page

Route: `/admin/employers/[employerId]`

Purpose: Full support view of employer account.

## Suggested MVP Page Set

- `/admin`
- `/admin/users`
- `/admin/users/[userId]`
- `/admin/employers`
- `/admin/employers/[employerId]`
- `/admin/jobs`
- `/admin/applications`
- `/admin/reports`
- `/admin/ai-generations`
- `/admin/personality-cv`
- `/admin/blog`
- `/admin/settings`

## Page Priority

### MVP Priority

- Admin Dashboard
- Admin Users Page
- Admin Employers Page
- Admin Jobs Page
- Admin Applications Page
- Admin Reports Page
- Admin Settings Page

### Phase 2 Priority

- Admin AI Generations Page
- Admin PersonalityAI CV Page
- Admin Blog Page
- Admin Support User Detail Page
- Admin Employer Detail Page
