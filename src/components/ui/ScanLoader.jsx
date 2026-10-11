import React from 'react';

/**
 * ScanLoader
 * 2px track with inner animated scanning bar.
 * Infinite slide in 2s with cubic-bezier(0.8, 0, 0.2, 1).
 */
export function ScanLoader({ className = '', variant = 'primary', height = 'h-[2px]' }) {
  const barColor = variant === 'blue' 
    ? 'bg-blue-500' 
    : 'bg-primary';

  return (
    <div 
      className={`w-full ${height} bg-border overflow-hidden relative ${className}`}
      role="progressbar"
      aria-label="Loading..."
    >
      <div 
        className={`absolute top-0 bottom-0 left-0 w-1/2 ${barColor} animate-scan`} 
      />
    </div>
  );
}
