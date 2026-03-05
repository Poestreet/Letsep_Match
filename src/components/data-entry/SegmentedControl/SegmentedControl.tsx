import React from 'react';
import '../../../tokens.css';

interface SegmentedControlProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
}) => (
  <div
    style={{
      display: 'inline-flex',
      background: 'var(--background-default)',
      borderRadius: 'var(--radius-full)',
      padding: 'var(--spacings-base-0)',
      border: '1px solid var(--border-default)',
      gap: '2px',
      fontFamily: 'var(--typography-fontfamily2)',
    }}
  >
    {options.map((option) => {
      const isActive = option === value;
      return (
        <button
          key={option}
          onClick={() => onChange(option)}
          style={{
            padding: 'var(--spacings-base-1) var(--spacings-base-4)',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: isActive ? 'var(--background-interactive)' : 'transparent',
            color: isActive ? 'var(--foreground-interactive)' : 'var(--foreground-default)',
            fontSize: '13px',
            fontWeight: isActive ? 700 : 500,
            fontFamily: 'var(--typography-fontfamily2)',
            cursor: 'pointer',
            transition: 'background 0.15s, color 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {option}
        </button>
      );
    })}
  </div>
);
