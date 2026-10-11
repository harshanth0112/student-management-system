import React from 'react';
import { Container } from './Container';

/**
 * Section Component
 * Standardized vertical rhythm and padding, wrapping children in Container.
 */
export function Section({
  children,
  className = '',
  containerClassName = '',
  id,
  divider = false,
  as: Component = 'section',
  ...props
}) {
  return (
    <Component
      id={id}
      className={`py-12 sm:py-16 ${divider ? 'border-b border-hairline border-border' : ''} ${className}`}
      {...props}
    >
      <Container className={containerClassName}>
        {children}
      </Container>
    </Component>
  );
}
