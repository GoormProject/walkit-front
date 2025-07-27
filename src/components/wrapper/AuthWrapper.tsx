import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/authSlice';

interface AuthWrapperProps {
  children: ReactNode;
  requireAuth?: boolean;
  fallback?: ReactNode;
}

const AuthWrapper = ({
  children,
  requireAuth = true,
  fallback,
}: AuthWrapperProps) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  const navigate = useNavigate();

  // VITE_BYPASS_AUTH 환경변수 확인
  const isBypassEnabled = import.meta.env.VITE_BYPASS_AUTH === 'true';

  // VITE_TEST_JWT 환경변수 확인
  const isTestJwtEnabled = import.meta.env.VITE_TEST_JWT === 'true';

  // 인증이 필요한데 인증되지 않은 경우 자동 리다이렉트 (우회 모드 또는 테스트 JWT 모드 제외)
  useEffect(() => {
    if (
      requireAuth &&
      !isAuthenticated &&
      !isLoading &&
      !isBypassEnabled &&
      !isTestJwtEnabled &&
      !fallback
    ) {
      navigate('/login', { replace: true });
    }
  }, [
    requireAuth,
    isAuthenticated,
    isLoading,
    isBypassEnabled,
    isTestJwtEnabled,
    fallback,
    navigate,
  ]);

  // 로딩 중이면 로딩 표시
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 우회 모드 또는 테스트 JWT 모드가 활성화되어 있으면 항상 통과
  if (isBypassEnabled || isTestJwtEnabled) {
    return <>{children}</>;
  }

  // 인증이 필요한데 인증되지 않은 경우
  if (requireAuth && !isAuthenticated) {
    // fallback이 제공되면 fallback 표시, 아니면 로딩 메시지
    if (fallback) {
      return <>{fallback}</>;
    } else {
      return <div>로그인 페이지로 이동 중...</div>;
    }
  }

  // 인증이 필요하지 않거나 인증된 경우
  return <>{children}</>;
};

export default AuthWrapper;
