import React from 'react';
import '../../../tokens.css';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const btnStyle = (active: boolean, disabled?: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '36px',
    height: '36px',
    padding: '0 var(--spacings-base-2)',
    borderRadius: 'var(--radius-md)',
    border: active ? 'none' : '1px solid var(--border-default)',
    background: active ? 'var(--background-interactive)' : 'var(--background-subtle)',
    color: active ? 'var(--foreground-interactive)' : 'var(--foreground-default)',
    fontSize: '14px',
    fontWeight: active ? 700 : 400,
    fontFamily: 'var(--typography-fontfamily2)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'background 0.15s',
  });

  return (
    <nav aria-label="Pagination">
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacings-base-1)',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        <li>
          <button
            style={btnStyle(false, currentPage === 1)}
            disabled={currentPage === 1}
            onClick={() => onChange(currentPage - 1)}
            aria-label="Previous page"
          >
            ←
          </button>
        </li>
        {pages.map((page) => (
          <li key={page}>
            <button
              style={btnStyle(page === currentPage)}
              onClick={() => onChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            style={btnStyle(false, currentPage === totalPages)}
            disabled={currentPage === totalPages}
            onClick={() => onChange(currentPage + 1)}
            aria-label="Next page"
          >
            →
          </button>
        </li>
      </ol>
    </nav>
  );
};
