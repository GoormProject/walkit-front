import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { FriendRequestTabs } from './FriendRequestTabs';

interface FriendRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChange?: () => void; // 데이터 변경 시 호출할 콜백
}

export const FriendRequestModal = ({
  isOpen,
  onClose,
  onDataChange,
}: FriendRequestModalProps): React.ReactNode => {
  // 모달 외부 클릭 감지
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC 키 감지
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-[80%] max-w-4xl max-h-[80vh] overflow-hidden">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">친구 요청</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <FriendRequestTabs onDataChange={onDataChange} />
        </div>
      </div>
    </div>
  );
};
