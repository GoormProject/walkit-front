import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createReview } from '../../utils/reviewApi';
import type { ReviewCreateRequest } from '../../types/review';

const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { trailId } = useParams<{ trailId: string }>();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 리뷰 제출 처리
  const handleSubmit = async () => {
    if (!trailId || !content.trim()) {
      setError('리뷰 내용을 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const request: ReviewCreateRequest = {
        trailId: parseInt(trailId, 10),
        content: content.trim(),
        rating,
      };

      const response = await createReview(request);
      
      if (response.httpStatus === 200) {
        alert('리뷰가 성공적으로 작성되었습니다!');
        navigate('/walk-history');
      } else {
        setError(response.message || '리뷰 작성에 실패했습니다.');
      }
    } catch (err) {
      console.error('리뷰 작성 실패:', err);
      setError('리뷰 작성 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 mr-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">리뷰 남기기</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 평점 선택 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">평점</h3>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {rating}점 - {rating === 5 ? '매우 좋음' : rating === 4 ? '좋음' : rating === 3 ? '보통' : rating === 2 ? '나쁨' : '매우 나쁨'}
          </p>
        </div>

        {/* 리뷰 내용 입력 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">리뷰 내용</h3>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="이 산책로에 대한 리뷰를 남겨주세요."
            className="w-full h-32 resize-none border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={500}
          />
          <div className="flex justify-end mt-2">
            <span className="text-xs text-gray-500">{content.length}/500</span>
          </div>
        </div>

        {/* 오류 메시지 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !content.trim()}
          className="w-full bg-purple-500 text-white py-4 rounded-lg font-medium hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? '작성 중...' : '리뷰 작성하기'}
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;
