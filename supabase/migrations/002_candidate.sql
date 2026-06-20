-- ────────────────────────────────────────────────────────────────
-- 002 Candidate Foundation
-- candidate_profiles, onboarding_sessions, visa_profiles,
-- education_records, work_experiences, candidate_skills,
-- career_preferences
-- ────────────────────────────────────────────────────────────────

-- candidate_profiles --------------------------------------------
create table if not exists candidate_profiles (
  id                          uuid primary key default gen_random_uuid(),
  user_id                     uuid not null unique references auth.users(id) on delete cascade,
  preferred_name              text,
  headline                    text,
  professional_summary        text,
  phone                       text,
  website_url                 text,
  linkedin_url                text,
  portfolio_url               text,
  nationality                 text,
  date_of_birth               date,
  current_location_country    text,
  current_location_city       text,
  languages                   text[] default '{}',
  profile_visibility          text not null default 'private'
                              check (profile_visibility in ('private','employers','public')),
  profile_completion_score    int not null default 0,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists candidate_profiles_user_id_idx on candidate_profiles(user_id);

alter table candidate_profiles enable row level security;

create policy "candidate_profiles: owner can read"
  on candidate_profiles for select
  using (auth.uid() = user_id);

create policy "candidate_profiles: owner can insert"
  on candidate_profiles for insert
  with check (auth.uid() = user_id);

create policy "candidate_profiles: owner can update"
  on candidate_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger candidate_profiles_updated_at
  before update on candidate_profiles
  for each row execute procedure set_updated_at();

-- candidate_onboarding_sessions ---------------------------------
create table if not exists candidate_onboarding_sessions (
  id                    uuid primary key default gen_random_uuid(),
  candidate_profile_id  uuid not null references candidate_profiles(id) on delete cascade,
  current_step          text not null default 'personal',
  completed_steps       text[] not null default '{}',
  completed_at          timestamptz,
  intelligence_summary  jsonb default '{}'::jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table candidate_onboarding_sessions enable row level security;

create policy "onboarding_sessions: owner via candidate_profile"
  on candidate_onboarding_sessions for all
  using (
    exists (
      select 1 from candidate_profiles cp
      where cp.id = candidate_profile_id
        and cp.user_id = auth.uid()
    )
  );

create trigger candidate_onboarding_sessions_updated_at
  before update on candidate_onboarding_sessions
  for each row execute procedure set_updated_at();

-- candidate_visa_profiles ---------------------------------------
create table if not exists candidate_visa_profiles (
  id                        uuid primary key default gen_random_uuid(),
  candidate_profile_id      uuid not null unique references candidate_profiles(id) on delete cascade,
  passport_country          text,
  current_visa_status       text,
  needs_sponsorship         boolean not null default false,
  willing_to_relocate       boolean not null default false,
  target_countries          text[] default '{}',
  work_authorization_notes  text,
  relocation_preferences    jsonb default '{}'::jsonb,
  updated_at                timestamptz not null default now()
);

alter table candidate_visa_profiles enable row level security;

create policy "visa_profiles: owner via candidate_profile"
  on candidate_visa_profiles for all
  using (
    exists (
      select 1 from candidate_profiles cp
      where cp.id = candidate_profile_id
        and cp.user_id = auth.uid()
    )
  );

create trigger candidate_visa_profiles_updated_at
  before update on candidate_visa_profiles
  for each row execute procedure set_updated_at();

-- education_records --------------------------------------------
create table if not exists education_records (
  id                    uuid primary key default gen_random_uuid(),
  candidate_profile_id  uuid not null references candidate_profiles(id) on delete cascade,
  institution_name      text not null,
  country               text,
  degree_level          text,
  field_of_study        text,
  qualification_name    text,
  start_date            date,
  end_date              date,
  is_current            boolean not null default false,
  grade                 text,
  description           text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table education_records enable row level security;

create policy "education_records: owner via candidate_profile"
  on education_records for all
  using (
    exists (
      select 1 from candidate_profiles cp
      where cp.id = candidate_profile_id
        and cp.user_id = auth.uid()
    )
  );

create trigger education_records_updated_at
  before update on education_records
  for each row execute procedure set_updated_at();

-- work_experiences ---------------------------------------------
create table if not exists work_experiences (
  id                    uuid primary key default gen_random_uuid(),
  candidate_profile_id  uuid not null references candidate_profiles(id) on delete cascade,
  company_name          text not null,
  job_title             text not null,
  country               text,
  city                  text,
  start_date            date,
  end_date              date,
  is_current            boolean not null default false,
  responsibilities      text,
  achievements          text,
  tools_used            text[] default '{}',
  industry              text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table work_experiences enable row level security;

create policy "work_experiences: owner via candidate_profile"
  on work_experiences for all
  using (
    exists (
      select 1 from candidate_profiles cp
      where cp.id = candidate_profile_id
        and cp.user_id = auth.uid()
    )
  );

create trigger work_experiences_updated_at
  before update on work_experiences
  for each row execute procedure set_updated_at();

-- candidate_skills ---------------------------------------------
create table if not exists candidate_skills (
  id                    uuid primary key default gen_random_uuid(),
  candidate_profile_id  uuid not null references candidate_profiles(id) on delete cascade,
  skill_name            text not null,
  skill_type            text not null default 'technical'
                        check (skill_type in ('technical','soft','language','tool','certification','other')),
  proficiency_level     text check (proficiency_level in ('beginner','intermediate','advanced','expert')),
  years_experience      numeric(4,1),
  source                text not null default 'manual'
                        check (source in ('manual','cv_import','ai_detected')),
  created_at            timestamptz not null default now()
);

alter table candidate_skills enable row level security;

create policy "candidate_skills: owner via candidate_profile"
  on candidate_skills for all
  using (
    exists (
      select 1 from candidate_profiles cp
      where cp.id = candidate_profile_id
        and cp.user_id = auth.uid()
    )
  );

-- career_preferences -------------------------------------------
create table if not exists career_preferences (
  id                    uuid primary key default gen_random_uuid(),
  candidate_profile_id  uuid not null unique references candidate_profiles(id) on delete cascade,
  target_roles          text[] default '{}',
  industries            text[] default '{}',
  seniority_levels      text[] default '{}',
  salary_min            numeric(12,2),
  salary_currency       text default 'USD',
  work_modes            text[] default '{}',
  target_countries      text[] default '{}',
  preferred_job_types   text[] default '{}',
  updated_at            timestamptz not null default now()
);

alter table career_preferences enable row level security;

create policy "career_preferences: owner via candidate_profile"
  on career_preferences for all
  using (
    exists (
      select 1 from candidate_profiles cp
      where cp.id = candidate_profile_id
        and cp.user_id = auth.uid()
    )
  );

create trigger career_preferences_updated_at
  before update on career_preferences
  for each row execute procedure set_updated_at();
