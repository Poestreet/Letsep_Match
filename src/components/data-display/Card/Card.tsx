import React from 'react';
import '../../../tokens.css';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, footer }) => (
  <div
    style={{
      background: 'var(--background-subtle)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      fontFamily: 'var(--typography-fontfamily2)',
      overflow: 'hidden',
    }}
  >
    {title && (
      <div
        style={{
          padding: 'var(--spacings-base-4) var(--spacings-base-5)',
          borderBottom: '1px solid var(--border-default)',
          fontFamily: 'var(--typography-fontfamily1)',
          fontWeight: 700,
          fontSize: '18px',
          color: 'var(--foreground-default)',
        }}
      >
        {title}
      </div>
    )}
    <div
      style={{
        padding: 'var(--spacings-base-5)',
        color: 'var(--foreground-default)',
      }}
    >
      {children}
    </div>
    {footer && (
      <div
        style={{
          padding: 'var(--spacings-base-4) var(--spacings-base-5)',
          borderTop: '1px solid var(--border-default)',
          background: 'var(--background-default)',
        }}
      >
        {footer}
      </div>
    )}
  </div>
);
