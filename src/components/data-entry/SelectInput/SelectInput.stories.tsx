import type { Meta, StoryObj } from '@storybook/react';
import { SelectInput } from './SelectInput';

const meta: Meta<typeof SelectInput> = {
  title: 'Data Entry/SelectInput',
  component: SelectInput,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SelectInput>;

const options = [
  { value: '', label: 'Choose an option...' },
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
];

export const Default: Story = {
  args: { label: 'Country', options, value: '', onChange: () => {} },
};

export const WithSelection: Story = {
  args: { label: 'Country', options, value: 'ca', onChange: () => {} },
};

export const Disabled: Story = {
  args: { label: 'Country', options, value: 'us', disabled: true, onChange: () => {} },
};
