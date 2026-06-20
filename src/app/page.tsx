import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Globe, Plane, Star } from 'lucide-react';

const FEATURES = [
  { icon: Globe,  label: 'Jobs in 30+ countries', desc: 'Find cross-border roles matched to your goals' },
  { icon: Plane,  label: 'Visa-sponsored opportunities', desc: 'Filter by sponsorship availability and visa type' },
  { icon: Star,   label: 'AI-powered applications', desc: 'Auto-generate tailored CVs and cover letters' },
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F7F9F7]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5E7EB]">
        <span className="text-lg font-semibold text-[#1E1E1E]">
          Scholastiar<span className="text-[#10B65B]">.</span>
        </span>
        <div className="flex gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/auth/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/auth/sign-up/candidate">Get started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-4xl font-semibold leading-tight text-[#1E1E1E] max-w-xl">
          Your passport to international<span className="text-[#10B65B]"> opportunity</span>
        </h1>
        <p className="mt-4 text-[#5F6368] max-w-md text-base leading-relaxed">
          Jobs, scholarships, fellowships, and more — matched to your goals, visa situation,
          and location. Powered by AI.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/auth/sign-up/candidate">Create free account</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/jobs">Browse jobs</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="rounded-xl border border-[#E5E7EB] bg-white p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF6F0]">
                <Icon className="h-4 w-4 text-[#10B65B]" />
              </div>
              <p className="text-sm font-semibold text-[#1E1E1E]">{label}</p>
              <p className="mt-1 text-xs text-[#5F6368]">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
