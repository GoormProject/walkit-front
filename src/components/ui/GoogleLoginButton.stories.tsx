import type { Meta, StoryObj } from '@storybook/react-vite';
import { GoogleLoginButton } from './index';

const meta = {
  title: 'UI/GoogleLoginButton',
  component: GoogleLoginButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof GoogleLoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Sign in with Google',
  },
};

export const Korean: Story = {
  args: {
    children: '구글 로그인',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Sign in with Google',
    disabled: true,
  },
};

export const CustomWidth: Story = {
  args: {
    children: 'Sign in with Google',
    className: 'w-80',
  },
}; 