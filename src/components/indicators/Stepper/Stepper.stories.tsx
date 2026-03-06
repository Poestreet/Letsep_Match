import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Indicators/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    currentStep: { control: { type: 'range', min: 0, max: 3 } },
  },
};
export default meta;
type Story = StoryObj<typeof Stepper>;

const steps = ['Account', 'Profile', 'Review', 'Done'];

export const FirstStep: Story = { args: { steps, currentStep: 0 } };
export const SecondStep: Story = { args: { steps, currentStep: 1 } };
export const ThirdStep: Story = { args: { steps, currentStep: 2 } };
export const LastStep: Story = { args: { steps, currentStep: 3 } };
