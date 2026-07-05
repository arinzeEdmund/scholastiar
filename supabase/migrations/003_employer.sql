-- ────────────────────────────────────────────────────────────────
-- 003 Employer Foundation
-- employer_companies, employer_memberships,
-- employer_verification_records
-- ────────────────────────────────────────────────────────────────

-- employer_companies -------------------------------------------
create table if not exists employer_companies (
  id                      uuid primary key default gen_random_uuid(),
  name                    text not null,
  slug                    text unique,
  website_url             text,
  industry                text,
  company_size            text,
  headquarters_country    text,
  headquarters_city       text,
  description             text,
  sponsorship_policy      text not null default 'unknown'
                          check (sponsorship_policy in
                            ('available','not_available','open_to_discussion','unknown')),
  verification_status     text not null default 'unverified'
                          check (verification_status in
                            ('unverified','pending','verified','rejected','suspended')),
  created_by              uuid references auth.users(id),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists employer_companies_slug_idx on employer_companies(slug);

alter table employer_companies enable row level security;

-- Only policy that doesn't reference employer_memberships yet
create policy "employer_companies: public can read verified"
  on employer_companies for select
  using (verification_status = 'verified');

-- Any authenticated user can insert (they become owner via membership below)
create policy "employer_companies: authenticated can insert"
  on employer_companies for insert
  with check (auth.uid() is not null);

create trigger employer_companies_updated_at
  before update on employer_companies
  for each row execute procedure set_updated_at();

-- employer_memberships -----------------------------------------
-- Created before the cross-referencing policies on employer_companies
create table if not exists employer_memberships (
  id                    uuid primary key default gen_random_uuid(),
  employer_company_id   uuid not null references employer_companies(id) on delete cascade,
  user_id               uuid not null references auth.users(id) on delete cascade,
  role                  text not null default 'recruiter'
                        check (role in ('owner','admin','recruiter','hiring_manager','viewer')),
  status                text not null default 'active'
                        check (status in ('active','invited','suspended','removed')),
  invited_by            uuid references auth.users(id),
  joined_at             timestamptz default now(),
  unique (employer_company_id, user_id)
);

create index if not exists employer_memberships_user_id_idx on employer_memberships(user_id);
create index if not exists employer_memberships_company_id_idx on employer_memberships(employer_company_id);

alter table employer_memberships enable row level security;

create policy "employer_memberships: user can read own"
  on employer_memberships for select
  using (auth.uid() = user_id);

create policy "employer_memberships: user can insert own"
  on employer_memberships for insert
  with check (auth.uid() = user_id);

-- Cross-referencing policies on employer_companies
-- (employer_memberships now exists so these won't fail)
create policy "employer_companies: members can read own"
  on employer_companies for select
  using (
    exists (
      select 1 from employer_memberships em
      where em.employer_company_id = id
        and em.user_id = auth.uid()
        and em.status = 'active'
    )
  );

create policy "employer_companies: owners can update"
  on employer_companies for update
  using (
    exists (
      select 1 from employer_memberships em
      where em.employer_company_id = id
        and em.user_id = auth.uid()
        and em.role in ('owner','admin')
        and em.status = 'active'
    )
  );

-- employer_verification_records --------------------------------
create table if not exists employer_verification_records (
  id                    uuid primary key default gen_random_uuid(),
  employer_company_id   uuid not null references employer_companies(id) on delete cascade,
  verification_type     text not null,
  status                text not null default 'pending'
                        check (status in ('pending','approved','rejected')),
  reviewed_by           uuid references auth.users(id),
  notes                 text,
  created_at            timestamptz not null default now(),
  reviewed_at           timestamptz
);

alter table employer_verification_records enable row level security;
-- Readable only via service role (admin only)
