import React from 'react';
import '../../../tokens.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
}) => {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          backdropFilter: 'blur(2px)',
        }}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '480px',
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'calc(100vh - 64px)',
          background: 'var(--background-subtle)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.2)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'var(--typography-fontfamily2)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--spacings-base-5) var(--spacings-base-6)',
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          <span
            id="modal-title"
            style={{
              fontFamily: 'var(--typography-fontfamily1)',
              fontWeight: 700,
              fontSize: '20px',
              color: 'var(--foreground-default)',
            }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '22px',
              color: 'var(--carbon-fiber-50)',
              display: 'flex',
              alignItems: 'center',
              padding: 'var(--spacings-base-1)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            ×
          </button>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--spacings-base-6)',
            color: 'var(--foreground-default)',
            fontSize: '14px',
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>
        {footer && (
          <div
            style={{
              padding: 'var(--spacings-base-4) var(--spacings-base-6)',
              borderTop: '1px solid var(--border-default)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--spacings-base-3)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </>
  );
};
