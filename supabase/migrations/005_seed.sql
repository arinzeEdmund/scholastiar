-- ────────────────────────────────────────────────────────────────
-- 005 Seed Data — development only
-- Run this ONLY in development/staging environments.
-- ────────────────────────────────────────────────────────────────

-- Seed employer companies --------------------------------------
insert into employer_companies
  (id, name, slug, website_url, industry, company_size,
   headquarters_country, headquarters_city, description,
   sponsorship_policy, verification_status)
values
  (
    'aaaaaaaa-0001-0000-0000-000000000001',
    'Luminary Tech', 'luminary-tech',
    'https://luminarytech.example', 'Software & Technology', '201-500',
    'United Kingdom', 'London',
    'A London-based software company building cloud infrastructure products. Active visa sponsor.',
    'available', 'verified'
  ),
  (
    'aaaaaaaa-0001-0000-0000-000000000002',
    'MedCore Health', 'medcore-health',
    'https://medcorehealth.example', 'Healthcare', '501-1000',
    'Canada', 'Toronto',
    'Healthcare technology company delivering AI-powered diagnostics tools across North America.',
    'available', 'verified'
  ),
  (
    'aaaaaaaa-0001-0000-0000-000000000003',
    'Atlas Engineering', 'atlas-engineering',
    'https://atlasengineering.example', 'Engineering & Construction', '1001-5000',
    'Germany', 'Berlin',
    'European civil and structural engineering firm with projects across the EU.',
    'open_to_discussion', 'verified'
  ),
  (
    'aaaaaaaa-0001-0000-0000-000000000004',
    'Orbital Labs', 'orbital-labs',
    'https://orbitallabs.example', 'Software & Technology', '11-50',
    'Netherlands', 'Amsterdam',
    'Remote-first product startup building developer tooling. We hire globally.',
    'available', 'verified'
  ),
  (
    'aaaaaaaa-0001-0000-0000-000000000005',
    'Greenfield Retail', 'greenfield-retail',
    'https://greenfieldretail.example', 'Retail & E-commerce', '5001-10000',
    'United States', 'New York',
    'Large retail chain. We primarily hire locally; limited sponsorship available.',
    'not_available', 'verified'
  )
on conflict (id) do nothing;

-- Seed jobs ---------------------------------------------------
insert into jobs
  (id, employer_company_id, title, slug, description,
   employment_type, seniority_level, work_mode,
   country, city, salary_min, salary_max, salary_currency,
   salary_disclosed, application_deadline, status, published_at)
values
  (
    'bbbbbbbb-0001-0000-0000-000000000001',
    'aaaaaaaa-0001-0000-0000-000000000001',
    'Senior Backend Engineer (Visa Sponsored)',
    'senior-backend-engineer-luminary',
    $$Luminary Tech is looking for a Senior Backend Engineer to join our platform team in London.

What you will do:
- Design and own distributed services handling millions of requests
- Collaborate with product and infrastructure on reliability and performance
- Mentor junior engineers and contribute to technical standards

What we offer:
- Tier 2 visa sponsorship available
- Relocation package to London
- Competitive salary + equity$$,
    'full_time', 'senior', 'on_site',
    'United Kingdom', 'London',
    90000, 120000, 'GBP', true,
    current_date + interval '45 days',
    'active', now()
  ),
  (
    'bbbbbbbb-0001-0000-0000-000000000002',
    'aaaaaaaa-0001-0000-0000-000000000001',
    'Product Designer',
    'product-designer-luminary',
    $$We are hiring a Product Designer to shape our customer-facing products.

You will work closely with engineers and PMs to deliver clean, accessible UI.

Requirements:
- 3+ years of product design experience
- Strong Figma skills
- Experience designing data-dense interfaces$$,
    'full_time', 'mid', 'hybrid',
    'United Kingdom', 'London',
    65000, 85000, 'GBP', true,
    current_date + interval '30 days',
    'active', now()
  ),
  (
    'bbbbbbbb-0001-0000-0000-000000000003',
    'aaaaaaaa-0001-0000-0000-000000000002',
    'Clinical Data Analyst (LMIA Supported)',
    'clinical-data-analyst-medcore',
    $$MedCore Health is expanding its analytics team in Toronto.

This role supports LMIA-based work permit applications for international candidates.

Responsibilities:
- Analyse patient outcome datasets
- Build dashboards for clinical leadership
- Collaborate with data engineering$$,
    'full_time', 'mid', 'hybrid',
    'Canada', 'Toronto',
    70000, 90000, 'CAD', true,
    current_date + interval '60 days',
    'active', now()
  ),
  (
    'bbbbbbbb-0001-0000-0000-000000000004',
    'aaaaaaaa-0001-0000-0000-000000000003',
    'Graduate Structural Engineer',
    'graduate-structural-engineer-atlas',
    $$Atlas Engineering welcomes applications from recent graduates in Civil or Structural Engineering.

What you need:
- Bachelor or Master in Civil/Structural Engineering
- EU Blue Card eligibility or existing right to work in Germany
- Basic German is a plus$$,
    'full_time', 'junior', 'on_site',
    'Germany', 'Berlin',
    42000, 55000, 'EUR', true,
    current_date + interval '90 days',
    'active', now()
  ),
  (
    'bbbbbbbb-0001-0000-0000-000000000005',
    'aaaaaaaa-0001-0000-0000-000000000004',
    'Senior Full-Stack Engineer (Remote, Global)',
    'senior-fullstack-remote-orbital',
    $$Orbital Labs hires fully remote across timezones.

Stack: TypeScript, Next.js, PostgreSQL, Supabase

What we offer:
- Remote-first, async-first culture
- Competitive USD salary regardless of location
- No sponsorship required, hire globally$$,
    'full_time', 'senior', 'remote',
    'Netherlands', 'Amsterdam',
    110000, 145000, 'USD', true,
    current_date + interval '30 days',
    'active', now()
  ),
  (
    'bbbbbbbb-0001-0000-0000-000000000006',
    'aaaaaaaa-0001-0000-0000-000000000005',
    'Retail Operations Manager',
    'retail-operations-manager-greenfield',
    $$Greenfield Retail is hiring an Operations Manager for our New York flagship.

Note: This role is open to US residents and US work-authorized candidates only. We are not offering sponsorship for this position.$$,
    'full_time', 'mid', 'on_site',
    'United States', 'New York',
    70000, 90000, 'USD', true,
    current_date + interval '21 days',
    'active', now()
  )
