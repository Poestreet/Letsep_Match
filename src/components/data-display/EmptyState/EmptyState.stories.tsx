import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Data Display/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: 'Nothing here yet',
    description: 'Start by creating your first item. It will appear here once added.',
  },
};

export const WithIcon: Story = {
  args: {
    icon: '📭',
    title: 'No messages',
    description: 'Your inbox is empty. Messages you receive will show up here.',
  },
};

export const WithAction: Story = {
  args: {
    icon: '📂',
    title: 'No files found',
    description: 'Upload your first file to get started.',
    action: (
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
        Upload File
      </button>
    ),
  },
};
