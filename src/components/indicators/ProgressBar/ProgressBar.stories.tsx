import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Indicators/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
    },
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = { args: { value: 60, label: 'Upload progress' } };
export const Success: Story = { args: { value: 100, label: 'Completed', variant: 'success' } };
export const Warning: Story = { args: { value: 75, label: 'Storage used', variant: 'warning' } };
export const Error: Story = { args: { value: 45, label: 'Failed', variant: 'error' } };
export const NoLabel: Story = { args: { value: 30 } };
