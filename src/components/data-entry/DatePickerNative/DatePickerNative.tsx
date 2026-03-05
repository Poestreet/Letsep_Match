import React from 'react';
import '../../../tokens.css';

interface DatePickerNativeProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const DatePickerNative: React.FC<DatePickerNativeProps> = ({
  label,
  value,
  onChange,
  disabled = false,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacings-base-1)',
      fontFamily: 'var(--typography-fontfamily2)',
    }}
  >
    <label
      style={{
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--foreground-default)',
      }}
    >
      {label}
    </label>
    <input
      type="date"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: 'var(--spacings-base-2) var(--spacings-base-3)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-default)',
        background: disabled ? 'var(--background-default)' : 'var(--background-subtle)',
        color: disabled ? 'var(--foreground-disabled)' : 'var(--foreground-default)',
        fontSize: '14px',
        fontFamily: 'var(--typography-fontfamily2)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
      }}
    />
  </div>
);
