import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Indicators/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { count: 5 } };
export const Primary: Story = { args: { count: 12, variant: 'primary' } };
export const Success: Story = { args: { count: 3, variant: 'success' } };
export const Warning: Story = { args: { count: 7, variant: 'warning' } };
export const Error: Story = { args: { count: 99, variant: 'error' } };
export const Overflow: Story = { args: { count: 150, variant: 'primary' } };
