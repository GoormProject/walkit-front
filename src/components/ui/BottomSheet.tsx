import { useState, useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

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
  const backdropRef = useRef<HTMLDivElement>(null);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

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

  // 백드롭 클릭으로 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className={`fixed inset-0 z-50 flex items-end ${showBackdrop ? 'bg-black/50' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'bottom-sheet-title' : undefined}
    >
      <div
        ref={sheetRef}
        className={`bg-white rounded-t-xl shadow-2xl w-full max-h-screen transition-transform duration-300 ease-out ${className}`}
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
      >
        {/* 핸들 */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* 헤더 */}
        {(title || onClose) && (
          <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-200">
            {title && (
              <h2
                id="bottom-sheet-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="닫기"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
};

export default BottomSheet;
