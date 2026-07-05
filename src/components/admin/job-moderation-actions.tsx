'use client';

import { useTransition } from 'react';
import toast from 'react-hot-toast';
import { updateJobStatus } from '@/lib/actions/admin';

interface JobModerationActionsProps {
  jobId: string;
  isPending: boolean;
  isActive: boolean;
}

export function JobModerationActions({ jobId, isPending, isActive }: JobModerationActionsProps) {
  const [pending, startTransition] = useTransition();

  function moderate(status: 'active' | 'rejected' | 'paused') {
    const labels   = { active: 'Approving…',  rejected: 'Rejecting…', paused: 'Pausing…'  };
    const success  = { active: 'Job approved', rejected: 'Job rejected', paused: 'Job paused' };

    const toastId = toast.loading(labels[status]);

    const fd = new FormData();
    fd.append('jobId', jobId);
    fd.append('status', status);
    fd.append('note', status === 'active' ? 'Approved by admin' : status === 'rejected' ? 'Rejected by admin' : 'Paused by admin');

    startTransition(async () => {
      const result = await updateJobStatus(fd);
      if (!result.ok) {
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success(success[status], { id: toastId });
    });
  }

  if (!isPending && !isActive) {
    return <span className="text-xs text-white/30">—</span>;
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {isPending && (
        <>
          <button
            onClick={() => moderate('active')}
            disabled={pending}
            className="rounded px-3 py-1 text-xs font-medium bg-green/20 text-green hover:bg-green/30 transition-colors disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => moderate('rejected')}
            disabled={pending}
            className="rounded px-3 py-1 text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
          >
            Reject
          </button>
        </>
      )}
      {isActive && (
        <button
          onClick={() => moderate('paused')}
          disabled={pending}
          className="rounded px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
        >
          Pause
        </button>
      )}
    </div>
  );
}
