# Environment

Status: Local and deployment configuration guide

## Required Environment Variables

Create `.env.local` from these placeholders when implementation starts. Do not commit real keys.

```txt
APP_URL=http://localhost:3000
NODE_ENV=development

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

AI_PROVIDER=deepseek
AI_PROVIDER_ORDER=deepseek,anthropic,openai
AI_FALLBACK_ENABLED=true
AI_FALLBACK_POLICY=server-side-failover
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_REASONING_MODEL=deepseek-v4-pro
AI_MODEL_POLICY=latest-production-provider-models

ANTHROPIC_API_KEY=
ANTHROPIC_BASE_URL=https://api.anthropic.com
ANTHROPIC_MODEL=claude-sonnet-4-20250514
ANTHROPIC_REASONING_MODEL=claude-opus-4-20250514
ANTHROPIC_VERSION=2023-06-01

OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-5.5
OPENAI_REASONING_MODEL=gpt-5.5

PAYMENT_PRIMARY_PROVIDER=stripe
PAYMENT_FALLBACK_PROVIDERS=paystack,flutterwave

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PUBLIC_KEY=

PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
PAYSTACK_WEBHOOK_SECRET=

FLUTTERWAVE_SECRET_KEY=
FLUTTERWAVE_PUBLIC_KEY=
FLUTTERWAVE_WEBHOOK_SECRET=

EMAIL_PROVIDER=
EMAIL_PROVIDER_API_KEY=
EMAIL_FROM=

ADMIN_MFA_REQUIRED=true
ADMIN_MFA_ENFORCEMENT=pre-public-beta
```

## AI Provider Policy

Use DeepSeek as the primary AI provider, with Anthropic Claude and OpenAI as fallback providers.

Provider order:

1. DeepSeek
2. Anthropic Claude
3. OpenAI

Fallback is allowed when:

- DeepSeek API is unavailable
- DeepSeek rate limits block a request
- DeepSeek access is restricted for a user, region, account, or use case
- DeepSeek policy/provider restrictions prevent a valid platform workflow
- internal provider health checks mark DeepSeek as temporarily degraded

Fallback must be server-side, auditable, and invisible to client secrets.

Default DeepSeek configuration:

- `DEEPSEEK_MODEL=deepseek-v4-flash` for general platform AI work
- `DEEPSEEK_REASONING_MODEL=deepseek-v4-pro` for high-stakes reasoning, scoring explanations, application review, and admin review assistance

Default Anthropic configuration:

- `ANTHROPIC_MODEL=claude-sonnet-4-20250514` for general fallback work
- `ANTHROPIC_REASONING_MODEL=claude-opus-4-20250514` for higher-stakes fallback reasoning

Default OpenAI configuration:

- `OPENAI_MODEL=gpt-5.5` for general fallback work through the OpenAI API
- `OPENAI_REASONING_MODEL=gpt-5.5` for higher-stakes fallback reasoning

Use OpenAI API models, not ChatGPT UI-only models, for implementation.

Model IDs must stay environment-driven so they can be upgraded without code rewrites.

Before public launch, verify currently available model IDs with:

- DeepSeek official `/models` endpoint or official model documentation
- Anthropic official Models API or model documentation
- OpenAI official model documentation

## Payment Provider Policy

Use three providers:

1. Stripe
2. Paystack
3. Flutterwave

Default routing:

- Stripe is the primary global provider.
- Paystack is the first fallback, especially for African cards, bank transfers, and local payment methods where supported.
- Flutterwave is the second fallback and additional Africa/global payment rail.

Checkout should be provider-abstracted. If one provider is down, unavailable in the user's country, or fails before payment authorization, the system should offer or automatically route to the next eligible provider.

Webhook handlers must remain provider-specific but normalize into shared billing events.

## Admin MFA Policy

Admin MFA is mandatory before public beta.

Rules:

- super admins must have MFA before any production admin access
- platform admins must have MFA before any production admin access
- support, moderation, and billing admins must have MFA before public beta
- if MFA is not technically available during internal development, admin access must be restricted to local/development environments and all admin actions must remain auditable

## Rules

- never expose service role key to the client
- AI keys are server-side only
- payment provider secret keys are server-side only
- webhook secrets are server-side only
- local `.env` files should not be committed
- use `.env.example` with placeholders only

## Local Setup

Expected setup:

- install dependencies
- configure Supabase project
- copy placeholders into `.env.local`
- add Supabase keys when available
- add DeepSeek key when available
- add Anthropic key when available
- add OpenAI key when available
- add payment keys only when checkout work begins
- run migrations
- seed development data
- start Next.js dev server

## Deployment

Use:

- Vercel for app hosting
- Supabase for auth/database/storage/realtime
- Supabase Edge Functions where useful
- provider-specific webhook endpoints for Stripe, Paystack, and Flutterwave
