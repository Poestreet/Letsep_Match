import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: { totalPages: 5, currentPage: 1, onChange: () => {} },
};

export const MiddlePage: Story = {
  args: { totalPages: 8, currentPage: 4, onChange: () => {} },
};

export const LastPage: Story = {
  args: { totalPages: 5, currentPage: 5, onChange: () => {} },
};
