/**
 * OAuth 콜백 처리 컴포넌트
 * OAuth 로그인 완료 후 콜백을 처리합니다.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isOAuthCallback, getOAuthError, getStateFromUrl } from '@/utils/oauth';
import { useAuthActions } from '@/features/auth/authSlice';
import { useToast } from '@/features/toast/toastSlice';

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

        // OAuth 성공 - 바로 홈으로 리다이렉트 (실제 API 호출은 AuthWrapper에서 수행)
        console.log('🔄 OAuth 성공 - 홈으로 리다이렉트');
        showToast('success', '로그인되었습니다!');
        navigate('/');
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
