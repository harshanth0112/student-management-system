import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { CornerMarkers } from './CornerMarkers';

/**
 * Technical Blueprint Modal
 * - Bordered panel with 4 L-shaped blueprint corner markers
 * - Space Grotesk title, JetBrains Mono metadata
 * - Focus trapped, Esc key closes
 * - 0 shadows, 2px radius
 */
export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  showClose = true,
  cornerMarkers = true,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`w-full ${maxWidth} bg-surface text-foreground border-hairline border-border p-6 sm:p-8 outline-none relative`}
        style={{ borderRadius: '2px' }}
      >
        {cornerMarkers && <CornerMarkers size={10} />}

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border mb-5">
          <div>
            {title && (
              <h2 id="modal-title" className="text-xl sm:text-2xl font-display font-bold text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="font-mono text-[10px] text-muted uppercase tracking-widest mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {showClose && (
            <button
              onClick={onClose}
              className="p-1 text-muted hover:text-foreground hover:bg-background border-hairline border-transparent hover:border-border transition-colors duration-150"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}
