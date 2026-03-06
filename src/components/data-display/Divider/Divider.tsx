import React from 'react';
import '../../../tokens.css';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        style={{
          display: 'inline-block',
          width: '1px',
          height: '100%',
          minHeight: '24px',
          background: 'var(--border-default)',
          flexShrink: 0,
        }}
      />
    );
  }

  if (label) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacings-base-3)',
          fontFamily: 'var(--typography-fontfamily2)',
          fontSize: '12px',
          color: 'var(--foreground-default)',
        }}
      >
        <div style={{ flex: 1, height: '1px', background: 'var(--border-default)' }} />
        <span>{label}</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-default)' }} />
      </div>
    );
  }

  return (
    <hr
      style={{
        border: 'none',
        borderTop: '1px solid var(--border-default)',
        margin: 0,
        width: '100%',
      }}
    />
  );
};
