'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Bookmark } from 'lucide-react';
import { setSavedJob } from '@/lib/actions/saved-jobs';

interface SaveButtonProps {
  jobId: string;
  initialSaved?: boolean;
  className?: string;
}

export function SaveButton({ jobId, initialSaved = false, className = '' }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    const shouldSave = !saved;

    setPending(true);
    const toastId = toast.loading(shouldSave ? 'Adding to saved…' : 'Removing from saved…');

    try {
      const result = await setSavedJob(jobId, shouldSave);

      if (!result.ok) {
        toast.error(result.error, { id: toastId });
        return;
      }

      setSaved(result.data.saved);
      toast.success(
        result.data.saved ? 'Added to saved jobs' : 'Removed from saved jobs',
        { id: toastId },
      );
    } catch {
      toast.error('Something went wrong. Please try again.', { id: toastId });
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      aria-label={saved ? 'Unsave job' : 'Save job'}
      aria-pressed={saved}
      title={saved ? 'Saved job' : 'Save job'}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border shadow-sm transition-all
        ${saved
          ? 'border-green bg-green text-white shadow-green/20 ring-2 ring-green/15 hover:bg-green-hover'
          : 'border-border bg-white text-muted-text hover:border-green/30 hover:bg-soft-green hover:text-green'
        }
        ${pending ? 'opacity-50' : ''}
        ${className}`}
    >
      <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
    </button>
  );
}
