import React from 'react';
import '../../../tokens.css';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
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
        borderRadius: 'var(--radius-sm)',
        border: checked
          ? '2px solid var(--border-accent)'
          : '2px solid var(--border-default)',
        background: checked ? 'var(--background-interactive)' : 'var(--background-subtle)',
        flexShrink: 0,
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      {checked && (
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
          <path
            d="M1 4L4 7L10 1"
            stroke="var(--foreground-interactive)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
    />
    {label}
  </label>
);
