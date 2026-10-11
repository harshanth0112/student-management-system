import React from 'react';

/**
 * Editorial Skeleton
 * - Flat block with subtle opacity pulse
 * - Disabled completely under prefers-reduced-motion (via .skeleton-pulse in index.css)
 */
export function Skeleton({ className = '', variant = 'block' }) {
  if (variant === 'text') {
    return (
      <div 
        className={`h-4 bg-muted/15 border-hairline border-border skeleton-pulse animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div 
      className={`bg-muted/10 border-hairline border-border skeleton-pulse animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}
