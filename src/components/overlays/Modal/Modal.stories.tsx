import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Overlays/Modal',
  component: Modal,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Modal>;

export const Open: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Confirm Action',
    children: (
      <p>
        Are you sure you want to proceed? This action cannot be undone.
        Please review the details before confirming.
      </p>
    ),
    footer: (
      <>
        <button
          style={{
            padding: '8px 16px',
            background: 'transparent',
            color: 'var(--foreground-default)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Cancel
        </button>
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
          Confirm
        </button>
      </>
    ),
  },
};

export const NoFooter: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Information',
    children: <p>This modal has no footer actions. Click the X or backdrop to close.</p>,
  },
};
