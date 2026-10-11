import React, { forwardRef } from 'react';

/**
 * Technical Blueprint Select Dropdown
 * - Solid surface field background with 1px hairline border
 * - Monospaced uppercase label positioned directly above
 */
export const Select = forwardRef(function Select(
  {
    label,
    error,
    id,
    options = [],
    className = '',
    containerClassName = '',
    required = false,
    placeholder = 'Select an option...',
    ...props
  },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={selectId}
          className="font-mono text-[10px] uppercase tracking-widest text-muted flex items-center justify-between"
        >
          <span>{label}</span>
          {required && <span className="text-[var(--color-danger)] ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          aria-invalid={!!error}
          className={`
            w-full bg-surface px-3 py-2 text-[14px] font-sans text-foreground 
            border-hairline border-border transition-colors duration-150
            focus:border-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none cursor-pointer
            ${error ? 'border-[var(--color-danger)]' : ''}
            ${className}
          `}
          style={{ borderRadius: '2px' }}
          {...props}
        >
          {placeholder && <option value="" className="bg-surface text-foreground font-mono">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const text = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={val} value={val} className="bg-surface text-foreground font-sans">
                {text}
              </option>
            );
          })}
        </select>
        
        {/* Custom minimalist arrow */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted font-mono text-[9px]">
          ▼
        </div>
      </div>

      {error && (
        <span 
          id={`${selectId}-error`} 
          className="font-mono text-[10px] text-[var(--color-danger)] tracking-wider mt-0.5"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
});
