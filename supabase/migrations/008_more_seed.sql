-- ────────────────────────────────────────────────────────────────
-- 008 Extended Seed Data — development only
-- Adds more companies and jobs for full dashboard testing.
-- ────────────────────────────────────────────────────────────────

-- Additional employer companies --------------------------------
insert into employer_companies
  (id, name, slug, website_url, industry, company_size,
   headquarters_country, headquarters_city, description,
   sponsorship_policy, verification_status)
values
  (
    'aaaaaaaa-0002-0000-0000-000000000001',
    'FinanceGlobe', 'financeglobe',
    'https://financeglobe.example', 'Finance & Banking', '1001-5000',
    'Switzerland', 'Zurich',
    'Global financial services firm headquartered in Zurich with offices across 40 countries. Active international hiring programme.',
    'available', 'verified'
  ),
  (
    'aaaaaaaa-0002-0000-0000-000000000002',
    'TechBridge UAE', 'techbridge-uae',
    'https://techbridge-uae.example', 'Software & Technology', '201-500',
    'United Arab Emirates', 'Dubai',
    'Dubai-based technology company building platforms for the Middle East and African markets. Sponsors UAE Golden Visa and Employment Visa.',
    'available', 'verified'
  ),
  (
    'aaaaaaaa-0002-0000-0000-000000000003',
    'EduWorld Australia', 'eduworld-australia',
    'https://eduworld.example', 'Education', '501-1000',
    'Australia', 'Melbourne',
    'Leading EdTech and private schooling group across Melbourne and Sydney. Sponsors skilled worker visas for qualified educators.',
    'available', 'verified'
  ),
  (
    'aaaaaaaa-0002-0000-0000-000000000004',
    'SkyTech Singapore', 'skytech-singapore',
    'https://skytech-sg.example', 'Software & Technology', '51-200',
    'Singapore', 'Singapore',
    'Product-led startup building fintech and B2B SaaS tools. Considers Employment Pass for exceptional candidates.',
    'open_to_discussion', 'verified'
  )
on conflict (id) do nothing;

-- Additional jobs ----------------------------------------------
insert into jobs
  (id, employer_company_id, title, slug, description,
   employment_type, seniority_level, work_mode,
   country, city, salary_min, salary_max, salary_currency,
   salary_disclosed, application_deadline, status, published_at)
