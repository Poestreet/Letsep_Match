import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Dropdown } from './Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Overlays/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    trigger: (
      <button
        style={{
          padding: '8px 16px',
          background: 'var(--background-interactive)',
          color: 'var(--foreground-interactive)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        Options ▼
      </button>
    ),
    items: [
      { label: 'Edit', onClick: () => alert('Edit') },
      { label: 'Duplicate', onClick: () => alert('Duplicate') },
      { label: 'Delete', onClick: () => alert('Delete') },
    ],
  },
};

export const TextTrigger: Story = {
  args: {
    trigger: <span style={{ cursor: 'pointer', color: 'var(--foreground-accent)', fontWeight: 600 }}>Actions ▾</span>,
    items: [
      { label: 'View details', onClick: () => {} },
      { label: 'Share', onClick: () => {} },
      { label: 'Archive', onClick: () => {} },
    ],
  },
};
