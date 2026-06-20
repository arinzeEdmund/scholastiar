# Mobile Payments

Status: Mobile payment and subscription planning

## Payment Sources

Use pricing and entitlements from:

- `STRUCTURE/BUILD_GUIDE/PRICING.md`
- backend plan records

Do not hardcode final prices into the mobile app.

## Payment Providers

Main platform order:

```txt
Stripe
Paystack
Flutterwave
```

Mobile should request checkout sessions from the backend.

## App Store Consideration

For digital subscriptions, prepare for:

- RevenueCat
- Apple in-app purchases
- Google Play Billing

For services or campaign purchases, backend checkout links may be appropriate where policy allows.

Policy planning source:

```txt
MOBILE_STRUCTURE/MOBILE_APP_STORE_POLICY.md
```

## Mobile Paid States

Mobile must clearly show:

- current plan
- locked features
- usage limits
- credits
- campaign packs
- AI Apply Agent entitlement
- Apply For Me entitlement

Locked actions should explain what upgrade unlocks.
