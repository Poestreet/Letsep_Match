import React from 'react';
import '../../../tokens.css';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose?: () => void;
}

const typeConfig: Record<ToastType, { bg: string; color: string; icon: string }> = {
  info: { bg: 'var(--background-info)', color: 'var(--foreground-info)', icon: 'ℹ' },
  success: { bg: 'var(--background-success)', color: 'var(--foreground-success)', icon: '✓' },
  warning: { bg: 'var(--background-warning)', color: 'var(--foreground-warning)', icon: '⚠' },
  error: { bg: 'var(--background-error)', color: 'var(--foreground-error)', icon: '✕' },
};

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  const config = typeConfig[type];

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 'var(--spacings-base-6)',
        right: 'var(--spacings-base-6)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacings-base-3)',
        padding: 'var(--spacings-base-3) var(--spacings-base-4)',
        background: config.bg,
        color: config.color,
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        fontFamily: 'var(--typography-fontfamily2)',
        fontSize: '14px',
        fontWeight: 500,
        zIndex: 2000,
        maxWidth: '360px',
        minWidth: '240px',
      }}
    >
      <span
        style={{
          fontSize: '18px',
          flexShrink: 0,
          lineHeight: 1,
          fontWeight: 700,
        }}
      >
        {config.icon}
      </span>
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'inherit',
            fontSize: '18px',
            lineHeight: 1,
            padding: '0',
            flexShrink: 0,
            opacity: 0.7,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};
