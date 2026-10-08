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

Purpose: Register students and applicants, take their plan choice and payment, and route them into candidate onboarding.

There is no free applicant plan (decided 2026-10-01). Every candidate chooses Starter ($35/month) or Pro ($79/month) during sign-up.

Flow:

1. account details
2. choose plan (Starter or Pro), with a clear comparison
3. checkout at `/billing/checkout`
4. verify email
5. continue to onboarding

Inputs:

- name
- email
- password
- country/current location
- WhatsApp number (optional) with opt-in to official Scholastiar WhatsApp messages
- plan choice
- terms acceptance

Primary actions:

- create candidate account
- choose plan
- pay and start subscription
- verify email
- continue to onboarding

States:

- payment failed: keep the account and plan choice, explain what happened, offer retry or another payment method
- account created but unpaid: signing in returns the user to plan choice/checkout, not to the app

### Employer Sign Up Page

Route: `/auth/sign-up/employer`

Purpose: Register employer users, create their company and take payment for an employer plan.

Steps:

1. Your account — full name, job title, work email, password.
2. Your company — company name, website, country where you hire, who you are hiring (students, graduates with visa sponsorship, or both).
3. Your plan — Employer Starter ($99/month) or Employer Pro ($249/month), terms acceptance. Enterprise is sales-led (`/contact?topic=employer_sales`).

Rules:

- Employers hiring graduates with sponsorship must choose Employer Pro; Starter is disabled in the wizard and rejected at checkout and on the server.
- `?plan=` from the pricing page preselects the plan.
- Creates the account, employer profile, `employer_owner` role, company and owner membership, then goes to checkout.

### Provider Sign Up Page

Route: `/auth/sign-up/provider`

Purpose: Register universities, funders and programme organisers and take payment for a provider plan.

Steps:

1. Your account — full name, job title, work email, password.
2. Your organisation — name, type, website, country.
3. Your plan — Provider Verified ($149/month) or Provider Pro ($399/month), terms acceptance. Enterprise is sales-led.

### Generic Role Selection Page

Route: `/auth/choose-role`

Purpose: Entry point for "Get started". Three cards — candidate (from $35/month), employer (from $99/month), provider (from $149/month) — each leading to its sign-up flow.

### Checkout Page

Route: `/billing/checkout`

Purpose: Pay for the plan chosen at sign-up. Every paid account type is sent here until its plan is active.

- Distraction-free layout: logo, "Secure checkout", theme toggle; no site navigation.
- Step indicator continues the sign-up steps (Payment, then Verify email).
- Order summary: plan, price, features, due today, and switching between self-serve plans the account may hold.
- Card tab (Stripe in Phase B) or Local payment tab (Paystack or Flutterwave).
- Declined and insufficient-funds cards show an error and keep the user on checkout.
- Mock mode shows test cards (4242… succeeds, 4000 0000 0000 0002 declined, 4000 0000 0000 9995 insufficient funds).
- If the plan is already active: "Your plan is active" with a continue button.

### Forgot Password Page

Route: `/auth/forgot-password`

Purpose: Request a password reset email.

- The same success message is shown whether or not the account exists, so accounts can't be discovered.
- Primary actions: send reset link, use a different email, return to sign in.

### Reset Password Page

Route: `/auth/reset-password?token=`

Purpose: Set a new password from an email token.

- An invalid, used or expired token (links last 1 hour and work once) shows "This link has expired" with a request-new-link button.
- A valid token shows a new password with a strength meter and a confirmation field. Resetting also confirms the email address.
- Success: "Your password has been changed" and sign in.

### Verify Email Page

Route: `/auth/verify-email`

Purpose: Confirm the email address after payment, then continue to onboarding.

- Requires a session (signed-out visitors go to sign-in, except the "Email verified" result).
- Unverified: "Check your inbox", resend with a 60-second cooldown, and "Sign out and start again" for a wrong address.
- `?status=invalid`: expired or used link warning.
- Verified: "You're all set" with continue to onboarding or the workspace.
- The emailed link goes to `/auth/verify-email/confirm?token=` (route handler), which confirms the address and redirects back here.

### Dev Inbox (mock mode only)

No real email is sent in Phase A. Forgot-password and verify-email show a "Dev inbox" box with the link the email would contain. It is never rendered outside mock mode. Phase B replaces it with transactional email.

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
