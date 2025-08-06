import React, { useEffect, useState } from 'react';
import type { Trail } from '../types/trail';
import { getTrailById } from '../utils/backendApi';
import { convertTrailDetailResponseToTrail } from '../utils/converter/trailConverter';

interface TrailDetailCardProps {
  trail: Trail;
  onBack: () => void;
  onStartWalk: () => void;
  onTrailPathUpdate?: (path: [number, number][]) => void;
  error?: any;
}

const TrailDetailCard: React.FC<TrailDetailCardProps> = ({
  trail,
  onBack,
  onStartWalk,
  onTrailPathUpdate,
  error
}) => {
  const [detailedTrail, setDetailedTrail] = useState<Trail>(trail);
  const [isLoading, setIsLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // 상세 정보 조회
  useEffect(() => {
    const fetchTrailDetail = async () => {
      if (!trail.id) return;
      
      try {
        setIsLoading(true);
        setDetailError(null);
        
        console.log('🏃 산책로 상세 정보 조회 시작:', trail.id);
        const response = await getTrailById(trail.id);
        
        if (response.httpStatus === 200 && response.data) {
          const detailedTrailData = convertTrailDetailResponseToTrail(response);
          setDetailedTrail(detailedTrailData);
          console.log('✅ 산책로 상세 정보 조회 성공:', detailedTrailData.name);
          
          // 경로 데이터가 있으면 부모 컴포넌트에 전달
          if (detailedTrailData.path && onTrailPathUpdate) {
            onTrailPathUpdate(detailedTrailData.path);
          }
        } else {
          throw new Error(`API 응답 오류: ${response.message}`);
        }
      } catch (error) {
        console.error('❌ 산책로 상세 정보 조회 실패:', error);
        setDetailError('상세 정보를 불러올 수 없습니다.');
        // 기본 정보는 유지
        setDetailedTrail(trail);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrailDetail();
  }, [trail.id, onTrailPathUpdate]);

  return (
    <div className="absolute bottom-4 left-4 right-4 z-40 pointer-events-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="트레일 목록으로 돌아가기"
          >
            <span className="material-icons text-xl">arrow_back</span>
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {isLoading ? '로딩 중...' : detailedTrail.name}
          </h2>
          <div className="w-10"></div> {/* 균형을 위한 빈 공간 */}
        </div>

        {/* 콘텐츠 */}
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
              <span className="text-gray-600 text-sm">상세 정보를 불러오는 중...</span>
            </div>
          ) : (
            <>
              <div className="flex space-x-4">
                {/* 왼쪽 정보 */}
                <div className="flex-1">
                  {/* 평점 */}
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-400 text-sm">
                      {'★'.repeat(Math.floor(detailedTrail.rating))}
                      {detailedTrail.rating % 1 >= 0.5 ? '☆' : ''}
                      {'☆'.repeat(5 - Math.ceil(detailedTrail.rating))}
                    </span>
                    <span className="text-sm text-gray-600 ml-1">
                      {detailedTrail.rating} ({detailedTrail.reviewCount})
                    </span>
                  </div>

                  {/* 설명 */}
                  <p className="text-sm text-gray-700 mb-2">
                    {detailedTrail.description}
                  </p>

                  {/* 위치 */}
                  <p className="text-sm text-gray-600 mb-1">
                    {detailedTrail.location}
                  </p>

                  {/* 거리 */}
                  <p className="text-sm text-gray-500">
                    총 거리: {detailedTrail.distance}km
                  </p>

                  {/* 에러 메시지 */}
                  {detailError && (
                    <p className="text-sm text-red-500 mt-2">
                      {detailError}
                    </p>
                  )}
                </div>

                {/* 오른쪽 이미지 */}
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                  <img
                    src={detailedTrail.routeImageUrl || detailedTrail.image || '/public/test_picture/test_for_success.jpg'}
                    alt={detailedTrail.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Walk it! 버튼 */}
              <div className="mt-4">
                <button
                  onClick={onStartWalk}
                  disabled={!!error}
                  className="w-full py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  Walk it!
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailDetailCard; 
