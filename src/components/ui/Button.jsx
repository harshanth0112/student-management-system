import React from 'react';

/**
 * Technical Blueprint Animated Button
 * - JetBrains Mono 11px uppercase, tracking 0.15em -> 0.25em on hover WITHOUT width shift
 * - 200ms snappy overlay slide
 * - 0px or 2px max radius, 1px border
 * - Variants: primary, outline, ghost, danger
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  isLoading = false,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = "relative group overflow-hidden font-mono uppercase font-normal inline-flex items-center justify-center transition-all duration-200 ease-snappy select-none disabled:opacity-40 disabled:cursor-not-allowed border-hairline focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2";

  const sizeStyles = {
    sm: "text-[11px] px-3.5 py-2 min-w-[120px]",
    md: "text-[11px] px-5 py-2.5 min-w-[150px]",
    lg: "text-[12px] px-7 py-3 min-w-[180px]",
    icon: "p-2 min-w-[34px] h-[34px]",
  };

  const variantStyles = {
    primary: "bg-primary text-[var(--color-primary-text)] border-primary hover:opacity-95 active:opacity-90",
    outline: "bg-transparent text-foreground border-border hover:border-foreground hover:bg-surface",
    ghost: "bg-transparent text-foreground border-transparent hover:border-border hover:bg-surface/50",
    danger: "bg-[var(--color-danger)] text-white border-[var(--color-danger)] hover:opacity-95 active:opacity-90",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${className}
      `}
      style={{ borderRadius: '2px' }}
      {...props}
    >
      {/* 200ms overlay slide */}
      <span 
        className="absolute inset-0 bg-white/20 dark:bg-black/20 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-snappy pointer-events-none" 
        aria-hidden="true"
      />

      {/* Label with tracking animation (fixed min-width prevents layout shifts) */}
      <span className="relative z-10 flex items-center justify-center gap-2 tracking-technical-wide group-hover:tracking-technical-expanded transition-[letter-spacing] duration-200 ease-snappy">
        {isLoading ? (
          <span className="inline-block w-3 h-3 border-hairline border-current border-t-transparent animate-spin mr-1" />
        ) : null}
        {children}
      </span>
    </button>
  );
}
