import React from 'react';
import '../../../tokens.css';

interface LinkProps {
  label: string;
  href: string;
  external?: boolean;
  disabled?: boolean;
}

export const Link: React.FC<LinkProps> = ({
  label,
  href,
  external = false,
  disabled = false,
}) => (
  <a
    href={disabled ? undefined : href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    style={{
      color: disabled ? 'var(--foreground-disabled)' : 'var(--foreground-accent)',
      fontFamily: 'var(--typography-fontfamily2)',
      fontSize: '16px',
      fontWeight: 500,
      textDecoration: 'underline',
      cursor: disabled ? 'not-allowed' : 'pointer',
      pointerEvents: disabled ? 'none' : 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--spacings-base-1)',
    }}
  >
    {label}
    {external && (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ flexShrink: 0 }}
      >
        <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
      </svg>
    )}
  </a>
);
