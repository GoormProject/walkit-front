import React, { useEffect, useState } from 'react';
import { getTrailReviews } from '../utils/reviewApi';
import type { ReviewListResponse, ReviewResponse } from '../types/review';

interface TrailReviewsListProps {
  trailId: number;
  onClose: () => void;
}

const TrailReviewsList: React.FC<TrailReviewsListProps> = ({ trailId, onClose }) => {
  const [reviewsData, setReviewsData] = useState<ReviewListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('📋 산책로 리뷰 목록 조회 시작:', trailId);
        const response = await getTrailReviews(trailId);
        
        if (response.httpStatus === 200 && response.data) {
          setReviewsData(response.data);
          console.log('✅ 산책로 리뷰 목록 조회 성공:', response.data.reviews.length);
        } else {
          throw new Error(`API 응답 오류: ${response.message}`);
        }
      } catch (error) {
        console.error('❌ 산책로 리뷰 목록 조회 실패:', error);
        setError(error instanceof Error ? error.message : '리뷰 목록을 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [trailId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <span className="text-yellow-400 text-sm">
        {'★'.repeat(Math.floor(rating))}
        {rating % 1 >= 0.5 ? '☆' : ''}
        {'☆'.repeat(5 - Math.ceil(rating))}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
        <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">리뷰 목록</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="닫기"
            >
              <span className="material-icons text-xl">close</span>
            </button>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
            <span className="text-gray-600">리뷰를 불러오는 중...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
        <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">리뷰 목록</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="닫기"
            >
              <span className="material-icons text-xl">close</span>
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <span className="text-red-500 mb-2">⚠️</span>
            <p className="text-gray-600 text-center px-4">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">리뷰 목록</h2>
            {reviewsData && (
              <div className="flex items-center mt-1">
                {renderStars(reviewsData.rating)}
                <span className="text-sm text-gray-600 ml-1">
                  {reviewsData.rating} ({reviewsData.reviews.length}개)
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="닫기"
          >
            <span className="material-icons text-xl">close</span>
          </button>
        </div>

        {/* 리뷰 목록 */}
        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          {reviewsData && reviewsData.reviews.length > 0 ? (
            <div className="p-4 space-y-4">
              {reviewsData.reviews.map((review) => (
                <div key={review.reviewId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600 ml-2">
                        {review.rating}점
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {review.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="text-gray-400 text-4xl mb-2">📝</span>
              <p className="text-gray-600 text-center">아직 작성된 리뷰가 없습니다.</p>
              <p className="text-gray-500 text-sm text-center mt-1">
                첫 번째 리뷰를 작성해보세요!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailReviewsList; 
