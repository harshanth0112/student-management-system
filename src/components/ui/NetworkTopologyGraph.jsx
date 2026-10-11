import React, { useEffect, useRef } from 'react';

/**
 * NetworkTopologyGraph
 * Technical blueprint-style SVG network visualization.
 * Central AUTH_NODE with rotating orbiting student nodes.
 * Labels: SCHEMATIC // 00-ROOT, ID: ROSTER_GRAPH_V1
 * Status bar: STATUS: SYNCHRONIZED | MODE: ENFORCED
 * Respects prefers-reduced-motion.
 */
export function NetworkTopologyGraph({ className = '' }) {
  const outerGroupRef = useRef(null);
  const innerGroupRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let angle = 0;
    let angleInner = 0;
    let rafId;

    const animate = () => {
      angle += 0.3;
      angleInner -= 0.18;
      if (outerGroupRef.current) {
        outerGroupRef.current.setAttribute(
          'transform',
          `rotate(${angle}, 180, 180)`
        );
      }
      if (innerGroupRef.current) {
        innerGroupRef.current.setAttribute(
          'transform',
          `rotate(${angleInner}, 180, 180)`
        );
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className={`relative w-full max-w-[450px] aspect-square mx-auto border-hairline border-border bg-surface overflow-hidden flex flex-col ${className}`}
      style={{ borderRadius: '2px' }}
      aria-label="Network Topology Visualization — AUTH_NODE Roster Graph"
      role="img"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1 shrink-0">
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted">
          SCHEMATIC // 00-ROOT
        </span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted">
          ID: ROSTER_GRAPH_V1
        </span>
      </div>

      {/* SVG canvas */}
      <div className="flex-1 relative flex items-center justify-center">
        <svg
          className="w-full h-full absolute inset-0"
          viewBox="0 0 360 360"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid crosshairs */}
          <line x1="180" y1="0" x2="180" y2="360" stroke="var(--color-border)" strokeWidth="0.5" opacity="0.5" />
          <line x1="0" y1="180" x2="360" y2="180" stroke="var(--color-border)" strokeWidth="0.5" opacity="0.5" />

          {/* Outer dashed orbit ring */}
          <circle
            cx="180"
            cy="180"
            r="130"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="5 7"
          />

          {/* Inner dashed orbit ring */}
          <circle
            cx="180"
            cy="180"
            r="70"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="0.5"
            strokeDasharray="3 5"
          />

          {/* Outer orbital group — 4 nodes, counter-clockwise */}
          <g ref={outerGroupRef}>
            {/* Connector lines */}
            <line x1="180" y1="180" x2="180" y2="50"  stroke="var(--color-primary)" strokeWidth="0.75" opacity="0.2" />
            <line x1="180" y1="180" x2="310" y2="180" stroke="var(--color-primary)" strokeWidth="0.75" opacity="0.2" />
            <line x1="180" y1="180" x2="180" y2="310" stroke="var(--color-primary)" strokeWidth="0.75" opacity="0.2" />
            <line x1="180" y1="180" x2="50"  y2="180" stroke="var(--color-primary)" strokeWidth="0.75" opacity="0.2" />

            {/* Node TOP — Coral */}
            <circle cx="180" cy="50"  r="5.5" fill="var(--color-accent-coral)" />
            <circle cx="180" cy="50"  r="9"   fill="none" stroke="var(--color-accent-coral)" strokeWidth="1" opacity="0.45" />

            {/* Node RIGHT — Mint */}
            <circle cx="310" cy="180" r="5.5" fill="var(--color-accent-mint)" />
            <circle cx="310" cy="180" r="9"   fill="none" stroke="var(--color-accent-mint)" strokeWidth="1" opacity="0.45" />

            {/* Node BOTTOM — Gold */}
            <circle cx="180" cy="310" r="5.5" fill="var(--color-accent-gold)" />
            <circle cx="180" cy="310" r="9"   fill="none" stroke="var(--color-accent-gold)" strokeWidth="1" opacity="0.45" />

            {/* Node LEFT — Primary */}
            <circle cx="50"  cy="180" r="5.5" fill="var(--color-primary)" opacity="0.7" />
            <circle cx="50"  cy="180" r="9"   fill="none" stroke="var(--color-primary)" strokeWidth="1" opacity="0.3" />
          </g>

          {/* Inner orbital group — 2 small nodes, faster */}
          <g ref={innerGroupRef}>
            <circle cx="180" cy="110" r="3.5" fill="var(--color-accent-mint)" opacity="0.6" />
            <circle cx="180" cy="250" r="3.5" fill="var(--color-accent-coral)" opacity="0.6" />
          </g>

          {/* Central node */}
          <circle cx="180" cy="180" r="20" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="1" opacity="0.9" />
          <circle cx="180" cy="180" r="14" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="0.5" opacity="0.5" />
          <circle cx="180" cy="180" r="6"  fill="var(--color-primary)" />

          {/* Center label */}
          <text
            x="180"
            y="208"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="8"
            letterSpacing="1.5"
            fill="var(--color-foreground)"
            opacity="0.7"
            style={{ userSelect: 'none' }}
          >
            AUTH_NODE // 200 OK
          </text>

          {/* Pulse ring (static, simulates ping) */}
          <circle cx="180" cy="180" r="28" fill="none" stroke="var(--color-primary)" strokeWidth="0.5" opacity="0.25">
            <animate attributeName="r" values="22;36;22" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 pb-2.5 pt-1 shrink-0 border-t border-border/40">
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted">
          STATUS: SYNCHRONIZED
        </span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-primary">
          MODE: ENFORCED
        </span>
      </div>
    </div>
  );
}
