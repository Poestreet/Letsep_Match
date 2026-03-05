import React from 'react';
import '../../../tokens.css';

interface TableColumn {
  key: string;
  label: string;
}

interface TableProps {
  columns: TableColumn[];
  rows: Record<string, string>[];
}

export const Table: React.FC<TableProps> = ({ columns, rows }) => (
  <div
    style={{
      width: '100%',
      overflowX: 'auto',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-default)',
      fontFamily: 'var(--typography-fontfamily2)',
    }}
  >
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
      }}
    >
      <thead>
        <tr
          style={{
            background: 'var(--background-accent)',
            color: 'var(--foreground-default-invert)',
          }}
        >
          {columns.map((col) => (
            <th
              key={col.key}
              style={{
                padding: 'var(--spacings-base-3) var(--spacings-base-4)',
                textAlign: 'left',
                fontWeight: 600,
                fontSize: '13px',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIdx) => (
          <tr
            key={rowIdx}
            style={{
              background:
                rowIdx % 2 === 0
                  ? 'var(--background-subtle)'
                  : 'var(--background-default)',
              borderTop: '1px solid var(--border-default)',
            }}
          >
            {columns.map((col) => (
              <td
                key={col.key}
                style={{
                  padding: 'var(--spacings-base-3) var(--spacings-base-4)',
                  color: 'var(--foreground-default)',
                }}
              >
                {row[col.key] ?? '—'}
              </td>
            ))}
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td
              colSpan={columns.length}
              style={{
                padding: 'var(--spacings-base-8)',
                textAlign: 'center',
                color: 'var(--carbon-fiber-40)',
                fontStyle: 'italic',
              }}
            >
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
