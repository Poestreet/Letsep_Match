import React from 'react';
import '../../../tokens.css';

type ProgressBarVariant = 'default' | 'success' | 'warning' | 'error';

interface ProgressBarProps {
  value: number;
  label?: string;
  variant?: ProgressBarVariant;
}

const variantFillStyles: Record<ProgressBarVariant, React.CSSProperties> = {
  default: { background: 'var(--background-interactive)' },
  success: { background: 'var(--border-success)' },
  warning: { background: 'var(--border-warning)' },
  error: { background: 'var(--border-error)' },
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  variant = 'default',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacings-base-1)',
        fontFamily: 'var(--typography-fontfamily2)',
        width: '100%',
      }}
    >
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            color: 'var(--foreground-default)',
            fontWeight: 500,
          }}
        >
          <span>{label}</span>
          <span style={{ fontWeight: 700 }}>{clamped}%</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: '8px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--background-default-alt)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            ...variantFillStyles[variant],
            width: `${clamped}%`,
            height: '100%',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};
