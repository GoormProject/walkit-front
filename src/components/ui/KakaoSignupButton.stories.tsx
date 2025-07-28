import type { Meta, StoryObj } from '@storybook/react-vite';
import { KakaoSignupButton } from './index';

const meta = {
  title: 'UI/KakaoSignupButton',
  component: KakaoSignupButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof KakaoSignupButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Korean: Story = {
  args: {},
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const CustomWidth: Story = {
  args: {
    className: 'w-80',
  },
};
