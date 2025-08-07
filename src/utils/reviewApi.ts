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
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/trails/reviews/new`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      // 상태 코드별 에러 메시지
      switch (response.status) {
        case 400:
          throw new Error(errorData?.message || '유효하지 않은 요청입니다. (빈 내용, 평점 범위 초과 등)');
        case 401:
          throw new Error('로그인이 필요합니다.');
        case 403:
          throw new Error('리뷰 작성 권한이 없습니다. (이미 리뷰를 작성했거나 해당 이벤트 참여자가 아닙니다)');
        case 404:
          throw new Error('존재하지 않는 산책로입니다.');
        default:
          throw new Error(errorData?.message || '리뷰 작성에 실패했습니다.');
      }
    }

    const result = await response.json();
    
    // 응답 데이터 검증
    if (!result || typeof result.httpStatus !== 'number') {
      throw new Error('잘못된 응답 형식입니다.');
    }
    
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다.');
    }
    throw error;
  }
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
