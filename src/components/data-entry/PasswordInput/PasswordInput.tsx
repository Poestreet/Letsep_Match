import React, { useState } from 'react';
import '../../../tokens.css';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);

  return (
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
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: 'var(--spacings-base-2) var(--spacings-base-8) var(--spacings-base-2) var(--spacings-base-3)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            background: disabled ? 'var(--background-default)' : 'var(--background-subtle)',
            color: disabled ? 'var(--foreground-disabled)' : 'var(--foreground-default)',
            fontSize: '14px',
            fontFamily: 'var(--typography-fontfamily2)',
            cursor: disabled ? 'not-allowed' : 'text',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          placeholder="Enter password"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          style={{
            position: 'absolute',
            right: 'var(--spacings-base-2)',
            background: 'none',
            border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            padding: '0',
            color: 'var(--carbon-fiber-50)',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? '🙈' : '👁'}
        </button>
      </div>
    </div>
  );
};
