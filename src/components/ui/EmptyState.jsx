import React from 'react';
import { Button } from './Button';
import { CornerMarkers } from './CornerMarkers';

/**
 * Technical Blueprint EmptyState
 * - Exact text required: "No favourite students added yet"
 * - Corner markers, 1px border, flat 2D layout
 */
export function EmptyState({
  icon: Icon,
  title = "No favourite students added yet",
  description,
  actionLabel,
  onAction,
  className = '',
  cornerMarkers = true,
}) {
  return (
    <div 
      className={`relative flex flex-col items-center justify-center p-12 sm:p-16 border-hairline border-border bg-surface text-center overflow-hidden ${className}`}
      style={{ borderRadius: '2px' }}
    >
      {cornerMarkers && <CornerMarkers size={10} />}

      {/* Background Ghost Icon at 5% opacity */}
      {Icon && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] select-none"
          aria-hidden="true"
        >
          <Icon className="w-56 h-56 text-foreground stroke-[1]" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-md space-y-4">
        {title && (
          <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h3>
        )}

        {description && (
          <p className="font-sans text-sm text-muted leading-relaxed">
            {description}
          </p>
        )}

        {actionLabel && onAction && (
          <div className="pt-4">
            <Button onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
