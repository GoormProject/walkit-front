import { Api } from '@/api/swagger-api';
import { useAuthStore } from '@/features/auth/authSlice';

/**
 * 로그아웃 API 호출
 * @returns Promise<boolean> - 로그아웃 성공 여부
 */
export const logoutUser = async (): Promise<boolean> => {
  try {
    console.log('🚪 로그아웃 시작');

    // deviceId 가져오기 (Zustand store에서)
    const currentState = useAuthStore.getState();
    console.log('📊 현재 store 상태:', currentState);

    const deviceId = currentState.user.deviceId;
    console.log('📱 Device ID:', deviceId);

    if (!deviceId) {
      console.error('❌ Device ID가 없습니다.');
      return false;
    }

    // API 인스턴스 생성 (쿠키 전송 설정 추가)
    const api = new Api({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      withCredentials: true, // HttpOnly 쿠키 전송을 위해 필요
    });

    // 로그아웃 API 호출 (deviceId 파라미터 포함)
    const response = await api.api.logout({
      deviceId: deviceId,
    });
    console.log('✅ 로그아웃 성공:', response.data);

    return true;
  } catch (error) {
    console.error('❌ 로그아웃 실패:', error);
    return false;
  }
};
