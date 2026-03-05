import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Actions/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<typeof IconButton>;

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

export const Primary: Story = { args: { icon: <PlusIcon />, variant: 'primary', ariaLabel: 'Add' } };
export const Secondary: Story = { args: { icon: <PlusIcon />, variant: 'secondary', ariaLabel: 'Add' } };
export const Ghost: Story = { args: { icon: <PlusIcon />, variant: 'ghost', ariaLabel: 'Add' } };
export const Small: Story = { args: { icon: <PlusIcon />, size: 'sm', ariaLabel: 'Add' } };
export const Large: Story = { args: { icon: <PlusIcon />, size: 'lg', ariaLabel: 'Add' } };
export const Disabled: Story = { args: { icon: <PlusIcon />, disabled: true, ariaLabel: 'Add' } };
