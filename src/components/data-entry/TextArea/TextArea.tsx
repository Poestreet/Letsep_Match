import React from 'react';
import '../../../tokens.css';

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
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
    <textarea
      value={value}
      disabled={disabled}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: 'var(--spacings-base-2) var(--spacings-base-3)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-default)',
        background: disabled ? 'var(--background-default)' : 'var(--background-subtle)',
        color: disabled ? 'var(--foreground-disabled)' : 'var(--foreground-default)',
        fontSize: '14px',
        fontFamily: 'var(--typography-fontfamily2)',
        cursor: disabled ? 'not-allowed' : 'text',
        outline: 'none',
        resize: 'vertical',
        lineHeight: 1.6,
        boxSizing: 'border-box',
        width: '100%',
      }}
    />
  </div>
);
