import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Data Entry/Toggle',
  component: Toggle,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Toggle>;

export const Off: Story = {
  args: { label: 'Enable notifications', checked: false, onChange: () => {} },
};

export const On: Story = {
  args: { label: 'Enable notifications', checked: true, onChange: () => {} },
};

export const Disabled: Story = {
  args: { label: 'Feature flag', checked: false, disabled: true, onChange: () => {} },
};

export const DisabledOn: Story = {
  args: { label: 'Feature flag', checked: true, disabled: true, onChange: () => {} },
};
