import React from 'react';

/**
 * Editorial Avatar
 * Bordered initials or photo with 2px radius or subtle circle
 */
export function Avatar({
  name = '',
  src = null,
  size = 'md',
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-[11px]',
    lg: 'w-12 h-12 text-[13px]',
    xl: 'w-16 h-16 text-[16px]',
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '??';

  return (
    <div
      className={`
        inline-flex items-center justify-center font-mono font-medium 
        border-hairline border-border bg-surface-hover/80 text-foreground 
        shrink-0 overflow-hidden select-none
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
      style={{ borderRadius: '2px' }}
      title={name}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
