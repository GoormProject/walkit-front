import React, { useState, useEffect, useRef } from 'react';

interface AnimatedPanelProps {
  children: React.ReactNode;
  isVisible: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  onAnimationComplete?: () => void;
}

const AnimatedPanel: React.FC<AnimatedPanelProps> = ({
  children,
  isVisible,
  position = 'top-left',
  className = '',
  onAnimationComplete
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // 위치별 스타일 계산
  const getPositionStyles = () => {
    const baseStyles = 'absolute transition-all duration-300 ease-out';
    
    switch (position) {
      case 'top-left':
        return `${baseStyles} top-4 left-4`;
      case 'top-right':
        return `${baseStyles} top-4 right-4`;
      case 'bottom-left':
        return `${baseStyles} bottom-4 left-4`;
      case 'bottom-right':
        return `${baseStyles} bottom-4 right-4`;
      default:
        return `${baseStyles} top-4 left-4`;
    }
  };

  // 애니메이션 시작
  useEffect(() => {
    if (isVisible && !shouldRender) {
      setShouldRender(true);
      setIsAnimating(true);
      
      // 다음 프레임에서 애니메이션 시작
      requestAnimationFrame(() => {
        if (panelRef.current) {
          panelRef.current.style.transform = 'translateY(0) scale(1)';
          panelRef.current.style.opacity = '1';
        }
      });
    } else if (!isVisible && shouldRender) {
      setIsAnimating(true);
      
      if (panelRef.current) {
        panelRef.current.style.transform = 'translateY(-20px) scale(0.95)';
        panelRef.current.style.opacity = '0';
      }
      
      // 애니메이션 완료 후 컴포넌트 제거
      setTimeout(() => {
        setShouldRender(false);
        setIsAnimating(false);
        onAnimationComplete?.();
      }, 300);
    }
  }, [isVisible, shouldRender, onAnimationComplete]);

  // 초기 스타일 설정
  useEffect(() => {
    if (panelRef.current && shouldRender && !isAnimating) {
      panelRef.current.style.transform = 'translateY(-20px) scale(0.95)';
      panelRef.current.style.opacity = '0';
    }
  }, [shouldRender, isAnimating]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className={`${getPositionStyles()} ${className}`}
      style={{
        transform: 'translateY(-20px) scale(0.95)',
        opacity: 0,
        zIndex: 10
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedPanel; 
