import React from 'react';
import '../../../tokens.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  borderRadius = 'var(--radius-md)',
}) => (
  <>
    <style>{`
      @keyframes letsep-skeleton-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
    `}</style>
    <div
      aria-busy="true"
      aria-label="Loading content"
      style={{
        display: 'inline-block',
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius,
        background: 'var(--background-default-alt)',
        animation: 'letsep-skeleton-pulse 1.5s ease-in-out infinite',
      }}
    />
  </>
);
