import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DropdownNav } from './DropdownNav';

const meta: Meta<typeof DropdownNav> = {
  title: 'Overlays/DropdownNav',
  component: DropdownNav,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof DropdownNav>;

export const Default: Story = {
  args: {
    trigger: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)',
          background: 'var(--background-subtle)',
          fontFamily: 'var(--typography-fontfamily2)',
          fontSize: '14px',
          fontWeight: 600,
        }}
      >
        <span>👤</span>
        <span>My Account</span>
        <span style={{ fontSize: '10px' }}>▼</span>
      </div>
    ),
    items: [
      { label: 'Profile', icon: '👤', onClick: () => {} },
      { label: 'Settings', icon: '⚙️', onClick: () => {} },
      { label: 'Help', icon: '❓', onClick: () => {} },
      { label: 'Sign out', icon: '🚪', onClick: () => {} },
    ],
  },
};
