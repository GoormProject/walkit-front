import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WalkHistoryList from '@/components/WalkHistoryList';
import WalkHistoryDetail from '@/components/WalkHistoryDetail';
import type { WalkRecord } from '@/types/walk';

const WalkHistoryPage: React.FC = () => {
  const [selectedWalk, setSelectedWalk] = useState<WalkRecord | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleWalkSelect = (walk: WalkRecord) => {
    setSelectedWalk(walk);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedWalk(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">내 산책 기록</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 산책 기록 목록 */}
          <div className="lg:col-span-2">
            <WalkHistoryList onWalkSelect={handleWalkSelect} />
          </div>

          {/* 상세 정보 사이드바 */}
          <div className="lg:col-span-1">
            {showDetail && selectedWalk ? (
              <div className="sticky top-8">
                <WalkHistoryDetail
                  walkId={selectedWalk.walkId}
                  onClose={handleCloseDetail}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">상세 정보</h3>
                <p className="text-gray-600 text-sm">
                  왼쪽에서 산책 기록을 선택하면 상세 정보를 확인할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkHistoryPage; 
