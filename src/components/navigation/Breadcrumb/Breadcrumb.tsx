import React from 'react';
import '../../../tokens.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => (
  <nav aria-label="Breadcrumb">
    <ol
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacings-base-1)',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        fontFamily: 'var(--typography-fontfamily2)',
        fontSize: '14px',
      }}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <li>
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  style={{
                    color: 'var(--foreground-accent)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  style={{
                    color: isLast ? 'var(--foreground-default)' : 'var(--carbon-fiber-50)',
                    fontWeight: isLast ? 600 : 400,
                  }}
                >
                  {item.label}
                </span>
              )}
            </li>
            {!isLast && (
              <li
                aria-hidden="true"
                style={{ color: 'var(--carbon-fiber-40)', userSelect: 'none' }}
              >
                /
              </li>
            )}
          </React.Fragment>
        );
      })}
    </ol>
  </nav>
);
