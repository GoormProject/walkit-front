import React from 'react';
import Button from './Button';

const BottomSheetContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        이것은 @radix-ui/react-dialog로 만든 BottomSheet입니다.
      </p>
      <div className="space-y-2">
        <Button className="w-full">버튼 1</Button>
        <Button className="w-full" variant="outline">
          버튼 2
        </Button>
      </div>
      <p className="text-sm text-gray-500">
        • 위/아래로 스와이프하여 크기 조절
        <br />
        • ESC 키로 닫기
        <br />
        • 배경 클릭으로 닫기
        <br />• 상단 핸들을 드래그하여 조절
        <br />• ButtomSheetContent.tsx 파일을 수정해서 bottomSheet 에 들어갈
        내용을 입력하세요
      </p>
    </div>
  );
};

export default BottomSheetContent;
