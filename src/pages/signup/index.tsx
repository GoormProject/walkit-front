import { Link } from 'react-router-dom';
import { GoogleSignupButton, KakaoSignupButton } from '@/components/ui';
import { startOAuthLogin } from '@/utils/oauth';
import { useAuth } from '@/features/auth/authSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // 이미 로그인된 경우 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleGoogleSignup = () => {
    startOAuthLogin('google');
  };

  const handleKakaoSignup = () => {
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
        <h1 className="text-4xl font-bold mb-6">회원가입</h1>
        <p className="text-lg mb-8 text-gray-600">Walkit에 가입해보세요!</p>

        <div className="mb-8">
          <GoogleSignupButton
            onClick={handleGoogleSignup}
            className="w-full mb-8"
          />
          <KakaoSignupButton onClick={handleKakaoSignup} className="w-full" />
        </div>

        <div className="space-y-2">
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 underline block"
          >
            로그인 하러가기
          </Link>

          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 underline block"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
