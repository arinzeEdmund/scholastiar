'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PWAUpdateToast() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.ready.then((reg) => {
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(worker);
          }
        });
      });
    });
  }, []);

  function applyUpdate() {
    if (!waitingWorker) return;
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }

  if (!waitingWorker) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-20 inset-x-4 z-50 mx-auto max-w-sm rounded-lg border border-border bg-white p-4 shadow-lg md:bottom-6 md:right-6 md:left-auto md:inset-x-auto"
    >
      <p className="text-sm font-medium text-[#1E1E1E]">A new version is available</p>
      <p className="mt-1 text-xs text-[#5F6368]">Refresh to get the latest updates.</p>
      <Button size="sm" onClick={applyUpdate} className="mt-3 gap-2">
        <RefreshCw className="h-3.5 w-3.5" />
        Refresh now
      </Button>
    </div>
  );
}
