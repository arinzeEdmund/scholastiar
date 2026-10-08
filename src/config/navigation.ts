import {
  BarChart3,
  Bell,
  BookOpenCheck,
  Briefcase,
  Building2,
  CalendarClock,
  ClipboardList,
  Compass,
  CreditCard,
  FileCheck2,
  FileSearch,
  FileText,
  GraduationCap,
  Handshake,
  Inbox,
  KanbanSquare,
  LayoutDashboard,
  type LucideIcon,
  Megaphone,
  MessageSquare,
  Newspaper,
  Plane,
  Radar,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Bookmark,
  Send,
  Award,
  Globe2,
  ListChecks,
} from "lucide-react";

import type { ShellKey } from "./personas";

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  /** Pro-plan feature: shown with a "Pro" badge (Starter sees it locked). */
  pro?: boolean;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

// Source: STRUCTURE/BUILD_GUIDE/ROUTES.md

export const opportunityNav: NavItem[] = [
  { label: "Universities", href: "/universities", icon: GraduationCap },
  { label: "Scholarships", href: "/scholarships", icon: Award },
  // Jobs are Pro-only job connections inside the dashboard (PRICING.md → Jobs Are Pro Only).
  { label: "Student jobs", href: "/dashboard/jobs", icon: Briefcase, pro: true },
  { label: "Post-study jobs with residency", href: "/dashboard/jobs/post-study", icon: Plane, pro: true },
];

