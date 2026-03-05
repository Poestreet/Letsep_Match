import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';

const meta: Meta<typeof Table> = {
  title: 'Data Display/Table',
  component: Table,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Table>;

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
];

const rows = [
  { name: 'Alice Martin', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { name: 'Bob Chen', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { name: 'Carol Smith', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
  { name: 'Dave Lee', email: 'dave@example.com', role: 'Editor', status: 'Active' },
];

export const Default: Story = { args: { columns, rows } };

export const Empty: Story = { args: { columns, rows: [] } };

export const SingleRow: Story = {
  args: { columns, rows: [rows[0]] },
};
