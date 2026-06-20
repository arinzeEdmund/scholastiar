import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryProvider } from '@/providers/query-provider';
import { ServiceWorkerRegistration } from '@/components/pwa/service-worker-registration';
import { OfflineBanner } from '@/components/pwa/offline-banner';
import { InstallPrompt } from '@/components/pwa/install-prompt';
import { PWAUpdateToast } from '@/components/pwa/pwa-update-toast';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Scholastiar.ai — International Opportunities & Mobility',
    template: '%s | Scholastiar.ai',
  },
  description:
    'Discover jobs, scholarships, fellowships, grants, and universities that advance your international career and mobility goals.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Scholastiar',
  },
};

export const viewport: Viewport = {
  themeColor: '#10B65B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <QueryProvider>
          <TooltipProvider>
            <OfflineBanner />
            {children}
            <InstallPrompt />
            <PWAUpdateToast />
          </TooltipProvider>
        </QueryProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
