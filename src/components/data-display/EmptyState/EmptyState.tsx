import React from 'react';
import '../../../tokens.css';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacings-base-12)',
      fontFamily: 'var(--typography-fontfamily2)',
      color: 'var(--foreground-default)',
      textAlign: 'center',
      gap: 'var(--spacings-base-4)',
    }}
  >
    {icon && (
      <span
        style={{
          fontSize: '48px',
          lineHeight: 1,
          color: 'var(--foreground-accent)',
        }}
      >
        {icon}
      </span>
    )}
    <div>
      <div
        style={{
          fontFamily: 'var(--typography-fontfamily1)',
          fontSize: '20px',
          fontWeight: 700,
          marginBottom: 'var(--spacings-base-2)',
          color: 'var(--foreground-default)',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: '14px',
          color: 'var(--carbon-fiber-50)',
          lineHeight: 1.6,
          maxWidth: '360px',
        }}
      >
        {description}
      </div>
    </div>
    {action && <div>{action}</div>}
  </div>
);
