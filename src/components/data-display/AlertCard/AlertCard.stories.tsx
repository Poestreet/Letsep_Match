import type { Meta, StoryObj } from '@storybook/react';
import { AlertCard } from './AlertCard';

const meta: Meta<typeof AlertCard> = {
  title: 'Data Display/AlertCard',
  component: AlertCard,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
  },
};
export default meta;
type Story = StoryObj<typeof AlertCard>;

export const Info: Story = { args: { type: 'info', title: 'Information', message: 'This is an informational message.' } };
export const Success: Story = { args: { type: 'success', title: 'Success', message: 'Your action was completed successfully.' } };
export const Warning: Story = { args: { type: 'warning', title: 'Warning', message: 'Please review this before continuing.' } };
export const Error: Story = { args: { type: 'error', title: 'Error', message: 'Something went wrong. Please try again.' } };
