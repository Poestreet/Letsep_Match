import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Data Display/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  decorators: [
    (Story) => (
      <div style={{ padding: '16px' }}>
        <p>Content above</p>
        <Story />
        <p>Content below</p>
      </div>
    ),
  ],
};

export const WithLabel: Story = {
  args: { orientation: 'horizontal', label: 'OR' },
  decorators: [
    (Story) => (
      <div style={{ padding: '16px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '40px' }}>
        <span>Left</span>
        <Story />
        <span>Right</span>
      </div>
    ),
  ],
};
