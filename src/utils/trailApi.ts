import type { TrailRegisterRequest, TrailRegisterApiResponse } from '../types/trail';

const getHeaders = () => {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
};

/**
 * 산책로 등록 API
 */
export const registerTrail = async (request: TrailRegisterRequest | FormData): Promise<TrailRegisterApiResponse> => {
  console.log('🏔️ 산책로 등록 API 호출');
  
  const headers = request instanceof FormData 
    ? { 'Accept': 'application/json' }
    : getHeaders();
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/trails/new`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: request instanceof FormData ? request : JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || '산책로 등록에 실패했습니다.');
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
 * 주소 변환 함수 (카카오 API 사용)
 */
export const getAddressFromCoordinates = async (lng: number, lat: number): Promise<string> => {
  try {
    // 백엔드를 통해 주소 변환을 요청하도록 변경
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/utils/address?lng=${lng}&lat=${lat}`,
      {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
        signal: AbortSignal.timeout(5000), // 5초 타임아웃
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || '주소 변환에 실패했습니다.');
    }

    const data = await response.json();
    return data.address || '주소를 찾을 수 없습니다.';

  } catch (error) {
    console.error('주소 변환 오류:', error);
    if (error instanceof Error && error.name === 'TimeoutError') {
      return '주소 변환 시간이 초과되었습니다.';
    }
    return '주소를 찾을 수 없습니다.';
  }
};

/**
 * 산책로 소유자 확인 API (내가 만든 산책로인지 확인)
 */
export const checkTrailOwnership = async (trailId: number): Promise<boolean> => {
  console.log('👤 산책로 소유자 확인 API 호출');
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/trails/${trailId}/ownership`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.data === true; // 내가 만든 산책로면 true
    }
    
    return false; // API 오류 시 내가 만든 것이 아니라고 가정
  } catch (error) {
    console.error('산책로 소유자 확인 오류:', error);
    return false;
  }
}; 
