import type { Meta, StoryObj } from '@storybook/react-vite';
import { KakaoLoginButton } from './index';

const meta = {
  title: 'UI/KakaoLoginButton',
  component: KakaoLoginButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
    disabled: { control: 'boolean' },
    size: { control: 'number' },
  },
} satisfies Meta<typeof KakaoLoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const LargeSize: Story = {
  args: {
    size: 120,
  },
};

export const SmallSize: Story = {
  args: {
    size: 60,
  },
};
