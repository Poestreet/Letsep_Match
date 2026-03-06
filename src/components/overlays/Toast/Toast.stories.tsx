import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Overlays/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
  },
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;
type Story = StoryObj<typeof Toast>;

export const Info: Story = {
  args: { message: 'Your changes have been saved.', type: 'info', onClose: () => {} },
};

export const Success: Story = {
  args: { message: 'Profile updated successfully!', type: 'success', onClose: () => {} },
};

export const Warning: Story = {
  args: { message: 'Your session will expire in 5 minutes.', type: 'warning', onClose: () => {} },
};

export const Error: Story = {
  args: { message: 'Something went wrong. Please try again.', type: 'error', onClose: () => {} },
};
