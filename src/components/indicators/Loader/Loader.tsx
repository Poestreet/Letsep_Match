import React from 'react';
import '../../../tokens.css';

type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps {
  size?: LoaderSize;
  label?: string;
}

const sizeMap: Record<LoaderSize, number> = {
  sm: 20,
  md: 36,
  lg: 52,
};

export const Loader: React.FC<LoaderProps> = ({ size = 'md', label }) => {
  const px = sizeMap[size];
  const stroke = size === 'sm' ? 2 : size === 'lg' ? 4 : 3;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacings-base-2)',
        fontFamily: 'var(--typography-fontfamily2)',
      }}
    >
      <style>{`
        @keyframes letsep-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <svg
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        style={{ animation: 'letsep-spin 0.8s linear infinite' }}
        aria-label="Loading"
      >
        <circle
          cx={px / 2}
          cy={px / 2}
          r={px / 2 - stroke}
          fill="none"
          stroke="var(--background-default-alt)"
          strokeWidth={stroke}
        />
        <circle
          cx={px / 2}
          cy={px / 2}
          r={px / 2 - stroke}
          fill="none"
          stroke="var(--background-interactive)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${Math.PI * (px - stroke * 2) * 0.75} ${Math.PI * (px - stroke * 2)}`}
        />
      </svg>
      {label && (
        <span style={{ fontSize: '13px', color: 'var(--foreground-default)' }}>
          {label}
        </span>
      )}
    </div>
  );
};
