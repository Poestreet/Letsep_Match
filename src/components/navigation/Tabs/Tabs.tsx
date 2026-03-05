import React from 'react';
import '../../../tokens.css';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: number;
  onChange: (index: number) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--typography-fontfamily2)',
    }}
  >
    <div
      role="tablist"
      style={{
        display: 'flex',
        borderBottom: '2px solid var(--border-default)',
        gap: 'var(--spacings-base-1)',
      }}
    >
      {tabs.map((tab, idx) => {
        const isActive = idx === activeTab;
        return (
          <button
            key={idx}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(idx)}
            style={{
              padding: 'var(--spacings-base-2) var(--spacings-base-4)',
              border: 'none',
              background: 'transparent',
              color: isActive ? 'var(--foreground-accent)' : 'var(--carbon-fiber-50)',
              fontFamily: 'var(--typography-fontfamily2)',
              fontSize: '14px',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              borderBottom: isActive ? '2px solid var(--border-accent)' : '2px solid transparent',
              marginBottom: '-2px',
              transition: 'color 0.15s, border-color 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
    <div
      role="tabpanel"
      style={{
        padding: 'var(--spacings-base-4) 0',
        color: 'var(--foreground-default)',
        fontSize: '14px',
        lineHeight: 1.6,
      }}
    >
      {tabs[activeTab]?.content}
    </div>
  </div>
);
