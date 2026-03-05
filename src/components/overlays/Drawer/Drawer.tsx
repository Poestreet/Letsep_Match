import React from 'react';
import '../../../tokens.css';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ open, onClose, title, children }) => (
  <>
    {open && (
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 1000,
          backdropFilter: 'blur(2px)',
        }}
        aria-hidden="true"
      />
    )}
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '360px',
        maxWidth: '100vw',
        background: 'var(--background-subtle)',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
        zIndex: 1001,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--typography-fontfamily2)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--spacings-base-4) var(--spacings-base-6)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--typography-fontfamily1)',
            fontWeight: 700,
            fontSize: '18px',
            color: 'var(--foreground-default)',
          }}
        >
          {title}
        </span>
        <button
          onClick={onClose}
          aria-label="Close drawer"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
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
    </div>
  </>
);
