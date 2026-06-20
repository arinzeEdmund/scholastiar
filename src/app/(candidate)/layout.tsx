import { MobileBottomTabs } from '@/components/pwa/mobile-bottom-tabs';

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Main content — pb-16 to clear the fixed bottom nav on mobile */}
      <div className="flex min-h-screen flex-col pb-16 md:pb-0">{children}</div>
      <MobileBottomTabs />
    </>
  );
}
