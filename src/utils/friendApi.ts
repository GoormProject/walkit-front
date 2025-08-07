import type { FriendsLocationResponse, FriendLocationError } from '@/types/friend';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const getFriendsLocation = async (): Promise<FriendsLocationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/friends/location`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // 쿠키 포함
    });

    if (!response.ok) {
      const errorData: FriendLocationError = await response.json();
      
      switch (response.status) {
        case 400:
          throw new Error(`잘못된 요청: ${errorData.message}`);
        case 401:
          throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
        case 403:
          throw new Error('친구 관계가 아닙니다.');
        case 404:
          throw new Error('사용자 정보를 찾을 수 없습니다.');
        case 500:
          throw new Error('서버 오류가 발생했습니다.');
        default:
          throw new Error(`오류가 발생했습니다: ${response.status}`);
      }
    }

    const data: FriendsLocationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('친구 위치 조회 실패:', error);
    throw error;
  }
}; 
