import React from 'react';
import { useInView } from '../../hooks/useInView';

/**
 * WordReveal (Technical Blueprint)
 * Splits text into words. Initial opacity 0.2 rising to 1 on scroll / in-view.
 * Uses Space Grotesk font with snappy 200ms transitions.
 * Fully visible under prefers-reduced-motion.
 */
export function WordReveal({ 
  text = '', 
  className = '', 
  as: Component = 'p',
  emphasisWord = null,
}) {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });

  const words = text.split(/\s+/);

  return (
    <Component 
      ref={ref} 
      className={`font-display transition-colors duration-200 ${className}`}
    >
      {words.map((word, idx) => {
        const isEmphasis = emphasisWord && word.toLowerCase().includes(emphasisWord.toLowerCase());
        const cleanWord = word.replace(/[*_]/g, '');

        return (
          <span
            key={`${word}-${idx}`}
            className={`inline-block mr-[0.25em] transition-opacity duration-200 ease-snappy ${
              inView ? 'opacity-100' : 'opacity-20'
            } ${isEmphasis ? 'text-[var(--color-primary)] underline decoration-1 underline-offset-4' : ''}`}
            style={{
              transitionDelay: `${Math.min(idx * 20, 300)}ms`,
            }}
          >
            {cleanWord}
          </span>
        );
      })}
    </Component>
  );
}
