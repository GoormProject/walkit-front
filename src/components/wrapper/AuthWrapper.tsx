import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useAuthActions } from '@/features/auth/authSlice';

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
  const { isAuthenticated, isLoading } = useAuth();
  const { validateToken } = useAuthActions();
  const navigate = useNavigate();

  // 로그인 상태 디버깅
  console.log('🔐 AuthWrapper 상태:', {
    isAuthenticated,
    isLoading,
    requireAuth,
    hasFallback: !!fallback,
  });

  // 인증이 필요한데 인증되지 않은 경우에만 자동 리다이렉트
  useEffect(() => {
    // 로딩 중이면 리다이렉트하지 않음
    if (isLoading) {
      return;
    }

    // 인증되지 않은 경우 토큰 검증 시도
    if (!isAuthenticated && requireAuth) {
      console.log('🔍 토큰 검증 시도...');
      validateToken().then(isValid => {
        if (!isValid) {
          console.log('❌ 토큰 검증 실패 - 로그인 페이지로 리다이렉트');
          navigate('/login', { replace: true });
        } else {
          console.log('✅ 토큰 검증 성공 - 인증된 사용자');
        }
      });
    }
  }, [
    requireAuth,
    isAuthenticated,
    isLoading,
    fallback,
    validateToken,
    navigate,
  ]);

  // 로딩 중이면 로딩 표시
  if (isLoading) {
    return <div>Loading...</div>;
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
