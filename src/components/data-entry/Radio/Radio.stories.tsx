import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Data Entry/Radio',
  component: Radio,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Radio>;

export const Unchecked: Story = {
  args: { label: 'Option A', value: 'a', name: 'group', checked: false, onChange: () => {} },
};

export const Checked: Story = {
  args: { label: 'Option A', value: 'a', name: 'group', checked: true, onChange: () => {} },
};

export const Disabled: Story = {
  args: { label: 'Disabled option', value: 'b', name: 'group', checked: false, disabled: true, onChange: () => {} },
};
