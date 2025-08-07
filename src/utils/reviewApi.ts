import type { ReviewCreateRequest, ReviewApiResponse } from '../types/review';

const getHeaders = () => {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
};

/**
 * 리뷰 작성 API
 */
export const createReview = async (request: ReviewCreateRequest): Promise<ReviewApiResponse> => {
  console.log('📝 리뷰 작성 API 호출');
  
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`리뷰 작성 실패: ${response.status}`);
  }

  return response.json();
}; 
