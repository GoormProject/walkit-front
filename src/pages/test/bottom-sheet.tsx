import { useState } from 'react';
import {
  BottomSheet,
  BottomSheetOpenButton,
  BottomSheetContent,
} from '@/components/ui';

const BottomSheetTestPage = () => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">BottomSheet 테스트</h1>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title="테스트 BottomSheet"
        defaultSnapPoint={10}
      >
        <BottomSheetContent />
      </BottomSheet>

      {!isBottomSheetOpen && (
        <BottomSheetOpenButton onClick={() => setIsBottomSheetOpen(true)} />
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">사용법</h3>
      </div>
    </div>
  );
};

export default BottomSheetTestPage;
