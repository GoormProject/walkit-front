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

/**
 * 특정 산책로에 대한 내 리뷰 작성 여부 확인 API
 */
export const checkMyReview = async (trailId: number): Promise<boolean> => {
  console.log('🔍 내 리뷰 작성 여부 확인 API 호출');
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/my/${trailId}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.data !== null; // 리뷰가 있으면 true, 없으면 false
    }
    
    return false; // API 오류 시 리뷰가 없다고 가정
  } catch (error) {
    console.error('리뷰 확인 오류:', error);
    return false;
  }
}; 
