import React, { useEffect, useState } from 'react';
import type { RegisteredTrail } from '../utils/mockTrailApi';
import { getRegisteredTrails } from '../utils/mockTrailApi';
import { formatDistance } from '../utils/trailProgressUtils';

interface RegisteredTrailListProps {
  onTrailSelect: (trail: RegisteredTrail) => void;
  selectedTrailId?: number;
}

const RegisteredTrailList: React.FC<RegisteredTrailListProps> = ({
  onTrailSelect,
  selectedTrailId
}) => {
  const [trails, setTrails] = useState<RegisteredTrail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 등록된 산책로 목록 로드
  useEffect(() => {
    const loadTrails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const trailList = await getRegisteredTrails();
        setTrails(trailList);
      } catch (err) {
        console.error('등록된 산책로 로드 실패:', err);
        setError('등록된 산책로를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTrails();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">산책로를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="text-red-600 text-center py-4">
          <p className="font-semibold">오류 발생</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (trails.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="text-center py-8">
          <p className="text-gray-600">등록된 산책로가 없습니다.</p>
          <p className="text-sm text-gray-500 mt-1">새로운 산책로를 등록해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">등록된 산책로</h3>
      <div className="space-y-3">
        {trails.map((trail) => (
          <div
            key={trail.walkId}
            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedTrailId === trail.walkId
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onTrailSelect(trail)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{trail.title}</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {trail.description}
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <span className="mr-3">📍 {trail.location}</span>
                  <span>📏 {formatDistance(trail.length * 1000)}</span>
                </div>
              </div>
              {selectedTrailId === trail.walkId && (
                <div className="ml-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegisteredTrailList; 
