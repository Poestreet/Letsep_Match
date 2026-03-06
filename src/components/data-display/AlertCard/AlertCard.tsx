import React from 'react';
import '../../../tokens.css';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertCardProps {
  type?: AlertType;
  title: string;
  message: string;
}

const typeStyles: Record<AlertType, React.CSSProperties> = {
  info: {
    background: 'var(--background-info)',
    color: 'var(--foreground-info)',
    borderColor: 'var(--border-info)',
  },
  success: {
    background: 'var(--background-success)',
    color: 'var(--foreground-success)',
    borderColor: 'var(--border-success)',
  },
  warning: {
    background: 'var(--background-warning)',
    color: 'var(--foreground-warning)',
    borderColor: 'var(--border-warning)',
  },
  error: {
    background: 'var(--background-error)',
    color: 'var(--foreground-error)',
    borderColor: 'var(--border-error)',
  },
};

const typeIcons: Record<AlertType, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✕',
};

export const AlertCard: React.FC<AlertCardProps> = ({
  type = 'info',
  title,
  message,
}) => {
  const styles = typeStyles[type];
  return (
    <div
      style={{
        ...styles,
        border: `1px solid ${styles.borderColor}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacings-base-4)',
        fontFamily: 'var(--typography-fontfamily2)',
        display: 'flex',
        gap: 'var(--spacings-base-3)',
        alignItems: 'flex-start',
      }}
    >
      <span
        style={{
          fontSize: '18px',
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        {typeIcons[type]}
      </span>
      <div>
        <div
          style={{
            fontWeight: 700,
            fontSize: '15px',
            marginBottom: 'var(--spacings-base-1)',
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: '14px', lineHeight: 1.5 }}>{message}</div>
      </div>
    </div>
  );
};
