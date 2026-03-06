import React, { useState, useRef, useEffect } from 'react';
import '../../../tokens.css';

interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items }) => {
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
            minWidth: '180px',
            background: 'var(--background-subtle)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            zIndex: 500,
            overflow: 'hidden',
            fontFamily: 'var(--typography-fontfamily2)',
          }}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { item.onClick(); setOpen(false); }}
              style={{
                display: 'block',
                width: '100%',
                padding: 'var(--spacings-base-2) var(--spacings-base-4)',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: '14px',
                color: 'var(--foreground-default)',
                cursor: 'pointer',
                fontFamily: 'var(--typography-fontfamily2)',
                borderBottom: idx < items.length - 1 ? '1px solid var(--border-default)' : 'none',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--background-default)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'none';
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
