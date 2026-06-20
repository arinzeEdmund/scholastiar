# Mobile App Store Policy

Status: App Store and Google Play policy planning

## Purpose

Mobile payments, subscriptions, user data, and AI workflows must be designed with app store review in mind.

This file is a planning guide, not legal advice.

## Subscription Rule

Digital subscriptions used inside the mobile app may require Apple In-App Purchase or Google Play Billing.

Prepare for:

- RevenueCat
- Apple in-app purchases
- Google Play Billing
- backend entitlement synchronization

Do not assume Stripe, Paystack, or Flutterwave can always sell in-app digital subscriptions inside the mobile app.

## Service Purchase Rule

Some service or human-assisted purchases may be allowed through external checkout depending on platform policy and product classification.

Examples that need review:

- Apply For Me campaign packs
- migration agency consultation booking
- document review service
- human support packages

Final payment routing should be reviewed before public release.

## External Checkout Handoff

If external checkout is used:

- create checkout session on backend
- open a secure browser or webview handoff where allowed
- return user to app after payment
- sync entitlement or purchase status from backend
- never expose payment secrets in mobile

## User Data And Privacy

Mobile app must disclose:

- what profile data is collected
- what document data is uploaded
- how AI uses user data
- when data is shared with employers/providers/agencies
- how users can delete or manage data

## AI Disclosure

AI features should be framed as assistance and preparation.

Avoid:

- guaranteed acceptance claims
- guaranteed visa claims
- guaranteed job claims
- unsupported success promises

## Sponsored Content

Sponsored mobile placements must follow:

```txt
STRUCTURE/BUILD_GUIDE/SPONSORED_ADS_MARKETPLACE.md
```

Sponsored labels must remain visible on mobile cards, digests, and article placements.

