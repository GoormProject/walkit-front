import React, { useState, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
  showBackdrop?: boolean;
  snapPoints?: number[]; // 0-100 사이의 퍼센트 값
  defaultSnapPoint?: number;
}

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  title,
  className = '',
  showBackdrop = true,
  snapPoints = [25, 50, 75],
  defaultSnapPoint = 50,
}: BottomSheetProps) => {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(defaultSnapPoint);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // 터치/마우스 이벤트 처리
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
    setCurrentY(clientY);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setCurrentY(clientY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const deltaY = startY - currentY;
    const threshold = 50;

    if (deltaY > threshold) {
      // 위로 스와이프 - 다음 스냅 포인트
      const currentIndex = snapPoints.indexOf(currentSnapPoint);
      const nextIndex = Math.min(currentIndex + 1, snapPoints.length - 1);
      setCurrentSnapPoint(snapPoints[nextIndex]);
    } else if (deltaY < -threshold) {
      // 아래로 스와이프 - 이전 스냅 포인트 또는 닫기
      const currentIndex = snapPoints.indexOf(currentSnapPoint);
      if (currentIndex === 0) {
        onClose();
      } else {
        const prevIndex = Math.max(currentIndex - 1, 0);
        setCurrentSnapPoint(snapPoints[prevIndex]);
      }
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={`fixed inset-0 z-50 ${
            showBackdrop ? 'bg-black/50' : 'bg-transparent'
          }`}
        />
        <Dialog.Content
          ref={sheetRef}
          className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-xl shadow-2xl w-full max-h-screen transition-transform duration-300 ease-out ${className}`}
          style={{
            height: `${currentSnapPoint}vh`,
            transform: isDragging
              ? `translateY(${currentY - startY}px)`
              : 'translateY(0)',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          onEscapeKeyDown={onClose}
          onInteractOutside={showBackdrop ? () => onClose() : undefined}
        >
          {/* 핸들 */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* 헤더 */}
          {title && (
            <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-200">
              {title && (
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  {title}
                </Dialog.Title>
              )}
              <Dialog.Close asChild>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="닫기"
                >
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>
          )}

          {/* 콘텐츠 */}
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default BottomSheet;
