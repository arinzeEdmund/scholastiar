import { OnboardingShell } from '@/components/onboarding/onboarding-shell';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <OnboardingShell>{children}</OnboardingShell>;
}
