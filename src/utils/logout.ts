import { Api } from '@/api/swagger-api';
import { useAuthStore } from '@/features/auth/authSlice';

/**
 * 로컬 인증 상태 정리
 */
const clearAuthState = () => {
  console.log('🧹 로컬 인증 상태 정리 중...');
  
  // localStorage 정리
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // Zustand store 정리
  const authStore = useAuthStore.getState();
  authStore.logout();
  
  console.log('✅ 로컬 인증 상태 정리 완료');
};

/**
 * 디바이스 ID 가져오기
 */
const getDeviceId = (): string => {
  // localStorage에서 deviceId 가져오기
  let deviceId = localStorage.getItem('deviceId');
  
  if (!deviceId) {
    // 없으면 새로 생성
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('deviceId', deviceId);
    console.log('📱 새로운 Device ID 생성:', deviceId);
  }
  
  return deviceId;
};

/**
 * 로그아웃 API 호출
 * @returns Promise<boolean> - 로그아웃 성공 여부
 */
export const logoutUser = async (): Promise<boolean> => {
  try {
    console.log('🚪 로그아웃 시작');

    const deviceId = getDeviceId();
    console.log('📱 Device ID:', deviceId);

    // API 인스턴스 생성 (쿠키 전송 설정 추가)
    const api = new Api({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      withCredentials: true, // HttpOnly 쿠키 전송을 위해 필요
    });

    // 로그아웃 API 호출 (deviceId 파라미터 포함)
    const response = await api.api.logout({
      deviceId: deviceId,
    });
    console.log('✅ 로그아웃 API 성공:', response.data);

    // 로컬 상태 정리
    clearAuthState();
    return true;

  } catch (error: any) {
    console.error('❌ 로그아웃 API 실패:', error);
    
    // 401 Unauthorized (인증 만료) 처리
    if (error.response?.status === 401) {
      console.log('🔐 인증이 만료되어 로컬에서 로그아웃 처리');
      clearAuthState();
      return true; // 로컬 정리는 성공으로 처리
    }
    
    // 400 Bad Request (잘못된 요청) 처리
    if (error.response?.status === 400) {
      console.log('⚠️ 잘못된 요청으로 로컬에서 로그아웃 처리');
      clearAuthState();
      return true; // 로컬 정리는 성공으로 처리
    }
    
    // 기타 오류는 로컬 상태만 정리
    console.log('⚠️ 서버 오류로 로컬에서만 로그아웃 처리');
    clearAuthState();
    return false;
  }
};

/**
 * 강제 로그아웃 (API 호출 없이 로컬 상태만 정리)
 */
export const forceLogout = (): void => {
  console.log('🚪 강제 로그아웃 실행');
  clearAuthState();
};
