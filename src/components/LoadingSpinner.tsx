import React, { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  show: boolean;
  message?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'overlay' | 'inline';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  show, 
  message = "위치 정보를 가져오는 중...",
  size = 'large',
  variant = 'overlay'
}) => {
  const [dots, setDots] = useState('');

  // 로딩 점 애니메이션
  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, [show]);

  // 크기별 스타일
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'h-6 w-6';
      case 'medium':
        return 'h-8 w-8';
      default:
        return 'h-12 w-12';
    }
  };

  // 변형별 스타일
  const getVariantStyles = () => {
    if (variant === 'inline') {
      return 'absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10';
    }
    return 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  };

  const containerClass = getVariantStyles();
  const spinnerClass = `animate-spin rounded-full border-b-2 border-[var(--color-primary-600)] ${getSizeStyles()}`;

  if (variant === 'inline') {
    return (
      <div className={`${containerClass} transition-opacity duration-200 ${show ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center">
          <div className={spinnerClass}></div>
          <div className="mt-2 text-sm text-gray-600 font-medium">
            {message}{dots}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="loading"
      className={`${containerClass} transition-opacity duration-200 ${show ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-lg">
        <div className={`${spinnerClass} mb-4`}></div>
        <p className="text-[var(--color-text-primary)] text-center font-medium">
          {message}{dots}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 
