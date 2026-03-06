import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Data Entry/TextArea',
  component: TextArea,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: { label: 'Description', value: '', placeholder: 'Enter your description...', onChange: () => {} },
};

export const WithValue: Story = {
  args: { label: 'Bio', value: 'I am a software developer with 5 years of experience.', onChange: () => {} },
};

export const Disabled: Story = {
  args: { label: 'Notes', value: 'This field is read-only.', disabled: true, onChange: () => {} },
};

export const LargeRows: Story = {
  args: { label: 'Long notes', value: '', rows: 8, placeholder: 'Write something lengthy...', onChange: () => {} },
};
