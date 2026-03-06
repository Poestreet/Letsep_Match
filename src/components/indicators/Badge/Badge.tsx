import React from 'react';
import '../../../tokens.css';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

interface BadgeProps {
  count: number;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    background: 'var(--background-default-alt)',
    color: 'var(--foreground-default)',
  },
  primary: {
    background: 'var(--background-interactive)',
    color: 'var(--foreground-interactive)',
  },
  success: {
    background: 'var(--background-success)',
    color: 'var(--foreground-success)',
  },
  warning: {
    background: 'var(--background-warning)',
    color: 'var(--foreground-warning)',
  },
  error: {
    background: 'var(--background-error)',
    color: 'var(--foreground-error)',
  },
};

export const Badge: React.FC<BadgeProps> = ({ count, variant = 'default' }) => (
  <span
    style={{
      ...variantStyles[variant],
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '20px',
      height: '20px',
      padding: '0 var(--spacings-base-1)',
      borderRadius: 'var(--radius-full)',
      fontSize: '11px',
      fontWeight: 700,
      fontFamily: 'var(--typography-fontfamily2)',
      lineHeight: 1,
      whiteSpace: 'nowrap',
    }}
  >
    {count > 99 ? '99+' : count}
  </span>
);
