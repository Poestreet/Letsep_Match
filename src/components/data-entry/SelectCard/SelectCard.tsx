import React from 'react';
import '../../../tokens.css';

interface SelectCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export const SelectCard: React.FC<SelectCardProps> = ({
  title,
  description,
  selected,
  onClick,
}) => (
  <div
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
    style={{
      padding: 'var(--spacings-base-4)',
      borderRadius: 'var(--radius-lg)',
      border: selected
        ? '2px solid var(--border-accent)'
        : '2px solid var(--border-default)',
      background: selected ? 'var(--background-info)' : 'var(--background-subtle)',
      cursor: 'pointer',
      transition: 'border-color 0.15s, background 0.15s',
      fontFamily: 'var(--typography-fontfamily2)',
      outline: 'none',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--spacings-base-3)',
    }}
  >
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        borderRadius: 'var(--radius-full)',
        border: selected
          ? '2px solid var(--border-accent)'
          : '2px solid var(--border-default)',
        background: selected ? 'var(--background-interactive)' : 'var(--background-subtle)',
        flexShrink: 0,
        marginTop: '2px',
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      {selected && (
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--foreground-interactive)',
          }}
        />
      )}
    </span>
    <div>
      <div
        style={{
          fontWeight: 700,
          fontSize: '15px',
          color: 'var(--foreground-default)',
          marginBottom: 'var(--spacings-base-1)',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: '13px',
          color: 'var(--carbon-fiber-50)',
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>
    </div>
  </div>
);
