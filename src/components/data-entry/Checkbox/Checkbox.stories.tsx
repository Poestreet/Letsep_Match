import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Data Entry/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: { label: 'Accept terms and conditions', checked: false, onChange: () => {} },
};

export const Checked: Story = {
  args: { label: 'Accept terms and conditions', checked: true, onChange: () => {} },
};

export const Disabled: Story = {
  args: { label: 'Disabled option', checked: false, disabled: true, onChange: () => {} },
};

export const DisabledChecked: Story = {
  args: { label: 'Disabled checked', checked: true, disabled: true, onChange: () => {} },
};
