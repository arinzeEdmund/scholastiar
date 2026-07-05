-- ============================================================
-- 009_candidate_seed.sql
-- Demo candidate profile seed — makes discover/dashboard/jobs
-- show realistic match scores and populated profile sections.
--
-- HOW TO RUN:
--   1. Go to Supabase Dashboard → Authentication → Users
--   2. Copy your user UUID (looks like a1b2c3d4-...)
--   3. Replace 'YOUR-USER-UUID-HERE' below with that UUID
--   4. Paste this entire file into the SQL Editor and run
-- ============================================================

do $$
declare
  v_user_id        uuid := 'YOUR-USER-UUID-HERE';
  v_profile_id     uuid;
begin

  -- ── 1. candidate_profiles ──────────────────────────────────
  insert into candidate_profiles (
    user_id,
    preferred_name,
    headline,
    professional_summary,
    nationality,
    current_location_country,
    current_location_city,
    languages,
    profile_visibility,
    profile_completion_score
  ) values (
    v_user_id,
    'Alex Osei',
    'Full Stack Engineer · Open to Global Relocation · Visa Sponsorship Required',
    $bio$
I'm a full-stack software engineer with 5 years of experience building scalable web applications and APIs.
I've worked across fintech, edtech, and SaaS products, primarily in TypeScript, React, and Node.js.
I'm actively exploring roles in the UK, Canada, Germany, and the UAE that offer visa sponsorship.
I thrive in remote-first or hybrid teams and care deeply about developer experience and product quality.
    $bio$,
    'Ghana',
    'Ghana',
    'Accra',
    ARRAY['English', 'French (basic)'],
    'employers',
    85
  )
  on conflict (user_id) do update set
    preferred_name           = excluded.preferred_name,
    headline                 = excluded.headline,
    professional_summary     = excluded.professional_summary,
    nationality              = excluded.nationality,
    current_location_country = excluded.current_location_country,
    current_location_city    = excluded.current_location_city,
    languages                = excluded.languages,
    profile_visibility       = excluded.profile_visibility,
    profile_completion_score = excluded.profile_completion_score
  returning id into v_profile_id;

  if v_profile_id is null then
    select id into v_profile_id from candidate_profiles where user_id = v_user_id;
  end if;

  -- ── 2. candidate_visa_profiles ─────────────────────────────
  insert into candidate_visa_profiles (
    candidate_profile_id,
    passport_country,
    current_visa_status,
    needs_sponsorship,
    willing_to_relocate,
    target_countries,
    work_authorization_notes
  ) values (
    v_profile_id,
    'Ghana',
    'home_country',
    true,
    true,
    ARRAY['United Kingdom', 'Canada', 'Germany', 'Netherlands', 'United Arab Emirates', 'Singapore', 'Australia', 'Switzerland'],
    'I hold a Ghanaian passport and require a work visa for all destinations on my target list. I am open to skilled worker visa, tech visa, and employer-sponsored visa routes.'
  )
  on conflict (candidate_profile_id) do update set
    passport_country          = excluded.passport_country,
    current_visa_status       = excluded.current_visa_status,
    needs_sponsorship         = excluded.needs_sponsorship,
    willing_to_relocate       = excluded.willing_to_relocate,
    target_countries          = excluded.target_countries,
    work_authorization_notes  = excluded.work_authorization_notes;

  -- ── 3. education_records ───────────────────────────────────
  insert into education_records (
    candidate_profile_id, institution_name, country, degree_level,
    field_of_study, qualification_name, start_date, end_date, is_current, grade, description
  ) values
  (
    v_profile_id,
    'University of Ghana',
    'Ghana',
    'bachelor',
    'Computer Science',
    'BSc Computer Science',
    '2016-09-01',
    '2020-06-30',
    false,
    'First Class Honours',
    'Focused on software engineering, algorithms, and distributed systems. Final-year project: real-time collaborative document editor using WebSockets and Node.js.'
  ),
  (
    v_profile_id,
    'AWS Training & Certification',
    'Online',
    'certification',
    'Cloud Architecture',
    'AWS Certified Solutions Architect – Associate',
    '2022-03-01',
    '2022-05-15',
    false,
    'Passed',
    'Covered VPC, EC2, RDS, S3, Lambda, CloudFormation, and IAM. Score: 812/1000.'
  )
  on conflict do nothing;

  -- ── 4. work_experiences ────────────────────────────────────
  insert into work_experiences (
    candidate_profile_id, company_name, job_title, country, city,
    start_date, end_date, is_current, responsibilities, achievements, tools_used, industry
  ) values
  (
    v_profile_id,
    'Paystack (Stripe company)',
    'Software Engineer',
    'Nigeria',
    'Lagos',
    '2022-01-10',
    null,
    true,
    $resp1$
- Build and maintain payment APIs serving 250k+ merchants across Africa
- Own the TypeScript/Node.js backend for dispute resolution and refund flows
- Lead front-end work on the merchant dashboard using Next.js and React Query
- Collaborate with product and design on new checkout experiences
    $resp1$,
    $ach1$
- Reduced average API response time from 420ms to 180ms by introducing Redis caching
- Shipped a refund self-service feature that reduced support tickets by 34%
- Mentored 2 junior engineers through onboarding and first production deployments
    $ach1$,
    ARRAY['TypeScript', 'Node.js', 'React', 'Next.js', 'PostgreSQL', 'Redis', 'Docker', 'GitHub Actions'],
    'Fintech'
  ),
  (
    v_profile_id,
    'Farmerline',
    'Junior Software Developer',
    'Ghana',
    'Accra',
    '2020-08-01',
    '2021-12-31',
    false,
    $resp2$
- Developed farmer-facing mobile web features using React and REST APIs
- Maintained PostgreSQL database schemas and wrote migration scripts
- Built internal admin dashboards for field agent management
    $resp2$,
    $ach2$
- Shipped crop advisory feature used by 12,000 farmers in first 3 months
- Cut database query time by 40% through targeted indexing
    $ach2$,
    ARRAY['React', 'JavaScript', 'Python', 'PostgreSQL', 'Django', 'Heroku'],
    'AgriTech'
  )
  on conflict do nothing;

  -- ── 5. candidate_skills ────────────────────────────────────
  -- Delete existing skills first to avoid duplicates on re-run
  delete from candidate_skills where candidate_profile_id = v_profile_id;

  insert into candidate_skills (
    candidate_profile_id, skill_name, skill_type, proficiency_level, years_experience, source
  ) values
  -- Core languages & runtimes
  (v_profile_id, 'TypeScript',        'technical', 'expert',       4.0, 'manual'),
  (v_profile_id, 'JavaScript',        'technical', 'expert',       5.5, 'manual'),
  (v_profile_id, 'Python',            'technical', 'advanced',     3.0, 'manual'),
  -- Frameworks
  (v_profile_id, 'React',             'technical', 'expert',       4.5, 'manual'),
  (v_profile_id, 'Next.js',           'technical', 'advanced',     3.0, 'manual'),
  (v_profile_id, 'Node.js',           'technical', 'expert',       4.0, 'manual'),
  -- Databases
  (v_profile_id, 'PostgreSQL',        'technical', 'advanced',     4.0, 'manual'),
  (v_profile_id, 'Redis',             'technical', 'intermediate', 2.0, 'manual'),
  -- Infrastructure
  (v_profile_id, 'Docker',            'technical', 'advanced',     3.0, 'manual'),
  (v_profile_id, 'AWS',               'technical', 'intermediate', 2.5, 'manual'),
  (v_profile_id, 'CI/CD',             'technical', 'intermediate', 2.0, 'manual'),
  -- Other technical
  (v_profile_id, 'REST APIs',         'technical', 'expert',       5.0, 'manual'),
  (v_profile_id, 'GraphQL',           'technical', 'intermediate', 1.5, 'manual'),
  (v_profile_id, 'SQL',               'technical', 'advanced',     5.0, 'manual'),
  -- Soft skills
  (v_profile_id, 'Technical Writing', 'soft',      'advanced',     3.0, 'manual'),
  (v_profile_id, 'Cross-team Collaboration', 'soft', 'advanced',  4.0, 'manual'),
  -- Languages
  (v_profile_id, 'English',           'language',  'expert',       null, 'manual'),
  (v_profile_id, 'French',            'language',  'beginner',     null, 'manual');

  -- ── 6. career_preferences ──────────────────────────────────
  insert into career_preferences (
    candidate_profile_id,
    target_roles,
    industries,
    seniority_levels,
    salary_min,
    salary_currency,
    work_modes,
    target_countries,
    preferred_job_types
  ) values (
    v_profile_id,
    ARRAY[
      'Software Engineer', 'Full Stack Engineer', 'Full Stack Developer',
      'Backend Engineer', 'Senior Software Engineer', 'Node.js Developer',
      'TypeScript Developer', 'React Developer'
    ],
    ARRAY['Fintech', 'SaaS', 'EdTech', 'Technology', 'Developer Tools'],
    ARRAY['mid', 'senior'],
    65000,
    'GBP',
    ARRAY['remote', 'hybrid'],
    ARRAY[
      'United Kingdom', 'Canada', 'Germany', 'Netherlands',
      'United Arab Emirates', 'Singapore', 'Australia', 'Switzerland'
    ],
    ARRAY['full_time']
  )
  on conflict (candidate_profile_id) do update set
    target_roles       = excluded.target_roles,
    industries         = excluded.industries,
    seniority_levels   = excluded.seniority_levels,
    salary_min         = excluded.salary_min,
    salary_currency    = excluded.salary_currency,
    work_modes         = excluded.work_modes,
    target_countries   = excluded.target_countries,
    preferred_job_types = excluded.preferred_job_types;

  raise notice 'Candidate seed complete for user % (profile %)', v_user_id, v_profile_id;

end $$;
