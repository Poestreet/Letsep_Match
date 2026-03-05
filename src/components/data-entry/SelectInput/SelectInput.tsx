import React from 'react';
import '../../../tokens.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
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
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <select
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
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          appearance: 'none',
          WebkitAppearance: 'none',
          boxSizing: 'border-box',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span
        style={{
          position: 'absolute',
          right: 'var(--spacings-base-3)',
          pointerEvents: 'none',
          color: 'var(--carbon-fiber-50)',
          fontSize: '12px',
        }}
      >
        ▼
      </span>
    </div>
  </div>
);
