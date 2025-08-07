import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { WalkDetail } from '../types/walk';
import { getWalkDetail } from '../utils/walkApi';
import { 
  formatDistance, 
  formatTime, 
  formatPace, 
  formatDateTime,
  calculateCalories,
  getWalkTypeFromRecord,
  getWalkTypeLabel,
  getWalkTypeIcon,
  getWalkTypeColor
} from '../utils/walkUtils';

interface WalkHistoryDetailProps {
  walkId: number;
  onClose: () => void;
}

const WalkHistoryDetail: React.FC<WalkHistoryDetailProps> = ({ walkId, onClose }) => {
  const [walk, setWalk] = useState<WalkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 산책 기록 상세 정보 로드
  useEffect(() => {
    const loadWalkDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getWalkDetail(walkId);
        
        if (response.data) {
          setWalk(response.data);
        }
      } catch (err) {
        console.error('산책 기록 상세 조회 실패:', err);
        setError('산책 기록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadWalkDetail();
  }, [walkId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">산책 기록을 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong className="font-bold">오류: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!walk) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">산책 기록을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const walkType = getWalkTypeFromRecord(walk);
  const walkTypeInfo = {
    icon: getWalkTypeIcon(walkType),
    label: getWalkTypeLabel(walkType),
    color: getWalkTypeColor(walkType)
  };

  // API에서 이미 계산된 값 사용
  const averageSpeed = walk.averageSpeed || 0;
  const calories = walk.calories || calculateCalories(walk.totalDistance);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{walkTypeInfo.icon}</span>
            <div>
              <h2 className="text-xl font-bold">{walk.title}</h2>
              <p className="text-blue-100 text-sm">{formatDateTime(walk.eventTime)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-2">
          <span className={`px-3 py-1 text-xs rounded-full ${walkTypeInfo.color} bg-white`}>
            {walkTypeInfo.label}
          </span>
        </div>
      </div>

      {/* 주요 통계 */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formatDistance(walk.totalDistance)}</div>
            <div className="text-sm text-gray-600">총 거리</div>
          </div>
          <div className="text-center">
            {/* walk.totalTime은 WalkDetail 타입에서 number로 정의됨 */}
            <div className="text-2xl font-bold text-green-600">{formatTime(walk.totalTime)}</div>
            <div className="text-sm text-gray-600">총 시간</div>
          </div>
          <div className="text-center">
            {/* walk.pace는 WalkDetail 타입에서 number로 정의됨 */}
            <div className="text-2xl font-bold text-purple-600">{formatPace(walk.pace)}</div>
            <div className="text-sm text-gray-600">평균 페이스</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{averageSpeed.toFixed(1)}</div>
            <div className="text-sm text-gray-600">평균 속도 (km/h)</div>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">기본 정보</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">산책 유형:</span>
                <span className="font-medium">{walkTypeInfo.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">완료 시간:</span>
                <span className="font-medium">{formatDateTime(walk.eventTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">업로드 여부:</span>
                <span className={`font-medium ${walk.isUploaded ? 'text-green-600' : 'text-red-600'}`}>
                  {walk.isUploaded ? '업로드됨' : '업로드 안됨'}
                </span>
              </div>
              {walk.calories && (
                <div className="flex justify-between">
                  <span className="text-gray-600">소모 칼로리:</span>
                  <span className="font-medium">{walk.calories} kcal</span>
                </div>
              )}
            </div>
          </div>

          {/* 상세 통계 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">상세 통계</h3>
            <div className="space-y-3">
              {walk.averageSpeed && (
                <div className="flex justify-between">
                  <span className="text-gray-600">평균 속도:</span>
                  <span className="font-medium">{walk.averageSpeed.toFixed(1)} km/h</span>
                </div>
              )}
              {walk.maxSpeed && (
                <div className="flex justify-between">
                  <span className="text-gray-600">최고 속도:</span>
                  <span className="font-medium">{walk.maxSpeed.toFixed(1)} km/h</span>
                </div>
              )}
              {walk.elevationGain && (
                <div className="flex justify-between">
                  <span className="text-gray-600">고도 상승:</span>
                  <span className="font-medium">{walk.elevationGain}m</span>
                </div>
              )}
              {walk.elevationLoss && (
                <div className="flex justify-between">
                  <span className="text-gray-600">고도 하강:</span>
                  <span className="font-medium">{walk.elevationLoss}m</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">예상 칼로리:</span>
                <span className="font-medium">{calories} kcal</span>
              </div>
            </div>
          </div>
        </div>

        {/* 경로 정보 */}
        {walk.path && walk.path.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">경로 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {walk.startPoint && (
                <div>
                  <span className="text-gray-600">시작점:</span>
                  <div className="text-sm font-medium">
                    {walk.startPoint[1].toFixed(6)}, {walk.startPoint[0].toFixed(6)}
                  </div>
                </div>
              )}
              {walk.endPoint && (
                <div>
                  <span className="text-gray-600">종료점:</span>
                  <div className="text-sm font-medium">
                    {walk.endPoint[1].toFixed(6)}, {walk.endPoint[0].toFixed(6)}
                  </div>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600">
              총 {walk.path.length}개의 좌표 포인트
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="mt-6 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            닫기
          </button>
          <Link
            to="/walk-history"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-center"
          >
            목록으로
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WalkHistoryDetail; 
