import React from 'react';
import '../../../tokens.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '6px var(--spacings-base-3)', fontSize: '14px' },
  md: { padding: 'var(--spacings-base-2) var(--spacings-base-4)', fontSize: '16px' },
  lg: { padding: 'var(--spacings-base-3) var(--spacings-base-5)', fontSize: '18px' },
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'var(--background-interactive)',
    color: 'var(--foreground-interactive)',
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--foreground-default)',
    border: '1px solid var(--border-default)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--foreground-accent)',
    border: 'none',
  },
};

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      ...sizeStyles[size],
      ...variantStyles[variant],
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--typography-fontfamily2)',
      fontWeight: 600,
      opacity: disabled ? 0.5 : 1,
      transition: 'opacity 0.2s',
    }}
  >
    {label}
  </button>
);