on conflict (id) do nothing;

-- Seed sponsorship metadata -----------------------------------
insert into job_sponsorship_metadata
  (job_id, sponsorship_status, relocation_support_available,
   open_to_international_applicants, employer_confirmed)
values
  ('bbbbbbbb-0001-0000-0000-000000000001', 'available',          true,  true,  true),
  ('bbbbbbbb-0001-0000-0000-000000000002', 'available',          false, true,  true),
  ('bbbbbbbb-0001-0000-0000-000000000003', 'available',          false, true,  true),
  ('bbbbbbbb-0001-0000-0000-000000000004', 'open_to_discussion', false, true,  true),
  ('bbbbbbbb-0001-0000-0000-000000000005', 'not_available',      false, true,  true),
  ('bbbbbbbb-0001-0000-0000-000000000006', 'not_available',      false, false, true)
on conflict (job_id) do nothing;

-- Seed job requirements ---------------------------------------
insert into job_requirements (job_id, requirement_type, requirement_text, importance) values
  ('bbbbbbbb-0001-0000-0000-000000000001', 'skill',      'Go or Rust',                    'required'),
  ('bbbbbbbb-0001-0000-0000-000000000001', 'experience', '5+ years backend engineering',  'required'),
  ('bbbbbbbb-0001-0000-0000-000000000001', 'skill',      'Distributed systems',           'required'),
  ('bbbbbbbb-0001-0000-0000-000000000001', 'skill',      'Kubernetes',                    'preferred'),
  ('bbbbbbbb-0001-0000-0000-000000000002', 'skill',      'Figma',                         'required'),
  ('bbbbbbbb-0001-0000-0000-000000000002', 'experience', '3+ years product design',       'required'),
  ('bbbbbbbb-0001-0000-0000-000000000003', 'skill',      'SQL',                           'required'),
  ('bbbbbbbb-0001-0000-0000-000000000003', 'skill',      'Python or R',                   'required'),
  ('bbbbbbbb-0001-0000-0000-000000000004', 'education',  'Bachelor in Civil Engineering', 'required'),
  ('bbbbbbbb-0001-0000-0000-000000000005', 'skill',      'TypeScript',                    'required'),
  ('bbbbbbbb-0001-0000-0000-000000000005', 'skill',      'React / Next.js',               'required'),
  ('bbbbbbbb-0001-0000-0000-000000000005', 'skill',      'PostgreSQL',                    'required'),
  ('bbbbbbbb-0001-0000-0000-000000000006', 'experience', '3+ years retail operations',    'required')
on conflict do nothing;
