/**
 * OAuth 로그인 유틸리티
 * Google, Kakao OAuth2 로그인을 처리합니다.
 */

import { useAuthStore } from '@/features/auth/authSlice';

/**
 * OAuth 제공자 타입
 */
export type OAuthProvider = 'google' | 'kakao';

/**
 * OAuth 로그인 URL을 생성합니다.
 */
export const getOAuthLoginUrl = (provider: OAuthProvider): string => {
  console.log('🔧 OAuth URL 생성 시작');

  const currentState = useAuthStore.getState();
  console.log('📊 현재 store 상태:', currentState);

  const deviceId = currentState.user.deviceId;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  console.log('📱 Device ID:', deviceId);
  console.log('🌐 Base URL:', baseUrl);
  console.log('🔌 Provider:', provider);

  // deviceId가 없으면 임시로 생성 (로그인 성공 시에만 영구 저장)
  const tempDeviceId = deviceId || crypto.randomUUID();
  console.log('📱 사용할 Device ID (임시):', tempDeviceId);

  if (!baseUrl) {
    throw new Error(
      'VITE_API_BASE_URL 환경 변수가 설정되지 않았습니다. .env 파일에 VITE_API_BASE_URL을 추가해주세요.'
    );
  }

  let loginUrl: string;
  switch (provider) {
    case 'google':
      loginUrl = `${baseUrl}/oauth2/authorization/google?state=${tempDeviceId}`;
      break;
    case 'kakao':
      loginUrl = `${baseUrl}/oauth2/authorization/kakao?state=${tempDeviceId}`;
      break;
    default:
      throw new Error(`지원하지 않는 OAuth 제공자입니다: ${provider}`);
  }

  console.log('🔗 생성된 OAuth URL:', loginUrl);
  return loginUrl;
};

/**
 * OAuth 로그인을 시작합니다.
 */
export const startOAuthLogin = (provider: OAuthProvider): void => {
  console.log('🚀 OAuth 로그인 프로세스 시작');
  console.log('🔌 선택된 Provider:', provider);

  try {
    const loginUrl = getOAuthLoginUrl(provider);
    console.log('✅ OAuth URL 생성 완료');
    console.log('🔄 브라우저 리다이렉트 시작...');
    console.log('📍 리다이렉트 URL:', loginUrl);

    window.location.assign(loginUrl);
  } catch (error) {
    console.error('❌ OAuth 로그인 시작 실패:', error);
    throw error;
  }
};

/**
 * URL에서 state 파라미터를 추출합니다.
 */
export const getStateFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('state');
};

/**
 * OAuth 콜백 처리를 확인합니다.
 */
export const isOAuthCallback = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('code') || urlParams.has('error');
};

/**
 * OAuth 에러를 확인합니다.
 */
export const getOAuthError = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('error');
};
