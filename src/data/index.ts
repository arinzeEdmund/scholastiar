import "server-only";

import { dataSource } from "@/lib/env";

import { mockAuthRepository } from "./mock/auth";
import { mockBillingRepository } from "./mock/billing";
import { mockCandidateRepository } from "./mock/candidate";
import { mockCatalogueRepository } from "./mock/catalogue";
import { mockContentRepository } from "./mock/content";
import { mockCvRepository } from "./mock/cvs";
import { mockMessagesRepository } from "./mock/messages";
import { mockContactRepository, mockNewsletterRepository } from "./mock/inbound";
import { mockOpportunitiesRepository } from "./mock/opportunities";
import { mockOrganizationsRepository } from "./mock/organizations";
import { mockPersonalityRepository } from "./mock/personality";
import { mockReferenceRepository } from "./mock/reference";
import { mockSigniaRepository } from "./mock/signia";
import { mockThreadsRepository } from "./mock/threads";
import { mockUsersRepository } from "./mock/users";
import type { AuthRepository } from "./repositories/auth";
import type { BillingRepository } from "./repositories/billing";
import type { CandidateRepository } from "./repositories/candidate";
import type { CatalogueRepository } from "./repositories/catalogue";
import type { ContentRepository } from "./repositories/content";
import type { CvRepository } from "./repositories/cvs";
import type { ContactRepository, NewsletterRepository } from "./repositories/inbound";
import type { MessagesRepository } from "./repositories/messages";
import type { OpportunitiesRepository } from "./repositories/opportunities";
import type { OrganizationsRepository } from "./repositories/organizations";
import type { PersonalityRepository } from "./repositories/personality";
import type { ReferenceRepository } from "./repositories/reference";
import type { SigniaRepository } from "./repositories/signia";
import type { ThreadsRepository } from "./repositories/threads";
import type { UsersRepository } from "./repositories/users";

/**
 * The only entry point pages and server actions use for data.
 * Phase A: mock implementations. Phase B: Supabase implementations of the
 * same interfaces are added under src/data/supabase and selected here.
 */
interface Repositories {
  auth: AuthRepository;
  users: UsersRepository;
  organizations: OrganizationsRepository;
  reference: ReferenceRepository;
  billing: BillingRepository;
  candidate: CandidateRepository;
  content: ContentRepository;
  newsletter: NewsletterRepository;
  contact: ContactRepository;
  messages: MessagesRepository;
  catalogue: CatalogueRepository;
  opportunities: OpportunitiesRepository;
  cvs: CvRepository;
  personality: PersonalityRepository;
  signia: SigniaRepository;
  threads: ThreadsRepository;
}

function createRepositories(): Repositories {
  if (dataSource === "supabase") {
    throw new Error("Supabase repositories are built in Phase B. Set DATA_SOURCE=mock.");
  }
  return {
    auth: mockAuthRepository,
    users: mockUsersRepository,
    organizations: mockOrganizationsRepository,
    reference: mockReferenceRepository,
    billing: mockBillingRepository,
    candidate: mockCandidateRepository,
    content: mockContentRepository,
    newsletter: mockNewsletterRepository,
    contact: mockContactRepository,
    messages: mockMessagesRepository,
    catalogue: mockCatalogueRepository,
    opportunities: mockOpportunitiesRepository,
    cvs: mockCvRepository,
    personality: mockPersonalityRepository,
    signia: mockSigniaRepository,
    threads: mockThreadsRepository,
  };
}

export const repos = createRepositories();

export type * from "./types";
