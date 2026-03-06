import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { label: 'Button', variant: 'primary' } };
export const Secondary: Story = { args: { label: 'Button', variant: 'secondary' } };
export const Ghost: Story = { args: { label: 'Button', variant: 'ghost' } };
export const Disabled: Story = { args: { label: 'Button', disabled: true } };
export const Small: Story = { args: { label: 'Button', size: 'sm' } };
export const Large: Story = { args: { label: 'Button', size: 'lg' } };
