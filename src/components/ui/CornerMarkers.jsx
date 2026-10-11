import React from 'react';

/**
 * CornerMarkers
 * Adds four 10px x 10px L-shaped blueprint corner markers in var(--color-corner-marker)
 * at each corner of a container.
 */
export function CornerMarkers({ className = '', size = 10, strokeWidth = 1.5 }) {
  return (
    <div className={`pointer-events-none absolute inset-0 select-none ${className}`} aria-hidden="true">
      {/* Top Left */}
      <svg 
        className="absolute -top-px -left-px" 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
      >
        <path 
          d={`M0 ${size} V0 H${size}`} 
          fill="none" 
          stroke="var(--color-corner-marker)" 
          strokeWidth={strokeWidth} 
        />
      </svg>

      {/* Top Right */}
      <svg 
        className="absolute -top-px -right-px" 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
      >
        <path 
          d={`M0 0 H${size} V${size}`} 
          fill="none" 
          stroke="var(--color-corner-marker)" 
          strokeWidth={strokeWidth} 
        />
      </svg>

      {/* Bottom Left */}
      <svg 
        className="absolute -bottom-px -left-px" 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
      >
        <path 
          d={`M0 0 V${size} H${size}`} 
          fill="none" 
          stroke="var(--color-corner-marker)" 
          strokeWidth={strokeWidth} 
        />
      </svg>

      {/* Bottom Right */}
      <svg 
        className="absolute -bottom-px -right-px" 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
      >
        <path 
          d={`M${size} 0 V${size} H0`} 
          fill="none" 
          stroke="var(--color-corner-marker)" 
          strokeWidth={strokeWidth} 
        />
      </svg>
    </div>
  );
}