values
  -- FinanceGlobe / Switzerland
  (
    'bbbbbbbb-0002-0000-0000-000000000001',
    'aaaaaaaa-0002-0000-0000-000000000001',
    'Senior Data Engineer',
    'senior-data-engineer-financeglobe',
    $$FinanceGlobe is hiring a Senior Data Engineer to join our Zurich data platform team.

You will own the design and delivery of scalable data pipelines processing billions of financial records.

What you will do:
- Design and maintain real-time and batch data pipelines
- Build data lake architecture on cloud infrastructure
- Partner with quants, risk teams, and product to deliver reliable data products
- Mentor junior data engineers

What we offer:
- Tier B work permit sponsorship for non-EU candidates
- Relocation support including temporary housing in Zurich
- CHF 120k-160k base + bonus$$,
    'full_time', 'senior', 'on_site',
    'Switzerland', 'Zurich',
    120000, 160000, 'CHF', true,
    current_date + interval '60 days',
    'active', now() - interval '2 days'
  ),
  (
    'bbbbbbbb-0002-0000-0000-000000000002',
    'aaaaaaaa-0002-0000-0000-000000000001',
    'Senior Accountant (International Hire)',
    'senior-accountant-financeglobe',
    $$FinanceGlobe Zurich office is seeking a Senior Accountant with international financial reporting experience.

Requirements:
- ACCA, CPA, or equivalent qualification
- 5+ years in financial reporting or audit
- Experience with IFRS

We welcome applications from international candidates and sponsor work permits where skills are not available locally.$$,
    'full_time', 'senior', 'on_site',
    'Switzerland', 'Zurich',
    100000, 130000, 'CHF', true,
    current_date + interval '45 days',
    'active', now() - interval '1 day'
  ),
  -- TechBridge UAE / Dubai
  (
    'bbbbbbbb-0002-0000-0000-000000000003',
    'aaaaaaaa-0002-0000-0000-000000000002',
    'Product Manager — Payments',
    'product-manager-payments-techbridge',
    $$TechBridge UAE is looking for a Product Manager to lead our payments and wallets product line in Dubai.

Key responsibilities:
- Own the roadmap for mobile payments and card products
- Work with engineering, design, and compliance
- Define OKRs and drive delivery

We sponsor UAE Employment Visa and support relocation from anywhere in the world.$$,
    'full_time', 'senior', 'hybrid',
    'United Arab Emirates', 'Dubai',
    200000, 280000, 'AED', true,
    current_date + interval '30 days',
    'active', now() - interval '3 days'
  ),
  (
    'bbbbbbbb-0002-0000-0000-000000000004',
    'aaaaaaaa-0002-0000-0000-000000000002',
    'Software Engineer — Backend',
    'software-engineer-backend-techbridge',
    $$TechBridge UAE is growing its engineering team in Dubai.

Stack: Node.js, PostgreSQL, Redis, AWS

Requirements:
- 3+ years backend engineering experience
- REST API design and microservices architecture
- Experience with financial or payments systems a plus

We sponsor UAE Employment Visa for all hires.$$,
    'full_time', 'mid', 'on_site',
    'United Arab Emirates', 'Dubai',
    160000, 220000, 'AED', true,
    current_date + interval '35 days',
    'active', now() - interval '1 day'
  ),
  (
    'bbbbbbbb-0002-0000-0000-000000000005',
    'aaaaaaaa-0002-0000-0000-000000000002',
    'UX Researcher',
    'ux-researcher-techbridge',
    $$Help us understand how people in emerging markets use financial services.

You will run qualitative and quantitative research studies, translate findings into product insights, and champion user needs across teams.

Requirements:
- 3+ years UX research experience
- Mixed-methods research skills
- Experience in fintech, payments, or emerging markets is a strong plus$$,
    'full_time', 'mid', 'hybrid',
    'United Arab Emirates', 'Dubai',
    140000, 180000, 'AED', true,
    current_date + interval '25 days',
    'active', now() - interval '4 days'
  ),
  -- EduWorld Australia / Melbourne
  (
    'bbbbbbbb-0002-0000-0000-000000000006',
    'aaaaaaaa-0002-0000-0000-000000000003',
    'Secondary School Teacher — Mathematics',
    'secondary-teacher-maths-eduworld',
    $$EduWorld Australia is hiring qualified Mathematics teachers for our Melbourne campuses.

Requirements:
- Bachelor of Education or equivalent
- Mathematics specialisation
- Registration with VIT or ability to obtain it

We sponsor Skilled Nominated Visa (subclass 190) and Employer Sponsored Visa (subclass 482) for qualified teachers from recognised countries.$$,
    'full_time', 'mid', 'on_site',
    'Australia', 'Melbourne',
    75000, 95000, 'AUD', true,
    current_date + interval '90 days',
    'active', now() - interval '5 days'
  ),
  (
    'bbbbbbbb-0002-0000-0000-000000000007',
    'aaaaaaaa-0002-0000-0000-000000000003',
    'Curriculum Designer (EdTech)',
    'curriculum-designer-eduworld',
    $$EduWorld Australia is building a new online learning division and needs a Curriculum Designer.

You will design interactive curriculum for secondary and vocational courses delivered via our LMS platform.

Requirements:
- 3+ years instructional design or curriculum development
- Experience with e-learning tools such as Articulate, Canvas, or similar
- Background in education or training

We consider 482 visa sponsorship for this role.$$,
    'full_time', 'mid', 'hybrid',
    'Australia', 'Melbourne',
    80000, 100000, 'AUD', true,
    current_date + interval '45 days',
    'active', now() - interval '2 days'
  ),
  -- SkyTech Singapore
  (
    'bbbbbbbb-0002-0000-0000-000000000008',
    'aaaaaaaa-0002-0000-0000-000000000004',
    'AI/ML Engineer',
    'ai-ml-engineer-skytech',
    $$SkyTech Singapore is building AI features into our B2B SaaS platform.

Responsibilities:
- Build and deploy ML models for fraud detection and credit scoring
- Own the ML infrastructure and model monitoring
- Collaborate with product and data teams

Stack: Python, PyTorch, GCP, BigQuery

We will consider Employment Pass for exceptional candidates with strong AI/ML backgrounds.$$,
    'full_time', 'senior', 'hybrid',
    'Singapore', 'Singapore',
    120000, 160000, 'SGD', true,
    current_date + interval '40 days',
    'active', now() - interval '3 days'
  ),
  (
    'bbbbbbbb-0002-0000-0000-000000000009',
    'aaaaaaaa-0002-0000-0000-000000000004',
    'Graduate Software Engineer',
    'graduate-software-engineer-skytech',
    $$SkyTech Singapore is looking for bright graduates to join our engineering team.

You will work across frontend and backend features, learn from senior engineers, and ship real products from your first month.

Requirements:
- Bachelor in Computer Science or related field
- Proficiency in at least one programming language (TypeScript, Python, Go)
- Eagerness to learn in a fast-paced startup environment

Employment Pass considered for outstanding candidates.$$,
    'full_time', 'junior', 'on_site',
    'Singapore', 'Singapore',
    60000, 85000, 'SGD', true,
    current_date + interval '60 days',
    'active', now() - interval '1 day'
  ),
  (
    'bbbbbbbb-0002-0000-0000-000000000010',
    'aaaaaaaa-0002-0000-0000-000000000004',
    'React Native Engineer (Remote-Friendly)',
    'react-native-engineer-skytech',
    $$SkyTech Singapore is hiring a React Native Engineer to build our mobile products.

You can work remotely from most APAC countries with periodic travel to Singapore.

Stack: React Native, TypeScript, Expo, REST APIs

Requirements:
- 3+ years mobile development
- React Native proficiency
- Published apps on App Store or Play Store$$,
    'full_time', 'mid', 'remote',
    'Singapore', 'Singapore',
    100000, 140000, 'SGD', true,
    current_date + interval '30 days',
    'active', now() - interval '2 days'
  ),
  -- Luminary Tech additional (existing company)
  (
    'bbbbbbbb-0002-0000-0000-000000000011',
    'aaaaaaaa-0001-0000-0000-000000000001',
    'Frontend Engineer (Remote, Visa Sponsored)',
    'frontend-engineer-remote-luminary',
    $$Luminary Tech is expanding its remote engineering team.

You will work on our customer-facing cloud console used by 10,000+ organisations globally.

Stack: TypeScript, React, Next.js, TailwindCSS, GraphQL

Requirements:
- 3+ years frontend engineering
- Strong TypeScript and React skills
- Experience building accessible, responsive UIs

Visa sponsorship available for UK-based candidates. Remote candidates welcome.$$,
    'full_time', 'mid', 'remote',
    'United Kingdom', 'London',
    60000, 80000, 'GBP', true,
    current_date + interval '40 days',
    'active', now() - interval '1 day'
  ),
  -- MedCore Health additional (existing company)
  (
    'bbbbbbbb-0002-0000-0000-000000000012',
    'aaaaaaaa-0001-0000-0000-000000000002',
    'Data Scientist — Health AI',
    'data-scientist-health-ai-medcore',
    $$MedCore Health is building AI-powered diagnostic tools and needs a Data Scientist to lead model development.

Responsibilities:
- Build and validate ML models on clinical datasets
- Collaborate with clinicians and product teams
- Publish research where appropriate

Requirements:
- Masters or PhD in Data Science, Statistics, or related field
- Experience with healthcare data
- Python, PyTorch or TensorFlow$$,
    'full_time', 'senior', 'hybrid',
    'Canada', 'Toronto',
    100000, 130000, 'CAD', true,
    current_date + interval '50 days',
    'active', now() - interval '4 days'
  ),
  -- Atlas Engineering additional (existing company)
  (
    'bbbbbbbb-0002-0000-0000-000000000013',
    'aaaaaaaa-0001-0000-0000-000000000003',
    'HR Business Partner (International Workforce)',
    'hr-business-partner-atlas',
    $$Atlas Engineering manages a workforce of 4,000 across the EU and needs an experienced HR Business Partner.

This role focuses on international workforce planning, work permit processes, and EU Blue Card management.

Requirements:
- 5+ years HR experience with international workforce exposure
- Knowledge of German employment law or willingness to learn
- Fluency in English; German is a strong plus$$,
    'full_time', 'senior', 'hybrid',
    'Germany', 'Berlin',
    70000, 90000, 'EUR', true,
    current_date + interval '55 days',
    'active', now() - interval '6 days'
  ),
  -- Orbital Labs additional (existing company)
  (
    'bbbbbbbb-0002-0000-0000-000000000014',
    'aaaaaaaa-0001-0000-0000-000000000004',
    'DevOps Engineer (Remote, Global)',
    'devops-engineer-remote-orbital',
    $$Orbital Labs is building out its platform infrastructure team. Fully remote, globally distributed.

Responsibilities:
- Own CI/CD pipelines, Kubernetes clusters, and observability stack
- Drive infrastructure-as-code adoption
- Collaborate with engineering teams across timezones

Stack: Kubernetes, Terraform, GitHub Actions, Datadog, AWS

No sponsorship required. We hire globally.$$,
    'full_time', 'mid', 'remote',
    'Netherlands', 'Amsterdam',
    95000, 125000, 'USD', true,
    current_date + interval '30 days',
    'active', now() - interval '3 days'
  ),
  (
    'bbbbbbbb-0002-0000-0000-000000000015',
    'aaaaaaaa-0001-0000-0000-000000000004',
    'Technical Writer (Remote)',
    'technical-writer-remote-orbital',
    $$Orbital Labs needs a Technical Writer to own developer documentation for our platform.

Responsibilities:
- Write and maintain API docs, guides, and tutorials
- Work with engineering to document new features
- Build a self-serve developer community

Requirements:
- 2+ years technical writing experience
- Comfort reading and documenting code
- Experience with tools like Mintlify, GitBook, or Docusaurus$$,
    'full_time', 'mid', 'remote',
    'Netherlands', 'Amsterdam',
    75000, 95000, 'USD', true,
    current_date + interval '45 days',
    'active', now() - interval '2 days'
  )
