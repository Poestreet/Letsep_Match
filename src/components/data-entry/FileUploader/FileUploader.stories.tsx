import type { Meta, StoryObj } from '@storybook/react';
import { FileUploader } from './FileUploader';

const meta: Meta<typeof FileUploader> = {
  title: 'Data Entry/FileUploader',
  component: FileUploader,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof FileUploader>;

export const Default: Story = {
  args: { label: 'Upload file', onChange: () => {} },
};

export const AcceptImages: Story = {
  args: { label: 'Upload image', accept: 'image/*', onChange: () => {} },
};

export const Multiple: Story = {
  args: { label: 'Upload files', multiple: true, onChange: () => {} },
};
