import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Tabs>;

const sampleTabs = [
  { label: 'Overview', content: <p>This is the overview tab content.</p> },
  { label: 'Details', content: <p>More detailed information appears here.</p> },
  { label: 'History', content: <p>Historical records and activity log.</p> },
];

export const FirstTab: Story = {
  args: { tabs: sampleTabs, activeTab: 0, onChange: () => {} },
};

export const SecondTab: Story = {
  args: { tabs: sampleTabs, activeTab: 1, onChange: () => {} },
};

export const ThirdTab: Story = {
  args: { tabs: sampleTabs, activeTab: 2, onChange: () => {} },
};
