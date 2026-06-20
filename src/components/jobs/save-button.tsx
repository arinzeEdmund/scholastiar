'use client';

import { useState, useTransition } from 'react';
import { Bookmark } from 'lucide-react';
import { toggleSaveJob } from '@/lib/actions/saved-jobs';

interface SaveButtonProps {
  jobId: string;
  initialSaved?: boolean;
  className?: string;
}

export function SaveButton({ jobId, initialSaved = false, className = '' }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const result = await toggleSaveJob(jobId);
      setSaved(result.saved);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      aria-label={saved ? 'Unsave job' : 'Save job'}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors
        ${saved
          ? 'border-[#10B65B]/30 bg-[#EAF6F0] text-[#10B65B]'
          : 'border-[#E5E7EB] bg-white text-[#8A8F98] hover:border-[#10B65B]/30 hover:bg-[#EAF6F0] hover:text-[#10B65B]'
        }
        ${pending ? 'opacity-50' : ''}
        ${className}`}
    >
      <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
    </button>
  );
}
