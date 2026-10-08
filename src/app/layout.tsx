import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { DevToolbar } from "@/components/dev/dev-toolbar";
import { Providers } from "@/components/providers";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { OfflineBanner } from "@/components/pwa/offline-banner";
import { PWAUpdateToast } from "@/components/pwa/pwa-update-toast";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import { Toaster } from "@/components/ui/toaster";
import { THEME_COLORS, THEME_INIT_SCRIPT } from "@/lib/theme";

import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Scholastiar.ai", template: "%s · Scholastiar.ai" },
  description: "Find universities, scholarships and funding abroad, and apply with AI that knows your profile.",
  applicationName: "Scholastiar.ai",
  appleWebApp: { capable: true, title: "Scholastiar", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the theme script sets the "dark" class before React hydrates.
    <html lang="en" className={`${inter.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-card px-3 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Providers>
          {children}
          <OfflineBanner />
          <InstallPrompt />
          <ServiceWorkerRegistration />
          <PWAUpdateToast />
          <Toaster />
          <DevToolbar />
        </Providers>
      </body>
    </html>
  );
}
