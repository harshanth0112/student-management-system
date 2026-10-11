import React from 'react';

/**
 * Technical Blueprint Status Badge
 * - 1px border (#1A3C2B/20 or CSS variable equivalent)
 * - 8px x 8px solid square dot
 * - JetBrains Mono text at 10px, uppercase, tracking-widest
 * - Padding: 4px 12px
 * - Dots: Active = forest dot, Invited = gold dot, Disabled = grey dot, Danger = coral dot
 */
export function Badge({ children, variant = 'default', className = '' }) {
  const variantStyles = {
    default: 'border-border text-foreground bg-transparent',
    active: 'border-[var(--color-status-active)]/30 text-[var(--color-status-active)] bg-[var(--color-status-active)]/5',
    invited: 'border-[var(--color-status-invited)]/30 text-[var(--color-status-invited)] bg-[var(--color-status-invited)]/5',
    disabled: 'border-[var(--color-status-disabled)]/30 text-[var(--color-status-disabled)] bg-[var(--color-status-disabled)]/5',
    danger: 'border-[var(--color-danger)]/30 text-[var(--color-danger)] bg-[var(--color-danger)]/5',
    neutral: 'border-border text-muted bg-transparent',
  };

  const dotStyles = {
    active: 'bg-[var(--color-status-active)]',
    invited: 'bg-[var(--color-status-invited-dot)]',
    disabled: 'bg-[var(--color-status-disabled-dot)]',
    danger: 'bg-[var(--color-danger-dot)]',
    default: 'bg-muted',
    neutral: 'bg-muted',
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-technical-widest border-hairline select-none ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
      style={{ borderRadius: '2px' }}
    >
      <span 
        className={`w-2 h-2 shrink-0 ${dotStyles[variant] || dotStyles.default}`}
        style={{ borderRadius: '0px' }}
        aria-hidden="true"
      />
      <span>{children}</span>
    </span>
  );
}
