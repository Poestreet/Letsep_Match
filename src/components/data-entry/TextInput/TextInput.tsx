import React from 'react';
import '../../../tokens.css';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
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
      type="text"
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: 'var(--spacings-base-2) var(--spacings-base-3)',
        borderRadius: 'var(--radius-md)',
        border: error
          ? '1px solid var(--border-error)'
          : '1px solid var(--border-default)',
        background: disabled ? 'var(--background-default)' : 'var(--background-subtle)',
        color: disabled ? 'var(--foreground-disabled)' : 'var(--foreground-default)',
        fontSize: '14px',
        fontFamily: 'var(--typography-fontfamily2)',
        cursor: disabled ? 'not-allowed' : 'text',
        outline: 'none',
        boxSizing: 'border-box',
        width: '100%',
      }}
    />
    {error && (
      <span
        style={{
          fontSize: '12px',
          color: 'var(--foreground-error)',
          marginTop: '2px',
        }}
      >
        {error}
      </span>
    )}
  </div>
);
