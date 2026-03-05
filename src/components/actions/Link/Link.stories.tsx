import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  title: 'Actions/Link',
  component: Link,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = { args: { label: 'Visit page', href: '#' } };
export const External: Story = { args: { label: 'Open in new tab', href: 'https://example.com', external: true } };
export const Disabled: Story = { args: { label: 'Disabled link', href: '#', disabled: true } };
