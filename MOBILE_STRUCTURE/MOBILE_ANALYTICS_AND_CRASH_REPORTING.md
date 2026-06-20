# Mobile Analytics And Crash Reporting

Status: Mobile analytics, crash, and product telemetry plan

## Purpose

Mobile analytics should help improve activation, retention, opportunity matching, application behavior, and paid conversion without violating user trust.

## Recommended Tools

Use one product analytics tool:

- PostHog
- Amplitude
- Mixpanel

Use one crash/error tool:

- Sentry
- Expo error reporting where useful

Use store analytics:

- App Store Connect
- Google Play Console

## Core Events

Track:

- app_opened
- signup_started
- signup_completed
- onboarding_started
- onboarding_completed
- destination_country_selected
- opportunity_search_performed
- opportunity_card_viewed
- opportunity_detail_viewed
- opportunity_saved
- opportunity_unsaved
- readiness_score_viewed
- success_score_viewed
- application_tracker_item_created
- document_uploaded
- ai_agent_board_add_started
- ai_agent_board_add_completed
- apply_for_me_add_started
- apply_for_me_add_completed
- notification_permission_requested
- notification_permission_granted
- alert_opened
- plan_gate_viewed
- checkout_started
- article_viewed

## Privacy Rules

Do not send:

- raw CV/document content
- private profile details
- full application answers
- exact readiness score tied to sponsor analytics
- payment secrets

Use IDs and aggregate analytics where possible.

## Funnel Metrics

Monitor:

- install to signup
- signup to onboarding completion
- onboarding to first save
- first save to readiness view
- readiness view to paid plan gate
- saved opportunity to application tracker
- notification open to action
- AI Apply Agent add rate
- Apply For Me add rate
- mobile churn

## Crash Readiness

Before public beta:

- crash reporting is enabled
- release version is tagged
- source maps are uploaded where supported
- fatal crashes are monitored
- top crashes have owners

