import React from 'react';
import '../../../tokens.css';

interface SideBarItem {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

interface SideBarProps {
  items: SideBarItem[];
}

export const SideBar: React.FC<SideBarProps> = ({ items }) => (
  <nav
    style={{
      display: 'flex',
      flexDirection: 'column',
      width: '240px',
      background: 'var(--background-subtle)',
      borderRight: '1px solid var(--border-default)',
      padding: 'var(--spacings-base-4) var(--spacings-base-2)',
      fontFamily: 'var(--typography-fontfamily2)',
      gap: 'var(--spacings-base-1)',
      minHeight: '100%',
    }}
  >
    {items.map((item, idx) => (
      <button
        key={idx}
        onClick={item.onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacings-base-3)',
          padding: 'var(--spacings-base-2) var(--spacings-base-3)',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          background: item.active ? 'var(--background-interactive)' : 'transparent',
          color: item.active ? 'var(--foreground-interactive)' : 'var(--foreground-default)',
          fontSize: '14px',
          fontWeight: item.active ? 700 : 500,
          fontFamily: 'var(--typography-fontfamily2)',
          cursor: 'pointer',
          textAlign: 'left',
          width: '100%',
          transition: 'background 0.15s',
        }}
      >
        {item.icon && (
          <span style={{ fontSize: '18px', flexShrink: 0, lineHeight: 1 }}>
            {item.icon}
          </span>
        )}
        <span>{item.label}</span>
      </button>
    ))}
  </nav>
);
