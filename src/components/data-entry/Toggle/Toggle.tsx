import React from 'react';
import '../../../tokens.css';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
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
        position: 'relative',
        display: 'inline-block',
        width: '40px',
        height: '22px',
        borderRadius: 'var(--radius-full)',
        background: checked ? 'var(--background-interactive)' : 'var(--background-default-alt)',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '21px' : '3px',
          width: '16px',
          height: '16px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--carbon-fiber-00)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.2s',
        }}
      />
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
