# Scholastiar.ai Database Architecture

Status: Master Database Blueprint

Scope: Unified opportunity and mobility platform

## Database Philosophy

Scholastiar.ai should use Supabase PostgreSQL as the central relational source of truth.

The database should be designed for:

- strong relational integrity
- strict Row Level Security
- modular feature domains
- AI-first workflows
- international employment data
- employer/candidate separation
- long-term unified service expansion
- auditability and trust

Core principles:

- use UUID primary keys
- use foreign keys for real relationships
- use `created_at` and `updated_at` on most tables
- use `created_by` where ownership matters
- use `status` fields for workflow entities
- use `metadata jsonb` only when flexible extension is useful
- keep raw AI outputs separate from user-approved records
- keep raw scraped/imported candidates separate from published records
- enforce access with RLS, not only application code

## Global Naming Conventions

Tables should use plural snake_case names:

```txt
candidate_profiles
employer_companies
job_applications
ai_generations
```

Recommended common fields:

```txt
id uuid primary key default gen_random_uuid()
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
created_by uuid references auth.users(id)
status text
metadata jsonb default '{}'::jsonb
```

Use enum-like constrained text values where flexibility is useful. Use PostgreSQL enums only for extremely stable values.

## Shared Core Tables

### user_profiles

Purpose: Application-level profile attached to `auth.users`.

Key fields:

- id
- user_id references auth.users(id)
- full_name
- avatar_url
- primary_role: candidate, employer, provider, forwarder, office, partner_agency, admin
- timezone
- locale
- onboarding_completed
- created_at
- updated_at

Relationships:

- one auth user has one user profile
- user can have candidate profile and/or employer memberships

## Shared Opportunity Card And Board Tables

These tables support consistent opportunity cards across jobs, universities, programmes and scholarships.

### opportunity_card_metrics

Purpose: Stores computed card-level decision signals for apply-able opportunities.

Key fields:

- id
- opportunity_type: job, university, program, scholarship
- opportunity_id
- application_effort_label, such as `2 min apply`
- estimated_effort_minutes
- success_score
- success_score_explanation
- application_window_start
- application_deadline
- mobility_value_summary
- ai_apply_agent_eligible boolean
- apply_for_me_eligible boolean
- computed_at
- metadata

Rules:

- success score is an estimate, not a guarantee
- score explanations should cite the main factors used
- opportunity_type plus opportunity_id should be indexed together

### saved_opportunities

Purpose: Unified save/shortlist table for all opportunity categories.

Key fields:

- id
- user_id
- opportunity_type
- opportunity_id
- status
- created_at

### ai_apply_board_items

Purpose: Opportunities the user wants the AI Apply Agent to prepare, fill, or submit.

Key fields:

- id
- user_id
- opportunity_type
- opportunity_id
- status
- autonomy_mode
- consent_status
- required_documents_snapshot
- missing_information_snapshot
- created_at
- updated_at

### apply_for_me_board_items

Purpose: Opportunities the user wants a vetted human Forwarder to handle.

Key fields:

- id
- user_id
- opportunity_type
- opportunity_id
- status
- budget_estimate
- review_before_submit boolean
- follow_up_requested boolean
- required_documents_snapshot
- created_at
- updated_at

### payment_provider_customers

Purpose: Maps one platform user/company to customer records across Stripe, Paystack, Flutterwave and crypto providers (Cryptomus first).

Key fields:

- id
- owner_type: user, employer_company, provider
- owner_id
- provider: stripe, paystack, flutterwave, cryptomus (extensible: more crypto providers)
- provider_customer_id
- status
- created_at
- updated_at

### payment_attempts

Note (2026-10-01): sign-up checkout creates a subscription with status `incomplete`; a successful payment attempt makes it `active`. Accounts with an incomplete subscription are sent back to checkout when they sign in.

Purpose: Tracks checkout/payment attempts across providers and prevents duplicate charges during fallback.

Key fields:

- id
- user_id
- subscription_id
- source_type, source_id (what is being paid for: subscription, accommodation booking, pilot booking, Year Check-in, office service, mission)
- method: card, local, crypto
- provider
- provider_reference
- amount
- currency
- status
- idempotency_key
- failure_reason
- fallback_from_provider
- created_at
- updated_at

Payment methods (2026-10-02): every checkout offers card (Stripe), local payment (Paystack, Flutterwave) and crypto (Cryptomus first). `payment_attempts.provider` includes `cryptomus`; `payment_attempts.method` is one of card, local, crypto.

### crypto_payments

Purpose: Crypto checkout details for a payment attempt.

Key fields:

- id
- payment_attempt_id
- provider: cryptomus (extensible)
- provider_invoice_id
- asset (e.g. USDT, USDC, BTC)
- network (e.g. TRC20, ERC20)
- amount_crypto
- amount_usd
- quote_rate
- quote_expires_at (15-minute lock)
- pay_address
- tx_hash
- confirmations
- status: awaiting_payment, confirming, paid, underpaid, expired, refunded
- created_at
- updated_at

### payment_provider_configs

Purpose: Enabled payment providers per method and region, so new providers (especially crypto) can be added without code changes to checkout.

Key fields:

- id
- provider
- method: card, local, crypto
- enabled boolean
- regions text[]
- supported_assets text[] (crypto)
- priority
- updated_at

### payment_webhook_events

Purpose: Stores provider webhook events for idempotent processing and audit.

Key fields:

- id
- provider
- provider_event_id
- event_type
- processed_at
- processing_status
- payload_hash
- created_at

### ai_provider_configs

Purpose: Stores server-side AI provider configuration metadata without secrets.

Key fields:

- id
- provider: deepseek, anthropic, openai
- model
- reasoning_model
- priority_order
- enabled
- fallback_enabled
- status
- metadata
- created_at
- updated_at

### ai_provider_attempts

Purpose: Audits each AI provider attempt for reliability, cost, and safety review.

Key fields:

- id
- ai_generation_id
- provider
- model
- request_type
- status
- latency_ms
- fallback_from_provider
- token_input_count
- token_output_count
- created_at

### ai_provider_failures

Purpose: Records provider failures that trigger fallback.

Key fields:

- id
- provider
- model
- request_type
- failure_type: unavailable, rate_limited, restricted, policy_blocked, timeout, schema_invalid, other
- user_region
- retry_provider
- created_at

### user_roles

Purpose: Assign platform-level roles.

Key fields:

- id
- user_id
- role
- granted_by
- created_at