export const publicNav: NavItem[] = [
  { label: "Study abroad", href: "/universities" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "How it works", href: "/how-it-works" },
  { label: "For employers", href: "/for-employers" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

export const publicFooterNav: NavGroup[] = [
  {
    label: "Opportunities",
    items: [
      { label: "Universities", href: "/universities" },
      { label: "Scholarships", href: "/scholarships" },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "For employers", href: "/for-employers" },
      { label: "Migration agencies", href: "/migration-agencies" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Guides", href: "/blog" },
      { label: "Working while you study", href: "/blog/working-while-you-study-abroad" },
      { label: "Help centre", href: "/faq" },
      { label: "Search", href: "/search" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export const candidateTopNav: NavItem[] = [
  { label: "Discover", href: "/dashboard", icon: Compass },
  { label: "Applications", href: "/applications", icon: ClipboardList },
  { label: "AI CV", href: "/ai-cv", icon: Sparkles },
  { label: "Signia", href: "/signia", icon: FileCheck2 },
  { label: "Messages", href: "/messages", icon: MessageSquare },
];

/** Mobile PWA bottom tabs — STRUCTURE/BUILD_GUIDE/PWA_FIRST_WEB_APP.md */
export const candidateBottomTabs: NavItem[] = [
  { label: "Discover", href: "/dashboard", icon: Compass },
  { label: "Saved", href: "/saved", icon: Bookmark },
  { label: "Apply", href: "/applications", icon: Send },
  { label: "Alerts", href: "/notifications", icon: Bell },
  { label: "Me", href: "/profile", icon: User },
];

export const candidateUserMenu: NavItem[] = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Documents", href: "/profile/documents", icon: FileText },
  { label: "PersonalityAI CV", href: "/personality-cv", icon: Sparkles },
  { label: "AI Apply Agent", href: "/apply-agent", icon: Radar },
  { label: "Apply For Me", href: "/apply-for-me", icon: Handshake },
  { label: "Migration agencies", href: "/migration-agencies/dashboard", icon: Globe2 },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarShellNav {
  groups: NavGroup[];
  primaryAction?: NavItem;
  notificationsHref?: string;
}

export const sidebarNav: Record<Exclude<ShellKey, "public" | "candidate">, SidebarShellNav> = {
  employer: {
    primaryAction: { label: "Post a job", href: "/employers/jobs/new" },
    notificationsHref: "/employers/notifications",
    groups: [
      {
        items: [
          { label: "Dashboard", href: "/employers/dashboard", icon: LayoutDashboard },
          { label: "Jobs", href: "/employers/jobs", icon: Briefcase },
          { label: "Pipeline", href: "/employers/pipeline", icon: KanbanSquare },
          { label: "Signia search", href: "/employers/signia", icon: Search },
          { label: "Messages", href: "/employers/messages", icon: MessageSquare },
          { label: "Analytics", href: "/employers/analytics", icon: BarChart3 },
        ],
      },
      {
        label: "Hiring tools",
        items: [
          { label: "Screening questions", href: "/employers/screening-questions", icon: ListChecks },
          { label: "Work eligibility", href: "/employers/work-eligibility", icon: Globe2 },
        ],
      },
      {
        label: "Company",
        items: [
          { label: "Company profile", href: "/employers/company", icon: Building2 },
          { label: "Team", href: "/employers/team", icon: Users },
          { label: "Billing", href: "/employers/billing", icon: CreditCard },
          { label: "Settings", href: "/employers/settings", icon: Settings },
        ],
      },
    ],
  },
  provider: {
    primaryAction: { label: "New opportunity", href: "/providers/opportunities/new" },
    groups: [
      {
        items: [
          { label: "Dashboard", href: "/providers/dashboard", icon: LayoutDashboard },
          { label: "Opportunities", href: "/providers/opportunities", icon: BookOpenCheck },
          { label: "Applications", href: "/providers/applications", icon: Inbox },
        ],
      },
      {
        label: "Organisation",
        items: [
          { label: "Team", href: "/providers/team", icon: Users },
          { label: "Settings", href: "/providers/settings", icon: Settings },
        ],
      },
    ],
  },
  forwarder: {
    groups: [
      {
        items: [
          { label: "Dashboard", href: "/forwarder/dashboard", icon: LayoutDashboard },
          { label: "Contracts", href: "/forwarder/contracts", icon: ScrollText },
          { label: "Open board", href: "/apply-for-me/board", icon: KanbanSquare },
        ],
      },
    ],
  },
  office: {
    groups: [
      {
        items: [
          { label: "Dashboard", href: "/office/dashboard", icon: LayoutDashboard },
          { label: "Services", href: "/office/services", icon: Briefcase },
          { label: "Appointments", href: "/office/appointments", icon: CalendarClock },
        ],
      },
    ],
  },
  admin: {
    groups: [
      { items: [{ label: "Overview", href: "/admin", icon: LayoutDashboard }] },
      {
        label: "People",
        items: [
          { label: "Users", href: "/admin/users", icon: Users },
          { label: "Employers", href: "/admin/employers", icon: Building2 },
          { label: "Providers", href: "/admin/providers", icon: GraduationCap },
        ],
      },
      {
        label: "Opportunities",
        items: [
          { label: "All opportunities", href: "/admin/opportunities", icon: BookOpenCheck },
          { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
          { label: "Universities", href: "/admin/universities", icon: GraduationCap },
          { label: "Scholarships", href: "/admin/scholarships", icon: Award },
          { label: "Discovery engine", href: "/admin/discovery", icon: Radar },
        ],
      },
      {
        label: "Trust & operations",
        items: [
          { label: "Applications", href: "/admin/applications", icon: ClipboardList },
          { label: "Reports", href: "/admin/reports", icon: ShieldCheck },
          { label: "AI generations", href: "/admin/ai-generations", icon: Sparkles },
          { label: "PersonalityAI CV", href: "/admin/personality-cv", icon: FileSearch },
          { label: "Messages", href: "/admin/messages", icon: MessageSquare },
          { label: "Notifications", href: "/admin/notifications", icon: Megaphone },
        ],
      },
      {
        label: "Business",
        items: [
          { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
          { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
          { label: "Blog", href: "/admin/blog", icon: Newspaper },
          { label: "Settings", href: "/admin/settings", icon: Settings },
        ],
      },
    ],
  },
};

/** Partner agencies share the office shell with a narrower nav. */
export const partnerAgencyNav: SidebarShellNav = {
  groups: [{ items: [{ label: "Dashboard", href: "/partner-agency/dashboard", icon: LayoutDashboard }] }],
};
