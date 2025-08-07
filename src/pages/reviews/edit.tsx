import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateReview, deleteReview, getMyReview } from '../../utils/reviewApi';
import type { ReviewResponse } from '../../types/review';

const ReviewEditPage: React.FC = () => {
  const { reviewId, trailId } = useParams<{ reviewId: string; trailId: string }>();
  const navigate = useNavigate();
  
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myReview, setMyReview] = useState<ReviewResponse | null>(null);

  // 기존 리뷰 데이터 로드
  useEffect(() => {
    const loadReviewData = async () => {
      if (!reviewId || !trailId) {
        setError('리뷰 ID 또는 산책로 ID가 없습니다.');
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('📝 내 리뷰 데이터 로드 시작:', reviewId, trailId);
        const review = await getMyReview(Number(trailId));
        
        if (review && review.reviewId === Number(reviewId)) {
          setMyReview(review);
          setContent(review.content);
          setRating(review.rating);
          console.log('✅ 내 리뷰 데이터 로드 성공:', review.reviewId);
        } else {
          setError('해당 리뷰를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('❌ 리뷰 데이터 로드 실패:', error);
        setError(error instanceof Error ? error.message : '리뷰 데이터를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadReviewData();
  }, [reviewId, trailId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewId || !content.trim()) {
      setError('리뷰 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await updateReview(Number(reviewId), content.trim(), rating);
      
      if (response.httpStatus === 200) {
        console.log('✅ 리뷰 수정 성공');
        // 수정 완료 후 이전 페이지로 이동
        navigate(-1);
      } else {
        throw new Error(`API 응답 오류: ${response.message}`);
      }
    } catch (error) {
      console.error('❌ 리뷰 수정 실패:', error);
      setError(error instanceof Error ? error.message : '리뷰 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!reviewId) return;
    
    if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      
      const response = await deleteReview(Number(reviewId));
      
      if (response.httpStatus === 200) {
        console.log('✅ 리뷰 삭제 성공');
        // 삭제 완료 후 이전 페이지로 이동
        navigate(-1);
      } else {
        throw new Error(`API 응답 오류: ${response.message}`);
      }
    } catch (error) {
      console.error('❌ 리뷰 삭제 실패:', error);
      setError(error instanceof Error ? error.message : '리뷰 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && setRating(star)}
            className={`text-2xl transition-colors ${
              star <= currentRating ? 'text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-300 cursor-pointer' : ''}`}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">리뷰 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error && !myReview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-red-500 text-4xl mb-4">⚠️</span>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors mr-2"
            >
              뒤로 가기
            </button>
            {error.includes('리뷰가 없습니다') && (
              <button
                onClick={() => navigate(`/reviews/${trailId}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                리뷰 작성하기
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="뒤로 가기"
          >
            <span className="material-icons text-xl">arrow_back</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">리뷰 수정</h1>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
            aria-label="리뷰 삭제"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 별점 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              별점
            </label>
            <div className="flex items-center space-x-4">
              {renderStars(rating, true)}
              <span className="text-sm text-gray-600">{rating}점</span>
            </div>
          </div>

          {/* 리뷰 내용 */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              리뷰 내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="산책로에 대한 리뷰를 작성해주세요..."
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {content.length}/500자
              </span>
              {content.length > 0 && (
                <span className={`text-xs ${
                  content.length >= 500 ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {content.length >= 500 ? '최대 글자 수에 도달했습니다.' : ''}
                </span>
              )}
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '수정 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewEditPage; 
