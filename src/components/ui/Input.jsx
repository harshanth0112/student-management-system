import React, { forwardRef } from 'react';

/**
 * Technical Blueprint Form Input
 * - Solid white/surface field background with 1px hairline border
 * - Monospaced uppercase label positioned directly above
 * - Accessible focus ring (2px primary outline with 2px offset)
 */
export const Input = forwardRef(function Input(
  {
    label,
    error,
    id,
    type = 'text',
    className = '',
    containerClassName = '',
    placeholder = '',
    required = false,
    helperText,
    rightElement,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="font-mono text-[10px] uppercase tracking-widest text-muted flex items-center justify-between"
        >
          <span>{label}</span>
          {required && <span className="text-[var(--color-danger)] ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          id={inputId}
          ref={ref}
          type={type}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`
            w-full bg-surface px-3 py-2 text-[14px] font-sans text-foreground 
            border-hairline border-border placeholder:font-mono placeholder:text-[11px] 
            placeholder:text-muted/60 transition-colors duration-150
            focus:border-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-[var(--color-danger)]' : ''}
            ${rightElement ? 'pr-8' : ''}
            ${className}
          `}
          style={{ borderRadius: '2px' }}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted">
            {rightElement}
          </div>
        )}
      </div>

      {helperText && !error && (
        <span className="font-mono text-[10px] text-muted tracking-wider">
          {helperText}
        </span>
      )}

      {error && (
        <span 
          id={`${inputId}-error`} 
          className="font-mono text-[10px] text-[var(--color-danger)] tracking-wider mt-0.5"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
});
