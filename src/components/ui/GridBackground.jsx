import React from 'react';

/**
 * GridBackground (Technical Blueprint Mosaic)
 * - Seamless SVG mosaic background of interlocking rectangular panels
 *   divided by 0.5px hairlines (#3A3A38 at 0.3 opacity / dark equivalent) on Paper #F7F7F5.
 * - Pointer-events none, fixed full viewport layer, z-index -10.
 */
export function GridBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[-10] overflow-hidden" 
      aria-hidden="true"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern 
            id="mosaic-blueprint" 
            width="320" 
            height="320" 
            patternUnits="userSpaceOnUse"
          >
            {/* Interlocking rectangular panels with 0.5px hairlines */}
            {/* Main outer boundary */}
            <rect x="0" y="0" width="320" height="320" fill="none" stroke="var(--color-grid-line)" strokeWidth="0.5" />
            
            {/* Quadrant 1: Large square panel */}
            <rect x="0" y="0" width="160" height="160" fill="none" stroke="var(--color-grid-line)" strokeWidth="0.5" />
            <line x1="80" y1="0" x2="80" y2="160" stroke="var(--color-grid-line)" strokeWidth="0.5" strokeDasharray="4 4" />
            
            {/* Quadrant 2: Horizontal strips */}
            <rect x="160" y="0" width="160" height="80" fill="none" stroke="var(--color-grid-line)" strokeWidth="0.5" />
            <rect x="160" y="80" width="160" height="80" fill="none" stroke="var(--color-grid-line)" strokeWidth="0.5" />
            
            {/* Quadrant 3: Vertical blocks */}
            <rect x="0" y="160" width="80" height="160" fill="none" stroke="var(--color-grid-line)" strokeWidth="0.5" />
            <rect x="80" y="160" width="80" height="160" fill="none" stroke="var(--color-grid-line)" strokeWidth="0.5" />
            
            {/* Quadrant 4: Asymmetric subdivisions */}
            <rect x="160" y="160" width="160" height="160" fill="none" stroke="var(--color-grid-line)" strokeWidth="0.5" />
            <rect x="160" y="160" width="100" height="100" fill="none" stroke="var(--color-grid-line)" strokeWidth="0.5" />
            <line x1="260" y1="160" x2="260" y2="320" stroke="var(--color-grid-line)" strokeWidth="0.5" />
            <line x1="160" y1="260" x2="320" y2="260" stroke="var(--color-grid-line)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mosaic-blueprint)" />
      </svg>
    </div>
  );
}
