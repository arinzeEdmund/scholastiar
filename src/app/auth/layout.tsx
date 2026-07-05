import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-soft-background px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-2xl font-semibold tracking-tight text-primary-text">
          Scholastiar<span className="text-green">.</span>
        </Link>
      </div>
      <div className="w-full max-w-md rounded-xl border border-border bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