Roles (aligned with `BUILD_GUIDE/USER_ROLES_AND_PERMISSIONS.md`, extended 2026-10-01 for provider, forwarder and agency surfaces, and 2026-10-02 for Relocation: pilots, housing providers, settlement staff, case handlers and rules editors):

- candidate
- employer_owner
- employer_admin
- recruiter
- hiring_manager
- employer_viewer
- provider_owner
- provider_admin
- provider_member
- forwarder
- office_staff
- partner_agency_member
- pilot (freelance or staff — status on pilot_profiles)
- housing_provider_owner
- housing_provider_member
- settlement_staff
- case_handler
- rules_editor
- support_admin
- moderation_admin
- billing_admin
- platform_admin
- super_admin

### countries

Purpose: Shared country reference table.

Key fields:

- id
- name
- iso2
- iso3
- region
- metadata

### cities

Purpose: Shared city/location reference.

Key fields:

- id
- country_id
- name
- region_state
- latitude
- longitude

### audit_logs

Purpose: Track sensitive actions.

Key fields:

- id
- actor_user_id
- action
- entity_type
- entity_id
- before_data jsonb
- after_data jsonb
- ip_address
- user_agent
- created_at

## Candidate Tables

### candidate_profiles

Purpose: Main candidate employment identity.

Key fields:

- id
- user_id references auth.users(id)
- headline
- professional_summary
- current_location_country_id
- current_location_city_id
- nationality_country_id
- profile_visibility
- profile_completion_score
- preferred_name
- phone
- website_url
- linkedin_url
- portfolio_url
- created_at
- updated_at

### candidate_onboarding_sessions

Purpose: Track onboarding progress.

Key fields:

- id
- candidate_profile_id
- current_step
- completed_steps text[]
- completed_at
- intelligence_summary jsonb
- created_at
- updated_at

### candidate_visa_profiles

Purpose: Store study status, study visa work conditions, post-study permit details and post-study sponsorship need (see `SERVICES/20-work-eligibility.md`). Recorded by the candidate from their own visa documents.

Key fields:

