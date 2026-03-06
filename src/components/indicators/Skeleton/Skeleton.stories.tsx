import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Indicators/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = { args: { width: '200px', height: '16px' } };

export const Circle: Story = {
  args: { width: '48px', height: '48px', borderRadius: 'var(--radius-full)' },
};

export const Card: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', width: '300px' }}>
      <Skeleton width="48px" height="48px" borderRadius="var(--radius-full)" />
      <Skeleton width="60%" height="16px" />
      <Skeleton width="100%" height="12px" />
      <Skeleton width="80%" height="12px" />
    </div>
  ),
};

export const TextBlock: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '360px' }}>
      <Skeleton width="40%" height="20px" />
      <Skeleton width="100%" height="12px" />
      <Skeleton width="100%" height="12px" />
      <Skeleton width="70%" height="12px" />
    </div>
  ),
};
