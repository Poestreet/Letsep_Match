import type { Meta, StoryObj } from '@storybook/react';
import { Tile } from './Tile';

const meta: Meta<typeof Tile> = {
  title: 'Data Display/Tile',
  component: Tile,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Tile>;

export const Default: Story = {
  args: {
    title: 'Standard Plan',
    description: 'Everything you need to get started with basic features.',
    icon: '⭐',
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    title: 'Pro Plan',
    description: 'Advanced features for power users and growing teams.',
    icon: '🚀',
    selected: true,
  },
};

export const WithoutIcon: Story = {
  args: {
    title: 'Basic Tile',
    description: 'A simple tile without an icon.',
    selected: false,
  },
};
