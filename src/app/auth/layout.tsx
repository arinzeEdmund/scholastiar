import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F9F7] px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-2xl font-semibold tracking-tight text-[#1E1E1E]">
          Scholastiar<span className="text-[#10B65B]">.</span>
        </Link>
      </div>
      <div className="w-full max-w-md rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
