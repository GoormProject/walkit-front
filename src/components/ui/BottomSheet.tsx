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
  // snapPoints?: number[]; // 0-100 사이의 퍼센트 값 (현재 사용하지 않음)
  defaultSnapPoint?: number;
}

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  title,
  className = '',
  showBackdrop = true,
  defaultSnapPoint = 50,
}: BottomSheetProps) => {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(defaultSnapPoint);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // isOpen이 true로 변경될 때 currentSnapPoint를 defaultSnapPoint로 초기화
  React.useEffect(() => {
    if (isOpen) {
      setCurrentSnapPoint(defaultSnapPoint);
    }
  }, [isOpen, defaultSnapPoint]);

  // 터치/마우스 이벤트 처리
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    // 드래그 시작 시에만 preventDefault와 stopPropagation 호출
    e.preventDefault();
    // 터치 이벤트의 경우에만 stopPropagation 호출 (스크롤 방지)
    if ('touches' in e) {
      e.stopPropagation();
    }
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
    setCurrentY(clientY);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;

    // 드래그 중일 때만 preventDefault 호출
    e.preventDefault();
    // 터치 이벤트의 경우에만 stopPropagation 호출 (스크롤 방지)
    if ('touches' in e) {
      e.stopPropagation();
    }
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setCurrentY(clientY);
  };

  const handleTouchEnd = (e?: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;

    if (e) {
      // 드래그 종료 시에만 preventDefault 호출
      e.preventDefault();
      // 터치 이벤트의 경우에만 stopPropagation 호출
      if ('touches' in e) {
        e.stopPropagation();
      }
    }

    setIsDragging(false);

    // 드래그한 위치에서 바로 멈추도록 계산
    const draggedHeight = Math.max(
      10,
      Math.min(
        95,
        currentSnapPoint - ((currentY - startY) / window.innerHeight) * 100
      )
    );

    // 최소 높이(10%) 이하로 드래그하면 완전히 닫기
    if (draggedHeight <= 10) {
      onClose();
    } else {
      // 드래그한 위치에서 바로 멈춤
      setCurrentSnapPoint(draggedHeight);
    }
  };

  // 전역 마우스 이벤트 핸들러 추가
  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setCurrentY(e.clientY);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleTouchEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, currentY, startY, currentSnapPoint, onClose]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      {isOpen && (
        <>
          {showBackdrop && (
            <Dialog.Overlay
              className="absolute inset-0 z-40 bg-black/50 pointer-events-auto"
            />
          )}
          <Dialog.Content
            ref={sheetRef}
            className={`absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-xl shadow-2xl pointer-events-auto ${className}`}
            style={{
              height: isDragging
                ? `${Math.max(10, Math.min(95, currentSnapPoint - ((currentY - startY) / window.innerHeight) * 100))}dvh`
                : `${currentSnapPoint}dvh`,
              transition: isDragging ? 'none' : 'height 0.3s ease-out',
            }}
            onEscapeKeyDown={onClose}
            onInteractOutside={showBackdrop ? () => onClose() : undefined}
          >
          {/* 핸들 */}
          <div
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
          >
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
        </>
      )}
    </Dialog.Root>
  );
};

export default BottomSheet;
