import React from 'react';
import '../../../tokens.css';

type IconButtonVariant = 'primary' | 'secondary' | 'ghost';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

const sizeMap: Record<IconButtonSize, string> = {
  sm: '32px',
  md: '40px',
  lg: '48px',
};

const variantStyles: Record<IconButtonVariant, React.CSSProperties> = {
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

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  ariaLabel,
}) => {
  const dimension = sizeMap[size];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        ...variantStyles[variant],
        borderRadius: 'var(--radius-full)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.2s',
        width: dimension,
        height: dimension,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        flexShrink: 0,
      }}
    >
      {icon}
    </button>
  );
};
