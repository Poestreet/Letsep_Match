import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Data Display/Card',
  component: Card,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    children: 'This is the card body content. It can contain any React node.',
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Card with Footer',
    children: 'Card body content goes here.',
    footer: <span style={{ fontSize: '14px', color: 'var(--foreground-default)' }}>Footer content</span>,
  },
};

export const NoTitle: Story = {
  args: {
    children: 'Card without a title.',
  },
};
