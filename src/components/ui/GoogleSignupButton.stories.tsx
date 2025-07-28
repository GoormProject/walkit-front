import type { Meta, StoryObj } from '@storybook/react-vite';
import { GoogleSignupButton } from './index';

const meta = {
  title: 'UI/GoogleSignupButton',
  component: GoogleSignupButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    size: { control: 'number' },
    iconScale: { control: 'number', min: 0.1, max: 2, step: 0.1 },
  },
} satisfies Meta<typeof GoogleSignupButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Sign up with Google',
  },
};

export const Korean: Story = {
  args: {
    children: '구글 회원가입',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Sign up with Google',
    disabled: true,
  },
};

export const CustomWidth: Story = {
  args: {
    children: 'Sign up with Google',
    className: 'w-80',
  },
};

export const LargeSize: Story = {
  args: {
    children: 'Sign up with Google',
    size: 120,
  },
};

export const SmallSize: Story = {
  args: {
    children: 'Sign up with Google',
    size: 60,
  },
};

export const SmallIcon: Story = {
  args: {
    children: 'Sign up with Google',
    iconScale: 0.3,
  },
};

export const LargeIcon: Story = {
  args: {
    children: 'Sign up with Google',
    iconScale: 1.0,
  },
};
