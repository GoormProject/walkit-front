import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'boolean' },
    },
    fullWidth: {
      control: { type: 'boolean' },
    },
    required: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

// 라벨이 있는 입력
export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
  },
};

// 필수 입력
export const Required: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    required: true,
  },
};

// 에러 상태
export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter email',
    type: 'email',
    error: true,
    helperText: 'Please enter a valid email address',
  },
};

// 도움말 텍스트
export const WithHelperText: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    helperText: 'Password must be at least 8 characters long',
  },
};

// 비활성화된 입력
export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
  },
};

// 크기별 입력
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input label="Small Input" size="sm" placeholder="Small size" />
      <Input label="Medium Input" size="md" placeholder="Medium size" />
      <Input label="Large Input" size="lg" placeholder="Large size" />
    </div>
  ),
};

// 전체 너비 입력
export const FullWidth: Story = {
  args: {
    label: 'Full Width Input',
    placeholder: 'This input takes full width',
    fullWidth: true,
  },
};

// 다양한 타입의 입력
export const InputTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input label="Text" type="text" placeholder="Enter text" />
      <Input label="Email" type="email" placeholder="Enter email" />
      <Input label="Password" type="password" placeholder="Enter password" />
      <Input label="Number" type="number" placeholder="Enter number" />
      <Input label="Tel" type="tel" placeholder="Enter phone number" />
      <Input label="URL" type="url" placeholder="Enter URL" />
    </div>
  ),
};

// 상태별 입력 비교
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input label="Normal" placeholder="Normal state" />
      <Input label="Focused" placeholder="Focus me" />
      <Input label="Error" placeholder="Error state" error helperText="This field has an error" />
      <Input label="Disabled" placeholder="Disabled state" disabled />
    </div>
  ),
}; 
