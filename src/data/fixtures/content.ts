import type { Article, FaqItem, Testimonial } from "@/data/types";

// Public content seed. Articles follow PUBLISHING_INTELLIGENCE_ENGINE.md → Article Template
// and stay general on purpose: specific visa rules, thresholds and deadlines change and
// need accuracy review before real publication.

const EDITORIAL = "Scholastiar Editorial Team";

export const articleFixtures: Article[] = [
  {
    id: "article-student-work",
    slug: "working-while-you-study-abroad",
    title: "Working while you study abroad: what to check before you take a job",
    category: "immigration",
    excerpt:
      "Many study visas allow some paid work, but the limits differ by country, course and time of year. Here is what to check before you accept a student job.",
    short_answer:
      "Most study visas allow limited part-time work, but the rules depend on the country, your course level and whether it is term time or a holiday. Check the conditions on your own visa before you accept any job.",
    who_its_for: "International students who want a part-time or holiday job while they study.",
    sections: [
      {
        heading: "Your visa sets the rules",
        paragraphs: [
          "Student visas usually say whether you can work, how many hours, and when. The limits can be different during term time and during official holidays.",
          "Your conditions are printed on your visa documents or in your immigration account. They are the rules that apply to you, even if a friend on a different course has different ones.",
        ],
      },
      {
        heading: "What is commonly restricted",
        paragraphs: ["Depending on the country and your visa, students are often limited in:"],
        bullets: [
          "the number of hours worked per week during term time",
          "self-employment and freelance work",
          "certain roles, such as some full-time permanent positions",
          "working before your course officially starts",
        ],
      },
      {
        heading: "Questions to ask before you accept",
        paragraphs: ["A good student employer will be happy to answer these:"],
        bullets: [
          "How many hours a week will I work, in term time and in holidays?",
          "Can my shifts fit around my timetable and exams?",
          "Will you check my right to work before I start?",
          "Is the role paid at least the legal minimum wage?",
        ],
      },
      {
        heading: "How Scholastiar.ai makes this easier",
        paragraphs: [
          "Your Scholastiar.ai profile records the work conditions on your own visa. On the Pro plan, job openings in your dashboard are labelled with whether their hours fit those conditions — a way to get connected to employers, not a promise of a job.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I work on a student visa?",
        answer:
          "Often yes, with limits. Whether you can work, and for how many hours, is set by your own visa conditions, so check them before you accept a job.",
      },
      {
        question: "What happens if I work more hours than allowed?",
        answer:
          "Breaking your visa's work conditions can put your visa at risk. Keep a record of your hours and ask your university's international student team if you are unsure.",
      },
    ],
    sources: [
      { label: "GOV.UK — Student visa", url: "https://www.gov.uk/student-visa" },
      {
        label: "Government of Canada — Work while studying",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work.html",
      },
      {
        label: "Australian Government — Student visa (subclass 500)",
        url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
      },
    ],
    country_tags: ["United Kingdom", "Canada", "Australia"],
    opportunity_types: ["universities"],
    author_name: EDITORIAL,
    reading_minutes: 5,
    status: "published",
    accuracy_review_required: true,
    published_at: "2026-09-08T09:00:00.000Z",
    last_updated_at: "2026-09-22T09:00:00.000Z",
  },
  {
    id: "article-cv-abroad",
    slug: "cv-for-jobs-abroad",
    title: "How to write a student CV for jobs abroad",
    category: "readiness",
    excerpt:
      "CV length, photos, personal details and format differ between countries. Here is how students can adapt the same experience for each one.",
    short_answer:
      "Keep the same facts, but change the format to match local norms: length, whether to include a photo or personal details, and how achievements are written.",
    who_its_for: "Students applying for part-time jobs, internships or graduate roles in another country.",
    sections: [
      {
        heading: "Same experience, different format",
        paragraphs: [
          "Recruiters read CVs quickly and expect a familiar layout. A CV that looks unusual locally can be passed over even when the experience is strong.",
        ],
      },
      {
        heading: "Common regional differences",
        paragraphs: ["These are common conventions, not strict rules. Check the employer's own guidance first."],
        bullets: [
          "United Kingdom: usually two pages, no photo, date of birth or marital status.",
          "United States: a one- or two-page résumé, no photo or personal details.",
          "Germany: a structured CV (Lebenslauf); a photo is traditional but optional.",
          "European Union: the Europass format is widely recognised for some roles and programmes.",
        ],
      },
      {
        heading: "Write achievements, not duties",
        paragraphs: [
          "Wherever you apply, lead each role with what changed because of your work. Volunteering, societies, projects and part-time jobs all count. Numbers help, but only if they are true and you can explain them in an interview.",
        ],
      },
      {
        heading: "How Scholastiar.ai makes this easier",
        paragraphs: [
          "You build your profile once. When you apply, the AI CV engine restructures it for the role and the country's format, and you review and edit every version before it is used. It never invents experience.",
        ],
      },
    ],
    faq: [
      {
        question: "Should I translate my CV?",
        answer:
          "Use the language of the job listing. If the listing is in English, an English CV is usually expected even in non-English-speaking countries.",
      },
    ],
    sources: [{ label: "Europass (European Union)", url: "https://europass.europa.eu/en" }],
    country_tags: ["United Kingdom", "United States", "Germany"],
    opportunity_types: [],
    author_name: EDITORIAL,
    reading_minutes: 5,
    status: "published",
    accuracy_review_required: false,
    published_at: "2026-09-12T09:00:00.000Z",
    last_updated_at: "2026-09-12T09:00:00.000Z",
  },
  {
    id: "article-fully-funded",
    slug: "what-fully-funded-scholarships-cover",
    title: "Fully funded scholarships: what “fully funded” usually covers",
    category: "opportunities",
    excerpt:
      "Tuition, living costs, flights, insurance — “fully funded” means different things to different programmes. Here's how to read the small print.",
    short_answer:
      "“Fully funded” usually means tuition plus a living allowance, but travel, insurance, visa fees and family support vary. Always read the programme's own funding section.",
    who_its_for: "Students comparing scholarships for study abroad.",
    sections: [
      {
        heading: "What is often included",
        paragraphs: ["Depending on the programme, funding can include:"],
        bullets: [
          "tuition fees",
          "a monthly living allowance or stipend",
          "return travel",
          "health insurance",
          "visa application costs",
        ],
      },
      {
        heading: "What is often not included",
        paragraphs: [
          "Costs for dependants, extra months beyond the programme length, and some local fees are commonly excluded. Some awards also expect you to return to your home country afterwards.",
        ],
      },
      {
        heading: "How to compare offers",
        paragraphs: [
          "Put each offer's funding into the same list and compare the monthly allowance with real living costs in the city, not the country average.",
        ],
      },
      {
        heading: "How Scholastiar.ai makes this easier",
        paragraphs: [
          "Scholarship listings show funding signals on every card, and saved scholarships are tracked with their deadlines so you can compare them side by side.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I hold two scholarships at once?",
        answer: "Some programmes allow it and many do not. Check each programme's rules on combining awards.",
      },
    ],
    sources: [
      { label: "Chevening Scholarships", url: "https://www.chevening.org/" },
      { label: "DAAD — German Academic Exchange Service", url: "https://www.daad.de/en/" },
      { label: "Fulbright Foreign Student Program", url: "https://foreign.fulbrightonline.org/" },
    ],
    country_tags: ["United Kingdom", "Germany", "United States"],
    opportunity_types: ["scholarships", "universities"],
    author_name: EDITORIAL,
    reading_minutes: 5,
    status: "published",
    accuracy_review_required: true,
    published_at: "2026-09-15T09:00:00.000Z",
    last_updated_at: "2026-09-15T09:00:00.000Z",
  },
  {
    id: "article-documents",
    slug: "documents-to-prepare-before-applying-abroad",
    title: "Documents to prepare before you apply abroad",
    category: "readiness",
    excerpt: "The documents that slow most applications down, and how to get them ready before a deadline appears.",
    short_answer:
      "Get your passport, qualifications, transcripts, references and any translations ready early. Certified copies and translations often take weeks.",
    who_its_for: "Anyone planning to apply for jobs, study or funding in another country.",
    sections: [
      {
        heading: "Start with the slow documents",
        paragraphs: ["These commonly take the longest to obtain:"],
        bullets: [
          "a passport with plenty of validity left",
          "degree certificates and academic transcripts",
          "certified translations of documents not in the destination's language",
          "police or good-conduct certificates",
          "language test results",
        ],
      },
      {
        heading: "Keep a reusable set",
        paragraphs: [
          "Scan each document clearly, name files consistently and note expiry dates. Most applications ask for the same core set.",
        ],
      },
      {
        heading: "How Scholastiar.ai makes this easier",
        paragraphs: [
          "Your document vault stores each file once and keeps it private by default. Each opportunity shows which documents it needs and which you already have.",
        ],
      },
    ],
    faq: [
      {
        question: "Do I need certified copies?",
        answer:
          "Some programmes and authorities require certified copies or translations. The requirement is listed in each application's guidance.",
      },
    ],
    sources: [],
    country_tags: [],
    opportunity_types: ["universities", "scholarships"],
    author_name: EDITORIAL,
    reading_minutes: 4,
    status: "published",
    accuracy_review_required: false,
    published_at: "2026-09-18T09:00:00.000Z",
    last_updated_at: "2026-09-18T09:00:00.000Z",
  },
  {
    id: "article-success-score",
    slug: "how-the-success-score-works",
    title: "How the Scholastiar success score works",
    category: "product",
    excerpt: "What the score on each opportunity card measures, what it doesn't, and how to raise it.",
    short_answer:
      "The success score estimates how ready your profile is for an opportunity, based on eligibility, documents, deadline and fit. It is a planning guide, not a prediction of the outcome.",
    who_its_for: "Applicants deciding which opportunities to prioritise.",
    sections: [
      {
        heading: "What goes into the score",
        paragraphs: ["The score combines signals we can check against your profile:"],
        bullets: [
          "whether you meet the stated eligibility requirements",
          "which required documents you already have",
          "how much time is left before the deadline",
          "how closely your experience and goals match the opportunity",
        ],
      },
      {
        heading: "What it isn't",
        paragraphs: [
          "The score never guarantees a job, admission, funding, award or visa. Decisions belong to employers, institutions and authorities.",
        ],
      },
      {
        heading: "How to raise it",
        paragraphs: [
          "Open the score breakdown on any opportunity. It lists the missing pieces — usually a document, a profile section or a requirement to confirm.",
        ],
      },
    ],
    faq: [
      {
        question: "Why did my score change?",
        answer: "Scores update when your profile, documents or the deadline change.",
      },
    ],
    sources: [],
    country_tags: [],
    opportunity_types: [],
    author_name: EDITORIAL,
    reading_minutes: 3,
    status: "published",
    accuracy_review_required: false,
    published_at: "2026-09-24T09:00:00.000Z",
    last_updated_at: "2026-09-24T09:00:00.000Z",
  },
  {
    id: "article-three-ways",
    slug: "self-apply-ai-apply-agent-or-apply-for-me",
    title: "Self-apply, AI Apply Agent or Apply For Me: which should you use?",
    category: "product",
    excerpt: "Three ways to apply on Scholastiar.ai, and how to pick the right one for each opportunity.",
    short_answer:
      "Apply yourself when you want full control, use AI Apply Agent to work through a queue under your rules, and use Apply For Me when you want a verified person to handle the application.",
    who_its_for: "Applicants who have saved more opportunities than they have time to apply to.",
    sections: [
      {
        heading: "Apply yourself",
        paragraphs: [
          "You use AI to prepare a tailored CV and answers, review everything and submit. Best for high-stakes applications you want to write personally.",
        ],
      },
      {
        heading: "AI Apply Agent",
        paragraphs: [
          "You set rules — countries, roles, minimum fit — and approve a queue. The agent prepares and submits where portals allow it, and records proof of each submission. Nothing is sent without your consent.",
        ],
      },
      {
        heading: "Apply For Me",
        paragraphs: [
          "A verified Scholastiar Forwarder handles the application with you, with milestones, proof of submission and review before anything is sent.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I mix all three?",
        answer: "Yes. Each saved opportunity can be applied to in whichever way suits it.",
      },
    ],
    sources: [],
    country_tags: [],
    opportunity_types: [],
    author_name: EDITORIAL,
    reading_minutes: 4,
    status: "published",
    accuracy_review_required: false,
    published_at: "2026-09-28T09:00:00.000Z",
    last_updated_at: "2026-09-28T09:00:00.000Z",
  },
];

let faqOrder = 0;
function faq(audience: FaqItem["audience"], question: string, answer: string): FaqItem {
  faqOrder += 1;
  return { id: `faq-${faqOrder}`, audience, question, answer, sort_order: faqOrder };
}

export const faqFixtures: FaqItem[] = [
  faq(
    "applicants",
    "Does Scholastiar.ai guarantee a job, admission, scholarship or visa?",
    "No. We help you find opportunities that fit and prepare stronger applications. Employers, institutions, funders and immigration authorities make every decision.",
  ),
  faq(
    "applicants",
    "Can I work while I study abroad?",
    "Many study visas allow limited part-time work, depending on the country, your course and the time of year. Always confirm the conditions on your own visa before you accept any work.",
  ),
  faq(
    "applicants",
    "Can Scholastiar.ai help me find a job?",
    "Job connections are part of the Pro plan. Inside your dashboard, Pro members can see student jobs that fit their study visa hours and post-study jobs where the employer sponsors a work visa, then save and apply. We connect you to openings employers post; we can't promise a job, and employers and immigration authorities make the decisions.",
  ),
  faq(
    "applicants",
    "Who can see my profile and documents?",
    "Your documents are private by default. Employers and providers only see what you submit with an application, or what you choose to make public on your Signia portfolio.",
  ),
  faq(
    "applicants",
    "Will the AI make up experience on my CV?",
    "No. AI improves how your real experience is structured and written for each role. It never invents qualifications, documents or achievements, and you review everything before it is used.",
  ),
  faq(
    "applicants",
    "Which countries are covered?",
    "Opportunities come from many countries. Popular destinations include the United Kingdom, United States, Canada, Germany, Australia, Ireland, the Netherlands and the United Arab Emirates.",
  ),
  faq(
    "applicants",
    "What are AI Apply Agent and Apply For Me?",
    "AI Apply Agent prepares and submits applications from a queue you approve, under rules you set. Apply For Me assigns a verified person to handle applications for you. Both always ask for your consent before anything is submitted.",
  ),
  faq(
    "employers",
    "How do you check employers?",
    "Employers go through verification before their jobs can be published, and every new job is reviewed before it goes live.",
  ),
  faq(
    "employers",
    "How does candidate ranking work?",
    "Applicants are ranked on fit with your requirements, with an AI summary explaining the ranking so you can decide quickly. You always make the final decision.",
  ),
  faq(
    "employers",
    "Can I see a student's work conditions?",
    "Yes. Each student applicant shows the work conditions of their study visa as they have reported them, so you can offer hours that fit. You still carry out your own right-to-work check.",
  ),
  faq(
    "employers",
    "How much does it cost to hire on Scholastiar.ai?",
    "Employer Starter is $99 a month for up to 3 student jobs. Employer Pro is $249 a month for up to 15 jobs, including post-study jobs with visa sponsorship. Enterprise pricing is custom. Employers pay when they sign up.",
  ),
  faq(
    "billing",
    "Is there a free plan?",
    "There are no free plans. You can browse public pages and guides without an account. Applicants choose Starter ($35/month) or Pro ($79/month) when they sign up; employers and universities also choose a paid plan at sign-up.",
  ),
  faq("billing", "Can I switch between Starter and Pro?", "Yes. You can upgrade or downgrade from your billing page."),
  faq(
    "billing",
    "Is human help included in my plan?",
    "Human-assisted help such as Apply For Me is bought separately, per application or as a campaign.",
  ),
  faq(
    "billing",
    "Which currency and payment methods do you accept?",
    "Prices are in US dollars. You can pay by card, and local payment methods are available in supported countries.",
  ),
];

// Placeholders for layout only. Replace with real, consented testimonials before launch.
export const testimonialFixtures: Testimonial[] = [
  {
    id: "testimonial-1",
    quote:
      "I stopped rewriting my CV for every application. I explained my experience once, and each version still sounded like me.",
    person_name: "Placeholder applicant",
    person_context: "Master's student, Lagos → London",
    is_placeholder: true,
  },
  {
    id: "testimonial-2",
    quote:
      "Having every scholarship deadline and document in one place meant I finally applied to the ones that fit me.",
    person_name: "Placeholder applicant",
    person_context: "Engineering student, Nairobi → Berlin",
    is_placeholder: true,
  },
  {
    id: "testimonial-3",
    quote: "The ranked shortlist with reasons meant our team reviewed forty applicants in an afternoon.",
    person_name: "Placeholder employer",
    person_context: "Student recruitment lead, retail group",
    is_placeholder: true,
  },
];
