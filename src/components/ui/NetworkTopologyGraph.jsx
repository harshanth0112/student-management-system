import React from 'react';

/**
 * NetworkTopologyGraph
 * Abstract SVG visualization of a design system / student directory network.
 * - Circular container (max-width 450px) with 1px border.
 * - Central 16px solid forest green node (var(--color-primary)).
 * - Three orbiting nodes on dashed paths (140px radius) connected with 0.2 opacity lines.
 * - Linear 20s infinite rotation (stops under prefers-reduced-motion).
 */
export function NetworkTopologyGraph({ className = '' }) {
  return (
    <div 
      className={`relative w-full max-w-[450px] aspect-square mx-auto border-hairline border-border bg-surface p-4 flex items-center justify-center overflow-hidden ${className}`}
      aria-label="Network Topology Visualization"
    >
      {/* Background blueprint coordinate markings */}
      <div className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-widest text-muted">
        SYS.TOPO // 01-NET
      </div>
      <div className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-widest text-muted">
        RAD: 140PX • NODES: 04
      </div>

      <svg className="w-full h-full" viewBox="0 0 360 360">
        {/* Dashed outer orbit ring */}
        <circle 
          cx="180" 
          cy="180" 
          r="140" 
          fill="none" 
          stroke="var(--color-border)" 
          strokeWidth="1" 
          strokeDasharray="6 6" 
        />
        
        {/* Inner secondary orbit ring */}
        <circle 
          cx="180" 
          cy="180" 
          r="80" 
          fill="none" 
          stroke="var(--color-border)" 
          strokeWidth="0.5" 
          strokeDasharray="3 3" 
        />

        {/* Central Node (16px) */}
        <circle 
          cx="180" 
          cy="180" 
          r="8" 
          fill="var(--color-primary)" 
        />
        <circle 
          cx="180" 
          cy="180" 
          r="14" 
          fill="none" 
          stroke="var(--color-primary)" 
          strokeWidth="1" 
          opacity="0.4" 
        />

        {/* Rotating Orbiting Group (20s linear, disabled under reduced motion) */}
        <g className="animate-orbit origin-center" style={{ transformOrigin: '180px 180px' }}>
          {/* Connector lines from center to orbiting nodes at 0.2 opacity */}
          <line x1="180" y1="180" x2="180" y2="40" stroke="var(--color-primary)" strokeWidth="1" opacity="0.25" />
          <line x1="180" y1="180" x2="301" y2="250" stroke="var(--color-primary)" strokeWidth="1" opacity="0.25" />
          <line x1="180" y1="180" x2="59" y2="250" stroke="var(--color-primary)" strokeWidth="1" opacity="0.25" />

          {/* Node 1 (Top) - Coral Accent */}
          <circle cx="180" cy="40" r="6" fill="var(--color-accent-coral)" />
          <circle cx="180" cy="40" r="10" fill="none" stroke="var(--color-accent-coral)" strokeWidth="1" opacity="0.5" />

          {/* Node 2 (Bottom Right) - Mint Accent */}
          <circle cx="301" cy="250" r="6" fill="var(--color-accent-mint)" />
          <circle cx="301" cy="250" r="10" fill="none" stroke="var(--color-accent-mint)" strokeWidth="1" opacity="0.5" />

          {/* Node 3 (Bottom Left) - Gold Accent */}
          <circle cx="59" cy="250" r="6" fill="var(--color-accent-gold)" />
          <circle cx="59" cy="250" r="10" fill="none" stroke="var(--color-accent-gold)" strokeWidth="1" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}
