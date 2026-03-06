import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Data Entry/TextInput',
  component: TextInput,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: { label: 'Full name', value: '', placeholder: 'Enter your full name', onChange: () => {} },
};

export const WithValue: Story = {
  args: { label: 'Email', value: 'alice@example.com', onChange: () => {} },
};

export const WithError: Story = {
  args: { label: 'Email', value: 'invalid-email', error: 'Please enter a valid email address.', onChange: () => {} },
};

export const Disabled: Story = {
  args: { label: 'Username', value: 'alice', disabled: true, onChange: () => {} },
};
