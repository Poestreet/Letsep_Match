import React from 'react';
import '../../../tokens.css';

interface RadioProps {
  label: string;
  value: string;
  name: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  value,
  name,
  checked,
  onChange,
  disabled = false,
}) => (
  <label
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--spacings-base-2)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--typography-fontfamily2)',
      fontSize: '14px',
      color: 'var(--foreground-default)',
      userSelect: 'none',
    }}
  >
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '18px',
        height: '18px',
        borderRadius: 'var(--radius-full)',
        border: checked
          ? '2px solid var(--border-accent)'
          : '2px solid var(--border-default)',
        background: 'var(--background-subtle)',
        flexShrink: 0,
        transition: 'border-color 0.15s',
      }}
    >
      {checked && (
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--background-interactive)',
          }}
        />
      )}
    </span>
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      disabled={disabled}
      onChange={() => onChange(value)}
      style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
    />
    {label}
  </label>
);
