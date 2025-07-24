import React from 'react';

interface LoadingSpinnerProps {
  show: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  show, 
  message = "위치 정보를 가져오는 중..." 
}) => {
  if (!show) return null;

  return (
    <div 
      id="loading"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ display: show ? 'flex' : 'none' }}
    >
      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-600)] mb-4"></div>
        <p className="text-[var(--color-text-primary)] text-center">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 
