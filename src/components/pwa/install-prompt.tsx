'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('pwa-install-dismissed');
    if (stored) {
      setDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setPrompt(null);
  }

  function handleDismiss() {
    localStorage.setItem('pwa-install-dismissed', '1');
    setDismissed(true);
    setPrompt(null);
  }

  if (!prompt || dismissed) return null;

  return (
    <div
      role="complementary"
      aria-label="Install app prompt"
      className="fixed bottom-20 inset-x-4 z-50 mx-auto max-w-sm rounded-lg border border-border bg-white p-4 shadow-lg md:bottom-6 md:right-6 md:left-auto md:inset-x-auto"
    >
      <button
        onClick={handleDismiss}
        aria-label="Dismiss install prompt"
        className="absolute right-3 top-3 text-[#8A8F98] hover:text-[#1E1E1E]"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="pr-6 text-sm font-medium text-[#1E1E1E]">
        Add Scholastiar.ai to your phone
      </p>
      <p className="mt-1 text-xs text-[#5F6368]">
        Get deadline alerts and saved opportunities — right on your home screen.
      </p>
      <Button size="sm" onClick={handleInstall} className="mt-3 gap-2">
        <Download className="h-3.5 w-3.5" />
        Add to home screen
      </Button>
    </div>
  );
}
