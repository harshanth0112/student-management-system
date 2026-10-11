import React from 'react';
import { Toaster as HotToaster } from 'react-hot-toast';

/**
 * Editorial Toast Configuration
 * - 1px border, 2px radius, Space Mono text, NO shadows
 */
export function ToastContainer() {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--color-bg)',
          color: 'var(--color-fg)',
          border: '1px solid var(--color-border)',
          borderRadius: '2px',
          boxShadow: 'none',
          padding: '12px 18px',
          fontFamily: '"Space Mono", monospace',
          fontSize: '11px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        },
        success: {
          iconTheme: {
            primary: 'var(--color-primary)',
            secondary: 'var(--color-bg)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--color-danger)',
            secondary: 'var(--color-bg)',
          },
        },
      }}
    />
  );
}
