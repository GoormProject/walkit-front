import { Link } from 'react-router-dom';
import { GoogleLoginButton, KakaoLoginButton } from '@/components/ui';
import { startOAuthLogin } from '@/utils/oauth';
import { useAuth } from '@/features/auth/authSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
<<<<<<< HEAD
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">로그인</h1>
      <p className="text-lg mb-4">Walkit에 로그인해보세요!</p>
      <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
        홈으로 돌아가기
      </Link>
      <br></br>
      <Link
        to="/signup"
        className="text-blue-600 hover:text-blue-800 underline mb-6 block"
      >
        회원가입 하러가기
      </Link>
      <div style={{ gap: '2rem' }} className="flex flex-col items-center">
        <GoogleLoginButton />
        <KakaoLoginButton />
=======
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // 이미 로그인된 경우 홈으로 리다이렉트
  useEffect(() => {
    console.log('🔐 Login 페이지 - 인증 상태 확인');
    console.log('👤 isAuthenticated:', isAuthenticated);
    console.log('⏳ isLoading:', isLoading);
    console.log('📍 현재 URL:', window.location.href);

    if (isAuthenticated && !isLoading) {
      console.log('✅ 이미 로그인됨 - 홈으로 리다이렉트');
      navigate('/');
    } else if (!isLoading) {
      console.log('❌ 로그인되지 않음 - 로그인 페이지 표시');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleGoogleLogin = () => {
    console.log('🔘 Google 로그인 버튼 클릭됨');
    console.log('🕐 클릭 시간:', new Date().toISOString());
    startOAuthLogin('google');
  };

  const handleKakaoLogin = () => {
    console.log('🔘 Kakao 로그인 버튼 클릭됨');
    console.log('🕐 클릭 시간:', new Date().toISOString());
    startOAuthLogin('kakao');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-md">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">로그인</h1>
        <p className="text-lg mb-8 text-gray-600">Walkit에 로그인해보세요!</p>

        <div className="flex flex-col items-center">
          <GoogleLoginButton
            onClick={handleGoogleLogin}
            className="w-full mb-8"
          />
          <KakaoLoginButton onClick={handleKakaoLogin} className="w-full" />
        </div>

        <div className="space-y-2">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 underline block"
          >
            홈으로 돌아가기
          </Link>
        </div>
>>>>>>> feature/24-bottomsheet
      </div>
    </div>
  );
};

export default Login;
