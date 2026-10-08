# Public Pages

Status: Built in U1 (2026-10-01)

Source: `PAGES/000-original-screen-list.md` (public pages), `PAGES/99-billing-pages.md` (pricing), `BUILD_GUIDE/PUBLISHING_INTELLIGENCE_ENGINE.md` (guides).

All public pages use the public shell: header (Study abroad, Scholarships, How it works, For employers, Pricing, Blog, theme toggle, search, Sign in, Get started) and the footer.

Footer (atmosphere style): logo, tagline and trust points; "New opportunities every Monday" newsletter sign-up; link columns (Opportunities, Platform, Resources, Company); popular destination chips that open search; utility bar with copyright and guidance disclaimer, Light/Dark/System switch and Back to top; oversized faded wordmark. Unbuilt links are dimmed without "Soon" pills. Social links: the footer renders `SOCIAL_LINKS` from `src/config/site.ts`, which is empty until real accounts exist (reminder in `PROGRESS_TRACKER.md` → Open Questions).

## Home

Route: `/`

Sections: hero with product preview and trust points (study, funding and relocation lead; no job headline), seven opportunity categories (no jobs: jobs are a Pro feature inside the dashboard, mentioned only in pricing as job connections with no promise of employment), how it works (4 steps), three ways to apply, cross-border trust points (dark), employer band, testimonials, pricing preview (from plan records), latest guides, newsletter signup, closing call to action.

## About

Route: `/about`

Dark atmosphere hero with mission; "the difference one profile makes" (on your own vs with Scholastiar); the whole-journey path (study → fund → relocate → settle in; job connections on Pro); principles as glass cards on a dark section; who we serve (four audiences); CTA. No team section until real team details exist.

## How It Works

Route: `/how-it-works`

Tabs for applicants (6 steps, starting with choosing Starter or Pro) and employers (5 steps), plus providers and migration agencies.

## Pricing

Route: `/pricing`

Applicant plans (Starter $35, Pro $79) and a comparison table, both built from plan records; employer plans with "talk to sales"; billing FAQ.

## Guides

Routes: `/blog`, `/blog/[slug]`

List: floating category filter bar with icons and counts, newest guide as a featured dark card on "All guides", richer guide cards. Guide pages: reading progress bar, header with category, author, reading time, "rules change often" badge for immigration content and copy-link; short answer and who-it's-for callout; numbered sections with anchor links; checklist-style bullets; mid-article CTA; FAQ; source cards with domains; disclaimer; sticky "On this page" contents with scroll-spy and key facts (countries, relevant opportunity types) on desktop, collapsible contents on mobile; related guides; Article/FAQPage structured data.

## Contact

Route: `/contact`

Quick-route cards (help centre, applicant support, hiring); form with topic tiles (saved to `contact_messages`; `?topic=` pre-selects); direct email addresses; "before you write" tips; common questions.

## Help Centre

Route: `/faq`

Search-first hero with popular searches; topic cards (students and graduates, employers, plans and billing) with answer counts; sticky topic navigation with grouped answers; "still need help" panel. FAQPage structured data.

## Legal

Routes: `/privacy`, `/terms`

Draft banner; "at a glance" summary cards; numbered sections with anchor links; sticky contents with scroll-spy; copy-link and print; contact and related-document cards.

## Search

Route: `/search` (`?q=`, `?type=guides|help|types`)

Large search box (press "/" to focus); result-type tabs with counts; matched terms highlighted; empty-query state with opportunity types, popular guides and common questions. Opportunity listings are added to results by each service stage (U6 onward). Jobs never appear in public search: they are Pro only, inside the dashboard. Not indexed.
