import React, { useState } from 'react';
import '../../../tokens.css';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--background-accent)',
            color: 'var(--foreground-default-invert)',
            padding: '5px var(--spacings-base-2)',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            fontFamily: 'var(--typography-fontfamily2)',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
          }}
        >
          {content}
          <span
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              borderWidth: '4px',
              borderStyle: 'solid',
              borderColor: 'var(--background-accent) transparent transparent transparent',
            }}
          />
        </span>
      )}
    </span>
  );
};
