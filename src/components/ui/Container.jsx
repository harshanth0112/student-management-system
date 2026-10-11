import React from 'react';

/**
 * Container Component
 * Centers content and enforces horizontal padding (px-6 mobile, px-10 desktop)
 * so content never touches the vertical guide lines.
 */
export function Container({ children, className = '', as: Component = 'div', ...props }) {
  return (
    <Component
      className={`w-full max-w-7xl mx-auto px-6 lg:px-10 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
