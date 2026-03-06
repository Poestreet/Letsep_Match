import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'This is a helpful tooltip',
    children: (
      <button
        style={{
          padding: '8px 16px',
          background: 'var(--background-interactive)',
          color: 'var(--foreground-interactive)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Hover me
      </button>
    ),
  },
};

export const OnText: Story = {
  args: {
    content: 'Learn more about this term',
    children: (
      <span
        style={{
          borderBottom: '1px dashed var(--foreground-accent)',
          color: 'var(--foreground-accent)',
          cursor: 'help',
          fontSize: '14px',
        }}
      >
        API rate limit
      </span>
    ),
  },
};

export const OnIcon: Story = {
  args: {
    content: 'Delete this item permanently',
    children: (
      <button
        style={{
          background: 'none',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          padding: '6px 10px',
          fontSize: '16px',
        }}
      >
        🗑
      </button>
    ),
  },
};
