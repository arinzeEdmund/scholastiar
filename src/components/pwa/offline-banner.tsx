'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const off = () => setOffline(true);
    const on = () => setOffline(false);
    window.addEventListener('offline', off);
    window.addEventListener('online', on);
    // Set initial state in case the component mounts while already offline
    setOffline(!navigator.onLine);
    return () => {
      window.removeEventListener('offline', off);
      window.removeEventListener('online', on);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 bg-[#1E1E1E] px-4 py-2 text-sm text-white"
    >
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>You&apos;re offline. Some content may not be available.</span>
    </div>
  );
}
