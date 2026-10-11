import React, { useEffect, useRef } from 'react';
import { CornerMarkers } from '../ui/CornerMarkers';

/**
 * HeroWireframeGraphic
 * Right-hand hero visual: animated orbital schematic with rAF rotation.
 * Labels: SCHEMATIC // 00-ROOT | ID: ROSTER_GRAPH_V1
 * STATUS: SYNCHRONIZED | MODE: ENFORCED
 * Respects prefers-reduced-motion.
 */
export function HeroWireframeGraphic({ className = '' }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const outerLabelRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let angle = 0;
    let angleInner = 0;
    let rafId;

    const animate = () => {
      angle += 0.35;
      angleInner -= 0.22;

      if (outerRef.current) {
        outerRef.current.setAttribute('transform', `rotate(${angle}, 100, 100)`);
      }
      if (innerRef.current) {
        innerRef.current.setAttribute('transform', `rotate(${angleInner}, 100, 100)`);
      }
      // Counter-rotate labels so they stay readable
      if (outerLabelRef.current) {
        outerLabelRef.current.setAttribute('transform', `rotate(${-angle}, 100, 100)`);
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className={`relative w-full max-w-[420px] aspect-square mx-auto border-hairline border-border bg-surface flex flex-col justify-between overflow-hidden group ${className}`}
      style={{ borderRadius: '2px' }}
      aria-label="AUTH_NODE roster schematic — synchronized, enforced mode"
      role="img"
    >
      <CornerMarkers size={10} strokeWidth={1.5} />

      {/* Top Coordinate Header */}
      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-muted border-b border-border/50 px-4 py-2.5 shrink-0">
        <span>SCHEMATIC // 00-ROOT</span>
        <span>ID: ROSTER_GRAPH_V1</span>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 relative">
        <svg
          className="w-full h-full absolute inset-0"
          viewBox="0 0 200 200"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Crosshair guide lines */}
          <line x1="0" y1="100" x2="200" y2="100" stroke="var(--color-border)" strokeWidth="0.5" opacity="0.6" />
          <line x1="100" y1="0" x2="100" y2="200" stroke="var(--color-border)" strokeWidth="0.5" opacity="0.6" />

          {/* Outer dashed orbit ring */}
          <circle
            cx="100" cy="100" r="78"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="5 6"
          />

          {/* Inner solid orbit ring */}
          <circle
            cx="100" cy="100" r="44"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="0.75"
            opacity="0.25"
          />

          {/* Outer rotating group: 3 satellite nodes */}
          <g ref={outerRef}>
            {/* Connector lines */}
            <line x1="100" y1="100" x2="100" y2="22"  stroke="var(--color-primary)" strokeWidth="0.75" opacity="0.2" />
            <line x1="100" y1="100" x2="178" y2="100" stroke="var(--color-primary)" strokeWidth="0.75" opacity="0.2" />
            <line x1="100" y1="100" x2="100" y2="178" stroke="var(--color-primary)" strokeWidth="0.75" opacity="0.2" />

            {/* TOP — Mint (Student Node) */}
            <circle cx="100" cy="22" r="5" fill="var(--color-accent-mint)" />
            <circle cx="100" cy="22" r="8.5" fill="none" stroke="var(--color-accent-mint)" strokeWidth="0.75" opacity="0.4" />

            {/* RIGHT — Gold (Auth Gateway) */}
            <circle cx="178" cy="100" r="4" fill="var(--color-accent-gold)" />
            <circle cx="178" cy="100" r="7.5" fill="none" stroke="var(--color-accent-gold)" strokeWidth="0.75" opacity="0.4" />

            {/* BOTTOM — Coral (Teacher Node) */}
            <circle cx="100" cy="178" r="5" fill="var(--color-accent-coral)" />
            <circle cx="100" cy="178" r="8.5" fill="none" stroke="var(--color-accent-coral)" strokeWidth="0.75" opacity="0.4" />

            {/* Counter-rotated node labels so they stay readable */}
            <g ref={outerLabelRef}>
              <text x="100" y="10" textAnchor="middle" fontFamily="monospace" fontSize="5" letterSpacing="0.5" fill="var(--color-accent-mint)" opacity="0.7">STD</text>
              <text x="193" y="102" textAnchor="start" fontFamily="monospace" fontSize="5" letterSpacing="0.5" fill="var(--color-accent-gold)" opacity="0.7">GW</text>
              <text x="100" y="192" textAnchor="middle" fontFamily="monospace" fontSize="5" letterSpacing="0.5" fill="var(--color-accent-coral)" opacity="0.7">TCH</text>
            </g>
          </g>

          {/* Inner counter-rotating group: 2 small pulse nodes */}
          <g ref={innerRef}>
            <circle cx="100" cy="56" r="2.5" fill="var(--color-primary)" opacity="0.5" />
            <circle cx="100" cy="144" r="2.5" fill="var(--color-primary)" opacity="0.5" />
          </g>

          {/* Central AUTH node */}
          <circle cx="100" cy="100" r="18" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="1" opacity="0.9" />
          <circle cx="100" cy="100" r="12" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="0.5" opacity="0.5" />
          <circle cx="100" cy="100" r="4.5" fill="var(--color-primary)" />

          {/* Pulse ring */}
          <circle cx="100" cy="100" r="20" fill="none" stroke="var(--color-primary)" strokeWidth="0.75" opacity="0.3">
            <animate attributeName="r" values="16;26;16" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="2.8s" repeatCount="indefinite" />
          </circle>

          {/* AUTH_NODE center label */}
          <text
            x="100"
            y="122"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="6.5"
            letterSpacing="1"
            fill="var(--color-foreground)"
            opacity="0.75"
            style={{ userSelect: 'none' }}
          >
            AUTH_NODE // 200 OK
          </text>
        </svg>
      </div>

      {/* Bottom Status Bar */}
      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-muted border-t border-border/50 px-4 py-2.5 shrink-0">
        <span>STATUS: SYNCHRONIZED</span>
        <span className="text-primary font-bold">MODE: ENFORCED</span>
      </div>
    </div>
  );
}
