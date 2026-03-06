import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Drawer } from './Drawer';

const meta: Meta<typeof Drawer> = {
  title: 'Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Drawer>;

export const Open: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Edit Profile',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p>This is the drawer content area. You can place any form fields or details here.</p>
        <p>The drawer slides in from the right side and overlays the main content.</p>
      </div>
    ),
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => {},
    title: 'Closed Drawer',
    children: <p>This content is hidden when the drawer is closed.</p>,
  },
};
