import React from 'react';
import '../../../tokens.css';

type TagVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface TagProps {
  label: string;
  variant?: TagVariant;
  onRemove?: () => void;
}

const variantStyles: Record<TagVariant, React.CSSProperties> = {
  default: {
    background: 'var(--background-default-alt)',
    color: 'var(--foreground-default)',
    border: '1px solid var(--border-default)',
  },
  success: {
    background: 'var(--background-success)',
    color: 'var(--foreground-success)',
    border: '1px solid var(--border-success)',
  },
  warning: {
    background: 'var(--background-warning)',
    color: 'var(--foreground-warning)',
    border: '1px solid var(--border-warning)',
  },
  error: {
    background: 'var(--background-error)',
    color: 'var(--foreground-error)',
    border: '1px solid var(--border-error)',
  },
  info: {
    background: 'var(--background-info)',
    color: 'var(--foreground-info)',
    border: '1px solid var(--border-info)',
  },
};

export const Tag: React.FC<TagProps> = ({ label, variant = 'default', onRemove }) => (
  <span
    style={{
      ...variantStyles[variant],
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--spacings-base-1)',
      padding: '2px var(--spacings-base-2)',
      borderRadius: 'var(--radius-full)',
      fontSize: '12px',
      fontWeight: 600,
      fontFamily: 'var(--typography-fontfamily2)',
      lineHeight: 1.5,
      whiteSpace: 'nowrap',
    }}
  >
    {label}
    {onRemove && (
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          color: 'inherit',
          fontSize: '14px',
          lineHeight: 1,
          opacity: 0.7,
        }}
        aria-label="Remove tag"
      >
        ×
      </button>
    )}
  </span>
);
