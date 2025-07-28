import { useState } from 'react';
import { BottomSheet, Button } from '@/components/ui';

const BottomSheetTestPage = () => {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">BottomSheet 테스트</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 기본 BottomSheet */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">기본 BottomSheet</h2>
          <p className="text-sm text-gray-600 mb-4">
            기본적인 BottomSheet입니다. 스와이프로 크기를 조절할 수 있습니다.
          </p>
          <Button onClick={() => setIsOpen1(true)}>열기</Button>

          <BottomSheet
            isOpen={isOpen1}
            onClose={() => setIsOpen1(false)}
            title="기본 BottomSheet"
          >
            <div className="space-y-4">
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
          </BottomSheet>
        </div>

        {/* 제목이 있는 BottomSheet */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">
            제목이 있는 BottomSheet
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            헤더에 제목과 닫기 버튼이 있는 BottomSheet입니다.
          </p>
          <Button onClick={() => setIsOpen2(true)}>열기</Button>

          <BottomSheet
            isOpen={isOpen2}
            onClose={() => setIsOpen2(false)}
            title="설정"
            defaultSnapPoint={40}
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                제목이 있는 BottomSheet입니다. 헤더에 제목과 닫기 버튼이
                표시됩니다.
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
          </BottomSheet>
        </div>

        {/* 백드롭 없는 BottomSheet */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">
            백드롭 없는 BottomSheet
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            백드롭이 없는 BottomSheet입니다. 배경을 클릭해도 닫히지 않습니다.
          </p>
          <Button onClick={() => setIsOpen3(true)}>열기</Button>

          <BottomSheet
            isOpen={isOpen3}
            onClose={() => setIsOpen3(false)}
            title="알림"
            showBackdrop={false}
            defaultSnapPoint={30}
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                백드롭이 없는 BottomSheet입니다. 배경을 클릭해도 닫히지
                않습니다.
              </p>
              <Button className="w-full">확인</Button>
            </div>
          </BottomSheet>
        </div>

        {/* 커스텀 스냅 포인트 */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">커스텀 스냅 포인트</h2>
          <p className="text-sm text-gray-600 mb-4">
            커스텀 스냅 포인트(20%, 60%, 90%)를 가진 BottomSheet입니다.
          </p>
          <Button onClick={() => setIsOpen4(true)}>열기</Button>

          <BottomSheet
            isOpen={isOpen4}
            onClose={() => setIsOpen4(false)}
            title="커스텀 스냅"
            snapPoints={[20, 60, 90]}
            defaultSnapPoint={60}
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                이 BottomSheet는 20%, 60%, 90% 스냅 포인트를 가집니다.
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-gray-100 rounded">
                  <p className="text-sm text-gray-600">
                    스냅 포인트: 20%, 60%, 90%
                  </p>
                </div>
                <Button className="w-full">확인</Button>
              </div>
            </div>
          </BottomSheet>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">사용법</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            • <strong>스와이프 제스처</strong>: 위/아래로 스와이프하여 크기 조절
          </p>
          <p>
            • <strong>ESC 키</strong>: 키보드 ESC 키로 닫기
          </p>
          <p>
            • <strong>백드롭 클릭</strong>: 배경 클릭으로 닫기
            (showBackdrop=true인 경우)
          </p>
          <p>
            • <strong>핸들</strong>: 상단의 회색 핸들을 드래그하여 조절
          </p>
        </div>
      </div>
    </div>
  );
};

export default BottomSheetTestPage;
