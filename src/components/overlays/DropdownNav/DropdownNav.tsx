import React, { useState, useRef, useEffect } from 'react';
import '../../../tokens.css';

interface DropdownNavItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

interface DropdownNavProps {
  trigger: React.ReactNode;
  items: DropdownNavItem[];
}

export const DropdownNav: React.FC<DropdownNavProps> = ({ trigger, items }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
      >
        {trigger}
      </div>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            minWidth: '200px',
            background: 'var(--background-subtle)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            zIndex: 500,
            overflow: 'hidden',
            fontFamily: 'var(--typography-fontfamily2)',
            padding: 'var(--spacings-base-1)',
          }}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { item.onClick(); setOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacings-base-2)',
                width: '100%',
                padding: 'var(--spacings-base-2) var(--spacings-base-3)',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: '14px',
                color: 'var(--foreground-default)',
                cursor: 'pointer',
                fontFamily: 'var(--typography-fontfamily2)',
                borderRadius: 'var(--radius-md)',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--background-default)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'none';
              }}
            >
              {item.icon && (
                <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0 }}>
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
