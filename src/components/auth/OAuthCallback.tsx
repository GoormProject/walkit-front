/**
 * OAuth 콜백 처리 컴포넌트
 * OAuth 로그인 완료 후 콜백을 처리합니다.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isOAuthCallback, getOAuthError, getStateFromUrl } from '@/utils/oauth';
import { useAuthActions } from '@/features/auth/authSlice';
import { useToast } from '@/features/toast/toastSlice';
import { Api } from '@/api/swagger-api';

const OAuthCallback = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const navigate = useNavigate();
  const { oauthLoginSuccess } = useAuthActions();
  const { showToast } = useToast();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (import.meta.env.MODE !== 'production')
        console.log('🔄 OAuth 콜백 처리 시작');
      if (import.meta.env.MODE !== 'production')
        console.log('📍 현재 URL:', window.location.href);
      if (import.meta.env.MODE !== 'production')
        console.log('🔍 URL 파라미터:', window.location.search);

      if (!isOAuthCallback()) {
        if (import.meta.env.MODE !== 'production')
          console.log('❌ OAuth 콜백이 아님 - code 또는 error 파라미터 없음');
        setIsProcessing(false);
        return;
      }

      try {
        // OAuth 에러 확인
        const error = getOAuthError();
        if (error) {
          if (import.meta.env.MODE !== 'production')
            console.log('❌ OAuth 에러 발생');
          if (import.meta.env.MODE !== 'production')
            console.log('🚨 에러 내용:', error);
          showToast('error', `OAuth 로그인 실패: ${error}`);
          navigate('/login');
          return;
        }

        // state 파라미터 확인 (deviceId)
        const state = getStateFromUrl();
        if (import.meta.env.MODE !== 'production')
          console.log('📱 State 파라미터 확인');
        if (import.meta.env.MODE !== 'production')
          console.log('🔑 State 값:', state);
        if (!state) {
          if (import.meta.env.MODE !== 'production')
            console.log('❌ State 파라미터 없음 - 잘못된 OAuth 응답');
          showToast('error', '잘못된 OAuth 응답입니다.');
          navigate('/login');
          return;
        }

        // 사용자 정보 조회 (실제 API 호출)
        if (import.meta.env.MODE !== 'production')
          console.log('👤 사용자 정보 조회 시작');
        if (import.meta.env.MODE !== 'production')
          console.log('📡 백엔드 API 호출 중...');

        // API 인스턴스 생성 (쿠키 전송 설정 추가)
        const api = new Api({
          baseURL: import.meta.env.VITE_API_BASE_URL,
          withCredentials: true, // HttpOnly 쿠키 전송을 위해 필요
        });

        // 현재 사용자 정보 조회
        const response = await api.api.getCurrentUser();
        if (import.meta.env.MODE !== 'production')
          console.log('🔍 API 응답 전체:', response);
        if (import.meta.env.MODE !== 'production')
          console.log('📊 response.data:', response.data);
        if (import.meta.env.MODE !== 'production')
          console.log('📊 response.data.data:', response.data?.data);
        if (import.meta.env.MODE !== 'production')
          console.log('📊 response.status:', response.status);
        if (import.meta.env.MODE !== 'production')
          console.log('📊 response.headers:', response.headers);

        if (response.data?.data) {
          const userData = response.data.data;
          if (import.meta.env.MODE !== 'production')
            console.log('✅ 로그인 성공!');
          if (import.meta.env.MODE !== 'production')
            console.log('👤 사용자 정보:', userData);
          if (import.meta.env.MODE !== 'production')
            console.log('🔍 userData.memberId:', userData.memberId);
          if (import.meta.env.MODE !== 'production')
            console.log('🔍 userData.email:', userData.email);
          if (import.meta.env.MODE !== 'production')
            console.log('🔍 userData.isProfileSet:', userData.isProfileSet);
          if (import.meta.env.MODE !== 'production')
            console.log(
              '🔍 userData.isProfileSet 타입:',
              typeof userData.isProfileSet
            );

          // 필수 사용자 정보 검증
          if (!userData.memberId || !userData.email) {
            if (import.meta.env.MODE !== 'production')
              console.error('❌ 필수 사용자 정보 누락:', userData);
            throw new Error('사용자 정보가 불완전합니다.');
          }

          // Zustand store에 사용자 정보 저장
          if (import.meta.env.MODE !== 'production')
            console.log('🔄 oauthLoginSuccess 호출 시작');
          if (import.meta.env.MODE !== 'production')
            console.log('📊 전달할 데이터:', {
              memberId: userData.memberId,
              email: userData.email,
              isProfileSet: userData.isProfileSet ?? false,
            });

          oauthLoginSuccess({
            memberId: userData.memberId,
            email: userData.email,
            isProfileSet: userData.isProfileSet ?? false, // null/undefined일 때만 false
          });

          if (import.meta.env.MODE !== 'production')
            console.log('✅ oauthLoginSuccess 호출 완료');

          showToast('success', '로그인되었습니다!');

          // 프로필 설정 여부에 따라 리다이렉트
          if (import.meta.env.MODE !== 'production')
            console.log('🔄 리다이렉트 결정 중...');
          if (import.meta.env.MODE !== 'production')
            console.log('📊 isProfileSet 값:', userData.isProfileSet);
          if (import.meta.env.MODE !== 'production')
            console.log(
              '📊 isProfileSet === true:',
              userData.isProfileSet === true
            );
          if (import.meta.env.MODE !== 'production')
            console.log(
              '📊 isProfileSet === false:',
              userData.isProfileSet === false
            );

          if (userData.isProfileSet) {
            if (import.meta.env.MODE !== 'production')
              console.log('🏠 홈으로 리다이렉트');
            navigate('/');
          } else {
            if (import.meta.env.MODE !== 'production')
              console.log('✏️ 프로필 편집으로 리다이렉트');
            navigate('/profile/edit');
          }
        } else {
          if (import.meta.env.MODE !== 'production')
            console.log('❌ 사용자 정보 없음');
          showToast('error', '사용자 정보를 가져올 수 없습니다.');
          navigate('/login');
        }
      } catch (error) {
        if (import.meta.env.MODE !== 'production')
          console.error('❌ OAuth 콜백 처리 실패');
        if (import.meta.env.MODE !== 'production')
          console.error('🚨 에러 상세:', error);
        showToast('error', '로그인 처리 중 오류가 발생했습니다.');
        navigate('/login');
      } finally {
        if (import.meta.env.MODE !== 'production')
          console.log('🏁 OAuth 콜백 처리 완료');
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [navigate, oauthLoginSuccess, showToast]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">로그인 처리 중...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;
