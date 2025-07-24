import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    fullWidth: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

// Primary 버튼
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

// Secondary 버튼
export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

// Outline 버튼
export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

// Ghost 버튼
export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
};

// Danger 버튼
export const Danger: Story = {
  args: {
    children: 'Danger Button',
    variant: 'danger',
  },
};

// 크기별 버튼들
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// 비활성화된 버튼
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

// 전체 너비 버튼
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
  },
};

// 모든 variant를 한 번에 보여주는 스토리
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <div className="flex gap-4">
        <Button variant="primary" disabled>Primary Disabled</Button>
        <Button variant="secondary" disabled>Secondary Disabled</Button>
        <Button variant="outline" disabled>Outline Disabled</Button>
        <Button variant="ghost" disabled>Ghost Disabled</Button>
        <Button variant="danger" disabled>Danger Disabled</Button>
      </div>
    </div>
  ),
}; 
