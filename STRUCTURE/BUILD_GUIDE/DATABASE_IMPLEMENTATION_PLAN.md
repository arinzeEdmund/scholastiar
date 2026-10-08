# Database Implementation Plan

Status: Supabase build order

Source architecture: `DATABASE/db.md`

## Principles

- Create tables in dependency order.
- Enable RLS before exposing routes.
- Add indexes with the tables they support.
- Keep migrations small and reversible where practical.
- Seed only realistic, non-sensitive development data.

## Migration Order

### 1. Extensions And Shared References

- enable UUID generation
- countries
- cities
- audit_logs

### 2. Identity

- user_profiles
- user_roles
- employer_memberships shell if needed for policies

### 3. Candidate Foundation

- candidate_profiles
- candidate_onboarding_sessions
- candidate_visa_profiles
- education_records
- work_experiences
- candidate_skills
- certifications
- career_preferences

### 4. Employer Foundation

- employer_companies
- employer_memberships
- employer_verification_records
- screening_question_sets

### 5. Jobs

- jobs
- job_requirements
- job_work_eligibility
- post_study_permit_types
- job_screening_questions
- saved_jobs
- job_match_scores

### 5A. Shared Opportunity Card And Board Metadata

- opportunity_card_metrics
- saved_opportunities
- ai_apply_board_items
- apply_for_me_board_items
- subscription_feature_entitlements
- opportunity_board_usage

### 6. Applications

- job_applications
- application_answers
- application_status_history
- cover_letters
- employer_pipeline_notes

### 7. AI And CV

- ai_prompts
- ai_prompt_versions
- ai_provider_configs
- ai_provider_attempts
- ai_provider_failures
- ai_generations
- ai_generation_sources
- ai_review_results
- cv_versions
- cv_sections
- cv_exports

### 8. Documents And Media

- documents
- document_versions
- document_access_grants
- document_access_logs
- personality_cv_profiles
- personality_cv_videos
- personality_cv_views
- signia_profiles
- signia_sections
- signia_social_links
- signia_projects
- signia_project_links
- signia_media_items
- signia_document_links
- signia_skill_evidence
- signia_visibility_settings

### 8A. Signia Search And Employer Discovery

- signia_search_indexes
- signia_employer_searches
- signia_profile_views
- signia_ai_summaries

### 9. Messaging And Notifications

- message_threads
- messages
- message_attachments
- interview_invitations
- notifications
- notification_preferences
- notification_delivery_logs
- email_templates
- email_campaigns
- email_events
- email_deliveries
- email_preferences
- email_digest_schedules
- email_suppression_rules
- email_conversion_events
- email_recommendation_snapshots

### 10. Billing, Analytics, Admin

- plans
- plan_prices
- feature_entitlements
- subscriptions
- usage_events
- usage_limits
- invoices
- payment_provider_customers
- payment_attempts
- payment_webhook_events
- checkout_sessions
- credits
- campaign_purchases
- analytics_events
- candidate_metrics
- employer_metrics
- moderation_reports
- moderation_actions
- support_notes
- platform_settings

## Storage Buckets

Recommended buckets:

- `candidate-documents`
- `generated-cvs`
- `personality-cv`
- `signia-media`
- `employer-assets`
- `message-attachments`

All buckets should be private by default.

## Seed Data

Seed:

- countries/cities
- sample employer companies
- sample jobs
- sample candidates
- sample applications
- plans

Do not seed fake sensitive IDs, passports, or real personal data.