- id
- candidate_profile_id
- passport_country_id
- study_status: incoming, studying, graduated
- study_country_id
- institution_name
- course_start_date
- course_end_date
- current_visa_status
- term_time_weekly_hour_limit numeric (as stated on the candidate's visa)
- holiday_work_allowed boolean
- work_restrictions_notes
- post_study_permit_type_id references post_study_permit_types(id)
- post_study_permit_status: none, planning, applying, holding
- post_study_permit_expiry_date
- needs_work_visa_sponsorship_after_study boolean
- target_country_ids uuid[]
- updated_at

### education_records

Purpose: Candidate education history.

Key fields:

- id
- candidate_profile_id
- institution_name
- country_id
- degree_level
- field_of_study
- qualification_name
- start_date
- end_date
- grade
- description

### work_experiences

Purpose: Candidate employment history.

Key fields:

- id
- candidate_profile_id
- company_name
- job_title
- country_id
- city
- start_date
- end_date
- is_current
- responsibilities
- achievements
- tools_used text[]
- industry

### candidate_skills

Purpose: Skills and proficiency.

Key fields:

- id
- candidate_profile_id
- skill_name
- skill_type
- proficiency_level
- years_experience
- source

### certifications

Purpose: Candidate certifications and credentials.

Key fields:

- id
- candidate_profile_id
- name
- issuer
- issue_date
- expiry_date
- credential_url
- document_id

### career_preferences

Purpose: Candidate job targets and preferences.

Key fields:

- id
- candidate_profile_id
- target_roles text[]
- industries text[]
- job_tracks text[] (student, post_study)
- preferred_student_job_types text[] (part_time, holiday, campus, internship_placement)
- max_weekly_hours numeric
- pay_min
- pay_currency
- work_modes text[]
- target_country_ids uuid[]

## Employer And Provider Tables

### employer_companies

Purpose: Company account and public employer identity.

Key fields:

- id
- name
- slug
- website_url
- logo_document_id
- industry
- company_size
- headquarters_country_id
- headquarters_city_id
- description
- hires_students boolean
- sponsors_graduate_work_visas boolean
- verification_status
- created_by
- created_at
- updated_at

### employer_memberships

Purpose: Link users to employer companies.

Key fields:

- id
- employer_company_id
- user_id
- role
- status
- invited_by
- joined_at

Roles:

- owner
- admin
- recruiter
- hiring_manager
- viewer

### provider_organizations

Purpose: Universities, funders and other opportunity providers (added 2026-10-01 for provider sign-up).

Key fields:

- id
- name
- slug
- organization_type: university, scholarship_funder, other
- country_id
- website_url
- verification_status: unverified, pending, verified, rejected
- created_by
- created_at
- updated_at

### provider_memberships

Purpose: Link users to provider organizations.

Key fields:

- id
- provider_organization_id
- user_id
- role: owner, admin, member
- status
- joined_at

### employer_verification_records

Purpose: Track employer trust and verification.

Key fields:

- id
- employer_company_id
- verification_type
- status
- reviewed_by
- notes
- created_at
- reviewed_at

### screening_question_sets

Purpose: Reusable employer screening question templates.

Key fields:

- id
- employer_company_id
- name
- questions jsonb
- created_by
- created_at

## Jobs Tables

### jobs

Purpose: Main job listing table. Jobs are student jobs or post-study jobs only (decided 2026-10-01).

Key fields:

- id
- employer_company_id
- job_track: student, post_study
- student_job_type: part_time, holiday, campus, internship_placement (student track only)
- title
- slug
- description
- work_mode
- country_id
- city_id
- campus_or_area
- term_time_weekly_hours numeric (student track)
- holiday_weekly_hours numeric (student track)
- shift_flexibility: fixed, flexible, around_timetable (student track)
- pay_hourly numeric (student track)
- salary_min / salary_max (post-study track)
- salary_currency
- start_date
- duration_text
- application_deadline
- status
- created_by
- published_at
- created_at
- updated_at

Statuses:

- draft
- pending_review
- active
- paused
- closed
- rejected
- archived

### job_requirements

Purpose: Structured job requirements.

Key fields:

- id
- job_id
- requirement_type
- requirement_text
- importance

Types:

- skill
- experience
- education
- language
- certification
- other

### job_work_eligibility

Purpose: Work-eligibility details per job (replaces the former job_sponsorship_metadata). See `SERVICES/20-work-eligibility.md`.

Key fields:

- id
- job_id
- open_to_study_visa_holders boolean (student track)
- holiday_only boolean (student track)
- sponsors_work_visa boolean (post-study track; must be true and employer-confirmed to publish)
- work_visa_route_id references work_visa_routes(id) (post-study track)
- sponsorship_timing: from_day_one, after_post_study_permit (post-study track)
- accepted_permit_type_ids uuid[] (post-study track; permits accepted for starting before sponsorship)
- visa_costs_covered: none, some, all (post-study track)
- notes
- employer_confirmed boolean

### work_visa_routes

Purpose: Country reference list of work visa routes employers sponsor graduates through.

Key fields:

- id
- country_id
- name
- description
- official_url
- last_reviewed_at
- active boolean

### post_study_permit_types

Purpose: Country reference list of post-study work permits.

Key fields:

- id
- country_id
- name
- description
- official_url
- typical_duration_text
- last_reviewed_at
- active boolean

### work_eligibility_scores

Purpose: Cached candidate–job eligibility label and reason.

Key fields:

- id
- candidate_profile_id
- job_id
- label: fits_visa_hours, check_visa_hours, holiday_only, sponsorship_offered, start_on_permit, sponsorship_from_day_one, check_permit_validity
- reason text
- computed_at

### job_screening_questions

Purpose: Questions attached to a job application.

Key fields:

- id
- job_id
- question_text
- question_type
- required boolean
- order_index
- metadata

### saved_jobs

Purpose: Candidate bookmarks.

Key fields:

- id
- candidate_profile_id
- job_id
- created_at

### job_match_scores

Purpose: Candidate-job fit scores.

Key fields:

- id
- candidate_profile_id
- job_id
- score numeric
- explanation jsonb
- model_version
- created_at

## Applications Tables

### job_applications

Purpose: Submitted and draft job applications.

Key fields:

- id
- candidate_profile_id
- job_id
- employer_company_id
- status
- submitted_at
- current_pipeline_stage
- cv_version_id
- cover_letter_id
- personality_cv_attached boolean
- created_at
- updated_at

Statuses:

- draft
- submitted
- viewed
- reviewed
- shortlisted
- interview
- offered
- rejected
- withdrawn

### application_answers

Purpose: Submitted answers to screening questions.

Key fields:

- id
- application_id
- question_id
- answer_text
- generated_by_ai boolean
- ai_generation_id
- approved_by_user boolean

### application_status_history

Purpose: Timeline of application changes.

Key fields:

- id
- application_id
- from_status
- to_status
- changed_by
- change_reason
- created_at

### cover_letters

Purpose: Generated or user-written cover letters.

Key fields:

- id
- candidate_profile_id
- job_id
- content
- ai_generation_id
- created_at
- updated_at

### employer_pipeline_notes

Purpose: Employer notes on applications.

Key fields:

- id
- application_id
- employer_company_id
- author_user_id
- note
- visibility
- created_at

## AI CV Tables

### cv_versions

Purpose: Store generated and uploaded CV versions.

Key fields:

- id
- candidate_profile_id
- target_job_id
- title
- format_region
- content jsonb
- rendered_document_id
- ai_generation_id
- status
- created_at
- updated_at

### cv_sections

Purpose: Optional structured CV sections for editing.

Key fields:

- id
- cv_version_id
- section_type
- order_index
- content jsonb

### cv_exports

Purpose: Track downloaded/exported files.

Key fields:

- id
- cv_version_id
- document_id
- export_type
- created_at

## PersonalityAI CV Tables

### personality_cv_profiles

Purpose: Candidate PersonalityAI CV settings and status.

Key fields:

- id
- candidate_profile_id
- status
- visibility
- current_video_id
- prompt_version
- view_count
- created_at
- updated_at

### personality_cv_videos

Purpose: Store video metadata.

Key fields:

- id
- candidate_profile_id
- document_id
- duration_seconds
- transcript
- moderation_status
- created_at

### personality_cv_views

Purpose: Track employer views.

Key fields:

- id
- personality_cv_profile_id
- employer_company_id
- viewer_user_id
- application_id
- viewed_at

## Signia Tables

### signia_profiles

Purpose: Candidate-owned living professional showcase profile.

Key fields:

- id
- candidate_profile_id
- handle
- headline
- summary
- current_work_summary
- completeness_score
- public_status: draft, published, unpublished, suspended
- discoverability_status: private, application_only, employer_discoverable, public
- featured_personality_cv_id
- published_at
- created_at
- updated_at

Rules:

- handle must be unique when present
- public_status and discoverability_status must be checked before public or employer search exposure

### signia_sections

Purpose: Ordered modular sections on a Signia profile.

Key fields:

- id
- signia_profile_id
- section_type: overview, projects, research, videos, documents, social_links, current_work, writing, certifications, custom
- title
- content jsonb
- order_index
- visibility: private, application_only, employer_visible, public
- status
- created_at
- updated_at

### signia_social_links

Purpose: Professional links and social handles displayed in one place.

Key fields:

- id
- signia_profile_id
- platform
- label
- url
- handle
- visibility
- verification_status
- order_index
- created_at
- updated_at

### signia_projects

Purpose: Candidate project, research, portfolio, or work showcase.

Key fields:

- id
- signia_profile_id
- title
- slug
- summary
- role_description
- problem_statement
- approach
- outcome
- status: draft, in_progress, completed, archived
- project_type: project, research, startup, open_source, case_study, writing, certification, other
- skills text[]
- tools text[]
- industry_tags text[]
- visibility
- start_date
- end_date
- order_index
- created_at
- updated_at

### signia_project_links

Purpose: External links attached to projects.

Key fields:

- id
- signia_project_id
- link_type: github, demo, portfolio, paper, video, article, dataset, other
- label
- url
- visibility
- order_index
- created_at

### signia_media_items

Purpose: Video, image, deck, document, and proof metadata used by Signia.

Key fields:

- id
- signia_profile_id
- signia_project_id nullable
- document_id nullable
- media_type: video, image, deck, document, research, certificate, screenshot, audio, other
- title
- description
- transcript
- extracted_text
- duration_seconds
- visibility
- moderation_status
- order_index
- created_at
- updated_at

### signia_document_links

Purpose: Attach existing secure documents to Signia sections, projects, or skills.

Key fields:

- id
- signia_profile_id
- signia_project_id nullable
- document_id
- label
- visibility
- created_at

### signia_skill_evidence

Purpose: Map candidate skills to specific proof items.

Key fields:

- id
- signia_profile_id
- candidate_skill_id nullable
- skill_name
- evidence_type: project, media, document, social_link, personality_cv, external_link
- evidence_id
- evidence_summary
- confidence_score
- created_by: user, ai, admin
- created_at
- updated_at

### signia_visibility_settings

Purpose: Candidate-controlled privacy and search settings.

Key fields:

- id
- signia_profile_id
- public_profile_enabled boolean
- employer_search_enabled boolean
- application_attachment_enabled boolean
- allow_video_transcripts_in_search boolean
- allow_document_text_in_search boolean
- allow_social_links_in_employer_view boolean
- hidden_section_ids uuid[]
- updated_at

### signia_search_indexes

Purpose: Search-ready normalized content for allowed Signia discovery.

Key fields:

- id
- signia_profile_id
- candidate_profile_id
- visibility_scope: public, employer_discoverable, application_only
- indexed_text
- indexed_skills text[]
- indexed_tools text[]
- indexed_industries text[]
- indexed_media_types text[]
- embedding vector optional
- source_fingerprint
- indexed_at

Rules:

- search indexes must be rebuilt when visibility changes
- private sections and sensitive documents must not be indexed

### signia_employer_searches

Purpose: Store employer searches for saved searches, auditing, and abuse monitoring.

Key fields:

- id
- employer_company_id
- searched_by_user_id
- query
- filters jsonb
- result_count
- saved boolean
- created_at

### signia_profile_views

Purpose: Track employer and public views of Signia profiles.

Key fields:

- id
- signia_profile_id
- viewer_user_id nullable
- employer_company_id nullable
- application_id nullable
- view_source: public_page, employer_search, application_review, candidate_share
- viewed_at

### signia_ai_summaries

Purpose: Store generated Signia summaries and proof-of-work highlights.

Key fields:

- id
- signia_profile_id
- employer_company_id nullable
- target_job_id nullable
- summary_type: candidate_profile, employer_search, project, comparison
- summary
- source_references jsonb
- ai_generation_id
- created_at

## Messaging Tables

### message_threads

Purpose: Application-linked conversations.

Key fields:

- id
- application_id
- candidate_profile_id
- employer_company_id
- subject
- status
- created_at
- updated_at

### messages

Purpose: Individual messages.

Key fields:

- id
- thread_id
- sender_user_id
- body
- message_type
- created_at

### message_attachments

Purpose: Attach documents to messages.

Key fields:

- id
- message_id
- document_id
- created_at

### interview_invitations

Purpose: Structured interview invites.

Key fields:

- id
- application_id
- thread_id
- proposed_time
- location_or_link
- notes
- status
- created_by
- created_at

## Notifications Tables

### notifications

Purpose: In-app notifications.

Key fields:

- id
- user_id
- notification_type
- title
- body
- entity_type
- entity_id
- read_at
- created_at

### notification_preferences

Purpose: User notification settings.

Key fields:

- id
- user_id
- channel: email, whatsapp, in_app, push
- notification_type
- enabled boolean

### whatsapp_consents

Purpose: WhatsApp opt-in, required before sending WhatsApp messages (2026-10-02).

Key fields:

- id
- user_id
- phone_e164
- opted_in boolean
- opted_in_at
- opted_out_at
- source: sign_up, onboarding, settings
- verified_at

### message_templates

Purpose: The message catalogue — one entry per platform event, with email and WhatsApp versions.

Key fields:

- id
- event_key (e.g. payment.succeeded, journey.step_due)
- service
- email_subject
- email_body
- whatsapp_template_name (approved template name at the WhatsApp provider)
- whatsapp_body
- in_app_title
- in_app_body
- variables text[]
- locked boolean (security, payment and emergency messages cannot be switched off)
- status

### notification_delivery_logs

Purpose: Email, WhatsApp and push delivery logs.

Key fields:

- id
- notification_id
- channel: email, whatsapp, in_app, push
- provider
- template_id
- status: queued, sent, delivered, read, failed
- error
- created_at

Every platform event sends email + WhatsApp (official Scholastiar account, when the user has opted in) + in-app, following `SERVICES/100-notifications.md`.

## Documents And Media Tables

### documents

Purpose: Metadata for files in Supabase Storage.

Key fields:

- id
- owner_user_id
- owner_type
- bucket
- storage_path
- file_name
- mime_type
- size_bytes
- document_type
- visibility
- created_at

### document_versions

Purpose: Version history for replaceable documents.

Key fields:

- id
- document_id
- storage_path
- version_number
- created_at

### document_access_grants

Purpose: Scoped document access.

Key fields:

- id
- document_id
- granted_to_user_id
- granted_to_company_id
- application_id
- access_level
- expires_at
- created_at

### document_access_logs

Purpose: Audit document views/downloads.

Key fields:

- id
- document_id
- actor_user_id
- action
- created_at

## AI Infrastructure Tables

### ai_prompts

Purpose: Central prompt registry.

Key fields:

- id
- prompt_key
- name
- description
- current_version_id
- created_at

### ai_prompt_versions

Purpose: Versioned prompt text/configuration.

Key fields:

- id
- prompt_id
- version
- prompt_text
- model_provider
- model_name
- output_schema jsonb
- created_at

### ai_generations

Purpose: Track AI generation requests and outputs.

Key fields:

- id
- user_id
- prompt_version_id
- generation_type
- input_summary jsonb
- output jsonb
- status
- model_provider
- model_name
- token_usage jsonb
- error_message
- created_at

Generation types:

- cv
- cover_letter
- screening_answer
- candidate_summary
- ranking_explanation
- onboarding_summary
- message_draft
- signia_profile_summary
- signia_project_summary
- signia_search_summary
- signia_skill_evidence

### ai_generation_sources

Purpose: Track facts/documents used in AI generation.

Key fields:

- id
- ai_generation_id
- source_type
- source_id
- source_summary

### ai_review_results

Purpose: Store AI quality/safety reviews.

Key fields:

- id
- entity_type
- entity_id
- review_type
- result jsonb
- risk_score
- created_at

## Analytics Tables

### analytics_events

Purpose: General event tracking.

Key fields:

- id
- user_id
- event_name
- entity_type
- entity_id
- properties jsonb
- created_at

### candidate_metrics

Purpose: Derived candidate analytics.

Key fields:

- id
- candidate_profile_id
- metric_date
- applications_count
- response_rate
- interview_rate
- profile_strength
- metadata

### employer_metrics

Purpose: Derived employer analytics.

Key fields:

- id
- employer_company_id
- metric_date
- active_jobs
- applications_received
- shortlisted_count
- interview_count
- offer_count
- metadata

## Billing Tables

### plans

Purpose: Candidate and employer plans.

Key fields:

- id
- audience
- name
- price
- currency
- interval
- features jsonb
- active boolean

### plan_comparison_rows

Purpose: Structured feature matrix shown on the pricing page (added 2026-10-01). Keeps the comparison in data, not page code.

Key fields:

- id
- audience
- group: discover, prepare, apply, portfolio, support
- label
- description
- values jsonb (plan id → true, false, or a value such as "Higher limits")
- sort_order

### subscriptions

Purpose: User/company subscriptions.

Key fields:

- id
- plan_id
- user_id
- employer_company_id
- provider_customer_id
- provider_subscription_id
- status
- current_period_start
- current_period_end

### usage_events

Purpose: Track feature usage for limits.

Key fields:

- id
- user_id
- employer_company_id
- usage_type
- quantity
- entity_type
- entity_id
- created_at

### invoices

Purpose: Billing invoice metadata.

Key fields:

- id
- subscription_id
- provider_invoice_id
- amount
- currency
- status
- hosted_invoice_url
- created_at

## Publishing And Public Content Tables

Added 2026-10-01 for the public website (U1). See `BUILD_GUIDE/PUBLISHING_INTELLIGENCE_ENGINE.md` for the full publishing system; these are the tables the public pages read and write.

### articles

Purpose: Canonical guides and news (Article Template).

Key fields:

- id
- slug (unique)
- title
- category: opportunities, immigration, readiness, product, insights
- excerpt
- short_answer
- who_its_for
- sections jsonb (heading, paragraphs, bullets)
- faq jsonb (question, answer)
- sources jsonb (label, url)
- country_tags text[]
- opportunity_types text[]
- author_name / author_id
- reading_minutes
- status: draft, published
- accuracy_review_required boolean
- published_at
- last_updated_at

### faq_items

Purpose: Public help centre questions.

Key fields:

- id
- audience: applicants, employers, billing
- question
- answer
- sort_order

### testimonials

Purpose: Public quotes shown on marketing pages. Must be real and consented.

Key fields:

- id
- quote
- person_name
- person_context
- consent_recorded_at
- is_placeholder boolean (seed data only)

### newsletter_subscriptions

Purpose: Weekly opportunity digest sign-ups.

Key fields:

- id
- email (unique, lower-cased)
- source (page that collected it)
- status: subscribed, unsubscribed
- created_at

### contact_messages

Purpose: Messages from the public contact form, handled by support.

Key fields:

- id
- name
- email
- topic: applicant_support, employer_sales, partnerships, press, other
- message
- status: new, in_progress, closed
- created_at

## Admin And Moderation Tables

### moderation_reports

Purpose: User-submitted or system-generated reports.

Key fields:

- id
- reporter_user_id
- entity_type
- entity_id
- reason
- status
- assigned_admin_id
- created_at
- resolved_at

### moderation_actions

Purpose: Actions taken by admins.

Key fields:

- id
- report_id
- admin_user_id
- action
- notes
- created_at

### support_notes

Purpose: Internal support notes.

Key fields:

- id
- entity_type
- entity_id
- author_user_id
- note
- created_at

### platform_settings

Purpose: Configurable platform settings.

Key fields:

- id
- key
- value jsonb
- updated_by
- updated_at

## Relocation Tables

Added 2026-10-02 for `SERVICES/12-relocation.md`. Rules are layered: destination country → embassy → visa type → city → school; the most specific layer wins. Every rule row carries a source and verification date, and a country is visible to students only when active (activation gate).

### relocation_countries

Purpose: Destination countries in the rules library.

Key fields:

- id
- country_code
- status: draft, in_review, active, paused
- emergency_numbers jsonb (general, ambulance, police, fire — each with verified_at)
- default_currency
- activated_at
- activated_by
- created_at
- updated_at

### relocation_cities

Purpose: Destination cities with their own post-arrival rules.

Key fields:

- id
- relocation_country_id
- name
- slug
- status: draft, active
- timezone
- living_cost_monthly_min / typical / max, currency, verified_at

### relocation_schools

Purpose: School-level layer (e.g. a university that performs migration registration for its students).

Key fields:

- id
- relocation_city_id
- university_id (links to the Universities domain when available)
- name
- international_office_address, contacts
- status

### embassies

Purpose: Embassies, consulates and visa centres of a destination country abroad.

Key fields:

- id
- relocation_country_id (the destination they issue visas for)
- host_country_code
- city
- kind: embassy, consulate, visa_centre
- address, latitude, longitude
- opening_hours jsonb
- phone, email, website, appointment_url
- processing_time_days_min / max
- status: draft, active
- source_url
- verified_at

### embassy_jurisdictions

Purpose: Which residence countries and regions an embassy serves (used to pick a student's embassy).

Key fields:

- id
- embassy_id
- residence_country_code
- region (nullable = whole country)

### visa_types

Purpose: Visa types per destination (student, preparatory course, …).

Key fields:

- id
- relocation_country_id
- name
- description

### process_steps

Purpose: Base step templates for a destination country.

Key fields:

- id
- relocation_country_id
- category: pre_arrival, post_arrival
- phase (e.g. documents, visa, travel; first_days, first_weeks, first_months)
- sort_order
- title
- description
- instructions jsonb (ordered steps)
- documents_needed jsonb (name, how to obtain)
- deadline_rule jsonb (e.g. { anchor: "arrival", within: 7, unit: "working_days" })
- duration_estimate, waiting_time_estimate
- pilot_service_package_key (nullable)
- counts_towards_progress boolean
- source_url
- verified_at
- verification_status: unverified, verified
- status: draft, published, retired

### process_step_overrides

Purpose: Layer changes to base steps (add, remove, edit, reorder).

Key fields:

- id
- layer_type: embassy, visa_type, city, school
- layer_id
- process_step_id (nullable when the override adds a new step)
- action: add, remove, edit, reorder
- changes jsonb (only the fields that differ)
- sort_order
- source_url
- verified_at
- status: draft, published

### process_locations

Purpose: Offices where a step is done.

Key fields:

- id
- owner_type: process_step, process_step_override, embassy
- owner_id
- name
- address
- latitude, longitude
- directions_url
- transport_notes (bus/metro routes)
- opening_hours jsonb
- phone, email, website, appointment_url
- verified_at

### process_cost_lines

Purpose: Cost of each step, booking or service.

Key fields:

- id
- owner_type: process_step, process_step_override, pilot_service_package, accommodation_listing, relocation_city, year_checkin
- owner_id
- label
- fee_type: fixed_official, provider_price, variable_estimate, optional
- amount_min, amount_typical, amount_max
- currency
- unit: once, per_person, per_page, per_month, per_day
- quantity_rule jsonb
- confidence: high, medium, low
- source_url
- verified_at

### rule_versions

Purpose: Draft → review → published versions with effective dates.

Key fields:

- id
- entity_type, entity_id
- version
- snapshot jsonb
- status: draft, in_review, published, superseded
- effective_from
- proposed_by, approved_by
- created_at

### rule_change_log

Purpose: Audit of every rules change.

Key fields:

- id
- entity_type, entity_id
- change_summary
- changed_by
- created_at

### rule_outdated_reports

Purpose: Students flag out-of-date information.

Key fields:

- id
- reported_by
- entity_type, entity_id
- message
- status: open, accepted, rejected
- resolved_by, resolved_at
- created_at

### exchange_rates

Key fields:

- id
- base_currency
- quote_currency
- rate
- source
- as_of

### relocation_journeys

Purpose: A student's move.

Key fields:

- id
- user_id
- relocation_country_id
- relocation_city_id
- relocation_school_id
- visa_type_id
- residence_country_code, residence_region
- embassy_id
- university_application_id (nullable; set when created from an accepted offer)
- arrival_date
- course_start_date
- home_currency
- pre_arrival_progress, post_arrival_progress (0–100)
- post_arrival_badge_at
- status: active, handed_off, archived
- created_at
- updated_at

### journey_steps

Purpose: The student's resolved checklist (snapshot of the layered rules, updated when rules change).

Key fields:

- id
- journey_id
- process_step_id
- override_id (nullable)
- category
- phase
- sort_order
- resolved_content jsonb
- need: needed, not_needed
- status: todo, in_progress, done
- due_at
- completed_at
- pilot_requested boolean
- pilot_booking_id
- rule_version_seen

### journey_step_proofs

Key fields:

- id
- journey_step_id
- document_id
- note
- created_at

### actual_cost_reports

Purpose: What students actually paid — calibrates estimates.

Key fields:

- id
- journey_step_id
- cost_line_id
- amount
- currency
- paid_at
- included_in_calibration boolean
- created_at

### travel_itineraries

Key fields:

- id
- journey_id
- flight_details jsonb (segments, airline, flight numbers, times)
- ticket_document_id
- arrival_airport
- hotel_reservation jsonb
- shared_with_emergency_contact boolean

### housing_providers

Key fields:

- id
- owner_user_id
- kind: university_dormitory, private_landlord, homestay, private_hall
- name
- relocation_city_id
- verification_status: pending, verified, rejected
- payout_details jsonb (local bank, encrypted)
- created_at

### accommodation_listings

Key fields:

- id
- housing_provider_id
- title
- description
- address, latitude, longitude
- relocation_school_ids uuid[] (nearby schools)
- campus_travel_minutes jsonb
- included jsonb (utilities, internet, …)
- rules
- cancellation_policy
- verified_at (staff inspection)
- status: draft, published, paused

### accommodation_rooms

Key fields:

- id
- listing_id
- room_type: single, shared, studio, apartment
- capacity
- monthly_rent, deposit, currency
- photos jsonb

### room_availability

Key fields:

- id
- room_id
- available_from
- available_to
- beds_available

### accommodation_bookings

Key fields:

- id
- room_id
- journey_id
- booked_by
- roommate_group_id (nullable)
- start_date, end_date
- price_breakdown jsonb
- status: requested, confirmed, contract_ready, moved_in, ended, cancelled, disputed
- held_amount
- moved_in_at
- created_at

### booking_payment_schedules

Key fields:

- id
- booking_id
- payer_user_id
- due_date
- amount, currency
- kind: first_rent, deposit, booking_fee, rent, utilities
- payment_attempt_id
- status: due, paid, overdue, refunded

### accommodation_contracts

Key fields:

- id
- booking_id
- document_id
- signed_by_student_at
- signed_by_provider_at

### accommodation_reviews

Key fields:

- id
- listing_id
- booking_id
- rating
- body
- created_at

### maintenance_requests

Key fields:

- id
- booking_id
- description
- photos jsonb
- status
- created_at

### roommate_profiles

Key fields:

- id
- user_id
- relocation_city_id
- relocation_school_id
- budget_min, budget_max, currency
- move_in_date
- room_type
- habits jsonb (sleep, cleanliness, smoking, guests, study)
- languages
- gender_preference
- private_fields jsonb (diet, faith) with visibility flags
- visible boolean

### roommate_requests

Key fields:

- id
- from_user_id
- to_user_id
- status: pending, accepted, declined
- created_at

### roommate_groups

Key fields:

- id
- member_user_ids uuid[]
- created_at

### communities

Key fields:

- id
- name
- type: faith, fellowship, student_association, national_diaspora, professional, sports_hobby, volunteering
- faith (nullable, free text — all faiths)
- scope: school, city
- relocation_city_id
- relocation_school_id
- description
- meeting_times
- address, latitude, longitude
- languages
- submitted_by
- status: pending, approved, rejected, archived
- approved_by, approved_at
- verified boolean
- last_link_check_at

### community_links

Key fields:

- id
- community_id
- kind: website, whatsapp, telegram, instagram, email, other
- url

### community_saves

Key fields:

- id
- community_id
- user_id
- joined boolean

### community_reports

Key fields:

- id
- community_id
- reported_by
- reason
- status

### city_guides

Key fields:

- id
- relocation_city_id
- status
- verified_at

### city_guide_entries

Key fields:

- id
- city_guide_id
- section: getting_around, neighbourhoods, cost_of_living, safety, essential_places, weather, emergency, customs, tours
- title
- body
- latitude, longitude
- links jsonb

### pilot_profiles

Key fields:

- id
- user_id
- status: applicant, verified, staff, suspended
- cities uuid[]
- languages
- bio
- photo_url
- rating_avg
- completed_services
- staff_since (set by admin; employment handled by management off-platform)
- payout_details jsonb (encrypted; freelancers)

### pilot_verifications

Key fields:

- id
- pilot_profile_id
- check: identity, address, background, interview, training, reference
- status: pending, passed, failed
- checked_by
- checked_at
- document_id

### pilot_service_packages

Purpose: Standard packages with platform-set prices per city.

Key fields:

- id
- relocation_city_id
- key: airport_pickup, registration_accompaniment, medical_accompaniment, sim_and_bank, house_viewing, move_in, city_tour, arrival_week, custom
- title
- description
- duration_hours
- max_group_size
- commission_rate
- status

### pilot_bookings

Key fields:

- id
- package_id
- pilot_profile_id
- cohort_id (nullable)
- student_user_ids uuid[]
- journey_step_id (nullable)
- scheduled_at
- meeting_point jsonb
- price_breakdown jsonb
- status: requested, assigned, confirmed, in_progress, completed, cancelled, disputed
- completed_at

### pilot_booking_checkins

Key fields:

- id
- booking_id
- user_id
- code_hash
- checked_in_at

### pilot_reviews

Key fields:

- id
- booking_id
- pilot_profile_id
- reviewer_user_id
- rating
- body

### pilot_incidents

Key fields:

- id
- booking_id
- reported_by
- severity
- description
- sos boolean
- status
- created_at

### pilot_referral_codes

Key fields:

- id
- pilot_profile_id
- code (unique)
- active boolean
- created_at

### pilot_commissions

Purpose: 20% of each Year Check-in payment attributed to a pilot.

Key fields:

- id
- pilot_profile_id
- year_checkin_membership_id
- payment_attempt_id
- kind: new, renewal
- attribution: referral_code, chosen_at_checkout, admin_correction
- base_amount_usd (amount paid, after discounts, excluding fees)
- rate (0.20)
- amount_usd
- hold_until
- status: pending, payable, paid, clawed_back, cancelled
- payout_task_id (freelancers) / payroll_reference (staff)
- created_at

Constraint: one commission per membership payment.

### pilot_award_cycles

Key fields:

- id
- year
- voting_opens_at, voting_closes_at
- global_prize_usd (10000)
- country_prize_usd (1000)
- min_months_active, min_completed_services, min_rating
- status: upcoming, voting, review, published

### pilot_award_votes

Key fields:

- id
- cycle_id
- voter_user_id
- pilot_profile_id
- relocation_country_id
- created_at, updated_at

Constraints: one vote per voter per cycle; the voter must have a completed booking or cohort membership with that pilot in the cycle year.

### pilot_awards

Key fields:

- id
- cycle_id
- pilot_profile_id
- scope: global, country
- relocation_country_id (country scope)
- prize_usd
- votes
- payout_task_id / payroll_reference
- published_at

### cohorts

Key fields:

- id
- relocation_city_id
- relocation_school_id
- embassy_id (nullable)
- arrival_window_start, arrival_window_end
- lead_pilot_id
- max_size
- status: forming, active, completed

### cohort_members

Key fields:

- id
- cohort_id
- user_id
- journey_id
- joined_at
- left_at

### cohort_tasks

Key fields:

- id
- cohort_id
- package_id
- scheduled_at
- meeting_point jsonb
- status

### alumni_records

Key fields:

- id
- user_id
- journey_id
- handed_off_at

### year_checkin_memberships

Key fields:

- id
- user_id
- relocation_city_id
- starts_at
- ends_at
- waiting_period_ends_at
- auto_renew boolean
- status: active, expired, cancelled
- legal_cases_used
- pilot_accompaniments_used
- payment_attempt_id

### support_cases

Key fields:

- id
- membership_id
- user_id
- category: medical, legal, police, accommodation, job, visa_permit, lost_documents, bank_money, university, wellbeing, other
- priority: emergency, urgent, standard
- description
- location jsonb
- status: open, triaged, assigned, in_progress, resolved, closed
- sla_due_at
- opened_at
- resolved_at
- rating

### support_case_events

Key fields:

- id
- case_id
- actor_user_id
- kind: message, status_change, assignment, document, cost
- body
- document_id
- internal boolean
- created_at

### support_case_assignments

Key fields:

- id
- case_id
- assignee_type: case_handler, staff_pilot, partner_lawyer
- assignee_id
- assigned_at

### support_case_costs

Purpose: Covered vs payable costs, and internal costing for margin reporting.

Key fields:

- id
- case_id
- label
- amount, currency
- covered_by: membership, student
- internal_cost boolean
- approved_by_student_at

### partner_lawyers

Key fields:

- id
- name
- firm
- relocation_city_id
- specialisms
- languages
- contacts jsonb
- retainer_terms jsonb
- status

### payout_tasks

Purpose: Local settlement to providers (housing, freelance pilots, pilot commissions and award prizes) — Russia first.

Key fields:

- id
- payee_type: housing_provider, pilot
- payee_id
- source_type: accommodation_booking, booking_payment_schedule, pilot_booking, pilot_commission, pilot_award
- source_id
- amount_local, local_currency
- amount_usd
- exchange_rate_id
- due_date
- status: due, approved, paid, overdue, cancelled
- paid_by, paid_at
- second_approver_id (above threshold)
- proof_document_id
- notes

## Study Catalogue Tables

Draft for review (2026-10-07). Spec: `SERVICES/21-study-catalogue.md`.

### universities

Key fields: id, slug, name, country_iso2, city, institution_type (university, college, institute), official_website, logo_media_id, description, verification_state (verified, checked, unverified, outdated), last_verified_at, verified_by, source_url, is_partner boolean, provider_organization_id (nullable), status (draft, published, archived), created_at, updated_at.

### university_programs

Key fields: id, university_id, slug, name, level (foundation, diploma, bachelors, medicine_long, postgraduate_diploma, masters, doctorate, language_course, short_course), award (for example MSc, BEng, PhD), field_slug, subject, study_mode (on_campus, online, blended), attendance (full_time, part_time), duration_months, language_of_instruction, tuition_amount, tuition_currency, tuition_period (year, total, semester), application_fee_amount, minimum_qualification, english_tests_accepted, entrance_exam_required boolean, description, official_url, verification_state, last_verified_at, next_check_at, source_urls (per fact group), status, created_at, updated_at.

Rules: unique (university_id, name, level); unverified rows are never public.

### program_intakes

Key fields: id, program_id, intake_month, intake_year, application_opens_at, application_deadline, status (open, closed, upcoming).

### program_requirements

Key fields: id, program_id, requirement_type (document, test, academic, other), label, details, required boolean, sort_order.

### scholarship_links

Key fields: id, scholarship_id, link_type (program, university, country), program_id, university_id, country_iso2.

### application_routes

Purpose: How "Apply" works for one programme or scholarship.

Key fields: id, target_type (program, scholarship), target_id, route (hosted, partner, official), official_apply_url, partner_agreement_id (nullable), active boolean, updated_at.

Rules: one active route per target; precedence hosted → partner → official.

### outbound_clicks

Key fields: id, link_id, user_id (nullable for visitors), target_type, target_id, destination_url, clicked_at, follow_up_status (pending, submitted, not_yet, dismissed).

### recruitment_agreements

Key fields: id, university_id, status (draft, active, ended), commission_terms, starts_at, ends_at, documents, created_by.

### recruitment_commissions

Key fields: id, agreement_id, application_id, student_user_id, status (expected, invoiced, paid, void), amount, currency, enrolled_at, paid_at.

### catalogue_reports

Key fields: id, target_type, target_id, reported_by (nullable), field, message, status (open, fixed, rejected), handled_by, created_at.

## Ordered Opportunity Domains

Ordered opportunity services should use the same patterns:

- source table
- profile/listing table
- requirements/questions table
- application/submission table
- generated answers table
- status history table
- document links
- review/verification records

Reserved future domains:

- universities
- scholarships
- discovery engine
- Signia
- AI Apply Agent
- Apply For Me
- relocation (defined above — Relocation Tables)
- migration agencies

Do not mix domain-specific entities into unrelated service tables unless they are genuinely shared infrastructure such as users, documents, messages, notifications, billing, AI generations, or audit logs.

## RLS Strategy

### Candidate Access

Candidates can:

- read/update their own profile
- read/write their own documents
- read/write their own CVs
- read/write their own Signia profile, projects, media links, social links, and visibility settings
- create applications for themselves
- read their own applications
- read messages in their own threads

Candidates cannot:

- read other candidate profiles
- read employer private notes
- access employer dashboards

### Employer Access

Employer members can:

- read company data for companies where they are members
- manage jobs based on role
- view applications submitted to their company
- view candidate data only through submitted applications
- search public or opted-in Signia profiles according to candidate visibility settings and employer entitlements
- send messages in company-linked threads

Employers cannot:

- browse private candidate profiles outside allowed views
- search private Signia sections or documents without candidate consent
- access other employer data
- access candidate private documents not attached to applications

### Admin Access

Admins can access operational data based on admin role.

Admin access should be:

- role-scoped
- audited
- limited by support need
- separated from normal user flows

### Storage Access

Storage policies should ensure:

- owners can read their own files
- employers can read documents attached to applications submitted to their company
- employers can read Signia media only when the item is public, employer-visible, or application-visible for that company
- admins can access files only through audited support/moderation flows
- public access is disabled by default

## Indexing Strategy

Recommended indexes:

- user_profiles.user_id
- candidate_profiles.user_id
- employer_memberships.user_id
- employer_memberships.employer_company_id
- jobs.employer_company_id
- jobs.status
- jobs.country_id
- jobs.application_deadline
- jobs.job_track
- job_work_eligibility.job_id
- saved_jobs.candidate_profile_id
- job_applications.candidate_profile_id
- job_applications.employer_company_id
- job_applications.job_id
- job_applications.status
- application_status_history.application_id
- message_threads.application_id
- messages.thread_id
- notifications.user_id
- notifications.read_at
- documents.owner_user_id
- signia_profiles.candidate_profile_id
- signia_profiles.handle
- signia_profiles.public_status
- signia_social_links.signia_profile_id
- signia_projects.signia_profile_id
- signia_projects.visibility
- signia_media_items.signia_profile_id
- signia_media_items.signia_project_id
- signia_skill_evidence.signia_profile_id
- signia_search_indexes.signia_profile_id
- signia_search_indexes.visibility_scope
- signia_employer_searches.employer_company_id
- signia_profile_views.signia_profile_id
- ai_generations.user_id
- analytics_events.user_id
- analytics_events.event_name

Consider full-text search indexes for:

- jobs.title
- jobs.description
- employer_companies.name
- candidate skills/search fields where privacy allows
- signia_search_indexes.indexed_text
- signia_projects.title and summary where visibility allows

## Implementation Order

### Step 1: Identity And Access

Build:

- user_profiles
- user_roles
- employer_memberships
- admin roles
- audit_logs

### Step 2: Candidate Foundation

Build:

- candidate_profiles
- onboarding sessions
- visa profiles (study visa work conditions and post-study permits)
- education
- work experience
- skills
- preferences

### Step 3: Employer Foundation

Build:

- employer_companies
- company profiles
- memberships
- employer verification

### Step 4: Jobs And Work Eligibility

Build:

- jobs (student and post-study tracks)
- requirements
- work eligibility, work visa routes and post-study permit types
- screening questions
- saved jobs
- match scores

### Step 5: Applications

Build:

- applications
- answers
- status history
- cover letters
- employer notes

### Step 6: AI CV And AI Generations

Build:

- ai prompts
- ai generations
- cv versions
- cv sections
- cover letters

### Step 7: Documents And Media

Build:

- documents
- document access grants
- PersonalityAI CV video metadata
- Signia profile, projects, social links, media links, document links, and skill evidence
- storage policies

### Step 8: Signia Search And Employer Discovery

Build:

- Signia search indexes
- employer saved searches
- Signia AI summaries
- Signia profile view audit logs
- visibility-aware search policies

### Step 9: Messaging And Notifications

Build:

- message threads
- messages
- interview invitations
- notifications
- preferences

### Step 10: Billing And Analytics

Build:

- plans
- subscriptions
- usage events
- invoices
- analytics events
- derived metrics

### Step 11: Admin And Moderation

Build:

- moderation reports
- moderation actions
- support notes
- platform settings

### Step 12: Relocation

Build:

- rules library (countries, cities, schools, embassies, jurisdictions, visa types, steps, overrides, locations, cost lines, versions)
- journeys, journey steps, proofs, actual cost reports, travel itineraries
- accommodation, bookings, payment schedules, contracts
- roommates, communities, city guides
- pilots, bookings, cohorts
- pilot referral codes, Year Check-in commissions, Best Pilot award cycles, votes and winners
- alumni, Year Check-in memberships, support cases, partner lawyers
- payout tasks (settlement)

## Final Principle

The database should make the product easier to evolve, not harder.

The unified platform should be strong enough to run premium opportunity services while preserving shared identity, document, AI, messaging, notification, billing, and audit foundations without corrupting domain boundaries.
