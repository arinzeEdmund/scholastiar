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
- primary_role: candidate, employer, admin
- timezone
- locale
- onboarding_completed
- created_at
- updated_at

Relationships:

- one auth user has one user profile
- user can have candidate profile and/or employer memberships

## Shared Opportunity Card And Board Tables

These tables support consistent opportunity cards across jobs, universities, scholarships, fellowships, grants, competitions, conferences/training, and awards.

### opportunity_card_metrics

Purpose: Stores computed card-level decision signals for apply-able opportunities.

Key fields:

- id
- opportunity_type: job, university, scholarship, fellowship, grant, competition, conference_training, award
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

Purpose: Maps one platform user/company to customer records across Stripe, Paystack, and Flutterwave.

Key fields:

- id
- owner_type: user, employer_company, provider
- owner_id
- provider: stripe, paystack, flutterwave
- provider_customer_id
- status
- created_at
- updated_at

### payment_attempts

Purpose: Tracks checkout/payment attempts across providers and prevents duplicate charges during fallback.

Key fields:

- id
- user_id
- subscription_id
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

Roles:

- candidate
- employer_member
- employer_admin
- support_admin
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

Purpose: Store work authorization, sponsorship, and relocation needs.

Key fields:

- id
- candidate_profile_id
- passport_country_id
- current_visa_status
- needs_sponsorship boolean
- willing_to_relocate boolean
- target_country_ids uuid[]
- work_authorization_notes
- relocation_preferences jsonb
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
- seniority_levels text[]
- salary_min
- salary_currency
- work_modes text[]
- target_country_ids uuid[]
- preferred_job_types text[]

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
- sponsorship_policy
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

Purpose: Main job listing table.

Key fields:

- id
- employer_company_id
- title
- slug
- description
- employment_type
- seniority_level
- work_mode
- country_id
- city_id
- salary_min
- salary_max
- salary_currency
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

### job_sponsorship_metadata

Purpose: Visa sponsorship and relocation details.

Key fields:

- id
- job_id
- sponsorship_status
- relocation_support_available boolean
- open_to_international_applicants boolean
- target_visa_types text[]
- sponsorship_countries uuid[]
- notes
- employer_confirmed boolean

Sponsorship statuses:

- available
- not_available
- open_to_discussion
- work_authorization_required
- unknown

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
- channel
- notification_type
- enabled boolean

### notification_delivery_logs

Purpose: Email/push delivery logs.

Key fields:

- id
- notification_id
- channel
- provider
- status
- error
- created_at

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
- grants
- fellowships
- awards
- competitions
- conferences/training
- discovery engine
- Signia
- AI Apply Agent
- Apply For Me
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
- job_sponsorship_metadata.sponsorship_status
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
- visa profiles
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

### Step 4: Jobs And Sponsorship

Build:

- jobs
- requirements
- sponsorship metadata
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

## Final Principle

The database should make the product easier to evolve, not harder.

The unified platform should be strong enough to run premium opportunity services while preserving shared identity, document, AI, messaging, notification, billing, and audit foundations without corrupting domain boundaries.
