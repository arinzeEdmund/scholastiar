-- ────────────────────────────────────────────────────────────────
-- 004 Jobs
-- jobs, job_requirements, job_sponsorship_metadata,
-- job_screening_questions, saved_jobs
-- ────────────────────────────────────────────────────────────────

-- jobs ---------------------------------------------------------
create table if not exists jobs (
  id                    uuid primary key default gen_random_uuid(),
  employer_company_id   uuid not null references employer_companies(id) on delete cascade,
  title                 text not null,
  slug                  text,
  description           text not null,
  employment_type       text not null default 'full_time'
                        check (employment_type in
                          ('full_time','part_time','contract','internship','temporary','freelance')),
  seniority_level       text check (seniority_level in
                          ('junior','mid','senior','lead','principal','executive','any')),
  work_mode             text not null default 'on_site'
                        check (work_mode in ('on_site','remote','hybrid')),
  country               text,
  city                  text,
  salary_min            numeric(12,2),
  salary_max            numeric(12,2),
  salary_currency       text default 'USD',
  salary_disclosed      boolean not null default true,
  application_deadline  date,
  status                text not null default 'draft'
                        check (status in
                          ('draft','pending_review','active','paused','closed','rejected','archived')),
  created_by            uuid references auth.users(id),
  published_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists jobs_employer_company_id_idx on jobs(employer_company_id);
create index if not exists jobs_status_idx on jobs(status);
create index if not exists jobs_country_idx on jobs(country);
create index if not exists jobs_application_deadline_idx on jobs(application_deadline);

-- Full-text search index
create index if not exists jobs_fts_idx
  on jobs using gin(to_tsvector('english', title || ' ' || coalesce(description, '')));

alter table jobs enable row level security;

-- Public can see active jobs
create policy "jobs: public can read active"
  on jobs for select
  using (status = 'active');

-- Employer members can read their own jobs regardless of status
create policy "jobs: employer members can read own"
  on jobs for select
  using (
    exists (
      select 1 from employer_memberships em
      where em.employer_company_id = jobs.employer_company_id
        and em.user_id = auth.uid()
        and em.status = 'active'
    )
  );

-- Employer members (non-viewer) can insert/update
create policy "jobs: employer non-viewers can insert"
  on jobs for insert
  with check (
    exists (
      select 1 from employer_memberships em
      where em.employer_company_id = jobs.employer_company_id
        and em.user_id = auth.uid()
        and em.role in ('owner','admin','recruiter','hiring_manager')
        and em.status = 'active'
    )
  );

create policy "jobs: employer non-viewers can update"
  on jobs for update
  using (
    exists (
      select 1 from employer_memberships em
      where em.employer_company_id = jobs.employer_company_id
        and em.user_id = auth.uid()
        and em.role in ('owner','admin','recruiter','hiring_manager')
        and em.status = 'active'
    )
  );

create trigger jobs_updated_at
  before update on jobs
  for each row execute procedure set_updated_at();

-- job_requirements --------------------------------------------
create table if not exists job_requirements (
  id                uuid primary key default gen_random_uuid(),
  job_id            uuid not null references jobs(id) on delete cascade,
  requirement_type  text not null check (requirement_type in
                      ('skill','experience','education','language','certification','other')),
  requirement_text  text not null,
  importance        text not null default 'required'
                    check (importance in ('required','preferred','nice_to_have'))
);

alter table job_requirements enable row level security;

create policy "job_requirements: readable with active job"
  on job_requirements for select
  using (
    exists (
      select 1 from jobs j
      where j.id = job_id
        and (j.status = 'active' or exists (
          select 1 from employer_memberships em
          where em.employer_company_id = j.employer_company_id
            and em.user_id = auth.uid()
            and em.status = 'active'
        ))
    )
  );

create policy "job_requirements: employer non-viewers can write"
  on job_requirements for all
  using (
    exists (
      select 1 from jobs j
      join employer_memberships em on em.employer_company_id = j.employer_company_id
      where j.id = job_id
        and em.user_id = auth.uid()
        and em.role in ('owner','admin','recruiter','hiring_manager')
        and em.status = 'active'
    )
  );

-- job_sponsorship_metadata ------------------------------------
create table if not exists job_sponsorship_metadata (
  id                              uuid primary key default gen_random_uuid(),
  job_id                          uuid not null unique references jobs(id) on delete cascade,
  sponsorship_status              text not null default 'unknown'
                                  check (sponsorship_status in
                                    ('available','not_available','open_to_discussion',
                                     'work_authorization_required','unknown')),
  relocation_support_available    boolean not null default false,
  open_to_international_applicants boolean not null default false,
  target_visa_types               text[] default '{}',
  sponsorship_countries           text[] default '{}',
  notes                           text,
  employer_confirmed              boolean not null default false,
  updated_at                      timestamptz not null default now()
);

alter table job_sponsorship_metadata enable row level security;

create policy "job_sponsorship_metadata: readable with active job"
  on job_sponsorship_metadata for select
  using (
    exists (
      select 1 from jobs j
      where j.id = job_id
        and (j.status = 'active' or exists (
          select 1 from employer_memberships em
          where em.employer_company_id = j.employer_company_id
            and em.user_id = auth.uid()
            and em.status = 'active'
        ))
    )
  );

create policy "job_sponsorship_metadata: employer non-viewers can write"
  on job_sponsorship_metadata for all
  using (
    exists (
      select 1 from jobs j
      join employer_memberships em on em.employer_company_id = j.employer_company_id
      where j.id = job_id
        and em.user_id = auth.uid()
        and em.role in ('owner','admin','recruiter','hiring_manager')
        and em.status = 'active'
    )
  );

create trigger job_sponsorship_metadata_updated_at
  before update on job_sponsorship_metadata
  for each row execute procedure set_updated_at();

-- job_screening_questions -------------------------------------
create table if not exists job_screening_questions (
  id            uuid primary key default gen_random_uuid(),
  job_id        uuid not null references jobs(id) on delete cascade,
  question_text text not null,
  question_type text not null default 'text'
                check (question_type in ('text','yes_no','multiple_choice','number')),
  required      boolean not null default true,
  order_index   int not null default 0,
  metadata      jsonb default '{}'::jsonb
);

alter table job_screening_questions enable row level security;

create policy "job_screening_questions: readable with active job"
  on job_screening_questions for select
  using (
    exists (
      select 1 from jobs j where j.id = job_id and j.status = 'active'
    )
  );

-- saved_jobs --------------------------------------------------
create table if not exists saved_jobs (
  id                    uuid primary key default gen_random_uuid(),
  candidate_profile_id  uuid not null references candidate_profiles(id) on delete cascade,
  job_id                uuid not null references jobs(id) on delete cascade,
  created_at            timestamptz not null default now(),
  unique (candidate_profile_id, job_id)
);

create index if not exists saved_jobs_candidate_profile_id_idx on saved_jobs(candidate_profile_id);

alter table saved_jobs enable row level security;

create policy "saved_jobs: owner via candidate_profile"
  on saved_jobs for all
  using (
    exists (
      select 1 from candidate_profiles cp
      where cp.id = candidate_profile_id
        and cp.user_id = auth.uid()
    )
  );
