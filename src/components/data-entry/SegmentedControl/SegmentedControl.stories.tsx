import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl } from './SegmentedControl';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Data Entry/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  args: { options: ['Day', 'Week', 'Month'], value: 'Day', onChange: () => {} },
};

export const FourOptions: Story = {
  args: { options: ['XS', 'SM', 'MD', 'LG'], value: 'MD', onChange: () => {} },
};

export const TwoOptions: Story = {
  args: { options: ['On', 'Off'], value: 'On', onChange: () => {} },
};
