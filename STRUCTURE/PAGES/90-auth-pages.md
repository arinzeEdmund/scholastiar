# Auth Pages

Status: Unified Platform Service

Source service spec: `SERVICES/90-auth.md`

## Page System Vision

Auth pages should get candidates and employers into the right workspace quickly, securely, and with minimal confusion.

The system should support:

> Sign up -> verify identity/email -> choose role -> complete the correct onboarding flow -> enter the right dashboard.

## Public Pages

### Sign In Page

Route: `/auth/sign-in`

Purpose: Unified login for candidates, employers, and admins with role-aware routing.

Key sections:

- email/password login
- social login later if supported
- forgot password link
- role detection after login
- security/error messaging

Primary actions:

- sign in
- reset password
- go to signup

### Candidate Sign Up Page

Route: `/auth/sign-up/candidate`

Purpose: Register job seekers and route them into candidate onboarding.

Inputs:

- name
- email
- password
- country/current location
- terms acceptance

Primary actions:

- create candidate account
- verify email
- continue to onboarding

### Employer Sign Up Page

Route: `/auth/sign-up/employer`

Purpose: Register employer users and route them into employer onboarding.

Inputs:

- work email
- password
- company name
- company website
- hiring role/title
- terms acceptance

Primary actions:

- create employer account
- verify email
- continue to employer onboarding

### Generic Role Selection Page

Route: `/auth/choose-role`

Purpose: Handle users who enter through a generic signup path.

Primary actions:

- continue as candidate
- continue as employer

### Forgot Password Page

Route: `/auth/forgot-password`

Purpose: Request password reset email.

Primary actions:

- send reset link
- return to sign in

### Reset Password Page

Route: `/auth/reset-password`

Purpose: Set a new password from an email token.

Primary actions:

- update password
- return to sign in

### Verify Email Page

Route: `/auth/verify-email`

Purpose: Confirm email verification status and continue onboarding.

Primary actions:

- resend verification email
- continue after verified

## Admin Pages

### Admin Sign In Page

Route: `/admin/sign-in`

Purpose: Restricted admin login with stricter access controls.

Primary actions:

- sign in
- use MFA later
- recover admin access through secure process

## Suggested MVP Page Set

- `/auth/sign-in`
- `/auth/sign-up/candidate`
- `/auth/sign-up/employer`
- `/auth/choose-role`
- `/auth/forgot-password`
- `/auth/reset-password`
- `/auth/verify-email`
- `/admin/sign-in`

## Page Priority

### MVP Priority

- Sign In Page
- Candidate Sign Up Page
- Employer Sign Up Page
- Generic Role Selection Page
- Forgot Password Page
- Reset Password Page
- Verify Email Page

### Phase 2 Priority

- Admin Sign In Page
- MFA Setup Page
- Session Management Page
