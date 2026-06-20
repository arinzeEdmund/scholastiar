# Notifications Pages

Status: Unified Platform Service

Source service spec: `SERVICES/100-notifications.md`

## Page System Vision

Notifications should keep users aware of application movement, deadlines, messages, interviews, profile gaps, and AI recommendations without overwhelming them.

## Candidate Pages

### Notifications Center Page

Route: `/notifications`

Purpose: Unified notification inbox.

Notification types:

- employer viewed application
- status changed
- interview invitation
- new message
- job match
- saved job closing soon
- CV/profile suggestion
- subscription/billing notice

Primary actions:

- open item
- mark read
- filter by type

### Notification Preferences Page

Route: `/settings/notifications`

Purpose: Manage email, in-app, and later push notification preferences.

## Employer Pages

### Employer Notifications Page

Route: `/employers/notifications`

Purpose: Employer notification center.

Notification types:

- new applicant
- candidate reply
- interview response
- job expiring
- pipeline reminder
- billing notice

### Employer Notification Preferences Page

Route: `/employers/settings/notifications`

Purpose: Manage employer notification preferences.

## Admin Pages

### Admin Notification Logs Page

Route: `/admin/notifications`

Purpose: Monitor notification delivery and failures.

## Suggested MVP Page Set

- `/notifications`
- `/settings/notifications`
- `/employers/notifications`
- `/employers/settings/notifications`
- `/admin/notifications`

## Page Priority

### MVP Priority

- Notifications Center Page
- Notification Preferences Page
- Employer Notifications Page
- Employer Notification Preferences Page

### Phase 2 Priority

- Admin Notification Logs Page
- Notification Template Management Page
