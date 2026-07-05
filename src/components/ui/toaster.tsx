'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-center"
      gutter={8}
      toastOptions={{
        duration: 3500,
        style: {
          background: '#ffffff',
          color: '#1E1E1E',
          border: '1px solid #E5E7EB',
          borderRadius: '0.625rem',
          fontSize: '14px',
          fontWeight: '500',
          padding: '10px 14px',
          boxShadow: '0 4px 16px rgb(0 0 0 / 0.08)',
          maxWidth: '360px',
        },
        success: {
          duration: 3000,
          iconTheme: { primary: '#10B65B', secondary: '#ffffff' },
        },
        error: {
          duration: 4500,
          iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
        },
        loading: {
          iconTheme: { primary: '#10B65B', secondary: '#ffffff' },
        },
      }}
    />
  );
}
