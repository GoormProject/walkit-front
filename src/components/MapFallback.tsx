import React from 'react';

interface MapFallbackProps {
  error?: string;
  onRetry?: () => void;
}

export const MapFallback: React.FC<MapFallbackProps> = ({ error, onRetry }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center p-6">
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          지도를 불러올 수 없습니다
        </h3>
        {error && (
          <p className="text-sm text-gray-600 mb-4">
            {error}
          </p>
        )}
        <div className="space-y-2 text-sm text-gray-500">
          <p>• 인터넷 연결을 확인해주세요</p>
          <p>• 카카오맵 API 키가 올바르게 설정되었는지 확인해주세요</p>
          <p>• 브라우저를 새로고침해보세요</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}; 
