import type { SigniaMediaItem, SigniaProfile, SigniaProject, SigniaSocialLink } from "@/data/types";
import { DEFAULT_SIGNIA_SECTIONS } from "@/lib/signia/labels";

// Amara's published Signia portfolio. Fictional organisations and links (.example).

const created = "2026-09-10T10:00:00.000Z";

export const signiaProfileFixtures: SigniaProfile[] = [
  {
    user_id: "user-amara",
    handle: "amara-okafor",
    headline: "Public health researcher turning field data into decisions",
    summary:
      "I studied microbiology in Lagos and spent two years with Brightpath Health Initiative cleaning and analysing community survey data. Now studying an MSc in Global Public Health in London, I want to build data systems that help clinics act faster.",
    current_work_summary:
      "Final-term MSc dissertation on how community health workers use mobile data tools in Lagos clinics.",
    public_status: "published",
    discoverability: "public",
    sections: DEFAULT_SIGNIA_SECTIONS,
    published_at: "2026-09-12T09:00:00.000Z",
    updated_at: "2026-09-20T09:00:00.000Z",
  },
];

export const signiaProjectFixtures: SigniaProject[] = [
  {
    id: "sproj-amara-survey",
    user_id: "user-amara",
    title: "Community clinic survey toolkit",
    summary: "A reusable set of digital forms and cleaning scripts used across 12 community clinics.",
    role_description: "Designed the forms, trained field officers and wrote the cleaning scripts.",
    problem_statement: "Paper surveys took weeks to digitise and arrived full of errors, so clinics acted on old data.",
    approach:
      "Rebuilt the survey as mobile forms with built-in checks, trained 14 field officers, and wrote reusable cleaning scripts in Python.",
    outcome: "Form errors fell by 40% and monthly reports went from 5 days to 2.",
    status: "completed",
    project_type: "project",
    skills: ["Survey design", "Data cleaning", "Python", "Training and facilitation"],
    links: [
      {
        id: "slink-1",
        link_type: "github",
        label: "Cleaning scripts",
        url: "https://github.example/amara/clinic-survey",
      },
      {
        id: "slink-2",
        link_type: "article",
        label: "Write-up for programme managers",
        url: "https://brightpath.example/toolkit",
      },
    ],
    visibility: "public",
    start_date: "2023-03-01",
    end_date: "2024-06-30",
    order_index: 0,
    created_at: created,
    updated_at: created,
  },
  {
    id: "sproj-amara-amr",
    user_id: "user-amara",
    title: "Antibiotic resistance in community clinics",
    summary: "Final-year undergraduate research on resistance patterns in samples from community clinics.",
    role_description: "Lead student researcher, supervised by the microbiology department.",
    problem_statement: "Little local data existed on resistance patterns outside teaching hospitals.",
    approach:
      "Collected and tested samples from three clinics and compared resistance rates across common antibiotics.",
    outcome: "Presented at the department research day; findings shared with the participating clinics.",
    status: "completed",
    project_type: "research",
    skills: ["Statistical analysis", "Report writing"],
    links: [],
    visibility: "public",
    start_date: "2021-09-01",
    end_date: "2022-06-30",
    order_index: 1,
    created_at: created,
    updated_at: created,
  },
];

export const signiaMediaFixtures: SigniaMediaItem[] = [
  {
    id: "smedia-amara-poster",
    user_id: "user-amara",
    project_id: "sproj-amara-amr",
    media_type: "document",
    title: "Research day poster",
    description: "One-page poster summarising the resistance findings.",
    url: "https://brightpath.example/research/amr-poster.pdf",
    host_label: "brightpath.example",
    thumbnail_url: null,
    visibility: "public",
    created_at: created,
  },
];

export const signiaSocialFixtures: SigniaSocialLink[] = [
  {
    id: "ssocial-amara-linkedin",
    user_id: "user-amara",
    platform: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/amara-okafor-demo",
    visibility: "public",
    order_index: 0,
  },
  {
    id: "ssocial-amara-github",
    user_id: "user-amara",
    platform: "github",
    label: "GitHub",
    url: "https://github.example/amara",
    visibility: "public",
    order_index: 1,
  },
];
