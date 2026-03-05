import React from 'react';
import '../../../tokens.css';

interface TileProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export const Tile: React.FC<TileProps> = ({
  title,
  description,
  icon,
  selected = false,
  onClick,
}) => (
  <div
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacings-base-2)',
      padding: 'var(--spacings-base-4)',
      borderRadius: 'var(--radius-lg)',
      border: selected
        ? '2px solid var(--border-accent)'
        : '2px solid var(--border-default)',
      background: selected ? 'var(--background-info)' : 'var(--background-subtle)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'border-color 0.15s, background 0.15s',
      outline: 'none',
      fontFamily: 'var(--typography-fontfamily2)',
    }}
  >
    {icon && (
      <span
        style={{
          fontSize: '24px',
          color: selected ? 'var(--foreground-accent)' : 'var(--foreground-default)',
        }}
      >
        {icon}
      </span>
    )}
    <div
      style={{
        fontWeight: 700,
        fontSize: '15px',
        color: 'var(--foreground-default)',
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
);
