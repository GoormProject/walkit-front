import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { WalkRecord, WalkListRequest } from '../types/walk';
import { getWalkList, deleteWalk } from '../utils/walkApi';
import { formatDistance, formatTime, formatPace, getWalkTypeFromRecord } from '../utils/walkUtils';

type WalkType = 'ALL' | 'PERSONAL' | 'REGISTERED_TRAIL' | 'UPLOADED_TRAIL';

// 타입 가드 함수
const isValidWalkType = (value: string): value is WalkType => {
  return ['ALL', 'PERSONAL', 'REGISTERED_TRAIL', 'UPLOADED_TRAIL'].includes(value);
};

interface WalkHistoryListProps {
  onWalkSelect?: (walk: WalkRecord) => void;
}

const WalkHistoryList: React.FC<WalkHistoryListProps> = ({ onWalkSelect }) => {
  const [walks, setWalks] = useState<WalkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedWalkType, setSelectedWalkType] = useState<WalkType>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // 산책 기록 목록 로드
  const loadWalkHistory = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params: WalkListRequest = {
        page: page - 1, // 백엔드는 0-based pagination
        size: 10,
        walkType: selectedWalkType === 'ALL' ? undefined : selectedWalkType,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      const response = await getWalkList(params);
      
      if (response.data) {
        setWalks(response.data);
        // Mock API에서 제공하는 페이징 정보 사용
        setTotalPages((response as any).totalPages || 1);
      }
    } catch (err) {
      console.error('산책 기록 로드 실패:', err);
      setError('산책 기록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 산책 기록 삭제
  const handleDeleteWalk = async (walkId: number) => {
    if (!confirm('정말로 이 산책 기록을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteWalk(walkId);
      // 삭제 후 목록 새로고침
      loadWalkHistory(currentPage);
    } catch (err) {
      console.error('산책 기록 삭제 실패:', err);
      alert('산책 기록 삭제에 실패했습니다.');
    }
  };

  // 필터 적용
  const applyFilters = () => {
    setCurrentPage(1);
    loadWalkHistory(1);
  };

  // 필터 초기화
  const resetFilters = () => {
    setSelectedWalkType('ALL');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
    loadWalkHistory(1);
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadWalkHistory(page);
  };

  // 산책 유형별 아이콘 및 색상
  const getWalkTypeInfo = (walk: WalkRecord) => {
    const walkType = getWalkTypeFromRecord(walk);
    switch (walkType) {
      case 'PERSONAL':
        return { icon: '🚶‍♂️', label: '개인 산책', color: 'bg-blue-100 text-blue-800' };
      case 'REGISTERED_TRAIL':
        return { icon: '🗺️', label: '등록된 산책로', color: 'bg-green-100 text-green-800' };
      case 'UPLOADED_TRAIL':
        return { icon: '📤', label: '업로드된 산책로', color: 'bg-purple-100 text-purple-800' };
      default:
        return { icon: '❓', label: '알 수 없음', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // 초기 로드
  useEffect(() => {
    loadWalkHistory();
  }, []);

  if (loading && walks.length === 0) {
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

  return (
    <div className="space-y-6">
      {/* 필터 섹션 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">필터</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">산책 유형</label>
            <select
              value={selectedWalkType}
              onChange={(e) => {
                const value = e.target.value;
                if (isValidWalkType(value)) {
                  setSelectedWalkType(value);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">전체</option>
              <option value="PERSONAL">개인 산책</option>
              <option value="REGISTERED_TRAIL">등록된 산책로</option>
              <option value="UPLOADED_TRAIL">업로드된 산책로</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={applyFilters}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              적용
            </button>
            <button
              onClick={resetFilters}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 산책 기록 목록 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">산책 기록</h3>
        </div>
        
        {walks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">산책 기록이 없습니다.</p>
            <p className="text-sm text-gray-500 mt-1">새로운 산책을 시작해보세요!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {walks.map((walk) => {
              const walkTypeInfo = getWalkTypeInfo(walk);
              return (
                <div key={walk.walkId} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{walkTypeInfo.icon}</span>
                        <h4 className="text-lg font-semibold text-gray-900">{walk.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${walkTypeInfo.color}`}>
                          {walkTypeInfo.label}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">거리:</span> {formatDistance(walk.totalDistance)}
                        </div>
                        <div>
                          <span className="font-medium">시간:</span> {formatTime(walk.totalTime)}
                        </div>
                        <div>
                          <span className="font-medium">페이스:</span> {formatPace(walk.pace)}
                        </div>
                        <div>
                          <span className="font-medium">날짜:</span> {new Date(walk.eventTime).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => onWalkSelect?.(walk)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        상세보기
                      </button>
                      <button
                        onClick={() => handleDeleteWalk(walk.walkId)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 페이징 */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            이전
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 border rounded-md ${
                currentPage === page
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default WalkHistoryList; 
