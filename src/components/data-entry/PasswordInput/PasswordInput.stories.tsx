import type { Meta, StoryObj } from '@storybook/react';
import { PasswordInput } from './PasswordInput';

const meta: Meta<typeof PasswordInput> = {
  title: 'Data Entry/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  args: { label: 'Password', value: '', onChange: () => {} },
};

export const WithValue: Story = {
  args: { label: 'Password', value: 'mypassword123', onChange: () => {} },
};

export const Disabled: Story = {
  args: { label: 'Password', value: 'hidden', disabled: true, onChange: () => {} },
};
