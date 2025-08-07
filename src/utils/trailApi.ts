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
  
  // FormData인 경우 Content-Type 헤더를 제거 (브라우저가 자동으로 설정)
  const headers = request instanceof FormData 
    ? { 'Accept': 'application/json' }
    : getHeaders();
  
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/trails/new`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: request instanceof FormData ? request : JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`산책로 등록 실패: ${response.status}`);
  }

  return response.json();
};

/**
 * 주소 변환 함수 (카카오 API 사용)
 */
export const getAddressFromCoordinates = async (lng: number, lat: number): Promise<string> => {
  try {
    // 카카오 API를 사용하여 좌표를 주소로 변환
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
      {
        headers: {
          'Authorization': `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('주소 변환 실패');
    }

    const data = await response.json();
    if (data.documents && data.documents.length > 0) {
      const address = data.documents[0].address;
      return `${address.region_1depth_name} ${address.region_2depth_name} ${address.region_3depth_name}`;
    }

    return '주소를 찾을 수 없습니다.';
  } catch (error) {
    console.error('주소 변환 오류:', error);
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
