import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FlexButton } from './FlexButton';

const meta: Meta<typeof FlexButton> = {
  title: 'Actions/FlexButton',
  component: FlexButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<typeof FlexButton>;

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export const Primary: Story = { args: { label: 'FlexButton', variant: 'primary', icon: <StarIcon /> } };
export const Secondary: Story = { args: { label: 'FlexButton', variant: 'secondary', icon: <StarIcon /> } };
export const Ghost: Story = { args: { label: 'FlexButton', variant: 'ghost', icon: <StarIcon /> } };
export const NoIcon: Story = { args: { label: 'FlexButton without icon' } };
export const Disabled: Story = { args: { label: 'FlexButton', disabled: true, icon: <StarIcon /> } };