on conflict (id) do nothing;

-- Sponsorship metadata for new jobs ----------------------------
insert into job_sponsorship_metadata
  (job_id, sponsorship_status, relocation_support_available,
   open_to_international_applicants, employer_confirmed)
values
  ('bbbbbbbb-0002-0000-0000-000000000001', 'available',          true,  true,  true),
  ('bbbbbbbb-0002-0000-0000-000000000002', 'available',          true,  true,  true),
  ('bbbbbbbb-0002-0000-0000-000000000003', 'available',          true,  true,  true),
  ('bbbbbbbb-0002-0000-0000-000000000004', 'available',          false, true,  true),
  ('bbbbbbbb-0002-0000-0000-000000000005', 'available',          false, true,  true),
  ('bbbbbbbb-0002-0000-0000-000000000006', 'available',          true,  true,  true),
  ('bbbbbbbb-0002-0000-0000-000000000007', 'available',          false, true,  true),
  ('bbbbbbbb-0002-0000-0000-000000000008', 'open_to_discussion', false, true,  true),
  ('bbbbbbbb-0002-0000-0000-000000000009', 'open_to_discussion', false, true,  true),
  ('bbbbbbbb-0002-0000-0000-000000000010', 'open_to_discussion', false, true,  true),
  ('bbbbbbbb-0002-0000-0000-000000000011', 'available',          false, true,  true),
  ('bbbbbbbb-0002-0000-0000-000000000012', 'available',          false, true,  true),
  ('bbbbbbbb-0002-0000-0000-000000000013', 'open_to_discussion', false, true,  true),
  ('bbbbbbbb-0002-0000-0000-000000000014', 'not_available',      false, true,  true),
  ('bbbbbbbb-0002-0000-0000-000000000015', 'not_available',      false, true,  true)
