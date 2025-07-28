import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BottomSheet } from './index';
import { Button } from './index';

const meta = {
  title: 'UI/BottomSheet',
  component: BottomSheet,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    showBackdrop: { control: 'boolean' },
    defaultSnapPoint: {
      control: { type: 'range', min: 25, max: 75, step: 25 },
    },
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

// BottomSheet를 열기 위한 래퍼 컴포넌트
const BottomSheetWrapper = ({ children, ...props }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>BottomSheet 열기</Button>
      <BottomSheet {...props} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {children}
      </BottomSheet>
    </div>
  );
};

export const Default: Story = {
  render: args => (
    <BottomSheetWrapper {...args}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">BottomSheet 콘텐츠</h3>
        <p className="text-gray-600">
          이것은 기본 BottomSheet 예시입니다. 스와이프로 크기를 조절할 수
          있습니다.
        </p>
        <div className="space-y-2">
          <Button className="w-full">버튼 1</Button>
          <Button className="w-full" variant="outline">
            버튼 2
          </Button>
        </div>
      </div>
    </BottomSheetWrapper>
  ),
  args: {
    title: 'BottomSheet 제목',
    showBackdrop: true,
    defaultSnapPoint: 50,
  },
};

export const WithTitle: Story = {
  render: args => (
    <BottomSheetWrapper {...args}>
      <div className="space-y-4">
        <p className="text-gray-600">
          제목이 있는 BottomSheet입니다. 헤더에 제목과 닫기 버튼이 표시됩니다.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm">옵션 1</Button>
          <Button size="sm" variant="outline">
            옵션 2
          </Button>
          <Button size="sm" variant="outline">
            옵션 3
          </Button>
          <Button size="sm">옵션 4</Button>
        </div>
      </div>
    </BottomSheetWrapper>
  ),
  args: {
    title: '설정',
    showBackdrop: true,
    defaultSnapPoint: 40,
  },
};

export const WithoutBackdrop: Story = {
  render: args => (
    <BottomSheetWrapper {...args}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">백드롭 없는 BottomSheet</h3>
        <p className="text-gray-600">
          백드롭이 없는 BottomSheet입니다. 배경을 클릭해도 닫히지 않습니다.
        </p>
        <Button className="w-full">확인</Button>
      </div>
    </BottomSheetWrapper>
  ),
  args: {
    title: '알림',
    showBackdrop: false,
    defaultSnapPoint: 30,
  },
};

export const CustomSnapPoints: Story = {
  render: args => (
    <BottomSheetWrapper {...args}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">커스텀 스냅 포인트</h3>
        <p className="text-gray-600">
          이 BottomSheet는 20%, 60%, 90% 스냅 포인트를 가집니다.
        </p>
        <div className="space-y-2">
          <div className="p-3 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">스냅 포인트: 20%, 60%, 90%</p>
          </div>
          <Button className="w-full">확인</Button>
        </div>
      </div>
    </BottomSheetWrapper>
  ),
  args: {
    title: '커스텀 스냅',
    showBackdrop: true,
    snapPoints: [20, 60, 90],
    defaultSnapPoint: 60,
  },
};
