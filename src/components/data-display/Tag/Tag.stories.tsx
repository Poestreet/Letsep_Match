import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Data Display/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = { args: { label: 'Default' } };
export const Success: Story = { args: { label: 'Success', variant: 'success' } };
export const Warning: Story = { args: { label: 'Warning', variant: 'warning' } };
export const Error: Story = { args: { label: 'Error', variant: 'error' } };
export const Info: Story = { args: { label: 'Info', variant: 'info' } };
export const Removable: Story = {
  args: { label: 'Removable', variant: 'info', onRemove: () => alert('Removed!') },
};
