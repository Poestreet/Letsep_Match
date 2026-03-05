import type { Meta, StoryObj } from '@storybook/react';
import { SelectCard } from './SelectCard';

const meta: Meta<typeof SelectCard> = {
  title: 'Data Entry/SelectCard',
  component: SelectCard,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SelectCard>;

export const Unselected: Story = {
  args: {
    title: 'Monthly billing',
    description: 'Pay month-to-month with no long-term commitment.',
    selected: false,
    onClick: () => {},
  },
};

export const Selected: Story = {
  args: {
    title: 'Annual billing',
    description: 'Save 20% with an annual subscription.',
    selected: true,
    onClick: () => {},
  },
};
