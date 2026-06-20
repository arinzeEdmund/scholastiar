-- ────────────────────────────────────────────────────────────────
-- 006 Applications
-- job_applications, application_answers, application_status_history
-- ────────────────────────────────────────────────────────────────

create table if not exists job_applications (
  id                    uuid primary key default gen_random_uuid(),
  job_id                uuid not null references jobs(id) on delete cascade,
  candidate_profile_id  uuid not null references candidate_profiles(id) on delete cascade,
  cover_letter          text,
  additional_info       text,
  status                text not null default 'submitted'
                        check (status in (
                          'draft','submitted','under_review',
                          'shortlisted','interviewed','offered',
                          'rejected','withdrawn'
                        )),
  consent_given         boolean not null default false,
  ai_assisted           boolean not null default false,
  submitted_at          timestamptz default now(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (job_id, candidate_profile_id)
);

create index if not exists job_applications_job_id_idx on job_applications(job_id);
create index if not exists job_applications_candidate_profile_id_idx on job_applications(candidate_profile_id);
create index if not exists job_applications_status_idx on job_applications(status);

alter table job_applications enable row level security;

-- Candidates can read/insert/update their own applications
create policy "job_applications: candidate owns own"
  on job_applications for all
  using (
    exists (
      select 1 from candidate_profiles cp
      where cp.id = candidate_profile_id
        and cp.user_id = auth.uid()
    )
  );

-- Employer members can read applications for their jobs
create policy "job_applications: employer can read own job applications"
  on job_applications for select
  using (
    exists (
      select 1 from jobs j
      join employer_memberships em on em.employer_company_id = j.employer_company_id
      where j.id = job_id
        and em.user_id = auth.uid()
        and em.status = 'active'
    )
  );

create trigger job_applications_updated_at
  before update on job_applications
  for each row execute procedure set_updated_at();

-- application_answers -----------------------------------------
create table if not exists application_answers (
  id                    uuid primary key default gen_random_uuid(),
  job_application_id    uuid not null references job_applications(id) on delete cascade,
  question_id           uuid references job_screening_questions(id) on delete set null,
  question_text         text not null,
  answer_text           text,
  created_at            timestamptz not null default now()
);

alter table application_answers enable row level security;

create policy "application_answers: candidate owns via application"
  on application_answers for all
  using (
    exists (
      select 1 from job_applications ja
      join candidate_profiles cp on cp.id = ja.candidate_profile_id
      where ja.id = job_application_id
        and cp.user_id = auth.uid()
    )
  );

create policy "application_answers: employer can read via job"
  on application_answers for select
  using (
    exists (
      select 1 from job_applications ja
      join jobs j on j.id = ja.job_id
      join employer_memberships em on em.employer_company_id = j.employer_company_id
      where ja.id = job_application_id
        and em.user_id = auth.uid()
        and em.status = 'active'
    )
  );

-- application_status_history ----------------------------------
create table if not exists application_status_history (
  id                  uuid primary key default gen_random_uuid(),
  job_application_id  uuid not null references job_applications(id) on delete cascade,
  status              text not null,
  note                text,
  changed_by          uuid references auth.users(id),
  changed_at          timestamptz not null default now()
);

alter table application_status_history enable row level security;

create policy "application_status_history: candidate reads own"
  on application_status_history for select
  using (
    exists (
      select 1 from job_applications ja
      join candidate_profiles cp on cp.id = ja.candidate_profile_id
      where ja.id = job_application_id
        and cp.user_id = auth.uid()
    )
  );

create policy "application_status_history: employer reads own job"
  on application_status_history for select
  using (
    exists (
      select 1 from job_applications ja
      join jobs j on j.id = ja.job_id
      join employer_memberships em on em.employer_company_id = j.employer_company_id
      where ja.id = job_application_id
        and em.user_id = auth.uid()
        and em.status = 'active'
    )
  );
