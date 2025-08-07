import React, { useState } from 'react';
import TrailReviewsList from '../../components/TrailReviewsList';

const TrailReviewsTest: React.FC = () => {
  const [showReviews, setShowReviews] = useState(false);
  const [trailId, setTrailId] = useState(1);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">산책로 리뷰 테스트</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            산책로 ID
          </label>
          <input
            type="number"
            value={trailId}
            onChange={(e) => setTrailId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
        </div>
        
        <button
          onClick={() => setShowReviews(true)}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          리뷰 목록 보기
        </button>
        
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">테스트 방법:</h3>
          <ol className="text-sm text-gray-700 space-y-1">
            <li>1. 산책로 ID를 입력하세요 (기본값: 1)</li>
            <li>2. "리뷰 목록 보기" 버튼을 클릭하세요</li>
            <li>3. 하단에서 리뷰 목록이 표시됩니다</li>
            <li>4. 리뷰가 없는 경우 빈 상태가 표시됩니다</li>
          </ol>
        </div>
      </div>
      
      {showReviews && (
        <TrailReviewsList
          trailId={trailId}
          onClose={() => setShowReviews(false)}
        />
      )}
    </div>
  );
};

export default TrailReviewsTest; 
