-- ────────────────────────────────────────────────────────────────
-- 007 Employer job management
-- Extends employer_companies with onboarding fields,
-- adds job_status_history for audit trail
-- ────────────────────────────────────────────────────────────────

-- Add display fields to employer_companies if not present
alter table employer_companies
  add column if not exists logo_url          text,
  add column if not exists tagline           text,
  add column if not exists employee_count    text,
  add column if not exists founded_year      int,
  add column if not exists linkedin_url      text,
  add column if not exists onboarding_done   boolean not null default false;

-- job_status_history for admin audit trail
create table if not exists job_status_history (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references jobs(id) on delete cascade,
  old_status  text,
  new_status  text not null,
  note        text,
  changed_by  uuid references auth.users(id),
  changed_at  timestamptz not null default now()
);

alter table job_status_history enable row level security;

create policy "job_status_history: employer members can read own"
  on job_status_history for select
  using (
    exists (
      select 1 from jobs j
      join employer_memberships em on em.employer_company_id = j.employer_company_id
      where j.id = job_id
        and em.user_id = auth.uid()
        and em.status = 'active'
    )
  );
