-- ────────────────────────────────────────────────────────────────
-- 001 Identity and Access
-- user_profiles, user_roles, audit_logs, new-user trigger
-- ────────────────────────────────────────────────────────────────

-- user_profiles --------------------------------------------------
create table if not exists user_profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null unique references auth.users(id) on delete cascade,
  full_name       text,
  avatar_url      text,
  primary_role    text not null default 'candidate'
                  check (primary_role in ('candidate','employer','admin')),
  timezone        text,
  locale          text not null default 'en',
  onboarding_completed boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists user_profiles_user_id_idx on user_profiles(user_id);

alter table user_profiles enable row level security;

create policy "user_profiles: owner can read"
  on user_profiles for select
  using (auth.uid() = user_id);

create policy "user_profiles: owner can update"
  on user_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- user_roles -----------------------------------------------------
create table if not exists user_roles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null check (role in (
                'candidate','employer_member','employer_admin',
                'support_admin','platform_admin','super_admin')),
  granted_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

create index if not exists user_roles_user_id_idx on user_roles(user_id);

alter table user_roles enable row level security;

create policy "user_roles: owner can read own"
  on user_roles for select
  using (auth.uid() = user_id);

-- audit_logs -----------------------------------------------------
create table if not exists audit_logs (
  id            uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id),
  action        text not null,
  entity_type   text,
  entity_id     uuid,
  before_data   jsonb,
  after_data    jsonb,
  ip_address    text,
  user_agent    text,
  created_at    timestamptz not null default now()
);

alter table audit_logs enable row level security;
-- Audit logs are written server-side via service role only; no client policies.

-- Auto-create user_profile on signup ----------------------------
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into user_profiles (user_id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- updated_at helper ---------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_profiles_updated_at
  before update on user_profiles
  for each row execute procedure set_updated_at();
