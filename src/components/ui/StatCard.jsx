import React from 'react';

/**
 * Technical Blueprint StatCard
 * - Bento cell with 1px hairline border, 28-32px padding
 * - Left-border color accent (Coral, Mint, Gold, or Forest)
 * - Monospaced header label with 10px uppercase tracking
 * - Large Space Grotesk numeral (4xl/5xl) with tight tracking
 * - Supports either React element or Component type for `icon`
 * - Supports either `caption` or `subtext`
 */
export function StatCard({
  icon,
  value,
  label,
  caption,
  subtext,
  accentColor = 'forest', // 'coral' | 'mint' | 'gold' | 'forest'
  className = '',
  onClick,
}) {
  const accentBorderStyles = {
    forest: 'border-l-2 border-l-[var(--color-primary)]',
    coral: 'border-l-2 border-l-[var(--color-accent-coral)]',
    mint: 'border-l-2 border-l-[var(--color-accent-mint)]',
    gold: 'border-l-2 border-l-[var(--color-accent-gold)]',
  };

  const displayCaption = caption || subtext;

  // Render icon safely whether passed as <IconComponent /> or IconComponent
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return icon;
    }
    const IconComponent = icon;
    return <IconComponent className="w-4 h-4 stroke-[1.5]" />;
  };

  return (
    <div
      onClick={onClick}
      className={`
        p-6 sm:p-7 border-hairline border-border bg-surface hover:bg-surface-hover 
        transition-colors duration-150 flex flex-col justify-between group
        ${accentBorderStyles[accentColor] || accentBorderStyles.forest}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{ borderRadius: '2px' }}
    >
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div className="w-9 h-9 border-hairline border-border flex items-center justify-center text-foreground group-hover:border-foreground/40 transition-colors">
            {renderIcon()}
          </div>
        )}
        {displayCaption && (
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted">
            {displayCaption}
          </span>
        )}
      </div>

      <div>
        <div className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-1">
          {value}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {label}
        </div>
      </div>
    </div>
  );
}
