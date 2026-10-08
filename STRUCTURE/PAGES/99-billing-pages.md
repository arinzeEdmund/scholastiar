# Billing Pages

Status: Unified Platform Service

Source service spec: `SERVICES/103-billing-subscriptions.md`

## Page System Vision

Billing pages should support candidate premium plans, employer hiring plans, AI usage limits, invoices, and subscription management.

## Public Pages

### Pricing Page

Route: `/pricing`

Purpose: Public pricing page for candidates and employers.

Sections:

- candidate plans
- detailed feature comparison (from `plan_comparison_rows`): grouped by Find and organise, AI preparation, Applying and tracking, Signia and documents, Support; each row has a one-line description and a real value per plan ("Standard monthly credits" vs "Higher limits"); sticky plan headers with prices and "Choose" actions; Pro column highlighted; "All features / Only differences" switch; on mobile a plan switcher with a readable list and "Pro only" markers
- employer plans
- FAQ

## Candidate Pages

### Candidate Subscription Page

Route: `/billing`

Purpose: Manage candidate plan, usage, and billing history.

Sections:

- current plan
- AI CV generations
- application answer usage
- PersonalityAI CV features
- invoices
- upgrade/downgrade

### Candidate Checkout Page

Route: `/billing/checkout`

Purpose: Complete plan purchase or upgrade.

Payment methods (every checkout on the platform, decided 2026-10-02): **Card** (Stripe), **Local payment** (Paystack, Flutterwave) and **Crypto** (Cryptomus first): choose asset and network, price locked for 15 minutes, wallet address and QR code, live status (awaiting payment → confirming → paid), re-quote when expired. See `SERVICES/103-billing-subscriptions.md`.

## Employer Pages

### Employer Subscription Page

Route: `/employers/billing`

Purpose: Manage employer plan, invoices, and job posting limits.

Sections:

- current plan
- active job limits
- applicant review limits
- team seats
- invoices

### Employer Checkout Page

Route: `/employers/billing/checkout`

Purpose: Complete employer plan purchase or upgrade.

## Admin Pages

### Admin Subscriptions Page

Route: `/admin/subscriptions`

Purpose: Revenue overview, active subscriptions, churn, and billing support.

## Suggested MVP Page Set

- `/pricing`
- `/billing`
- `/billing/checkout`
- `/employers/billing`
- `/employers/billing/checkout`
- `/admin/subscriptions`

## Page Priority

### MVP Priority

- Pricing Page
- Candidate Subscription Page
- Candidate Checkout Page
- Employer Subscription Page
- Employer Checkout Page

### Phase 2 Priority

- Admin Subscriptions Page
- Usage Limits Page
- Invoice Detail Page
