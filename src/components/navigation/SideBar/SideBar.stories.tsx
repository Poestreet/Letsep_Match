import type { Meta, StoryObj } from '@storybook/react';
import { SideBar } from './SideBar';

const meta: Meta<typeof SideBar> = {
  title: 'Navigation/SideBar',
  component: SideBar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SideBar>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Dashboard', icon: '🏠', active: true, onClick: () => {} },
      { label: 'Matches', icon: '❤️', active: false, onClick: () => {} },
      { label: 'Messages', icon: '💬', active: false, onClick: () => {} },
      { label: 'Profile', icon: '👤', active: false, onClick: () => {} },
      { label: 'Settings', icon: '⚙️', active: false, onClick: () => {} },
    ],
  },
};

export const NoIcons: Story = {
  args: {
    items: [
      { label: 'Home', active: true, onClick: () => {} },
      { label: 'About', active: false, onClick: () => {} },
      { label: 'Contact', active: false, onClick: () => {} },
    ],
  },
};