on conflict (job_id) do nothing;

-- Job requirements for new jobs --------------------------------
insert into job_requirements (job_id, requirement_type, requirement_text, importance) values
  -- Senior Data Engineer
  ('bbbbbbbb-0002-0000-0000-000000000001', 'skill',      'Apache Spark or Flink',           'required'),
  ('bbbbbbbb-0002-0000-0000-000000000001', 'skill',      'Python or Scala',                 'required'),
  ('bbbbbbbb-0002-0000-0000-000000000001', 'skill',      'SQL',                             'required'),
  ('bbbbbbbb-0002-0000-0000-000000000001', 'experience', '5+ years data engineering',       'required'),
  ('bbbbbbbb-0002-0000-0000-000000000001', 'skill',      'dbt',                             'preferred'),
  -- Senior Accountant
  ('bbbbbbbb-0002-0000-0000-000000000002', 'education',  'ACCA, CPA, or equivalent',        'required'),
  ('bbbbbbbb-0002-0000-0000-000000000002', 'experience', '5+ years financial reporting',    'required'),
  ('bbbbbbbb-0002-0000-0000-000000000002', 'skill',      'IFRS',                            'required'),
  -- Product Manager Payments
  ('bbbbbbbb-0002-0000-0000-000000000003', 'experience', '5+ years product management',     'required'),
  ('bbbbbbbb-0002-0000-0000-000000000003', 'skill',      'Payments or fintech domain',      'required'),
  ('bbbbbbbb-0002-0000-0000-000000000003', 'skill',      'OKR framework',                   'preferred'),
  -- Software Engineer Backend
  ('bbbbbbbb-0002-0000-0000-000000000004', 'skill',      'Node.js',                         'required'),
  ('bbbbbbbb-0002-0000-0000-000000000004', 'skill',      'PostgreSQL',                      'required'),
  ('bbbbbbbb-0002-0000-0000-000000000004', 'skill',      'REST API design',                 'required'),
  ('bbbbbbbb-0002-0000-0000-000000000004', 'experience', '3+ years backend engineering',    'required'),
  -- UX Researcher
  ('bbbbbbbb-0002-0000-0000-000000000005', 'experience', '3+ years UX research',            'required'),
  ('bbbbbbbb-0002-0000-0000-000000000005', 'skill',      'Qualitative research methods',    'required'),
  ('bbbbbbbb-0002-0000-0000-000000000005', 'skill',      'Quantitative analysis',           'preferred'),
  -- Secondary School Teacher
  ('bbbbbbbb-0002-0000-0000-000000000006', 'education',  'Bachelor of Education',           'required'),
  ('bbbbbbbb-0002-0000-0000-000000000006', 'skill',      'Mathematics teaching',            'required'),
  ('bbbbbbbb-0002-0000-0000-000000000006', 'skill',      'VIT registration or eligible',    'preferred'),
  -- Curriculum Designer
  ('bbbbbbbb-0002-0000-0000-000000000007', 'experience', '3+ years instructional design',   'required'),
  ('bbbbbbbb-0002-0000-0000-000000000007', 'skill',      'Articulate or Canvas LMS',        'required'),
  -- AI/ML Engineer
  ('bbbbbbbb-0002-0000-0000-000000000008', 'skill',      'Python',                          'required'),
  ('bbbbbbbb-0002-0000-0000-000000000008', 'skill',      'PyTorch or TensorFlow',           'required'),
  ('bbbbbbbb-0002-0000-0000-000000000008', 'skill',      'Machine learning',                'required'),
  ('bbbbbbbb-0002-0000-0000-000000000008', 'experience', '4+ years ML engineering',         'required'),
  ('bbbbbbbb-0002-0000-0000-000000000008', 'skill',      'GCP or AWS',                      'preferred'),
  -- Graduate Software Engineer
  ('bbbbbbbb-0002-0000-0000-000000000009', 'education',  'Bachelor in Computer Science',    'required'),
  ('bbbbbbbb-0002-0000-0000-000000000009', 'skill',      'TypeScript or Python',            'required'),
  -- React Native Engineer
  ('bbbbbbbb-0002-0000-0000-000000000010', 'skill',      'React Native',                    'required'),
  ('bbbbbbbb-0002-0000-0000-000000000010', 'skill',      'TypeScript',                      'required'),
  ('bbbbbbbb-0002-0000-0000-000000000010', 'experience', '3+ years mobile development',     'required'),
  -- Frontend Engineer
  ('bbbbbbbb-0002-0000-0000-000000000011', 'skill',      'React',                           'required'),
  ('bbbbbbbb-0002-0000-0000-000000000011', 'skill',      'TypeScript',                      'required'),
  ('bbbbbbbb-0002-0000-0000-000000000011', 'skill',      'Next.js',                         'required'),
  ('bbbbbbbb-0002-0000-0000-000000000011', 'experience', '3+ years frontend engineering',   'required'),
  -- Data Scientist Health AI
  ('bbbbbbbb-0002-0000-0000-000000000012', 'skill',      'Python',                          'required'),
  ('bbbbbbbb-0002-0000-0000-000000000012', 'skill',      'PyTorch or TensorFlow',           'required'),
  ('bbbbbbbb-0002-0000-0000-000000000012', 'education',  'Masters or PhD in Data Science',  'required'),
  ('bbbbbbbb-0002-0000-0000-000000000012', 'skill',      'SQL',                             'required'),
  -- HR Business Partner
  ('bbbbbbbb-0002-0000-0000-000000000013', 'experience', '5+ years HR experience',          'required'),
  ('bbbbbbbb-0002-0000-0000-000000000013', 'skill',      'Employment law knowledge',        'required'),
  -- DevOps Engineer
  ('bbbbbbbb-0002-0000-0000-000000000014', 'skill',      'Kubernetes',                      'required'),
  ('bbbbbbbb-0002-0000-0000-000000000014', 'skill',      'Terraform',                       'required'),
  ('bbbbbbbb-0002-0000-0000-000000000014', 'skill',      'CI/CD pipelines',                 'required'),
  ('bbbbbbbb-0002-0000-0000-000000000014', 'experience', '3+ years DevOps or SRE',          'required'),
  -- Technical Writer
  ('bbbbbbbb-0002-0000-0000-000000000015', 'experience', '2+ years technical writing',      'required'),
  ('bbbbbbbb-0002-0000-0000-000000000015', 'skill',      'API documentation',               'required'),
  ('bbbbbbbb-0002-0000-0000-000000000015', 'skill',      'Markdown or MDX',                 'preferred')
on conflict do nothing;
