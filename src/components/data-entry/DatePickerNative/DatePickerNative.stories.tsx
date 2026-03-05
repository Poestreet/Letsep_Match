import type { Meta, StoryObj } from '@storybook/react';
import { DatePickerNative } from './DatePickerNative';

const meta: Meta<typeof DatePickerNative> = {
  title: 'Data Entry/DatePickerNative',
  component: DatePickerNative,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof DatePickerNative>;

export const Default: Story = {
  args: { label: 'Select date', value: '', onChange: () => {} },
};

export const WithValue: Story = {
  args: { label: 'Date of birth', value: '1990-06-15', onChange: () => {} },
};

export const Disabled: Story = {
  args: { label: 'Disabled date', value: '2024-01-01', disabled: true, onChange: () => {} },
};
