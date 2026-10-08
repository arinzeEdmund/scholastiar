# Billing And Subscriptions

Status: Unified Platform Service

Source pricing reference: `STRUCTURE/BUILD_GUIDE/PRICING.md`

## Feature Vision

Billing And Subscriptions supports monetization for candidates and employers.

It should manage plan access, AI usage limits, job posting limits, invoices, and upgrades.

Core promise:

> Users understand what they are paying for and can upgrade when value is clear.

## Problem Being Solved

The platform needs to monetize:

- AI CV generation
- AI application answers
- AI Apply Agent board access
- Apply For Me board access
- premium application insights
- PersonalityAI CV features
- employer job posting
- employer applicant review
- employer analytics
- team seats

## Target Users

- candidates
- employers
- admins
- billing support

## Core Workflows

### Candidate Plans

Candidate plans may include:

- free job browsing
- limited AI CVs
- limited application answers
- ability to add opportunities to AI Apply Agent board
- ability to add opportunities to Apply For Me board
- board item limits by plan
- premium CV generation
- application insights
- PersonalityAI CV enhancements

### Employer Plans

Employer plans may include:

- job posting limits
- applicant review limits
- AI candidate ranking
- team seats
- analytics
- featured job options later

### Checkout And Upgrade

Users can subscribe, upgrade, downgrade, or cancel.

Payment providers:

- Stripe: primary global payment provider
- Paystack: first fallback and African/local payment rail where supported
- Flutterwave: second fallback and additional Africa/global payment rail
- **Cryptomus: crypto payments (decided 2026-10-02)** — more crypto providers can be added

Checkout must use a provider abstraction so failed or unavailable providers can fall back to the next eligible provider before payment authorization.

### Crypto At Every Checkout (decided 2026-10-02)

Every checkout on the platform offers three methods: **Card**, **Local payment** and **Crypto** — candidate and organisation plans, Year Check-in, accommodation, pilot services, Apply For Me missions, office services, AI Apply Agent add-ons and sponsored placements.

Crypto flow:

1. the student chooses an asset and network (stablecoins USDT/USDC first; others optional per `payment_provider_configs`)
2. the provider (Cryptomus) creates an invoice; the price in crypto is **locked for 15 minutes**
3. the screen shows the amount, wallet address and QR code, and updates live: awaiting payment → confirming → paid
4. underpaid or expired invoices can be topped up or re-quoted
5. receipts by email + WhatsApp + in-app; refunds go back in crypto

Provider-agnostic: crypto providers are configured in `payment_provider_configs` (method, regions, assets, priority); checkout reads the enabled providers, so adding a provider needs a new adapter only. Records: `payment_attempts` (method `crypto`) and `crypto_payments`.

### Paying Third Parties (Relocation, decided 2026-10-02)

For accommodation and freelance pilot services the customer always pays Scholastiar, which holds the funds until the service is delivered. Settlement staff in the destination country then pay the provider in local currency through local banks (Russia first) using **payout tasks** with proof of payment, two-person approval above a threshold and reconciliation. See `12-relocation.md` → Payments and Settlement.

### Usage Tracking

Track AI generations, job posts, team seats, and premium features.

Track board usage separately:

- AI Apply Agent board items added
- Apply For Me board items added
- active board item limits
- monthly agent execution credits
- human-forwarder support credits or campaign limits

### Admin Billing Oversight

Admins can review subscriptions, invoices, churn, and payment issues.

## AI Opportunities

AI should not handle billing decisions, but it can:

- explain plan differences
- recommend upgrade based on usage
- summarize billing support cases

## Data Model Notes

Core entities:

- plans
- subscriptions
- invoices
- payment_customers
- payment_provider_customers
- payment_attempts
- payment_webhook_events
- usage_limits
- usage_events
- billing_events
- employer_seats
- subscription_feature_entitlements
- opportunity_board_usage

## UX Direction

Billing should be transparent and trust-building.

Important UX:

- clear plan comparison
- usage visibility
- no hidden limits
- invoice history
- easy cancellation path

## Integrations

- Stripe
- Paystack
- Flutterwave
- Supabase Auth
- usage metering
- AI generation systems
- employer job limits

## Risks And Constraints

- billing state must be reliable
- webhook events must be idempotent
- avoid locking users out unfairly
- invoice/payment data must be protected
- provider fallback must not double-charge users
- webhook events from all payment providers must normalize into shared billing events

## First Launch Decisions

- Payments use Stripe, Paystack, and Flutterwave.
- Stripe is primary; Paystack and Flutterwave are fallbacks/alternate rails.
- Employer billing starts with plan/subscription modeling and can later add per-seat or per-job pricing.
- Premium features include AI Apply Agent board access, Apply For Me board access, higher AI generation limits, application insights, and employer applicant ranking/analytics.

## Implementation Roadmap

### Phase 1

Build pricing, subscription state, checkout, and usage limits.

### Phase 2

Add employer billing, invoices, and admin billing overview.

### Phase 3

Add advanced usage-based credits and upgrade recommendations.
