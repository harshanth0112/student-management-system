import React from 'react';
import { CornerMarkers } from '../ui/CornerMarkers';

/**
 * HeroWireframeGraphic
 * Right-hand hero visual asset:
 * Square container with dashed circular orbit, coordinate markings,
 * and a luminosity-blended blueprint student silhouette / technical schematic.
 */
export function HeroWireframeGraphic({ className = '' }) {
  return (
    <div 
      className={`relative w-full max-w-[420px] aspect-square mx-auto border-hairline border-border bg-surface p-6 flex flex-col justify-between overflow-hidden group ${className}`}
      style={{ borderRadius: '2px' }}
      aria-hidden="true"
    >
      <CornerMarkers size={10} strokeWidth={1.5} />

      {/* Top Coordinate Header */}
      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-muted border-b border-border/50 pb-2">
        <span>SCHEMATIC // 00-ROOT</span>
        <span>ID: ROSTER_GRAPH_V1</span>
      </div>

      {/* Center Wireframe Orbit with Dashed Circles & Silhouette */}
      <div className="relative my-auto flex items-center justify-center">
        <svg className="w-56 h-56" viewBox="0 0 200 200">
          {/* Dashed circular orbit */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="5 5"
          />
          <circle
            cx="100"
            cy="100"
            r="45"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="1"
            opacity="0.3"
          />

          {/* Central Blueprint Geometric Shape */}
          <rect
            x="85"
            y="85"
            width="30"
            height="30"
            fill="var(--color-primary)"
            opacity="0.15"
            stroke="var(--color-primary)"
            strokeWidth="1"
          />
          <circle cx="100" cy="100" r="4" fill="var(--color-primary)" />

          {/* Orbital Satellite Nodes */}
          <circle cx="100" cy="20" r="5" fill="var(--color-accent-mint)" />
          <circle cx="180" cy="100" r="4" fill="var(--color-accent-gold)" />
          <circle cx="100" cy="180" r="5" fill="var(--color-accent-coral)" />

          {/* Crosshair guide lines */}
          <line x1="20" y1="100" x2="180" y2="100" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="100" y1="20" x2="100" y2="180" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>

        {/* Abstract Luminosity-Blended Watermark Badge */}
        <div 
          className="absolute font-mono text-[11px] uppercase tracking-widest text-foreground font-bold px-3 py-1 border-hairline border-border bg-background/80 backdrop-blur-sm select-none mix-blend-luminosity opacity-90 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-300"
          style={{ borderRadius: '2px' }}
        >
          AUTH_NODE // 200 OK
        </div>
      </div>

      {/* Bottom Telemetry Legend */}
      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-muted border-t border-border/50 pt-2">
        <span>STATUS: SYNCHRONIZED</span>
        <span className="text-primary font-bold">MODE: ENFORCED</span>
      </div>
    </div>
  );
}
